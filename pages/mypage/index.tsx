import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import MyMenu from '../../libs/components/mypage/MyMenu';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import MyProperties from '../../libs/components/mypage/MyProperties';
import AddProperty from '../../libs/components/mypage/AddNewProperty';
import MyArticles from '../../libs/components/mypage/MyArticles';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { userVar } from '../../apollo/store';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { useTranslation } from 'next-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	const category: any = router.query?.category;
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		if (!category) {
			router.replace(
				{
					pathname: router.pathname,
					query: { ...router.query, category: 'myProfile' },
				},
				undefined,
				{ shallow: true },
			);
		}
	}, [category, router]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await subscribe({
				variables: {
					input: id,
				},
			});

			await sweetTopSmallSuccessAlert(t('mp_followed'), 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Messages.error1);
			if (!user._id) throw new Error(Messages.error2);

			await unsubscribe({
				variables: {
					input: id,
				},
			});

			await sweetTopSmallSuccessAlert(t('mp_unfollowed'), 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetMember({
				variables: {
					input: id,
				},
			});
			await sweetTopSmallSuccessAlert(t('mp_success'), 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	/** RENDER CONTENT BASED ON CATEGORY **/
	const renderContent = () => {
		switch (category) {
			case 'myProfile':
				return <MyProfile />;
			case 'myFavorites':
				return <MyFavorites />;
			case 'recentlyVisited':
				return <RecentlyVisited />;
			case 'myProperties':
				return <MyProperties />;
			case 'addProperty':
				return <AddProperty />;
			case 'followers':
				return (
					<MemberFollowers
						initialInput={{ page: 1, limit: 5, search: { followingId: user?._id } }}
						subscribeHandler={subscribeHandler}
						unsubscribeHandler={unsubscribeHandler}
						likeMemberHandler={likeMemberHandler}
						redirectToMemberPageHandler={redirectToMemberPageHandler}
					/>
				);
			case 'followings':
				return (
					<MemberFollowings
						initialInput={{ page: 1, limit: 5, search: { followerId: user?._id } }}
						subscribeHandler={subscribeHandler}
						unsubscribeHandler={unsubscribeHandler}
						likeMemberHandler={likeMemberHandler}
						redirectToMemberPageHandler={redirectToMemberPageHandler}
					/>
				);
			case 'myOrders':
				return (
					<Stack className="coming-soon-box" alignItems="center" justifyContent="center" sx={{ minHeight: 300 }}>
						<Typography variant="h5" color="textSecondary">
							{t('mp_orders_coming_soon')}
						</Typography>
					</Stack>
				);
			case 'myArticles':
				return <MyArticles />;
			case 'writeArticle':
				return <WriteArticle />;
			default:
				return <MyProfile />;
		}
	};
		return (
			<div id="my-page">
				<div className="container">
					{/* MAIN */}
					<Stack className="my-page">
						<Stack className="back-frame">
							{/* LEFT MENU */}
							<Stack className="left-config">
								<MyMenu />
							</Stack>

							{/* RIGHT CONTENT */}
							<Stack className="main-config">{renderContent()}</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
};

export default withLayoutBasic(MyPage);
