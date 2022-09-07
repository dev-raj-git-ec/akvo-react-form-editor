import React from 'react';
import { Form, Input } from 'antd';
import { UIStore, FormStore, questionGroupFn } from '../lib/store';
import data from '../lib/data';
import { SaveButton } from '../support';

const FormDefinition = ({ onSave }) => {
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const formStore = FormStore.useState((s) => s);
  const UIText = UIStore.useState((s) => s.UIText);
  const { inputFormNameLabel, inputFormDescriptionLabel } = UIText;

  const handleSave = () => {
    if (onSave) {
      // transform questions to remove unused setting by question type
      onSave(data.toWebform(formStore, questionGroups));
    }
  };

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
