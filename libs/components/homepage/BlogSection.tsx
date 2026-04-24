import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const PersonIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#e8a54b" strokeWidth="2" strokeLinecap="round"/>
		<circle cx="12" cy="7" r="4" stroke="#e8a54b" strokeWidth="2"/>
	</svg>
);

const CalIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
		<rect x="3" y="4" width="18" height="18" rx="2" stroke="#e8a54b" strokeWidth="2"/>
		<line x1="3" y1="9" x2="21" y2="9" stroke="#e8a54b" strokeWidth="2"/>
		<line x1="8" y1="2" x2="8" y2="6" stroke="#e8a54b" strokeWidth="2" strokeLinecap="round"/>
		<line x1="16" y1="2" x2="16" y2="6" stroke="#e8a54b" strokeWidth="2" strokeLinecap="round"/>
	</svg>
);

const ArrowIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
		<path d="M7 17L17 7M17 7H7M17 7V17" stroke="#e8a54b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
	</svg>
);

const BlogSection = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const posts = [
		{
			id: 1,
			image: '/img/destinations/santorini.jpg',
			author: 'Liam Patel',
			date: 'Sep 20, 2024',
			title: t('blog_post_1_title'),
			excerpt: t('blog_post_1_excerpt'),
			featured: true,
		},
		{
			id: 2,
			image: '/img/destinations/turkey.jpg',
			author: 'Liam Patel',
			date: 'Sep 20, 2024',
			title: t('blog_post_2_title'),
		},
		{
			id: 3,
			image: '/img/destinations/greece.jpg',
			author: 'Liam Patel',
			date: 'Sep 20, 2024',
			title: t('blog_post_3_title'),
		},
		{
			id: 4,
			image: '/img/destinations/paris.jpg',
			author: 'Liam Patel',
			date: 'Sep 20, 2024',
			title: t('blog_post_4_title'),
		},
	];

	const featured = posts[0];
	const sidePosts = posts.slice(1);

	if (device === 'mobile') {
		return (
			<div className={'blog-section'}>
				<div className={'blog-header'}>
					<div className={'blog-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
						</svg>
						{t('our_blog')}
					</div>
					<h2 className={'blog-title'}>{t('travel_tips_inspiration')}</h2>
				</div>
				<div className={'blog-grid'}>
					{posts.map((post) => (
						<div key={post.id} className={'blog-card-side'}>
							<div className={'side-img'}>
								<img src={post.image} alt={post.title} />
							</div>
							<div className={'side-info'}>
								<div className={'post-meta'}>
									<span><PersonIcon /> {t('by_label')} {post.author}</span>
									<span><CalIcon /> {post.date}</span>
								</div>
								<h3 className={'post-title'}>{post.title}</h3>
								<hr className={'post-divider'} />
								<Link href={'/community'} className={'read-more'}>{t('read_more')} <ArrowIcon /></Link>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={'blog-section'}>
			{/* Header */}
			<div className={'blog-header'}>
				<div className={'blog-subtitle'}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
						<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
					</svg>
					{t('our_blog')}
				</div>
				<h2 className={'blog-title'}>{t('travel_tips_inspiration')}</h2>
			</div>

			{/* Grid */}
			<div className={'blog-grid'}>
				{/* Featured left card */}
				<div className={'blog-card-featured'}>
					<div className={'featured-img'}>
						<img src={featured.image} alt={featured.title} />
					</div>
					<div className={'featured-info'}>
						<div className={'post-meta'}>
							<span><PersonIcon /> {t('by_label')} {featured.author}</span>
							<span><CalIcon /> {featured.date}</span>
						</div>
						<h3 className={'post-title'}>{featured.title}</h3>
						<p className={'post-excerpt'}>{featured.excerpt}</p>
						<hr className={'post-divider'} />
						<Link href={'/community'} className={'read-more'}>{t('read_more')} <ArrowIcon /></Link>
					</div>
				</div>

				{/* Right side posts */}
				<div className={'blog-side-list'}>
					{sidePosts.map((post) => (
						<div key={post.id} className={'blog-card-side'}>
							<div className={'side-img'}>
								<img src={post.image} alt={post.title} />
							</div>
							<div className={'side-info'}>
								<div className={'post-meta'}>
									<span><PersonIcon /> {t('by_label')} {post.author}</span>
									<span><CalIcon /> {post.date}</span>
								</div>
								<h3 className={'post-title'}>{post.title}</h3>
								<hr className={'post-divider'} />
								<Link href={'/community'} className={'read-more'}>{t('read_more')} <ArrowIcon /></Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BlogSection;
