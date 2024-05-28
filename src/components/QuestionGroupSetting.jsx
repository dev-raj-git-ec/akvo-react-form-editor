import React from 'react';
import { Form, Input, Checkbox, Row, Col } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionGroupFn } from '../lib/store';
import snakeCase from 'lodash/snakeCase';

const QuestionGroupSetting = ({
  id,
  label,
  name,
  description,
  repeatable,
  repeatText,
}) => {
  const namePreffix = `question_group-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  const handleChangeLabel = (e) => {
    const labelValue = e?.target?.value;
    let nameValue = name;
    if (!name.trim() || name === snakeCase(label)) {
      nameValue = snakeCase(labelValue);
    }
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, label: labelValue, name: nameValue };
        }
        return x;
      });
    });
  };

  const handleChangeName = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return {
            ...x,
            name: e?.target?.value,
          };
        }
        return x;
      });
    });
  };

  const handleBlurName = () => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return {
            ...x,
            name: name ? snakeCase(name) : '',
          };
        }
        return x;
      });
    });
  };

  const handleChangeDescription = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, description: e?.target?.value };
        }
        return x;
      });
    });
  };

  const handleChangeRepeatable = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, repeatable: e?.target?.checked };
        }
        return x;
      });
    });
  };

  const handleChangeRepeatText = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return { ...x, repeatText: e?.target?.value };
        }
        return x;
      });
    });
  };

  return (
    <div>
      <Form.Item
        label={UIText.inputQuestionGroupLabelLabel}
        initialValue={label}
        name={`${namePreffix}-label`}
        required
      >
        <Input
          onChange={handleChangeLabel}
          allowClear
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionGroupNameLabel}
        // name={`${namePreffix}-name`}
        required
      >
        <Input
          onChange={handleChangeName}
          onBlur={handleBlurName}
          allowClear
          value={name}
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionGroupDescriptionLabel}
        initialValue={description}
        name={`${namePreffix}-description`}
      >
        <Input.TextArea
          onChange={handleChangeDescription}
          allowClear
          rows={5}
        />
      </Form.Item>
      <Row
        align="bottom"
        gutter={[24, 24]}
      >
        <Col>
          <Form.Item
            name={`${namePreffix}-repeatable`}
            className={styles['input-checkbox-wrapper']}
          >
            <Checkbox
              onChange={handleChangeRepeatable}
              checked={repeatable}
            >
              {' '}
              {UIText.inputRepeatThisGroupCheckbox}
            </Checkbox>
          </Form.Item>
        </Col>
        {repeatable && (
          <Col span={10}>
            <Form.Item
              label={UIText.inputRepeatTextLabel}
              name={`${namePreffix}-repeat_text`}
              initialValue={repeatText}
            >
              <Input
                onChange={handleChangeRepeatText}
                allowClear
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default QuestionGroupSetting;
