/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				hostname: "i.redd.it"
			},
			{
				hostname: "assets.tumblr.com"
			}
		]
	},
	// required for SharedArrayBuffer (ffmpeg.wasm)
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{
						key: "Access-Control-Allow-Origin",
						value: "https://elegant-biscotti-a4f022.netlify.app/reddit"
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,OPTIONS,PATCH,DELETE,POST,PUT"
					},
					{
						key: "Access-Control-Allow-Headers",
						value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
					},
					{
						key: "Cross-Origin-Embedder-Policy",
						value: "require-corp"
					},
					{
						key: "Cross-Origin-Opener-Policy",
						value: "same-origin"
					}
				]
			}
		];
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb"
		}
	}
};

export default nextConfig;
