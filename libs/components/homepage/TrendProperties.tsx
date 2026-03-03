import React, { useState } from 'react';
import { Stack, Box, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useRouter } from 'next/router';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const trendingDestinations = [
	{ name: 'Miami', visitors: '4,874', image: '/img/banner/destinations/miami.jpg' },
	{ name: 'Singapore', visitors: '5,784', image: '/img/banner/destinations/singapore.jpg', featured: true },
	{ name: 'Goa', visitors: '8,748', image: '/img/banner/destinations/goa.jpg' },
	{ name: 'Tokyo', visitors: '2,987', image: '/img/banner/destinations/tokyo.jpg' },
	{ name: 'Bali', visitors: '9,987', image: '/img/banner/destinations/bali.jpg' },
	{ name: 'Roma', visitors: '6,874', image: '/img/banner/destinations/roma.jpg' },
	{ name: 'Paris', visitors: '2,984', image: '/img/banner/destinations/paris.jpg' },
	{ name: 'Greece', visitors: '3,698', image: '/img/banner/destinations/greece.jpg' },
];

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [trendProperties, setTrendProperties] = useState<Property[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendProperties(data?.getProperties?.list);
		},
	});
	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProperty({
				variables: { input: id },
			});

			getPropertiesRefetch({input: initialInput})

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then;
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Trending Destinations</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'trend-destination-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{trendingDestinations.map((dest, idx) => (
								<SwiperSlide key={idx} className={'trend-destination-slide'}>
									<div className={`destination-card ${dest.featured ? 'featured' : ''}`}>
										<div className={'dest-img-wrap'}>
											<img src={dest.image} alt={dest.name} />
										</div>
										<div className={'dest-info'}>
											<span className={'dest-name'}>{dest.name}</span>
											<span className={'dest-visitors'}>{dest.visitors} People Visit</span>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					{/* Section Header */}
					<Stack className={'section-header'}>
						<span className={'section-subtitle'}>
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
							</svg>
							Trending Destination
						</span>
						<h2 className={'section-title'}>Explore the World Adventures Await</h2>
					</Stack>

					{/* Destination Grid */}
					<Stack className={'destination-grid'}>
						{trendingDestinations.map((dest, idx) => (
							<div
								key={idx}
								className={`destination-card ${dest.featured ? 'featured' : ''}`}
							>
								<div className={'dest-img-wrap'}>
									<img src={dest.image} alt={dest.name} />
								</div>
								<div className={'dest-info'}>
									<span className={'dest-name'}>{dest.name}</span>
									<span className={`dest-visitors ${dest.featured ? 'featured' : ''}`}>
										{dest.visitors} People Visit
									</span>
								</div>
							</div>
						))}
					</Stack>

					{/* See More Button */}
					<Stack className={'see-more-wrap'}>
						<Button
							className={'see-more-btn'}
							onClick={() => router.push('/property')}
						>
							SEE MORE
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M7 17L17 7M17 7H7M17 7V17" stroke="#e8a54b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</Button>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
