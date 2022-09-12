import React, { useMemo, useState } from 'react';
import { Card, Alert, Space, Button } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';
import QuestionGroupSetting from './QuestionGroupSetting';
import QuestionDefinition from './QuestionDefinition';
import { AddMoveButton, CardTitle } from '../support';
import { orderBy, maxBy, minBy } from 'lodash';

const QuestionGroupDefinition = ({ index, questionGroup, isLastItem }) => {
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const movingQg = UIStore.useState((s) => s.activeMoveQuestionGroup);
  const { activeQuestionGroups, activeEditQuestionGroups } = UIStore.useState(
    (s) => s
  );
  const [toBeDeleted, setToBeDeleted] = useState(false);
  const UIText = UIStore.useState((s) => s.UIText);
  const { alertDeleteQuestionGroup } = UIText;

  const { id, name, questions, order } = questionGroup;
  const questionIds = questions.map((q) => q.id);
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
    setToBeDeleted(true)
  };

  const handleConfirmDelete = () => {
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

  const handleCancelDelete = () => {
    setToBeDeleted(false);
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

  const dependant = useMemo(() => {
    const allQ = questionGroups
      .map((qg) => qg.questions)
      .flatMap((x) => x)
      .map((q) => ({
        ...q,
        questionGroup: questionGroups.find((qg) => q.questionGroupId === qg.id),
      }));
    const dependencies = allQ.filter(
      (q) =>
        q?.dependency?.filter((d) => questionIds.find((qid) => qid === d.id))
          .length || false
    );

    const movingQids = movingQg?.questions?.map((q) => q.id) || [];
    const movingQ = movingQg?.questions?.filter((q) => {
      const selfDependency =
        q?.dependency?.filter((d) => movingQids.includes(d.id))?.length || 0;
      return selfDependency;
    });

    let disabled = { current: false, last: false };

    const movingQDependency = maxBy(
      movingQ
        ?.map(
          (q) =>
            q?.dependency?.map((q) => allQ.find((a) => a.id === q.id)) || []
        )
        ?.flatMap((q) => q) || [],
      'questionGroup.order'
    );

    if (movingQDependency?.questionGroup?.order >= order) {
      disabled = {
        current: true,
        last: true,
      };
    }

    const movingQDependant = minBy(
      allQ.filter(
        (q) =>
          q?.dependency?.filter((d) => movingQ?.find((qs) => qs.id === d.id))
            .length || false
      ),
      'questionGroup.order'
    );

    if (movingQDependant?.questionGroup?.order < order) {
      disabled = {
        current: true,
        last: true,
      };
    }

    return {
      disabled: disabled,
      dependant: dependencies,
    };
  }, [questionGroups, questionIds, movingQg, order]);

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
        disabled={
          movingQg === questionGroup ||
          movingQg?.order + 1 === order ||
          dependant.disabled.current
        }
        movingItem={movingQg}
        handleCancelMove={handleCancelMove}
        handleOnAdd={() => handleOnAdd(order - 1)}
        handleOnMove={() => handleOnMove(order - 1)}
      />
      <Card
        key={`${index}-${id}`}
        title={
          <CardTitle
            buttons={rightButtons}
            title={`${order}. ${name}`}
          />
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
        extra={<CardTitle buttons={leftButtons} />}
      >
        {toBeDeleted && (
          <Alert
            message={alertDeleteQuestionGroup}
            type="warning"
            action={
              <Space direction="horizontal">
                <Button
                  size="small"
                  type="primary"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  danger
                  type="ghost"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </Button>
              </Space>
            }
            closable
          />
        )}
        {isEditQuestionGroup && <QuestionGroupSetting {...questionGroup} />}
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
          disabled={movingQg === questionGroup || dependant.disabled.last}
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
