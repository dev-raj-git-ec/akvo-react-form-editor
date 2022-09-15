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
import {
  FormStore,
  UIStore,
  questionGroupFn,
  generateId,
  questionType,
} from './lib/store';
import data from './lib/data';
import { isEmpty } from 'lodash';
import { TbEdit } from 'react-icons/tb';
import { MdOutlineLanguage } from 'react-icons/md';
import { VscPreview } from 'react-icons/vsc';

const WebformEditor = ({
  onSave = false,
  initialValue = {},
  settingTreeDropdownValue = [{ label: null, value: null }],
  settingCascadeURL = [{ name: null, url: null, initial: 0, list: false }],
  defaultQuestion = { type: null, name: null, required: null },
  limitQuestionType = [],
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
    const checkDefaultQuestion = Object.values(defaultQuestion).filter(
      (x) => x
    ).length;
    const sanitizeDefaultQuestion = {
      type: defaultQuestion?.type || questionType.input,
      name: defaultQuestion?.name,
      required: defaultQuestion?.required || false,
    };
    // update UIStore
    UIStore.update((s) => {
      s.hostParams = {
        ...s.hostParams,
        settingTreeDropdownValue: settingTreeDropdownValue.filter(
          (x) => x?.label && x?.value
        ),
        settingCascadeURL: settingCascadeURL
          .filter((x) => x?.name && x?.endpoint)
          .map((x, xi) => ({ ...x, id: x?.id || xi + 1 })),
        defaultQuestionParam: sanitizeDefaultQuestion,
        limitQuestionType: Object.keys(questionType)
          .map((key) => ({
            label: questionType[key]?.split('_').join(' '),
            value: questionType[key],
          }))
          .filter((x) => limitQuestionType.includes(x.value)),
      };
    });
    if (checkDefaultQuestion) {
      // replase questionGroup store with defaultQuestion value
      questionGroupFn.store.update((s) => {
        s.questionGroups = [
          questionGroupFn.add({
            defaultQuestionParam: sanitizeDefaultQuestion,
          }),
        ];
      });
    }
  }, [
    settingTreeDropdownValue,
    settingCascadeURL,
    defaultQuestion,
    limitQuestionType,
  ]);

  useEffect(() => {
    if (!isEmpty(initialValue)) {
      const initialData = data.toEditor(initialValue);
      FormStore.update((s) => {
        s.id = initialData?.id || generateId();
        s.version = initialData?.version || 1;
        s.name = initialData?.name || 'Unknown Form';
        s.description = initialData?.description || 'Unknown Description';
        s.languages = initialData?.languages?.filter((x) => x !== 'en') || [];
        s.defaultLanguage = initialData?.defaultLanguage || 'en';
        s.translations = initialData?.translations || [];
      });
      questionGroupFn.store.update((s) => {
        s.questionGroups = initialData.questionGroups;
      });
    }
  }, [initialValue]);

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

  const tabProps = [
    {
      icon: TbEdit,
      tab: formTabPane,
      key: 'edit-form',
    },
    {
      icon: MdOutlineLanguage,
      tab: formTranslationPane,
      key: 'translations',
    },
    {
      icon: VscPreview,
      tab: previewTabPane,
      key: 'preview',
    },
  ];

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
          className={`${styles['tabs-wrapper']} ${styles['tabs-wrapper-sticky']}`}
        >
          {tabProps.map((prop) => (
            <Tabs.TabPane
              tab={
                <Space
                  size={2}
                  className={styles['tab-pane-name-icon']}
                >
                  <prop.icon /> {prop.tab}
                </Space>
              }
              key={prop.key}
            />
          ))}
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
