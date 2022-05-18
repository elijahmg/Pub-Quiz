import Document, { Html, Main, NextScript, DocumentContext, Head } from 'next/document';
import { Text } from '@nextui-org/react';
import { CssBaseline } from '@nextui-org/react';
import { Fragment } from 'react';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx);
		return {
			...initialProps,
			styles: [<Fragment key={1}>{initialProps.styles}</Fragment>]
		};
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					{CssBaseline.flush()}
					<title>Pub Quiz</title>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
				<footer
					style={{
						textAlign: 'center',
						margin: '1rem 0'
					}}
				>
					<Text color="$gray500" small>
						Created by{' '}
						<Text b color="$gray500">
							Ilya F
						</Text>
					</Text>
				</footer>
			</Html>
		);
	}
}

export default MyDocument;
