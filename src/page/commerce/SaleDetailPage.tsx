import { useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

import { BackAppBar } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import { useSale } from '@/feature/commerce/hooks';
import type { QuantityMap } from '@/feature/commerce/types';
import {
  getSaleUnavailableMessage,
  getSaleUnavailableTitle,
  getTotalPaymentAmount,
  hasSelectedOrderItem,
  isSaleOrderable,
} from '@/feature/commerce/utils/saleDetail';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  const { saleId } = useParams();
  const { data: sale, error, isError, isLoading } = useSale(saleId);

  const [quantityMap, setQuantityMap] = useState<QuantityMap>({});
  const [isOrdererInfoConsentChecked, setIsOrdererInfoConsentChecked] =
    useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!saleId) {
    return <SaleDetailFeedback message='판매 정보를 찾을 수 없어요.' />;
  }

  if (isLoading) {
    return <SaleDetailFeedback message='판매 정보를 불러오는 중이에요.' />;
  }

  if (isError || !sale) {
    return <SaleDetailFeedback message={getSaleFetchErrorMessage(error)} />;
  }

  const isOrderable = isSaleOrderable(sale);
  const totalPaymentAmount = getTotalPaymentAmount(sale, quantityMap);
  const hasSelectedProduct = hasSelectedOrderItem(quantityMap);
  const isPhoneNumberValid = phoneNumber.length === 11;
  const isPurchaseButtonDisabled =
    !hasSelectedProduct || !isPhoneNumberValid || !isOrdererInfoConsentChecked;

  return (
    <div className={styles.container}>
      <BackAppBar title='공구 상품' notFixed />

      <section className={styles.meta}>
        <div className={styles.metaHeader}>
          <span className={styles.sellerName}>{sale.sellerName}</span>
          {!isOrderable && (
            <span className={styles.closedBadge}>주문 불가</span>
          )}
        </div>
        <h1 className={styles.title}>{sale.title}</h1>
        <p className={styles.description}>{sale.description}</p>
        <span className={styles.deadline}>
          {DateTime.format(sale.closesAt, 'MD_HM')} 판매 마감
        </span>
      </section>

      <ProductCarouselSection products={sale.products} />

      <div className={styles.border} />

      {!isOrderable ? (
        <SaleClosedSection
          sale={sale}
          title={getSaleUnavailableTitle(sale)}
          message={getSaleUnavailableMessage(sale)}
        />
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
            onPurchaseClick={() => undefined}
          />
        </>
      )}
    </div>
  );
}

function SaleDetailFeedback({ message }: { message: string }) {
  return (
    <div className={styles.container}>
      <BackAppBar title='공구 상품' notFixed />
      <section className={styles.feedback} aria-live='polite'>
        {message}
      </section>
    </div>
  );
}

function getSaleFetchErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return '판매 정보를 불러오지 못했어요.';
}
