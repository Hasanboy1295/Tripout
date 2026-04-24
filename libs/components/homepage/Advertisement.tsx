import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Advertisement = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	if (device == 'mobile') {
		return (
			<Stack className={'advertisement'}>
				<div className={'ad-card'}>
					<div className={'ad-left'}>
						<div className={'section-subtitle'}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
							</svg>
							<span>{t('offer_for_you')}</span>
						</div>
						<h2>{t('discover_incredible_deals')}</h2>
						<Link href={'/cs'}>
							<button className={'contact-btn'}>
								{t('contact_us_now')}
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</Link>
					</div>
					<div className={'ad-right'}>
						<img src="/img/banner/ad-balloon.jpg" alt="Cappadocia balloons" />
					</div>
				</div>
			</Stack>
		);
	} else {
		return (
			<Stack className={'advertisement'}>
				<div className={'ad-card'}>
					<div className={'ad-left'}>
						<div className={'section-subtitle'}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
							</svg>
							<span>{t('offer_for_you')}</span>
						</div>
						<h2>{t('discover_incredible_deals_line1')}<br />{t('discover_incredible_deals_line2')}</h2>
						<Link href={'/cs'}>
							<button className={'contact-btn'}>
								{t('contact_us_now')}
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</button>
						</Link>
					</div>
					<div className={'ad-right'}>
						<img src="/img/banner/ad-balloon.jpg" alt="Cappadocia balloons" />
					</div>
				</div>
			</Stack>
		);
	}
};

export default Advertisement;
