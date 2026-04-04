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

				{/* Team Members Section */}
				<Stack className={'team-section'}>
					<Stack className={'container'}>
						<div className={'section-header'}>
							<div className={'tag-line'}>
								<FlightTakeoffIcon />
								<span>Team Members</span>
							</div>
							<h2>Our Exclusive Agents</h2>
						</div>
						<Stack className={'team-wrap'}>
							<div className={'team-card'}>
								<div className={'avatar'}>
									<img src="/img/profile/team1.jpg" alt="Ethan Martinez" />
								</div>
								<h3>Ethan Martinez</h3>
								<p>Adventure Guide</p>
							</div>
							<div className={'team-card active'}>
								<div className={'avatar'}>
									<img src="/img/profile/team2.jpg" alt="Olivia Anderson" />
								</div>
								<h3>Olivia Anderson</h3>
								<p>Tour Planner</p>
							</div>
							<div className={'team-card'}>
								<div className={'avatar'}>
									<img src="/img/profile/team3.jpg" alt="Jack Robinson" />
								</div>
								<h3>Jack Robinson</h3>
								<p>Traveling Adviser</p>
							</div>
							<div className={'team-card'}>
								<div className={'avatar'}>
									<img src="/img/profile/team4.jpg" alt="Lily Patel" />
								</div>
								<h3>Lily Patel</h3>
								<p>Nature Guide</p>
							</div>
						</Stack>
						<div className={'dots'}>
							<span className={'dot active'}></span>
							<span className={'dot'}></span>
							<span className={'dot'}></span>
						</div>
					</Stack>
				</Stack>

				{/* Testimonial Section */}
				<Stack className={'testimonial-section'}>
					<Stack className={'container'}>
						<div className={'section-header'}>
							<div className={'tag-line'}>
								<FlightTakeoffIcon />
								<span>Testimonial</span>
							</div>
							<h2>Unforgettable Experiences That Inspire</h2>
						</div>
						<Stack className={'testimonials-wrap'}>
							<div className={'testimonial-card'}>
								<div className={'card-header'}>
									<div className={'user-info'}>
										<div className={'avatar'}>
											<img src="/img/profile/testimonial1.jpg" alt="Sarah Thompson" />
										</div>
										<div className={'details'}>
											<h4>Sarah Thompson</h4>
											<span>Tourists</span>
											<div className={'stars'}>
												<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
											</div>
										</div>
									</div>
									<div className={'location'}>
										<img src="/img/icons/location-pin.svg" alt="" />
										<span>Thailand, Asia</span>
									</div>
								</div>
								<p className={'review-text'}>
									Our recent trip was absolutely unforgettable! Every detail was meticulously 
									planned, from our stunning accommodations to the incredible local experiences. 
									The guides were friendly and knowledgeable, making us feel immersed in the 
									culture. We discovered hidden gems that we never would have found on our own. I 
									can't wait to book our next adventure with this amazing team.
								</p>
							</div>
							<div className={'testimonial-card'}>
								<div className={'card-header'}>
									<div className={'user-info'}>
										<div className={'avatar'}>
											<img src="/img/profile/testimonial2.jpg" alt="Michael Lee" />
										</div>
										<div className={'details'}>
											<h4>Michael Lee</h4>
											<span>Tourists</span>
											<div className={'stars'}>
												<span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
											</div>
										</div>
									</div>
									<div className={'location'}>
										<img src="/img/icons/location-pin.svg" alt="" />
										<span>Bali, Indonesia</span>
									</div>
								</div>
								<p className={'review-text'}>
									This travel experience surpassed all our expectations! The itinerary struck the 
									perfect balance between adventure and relaxation, allowing us to truly enjoy every 
									moment. The accommodations were top-notch, and the local cuisine was a 
									highlight. The team's expertise and attention to detail made us feel like VIPs 
									throughout the trip.
								</p>
							</div>
						</Stack>
						<div className={'dots'}>
							<span className={'dot active'}></span>
							<span className={'dot'}></span>
							<span className={'dot'}></span>
						</div>
					</Stack>
				</Stack>

				{/* Blog & News Section */}
				<Stack className={'blog-section'}>
					<Stack className={'container'}>
						<div className={'section-header'}>
							<div className={'tag-line'}>
								<FlightTakeoffIcon />
								<span>Blog & News</span>
							</div>
							<h2>Explore Our Travel Insights Blog</h2>
						</div>
						<Stack className={'blog-wrap'}>
							<div className={'blog-main'}>
								<div className={'blog-image'}>
									<img src="/img/community/blog1.jpg" alt="Cultural Experiences" />
								</div>
								<div className={'blog-meta'}>
									<span><img src="/img/icons/user.svg" alt="" /> By Liam Patel</span>
									<span><img src="/img/icons/calendar.svg" alt="" /> Sep 20, 2024</span>
								</div>
								<h3>Cultural Experiences Immersive Activities for Every Destination Visit</h3>
								<p>Quisque at felis euismod, pulvinar tellus id, venenatis lectus. Morbi in maximus tortor, nec volutpat libero. Nam nisl justo, tempor ut leo nec, vehicula rutrum nisi. Curabitur bibendum ipsum id ultricies placerat. Suspendisse ex elit, sagittis sit amet massa at, tincidunt aliquet elit.</p>
								<div className={'divider'}></div>
								<a href="#" className={'read-more'}>READ MORE <img src="/img/icons/arrow-right-orange.svg" alt="" /></a>
							</div>
							<Stack className={'blog-sidebar'}>
								<div className={'blog-card'}>
									<div className={'card-image'}>
										<img src="/img/community/blog2.jpg" alt="Affordable Flights" />
									</div>
									<div className={'card-content'}>
										<div className={'blog-meta'}>
											<span><img src="/img/icons/user.svg" alt="" /> By Liam Patel</span>
											<span><img src="/img/icons/calendar.svg" alt="" /> Sep 20, 2024</span>
										</div>
										<h4>How to Find Affordable Flights and Save Money for Vacation</h4>
										<a href="#" className={'read-more'}>READ MORE <img src="/img/icons/arrow-right-orange.svg" alt="" /></a>
									</div>
								</div>
								<div className={'blog-card'}>
									<div className={'card-image'}>
										<img src="/img/community/blog3.jpg" alt="Cultural Festivals" />
									</div>
									<div className={'card-content'}>
										<div className={'blog-meta'}>
											<span><img src="/img/icons/user.svg" alt="" /> By Liam Patel</span>
											<span><img src="/img/icons/calendar.svg" alt="" /> Sep 20, 2024</span>
										</div>
										<h4>Must-Visit Cultural Festivals Around the World Celebrating</h4>
										<a href="#" className={'read-more'}>READ MORE <img src="/img/icons/arrow-right-orange.svg" alt="" /></a>
									</div>
								</div>
								<div className={'blog-card'}>
									<div className={'card-image'}>
										<img src="/img/community/blog4.jpg" alt="Packing Essentials" />
									</div>
									<div className={'card-content'}>
										<div className={'blog-meta'}>
											<span><img src="/img/icons/user.svg" alt="" /> By Liam Patel</span>
											<span><img src="/img/icons/calendar.svg" alt="" /> Sep 20, 2024</span>
										</div>
										<h4>Packing Essentials What You Should Always Bring</h4>
										<a href="#" className={'read-more'}>READ MORE <img src="/img/icons/arrow-right-orange.svg" alt="" /></a>
									</div>
								</div>
							</Stack>
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
