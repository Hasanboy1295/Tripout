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
import { useTranslation } from 'next-i18next';
import { REACT_APP_API_URL } from '../../config';

interface TrendPropertiesProps {
	initialInput: PropertiesInquiry;
}

const TrendProperties = (props: TrendPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
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

	const goToPropertyDetail = (id: string) => {
		router.push(`/property/detail?id=${id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'trend-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>{t('trending_tours')}</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'trend-destination-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{trendProperties.map((property, idx) => (
								<SwiperSlide key={idx} className={'trend-destination-slide'}>
									<div 
										className={`destination-card ${idx === 1 ? 'featured' : ''}`}
										onClick={() => goToPropertyDetail(property._id)}
									>
										<div className={'dest-img-wrap'}>
											<img src={`${REACT_APP_API_URL}/${property?.propertyImages?.[0]}`} alt={property.propertyTitle} />
										</div>
										<div className={'dest-info'}>
											<span className={'dest-name'}>{property.propertyTitle}</span>
											<span className={'dest-visitors'}>{property.propertyViews} {t('people_visit')}</span>
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
							{t('trending_tours')}
						</span>
						<h2 className={'section-title'}>{t('explore_adventures_await')}</h2>
					</Stack>

					{/* Destination Grid */}
					<Stack className={'destination-grid'}>
						{trendProperties.map((property, idx) => (
							<div
								key={property._id}
								className={`destination-card ${idx === 1 ? 'featured' : ''}`}
								onClick={() => goToPropertyDetail(property._id)}
								style={{ cursor: 'pointer' }}
							>
								<div className={'dest-img-wrap'}>
									<img src={`${REACT_APP_API_URL}/${property?.propertyImages?.[0]}`} alt={property.propertyTitle} />
								</div>
								<div className={'dest-info'}>
									<span className={'dest-name'}>{property.propertyTitle}</span>
									<span className={`dest-visitors ${idx === 1 ? 'featured' : ''}`}>
										{property.propertyViews} {t('people_visit')}
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
							{t('see_more')}
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
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default TrendProperties;
