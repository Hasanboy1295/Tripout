import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import withLayoutFull from '../../libs/components/layout/LayoutFull';

export const getStaticProps = async ({ locale }: any) => ({
	props: { ...(await serverSideTranslations(locale, ['common'])) },
});

const featureIndices = [1, 2, 3, 4, 5, 6];
const serviceIndices = [1, 2, 3, 4, 5, 6];

const ServiceDetail: NextPage = () => {
	const { t } = useTranslation('common');

	return (
		<div className={'service-detail-page'}>
			{/* Banner */}
				<div className={'service-banner'}>
					<img src="/img/banner/hero-travel-1.jpg" alt={t('sd_banner_title')} />
					<div className={'banner-overlay'}>
						<h1>{t('sd_banner_title')}</h1>
						<p>{t('sd_banner_desc')}</p>
						<div className="banner-actions">
							<Link href="/property" className="btn-primary">{t('sd_explore_now')}</Link>
							<Link href="/service" className="btn-ghost">{t('sd_view_all_services')}</Link>
						</div>
					</div>
				</div>

			{/* Content */}
			<div className={'detail-content'}>
				{/* Left: main content */}
				<div className={'detail-left'}>
					<h2>{t('sd_section_title_1')}</h2>
					<p>{t('sd_section_para_1')}</p>
					<p>{t('sd_section_para_2')}</p>

					<div className={'detail-image'}>
						<img src="/img/destinations/greece.jpg" alt={t('sd_section_title_2')} />
					</div>

					<h3>{t('sd_section_title_2')}</h3>
					<p>{t('sd_section_para_3')}</p>
					<p>{t('sd_section_para_4')}</p>

					{/* Features row */}
						<h3>{t('sd_section_title_3')}</h3>
						<div className={'features-grid'}>
							{featureIndices.map((i) => (
								<div key={i} className={'feature-card'}>
									<div className="feature-icon">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 16.17 4.83 12 3.4 13.41 9 19l12-12-1.41-1.41z" fill="#e8a54b"/></svg>
									</div>
									<div className="feature-text">
										<strong>{t(`sd_feature_${i}_title`)}</strong>
										<span>{t(`sd_feature_${i}_desc`)}</span>
									</div>
								</div>
							))}
						</div>

					{/* Two images */}
					<div className={'detail-images-row'}>
						<div className={'detail-img'}>
							<img src="/img/destinations/turkey.jpg" alt={t('sd_section_title_3')} />
						</div>
						<div className={'detail-img'}>
							<img src="/img/destinations/santorini.jpg" alt={t('sd_section_title_3')} />
						</div>
					</div>

					<p>{t('sd_lorem_1')}</p>
					<p>{t('sd_lorem_2')}</p>

					{/* Video section */}
					<div className={'detail-video'}>
						<img src="/img/destinations/malta.jpg" alt={t('sd_section_title_2')} />
						<div className={'play-btn'}>
							<svg width="32" height="32" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
						</div>
					</div>

					<p>{t('sd_lorem_3')}</p>
					<p>{t('sd_lorem_4')}</p>
				</div>

				{/* Right: sidebar */}
				<div className={'detail-right'}>
					<div className={'sidebar-services'}>
						<h3>{t('sd_sidebar_our_services')}</h3>
						<ul>
							{serviceIndices.map((i) => (
								<li key={i}>
									<Link href={'/service/detail'}>
										{t(`sd_service_${i}`)}
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
						<h4>{t('sd_sidebar_cta_title')}</h4>
						<p>{t('sd_sidebar_cta_desc')}</p>
						<a href="tel:821057191295" className={'cta-btn'}>{t('sd_sidebar_cta_button')}</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withLayoutFull(ServiceDetail);
