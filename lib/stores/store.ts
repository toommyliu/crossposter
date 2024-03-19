import { createStore as createZustandStore } from "zustand/vanilla";
import type { TumblrUser } from "../tumblr";

export type Post = {
	url: string;
	title?: string | null;
	download: boolean; // whether to download the post
	done: boolean; // whether the post has been crossposted
	createdAt: number;
};

export type StoreState = {
	blog: string;
	setBlog: (blog: string) => void;
	username: string;
	setUsername: (username: string) => void;
	posts: Post[];
	setPosts: (posts: Post[]) => void;
	tumblrUser: TumblrUser | null;
	setTumblrUser: (user: TumblrUser | null) => void;
};

export function initStore(): StoreState {
	return {
		blog: "",
		username: "",
		posts: [],
		tumblrUser: null,
		setBlog: (blog) => null,
		setUsername: (username) => null,
		setPosts: (posts) => null,
		setTumblrUser: (user) => null
	};
}

export const createStore = (initState: StoreState = initStore()) => {
	return createZustandStore<StoreState>()((set) => ({
		...initState,
		setBlog: (blog) => set({ blog }),
		setUsername: (username) => set({ username }),
		setPosts: (posts) => set({ posts }),
		setTumblrUser: (tumblrUser) => set({ tumblrUser })
	}));
};
