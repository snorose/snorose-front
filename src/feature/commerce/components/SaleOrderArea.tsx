import SaleClosedSection from '@/feature/commerce/components/SaleClosedSection';
import { SaleResponse } from '@/feature/commerce/types';
import {
  getSaleUnavailableMessage,
  getSaleUnavailableTitle,
} from '@/feature/commerce/utils/commerceRules';

type SaleOrderAreaProps = {
  sale: SaleResponse;
  children: React.ReactNode;
};

export function SaleOrderArea({ sale, children }: SaleOrderAreaProps) {
  if (sale.status === 'CLOSED') {
    return (
      <SaleClosedSection
        sale={sale}
        title={getSaleUnavailableTitle(sale)}
        message={getSaleUnavailableMessage(sale)}
      />
    );
  }

  return <>{children}</>;
}
