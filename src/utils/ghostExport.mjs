import { promises as fs } from 'fs';

// Simple function to generate a random ID
function generateId(length = 24) {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function exportToGhost(posts) {
  const ghostPosts = posts.map((post) => ({
    id: generateId(24),
    uuid: generateId(32),
    title: post.title,
    slug: post.slug,
    mobiledoc: JSON.stringify({
      version: "0.3.1",
      atoms: [],
      cards: [],
      markups: [],
      sections: [[1, "p", [[0, [], 0, post.content]]]],
      ghostVersion: "4.0"
    }),
    lexical: null,
    html: post.html || '',
    comment_id: generateId(24),
    plaintext: post.content,
    feature_image: post.featuredImage || null,
    featured: false,
    type: "post",
    status: post.draft === 'true' || post.draft === true ? 'draft' : 'published',
    locale: null,
    visibility: "public",
    email_recipient_filter: "all",
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
    published_at: post.publishedAt ? post.publishedAt.toISOString() : null,
    custom_excerpt: post.excerpt || null,
    codeinjection_head: null,
    codeinjection_foot: null,
    custom_template: null,
    canonical_url: null,
    newsletter_id: null,
    show_title_and_feature_image: 1
  }));

  // Read the existing Ghost export file
  const existingData = JSON.parse(await fs.readFile('.astro/Build and Beyond Dec 8 2024.json', 'utf-8'));
  
  // Add our new posts to the existing posts array
  existingData.db[0].data.posts = [
    ...existingData.db[0].data.posts,
    ...ghostPosts
  ];

  // Write the combined data back to the file
  await fs.writeFile(
    '.astro/Build and Beyond Dec 8 2024.json',
    JSON.stringify(existingData, null, 2)
  );
} 