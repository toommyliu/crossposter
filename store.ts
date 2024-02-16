import { create } from "zustand";
import { TumblrUser } from "./tumblr";

export type TumblrCfg = {
	consumerKey: string | null;
	consumerSecret: string | null;
	token: string | null;
	tokenSecret: string | null;
};

type Store = {
	blog: string;
	username: string;
	setBlog: (blog: string) => void;
	setUsername: (username: string) => void;
	posts: string[];
	setPosts: (posts: string[]) => void;
	tumblrCfg: TumblrCfg;
	setTumblrCfg: (cfg: TumblrCfg) => void;
	tumblrUser: TumblrUser | null;
};

export const store = create<Store>(function (set) {
	return {
		blog: "",
		username: "",
		posts: [],
		setBlog: (blog) => set({ blog }),
		setUsername: (username) => set({ username }),
		setPosts: (posts) => set({ posts }),

		tumblrCfg: {
			consumerKey: null,
			consumerSecret: null,
			token: null,
			tokenSecret: null,
		},
		setTumblrCfg: (tumblrCfg) => set({ tumblrCfg }),
		tumblrUser: null,
		setTumblrUser: (tumblrUser: TumblrUser) => set({ tumblrUser }),
	};
});
