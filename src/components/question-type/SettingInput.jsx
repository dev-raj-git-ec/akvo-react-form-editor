import React from 'react';
import { Form, Checkbox, Space } from 'antd';
import styles from '../styles.module.css';
import { UIStore } from '../lib/store';

const SettingInput = ({ id }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreInputTypeSettingText}
      </p>
      <Space className={styles['space-align-left']}>
        <Form.Item
          initialValue={false}
          name={`${namePreffix}-require_double_entry`}
        >
          <Checkbox> {UIText.inputQuestionRequireDoubleEntryCheckbox}</Checkbox>
        </Form.Item>
        <Form.Item
          initialValue={false}
          name={`${namePreffix}-hidden_string`}
        >
          <Checkbox> {UIText.inputQuestionHiddenStringCheckbox}</Checkbox>
        </Form.Item>
      </Space>
    </div>
  );
};

export default SettingInput;
