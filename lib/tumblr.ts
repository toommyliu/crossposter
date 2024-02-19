"use server";

import { createClient } from "tumblr.js";
import type { NpfPostParams } from "tumblr.js/types/types";
import { parseConfig } from "./utils";
import { Post } from "./stores/store";

export async function getUserInfo(tumblrCfg: Required<TumblrCfg>) {
	const auth = parseConfig(tumblrCfg);
	const client = await createClient(auth);

	return client.userInfo()?.catch(() => null) as Promise<TumblrUser | null>;
}

export async function createPost(blog: string, post: Post, tumblrCfg: TumblrCfg) {
	const client = await createClient({
		consumer_key: tumblrCfg.consumerKey as string,
		consumer_secret: tumblrCfg.consumerSecret as string,
		token: tumblrCfg.token as string,
		token_secret: tumblrCfg.tokenSecret as string,
	});

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