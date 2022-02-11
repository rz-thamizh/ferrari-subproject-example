import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SiminnImage from '@/roanuz/view/imgs/PaymentMethodSimminLett.png';
import {
  formatCurrency as fc,
  formatPercentage as fp,
} from '@/roanuz/lib/cart';
import {
  DisplayBold20,
  LabelMedium12,
  Text12,
} from '@/roanuz/typopgraphy';
import { Button } from '@/roanuz/view/button';
import { SiminnLoanOptionsDailogView } from '@/roanuz/view/product/siminnLoanOptionsDailogVIew';
import { ImageView } from '../image';

export const SiminnLoanOptions = ({
  loading, options, product,
}) => {
  const [selectedOption, setSelectedOption] = useState(options.recommended);
  const [showAllOptions, setShowAllOptions] = useState(false);

  useEffect(() => {
    setSelectedOption(options.recommended);
  }, [options]);

  if (!loading && !selectedOption) {
    return null;
  }

  const messages = (option) => {
    return [
      `Á mánuði í ${option.loanLengthInMonths} mánuði á ${fp(option.interestRate)} vöxtum.`,
      `Lántökugjald ${fp(option.disbursementFeePercentage)} og greiðslugjald ${fc(option.paymentFeePerPayment)}.`,
      `Heildargreiðsla: ${fc(option.totalRepayment)}.`,
      `Árleg hlutfallstala kostnaðar: ${fp(option.yearlyCostRatio)}.`,
    ];
  };

  // const onOptionSelect = (option) => {
  //   setSelectedOption(option);
  //   if (onSelect) {
  //     onSelect(option);
  //   }
  // };

  return (
    <>
      <div className="brand">
        <ImageView src={SiminnImage} alt="Siminn Logo" />
      </div>
      {loading && (
        <div>Hleð...</div>
      )}
      {!loading && (
        <>
          <SiminnLoanOptionsDailogView
            SiminnImage={SiminnImage}
            showAllOptions={showAllOptions}
            product={product}
            options={options}
            selectedOption={selectedOption}
            setShowAllOptions={setShowAllOptions}
          />
          <div className="recommended">
            <div
              className="amount-section"
            >
              <div className="amount">
                <DisplayBold20 as="span" className="amount-part">
                  {fc(selectedOption.averagePaymentAmount)}
                </DisplayBold20>
                <LabelMedium12 as="span" className="month-part">
                  /mán
                </LabelMedium12>
              </div>
            </div>
            <div className="desc-section">
              <Text12>
                {messages(selectedOption).join(' ')}
              </Text12>
              <Button
                mode="primary"
                filled
                onClick={() => setShowAllOptions(true)}
                onKeyDown={() => setShowAllOptions(true)}
                ariaLabel="Nánar"
              >
                Nánar
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

SiminnLoanOptions.propTypes = {
  loading: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
};
