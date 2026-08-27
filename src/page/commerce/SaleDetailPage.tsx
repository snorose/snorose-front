import { Suspense } from 'react';
import { useParams } from 'react-router-dom';

import { ErrorBoundary } from '@sentry/react';

import { BackAppBar } from '@/shared/component';
import { useToast } from '@/shared/hook';
import { DateTime } from '@/shared/lib';

import NoticeAgreementSection from '@/feature/commerce/components/NoticeAgreementSection';
import OrderConfirmModal from '@/feature/commerce/components/OrderConfirmModal';
import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedModal from '@/feature/commerce/components/SaleClosedModal';
import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import {
  useCreateOrder,
  useNoticeAgreement,
  useOrderClientRequestId,
  useOrdererInfo,
  useSale,
  useSaleClosedModal,
  useSaleOrderForm,
} from '@/feature/commerce/hooks';
import useOrderConfirmModal from '@/feature/commerce/hooks/useOrderConfirmModal';
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

  const { data: sale, refetch } = useSale(saleId);

  const {
    quantityMap,
    selectedOrderItems,
    items,
    totalPaymentAmount,
    handlePlusQuantity,
    handleMinusQuantity,
    resetQuantityMap,
  } = useSaleOrderForm(sale.products);

  const { name, studentNumber, phoneNumber, handlePhoneNumber } =
    useOrdererInfo();

  const {
    noticeAcceptanceMap,
    handleNoticeAcceptance,
    noticeAcceptances,
    resetNoticeAcceptanceMap,
  } = useNoticeAgreement(sale.notices);

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
  const { isSaleClosedModalOpen, openSaleClosedModal, closeSaleClosedModal } =
    useSaleClosedModal();
  const {
    isOrderConfirmModalOpen,
    openOrderConfirmModal,
    closeOrderConfirmModal,
  } = useOrderConfirmModal();

  const { mutate: createOrder, isPending: isPendingCreateOrder } =
    useCreateOrder();

  const refetchSaleAndResetProducts = async () => {
    const { data: newSale } = await refetch();

    if (newSale) {
      resetQuantityMap(newSale.products);
    }
  };

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
        onError: async (error) => {
          const errorCode = getCommerceErrorCode(error);

          switch (errorCode) {
            case 7000: // 판매 없음/DRAFT
              toast({
                message: '주문을 할 수 없습니다',
                variant: 'error',
              });
              refetch();
              break;
            case 7001: // 기간 외/CLOSED
              openSaleClosedModal();
              refetch();
              break;
            case 7003: // 비활성/삭제된 옵션
              toast({
                message: '삭제된 옵션이 포함되어 있습니다',
                variant: 'error',
              });
              refetchSaleAndResetProducts();
              break;
            case 7004: // 다른 판매의 옵션 포함
              toast({
                message: '다른 판매 옵션이 포함되어 있습니다',
                variant: 'error',
              });
              refetchSaleAndResetProducts();
              break;
            case 7005: // 재고 부족
              toast({
                message: '품절 상품이 포함되었습니다',
                variant: 'error',
              });
              refetchSaleAndResetProducts();
              break;
            case 7006: // 1인 최대 수량 초과
              toast({
                message: '인당 수량 제한이 초과되었습니다',
                variant: 'error',
              });
              break;
            case 7007: // 수량 오류
            case 7008: // 연락처 형식 오류
              toast({ message: '다시 시도해주세요', variant: 'error' });
              break;
            case 7009: // 동의 누락
            case 7010: // 필수 확인 항목 누락
              toast({
                message: '필수 체크 항목을 확인해주세요',
                variant: 'error',
              });
              break;
            case 7011: // 확인 항목 버전 변경
              const { data: newSale } = await refetch();

              if (newSale) {
                resetNoticeAcceptanceMap(newSale.notices);
              }

              toast({
                message: '다시 시도해주세요',
                variant: 'error',
              });

              break;
            case 7012:
              toast({ message: '다시 시도해주세요', variant: 'error' });
              getClientRequestId();
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
            onClick={() => openOrderConfirmModal()}
          />
        </>
      )}

      {isSaleClosedModalOpen && (
        <SaleClosedModal onClose={closeSaleClosedModal} />
      )}

      {isOrderConfirmModalOpen && (
        <OrderConfirmModal
          selectedOrderItems={selectedOrderItems}
          phoneNumber={phoneNumber}
          totalPaymentAmount={totalPaymentAmount}
          isSubmitting={isPendingCreateOrder}
          onCancel={closeOrderConfirmModal}
          onConfirm={() => {
            closeOrderConfirmModal();
            handleCreateOrder();
          }}
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
