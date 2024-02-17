"use server";

import { createClient } from "tumblr.js";

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

export async function getUserInfo(
	consumerKey: string,
	consumerSecret: string,
	token: string,
	tokenSecret: string
): Promise<TumblrUser | null> {
	const client = createClient({
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
