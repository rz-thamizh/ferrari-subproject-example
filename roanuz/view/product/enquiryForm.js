import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { FormItem } from '@/roanuz/view/input';
import { Text14 } from '@/roanuz/typopgraphy';
import { Button } from '@/roanuz/view/button';
import { ProductPreviewDisplayMode } from '@/roanuz/layout/product/preview';
import { ProductPreviewView } from './preview';

const EnquiryFormViewWrapper = styled.div`
  .section-form {
    margin-top: ${asRem(10)};
    .rz-form-item {
      margin-right: 0;
      margin-bottom: ${asRem(20)};
    }
  }
  .container {
    >.right {
      justify-content: center;
    }
  }
  .form-next-step {
    text-align: right;
  }
  .success {
    padding-top: ${asRem(15)};
    color: var(--color-active-2);
  }
  .error-msg {
    color: var(--color-error);
    font-size: ${asRem(14)};
    line-height: ${asRem(18)};
  }
`;

export const EnquiryFormView = ({
  product,
  onSave,
  saving,
  saveError,
  saveSuccess,
}) => {
  const fields = {
    name: {
      type: 'text',
      name: 'Nafn',
      id: 'name',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(3, 50),
      ]),
    },
    email: {
      type: 'email',
      name: 'Netfang',
      id: 'email',
      validateFn: Validate.all([
        Validate.required,
        Validate.email,
      ]),
    },
    msg: {
      type: 'textarea',
      name: 'Fyrirspurn',
      id: 'msg',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(1, 512),
      ]),
    },
  };

  const [formInitValue] = useState({
    email: '',
    name: '',
    msg: '',
  });
  const buildSaveInput = (values) => {
    return {
      email: values.email,
      name: values.name,
      msg: `Netfang: ${values.email} \n ${values.msg}`,
    };
  };

  const onSubmit = (values) => {
    if (onSave) {
      onSave(buildSaveInput(values));
    }
  };

  return (
    <EnquiryFormViewWrapper>
      <div className="section-preview">
        <ProductPreviewView
          product={product}
          hidePrice
          shouldLinkTitle={false}
          displayMode={ProductPreviewDisplayMode.TwoCol}
        />
      </div>
      {!saveSuccess && (
        <div className="section-form">
          <Formik
            initialValues={formInitValue}
            onSubmit={onSubmit}
            validateOnMount
          >
            {({ isValid }) => (
              <Form>
                <div>
                  <FormItem field={fields.name} />
                </div>
                <div>
                  <FormItem field={fields.email} />
                </div>
                <div>
                  <FormItem field={fields.msg} />
                </div>
                <div className="error-msg">
                  {saveError && (
                    <div>
                      Villa:
                      {saveError.message}
                    </div>
                  )}
                </div>
                <div className="form-next-step">
                  <Button
                    disabled={(!isValid) || saving}
                    mode="primary"
                    type="submit"
                    filled
                    className="button"
                    ariaLabel="Senda"
                  >
                    Senda
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
      <div>
        {saveSuccess && (
          <Text14 as="p" className="success">
            <span>Tölvupóstur hefur verið sendur</span>
          </Text14>
        )}
      </div>
    </EnquiryFormViewWrapper>
  );
};

EnquiryFormView.propTypes = {
  product: PropTypes.object.isRequired,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  saveSuccess: PropTypes.object,
};
