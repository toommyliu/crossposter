"use client";

import { useStore } from "~/lib/providers/StoreProvider";
import ThemeChanger from "./theme-changer";
import TumblrAvatar from "./tumblr/avatar";
import TumblrSignIn from "./tumblr/sign-in";

export default function TopNav() {
	const { tumblrUser } = useStore((store) => store);

	return (
		<nav className="w-full px-4">
			<div className="mt-auto flex h-14 items-center justify-between border-b-2">
				<div className="flex items-center space-x-4">
					<span className="text-2xl font-bold">crossposter</span>
					<a href="/reddit" className="text-lg hover:text-blue-400">
						reddit
					</a>
					<a href="/instagram" className="text-lg hover:text-blue-400">
						instagram
					</a>
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
