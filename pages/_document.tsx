import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				   <meta name="robots" content="index,follow" />
				   <link rel="icon" type="image/png" href="/img/logo/logo.svg" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
