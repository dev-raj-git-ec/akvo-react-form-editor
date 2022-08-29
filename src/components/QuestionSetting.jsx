import React from 'react';
import {
  Form,
  Input,
  Select,
  Checkbox,
  Space,
  InputNumber,
  Row,
  Col,
} from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionType } from '../lib/store';

const QuestionSetting = ({ id, name, type, variable, tooltip, required }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const form = Form.useFormInstance();
  const qType = Form.useWatch(`${namePreffix}-type`, form);

  console.log('test', qType);

  return (
    <div>
      <Form.Item
        label={UIText.inputQuestionNameLabel}
        initialValue={name}
        name={`${namePreffix}-name`}
        required
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTypeLabel}
        initialValue={type}
        name={`${namePreffix}-type`}
        required
      >
        <Select
          className={styles['select-dropdown']}
          options={Object.keys(questionType).map((key) => ({
            label: questionType[key]?.split('_').join(' '),
            value: key,
          }))}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionVariableNameLabel}
        initialValue={variable}
        name={`${namePreffix}-variable`}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTooltipLabel}
        initialValue={tooltip}
        name={`${namePreffix}-tooltip`}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        initialValue={required}
        name={`${namePreffix}-required`}
        className={styles['input-checkbox-wrapper']}
      >
        <Checkbox> {UIText.inputQuestionRequiredCheckbox}</Checkbox>
      </Form.Item>
      {qType === 'input' && (
        <div>
          <p className={styles['more-question-setting-text']}>
            {UIText.questionMoreInputTypeSettingText}
          </p>
          <Space className={styles['space-align-left']}>
            <Form.Item
              initialValue={false}
              name={`${namePreffix}-require_double_entry`}
            >
              <Checkbox>
                {' '}
                {UIText.inputQuestionRequireDoubleEntryCheckbox}
              </Checkbox>
            </Form.Item>
            <Form.Item
              initialValue={false}
              name={`${namePreffix}-hidden_string`}
            >
              <Checkbox> {UIText.inputQuestionHiddenStringCheckbox}</Checkbox>
            </Form.Item>
          </Space>
        </div>
      )}
      {qType === 'number' && (
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
      )}
    </div>
  );
};

export default QuestionSetting;
