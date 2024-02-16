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
