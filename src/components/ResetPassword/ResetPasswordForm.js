import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FullField from '../FormElements/FullField';
import Button from '../ui/Button';
import styles from '../../theme/common.module.css';

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Too short!')
    .max(25, 'Too long!')
    .matches(
      //forcing a special character too for stronger passwords -->(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})
      /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      'Password must contain at least an uppercase letter, a lowercase letter, and a numeric character'
    )
    .required('Required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords are not the same!')
    .required('Required'),
});

const ResetPasswordForm = (props) => {
  const defaultData = {
    password: 'Admin543',
    passwordConfirmation: 'Admin543',
  };
  const { onSubmit, serverError, loading } = props;
  return (
    <section>
      <h1>Pick a new password</h1>
      <Formik initialValues={defaultData} validationSchema={resetPasswordSchema} onSubmit={onSubmit}>
        {({ errors, touched, values }) => (
          <Form>
            <FullField
              label='Password*'
              name='password'
              type='password'
              error={touched.password ? errors.password : null}
            />
            <FullField
              label='Repeat Password*'
              name='passwordConfirmation'
              type='password'
              error={touched.passwordConfirmation ? errors.passwordConfirmation : null}
            />
            <Button type='submit' loading={loading}>
              Submit
            </Button>
            {props.serverError ? <div className={styles.serverError}>{props.serverError}</div> : null}
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default ResetPasswordForm;
