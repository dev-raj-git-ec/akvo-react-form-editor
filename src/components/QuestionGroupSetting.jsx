import React, { useState, useMemo } from 'react';
import { Form, Input, Checkbox, Row, Col, Typography } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionGroupFn, ErrorStore } from '../lib/store';
import snakeCase from 'lodash/snakeCase';

const { Text } = Typography;

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
  const [nameFieldValue, setNameFieldValue] = useState(
    name ? snakeCase(name) : snakeCase(label)
  );
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );
  const questionGroupErrors = ErrorStore.useState((s) => s.questionGroupErrors);

  const currentGroupError = useMemo(() => {
    const findError = questionGroupErrors.find((e) => e.id === id);
    if (findError) {
      return findError;
    }
    return false;
  }, [id, questionGroupErrors]);

  const checkIfGroupNameExist = (val) => {
    const checkVal = snakeCase(val);
    const isNameExist = questionGroups
      .filter((qg) => qg.id !== id)
      .find((qg) => qg.name === checkVal);
    if (isNameExist) {
      // add to error list
      ErrorStore.update((s) => {
        s.questionGroupErrors = [
          ...s.questionGroupErrors,
          { id: id, message: `${checkVal} exist.` },
        ];
      });
    } else {
      // remove from error list
      ErrorStore.update((s) => {
        s.questionGroupErrors = s.questionGroupErrors.filter(
          (e) => e.id !== id
        );
      });
    }
  };

  const handleChangeLabel = (e) => {
    const labelValue = e?.target?.value;
    let nameValue = name;
    if (!name.trim() || name === snakeCase(label)) {
      nameValue = snakeCase(labelValue);
    }
    setNameFieldValue(nameValue);
    checkIfGroupNameExist(nameValue);
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
    const val = e?.target?.value || '';
    setNameFieldValue(val);
    checkIfGroupNameExist(val);
  };

  const handleBlurName = () => {
    setNameFieldValue(nameFieldValue ? snakeCase(nameFieldValue) : '');
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((x) => {
        if (x.id === id) {
          return {
            ...x,
            name: nameFieldValue ? snakeCase(nameFieldValue) : '',
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
        initialValue={label || name}
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
          value={nameFieldValue}
        />
      </Form.Item>
      {currentGroupError?.id ? (
        <div className={styles['field-error-wrapper']}>
          <Text type="danger">{currentGroupError.message}</Text>
        </div>
      ) : (
        ''
      )}
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
