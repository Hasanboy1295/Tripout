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

const features = ['Personalized Experiences', '24/7 Support', 'Seamless Booking', 'Expert Advice', 'Exclusive Deals', 'Local Insights'];

const ServiceDetail: NextPage = () => {
	return (
		<div className={'service-detail-page'}>
			{/* Banner */}
			<div className={'service-banner'}>
				<img src="/img/banner/hero-travel-1.jpg" alt="Service Detail" />
				<div className={'banner-overlay'}>
					<h1>Service Detail</h1>
					<div className={'breadcrumb'}>
						<Link href={'/'}>HOME</Link>
						<span>{'>'}</span>
						<Link href={'/service'}>SERVICES</Link>
						<span>{'>'}</span>
						<span>SERVICE DETAIL</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className={'detail-content'}>
				{/* Left: main content */}
				<div className={'detail-left'}>
					<h2>Travel Assistance</h2>
					<p>Duis diam arcu, bibendum vel neque vitae, consectetur feugiat tellus. Nam ac mi nec ipsum bibendum accumsan non ac neque. Cras non pretium orci. Pellentesque a posuere mi, in finibus dolor. Phasellus venenatis et odio convallis, et convallis nibh consectetur. Mauris quis purus rhoncus, faucibus ante ac, lacinia nibh.</p>
					<p>Duis diam arcu, bibendum vel neque vitae, consectetur feugiat tellus. Nam ac mi nec ipsum bibendum accumsan non ac neque. Cras non pretium orci. Pellentesque a posuere mi, in finibus dolor.</p>

					<div className={'detail-image'}>
						<img src="/img/destinations/greece.jpg" alt="Travel" />
					</div>

					<h3>Discover Your Nextcover Unforgettable Journeys Around the World</h3>
					<p>Phasellus finibus mauris eu turpis dignissim placerat. Donec dignissim libero lacus. Duis cursus tortor risus, in viverra eros luctus mattis. Nunc sed nunc et eros dapibus ullamcorper. Phasellus maximus aliquam sem ac dictum. Aenean feugiat vehicula ipsum, at sodales nisl faucibus vel.</p>
					<p>Etiam vel mauris vestibulum, finibus risus et, sagittis urna. Praesent id vestibulum turpis, a molestie tellus. Donec malesuada venenatis ipsum, vel consectetur nisl ultrices quis.</p>

					{/* Features row */}
					<h3>Embark on Extraordinary Adventures Across the Globe</h3>
					<div className={'features-grid'}>
						{features.map((f, i) => (
							<div key={i} className={'feature-item'}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="#e8a54b"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
								{f}
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
						<a href="tel:5551234567" className={'cta-btn'}>CALL NOW: (555) 123-4567</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutFull(ServiceDetail);
