import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DisplayBold24, DisplayBold18 } from '@/roanuz/typopgraphy';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Button } from '../button';
import { FormItem } from '../input';

const NewsLetterViewWrapper = styled.div`
.type-checkbox {
  padding-left: 0;
}
.form-next-step {
  margin-top: ${asRem(40)};
  .button {
    width: 100%;
    display: flex;
    justify-content: center;
    @media screen and (min-width: ${Breakpoint.sm}) {
      display: block;
      width: auto;

      span {
        margin: 0;
      }
    }
  }
}
`;

export const NewsLetterView = ({
  onSave,
  saveError,
  data,
}) => {
  const initialData = data && data.customer && data.customer.is_subscribed;

  const fields = {
    subscribed: {
      type: 'checkbox',
      name: 'Almenn skráning',
      id: 'subscribed',
    },
  };

  const buildSaveInput = (values) => {
    return {
      is_subscribed: values.subscribed,
    };
  };

  const onSubmit = (values) => {
    if (onSave) {
      onSave(buildSaveInput(values));
    }
  };

  const [formInitValue] = useState({
    subscribed: initialData,
  });

  return (
    <NewsLetterViewWrapper>
      <DisplayBold24>Póstlistaskráningar</DisplayBold24>
      <Formik
        initialValues={formInitValue}
        onSubmit={onSubmit}
      >
        <Form>
          <FormItem field={fields.subscribed} />
          <div>
            {saveError && (
              <div>
                Villa:
                {saveError.message}
              </div>
            )}
          </div>
          <div className="form-next-step">
            <Button
              mode="primary"
              type="submit"
              large
              filled
              className="button"
              ariaLabel={initialData ? 'Afskrá' : 'Skrá'}
            >
              <DisplayBold18 as="span">
                {initialData ? 'Afskrá' : 'Skrá'}
              </DisplayBold18>
            </Button>
          </div>
        </Form>
      </Formik>
    </NewsLetterViewWrapper>
  );
};

NewsLetterView.propTypes = {
  onSave: PropTypes.func,
  saveError: PropTypes.object,
  data: PropTypes.object,
};
