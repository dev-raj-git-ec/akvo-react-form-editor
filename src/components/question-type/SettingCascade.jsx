import React from 'react';
import { Form, Checkbox, Row, Col, Input, InputNumber } from 'antd';
import styles from '../../styles.module.css';
import { UIStore } from '../../lib/store';

const SettingCascade = ({ id, api }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreCascadeSettingText}
      </p>
      <Form.Item
        label={UIText.inputQuestionEndpointLabel}
        initialValue={api?.endpoint || null}
        name={`${namePreffix}-api-endpoint`}
      >
        <Input />
      </Form.Item>
      <Row
        align="bottom"
        gutter={[24, 24]}
      >
        <Col span={4}>
          <Form.Item
            label={UIText.inputQuestionInitialValueLabel}
            initialValue={api?.initial || null}
            name={`${namePreffix}-api-initial`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            initialValue={api?.list || null}
            name={`${namePreffix}-api-list`}
          >
            <Checkbox> {UIText.inputQuestionListCheckbox}</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default SettingCascade;
