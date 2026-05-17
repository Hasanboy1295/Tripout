import React from 'react';
import { Stack, Typography, Box, Divider } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Property } from '../../types/property/property';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'next-i18next';

interface PropertyCardType {
	property: Property;
	likePropertyHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
	const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const imagePath: string = property?.propertyImages[0]
		? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
		: '/img/banner/header1.svg';


		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/property/detail',
							query: { id: property?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{/* Rating badge */}
					<div className={'rating-badge'}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="#e8a54b">
							<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
						</svg>
						<span>4.9</span>
					</div>
				</Stack>
				<Stack className="bottom">
					<Stack className="name">
						<Link
							href={{
								pathname: '/property/detail',
								query: { id: property?._id },
							}}
						>
							<Typography className="title">{property.propertyTitle}</Typography>
						</Link>
					</Stack>
					<Stack className="address-row">
						<div className="location">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#e8a54b"/>
							</svg>
							<span>{property.propertyAddress}, {property.propertyLocation}</span>
						</div>
						<IconButton
							className="heart-btn"
							size="small"
							onClick={() => likePropertyHandler(user, property?._id)}
						>
							{myFavorites ? (
								<FavoriteIcon sx={{ fontSize: 18, color: '#e8a54b' }} />
							) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon sx={{ fontSize: 18, color: '#e8a54b' }} />
							) : (
								<FavoriteBorderIcon sx={{ fontSize: 18, color: '#e8a54b' }} />
							)}
						</IconButton>
					</Stack>
					<Divider sx={{ my: '10px' }} />
					<Stack className="bottom-row">
						<div className="days">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" fill="#e8a54b"/>
							</svg>
							<span>{property?.propertyRooms} {t('dest_card_days')}</span>
						</div>
						<div className="price">
							<span className="label">{t('dest_card_start_from')} </span>
							<span className="amount">${formatterStr(property?.propertyPrice)}</span>
						</div>
					</Stack>
				</Stack>
			</Stack>
		);
};

export default PropertyCard;
