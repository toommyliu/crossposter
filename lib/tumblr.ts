"use server";

import path from "path";
import fs from "fs";
import { createClient } from "tumblr.js";

export async function getUserInfo({
	consumerKey,
	consumerSecret,
	token,
	tokenSecret
}: TumblrAuth) {
	const client = createClient({
		consumer_key: consumerKey,
		consumer_secret: consumerSecret,
		token,
		token_secret: tokenSecret
	});

	return client.userInfo()?.catch(() => null) as Promise<TumblrUser | null>;
}

export async function createPost(
	{ consumerKey, consumerSecret, token, tokenSecret }: TumblrAuth,
	post: PostParamsGif | PostParamsImg,
	blogIdentifier: string
) {
	const client = createClient({
		consumer_key: consumerKey,
		consumer_secret: consumerSecret,
		token,
		token_secret: tokenSecret
	});

	// gif
	if ("dataUrl" in post) {
		// fetch the data url and convert to a buffer
		const res = await fetch(post.dataUrl);
		const buffer = await res.arrayBuffer();
		const bytes = new Uint8Array(buffer);

		// write the file locally
		const tmpPath = path.join(__dirname, "temp.mp4");
		await fs.promises.writeFile(tmpPath, Buffer.from(bytes));

		// create the post
		return client.createPost(blogIdentifier, {
			content: [
				{
					type: "video",
					media: fs.createReadStream(tmpPath)
				},
				{
					type: "text",
					text: post.title ?? ""
				}
			],
			interactability_reblog: "noone",
			state: "private"
		});
	}

	// img
	if ("imgUrl" in post) {
		return client.createPost(blogIdentifier, {
			content: [
				{
					type: "image",
					media: {
						url: post.imgUrl
					}
				},
				{
					type: "text",
					text: post.title ?? ""
				}
			],
			interactability_reblog: "noone",
			state: "private"
		});
	}
}

export async function getLimits({
	consumerKey,
	consumerSecret,
	token,
	tokenSecret
}: TumblrAuth) {
	const client = createClient({
		consumer_key: consumerKey,
		consumer_secret: consumerSecret,
		token,
		token_secret: tokenSecret
	});

	return client.getRequest("/v2/user/limits") as Promise<TumblrLimits | null>;
}

export type PostParamsGif = {
	dataUrl: string;
	title?: string;
};

export type PostParamsImg = {
	imgUrl: string;
	title?: string;
};

export type TumblrAuth = {
	consumerKey: string;
	consumerSecret: string;
	token: string;
	tokenSecret: string;
};

export type TumblrUser = {
	user: {
		name: string;
		likes: number;
		following: number;
		blogs: {
			name: string;
			title: string;
			avatar: [
				{
					width: 512;
					height: 512;
					url: string;
				},
				{
					width: 128;
					height: 128;
					url: string;
				},
				{
					width: 96;
					height: 96;
					url: string;
				},
				{
					width: 64;
					height: 64;
					url: string;
				}
			];
		}[];
	};
};

export type TumblrLimits = {
	user: {
		blogs: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
		follows: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
		likes: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
		photos: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
		posts: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
		video_seconds: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
		videos: {
			description: string;
			limit: number;
			remaining: number;
			reset_at: number;
		};
	};
};
