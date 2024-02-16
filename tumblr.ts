import { createClient } from "tumblr.js";

export const tumblr = createClient({
	consumer_key: process.env.TUMBLR_CONSUMER_KEY!,
	consumer_secret: process.env.TUMBLR_CONSUMER_SECRET!,
	token: process.env.TUMBLR_TOKEN!,
	token_secret: process.env.TUMBLR_TOKEN_SECRET!,
});

export type UserInfo = {
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
