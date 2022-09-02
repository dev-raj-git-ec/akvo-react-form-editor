import React, { useMemo } from 'react';
import { Card, Space } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';
import { QuestionGroupSetting, QuestionDefinition } from '.';
import { AddMoveButton, CardTitle, CardExtraButton } from '../support';
import { orderBy } from 'lodash';

const QuestionGroupDefinition = ({ index, questionGroup, isLastItem }) => {
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const movingQg = UIStore.useState((s) => s.activeMoveQuestionGroup);
  const activeQuestionGroups = UIStore.useState((s) => s.activeQuestionGroups);
  const activeEditQuestionGroups = UIStore.useState(
    (s) => s.activeEditQuestionGroups
  );

  const { id, name, questions, order } = questionGroup;
  const { buttonAddNewQuestionGroupText, buttonMoveQuestionGroupText } =
    UIStore.useState((s) => s.UIText);

  const showQuestion = useMemo(() => {
    return activeQuestionGroups.includes(id);
  }, [activeQuestionGroups, id]);

  const isEditQuestionGroup = useMemo(() => {
    return activeEditQuestionGroups.includes(id);
  }, [activeEditQuestionGroups, id]);

  const handleHideQuestions = () => {
    UIStore.update((s) => {
      s.activeQuestionGroups = activeQuestionGroups.filter(
        (qgId) => qgId !== id
      );
    });
  };

  const handleCancelEditGroup = () => {
    UIStore.update((s) => {
      s.activeEditQuestionGroups = activeEditQuestionGroups.filter(
        (qgId) => qgId !== id
      );
    });
  };

  const handleShowQuestions = () => {
    UIStore.update((s) => {
      s.activeQuestionGroups = [...activeQuestionGroups, id];
    });
    handleCancelEditGroup();
  };

  const handleEditGroup = () => {
    UIStore.update((s) => {
      s.activeEditQuestionGroups = [...activeEditQuestionGroups, id];
    });
    handleHideQuestions();
  };

  const handleCancelMove = () => {
    UIStore.update((s) => {
      s.activeMoveQuestionGroup = null;
    });
  };

  const handleMove = () => {
    UIStore.update((s) => {
      s.activeMoveQuestionGroup =
        movingQg === questionGroup ? null : questionGroup;
    });
  };

  const handleDelete = () => {
    const newQuestionGroups = questionGroups
      .filter((qg) => id !== qg.id)
      .map((qg) => {
        if (qg.order > order) {
          return { ...qg, order: qg.order - 1 };
        }
        return qg;
      });
    questionGroupFn.store.update((s) => {
      s.questionGroups = newQuestionGroups;
    });
  };

  const handleOnAdd = (prevOrder) => {
    const prevQg = questionGroups.filter((qg) => qg.order <= prevOrder);
    const nextQg = questionGroups
      .filter((qg) => qg.order > prevOrder)
      .map((qg) => ({
        ...qg,
        order: qg.order + 1,
      }));
    const newQuestionGroups = [
      ...prevQg,
      questionGroupFn.add({ prevOrder: prevOrder }),
      ...nextQg,
    ];
    questionGroupFn.store.update((s) => {
      s.questionGroups = newQuestionGroups;
    });
  };

  const handleOnMove = (prevOrder, lastItem = false) => {
    const currentQg = {
      ...movingQg,
      order: movingQg.order < prevOrder ? prevOrder : prevOrder + 1,
    };
    const orderedQg = questionGroups
      .filter((qg) => qg.order !== movingQg.order)
      .map((x) => {
        if (lastItem) {
          if (x.order > movingQg.order) {
            return { ...x, order: x.order - 1 };
          }
          return x;
        }
        if (
          prevOrder > movingQg.order &&
          x.order > movingQg.order &&
          x.order <= prevOrder
        ) {
          return { ...x, order: x.order - 1 };
        }
        if (
          prevOrder < movingQg.order &&
          x.order < movingQg.order &&
          x.order >= prevOrder + 1
        ) {
          return { ...x, order: x.order + 1 };
        }
        return x;
      });
    questionGroupFn.store.update((s) => {
      s.questionGroups = orderBy([...orderedQg, currentQg], 'order');
    });
    UIStore.update((s) => {
      s.activeMoveQuestionGroup = null;
    });
  };

  const leftButtons = [
    {
      type: 'delete-button',
      onClick: handleDelete,
      disabled: !index && isLastItem,
    },
    {
      type: 'edit-button',
      isExpand: isEditQuestionGroup,
      onClick: handleEditGroup,
      onCancel: handleCancelEditGroup,
    },
  ];

  const rightButtons = [
    {
      type: 'move-button',
      onClick: handleMove,
      onCancel: handleHideQuestions,
      disabled: !index && isLastItem,
    },
    {
      type: 'show-button',
      isExpand: showQuestion,
      onClick: handleShowQuestions,
      onCancel: handleHideQuestions,
    },
  ];

  return (
    <div>
      <AddMoveButton
        text={
          movingQg ? buttonMoveQuestionGroupText : buttonAddNewQuestionGroupText
        }
        disabled={movingQg === questionGroup || movingQg?.order + 1 === order}
        movingItem={movingQg}
        handleCancelMove={handleCancelMove}
        handleOnAdd={() => handleOnAdd(order - 1)}
        handleOnMove={() => handleOnMove(order - 1)}
      />
      <Card
        key={`${index}-${id}`}
        title={
          <Space>
            {rightButtons.map((cfg) => (
              <CardExtraButton
                key={`${cfg.type}-${id}`}
                type={cfg.type}
                isExpand={cfg.isExpand}
                onClick={() => cfg.onClick()}
                onCancel={() => cfg.onCancel()}
                disabled={cfg?.disabled}
              />
            ))}
            <div className="arfe-question-group-title">
              {order}. {name}
            </div>
          </Space>
        }
        headStyle={{
          textAlign: 'left',
          padding: '0 12px',
          backgroundColor: movingQg?.id === id ? '#FFF2CA' : '#FFF',
          border: movingQg?.id === id ? '1px dashed #ffc107' : 'none',
        }}
        bodyStyle={{
          padding: isEditQuestionGroup || showQuestion ? 24 : 0,
          borderTop:
            isEditQuestionGroup || showQuestion ? '1px solid #f3f3f3' : 'none',
        }}
        loading={false}
        extra={
          <Space>
            {leftButtons.map((cfg) => (
              <CardExtraButton
                key={`${cfg.type}-${id}`}
                type={cfg.type}
                isExpand={cfg.isExpand}
                onClick={() => cfg.onClick()}
                onCancel={() => cfg.onCancel()}
                disabled={cfg?.disabled}
              />
            ))}
          </Space>
        }
      >
        {isEditQuestionGroup && (
          <div>
            <QuestionGroupSetting {...questionGroup} />
          </div>
        )}
        {showQuestion &&
          questions.map((q, qi) => (
            <QuestionDefinition
              key={`question-definition-${qi}`}
              index={qi}
              question={q}
              questionGroup={questionGroup}
              isLastItem={qi === questions.length - 1}
            />
          ))}
      </Card>
      {isLastItem && (
        <AddMoveButton
          text={
            movingQg
              ? buttonMoveQuestionGroupText
              : buttonAddNewQuestionGroupText
          }
          disabled={movingQg === questionGroup}
          movingItem={movingQg}
          handleCancelMove={handleCancelMove}
          handleOnAdd={() => handleOnAdd(order)}
          handleOnMove={() => handleOnMove(order, true)}
        />
      )}
    </div>
  );
};

export default QuestionGroupDefinition;
