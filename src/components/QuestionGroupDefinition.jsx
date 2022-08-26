import React, { useMemo } from 'react';
import { Card, Button, Space, Form, Input, Checkbox } from 'antd';
import { UIStore } from '../lib/store';
import FormItem from 'antd/es/form/FormItem';

const QuestionGroupSetting = ({ id, name, description }) => {
  const namePreffix = `question_group-${id}`;
  return (
    <div>
      <Form.Item
        label="Question Group Name"
        initialValue={name}
        name={`${namePreffix}-name`}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Question Group Description"
        initialValue={description}
        name={`${namePreffix}-description`}
      >
        <Input.TextArea rows={5} />
      </Form.Item>
      <FormItem
        initialValue={false}
        name={`${namePreffix}-repeatable`}
      >
        <Checkbox>Repeat this group</Checkbox>
      </FormItem>
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
            <Button onClick={handleShowQuestions}>Show Questions</Button>
          ) : (
            <Button onClick={handleHideQuestions}>Hide Questions</Button>
          )}
          {!isEditQuestionGroup ? (
            <Button onClick={handleEditGroup}>Edit Group</Button>
          ) : (
            <Button onClick={handleCancelEditGroup}>Cancel Edit Group</Button>
          )}
          <Button>Delete</Button>
        </Space>
      }
    >
      {isEditQuestionGroup && <QuestionGroupSetting {...questionGroup} />}
      {showQuestion && 'Show Questions here...'}
    </Card>
  );
};

export default QuestionGroupDefinition;
