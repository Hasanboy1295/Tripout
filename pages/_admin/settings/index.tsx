import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import cookies from 'js-cookie';
import { Box, Stack, Typography, Switch, Avatar, Button, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { themeVar, userVar } from '../../../apollo/store';
import { logOut } from '../../../libs/auth';
import { REACT_APP_API_URL } from '../../../libs/config';

interface LangOption {
	code: string;
	label: string;
	native: string;
	flag: string;
}

const LANGS: LangOption[] = [
	{ code: 'en', label: 'EN', native: 'English', flag: '🇬🇧' },
	{ code: 'kr', label: 'KO', native: '한국어', flag: '🇰🇷' },
	{ code: 'ru', label: 'RU', native: 'Русский', flag: '🇷🇺' },
];

const AdminSettings: NextPage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const themeMode = useReactiveVar(themeVar);
	const [activeLocale, setActiveLocale] = useState<string>('en');
	const [emailNotif, setEmailNotif] = useState<boolean>(true);
	const [pushNotif, setPushNotif] = useState<boolean>(false);

	useEffect(() => {
		const stored = router.locale || (typeof window !== 'undefined' && localStorage.getItem('locale')) || 'en';
		setActiveLocale(stored);
	}, [router.locale]);

	const handleLangChange = useCallback(
		async (code: string) => {
			const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
			setActiveLocale(code);
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
		[router],
	);

	const handleThemeChange = (mode: 'light' | 'dark') => {
		themeVar(mode);
		if (typeof document !== 'undefined') {
			if (mode === 'dark') document.body.classList.add('dark-mode');
			else document.body.classList.remove('dark-mode');
		}
		cookies.set('themeMode', mode, { expires: 365 });
	};

	const handleLogout = () => {
		logOut();
		router.push('/').then();
	};

	if (!user) return null;

	return (
		<Box component="div" className="content settings-page">
			<Typography variant="h2" className="tit" sx={{ mb: '6px' }}>
				{t('admin_settings_title')}
			</Typography>
			<Typography className="settings-sub">{t('admin_settings_sub')}</Typography>

			<Stack className="settings-grid" direction="row">
				{/* LANGUAGE CARD */}
				<Stack className="settings-card settings-card--lang">
					<Stack className="settings-card-head" direction="row" alignItems="center">
						<Stack className="settings-card-icon"><LanguageOutlinedIcon /></Stack>
						<Stack>
							<Typography className="settings-card-title">{t('admin_settings_lang_title')}</Typography>
							<Typography className="settings-card-sub">{t('admin_settings_lang_sub')}</Typography>
						</Stack>
					</Stack>
					<Stack className="lang-list">
						{LANGS.map((l) => {
							const active = activeLocale === l.code;
							return (
								<Stack
									key={l.code}
									className={`lang-row ${active ? 'is-active' : ''}`}
									direction="row"
									alignItems="center"
									onClick={() => handleLangChange(l.code)}
								>
									<Typography className="lang-flag" component="span">{l.flag}</Typography>
									<Stack className="lang-meta">
										<Typography className="lang-label">{l.label}</Typography>
										<Typography className="lang-native">{l.native}</Typography>
									</Stack>
									{active && <CheckCircleIcon className="lang-check" />}
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				{/* THEME CARD */}
				<Stack className="settings-card settings-card--theme">
					<Stack className="settings-card-head" direction="row" alignItems="center">
						<Stack className="settings-card-icon"><PaletteOutlinedIcon /></Stack>
						<Stack>
							<Typography className="settings-card-title">{t('admin_settings_theme_title')}</Typography>
							<Typography className="settings-card-sub">{t('admin_settings_theme_sub')}</Typography>
						</Stack>
					</Stack>
					<Stack className="theme-row" direction="row">
						<Stack
							className={`theme-tile ${themeMode === 'light' ? 'is-active' : ''}`}
							onClick={() => handleThemeChange('light')}
						>
							<Stack className="theme-tile-icon"><LightModeOutlinedIcon /></Stack>
							<Typography className="theme-tile-label">{t('admin_settings_theme_light')}</Typography>
							<Typography className="theme-tile-sub">{t('admin_settings_theme_light_sub')}</Typography>
						</Stack>
						<Stack
							className={`theme-tile ${themeMode === 'dark' ? 'is-active' : ''}`}
							onClick={() => handleThemeChange('dark')}
						>
							<Stack className="theme-tile-icon"><DarkModeOutlinedIcon /></Stack>
							<Typography className="theme-tile-label">{t('admin_settings_theme_dark')}</Typography>
							<Typography className="theme-tile-sub">{t('admin_settings_theme_dark_sub')}</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* NOTIFICATIONS CARD */}
				<Stack className="settings-card settings-card--notif">
					<Stack className="settings-card-head" direction="row" alignItems="center">
						<Stack className="settings-card-icon"><NotificationsNoneOutlinedIcon /></Stack>
						<Stack>
							<Typography className="settings-card-title">{t('admin_settings_notif_title')}</Typography>
							<Typography className="settings-card-sub">{t('admin_settings_notif_sub')}</Typography>
						</Stack>
					</Stack>
					<Stack className="notif-row" direction="row">
						<Stack>
							<Typography className="notif-label">{t('admin_settings_notif_email')}</Typography>
							<Typography className="notif-sub">{t('admin_settings_notif_email_sub')}</Typography>
						</Stack>
						<Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
					</Stack>
					<Divider className="notif-divider" />
					<Stack className="notif-row" direction="row">
						<Stack>
							<Typography className="notif-label">{t('admin_settings_notif_push')}</Typography>
							<Typography className="notif-sub">{t('admin_settings_notif_push_sub')}</Typography>
						</Stack>
						<Switch checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
					</Stack>
				</Stack>

				{/* ACCOUNT CARD */}
				<Stack className="settings-card settings-card--account">
					<Stack className="settings-card-head" direction="row" alignItems="center">
						<Stack className="settings-card-icon"><PersonOutlineOutlinedIcon /></Stack>
						<Stack>
							<Typography className="settings-card-title">{t('admin_settings_account_title')}</Typography>
							<Typography className="settings-card-sub">{t('admin_settings_account_sub')}</Typography>
						</Stack>
					</Stack>
					<Stack className="account-row" direction="row" alignItems="center">
						<Avatar
							className="account-avatar"
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg'}
						/>
						<Stack className="account-meta">
							<Typography className="account-name">{user?.memberNick}</Typography>
							<Typography className="account-phone">{user?.memberPhone}</Typography>
							<Typography className="account-role">{user?.memberType}</Typography>
						</Stack>
					</Stack>
					<Button
						className="account-logout"
						variant="outlined"
						startIcon={<LogoutOutlinedIcon />}
						onClick={handleLogout}
					>
						{t('admin_settings_logout')}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale ?? 'en', ['common'])),
	},
});

export default withAdminLayout(AdminSettings);
