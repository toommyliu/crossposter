import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function log(...inputs: unknown[]) {
	console.log(`[${dayjs().format("ddd YYYY-MM-DD hh:mm:ss A")}]`, ...inputs);
}
