import React from 'react';
import styles from '../styles.module.css';
import { Form, Card, Space } from 'antd';

const TranslationFormItem = ({
  labelText = '',
  name = '',
  currentValue = '',
  children = '',
}) => {
  return (
    <Form.Item
      label={
        <Space
          direction="vertical"
          style={{ width: '100%' }}
        >
          {labelText}
          <Card
            className={styles['translation-form-item-card']}
            bodyStyle={{ padding: '10px 12px', background: '#f3f3f3' }}
          >
            {currentValue}
          </Card>
        </Space>
      }
      name={name}
      className={styles['translation-form-item']}
    >
      {children}
    </Form.Item>
  );
};

export default TranslationFormItem;
