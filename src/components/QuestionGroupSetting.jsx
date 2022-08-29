import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import styles from '../styles.module.css';
import { UIStore } from '../lib/store';
import { SaveButton } from '../support';

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
      <SaveButton
        onClickSave={() => console.log('save')}
        onClickCancel={handleCancelEditGroup}
      />
    </div>
  );
};

export default QuestionGroupSetting;
