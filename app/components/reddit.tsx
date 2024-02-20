"use client";

import { useStore } from "@/lib/providers/StoreProvider";
import { makeRequest } from "@/lib/reddit";
import { createPost } from "@/lib/tumblr";
import { Post } from "@/lib/stores/store";
import {
	AspectRatio,
	Button,
	Card,
	CardSection,
	Checkbox,
	Group,
	SimpleGrid,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Image from "next/image";
import { useState } from "react";

type PostProps = {
	post: Post;
	alt: string;
};

function Post(props: PostProps) {
	const { posts, setPosts } = useStore((store) => ({
		posts: store.posts,
		setPosts: store.setPosts,
	}));

	const handleClick = () => {
		const updatedPosts = posts.map((post) => {
			if (post.url === props.post.url) {
				post.download = !post.download;
			}
			return post;
		});
		setPosts(updatedPosts);
	};

	return (
		<Card
			shadow="xl"
			padding="sm"
			radius="sm"
			style={{ overflow: "hidden" }}
			withBorder
		>
			<CardSection style={{ position: "relative", overflow: "hidden" }}>
				<AspectRatio ratio={4 / 3}>
					<Image
						src={props.post.url}
						alt={props.alt}
						width={192}
						height={192}
					/>
				</AspectRatio>
			</CardSection>
			<CardSection>
				<Checkbox defaultChecked={true} onClick={handleClick} />
			</CardSection>
		</Card>
	);
}

export function PostGrid() {
	const posts = useStore((store) => store.posts);

	if (posts.length === 0) {
		return null;
	}

	console.log(posts);

	return (
		<SimpleGrid cols={{ lg: 3, md: 2, sm: 1 }} mt={-50} p={50}>
			{posts.map((post, idx) => {
				return (
					<Post key={`post_${idx}`} post={post} alt={`post_${idx}`} />
				);
			})}
		</SimpleGrid>
	);
}

export function RedditForm() {
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
	const tumblrCfg = useStore((state) => state.tumblrCfg);
	const { posts, setPosts } = useStore((state) => ({
		posts: state.posts,
		setPosts: state.setPosts,
	}));
	const setUsername = useStore((state) => state.setUsername);

	if (!blog) {
		return null;
	}

	const crosspost = async () => {
		const toDownload = posts.filter((post) => post.download);
		const res = await createPost(blog, toDownload[0], tumblrCfg);
		// {
		// 	"id": "random-id",
		// 	"state": "private",
		// 	"display_text": "posted to {blog}
		// }
		console.log(res);
	};

	return (
		<>
			<form
				onSubmit={form.onSubmit(async ({ username }) => {
					setTime(Date.now());
					setLoading(true);
					setUsername(username);
					setPosts([]);
					try {
						const posts = await makeRequest(username);
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
						Crosspost
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
