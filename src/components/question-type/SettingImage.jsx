import React from 'react';
import { Form, InputNumber, Row, Col } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingImage = ({ id, questionGroupId, limit }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  const updateState = (name, value) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                [name]: value,
              };
            }
            return q;
          });
          return {
            ...qg,
            questions: questions,
          };
        }
        return qg;
      });
    });
  };

  const handleOnLimit = (value) => {
    updateState('limit', value);
  };
  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreImageTypeSettingText}
      </p>
      <Row
        align="middle"
        gutter={[24, 24]}
      >
        <Col span={8}>
          <Form.Item
            label={UIText.inputQuestionImageLimitValidationText}
            name={`${namePreffix}-limit_file_size`}
          >
            <InputNumber
              onChange={handleOnLimit}
              value={limit}
              addonAfter="MB"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default SettingImage;
