import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar, useQuery } from '@apollo/client';
import { userVar, themeVar } from '../../../apollo/store';
import cookies from 'js-cookie';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { sweetTopSuccessAlert } from '../../sweetAlert';

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
		const user = useReactiveVar(userVar);
		const themeMode = useReactiveVar(themeVar);
		const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);

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

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		const path = router.pathname;
		const isActive = (key: string) => {
			if (key === 'users') return path.startsWith('/_admin/users') || path === '/_admin';
			if (key === 'destination') return path.startsWith('/_admin/properties');
			if (key === 'community') return path.startsWith('/_admin/community');
			if (key === 'cs') return path.startsWith('/_admin/cs');
			return false;
		};

		const navItems: NavItem[] = [
			{ title: 'Users', icon: <GroupOutlinedIcon />, url: '/_admin/users', matchKey: 'users' },
			{ title: 'Destination', icon: <PlaceOutlinedIcon />, url: '/_admin/properties', matchKey: 'destination' },
			{ title: 'Community', icon: <ForumOutlinedIcon />, url: '/_admin/community', matchKey: 'community' },
			{ title: 'Cs', icon: <HeadsetMicOutlinedIcon />, url: '/_admin/cs/faq', matchKey: 'cs' },
			{ title: 'Reports', icon: <BarChartOutlinedIcon />, matchKey: 'reports', soon: true },
			{ title: 'Settings', icon: <SettingsOutlinedIcon />, matchKey: 'settings', soon: true },
		];

		return (
			<main id="pc-wrap" className="admin">
				<AppBar position="fixed" className="admin-topbar">
					<Toolbar disableGutters className="admin-toolbar">
						<Link href="/_admin/users">
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
											{item.title === 'Users' && totalMembers > 0 ? (
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
							<Tooltip title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
								<IconButton
									onClick={themeToggleHandler}
									className={`admin-theme-btn ${themeMode === 'dark' ? 'is-dark' : 'is-light'}`}
									aria-label="Toggle theme"
								>
									{themeMode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
								</IconButton>
							</Tooltip>
							<Tooltip title="Open settings">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} className="admin-avatar-btn">
									<Avatar
										src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
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
												Logout
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
