import { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorBoundary } from '@sentry/react';

import { BackAppBar } from '@/shared/component';
import { useToast } from '@/shared/hook';
import { DateTime } from '@/shared/lib';

import NoticeAgreementSection from '@/feature/commerce/components/NoticeAgreementSection';
import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import {
  useCreateOrder,
  useNoticeAgreement,
  useOrderClientRequestId,
  useOrdererInfo,
  useSale,
  useSaleOrderForm,
} from '@/feature/commerce/hooks';
import {
  getCommerceErrorCode,
  getCreateOrderRequestSignature,
  getSaleUnavailableMessage,
  getSaleUnavailableTitle,
} from '@/feature/commerce/utils/saleDetail';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  return (
    <ErrorBoundary
      fallback={<SaleDetailFeedback message='판매 정보를 불러오지 못했어요.' />}
    >
      <Suspense
        fallback={
          <SaleDetailFeedback message='판매 정보를 불러오는 중이에요.' />
        }
      >
        <SaleDetailView />
      </Suspense>
    </ErrorBoundary>
  );
}

function SaleDetailView() {
  const { saleId } = useParams();

  const { data: sale } = useSale(saleId);

  const {
    quantityMap,
    items,
    totalPaymentAmount,
    handlePlusQuantity,
    handleMinusQuantity,
  } = useSaleOrderForm(sale.products);

  const { name, studentNumber, phoneNumber, handlePhoneNumber } =
    useOrdererInfo();

  const { noticeAcceptanceMap, handleNoticeAcceptance, noticeAcceptances } =
    useNoticeAgreement(sale.notices);

  const { getClientRequestId } = useOrderClientRequestId(
    getCreateOrderRequestSignature({
      saleId,
      buyerContact: phoneNumber,
      contactSharingConsent: true,
      noticeAcceptances,
      items,
    })
  );

  const { toast } = useToast();

  const { mutate: createOrder, isPending: isPendingCreateOrder } =
    useCreateOrder();

  const handleCreateOrder = () => {
    createOrder(
      {
        saleId,
        clientRequestId: getClientRequestId(),
        buyerContact: phoneNumber,
        contactSharingConsent: true,
        noticeAcceptances,
        items,
      },
      {
        onSuccess: () => {
          toast({ message: '주문이 완료되었어요.' });
        },
        onError: (error) => {
          const errorCode = getCommerceErrorCode(error);

          switch (errorCode) {
            case 7000:
              toast({ text: '판매 없음/DRAFT', type: 'error' });
              break;
            case 7001:
              toast({ text: '기간 외/CLOSED', type: 'error' });
              break;
            case 7004:
              toast({ text: '다른 판매의 옵션 포함', type: 'error' });
              break;
            case 7003:
              toast({ text: '비활성/삭제된 옵션', type: 'error' });
              break;
            case 7005:
              toast({ text: '재고 부족', type: 'error' });
              break;
            case 7006:
              toast({ text: '1인 최대 수량 초과', type: 'error' });
              break;
            case 7007:
              toast({ text: '수량 오류', type: 'error' });
              break;
            case 7008:
              toast({ text: '연락처 형식 오류', type: 'error' });
              break;
            case 7009:
              toast({ text: '동의 누락', type: 'error' });
              break;
            case 7010:
              toast({ text: '필수 확인 항목 누락', type: 'error' });
              break;
            case 7011:
              toast({ text: '확인 항목 버전 변경', type: 'error' });
              break;
            case 7012:
              toast({ text: 'clientRequestId 형식 오류', type: 'error' });
              break;
          }
        },
      }
    );
  };

  const isOrderable =
    items.length > 0 &&
    phoneNumber.length === 11 &&
    sale.notices
      .filter((notice) => notice.required)
      .every((notice) => noticeAcceptanceMap[notice.noticeId]) &&
    !isPendingCreateOrder;

  return (
    <div className={styles.container}>
      <BackAppBar title='공구 상품' notFixed />

      <section className={styles.meta}>
        <div className={styles.metaHeader}>
          <span className={styles.sellerName}>{sale.sellerName}</span>
          {!sale.orderable && (
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

      {!sale.orderable ? (
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
            handlePlusQuantity={handlePlusQuantity}
            handleMinusQuantity={handleMinusQuantity}
          />

          <div className={styles.border} />

          <OrdererInfoSection
            name={name}
            studentNumber={studentNumber}
            phoneNumber={phoneNumber}
            handlePhoneNumber={handlePhoneNumber}
          />

          <div className={styles.border} />

          <NoticeAgreementSection
            notices={sale.notices}
            noticeAcceptanceMap={noticeAcceptanceMap}
            handleNoticeAcceptance={handleNoticeAcceptance}
          />

          <div className={styles.border} />

          <PaymentSection
            totalPaymentAmount={totalPaymentAmount}
            isOrderButtonDisabled={!isOrderable}
            onClick={() => handleCreateOrder()}
          />
        </>
      )}

      {/* {isSaleClosedModalOpen && (
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
      )} */}
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
