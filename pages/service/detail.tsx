import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutFull from '../../libs/components/layout/LayoutFull';

export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});

const servicesList = [
	'Adventure Excursions',
	'Travel Assistance',
	'Flight Arrangements',
	'Group Discounts',
	'Tour Packages',
	'Local Guides',
];


const features = [
	{ title: 'Personalized Plans', desc: 'Tailored itineraries that fit your pace and budget.' },
	{ title: '24/7 Support', desc: 'Real humans on call whenever plans change.' },
	{ title: 'Seamless Booking', desc: 'Flights, stays, rides—all handled for you.' },
	{ title: 'Expert Advice', desc: 'Local tips so you skip the tourist traps.' },
	{ title: 'Exclusive Deals', desc: 'Partner perks and member-only savings.' },
	{ title: 'Local Insights', desc: 'Guides who know the shortcuts and stories.' },
];

const ServiceDetail: NextPage = () => {
	return (
		<div className={'service-detail-page'}>
			{/* Banner */}
				<div className={'service-banner'}>
					<img src="/img/banner/hero-travel-1.jpg" alt="Service Detail" />
					<div className={'banner-overlay'}>
						<h1>Travel Assistance</h1>
						<p>We plan, protect, and adapt your trip in real time—so you just enjoy the journey.</p>
						<div className="banner-actions">
							<Link href="/property" className="btn-primary">Explore Now</Link>
							<Link href="/service" className="btn-ghost">View All Services</Link>
						</div>
					</div>
				</div>

			{/* Content */}
			<div className={'detail-content'}>
				{/* Left: main content */}
				<div className={'detail-left'}>
					<h2>Travel Assistance</h2>
					<p>We arrange every part of your journey—flights, hotels, rides, visas, and insurance—so you can focus on exploring. Our team monitors your trip in real time and steps in fast when plans change.</p>
					<p>If you miss a connection, need a new hotel, or want restaurant tips, we handle it for you. Support is available 24/7 with local know‑how wherever you land.</p>

					<div className={'detail-image'}>
						<img src="/img/destinations/greece.jpg" alt="Travel" />
					</div>

					<h3>Discover Unforgettable Journeys Around the World</h3>
					<p>From airport pickups to hidden‑gem day trips, we craft smooth, memorable experiences. Every itinerary is tailored to your pace, interests, and budget.</p>
					<p>Need to reroute mid‑trip? We rebook and adjust on the fly—no stress, no long hold times, just fast solutions.</p>

					{/* Features row */}
						<h3>Embark on Extraordinary Adventures Across the Globe</h3>
						<div className={'features-grid'}>
							{features.map((f, i) => (
								<div key={i} className={'feature-card'}>
									<div className="feature-icon">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 16.17 4.83 12 3.4 13.41 9 19l12-12-1.41-1.41z" fill="#e8a54b"/></svg>
									</div>
									<div className="feature-text">
										<strong>{f.title}</strong>
										<span>{f.desc}</span>
									</div>
								</div>
							))}
						</div>

					{/* Two images */}
					<div className={'detail-images-row'}>
						<div className={'detail-img'}>
							<img src="/img/destinations/turkey.jpg" alt="Adventure" />
						</div>
						<div className={'detail-img'}>
							<img src="/img/destinations/santorini.jpg" alt="Adventure" />
						</div>
					</div>

					<p>Phasellus nec lobortis tortor. Ut purus mauris, congue ut luctus sollicitudin, iaculis nec erat. In hac habitasse platea dictumst. Maecenas commodo sapien sem, vel volutpat ligula pellentesque in. Cras volutpat turpis non cursus pellentesque. Nunc finibus ac sem id tempor. Proin lacinia suscipit odio.</p>
					<p>In eu nisl quis velit gravida volutpat. Nulla pretium luctus sem, at bibendum nibh tincidunt et. Duis gravida urna et sem rutrum, quis accumsan ipsum ornare. Quisque convallis dapibus diam id venenatis.</p>

					{/* Video section */}
					<div className={'detail-video'}>
						<img src="/img/destinations/malta.jpg" alt="Video" />
						<div className={'play-btn'}>
							<svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
						</div>
					</div>

					<p>Praesent mattis nisl vel faucibus elementum. Sed consectetur, ligula nec elementum dignissim, ligula sem molestie enim, id sollicitudin lacus libero a nibh. Fusce ac mauris sit amet arcu hendrerit euismod non sit amet velit.</p>
					<p>Morbi fermentum nibh quis turpis porta, vel hendrerit elit elementum. Nulla porttitor consectetur tellus venenatis varius. Mauris pretium ultrices erat. Praesent suscipit sagittis mollis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
				</div>

				{/* Right: sidebar */}
				<div className={'detail-right'}>
					<div className={'sidebar-services'}>
						<h3>Our Services</h3>
						<ul>
							{servicesList.map((s, i) => (
								<li key={i}>
									<Link href={'/service/detail'}>
										{s}
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className={'sidebar-cta'}>
						<div className={'cta-icon'}>
							<svg width="40" height="40" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="12" r="10" stroke="#e8a54b" strokeWidth="1.5"/>
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#e8a54b" strokeWidth="1.5" fill="none"/>
								<path d="M2 12h20" stroke="#e8a54b" strokeWidth="1.5"/>
							</svg>
						</div>
						<h4>Explore the World Your Adventure Awaits</h4>
						<p>Start Your Adventure Now!</p>
						<a href="tel:821057191295" className={'cta-btn'}>CALL NOW: (82) 1057191295 </a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutFull(ServiceDetail);
