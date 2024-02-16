import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	const { consumerKey, consumerSecret, token, tokenSecret } = req.query;
	console.log({ consumerKey, consumerSecret, token, tokenSecret });

	return res.status(200).json({ all: "good" });
}
