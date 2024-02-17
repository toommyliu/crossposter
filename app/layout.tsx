import "@mantine/core/styles.css";

import { StoreProvider } from "@/lib/providers/StoreProvider";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

export const metadata = {
	title: "Reddit to Tumblr",
	description: "Crosspost Reddit posts to Tumblr blogs",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
			</head>
			<body>
				<MantineProvider>
					<StoreProvider>{children}</StoreProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
