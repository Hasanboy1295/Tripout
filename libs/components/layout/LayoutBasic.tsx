import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '',
				breadcrumbCurrent = '';

			switch (router.pathname) {
				case '/property':
					title = 'Destination List';
					desc = 'Curated escapes and unforgettable routes';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Destination';
					break;
					
				case '/agent':
					title = 'Agents';
					desc = 'Meet trusted travel experts ready to guide your trip';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Agents';
					break;
				case '/agent/detail':
					title = 'Agent Profile';
					desc = 'Learn more about your travel specialist';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Agent Detail';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Manage your account and saved plans';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'My Page';
					break;
				case '/about':
					title = 'About Us';
					desc = 'Learn more about the team behind your trips';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'About Us';
					break;
				case '/community':
					title = 'Community';
					desc = 'Stories, ideas, and travel conversations';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Community';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Read the latest travel discussion';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Community Detail';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'CS';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Authentication Process';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Login/Signup';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Discover profile details and activity';
					bgImage = '/img/banner/hero-travel-1.jpg';
					breadcrumbCurrent = 'Member Page';
					break;
				default:
					break;
			}

			return { title, desc, bgImage, breadcrumbCurrent };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Nestar</title>
						<meta name={'title'} content={`Nestar`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'} ${router.pathname === '/property' ? 'destination-header' : ''}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								boxShadow: router.pathname === '/property'
									? 'inset 10px 40px 150px 40px rgba(0, 0, 0, 0.35)'
									: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<span className={'eyebrow'}>Plan Your Next Journey</span>
								<strong>{t(memoizedValues.title)}</strong>
								<span className={'header-desc'}>{t(memoizedValues.desc)}</span>
								<span className="breadcrumb">
									<span className="breadcrumb-home">HOME</span>
									<span className="breadcrumb-sep"> / </span>
									<span className="breadcrumb-current">{t(memoizedValues.breadcrumbCurrent || memoizedValues.title)}</span>
								</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
