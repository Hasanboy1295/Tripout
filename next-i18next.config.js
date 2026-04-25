module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'kr', 'ru', 'uz'],
		localeDetection: false,
	},
	reloadOnPrerender: process.env.NODE_ENV === 'development',
};
