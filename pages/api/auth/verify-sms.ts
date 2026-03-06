import type { NextApiRequest, NextApiResponse } from 'next';

// Use the same global storage as send-sms.ts
declare global {
	var smsCodesStore: Map<string, { code: string; expires: number }> | undefined;
}

const smsCodes = global.smsCodesStore || new Map<string, { code: string; expires: number }>();
if (!global.smsCodesStore) {
	global.smsCodesStore = smsCodes;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	try {
		const { phone, code } = req.body;

		if (!phone || !code) {
			return res.status(400).json({ message: 'Phone and code are required' });
		}

		// Check if code exists and is valid
		const storedData = smsCodes.get(phone);
		
		if (!storedData) {
			return res.status(400).json({ message: 'No code found for this phone number' });
		}

		if (Date.now() > storedData.expires) {
			smsCodes.delete(phone);
			return res.status(400).json({ message: 'Code has expired' });
		}

		if (storedData.code !== code) {
			return res.status(400).json({ message: 'Invalid code' });
		}

		// Code is valid! Clear it and create session
		smsCodes.delete(phone);

		// Call your NestJS backend GraphQL API to login/create user with phone
		try {
			const graphqlResponse = await fetch('http://localhost:4000/graphql', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					query: `
						mutation PhoneLogin($phone: String!) {
							phoneLogin(phone: $phone) {
								_id
								memberNick
								memberType
								memberPhone
								memberImage
								accessToken
							}
						}
					`,
					variables: { phone }
				})
			});

			const { data, errors } = await graphqlResponse.json();
			
			if (errors || !data?.phoneLogin) {
				throw new Error(errors?.[0]?.message || 'Phone login failed');
			}

			// Return the actual user data and token
			res.status(200).json({
				message: 'Login successful',
				token: data.phoneLogin.accessToken,
				user: {
					_id: data.phoneLogin._id,
					memberNick: data.phoneLogin.memberNick,
					memberType: data.phoneLogin.memberType,
					memberPhone: data.phoneLogin.memberPhone,
					memberImage: data.phoneLogin.memberImage,
					accessToken: data.phoneLogin.accessToken
				}
			});
		} catch (backendError: any) {
			console.error('Backend GraphQL error:', backendError);
			// Fallback to mock for now
			res.status(200).json({
				message: 'Login successful (mock)',
				token: 'mock_jwt_token_' + Date.now(),
				user: {
					phone,
					memberNick: `user_${phone.slice(-4)}`
				}
			});
		}
	} catch (error) {
		console.error('Verify SMS error:', error);
		res.status(500).json({ message: 'Verification failed' });
	}
}
