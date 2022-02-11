import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Validate from '@/roanuz/lib/validate';
import { FormItem } from './input';
import { Row } from '../layout';
import { Button } from './button';

export default {
  title: 'View / Form',
  component: FormItem,
};

const Template = () => {
  const [value] = useState({ firstName: 'John', rdx: '' });
  const fields = [
    { type: 'text', name: 'First Name', id: 'firstName' },
    { type: 'password', name: 'Password', id: 'password' },
  ];
  return (

    <div style={{ padding: '20px' }}>
      <Formik initialValues={value}>
        {() => (
          <Form>
            {fields.map((field) => (
              <FormItem field={field} key={field.id} />
            ))}
            <Row>
              <FormItem field={{ type: 'text', name: 'A', id: 'a' }} />
              <FormItem field={{ type: 'text', name: 'B', id: 'b' }} />
              <FormItem
                field={{
                  name: 'Age',
                  id: 'age',
                  validate: Validate.all([
                    Validate.required,
                    Validate.number,
                  ], { message: 'Give valid Age' }),
                  action: (
                    <Button mode="link">Add</Button>
                  ),
                }}
              />
            </Row>
            <Row>
              <FormItem field={{ type: 'checkbox', name: 'Select Me', id: 'chk' }} />
            </Row>
            <Row>
              <FormItem
                field={{
                  type: 'radio', name: 'Select Me as', id: 'rdx', value: 'x',
                }}
              />
            </Row>
            <div>
              <FormItem
                field={{
                  name: 'SSN',
                  id: 'ssn',
                  validate: Validate.all([
                    Validate.required,
                    Validate.number,
                  ], { message: 'Give valid SSN' }),
                  action: (
                    <Button mode="link">Add</Button>
                  ),
                }}
              />
            </div>
            <div>
              <FormItem
                field={{
                  name: 'Pincode',
                  id: 'pincode',
                  isSelect: true,
                }}
              />
            </div>
            <button type="submit">
              Create Account
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export const Text = Template.bind({});
Form.args = {};
