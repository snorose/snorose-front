import { useState } from 'react';

import { BackAppBar } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedModal from '@/feature/commerce/components/SaleClosedModal';
import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import type { QuantityMap } from '@/feature/commerce/types';
import {
  getTotalPaymentAmount,
  hasSelectedOrderItem,
  isClosedSale,
} from '@/feature/commerce/utils/saleDetail';

import { sale } from '@/dummy/data/sale';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  const [quantityMap, setQuantityMap] = useState<QuantityMap>({});
  const [isOrdererInfoConsentChecked, setIsOrdererInfoConsentChecked] =
    useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaleClosedModalOpen, setIsSaleClosedModalOpen] = useState(false);

  const isSaleClosed = isClosedSale(sale.closesAt);

  const totalPaymentAmount = getTotalPaymentAmount(sale, quantityMap);
  const hasSelectedProduct = hasSelectedOrderItem(quantityMap);
  const isPhoneNumberValid = phoneNumber.length === 11;
  const isPurchaseButtonDisabled =
    !hasSelectedProduct || !isPhoneNumberValid || !isOrdererInfoConsentChecked;

  const handlePurchaseClick = () => {
    if (isClosedSale(sale.closesAt)) {
      setIsSaleClosedModalOpen(true);
      return;
    }
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
        </span>
      </section>

      <ProductCarouselSection products={sale.products} />

      <div className={styles.border} />

      {isSaleClosed ? (
        <SaleClosedSection sale={sale} />
      ) : (
        <>
          <ProductOptionSection
            products={sale.products}
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
    </div>
  );
}
