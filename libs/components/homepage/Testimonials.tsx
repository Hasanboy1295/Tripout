import React, { useEffect, useRef, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { REACT_APP_API_URL } from '../../config';
import { useTranslation } from 'next-i18next';

// Helper function to strip HTML tags from content
const stripHtml = (html: string): string => {
	if (!html) return '';
	return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

const extractFirstImageFromHtml = (html?: string): string | undefined => {
	if (!html) return undefined;
	const imageSourceMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
	return imageSourceMatch?.[1];
};

const resolveImageUrl = (imagePath?: string): string => {
	if (!imagePath) return '/img/community/communityImg.png';
	if (/^https?:\/\//i.test(imagePath)) return imagePath;
	const rawBaseUrl = REACT_APP_API_URL && REACT_APP_API_URL !== 'undefined' ? REACT_APP_API_URL : '';
	const baseUrl = rawBaseUrl.replace(/\/$/, '');
	const normalizedPath = imagePath.replace(/^\//, '');
	return baseUrl ? `${baseUrl}/${normalizedPath}` : `/${normalizedPath}`;
};

const formatCategory = (category?: BoardArticleCategory): string => {
	if (!category) return 'Article';
	return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

const partners = [
	{
		name: 'Boltshift',
		svg: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
			</svg>
		),
	},
	{
		name: 'Lightbox',
		svg: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" fill="none"/>
				<polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" fill="none"/>
				<line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
			</svg>
		),
	},
	{
		name: 'Spherule',
		svg: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
				<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" fill="none"/>
			</svg>
		),
	},
	{
		name: 'GlobalBank',
		svg: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
				<path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2"/>
			</svg>
		),
	},
	{
		name: 'Nietzsche',
		svg: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
				<path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" strokeWidth="2"/>
			</svg>
		),
	},
];

const Testimonials = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const [activeIdx, setActiveIdx] = useState(0);
	const [activeNav, setActiveNav] = useState<'prev' | 'next' | null>(null);
	const navResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const freeArticlesQuery = useQuery(GET_BOARD_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.FREE },
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const recommendArticlesQuery = useQuery(GET_BOARD_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.RECOMMEND },
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const newsArticlesQuery = useQuery(GET_BOARD_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.NEWS },
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const humorArticlesQuery = useQuery(GET_BOARD_ARTICLES, {
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: { articleCategory: BoardArticleCategory.HUMOR },
			},
		},
		fetchPolicy: 'cache-and-network',
	});

	const mergedArticles = [
		...(freeArticlesQuery.data?.getBoardArticles?.list || []),
		...(recommendArticlesQuery.data?.getBoardArticles?.list || []),
		...(newsArticlesQuery.data?.getBoardArticles?.list || []),
		...(humorArticlesQuery.data?.getBoardArticles?.list || []),
	] as BoardArticle[];

	const uniqueArticles = Array.from(new Map(mergedArticles.map((article) => [article._id, article])).values());

	const articles = uniqueArticles
		.filter((article) => {
			const hasTitle = Boolean(article.articleTitle?.trim());
			const hasText = Boolean(stripHtml(article.articleContent));
			const hasImage = Boolean(article.articleImage || extractFirstImageFromHtml(article.articleContent));
			return hasTitle || hasText || hasImage;
		})
		.sort((firstArticle, secondArticle) => {
			const firstDate = new Date(firstArticle.createdAt).getTime();
			const secondDate = new Date(secondArticle.createdAt).getTime();
			return secondDate - firstDate;
		});

	// Real Board Article dan reviews yaratish - FAQAT articleImage ishlatamiz
	const reviews = articles.map((a) => {
		const cleanText = stripHtml(a.articleContent);
		const imageFromContent = extractFirstImageFromHtml(a.articleContent);
		const chosenImage = a.articleImage || imageFromContent;

		return {
		name: a.memberData?.memberFullName || a.memberData?.memberNick || t('unknown_author'),
		role: a.memberData?.memberNick || 'member',
		category: formatCategory(a.articleCategory),
		publishedAt: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '',
		text: cleanText
			? `${cleanText.slice(0, 250)}${cleanText.length > 250 ? '...' : ''}`
			: t('open_article_full'),
		image: resolveImageUrl(chosenImage),
		title: a.articleTitle || t('untitled_article'),
		};
	});

	// leftPhotos - active article bilan birga aylanadigan rasmlar
	const leftPhotos = [0, 1, 2]
		.map((offset) => {
			if (reviews.length === 0) return null;
			const article = reviews[(activeIdx + offset) % reviews.length];
			if (!article) return null;

			return {
				image: article.image,
				title: article.title,
				meta: `${article.category}${article.publishedAt ? ` • ${article.publishedAt}` : ''}`,
			};
		})
		.filter(Boolean);

	const prev = () => {
		if (reviews.length < 2) return;
		setActiveNav('prev');
		if (navResetTimer.current) clearTimeout(navResetTimer.current);
		navResetTimer.current = setTimeout(() => setActiveNav(null), 220);
		setActiveIdx((i) => (i === 0 ? reviews.length - 1 : i - 1));
	};
	const next = () => {
		if (reviews.length < 2) return;
		setActiveNav('next');
		if (navResetTimer.current) clearTimeout(navResetTimer.current);
		navResetTimer.current = setTimeout(() => setActiveNav(null), 220);
		setActiveIdx((i) => (i === reviews.length - 1 ? 0 : i + 1));
	};

	useEffect(() => {
		return () => {
			if (navResetTimer.current) clearTimeout(navResetTimer.current);
		};
	}, []);

	useEffect(() => {
		reviews.forEach((review) => {
			if (!review.image) return;
			const preloadedImage = new window.Image();
			preloadedImage.src = review.image;
		});
	}, [reviews]);

	useEffect(() => {
		if (activeIdx >= reviews.length) setActiveIdx(0);
	}, [activeIdx, reviews.length]);

	// Loading holatini tekshirish
	const isLoading =
		freeArticlesQuery.loading || recommendArticlesQuery.loading || newsArticlesQuery.loading || humorArticlesQuery.loading;

	if (isLoading && reviews.length === 0) return <div style={{ padding: 32, textAlign: 'center' }}>{t('loading_articles')}</div>;
	if (reviews.length === 0) return <div style={{ padding: 32, textAlign: 'center' }}>{t('no_articles')}</div>;

	const review = reviews[activeIdx] || reviews[0];

	if (device === 'mobile') {
		return (
			<div className={'testimonials'}>
				<div className={'partners-bar'}>
					{partners.map((p, i) => (
						<div key={i} className={`partner-item ${i === 1 ? 'active' : ''}`}>
							{p.svg}
							<span>{p.name}</span>
						</div>
					))}
				</div>
				<div className={'testimonials-body'}>
					<div className={'testimonials-right'}>
						<div className={'t-subtitle'}>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
								<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#e8a54b"/>
							</svg>
							{t('community_board')}
						</div>
						<h2 className={'t-title'}>{t('real_articles')}</h2>
						<div className={'t-meta-row'}>
							<span className={'t-chip'}>{review.category}</span>
							{review.publishedAt && <span className={'t-date'}>{review.publishedAt}</span>}
						</div>
						<p className={'t-article-title'}>{review.title}</p>
						<p className={'t-text'}>{review.text}</p>
						<div className={'t-author'}>
							<span className={'t-name'}>{review.name}</span>
							<span className={'t-role'}>{t('by_prefix')} {review.role}</span>
						</div>
						<div className={'t-nav'}>
							<button disabled={reviews.length < 2} className={`t-nav-btn${activeNav === 'prev' ? ' active' : ''}`} onClick={prev}>‹</button>
							<button disabled={reviews.length < 2} className={`t-nav-btn${activeNav === 'next' ? ' active' : ''}`} onClick={next}>›</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={'testimonials'}>
			{/* Partner logos bar */}
			<div className={'partners-bar'}>
				{partners.map((p, i) => (
					<div key={i} className={`partner-item ${i === 1 ? 'active' : ''}`}>
						{p.svg}
						<span>{p.name}</span>
					</div>
				))}
			</div>

			{/* Main testimonial body */}
			<div className={'testimonials-body'}>
				{/* Left: traveler photos */}
				<div className={'testimonials-left'}>
					{leftPhotos[0] && (
						<div className={'photo-top'}>
							<img src={leftPhotos[0].image} alt={leftPhotos[0].title} loading="eager" decoding="async" onError={(e) => { e.currentTarget.src = '/img/community/communityImg.png'; }} />
							<div className={'location-badge'}>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
								{leftPhotos[0].meta}
							</div>
						</div>
					)}
					{leftPhotos[1] && (
						<div className={'photo-center'}>
							<img src={leftPhotos[1].image} alt={leftPhotos[1].title} loading="eager" decoding="async" onError={(e) => { e.currentTarget.src = '/img/community/communityImg.png'; }} />
							<div className={'location-badge'}>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
								{leftPhotos[1].meta}
							</div>
						</div>
					)}
					{leftPhotos[2] && (
						<div className={'photo-bottom'}>
							<img src={leftPhotos[2].image} alt={leftPhotos[2].title} loading="eager" decoding="async" onError={(e) => { e.currentTarget.src = '/img/community/communityImg.png'; }} />
							<div className={'location-badge'}>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
								{leftPhotos[2].meta}
							</div>
						</div>
					)}
				</div>

				{/* Right: review content */}
				<div className={'testimonials-right'}>
					<div className={'t-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#e8a54b"/>
						</svg>
						{t('community_board')}
					</div>
					<h2 className={'t-title'}>{t('real_articles')}</h2>
					<div className={'t-meta-row'}>
						<span className={'t-chip'}>{review.category}</span>
						{review.publishedAt && <span className={'t-date'}>{review.publishedAt}</span>}
					</div>
					<p className={'t-article-title'}>{review.title}</p>
					<p className={'t-text'}>{review.text}</p>
					<div className={'t-author'}>
						<span className={'t-name'}>{review.name}</span>
						<span className={'t-role'}>{t('by_prefix')} {review.role}</span>
					</div>
				<div className={'t-nav'}>
					<button disabled={reviews.length < 2} className={`t-nav-btn ${activeNav === 'prev' ? 'active' : ''}`} onClick={prev}>‹</button>
					<button disabled={reviews.length < 2} className={`t-nav-btn ${activeNav === 'next' ? 'active' : ''}`} onClick={next}>›</button>
				</div>
					{/* Big quote mark */}
					<div className={'t-quote'}>"</div>
				</div>
			</div>
		</div>
	);
};

export default Testimonials;
