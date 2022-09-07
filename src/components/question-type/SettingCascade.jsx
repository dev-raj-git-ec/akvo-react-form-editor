import React from 'react';
import { Form, Checkbox, Row, Col, Input, InputNumber } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingCascade = ({
  id,
  questionGroupId,
  api = {
    endpoint: null,
    initial: 0,
    list: false,
  },
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  const updateGlobalState = (name, value) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                api: {
                  ...q?.api,
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

  const handleChangeEndpoint = (e) => {
    updateGlobalState('endpoint', e?.target?.value);
    updateGlobalState('initial', 0);
  };

  const handleChangeInitial = (e) => {
    updateGlobalState('initial', e);
  };

  const handleChangeList = (value) => {
    updateGlobalState('list', value);
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreCascadeSettingText}
      </p>
      <Form.Item
        label={UIText.inputQuestionEndpointLabel}
        initialValue={api?.endpoint}
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
            initialValue={api?.initial}
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
          <Form.Item name={`${namePreffix}-api-list-checkbox`}>
            <Checkbox
              onChange={(e) => handleChangeList(e?.target?.checked)}
              checked={api?.list ? true : false}
            >
              {' '}
              {UIText.inputQuestionListCheckbox}
            </Checkbox>
          </Form.Item>
        </Col>
        {api?.list && (
          <Col span={8}>
            <Form.Item
              label={UIText.inputQuestionListLabel}
              initialValue={
                api?.list ? (api.list !== true ? api.list : null) : null
              }
              name={`${namePreffix}-api-list`}
            >
              <Input onChange={(e) => handleChangeList(e?.target?.value)} />
            </Form.Item>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default SettingCascade;
