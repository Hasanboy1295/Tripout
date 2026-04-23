import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/property/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Property } from '../../libs/types/property/property';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import StarIcon from '@mui/icons-material/Star';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShareIcon from '@mui/icons-material/Share';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { T } from '../../libs/types/common';
import { GET_COMMENTS, GET_PROPERTIES, GET_PROPERTY } from '../../apollo/user/query';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyDetail: NextPage = ({ initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [propertyId, setPropertyId] = useState<string | null>(null);
	const [property, setProperty] = useState<Property | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationProperties, setDestinationProperties] = useState<Property[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PROPERTY,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getPropertyLoading,
		data: getPropertyData,
		error: getPropertyError,
		refetch: getPropertyRefetch,
	} = useQuery(GET_PROPERTY, {
		fetchPolicy: 'network-only',
		variables: { input: propertyId },
		skip: !propertyId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperty) setProperty(data?.getProperty);
			if (data?.getProperty) setSlideImage(data?.getProperty?.propertyImages[0]);
		},
	});

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					locationList: property?.propertyLocation ? [property?.propertyLocation] : [],
				},
			},
		},
		skip: !propertyId && !property,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProperties?.list) setDestinationProperties(data?.getProperties?.list);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setPropertyComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0].total ?? 0);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setPropertyId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// execute likeTargetProperty Mutation
			await likeTargetProperty({
				variables: { input: id },
			});

			// execute getPropertiesRefetch
			await getPropertyRefetch({ input: id });
			getPropertiesRefetch({
				input: {
					page: 1,
					limit: 4,
					sort: 'createdAt',
					direction: Direction.DESC,
					search: {
						locationList: [property?.propertyLocation],
					},
				},
			});

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR: likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then;
		}
	};
	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await createComment({
				variables: { input: insertCommentData },
			});
			setInsertCommentData({
				...insertCommentData,
				commentContent: '',
			});
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};
	if(getPropertyLoading){
		return <Stack sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',width: '100%', height: '1080px'}}>
			<CircularProgress size={'4rem'}/>
		</Stack>;
	}

	if (device === 'mobile') {
		return <div>PROPERTY DETAIL PAGE</div>;
	} else {
		return (
			<div id={'property-detail-page'}>
				{/* Banner */}
				<div className={'detail-banner'}>
					<img src="/img/banner/hero-travel-1.jpg" alt="Destination Detail" />
					<div className={'banner-overlay'}>
						<h1>Destination Detail</h1>
						<div className={'breadcrumb'}>
							<Link href={'/'}>HOME</Link>
							<span>{'>'}</span>
							<Link href={'/property'}>DESTINATION</Link>
							<span>{'>'}</span>
							<span>DESTINATION DETAIL</span>
						</div>
					</div>
				</div>

				<div className={'container'}>
					<Stack className={'property-detail-config'}>
						{/* Image Gallery */}
						<Stack className={'image-gallery'}>
							<Stack className={'gallery-left'}>
								<img
									src={
										slideImage
											? `${REACT_APP_API_URL}/${slideImage}`
											: '/img/property/default-property.jpg'
									}
									alt={'property'}
									onClick={() => property?.propertyImages?.[0] && changeImageHandler(property.propertyImages[0])}
								/>
							</Stack>
							<Stack className={'gallery-right'}>
								{property?.propertyImages?.slice(1, 4).map((image: string, index: number) => (
									<Stack
										key={index}
										className={`gallery-thumb ${index === 0 ? 'top' : 'bottom'}`}
										onClick={() => changeImageHandler(image)}
									>
										<img src={`${REACT_APP_API_URL}/${image}`} alt={`thumb-${index}`} />
									</Stack>
								))}
							</Stack>
						</Stack>

						{/* Content Section */}
						<Stack className={'property-desc-config'}>
							<Stack className={'left-config'}>
								{/* Title & Meta */}
								<Stack className={'title-section'}>
									<Typography className={'property-title'}>{property?.propertyTitle}</Typography>
									<Stack className={'meta-row'}>
										<Stack className={'meta-item views'}>
											<RemoveRedEyeIcon />
											<Typography>{property?.propertyViews}</Typography>
										</Stack>
										<Stack className={'meta-item location'}>
											<LocationOnOutlinedIcon />
											<Typography>{property?.propertyLocation}</Typography>
										</Stack>
										<Stack className={'meta-item booked'}>
											<GroupOutlinedIcon />
											<Typography>{property?.propertyViews}+ Booked</Typography>
										</Stack>
										<Stack className={'action-buttons'}>
											<Button
												className={'wishlist-btn'}
												onClick={() => likePropertyHandler(user, property?._id as string)}
											>
												{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
													<FavoriteIcon sx={{ color: '#eb6753' }} />
												) : (
													<FavoriteBorderIcon />
												)}
												<Typography>Wishlist</Typography>
											</Button>
											<Button className={'share-btn'}>
												<ShareIcon />
												<Typography>Share</Typography>
											</Button>
										</Stack>
									</Stack>
								</Stack>

								{/* Description */}
								<Stack className={'description-section'}>
									<Typography className={'desc-text'}>
										{property?.propertyDesc ?? 'No Description!'}
									</Typography>
								</Stack>

								{/* Trip Info Badges */}
								<Stack className={'trip-info-badges'}>
									{/* Duration Badge */}
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											<AccessTimeIcon />
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Duration</Typography>
											<Stack direction="row" alignItems="center" gap={1}>
												<Typography className={'badge-value'}>{property?.propertyRooms || 10} Days</Typography>
												<Typography className={'badge-value'} style={{color:'#f5a623', fontWeight:600}}>
													{/* Show date range if available, else placeholder */}
													{/* {property?.startDate && property?.endDate
														? `${moment(property.startDate).format('DD.MM')} - ${moment(property.endDate).format('DD.MM')}`
														: '23.04 - 03.05'} */}
												</Typography>
											</Stack>
										</Stack>
									</Stack>
									{/* Group Size Badge */}
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											<GroupsIcon />
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Group Size</Typography>
											<Typography className={'badge-value'}>{(property?.propertyBeds ?? 0) * 3} People</Typography>
										</Stack>
									</Stack>
									{/* Ages Badge */}
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											<PersonOutlineIcon />
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Ages</Typography>
											<Typography className={'badge-value'}>18 - 65 Years</Typography>
										</Stack>
									</Stack>
									{/* Price Badge */}
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											{/* Price/Tag SVG icon */}
											<svg width="26" height="26" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
												<rect x="2" y="4" width="16" height="14" rx="3" fill="#FFF6F2" stroke="#f5a623" strokeWidth="1.5"/>
												<path d="M7 10.5C7 9.39543 7.89543 8.5 9 8.5H11C12.1046 8.5 13 9.39543 13 10.5C13 11.6046 12.1046 12.5 11 12.5H9C7.89543 12.5 7 11.6046 7 10.5Z" fill="#f5a623"/>
											</svg>
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Price</Typography>
											<Typography className={'badge-value'}>${formatterStr(property?.propertyPrice) || 880}</Typography>
										</Stack>
									</Stack>
								</Stack>

								{/* Destination Itinerary */}
								<Stack className={'itinerary-section'}>
									<Typography className={'section-title'}>Destination Itinerary</Typography>
									<Stack className={'itinerary-timeline'}>
										<Stack className={'timeline-item active'}>
											<Stack className={'timeline-dot'}></Stack>
											<Stack className={'timeline-content'}>
												<Typography className={'day-title'}>
													<strong>Day 1:</strong> Airport Pick Up & Arrival
												</Typography>
											</Stack>
										</Stack>
										<Stack className={'timeline-item expanded'}>
											<Stack className={'timeline-dot'}></Stack>
											<Stack className={'timeline-content'}>
												<Typography className={'day-title'}>
													<strong>Day 2:</strong> Temples & River Cruise
												</Typography>
												<Typography className={'day-desc'}>
													{property?.propertyDesc
														? property.propertyDesc.substring(0, 300)
														: 'Mauris volutpat ultrices iaculis. Aliquam erat volutpat. Quisque maximus luctus aliquam. Etiam maximus vel magna ac viverra. Curabitur at odio et turpis consectetur ultricies id non nulla. Aenean non maximus leo, a bibendum magna. Praesent ultrices eu diam ac eleifend.'}
												</Typography>
											</Stack>
										</Stack>
										<Stack className={'timeline-item'}>
											<Stack className={'timeline-dot'}></Stack>
											<Stack className={'timeline-content'}>
												<Typography className={'day-title'}>
													<strong>Day 3:</strong> Local Market Visit
												</Typography>
											</Stack>
										</Stack>
										<Stack className={'timeline-item'}>
											<Stack className={'timeline-dot'}></Stack>
											<Stack className={'timeline-content'}>
												<Typography className={'day-title'}>
													<strong>Day 4:</strong> Adventure Activity
												</Typography>
											</Stack>
										</Stack>
										<Stack className={'timeline-item active'}>
											<Stack className={'timeline-dot'}></Stack>
											<Stack className={'timeline-content'}>
												<Typography className={'day-title'}>
													<strong>Day 5:</strong> Hotel to Airport & Departure
	
												</Typography>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								{/* Reviews */}
								{commentTotal !== 0 && (
									<Stack className={'reviews-config'}>
										<Stack className={'review-header'}>
											<Typography className={'subtitle'}>✈ Destination Review</Typography>
											<Typography className={'main-heading'}>Real Experiences Shared</Typography>
										</Stack>
										<Stack className={'review-list'}>
											{propertyComments?.map((comment: Comment) => {
												return <Review comment={comment} key={comment?._id} />;
											})}
											<Box component={'div'} className={'pagination-box'}>
												<MuiPagination
													page={commentInquiry.page}
													count={Math.ceil(commentTotal / commentInquiry.limit)}
													onChange={commentPaginationChangeHandler}
													shape="circular"
													color="primary"
												/>
											</Box>
										</Stack>
									</Stack>
								)}

								{/* Leave Review */}
								<Stack className={'leave-review-config'}>
									<Typography className={'main-title'}>Leave A Review</Typography>
									<Typography className={'review-title'}>Review</Typography>
									<textarea
										onChange={({ target: { value } }: any) => {
											setInsertCommentData({ ...insertCommentData, commentContent: value });
										}}
										value={insertCommentData.commentContent}
									></textarea>
									<Box className={'submit-btn'} component={'div'}>
										<Button
											className={'submit-review'}
											disabled={insertCommentData.commentContent === '' || user?._id === ''}
											onClick={createCommentHandler}
										>
											<Typography className={'title'}>Submit Review</Typography>
											<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
												<g clipPath="url(#clip0_6975_3642)">
													<path
														d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
														fill="#181A20"
													/>
												</g>
												<defs>
													<clipPath id="clip0_6975_3642">
														<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
													</clipPath>
												</defs>
											</svg>
										</Button>
									</Box>
								</Stack>
							</Stack>

							{/* Right Sidebar - Trip Info & Agent Contact */}
							<Stack className={'right-config'}>

								{/* Agent Info & Contact Form */}
								<Stack className="info-box">
									<Typography className="main-title">Get More Information</Typography>
									<Stack className="image-info">
										<img
											className="member-image"
											src={
												property?.memberData?.memberImage
													? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}`
													: '/img/profile/defaultUser.svg'
											}
											alt="Agent"
										/>
										<Stack className="name-phone-listings">
											<Link href={`/member?memberId=${property?.memberData?._id}`}>
												<Typography className="name">{property?.memberData?.memberNick}</Typography>
											</Link>
											<Stack className="phone-number">
												{/* Phone SVG icon */}
												<svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
													<g clipPath="url(#clip0_6507_6774)">
														<path d="M16.2858 10.11L14.8658 8.69C14.5607 8.39872 14.1551 8.23619 13.7333 8.23619C13.3115 8.23619 12.9059 8.39872 12.6008 8.69L12.1008 9.19C11.7616 9.528 11.3022 9.71778 10.8233 9.71778C10.3444 9.71778 9.88506 9.528 9.54582 9.19C9.16082 8.805 8.91582 8.545 8.67082 8.29C8.42582 8.035 8.17082 7.76 7.77082 7.365C7.43312 7.02661 7.24347 6.56807 7.24347 6.09C7.24347 5.61193 7.43312 5.15339 7.77082 4.815L8.27082 4.315C8.41992 4.16703 8.53822 3.99099 8.61889 3.79703C8.69956 3.60308 8.741 3.39506 8.74082 3.185C8.739 2.76115 8.57012 2.35512 8.27082 2.055L6.85082 0.625C6.44967 0.225577 5.9069 0.000919443 5.34082 0C5.06197 0.000410905 4.78595 0.0558271 4.52855 0.163075C4.27116 0.270322 4.03745 0.427294 3.84082 0.625L2.48582 1.97C1.50938 2.94779 0.960937 4.27315 0.960938 5.655C0.960937 7.03685 1.50938 8.36221 2.48582 9.34C3.26582 10.12 4.15582 11 5.04082 11.92C5.92582 12.84 6.79582 13.7 7.57082 14.5C8.5484 15.4749 9.87269 16.0224 11.2533 16.0224C12.6339 16.0224 13.9582 15.4749 14.9358 14.5L16.2858 13.15C16.6828 12.7513 16.9073 12.2126 16.9108 11.65C16.9157 11.3644 16.8629 11.0808 16.7555 10.8162C16.6481 10.5516 16.4884 10.3114 16.2858 10.11ZM15.5308 12.375L15.3858 12.5L13.9358 11.045C13.8875 10.99 13.8285 10.9455 13.7623 10.9142C13.6961 10.8829 13.6243 10.8655 13.5511 10.8632C13.478 10.8608 13.4051 10.8734 13.337 10.9003C13.269 10.9272 13.2071 10.9678 13.1554 11.0196C13.1036 11.0713 13.0631 11.1332 13.0361 11.2012C13.0092 11.2693 12.9966 11.3421 12.999 11.4153C13.0014 11.4884 13.0187 11.5603 13.05 11.6265C13.0813 11.6927 13.1258 11.7517 13.1808 11.8L14.6558 13.275L14.2058 13.725C13.4279 14.5005 12.3743 14.936 11.2758 14.936C10.1774 14.936 9.12372 14.5005 8.34582 13.725C7.57582 12.955 6.70082 12.065 5.84582 11.175C4.99082 10.285 4.06582 9.37 3.28582 8.59C2.51028 7.81209 2.0748 6.75845 2.0748 5.66C2.0748 4.56155 2.51028 3.50791 3.28582 2.73L3.73582 2.28L5.16082 3.75C5.26027 3.85277 5.39648 3.91182 5.53948 3.91417C5.68247 3.91651 5.82054 3.86196 5.92332 3.7625C6.02609 3.66304 6.08514 3.52684 6.08748 3.38384C6.08983 3.24084 6.03527 3.10277 5.93582 3L4.43582 1.5L4.58082 1.355C4.67935 1.25487 4.79689 1.17543 4.92654 1.12134C5.05619 1.06725 5.19534 1.03959 5.33582 1.04C5.61927 1.04085 5.89081 1.15414 6.09082 1.355L7.51582 2.8C7.61472 2.8998 7.6704 3.0345 7.67082 3.175C7.67088 3.24462 7.65722 3.31358 7.63062 3.37792C7.60403 3.44226 7.56502 3.50074 7.51582 3.55L7.01582 4.05C6.47844 4.58893 6.17668 5.31894 6.17668 6.08C6.17668 6.84106 6.47844 7.57107 7.01582 8.11C7.43582 8.5 7.66582 8.745 7.93582 9C8.20582 9.255 8.43582 9.53 8.83082 9.92C9.36974 10.4574 10.0998 10.7591 10.8608 10.7591C11.6219 10.7591 12.3519 10.4574 12.8908 9.92L13.3908 9.42C13.4929 9.32366 13.628 9.26999 13.7683 9.26999C13.9087 9.26999 14.0437 9.32366 14.1458 9.42L15.5658 10.84C15.6657 10.9387 15.745 11.0563 15.7991 11.1859C15.8532 11.3155 15.8809 11.4546 15.8808 11.595C15.8782 11.7412 15.8459 11.8853 15.7857 12.0186C15.7255 12.1518 15.6388 12.2714 15.5308 12.37V12.375Z" fill="#181A20"/>
											</g>
											<defs>
												<clipPath id="clip0_6507_6774">
													<rect width="16" height="16" fill="white" transform="translate(0.9375)" />
												</clipPath>
											</defs>
										</svg>
												<Typography className="number">{property?.memberData?.memberPhone}</Typography>
											</Stack>
											<Link href={`/member?memberId=${property?.memberData?._id}&tab=properties`} passHref legacyBehavior>
												<Typography className="listings" component="a" style={{cursor:'pointer', textDecoration:'underline'}}>View Listings</Typography>
											</Link>
										</Stack>
									</Stack>
								</Stack>
								<Stack className="info-box">
									<Typography className="sub-title">Name</Typography>
									<input type="text" placeholder="Enter your name" />
								</Stack>
								<Stack className="info-box">
									<Typography className="sub-title">Phone</Typography>
									<input type="text" placeholder="Enter your phone" />
								</Stack>
								<Stack className="info-box">
									<Typography className="sub-title">Email</Typography>
									<input type="text" placeholder="Enter your email" />
								</Stack>
								<Stack className="info-box">
									<Typography className="sub-title">Message</Typography>
									<textarea placeholder="Hello, I am interested in [Property details]"></textarea>
								</Stack>
								<Stack className="info-box">
									<Button className="send-message">
										<Typography className="title">Send Message</Typography>
										{/* Send icon SVG */}
										<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
											<g clipPath="url(#clip0_6975_593)">
												<path d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z" fill="white"/>
											</g>
											<defs>
												<clipPath id="clip0_6975_593">
													<rect width="16" height="16" fill="white" transform="translate(0.5 0.5)" />
												</clipPath>
											</defs>
										</svg>
									</Button>
								</Stack>
							</Stack>
						</Stack>

					</Stack>
				</div>
			</div>
		);
	}
};

PropertyDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(PropertyDetail);
