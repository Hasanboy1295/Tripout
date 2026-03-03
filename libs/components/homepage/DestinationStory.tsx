import React, { useRef } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

const destinations = [
	{
		id: 1,
		title: 'Explore Beautiful Greece Today',
		image: '/img/destinations/greece.jpg',
		featured: false,
	},
	{
		id: 2,
		title: 'Discover Santorini',
		image: '/img/destinations/santorini.jpg',
		featured: true,
	},
	{
		id: 3,
		title: 'Ancient Wonders of Turkey',
		image: '/img/destinations/turkey.jpg',
		featured: false,
	},
	{
		id: 4,
		title: 'Malta Coastal Views',
		image: '/img/destinations/malta.jpg',
		featured: false,
	},
	{
		id: 5,
		title: 'Paris City of Lights',
		image: '/img/destinations/paris.jpg',
		featured: false,
	},
];

const DestinationStory = () => {
	const device = useDeviceDetect();
	const prevRef = useRef<HTMLDivElement>(null);
	const nextRef = useRef<HTMLDivElement>(null);

	if (device === 'mobile') {
		return (
			<Stack className={'destination-story'}>
				<div className={'story-header'}>
					<div className={'story-header-left'}>
						<div className={'section-subtitle'}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
							</svg>
							<span>Destination Story</span>
						</div>
						<h2 className={'story-title'}>Uncover the Magic of Each Destination</h2>
					</div>
				</div>
				<Swiper
					className={'story-swiper'}
					slidesPerView={'auto'}
					spaceBetween={16}
					modules={[Navigation]}
				>
					{destinations.map((dest) => (
						<SwiperSlide key={dest.id} className={'story-slide'}>
							<div className={'story-card'}>
								<img src={dest.image} alt={dest.title} />
								<div className={'story-card-overlay'}>
									<p>{dest.title}</p>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</Stack>
		);
	} else {
		return (
			<Stack className={'destination-story'}>
				{/* Header Row */}
				<div className={'story-header'}>
					<div className={'story-header-left'}>
						<div className={'section-subtitle'}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
							</svg>
							<span>Destination Story</span>
						</div>
						<h2 className={'story-title'}>
							Uncover the Magic of<br />Each Destination
						</h2>
					</div>
					<div className={'story-nav'}>
						<div className={'nav-btn prev'} ref={prevRef}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
						<div className={'nav-btn next'} ref={nextRef}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</div>
					</div>
				</div>

				{/* Swiper */}
				<Swiper
					className={'story-swiper'}
					slidesPerView={'auto'}
					spaceBetween={20}
					centeredSlides={false}
					modules={[Navigation]}
					navigation={{
						prevEl: prevRef.current,
						nextEl: nextRef.current,
					}}
					onSwiper={(swiper: any) => {
						setTimeout(() => {
							if (swiper.params?.navigation && typeof swiper.params.navigation !== 'boolean') {
								swiper.params.navigation.prevEl = prevRef.current;
								swiper.params.navigation.nextEl = nextRef.current;
								swiper.navigation.init();
								swiper.navigation.update();
							}
						});
					}}
				>
					{destinations.map((dest, index) => (
						<SwiperSlide key={dest.id} className={`story-slide ${dest.featured ? 'featured' : ''}`}>
							<div className={'story-card'}>
								<img src={dest.image} alt={dest.title} />
								{dest.featured && (
									<div className={'story-card-overlay'}>
										<div className={'link-icon'}>
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</div>
										<p>{dest.title}</p>
									</div>
								)}
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</Stack>
		);
	}
};

export default DestinationStory;
