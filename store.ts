import { create } from "zustand";

type Store = {
	blog: string;
	username: string;
	setBlog: (blog: string) => void;
	setUsername: (username: string) => void;
	posts: string[];
	setPosts: (posts: string[]) => void;
};

export const store = create<Store>(function (set) {
	return {
		blog: "",
		username: "",
		posts: [],
		setBlog: (blog) => set({ blog }),
		setUsername: (username) => set({ username }),
		setPosts: (posts) => set({ posts }),
	};
});
