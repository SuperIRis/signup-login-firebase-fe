import React from 'react';
import { Formik, Form } from 'formik';
import FullField from '../FormElements/FullField';
import Button from '../ui/Button';
import styles from './LoginForm.module.css';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm = (props) => {
  const defaults = props.defaultData || {};
  const defaultData = {
    email: defaults.email || '',
    password: defaults.password || '',
    remember: false,
  };
  const { onSubmit, serverError } = props;
  return (
    <Formik initialValues={defaultData} validationSchema={loginSchema} onSubmit={onSubmit}>
      {({ errors, touched, values }) => (
        <Form>
          <FullField name='email' label='Email' error={touched.email ? errors.email : null} />
          <FullField
            name='password'
            label='Password'
            type='password'
            error={touched.password ? errors.password : null}
          />
          <FullField label='Remember me' type='checkbox' name='remember' checked={values.remember} />
          <Button type='submit'>Submit</Button>
          {props.serverError ? <div className={styles.serverError}>{props.serverError}</div> : null}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
