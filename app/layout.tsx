import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { StoreProvider } from "~/lib/providers/StoreProvider";
import { ThemeProvider } from "~/components/theme-provider";
import TopNav from "~/components/top-nav";

export const metadata = {
	title: "Crossposter",
	description: "Easily crosspost media from Reddit to Tumblr"
};

const inter = Inter({
	subsets: []
});

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
				>
					<StoreProvider>
						<TopNav />
						{children}
					</StoreProvider>
				</ThemeProvider>
				<Toaster richColors />
			</body>
		</html>
	);
}
