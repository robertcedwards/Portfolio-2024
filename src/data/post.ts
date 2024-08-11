import { siteConfig } from "@/site-config";
import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft posts based on the environment */
export async function getAllPosts() {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** returns the date of the post based on option in siteConfig.sortPostsByUpdatedDate */
export function getPostSortDate(post: CollectionEntry<"post">) {
	return siteConfig.sortPostsByUpdatedDate && post.data.updatedDate !== undefined
		? new Date(post.data.updatedDate)
		: new Date(post.data.publishDate);
}

/** sort post by date (by siteConfig.sortPostsByUpdatedDate), desc.*/
export function sortMDByDate(posts: CollectionEntry<"post">[]) {
	return posts.sort((a, b) => {
		const aDate = getPostSortDate(a).valueOf();
		const bDate = getPostSortDate(b).valueOf();
		return bDate - aDate;
	});
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return posts.reduce<Record<string, CollectionEntry<"post">[]>>((acc, post) => {
		const year = getPostSortDate(post).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(post);
		return acc;
	}, {});
}

/** returns all tags created from posts (inc duplicate tags)
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getAllTags(posts: CollectionEntry<"post">[]) {
	return posts.flatMap((post) => [...post.data.tags]);
}

/** returns all unique tags created from posts
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTags(posts: CollectionEntry<"post">[]) {
	return [...new Set(getAllTags(posts))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 *  */
export function getUniqueTagsWithCount(posts: CollectionEntry<"post">[]): [string, number][] {
	return [
		...getAllTags(posts).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}

export async function getAllProjects() {
	return await getCollection("project", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

export function getProjectSortDate(project: CollectionEntry<"project">) {
	const data = project.data as { publishDate: Date | number | string; updatedDate?: Date | number | string };
	const updatedDate = data.updatedDate;
	const publishDate = data.publishDate;
	return siteConfig.sortPostsByUpdatedDate && updatedDate !== undefined
		? new Date(updatedDate)
		: new Date(publishDate);
}

export function sortProjectsByDate(projects: CollectionEntry<"project">[]) {
	return projects.sort((a, b) => {
		const aDate = getProjectSortDate(a).valueOf();
		const bDate = getProjectSortDate(b).valueOf();
		return bDate - aDate;
	});
}

export function groupProjectsByYear(projects: CollectionEntry<"project">[]) {
	return projects.reduce<Record<string, CollectionEntry<"project">[]>>((acc, project) => {
		const year = getProjectSortDate(project).getFullYear();
		if (!acc[year]) {
			acc[year] = [];
		}
		acc[year].push(project);
		return acc;
	}, {});
}

export function getAllProjectTags(projects: CollectionEntry<"project">[]): string[] {
	return projects.flatMap((project) => project.data.tags as string[]);
}

export function getUniqueProjectTags(projects: CollectionEntry<"project">[]): string[] {
	return [...new Set<string>(getAllProjectTags(projects))];
}

export function getUniqueProjectTagsWithCount(projects: CollectionEntry<"project">[]): [string, number][] {
	return Array.from(
		getAllProjectTags(projects).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		)
	).sort((a, b) => b[1] - a[1]);
}