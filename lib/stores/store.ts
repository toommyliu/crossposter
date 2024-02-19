import { createStore as createZustandStore } from "zustand/vanilla";
import type { TumblrCfg } from "../tumblr";

export type Post = {
	url: string;
	download: boolean;
}

export type StoreState = {
	blog: string;
	username: string;
	setBlog: (blog: string) => void;
	setUsername: (username: string) => void;
	posts: Post[];
	setPosts: (posts: Post[]) => void;
	tumblrCfg: TumblrCfg;
	setTumblrCfg: (cfg: TumblrCfg) => void;
};

export function initStore(): StoreState {
	return {
		blog: "",
		username: "",
		posts: [],
		tumblrCfg: {
			consumerKey: null,
			consumerSecret: null,
			token: null,
			tokenSecret: null,
		},
		setBlog: (blog) => null,
		setUsername: (username) => null,
		setPosts: (posts) => null,
		setTumblrCfg: (cfg) => null,
	}; 
}

export const createStore = (initState: StoreState = initStore()) => {
	return createZustandStore<StoreState>()((set) => ({
		...initState,
		setBlog: (blog) => set({ blog }),
		setUsername: (username) => set({ username }),
		setPosts: (posts) => set({ posts }),
		setTumblrCfg: (tumblrCfg) => set({ tumblrCfg }),
	}));
};
