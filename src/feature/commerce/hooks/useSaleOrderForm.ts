import { useState } from 'react';

import { QuantityMap, SaleResponse } from '@/feature/commerce/types';
import {
  getSelectedOrderItems,
  isValidMaxPerBuyer,
  isValidQuantityPolicy,
} from '@/feature/commerce/utils/saleDetail';

export default function useSaleOrderForm(products: SaleResponse['products']) {
  const initialQuantityMap = products.reduce<QuantityMap>((acc, product) => {
    acc[product.productId] = Object.fromEntries(
      product.variants.map((variant) => [variant.variantId, 0])
    );

    return acc;
  }, {});

  const [quantityMap, setQuantityMap] =
    useState<QuantityMap>(initialQuantityMap);

  const selectedOrderItems = getSelectedOrderItems(products, quantityMap);

  const totalPaymentAmount = selectedOrderItems.reduce(
    (saleTotal, { product, variant, quantity }) =>
      saleTotal + variant.unitPrice * quantity,
    0
  );

  const handlePlusQuantity = (productId: number, variantId: number) => {
    const product = products.find((product) => product.productId === productId);
    const variant = product.variants.find(
      (variant) => variant.variantId === variantId
    );

    setQuantityMap((prev) => {
      const isValid =
        isValidMaxPerBuyer(product, prev) &&
        isValidQuantityPolicy(variant, prev[productId][variantId] + 1);

      if (product.inventoryPolicy === 'LIMITED_STOCK' && !isValid) {
        return prev;
      }

      return {
        ...prev,
        [productId]: {
          ...(prev[productId] ?? {}),
          [variantId]: prev[productId][variantId] + 1,
        },
      };
    });
  };

  const handleMinusQuantity = (productId: number, variantId: number) => {
    setQuantityMap((prev) => {
      const nextQuantity = prev[productId][variantId] ?? 0;

      if (nextQuantity - 1 < 0) {
        return prev;
      }

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          [variantId]: prev[productId][variantId] - 1,
        },
      };
    });
  };

  return {
    quantityMap,
    selectedOrderItems,
    items: selectedOrderItems.map(({ product, variant, quantity }) => ({
      productId: product.productId,
      variantId: variant.variantId,
      quantity,
    })),
    totalPaymentAmount,
    handlePlusQuantity,
    handleMinusQuantity,
  };
}
