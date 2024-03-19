"use client";

import type { ReactNode } from "react";

export default function CardGrid({ children }: { children: ReactNode }) {
	return (
		<div className="mt-2 grid h-full grid-cols-fluid justify-items-center gap-2">
			{children}
		</div>
	);
}
