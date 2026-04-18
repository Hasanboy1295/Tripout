import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack, Divider, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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
			sweetMixinErrorAlert('Please enter a valid phone number');
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
		sweetMixinErrorAlert('Failed to send SMS code');
	}
};

const handlePhoneLoginVerify = async () => {
	try {
		if (!verificationCode || verificationCode.length < 4) {
			sweetMixinErrorAlert('Please enter the verification code');
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
		sweetMixinErrorAlert('Invalid verification code');
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
<span>Nestar</span>
</Box>
<Box className={'info'}>
<span>{loginView ? 'login' : 'signup'}</span>
<p>{loginView ? 'Login' : 'Sign'} in with this account across the following sites.</p>
</Box>

{loginView ? (
<>
{/* PHONE LOGIN SECTION */}
<Box className={'telegram-auth-box'}>
<Typography className={'telegram-title'}>Login with Phone Number</Typography>
<div className={'telegram-button-wrapper'}>
{phoneLoginStep === null && (
<Box sx={{ width: '100%', maxWidth: '300px' }}>
<input
type="tel"
placeholder="Enter your phone number"
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
Send SMS Code
</Button>
</Box>
)}

{phoneLoginStep === 'code' && (
<Box sx={{ width: '100%', maxWidth: '300px' }}>
<Typography sx={{ fontSize: '14px', color: '#666', mb: 2, textAlign: 'center' }}>
We sent a code to {phoneNumber}
</Typography>
<input
type="text"
placeholder="Enter 6-digit code"
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
Verify & Login
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
Change phone number
</Button>
</Box>
)}
</div>
				<Divider sx={{ my: 2.5, color: '#DDD' }}>
					<Typography className={'divider-text'}>OR</Typography>
				</Divider>
			</Box>

			{/* STANDARD LOGIN FORM */}
			<Box className={'input-wrap'}>
<div className={'input-box'}>
<span>Nickname</span>
<input
type="text"
placeholder={'Enter Nickname'}
onChange={(e) => handleInput('nick', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && loginView) doLogin();
}}
/>
</div>
<div className={'input-box'}>
<span>Password</span>
<input
type="password"
placeholder={'Enter Password'}
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
<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
</FormGroup>
<a>Lost your password?</a>
</div>

<Button
variant="contained"
endIcon={<img src="/img/icons/rightup.svg" alt="" />}
disabled={input.nick == '' || input.password == ''}
onClick={doLogin}
>
LOGIN WITH EMAIL
</Button>
</Box>
</>
) : (
<>
<Box className={'input-wrap'}>
<div className={'input-box'}>
<span>Nickname</span>
<input
type="text"
placeholder={'Enter Nickname'}
onChange={(e) => handleInput('nick', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && !loginView) doSignUp();
}}
/>
</div>
<div className={'input-box'}>
<span>Password</span>
<input
type="password"
placeholder={'Enter Password'}
onChange={(e) => handleInput('password', e.target.value)}
required={true}
onKeyDown={(event) => {
if (event.key == 'Enter' && !loginView) doSignUp();
}}
/>
</div>
<div className={'input-box'}>
<span>Phone</span>
<input
type="text"
placeholder={'Enter Phone'}
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
<span className={'text'}>I want to be registered as:</span>
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
label="User"
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
label="Agent"
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
SIGNUP
</Button>
</Box>
</>
)}

<Box className={'ask-info'}>
{loginView ? (
<p>
Not registered yet?
<b
onClick={() => {
viewChangeHandler(false);
}}
>
SIGNUP
</b>
</p>
) : (
<p>
Have account?
<b onClick={() => viewChangeHandler(true)}> LOGIN</b>
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
