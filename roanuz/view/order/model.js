import Config from '@/config';

export function parseShippingMethodTax(taxes) {
  const shippingTaxLabel = taxes.find((tax) => {
    if ((tax.label || tax.title) === Config.DefaultShippingTaxLabel) {
      return tax;
    }
    return null;
  });

  const shipingMethodTaxCharge = (shippingTaxLabel ? shippingTaxLabel.amount.value : 0);

  return {
    shipingMethodTaxCharge,
  };
}
