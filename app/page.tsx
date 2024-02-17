import { Divider } from "@mantine/core";
import TumblrApiForm from "./components/tumblr-api";
import TumblrBlogSelect from "./components/tumblr-blog-select";
import RedditForm from "./components/reddit-form";

export default async function RootPage() {
	return (
		<>
			<TumblrApiForm />
			<Divider />
			<TumblrBlogSelect />
			<RedditForm />
		</>
	);
}
