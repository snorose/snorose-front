import { useState } from 'react';

import { Carousel } from '@/shared/component';

import type { SaleResponse } from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

import ProductCard from './ProductCard';

type ProductCarouselSectionProps = {
  products: SaleResponse['products'];
};

export default function ProductCarouselSection({
  products,
}: ProductCarouselSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = products.flatMap((product) => {
    const images =
      product.images.length > 0 ? product.images : [{ imageId: 0, url: '' }];

    return images.map((image, imageIndex) => ({
      id: `${product.productId}-${image.imageId}-${imageIndex}`,
      imageUrl: image.url,
      productName: product.name,
      productDescription: product.description,
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
            key={item.id}
            src={item.imageUrl}
            alt={item.productName}
          />
        )}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={false}
      />
      <div className={styles.productInfo}>
        <h2 className={styles.productName}>{activeItem.productName}</h2>
        <p className={styles.productDescription}>
          {activeItem.productDescription}
        </p>
      </div>
    </section>
  );
}
