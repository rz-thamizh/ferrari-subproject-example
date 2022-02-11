/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '@/roanuz/view/button';
import {
  DisplayBold18,
  DisplayBold20,
} from '@/roanuz/typopgraphy';
import { replaceMask, applyMask } from '../cart/model';

const EditAccountViewWrapper = styled.div`
  .container {
    @media screen and (min-width: ${Breakpoint.sm}) {
      display: flex;
    }
    
    .inner-container {
      padding: 0 ${asRem(5)};
      @media screen and (min-width: ${Breakpoint.md}) {
        width: 50%;
      }
    }
    .update-email {
      display: none;
    }
    .update-email-show {
      display: block;
    }
  }
  h1 {
    padding-top: ${asRem(18)};
    padding-bottom: ${asRem(18)};
    @media screen and (min-width: ${Breakpoint.sm}) {
      font-size: ${asRem(30)};
      line-height: ${asRem(37)};
    }    
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
  >.rz-page-content {
    display: block;
    padding: 0;
    .row {
      display: block;
      @media screen and (min-width: ${Breakpoint.sm}) {
        display: flex;
      }    
    }
  }
  .rz-row {
    .rz-form-item {
      flex: 1;

      .type-checkbox {
        padding-left: 0;

        input[type="checkbox"]::before {
          left: ${asRem(5.5)};
        }
      }
    }
  }
  .form-next-step {
    margin: ${asRem(18)} 0;
    .button {
      display: block;
      width: 100%;
      @media screen and (min-width: ${Breakpoint.sm}) {
        width: auto;
        span {
          margin: 0;
        }
      }
    }
  }
`;

export const EditAccountView = ({
  onSave, onSavePassword,
  saving, setSavingPassword, saveError, updatePasswordError, data,
}) => {
  const customerEmail = (data && data.email);
  const customerFirstName = (data && data.firstname);
  const customerLastName = (data && data.lastname);

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
    firstname: {
      type: 'text',
      name: 'Fornafn',
      id: 'firstname',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(3, 50),
      ]),
    },
    lastname: {
      type: 'text',
      name: 'Eftirnafn',
      id: 'lastname',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(1, 50),
      ]),
    },
    password: {
      type: 'password',
      name: 'Núverandi lykilorð',
      id: 'password',
      validateFn: Validate.all([
        Validate.required,
      ]),
    },
    newPassword: {
      type: 'password',
      name: 'Nýtt lykilorð',
      id: 'newPassword',
      validateFn: Validate.all([
        Validate.required,
        Validate.lengthMinMax(4, 50),
      ]),
    },
    currentPassword: {
      type: 'password',
      name: 'Núverandi lykilorð',
      id: 'currentPassword',
    },
    showEmailUpdate: {
      type: 'checkbox',
      name: 'Uppfæra netfang',
      id: 'showEmailUpdate',
    },
  };

  const [showUpdateEmail, setShowUpdateEmail] = useState(false);

  const [formInitValue] = useState({
    email: replaceMask(customerEmail || ''),
    firstname: replaceMask(customerFirstName || ''),
    lastname: replaceMask(customerLastName || ''),
    password: '',
    showEmailUpdate: showUpdateEmail,
  });
  const [formInitValuePassword] = useState({
    password: '',
    newPassword: '',
  });

  const handleEmailUpdate = () => {
    setShowUpdateEmail(!showUpdateEmail);
  };

  // Input values
  const buildSaveInput = (values) => {
    return {
      email: applyMask(values.email),
      firstname: applyMask(values.firstname),
      lastname: applyMask(values.lastname),
      password: applyMask(values.password),
    };
  };

  const buildPasswordChange = (values) => {
    return {
      currentPassword: applyMask(values.password),
      newPassword: applyMask(values.newPassword),
    };
  };

  // submit event
  const onSubmit = (values) => {
    if (onSave) {
      onSave(buildSaveInput(values));
    }
  };

  const onSubmitPassword = (values) => {
    if (onSavePassword) {
      onSavePassword(buildPasswordChange(values));
    }
  };

  return (
    <EditAccountViewWrapper>
      <Row className="rz-page-content">
        <Col className="page-section-main">
          <Formik
            initialValues={formInitValue}
            onSubmit={onSubmit}
            validateOnMount
          >
            {({ isValid }) => (
              <Form>
                <div className="container">
                  <div className="inner-container">
                    <DisplayBold20 as="h1">Aðgangsupplýsingar</DisplayBold20>
                    <div>
                      <FormItem field={fields.firstname} />
                    </div>
                    <div>
                      <FormItem field={fields.lastname} />
                    </div>
                    <br />
                    <div
                      onClick={handleEmailUpdate}
                      onKeyPress={handleEmailUpdate}
                    >
                      <FormItem
                        field={fields.showEmailUpdate}
                      />
                    </div>
                  </div>
                  <div className={`inner-container ${showUpdateEmail ? 'update-email-show' : 'update-email'}`}>
                    <DisplayBold20 as="h1">Uppfæra netfang</DisplayBold20>
                    <div>
                      <FormItem field={fields.email} />
                    </div>
                    <div>
                      <FormItem field={fields.password} />
                    </div>
                  </div>
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
                    large
                    filled
                    className="button"
                    ariaLabel="Update Account"
                  >
                    <DisplayBold18 as="span">
                      Uppfæra aðgang
                    </DisplayBold18>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <Formik
            initialValues={formInitValuePassword}
            onSubmit={onSubmitPassword}
            validateOnMount
          >
            {({ isValid }) => (
              <Form>
                <div className="container">
                  <div className="inner-container">
                    <DisplayBold20 as="h1">Breyta lykilorði</DisplayBold20>
                    <div>
                      <FormItem field={fields.password} />
                    </div>
                    <div>
                      <FormItem field={fields.newPassword} />
                    </div>
                  </div>
                </div>
                <div>
                  {updatePasswordError && (
                    <div>
                      Villa:
                      {updatePasswordError.message}
                    </div>
                  )}
                </div>
                <div className="form-next-step">
                  <Button
                    disabled={(!isValid) || setSavingPassword}
                    mode="primary"
                    type="submit"
                    large
                    filled
                    className="button"
                    ariaLabel="Update Lykilorð"
                  >
                    <DisplayBold18 as="span">
                      Uppfæra lykilorð
                    </DisplayBold18>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </EditAccountViewWrapper>
  );
};

EditAccountView.propTypes = {
  onSave: PropTypes.func,
  onSavePassword: PropTypes.func,
  saving: PropTypes.bool,
  setSavingPassword: PropTypes.bool,
  saveError: PropTypes.object,
  updatePasswordError: PropTypes.object,
  data: PropTypes.object,
};
