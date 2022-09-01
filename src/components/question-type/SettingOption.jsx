import React, { useState } from 'react';
import { Form, Checkbox, Space, Row, Col, Input, Button } from 'antd';
import styles from '../../styles.module.css';
import { UIStore } from '../../lib/store';
import { BiDownArrowAlt, BiUpArrowAlt } from 'react-icons/bi';
import { RiDeleteBin2Line } from 'react-icons/ri';
import orderBy from 'lodash/orderBy';

const defaultOptions = [
  {
    code: null,
    name: 'New Option',
    order: 1,
  },
  {
    code: null,
    name: 'New Option',
    order: 2,
  },
];

const SettingOption = ({ id }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreOptionTypeSettingText}
      </p>
      {orderBy(defaultOptions, 'order').map((d, di) => (
        <Row
          key={`option-${id}-${di}`}
          align="middle"
          justify="start"
          gutter={[12, 12]}
        >
          <Col span={4}>
            <Form.Item
              label="Code"
              initialValue={d.code}
              name={`${namePreffix}-option-code`}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item
              label="Option"
              initialValue={d.name}
              name={`${namePreffix}-option-name`}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Space>
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<BiUpArrowAlt />}
              />
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<BiDownArrowAlt />}
              />
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<RiDeleteBin2Line />}
              />
            </Space>
          </Col>
        </Row>
      ))}
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
