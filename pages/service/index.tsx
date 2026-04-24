import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutFull from '../../libs/components/layout/LayoutFull';

export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});

const services = [
	{
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#e8a54b" strokeWidth="1.5"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#e8a54b" strokeWidth="1.5" fill="none"/></svg>
		),
		title: 'Adventure Excursions',
		desc: 'Donec sit amet felis id massa imperdiet pellentesque. Mauris mollis sem sit amet elit faucibus aliquet.',
	},
	{
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="#e8a54b" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="#e8a54b" strokeWidth="1.5"/></svg>
		),
		title: 'Travel Assistance',
		desc: 'Donec sit amet felis id massa imperdiet pellentesque. Mauris mollis sem sit amet elit faucibus aliquet.',
	},
	{
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" stroke="#e8a54b" strokeWidth="1.5" fill="none"/></svg>
		),
		title: 'Flight Arrangements',
		desc: 'Donec sit amet felis id massa imperdiet pellentesque. Mauris mollis sem sit amet elit faucibus aliquet.',
	},
	{
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#e8a54b" strokeWidth="1.5"/><circle cx="9" cy="7" r="4" stroke="#e8a54b" strokeWidth="1.5"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#e8a54b" strokeWidth="1.5"/></svg>
		),
		title: 'Group Discounts',
		desc: 'Donec sit amet felis id massa imperdiet pellentesque. Mauris mollis sem sit amet elit faucibus aliquet.',
	},
	{
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#e8a54b" strokeWidth="1.5"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 11v4M10 13h4" stroke="#e8a54b" strokeWidth="1.5"/></svg>
		),
		title: 'Tour Packages',
		desc: 'Donec sit amet felis id massa imperdiet pellentesque. Mauris mollis sem sit amet elit faucibus aliquet.',
	},
	{
		icon: (
			<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#e8a54b" strokeWidth="1.5"/><circle cx="12" cy="10" r="3" stroke="#e8a54b" strokeWidth="1.5"/></svg>
		),
		title: 'Local Guides',
		desc: 'Donec sit amet felis id massa imperdiet pellentesque. Mauris mollis sem sit amet elit faucibus aliquet.',
	},
];

const stats = [
	{ num: '8745', label: 'Happy Travelers' },
	{ num: '9874', label: 'Destinations Visited' },
	{ num: '7841', label: 'Memorable Journeys' },
	{ num: '6874', label: 'Given Expert Guides' },
];

const testimonials = [
	{
		name: 'Sarah Thompson',
		role: 'Tourists',
		location: 'Thailand, Asia',
		stars: 5,
		image: '/img/testimonials/person1.jpg',
		text: 'Our recent trip was absolutely unforgettable! Every detail was meticulously planned, from our stunning accommodations to the incredible local experiences. The guides were friendly and knowledgeable, making us feel immersed in the culture. We discovered hidden gems that we never would have found on our own. I can\'t wait to book our next adventure with this amazing team.',
	},
	{
		name: 'Michael Lee',
		role: 'Tourists',
		location: 'Bali, Indonesia',
		stars: 5,
		image: '/img/testimonials/person2.jpg',
		text: 'This travel experience surpassed all our expectations! The itinerary struck the perfect balance between adventure and relaxation, allowing us to truly enjoy every moment. The accommodations were top-notch, and the local cuisine was a highlight. The team\'s expertise and attention to detail made us feel like VIPs throughout the trip.',
	},
];

const ServicePage: NextPage = () => {
   const { t } = require('next-i18next').useTranslation('common');
   return (
	   <div className={'service-page'}>
		   {/* 1. Banner */}
		   <div className={'service-banner'}>
			   <img src="/img/banner/hero-travel-1.jpg" alt={t('services_title')} />
			   <div className={'banner-overlay'}>
				   <h1>{t('services_title')}</h1>
				   <div className={'breadcrumb'}>
					   <Link href={'/'}>{t('Home')}</Link>
					   <span>{'>'}</span>
					   <span>{t('services_breadcrumb')}</span>
				   </div>
			   </div>
		   </div>

			{/* 2. What We Do - Services Grid */}
			<div className={'services-section'}>
				<div className={'services-header'}>
					<div className={'section-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
						</svg>
						{t('services_what_we_do')}
					</div>
					<h2>{t('services_exceptional_title')}</h2>
				</div>
				<div className={'services-grid'}>
					<div className={'services-col left'}>
						{services.slice(0, 3).map((s, i) => (
							<div key={i} className={'service-item'}>
								<div className={'service-icon'}>{s.icon}</div>
								<div className={'service-text'}>
									<h3>{t(`services_grid_title_${i+1}`)}</h3>
									<p>{t(`services_grid_desc_${i+1}`)}</p>
								</div>
							</div>
						))}
					</div>
					<div className={'services-center'}>
						<img src="/img/banner/hero-travel-2.jpg" alt={t('services_center_img_alt')} />
					</div>
					<div className={'services-col right'}>
						{services.slice(3).map((s, i) => (
							<div key={i} className={'service-item'}>
								<div className={'service-icon'}>{s.icon}</div>
								<div className={'service-text'}>
									<h3>{t(`services_grid_title_${i+4}`)}</h3>
									<p>{t(`services_grid_desc_${i+4}`)}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 3. Stats Bar */}
			<div className={'stats-section'}>
				<div className={'stats-bar'}>
					<div className={'stats-header'}>
						<div className={'stats-line'}></div>
						<span>{t('services_stats_operating_on')}</span>
						<span className={'stats-badge'}>50</span>
						<span>{t('services_stats_countries_now')}</span>
						<div className={'stats-line'}></div>
					</div>
					<div className={'stats-row'}>
						{stats.map((s, i) => (
							<div key={i} className={'stat-item'}>
								<span className={'stat-num'}>{s.num}</span>
								<span className={'stat-label'}>{t(`services_stats_label_${i+1}`)}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 4. Who We Are */}
			<div className={'who-we-are'}>
				<div className={'who-left'}>
					<div className={'who-img'}>
						<img src="/img/destinations/turkey.jpg" alt={t('services_who_img_alt')} />
					</div>
					<div className={'who-badge-compass'}>
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#e8a54b" strokeWidth="1.5"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke="#e8a54b" strokeWidth="1.5"/></svg>
					</div>
					<div className={'who-badge-cal'}>
						<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#e8a54b" strokeWidth="1.5"/><line x1="3" y1="9" x2="21" y2="9" stroke="#e8a54b" strokeWidth="1.5"/><text x="12" y="18" textAnchor="middle" fill="#e8a54b" fontSize="8" fontWeight="700">10</text></svg>
					</div>
				</div>
				<div className={'who-right'}>
					<div className={'section-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
						</svg>
						{t('services_who_we_are')}
					</div>
					<h2>{t('services_who_title')}</h2>
					<p>{t('services_who_desc')}</p>
					<div className={'who-features'}>
						<div className={'who-feature'}>
							<div className={'feature-icon'}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" stroke="#e8a54b" strokeWidth="1.5"/></svg>
							</div>
							<div>
								<h4>{t('services_who_feature_1_title')}</h4>
								<p>{t('services_who_feature_1_desc')}</p>
							</div>
						</div>
						<div className={'who-feature'}>
							<div className={'feature-icon'}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#e8a54b" strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke="#e8a54b" strokeWidth="1.5" strokeLinecap="round"/></svg>
							</div>
							<div>
								<h4>{t('services_who_feature_2_title')}</h4>
								<p>{t('services_who_feature_2_desc')}</p>
							</div>
						</div>
					</div>
					<div className={'who-travelers'}>
						<div className={'traveler-avatars'}>
							<img src="/img/testimonials/person1.jpg" alt="" />
							<img src="/img/testimonials/person2.jpg" alt="" />
							<img src="/img/testimonials/person3.jpg" alt="" />
						</div>
						<div>
							<span className={'traveler-count'}>1500+</span>
							<span className={'traveler-label'}>{t('services_who_travelers_label')}</span>
						</div>
					</div>
				</div>
			</div>

			{/* 5. Destination Story Grid */}
			<div className={'dest-highlights'}>
				<div className={'dest-header'}>
					<div className={'section-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
						</svg>
						{t('services_dest_story')}
					</div>
					<h2>{t('services_dest_highlights_title')}</h2>
				</div>
				<div className={'dest-grid'}>
					<div className={'dest-card tall'}>
						<img src="/img/destinations/santorini.jpg" alt="Santorini" />
					</div>
					<div className={'dest-card tall featured'}>
						<img src="/img/destinations/turkey.jpg" alt={t('services_dest_featured_img_alt')} />
						<div className={'dest-overlay'}>
							<div className={'link-circle'}>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#fff" strokeWidth="2" fill="none"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#fff" strokeWidth="2" fill="none"/></svg>
							</div>
							<span>{t('services_dest_featured_text')}</span>
						</div>
					</div>
					<div className={'dest-card'}>
						<img src="/img/destinations/greece.jpg" alt="Greece" />
					</div>
					<div className={'dest-card'}>
						<img src="/img/destinations/paris.jpg" alt="Paris" />
					</div>
				</div>
				<div className={'dest-bottom-bar'}>
					<span className={'dest-count'}>+100</span>
					<span className={'dest-text'}>{t('services_dest_bottom_text')}</span>
					<Link href={'/property'} className={'explore-btn'}>
						{t('services_dest_explore_btn')}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M17 7H7M17 7V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
					</Link>
				</div>
			</div>

			{/* 6. Testimonials */}
			<div className={'svc-testimonials'}>
				<div className={'test-header'}>
					<div className={'section-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
						</svg>
						{t('services_testimonial')}</div>
					<h2>{t('services_testimonial_title')}</h2>
				</div>
				<div className={'test-cards'}>
					{testimonials.map((t, i) => (
						<div key={i} className={'test-card'}>
							<div className={'test-card-top'}>
								<img src={t.image} alt={t.name} className={'test-avatar'} />
								<div className={'test-info'}>
												<h4>{t.name}</h4>
												<span>{t.role}</span>
								</div>
								<div className={'test-location'}>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="#fff"/></svg>
									{t.location}
								</div>
							</div>
							<div className={'test-stars'}>
								{Array.from({ length: t.stars }).map((_, j) => <span key={j}>★</span>)}
							</div>
							<hr />
												<p>{t.text}</p>
						</div>
					))}
				</div>
				<div className={'test-dots'}>
					<span className={'dot active'} aria-label={t('services_testimonial_dot_1')}></span>
					<span className={'dot'} aria-label={t('services_testimonial_dot_2')}></span>
					<span className={'dot'} aria-label={t('services_testimonial_dot_3')}></span>
				</div>
			</div>
		</div>
	);
};

export default withLayoutFull(ServicePage);
