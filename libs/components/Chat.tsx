import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

interface AiSuggestion {
	_id: string;
	title: string;
	location: string;
	type: string;
	image: string | null;
	price: number;
	address: string;
}

interface AiMessage {
	role: 'user' | 'assistant';
	content: string;
	suggestions?: AiSuggestion[];
	location?: string | null;
}

const buildPropertyImage = (image: string | null): string => {
	if (!image) return '/img/banner/hero-travel-1.jpg';
	if (/^https?:\/\//i.test(image)) return image;
	const base = REACT_APP_API_URL && REACT_APP_API_URL !== 'undefined' ? REACT_APP_API_URL.replace(/\/$/, '') : '';
	return base ? `${base}/${image.replace(/^\//, '')}` : `/${image.replace(/^\//, '')}`;
};

const buildLocationHref = (location: string | null | undefined): string => {
	if (!location) return '/property';
	const input = {
		page: 1,
		limit: 9,
		search: { locationList: [location] },
	};
	return `/property?input=${encodeURIComponent(JSON.stringify(input))}`;
};

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [mode, setMode] = useState<'ai' | 'live'>('ai');

	const [aiMessages, setAiMessages] = useState<AiMessage[]>([
		{
			role: 'assistant',
			content:
				"Hi! I'm Tripout's AI travel guide. Tell me where you want to go — Turkey, Bali, Bangkok, Korea, Dubai, Tokyo… I'll pick the perfect trips for you.",
		},
	]);
	const [aiLoading, setAiLoading] = useState(false);

	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (msg: any) => {
			const data = JSON.parse(msg.data);
			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case 'message':
					const newMessage: MessagePayload = data;
					setMessagesList((prev) => [...prev, newMessage]);
					break;
			}
		};

		return () => {
			if (socket.onmessage) {
				socket.onmessage = null;
			}
		};
	}, [socket]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback((e: any) => {
		const text = e.target.value;
		setMessageInput(text);
	}, []);

	const getKeyHandler = (e: any) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onClickHandler();
		}
	};

	const sendLiveMessage = (trimmed: string) => {
		if (socket && socket.readyState === 1) {
			socket.send(
				JSON.stringify({
					event: 'message',
					data: trimmed,
				}),
			);
			setMessageInput('');
		} else {
			sweetErrorAlert('Chat connection not ready. Please try again later.');
		}
	};

	const sendAiMessage = async (trimmed: string) => {
		const historyForApi = aiMessages.map((m) => ({ role: m.role, content: m.content }));
		setAiMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
		setMessageInput('');
		setAiLoading(true);
		try {
			const res = await fetch('/api/ai/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: historyForApi, message: trimmed }),
			});
			const data = await res.json();
			if (!res.ok) {
				setAiMessages((prev) => [
					...prev,
					{
						role: 'assistant',
						content: data?.error || 'AI is temporarily unavailable. Please try again.',
					},
				]);
			} else {
				setAiMessages((prev) => [
					...prev,
					{
						role: 'assistant',
						content: data.reply,
						suggestions: data.suggestions || [],
						location: data.location || null,
					},
				]);
			}
		} catch (err: any) {
			setAiMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: "Sorry, I couldn't reach the server. Check your connection and try again.",
				},
			]);
		} finally {
			setAiLoading(false);
		}
	};

	const onClickHandler = () => {
		const trimmed = messageInput.trim();
		if (!trimmed) {
			sweetErrorAlert(Messages.error4);
			return;
		}
		if (mode === 'ai') {
			if (!aiLoading) sendAiMessage(trimmed);
		} else {
			sendLiveMessage(trimmed);
		}
	};

	const renderAiSuggestions = (suggestions: AiSuggestion[] | undefined, location: string | null | undefined) => {
		if (!suggestions || suggestions.length === 0) return null;
		return (
			<Stack className={'ai-suggestions'}>
				{suggestions.map((s) => (
					<Link key={s._id} href={`/property/detail?id=${s._id}`} className={'ai-suggestion-card'}>
						<div
							className={'ai-suggestion-img'}
							style={{ backgroundImage: `url(${buildPropertyImage(s.image)})` }}
						/>
						<div className={'ai-suggestion-info'}>
							<span className={'ai-suggestion-loc'}>
								<LocationOnRoundedIcon fontSize={'inherit'} />
								{s.location}
								{s.type ? ` · ${s.type}` : ''}
							</span>
							<strong className={'ai-suggestion-title'}>{s.title}</strong>
							{typeof s.price === 'number' && s.price > 0 ? (
								<span className={'ai-suggestion-price'}>From ${s.price}</span>
							) : null}
							<span className={'ai-suggestion-cta'}>
								View details <ArrowForwardRoundedIcon fontSize={'inherit'} />
							</span>
						</div>
					</Link>
				))}
				{location ? (
					<Link href={buildLocationHref(location)} className={'ai-suggestion-all'}>
						Browse all trips in {location}
						<ArrowForwardRoundedIcon fontSize={'small'} />
					</Link>
				) : null}
			</Stack>
		);
	};

	const renderAiContent = () => (
		<Stack className={'chat-main ai-main'}>
			{aiMessages.map((m, idx) => {
				if (m.role === 'user') {
					return (
						<Box
							key={`ai-u-${idx}`}
							component={'div'}
							flexDirection={'row'}
							style={{ display: 'flex' }}
							alignItems={'flex-end'}
							justifyContent={'flex-end'}
							sx={{ m: '8px 0' }}
						>
							<div className={'msg-right'}>{m.content}</div>
						</Box>
					);
				}
				return (
					<Box
						key={`ai-a-${idx}`}
						component={'div'}
						flexDirection={'row'}
						style={{ display: 'flex' }}
						alignItems={'flex-end'}
						sx={{ m: '8px 0' }}
					>
						<div className={'ai-avatar'}>
							<AutoAwesomeRoundedIcon fontSize={'small'} />
						</div>
						<div className={'ai-msg-wrap'}>
							<div className={'msg-left ai-msg'}>{m.content}</div>
							{renderAiSuggestions(m.suggestions, m.location)}
						</div>
					</Box>
				);
			})}
			{aiLoading ? (
				<Box
					component={'div'}
					flexDirection={'row'}
					style={{ display: 'flex' }}
					alignItems={'flex-end'}
					sx={{ m: '8px 0' }}
				>
					<div className={'ai-avatar'}>
						<AutoAwesomeRoundedIcon fontSize={'small'} />
					</div>
					<div className={'msg-left ai-typing'}>
						<span />
						<span />
						<span />
					</div>
				</Box>
			) : null}
		</Stack>
	);

	const renderLiveContent = () => (
		<Stack className={'chat-main'}>
			<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
				<div className={'welcome'}>Welcome to Live chat!</div>
			</Box>
			{messagesList.map((ele: MessagePayload, index: number) => {
				const { text, memberData } = ele;
				const messageText = text || '';
				const memberImage = memberData?.memberImage
					? `${REACT_APP_API_URL}/${memberData?.memberImage}`
					: '/img/profile/defaultUser.svg';
				const isOwnMessage = memberData?._id === user?._id;
				return (
					<Box
						key={`${memberData?._id || 'unknown'}-${index}-${messageText.substring(0, 10)}`}
						component={'div'}
						flexDirection={'row'}
						style={{ display: 'flex' }}
						alignItems={'flex-end'}
						justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
						sx={{ m: '10px 0px' }}
					>
						{isOwnMessage ? (
							<div className={'msg-right'}>{messageText}</div>
						) : (
							<>
								<Avatar alt={memberData?.memberNick || 'User'} src={memberImage} />
								<div className={'msg-left'}>{messageText}</div>
							</>
						)}
					</Box>
				);
			})}
		</Stack>
	);

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}
			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				<Box className={'chat-top'} component={'div'}>
					<div className={'chat-tabs'}>
						<button
							type={'button'}
							className={`chat-tab ${mode === 'ai' ? 'active' : ''}`}
							onClick={() => setMode('ai')}
						>
							<AutoAwesomeRoundedIcon fontSize={'small'} />
							<span>AI Guide</span>
						</button>
						<button
							type={'button'}
							className={`chat-tab ${mode === 'live' ? 'active' : ''}`}
							onClick={() => setMode('live')}
						>
							<ChatRoundedIcon fontSize={'small'} />
							<span>Live Chat</span>
							{mode !== 'live' && onlineUsers > 0 ? (
								<RippleBadge style={{ marginLeft: 6 }} badgeContent={onlineUsers} />
							) : null}
						</button>
					</div>
				</Box>
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>{mode === 'ai' ? renderAiContent() : renderLiveContent()}</ScrollableFeed>
				</Box>
				<Box className={'chat-bott'} component={'div'}>
					<input
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={mode === 'ai' ? 'Ask me anything about your next trip…' : 'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
						autoComplete="off"
						disabled={mode === 'ai' && aiLoading}
					/>
					<button
						className={'send-msg-btn'}
						onClick={onClickHandler}
						disabled={mode === 'ai' && aiLoading}
					>
						<SendIcon style={{ color: '#fff' }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
