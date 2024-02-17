"use client";

import { useStore } from "@/lib/providers/StoreProvider";
import { getUserInfo } from "@/lib/tumblr";
import { useState } from "react";
import { Select } from "@mantine/core";

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
			setBlogs(user.blogs.map((blog) => blog.name));
		}
	}

	if (!blog && blogs.length === 0) {
		return (
			<button onClick={async () => await loadInfo()}>load blogs</button>
		);
	}

	return (
		<Select
			label="Tumblr blog to post to"
			defaultValue={blogs[0]}
			data={blogs}
			onChange={(value) => {
				if (value) {
					setBlog(value);
					console.log("value", value);
				}
			}}
		/>
	);
}
