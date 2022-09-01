import React from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionType } from '../lib/store';
import {
  SettingInput,
  SettingTree,
  SettingNumber,
  SettingOption,
} from './question-type';

const QuestionSetting = ({ question }) => {
  const { id, name, type, variable, tooltip, required } = question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const form = Form.useFormInstance();
  const qType = Form.useWatch(`${namePreffix}-type`, form);

  return (
    <div>
      <Form.Item
        label={UIText.inputQuestionNameLabel}
        initialValue={name}
        name={`${namePreffix}-name`}
        required
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTypeLabel}
        initialValue={type}
        name={`${namePreffix}-type`}
        required
      >
        <Select
          className={styles['select-dropdown']}
          options={Object.keys(questionType).map((key) => ({
            label: questionType[key]?.split('_').join(' '),
            value: key,
          }))}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionVariableNameLabel}
        initialValue={variable}
        name={`${namePreffix}-variable`}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTooltipLabel}
        initialValue={tooltip}
        name={`${namePreffix}-tooltip`}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        initialValue={required}
        name={`${namePreffix}-required`}
        className={styles['input-checkbox-wrapper']}
      >
        <Checkbox> {UIText.inputQuestionRequiredCheckbox}</Checkbox>
      </Form.Item>
      {qType === 'input' && <SettingInput {...question} />}
      {qType === 'number' && <SettingNumber {...question} />}
      {['option', 'multiple_option'].includes(qType) && (
        <SettingOption {...question} />
      )}
      {qType === 'tree' && <SettingTree {...question} />}
    </div>
  );
};

export default QuestionSetting;
