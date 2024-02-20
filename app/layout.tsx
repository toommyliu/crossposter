import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { StoreProvider } from "@/lib/providers/StoreProvider";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

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
					<Notifications position="top-right" />
					<StoreProvider>{children}</StoreProvider>
				</MantineProvider>
			</body>
		</html>
	);
}
