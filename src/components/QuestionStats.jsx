import React from 'react';
import styles from '../styles.module.css';
import { Form, Input } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';

const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;

const QuestionStats = ({ id, questionGroupId, dataApiUrl = null }) => {
  const namePreffix = `question-${id}`;
  const { UIText } = UIStore.useState((s) => s);

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

  const handleChangeStatsEndpoint = (e) => {
    const value = e?.target?.value;
    updateState('dataApiUrl', value);
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionStatsSettingTest}
      </p>
      <Form.Item
        label={UIText.inputStatsUrlText}
        name={`${namePreffix}-dataApiUrl`}
        initialValue={dataApiUrl}
        rules={[
          {
            pattern: urlRegex,
            message: 'Invalid URL format',
          },
        ]}
      >
        <Input onChange={handleChangeStatsEndpoint} />
      </Form.Item>
    </div>
  );
};

export default QuestionStats;
