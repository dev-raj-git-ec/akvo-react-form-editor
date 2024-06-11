import React, { useState, useMemo, useCallback } from 'react';
import styles from '../styles.module.css';
import {
  MdOutlineAddCircleOutline,
  MdOutlineRemoveCircleOutline,
} from 'react-icons/md';
import { Button, Col, Divider, Form, Radio, Row, Select, Space } from 'antd';
import {
  UIStore,
  generateId,
  questionGroupFn,
  questionType,
} from '../lib/store';

const allowedQuestionTypes = [
  questionType.option,
  questionType.multiple_option,
];

const QuestionPrefilled = ({
  id,
  questionGroupId,
  options = [],
  mode = null,
}) => {
  const [isPrefilled, setIsPrefilled] = useState(0);
  const [settings, setSettings] = useState([]);

  const { UIText } = UIStore.useState((s) => s);

  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );
  const namePreffix = `prefilled-${id}`;

  const allOptionTypeQuestions = useMemo(() => {
    return (
      questionGroups
        ?.flatMap((qg) => qg.questions)
        ?.filter((q) => allowedQuestionTypes.includes(q.type) && q?.id < id)
        ?.map((q) => ({
          value: q.name,
          label: q.label,
        })) || []
    );
  }, [id, questionGroups]);

  const onChangeAnswer = (sid, answer) => {
    const updatedSettings = settings.map((s) => {
      if (s.id === sid) {
        return { ...s, answer };
      }
      return s;
    });
    setSettings(updatedSettings);
  };

  const onChangeQuestion = (sid, value) => {
    const question = questionGroups
      .flatMap((qg) => qg.questions)
      .find((q) => q.name === value);
    if (question) {
      const existingAnswers = settings
        .filter((s) => s.question === value)
        .map((s) => s.answer);
      const answerList =
        question?.options?.filter((o) => !existingAnswers.includes(o?.value)) ||
        [];
      const updatedSettings = settings.map((s) => {
        if (s.id === sid) {
          return { ...s, question: value, answerList };
        }
        return s;
      });
      setSettings(updatedSettings);
    }
  };

  const onClearQuestion = (sid) => {
    const updatedSettings = settings.map((s) => {
      if (s.id === sid) {
        return { ...s, answer: null, value: null, answerList: [] };
      }
      return s;
    });
    setSettings(updatedSettings);
  };

  const handleOnAddSettings = () => {
    setSettings([
      ...settings,
      {
        id: generateId(),
        question: null,
        answer: null,
        answerList: [],
        value: null,
      },
    ]);
  };

  const handleOnRemoveSettings = (id) => {
    let removedSettings = settings.filter((s) => s.id !== id);

    const removedItem = settings.find((s) => s.id === id);
    const removedAnswer = removedItem.answerList.find(
      (a) => a?.value === removedItem.answer
    );
    if (removedAnswer) {
      removedSettings = removedSettings.map((s) => {
        if (!s.answerList.map((a) => a.value).includes(removedAnswer.value)) {
          return { ...s, answerList: [...s.answerList, removedAnswer] };
        }
        return s;
      });
    }
    if (removedSettings.length === 0) {
      setIsPrefilled(0);
    }
    setSettings(removedSettings);
  };

  const onChangeConfirm = (e) => {
    if (e.target.value === 0) {
      setSettings([]);
    }
    if (e.target.value === 1 && settings.length === 0) {
      handleOnAddSettings();
    }
    setIsPrefilled(e.target.value);
  };

  const onChangeDefaultValue = (sid, v) => {
    const updatedSettings = settings.map((s) => {
      if (s.id === sid) {
        return { ...s, value: v };
      }
      return s;
    });
    setSettings(updatedSettings);
    const pre = updatedSettings.reduce((acc, item) => {
      if (!acc[item.question]) {
        acc[item.question] = {};
      }
      if (!acc[item.question][item.answer]) {
        acc[item.question][item.answer] = [];
      }
      acc[item.question][item.answer].push(item.value);
      return acc;
    }, {});
    updatePreState(pre);
  };

  const updatePreState = useCallback(
    (pre = {}) => {
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id) {
                return {
                  ...q,
                  pre,
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
    },
    [id, questionGroupId]
  );

  if (!allOptionTypeQuestions.length) {
    return null;
  }

  return (
    <div className={styles['more-question-setting-text']}>
      <Divider
        orientation="left"
        orientationMargin={0}
      >
        <Space>
          {UIText.prefilledQuestionTitle}
          <Radio.Group
            onChange={onChangeConfirm}
            value={isPrefilled}
            name={`${namePreffix}_confirm`}
          >
            <Radio value={1}>{UIText.prefilledYesText}</Radio>
            <Radio value={0}>{UIText.prefilledNoText}</Radio>
          </Radio.Group>
        </Space>
      </Divider>
      {settings.map((s) => (
        <Row
          gutter={[16, 8]}
          align="middle"
          key={`${namePreffix}_${s.id}`}
        >
          <Col span={20}>
            <Row gutter={[16, 8]}>
              <Col lg={8}>
                <Form.Item label={UIText.prefilledSourceQuestion}>
                  <Select
                    showSearch
                    name={`${namePreffix}_question_${s.id}`}
                    placeholder={UIText.prefilledSQPlaceholder}
                    className={styles['select-dropdown']}
                    options={allOptionTypeQuestions}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                    onChange={(v) => onChangeQuestion(s.id, v)}
                    value={s.question}
                    onClear={() => onClearQuestion(s.id)}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label={UIText.prefilledSourceAnswer}>
                  <Select
                    showSearch
                    name={`${namePreffix}_answer_${s.id}`}
                    placeholder={UIText.prefilledSAPlaceholder}
                    className={styles['select-dropdown']}
                    options={s.answerList}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                    onChange={(v) => onChangeAnswer(s.id, v)}
                    value={s.answer}
                  />
                </Form.Item>
              </Col>
              <Col lg={8}>
                <Form.Item label={UIText.prefilledDefaultValue}>
                  <Select
                    showSearch
                    name={`${namePreffix}_value_${s.id}`}
                    placeholder={UIText.prefilledDVPlaceholder}
                    className={styles['select-dropdown']}
                    options={options}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                    disabled={s.answerList.length === 0}
                    onChange={(v) => onChangeDefaultValue(s.id, v)}
                    value={s.value}
                    mode={mode}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Button
              type="link"
              className={styles['button-icon']}
              icon={<MdOutlineAddCircleOutline />}
              onClick={handleOnAddSettings}
              disabled={s.answerList.length === 0}
            />
            <Button
              type="link"
              className={styles['button-icon']}
              icon={<MdOutlineRemoveCircleOutline />}
              onClick={() => handleOnRemoveSettings(s.id)}
            />
          </Col>
        </Row>
      ))}
      {settings.length > 0 && <Divider />}
    </div>
  );
};

export default QuestionPrefilled;
