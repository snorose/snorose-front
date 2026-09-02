import { formatNumber } from '@/shared/lib';

import type {
  ProductOption,
  QuantityMap,
  SaleResponse,
} from '@/feature/commerce/types';
import { isPlusQuantityInvalid } from '@/feature/commerce/utils/commerceRules';

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
  const productOptionItems: ProductOption[] = products.flatMap((product) =>
    product.variants.map((variant) => {
      return {
        productId: product.productId,
        productName: product.name,
        inventoryPolicy: product.inventoryPolicy,
        variantId: variant.variantId,
        optionLabel: variant.optionLabel,
        unitPrice: variant.unitPrice,
        availableQuantity: variant.availableQuantity,
      };
    })
  );

  return (
    <section>
      <h2 className={styles.sectionTitle}>옵션/수량</h2>

      <div className={styles.products}>
        {products.map((product) => (
          <div className={styles.product}>
            <div className={styles.productName}>
              {product.name}
              <span className={styles.productMaxPerBuyer}>
                최대 {product.maxPerBuyer}개 구매 가능
              </span>
            </div>

            <div className={styles.optionList}>
              {product.variants.map((variant) => {
                const option = productOptionItems.find(
                  (item) => item.variantId === variant.variantId
                );

                const isInvalid = isPlusQuantityInvalid(
                  product,
                  variant,
                  quantityMap
                );

                const quantity =
                  quantityMap[product.productId][variant.variantId];

                return (
                  <ProductOptionItem
                    option={option}
                    quantity={quantityMap[product.productId][option.variantId]}
                    onIncrease={handlePlusQuantity}
                    onDecrease={handleMinusQuantity}
                    decreaseDisabled={quantity <= 0}
                    increaseDisabled={isInvalid}
                    inventoryPolicy={product.inventoryPolicy}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ProductOptionItem({
  option,
  quantity,
  onIncrease,
  onDecrease,
  increaseDisabled,
  decreaseDisabled,
  inventoryPolicy,
}: {
  option: ProductOption;
  quantity: number;
  onIncrease: (productId: number, variantId: number) => void;
  onDecrease: (productId: number, variantId: number) => void;
  increaseDisabled: boolean;
  decreaseDisabled: boolean;
  inventoryPolicy: SaleResponse['products'][number]['inventoryPolicy'];
}) {
  const isSoldOut =
    inventoryPolicy === 'LIMITED_STOCK' && option.availableQuantity === 0;

  return (
    <div
      className={`${styles.optionItem} ${
        isSoldOut ? styles.optionItemSoldOut : ''
      }`}
      key={option.variantId}
    >
      <div className={styles.optionInfo}>
        <div className={styles.optionLabel}>{option.optionLabel}</div>
        <div className={styles.optionMeta}>
          {formatNumber(option.unitPrice)}원
        </div>
      </div>

      {isSoldOut && <span className={styles.soldOutBadge}>품절</span>}
      {!isSoldOut && (
        <div className={styles.quantityControl}>
          <button
            type='button'
            className={styles.quantityButton}
            aria-label={`${option.productName} ${option.optionLabel} 수량 감소`}
            disabled={decreaseDisabled}
            onClick={() => onDecrease(option.productId, option.variantId)}
          >
            -
          </button>

          <span className={styles.quantity}>{quantity}</span>

          <button
            type='button'
            className={styles.quantityButton}
            aria-label={`${option.productName} ${option.optionLabel} 수량 증가`}
            disabled={increaseDisabled}
            onClick={() => onIncrease(option.productId, option.variantId)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
