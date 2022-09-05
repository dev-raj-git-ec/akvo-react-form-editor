import React from 'react';
import { Form } from 'antd';

const FormWrapper = ({ children }) => {
  const [form] = Form.useForm();

  const handleOnValuesChange = () => {
    // console.log(changedValues, allValues);
  };

  const handleOnFinish = () => {
    // console.log(values);
  };

  const handleOnFinishFailed = () => {
    // console.log(values, errorFields, outOfDate);
  };

  return (
    <Form
      form={form}
      key="akvo-react-form-editor"
      name="akvo-react-form-editor"
      layout="vertical"
      onValuesChange={handleOnValuesChange}
      onFinish={handleOnFinish}
      onFinishFailed={handleOnFinishFailed}
    >
      {children}
    </Form>
  );
};

export default FormWrapper;
