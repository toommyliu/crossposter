import { createStore as createZustandStore } from "zustand/vanilla";

type TumblrCfg = {
	consumerKey: string | null;
	consumerSecret: string | null;
	token: string | null;
	tokenSecret: string | null;
};

export type StoreState = {
	blog: string;
	username: string;
	setBlog: (blog: string) => void;
	setUsername: (username: string) => void;
	posts: string[];
	setPosts: (posts: string[]) => void;
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
	} as const;
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
