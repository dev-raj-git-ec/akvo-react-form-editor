import React from 'react';
import styles from '../styles.module.css';
import { Form, Row, Col, Space, Typography } from 'antd';

const { Text } = Typography;

const TranslationFormItem = ({
  labelText = '',
  name = '',
  currentValue = '',
  children = '',
}) => {
  return (
    <Row
      align="top"
      justify="space-between"
      gutter={[24, 24]}
      style={{ marginBottom: 24 }}
    >
      <Col span={12}>
        <Space
          direction="vertical"
          style={{ width: '100%' }}
        >
          <b>{labelText}</b>
          <Text>{currentValue}</Text>
        </Space>
      </Col>
      <Col span={12}>
        <Form.Item
          name={name}
          label={<b>{labelText}</b>}
          className={styles['translation-form-item']}
        >
          {children}
        </Form.Item>
      </Col>
    </Row>
  );
};

export default TranslationFormItem;
