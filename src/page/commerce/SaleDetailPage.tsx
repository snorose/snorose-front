import { useMemo, useState } from 'react';

import { BackAppBar, Carousel } from '@/shared/component';
import { DateTime, formatNumber } from '@/shared/lib';

import type { Sale } from '@/feature/commerce/types';

import ProductCard from '@/page/commerce/ProductCard';

import { sale } from '@/dummy/data/sale';

import styles from './SaleDetailPage.module.css';

type QuantityMap = Partial<Record<number, Partial<Record<number, number>>>>;

type ProductOptionItem = {
  product: Sale['products'][number];
  variant: Sale['products'][number]['variants'][number];
  quantity: number;
  isSoldOut: boolean;
};

export default function SaleDetailPage() {
  if (!sale) return null;

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

      <ProductCarouselSection sale={sale} />

      <div className={styles.border} />

      <ProductOptionSection sale={sale} />
    </div>
  );
}

function ProductCarouselSection({ sale }: { sale: Sale }) {
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

function ProductOptionSection({ sale }: { sale: Sale }) {
  const [quantityMap, setQuantityMap] = useState<QuantityMap>({});

  const remainingQuantityByProductId = useMemo(() => {
    const result: Partial<Record<number, number | null>> = {};

    sale.products.forEach((product) => {
      if (product.maxPerBuyer === null) {
        result[product.productId] = null;
        return;
      }

      const totalQuantityByProductId = Object.values(
        quantityMap[product.productId] ?? {}
      ).reduce((sum, quantity) => sum + quantity, 0);

      result[product.productId] = Math.max(
        product.maxPerBuyer - totalQuantityByProductId,
        0
      );
    });

    return result;
  }, [sale.products, quantityMap]);

  const handleQuantityChange = (
    productId: number,
    variantId: number,
    nextQuantity: number
  ) => {
    setQuantityMap((prev) => {
      const currentQuantity = prev[productId]?.[variantId] ?? 0;
      const quantityDiff = nextQuantity - currentQuantity;
      const remainingQuantity = remainingQuantityByProductId[productId];

      if (remainingQuantity !== null && remainingQuantity < quantityDiff) {
        return prev;
      }

      const product = sale.products.find(
        (product) => product.productId === productId
      );
      const variant = product?.variants.find(
        (variant) => variant.variantId === variantId
      );
      const availableQuantity = variant.availableQuantity;

      if (
        availableQuantity !== null &&
        availableQuantity !== undefined &&
        nextQuantity > availableQuantity
      ) {
        return prev;
      }

      const nextProductQuantities = { ...(prev[productId] ?? {}) };

      if (nextQuantity <= 0) {
        nextProductQuantities[variantId] = 0;
      } else {
        nextProductQuantities[variantId] = nextQuantity;
      }

      return {
        ...prev,
        [productId]: nextProductQuantities,
      };
    });
  };

  const productOptionItems: ProductOptionItem[] = sale.products.flatMap(
    (product) =>
      product.variants.map((variant) => {
        return {
          product,
          variant,
          quantity: quantityMap[product.productId]?.[variant.variantId] ?? 0,
          isSoldOut: variant.availableQuantity === 0,
        };
      })
  );

  return (
    <section>
      <h2 className={styles.sectionTitle}>옵션/수량</h2>

      <div className={styles.optionList}>
        {productOptionItems.map(({ product, variant, quantity, isSoldOut }) => (
          <div
            className={`${styles.optionItem} ${
              isSoldOut ? styles.optionItemSoldOut : ''
            }`}
            key={`${product.productId} - ${variant.variantId}`}
          >
            <div className={styles.optionInfo}>
              <div className={styles.optionName}>
                {product.name} · {variant.optionName}
              </div>
              <div className={styles.optionMeta}>
                {formatNumber(variant.unitPrice)}원
              </div>
            </div>

            {isSoldOut && <span className={styles.soldOutBadge}>품절</span>}
            {!isSoldOut && (
              <div className={styles.quantityControl}>
                <button
                  type='button'
                  className={styles.quantityButton}
                  aria-label={`${product.name} ${variant.optionName} 수량 감소`}
                  disabled={quantity === 0}
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      variant.variantId,
                      quantity - 1
                    )
                  }
                >
                  -
                </button>

                <span className={styles.quantity}>{quantity}</span>

                <button
                  type='button'
                  className={styles.quantityButton}
                  aria-label={`${product.name} ${variant.optionName} 수량 증가`}
                  disabled={
                    remainingQuantityByProductId[product.productId] === 0 ||
                    (variant.availableQuantity !== null &&
                      quantity >= variant.availableQuantity)
                  }
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      variant.variantId,
                      quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
