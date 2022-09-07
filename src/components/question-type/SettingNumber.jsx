import React from 'react';
import { Form, Checkbox, Space, InputNumber, Row, Col } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingNumber = ({
  id,
  questionGroupId,
  rule = {
    allowDecimal: false,
    min: null,
    max: null,
    equal: null,
  },
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const { allowDecimal, min, max, equal } = rule;

  const moreNumberSettings = [
    { label: UIText.inputQuestionMinimumValueLabel, value: min, key: 'min' },
    { label: UIText.inputQuestionMaximumValueLabel, value: max, key: 'max' },
    { label: UIText.inputQuestionEqualValueLabel, value: equal, key: 'equal' },
  ];

  const updateState = (name, value) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                rule: {
                  ...q?.rule,
                  [name]: value,
                },
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

  const handleChangeAllowDecimal = (e) => {
    updateState('allowDecimal', e?.target?.checked);
  };

  const handleChangeMinMaxEqual = (key, e) => {
    updateState(key, e);
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreInputNumberSettingText}
      </p>
      <Space className={styles['space-align-left']}>
        <Form.Item name={`${namePreffix}-allow_decimal`}>
          <Checkbox
            onChange={handleChangeAllowDecimal}
            checked={allowDecimal}
          >
            {' '}
            {UIText.inputQuestionAllowDecimalCheckbox}
          </Checkbox>
        </Form.Item>
      </Space>
      <Row
        align="middle"
        justify="space-between"
        gutter={[12, 12]}
      >
        {moreNumberSettings.map((x) => (
          <Col
            key={`${namePreffix}-${x.key}`}
            span={8}
          >
            <Form.Item
              label={x.label}
              initialValue={x.value}
              name={`${namePreffix}-${x.key}`}
            >
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
                keyboard={false}
                onChange={(e) => handleChangeMinMaxEqual(x.key, e)}
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SettingNumber;
