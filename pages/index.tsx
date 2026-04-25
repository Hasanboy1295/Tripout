import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import PopularProperties from '../libs/components/homepage/PopularProperties';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
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
