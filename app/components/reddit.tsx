"use client";

import { useStore } from "@/lib/providers/StoreProvider";
import { makeRequest } from "@/lib/reddit";
import { createPost } from "@/lib/tumblr";
import type { Post } from "@/lib/stores/store";
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
import { useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { FFmpeg } from "@ffmpeg/ffmpeg";

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
				console.log(post);
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
			onClick={handleClick}
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
			<Group>
				<Checkbox
					checked={props.post.download}
					onChange={() => {}}
					onClick={handleClick}
				/>
				{props.post.title}
			</Group>
		</Card>
	);
}

export function PostGrid() {
	const posts = useStore((store) => store.posts);

	if (posts.length === 0) {
		return null;
	}

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

	// ffmpeg
	const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
	const ffmpegRef = useRef(new FFmpeg());

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
		const ffmpeg = ffmpegRef.current;

		if (!ffmpegLoaded) {
			notifications.show({
				title: "Please wait",
				message: "Loading FFMPEG binaries",
				loading: true,
			});

			const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
			ffmpeg.on("progress", ({ progress, time }) => {
				console.log(
					"progress:",
					`${Math.floor(progress * 100)} % (transcoded time: ${
						time / 1000000
					} s)`
				);
			});

			await ffmpeg.load({
				coreURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.js`,
					"text/javascript"
				),
				wasmURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.wasm`,
					"application/wasm"
				),
				workerURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.worker.js`,
					"text/javascript"
				),
			});

			setFfmpegLoaded(true);
		}

		console.log(toDownload);

		const delay = 3 * 60_000; // 3 min

		for (let i = 0; i < toDownload.length; ++i) {
			const post = toDownload[i];

			try {
				if (post.url.endsWith(".gif")) {
					await ffmpeg.writeFile(
						"input.gif",
						await fetchFile(toDownload[0].url)
					);
					await ffmpeg.exec(["-i", "input.gif", "output.mp4"]);

					const data = await ffmpeg.readFile("output.mp4");
					const { buffer } = new Uint8Array(data as ArrayBuffer);

					const b64 = Buffer.from(buffer).toString("base64");
					const b64Url = `data:video/mp4;base64,${b64}`;
					// console.log(b64Url);

					await createPost(
						blog,
						{
							dataUrl: b64Url,
							title: toDownload[0].title ?? "",
						},
						tumblrCfg
					).then((res) => {
						console.log(res);
						if (res?.display_text) {
							notifications.show({
								color: "green",
								title: "Success",
								message: res.display_text as string,
							});
						}
					});
				} else {
					await createPost(
						blog,
						{
							imgUrl: post.url,
							title: post.title ?? "",
						},
						tumblrCfg
					).then((res) => {
						if (res?.display_text) {
							notifications.show({
								color: "green",
								title: "Success",
								message: res.display_text as string,
							});
						}
						console.log(res);
					});
				}
			} catch (err) {
				// untested
				const error = err as Error;
				console.log(error);

				notifications.show({
					color: "red",
					title: "Error",
					message:
						error.message ??
						"Something unexpected happened while creating your post.",
				});
			}

			const end = Date.now() + delay;
			notifications.show({
				title: "Heads up.",
				message: `Waiting until ${new Date(
					end
				).toLocaleTimeString()} to let media (${
					post.title ?? "n/a"
				}) process. (${i}/${toDownload.length})`,
				autoClose: delay,
				loading: true,
			});

			// generous timeout to let videos process
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		notifications.show({
			color: "green",
			title: "Success",
			message: "Looks like everything was crossposted!",
		});
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
						// setPosts([
						// 	{
						// 		download: true,
						// 		url: "https://i.redd.it/bbx96pfdfsjc1.gif",
						// 		title: "hi",
						// 	},
						// 	{
						// 		download: true,
						// 		url: "http://69.media.tumblr.com/b06fe71cc4ab47e93749df060ff54a90/tumblr_nshp8oVOnV1rg0s9xo1_1280.jpg",
						// 		title: "hi",
						// 	},
						// ]);

						notifications.show({
							title: "Success",
							message: `Querying "${username}" for posts. This may take a moment.`,
							color: "green",
						});

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
					<Button type="submit">Search</Button>
					<Button
						onClick={async () => await crosspost()}
						disabled={posts.length === 0 ? true : false}
					>
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
