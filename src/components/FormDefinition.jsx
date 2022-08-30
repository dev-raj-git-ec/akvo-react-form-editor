import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import { UIStore, FormStore, questionGroupFn } from '../lib/store';
import { SaveButton } from '../support';

const FormDefinition = ({ onSave }) => {
  const form = Form.useFormInstance();
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const formStore = FormStore.useState((s) => s);
  const UIText = UIStore.useState((s) => s.UIText);
  const { inputFormNameLabel, inputFormDescriptionLabel } = UIText;

  const handleSave = () => {
    form.submit();
    if (onSave) {
      onSave({ ...formStore, questionGroups: questionGroups });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      'form-name': formStore.name,
      'form-description': formStore.description,
    });
  }, [form, formStore]);

  return (
    <div
      key="form-definition-input"
      className="arfe-form-definition"
    >
      <Form.Item
        label={inputFormNameLabel}
        name="form-name"
      >
        <Input
          onChange={(e) =>
            FormStore.update((u) => {
              u.name = e?.target?.value;
            })
          }
        />
      </Form.Item>
      <Form.Item
        label={inputFormDescriptionLabel}
        name="form-description"
      >
        <Input.TextArea
          rows={5}
          onChange={(e) =>
            FormStore.update((u) => {
              u.description = e?.target?.value;
            })
          }
        />
      </Form.Item>
      <SaveButton
        cancelButton={false}
        onClickSave={handleSave}
      />
    </div>
  );
};

export default FormDefinition;
