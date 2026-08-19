import { useState } from 'react';

import { BackAppBar, Carousel } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import ProductCard from '@/page/commerce/ProductCard';

import { sale } from '@/dummy/data/sale';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  return (
    <div className={styles.container}>
      <BackAppBar title='공구 상품' notFixed />

      <section className={styles.meta}>
        <span className={styles.sellerName}>{sale.sellerName}</span>
        <h1 className={styles.title}>{sale.title}</h1>
        <span className={styles.deadline}>
          {DateTime.format(sale.closesAt, 'MD_HM')} 판매 마감 ·
          {sale.pickup.instructions}
        </span>
      </section>

      <ProductSection />

      <div className={styles.border} />
    </div>
  );
}

function ProductSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = sale.products.flatMap((product) =>
    product.imageUrls.map((imageUrl) => ({
      ...product,
      imageUrls: undefined,
      imageUrl,
    }))
  );

  const activeItem = carouselItems[activeIndex];

  return (
    <section>
      <Carousel
        className={styles.productCarousel}
        items={carouselItems}
        renderItem={(item) => (
          <ProductCard src={item.imageUrl} alt={item.name ?? sale.title} />
        )}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={false}
      />
      <div className={styles.productInfo}>
        <h2 className={styles.productName}>{activeItem.name}</h2>
        <p className={styles.productDescription}>{activeItem.description}</p>
      </div>
    </section>
  );
}
