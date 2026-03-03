import React, { useEffect, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Button } from '@mui/material';
import HeaderFilter from '../homepage/HeaderFilter';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const [currentSlide, setCurrentSlide] = useState(0);

		const heroSlides = [
			'/img/banner/hero-travel-1.jpg',
			'/img/banner/hero-travel-2.jpg',
			'/img/banner/hero-travel-3.jpg',
		];

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/
		const handlePrevSlide = () => {
			setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
		};
		const handleNextSlide = () => {
			setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
		};

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
						<title>Tripout</title>
						<meta name={'title'} content={`Tripout`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack className={'header-main'}>
							<div className={'hero-wrapper'}>
								{/* Hero Background Image */}
								<div
									className={'hero-bg'}
									style={{ backgroundImage: `url(${heroSlides[currentSlide]})` }}
								>
									<div className={'hero-overlay'} />
								</div>

								{/* Hero Content */}
								<div className={'hero-content'}>
									<div className={'hero-text'}>
										<span className={'hero-subtitle'}>
											<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
											</svg>
											Its Time To Travel
										</span>
										<h1 className={'hero-title'}>
											Discover Your Next<br/>Adventure Today!
										</h1>
										<p className={'hero-desc'}>
											Explore breathtaking destinations around the world and create unforgettable
											memories with our curated travel experiences.
										</p>
										<div className={'hero-buttons'}>
											<Button className={'explore-btn'} onClick={() => {}}>
												EXPLORE MORE
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
												</svg>
											</Button>
											<div className={'play-btn'}>
												<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M8 5V19L19 12L8 5Z" fill="#e8a54b"/>
												</svg>
											</div>
										</div>
									</div>
								</div>

								{/* Navigation Arrows */}
								<div className={'hero-nav'}>
									<div className={'nav-arrow prev'} onClick={handlePrevSlide}>
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
									<div className={'nav-arrow next'} onClick={handleNextSlide}>
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
								</div>
							</div>

							{/* Search Bar */}
							<Stack className={'container'}>
								<HeaderFilter />
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

export default withLayoutMain;
