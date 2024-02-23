import { createStore as createZustandStore } from 'zustand/vanilla';

export type Post = {
	url: string;
	title?: string | null;
	download: boolean;
};

export type StoreState = {
	blog: string;
	username: string;
	setBlog: (blog: string) => void;
	setUsername: (username: string) => void;
	posts: Post[];
	setPosts: (posts: Post[]) => void;
};

export function initStore(): StoreState {
	return {
		blog: '',
		username: '',
		posts: [],
		setBlog: (blog) => null,
		setUsername: (username) => null,
		setPosts: (posts) => null,
	};
}

export const createStore = (initState: StoreState = initStore()) => {
	return createZustandStore<StoreState>()((set) => ({
		...initState,
		setBlog: (blog) => set({ blog }),
		setUsername: (username) => set({ username }),
		setPosts: (posts) => set({ posts }),
	}));
};
