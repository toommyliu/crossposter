import type { TumblrCfg } from "./tumblr";

export function isTumblrCfgValid(cfg: TumblrCfg): cfg is Required<TumblrCfg> {
	return (
		cfg.consumerKey !== null &&
		cfg.consumerSecret !== null &&
		cfg.token !== null &&
		cfg.tokenSecret !== null
	);
}
