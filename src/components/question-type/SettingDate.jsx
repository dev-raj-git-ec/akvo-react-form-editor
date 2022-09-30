import React from 'react';
import { Form, DatePicker, Row, Col } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

const SettingDate = ({
  id,
  questionGroupId,
  rule = { minDate: null, maxDate: null },
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const { minDate, maxDate } = rule;

  const moreDateSettings = [
    {
      label: UIText.inputQuestionAfterDateValueLabel,
      value: minDate,
      key: 'minDate',
      disabledDate: (current) =>
        current && maxDate && current >= moment(maxDate),
    },
    {
      label: UIText.inputQuestionBeforeDateValueLabel,
      value: maxDate,
      key: 'maxDate',
      disabledDate: (current) =>
        current && minDate && current <= moment(minDate),
    },
  ];

  const handleChangeAfterBefore = (name, value) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              if (value) {
                return {
                  ...q,
                  rule: {
                    ...q?.rule,
                    [name]: moment(value).format('YYYY-MM-DD'),
                  },
                };
              }
              if (!value && q?.rule?.[name]) {
                delete q.rule[name];
                if (isEmpty(q.rule)) {
                  delete q.rule;
                }
              }
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

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreInputDateSettingText}
      </p>
      <Row
        align="middle"
        gutter={[24, 24]}
      >
        {moreDateSettings.map((x) => (
          <Col
            key={`${namePreffix}-${x.key}`}
            span={8}
          >
            <Form.Item
              label={x.label}
              initialValue={x.value}
              name={`${namePreffix}-${x.key}`}
            >
              <DatePicker
                disabledDate={x.disabledDate}
                style={{ width: '100%' }}
                onChange={(e) => handleChangeAfterBefore(x.key, e)}
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SettingDate;
