import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { FirebaseWrapper } from '../store/firebase';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || (page => page);

	return (
		<NextUIProvider>
			<FirebaseWrapper>{getLayout(<Component {...pageProps} />)}</FirebaseWrapper>
		</NextUIProvider>
	);
}

export default MyApp;
