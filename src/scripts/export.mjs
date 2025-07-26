import { promises as fs } from 'fs';
import { join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { exportToGhost } from '../utils/ghostExport.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseDate(dateStr) {
  if (!dateStr) return new Date();
  
  // Try parsing different date formats
  const date = new Date(dateStr);
  if (!isNaN(date)) return date;
  
  // Try parsing format like "21 November 2024"
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const newDate = new Date(`${parts[1]} ${parts[0]}, ${parts[2]}`);
    if (!isNaN(newDate)) return newDate;
  }
  
  return new Date();
}

async function readMDFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Parse frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }

  const [, frontmatterStr, markdown] = frontmatterMatch;
  const frontmatter = {};
  frontmatterStr.split('\n').forEach(line => {
    const [key, ...values] = line.split(':').map(s => s.trim());
    if (key && values.length) {
      // Remove quotes from the value
      const value = values.join(':').replace(/^['"]|['"]$/g, '');
      frontmatter[key] = value;
    }
  });

  // Parse tags if they're in array format [tag1, tag2]
  if (frontmatter.tags && frontmatter.tags.startsWith('[') && frontmatter.tags.endsWith(']')) {
    frontmatter.tags = frontmatter.tags
      .slice(1, -1)
      .split(',')
      .map(tag => tag.trim());
  }

  return {
    ...frontmatter,
    content: markdown.trim(),
  };
}

async function getContentFromDirectory(dirPath, contentType) {
  const files = await fs.readdir(dirPath);
  
  return Promise.all(
    files
      .filter(file => /\.mdx?$/i.test(file))
      .map(async (file) => {
        const filePath = join(dirPath, file);
        const post = await readMDFile(filePath);
        
        // Get base tags from the post
        let baseTags = [];
        if (Array.isArray(post.tags)) {
          baseTags = post.tags;
        } else if (typeof post.tags === 'string') {
          baseTags = post.tags.split(',').map(t => t.trim());
        }
        
        // Add the content type as a tag if it's not already included
        const tags = [...new Set([...baseTags, contentType])];
        
        // Use either publishDate or pubDate
        const publishDate = post.publishDate || post.pubDate;
        const updatedDate = post.updatedDate || post.updateDate || publishDate;
        
        return {
          content: post.content,
          createdAt: parseDate(publishDate),
          excerpt: post.description || post.excerpt || null,
          featuredImage: post.heroImage || post.image || null,
          html: post.content,
          publishedAt: parseDate(publishDate),
          slug: file.replace(/\.mdx?$/i, ''),
          status: post.draft === 'true' || post.draft === true ? 'draft' : 'published',
          tags,
          title: post.title || 'Untitled',
          updatedAt: parseDate(updatedDate),
        };
      })
  );
}

const runExport = async () => {
  const postsDir = join(__dirname, '..', 'content', 'post');
  const projectsDir = join(__dirname, '..', 'content', 'project');
  
  // Get both posts and projects
  const [posts, projects] = await Promise.all([
    getContentFromDirectory(postsDir, 'post'),
    getContentFromDirectory(projectsDir, 'project')
  ]);
  
  // Combine all content
  const allContent = [...posts, ...projects];

  try {
    await exportToGhost(allContent);
    console.log('Export completed successfully! Check ghost-export.json');
    console.log(`Exported ${allContent.length} items (${posts.length} posts, ${projects.length} projects)`);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

// Handle the promise rejection
runExport().catch((error) => {
  console.error('Unhandled error:', error);
}); 