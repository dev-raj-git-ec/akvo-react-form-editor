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
  const form = Form.useFormInstance();
  const { questions } = questionGroup;
  const UIText = UIStore.useState((s) => s.UIText);
  const movingQ = UIStore.useState((s) => s.activeMoveQuestionGroup);
  const activeEditQuestions = UIStore.useState((s) => s.activeEditQuestions);
  const [activeTab, setActiveTab] = useState('setting');
  const { id, order, name } = question;

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
          return { ...q, order: q.order - order };
        }
        return q;
      });
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === question.questionGroupId) {
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
        if (qg.id === question.questionGroupId) {
          return { ...qg, questions: orderBy(newQuestions, 'order') };
        }
        return qg;
      });
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
      onClick: handleDelete,
      disabled: !index && isLastItem,
    },
  ];

  return (
    <div>
      <AddMoveButton
        text={UIText.buttonAddNewQuestionText}
        handleCancelMove={handleCancelMove}
        handleOnAdd={() => handleOnAdd(order - 1, true)}
      />
      <Card
        key={`${index}-${id}`}
        title={
          <CardTitle
            title={`Q: ${name} | Order: ${order}`}
            numbering={index + 1}
            order={order - 1}
            movingItem={movingQ}
            onMoveClick={handleMove}
          />
        }
        headStyle={{ textAlign: 'left', padding: '0 12px' }}
        bodyStyle={{
          borderTop: isEditQuestion ? '1px solid #f3f3f3' : 'none',
          padding: isEditQuestion ? 24 : 0,
        }}
        loading={false}
        extra={
          <Space>
            {extraButtons.map((cfg) => (
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
                onClickSave={() => form.submit()}
                onClickCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}
      </Card>
      {isLastItem && (
        <AddMoveButton
          text={UIText.buttonAddNewQuestionText}
          handleCancelMove={handleCancelMove}
          handleOnAdd={() => handleOnAdd(order, true)}
        />
      )}
    </div>
  );
};

export default QuestionDefinition;
