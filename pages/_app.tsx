import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { socketVar } from '../apollo/store';
// WebSocket URL (adjust if needed)
const WS_URL = process.env.NEXT_PUBLIC_API_CHAT_WS || 'ws://localhost:3007/chat';
import { light, dark } from '../scss/MaterialTheme';
import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import type { UserConfig } from 'next-i18next';
import { themeVar } from '../apollo/store';
import nextI18NextConfig from '../next-i18next.config';
import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';


const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);
	const themeMode = useReactiveVar(themeVar);
	const [theme, setTheme] = useState(createTheme(light));
	const [hasTriedFallbackWs, setHasTriedFallbackWs] = useState(false);


	useEffect(() => {
		const savedTheme = localStorage.getItem('themeMode');
		if (savedTheme === 'dark') {
			themeVar('dark');
		} else {
			themeVar('light');
		}
	}, []);

	useEffect(() => {
		setTheme(createTheme(themeMode === 'dark' ? dark : light));
		localStorage.setItem('themeMode', themeMode);
		if (themeMode === 'dark') {
			document.body.classList.add('dark-mode');
		} else {
			document.body.classList.remove('dark-mode');
		}
	}, [themeMode]);

	useEffect(() => {
		// Only run on client
		if (typeof window !== 'undefined') {
			if (!WS_URL) return;
			// Only create socket if not already set
			const existingSocket = socketVar();
			if (!existingSocket || existingSocket.readyState > 1) {
				const ws = new window.WebSocket(WS_URL);
				ws.onerror = () => {
					if (hasTriedFallbackWs) return;
					try {
						const fallbackWsUrl = new URL(WS_URL);
						fallbackWsUrl.pathname = '';
						fallbackWsUrl.search = '';
						fallbackWsUrl.hash = '';
						setHasTriedFallbackWs(true);
						socketVar(new window.WebSocket(fallbackWsUrl.toString()));
					} catch (error) {
						console.log('Chat WS fallback failed:', error);
					}
				};
				socketVar(ws);
			}
		}
		// Optionally: cleanup on unmount
		return () => {
			const socket = socketVar();
			if (socket && socket.readyState === 1) {
				socket.close();
			}
		};
	}, [hasTriedFallbackWs]);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App, nextI18NextConfig as UserConfig);
