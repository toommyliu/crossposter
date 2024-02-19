import { Center, Container, Stack } from "@mantine/core";
import { RedditForm, PostGrid } from "./components/reddit";
import { TumblrForm, TumblrSelect } from "./components/tumblr";

export default async function RootPage() {
	return (
		<>
			<Container>
				<Center>
					<Stack py={50}>
						<TumblrForm />
						<TumblrSelect />
						<RedditForm />
					</Stack>
				</Center>
			</Container>
			<PostGrid />
		</>
	);
}
