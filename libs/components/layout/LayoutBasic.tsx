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
					   title = 'destination_title';
					   desc = 'destination_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'destination_breadcrumb';
					   break;
				   case '/agent':
					   title = 'agents_title';
					   desc = 'agents_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'agents_breadcrumb';
					   break;
				   case '/agent/detail':
					   title = 'agent_profile_title';
					   desc = 'agent_profile_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'agent_profile_breadcrumb';
					   break;
				   case '/mypage':
					   title = 'mypage_title';
					   desc = 'mypage_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'mypage_breadcrumb';
					   break;
				   case '/about':
					   title = 'aboutus_title';
					   desc = 'aboutus_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'aboutus_breadcrumb';
					   break;
				   case '/community':
					   title = 'community_title';
					   desc = 'community_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'community_breadcrumb';
					   break;
				   case '/community/detail':
					   title = 'community_detail_title';
					   desc = 'community_detail_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'community_detail_breadcrumb';
					   break;
				   case '/cs':
					   title = 'cs_title';
					   desc = 'cs_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'cs_breadcrumb';
					   break;
				   case '/account/join':
					   title = 'login_signup_title';
					   desc = 'login_signup_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'login_signup_breadcrumb';
					   setAuthHeader(true);
					   break;
				   case '/member':
					   title = 'member_title';
					   desc = 'member_desc';
					   bgImage = '/img/banner/hero-travel-1.jpg';
					   breadcrumbCurrent = 'member_breadcrumb';
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
						<title>Tripout</title>
						<meta name={'title'} content={`Tripout`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`mobile-banner ${authHeader ? 'auth' : ''}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
							}}
						>
							<div className={'mobile-banner-overlay'} />
							<Stack className={'mobile-banner-inner'}>
								<span className={'mobile-eyebrow'}>{t('plan_your_next_journey')}</span>
								<strong>{t(memoizedValues.title)}</strong>
								<span className={'mobile-banner-desc'}>{t(memoizedValues.desc)}</span>
								<span className={'mobile-breadcrumb'}>
									<span>{t('Home')}</span>
									<span className={'sep'}>/</span>
									<span className={'current'}>{t(memoizedValues.breadcrumbCurrent || memoizedValues.title)}</span>
								</span>
							</Stack>
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
								   <span className={'eyebrow'}>{t('plan_your_next_journey')}</span>
								   <strong>{t(memoizedValues.title)}</strong>
								   <span className={'header-desc'}>{t(memoizedValues.desc)}</span>
								   <span className="breadcrumb">
									   <span className="breadcrumb-home">{t('Home')}</span>
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
