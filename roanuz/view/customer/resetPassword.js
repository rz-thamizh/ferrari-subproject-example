import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '@/roanuz/view/button';
import {
  DisplayBold20,
  Text16,
  DisplayBold18,
} from '@/roanuz/typopgraphy';

const ResetPasswordViewWrapper = styled.div`
  padding-top: ${asRem(30)};
  h1 {
    padding: ${asRem(18)} 0;
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    h1 {
      font-size: ${asRem(24)};
      line-height: ${asRem(37)};
    }

    .title {
      font-size: ${asRem(30)};
      line-height: ${asRem(37)};
    }
  }

  .field-text {
    margin-bottom: ${asRem(18)};

    @media screen and (min-width: ${Breakpoint.sm}) {
      font-size: ${asRem(18)};
      line-height: ${asRem(26)};
    }
  }

  .rz-col {
    h1 {
      padding-top: 0;
    }
  }

  >.rz-page-content {
    display: block;
    padding-left: 0;
    padding-right: 0;
    
    @media screen and (min-width: ${Breakpoint.sm}) {
      display: flex;
      justify-content: space-between;
    }

    >.page-section-main {
      .forgot-password {
        cursor: pointer;
        text-decoration: none;
      }

      @media screen and (min-width: ${Breakpoint.sm}) {
        width: ${asRem(380)};     
      }

      @media screen and (min-width: ${Breakpoint.md}) {
        width: ${asRem(480)};      
      }
      .button {
        width: 100%;
        justify-content: center;

        @media screen and (min-width: ${Breakpoint.sm}) {
          width: auto;      
        }
      }
    }
  }

  .rz-row {
    .rz-form-item {
      flex: 1;
    }
  }

  .form-next-step {
    margin: ${asRem(15)} 0 ${asRem(5)};
    text-align: center;

    @media screen and (min-width: ${Breakpoint.sm}) {
      text-align: left;   
    }
  }
`;

export const ResetPasswordView = ({
  onResetPassword,
  saving, saveError,
  isB2bCustomer,
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

  return (
    <ResetPasswordViewWrapper>
      <DisplayBold20 as="h1" className="title">
        {isB2bCustomer ? 'Endurstilla lykilorð' : 'Gleymt lykilorð?'}
      </DisplayBold20>
      <Row className="rz-page-content">
        <Col className="page-section-main">
          <FormWrapperStyle>
            <Text16 className="field-text">Vinsamlegast sláið inn netfangið þitt til að endurstilla lykilorðið</Text16>
            <Formik
              initialValues={formInitValue}
              onSubmit={async (values, { resetForm }) => {
                await onResetPassword(buildSaveInput(values));
                resetForm();
              }}
              validateOnMount
            >
              {({ isValid }) => (
                <Form>
                  <div>
                    <FormItem field={fields.email} />
                  </div>
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
                      disabled={(!isValid) || saving}
                      mode="primary"
                      type="submit"
                      filled
                      className="button"
                      ariaLabel="Login"
                    >
                      <DisplayBold18 as="span">
                        Endurstilla lykilorð
                      </DisplayBold18>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </FormWrapperStyle>
        </Col>
      </Row>
    </ResetPasswordViewWrapper>
  );
};

ResetPasswordView.propTypes = {
  onResetPassword: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
  isB2bCustomer: PropTypes.bool,
};
