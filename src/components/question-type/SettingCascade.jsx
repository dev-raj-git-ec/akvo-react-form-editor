import React, { useState, useEffect } from 'react';
import { Form, Checkbox, Row, Col, Input, InputNumber } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const defaultApiValue = {
  endpoint: null,
  initial: 0,
  list: false,
};

const SettingCascade = ({ id, questionGroupId, api = defaultApiValue }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const [apiValue, setApiValue] = useState(
    !Object.keys(api).length ? defaultApiValue : api
  );

  useEffect(() => {
    // update global state
    if (apiValue?.endpoint) {
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id) {
                return {
                  ...q,
                  api: apiValue,
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
    }
  }, [apiValue, id, questionGroupId]);

  const updateLocalState = (name, value) => {
    const updatedApiValue = {
      ...apiValue,
      [name]: value,
    };
    setApiValue(updatedApiValue);
  };

  const handleChangeEndpoint = (e) => {
    updateLocalState('endpoint', e?.target?.value);
  };

  const handleChangeInitial = (e) => {
    updateLocalState('initial', e);
  };

  const handleChangeList = (e) => {
    updateLocalState('list', e?.target?.checked);
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreCascadeSettingText}
      </p>
      <Form.Item
        label={UIText.inputQuestionEndpointLabel}
        initialValue={api?.endpoint || defaultApiValue.endpoint}
        name={`${namePreffix}-api-endpoint`}
        rules={[
          { type: 'url', message: UIText.inputQuestionEndpointValidationText },
        ]}
      >
        <Input onChange={handleChangeEndpoint} />
      </Form.Item>
      <Row
        align="bottom"
        gutter={[24, 24]}
      >
        <Col span={4}>
          <Form.Item
            label={UIText.inputQuestionInitialValueLabel}
            initialValue={api?.initial || defaultApiValue.initial}
            name={`${namePreffix}-api-initial`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
              onChange={handleChangeInitial}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={`${namePreffix}-api-list`}>
            <Checkbox
              onChange={handleChangeList}
              checked={api?.list || defaultApiValue.list}
            >
              {' '}
              {UIText.inputQuestionListCheckbox}
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default SettingCascade;
