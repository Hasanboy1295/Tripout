
import React from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const About: NextPage = () => {
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	   if (device === 'mobile') {
		   return <div>{t('aboutus_mobile')}</div>;
	   } else {
		   return (
			   <Stack className={'about-page'}>
				   {/* Hero Section */}
				   <Stack className={'hero-section'}>
					   <Stack className={'container'}>
						   <Stack className={'hero-content'}>
							   <Stack className={'left-content'}>
								   <div className={'tag-line'}>
									   <FlightTakeoffIcon />
									   <span>{t('aboutus_tagline')}</span>
								   </div>
								   <h1 className={'main-title'}>
									   {t('aboutus_hero_title1')}<br />
									   {t('aboutus_hero_title2')}
								   </h1>
								   <p className={'description'}>
									   {t('aboutus_hero_desc')}
								   </p>
							   </Stack>
							   <Stack className={'right-content'}>
								   <div className={'experience-badge'}>
									   <span className={'number'}>25+</span>
									   <div className={'text'}>
										   <span>{t('aboutus_years')}</span>
										   <span>{t('aboutus_experiences')}</span>
									   </div>
								   </div>
							   </Stack>
						   </Stack>
						   <Stack className={'hero-image'}>
							   <img src="/img/banner/hero-travel-1.jpg" alt="Travelers exploring" />
						   </Stack>
					   </Stack>
				   </Stack>

				{/* Partners Section */}
				<Stack className={'partners-section'}>
					<Stack className={'container'}>
						<Stack className={'partners-wrap'}>
							<div className={'partner'}>
								<img src="/img/icons/brands/amazon.svg" alt="Boltshift" />
								<span>Boltshift</span>
							</div>
							<div className={'partner highlight'}>
								<img src="/img/icons/brands/dropcam.svg" alt="Lightbox" />
								<span>Lightbox</span>
							</div>
							<div className={'partner'}>
								<img src="/img/icons/brands/cisco.svg" alt="Spherule" />
								<span>Spherule</span>
							</div>
							<div className={'partner'}>
								<img src="/img/icons/brands/amd.svg" alt="GlobalBank" />
								<span>GlobalBank</span>
							</div>
							<div className={'partner'}>
								<img src="/img/icons/brands/spotify.svg" alt="Nietzsche" />
								<span>Nietzsche</span>
							</div>
						</Stack>
					</Stack>
				</Stack>

				   {/* Process Section */}
				   <Stack className={'process-section'}>
					   <Stack className={'container'}>
						   <div className={'section-header'}>
							   <div className={'tag-line'}>
								   <FlightTakeoffIcon />
								   <span>{t('aboutus_process_tagline')}</span>
							   </div>
							   <h2>{t('aboutus_process_title')}</h2>
						   </div>
						   <Stack className={'steps-wrap'}>
							   <div className={'step'}>
								   <div className={'step-image'}>
									   <img src="/img/icons/search-destination.svg" alt="Search" />
								   </div>
								   <h3>{t('aboutus_step1_title')}</h3>
								   <p>{t('aboutus_step1_desc')}</p>
							   </div>
							   <div className={'step'}>
								   <div className={'step-image'}>
									   <img src="/img/icons/select-package.svg" alt="Select" />
								   </div>
								   <h3>{t('aboutus_step2_title')}</h3>
								   <p>{t('aboutus_step2_desc')}</p>
							   </div>
							   <div className={'step'}>
								   <div className={'step-image'}>
									   <img src="/img/icons/complete-booking.svg" alt="Complete" />
								   </div>
								   <h3>{t('aboutus_step3_title')}</h3>
								   <p>{t('aboutus_step3_desc')}</p>
							   </div>
						   </Stack>
					   </Stack>
				   </Stack>

				{/* About Us Section */}
				<Stack className={'about-us-section'}>
					<Stack className={'container'}>
						<Stack className={'left-side'}>
							<div className={'image-wrapper'}>
								<div className={'orange-circle'}></div>
								<img src="/img/banner/traveler-girl.png" alt="Traveler" className={'traveler-img'} />
								<div className={'camera-icon'}>
									<img src="/img/icons/camera.svg" alt="" />
								</div>
								<div className={'sun-icon'}>
									<img src="/img/icons/sun.svg" alt="" />
								</div>
								<div className={'destination-badge'}>
									<div className={'badge-icon'}>
										<img src="/img/icons/location-green.svg" alt="" />
									</div>
									<div className={'badge-content'}>
										<span className={'number'}>+500</span>
										<span className={'label'}>Destination</span>
									</div>
								</div>
							</div>
						</Stack>
						<Stack className={'right-side'}>
							   <div className={'tag-line'}>
								   <FlightTakeoffIcon />
								   <span>{t('aboutus_tagline')}</span>
							   </div>
							   <h2>{t('aboutus_about_title1')}<br />{t('aboutus_about_title2')}</h2>
							   <p className={'description'}>
								   {t('aboutus_about_desc')}
							   </p>
							<Stack className={'features'}>
								<div className={'feature'}>
									<div className={'feature-icon discovery'}>
										<img src="/img/icons/globe.svg" alt="" />
									</div>
									<div className={'feature-content'}>
										   <h4>{t('aboutus_feature1_title')}</h4>
										   <p>{t('aboutus_feature1_desc')}</p>
									</div>
								</div>
								<div className={'feature'}>
									<div className={'feature-icon inspiration'}>
										<img src="/img/icons/sun-orange.svg" alt="" />
									</div>
									<div className={'feature-content'}>
										   <h4>{t('aboutus_feature2_title')}</h4>
										   <p>{t('aboutus_feature2_desc')}</p>
									</div>
								</div>
							</Stack>
							   <button className={'explore-btn'}>
								   {t('explore_more')}
								   <img src="/img/icons/arrow-right.svg" alt="" />
							   </button>
						</Stack>
					</Stack>
				</Stack>

				
		
		
	
				<Stack className={'help'}>
					<Stack className={'container'}>
						   <Box component={'div'} className={'left'}>
							   <strong>{t('aboutus_help_title')}</strong>
							   <p>{t('aboutus_help_desc')}</p>
						   </Box>
						   <Box component={'div'} className={'right'}>
							   <div className={'white'}>
								   {t('aboutus_contact')}
								   <img src="/img/icons/rightup.svg" alt="" />
							   </div>
							   <div className={'black'}>
								   <img src="/img/icons/call.svg" alt="" />
								   82 1057191295
							   </div>
						   </Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
