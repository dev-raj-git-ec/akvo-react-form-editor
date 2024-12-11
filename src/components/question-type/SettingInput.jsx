import React from 'react';
import { Form, Checkbox, Space } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';
import { SettingAddons } from '../../support';

const SettingInput = ({
  id,
  questionGroupId,
  requiredDoubleEntry,
  hiddenString,
  addonBefore,
  addonAfter,
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  const updateState = (name, value) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                [name]: value,
              };
            }
            return q;
          });
          return {
            ...qg,
            questions: questions,
          };
        }
        return qg;
      });
    });
  };

  const handleChangeDoubleEntry = (e) => {
    updateState('requiredDoubleEntry', e?.target?.checked);
  };

  const handleChangeHiddenString = (e) => {
    updateState('hiddenString', e?.target?.checked);
  };

  const onAddonBefore = (value) => updateState('addonBefore', value);
  const onAddonAfter = (value) => updateState('addonAfter', value);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreInputTypeSettingText}
      </p>
      <Space className={styles['space-align-left']}>
        <Form.Item name={`${namePreffix}-require_double_entry`}>
          <Checkbox
            onChange={handleChangeDoubleEntry}
            checked={requiredDoubleEntry}
          >
            {' '}
            {UIText.inputQuestionRequireDoubleEntryCheckbox}
          </Checkbox>
        </Form.Item>
        <Form.Item name={`${namePreffix}-hidden_string`}>
          <Checkbox
            onChange={handleChangeHiddenString}
            checked={hiddenString}
          >
            {' '}
            {UIText.inputQuestionHiddenStringCheckbox}
          </Checkbox>
        </Form.Item>
      </Space>
      <SettingAddons
        {...{
          namePreffix,
          addonBefore,
          addonAfter,
          onAddonBefore,
          onAddonAfter,
        }}
      />
    </div>
  );
};

export default SettingInput;
