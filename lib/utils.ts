import type { TumblrCfg } from "./tumblr";

export function isTumblrCfgValid(cfg: TumblrCfg): cfg is ValidTumblrCfg {
	return (
		cfg.consumerKey !== null &&
		cfg.consumerSecret !== null &&
		cfg.token !== null &&
		cfg.tokenSecret !== null
	);
}

export function parseConfig(cfg: TumblrCfg) {
	return {
		consumer_key: cfg.consumerKey!,
		consumer_secret: cfg.consumerSecret!,
		token: cfg.token!,
		token_secret: cfg.tokenSecret!,
	};
}

type ValidTumblrCfg = {
	consumerKey: string;
	consumerSecret: string;
	token: string;
	tokenSecret: string;
};