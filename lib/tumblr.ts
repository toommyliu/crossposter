"use server";

import { createClient } from "tumblr.js";
import type { NpfPostParams } from "tumblr.js/types/types";
import { Post } from "./stores/store";
import { parseConfig } from "./utils";

export async function getUserInfo(tumblrCfg: Required<TumblrCfg>) {
	const auth = parseConfig(tumblrCfg);
	const client = await createClient(auth);

	return client.userInfo()?.catch(() => null) as Promise<TumblrUser | null>;
}

export async function createPost(blog: string, post: Post, tumblrCfg: TumblrCfg) {
	const auth = parseConfig(tumblrCfg);
	const client = await createClient(auth);

	console.log(`${blog}: ${post.url}`);

	const params: NpfPostParams = {
		content: [
			{
				type: "image",
				media: {
					url: post.url,
				},
			},
			{
				type: "text",
				text: post.title || "",
			},
		],
		state: "private",
	} satisfies NpfPostParams;

	return client.createPost(blog, params);
}

export type TumblrCfg = {
	consumerKey: string | null;
	consumerSecret: string | null;
	token: string | null;
	tokenSecret: string | null;
};

export type TumblrUser = {
	user: {
		name: string;
		likes: number;
		following: number;
		blogs: {
			name: string;
			title: string;
		}[];
	};
};