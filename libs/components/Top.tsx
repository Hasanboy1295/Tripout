import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const DEFAULT_USER_AVATAR = '/img/profile/defaultUser.svg';

const resolveUserAvatar = (memberImage?: string): string => {
	if (!memberImage) return DEFAULT_USER_AVATAR;
	if (/^https?:\/\//i.test(memberImage)) return memberImage;

	const baseUrl = REACT_APP_API_URL && REACT_APP_API_URL !== 'undefined' ? REACT_APP_API_URL.replace(/\/$/, '') : '';
	const normalizedPath = memberImage.replace(/^\//, '');

	return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
};

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const isDestinationRoute = router.pathname.startsWith('/property');
	const isAgentRoute = router.pathname.startsWith('/agent');
	const isMyPageRoute = router.pathname.startsWith('/mypage');
	const isAboutRoute = router.pathname.startsWith('/about');
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const userAvatar = resolveUserAvatar(user?.memberImage);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/property/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			const scrollY = window.scrollY;
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id, scroll: false });
			// Locale change re-renders the page; restore scroll on next frames
			// to override any reset that happens after the navigation completes.
			requestAnimationFrame(() => {
				window.scrollTo(0, scrollY);
				requestAnimationFrame(() => window.scrollTo(0, scrollY));
			});
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	useEffect(() => {
		const handleScroll = () => {
			changeNavbarColor();
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/property'}>
					<div>{t('Properties')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'scrolled' : ''} ${bgColor ? 'scrolled' : ''}`}>
					<Stack className={'container'}>
						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/logo.svg" alt="Tripout" />
								<span className={'logo-text'}>Tripout</span>
							</Link>
						</Box>
						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''}>{t('Home')}</div>
							</Link>
						
                            <Link href={'/property'}>
								<div className={isDestinationRoute ? 'active' : ''}>{t('Destinations')}</div>
							</Link>
							
							<div className={`nav-dropdown ${router.pathname.startsWith('/service') ? 'active' : ''}`}>
								<div className={'nav-dropdown-trigger'}>
									{t('Services')}
									<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
								</div>
								<div className={'nav-dropdown-menu'}>
									<Link href={'/service'}>
										<div className={router.pathname === '/service' ? 'active' : ''}>{t('Services')}</div>
									</Link>
									<Link href={'/service/detail'}>
										<div className={router.pathname === '/service/detail' ? 'active' : ''}>{t('service_detail')}</div>
									</Link>
								</div>
							</div>
						
							<Link href={'/agent'}>
								<div className={isAgentRoute ? 'active' : ''}>{t('Agents')}</div>
							</Link>
							<Link href={'/mypage'}>
								<div className={isMyPageRoute ? 'active' : ''}>{t('My Page')}</div>
							</Link>

								<Link href={'/about'}>
								<div className={isAboutRoute ? 'active' : ''}>{t('About Us')}</div>
							</Link>


						</Box>
						<Box component={'div'} className={'user-box'}>
							<div className={'search-btn'}>
								<SearchIcon />
							</div>
							{user?._id ? (
								<>
									<div className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={userAvatar}
											onError={(event: React.SyntheticEvent<HTMLImageElement>) => {
												event.currentTarget.src = DEFAULT_USER_AVATAR;
											}}
											alt=""
										/>
									</div>

									<Menu
										id="basic-menu"
										anchorEl={logoutAnchor}
										open={logoutOpen}
										onClose={() => {
											setLogoutAnchor(null);
										}}
										sx={{ mt: '5px' }}
									>
										<MenuItem onClick={() => logOut()}>
											<Logout fontSize="small" style={{ color: 'blue', marginRight: '10px' }} />
											{t('logout')}
										</MenuItem>
									</Menu>
								</>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<LockOutlinedIcon />
										<span>{t('login_signup_cta')}</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>
								{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'usaFlag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'usaFlag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											id="en"
											alt={'English'}
										/>
										English
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											id="kr"
											alt={'Korean'}
										/>
										Korean
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										<img
											className="img-flag"
											src={'/img/flag/langru.png'}
											id="ru"
											alt={'Russian'}
										/>
										Russian
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
