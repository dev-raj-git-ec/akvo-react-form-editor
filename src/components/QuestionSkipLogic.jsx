import React from 'react';
import { Form, Select, Row, Col, Input } from 'antd';
import styles from '../styles.module.css';
import { CardExtraButton } from '../support';
import { UIStore } from '../lib/store';

const QuestionSkipLogic = (question) => {
  const { id } = question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <Form.Item
        label={UIText.inputQuestionDependentToLabel}
        initialValue={''}
        name={`${namePreffix}-dependent_to`}
      >
        <Row
          align="middle"
          justify="space-between"
        >
          <Col span={23}>
            <Select
              className={styles['select-dropdown']}
              options={[]}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
            />
          </Col>
          <Col
            span={1}
            align="end"
          >
            <CardExtraButton
              type="delete-button"
              onClick={() => console.log('delete')}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionDependentLogicLabel}
        initialValue={''}
        name={`${namePreffix}-dependent_logic`}
      >
        <Select
          className={styles['select-dropdown']}
          options={[]}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionDependentAnswerLabel}
        initialValue={''}
        name={`${namePreffix}-dependent_answer`}
      >
        <Input />
      </Form.Item>
    </div>
  );
};

export default QuestionSkipLogic;
