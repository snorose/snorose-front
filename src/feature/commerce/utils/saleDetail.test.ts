// import type { QuantityMap, SaleResponse } from '@/feature/commerce/types';

// import {
//   getSelectedOrderItems,
//   getTotalPaymentAmount,
//   isSaleOrderable,
//   isVariantSoldOut,
// } from './saleDetail';

// const sale: SaleResponse = {
//   saleId: 1,
//   sellerName: 'Seller',
//   title: 'Summer goods',
//   description: 'Pickup only',
//   status: 'OPEN',
//   orderable: true,
//   opensAt: '2026-08-27T10:00:00',
//   closesAt: '2026-08-29T23:59:59',
//   products: [
//     {
//       productId: 20,
//       name: 'Second product',
//       description: 'Second',
//       inventoryPolicy: 'PREORDER',
//       maxPerBuyer: null,
//       remainingForBuyer: null,
//       images: [{ imageId: 2, url: '/second.png' }],
//       variants: [
//         {
//           variantId: 22,
//           optionLabel: 'B',
//           unitPrice: 2000,
//           available: true,
//           availableQuantity: null,
//         },
//         {
//           variantId: 21,
//           optionLabel: 'A',
//           unitPrice: 1000,
//           available: true,
//           availableQuantity: null,
//         },
//       ],
//     },
//     {
//       productId: 10,
//       name: 'First product',
//       description: 'First',
//       inventoryPolicy: 'LIMITED_STOCK',
//       maxPerBuyer: 3,
//       remainingForBuyer: 2,
//       images: [
//         { imageId: 12, url: '/later.png' },
//         { imageId: 11, url: '/first.png' },
//       ],
//       variants: [
//         {
//           variantId: 12,
//           optionLabel: 'Sold out',
//           unitPrice: 3000,
//           available: true,
//           availableQuantity: 0,
//         },
//         {
//           variantId: 11,
//           optionLabel: 'In stock',
//           unitPrice: 3000,
//           available: true,
//           availableQuantity: 5,
//         },
//       ],
//     },
//   ],
//   notices: [],
// };

// describe('commerce sale detail utils', () => {
//   it('keeps the server-provided product and variant order for selected items', () => {
//     const selectedOrderItems = getSelectedOrderItems(sale, {
//       10: { 11: 1 },
//       20: { 21: 1, 22: 1 },
//     });

//     expect(
//       selectedOrderItems.map(({ product, variant }) => [
//         product.productId,
//         variant.variantId,
//       ])
//     ).toEqual([
//       [20, 22],
//       [20, 21],
//       [10, 11],
//     ]);
//   });

//   it('uses server orderable as the sale orderability source', () => {
//     expect(isSaleOrderable(sale)).toBe(true);
//     expect(isSaleOrderable({ ...sale, orderable: false })).toBe(false);
//   });

//   it('marks only unavailable or zero limited-stock variants as sold out', () => {
//     const [preorderProduct, limitedProduct] = sale.products;

//     expect(isVariantSoldOut(preorderProduct, preorderProduct.variants[0])).toBe(
//       false
//     );
//     expect(isVariantSoldOut(limitedProduct, limitedProduct.variants[0])).toBe(
//       true
//     );
//     expect(
//       isVariantSoldOut(limitedProduct, {
//         ...limitedProduct.variants[1],
//         available: false,
//       })
//     ).toBe(true);
//   });

//   it('calculates draft total from server-provided unit prices', () => {
//     const quantityMap: QuantityMap = {
//       10: { 11: 1 },
//       20: { 21: 2 },
//     };

//     expect(getTotalPaymentAmount(sale, quantityMap)).toBe(5000);
//   });
// });
