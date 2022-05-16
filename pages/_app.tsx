import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { FirebaseWrapper } from '../store/firebase';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<NextUIProvider>
			<FirebaseWrapper>
				<Component {...pageProps} />
			</FirebaseWrapper>
		</NextUIProvider>
	);
}

export default MyApp;
