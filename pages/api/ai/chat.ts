import type { NextApiRequest, NextApiResponse } from 'next';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GRAPHQL_URL = process.env.REACT_APP_API_GRAPHQL_URL;

const LOCATIONS = [
	'TURKEY',
	'BALI',
	'BANGKOK',
	'KOREA',
	'SINGAPORE',
	'ITALY',
	'GERMANY',
	'UBEKISTAN',
	'PARIS',
	'TOKYO',
	'DUBAI',
];
const TYPES = ['CITY', 'VILLA', 'BICH', 'LUXURY'];

const SYSTEM_PROMPT = `You are Tripout's friendly AI travel concierge.

Your job: help travelers discover destinations and tour properties on Tripout.
Available locations: ${LOCATIONS.join(', ')}.
Available tour types: CITY (city tour), VILLA (villa stay), BICH (beach), LUXURY (luxury experience).

Guidelines:
- When the user asks about a destination, mentions a place, or describes the kind of trip they want, ALWAYS call the find_destinations function to fetch real Tripout listings — never invent property names.
- Keep replies short, warm, and concrete — at most 1–2 sentences before showing options.
- If the user asks something off-topic (weather, jokes, etc.), answer briefly and pivot back to travel.
- If a location they ask about is not in the list, politely say it's not yet available and suggest the closest available alternative.
- Reply in the same language the user is using (English, Russian, Korean, Uzbek, etc.).`;

const TOOLS = [
	{
		type: 'function' as const,
		function: {
			name: 'find_destinations',
			description: 'Search Tripout properties by location and/or tour type. Use whenever the user wants destination ideas or mentions a place.',
			parameters: {
				type: 'object',
				properties: {
					location: {
						type: 'string',
						enum: LOCATIONS,
						description: 'Tripout-supported destination the user is interested in.',
					},
					type: {
						type: 'string',
						enum: TYPES,
						description: 'Tour type. CITY=city tour, VILLA=villa stay, BICH=beach, LUXURY=luxury.',
					},
					keywords: {
						type: 'string',
						description: 'Free-text keyword to narrow results (e.g. "honeymoon", "family", "ski"). Optional.',
					},
				},
			},
		},
	},
];

interface PropertySummary {
	_id: string;
	propertyTitle: string;
	propertyLocation: string;
	propertyType: string;
	propertyImages: string[];
	propertyPrice: number;
	propertyAddress: string;
	propertyDesc?: string;
}

const PROPERTIES_QUERY = `
	query GetProperties($input: PropertiesInquiry!) {
		getProperties(input: $input) {
			list {
				_id
				propertyTitle
				propertyLocation
				propertyType
				propertyImages
				propertyPrice
				propertyAddress
				propertyDesc
			}
		}
	}
`;

async function findProperties(args: {
	location?: string;
	type?: string;
	keywords?: string;
}): Promise<PropertySummary[]> {
	if (!GRAPHQL_URL) return [];

	const search: any = {};
	if (args.location && LOCATIONS.includes(args.location)) {
		search.locationList = [args.location];
	}
	if (args.type && TYPES.includes(args.type)) {
		search.typeList = [args.type];
	}
	if (args.keywords && args.keywords.trim()) {
		search.text = args.keywords.trim();
	}

	try {
		const res = await fetch(GRAPHQL_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: PROPERTIES_QUERY,
				variables: { input: { page: 1, limit: 4, search } },
			}),
		});
		if (!res.ok) return [];
		const data = await res.json();
		return data?.data?.getProperties?.list ?? [];
	} catch (err) {
		console.error('[ai/chat] graphql fetch failed', err);
		return [];
	}
}

async function callOpenAI(body: any) {
	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`OpenAI ${res.status}: ${text.slice(0, 300)}`);
	}
	return res.json();
}

interface IncomingMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface SuggestionPayload {
	_id: string;
	title: string;
	location: string;
	type: string;
	image: string | null;
	price: number;
	address: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method not allowed' });
	}

	if (!OPENAI_API_KEY) {
		return res.status(503).json({
			error: 'AI is not configured. Add OPENAI_API_KEY to your .env file and restart the dev server.',
		});
	}

	const { messages = [], message } = (req.body || {}) as {
		messages?: IncomingMessage[];
		message?: string;
	};

	const userMsg = (message || '').trim();
	if (!userMsg) return res.status(400).json({ error: 'Empty message' });

	const history = [
		{ role: 'system', content: SYSTEM_PROMPT },
		...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
		{ role: 'user', content: userMsg },
	];

	try {
		const first = await callOpenAI({
			model: OPENAI_MODEL,
			messages: history,
			tools: TOOLS,
			tool_choice: 'auto',
			temperature: 0.6,
		});

		const choice = first.choices?.[0]?.message;
		const toolCalls = choice?.tool_calls ?? [];

		if (toolCalls.length === 0) {
			return res.status(200).json({
				reply: choice?.content || 'Tell me where you want to travel and I will find the perfect trip for you!',
				suggestions: [],
				location: null,
			});
		}

		// Execute every tool call (usually one) in parallel.
		const toolResults = await Promise.all(
			toolCalls.map(async (tc: any) => {
				let args: any = {};
				try {
					args = JSON.parse(tc.function.arguments || '{}');
				} catch {}
				const props = await findProperties(args);
				return { tc, args, props };
			}),
		);

		// Pick the first tool call that yielded the strongest signal for the suggestion list.
		const primary = toolResults.find((r) => r.props.length > 0) || toolResults[0];
		const suggestions: SuggestionPayload[] = primary.props.slice(0, 4).map((p: { _id: any; propertyTitle: any; propertyLocation: any; propertyType: any; propertyImages: any[]; propertyPrice: any; propertyAddress: any; }) => ({
			_id: p._id,
			title: p.propertyTitle,
			location: p.propertyLocation,
			type: p.propertyType,
			image: p.propertyImages?.[0] ?? null,
			price: p.propertyPrice,
			address: p.propertyAddress,
		}));

		// Second OpenAI call: feed tool results back so the model writes a natural reply.
		const second = await callOpenAI({
			model: OPENAI_MODEL,
			messages: [
				...history,
				choice,
				...toolResults.map(({ tc, props }) => ({
					role: 'tool',
					tool_call_id: tc.id,
					content: JSON.stringify({
						count: props.length,
						items: props.slice(0, 4).map((p: { _id: any; propertyTitle: any; propertyLocation: any; propertyType: any; propertyPrice: any; }) => ({
							id: p._id,
							title: p.propertyTitle,
							location: p.propertyLocation,
							type: p.propertyType,
							price: p.propertyPrice,
						})),
					}),
				})),
			],
			temperature: 0.6,
		});

		const reply =
			second.choices?.[0]?.message?.content ||
			(suggestions.length > 0
				? `Here are a few options I picked for you in ${primary.args.location ?? 'that area'}.`
				: `I could not find a Tripout match for that yet — try a different destination.`);

		return res.status(200).json({
			reply,
			suggestions,
			location: primary.args.location ?? null,
			type: primary.args.type ?? null,
		});
	} catch (err: any) {
		console.error('[ai/chat] failed', err);
		return res.status(500).json({
			error: 'AI is temporarily unavailable. Please try again in a moment.',
			detail: err?.message,
		});
	}
}
