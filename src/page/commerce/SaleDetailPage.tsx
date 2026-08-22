import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  BackAppBar,
  Carousel,
  CheckBox,
  DimModalLayout,
  Label,
  NumberInput,
  PrimaryButton,
} from '@/shared/component';
import { useAuth } from '@/shared/hook';
import { DateTime, formatNumber } from '@/shared/lib';

import type { Sale } from '@/feature/commerce/types';

import ProductCard from '@/page/commerce/ProductCard';

import { taskCompleteIllustration } from '@/assets/illustrations';

import { sale } from '@/dummy/data/sale';

import styles from './SaleDetailPage.module.css';

type QuantityMap = Partial<Record<number, Partial<Record<number, number>>>>;

type ProductOptionItem = {
  product: Sale['products'][number];
  variant: Sale['products'][number]['variants'][number];
  quantity: number;
  isSoldOut: boolean;
};

type SelectedOrderItem = Omit<ProductOptionItem, 'isSoldOut'>;

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

          <section className={styles.paymentSection}>
            <div className={styles.totalPayment}>
              <span className={styles.totalPaymentLabel}>총 결제 금액</span>
              <strong className={styles.totalPaymentAmount}>
                {formatNumber(totalPaymentAmount)}원
              </strong>
            </div>

            <ul className={styles.paymentNoticeList}>
              <li>주문 후 안내되는 학생단체 계좌로 직접 입금합니다.</li>
              <li>입금 확인 전까지만 구매자가 취소할 수 있습니다.</li>
              <li>배송 없이 지정 장소에서 수령합니다.</li>
            </ul>

            <PrimaryButton
              className={styles.purchaseButton}
              disabled={isPurchaseButtonDisabled}
              onClick={handlePurchaseClick}
            >
              구매 결정하기
            </PrimaryButton>
          </section>
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
          onClose={() => setIsPaymentModalOpen(false)}
        />
      )}
    </div>
  );
}

function OrderConfirmModal({
  sale,
  selectedOrderItems,
  totalPaymentAmount,
  phoneNumber,
  onClose,
}: {
  sale: Sale;
  selectedOrderItems: SelectedOrderItem[];
  totalPaymentAmount: number;
  phoneNumber: string;
  onClose: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) return;

    const updateScrollHint = () => {
      const hasOverflow = content.scrollHeight > content.clientHeight;
      const isScrolledToBottom =
        content.scrollTop + content.clientHeight >= content.scrollHeight - 1;

      setHasMoreContent(hasOverflow && !isScrolledToBottom);
    };

    updateScrollHint();
    window.addEventListener('resize', updateScrollHint);

    return () => window.removeEventListener('resize', updateScrollHint);
  }, [selectedOrderItems, totalPaymentAmount, phoneNumber]);

  return (
    <DimModalLayout>
      <div
        className={`${styles.accountModal} ${
          hasMoreContent ? styles.accountModalScrollHint : ''
        }`}
        role='dialog'
        aria-modal='true'
        aria-labelledby='orderConfirmModalTitle'
      >
        <div
          ref={contentRef}
          className={styles.accountModalContent}
          onScroll={() => {
            const content = contentRef.current;

            if (!content) return;

            setHasMoreContent(
              content.scrollTop + content.clientHeight <
                content.scrollHeight - 1
            );
          }}
        >
          <h3 id='orderConfirmModalTitle' className={styles.accountModalTitle}>
            주문 전 확인
          </h3>

          <section className={styles.orderConfirmSection}>
            <h4 className={styles.orderConfirmSectionTitle}>주문 상품</h4>
            <ul className={styles.orderConfirmProductList}>
              {selectedOrderItems.map(({ product, variant, quantity }) => (
                <li
                  className={styles.orderConfirmProductItem}
                  key={`${product.productId}-${variant.variantId}`}
                >
                  <div className={styles.orderConfirmProductInfo}>
                    <strong>{product.name}</strong>
                    <span className={styles.orderConfirmProductDivider}>·</span>
                    <span>{variant.optionName}</span>
                  </div>
                  <div className={styles.orderConfirmProductSummary}>
                    <span>{quantity}개</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.orderConfirmSection}>
            <h4 className={styles.orderConfirmSectionTitle}>주문 정보</h4>
            <dl className={styles.accountInfoList}>
              <div className={styles.accountInfoItem}>
                <dt>총액</dt>
                <dd>{formatNumber(totalPaymentAmount)}원</dd>
              </div>
              <div className={styles.accountInfoItem}>
                <dt>연락처</dt>
                <dd>{phoneNumber}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.orderConfirmSection}>
            <h4 className={styles.orderConfirmSectionTitle}>입금 안내</h4>
            <dl className={styles.accountInfoList}>
              <div className={styles.accountInfoItem}>
                <dt>계좌번호</dt>
                <dd>{sale.bank.accountNumber}</dd>
              </div>
              <div className={styles.accountInfoItem}>
                <dt>은행</dt>
                <dd>{sale.bank.bankName}</dd>
              </div>
              <div className={styles.accountInfoItem}>
                <dt>예금주</dt>
                <dd>{sale.bank.accountHolder}</dd>
              </div>
            </dl>
          </section>

          <ul className={styles.orderConfirmNoticeList}>
            <li>주문 후 안내되는 학생단체 계좌로 직접 입금합니다.</li>
            <li>입금 확인 전까지만 구매자가 취소할 수 있습니다.</li>
            <li>배송 없이 지정 장소에서 수령합니다.</li>
          </ul>
        </div>

        <button
          type='button'
          className={styles.accountModalButton}
          onClick={onClose}
        >
          확인했어요
        </button>
      </div>
    </DimModalLayout>
  );
}

function isClosedSale(closesAt: string) {
  const closesAtTime = new Date(closesAt).getTime();

  return Number.isFinite(closesAtTime) && closesAtTime <= Date.now();
}

function ProductCarouselSection({ sale }: { sale: Sale }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const carouselItems = sale.products.flatMap((product) => {
    const imageUrls = product.imageUrls.length > 0 ? product.imageUrls : [''];

    return imageUrls.map((imageUrl) => ({
      product,
      imageUrl,
    }));
  });

  const activeItem = carouselItems[activeIndex] ?? carouselItems[0];

  if (!activeItem) return null;

  return (
    <section>
      <Carousel
        className={styles.productCarousel}
        items={carouselItems}
        renderItem={(item) => (
          <ProductCard
            src={item.imageUrl}
            alt={item.product.name ?? sale.title}
          />
        )}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={false}
      />
      <div className={styles.productInfo}>
        <h2 className={styles.productName}>{activeItem.product.name}</h2>
        <p className={styles.productDescription}>
          {activeItem.product.description}
        </p>
      </div>
    </section>
  );
}

function OrdererInfoSection({
  phoneNumber,
  setPhoneNumber,
  isOrdererInfoConsentChecked,
  setIsOrdererInfoConsentChecked,
}: {
  phoneNumber: string;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  isOrdererInfoConsentChecked: boolean;
  setIsOrdererInfoConsentChecked: Dispatch<SetStateAction<boolean>>;
}) {
  const { userInfo, status } = useAuth();

  const ordererName = status === 'loading' ? '불러오는 중' : userInfo?.userName;
  const studentNumber =
    status === 'loading' ? '불러오는 중' : userInfo?.studentNumber;

  return (
    <section className={styles.ordererSection}>
      <h2 className={styles.sectionTitle}>주문자 정보</h2>

      <div className={styles.ordererInfo}>
        <div className={styles.readonlyFieldList}>
          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>이름</span>
            <span className={styles.readonlyValue}>{ordererName ?? '-'}</span>
          </div>

          <div className={styles.readonlyField}>
            <span className={styles.readonlyLabel}>학번</span>
            <span className={styles.readonlyValue}>{studentNumber ?? '-'}</span>
          </div>
        </div>

        <div className={styles.phoneField}>
          <Label htmlFor='phoneNumber' required>
            전화번호
          </Label>
          <NumberInput
            id='phoneNumber'
            placeholder='- 제외 숫자만 입력'
            value={phoneNumber}
            onChange={setPhoneNumber}
            maxLength={11}
          />
        </div>

        <div className={styles.consentField}>
          <CheckBox
            id='ordererInfoConsent'
            checked={isOrdererInfoConsentChecked}
            onChange={(next) => setIsOrdererInfoConsentChecked(next)}
          />
          <label className={styles.consentLabel} htmlFor='ordererInfoConsent'>
            주문 확인과 수령 연락을 위해 이름·학번·연락처·주문 상품을 이 판매의
            승인된 운영자에게 제공하는 데 동의합니다.
          </label>
        </div>
      </div>
    </section>
  );
}

function ProductOptionSection({
  sale,
  quantityMap,
  setQuantityMap,
}: {
  sale: Sale;
  quantityMap: QuantityMap;
  setQuantityMap: Dispatch<SetStateAction<QuantityMap>>;
}) {
  const remainingQuantityByProductId = useMemo(() => {
    const result: Partial<Record<number, number | null>> = {};

    sale.products.forEach((product) => {
      if (product.maxPerBuyer === null) {
        result[product.productId] = null;
        return;
      }

      const totalQuantityByProductId = Object.values(
        quantityMap[product.productId] ?? {}
      ).reduce((sum, quantity) => sum + quantity, 0);

      result[product.productId] = Math.max(
        product.maxPerBuyer - totalQuantityByProductId,
        0
      );
    });

    return result;
  }, [sale.products, quantityMap]);

  const handleQuantityChange = (
    productId: number,
    variantId: number,
    nextQuantity: number
  ) => {
    setQuantityMap((prev) => {
      const currentQuantity = prev[productId]?.[variantId] ?? 0;
      const quantityDiff = nextQuantity - currentQuantity;
      const remainingQuantity = remainingQuantityByProductId[productId];

      if (remainingQuantity !== null && remainingQuantity < quantityDiff) {
        return prev;
      }

      const product = sale.products.find(
        (product) => product.productId === productId
      );
      const variant = product?.variants.find(
        (variant) => variant.variantId === variantId
      );
      const availableQuantity = variant.availableQuantity;

      if (
        availableQuantity !== null &&
        availableQuantity !== undefined &&
        nextQuantity > availableQuantity
      ) {
        return prev;
      }

      const nextProductQuantities = { ...(prev[productId] ?? {}) };

      if (nextQuantity <= 0) {
        nextProductQuantities[variantId] = 0;
      } else {
        nextProductQuantities[variantId] = nextQuantity;
      }

      return {
        ...prev,
        [productId]: nextProductQuantities,
      };
    });
  };

  const productOptionItems: ProductOptionItem[] = sale.products.flatMap(
    (product) =>
      product.variants.map((variant) => {
        return {
          product,
          variant,
          quantity: quantityMap[product.productId]?.[variant.variantId] ?? 0,
          isSoldOut: variant.availableQuantity === 0,
        };
      })
  );

  return (
    <section>
      <h2 className={styles.sectionTitle}>옵션/수량</h2>

      <div className={styles.optionList}>
        {productOptionItems.map(({ product, variant, quantity, isSoldOut }) => (
          <div
            className={`${styles.optionItem} ${
              isSoldOut ? styles.optionItemSoldOut : ''
            }`}
            key={`${product.productId} - ${variant.variantId}`}
          >
            <div className={styles.optionInfo}>
              <div className={styles.optionName}>
                {product.name} · {variant.optionName}
              </div>
              <div className={styles.optionMeta}>
                {formatNumber(variant.unitPrice)}원
              </div>
            </div>

            {isSoldOut && <span className={styles.soldOutBadge}>품절</span>}
            {!isSoldOut && (
              <div className={styles.quantityControl}>
                <button
                  type='button'
                  className={styles.quantityButton}
                  aria-label={`${product.name} ${variant.optionName} 수량 감소`}
                  disabled={quantity === 0}
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      variant.variantId,
                      quantity - 1
                    )
                  }
                >
                  -
                </button>

                <span className={styles.quantity}>{quantity}</span>

                <button
                  type='button'
                  className={styles.quantityButton}
                  aria-label={`${product.name} ${variant.optionName} 수량 증가`}
                  disabled={
                    remainingQuantityByProductId[product.productId] === 0 ||
                    (variant.availableQuantity !== null &&
                      quantity >= variant.availableQuantity)
                  }
                  onClick={() =>
                    handleQuantityChange(
                      product.productId,
                      variant.variantId,
                      quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SaleClosedSection({ sale }: { sale: Sale }) {
  return (
    <section className={styles.closedSection} aria-labelledby='saleClosedTitle'>
      <img
        src={taskCompleteIllustration}
        alt=''
        aria-hidden='true'
        className={styles.closedIllustration}
      />

      <h2 id='saleClosedTitle' className={styles.closedTitle}>
        판매가 마감되었어요
      </h2>
      <p className={styles.closedDescription}>
        이 상품은 새 주문을 받을 수 없어요. 기존 주문과 수령 안내는 판매자의
        공지를 확인해주세요.
      </p>

      <dl className={styles.closedInfoList}>
        <div className={styles.closedInfoItem}>
          <dt>마감일</dt>
          <dd>{DateTime.format(sale.closesAt, 'YMD_HM')}</dd>
        </div>
        <div className={styles.closedInfoItem}>
          <dt>수령 방식</dt>
          <dd>{sale.pickup.instructions}</dd>
        </div>
        <div className={styles.closedInfoItem}>
          <dt>판매자</dt>
          <dd>{sale.sellerName}</dd>
        </div>
      </dl>
    </section>
  );
}

function SaleClosedModal({ onClose }: { onClose: () => void }) {
  return (
    <DimModalLayout>
      <div
        className={styles.accountModal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='saleClosedModalTitle'
      >
        <div className={styles.accountModalContent}>
          <h3 id='saleClosedModalTitle' className={styles.accountModalTitle}>
            판매가 마감되었어요
          </h3>
          <p className={styles.saleClosedModalDescription}>
            이 상품은 새 주문을 받을 수 없어요. 기존 주문과 수령 안내는 판매자의
            공지를 확인해주세요.
          </p>
        </div>

        <button
          type='button'
          className={styles.accountModalButton}
          onClick={onClose}
        >
          확인
        </button>
      </div>
    </DimModalLayout>
  );
}
