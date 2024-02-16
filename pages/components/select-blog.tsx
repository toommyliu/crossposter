import { Select } from "@mantine/core";
import { store } from "../../store";

export default function SelectBlog() {
	const setBlog = store((state) => state.setBlog);
	return (
		<Select
			label="Tumblr blog to post to"
			defaultValue={""}
			data={["blog 1", "blog 2", "blog 3"]}
			onChange={(value) => {
				if (value) {
					setBlog(value);
				}
			}}
		/>
	);
}
