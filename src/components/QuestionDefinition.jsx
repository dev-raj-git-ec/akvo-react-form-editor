import React, { useMemo, useState } from 'react';
import { Card, Space, Tabs, Form } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionFn, questionGroupFn } from '../lib/store';
import { QuestionSetting, QuestionSkipLogic } from '.';
import {
  AddMoveButton,
  CardTitle,
  CardExtraButton,
  SaveButton,
} from '../support';
import { orderBy } from 'lodash';

const QuestionDefinition = ({ index, question, questionGroup, isLastItem }) => {
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const form = Form.useFormInstance();
  const { questions } = questionGroup;
  const UIText = UIStore.useState((s) => s.UIText);
  const { buttonAddNewQuestionText, buttonMoveQuestionText } = UIText;
  const movingQ = UIStore.useState((s) => s.activeMoveQuestion);
  const activeEditQuestions = UIStore.useState((s) => s.activeEditQuestions);
  const [activeTab, setActiveTab] = useState('setting');
  const { id, questionGroupId, order, name } = question;

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
      s.activeMoveQuestion = null;
      movingQ === question ? null : question;
    });
  };

  const handleMove = () => {
    UIStore.update((s) => {
      s.activeMoveQuestion = movingQ === question ? null : question;
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
    const newQuestions = [
      ...prevQ,
      questionFn.add({ questionGroup: questionGroup, prevOrder: prevOrder }),
      ...nextQ,
    ];
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          return { ...qg, questions: orderBy(newQuestions, 'order') };
        }
        return qg;
      });
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
      type: 'delete-button',
      onClick: handleDelete,
      disabled: !index && isLastItem,
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
      <AddMoveButton
        text={movingQ ? buttonMoveQuestionText : buttonAddNewQuestionText}
        disabled={
          movingQ === question ||
          (movingQ?.order + 1 === order &&
            movingQ?.questionGroupId === questionGroupId)
        }
        handleCancelMove={handleCancelMove}
        movingItem={movingQ}
        handleOnAdd={() => handleOnAdd(order - 1, true)}
        handleOnMove={() => handleOnMove(order - 1)}
      />
      <Card
        key={`${index}-${id}`}
        title={
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
            <div className="arfe-question-group-title">
              {order}. {name}
            </div>
          </Space>
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
          </Space>
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
            {activeTab === 'setting' && <QuestionSetting question={question} />}
            {activeTab === 'skip-logic' && (
              <QuestionSkipLogic question={question} />
            )}
            <div>
              <SaveButton
                onClickSave={() => console.log(question)}
                onClickCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}
      </Card>
      {isLastItem && (
        <AddMoveButton
          text={movingQ ? buttonMoveQuestionText : buttonAddNewQuestionText}
          disabled={movingQ === question}
          movingItem={movingQ}
          handleCancelMove={handleCancelMove}
          handleOnAdd={() => handleOnAdd(order, true)}
          handleOnMove={() => handleOnMove(order, true)}
        />
      )}
    </div>
  );
};

export default QuestionDefinition;
