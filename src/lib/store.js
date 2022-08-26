import { Store } from 'pullstate';
import UIText from './i18n';

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
  autofield: 'autofield',
};

const defaultQuestion = ({
  id,
  questionGroup,
  name = 'New Question',
  prevOrder = 0,
  type = questionType.input,
  params = {},
}) => {
  const q = {
    id: id || generateId(),
    questionGroupId: questionGroup.id,
    name: name,
    order: prevOrder + 1,
    type: type,
    required: false,
    tooltip: null,
    ...params,
  };
  if (type === questionType.option || type === questionType.multiple_option) {
    return {
      ...q,
      option: [],
      allowOther: false,
      ...params,
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
      ...params,
    };
  }
  return q;
};

const defaultQuestionGroup = ({
  name = 'New Question Group',
  prevOrder = 0,
}) => {
  const qg = {
    id: generateId(),
    name: name || 'New Question Group',
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
    tab: 'form',
    formId: null,
    questionGroupId: null,
    questionId: null,
  },
  activeQuestionGroups: [],
  activeEditQuestionGroups: [],
  UIText: UIText.en,
});

const FormStore = new Store({
  id: generateId(),
  name: 'New Form',
  version: 1,
  description: 'New Form Description',
});

const QuestionGroupStore = new Store({
  questionGroups: [defaultQuestionGroup({ name: null })],
});

const questionGroupFn = {
  new: defaultQuestionGroup,
  store: QuestionGroupStore,
};

const questionFn = {
  new: defaultQuestion,
  update: ({ id, type, questionGroup, params }) =>
    defaultQuestion({
      id: id,
      type: type,
      questionGroup: questionGroup,
      ...params,
    }),
};

export { UIStore, FormStore, questionType, questionGroupFn, questionFn };
