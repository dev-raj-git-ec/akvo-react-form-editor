import React from 'react';
import 'akvo-react-form/dist/index.css';
import { Webform } from 'akvo-react-form';
import { FormStore } from '../lib/store';

const FormPreview = () => {
  const formStore = FormStore.useState((s) => s);
  return <Webform forms={formStore} />;
};

export default FormPreview;
