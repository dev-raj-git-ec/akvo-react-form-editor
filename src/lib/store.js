import { Store } from 'pullstate';
import UIStaticText from './i18n';
import { dummyName } from './debug';
import * as locale from 'locale-codes';
import uniqBy from 'lodash/uniqBy';

const localeDropdownValue = uniqBy(
  locale.all
    .filter((x) => x.location)
    .map((x) => ({ label: x.name, value: x['iso639-1'] }))
    .filter((x) => x.value),
  'value'
);

const generateId = () => new Date().getTime();

const questionType = {
  input: 'input',
  number: 'number',
  cascade: 'cascade',
  text: 'text',
  date: 'date',
  option: 'option',
  multiple_option: 'multiple_option',
  tree: 'tree',
  // autofield: 'autofield',
};

const defaultQuestion = ({
  questionGroup,
  name,
  prevOrder = 0,
  type = questionType.input,
  params = {},
}) => {
  const q = {
    id: generateId(),
    order: prevOrder + 1,
    questionGroupId: questionGroup.id,
    name: name || dummyName(5),
    type: type,
    required: false,
    tooltip: null,
  };
  if (type === questionType.option || type === questionType.multiple_option) {
    return {
      ...q,
      options: [],
      allowOther: false,
    };
  }
  if (type === questionType.cascade) {
    return {
      ...q,
      api: {
        endpoint: null,
        initial: 0,
        list: false,
      },
    };
  }
  return { ...q, ...params };
};

const defaultQuestionGroup = ({ name = dummyName(), prevOrder = 0 }) => {
  const qg = {
    id: generateId(),
    name: name,
    order: prevOrder + 1,
    description: null,
    repeatable: false,
  };
  return {
    ...qg,
    questions: [defaultQuestion({ questionGroup: qg })],
  };
};

const UIStore = new Store({
  current: {
    tab: 'edit-form',
    formId: null,
    questionGroupId: null,
    questionId: null,
  },
  activeEditFormSetting: true,
  activeQuestionGroups: [],
  activeEditQuestionGroups: [],
  activeMoveQuestionGroup: null,
  isCopyingQuestionGroup: false,
  activeEditQuestions: [],
  activeMoveQuestion: null,
  isCopyingQuestion: false,
  UIText: UIStaticText.en,
  localeDropdownValue: localeDropdownValue,
  existingTranslation: null,
  activeTranslationQuestionGroups: [],
  activeEditTranslationQuestionGroups: [],
  activeEditTranslationQuestions: [],
  hostParams: {},
});

const FormStore = new Store({
  id: generateId(),
  name: 'New Form',
  version: 1,
  description: 'New Form Description',
});

const QuestionGroupStore = new Store({
  questionGroups: [defaultQuestionGroup({})],
});

const questionGroupFn = {
  add: defaultQuestionGroup,
  store: QuestionGroupStore,
};

const questionFn = {
  add: defaultQuestion,
  update: ({ id, type, questionGroup, params }) =>
    defaultQuestion({
      id: id,
      type: type,
      questionGroup: questionGroup,
      ...params,
    }),
};

export {
  UIStore,
  FormStore,
  questionType,
  questionGroupFn,
  questionFn,
  generateId,
};
