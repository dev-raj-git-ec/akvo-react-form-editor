import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionGroupFn } from '../lib/store';

const QuestionGroupSetting = ({ id, name, description, repeatable }) => {
  const namePreffix = `question_group-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  const handleChangeName = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, name: e?.target?.value };
        }
        return x;
      });
    });
  };

  const handleChangeDescription = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, description: e?.target?.value };
        }
        return x;
      });
    });
  };

  const handleChangeRepeatable = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, repeatable: e.target.checked };
        }
        return x;
      });
    });
  };

  return (
    <div>
      <Form.Item
        label={UIText.inputQuestionGroupNameLabel}
        initialValue={name}
        name={`${namePreffix}-name`}
        required
      >
        <Input onChange={handleChangeName} />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionGroupDescriptionLabel}
        initialValue={description}
        name={`${namePreffix}-description`}
      >
        <Input.TextArea
          onChange={handleChangeDescription}
          rows={5}
        />
      </Form.Item>
      <Form.Item
        initialValue={repeatable}
        name={`${namePreffix}-repeatable`}
        className={styles['input-checkbox-wrapper']}
      >
        <Checkbox onChange={handleChangeRepeatable}>
          {' '}
          {UIText.inputRepeatThisGroupCheckbox}
        </Checkbox>
      </Form.Item>
    </div>
  );
};

export default QuestionGroupSetting;
