import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
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

return (
<Stack className={'join-page'}>
<Stack className={'container'}>
<Stack className={'main'}>
<Stack className={'left brand-panel'}>
<Box className={'brand-top'}>
<img src="/img/logo/logo.svg" alt="Tripout" />
<span>{t('join_brand')}</span>
</Box>

<Box className={'brand-copy'}>
<h2>
Your next <span>adventure</span> starts here
</h2>
<p>Discover the world with trusted agents and a global community of travelers.</p>
</Box>

<Box className={'benefits'}>
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
</Box>

<Box className={'member-strip'}>
<div className={'avatars'}>
<span>JD</span>
<span>SA</span>
<span>MK</span>
</div>
<p>
<b>12,000+</b> travelers joined
</p>
</Box>
</Stack>

<Stack className={'right form-panel'}>
<Box className={'auth-switch'}>
<button className={!loginView ? 'active' : ''} onClick={() => viewChangeHandler(false)}>
{t('join_signup')}
</button>
<button className={loginView ? 'active' : ''} onClick={() => viewChangeHandler(true)}>
{t('join_login')}
</button>
</Box>

<Box className={'form-head'}>
<h3>{loginView ? 'Welcome back' : 'Create account'}</h3>
<p>{loginView ? 'Log in to continue your journey.' : 'Join for free and start exploring today.'}</p>
</Box>

{loginView ? (
<>
<Box className={'input-wrap'}>
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
</Box>

<Box className={'register'}>
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
</Box>
</>
) : (
<>
<Box className={'input-wrap'}>
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
</Box>

<Box className={'register'}>
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
</Box>
</>
)}

<Box className={'ask-info'}>
{loginView ? (
<p>
{t('join_not_registered')}
<b
onClick={() => {
viewChangeHandler(false);
}}
>
{' '}{t('join_signup_link')}
</b>
</p>
) : (
<p>
{t('join_have_account')}
<b onClick={() => viewChangeHandler(true)}> {t('join_login_link')}</b>
</p>
)}
</Box>
</Stack>
</Stack>
</Stack>
</Stack>
);
};

export default withLayoutBasic(Join);
