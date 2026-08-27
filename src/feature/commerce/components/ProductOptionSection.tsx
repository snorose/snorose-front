import { formatNumber } from '@/shared/lib';

import type {
  ProductOptionItem,
  QuantityMap,
  SaleResponse,
} from '@/feature/commerce/types';
import {
  getProductQuantity,
  isValidQuantityPolicy,
} from '@/feature/commerce/utils/saleDetail';

import styles from '@/page/commerce/SaleDetailPage.module.css';

type ProductOptionSectionProps = {
  products: SaleResponse['products'];
  quantityMap: QuantityMap;
  handlePlusQuantity: (productId: number, variantId: number) => void;
  handleMinusQuantity: (productId: number, variantId: number) => void;
};

export default function ProductOptionSection({
  products,
  quantityMap,
  handlePlusQuantity,
  handleMinusQuantity,
}: ProductOptionSectionProps) {
  const productOptionItems: ProductOptionItem[] = products.flatMap((product) =>
    product.variants.map((variant) => {
      return {
        product,
        variant,
        quantity: quantityMap[product.productId][variant.variantId],
        isSoldOut: variant.availableQuantity === 0,
      };
    })
  );

  return (
    <section>
      <h2 className={styles.sectionTitle}>옵션/수량</h2>

      <div className={styles.optionList}>
        {productOptionItems.map(({ product, variant, quantity, isSoldOut }) => {
          const isPlusQuantityValid =
            quantity < variant.availableQuantity &&
            getProductQuantity(product.productId, quantityMap) <
              product.remainingForBuyer;

          return (
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
                      handleMinusQuantity(product.productId, variant.variantId)
                    }
                  >
                    -
                  </button>

                  <span className={styles.quantity}>{quantity}</span>

                  <button
                    type='button'
                    className={styles.quantityButton}
                    aria-label={`${product.name} ${variant.optionLabel} 수량 증가`}
                    disabled={!isPlusQuantityValid}
                    onClick={() =>
                      handlePlusQuantity(product.productId, variant.variantId)
                    }
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
