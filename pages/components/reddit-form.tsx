import { TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { store } from "../../store";

export default function RedditForm() {
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			username: "",
		},
	});
	const setUsername = store((state) => state.setUsername);

	return (
		<form
			onSubmit={form.onSubmit(async ({ username }) => {
				setLoading(true);
				setUsername(username);
				// const json = await (
				// 	await fetch(`/api/user?username=${username}`)
				// ).json();
				setLoading(false);
				// console.log(json);
			})}
		>
			<TextInput
				withAsterisk
				label="Reddit username to search from"
				{...form.getInputProps("username")}
			/>
			<Button type="submit" variant="transparent" />
		</form>
	);
}
