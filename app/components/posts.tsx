"use client";

import { useStore } from "@/lib/providers/StoreProvider";
import { Post } from "@/lib/stores/store";
import {
	SimpleGrid,
	Checkbox,
	AspectRatio,
	Card,
	CardSection,
} from "@mantine/core";
import Image from "next/image";

type PostProps = {
	post: Post;
	alt: string;
};

export function Post(props: PostProps) {
	const posts = useStore((store) => store.posts);
	const setPosts = useStore((store) => store.setPosts);

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
				<Checkbox
					defaultChecked={true}
					onClick={() => {
						let newPost = props.post;
						newPost.download = !newPost.download;
						// replace the old post with the new post
						const newPosts = posts.map((post) => {
							if (post.url === newPost.url) {
								return newPost;
							}
							return post;
						});
						setPosts(newPosts);
					}}
				/>
			</CardSection>
		</Card>
	);
}

export default function PostGrid() {
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
