import React from 'react';
import { Form, DatePicker, Row, Col } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingDate = ({ id, minDate, maxDate }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  const moreDateSettings = [
    {
      label: UIText.inputQuestionAfterDateValueLabel,
      value: minDate,
      key: 'minDate',
      rules: {
        max: minDate,
        message: `${UIText.inputQuestionAfterDateValidationText} ${minDate}`,
      },
    },
    {
      label: UIText.inputQuestionBeforeDateValueLabel,
      value: maxDate,
      key: 'maxDate',
      rules: {
        min: minDate,
        message: `${UIText.inputQuestionBeforeDateValidationText} ${minDate}`,
      },
    },
  ];

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
              rules={[{ type: 'date', ...x.rules }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                // onChange={(e) => handleChangeMinMax(x.key, e)}
              />
            </Form.Item>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SettingDate;
