import React, { useEffect } from 'react';
import 'antd/dist/antd.min.css';
import styles from './styles.module.css';
import { Card, Tabs, Tag, Space } from 'antd';
import {
  FormWrapper,
  FormDefinition,
  FormPreview,
  QuestionGroupDefinition,
  FormTranslations,
} from './components';
import { ButtonWithIcon } from './support';
import { FormStore, UIStore, questionGroupFn } from './lib/store';
import data from './lib/data';

const WebformEditor = ({
  onSave = false,
  settingTreeDropdownValue = [{ label: null, value: null }],
}) => {
  const formStore = FormStore.useState((s) => s);
  const current = UIStore.useState((s) => s.current);
  const UIText = UIStore.useState((s) => s.UIText);
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );
  const activeEditFormSetting = UIStore.useState(
    (s) => s.activeEditFormSetting
  );

  const { tab: currentTab } = current;
  const {
    formTabPane,
    formTranslationPane,
    previewTabPane,
    questionCount,
    questionGroupCount,
    mandatoryQuestionCount,
    version,
  } = UIText;

  useEffect(() => {
    // store params from host to global store
    UIStore.update((s) => {
      s.hostParams = {
        ...s.hostParams,
        settingTreeDropdownValue: settingTreeDropdownValue.filter(
          (x) => x?.label && x?.value
        ),
      };
    });
  }, [settingTreeDropdownValue]);

  const handleTabsOnChange = (e) => {
    UIStore.update((s) => {
      s.current = {
        ...current,
        tab: e,
      };
    });
  };

  const handleShowFormSetting = (e) => {
    e.preventDefault();
    UIStore.update((s) => {
      s.activeEditFormSetting = activeEditFormSetting ? false : true;
    });
  };

  const handleSave = () => {
    if (onSave) {
      // transform questions to remove unused setting by question type
      onSave(data.toWebform(formStore, questionGroups));
    }
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
              <Space>
                <Tag style={{ margin: 0 }}>
                  {questions.length} {questionCount}
                </Tag>
                <Tag style={{ margin: 0 }}>
                  {mandatory.length} {mandatoryQuestionCount}
                </Tag>
                <Tag style={{ margin: 0 }}>
                  {questionGroups.length} {questionGroupCount}
                </Tag>
                <Tag style={{ margin: 0 }}>{version} 1</Tag>
                {currentTab === 'edit-form' && (
                  <ButtonWithIcon
                    type="edit-button"
                    isExpand={activeEditFormSetting}
                    onClick={handleShowFormSetting}
                    onCancel={handleShowFormSetting}
                  />
                )}
                <ButtonWithIcon
                  type="save-button"
                  onClick={handleSave}
                />
              </Space>
            </div>
          }
          tabBarGutter={24}
          className={styles['tabs-wrapper']}
        >
          <Tabs.TabPane
            tab={formTabPane}
            key="edit-form"
          />
          <Tabs.TabPane
            tab={formTranslationPane}
            key="translations"
          />
          <Tabs.TabPane
            tab={previewTabPane}
            key="preview"
          />
        </Tabs>
        {currentTab === 'edit-form' && (
          <FormWrapper>
            {activeEditFormSetting && <FormDefinition {...formStore} />}
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
        {currentTab === 'translations' && <FormTranslations />}
        {currentTab === 'preview' && <FormPreview />}
      </Card>
    </div>
  );
};

export default WebformEditor;
