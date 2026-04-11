import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
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
									<span>Travel With Us</span>
								</div>
								<h1 className={'main-title'}>
									Discover New Destinations and  <br />
									Adventures Around the World
								</h1>
								<p className={'description'}>
									Explore breathtaking destinations around the world with our expert travel guides. 
									We create unforgettable journeys tailored to your dreams and preferences. 
									Start your adventure today and discover the beauty of new horizons.
								</p>
							</Stack>
							<Stack className={'right-content'}>
								<div className={'experience-badge'}>
									<span className={'number'}>25+</span>
									<div className={'text'}>
										<span>Years of Travel</span>
										<span>Experiences</span>
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
								<span>Our Process</span>
							</div>
							<h2>Simple Steps to Your Dream Vacation</h2>
						</div>
						<Stack className={'steps-wrap'}>
							<div className={'step'}>
								<div className={'step-image'}>
									<img src="/img/icons/search-destination.svg" alt="Search" />
								</div>
								<h3>Search Your Destination</h3>
								<p>Enter your desired location, travel dates, and preferences to explore available options</p>
							</div>
							<div className={'step'}>
								<div className={'step-image'}>
									<img src="/img/icons/select-package.svg" alt="Select" />
								</div>
								<h3>Select Your Package</h3>
								<p>Browse through the curated offers and choose the travel package that suits your needs.</p>
							</div>
							<div className={'step'}>
								<div className={'step-image'}>
									<img src="/img/icons/complete-booking.svg" alt="Complete" />
								</div>
								<h3>Complete Your Booking</h3>
								<p>Fill in your details, make payment, and receive your confirmation to start your adventure!</p>
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
								<span>About Us</span>
							</div>
							<h2>Your Journey Begins Here<br />Explore with Us</h2>
							<p className={'description'}>
								Morbi ornare turpis quis lobortis porttitor. Morbi mollis nulla consectetur ullamcorper 
								dapibus. Maecenas vehicula faucibus sollicitudin. Praesent laoreet pretium augue. 
								Pellentesque habitant morbi tristique senectus
							</p>
							<Stack className={'features'}>
								<div className={'feature'}>
									<div className={'feature-icon discovery'}>
										<img src="/img/icons/globe.svg" alt="" />
									</div>
									<div className={'feature-content'}>
										<h4>Discovery</h4>
										<p>Mauris diam erat, facilisis a nibh, dignissim sapien.</p>
									</div>
								</div>
								<div className={'feature'}>
									<div className={'feature-icon inspiration'}>
										<img src="/img/icons/sun-orange.svg" alt="" />
									</div>
									<div className={'feature-content'}>
										<h4>Inspiration</h4>
										<p>Mauris diam erat, facilisis a nibh, dignissim sapien.</p>
									</div>
								</div>
							</Stack>
							<button className={'explore-btn'}>
								EXPLORE MORE
								<img src="/img/icons/arrow-right.svg" alt="" />
							</button>
						</Stack>
					</Stack>
				</Stack>

				
		
		
	
				<Stack className={'help'}>
					<Stack className={'container'}>
						<Box component={'div'} className={'left'}>
							<strong>Need help? Talk to our expert.</strong>
							<p>Talk to our experts or Browse through more properties.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'white'}>
								Contact Us
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
