import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const getStaticProps = async ({ locale }: any) => ({
props: {
...(await serverSideTranslations(locale, ['common'])),
},
});

const Join: NextPage = () => {
const router = useRouter();
const { t } = useTranslation('common');
const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
const [loginView, setLoginView] = useState<boolean>(true);

/** HANDLERS **/
const viewChangeHandler = (state: boolean) => {
setLoginView(state);
};

const handleInput = useCallback((name: any, value: any) => {
setInput((prev) => {
return { ...prev, [name]: value };
});
}, []);

const doLogin = useCallback(async () => {
console.warn(input);
try {
await logIn(input.nick, input.password);
await router.push(`${router.query.referrer ?? '/'}`);
} catch (err: any) {
await sweetMixinErrorAlert(err.message);
}
}, [input]);

const doSignUp = useCallback(async () => {
console.warn(input);
try {
await signUp(input.nick, input.password, input.phone, input.type);
await router.push(`${router.query.referrer ?? '/'}`);
} catch (err: any) {
await sweetMixinErrorAlert(err.message);
}
}, [input]);

const handleGoogleSuccess = async (accessToken: string) => {
	try {
		const userInfo = await axios.get(
			'https://www.googleapis.com/oauth2/v3/userinfo',
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);
		if (userInfo?.data) {
			const { email, name } = userInfo.data;
			
			// 1. Backend class-validator talablariga mos unikal nick generatsiya qilish (Maksimal uzunlik 12 belgi bo'lishi shart!)
			// Emailni unikal kesik qilib olib, jami uzunlikni 3 va 12 belgilar orasida tutamiz
			let rawNick = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
			if (rawNick.length < 3) rawNick += 'user';
			const nick = (rawNick.slice(0, 8) + Math.floor(10 + Math.random() * 90)).toLowerCase(); // 12 xonali va har doim kichik harflarda unikal nick!

			// 2. Parol uchun: NestJS class-validator xavfsizlik va uzunlik talablari: Length(5, 12)
			const password = `g_sec${Math.floor(100 + Math.random() * 900)}!`; // Masalan: g_sec456! — Uzunligi 8, NestJS validatorlaridan muammosiz o'tadi.

			// 3. Telefon raqami validation bo'lishi shart
			const phone = `0${Math.floor(100000000 + Math.random() * 900000000)}`;

			try {
				// Avval SignUp qilishga harakat qiladi, chunki bu Google orqali kiruvchi yangi user bo'lishi mumkin!
				await signUp(nick, password, phone, 'USER');
				await logIn(nick, password);
				await router.push(`${router.query.referrer ?? '/'}`);
			} catch (signupErr: any) {
				// Agar SignUp xato bersa (demak u allaqachon mavjud), tizim uning nick va paroli orqali Login qiladi.
				try {
					await logIn(nick, password);
					await router.push(`${router.query.referrer ?? '/'}`);
				} catch (loginErr: any) {
					console.error('Google registration error:', loginErr);
					await sweetMixinErrorAlert('Google authentication failed. Please try again.');
				}
			}
		}
	} catch (error) {
		console.error('Google Auth Error:', error);
		await sweetMixinErrorAlert('Google authentication failed. Please try again.');
	}
};

const loginWithGoogle = useGoogleLogin({
	onSuccess: (tokenResponse) => handleGoogleSuccess(tokenResponse.access_token),
	onError: () => sweetMixinErrorAlert('Google authentication failed.')
});

return (
<Stack className={'join-page'}>
<Stack className={'container'}>
<Stack className={'main'}>
<Stack className={'left brand-panel'}>
<div className={'brand-top'}>
<img src="/img/logo/logo.svg" alt="Tripout" />
<span>{t('join_brand')}</span>
</div>

<div className={'brand-copy'}>
<h2>
Your next <span>adventure</span> starts here
</h2>
<p>Discover the world with trusted agents and a global community of travelers.</p>
</div>

<div className={'benefits'}>
<div className={'benefit-item'}>
<span className={'dot'} />
<p>500+ destinations worldwide</p>
</div>
<div className={'benefit-item'}>
<span className={'dot'} />
<p>Verified travel agents</p>
</div>
<div className={'benefit-item'}>
<span className={'dot'} />
<p>Secure and trusted platform</p>
</div>
</div>

<div className={'member-strip'}>
<div className={'avatars'}>
<span>JD</span>
<span>SA</span>
<span>MK</span>
</div>
<p>
<b>12,000+</b> travelers joined
</p>
</div>
</Stack>

<div className={'right form-panel'}>
<div className={'auth-switch'}>
<button className={!loginView ? 'active' : ''} onClick={() => viewChangeHandler(false)}>
{t('join_signup')}
</button>
<button className={loginView ? 'active' : ''} onClick={() => viewChangeHandler(true)}>
{t('join_login')}
</button>
</div>

<div className={'form-head'}>
<h3>{loginView ? 'Welcome back' : 'Create account'}</h3>
<p>{loginView ? 'Log in to continue your journey.' : 'Join for free and start exploring today.'}</p>
</div>

{loginView ? (
<>
<div className={'input-wrap'}>
<div className={'input-box'}>
<span>{t('join_nickname')}</span>
<input
type="text"
placeholder={t('join_nickname_placeholder')}
onChange={(e) => handleInput('nick', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && loginView) doLogin();
}}
/>
</div>
<div className={'input-box'}>
<span>{t('join_password')}</span>
<input
type="password"
placeholder={t('join_password_placeholder')}
onChange={(e) => handleInput('password', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && loginView) doLogin();
}}
/>
</div>
</div>

<div className={'register'}>
<div className={'remember-info'}>
<FormGroup>
<FormControlLabel control={<Checkbox defaultChecked size="small" />} label={t('join_remember_me')} />
</FormGroup>
<a>{t('join_lost_password')}</a>
</div>

<Button
variant="contained"
endIcon={<img src="/img/icons/rightup.svg" alt="" />}
disabled={input.nick == '' || input.password == ''}
onClick={doLogin}
>
{t('join_login_with_email')}
</Button>

<div className="social-divider">
	<span>or</span>
</div>

<button className="google-btn" type="button" onClick={() => loginWithGoogle()}>
	<svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
		<path
			fill="#EA4335"
			d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 5.105 1.01 6.05 1.98l3.266-3.14C19.53 2.016 16.13 1 12.24 1 6.033 1 1 5.925 1 12s5.033 11 11.24 11c6.478 0 10.793-4.532 10.793-10.985 0-.74-.08-1.305-.175-1.73H12.24z"
		/>
	</svg>
	<span>Login with Google</span>
</button>
</div>
</>
) : (
<>
<div className={'input-wrap'}>
<div className={'row'}>
<div className={'input-box'}>
<span>{t('join_nickname')}</span>
<input
type="text"
placeholder={t('join_nickname_placeholder')}
onChange={(e) => handleInput('nick', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && !loginView) doSignUp();
}}
/>
</div>
<div className={'input-box'}>
<span>{t('join_phone')}</span>
<input
type="text"
placeholder={t('join_phone_placeholder_2')}
onChange={(e) => handleInput('phone', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter') doSignUp();
}}
/>
</div>
</div>
<div className={'input-box'}>
<span>{t('join_password')}</span>
<input
type="password"
placeholder={t('join_password_placeholder')}
onChange={(e) => handleInput('password', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && !loginView) doSignUp();
}}
/>
</div>
</div>

<div className={'register'}>
<div className={'type-option modern'}>
<span className={'text'}>{t('join_register_as')}</span>
<div>
<button
type="button"
className={input.type === 'USER' ? 'role-btn active' : 'role-btn'}
onClick={() => handleInput('type', 'USER')}
>
{t('join_role_user')}
</button>
<button
type="button"
className={input.type === 'AGENT' ? 'role-btn active' : 'role-btn'}
onClick={() => handleInput('type', 'AGENT')}
>
{t('join_role_agent')}
</button>
</div>
</div>

<Button
variant="contained"
disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
onClick={doSignUp}
endIcon={<img src="/img/icons/rightup.svg" alt="" />}
>
{t('join_signup_btn')}
</Button>

<div className="social-divider">
	<span>or</span>
</div>

<button className="google-btn" type="button" onClick={() => loginWithGoogle()}>
	<svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
		<path
			fill="#EA4335"
			d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 5.105 1.01 6.05 1.98l3.266-3.14C19.53 2.016 16.13 1 12.24 1 6.033 1 1 5.925 1 12s5.033 11 11.24 11c6.478 0 10.793-4.532 10.793-10.985 0-.74-.08-1.305-.175-1.73H12.24z"
		/>
	</svg>
	<span>Sign up with Google</span>
</button>
</div>
		</>
	)}

	<div className={'ask-info'}>
		{loginView ? (
			<p>
				{t('join_not_registered')}
				<b
					onClick={() => {
						viewChangeHandler(false);
					}}
				>
					{' '}
					{t('join_signup_link')}
				</b>
			</p>
		) : (
			<p>
				{t('join_have_account')}
				<b onClick={() => viewChangeHandler(true)}> {t('join_login_link')}</b>
			</p>
		)}
	</div>
</div>
</Stack>
</Stack>
</Stack>
);
};

export default withLayoutBasic(Join);
