import { Button, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { store } from "../store";
import { tumblr, type UserInfo } from "../tumblr";
import { useState } from "react";

type Props = {
	tumblrUser: UserInfo | null;
};

export async function getServerSideProps() {
	const tumblrUser: UserInfo | null = await tumblr
		.userInfo()
		?.catch(() => null);
	return {
		props: {
			tumblrUser,
		},
	};
}

export default function IndexPage({ tumblrUser }: Props) {
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			username: "",
		},
	});

	if (!tumblrUser) {
		return <>properly fill tumblr client params before starting!</>;
	}

	const blog = store((state) => state.blog);
	const username = store((state) => state.username);

	const setBlog = store((state) => state.setBlog);
	const setUsername = store((state) => state.setUsername);

	const posts = store((state) => state.posts);
	const setPosts = store((state) => state.setPosts);

	const { user } = tumblrUser;
	const blogs = user.blogs.map((blog) => blog.name);

	return (
		<>
			<Select
				label="Tumblr blog to post to"
				defaultValue={blogs[0]}
				data={blogs}
				onChange={(value) => {
					if (value) {
						setBlog(value);
					}
				}}
			/>
			<form
				onSubmit={form.onSubmit(async ({ username }) => {
					setLoading(true);
					setUsername(username);
					const json = await (
						await fetch(`/api/user?username=${username}`)
					).json();
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
			selected blog: {blog}
			selected username: {username}
			{loading && "making backend requests now..."}
		</>
	);
}
