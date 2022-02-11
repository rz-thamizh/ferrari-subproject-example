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
  DisplayBold18,
} from '@/roanuz/typopgraphy';

const NewPasswordViewWrapper = styled.div`
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

  .error-message {
    color: var(--color-error);
  }
`;

export const NewPasswordView = ({
  onSetNewPassword,
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
    newPassword: {
      type: 'password',
      name: 'Nýtt Lykilorð',
      id: 'newPassword',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(4, 50),
      ]),
    },
    confirmPassword: {
      type: 'password',
      name: 'Staðfesta lykilorð',
      id: 'confirmPassword',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(4, 50),
      ]),
    },
  };

  const [formInitValue] = useState({
    newPassword: '',
    email: '',
  });

  const buildSaveInput = (values) => {
    return {
      email: values.email,
      newPassword: values.newPassword,
    };
  };

  const onSubmit = (values) => {
    if (onSetNewPassword) {
      onSetNewPassword(buildSaveInput(values));
    }
  };

  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [isPasswordMatchError, setIsPasswordMatchError] = useState('');

  const validatePasswordsMatch = (values) => {
    const pass = values.newPassword;
    const confirm = values.confirmPassword;
    if (pass && confirm) {
      if (pass !== confirm) {
        setIsPasswordMatch(false);
        setIsPasswordMatchError('Vinsamlegast sláið inn sama lykilorðið í báða reitina');
      } else {
        setIsPasswordMatch(true);
        setIsPasswordMatchError('');
      }
    }
  };

  return (
    <NewPasswordViewWrapper>
      <DisplayBold20 as="h1" className="title">Stilltu nýtt lykilorð</DisplayBold20>
      <Row className="rz-page-content">
        <Col className="page-section-main">
          <FormWrapperStyle>
            <Formik
              initialValues={formInitValue}
              onSubmit={isPasswordMatch ? onSubmit : null}
              validateOnMount
            >
              {({ isValid, values }) => (
                <Form>
                  <div>
                    <FormItem field={fields.email} />
                  </div>
                  <div>
                    <FormItem field={fields.newPassword} />
                  </div>
                  <div>
                    <FormItem field={fields.confirmPassword} />
                  </div>
                  <div className="error-message">
                    {saveError && (
                      <div>
                        Villa:
                        {saveError.message}
                      </div>
                    )}
                    {isPasswordMatchError && (
                      <div>
                        Villa:
                        {isPasswordMatchError}
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
                      onClick={() => validatePasswordsMatch(values)}
                    >
                      <DisplayBold18 as="span">
                        Stilltu nýtt lykilorð
                      </DisplayBold18>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </FormWrapperStyle>
        </Col>
      </Row>
    </NewPasswordViewWrapper>
  );
};

NewPasswordView.propTypes = {
  onSetNewPassword: PropTypes.func,
  saving: PropTypes.bool,
  saveError: PropTypes.object,
};
