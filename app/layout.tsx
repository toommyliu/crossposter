import "~/styles/globals.css";
import { StoreProvider } from "~/lib/providers/StoreProvider";

export const metadata = {
	title: "Crossposter",
	description: "Easily crosspost from Reddit to Tumblr",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</head>
			<body>
				<StoreProvider>{children}</StoreProvider>
			</body>
		</html>
	);
}
