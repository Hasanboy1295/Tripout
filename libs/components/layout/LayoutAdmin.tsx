import type { ComponentType } from 'react';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar, themeVar } from '../../../apollo/store';
import cookies from 'js-cookie';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { sweetTopSuccessAlert } from '../../sweetAlert';

const ADMIN_LANGS: { code: string; label: string; native: string; flag: string }[] = [
	{ code: 'en', label: 'EN', native: 'English', flag: '🇬🇧' },
	{ code: 'kr', label: 'KO', native: '한국어', flag: '🇰🇷' },
	{ code: 'ru', label: 'RU', native: 'Русский', flag: '🇷🇺' },
];

interface NavItem {
	title: string;
	icon: React.ReactNode;
	url?: string;
	matchKey: string;
	soon?: boolean;
}

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const { t } = useTranslation('common');
		const user = useReactiveVar(userVar);
		const themeMode = useReactiveVar(themeVar);
		const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
		const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);
		const activeLocale = router.locale || 'en';
		const activeLang = ADMIN_LANGS.find((l) => l.code === activeLocale) || ADMIN_LANGS[0];

		/** APOLLO **/
		const { data: membersSnapshot } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
			fetchPolicy: 'cache-and-network',
			variables: { input: { page: 1, limit: 1, sort: 'createdAt', search: {} } },
			skip: !user || user.memberType !== MemberType.ADMIN,
			notifyOnNetworkStatusChange: false,
		});
		const totalMembers = membersSnapshot?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0;

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		/** HANDLERS **/
		const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorElUser(event.currentTarget);
		};
		const handleCloseUserMenu = () => setAnchorElUser(null);
		const logoutHandler = () => {
			logOut();
			router.push('/').then();
		};
		const comingSoon = (label: string) => sweetTopSuccessAlert(`${label} — coming soon`, 1600);

		const themeToggleHandler = () => {
			const next = themeMode === 'dark' ? 'light' : 'dark';
			themeVar(next);
			if (typeof document !== 'undefined') {
				if (next === 'dark') document.body.classList.add('dark-mode');
				else document.body.classList.remove('dark-mode');
			}
			cookies.set('themeMode', next, { expires: 365 });
		};

		const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElLang(event.currentTarget);
		const handleCloseLangMenu = () => setAnchorElLang(null);
		const handleLangSelect = useCallback(
			async (code: string) => {
				setAnchorElLang(null);
				if (code === activeLocale) return;
				const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
				if (typeof window !== 'undefined') localStorage.setItem('locale', code);
				await router.push(router.asPath, router.asPath, { locale: code, scroll: false });
				if (typeof window !== 'undefined') {
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });
						});
					});
				}
			},
			[router, activeLocale],
		);

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		const path = router.pathname;
		const isActive = (key: string) => {
			if (key === 'reports') return path.startsWith('/_admin/reports') || path === '/_admin';
			if (key === 'users') return path.startsWith('/_admin/users');
			if (key === 'destination') return path.startsWith('/_admin/properties');
			if (key === 'community') return path.startsWith('/_admin/community');
			if (key === 'settings') return path.startsWith('/_admin/settings');
			return false;
		};

		const navItems: NavItem[] = [
			{ title: t('admin_nav_reports'), icon: <BarChartOutlinedIcon />, url: '/_admin/reports', matchKey: 'reports' },
			{ title: t('admin_nav_users'), icon: <GroupOutlinedIcon />, url: '/_admin/users', matchKey: 'users' },
			{ title: t('admin_nav_destination'), icon: <PlaceOutlinedIcon />, url: '/_admin/properties', matchKey: 'destination' },
			{ title: t('admin_nav_community'), icon: <ForumOutlinedIcon />, url: '/_admin/community', matchKey: 'community' },
			{ title: t('admin_nav_settings'), icon: <SettingsOutlinedIcon />, url: '/_admin/settings', matchKey: 'settings' },
		];

		return (
			<main id="pc-wrap" className="admin">
				<AppBar position="fixed" className="admin-topbar">
					<Toolbar disableGutters className="admin-toolbar">
						<Link href="/_admin/reports">
							<Stack className="admin-brand" direction="row" alignItems="center">
								<Stack className="brand-mark">T</Stack>
								<Typography className="brand-text">TRIPOUT</Typography>
							</Stack>
						</Link>

						<Stack className="admin-nav" direction="row">
							{navItems.map((item) => {
								const active = isActive(item.matchKey);
								const content = (
									<Stack
										className={`nav-pill ${active ? 'active' : ''}`}
										key={item.title}
										onClick={() => {
											if (item.soon) comingSoon(item.title);
										}}
									>
										<Stack className="nav-pill-icon">
											{item.matchKey === 'users' && totalMembers > 0 ? (
												<Badge
													badgeContent={totalMembers}
													color="warning"
													className="nav-pill-badge"
													max={999}
												>
													{item.icon}
												</Badge>
											) : (
												item.icon
											)}
										</Stack>
										<Typography className="nav-pill-label">{item.title}</Typography>
									</Stack>
								);
								return item.url && !item.soon ? (
									<Link href={item.url} key={item.title}>
										{content}
									</Link>
								) : (
									<React.Fragment key={item.title}>{content}</React.Fragment>
								);
							})}
						</Stack>

						<Stack className="admin-topright" direction="row" alignItems="center">
							<Tooltip title={t('admin_topbar_language')}>
								<IconButton
									onClick={handleOpenLangMenu}
									className="admin-lang-btn"
									aria-label="Change language"
								>
									<Stack className="admin-lang-btn-inner" direction="row" alignItems="center">
										<Typography className="admin-lang-flag" component="span">{activeLang.flag}</Typography>
										<Typography className="admin-lang-code" component="span">{activeLang.label}</Typography>
									</Stack>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-lang"
								className="pop-menu admin-lang-menu"
								anchorEl={anchorElLang}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								keepMounted
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={Boolean(anchorElLang)}
								onClose={handleCloseLangMenu}
							>
								{ADMIN_LANGS.map((l) => (
									<MenuItem
										key={l.code}
										className={`admin-lang-item ${activeLocale === l.code ? 'is-active' : ''}`}
										onClick={() => handleLangSelect(l.code)}
									>
										<Typography className="admin-lang-item-flag" component="span">{l.flag}</Typography>
										<Stack className="admin-lang-item-meta">
											<Typography className="admin-lang-item-label" component="span">{l.label}</Typography>
											<Typography className="admin-lang-item-native" component="span">{l.native}</Typography>
										</Stack>
										{activeLocale === l.code && <CheckIcon className="admin-lang-item-check" fontSize="small" />}
									</MenuItem>
								))}
							</Menu>
							<Tooltip title={themeMode === 'dark' ? t('admin_topbar_switch_light') : t('admin_topbar_switch_dark')}>
								<IconButton
									onClick={themeToggleHandler}
									className={`admin-theme-btn ${themeMode === 'dark' ? 'is-dark' : 'is-light'}`}
									aria-label="Toggle theme"
								>
									{themeMode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
								</IconButton>
							</Tooltip>
							<Tooltip title={t('admin_topbar_open_settings')}>
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} className="admin-avatar-btn">
									<Avatar
										alt={user?.memberNick || 'Admin'}
										src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
										imgProps={{
											onError: (e) => {
												(e.currentTarget as HTMLImageElement).src = '/img/profile/defaultUser.svg';
											},
										}}
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: '45px' }}
								id="menu-appbar"
								className={'pop-menu'}
								anchorEl={anchorElUser}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								keepMounted
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<Box component={'div'} onClick={handleCloseUserMenu} sx={{ width: '220px' }}>
									<Stack sx={{ px: '20px', my: '12px' }}>
										<Typography variant={'h6'} component={'h6'} sx={{ mb: '4px' }}>
											{user?.memberNick}
										</Typography>
										<Typography variant={'subtitle1'} component={'p'} color={'#757575'}>
											{user?.memberPhone}
										</Typography>
									</Stack>
									<Divider />
									<Box component={'div'} sx={{ p: 1, py: '6px' }} onClick={logoutHandler}>
										<MenuItem sx={{ px: '16px', py: '6px' }}>
											<Typography variant={'subtitle1'} component={'span'}>
												{t('admin_topbar_logout')}
											</Typography>
										</MenuItem>
									</Box>
								</Box>
							</Menu>
						</Stack>
					</Toolbar>
				</AppBar>

				<Box component={'div'} id="bunker">
					{/*@ts-ignore*/}
					<Component {...props} setSnackbar={setSnackbar} setTitle={setTitle} />
				</Box>
			</main>
		);
	};
};

export default withAdminLayout;
