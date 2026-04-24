import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useMutation } from '@apollo/client';


const TelegramLoginButton: any = dynamic(
  () => import('react-telegram-auth').then((mod: any) => mod.default),
  { ssr: false }
);
export const getStaticProps = async ({ locale }: any) => ({
props: {
...(await serverSideTranslations(locale, ['common'])),
},
});

const Join: NextPage = () => {
const router = useRouter();
const device = useDeviceDetect();
const { t } = useTranslation('common');
const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
const [loginView, setLoginView] = useState<boolean>(true);

const [phoneLoginStep, setPhoneLoginStep] = useState<'phone' | 'code' | null>(null);
const [phoneNumber, setPhoneNumber] = useState('');
const [verificationCode, setVerificationCode] = useState('');

/** HANDLERS **/
const viewChangeHandler = (state: boolean) => {
setLoginView(state);
};

const checkUserTypeHandler = (e: any) => {
const checked = e.target.checked;
if (checked) {
const value = e.target.name;
handleInput('type', value);
} else {
handleInput('type', 'USER');
}
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

	



const handlePhoneLoginStart = async () => {
	try {
		if (!phoneNumber || phoneNumber.length < 10) {
			sweetMixinErrorAlert(t('join_invalid_phone'));
			return;
		}
		// Call backend to send SMS code
		const response = await fetch('/api/auth/send-sms', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone: phoneNumber })
		});

		if (response.ok) {
			const data = await response.json();
			setPhoneLoginStep('code');
			console.log('SMS code sent to:', phoneNumber);
			
			// Show the code in alert for development
			if (data.devCode) {
				alert(`🔐 Development Mode\n\nYour verification code is: ${data.devCode}\n\n(In production, this will be sent via SMS)`);
			}
		} else {
			throw new Error('Failed to send SMS');
		}
	} catch (err: any) {
		console.error('SMS send error:', err);
		sweetMixinErrorAlert(t('join_sms_failed'));
	}
};

const handlePhoneLoginVerify = async () => {
	try {
		if (!verificationCode || verificationCode.length < 4) {
			sweetMixinErrorAlert(t('join_enter_code'));
			return;
		}
		
		const response = await fetch('/api/auth/verify-sms', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone: phoneNumber, code: verificationCode })
		});

		if (response.ok) {
			const data = await response.json();
			
			// Store user data in localStorage
			if (data.user) {
				localStorage.setItem('user', JSON.stringify(data.user));
			}
			
			// Redirect to home page
			await router.push('/');
			console.log('Phone login successful!', data);
		} else {
			throw new Error('Invalid verification code');
		}
	} catch (err: any) {
		console.error('Verification error:', err);
		sweetMixinErrorAlert(t('join_invalid_code'));
	}
};

console.log('+input: ', input);

if (device === 'mobile') {
return <div>LOGIN MOBILE</div>;
} else {
return (
<Stack className={'join-page'}>
<Stack className={'container'}>
<Stack className={'main'}>
<Stack className={'left'}>
{/* @ts-ignore */}
<Box className={'logo'}>
<img src="/img/logo/logoText.svg" alt="" />
<span>{t('join_brand')}</span>
</Box>
<Box className={'info'}>
<span>{loginView ? t('join_login') : t('join_signup')}</span>
<p>{loginView ? t('join_login') : t('join_signup')} {t('join_account_intro')}</p>
</Box>

{loginView ? (
<>
{/* PHONE LOGIN SECTION */}
<Box className={'telegram-auth-box'}>
<Typography className={'telegram-title'}>{t('join_phone_title')}</Typography>
<div className={'telegram-button-wrapper'}>
{phoneLoginStep === null && (
<Box sx={{ width: '100%', maxWidth: '300px' }}>
<input
type="tel"
placeholder={t('join_phone_placeholder')}
value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
style={{
width: '100%',
padding: '12px',
fontSize: '16px',
border: '1px solid #DDD',
borderRadius: '8px',
marginBottom: '12px'
}}
/>
<Button
variant="contained"
fullWidth
sx={{
backgroundColor: '#0088cc',
color: 'white',
padding: '12px',
borderRadius: '8px',
textTransform: 'none',
fontWeight: 600,
fontSize: '16px',
'&:hover': {
backgroundColor: '#0077b6',
},
}}
onClick={handlePhoneLoginStart}
>
{t('join_send_sms')}
</Button>
</Box>
)}

{phoneLoginStep === 'code' && (
<Box sx={{ width: '100%', maxWidth: '300px' }}>
<Typography sx={{ fontSize: '14px', color: '#666', mb: 2, textAlign: 'center' }}>
{t('join_code_sent_prefix')} {phoneNumber}
</Typography>
<input
type="text"
placeholder={t('join_code_placeholder')}
value={verificationCode}
onChange={(e) => setVerificationCode(e.target.value)}
maxLength={6}
style={{
width: '100%',
padding: '12px',
fontSize: '16px',
border: '1px solid #DDD',
borderRadius: '8px',
marginBottom: '12px',
textAlign: 'center',
letterSpacing: '8px'
}}
/>
<Button
variant="contained"
fullWidth
sx={{
backgroundColor: '#0088cc',
color: 'white',
padding: '12px',
borderRadius: '8px',
textTransform: 'none',
fontWeight: 600,
fontSize: '16px',
'&:hover': {
backgroundColor: '#0077b6',
},
}}
onClick={handlePhoneLoginVerify}
>
{t('join_verify_login')}
</Button>
<Button
variant="text"
fullWidth
sx={{ mt: 1, textTransform: 'none' }}
onClick={() => {
setPhoneLoginStep(null);
setVerificationCode('');
}}
>
{t('join_change_phone')}
</Button>
</Box>
)}
</div>
				<Divider sx={{ my: 2.5, color: '#DDD' }}>
					<Typography className={'divider-text'}>{t('join_or')}</Typography>
				</Divider>
			</Box>

			{/* STANDARD LOGIN FORM */}
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
</Box>

<Box className={'register'}>
<div className={'type-option'}>
<span className={'text'}>{t('join_register_as')}</span>
<div>
<FormGroup>
<FormControlLabel
control={
<Checkbox
size="small"
name={'USER'}
onChange={checkUserTypeHandler}
checked={input?.type == 'USER'}
/>
}
label={t('join_role_user')}
/>
</FormGroup>
<FormGroup>
<FormControlLabel
control={
<Checkbox
size="small"
name={'AGENT'}
onChange={checkUserTypeHandler}
checked={input?.type == 'AGENT'}
/>
}
label={t('join_role_agent')}
/>
</FormGroup>
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
<Stack className={'right'}></Stack>
</Stack>
</Stack>
</Stack>
);
}
};

export default withLayoutBasic(Join);
