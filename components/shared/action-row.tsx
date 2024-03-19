"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogCancel
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from "~/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "~/components/ui/select";
import { useStore } from "~/lib/providers/StoreProvider";
import { log } from "~/lib/utils";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useAuth } from "~/lib/hooks/useAuth";
import { TumblrLimits, createPost, getLimits } from "~/lib/tumblr";

const formSchema = z.object({
	blog: z.string().min(1)
});

// dont change
const BASE_URL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ActionRow() {
	const { tumblrUser, setBlog, posts, setPosts } = useStore((store) => store);

	const { consumerKey, consumerSecret, token, tokenSecret } = useAuth();

	const [open, setOpen] = useState(false);
	const [selectAll, setSelectAll] = useState(true);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema)
	});

	const ffmpegRef = useRef(new FFmpeg());
	const progressRef = useRef<string | number | null>(null);

	const limitsRef = useRef<TumblrLimits>();

	const handleSubmit = async ({ blog }: z.infer<typeof formSchema>) => {
		if (!blog) {
			return;
		}

		setBlog(blog);
		setOpen(false);

		const ffmpeg = ffmpegRef.current;

		if (!ffmpeg.loaded) {
			const id = toast.loading("loading ffmpeg.");
			log("loading ffmpeg.");

			ffmpeg.on("progress", ({ progress }) => {
				const prog = Math.floor(progress * 100);

				const title = `ffmpeg progress: ${prog}%`;

				if (!progressRef.current) {
					progressRef.current = toast.loading(title);
				} else {
					toast.loading(title, {
						id: progressRef.current
					});

					if (prog === 100) {
						toast.dismiss(progressRef.current);
						progressRef.current = null;
					}
				}
			});

			await ffmpeg
				.load({
					coreURL: await toBlobURL(
						`${BASE_URL}/ffmpeg-core.js`,
						"text/javascript"
					),
					wasmURL: await toBlobURL(
						`${BASE_URL}/ffmpeg-core.wasm`,
						"application/wasm"
					),
					workerURL: await toBlobURL(
						`${BASE_URL}/ffmpeg-core.worker.js`,
						"text/javascript"
					)
				})
				.then(() => {
					toast.success("loaded ffmpeg.", { id });
					log("loaded ffmpeg");
				})
				.catch((err) => {
					const error = err as Error;
					if (error) {
						log("error loading ffmpeg", error);
					}
					toast.error("failed to load ffmpeg", { id });
				});
		}

		const title = `starting crosspost to ${blog}`;
		log(title);

		// get limits for session
		if (!limitsRef.current) {
			const res = await getLimits({
				consumerKey,
				consumerSecret,
				token,
				tokenSecret
			}).catch(() => null);

			if (res) {
				limitsRef.current = res;
			}
		}

		// "limit" refers to how many, remaining, we can post
		const videosLimit = limitsRef.current?.user?.videos?.remaining!;
		const imagesLimit = limitsRef.current?.user?.photos?.remaining!;

		// only allow crosspost if they have both available
		if (videosLimit === 0 || imagesLimit === 0) {
			toast.warning("no more posts allowed.");
			log("no more posts allowed.");
			return;
		}

		toast.success(
			`can post ${videosLimit} videos and ${imagesLimit} images. trying them now.`
		);
		log(
			`can post ${videosLimit} videos and ${imagesLimit} images. trying them now.`
		);

		// remaining
		let videoCount = videosLimit;
		let imageCount = imagesLimit;

		// start crossposting
		for (let i = 0; i < posts.length; i++) {
			const post = posts[i];

			// skip
			if (!post.download) {
				return;
			}

			log("counts: ", videoCount, imageCount);

			// if either limit is reached, exit
			if (videoCount === 0 || imageCount === 0) {
				toast.error("either limit hit, stopping.");
				log("either limit hit, stopping.");
				break;
			}

			const title = `${i + 1}. ${post.title ?? ""}`;

			const id = toast.loading(title);
			log(title);

			const auth = {
				consumerKey,
				consumerSecret,
				token,
				tokenSecret
			};
			const gif = post.url.endsWith(".gif");

			// ideally we would just GET to check if the post was created
			// but some tumblr blogs may be private so GET a post by id throws 404
			let duration = 60_000;
			if (gif) {
				duration *= 5;
			}

			// convert gifs to mp4 for comfortable file sizes
			if (gif) {
				await ffmpeg.writeFile("input.gif", await fetchFile(post.url));
				await ffmpeg.exec([
					"-i",
					"input.gif",
					"-movflags",
					"faststart",
					"-pix_fmt",
					"yuv420p",
					"-vf",
					"scale=trunc(iw/2)*2:trunc(ih/2)*2",
					"output.mp4"
				]);

				const data = await ffmpeg.readFile("output.mp4");
				const { buffer } = new Uint8Array(data as ArrayBuffer);

				const b64 = Buffer.from(buffer).toString("base64");
				const b64Url = `data:video/mp4;base64,${b64}`;

				await ffmpeg.writeFile("input.mp4", await fetchFile(b64Url));

				// create the post
				const res = await createPost(
					auth,
					{
						dataUrl: b64Url,
						title: post.title ?? ""
					},
					blog
				).catch(() => null);

				log("mp4 res", res);

				if (res && "display_text" in res) {
					toast.success(res.display_text, { id });

					toast.loading(
						`${i + 1}. waiting for video to process (heuristic delay)`,
						{
							duration
						}
					);

					log("before (1)");

					// videos need time to process
					await sleep(duration);

					toast.dismiss(id);

					log("after (1)");

					videoCount--;

					// update the post to be "done"
					setPosts(
						posts.map((p, idx) => {
							if (idx === i) {
								p.done = true;
							}
							return p;
						})
					);
				} else {
					const msg = `${i + 1}. "${title}" may have failed to post.`;
					toast.error(msg, { id });
					log(msg);
				}
			} else {
				// no conversions needed
				const res = await createPost(
					auth,
					{
						imgUrl: post.url,
						title: post.title ?? ""
					},
					blog
				).catch(() => null);
				log("img res", res);

				if (res && "display_text" in res) {
					toast.success(res.display_text, { id });

					toast.loading(
						`${i + 1}. waiting for image to process (heuristic delay)`,
						{
							duration
						}
					);

					log("before (2)");

					await sleep(duration);

					log("after (2)");

					toast.dismiss(id);

					imageCount--;

					setPosts(
						posts.map((p, idx) => {
							if (idx === i) {
								p.done = true;
							}
							return p;
						})
					);
				} else {
					const msg = `${i + 1}. "${title}" may have failed to post.`;
					toast.error(msg, { id });
					log(msg);
				}
			}
		}

		toast.success("done.");
		log("done.");
	};

	const handleShuffle = () => {
		for (let i = posts.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[posts[i], posts[j]] = [posts[j], posts[i]];
		}

		setPosts(posts);
	};

	const handleSave = () => {
		const remaining = posts.filter((post) => post.download && !post.done);

		if (remaining.length > 0) {
			toast(`saved ${remaining.length} posts.`);

			window.localStorage.setItem("posts", JSON.stringify(remaining));
		} else {
			window.localStorage.removeItem("posts");
		}
	};

	const limits = async () => {
		const res = await getLimits({
			consumerKey,
			consumerSecret,
			token,
			tokenSecret
		}).catch(() => null);

		if (res) {
			const { user } = res;

			const photos = `photos: ${user.photos.remaining}/${user.photos.limit}`;
			const videos = `videos: ${user.videos.remaining}/${user.videos.limit}`;

			toast.success(`${photos} | ${videos}`);
		}
	};

	const handleSelect = () => {
		setSelectAll((p) => !p);

		const updatedPosts = posts.map((post) => {
			post.download = !selectAll;
			return post;
		});
		setPosts(updatedPosts);
	};

	if (!tumblrUser) {
		return null;
	}

	return (
		<div className="mx-auto flex items-center justify-center space-x-2 py-4">
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger asChild>
					<Button
						variant="secondary"
						disabled={posts.length === 0}
						onClick={() => setBlog("")}
					>
						crosspost
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>crosspost to blog</AlertDialogTitle>
					</AlertDialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<FormField
								control={form.control}
								name="blog"
								render={({ field }) => (
									<FormItem>
										<Select onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{tumblrUser?.user.blogs.map(
													(blog) => (
														<SelectItem
															value={blog.name}
															key={blog.name}
														>
															{blog.name} (
															{blog.title})
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<AlertDialogFooter className="mt-4">
								<AlertDialogCancel asChild>
									<Button
										onClick={() => setOpen(false)}
										variant="ghost"
									>
										cancel
									</Button>
								</AlertDialogCancel>
								<Button type="submit" variant="outline">
									start
								</Button>
							</AlertDialogFooter>
						</form>
					</Form>
				</AlertDialogContent>
			</AlertDialog>

			<Button variant="secondary" disabled={posts.length === 0} onClick={handleShuffle}>
				shuffle
			</Button>
			<Button variant="secondary" disabled={posts.length === 0} onClick={handleSave}>
				save
			</Button>
			<Button variant="secondary" onClick={async () => await limits()}>
				get limits
			</Button>
			<Button variant="secondary" disabled={posts.length === 0} onClick={handleSelect}>
				{selectAll ? "deselect" : "select"} all
			</Button>
		</div>
	);
}
