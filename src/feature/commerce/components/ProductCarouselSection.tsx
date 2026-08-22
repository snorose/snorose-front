import { useState } from 'react';

import { Carousel } from '@/shared/component';

import type { Sale } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

import ProductCard from './ProductCard';

export default function ProductCarouselSection({ sale }: { sale: Sale }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = sale.products.flatMap((product) => {
    const imageUrls = product.imageUrls.length > 0 ? product.imageUrls : [''];

    return imageUrls.map((imageUrl) => ({
      product,
      imageUrl,
    }));
  });

  const activeItem = carouselItems[activeIndex] ?? carouselItems[0];

  if (!activeItem) return null;

  return (
    <section>
      <Carousel
        className={styles.productCarousel}
        items={carouselItems}
        renderItem={(item) => (
          <ProductCard
            src={item.imageUrl}
            alt={item.product.name ?? sale.title}
          />
        )}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={false}
      />
      <div className={styles.productInfo}>
        <h2 className={styles.productName}>{activeItem.product.name}</h2>
        <p className={styles.productDescription}>
          {activeItem.product.description}
        </p>
      </div>
    </section>
  );
}
