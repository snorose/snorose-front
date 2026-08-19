import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Slide } from '@/feature/home/component';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Carousel.css';

export default function Carousel({ delay = 3000, className, slides }) {
  return (
    <Swiper
      className={className}
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay,
        disableOnInteraction: false,
      }}
      loop
      allowTouchMove={false}
    >
      {slides.map(({ imageUrl, redirectUrl }, index) => (
        <SwiperSlide key={index}>
          <Slide src={imageUrl} redirectUrl={redirectUrl} alt='banner' />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
