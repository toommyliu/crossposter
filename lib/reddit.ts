"use client";

import type { Post } from "./stores/store";

export async function makeRequest(username: string) {
	const posts: Post[] = [];

	const url = `https://www.reddit.com/user/${username}.json`;

	const request = async (url: string, after?: string) => {
		const reqUrl = new URL(url);

		if (after) {
			reqUrl.searchParams.append("after", after);
		}

		reqUrl.searchParams.append("raw_json", "1");

		console.log(`making request to: ${reqUrl.toString()}`);

		await new Promise((resolve) => setTimeout(resolve, 7_500));

		const json: JSONResponse = await fetch(reqUrl.toString())
			.then((res) => res.json())
			.catch(() => null);

		if (json?.data?.children?.length > 0) {
			json.data.children.forEach((post) => {
				// TODO: add mp4s?
				if (post.data.post_hint === "image") {
					posts.push({
						url: post.data.url,
						title: post.data.title,
						download: true,
						done: false,
						createdAt: post.data.created_utc
					});
				}
			});

			if (json?.data?.after) {
				await request(url, json.data.after);
			}
		}
	};

	await request(url);
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
