"use client";

import { useStore } from "~/lib/providers/StoreProvider";
import ThemeChanger from "./theme-changer";
import TumblrAvatar from "./tumblr/avatar";
import TumblrSignIn from "./tumblr/sign-in";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export default function TopNav() {
	const { tumblrUser } = useStore((store) => store);

	const path = usePathname();

	return (
		<nav className="w-full px-4">
			<div className="mt-auto flex h-14 items-center justify-between border-b-2">
				<div className="flex items-center space-x-4">
					<Link
						href="/"
						className={cn(
							"text-2xl font-bold hover:text-blue-400",
							{ "text-blue-500": path === "/" }
						)}
					>
						crossposter
					</Link>
					<Link
						href="/reddit"
						className={cn("text-xl font-bold hover:text-blue-400", {
							"text-red-500": path === "/reddit"
						})}
					>
						reddit
					</Link>
				</div>
				<div className="flex items-center space-x-4">
					<ThemeChanger />
					{Boolean(tumblrUser?.user) ? (
						<TumblrAvatar />
					) : (
						<TumblrSignIn />
					)}
				</div>
			</div>
		</nav>
	);
}
