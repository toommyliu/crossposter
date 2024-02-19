"use client";

import { useStore } from "@/lib/providers/StoreProvider";
import { getUserInfo } from "@/lib/tumblr";
import { isTumblrCfgValid } from "@/lib/utils";
import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { parse } from "dotenv";
import { useEffect, useState } from "react";

type EnvValues = {
	TUMBLR_CONSUMER_KEY: string;
	TUMBLR_CONSUMER_SECRET: string;
	TUMBLR_TOKEN: string;
	TUMBLR_TOKEN_SECRET: string;
};

export function TumblrForm() {
	const form = useForm({
		initialValues: {
			consumerKey: "",
			consumerSecret: "",
			token: "",
			tokenSecret: "",
		},

		validate: {
			consumerKey: (value) =>
				value.length === 50 ? null : "Invalid consumer key",
			consumerSecret: (value) =>
				value.length === 50 ? null : "Invalid consumer secret",
			token: (value) => (value.length == 50 ? null : "Invalid token"),
			tokenSecret: (value) =>
				value.length === 50 ? null : "Invalid token secret",
		},
	});

	const { tumblrCfg, setTumblrCfg } = useStore((store) => ({
		tumblrCfg: store.tumblrCfg,
		setTumblrCfg: store.setTumblrCfg,
	}));

	const handleSubmit = async () => {
		setTumblrCfg(form.values);
	};

	const handlePaste = async () => {
		const content = await navigator.clipboard.read();
		const text = await (await content[0].getType("text/plain")).text();

		const res: EnvValues = parse(text);

		if (
			res?.TUMBLR_CONSUMER_KEY?.length === 50 &&
			res?.TUMBLR_CONSUMER_SECRET?.length === 50 &&
			res?.TUMBLR_TOKEN?.length === 50 &&
			res?.TUMBLR_TOKEN_SECRET?.length === 50
		) {
			form.setFieldValue("consumerKey", res.TUMBLR_CONSUMER_KEY);
			form.setFieldValue("consumerSecret", res.TUMBLR_CONSUMER_SECRET);
			form.setFieldValue("token", res.TUMBLR_TOKEN);
			form.setFieldValue("tokenSecret", res.TUMBLR_TOKEN_SECRET);

			// todo: clear clipboard data after pasting for safety?
		}
	};

	return (
		<>
			<Box maw={340} mx="auto">
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput
						withAsterisk
						label="Consumer key"
						{...form.getInputProps("consumerKey")}
					/>
					<TextInput
						withAsterisk
						label="Consumer secret"
						{...form.getInputProps("consumerSecret")}
					/>
					<TextInput
						withAsterisk
						label="Token"
						{...form.getInputProps("token")}
					/>
					<TextInput
						withAsterisk
						label="Token secret"
						{...form.getInputProps("tokenSecret")}
					/>

					<Group mt="md">
						<Button onClick={async () => void handlePaste()}>
							Paste
						</Button>
						<Button type="submit">Create client</Button>
					</Group>
				</form>
			</Box>
		</>
	);
}

export function TumblrSelect() {
	// user blogs
	const [blogs, setBlogs] = useState<string[]>([]);
	// selected blog
	const setBlog = useStore((store) => store.setBlog);

	const tumblrCfg = useStore((store) => store.tumblrCfg);

	useEffect(() => {
		async function loadInfo() {
			const res = await getUserInfo(tumblrCfg);

			if (res?.user) {
				const { user } = res;
				setBlog(user.blogs[0].name);
				setBlogs(user.blogs.map((blog) => blog.name));
			}
		}

		if (isTumblrCfgValid(tumblrCfg)) {
			loadInfo();
		}
	}, [tumblrCfg, setBlog]);

	if (!isTumblrCfgValid(tumblrCfg)) {
		return null;
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
