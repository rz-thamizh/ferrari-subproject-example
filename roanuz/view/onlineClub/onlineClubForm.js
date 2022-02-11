import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '@/roanuz/view/button';
import {
  DisplayBold18, Text16,
} from '@/roanuz/typopgraphy';
import { DailogView } from '@/roanuz/view/dialog';
import { Row } from '@/roanuz/layout';
import Config from '@/config';

const OnlineClubFormWrapper = styled(FormWrapperStyle)`
  .rz-form-item {
    width: 100%;
  }
  
  p {
    margin-bottom: ${asRem(10)};
  }
  
  form {
    padding: ${asRem(15)} 0;
    
    .error-msg {
      color: var(--color-error);
      >div {
        margin-bottom: ${asRem(10)};
      }
    }
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    flex: 50% 1;
  }
`;

export const OnlineClubFormView = ({
  onSave,
  saveError,
  popup,
  onPopupClose,
}) => {
  const fields = {
    email: {
      type: 'email',
      name: 'Netfang',
      id: 'email',
      validateFn: Validate.all([
        Validate.required,
        Validate.email,
      ]),
    },
  };

  const [formInitValue] = useState({
    email: '',
  });

  const buildSaveInput = (values) => {
    return {
      email: values.email,
    };
  };

  const siteName = {
    att: 'Att',
    tl: 'Tölvulistans',
    rl: 'Rafland',
    kg: 'Kúnígúnd',
    ht: 'Heimilistæki',
    by: 'Byggt og búið',
  };

  return (
    <OnlineClubFormWrapper>
      <DailogView
        titleText="Takk fyrir aðð skrá þig á póstlistann!"
        showClose
        onClose={onPopupClose}
        show={popup}
        containerWidth="400px"
      >
        <div>Þú færð tölvupóst innan skamms</div>
      </DailogView>
      <Text16 as="p">
        {`Skráðu þig í netklúbb ${siteName[Config.WebsiteKey]}.
        Netklúbbsfélagar ${siteName[Config.WebsiteKey]} fá reglulega
        sértilboð auk þess að fá forskot á fréttir af uppákomum,
        leikjum og spennandi tilboðum.`}
      </Text16>
      <Formik
        initialValues={formInitValue}
        onSubmit={async (values, { resetForm }) => {
          await onSave(buildSaveInput(values));
          resetForm();
        }}
        validateOnMount
      >
        {({ isValid }) => (
          <Form>
            <Row>
              <FormItem field={fields.email} />
            </Row>
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
                disabled={(!isValid)}
                mode="primary"
                type="submit"
                filled
                className="button"
                ariaLabel="Senda"
              >
                <DisplayBold18 as="span">
                  Skrá
                </DisplayBold18>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <Text16 as="p">
        Netklúbbsfélagar fá send sértilboð mánaðarlega sem ekki bjóðast öðrum viðskiptavinum.
      </Text16>
    </OnlineClubFormWrapper>
  );
};

OnlineClubFormView.propTypes = {
  onSave: PropTypes.func,
  onPopupClose: PropTypes.func,
  popup: PropTypes.bool,
  saveError: PropTypes.object,
};
