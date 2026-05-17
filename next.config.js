/** @type {import('next').NextConfig} */
const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
const apiGraphqlUrl = process.env.REACT_APP_API_GRAPHQL_URL || process.env.NEXT_PUBLIC_API_GRAPHQL_URL;
const apiWsUrl = process.env.REACT_APP_API_WS || process.env.NEXT_PUBLIC_API_WS;

const nextConfig = {
	reactStrictMode: true,
	env: {
		REACT_APP_API_URL: apiUrl,
		REACT_APP_API_GRAPHQL_URL: apiGraphqlUrl,
		REACT_APP_API_WS: apiWsUrl,
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || apiUrl,
		NEXT_PUBLIC_API_GRAPHQL_URL: process.env.NEXT_PUBLIC_API_GRAPHQL_URL || apiGraphqlUrl,
		NEXT_PUBLIC_API_WS: process.env.NEXT_PUBLIC_API_WS || apiWsUrl,
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;
