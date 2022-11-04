import React, { useEffect, useState } from 'react';
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
  UIStore,
  formFn,
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
  initialValue = null,
  settingTreeDropdownValue = [{ label: null, value: null }],
  settingCascadeURL = [{ name: null, endpoint: null, initial: 0, list: false }],
  settingHintURL = {
    questionTypes: [],
    settings: [{ name: null, endpoint: null, path: [] }],
  },
  defaultQuestion = { type: null, name: null, required: null },
  limitQuestionType = [],
  customParams = {
    label: null,
    params: [
      {
        name: null,
        label: 'Single Option Param',
        type: 'option',
        multiple: true,
        options: [],
      },
      {
        name: null,
        label: 'Multiple Option Param',
        type: 'option',
        multiple: false,
        options: [],
      },
      {
        name: null,
        label: 'Input Param',
        type: 'input',
      },
    ],
  },
}) => {
  const [init, setInit] = useState(defaultQuestion);
  const formStore = formFn.store.useState((s) => s);
  const current = UIStore.useState((s) => s.current);
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );
  const activeEditFormSetting = UIStore.useState(
    (s) => s.activeEditFormSetting
  );
  const defaultQuestionParam = hostParams?.defaultQuestionParam;
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

  if (!initialValue) {
    console.error('initialValue required as an empty object {}');
  }

  useEffect(() => {
    // store params from host to global store
    const checkDefaultQuestion = defaultQuestion
      ? Object.values(defaultQuestion).filter((x) => x).length
      : false;
    const sanitizeSettingTreeDropdownValue = settingTreeDropdownValue.filter(
      (x) => x?.label && x?.value
    );
    const sanitizeSettingCascadeURL = settingCascadeURL
      .filter((x) => x?.name && x?.endpoint)
      .map((x, xi) => ({ ...x, id: x?.id || xi + 1 }));
    const sanitizeSettingHintURL = !isEmpty(settingHintURL)
      ? {
          ...settingHintURL,
          settings: settingHintURL?.settings
            ?.filter((x) => x?.name && x?.endpoint && x?.path?.length)
            ?.map((x, xi) => ({ ...x, id: x?.id || xi + 1 })),
        }
      : {};
    const sanitizeDefaultQuestion = {
      type: defaultQuestion?.type || questionType.input,
      name: defaultQuestion?.name,
      required: defaultQuestion?.required || false,
    };
    const sanitizeCustomParams = customParams?.params?.filter((x) => x?.name);
    // update UIStore
    UIStore.update((s) => {
      if (sanitizeSettingTreeDropdownValue.length) {
        s.hostParams = {
          ...s.hostParams,
          settingTreeDropdownValue: sanitizeSettingTreeDropdownValue,
        };
      }
      if (sanitizeSettingCascadeURL.length) {
        s.hostParams = {
          ...s.hostParams,
          settingCascadeURL: sanitizeSettingCascadeURL,
        };
      }
      if (
        !isEmpty(sanitizeSettingHintURL) &&
        sanitizeSettingHintURL?.settings?.length
      ) {
        s.hostParams = {
          ...s.hostParams,
          settingHintURL: sanitizeSettingHintURL,
        };
      }
      if (checkDefaultQuestion) {
        s.hostParams = {
          ...s.hostParams,
          defaultQuestionParam: sanitizeDefaultQuestion,
        };
      } else {
        s.hostParams = {
          ...s.hostParams,
          defaultQuestionParam: {},
        };
      }
      if (limitQuestionType.length) {
        s.hostParams = {
          ...s.hostParams,
          limitQuestionType: Object.keys(questionType)
            .map((key) => ({
              label: questionType[key]?.split('_').join(' '),
              value: questionType[key],
            }))
            .filter((x) => limitQuestionType.includes(x.value)),
        };
      }
      if (customParams?.label && sanitizeCustomParams?.length) {
        s.hostParams = {
          ...s.hostParams,
          customParams: {
            ...customParams,
            params: sanitizeCustomParams,
          },
        };
      }
    });
  }, [
    settingTreeDropdownValue,
    settingCascadeURL,
    settingHintURL,
    defaultQuestion,
    limitQuestionType,
    customParams,
  ]);

  useEffect(() => {
    if (defaultQuestionParam && init) {
      // replace questionGroup store with defaultQuestion value
      questionGroupFn.store.update((s) => {
        s.questionGroups = [
          questionGroupFn.add({
            defaultQuestionParam: defaultQuestionParam,
          }),
        ];
      });
      setInit(false);
    }
  }, [defaultQuestionParam, init]);

  useEffect(() => {
    if (!isEmpty(initialValue)) {
      const initialData = data.toEditor(initialValue);
      formFn.store.update((s) => {
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
    } else {
      const defaultForm = formFn.add();
      formFn.store.update((s) => {
        s.id = defaultForm.id;
        s.name = defaultForm.name;
        s.version = defaultForm.version;
        s.description = defaultForm.description;
        s.languages = [];
        s.defaultLanguage = 'en';
        s.translations = [];
      });
      questionGroupFn.store.update((s) => {
        s.questionGroups = [questionGroupFn.add({})];
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
                <Tag style={{ margin: 0 }}>
                  {version} {formStore.version || 1}
                </Tag>
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
