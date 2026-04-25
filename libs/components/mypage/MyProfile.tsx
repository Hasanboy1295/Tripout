import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, IconButton, Stack, Typography, LinearProgress } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { GET_MEMBER } from '../../../apollo/user/query';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert, sweetTopSuccessAlert } from '../../sweetAlert';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailStorageKey = (id: string) => `tripout:profileEmail:${id}`;

const TRAVEL_INTERESTS = [
	{ emoji: '🏞️', label: 'Nature' },
	{ emoji: '🏙️', label: 'Cities' },
	{ emoji: '🍜', label: 'Food' },
	{ emoji: '🏖️', label: 'Beach' },
	{ emoji: '⛰️', label: 'Mountains' },
	{ emoji: '🎭', label: 'Culture' },
	{ emoji: '🎢', label: 'Adventure' },
	{ emoji: '💎', label: 'Luxury' },
	{ emoji: '🚆', label: 'Trains' },
	{ emoji: '🏕️', label: 'Camping' },
];

const COVERAGE = [
	{ emoji: '🌏', label: 'Asia', value: 72 },
	{ emoji: '🌍', label: 'Europe', value: 45 },
	{ emoji: '🌎', label: 'Americas', value: 18 },
	{ emoji: '🌍', label: 'Africa', value: 8 },
];

const comingSoon = (feature: string) => sweetTopSuccessAlert(`${feature} — coming soon!`, 1800);

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);
	const [emailValue, setEmailValue] = useState('');
	const [emailError, setEmailError] = useState<string | null>(null);
	const [activeInterests, setActiveInterests] = useState<string[]>(['Nature', 'Cities', 'Beach', 'Culture']);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);
	const { data: memberData, refetch: refetchMember } = useQuery(GET_MEMBER, {
		variables: { input: user?._id },
		skip: !user?._id,
		fetchPolicy: 'cache-and-network',
	});

	const memberFull: any = memberData?.getMember || null;
	const followersCount = memberFull?.memberFollowers ?? 0;
	const followingsCount = memberFull?.memberFollowings ?? 0;
	const placesVisitedCount = memberFull?.memberViews ?? 0;
	const reviewsCount = memberFull?.memberLikes ?? 0;
	const blogPostsCount = memberFull?.memberArticles ?? 0;

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData({
			...updateData,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
			memberDesc: user.memberDesc ?? '',
		});
	}, [user]);

	useEffect(() => {
		if (typeof window === 'undefined' || !user?._id) return;
		const stored = window.localStorage.getItem(emailStorageKey(user._id));
		if (stored) setEmailValue(stored);
	}, [user?._id]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files?.[0];
			if (!image) return;

			// Basic client-side validations
			const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
			if (!allowedTypes.includes(image.type)) {
				await sweetMixinErrorAlert('Only JPG, JPEG, or PNG images are allowed.');
				if (fileInputRef.current) fileInputRef.current.value = '';
				return;
			}
			if (image.size > 8 * 1024 * 1024) {
				await sweetMixinErrorAlert('Image must be smaller than 8 MB.');
				if (fileInputRef.current) fileInputRef.current.value = '';
				return;
			}

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target)
				  }`,
					variables: { file: null, target: 'member' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			console.log('imageUploader response:', response.data);
			if (response.data?.errors?.length) {
				const rawMsg = response.data.errors[0]?.message || 'Image upload failed';
				const friendly = /Unexpected error value/i.test(rawMsg) || /UPLOAD_FAILED/i.test(rawMsg)
					? 'Server could not save the image. Please try again later.'
					: rawMsg;
				console.error('GraphQL upload errors:', response.data.errors);
				await sweetMixinErrorAlert(friendly);
				return;
			}

			const responseImage = response.data?.data?.imageUploader;
			if (!responseImage) {
				await sweetMixinErrorAlert('Image upload failed: no response from server.');
				return;
			}
			setUpdateData((prev) => ({ ...prev, memberImage: responseImage }));
			await sweetTopSuccessAlert('Photo uploaded — click Save changes to apply.', 1800);

			// Reset the input so re-selecting the same file still triggers onChange
			if (fileInputRef.current) fileInputRef.current.value = '';
			return `${REACT_APP_API_URL}/${responseImage}`;
		} catch (err: any) {
			console.error('Error, uploadImage:', err?.response?.data || err);
			const detail = err?.response?.data?.errors?.[0]?.message || err?.message || 'Unknown error';
			await sweetMixinErrorAlert(`Image upload failed: ${detail}`);
		}
	};

	const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const img = e.currentTarget;
		if (img.dataset.fallback) return; // already failed once
		img.dataset.fallback = '1';
		img.src = '/img/profile/defaultUser.svg';
	};

	const updateProfileHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);

			// Email validation: empty is OK, otherwise must look like an email
			if (emailValue && !EMAIL_REGEX.test(emailValue.trim())) {
				setEmailError('Please enter a valid email address (e.g. you@example.com)');
				await sweetMixinErrorAlert('Invalid email format');
				return;
			}
			setEmailError(null);

			updateData._id = user._id;

			const result = await updateMember({ variables: { input: updateData } });

			// @ts-ignore
			const jwtToken = result.data.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);

			// Persist email locally (no backend field yet)
			if (typeof window !== 'undefined' && user._id) {
				if (emailValue) {
					window.localStorage.setItem(emailStorageKey(user._id), emailValue.trim());
				} else {
					window.localStorage.removeItem(emailStorageKey(user._id));
				}
			}
			await sweetMixinSuccessAlert('Profile updated successfully.');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [updateData, emailValue, user._id]);

	const isFormDisabled = !updateData.memberNick || !updateData.memberPhone;

	const triggerImageUpload = () => {
		fileInputRef.current?.click();
	};

	const handleEmailChange = (val: string) => {
		setEmailValue(val);
		if (!val) {
			setEmailError(null);
			return;
		}
		setEmailError(EMAIL_REGEX.test(val.trim()) ? null : 'Please enter a valid email (e.g. you@example.com)');
	};

	const refreshSocial = async () => {
		try {
			await refetchMember();
			await sweetTopSuccessAlert('Refreshed', 1200);
		} catch (e) {
			// silent
		}
	};

	const toggleInterest = (label: string) => {
		setActiveInterests((cur) =>
			cur.includes(label) ? cur.filter((x) => x !== label) : [...cur, label],
		);
	};

	const initials = (user?.memberNick || 'U').slice(0, 2).toUpperCase();
	const userCreatedAt = (user as any)?.createdAt;
	const memberSince = userCreatedAt ? new Date(userCreatedAt) : null;
	const memberSinceLabel = memberSince
		? `${memberSince.toLocaleString('default', { month: 'short' })} ${memberSince.getFullYear()}`
		: 'Recently';

	if (device === 'mobile') return <>MY PROFILE PAGE MOBILE</>;

	return (
		<div id="my-profile-page">
			{/* ===== Header ===== */}
			<Stack className="profile-header">
				<Stack className="header-text">
					<Typography className="page-title">My Profile</Typography>
					<Typography className="page-meta">
						<span>Welcome back, {user?.memberNick || 'traveler'} 👋</span>
						<span className="dot">·</span>
						<span>Last login 2 hours ago</span>
						<span className="dot">·</span>
						<span>{user?.memberAddress || 'Earth'}</span>
					</Typography>
				</Stack>
				<Stack className="header-actions" direction="row">
					<IconButton className="header-icon-btn" onClick={() => comingSoon('Notifications')} aria-label="Notifications">
						<NotificationsNoneIcon />
					</IconButton>
					<IconButton className="header-icon-btn" onClick={() => comingSoon('Language settings')} aria-label="Language">
						<LanguageIcon />
					</IconButton>
					<IconButton className="header-icon-btn" onClick={() => comingSoon('Settings')} aria-label="Settings">
						<SettingsOutlinedIcon />
					</IconButton>
				</Stack>
			</Stack>

			{/* ===== Travel Journey Hero ===== */}
			<Stack className="travel-hero">
				<Stack className="hero-decoration" />
				<Stack className="hero-left">
					<Typography className="hero-eyebrow">YOUR TRAVEL JOURNEY</Typography>
					<Typography className="hero-title">Explorer</Typography>
					<Typography className="hero-level">
						Level 5 <span className="hero-emoji">🌍</span>
					</Typography>
					<Typography className="hero-copy">Top 8% of all Tripout travelers worldwide</Typography>
					<Button className="hero-cta" onClick={() => comingSoon('Achievements')}>
						View achievements <ArrowForwardIcon fontSize="small" />
					</Button>
				</Stack>
				<Stack className="hero-right">
					<Typography className="score">9.2</Typography>
					<Typography className="score-label">TRAVEL SCORE</Typography>
				</Stack>
			</Stack>

			{/* ===== Stats Row ===== */}
			<Stack className="stats-row" direction="row">
				<Stack className="stat-card">
					<Stack className="stat-icon"><ImageOutlinedIcon /></Stack>
					<Typography className="stat-label">PROFILE VIEWS</Typography>
					<Typography className="stat-value">{placesVisitedCount}</Typography>
					<Typography className="stat-delta"><TrendingUpIcon fontSize="inherit" /> total</Typography>
				</Stack>
				<Stack className="stat-card">
					<Stack className="stat-icon stat-icon--star"><StarIcon /></Stack>
					<Typography className="stat-label">LIKES</Typography>
					<Typography className="stat-value">{reviewsCount}</Typography>
					<Typography className="stat-delta"><TrendingUpIcon fontSize="inherit" /> received</Typography>
				</Stack>
				<Stack className="stat-card">
					<Stack className="stat-icon stat-icon--edit"><EditNoteOutlinedIcon /></Stack>
					<Typography className="stat-label">ARTICLES</Typography>
					<Typography className="stat-value">{blogPostsCount}</Typography>
					<Typography className="stat-delta"><TrendingUpIcon fontSize="inherit" /> published</Typography>
				</Stack>
			</Stack>

			{/* ===== Two-column profile grid ===== */}
			<Stack className="profile-grid" direction="row">
				{/* Form column */}
				<Stack className="form-card">
					<Stack className="card-head" direction="row">
						<Typography className="card-title">Profile information</Typography>
					</Stack>

					<Stack className="profile-id-row" direction="row">
						<Stack className={`avatar-block ${updateData?.memberImage ? '' : 'avatar-block--default'}`}>
							<img
								src={
									updateData?.memberImage
										? `${REACT_APP_API_URL}/${updateData.memberImage}`
										: '/img/profile/defaultUser.svg'
								}
								alt="member"
								className="avatar-img"
								onError={handleAvatarError}
							/>
						</Stack>
						<Stack className="id-text">
							<Typography className="id-name">{user?.memberNick || 'Traveler'}</Typography>
							<Typography className="id-meta">
								Member since {memberSinceLabel} · {user?.memberType || 'USER'}
							</Typography>
						</Stack>
						<input
							type="file"
							id="hidden-input"
							ref={fileInputRef}
							onChange={uploadImage}
							accept="image/jpg, image/jpeg, image/png"
							style={{ display: 'none' }}
						/>
						<Button
							className="change-photo-btn"
							component="label"
							htmlFor="hidden-input"
						>
							<PhotoCameraOutlinedIcon fontSize="small" /> Change photo
						</Button>
					</Stack>

					<Stack className="form-grid" direction="row">
						<Stack className="form-field">
							<Typography className="field-label">USERNAME</Typography>
							<input
								type="text"
								placeholder="Your username"
								value={updateData.memberNick || ''}
								onChange={(e) => setUpdateData({ ...updateData, memberNick: e.target.value })}
							/>
						</Stack>
						<Stack className="form-field">
							<Typography className="field-label">PHONE</Typography>
							<input
								type="text"
								placeholder="Your phone"
								value={updateData.memberPhone || ''}
								onChange={(e) => setUpdateData({ ...updateData, memberPhone: e.target.value })}
							/>
						</Stack>
					</Stack>

					<Stack className="form-field">
						<Typography className="field-label">EMAIL</Typography>
						<input
							type="email"
							placeholder="your@email.com"
							value={emailValue}
							onChange={(e) => handleEmailChange(e.target.value)}
							className={emailError ? 'has-error' : ''}
						/>
						{emailError && (
							<Typography className="field-error">{emailError}</Typography>
						)}
					</Stack>

					<Stack className="form-field">
						<Typography className="field-label">ADDRESS</Typography>
						<input
							type="text"
							placeholder="City, Country"
							value={updateData.memberAddress || ''}
							onChange={(e) => setUpdateData({ ...updateData, memberAddress: e.target.value })}
						/>
					</Stack>

					<Stack className="form-field">
						<Typography className="field-label">BIO</Typography>
						<textarea
							className="bio-area"
							placeholder="Tell travelers about yourself..."
							value={updateData.memberDesc || ''}
							onChange={(e) => setUpdateData({ ...updateData, memberDesc: e.target.value })}
						/>
					</Stack>

					<Button className="save-btn" onClick={updateProfileHandler} disabled={isFormDisabled}>
						Save changes <ArrowForwardIcon fontSize="small" />
					</Button>
				</Stack>

				{/* Side column */}
				<Stack className="side-column">
					{/* Social card */}
					<Stack className="side-card">
						<Stack className="card-head" direction="row">
							<Typography className="card-title">Social</Typography>
							<Button className="card-link" onClick={refreshSocial}>Refresh</Button>
						</Stack>
						<Stack className="social-counts" direction="row">
							<Stack className="social-cell social-cell--static">
								<Typography className="social-num">{followersCount}</Typography>
								<Typography className="social-lbl">Followers</Typography>
							</Stack>
							<Stack className="social-cell social-cell--static">
								<Typography className="social-num">{followingsCount}</Typography>
								<Typography className="social-lbl">Following</Typography>
							</Stack>
						</Stack>
						<Typography className="micro-label">TRAVEL INTERESTS</Typography>
						<Stack className="interest-chips" direction="row" flexWrap="wrap">
							{TRAVEL_INTERESTS.map((it) => {
								const active = activeInterests.includes(it.label);
								return (
									<Button
										key={it.label}
										className={`interest-chip ${active ? 'active' : ''}`}
										onClick={() => toggleInterest(it.label)}
									>
										<span className="chip-emoji">{it.emoji}</span> {it.label}
									</Button>
								);
							})}
						</Stack>
					</Stack>

					{/* World coverage */}
					<Stack className="side-card">
						<Stack className="card-head" direction="row">
							<Typography className="card-title">World coverage</Typography>
							<Button className="card-link" onClick={() => comingSoon('Coverage tips')}>
								Improve <ArrowForwardIcon fontSize="small" />
							</Button>
						</Stack>
						<Stack className="coverage-list">
							{COVERAGE.map((c) => (
								<Stack key={c.label} className="coverage-row">
									<Stack className="coverage-top" direction="row">
										<Typography className="coverage-label">
											<span className="cov-emoji">{c.emoji}</span> {c.label}
										</Typography>
										<Typography className="coverage-pct">{c.value}%</Typography>
									</Stack>
									<LinearProgress
										variant="determinate"
										value={c.value}
										className="coverage-bar"
									/>
								</Stack>
							))}
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
		memberDesc: '',
	},
};

export default MyProfile;
