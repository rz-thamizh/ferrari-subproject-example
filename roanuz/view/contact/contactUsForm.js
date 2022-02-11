import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '@/roanuz/view/button';
import {
  DisplayBold18, TextBold16, Text16,
} from '@/roanuz/typopgraphy';
import { Row } from '@/roanuz/layout';
import Config, { Websites } from '@/config';

const ContactUsFormWrapper = styled(FormWrapperStyle)`
  >p {
    margin-bottom: ${asRem(20)};
  }
  .rz-form-item {
    width: 100%;
  }
  .success {
    color: var(--color-active-2);
    padding-bottom: ${asRem(16)};
  }

  >.hide-help-text {
    display: none;
  }

  >.page-title {
    font-weight: bold;
  }
`;

export const ContactUsFormView = ({
  onContactSubmission, saveError, saving, saveSuccess,
}) => {
  const fields = {
    fullname: {
      type: 'text',
      name: 'Nafn',
      id: 'fullname',
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
    telephone: {
      type: 'text',
      name: 'Símanúmer',
      id: 'telephone',
      validateFn: Validate.all([
        Validate.required,
        Validate.telephone,
        // Validate.lengthMinMax(11, 11, { message: 'Vinsamlegast sláið inn löglegt símanúmer' }),
      ]),
    },
    message: {
      type: 'textarea',
      name: 'Skilaboð',
      id: 'message',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(1, 512),
      ]),
    },
  };

  const [formInitValue] = useState({
    fullname: '',
    email: '',
    telephone: '',
    message: '',
  });

  return (
    <ContactUsFormWrapper>
      <TextBold16 className="page-title">Skrifaðu okkur</TextBold16>
      <Text16 className={Config.WebsiteKey === Websites.ATT ? 'hide-help-text' : null}>
        Sendu okkur upplýsingarnar þínar ásamt fyrirspurn og við höfum
        samband eins fljótt og hægt er.
      </Text16>
      <Formik
        initialValues={formInitValue}
        onSubmit={async (values, { resetForm }) => {
          await onContactSubmission(values);
          resetForm();
        }}
        validateOnMount
      >
        {({ isValid }) => (
          <Form>
            <Row>
              <FormItem field={fields.fullname} />
            </Row>
            <Row>
              <FormItem field={fields.email} />
            </Row>
            <Row>
              <FormItem field={fields.telephone} />
            </Row>
            <Row>
              <FormItem field={fields.message} />
            </Row>
            <div>
              {saveError && (
                <div>
                  Villa:
                  {saveError.message}
                </div>
              )}
            </div>
            <div>
              {saveSuccess && (
                <TextBold16 as="p" className="success">
                  <span>Tölvupóstur hefur verið sendur</span>
                </TextBold16>
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
                <DisplayBold18 as="span">
                  Senda
                </DisplayBold18>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </ContactUsFormWrapper>
  );
};

ContactUsFormView.propTypes = {
  onContactSubmission: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  saveSuccess: PropTypes.object,
};
