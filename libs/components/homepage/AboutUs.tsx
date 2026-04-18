
import React from 'react';
import { Stack, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';

const AboutUs = () => {
 const device = useDeviceDetect();

 if (device === 'mobile') {
  return (
   <Stack className={'about-us'}>
    <div className={'about-content'}>
     <div className={'section-subtitle'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
      </svg>
      <span>About Us</span>
     </div>
     <h2 className={'about-title'}>Your Journey Begins With Us</h2>
     <p className={'about-desc'}>
      We craft unforgettable travel experiences tailored just for you. Let us turn your dream destinations into lasting memories.
     </p>
    </div>
   </Stack>
  );
 } else {
  return (
   <Stack className={'about-us'}>
    {/* Left: Images */}
    <div className={'about-images'}>
     <div className={'img-main'}>
      <img src="/img/about-hiker.jpg" alt="Hiker on mountain" />
     </div>
     <div className={'img-small'}>
      <img src="/img/about-beach.jpg" alt="Beach vacation" />
     </div>
     {/* Happy Clients badge */}
     <div className={'clients-badge'}>
      <div className={'avatars'}>
       <img src="/img/profile/agent.png" alt="client" />
       <img src="/img/profile/girl.svg" alt="client" />
       <img src="/img/profile/defaultUser.svg" alt="client" />
      </div>
      <div className={'count'}>3541+</div>
      <div className={'label'}>Happy Clients</div>
     </div>
    </div>

    {/* Right: Content */}
    <div className={'about-content'}>
     <div className={'section-subtitle'}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b"/>
      </svg>
      <span>About Us</span>
     </div>
     <h2 className={'about-title'}>
      Your Journey Begins<br />With Us
     </h2>
     <p className={'about-desc'}>
      We don't just book trips — we create stories worth telling. With years of expertise and passion for discovery, we transform ordinary vacations into extraordinary adventures.
     </p>
     <ul className={'about-features'}>
      <li>
       <span className={'check-icon'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
        </svg>
       </span>
       <span>Tailor-made itineraries crafted to match your dreams and bucket list.</span>
      </li>
      <li>
       <span className={'check-icon'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
        </svg>
       </span>
       <span>Expert local guides who reveal hidden gems and authentic experiences.</span>
      </li>
      <li>
       <span className={'check-icon'}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#fff"/>
        </svg>
       </span>
       <span>24/7 support so you travel with complete peace of mind, anywhere.</span>
      </li>
     </ul>
     <Link href={'/about'}>
      <Button className={'explore-btn'}>
       EXPLORE MORE
       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
      </Button>
     </Link>
    </div>
   </Stack>
  );
 }
};
export default AboutUs;
