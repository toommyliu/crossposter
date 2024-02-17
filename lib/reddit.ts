"use server";

import type { Post } from "./stores/store";

export async function makeRequest(username: string) {
	// array of media
	const posts: Post[] = [];

	let url = `https://reddit.com/u/${username}.json`;

	const request = async (url: string, after?: string) => {
		console.log(
			`making request to: ${url}${after ? `?after=${after}` : ""}`
		);

		await new Promise((resolve) => setTimeout(resolve, 7_500));

		const json: JSONResponse = await fetch(`${url}?after=${after}`)
			.then((res) => res.json())
			.catch(() => null);

		if (json?.data?.children?.length > 0) {
			json.data.children.forEach((post) => {
				// TODO: add mp4s?
				if (post.data.post_hint === "image") {
					posts.push({ url: post.data.url, download: true });
				}
			});

			if (json?.data?.after) {
				await request(url, json.data.after);
			}
		}
	};

	await request(url);

	console.log("done querying!");

	return posts;
}

type JSONResponse = {
	kind: string;
	data: {
		after: string | null; // if there are more posts
		dist: number; // post count?
		children: {
			kind: string;
			data: {
				subreddit: string;
				subreddit_name_prefixed: string;
				title: string;
				post_hint: string;
				created: number;
				created_utc: number;
				author: string;
				permalink: string; // /r/subreddit/...
				url: string; // url to the image
				ups: number;
			};
		}[];
		before: string | null;
	};
};
