import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, List, ListItem } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import PortraitIcon from '@mui/icons-material/Portrait';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArticleIcon from '@mui/icons-material/Article';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { useTranslation } from 'next-i18next';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { t } = useTranslation('common');
	const pathname = router.query.category ?? 'myProfile';
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert(t('mp_logout_confirm'))) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU</div>;
	} else {
		return (
			<Stack width={'100%'} padding={'30px 24px'} className="my-menu-container">
				{/* Profile Card */}
				<Stack className={'profile'}>
					<Box component={'div'} className={'profile-img'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</Box>
					<Stack className={'user-info'}>
						<Typography className={'user-name'}>{user?.memberNick}</Typography>
						<Typography className={'user-phone-text'}>{user?.memberPhone}</Typography>
						{user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'}>
								<Typography className={'view-list'}>{user?.memberType}</Typography>
							</a>
						) : (
							<Typography className={'view-list'}>{user?.memberType}</Typography>
						)}
					</Stack>
				</Stack>
				
				<Stack className={'sections'}>
					{/* WORKSPACE Section */}
					<Stack className={'section'}>
						<Typography className="section-title" variant={'h5'}>
							{t('mp_workspace')}
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'myProfile' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myProfile' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_my_profile')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'myFavorites' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myFavorites' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<FavoriteIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_my_favorites')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'recentlyVisited' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'recentlyVisited' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<HistoryIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_recently_visited')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
							{user.memberType === 'AGENT' && (
								<>
									<ListItem className={pathname === 'addProperty' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'addProperty' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												{category === 'addProperty' ? (
													<img className={'com-icon'} src={'/img/icons/whiteTab.svg'} alt={'com-icon'} />
												) : (
													<img className={'com-icon'} src={'/img/icons/newTab.svg'} alt={'com_icon'} />
												)}
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													{t('mp_add_property')}
												</Typography>
												<ChevronRightIcon className="chevron-icon" />
											</div>
										</Link>
									</ListItem>
									<ListItem className={pathname === 'myProperties' ? 'focus' : ''}>
										<Link
											href={{
												pathname: '/mypage',
												query: { category: 'myProperties' },
											}}
											scroll={false}
										>
											<div className={'flex-box'}>
												{category === 'myProperties' ? (
													<img className={'com-icon'} src={'/img/icons/homeWhite.svg'} alt={'com-icon'} />
												) : (
													<img className={'com-icon'} src={'/img/icons/home.svg'} alt={'com-icon'} />
												)}
												<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
													{t('mp_my_properties')}
												</Typography>
												<ChevronRightIcon className="chevron-icon" />
											</div>
										</Link>
									</ListItem>
								</>
							)}
						</List>
					</Stack>

					{/* CONNECTIONS Section */}
					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<Typography className="section-title" variant={'h5'}>
							{t('mp_connections')}
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'followers' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followers' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PeopleIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_my_followers')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'followings' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'followings' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<PersonAddIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_my_following')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'myOrders' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myOrders' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>

					{/* COMMUNITY Section */}
					<Stack className={'section'} sx={{ marginTop: '10px' }}>
						<Typography className="section-title" variant={'h5'}>
							{t('mp_community')}
						</Typography>
						<List className={'sub-section'}>
							<ListItem className={pathname === 'myArticles' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'myArticles' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<ArticleIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_blog_post')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
							<ListItem className={pathname === 'writeArticle' ? 'focus' : ''}>
								<Link
									href={{
										pathname: '/mypage',
										query: { category: 'writeArticle' },
									}}
									scroll={false}
								>
									<div className={'flex-box'}>
										<EditNoteIcon className="menu-icon" />
										<Typography className={'sub-title'} variant={'subtitle1'} component={'p'}>
											{t('mp_write_blog_post')}
										</Typography>
										<ChevronRightIcon className="chevron-icon" />
									</div>
								</Link>
							</ListItem>
						</List>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default MyMenu;
