"use server";

import fs from "fs";
import path from "path";
import { createClient } from "tumblr.js";
import { parseConfig } from "./utils";

export async function getUserInfo(tumblrCfg: Required<TumblrCfg>) {
	const auth = parseConfig(tumblrCfg);
	const client = createClient(auth);
	return client.userInfo()?.catch(() => null) as Promise<TumblrUser | null>;
}

export async function createPost(
	blog: string,
	post: PostParamsGif | PostParamsImg,
	tumblrCfg: TumblrCfg
) {
	const auth = parseConfig(tumblrCfg);
	const client = createClient(auth);

	const isGif = "dataUrl" in post;

	if (isGif) {
		// https://vercel.com/guides/how-can-i-use-files-in-serverless-functions#using-temporary-storage

		// fetch the data url and convert it to a buffer
		const res = await fetch(post.dataUrl);
		const buffer = await res.arrayBuffer();
		const bytes = new Uint8Array(buffer);

		// create a temporary file
		const tmpPath = path.join(__dirname, "temp.mp4");
		await fs.promises.writeFile(tmpPath, Buffer.from(bytes));

		// create the post
		return client.createPost(blog, {
			content: [
				{
					type: "video",
					media: fs.createReadStream(tmpPath),
				},
				{
					type: "text",
					text: post.title ?? "",
				},
			],
			interactability_reblog: "noone",
			state: "private",
		});
	}

	// create the post normally
	return client.createPost(blog, {
		content: [
			{
				type: "image",
				media: {
					url: post.imgUrl,
				},
			},
			{
				type: "text",
				text: post.title ?? "",
			},
		],
		interactability_reblog: "noone",
		state: "private",
	});
}

export type PostParamsGif = {
	dataUrl: string;
	title?: string;
};

export type PostParamsImg = {
	imgUrl: string;
	title?: string;
};

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