import React, { useState, useMemo } from 'react';
import { Form, Checkbox, Space, Input, AutoComplete, Typography } from 'antd';
import styles from '../../styles.module.css';
import {
  UIStore,
  questionGroupFn,
  questionType,
  ErrorStore,
} from '../../lib/store';
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

const { Text } = Typography;

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
  const questionErrors = ErrorStore.useState((s) => s.questionErrors);

  const currentAutofieldFnStringError = useMemo(() => {
    const findError = questionErrors.find(
      (e) => e.id === id && e.field === 'autofield_fnString'
    );
    if (findError) {
      return findError;
    }
    return false;
  }, [id, questionErrors]);

  const allAllowedQuestions = questionGroups
    .flatMap((qg) => qg.questions)
    .filter((q) => allowedQuestionTypes.includes(q.type))
    .map((q) => ({
      id: q.id,
      name: q.name,
      type: q.type,
    }));

  const questionNames = useMemo(() => {
    let preffix = '';
    // Function to escape special characters in the search string
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    };
    // Ensure search is not empty or null and escape it
    const searchPattern = search ? escapeRegExp(search) : '';
    let res = allAllowedQuestions.filter((q) => q.id !== id);
    if (searchPattern) {
      try {
        const regex = new RegExp(searchPattern, 'gi');
        res = res.filter((q) => q.name.match(regex)?.length);
      } catch (e) {
        console.error('Invalid regular expression:', e.message);
      }
    }
    if (fn.fnString) {
      preffix = `${fn.fnString?.trim()} `;
    }
    return res.map((q) => ({
      label: `${preffix}#${q.name}#`,
      value: `${preffix}#${q.name}#`,
    }));
  }, [allAllowedQuestions, id, search, fn.fnString]);

  const sampleValues = useMemo(() => {
    return allAllowedQuestions.reduce((acc, q) => {
      const key = `#${q.name}#`;
      let sampleValue = 0;
      if (
        [
          questionType.input,
          questionType.text,
          questionType.autofield,
        ].includes(q.type)
      ) {
        sampleValue = 'lorem';
      } else if (q.type === questionType.option) {
        sampleValue = 'option_lorem';
      } else if (q.type === questionType.multiple_option) {
        sampleValue = 'option_lorem | option_ipsum';
      }
      return {
        ...acc,
        [key]: sampleValue,
      };
    }, {});
  }, [allAllowedQuestions]);

  const validateAndExecute = (fnStringValue) => {
    // Replace placeholders with sample values
    let functionBody = fnStringValue;
    Object.keys(sampleValues).forEach((key) => {
      const placeholder = new RegExp(key, 'g');
      const value = sampleValues[key];
      functionBody = functionBody.replace(placeholder, JSON.stringify(value));
    });

    try {
      new Function(`return ${functionBody}`)();
      ErrorStore.update((s) => {
        // remove from error list
        s.questionErrors = s.questionErrors.filter(
          (e) => e.id !== id && e.field !== 'autofield_fnString'
        );
      });
    } catch (error) {
      ErrorStore.update((s) => {
        s.questionErrors = [
          ...s.questionErrors,
          {
            id: id,
            field: 'autofield_fnString',
            message: `Error evaluating function string${
              error?.message ? `: ${error.message}` : ''
            }`,
          },
        ];
      });
    }
  };

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
    const val = e?.target?.value;
    // Regular expression to extract the contents inside the function body
    const match = val?.match(/return\s+([^;]+)/);
    // Extracted content from the function body (remove function)
    const extractedContent = match ? match[1].trim() : val?.trim();
    setSearch(null);
    validateAndExecute(extractedContent);
    updateState('fn', { ...fn, fnString: extractedContent });
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
          // getPopupContainer={(trigger) => console.log(trigger, '----===')}
          backfill
          open={search !== null}
          // value={fn?.fnString || null}
        >
          <Input.TextArea
            rows={5}
            allowClear
            onChange={handleChangeFnString}
            onBlur={handleBlurFnString}
            placeholder={fnStringExample}
            // value={fn?.fnString || null}
          />
        </AutoComplete>
      </Form.Item>
      {currentAutofieldFnStringError?.id ? (
        <div className={styles['field-error-wrapper']}>
          <Text type="danger">{currentAutofieldFnStringError.message}</Text>
        </div>
      ) : (
        ''
      )}
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
