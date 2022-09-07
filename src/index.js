import React from 'react';
import 'antd/dist/antd.min.css';
import styles from './styles.module.css';
import { Card, Tabs, Tag } from 'antd';
import {
  FormWrapper,
  FormDefinition,
  FormPreview,
  QuestionGroupDefinition,
} from './components';
import { UIStore, questionGroupFn } from './lib/store';

const WebformEditor = ({ onSave = false }) => {
  const current = UIStore.useState((s) => s.current);
  const UIText = UIStore.useState((s) => s.UIText);
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );

  const { tab: currentTab } = current;
  const {
    formTabPane,
    previewTabPane,
    questionCount,
    questionGroupCount,
    mandatoryQuestionCount,
    version,
  } = UIText;

  const handleTabsOnChange = (e) => {
    UIStore.update((s) => {
      s.current = {
        ...current,
        tab: e,
      };
    });
  };

  const questions = questionGroups.reduce(
    (curr, qg) => [...curr, ...qg.questions],
    []
  );

  const mandatory = questions.filter((q) => q?.required);

  return (
    <div
      key="container"
      className={styles.container}
    >
      <Card>
        <Tabs
          defaultActiveKey={current.tab}
          onChange={handleTabsOnChange}
          tabBarExtraContent={
            <div className={styles['right-tabs']}>
              <Tag>
                {questions.length} {questionCount}
              </Tag>
              <Tag>
                {mandatory.length} {mandatoryQuestionCount}
              </Tag>
              <Tag>
                {questionGroups.length} {questionGroupCount}
              </Tag>
              <Tag>{version} 1</Tag>
            </div>
          }
          tabBarGutter={24}
          className={styles['tabs-wrapper']}
        >
          <Tabs.TabPane
            tab={formTabPane}
            key="form"
          />
          <Tabs.TabPane
            tab={previewTabPane}
            key="preview"
          />
        </Tabs>
        {currentTab === 'form' && (
          <FormWrapper>
            <FormDefinition onSave={onSave} />
            {questionGroups.map((qg, qgi) => {
              return (
                <QuestionGroupDefinition
                  key={`question-group-definition-${qgi}`}
                  index={qgi}
                  questionGroup={qg}
                  isLastItem={qgi === questionGroups.length - 1}
                />
              );
            })}
          </FormWrapper>
        )}
        {currentTab === 'preview' && <FormPreview />}
      </Card>
    </div>
  );
};

export default WebformEditor;
