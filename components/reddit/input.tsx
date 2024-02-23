'use client';

import { useRef, useEffect } from 'react';
import { useStore } from '~/lib/providers/StoreProvider';

export default function RedditInput() {
	const ref = useRef<HTMLInputElement | null>(null);
	const setUsername = useStore((state) => state.setUsername);

	useEffect(() => {
		// https://github.com/pacocoursey/cmdk
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				ref.current?.focus();
			}
		};

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, []);

	useEffect(() => {
		const inputRef = ref.current;

		const onChange = () => {
			if (inputRef?.value) {
				setUsername(inputRef.value);
			}
		};

		inputRef?.addEventListener('change', onChange);
		return () => inputRef?.removeEventListener('change', onChange);
	}, [setUsername]);

	return (
		<div className='relative'>
			<input type='text' placeholder='Reddit username' className='input input-sm input-bordered w-[256px]' ref={ref} />
			<kbd className='kbd-sm absolute right-1 top-1.5 select-none'>⌘ + k</kbd>
		</div>
	);
}
