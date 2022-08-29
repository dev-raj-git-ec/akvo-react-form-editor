import React, { useMemo } from 'react';
import { Card, Button, Space, Form, Input, Checkbox } from 'antd';
import { UIStore } from '../lib/store';
import styles from '../styles.module.css';
import { BiShow, BiHide } from 'react-icons/bi';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import { RiDeleteBin2Line } from 'react-icons/ri';

const QuestionGroupSetting = ({ id, name, description }) => {
  const namePreffix = `question_group-${id}`;
  const {
    inputQuestionGroupNameLabel,
    inputQuestionGroupDescriptionLabel,
    inputRepeatThisGroupCheckbox,
  } = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <Form.Item
        label={inputQuestionGroupNameLabel}
        initialValue={name}
        name={`${namePreffix}-name`}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={inputQuestionGroupDescriptionLabel}
        initialValue={description}
        name={`${namePreffix}-description`}
      >
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item
        initialValue={false}
        name={`${namePreffix}-repeatable`}
        className={styles['question-group-repeatable']}
      >
        <Checkbox> {inputRepeatThisGroupCheckbox}</Checkbox>
      </Form.Item>
    </div>
  );
};

const QuestionGroupDefinition = ({ index, questionGroup }) => {
  const activeQuestionGroups = UIStore.useState((s) => s.activeQuestionGroups);
  const activeEditQuestionGroups = UIStore.useState(
    (s) => s.activeEditQuestionGroups
  );
  const { id, name } = questionGroup;

  const showQuestion = useMemo(() => {
    return activeQuestionGroups.includes(id);
  }, [activeQuestionGroups]);

  const isEditQuestionGroup = useMemo(() => {
    return activeEditQuestionGroups.includes(id);
  }, [activeEditQuestionGroups]);

  const handleShowQuestions = () => {
    UIStore.update((s) => {
      s.activeQuestionGroups = [...activeQuestionGroups, id];
    });
  };

  const handleHideQuestions = () => {
    UIStore.update((s) => {
      s.activeQuestionGroups = activeQuestionGroups.filter(
        (qgId) => qgId !== id
      );
    });
  };

  const handleEditGroup = () => {
    UIStore.update((s) => {
      s.activeEditQuestionGroups = [...activeEditQuestionGroups, id];
    });
  };

  const handleCancelEditGroup = () => {
    UIStore.update((s) => {
      s.activeEditQuestionGroups = activeEditQuestionGroups.filter(
        (qgId) => qgId !== id
      );
    });
  };

  return (
    <Card
      key={`${index}-${id}`}
      title={name}
      headStyle={{ textAlign: 'left' }}
      bodyStyle={{ padding: isEditQuestionGroup || showQuestion ? 24 : 0 }}
      loading={false}
      extra={
        <Space>
          {!showQuestion ? (
            <Button
              type="link"
              className={styles['icon-button']}
              onClick={handleShowQuestions}
              icon={<BiShow />}
            />
          ) : (
            <Button
              type="link"
              className={styles['icon-button']}
              onClick={handleHideQuestions}
              icon={<BiHide />}
            />
          )}
          {!isEditQuestionGroup ? (
            <Button
              type="link"
              className={styles['icon-button']}
              onClick={handleEditGroup}
              icon={<TbEdit />}
            />
          ) : (
            <Button
              type="link"
              className={styles['icon-button']}
              onClick={handleCancelEditGroup}
              icon={<TbEditOff />}
            />
          )}
          <Button
            type="link"
            className={styles['icon-button']}
            icon={<RiDeleteBin2Line />}
          />
        </Space>
      }
    >
      {isEditQuestionGroup && <QuestionGroupSetting {...questionGroup} />}
      {showQuestion && 'Show Questions here...'}
    </Card>
  );
};

export default QuestionGroupDefinition;
