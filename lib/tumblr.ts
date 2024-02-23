'use server';

import { createClient } from 'tumblr.js';

export async function getUserInfo(auth: TumblrCfg) {
	const client = createClient({
		consumer_key: auth.consumerKey,
		consumer_secret: auth.consumerSecret,
		token: auth.token,
		token_secret: auth.tokenSecret,
	});
	return client.userInfo()?.catch(() => null) as Promise<TumblrUser | null>;
}

export type TumblrCfg = {
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
				},
			];
		}[];
	};
};
