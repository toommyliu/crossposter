"use client";

import { useEffect } from "react";
import ActionRow from "~/components/shared/action-row";
import Card from "~/components/shared/card";
import CardGrid from "~/components/shared/card-grid";
import InputField from "~/components/shared/input-field";
import { toast } from "sonner";
import { useStore } from "~/lib/providers/StoreProvider";
import { makeRequest } from "~/lib/reddit";

export default function RedditPage() {
	const { posts, setPosts, username } = useStore((store) => store);

	useEffect(() => {
		async function get() {
			setPosts([]);

			const loading = toast.loading(`loading posts for "${username}".`);

			const posts = await makeRequest(username!)
				.then((posts) => {
					toast.info(`got ${posts.length} posts.`, { id: loading });
					return posts;
				})
				.catch(() => {
					toast.error(`got ${posts.length} posts.`, { id: loading });
					return [];
				});

			if (posts.length > 0) {
				setPosts(posts);
				window.localStorage.setItem("posts", JSON.stringify(posts));
			}
		}

		if (username) {
			get();
		}

		if (window.localStorage.getItem("posts")) {
			// @ts-expect-error
			setPosts(JSON.parse(window.localStorage.getItem("posts")));
		}
	}, [username, setPosts]);

	return (
		<div className="container px-4 py-4">
			<InputField />

			<ActionRow />

			<CardGrid key={username}>
				{posts.map((post, idx) => (
					<Card post={post} key={`post-${idx}`} />
				))}
			</CardGrid>
		</div>
	);
}
