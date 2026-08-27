import { type Dispatch, type SetStateAction, useMemo } from 'react';

import { formatNumber } from '@/shared/lib';

import type {
  ProductOptionItem,
  QuantityMap,
  SaleResponse,
} from '@/feature/commerce/types';
import {
  isLimitedStockProduct,
  isVariantSoldOut,
} from '@/feature/commerce/utils/saleDetail';

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
  const selectedQuantityByProductId = useMemo(() => {
    const result: Partial<Record<number, number>> = {};

    products.forEach((product) => {
      result[product.productId] = Object.values(
        quantityMap[product.productId] ?? {}
      ).reduce((sum, quantity) => sum + quantity, 0);
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
      const product = products.find(
        (product) => product.productId === productId
      );
      const variant = product?.variants.find(
        (variant) => variant.variantId === variantId
      );

      if (!variant) return prev;

      if (isVariantSoldOut(product, variant)) {
        return prev;
      }

      const availableQuantity = variant.availableQuantity;
      const normalizedNextQuantity = Math.max(nextQuantity, 0);

      if (typeof product.remainingForBuyer === 'number') {
        const currentProductQuantity = Object.values(
          prev[productId] ?? {}
        ).reduce((sum, quantity) => sum + quantity, 0);
        const nextProductQuantity =
          currentProductQuantity - currentQuantity + normalizedNextQuantity;

        if (nextProductQuantity > product.remainingForBuyer) {
          return prev;
        }
      }

      if (
        isLimitedStockProduct(product) &&
        typeof availableQuantity === 'number' &&
        normalizedNextQuantity > availableQuantity
      ) {
        return prev;
      }

      const nextProductQuantities = { ...(prev[productId] ?? {}) };

      if (normalizedNextQuantity === 0) {
        nextProductQuantities[variantId] = 0;
      } else {
        nextProductQuantities[variantId] = normalizedNextQuantity;
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
        isSoldOut: isVariantSoldOut(product, variant),
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
                    (typeof product.remainingForBuyer === 'number' &&
                      (selectedQuantityByProductId[product.productId] ?? 0) >=
                        product.remainingForBuyer) ||
                    (isLimitedStockProduct(product) &&
                      typeof variant.availableQuantity === 'number' &&
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
