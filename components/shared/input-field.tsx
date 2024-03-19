"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useStore } from "~/lib/providers/StoreProvider";

export default function InputField() {
	const { setUsername } = useStore((store) => store);

	return (
		<form
			className="mx-auto flex max-w-md flex-row space-x-4"
			onSubmit={(e) => {
				e.preventDefault();

				// @ts-expect-error
				const input = e.target.querySelector(
					"input"
				) as HTMLInputElement;
				setUsername(input.value);
			}}
		>
			<Input id="username" placeholder="username" />
			<Button type="submit" variant="outline">
				search
			</Button>
		</form>
	);
}
