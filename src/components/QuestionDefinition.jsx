import React, { useMemo, useState } from 'react';
import { Card, Space, Tabs, Form } from 'antd';
import styles from '../styles.module.css';
import { UIStore } from '../lib/store';
import { QuestionSetting, QuestionSkipLogic } from '.';
import {
  AddMoveButton,
  CardTitle,
  CardExtraButton,
  SaveButton,
} from '../support';

const QuestionDefinition = ({ index, question, isLastItem }) => {
  const form = Form.useFormInstance();
  const UIText = UIStore.useState((s) => s.UIText);
  const activeEditQuestions = UIStore.useState((s) => s.activeEditQuestions);
  const [activeTab, setActiveTab] = useState('setting');
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
      <AddMoveButton text={UIText.buttonAddNewQuestionText} />
      <Card
        key={`${index}-${id}`}
        title={
          <CardTitle
            title={name}
            numbering={index + 1}
            onMoveClick={() => {
              console.log('move');
            }}
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
      {isLastItem && <AddMoveButton text={UIText.buttonAddNewQuestionText} />}
    </div>
  );
};

export default QuestionDefinition;
