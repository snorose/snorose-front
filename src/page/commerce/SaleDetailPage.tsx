import {
  getCashReceiptRequest,
  isCashReceiptOrderable,
} from '@/feature/commerce/utils/saleFeatures';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';

import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { BackAppBar, Chip, ServerErrorFallback } from '@/shared/component';
import { useToast } from '@/shared/hook';
import { DateTime } from '@/shared/lib';

import CacheReceiptSection from '@/feature/commerce/components/CacheReceiptSection';
import NoticeAgreementSection from '@/feature/commerce/components/NoticeAgreementSection';
import OrderConfirmModal from '@/feature/commerce/components/OrderConfirmModal';
import OrdererInfoSection from '@/feature/commerce/components/OrdererInfoSection';
import PaymentSection from '@/feature/commerce/components/PaymentSection';
import ProductCarouselSection from '@/feature/commerce/components/ProductCarouselSection';
import ProductOptionSection from '@/feature/commerce/components/ProductOptionSection';
import SaleClosedModal from '@/feature/commerce/components/SaleClosedModal';
import SaleDescription from '@/feature/commerce/components/SaleDescription';
import { SaleOrderArea } from '@/feature/commerce/components/SaleOrderArea';
import {
  useCreateOrder,
  useNoticeAgreement,
  useOrderClientRequestId,
  useOrdererInfo,
  useSale,
  useSaleClosedModal,
  useSaleOrderForm,
} from '@/feature/commerce/hooks';
import useCacheReceipt from '@/feature/commerce/hooks/useCacheReceipt';
import useOrderConfirmModal from '@/feature/commerce/hooks/useOrderConfirmModal';
import {
  getCommerceErrorCode,
  isValidPhoneNumber,
} from '@/feature/commerce/utils/commerceRules';

import styles from './SaleDetailPage.module.css';

export default function SaleDetailPage() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
          <Suspense
            fallback={
              <SaleDetailFeedback message='판매 정보를 불러오는 중이에요' />
            }
          >
            <SaleDetailView />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function SaleDetailView() {
  const { saleId } = useParams();
  const navigate = useNavigate();

  const { data: sale, refetch } = useSale(saleId);

  const {
    quantityMap,
    selectedOrderItems,
    totalPaymentAmount,
    handlePlusQuantity,
    handleMinusQuantity,
    resetQuantityMap,
  } = useSaleOrderForm(sale.products);

  const { name, studentNumber, phoneNumber, handlePhoneNumber } =
    useOrdererInfo();

  const {
    isCacheReceiptHope,
    handleCacheReceiptHope,
    cacheReceiptPhoneNumber,
    handleCacheReceiptPhoneNumber,
    isCacheReceiptAgree,
    handleCacheReceiptAgree,
  } = useCacheReceipt();

  const { noticeAcceptanceMap, handleNoticeAcceptance, noticeAcceptances } =
    useNoticeAgreement(sale.notices);

  const { getClientRequestId, resetClientRequestId } =
    useOrderClientRequestId();

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
        cashReceiptRequest: getCashReceiptRequest(
          sale.cashReceiptEnabled,
          isCacheReceiptHope,
          cacheReceiptPhoneNumber,
          isCacheReceiptAgree
        ),
        noticeAcceptances,
        items: selectedOrderItems.map(({ variantId, quantity }) => ({
          variantId,
          quantity,
        })),
      },
      {
        onSuccess: (data) => {
          resetClientRequestId();
          toast.info(
            sale.saleType === 'LECTURE'
              ? '신청이 접수되었어요.'
              : '주문이 완료되었어요.'
          );
          navigate(`/commerce/orders/${data.orderNumber}`, { replace: true });
        },
        onError: async (error) => {
          const errorCode = getCommerceErrorCode(error);

          switch (errorCode) {
            case 7000: // 판매 없음/DRAFT
              toast.error('주문을 할 수 없습니다');
              refetch();
              break;
            case 7001: // 기간 외/CLOSED
              openSaleClosedModal();
              refetch();
              break;
            case 7003: // 비활성/삭제된 옵션
              toast.error('삭제된 옵션이 포함되어 있습니다');
              refetchSaleAndResetProducts();
              break;
            case 7004: // 다른 판매의 옵션 포함
              toast.error('다른 판매 옵션이 포함되어 있습니다');
              refetchSaleAndResetProducts();
              break;
            case 7005: // 재고 부족
              toast.error(
                sale.saleType === 'LECTURE'
                  ? '정원이 찬 참가권이 포함되어 있어요'
                  : '품절 상품이 포함되었습니다'
              );
              refetchSaleAndResetProducts();
              break;
            case 7006: // 1인 최대 수량 초과
              toast.error('인당 수량 제한이 초과되었습니다');
              break;
            case 7007: // 수량 오류
            case 7008: // 연락처 형식 오류
              toast.error('다시 시도해주세요');
              break;
            case 7009: // 동의 누락
            case 7010: // 필수 확인 항목 누락
              toast.error('필수 체크 항목을 확인해주세요');
              break;
            case 7012:
              toast.error('다시 시도해주세요');
              break;
          }
        },
      }
    );
  };

  const isCacheReceiptOrderable = isCashReceiptOrderable(
    sale.cashReceiptEnabled,
    isCacheReceiptHope,
    cacheReceiptPhoneNumber,
    isCacheReceiptAgree
  );

  const isBaseOrderable =
    selectedOrderItems.length > 0 &&
    phoneNumber.length === 11 &&
    isValidPhoneNumber(phoneNumber) &&
    sale.notices
      .filter((notice) => notice.required)
      .every((notice) => noticeAcceptanceMap[notice.text]) &&
    !isPendingCreateOrder;

  const isOrderable = isBaseOrderable && isCacheReceiptOrderable;

  return (
    <div className={styles.container}>
      <BackAppBar
        title={sale.saleType === 'LECTURE' ? '강연 신청' : '물품 판매'}
        notFixed
      />

      <section className={styles.meta}>
        <div className={styles.metaHeader}>
          <span className={styles.sellerName}>{sale.sellerName}</span>
          {sale.status === 'CLOSED' && (
            <Chip
              name={sale.saleType === 'LECTURE' ? '모집 마감' : '판매 마감'}
              variant='grey'
            />
          )}
          {sale.status === 'OPEN' && (
            <Chip
              name={sale.saleType === 'LECTURE' ? '모집 중' : '판매 중'}
              variant='gradient'
            />
          )}
        </div>
        <h1 className={styles.title}>{sale.title}</h1>
        <SaleDescription value={sale.description} />
        <span className={styles.deadline}>
          {DateTime.format(sale.closesAt, 'MD_HM')}{' '}
          {sale.saleType === 'LECTURE' ? '모집 마감' : '판매 마감'}
        </span>
      </section>

      <ProductCarouselSection products={sale.products} />

      <div className={styles.border} />

      <SaleOrderArea sale={sale}>
        <ProductOptionSection
          saleType={sale.saleType}
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

        {sale.cashReceiptEnabled !== false && (
          <>
            <CacheReceiptSection
              isCacheReceiptHope={isCacheReceiptHope}
              handleCacheReceiptHope={handleCacheReceiptHope}
              cacheReceiptPhoneNumber={cacheReceiptPhoneNumber}
              handleCacheReceiptPhoneNumber={handleCacheReceiptPhoneNumber}
              isCacheReceiptAgree={isCacheReceiptAgree}
              handleCacheReceiptAgree={handleCacheReceiptAgree}
            />

            <div className={styles.border} />
          </>
        )}
        <NoticeAgreementSection
          notices={sale.notices}
          noticeAcceptanceMap={noticeAcceptanceMap}
          handleNoticeAcceptance={handleNoticeAcceptance}
        />

        <div className={styles.border} />

        <PaymentSection
          autoPaymentEnabled={sale.autoPaymentEnabled}
          saleType={sale.saleType}
          fulfillmentMethod={sale.fulfillmentMethod}
          totalPaymentAmount={totalPaymentAmount}
          isOrderButtonDisabled={!isOrderable}
          onClick={() => openOrderConfirmModal()}
        />
      </SaleOrderArea>

      {isSaleClosedModalOpen && (
        <SaleClosedModal
          saleType={sale.saleType}
          onClose={closeSaleClosedModal}
        />
      )}

      {isOrderConfirmModalOpen && (
        <OrderConfirmModal
          saleType={sale.saleType}
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
      <BackAppBar title='판매 안내' notFixed />
      <section className={styles.feedback} aria-live='polite'>
        {message}
      </section>
    </div>
  );
}

function ErrorFallback({ error, resetErrorBoundary }) {
  const errorCode = getCommerceErrorCode(error);

  switch (errorCode) {
    case 7000:
      return <SaleDetailFeedback message='존재하지 않는 판매예요' />;
    default:
      return <ServerErrorFallback reset={resetErrorBoundary} />;
  }
}
