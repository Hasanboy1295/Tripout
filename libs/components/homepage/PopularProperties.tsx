import React, { useState } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularPropertyCard from './PopularPropertyCard';
import { Property } from '../../types/property/property';
import { PropertiesInquiry } from '../../types/property/property.input';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { useTranslation } from 'next-i18next';

interface PopularPropertiesProps {
	initialInput: PropertiesInquiry;
}

const PopularProperties = (props: PopularPropertiesProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const [popularProperties, setPopularProperties] = useState<Property[]>([]);

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
			setPopularProperties(data?.getProperties?.list);
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

			await getPropertiesRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!popularProperties) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>{t('popular_tour')}</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularProperties.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'popular-property-slide'}>
										<PopularPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-properties'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<div className={'section-subtitle'}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
							</svg>
							<span>{t('popular_tour')}</span>
						</div>
						<h2 className={'section-title'}>{t('discover_next_adventure')}</h2>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-property-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
								clickable: true,
							}}
						>
							{popularProperties.map((property: Property) => {
								return (
									<SwiperSlide key={property._id} className={'popular-property-slide'}>
										<PopularPropertyCard property={property} likePropertyHandler={likePropertyHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					<Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularProperties.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProperties;
