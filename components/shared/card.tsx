"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { useStore } from "~/lib/providers/StoreProvider";
import { Post } from "~/lib/stores/store";
import { cn } from "~/lib/utils";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(utc);

function getPostTimestamp(timestamp: number) {
	const time = dayjs.unix(timestamp);

	if (time.isToday()) {
		return "Today";
	}

	if (time.isYesterday()) {
		return "Yesterday";
	}

	if (time.year() === dayjs().year()) {
		return time.format("MMMM D");
	}

	return time.toDate().toLocaleDateString();
}

export default function Card(props: { post: Post }) {
	const { posts, setPosts } = useStore((store) => store);

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
		<div
			className={cn(
				"flex flex-col border-4",
				props.post.done ? "border-green-400" : "border-red-400"
			)}
		>
			<div className="relative flex max-w-md flex-grow">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					className="w-full object-cover"
					crossOrigin="anonymous"
					src={props.post.url}
					alt="post"
				/>
			</div>
			<div className="px-4 py-4" onClick={handleClick}>
				<div className="flex flex-col py-1 text-sm dark:text-white">
					<p>{props.post.title ?? "title would be here."}</p>
					<p className="italic text-gray-500">
						{getPostTimestamp(props.post.createdAt)}
					</p>
				</div>
				<div className="flex justify-end">
					<Checkbox checked={props.post.download} />
				</div>
			</div>
		</div>
	);
}
