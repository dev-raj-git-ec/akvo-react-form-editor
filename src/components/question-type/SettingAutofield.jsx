import React from 'react';
import { Form, Checkbox, Space, Input } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';
import isEmpty from 'lodash/isEmpty';

const fnStringExample =
  "function () { return #question_id / #question_id } OR () => { return #1.includes('Test') ? #question_id / #question_id : 0 }";

const fnColorExample =
  "{ '#question_id_1': '#CCFFC4', '#question_id_2': '#FECDCD' }";

const SettingAutofield = ({
  id,
  questionGroupId,
  fn = { multiline: false, fnString: null, fnColor: {} },
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

  const handleChangeMultiline = (e) => {
    const value = e?.target?.checked;
    updateState('fn', { ...fn, multiline: value });
  };

  const handleChangeFnString = (e) => {
    const value = e?.target?.value;
    updateState('fn', { ...fn, fnString: value });
  };

  const handleChangeFnColor = (e) => {
    let value = e?.target?.value;
    try {
      value = JSON.parse(value);
      updateState('fn', { ...fn, fnColor: value });
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreAutofieldTypeSettingText}
      </p>
      <Space className={styles['space-align-left']}>
        <Form.Item name={`${namePreffix}-autofield_multiline`}>
          <Checkbox
            onChange={handleChangeMultiline}
            checked={fn?.multiline || false}
          >
            {' '}
            {UIText.inputQuestionAutofieldMultiline}
          </Checkbox>
        </Form.Item>
      </Space>
      <Form.Item
        label={UIText.inputQuestionAutofieldFnString}
        name={`${namePreffix}-autofield_fnString`}
        initialValue={fn?.fnString || null}
        required
      >
        <Input.TextArea
          rows={5}
          allowClear
          onChange={handleChangeFnString}
          placeholder={fnStringExample}
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionAutofieldFnColor}
        name={`${namePreffix}-autofield_fnColor`}
        initialValue={isEmpty(fn?.fnColor) ? null : JSON.stringify(fn?.fnColor)}
      >
        <Input.TextArea
          rows={5}
          allowClear
          onChange={handleChangeFnColor}
          placeholder={fnColorExample}
        />
      </Form.Item>
    </div>
  );
};

export default SettingAutofield;
