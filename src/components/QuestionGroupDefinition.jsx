import React, { useMemo } from 'react';
import { Card, Button, Space, Form, Input, Checkbox } from 'antd';
import { UIStore } from '../lib/store';
import styles from '../styles.module.css';
import { BiShow, BiHide, BiMove } from 'react-icons/bi';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { AddMoveButton, QuestionDefinition } from '.';

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

const QuestionGroupDefinition = ({ index, questionGroup, isLastItem }) => {
  const activeQuestionGroups = UIStore.useState((s) => s.activeQuestionGroups);
  const activeEditQuestionGroups = UIStore.useState(
    (s) => s.activeEditQuestionGroups
  );
  const { id, name, questions } = questionGroup;
  const { buttonAddNewQuestionGroupText } = UIStore.useState((s) => s.UIText);

  const showQuestion = useMemo(() => {
    return activeQuestionGroups.includes(id);
  }, [activeQuestionGroups, id]);

  const isEditQuestionGroup = useMemo(() => {
    return activeEditQuestionGroups.includes(id);
  }, [activeEditQuestionGroups, id]);

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
    <div>
      <AddMoveButton text={buttonAddNewQuestionGroupText} />
      <Card
        key={`${index}-${id}`}
        title={
          <Space>
            <Button
              type="link"
              className={styles['button-icon']}
              icon={<BiMove />}
            />
            {name}
          </Space>
        }
        headStyle={{ textAlign: 'left', padding: '0 12px' }}
        bodyStyle={{ padding: isEditQuestionGroup || showQuestion ? 24 : 0 }}
        loading={false}
        extra={
          <Space>
            {!showQuestion ? (
              <Button
                type="link"
                className={styles['button-icon']}
                onClick={handleShowQuestions}
                icon={<BiShow />}
              />
            ) : (
              <Button
                type="link"
                className={styles['button-icon']}
                onClick={handleHideQuestions}
                icon={<BiHide />}
              />
            )}
            {!isEditQuestionGroup ? (
              <Button
                type="link"
                className={styles['button-icon']}
                onClick={handleEditGroup}
                icon={<TbEdit />}
              />
            ) : (
              <Button
                type="link"
                className={styles['button-icon']}
                onClick={handleCancelEditGroup}
                icon={<TbEditOff />}
              />
            )}
            <Button
              type="link"
              className={styles['button-icon']}
              icon={<RiDeleteBin2Line />}
            />
          </Space>
        }
      >
        {isEditQuestionGroup && <QuestionGroupSetting {...questionGroup} />}
        {showQuestion &&
          questions.map((q, qi) => (
            <QuestionDefinition
              key={`question-definition-${qi}`}
              index={qi}
              question={q}
              isLastItem={qi === questions.length - 1}
            />
          ))}
      </Card>
      {isLastItem && <AddMoveButton text={buttonAddNewQuestionGroupText} />}
    </div>
  );
};

export default QuestionGroupDefinition;
