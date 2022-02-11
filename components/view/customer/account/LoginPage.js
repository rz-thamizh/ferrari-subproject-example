import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useMutation } from '@apollo/client';
import Validate from '@/lib/validate';
import { CustomerTokenMutation } from '@/store/customer/query';
import { useCustomerNewSessoin } from '@/store/customer/customer';

const LoginPage = ({
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

  const [createToken, { error }] = useMutation(CustomerTokenMutation, {
    onCompleted: (data) => {
      if (data.generateCustomerToken) {
        handleNewSession(data.generateCustomerToken.token);
      } else {
        setSaving(false);
      }
    },
  });

  const [user] = useState({
    email: 'anto+4@roanuz.com',
    password: 'Test123!AB',
  });

  const onSubmit = (values) => {
    setSaving(true);
    const variables = {
      email: values.email,
      password: values.password,
    };
    createToken({ variables });
  };

  const fields = [
    {
      name: 'Email', key: 'email', type: 'email', validate: Validate.email,
    },
    {
      name: 'Password', key: 'password', type: 'password', validate: Validate.required,
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
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

LoginPage.propTypes = {
  nextUrl: PropTypes.string,
  nextRoutePath: PropTypes.string,
  nextRouteParams: PropTypes.object,
};

export default LoginPage;
