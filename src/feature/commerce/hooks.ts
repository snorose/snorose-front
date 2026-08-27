import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { QUERY_KEY } from '@/shared/constant';
import { useToast } from '@/shared/hook';

import { createOrder, getSale } from '@/feature/commerce/apis';
import type {
  NoticeAcceptanceMap,
  QuantityMap,
  SaleResponse,
} from '@/feature/commerce/types';
import {
  areRequiredNoticesAccepted,
  getCreateOrderItems,
  getCreateOrderRequestSignature,
  getNoticeAcceptances,
  getSelectedOrderItems,
  getTotalPaymentAmount,
  isClosedSale,
  isContactSharingConsentAccepted,
} from '@/feature/commerce/utils/saleDetail';

export function useSale(saleId?: string) {
  return useQuery<SaleResponse>({
    queryKey: QUERY_KEY.commerceSale(saleId),
    queryFn: () => getSale(saleId!),
    enabled: Boolean(saleId),
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  });
}

export function useSaleOrderForm(saleId?: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const saleQuery = useSale(saleId);
  const createOrderMutation = useCreateOrder();

  const [quantityMap, setQuantityMap] = useState<QuantityMap>({});
  const [noticeAcceptanceMap, setNoticeAcceptanceMap] =
    useState<NoticeAcceptanceMap>({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaleClosedModalOpen, setIsSaleClosedModalOpen] = useState(false);
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false);

  const sale = saleQuery.data;

  const selectedOrderItems = useMemo(
    () => (sale ? getSelectedOrderItems(sale, quantityMap) : []),
    [sale, quantityMap]
  );

  const createOrderItems = useMemo(
    () => getCreateOrderItems(selectedOrderItems),
    [selectedOrderItems]
  );

  const noticeAcceptances = useMemo(
    () => (sale ? getNoticeAcceptances(sale, noticeAcceptanceMap) : []),
    [sale, noticeAcceptanceMap]
  );

  const contactSharingConsent = useMemo(
    () =>
      sale ? isContactSharingConsentAccepted(sale, noticeAcceptanceMap) : false,
    [sale, noticeAcceptanceMap]
  );

  const { getClientRequestId, resetClientRequestId } = useOrderClientRequestId(
    getCreateOrderRequestSignature({
      saleId: saleId ?? '',
      buyerContact: phoneNumber,
      contactSharingConsent,
      noticeAcceptances,
      items: createOrderItems,
    })
  );

  const isSaleClosed = sale
    ? sale.status === 'CLOSE' || !sale.orderable || isClosedSale(sale.closesAt)
    : false;
  const totalPaymentAmount = sale
    ? getTotalPaymentAmount(sale, quantityMap)
    : 0;
  const areNoticesAccepted = sale
    ? areRequiredNoticesAccepted(sale, noticeAcceptanceMap)
    : false;
  const isPurchaseButtonDisabled =
    selectedOrderItems.length === 0 ||
    phoneNumber.length !== 11 ||
    !contactSharingConsent ||
    !areNoticesAccepted ||
    createOrderMutation.isPending;
  const acceptedNoticeTexts = sale
    ? sale.notices
        .filter((notice) => noticeAcceptanceMap[notice.noticeId] === true)
        .map((notice) => notice.text)
    : [];

  const handlePurchaseClick = () => {
    if (isSaleClosed) {
      setIsSaleClosedModalOpen(true);
      return;
    }

    setIsOrderConfirmModalOpen(true);
  };

  const handleOrderConfirm = () => {
    if (!saleId || !sale) return;

    createOrderMutation.mutate(
      {
        saleId,
        clientRequestId: getClientRequestId(),
        buyerContact: phoneNumber,
        contactSharingConsent,
        noticeAcceptances,
        items: createOrderItems,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: QUERY_KEY.commerceOrders });
          resetClientRequestId();
          setQuantityMap({});
          setNoticeAcceptanceMap({});
          setPhoneNumber('');
          setIsOrderConfirmModalOpen(false);

          const orderNumber = data.result?.orderNumber;

          if (orderNumber) {
            navigate(`/commerce/orders/${orderNumber}`);
            return;
          }

          toast({ message: '주문이 완료되었어요.' });
        },
        onError: async (error) => {
          const errorCode = getCommerceErrorCode(error);

          if (isNoticeVersionChangedError(errorCode)) {
            resetClientRequestId();
            setNoticeAcceptanceMap({});
            setIsOrderConfirmModalOpen(false);
            await saleQuery.refetch();
            toast({ message: '유의사항이 변경되어 다시 확인해주세요.' });
            return;
          }

          if (isOutOfStockError(errorCode)) {
            await saleQuery.refetch();
            setIsOrderConfirmModalOpen(false);
            toast({ message: '선택한 옵션의 재고가 부족합니다.' });
            return;
          }

          if (isSaleNotOrderableError(errorCode)) {
            await saleQuery.refetch();
            setIsOrderConfirmModalOpen(false);
            setIsSaleClosedModalOpen(true);
            return;
          }

          toast({
            message:
              getCommerceErrorMessage(error) ?? '주문을 완료하지 못했어요.',
          });
        },
      }
    );
  };

  return {
    sale,
    isSaleError: saleQuery.isError,
    isSaleLoading: saleQuery.isLoading,
    quantityMap,
    setQuantityMap,
    noticeAcceptanceMap,
    setNoticeAcceptanceMap,
    phoneNumber,
    setPhoneNumber,
    isSaleClosed,
    isSaleClosedModalOpen,
    closeSaleClosedModal: () => setIsSaleClosedModalOpen(false),
    isOrderConfirmModalOpen,
    closeOrderConfirmModal: () => setIsOrderConfirmModalOpen(false),
    selectedOrderItems,
    acceptedNoticeTexts,
    totalPaymentAmount,
    isSubmittingOrder: createOrderMutation.isPending,
    isPurchaseButtonDisabled,
    handlePurchaseClick,
    handleOrderConfirm,
  };
}

export function useOrderClientRequestId(resetKey: string) {
  const clientRequestIdRef = useRef<string | null>(null);

  const getClientRequestId = useCallback(() => {
    if (!clientRequestIdRef.current) {
      clientRequestIdRef.current = crypto.randomUUID();
    }

    return clientRequestIdRef.current;
  }, []);

  const resetClientRequestId = useCallback(() => {
    clientRequestIdRef.current = null;
  }, []);

  useEffect(() => {
    resetClientRequestId();
  }, [resetClientRequestId, resetKey]);

  return { getClientRequestId, resetClientRequestId };
}

function getCommerceErrorCode(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const code = error.response?.data?.code;

  if (typeof code !== 'string' && typeof code !== 'number') {
    return undefined;
  }

  return String(code);
}

function getCommerceErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const message = error.response?.data?.message;

  return typeof message === 'string' ? message : undefined;
}

function isNoticeVersionChangedError(errorCode?: string) {
  return (
    errorCode === '7011' ||
    errorCode === 'NOTICE_VERSION_CHANGED' ||
    errorCode === 'COMMERCE_NOTICE_VERSION_CHANGED'
  );
}

function isOutOfStockError(errorCode?: string) {
  return errorCode === '7005' || errorCode === 'COMMERCE_OUT_OF_STOCK';
}

function isSaleNotOrderableError(errorCode?: string) {
  return errorCode === '7001' || errorCode === 'COMMERCE_SALE_NOT_ORDERABLE';
}
