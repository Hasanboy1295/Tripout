import type { NextApiRequest, NextApiResponse } from 'next';

// Use global to share storage across API routes in development
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
		const { phone } = req.body;

		if (!phone) {
			return res.status(400).json({ message: 'Phone number is required' });
		}

		// Generate 6-digit code
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		
		// Store code with 5 minute expiration
		smsCodes.set(phone, {
			code,
			expires: Date.now() + 5 * 60 * 1000
		});

		// TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
		console.log(`📱 SMS Code for ${phone}: ${code}`);
		console.log(`⚠️  In development, check console for the code!`);

		// In production, send actual SMS:
		// await twilioClient.messages.create({
		//   body: `Your verification code is: ${code}`,
		//   from: process.env.TWILIO_PHONE_NUMBER,
		//   to: phone
		// });

		res.status(200).json({ 
			message: 'SMS sent successfully',
			// Remove this in production!
			devCode: process.env.NODE_ENV === 'development' ? code : undefined
		});
	} catch (error) {
		console.error('Send SMS error:', error);
		res.status(500).json({ message: 'Failed to send SMS' });
	}
}
