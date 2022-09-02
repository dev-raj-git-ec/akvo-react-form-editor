import { Store } from 'pullstate';
import UIStaticText from './i18n';
import { dummyName } from './debug';

const generateId = () => new Date().getTime();

const skipLogicOperator = {
  option: {
    contains: 'contains',
  },
  number: {
    equal: 'equal',
    notEqual: 'not_equal',
    less_than: 'less_than',
    greater_than: 'greater_than',
  },
  date: {
    before_date: 'before_date',
    after_date: 'after_date',
  },
};

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
  name,
  prevOrder = 0,
  type = questionType.input,
  params = {},
}) => {
  const q = {
    id: id || generateId(),
    questionGroupId: questionGroup.id,
    name: name || dummyName(),
    order: prevOrder + 1,
    type: type,
    required: false,
    tooltip: null,
    ...params,
  };
  if (type === questionType.option || type === questionType.multiple_option) {
    return {
      ...q,
      options: [],
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
    tab: 'form',
    formId: null,
    questionGroupId: null,
    questionId: null,
  },
  activeQuestionGroups: [],
  activeEditQuestionGroups: [],
  activeMoveQuestionGroup: null,
  activeEditQuestions: [],
  activeMoveQuestion: null,
  UIText: UIStaticText.en,
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
  skipLogicOperator,
  generateId,
};
