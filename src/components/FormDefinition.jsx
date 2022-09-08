import React from 'react';
import styles from '../styles.module.css';
import { Form, Input, Select } from 'antd';
import { UIStore, FormStore } from '../lib/store';

const FormDefinition = ({ name, description, languages = [] }) => {
  const UIText = UIStore.useState((s) => s.UIText);
  const {
    inputFormNameLabel,
    inputFormDescriptionLabel,
    inputFormLanguagesLabel,
  } = UIText;

  return (
    <div
      key="form-definition-input"
      className="arfe-form-definition"
    >
      <Form.Item
        label={inputFormNameLabel}
        name="form-name"
        initialValue={name}
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
        initialValue={description}
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
    </div>
  );
};

export default FormDefinition;
