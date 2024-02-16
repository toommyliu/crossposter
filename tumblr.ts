import { createClient } from "tumblr.js";

export const tumblr = createClient({
	consumer_key: process.env.TUMBLR_CONSUMER_KEY || "1234",
	consumer_secret: process.env.TUMBLR_CONSUMER_SECRET || "1234",
	token: process.env.TUMBLR_TOKEN || "1234",
	token_secret: process.env.TUMBLR_TOKEN_SECRET || "1234",
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
