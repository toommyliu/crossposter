import Image from "next/image";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useStore } from "~/lib/providers/StoreProvider";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";

export default function TumblrAvatar() {
	const { tumblrUser, setTumblrUser } = useStore((store) => store);

	if (!tumblrUser) {
		return null;
	}

	const avatar = tumblrUser.user.blogs[0].avatar[0];

	const handleSignOut = () => {
		window.localStorage.removeItem("consumer_key");
		window.localStorage.removeItem("consumer_secret");
		window.localStorage.removeItem("token");
		window.localStorage.removeItem("token_secret");

		setTumblrUser(null);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<Image
						src={avatar.url}
						width={avatar.width}
						height={avatar.height}
						alt="your avatar"
						crossOrigin="anonymous"
					/>
					<AvatarFallback>you</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>
					{tumblrUser.user.blogs[0].name}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
