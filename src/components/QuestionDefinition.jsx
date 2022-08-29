import React, { useMemo } from 'react';
import { Card, Space } from 'antd';
import { UIStore } from '../lib/store';
import { QuestionSetting } from '.';
import { AddMoveButton, CardTitle, CardExtraButton } from '../support';

const QuestionDefinition = ({ index, question, isLastItem }) => {
  const { buttonAddNewQuestionText } = UIStore.useState((s) => s.UIText);
  const activeEditQuestions = UIStore.useState((s) => s.activeEditQuestions);
  const { id, name } = question;

  const isEditQuestion = useMemo(() => {
    return activeEditQuestions.includes(id);
  }, [activeEditQuestions, id]);

  const handleEdit = () => {
    UIStore.update((s) => {
      s.activeEditQuestions = [...activeEditQuestions, id];
    });
  };

  const handleCancelEdit = () => {
    UIStore.update((s) => {
      s.activeEditQuestions = activeEditQuestions.filter((qId) => qId !== id);
    });
  };

  const extraButtons = [
    {
      type: 'edit-button',
      isExpand: isEditQuestion,
      onClick: handleEdit,
      onCancel: handleCancelEdit,
    },
    {
      type: 'delete-button',
      onClick: () => console.log('delete'),
    },
  ];

  return (
    <div>
      <AddMoveButton text={buttonAddNewQuestionText} />
      <Card
        key={`${index}-${id}`}
        title={
          <CardTitle
            title={name}
            numbering={index + 1}
            onMoveClick={() => console.log('move')}
          />
        }
        headStyle={{ textAlign: 'left', padding: '0 12px' }}
        bodyStyle={{ padding: isEditQuestion ? 24 : 0 }}
        loading={false}
        extra={
          <Space>
            {extraButtons.map((cfg) => (
              <CardExtraButton
                key={`${cfg.type}-${id}`}
                type={cfg.type}
                isExpand={cfg.isExpand}
                onClick={cfg.onClick}
                onCancel={cfg.onCancel}
              />
            ))}
          </Space>
        }
      >
        {isEditQuestion && (
          <QuestionSetting
            handleCancelEdit={handleCancelEdit}
            {...question}
          />
        )}
      </Card>
      {isLastItem && <AddMoveButton text={buttonAddNewQuestionText} />}
    </div>
  );
};

export default QuestionDefinition;
