import React from 'react';
import { Form, Checkbox, Space, InputNumber, Row, Col } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingNumber = ({ id }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreInputNumberSettingText}
      </p>
      <Space className={styles['space-align-left']}>
        <Form.Item
          initialValue={false}
          name={`${namePreffix}-allow_decimal`}
        >
          <Checkbox> {UIText.inputQuestionAllowDecimalCheckbox}</Checkbox>
        </Form.Item>
      </Space>
      <Row
        align="middle"
        justify="space-between"
        gutter={[12, 12]}
      >
        <Col span={8}>
          <Form.Item
            label="Minimum Value"
            initialValue={''}
            name={`${namePreffix}-min`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Maximum Value"
            initialValue={''}
            name={`${namePreffix}-max`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Equal Value"
            initialValue={''}
            name={`${namePreffix}-equal`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default SettingNumber;
