import { store } from "../store";
import ApiForm from "./components/api-form";
import RedditForm from "./components/reddit-form";
import SelectBlog from "./components/select-blog";

export default function IndexPage() {
	const tumblrCfg = store((state) => state.tumblrCfg);
	const username = store((state) => state.username);
	const blog = store((state) => state.blog);

	if (
		!tumblrCfg.consumerKey ||
		!tumblrCfg.consumerSecret ||
		!tumblrCfg.token ||
		!tumblrCfg.tokenSecret
	) {
		return <ApiForm />;
	}

	if (!username) {
		return <RedditForm />;
	}

	if (!blog) {
		return <SelectBlog />;
	}

	return (
		<div>
			<p>Consumer Key: {tumblrCfg.consumerKey}</p>
			<p>Consumer Secret: {tumblrCfg.consumerSecret}</p>
			<p>Token: {tumblrCfg.token}</p>
			<p>Token Secret: {tumblrCfg.tokenSecret}</p>
			<p>Selected blog: {blog}</p>
			<p>Reddit Username: {username}</p>
		</div>
	);
}
