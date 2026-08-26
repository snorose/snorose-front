import { type Dispatch, type SetStateAction, useMemo } from 'react';

import { formatNumber } from '@/shared/lib';

import type {
  ProductOptionItem,
  QuantityMap,
  SaleResponse,
} from '@/feature/commerce/types';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type ProductOptionSectionProps = {
  products: SaleResponse['products'];
  quantityMap: QuantityMap;
  setQuantityMap: Dispatch<SetStateAction<QuantityMap>>;
};

export default function ProductOptionSection({
  products,
  quantityMap,
  setQuantityMap,
}: ProductOptionSectionProps) {
  const remainingQuantityByProductId = useMemo(() => {
    const result: Partial<Record<number, number | null>> = {};

    products.forEach((product) => {
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
  }, [products, quantityMap]);

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

      const product = products.find(
        (product) => product.productId === productId
      );
      const variant = product?.variants.find(
        (variant) => variant.variantId === variantId
      );

      if (!variant) return prev;

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

  const productOptionItems: ProductOptionItem[] = products.flatMap((product) =>
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
              <div className={styles.optionLabel}>
                {product.name} · {variant.optionLabel}
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
                  aria-label={`${product.name} ${variant.optionLabel} 수량 감소`}
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
                  aria-label={`${product.name} ${variant.optionLabel} 수량 증가`}
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
