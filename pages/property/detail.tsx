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
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											<AccessTimeIcon />
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Duration</Typography>
											<Typography className={'badge-value'}>{property?.propertyRooms} Days</Typography>
										</Stack>
									</Stack>
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											<GroupsIcon />
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Group Size</Typography>
											<Typography className={'badge-value'}>{(property?.propertyBeds ?? 0) * 3} People</Typography>
										</Stack>
									</Stack>
									<Stack className={'badge'}>
										<Stack className={'badge-icon'}>
											<PersonOutlineIcon />
										</Stack>
										<Stack className={'badge-text'}>
											<Typography className={'badge-label'}>Ages</Typography>
											<Typography className={'badge-value'}>18 - 65 Years</Typography>
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
												return <Review comment={comment} propertyViews={property?.propertyViews} key={comment?._id} />;
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

							{/* Right Sidebar - Trip Booking */}
							<Stack className={'right-config'}>
								<Stack className={'price-box'}>
									<Typography className={'start-from'}>Start From</Typography>
									<Typography className={'price'}>${formatterStr(property?.propertyPrice)}</Typography>
								</Stack>

								<Stack className={'booking-option'}>
									<CalendarTodayOutlinedIcon />
									<Typography>
										From: {moment(property?.createdAt).format('DD MMM')} -{' '}
										{moment(property?.createdAt).add(property?.propertyRooms || 5, 'days').format('DD MMM')}
									</Typography>
								</Stack>

								<Stack className={'booking-option'}>
									<GroupOutlinedIcon />
									<Typography>Guest: 2 Adults - 1 Child</Typography>
								</Stack>

								<Stack className={'landmarks-section'}>
									<Typography className={'landmarks-title'}>Popular Landmarks</Typography>
									<Stack className={'landmark-list'}>
										<Stack className={'landmark-item'}>
											<PlaceOutlinedIcon sx={{ color: '#f5a623' }} />
											<Typography className={'landmark-name'}>Royal Culture Museum</Typography>
											<Typography className={'landmark-dist'}>0.5km</Typography>
										</Stack>
										<Stack className={'landmark-item'}>
											<PlaceOutlinedIcon sx={{ color: '#f5a623' }} />
											<Typography className={'landmark-name'}>Neon Lex Club</Typography>
											<Typography className={'landmark-dist'}>1.0km</Typography>
										</Stack>
										<Stack className={'landmark-item'}>
											<PlaceOutlinedIcon sx={{ color: '#f5a623' }} />
											<Typography className={'landmark-name'}>White Sand Beach</Typography>
											<Typography className={'landmark-dist'}>1.5km</Typography>
										</Stack>
										<Stack className={'landmark-item'}>
											<PlaceOutlinedIcon sx={{ color: '#f5a623' }} />
											<Typography className={'landmark-name'}>Walking Street 11</Typography>
											<Typography className={'landmark-dist'}>2.5km</Typography>
										</Stack>
									</Stack>
								</Stack>

								<Button
									className={'get-started-btn'}
									onClick={() => {
										if (!user._id) {
											sweetMixinErrorAlert('Please login first!');
											return;
										}
										router.push(`/member?memberId=${property?.memberData?._id}`);
									}}
								>
									<Typography>GET STARTED NOW</Typography>
									<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
										<g clipPath="url(#clip0_cta)">
											<path
												d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z"
												fill="white"
											/>
										</g>
										<defs>
											<clipPath id="clip0_cta">
												<rect width="16" height="16" fill="white" transform="translate(0.5 0.5)" />
											</clipPath>
										</defs>
									</svg>
								</Button>
							</Stack>
						</Stack>

						{/* Similar Destinations */}
						{destinationProperties.length !== 0 && (
							<Stack className={'similar-properties-config'}>
								<Stack className={'title-pagination-box'}>
									<Stack className={'title-box'}>
										<Typography className={'main-title'}>Destination Property</Typography>
										<Typography className={'sub-title'}>Aliquam lacinia diam quis lacus euismod</Typography>
									</Stack>
									<Stack className={'pagination-box'}>
										<WestIcon className={'swiper-similar-prev'} />
										<div className={'swiper-similar-pagination'}></div>
										<EastIcon className={'swiper-similar-next'} />
									</Stack>
								</Stack>
								<Stack className={'cards-box'}>
									<Swiper
										className={'similar-homes-swiper'}
										slidesPerView={'auto'}
										spaceBetween={35}
										modules={[Autoplay, Navigation, Pagination]}
										navigation={{
											nextEl: '.swiper-similar-next',
											prevEl: '.swiper-similar-prev',
										}}
										pagination={{
											el: '.swiper-similar-pagination',
										}}
									>
										{destinationProperties.map((property: Property) => {
											return (
												<SwiperSlide className={'similar-homes-slide'} key={property.propertyTitle}>
													<PropertyBigCard
														property={property}
														likePropertyHandler={likePropertyHandler}
														key={property?._id}
													/>
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Stack>
							</Stack>
						)}
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
