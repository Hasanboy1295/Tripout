import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';

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

const reviews = [
	{
		name: 'Sarah Johnson',
		role: 'Tourist Traveled',
		location: 'Australia',
		text: 'My trip was an absolute dream! From the seamless booking process to the carefully curated itinerary, everything was top-notch. The guides were knowledgeable, and the local experiences were authentic. It was a perfect balance of adventure and relaxation. I can\'t wait to book my next journey with them!',
		stars: 5,
		image: '/img/testimonials/person2.jpg',
	},
	{
		name: 'James Miller',
		role: 'Solo Traveler',
		location: 'Greece',
		text: 'An incredible experience from start to finish. The team made every detail perfect and the destinations were breathtaking. I felt safe and well cared for the entire trip. Highly recommend to anyone looking for a memorable adventure.',
		stars: 5,
		image: '/img/testimonials/person1.jpg',
	},
	{
		name: 'Carlos Rivera',
		role: 'Adventure Tourist',
		location: 'Thailand',
		text: 'Absolutely loved every moment of the tour. The local guides were friendly and knowledgeable, and the itinerary was perfectly balanced between sightseeing and relaxation. Will definitely book again!',
		stars: 5,
		image: '/img/testimonials/person3.jpg',
	},
];

const leftPhotos = [
	{ image: '/img/testimonials/person1.jpg', location: 'Greece', top: true },
	{ image: '/img/testimonials/person2.jpg', location: 'Australia', center: true },
	{ image: '/img/testimonials/person3.jpg', location: 'Thailand', bottom: true },
];

const Testimonials = () => {
	const device = useDeviceDetect();
	const [activeIdx, setActiveIdx] = useState(0);
	const [lastDir, setLastDir] = useState<'prev' | 'next'>('prev');

	const prev = () => { setLastDir('prev'); setActiveIdx((i) => (i === 0 ? reviews.length - 1 : i - 1)); };
	const next = () => { setLastDir('next'); setActiveIdx((i) => (i === reviews.length - 1 ? 0 : i + 1)); };

	const review = reviews[activeIdx];

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
							Testimonials
						</div>
						<h2 className={'t-title'}>Unforgettable Traveler Stories & Reviews</h2>
						<p className={'t-text'}>{review.text}</p>
						<div className={'t-author'}>
							<span className={'t-name'}>{review.name}</span>
							<span className={'t-role'}>{review.role}</span>
							<div className={'t-stars'}>
								{Array.from({ length: review.stars }).map((_, i) => <span key={i}>★</span>)}
							</div>
						</div>
						<div className={'t-nav'}>
							<button className={`t-nav-btn${lastDir === 'prev' ? ' active' : ''}`} onClick={prev}>‹</button>
							<button className={`t-nav-btn${lastDir === 'next' ? ' active' : ''}`} onClick={next}>›</button>
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
					<div className={'photo-top'}>
						<img src={leftPhotos[activeIdx === 0 ? 1 : activeIdx === 1 ? 2 : 0].image} alt="traveler" />
						<div className={'location-badge'}>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
							{leftPhotos[activeIdx === 0 ? 1 : activeIdx === 1 ? 2 : 0].location}
						</div>
					</div>
					<div className={'photo-center'}>
						<img src={leftPhotos[activeIdx === 0 ? 2 : activeIdx === 1 ? 0 : 1].image} alt="traveler" />
						<div className={'location-badge'}>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
							{leftPhotos[activeIdx === 0 ? 2 : activeIdx === 1 ? 0 : 1].location}
						</div>
					</div>
					<div className={'photo-bottom'}>
						<img src={leftPhotos[activeIdx].image} alt="traveler" />
						<div className={'location-badge'}>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
							{leftPhotos[activeIdx].location}
						</div>
					</div>
				</div>

				{/* Right: review content */}
				<div className={'testimonials-right'}>
					<div className={'t-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#e8a54b"/>
						</svg>
						Testimonials
					</div>
					<h2 className={'t-title'}>Unforgettable Traveler Stories & Reviews</h2>
					<p className={'t-text'}>{review.text}</p>
					<div className={'t-author'}>
						<span className={'t-name'}>{review.name}</span>
						<span className={'t-role'}>{review.role}</span>
						<div className={'t-stars'}>
							{Array.from({ length: review.stars }).map((_, i) => <span key={i}>★</span>)}
						</div>
					</div>
				<div className={'t-nav'}>
					<button className={`t-nav-btn ${lastDir === 'prev' ? 'active' : ''}`} onClick={prev}>‹</button>
					<button className={`t-nav-btn ${lastDir === 'next' ? 'active' : ''}`} onClick={next}>›</button>
				</div>
					{/* Big quote mark */}
					<div className={'t-quote'}>"</div>
				</div>
			</div>
		</div>
	);
};

export default Testimonials;
