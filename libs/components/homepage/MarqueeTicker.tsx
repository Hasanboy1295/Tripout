import React from 'react';

const row1 = ['Unforgettable', 'Destinations', 'Exploration', 'Travelers', 'Itineraries', 'Experiences', 'Adventures', 'Discovery'];
const row2 = ['Experiential', 'Adventure', 'Authenticity', 'Transportation', 'Getaways', 'Journeys', 'Wanderlust', 'Horizons'];

const Star = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={'marquee-star'}>
		<path
			d="M12 2C9 7 2 9 2 12C2 15 9 17 12 22C15 17 22 15 22 12C22 9 15 7 12 2Z"
			fill="#e8a54b"
			stroke="#e8a54b"
			strokeWidth="0"
		/>
		<circle cx="12" cy="12" r="3" fill="#fff" />
	</svg>
);

const MarqueeTicker = () => {
	return (
		<div className={'marquee-ticker'}>
			{/* Row 1 — scrolls left */}
			<div className={'marquee-row'}>
				<div className={'marquee-track'}>
					{[...row1, ...row1, ...row1].map((word, i) => (
						<span key={i} className={'marquee-item'}>
							<strong>{word}</strong>
							<Star />
						</span>
					))}
				</div>
			</div>

			{/* Row 2 — scrolls right (lighter text) */}
			<div className={'marquee-row reverse'}>
				<div className={'marquee-track'}>
					{[...row2, ...row2, ...row2].map((word, i) => (
						<span key={i} className={'marquee-item light'}>
							<strong>{word}</strong>
							<Star />
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default MarqueeTicker;
