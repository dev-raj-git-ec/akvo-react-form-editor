import React from 'react';
import { Form } from 'antd';

const FormWrapper = ({ children }) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      key="akvo-react-form-editor"
      name="akvo-react-form-editor"
      layout="vertical"
    >
      {children}
    </Form>
  );
};

export default FormWrapper;
