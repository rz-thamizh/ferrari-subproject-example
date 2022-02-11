import React, { useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  TextMedium16, Text14,
} from '@/roanuz/typopgraphy';
import Validate from '@/roanuz/lib/validate';
import { FormItem } from '@/roanuz/view/input';
import { asRem } from '@/roanuz/lib/css';
import { Formik, Form } from 'formik';
import { Button } from '../button';

const StockAlertViewWrapper = styled.div`
>.desc-section {
  p {
    padding-bottom: ${asRem(8)};
  }
}
>.form-section {
  padding-top: ${asRem(12)};
  padding-bottom: ${asRem(20)};
}
`;

export const StockAlertView = ({
  product,
  saving,
  saveError,
  onSubmit,
}) => {
  const [initValue] = useState({ email: '' });
  return (
    <StockAlertViewWrapper>
      <div className="desc-section">
        <TextMedium16>
          Fáðu tölvupóst þegar varan er komin aftur á lager
        </TextMedium16>
        <Text14>
          Varan er því miður ekki til.
          Skráðu netfangið þitt og þú færð tölvupóst þegar
          hún lendir hjá okkur
          {saveError}
        </Text14>
      </div>
      <div className="form-section">
        <Formik
          initialValues={initValue}
          onSubmit={(values) => onSubmit(values.email)}
        >
          {({ isValid }) => (
            <Form>
              <FormItem
                field={{
                  name: 'Netfang',
                  id: 'email',
                  validateFn: Validate.all([
                    Validate.required,
                    Validate.email,
                  ], { message: 'Enter Netfang' }),
                  action: (
                    <Button
                      mode="link"
                      type="submit"
                      disabled={saving || (!isValid)}
                      ariaLabel="Senda"
                    >
                      Senda
                    </Button>
                  ),
                }}
              />
              {saveError && (
                <div>
                  Villa:
                  {saveError.message}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </StockAlertViewWrapper>
  );
};

StockAlertView.propTypes = {
  product: PropTypes.object.isRequired,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};
