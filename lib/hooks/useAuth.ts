"use client";

import useLocalStorage from "use-local-storage";

export function useAuth() {
	const [consumerKey, setConsumerKey] = useLocalStorage("consumer_key", '""');
	const [consumerSecret, setConsumerSecret] = useLocalStorage(
		"consumer_secret",
		'""'
	);
	const [token, setToken] = useLocalStorage("token", '""');
	const [tokenSecret, setTokenSecret] = useLocalStorage("token_secret", '""');

	return {
		consumerKey,
		setConsumerKey,
		consumerSecret,
		setConsumerSecret,
		token,
		setToken,
		tokenSecret,
		setTokenSecret
	};
}
