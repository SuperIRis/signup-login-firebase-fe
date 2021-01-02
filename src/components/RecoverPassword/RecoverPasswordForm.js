import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FullField from '../FormElements/FullField';
import Button from '../ui/Button';
import styles from '../../theme/common.module.css';

const recoverPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
});

const RecoverPasswordForm = (props) => {
  const defaultData = {
    email: '',
  };
  const { onSubmit, serverError, loading } = props;
  return (
    <Formik initialValues={defaultData} validationSchema={recoverPasswordSchema} onSubmit={onSubmit}>
      {({ errors, touched, values }) => (
        <Form>
          <FullField label='Email' name='email' error={touched.email ? errors.email : null} value={values.email} />
          {props.serverError ? <div className={styles.formError}>{props.serverError}</div> : null}
          <Button type='submit' loading={loading}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default RecoverPasswordForm;
