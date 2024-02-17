"use client";

import { useStore } from "@/lib/providers/StoreProvider";
import { getUserInfo } from "@/lib/tumblr";
import { Button, Select } from "@mantine/core";
import { useState } from "react";

export default function TumblrBlogSelect() {
	const [blogs, setBlogs] = useState<string[]>([]);
	const { blog, setBlog } = useStore((store) => ({
		blog: store.blog,
		setBlog: store.setBlog,
	}));
	const tumblrCfg = useStore((store) => store.tumblrCfg);

	if (
		!tumblrCfg.consumerKey &&
		!tumblrCfg.consumerSecret &&
		!tumblrCfg.token &&
		!tumblrCfg.tokenSecret
	) {
		return null;
	}

	async function loadInfo() {
		const res = await getUserInfo(
			tumblrCfg!.consumerKey as string,
			tumblrCfg!.consumerSecret as string,
			tumblrCfg!.token as string,
			tumblrCfg!.tokenSecret as string
		);

		if (res?.user) {
			const { user } = res;
			setBlog(user.blogs[0].name);
			setBlogs(user.blogs.map((blog) => blog.name));
		}
	}

	if (!blog && blogs.length === 0) {
		return (
			<Button onClick={async () => await loadInfo()}>Load Blogs</Button>
		);
	}

	return (
		<Select
			label="Tumblr blog to post to"
			defaultValue={blogs[0]}
			allowDeselect={false}
			data={blogs}
			onChange={(value) => {
				if (value) setBlog(value);
			}}
		/>
	);
}
