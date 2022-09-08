import { questionType } from './store';

const clearQuestionObj = (keysToRemove, obj = false) => {
  let clearedQuestion = {};
  if (obj) {
    Object.keys(obj).forEach((key) => {
      if (!keysToRemove.includes(key)) {
        clearedQuestion = {
          ...clearedQuestion,
          [key]: obj[key],
        };
      }
    });
  }
  return clearedQuestion;
};

const toWebform = (formData, questionGroups) => {
  const output = questionGroups.map((qg) => {
    const questions = qg.questions.map((q) => {
      if (q.type !== questionType.input) {
        q = clearQuestionObj(['requiredDoubleEntry', 'hiddenString'], q);
      }
      if (q.type !== questionType.number) {
        q = clearQuestionObj(['rule'], q);
      }
      if (
        [questionType.option, questionType.multiple_option].includes(q.type)
      ) {
        q = { ...q, option: q.options };
      }
      if (
        ![questionType.option, questionType.multiple_option].includes(q.type)
      ) {
        q = clearQuestionObj(['allowOther'], q);
      }
      if (q.type !== questionType.cascade) {
        q = clearQuestionObj(['api'], q);
      }
      if (q?.tooltip) {
        q = { ...q, tooltip: { text: q.tooltip } };
      } else {
        q = clearQuestionObj(['tooltip'], q);
      }
      if (q?.dependency) {
        const dependency = q.dependency.map((d) => {
          if (d?.max) {
            d = { ...d, max: d.max - 1 };
          }
          if (d?.min) {
            d = { ...d, min: d.min + 1 };
          }
          return d;
        });
        q = { ...q, dependency: dependency };
      }
      q = clearQuestionObj(['options'], q);
      return q;
    });
    let result = {
      id: qg.id,
      name: qg.name,
      order: qg.order,
      repeatable: qg.repeatable,
      question: questions,
    };
    if (qg?.repeatText) {
      result = {
        ...result,
        repeatText: qg.repeatText,
      };
    }
    if (qg?.description) {
      result = {
        ...result,
        description: qg.description,
      };
    }
    return result;
  });
  return { ...formData, question_group: output };
};

const data = {
  clear: clearQuestionObj,
  toWebform: toWebform,
};

export default data;
