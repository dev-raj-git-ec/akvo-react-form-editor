import React, { useState, useMemo } from 'react';
import { Form, Checkbox, Space, Input, AutoComplete } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn, questionType } from '../../lib/store';
import isEmpty from 'lodash/isEmpty';

const fnStringExample =
  "Search question_name by typing #\nExample format below:\n#question_name# / #question_name#\nOR\n#question_name#.includes('Test') ? #question_name# / #question_name# : 0 }";

const fnColorExample = "{ 'answer_value': '#CCFFC4' }";

const allowedQuestionTypes = [
  questionType.input,
  questionType.number,
  questionType.text,
  questionType.option,
  questionType.multiple_option,
  questionType.autofield,
];

const SettingAutofield = ({
  id,
  questionGroupId,
  fn = { multiline: false, fnString: null, fnColor: {} },
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );
  const [search, setSearch] = useState(null);

  const questionNames = useMemo(() => {
    let preffix = '';
    const regex = new RegExp(search, 'gi');
    let res = questionGroups
      .flatMap((qg) => qg.questions)
      .filter((q) => q.id !== id && allowedQuestionTypes.includes(q.type));
    if (search) {
      res = res.filter((q) => q.name.match(regex)?.length);
    }
    if (fn.fnString) {
      preffix = `${fn.fnString?.trim()} `;
    }
    return res.map((q) => ({
      label: `${preffix}#${q.name}#`,
      value: `${preffix}#${q.name}#`,
    }));
  }, [questionGroups, id, search, fn.fnString]);

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
    const val = e?.target?.value;
    const check = val ? val.split(' ').pop() : '';
    if (!check.includes('#')) {
      updateState('fn', { ...fn, fnString: val });
    }
  };

  const handleBlurFnString = (e) => {
    setSearch(null);
    const val = e?.target?.value;
    updateState('fn', { ...fn, fnString: val });
  };

  const handleSelectAutoCompleteFnString = (val) => {
    setSearch(null);
    updateState('fn', { ...fn, fnString: val });
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

  const handleSearch = (val) => {
    const searchTerm = val.split(' ').pop();
    if (searchTerm.includes('#')) {
      setSearch(searchTerm.replace(/#/g, ''));
    } else {
      setSearch(null);
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
        <AutoComplete
          options={questionNames}
          onSearch={handleSearch}
          onSelect={handleSelectAutoCompleteFnString}
          getPopupContainer={(trigger) => trigger.parentNode}
          backfill
          open={search !== null}
        >
          <Input.TextArea
            rows={5}
            allowClear
            onChange={handleChangeFnString}
            onBlur={handleBlurFnString}
            placeholder={fnStringExample}
          />
        </AutoComplete>
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
