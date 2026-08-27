import { useParams } from 'react-router-dom';

import { BackAppBar } from '@/shared/component';
import { DateTime } from '@/shared/lib';

import NoticeAgreementSection from '@/feature/commerce/components/NoticeAgreementSection';
import OrderConfirmModal from '@/feature/commerce/components/OrderConfirmModal';
import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedModal from '@/feature/commerce/components/SaleClosedModal';
import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import { useSaleOrderForm } from '@/feature/commerce/hooks';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  const { saleId } = useParams();
  const {
    sale,
    isSaleError,
    isSaleLoading,
    quantityMap,
    setQuantityMap,
    noticeAcceptanceMap,
    setNoticeAcceptanceMap,
    phoneNumber,
    setPhoneNumber,
    isSaleClosed,
    isSaleClosedModalOpen,
    closeSaleClosedModal,
    isOrderConfirmModalOpen,
    closeOrderConfirmModal,
    selectedOrderItems,
    acceptedNoticeTexts,
    totalPaymentAmount,
    isSubmittingOrder,
    isPurchaseButtonDisabled,
    handlePurchaseClick,
    handleOrderConfirm,
  } = useSaleOrderForm(saleId);

  if (!saleId) {
    return <SaleDetailFeedback message='판매 정보를 찾을 수 없어요.' />;
  }

  if (isSaleLoading) {
    return <SaleDetailFeedback message='판매 정보를 불러오는 중이에요.' />;
  }

  if (isSaleError || !sale) {
    return <SaleDetailFeedback message='판매 정보를 불러오지 못했어요.' />;
  }

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
          />

          <div className={styles.border} />

          <NoticeAgreementSection
            notices={sale.notices}
            noticeAcceptanceMap={noticeAcceptanceMap}
            setNoticeAcceptanceMap={setNoticeAcceptanceMap}
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
        <SaleClosedModal onClose={closeSaleClosedModal} />
      )}

      {isOrderConfirmModalOpen && (
        <OrderConfirmModal
          selectedOrderItems={selectedOrderItems}
          acceptedNoticeTexts={acceptedNoticeTexts}
          phoneNumber={phoneNumber}
          totalPaymentAmount={totalPaymentAmount}
          isSubmitting={isSubmittingOrder}
          onCancel={closeOrderConfirmModal}
          onConfirm={handleOrderConfirm}
        />
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
