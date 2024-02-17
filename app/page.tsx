import { Center, Container, Stack } from "@mantine/core";
import RedditForm from "./components/reddit-form";
import TumblrApiForm from "./components/tumblr-api";
import TumblrBlogSelect from "./components/tumblr-blog-select";
import PostGrid from "./components/posts";

export default async function RootPage() {
	return (
		<>
			<Container>
				<Center>
					<Stack py={50}>
						<TumblrApiForm />
						<TumblrBlogSelect />
						<RedditForm />
					</Stack>
				</Center>
			</Container>
			<PostGrid />
		</>
	);
}
