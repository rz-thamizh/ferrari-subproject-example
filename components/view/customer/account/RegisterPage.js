import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useMutation } from '@apollo/client';
import Validate from '@/lib/validate';
import { CreateCustomerMuation } from '@/store/customer/query';
import { useCustomerNewSessoin } from '@/store/customer/customer';

const RegisterPage = ({
  nextUrl,
  nextRoutePath,
  nextRouteParams,
}) => {
  const [saving, setSaving] = useState(false);
  const [
    handleNewSession,
    { loading: sessionLoding, error: sessionError },
  ] = useCustomerNewSessoin({ nextRoutePath, nextRouteParams, nextUrl });

  useEffect(() => {
    setSaving(sessionLoding);
  }, [sessionLoding]);

  const [createCustomer, { error }] = useMutation(CreateCustomerMuation, {
    onCompleted: (data) => {
      // Ensure customer is created
      if (data.createCustomerV2) {
        console.log('✅ Customer created', data, error);
        handleNewSession(data.generateCustomerToken.token);
      } else {
        setSaving(false);
      }
    },
  });

  const [user] = useState({
    firstName: 'Anto',
    lastName: 'Kaspar',
    email: 'anto+4@roanuz.com',
    password: 'Test123!AB',
    passwordRepeat: 'Test123!AB',
    allowNewsletter: false,
    allowRemoteSupport: true,
  });

  const onSubmit = (values) => {
    setSaving(true);
    const variables = {
      firstname: values.firstName,
      lastname: values.lastName,
      email: values.email,
      password: values.password,
      is_subscribed: values.allowNewsletter,
      allow_remote_shopping_assistance: values.allowRemoteSupport,
    };
    createCustomer({ variables });
  };

  const fields = [
    {
      name: 'First Name', key: 'firstName', type: 'text', validate: Validate.required,
    },
    {
      name: 'Last Name', key: 'lastName', type: 'text', validate: Validate.required,
    },
    {
      name: 'Email', key: 'email', type: 'email', validate: Validate.email,
    },
    {
      name: 'Password', key: 'password', type: 'password', validate: Validate.required,
    },
    {
      name: 'Confirm Password', key: 'passwordRepeat', type: 'password', validate: Validate.required,
    },
    {
      name: 'News letter', key: 'allowNewsletter', type: 'checkbox', validate: Validate.optional,
    },
    {
      name: 'Allow Remote Support', key: 'allowRemoteSupport', type: 'checkbox', validate: Validate.optional,
    },
  ];

  return (
    <div>
      <h1>Búa til aðgang</h1>
      <div>
        <Formik
          initialValues={user}
          onSubmit={onSubmit}
        >
          {() => (
            <Form>
              {fields.map((field) => (
                <div key={field.key}>
                  <label>
                    {field.name}
                    <Field name={field.key} type={field.type} validate={field.validate} />
                  </label>
                  <ErrorMessage name={field.key} component="div" />
                </div>
              ))}
              {error && (
                <div>
                  {error.message}
                </div>
              )}
              {sessionError && (
                <div>
                  {sessionError.message}
                </div>
              )}
              <button type="submit" disabled={saving}>
                Búa til aðgang
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

RegisterPage.propTypes = {
  nextUrl: PropTypes.string,
  nextRoutePath: PropTypes.string,
  nextRouteParams: PropTypes.object,
};

export default RegisterPage;
