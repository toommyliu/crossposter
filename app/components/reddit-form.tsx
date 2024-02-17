"use client";

import { TextInput, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useStore } from "@/lib/providers/StoreProvider";
import { makeRequest } from "@/lib/reddit";

export default function RedditForm() {
	const [loading, setLoading] = useState(false);
	const [time, setTime] = useState(0);
	const form = useForm({
		initialValues: {
			username: "",
		},
		validate: {
			username: (value) =>
				value.length > 0 ? null : "Username is required",
		},
	});

	const blog = useStore((state) => state.blog);
	const posts = useStore((state) => state.posts);
	const setPosts = useStore((state) => state.setPosts);
	const setUsername = useStore((state) => state.setUsername);

	if (!blog) {
		return null;
	}

	// TODO: finish impl
	const crosspost = async () => {
		const toDownload = posts.filter((post) => post.download);
		console.log(toDownload);
	};

	return (
		<>
			<form
				onSubmit={form.onSubmit(async ({ username }) => {
					setTime(Date.now());
					setLoading(true);
					setUsername(username);
					try {
						const posts = await makeRequest(username);
						console.log(posts);
						setPosts(posts);
					} catch (e) {
						const error = e as Error;
						console.log(error);
					} finally {
						setLoading(false);
					}
				})}
			>
				<TextInput
					withAsterisk
					label="Reddit username to search from"
					{...form.getInputProps("username")}
				/>
				<Group mt="md">
					<Button type="submit">Submit</Button>
					<Button onClick={async () => await crosspost()}>
						Download selected
					</Button>
				</Group>
			</form>
			{loading && (
				<>
					<p>loading...</p>
					<p>polling since: {new Date(time).toLocaleTimeString()}</p>
				</>
			)}
		</>
	);
}
