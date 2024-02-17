"use server";

import { createClient as createTumblrClient } from "tumblr.js";

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

export async function createClient(
	consumerKey: string,
	consumerSecret: string,
	token: string,
	tokenSecret: string
) {
	return createTumblrClient({
		consumer_key: consumerKey,
		consumer_secret: consumerSecret,
		token: token,
		token_secret: tokenSecret,
	});
}

export async function createPost() {
}

export async function getUserInfo(
	consumerKey: string,
	consumerSecret: string,
	token: string,
	tokenSecret: string
): Promise<TumblrUser | null> {
	const client = await createTumblrClient({
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

