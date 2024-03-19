"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore as useZustandStore } from "zustand";

import { type StoreState, createStore, initStore } from "~/lib/stores/store";

export const StoreContext = createContext<StoreApi<StoreState> | null>(null);

export interface StoreProviderProps {
	children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
	const storeRef = useRef<StoreApi<StoreState>>();
	if (!storeRef.current) {
		storeRef.current = createStore(initStore());
	}

	return (
		<StoreContext.Provider value={storeRef.current}>
			{children}
		</StoreContext.Provider>
	);
};

export function useStore<T>(selector: (store: StoreState) => T): T {
	const storeContext = useContext(StoreContext);

	if (!storeContext) {
		throw new Error("useStore must be use within StoreContext!");
	}

	return useZustandStore(storeContext, selector);
}
