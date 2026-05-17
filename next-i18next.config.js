// module.exports = {
// 	i18n: {
// 		defaultLocale: 'en',
// 		locales: ['en', 'kr', 'ru'],
// 		localeDetection: false,
// 	},
// 	reloadOnPrerender: process.env.NODE_ENV === 'development',
// };

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'kr', 'ru'],
    localeDetection: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};