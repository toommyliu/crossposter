import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	// get username
	const { username } = req.query;
	if (!username) {
		return res.status(400).json({ message: "username is required" });
	}

	// array of media
	const posts: string[] = [];

	let url = `https://reddit.com/u/${username}.json`;

	const makeRequest = async (url: string, after?: string) => {
		console.log(
			`making request to: ${url}${after ? `?after=${after}` : ""}`
		);

		await new Promise((resolve) => setTimeout(resolve, 5_000));

		const json: JSONResponse = await fetch(`${url}?after=${after}`)
			.then((res) => res.json())
			.catch(() => null);
		if (json) {
			json.data.children.forEach((post) => {
				// TODO: add mp4s?
				if (post.data.post_hint === "image") {
					posts.push(post.data.url);
				}
			});

			if (json.data.after) {
				await makeRequest(url, json.data.after);
			}
		}
	};

	await makeRequest(url);

	return res.status(200).json(posts);
}

type JSONResponse = {
	kind: string;
	data: {
		after: string | null; // if there are more posts
		dist: number; // post count?
		children: {
			kind: string;
			data: {
				subreddit: string;
				subreddit_name_prefixed: string;
				title: string;
				post_hint: string;
				created: number;
				created_utc: number;
				author: string;
				permalink: string; // /r/subreddit/...
				url: string; // url to the image
				ups: number;
			};
		}[];
		before: string | null;
	};
};
