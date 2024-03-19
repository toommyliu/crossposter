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
		console.log(process.env);
		return [
			{
				source: "/(.*)",
				headers: [
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
		//
		serverActions: {
			bodySizeLimit: "10mb"
		}
	}
};

export default nextConfig;
