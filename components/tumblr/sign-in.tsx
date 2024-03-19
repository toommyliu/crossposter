"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "dotenv";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "~/lib/hooks/useAuth";
import { useStore } from "~/lib/providers/StoreProvider";
import { getUserInfo } from "~/lib/tumblr";

type EnvFormat = {
	CONSUMER_KEY: string;
	CONSUMER_SECRET: string;
	TOKEN: string;
	TOKEN_SECRET: string;
};

const formSchema = z.object({
	consumerKey: z.string().length(50),
	consumerSecret: z.string().length(50),
	token: z.string().length(50),
	tokenSecret: z.string().length(50)
});

export default function TumblrSignIn() {
	const { tumblrUser, setTumblrUser } = useStore((store) => store);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			consumerKey: "",
			consumerSecret: "",
			token: "",
			tokenSecret: ""
		}
	});

	const [open, setOpen] = useState(false);

	const {
		consumerKey,
		consumerSecret,
		token,
		tokenSecret,
		setConsumerKey,
		setConsumerSecret,
		setToken,
		setTokenSecret
	} = useAuth();

	useEffect(() => {
		async function get() {
			const res = await getUserInfo({
				consumerKey,
				consumerSecret,
				token,
				tokenSecret
			}).catch(() => null);

			if (res) {
				setTumblrUser(res);
			}
		}

		if (
			consumerKey &&
			consumerSecret &&
			token &&
			tokenSecret &&
			!tumblrUser
		) {
			get();
		}
	}, [
		tumblrUser,
		setTumblrUser,
		consumerKey,
		consumerSecret,
		token,
		tokenSecret
	]);

	const handlePaste = async () => {
		const content = await navigator.clipboard.read().catch(() => {
			toast.error("no permissions given.");
			return null;
		});

		if (!content) {
			return;
		}

		const text = await (await content[0].getType("text/plain")).text();
		const res = parse<EnvFormat>(text);

		if (
			res?.CONSUMER_KEY?.length === 50 &&
			res?.CONSUMER_SECRET?.length === 50 &&
			res?.TOKEN?.length === 50 &&
			res?.TOKEN_SECRET?.length === 50
		) {
			form.setValue("consumerKey", res.CONSUMER_KEY);
			form.setValue("consumerSecret", res.CONSUMER_SECRET);
			form.setValue("token", res.TOKEN);
			form.setValue("tokenSecret", res.TOKEN_SECRET);
		} else {
			toast.error("clipboard contents don't match the expected format.");
		}
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		const { consumerKey, consumerSecret, token, tokenSecret } = values;

		setConsumerKey(consumerKey);
		setConsumerSecret(consumerSecret);
		setToken(token);
		setTokenSecret(tokenSecret);

		form.resetField("consumerKey");
		form.resetField("consumerSecret");
		form.resetField("token");
		form.resetField("tokenSecret");

		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>sign in</Button>
			</DialogTrigger>
			<DialogContent>
				<span className="text-xl font-bold">sign in to tumblr</span>
				<a
					href="https://api.tumblr.com/console/calls/user/info"
					target="_blank"
					rel="noreferrer noopener"
					className="font-italic block text-sm text-gray-500"
				>
					need help?
				</a>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-2"
					>
						<FormField
							control={form.control}
							name="consumerKey"
							render={({ field }) => (
								<FormItem>
									<FormLabel>consumer key</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="consumerSecret"
							render={({ field }) => (
								<FormItem>
									<FormLabel>consumer secret</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="token"
							render={({ field }) => (
								<FormItem>
									<FormLabel>token</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tokenSecret"
							render={({ field }) => (
								<FormItem>
									<FormLabel>token secret</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="space-x-2">
							<Button type="submit" className="mt-2">
								submit
							</Button>
							<Button
								variant="secondary"
								type="button"
								onClick={handlePaste}
								className="mt-2"
							>
								paste (env format)
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
