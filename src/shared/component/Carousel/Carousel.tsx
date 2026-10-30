import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react';

import styles from './Carousel.module.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type CarouselProps<T> = Omit<SwiperProps, 'children'> & {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
  delay?: number;
};

export default function Carousel<T>({
  items,
  renderItem,
  className,
  delay = 3000,
  ...props
}: CarouselProps<T>) {
  return (
    <Swiper
      className={`${styles.carousel} ${className ?? ''}`}
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
      {...props}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{renderItem(item)}</SwiperSlide>
      ))}
    </Swiper>
  );
}
