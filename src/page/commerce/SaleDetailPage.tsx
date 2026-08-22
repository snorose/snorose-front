import { useMemo, useState } from 'react';

import { BackAppBar } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import OrderConfirmModal from '@/feature/commerce/components/OrderConfirmModal';
import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedModal from '@/feature/commerce/components/SaleClosedModal';
import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import type { QuantityMap, SelectedOrderItem } from '@/feature/commerce/types';
import { isClosedSale } from '@/feature/commerce/utils/saleDetail';

import { sale } from '@/dummy/data/sale';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  const [quantityMap, setQuantityMap] = useState<QuantityMap>({});
  const [isOrdererInfoConsentChecked, setIsOrdererInfoConsentChecked] =
    useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSaleClosedModalOpen, setIsSaleClosedModalOpen] = useState(false);
  const isSaleClosed = isClosedSale(sale.closesAt);

  const totalPaymentAmount = useMemo(() => {
    if (!sale) return 0;

    return sale.products.reduce(
      (saleTotal, product) =>
        saleTotal +
        product.variants.reduce((productTotal, variant) => {
          const quantity =
            quantityMap[product.productId]?.[variant.variantId] ?? 0;

          return productTotal + variant.unitPrice * quantity;
        }, 0),
      0
    );
  }, [quantityMap]);

  const hasSelectedProduct = useMemo(
    () =>
      Object.values(quantityMap).some((productQuantities) =>
        Object.values(productQuantities ?? {}).some((quantity) => quantity > 0)
      ),
    [quantityMap]
  );

  const selectedOrderItems = useMemo<SelectedOrderItem[]>(
    () =>
      sale.products
        .flatMap((product) =>
          product.variants.map((variant) => {
            const quantity =
              quantityMap[product.productId]?.[variant.variantId] ?? 0;

            return {
              product,
              variant,
              quantity,
            };
          })
        )
        .filter(({ quantity }) => quantity > 0),
    [quantityMap]
  );

  const isPurchaseButtonDisabled =
    !hasSelectedProduct ||
    phoneNumber.length !== 11 ||
    !isOrdererInfoConsentChecked;

  if (!sale) return null;

  const handlePurchaseClick = () => {
    if (isClosedSale(sale.closesAt)) {
      setIsSaleClosedModalOpen(true);
      return;
    }

    setIsPaymentModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <BackAppBar title='공구 상품' notFixed />

      <section className={styles.meta}>
        <div className={styles.metaHeader}>
          <span className={styles.sellerName}>{sale.sellerName}</span>
          {isSaleClosed && (
            <span className={styles.closedBadge}>판매 마감</span>
          )}
        </div>
        <h1 className={styles.title}>{sale.title}</h1>
        <span className={styles.deadline}>
          {DateTime.format(sale.closesAt, 'MD_HM')} 판매 마감 ·
          {sale.pickup.instructions}
        </span>
      </section>

      <ProductCarouselSection sale={sale} />

      <div className={styles.border} />

      {isSaleClosed ? (
        <SaleClosedSection sale={sale} />
      ) : (
        <>
          <ProductOptionSection
            sale={sale}
            quantityMap={quantityMap}
            setQuantityMap={setQuantityMap}
          />

          <div className={styles.border} />

          <OrdererInfoSection
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isOrdererInfoConsentChecked={isOrdererInfoConsentChecked}
            setIsOrdererInfoConsentChecked={setIsOrdererInfoConsentChecked}
          />

          <div className={styles.border} />

          <PaymentSection
            totalPaymentAmount={totalPaymentAmount}
            isPurchaseButtonDisabled={isPurchaseButtonDisabled}
            onPurchaseClick={handlePurchaseClick}
          />
        </>
      )}

      {isSaleClosedModalOpen && (
        <SaleClosedModal onClose={() => setIsSaleClosedModalOpen(false)} />
      )}

      {isPaymentModalOpen && (
        <OrderConfirmModal
          sale={sale}
          selectedOrderItems={selectedOrderItems}
          totalPaymentAmount={totalPaymentAmount}
          phoneNumber={phoneNumber}
          onEdit={() => setIsPaymentModalOpen(false)}
          onConfirm={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
}
