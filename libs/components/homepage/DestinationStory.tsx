
import React, { useRef } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import type SwiperCore from 'swiper';

const destinations = [
 {
  id: 1,
  title: 'Explore Beautiful Greece',
  image: '/img/destinations/greece.jpg',
  link: 'https://www.visitgreece.gr/',
 },
 {
  id: 2,
  title: 'Discover Santorini',
  image: '/img/destinations/santorini.jpg',
  link: 'https://www.santorini.com/',
 },
 {
  id: 3,
  title: 'Ancient Wonders of Turkey',
  image: '/img/destinations/turkey.jpg',
  link: 'https://www.goturkey.com/',
 },
 {
  id: 4,
  title: 'Malta Coastal Views',
  image: '/img/destinations/malta.jpg',
  link: 'https://www.visitmalta.com/',
 },
 {
  id: 5,
  title: 'Paris City of Lights',
  image: '/img/destinations/paris.jpg',
  link: 'https://www.parisinfo.com/',

 },
 {
  id: 6,
  title: 'Alpine Lake Reflection',
 image: '/img/banner/skopleos.jpeg',
 link: 'https://www.visitgreece.gr/islands/saronic-islands/hydra/',
 },
 {
  id: 7,
  title: 'Sunrise Beach Escape',
  image: '/img/banner/hero-travel-2.jpg',
  link: 'https://www.visitgreece.gr/',
 },
 {
  id: 8,
  title: 'Mountain Trail Journey',
  image: '/img/about-hiker.jpg',
  link: 'https://www.visitgreece.gr/',
 },
];

const DestinationStory = () => {
 const device = useDeviceDetect();
 const swiperRef = useRef<SwiperCore | null>(null);

 /** HANDLERS **/
 const handleDestinationClick = (link: string) => {
  window.open(link, '_blank');
 };

 if (device === 'mobile') {
  return (
   <Stack className={'destination-story'}>
    <div className={'story-header'}>
     <div className={'story-header-left'}>
      <div className={'section-subtitle'}>
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
       </svg>
       <span>Destination Story</span>
      </div>
      <h2 className={'story-title'}>Uncover the Magic of Each Destination</h2>
     </div>
    </div>
    <Swiper
     className={'story-swiper'}
     slidesPerView={'auto'}
     spaceBetween={16}
    >
     {destinations.map((dest) => (
      <SwiperSlide key={dest.id} className={'story-slide'}>
       <div className={'story-card'} onClick={() => handleDestinationClick(dest.link)} style={{ cursor: 'pointer' }}>
        <img src={dest.image} alt={dest.title} />
       </div>
      </SwiperSlide>
     ))}
    </Swiper>
   </Stack>
  );
 } else {
  return (
   <Stack className={'destination-story'}>
    {/* Header Row */}
    <div className={'story-header'}>
     <div className={'story-header-left'}>
      <div className={'section-subtitle'}>
       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="#e8a54b" />
       </svg>
       <span>Destination Story</span>
      </div>
      <h2 className={'story-title'}>
       Uncover the Magic of<br />Each Destination
      </h2>
     </div>
     <div className={'story-nav'}>
      <div
       className={'nav-btn'}
       onClick={() => {
        swiperRef.current?.slidePrev();
       }}
      >
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
      </div>
      <div
       className={'nav-btn'}
       onClick={() => {
        swiperRef.current?.slideNext();
       }}
      >
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
      </div>
     </div>
    </div>

{/* Swiper */}
    <Swiper
     className={'story-swiper'}
     slidesPerView={'auto'}
     spaceBetween={20}
     centeredSlides={false}
     onSwiper={(swiper: any) => {
      swiperRef.current = swiper;
     }}
    >
     {destinations.map((dest) => (
      <SwiperSlide key={dest.id} className={'story-slide'}>
       <div className={'story-card'} onClick={() => handleDestinationClick(dest.link)} style={{ cursor: 'pointer' }}>
        <img src={dest.image} alt={dest.title} />
       </div>
      </SwiperSlide>
     ))}
    </Swiper>
   </Stack>
  );
 }
};

export default DestinationStory;
