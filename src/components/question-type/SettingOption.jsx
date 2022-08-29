import React from 'react';
import { Form, Checkbox, Space, Row, Col, Input } from 'antd';
import styles from '../../styles.module.css';
import { UIStore } from '../../lib/store';

const SettingOption = ({ id }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreOptionTypeSettingText}
      </p>
      <Row
        align="middle"
        justify="space-between"
        gutter={[12, 12]}
      >
        <Col span={24}>
          <Form.Item
            label="Option"
            initialValue={''}
            name={`${namePreffix}-option`}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Space className={styles['space-align-left']}>
        <Form.Item
          initialValue={false}
          name={`${namePreffix}-allow_other`}
        >
          <Checkbox> {UIText.inputQuestionAllowOtherCheckbox}</Checkbox>
        </Form.Item>
      </Space>
    </div>
  );
};

export default SettingOption;
