/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				hostname: "i.redd.it",
			},
			{
				hostname: "mir-s3-cdn-cf.behance.net",
			},
			{
				hostname: "69.media.tumblr.com",
			},
		],
	},
	// required for SharedArrayBuffer
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "require-corp",
					},
					{
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;
