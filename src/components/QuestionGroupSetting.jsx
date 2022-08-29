import React from 'react';
import { Form, Input, Checkbox, Button, Space } from 'antd';
import styles from '../styles.module.css';
import { UIStore } from '../lib/store';

const QuestionGroupSetting = ({
  id,
  name,
  description,
  repeatable,
  handleCancelEditGroup,
}) => {
  const namePreffix = `question_group-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <Form.Item
        label={UIText.inputQuestionGroupNameLabel}
        initialValue={name}
        name={`${namePreffix}-name`}
        required
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionGroupDescriptionLabel}
        initialValue={description}
        name={`${namePreffix}-description`}
      >
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item
        initialValue={repeatable}
        name={`${namePreffix}-repeatable`}
        className={styles['input-checkbox-wrapper']}
      >
        <Checkbox> {UIText.inputRepeatThisGroupCheckbox}</Checkbox>
      </Form.Item>
      <Space>
        <Button type="primary">{UIText.buttonSaveText}</Button>
        <Button onClick={handleCancelEditGroup}>
          {UIText.buttonCancelText}
        </Button>
      </Space>
    </div>
  );
};

export default QuestionGroupSetting;
