import { formatNumber } from '@/shared/lib';

import type {
  ProductOption,
  QuantityMap,
  SaleResponse,
} from '@/feature/commerce/types';
import { getProductQuantity } from '@/feature/commerce/utils/saleDetail';

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

      <div className={styles.optionList}>
        {productOptionItems.map((option) => {
          const product = products.find(
            ({ productId }) => productId === option.productId
          );
          const quantity = quantityMap[option.productId][option.variantId];
          const productTotalQuantity = getProductQuantity(
            quantityMap[option.productId]
          );
          const isPlusQuantityInvalid =
            product.inventoryPolicy === 'LIMITED_STOCK' &&
            (quantity >= option.availableQuantity ||
              productTotalQuantity >= product.remainingForBuyer);

          return (
            <ProductOptionItem
              option={option}
              quantity={quantityMap[option.productId][option.variantId]}
              onIncrease={handlePlusQuantity}
              onDecrease={handleMinusQuantity}
              decreaseDisabled={quantity === 0}
              increaseDisabled={isPlusQuantityInvalid}
              inventoryPolicy={product.inventoryPolicy}
            />
          );
        })}
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
      key={`${option.productId} - ${option.variantId}`}
    >
      <div className={styles.optionInfo}>
        <div className={styles.optionLabel}>
          {option.productName} · {option.optionLabel}
        </div>
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
