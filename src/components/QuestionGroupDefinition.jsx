import React, { useMemo } from 'react';
import { Card, Space } from 'antd';
import { UIStore } from '../lib/store';
import { QuestionGroupSetting, QuestionDefinition } from '.';
import { AddMoveButton, CardTitle, CardExtraButton } from '../support';

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

  const extraButtons = [
    {
      type: 'show-button',
      isExpand: showQuestion,
      onClick: handleShowQuestions,
      onCancel: handleHideQuestions,
    },
    {
      type: 'edit-button',
      isExpand: isEditQuestionGroup,
      onClick: handleEditGroup,
      onCancel: handleCancelEditGroup,
    },
    {
      type: 'delete-button',
      onClick: () => console.log('delete'),
    },
  ];

  return (
    <div>
      <AddMoveButton text={buttonAddNewQuestionGroupText} />
      <Card
        key={`${index}-${id}`}
        title={
          <CardTitle
            title={name}
            onMoveClick={() => console.log('move')}
          />
        }
        headStyle={{ textAlign: 'left', padding: '0 12px' }}
        bodyStyle={{ padding: isEditQuestionGroup || showQuestion ? 24 : 0 }}
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
        {isEditQuestionGroup && (
          <QuestionGroupSetting
            handleCancelEditGroup={handleCancelEditGroup}
            {...questionGroup}
          />
        )}
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
