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
  DisplayMedium20,
  Text16,
  TextBold14,
  DisplayBold18,
} from '@/roanuz/typopgraphy';
import Link from 'next/link';

const LoginAccountViewWrapper = styled.div`
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
        display: inline-block;
        margin-top: ${asRem(16)};
        cursor: pointer;
        text-decoration: none;
      }

      @media screen and (min-width: ${Breakpoint.sm}) {
        width: ${asRem(380)};     
      }

      @media screen and (min-width: ${Breakpoint.md}) {
        width: ${asRem(480)};      
      }
      .rz-button {
        width: 100%;
        justify-content: center;
        padding: ${asRem(10)} ${asRem(24)};

        @media screen and (min-width: ${Breakpoint.sm}) {
          width: auto;      
        }
      }
    }
    >.page-section-quick-links {
      margin-top: ${asRem(40)};      

      @media screen and (min-width: ${Breakpoint.sm}) {
        margin-top: 0;      
      }

      a {
        text-decoration: none;
        color: var(--color-text-rev);

        button {
          width: 100%;
          justify-content: center;
          padding: ${asRem(10)} ${asRem(24)};

          @media screen and (min-width: ${Breakpoint.sm}) {
            width: auto;      
          }
        }
      }

      @media screen and (min-width: ${Breakpoint.sm}) {
        width: ${asRem(320)};      
      }
      @media screen and (min-width: ${Breakpoint.md}) {
        width: ${asRem(480)};      
      }

      h4 {
        padding-bottom: ${asRem(10)};
      }
    }
  }

  .rz-row {
    .rz-form-item {
      flex: 1;
    }
  }

  .form-next-step {
    margin-top: ${asRem(38)};
    text-align: center;

    @media screen and (min-width: ${Breakpoint.sm}) {
      text-align: left;   
    }
  }

  .error-message {
    color: var(--color-error);
  }
`;

export const LoginAccountView = ({
  onSave,
  saving, saveError,
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
    password: {
      type: 'password',
      name: 'Lykilorð',
      id: 'password',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(4, 50),
      ]),
    },
  };

  const [formInitValue] = useState({
    email: '',
    password: '',
  });

  const buildSaveInput = (values) => {
    return {
      email: values.email,
      password: values.password,
    };
  };

  const onSubmit = (values) => {
    if (onSave) {
      onSave(buildSaveInput(values));
    }
  };

  return (
    <LoginAccountViewWrapper>
      <DisplayBold20 as="h1" className="title">Innskráning viðskiptavinar</DisplayBold20>
      <Row className="rz-page-content">
        <Col className="page-section-main">
          <FormWrapperStyle>
            <DisplayMedium20 as="h1">Skráðir viðskiptavinir</DisplayMedium20>
            <Text16 className="field-text">Ef þú ert nú þegar með aðgang getur þú skráð þig inn með netfangi.</Text16>
            <Formik
              initialValues={formInitValue}
              onSubmit={onSubmit}
              validateOnMount
            >
              {({ isValid }) => (
                <Form>
                  <div>
                    <FormItem field={fields.email} />
                  </div>
                  <div>
                    <FormItem field={fields.password} />
                  </div>
                  <div className="error-message">
                    {saveError && (
                      <div>
                        Villa:
                        {saveError.message}
                      </div>
                    )}
                  </div>
                  <Link href="/customer/account/reset-password/">
                    <TextBold14 as="a" alt="Goto Reset Password" className="forgot-password">
                      Gleymt lykilorð?
                    </TextBold14>
                  </Link>
                  <div className="form-next-step">
                    <Button
                      disabled={(!isValid) || saving}
                      mode="primary"
                      type="submit"
                      filled
                      ariaLabel="Login"
                    >
                      <DisplayBold18 as="span">
                        Innskráning
                      </DisplayBold18>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </FormWrapperStyle>
        </Col>
        <Col className="page-section-quick-links">
          <FormWrapperStyle>
            <DisplayMedium20 as="h1">Nýir viðskiptavinir</DisplayMedium20>
            <Text16 className="field-text">
              Með því að stofna aðgang getur þú klárað vefkaup hraðar,
              haldið utan um mörg heimilisföng, fylgst með stöðu pantana og fleira.
            </Text16>
            <div className="form-next-step">
              <Link href="/customer/account/create/">
                <a>
                  <Button
                    mode="primary"
                    filled
                  >
                    <DisplayBold18 as="span">
                      Búa til aðgang
                    </DisplayBold18>
                  </Button>
                </a>
              </Link>
            </div>
          </FormWrapperStyle>
        </Col>
      </Row>
    </LoginAccountViewWrapper>
  );
};

LoginAccountView.propTypes = {
  onSave: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
};
