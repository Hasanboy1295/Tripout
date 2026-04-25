import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, Tab, Tabs, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import { useTranslation } from 'next-i18next';
const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({
		...initialInput,
	});
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [anchorEl, setAnchorEl] = useState<any | null>(null);
	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: boardArticleLoading,
		data: boardArticleData,
		error: getBoardArticleError,
		refetch: boardArticleRefetch,
	} = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: {
			input: articleId,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
			}
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	// Hide images inside the article body that fail to load — keeps the layout
	// clean instead of showing the browser's broken-image icon.
	useEffect(() => {
		if (!boardArticle) return;
		const root = document.querySelector('#community-detail-page .article-body');
		if (!root) return;
		const imgs = root.querySelectorAll('img');
		const handlers: Array<() => void> = [];
		imgs.forEach((img) => {
			const handler = () => {
				img.style.display = 'none';
			};
			img.addEventListener('error', handler);
			handlers.push(() => img.removeEventListener('error', handler));
			// If image already failed before listener attached
			if (img.complete && img.naturalWidth === 0) handler();
		});
		return () => handlers.forEach((off) => off());
	}, [boardArticle]);

	/** HANDLERS **/
	const tabChangeHandler = (event: React.SyntheticEvent, value: string) => {
		router.replace(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			'/community',
			{ shallow: true },
		);
	};

	const likeArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			setLikeLoading(true);

			await likeTargetBoardArticle({
				variables: {
					input: id,
				},
			});
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert(t('comm_success'), 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const creteCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user?._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({
				variables: {
					input: commentInput,
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			await sweetMixinSuccessAlert(t('comm_commented'));
		} catch (error: any) {
			await sweetMixinErrorAlert(error.message);
		}
	};
	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user?._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update!');
			if (updatedComment === comments?.find((comment) => comment?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment!');

			if (commentStatus) {
				if (await sweetConfirmAlert(t('comm_confirm_delete'))) {
					await updateComment({
						variables: {
							input: updateData,
						},
					});
					await sweetMixinSuccessAlert('Successfully deleted!');
				} else return;
			} else {
				await updateComment({
					variables: {
						input: updateData,
					},
				});
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
		else return '/img/profile/defaultUser.svg';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>COMMUNITY DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<div id="community-detail-page">
				<div className="container">
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<img src={'/img/logo/logo.svg'} />
								<Stack className={'community-name'}>
									<Typography className={'name'}>{t('comm_brand')}</Typography>
								</Stack>
							</Stack>
							<Tabs
								orientation="vertical"
								aria-label="article categories"
								TabIndicatorProps={{ style: { display: 'none' } }}
								onChange={tabChangeHandler}
								value={articleCategory || 'FREE'}
							>
								<Tab
									value={'FREE'}
									label={t('comm_tab_free')}
									className={`tab-button ${articleCategory === 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={t('comm_tab_recommend')}
									className={`tab-button ${articleCategory === 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={t('comm_tab_news')}
									className={`tab-button ${articleCategory === 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'HUMOR'}
									label={t('comm_tab_humor')}
									className={`tab-button ${articleCategory === 'HUMOR' ? 'active' : ''}`}
								/>
							</Tabs>
						</Stack>

						<Stack className="right-config">
							<Stack className="panel-config">
								<Stack className="title-box">
									<Stack className="left">
										<Typography className="title">
											{articleCategory ? t(`comm_tab_${articleCategory.toLowerCase()}`) : t('comm_tab_free')} {t('comm_board_suffix')}
										</Typography>
										<Typography className="sub-title">{t('comm_subtitle')}</Typography>
									</Stack>
									<Button
										onClick={() =>
											router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })
										}
										className="right"
									>
										{t('comm_write')}
									</Button>
								</Stack>

								{/* ARTICLE CARD */}
								<Stack className="article-card">
									<Stack className="article-head">
										<Typography className="article-title">{boardArticle?.articleTitle}</Typography>
										<Stack className="article-meta" direction="row" alignItems="center">
											<Stack
												className="author"
												direction="row"
												alignItems="center"
												onClick={() => goMemberPage(boardArticle?.memberData?._id)}
											>
												<img
													src={memberImage}
													alt=""
													className="author-img"
													onError={(e) => {
														(e.currentTarget as HTMLImageElement).src = '/img/profile/defaultUser.svg';
													}}
												/>
												<Typography className="author-name">
													{boardArticle?.memberData?.memberNick}
												</Typography>
											</Stack>
											<Stack className="meta-divider" />
											<Moment className="article-time" format="DD MMM YYYY · HH:mm">
												{boardArticle?.createdAt}
											</Moment>
										</Stack>
										<Stack className="article-stats" direction="row">
											<Stack className="stat-pill" direction="row">
												{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
													<ThumbUpAltIcon
														className="liked"
														onClick={() => likeArticleHandler(user, boardArticle?._id)}
													/>
												) : (
													<ThumbUpOffAltIcon
														onClick={() => likeArticleHandler(user, boardArticle?._id)}
													/>
												)}
												<Typography>{boardArticle?.articleLikes ?? 0}</Typography>
											</Stack>
											<Stack className="stat-pill" direction="row">
												<VisibilityIcon />
												<Typography>{boardArticle?.articleViews ?? 0}</Typography>
											</Stack>
											<Stack className="stat-pill" direction="row">
												{total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}
												<Typography>{total}</Typography>
											</Stack>
										</Stack>
									</Stack>

									<Stack className="article-body">
										<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
									</Stack>

									<Stack className="article-footer" direction="row">
										<Button
											className={`like-cta ${boardArticle?.meLiked?.[0]?.myFavorite ? 'is-liked' : ''}`}
											onClick={() => likeArticleHandler(user, boardArticle?._id)}
										>
											{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
												<ThumbUpAltIcon />
											) : (
												<ThumbUpOffAltIcon />
											)}
											<span>{boardArticle?.articleLikes ?? 0}</span>
										</Button>
									</Stack>
								</Stack>

								{/* COMMENT INPUT */}
								<Stack className="comment-card">
									<Typography className="comment-card-title">
										{t('comm_comments_count', { count: total })}
									</Typography>
									<Stack className="leave-comment">
										<input
											type="text"
											placeholder={t('comm_leave_comment')}
											value={comment}
											onChange={(e) => {
												if (e.target.value.length > 100) return;
												setWordsCnt(e.target.value.length);
												setComment(e.target.value);
											}}
										/>
										<Stack className="button-box" direction="row">
											<Typography className="char-count">{wordsCnt}/100</Typography>
											<Button onClick={creteCommentHandler} className="submit-btn">
												{t('comm_comment_btn')}
											</Button>
										</Stack>
									</Stack>
								</Stack>

								{/* COMMENT LIST */}
								{total > 0 && (
									<Stack className="comments">
										<Typography className="comments-title">{t('comm_comments_title')}</Typography>
										<Stack className="comments-list">
											{comments?.map((commentData) => (
												<Stack className="comment-row" key={commentData?._id}>
													<img
														className="comment-avatar"
														src={getCommentMemberImage(commentData?.memberData?.memberImage)}
														alt=""
														onClick={() => goMemberPage(commentData?.memberData?._id as string)}
														onError={(e) => {
															(e.currentTarget as HTMLImageElement).src = '/img/profile/defaultUser.svg';
														}}
													/>
													<Stack className="comment-body">
														<Stack className="comment-head" direction="row" alignItems="center">
															<Stack
																className="comment-author"
																onClick={() => goMemberPage(commentData?.memberData?._id as string)}
															>
																<Typography className="name">{commentData?.memberData?.memberNick}</Typography>
																<Typography className="date">
																	<Moment format={'DD MMM YYYY · HH:mm'}>{commentData?.createdAt}</Moment>
																</Typography>
															</Stack>
															{commentData?.memberId === user?._id && (
																<Stack className="comment-actions" direction="row">
																	<IconButton
																		onClick={() => {
																			setUpdatedCommentId(commentData?._id);
																			updateButtonHandler(commentData?._id, CommentStatus.DELETE);
																		}}
																	>
																		<DeleteForeverIcon />
																	</IconButton>
																	<IconButton
																		onClick={() => {
																			setUpdatedComment(commentData?.commentContent);
																			setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
																			setUpdatedCommentId(commentData?._id);
																			setOpenBackdrop(true);
																		}}
																	>
																		<EditIcon />
																	</IconButton>
																</Stack>
															)}
														</Stack>
														<Typography className="comment-text">{commentData?.commentContent}</Typography>
													</Stack>
												</Stack>
											))}
										</Stack>
									</Stack>
								)}

								{total > 0 && (
									<Stack className="pagination-box">
										<Pagination
											count={Math.ceil(total / searchFilter.limit) || 1}
											page={searchFilter.page}
											shape="circular"
											color="primary"
											onChange={paginationHandler}
										/>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>

				{/* EDIT COMMENT MODAL */}
				<Backdrop
					sx={{
						top: '40%',
						right: '25%',
						left: '25%',
						width: '1000px',
						height: 'fit-content',
						borderRadius: '14px',
						color: '#ffffff',
						zIndex: 999,
					}}
					open={openBackdrop}
				>
					<Stack
						sx={{
							width: '100%',
							background: 'white',
							border: '1px solid #f1dcc0',
							padding: '20px',
							gap: '12px',
							borderRadius: '14px',
							boxShadow: '0 18px 40px rgba(35, 24, 8, 0.18)',
						}}
					>
						<Typography variant="h4" color={'#1a2238'} fontWeight={700} fontSize={18}>
							{t('comm_update_comment')}
						</Typography>
						<Stack gap={'16px'}>
							<input
								autoFocus
								value={updatedComment}
								onChange={(e) => updateCommentInputHandler(e.target.value)}
								type="text"
								style={{
									border: '1px solid #e6d4ba',
									outline: 'none',
									height: '44px',
									padding: '0px 14px',
									borderRadius: '10px',
									fontSize: '14px',
									color: '#1a2238',
								}}
							/>
							<Stack width={'100%'} flexDirection={'row'} justifyContent={'space-between'}>
								<Typography variant="subtitle1" color={'#7b8093'} fontSize={13}>
									{updatedCommentWordsCnt}/100
								</Typography>
								<Stack sx={{ flexDirection: 'row', alignSelf: 'flex-end', gap: '10px' }}>
									<Button variant="outlined" color="inherit" onClick={() => cancelButtonHandler()}>
										{t('comm_cancel')}
									</Button>
									<Button
										variant="contained"
										color="inherit"
										onClick={() => updateButtonHandler(updatedCommentId, undefined)}
									>
										{t('comm_update')}
									</Button>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Backdrop>
			</div>
		);
	}
};
CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
