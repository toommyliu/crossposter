"use server";

import { createClient } from "tumblr.js";
import { NpfPostParams } from "tumblr.js/types/types";

export async function createPost(
	blog: string,
	post: {
		url: string;
		title?: string;
	},
	tumblrCfg: TumblrCfg
) {
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

export async function getUserInfo(
	consumerKey: string,
	consumerSecret: string,
	token: string,
	tokenSecret: string
): Promise<TumblrUser | null> {
	const client = await createClient({
		consumer_key: consumerKey,
		consumer_secret: consumerSecret,
		token: token,
		token_secret: tokenSecret,
	});

	const res: Promise<TumblrUser | null> = await client
		.userInfo()
		?.catch(() => null);
	return res;
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