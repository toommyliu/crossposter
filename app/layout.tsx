import '~/styles/globals.css';
import { StoreProvider } from '~/lib/providers/StoreProvider';
import { Toaster } from 'react-hot-toast';

export const metadata = {
	title: 'Crossposter',
	description: 'Easily crosspost from Reddit to Tumblr',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<meta name='viewport' content='initial-scale=1, width=device-width' />
			</head>
			<body>
				<StoreProvider>{children}</StoreProvider>
				<Toaster position='bottom-right' reverseOrder={true} />
			</body>
		</html>
	);
}
