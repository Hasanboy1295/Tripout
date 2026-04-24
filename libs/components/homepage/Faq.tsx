import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useTranslation } from 'next-i18next';

const FaqSection = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');
	const [openIdx, setOpenIdx] = useState(0);

	const faqs = [
		{ question: t('faq_q1'), answer: t('faq_a1') },
		{ question: t('faq_q2'), answer: t('faq_a2') },
		{ question: t('faq_q3'), answer: t('faq_a3') },
		{ question: t('faq_q4'), answer: t('faq_a4') },
	];

	const toggle = (idx: number) => setOpenIdx(openIdx === idx ? -1 : idx);

	if (device === 'mobile') {
		return (
			<div className={'faq-section'}>
				<div className={'faq-right'}>
					<div className={'faq-subtitle'}>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
							<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16z" stroke="#e8a54b" strokeWidth="2" fill="none"/>
						</svg>
						{t('faq')}
					</div>
					<h2 className={'faq-title'}>{t('travel_questions_answered')}</h2>
					<div className={'faq-list'}>
						{faqs.map((faq, idx) => (
							<div key={idx} className={`faq-item${openIdx === idx ? ' open' : ''}`}>
								<button className={'faq-question'} onClick={() => toggle(idx)}>
									<span>{faq.question}</span>
									<span className={'faq-icon'}>{openIdx === idx ? '×' : '+'}</span>
								</button>
								{openIdx === idx && <div className={'faq-answer'}>{faq.answer}</div>}
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={'faq-section'}>
			{/* Left: photos */}
			<div className={'faq-left'}>
				<div className={'faq-img-main'}>
					<img src={'/img/destinations/malta.jpg'} alt="Mountain hiking" />
					{/* Tour card overlay */}
					<div className={'faq-tour-card'}>
						<span className={'tour-name'}>{t('mountain_hiking_tour')}</span>
						<span className={'tour-location'}>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a54b">
								<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
							</svg>
							{t('zermatt_switzerland')}
						</span>
					</div>
				</div>
				<div className={'faq-img-small'}>
					<img src={'/img/destinations/santorini.jpg'} alt="Mountain lake" />
				</div>
			</div>

			{/* Right: FAQ accordion */}
			<div className={'faq-right'}>
				<div className={'faq-subtitle'}>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
						<path
							d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
							stroke="#e8a54b"
							strokeWidth="2"
							fill="none"
						/>
					</svg>
					{t('faq')}
				</div>
				<h2 className={'faq-title'}>{t('travel_questions_answered')}</h2>
				<div className={'faq-list'}>
					{faqs.map((faq, idx) => (
						<div key={idx} className={`faq-item${openIdx === idx ? ' open' : ''}`}>
							<button className={'faq-question'} onClick={() => toggle(idx)}>
								<span>{faq.question}</span>
								<span className={'faq-icon'}>{openIdx === idx ? '×' : '+'}</span>
							</button>
							{openIdx === idx && <div className={'faq-answer'}>{faq.answer}</div>}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FaqSection;
