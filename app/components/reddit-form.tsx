"use client";

import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useStore } from "@/lib/providers/StoreProvider";
import { makeRequest } from "@/lib/reddit";

export default function RedditForm() {
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			username: "",
		},
	});

	const blog = useStore((state) => state.blog);
	const setUsername = useStore((state) => state.setUsername);

	if (!blog) {
		return null;
	}

	return (
		<>
			<form
				onSubmit={form.onSubmit(async ({ username }) => {
					setLoading(true);
					setUsername(username);
					const json = await makeRequest(username);
					setLoading(false);
					console.log(json);
				})}
			>
				<TextInput
					withAsterisk
					label="Reddit username to search from"
					{...form.getInputProps("username")}
				/>
				<Button type="submit" variant="transparent" />
			</form>
			{loading && <p>loading...</p>}
		</>
	);
}