import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import AboutUs from '../libs/components/homepage/AboutUs';
import DestinationStory from '../libs/components/homepage/DestinationStory';
import Testimonials from '../libs/components/homepage/Testimonials';
import FaqSection from '../libs/components/homepage/Faq';
import MarqueeTicker from '../libs/components/homepage/MarqueeTicker';
import BlogSection from '../libs/components/homepage/BlogSection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page-mobile'}>
				{/* Filter/Search Bar */}
				<Stack className={'mobile-section'}>
					{/* HeaderFilter is already rendered in layout, so skip here */}
				</Stack>

				{/* Top Destinations (TrendProperties) */}
				<Stack className={'mobile-section'}>
					<TrendProperties />
				</Stack>

				{/* Great Adventures (PopularProperties) */}
				<Stack className={'mobile-section'}>
					<PopularProperties />
				</Stack>

				{/* Offer/Ad Banner */}
				<Stack className={'mobile-section'}>
					<Advertisement />
				</Stack>

				{/* Stats Section (custom, not a component) */}
				<Stack className={'mobile-section stats-section'}>
					<Stack className={'stats-grid'} direction="row" spacing={2} justifyContent="space-between">
						<Stack className={'stat-card'} alignItems="center">
							<span className="stat-value">3541<span className="stat-plus">+</span></span>
							<span className="stat-label">Happy Clients</span>
						</Stack>
						<Stack className={'stat-card'} alignItems="center">
							<span className="stat-value">500<span className="stat-plus">+</span></span>
							<span className="stat-label">Destinations</span>
						</Stack>
						<Stack className={'stat-card'} alignItems="center">
							<span className="stat-value">12<span className="stat-plus">+</span></span>
							<span className="stat-label">Years Experience</span>
						</Stack>
						<Stack className={'stat-card'} alignItems="center">
							<span className="stat-value">98<span className="stat-percent">%</span></span>
							<span className="stat-label">Satisfaction</span>
						</Stack>
					</Stack>
				</Stack>

				{/* Blog Section */}
				<Stack className={'mobile-section'}>
					<BlogSection />
				</Stack>

			</Stack>
		);
	}

	// PC version (unchanged)
	return (
		<Stack className={'home-page'}>
			<TrendProperties />
			<PopularProperties />
			<Advertisement />
			<AboutUs />
			<DestinationStory />
			<Testimonials />
			<FaqSection />
			<MarqueeTicker />
			<BlogSection />
		</Stack>
	);
};

export default withLayoutMain(Home);
