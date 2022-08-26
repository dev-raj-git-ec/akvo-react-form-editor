import React from 'react';
import { Form, Input } from 'antd';
import { UIStore } from '../lib/store';

const FormDefinition = () => {
  const UIText = UIStore.useState((s) => s.UIText);
  const { inputFormNameLabel, inputFormDescriptionLabel } = UIText;

  return (
    <div key="form-definition-input">
      <Form.Item
        label={inputFormNameLabel}
        name="form-name"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={inputFormDescriptionLabel}
        name="form-description"
      >
        <Input.TextArea
          showCount
          rows={5}
        />
      </Form.Item>
    </div>
  );
};

export default FormDefinition;
