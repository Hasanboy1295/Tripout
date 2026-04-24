import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import {
	LIKE_TARGET_BOARD_ARTICLE_BY_BOARD_NAME,
} from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	if (articleCategory) initialInput.search.articleCategory = articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticleByBoardName] = useMutation(LIKE_TARGET_BOARD_ARTICLE_BY_BOARD_NAME);

	const {
		loading: boardArticlesLoading,
		data: boardArticlesData,
		error: getBoardArticlesError,
		refetch: boardArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: searchCommunity,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!query?.articleCategory)
			router.push(
				{
					pathname: router.pathname,
					query: { articleCategory: 'FREE' },
				},
				router.pathname,
				{ shallow: true },
			);
	}, []);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		console.log(value);

		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value as BoardArticleCategory } });
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			router.pathname,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string, articleMemberId?: string) => {
		try {
			e.stopPropagation();
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			if (articleMemberId && user._id === articleMemberId) throw new Error(t('comm_like_self_error'));

			setLikeLoading(true);

			await likeTargetBoardArticleByBoardName({
				variables: {
					input: id,
				},
			});

			await boardArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler:', err.message);
			const readableErrorMessage = err?.graphQLErrors?.[0]?.message || err?.message || t('comm_like_failed');
			sweetMixinErrorAlert(readableErrorMessage).then();
		} finally {
			setLikeLoading(false);
		}
	};

	if (device === 'mobile') {
		return <h1>COMMUNITY PAGE MOBILE</h1>;
	} else {
		return (
			<div id="community-list-page">
				<div className="container">
					<TabContext value={searchCommunity.search.articleCategory}>
						<Stack className="main-box">
							<Stack className="left-config">
								<Stack className={'image-info'}>
									<img src={'/img/logo/logo.svg'} />
									<Stack className={'community-name'}>
										<Typography className={'name'}>{t('comm_brand')}</Typography>
									</Stack>
								</Stack>

								<TabList
									orientation="vertical"
									aria-label="lab API tabs example"
									TabIndicatorProps={{
										style: { display: 'none' },
									}}
									onChange={tabChangeHandler}
								>
									<Tab
										value={'FREE'}
										label={t('comm_tab_free')}
										className={`tab-button ${searchCommunity.search.articleCategory == 'FREE' ? 'active' : ''}`}
									/>
									<Tab
										value={'RECOMMEND'}
										label={t('comm_tab_recommend')}
										className={`tab-button ${searchCommunity.search.articleCategory == 'RECOMMEND' ? 'active' : ''}`}
									/>
									<Tab
										value={'NEWS'}
										label={t('comm_tab_news')}
										className={`tab-button ${searchCommunity.search.articleCategory == 'NEWS' ? 'active' : ''}`}
									/>
									<Tab
										value={'HUMOR'}
										label={t('comm_tab_humor')}
										className={`tab-button ${searchCommunity.search.articleCategory == 'HUMOR' ? 'active' : ''}`}
									/>
								</TabList>
							</Stack>
							<Stack className="right-config">
								<Stack className="panel-config">
									<Stack className="title-box">
										<Stack className="left">
											<Typography className="title">{t(`comm_tab_${searchCommunity.search.articleCategory.toLowerCase()}`)} {t('comm_board_suffix')}</Typography>
											<Typography className="sub-title">
												{t('comm_subtitle')}
											</Typography>
										</Stack>
										<Button
											onClick={() =>
												router.push({
													pathname: '/mypage',
													query: {
														category: 'writeArticle',
													},
												})
											}
											className="right"
										>
											{t('comm_write')}
										</Button>
									</Stack>

									<TabPanel value="FREE">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															likeArticleHandler={likeArticleHandler}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>{t('comm_no_articles')}</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="RECOMMEND">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															likeArticleHandler={likeArticleHandler}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>{t('comm_no_articles')}</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="NEWS">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															likeArticleHandler={likeArticleHandler}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>{t('comm_no_articles')}</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
									<TabPanel value="HUMOR">
										<Stack className="list-box">
											{totalCount ? (
												boardArticles?.map((boardArticle: BoardArticle) => {
													return (
														<CommunityCard
															boardArticle={boardArticle}
															likeArticleHandler={likeArticleHandler}
															key={boardArticle?._id}
														/>
													);
												})
											) : (
												<Stack className={'no-data'}>
													<img src="/img/icons/icoAlert.svg" alt="" />
													<p>{t('comm_no_articles')}</p>
												</Stack>
											)}
										</Stack>
									</TabPanel>
								</Stack>
							</Stack>
						</Stack>
					</TabContext>

					{totalCount > 0 && (
						<Stack className="pagination-config">
							<Stack className="pagination-box">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
							<Stack className="total-result">
								<Typography>
									{t(totalCount > 1 ? 'comm_total_many' : 'comm_total_one', { count: totalCount })}
								</Typography>
							</Stack>
						</Stack>
					)}
				</div>
			</div>
		);
	}
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
