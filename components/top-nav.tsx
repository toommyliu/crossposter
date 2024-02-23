"use client";

import { useEffect, useState } from "react";
import ThemeController from "./theme-controller";
import { useLocalStorage } from "usehooks-ts";
import { type TumblrUser, getUserInfo } from "~/lib/tumblr";
import Image from "next/image";
import toast from "react-hot-toast";

function TumblrModal() {
	const [consumerKey, setConsumerKey] = useLocalStorage<string | null>(
		"consumer_key",
		null
	);
	const [consumerSecret, setConsumerSecret] = useLocalStorage<string | null>(
		"consumer_secret",
		null
	);
	const [token, setToken] = useLocalStorage<string | null>("token", null);
	const [tokenSecret, setTokenSecret] = useLocalStorage<string | null>(
		"token_secret",
		null
	);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		for (let i = 1; i < 5; ++i) {
			const input = document.querySelector(
				`#sign_in_modal > div > div > label:nth-child(${i}) > input`
			);

			if (input) {
				// @ts-expect-error
				const { value } = input;

				switch (i) {
					// consumer key
					case 1:
						setConsumerKey(value);
						break;
					// consumer secret
					case 2:
						setConsumerSecret(value);
						break;
					// token
					case 3:
						setToken(value);
						break;
					// token secret
					case 4:
						setTokenSecret(value);
						break;
				}

				// @ts-expect-error
				input.value = "";
			}
		}

		// @ts-expect-error
		document!.getElementById("sign_in_modal")!.close();
	};

	return (
		<dialog id="sign_in_modal" className="modal">
			<div className="modal-box">
				<h3 className="font-bold text-lg">Tumblr OAuth Connection</h3>
				<div className="mt-5 space-y-5">
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Consumer key</span>
						</div>
						<input
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
					</label>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Consumer secret</span>
						</div>
						<input
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
					</label>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Token</span>
						</div>
						<input
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
					</label>
					<label className="form-control w-full max-w-xs">
						<div className="label">
							<span className="label-text">Token secret</span>
						</div>
						<input
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
					</label>
				</div>
				<div className="mt-5">
					<div>
						<span className="italic">
							Warning: All keys are stored locally!
						</span>
					</div>
					<div>
						<a
							className="link"
							onClick={() =>
								window.open(
									"https://api.tumblr.com/console/calls/user/info",
									"",
									"noreferrer noopener"
								)
							}
						>
							Need help?
						</a>
					</div>
				</div>
				<div className="modal-action">
					<form method="dialog" onSubmit={handleSubmit}>
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
							✕
						</button>
						<button className="btn btn-primary" type="submit">
							Submit
						</button>
					</form>
				</div>
			</div>
		</dialog>
	);
}

function AvatarPlaceholder(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			{...props}
			data-avatar-placeholder-icon
			viewBox="0 0 15 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z"
				fill="currentColor"
				fillRule="evenodd"
				clipRule="evenodd"
			/>
		</svg>
	);
}

export default function TopNav() {
	const [consumerKey, setConsumerKey] = useLocalStorage<string | null>(
		"consumer_key",
		null
	);
	const [consumerSecret, setConsumerSecret] = useLocalStorage<string | null>(
		"consumer_secret",
		null
	);
	const [token, setToken] = useLocalStorage<string | null>("token", null);
	const [tokenSecret, setTokenSecret] = useLocalStorage<string | null>(
		"token_secret",
		null
	);
	const [user, setUser] = useState<TumblrUser["user"] | null>(null);

	useEffect(() => {
		async function load() {
			const data = await getUserInfo({
				consumerKey: consumerKey!,
				consumerSecret: consumerSecret!,
				token: token!,
				tokenSecret: tokenSecret!,
			});

			if (!data) {
				toast(
					"uh oh! failed to authenticate. are your credentials valid?",
					{ icon: "🚨" }
				);
				// TODO: toast
				return;
			}

			setUser(data.user);
			toast(`hello, ${data.user.name}!`, {
				icon: "👋",
			});
		}

		if (consumerKey && consumerSecret && token && tokenSecret) {
			load();
		}

		console.log(consumerKey, consumerSecret, token, tokenSecret);

		return () => {};
	}, [consumerKey, consumerSecret, token, tokenSecret]);

	const handleSignOut = () => {
		setConsumerKey(null);
		setConsumerSecret(null);
		setToken(null);
		setTokenSecret(null);
		setUser(null);

		toast("goodbye!", { icon: "👋" });
	};

	return (
		<>
			<TumblrModal />
			<div className="navbar">
				<div className="flex-1">
					<span className="text-xl font-bold mx-3">Crossposter</span>
					{!!user && (
						<div className="flex justify-center items-center mx-auto">
							<select className="select select-bordered w-full max-w-xs select-sm">
								{user.blogs.map((blog) => {
									return (
										<option
											key={blog.name}
											value={blog.name}
										>
											{blog.name} ({blog.title})
										</option>
									);
								})}
							</select>
						</div>
					)}
				</div>
				{/* <div className="flex-2 mx-5">
				<ThemeController />
				</div> */}
				<div className="flex-none gap-2">
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full">
								{!!user ? (
									<Image
										src={user.blogs[0].avatar[3].url}
										alt={user.name}
										width={40}
										height={40}
										priority
									/>
								) : (
									<AvatarPlaceholder />
								)}
							</div>
						</div>
						<ul
							tabIndex={0}
							className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
						>
							{!!user ? (
								<>
									<li>
										<span>{user.name}</span>
									</li>
									<li>
										<span onClick={handleSignOut}>
											Sign out
										</span>
									</li>
								</>
							) : (
								<li>
									<span
										onClick={() =>
											document!
												.getElementById(
													"sign_in_modal"
												)!
												// @ts-expect-error
												.showModal()
										}
									>
										Sign in
									</span>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}
