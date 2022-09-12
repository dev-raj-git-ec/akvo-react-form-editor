import React, { useMemo, useState } from 'react';
import { Card, Tabs } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionFn, questionGroupFn } from '../lib/store';
import data from '../lib/data';
import QuestionSetting from './QuestionSetting';
import QuestionSkipLogic from './QuestionSkipLogic';
import { ButtonAddMove, CardTitle } from '../support';
import { orderBy, maxBy, minBy } from 'lodash';

const QuestionDefinition = ({ index, question, questionGroup, isLastItem }) => {
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const { questions } = questionGroup;
  const UIText = UIStore.useState((s) => s.UIText);
  const {
    buttonAddNewQuestionText,
    buttonCopyQuestionText,
    buttonMoveQuestionText,
  } = UIText;
  const movingQ = UIStore.useState((s) => s.activeMoveQuestion);
  const isCopying = UIStore.useState((s) => s.isCopyingQuestion);
  const activeEditQuestions = UIStore.useState((s) => s.activeEditQuestions);
  const [activeTab, setActiveTab] = useState('setting');
  const { id, questionGroupId, order, name, dependency } = question;

  const allQuestions = questionGroups
    .map((qg) => qg.questions)
    .flatMap((x) => x)
    .map((q) => ({
      ...q,
      questionGroup: questionGroups.find((qg) => q.questionGroupId === qg.id),
    }));

  const dependant = useMemo(() => {
    const dependant = allQuestions.filter(
      (q) => q?.dependency?.filter((d) => d.id === id).length || false
    );

    let disabled = { current: false, last: false };

    const movingQDependency = maxBy(
      movingQ?.dependency?.map((q) => allQuestions.find((a) => a.id === q.id)),
      'questionGroup.order'
    );
    if (movingQDependency?.questionGroup?.order >= questionGroup?.order) {
      disabled = {
        ...disabled,
        current:
          movingQDependency?.questionGroup?.order === questionGroup.order
            ? movingQDependency.order >= order
            : true,
      };
      disabled = {
        ...disabled,
        last:
          movingQDependency?.questionGroup?.order === questionGroup.order
            ? movingQDependency.order >= order + 1
            : true,
      };
    }
    const movingQDependant = minBy(
      allQuestions.filter(
        (q) =>
          q?.dependency?.filter((d) => d.id === movingQ?.id).length || false
      ),
      'questionGroup.order'
    );
    if (movingQDependant?.questionGroup?.order <= questionGroup?.order) {
      disabled = {
        ...disabled,
        current:
          movingQDependant?.questionGroup?.order === questionGroup.order
            ? movingQDependant.order <= order - 1
            : true,
      };
      disabled = {
        ...disabled,
        last:
          movingQDependant?.questionGroup?.order === questionGroup.order
            ? movingQDependant.order <= order
            : true,
      };
    }
    return {
      disabled: disabled,
      dependant: dependant,
    };
  }, [id, order, questionGroup, allQuestions, movingQ]);

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

  const handleCancelMove = () => {
    UIStore.update((s) => {
      s.isCopyingQuestion = false;
      s.activeMoveQuestion = null;
      movingQ === question ? null : question;
    });
  };

  const handleMove = () => {
    UIStore.update((s) => {
      s.activeMoveQuestion =
        movingQ === question && !s.isCopyingQuestion ? null : question;
      s.isCopyingQuestion = false;
    });
  };

  const handleCopy = () => {
    UIStore.update((s) => {
      s.activeMoveQuestion =
        movingQ === question && s.isCopyingQuestion ? null : question;
      s.isCopyingQuestion = !s.isCopyingQuestion;
    });
  };

  const handleDelete = () => {
    const newQuestions = questions
      .filter((q) => q.id !== id)
      .map((q) => {
        if (q.order > order) {
          return { ...q, order: q.order - 1 };
        }
        return q;
      });
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          return { ...qg, questions: newQuestions };
        }
        return qg;
      });
    });
  };

  const handleOnAdd = (prevOrder) => {
    const prevQ = questions.filter((q) => q.order <= prevOrder);
    const nextQ = questions
      .filter((q) => q.order > prevOrder)
      .map((q) => ({
        ...q,
        order: q.order + 1,
      }));
    const newQ = {
      questionGroup: questionGroup,
      prevOrder: prevOrder,
      params: data.clear(['id', 'order', 'questionGroupId'], movingQ),
    };
    const newQuestions = [...prevQ, questionFn.add(newQ), ...nextQ];
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          return { ...qg, questions: orderBy(newQuestions, 'order') };
        }
        return qg;
      });
    });
    UIStore.update((s) => {
      s.activeMoveQuestion = null;
      s.isCopyingQuestion = false;
    });
  };

  const handleOnMove = (prevOrder, lastItem = false) => {
    const currentQ = {
      ...movingQ,
      questionGroupId: questionGroupId,
      order:
        questionGroupId !== movingQ.questionGroupId
          ? prevOrder + 1
          : movingQ.order < prevOrder
          ? prevOrder
          : prevOrder + 1,
    };
    const changedQg = questionGroups
      .filter(
        (qg) => qg.id === movingQ.questionGroupId || qg.id === questionGroupId
      )
      .map((qg) => {
        const addedQ = qg.id === questionGroupId ? currentQ : false;
        let newQuestions = qg.questions.filter((q) => q.id !== movingQ.id);
        if (
          questionGroupId !== movingQ.questionGroupId &&
          newQuestions.length < qg.questions.length
        ) {
          newQuestions = newQuestions.map((q, qi) => ({ ...q, order: qi + 1 }));
        }
        if (
          questionGroupId !== movingQ.questionGroupId &&
          qg.id === questionGroupId
        ) {
          newQuestions = newQuestions.map((x) => {
            if (lastItem) {
              return x;
            }
            if (x.order >= prevOrder + 1) {
              return { ...x, order: x.order + 1 };
            }
            return x;
          });
        }
        if (questionGroupId === movingQ.questionGroupId) {
          newQuestions = newQuestions.map((x) => {
            if (lastItem) {
              if (x.order > movingQ.order) {
                return { ...x, order: x.order - 1 };
              }
              return x;
            }
            if (
              prevOrder > movingQ.order &&
              x.order > movingQ.order &&
              x.order <= prevOrder
            ) {
              return { ...x, order: x.order - 1 };
            }
            if (
              prevOrder < movingQ.order &&
              x.order < movingQ.order &&
              x.order >= prevOrder + 1
            ) {
              return { ...x, order: x.order + 1 };
            }
            return x;
          });
        }
        newQuestions = addedQ ? [...newQuestions, addedQ] : newQuestions;
        return {
          ...qg,
          questions: orderBy(newQuestions, 'order'),
        };
      });
    let oldQg = questionGroups.filter(
      (qg) => qg.id !== movingQ.questionGroupId
    );
    oldQg =
      movingQ.questionGroupId !== questionGroupId
        ? oldQg.filter((qg) => qg.id !== questionGroupId)
        : oldQg;
    questionGroupFn.store.update((s) => {
      s.questionGroups = orderBy([...oldQg, ...changedQg], 'order');
    });
    UIStore.update((s) => {
      s.activeMoveQuestion = null;
    });
  };

  const rightButtons = [
    {
      type: 'copy-button',
      onClick: handleCopy,
    },
    {
      type: 'delete-button',
      onClick: handleDelete,
      disabled: (!index && isLastItem) || dependant.dependant.length,
    },
  ];

  const leftButtons = [
    {
      type: 'move-button',
      onClick: handleMove,
      disabled: !index && isLastItem,
    },
    {
      type: 'show-button',
      isExpand: isEditQuestion,
      onClick: handleEdit,
      onCancel: handleCancelEdit,
    },
  ];

  return (
    <div>
      <ButtonAddMove
        text={
          movingQ
            ? isCopying
              ? buttonCopyQuestionText
              : buttonMoveQuestionText
            : buttonAddNewQuestionText
        }
        disabled={
          (movingQ === question && !isCopying) ||
          (movingQ?.order + 1 === order &&
            movingQ?.questionGroupId === questionGroupId &&
            !isCopying) ||
          dependant.disabled.current
        }
        handleCancelMove={handleCancelMove}
        movingItem={movingQ}
        isCopying={isCopying}
        handleOnAdd={() => handleOnAdd(order - 1)}
        handleOnMove={() =>
          isCopying ? handleOnAdd(order - 1) : handleOnMove(order - 1)
        }
      />
      <Card
        key={`${index}-${id}`}
        title={
          <CardTitle
            title={`${questionGroup.order}.${order}. ${name}`}
            buttons={leftButtons}
          />
        }
        headStyle={{
          textAlign: 'left',
          padding: '0 12px',
          backgroundColor: movingQ?.id === id ? '#FFF2CA' : '#FFF',
          border: movingQ?.id === id ? '1px dashed #ffc107' : 'none',
        }}
        bodyStyle={{
          borderTop: isEditQuestion ? '1px solid #f3f3f3' : 'none',
          padding: isEditQuestion ? 24 : 0,
        }}
        loading={false}
        extra={
          <CardTitle
            buttons={rightButtons}
            dependency={allQuestions.filter((q) =>
              dependency?.find((d) => d.id === q.id)
            )}
          />
        }
      >
        {isEditQuestion && (
          <div>
            <Tabs
              defaultActiveKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              tabBarGutter={24}
              className={styles['tabs-wrapper']}
            >
              <Tabs.TabPane
                tab={UIText.questionSettingTabPane}
                key="setting"
              />
              <Tabs.TabPane
                tab={UIText.questionSkipLogicTabPane}
                key="skip-logic"
              />
              {/* <Tabs.TabPane
                tab={UIText.questionExtraTabPane}
                key="extra"
              />
              <Tabs.TabPane
                tab={UIText.questionTranslationTabPane}
                key="translation"
              /> */}
            </Tabs>
            {activeTab === 'setting' && (
              <QuestionSetting
                question={question}
                dependant={dependant.dependant}
              />
            )}
            {activeTab === 'skip-logic' && (
              <QuestionSkipLogic question={question} />
            )}
          </div>
        )}
      </Card>
      {isLastItem && (
        <ButtonAddMove
          text={
            movingQ
              ? isCopying
                ? buttonCopyQuestionText
                : buttonMoveQuestionText
              : buttonAddNewQuestionText
          }
          disabled={
            (movingQ === question && !isCopying) || dependant.disabled.last
          }
          movingItem={movingQ}
          handleCancelMove={handleCancelMove}
          handleOnAdd={() => handleOnAdd(order)}
          handleOnMove={() =>
            isCopying ? handleOnAdd(order) : handleOnMove(order, true)
          }
        />
      )}
    </div>
  );
};

export default QuestionDefinition;
