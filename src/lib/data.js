import { questionType, generateId } from './store';
import { findIndex, isEmpty, mapKeys, orderBy } from 'lodash';

const clearQuestionObj = (
  keysToRemove = [],
  obj = false,
  checkEmpty = false
) => {
  let clearedQuestion = {};
  if (obj) {
    Object.keys(obj).forEach((key) => {
      // filter obj by key to remove
      if (!keysToRemove.includes(key)) {
        if (!checkEmpty) {
          clearedQuestion = {
            ...clearedQuestion,
            [key]: obj[key],
          };
          return key;
        }
        // clear or remove empty obj value
        if (checkEmpty && !isEmpty(obj?.[key])) {
          clearedQuestion = {
            ...clearedQuestion,
            [key]: obj[key],
          };
          return key;
        }
      }
    });
  }
  return clearedQuestion;
};

const clearTranslations = (obj, translations) => {
  let newObj = {
    ...obj,
  };
  const clearedTranslations = translations
    .map((tl) => {
      const clearedObj = clearQuestionObj([], tl, true);
      // remove translation if only has language property
      if (Object.keys(clearedObj).length === 1 && clearedObj?.language) {
        return false;
      }
      return clearedObj;
    })
    .filter((x) => x);
  if (clearedTranslations.length) {
    newObj = {
      ...newObj,
      translations: clearedTranslations,
    };
  } else {
    delete newObj?.translations;
    // remove translation
  }
  return newObj;
};

const toEditor = (webFormData) => {
  webFormData = mapKeys(webFormData, (_, k) =>
    k === 'question_group' ? 'questionGroups' : k
  );
  const questionGroups = webFormData.questionGroups.map((qg, qgi) => {
    const gid = qg?.id || generateId() + qgi;
    qg = mapKeys(qg, (_, k) => (k === 'question' ? 'questions' : k));
    const questions = qg.questions.map((q, qi) => {
      const isNotOption = ![
        questionType.option,
        questionType.multiple_option,
      ].includes(q.type);
      if (isNotOption && q.type !== questionType.tree) {
        q = clearQuestionObj(['option'], q);
      }
      if (
        [questionType.option, questionType.multiple_option].includes(q.type)
      ) {
        q = mapKeys(q, (_, k) => (k === 'option' ? 'options' : k));
      }
      if (q?.options) {
        const options = q.options.map((o, oi) => ({
          id: o?.id || qi + 1 + (oi + 1),
          ...o,
          order: o?.order || oi + 1,
        }));
        q = {
          ...q,
          options: orderBy(options, 'order'),
        };
      }
      if (q?.dependency) {
        const dependency = q.dependency.map((d) => {
          if (d?.max) {
            d = { ...d, max: d.max + 1 };
          }
          if (d?.min) {
            d = { ...d, min: d.min - 1 };
          }
          return d;
        });
        q = { ...q, dependency: dependency };
      }
      return { ...q, order: q?.order || qi + 1, questionGroupId: gid };
    });
    qg = {
      ...qg,
      id: gid,
      order: qg?.order || qgi + 1,
      questions: orderBy(questions, 'order'),
    };
    return qg;
  });
  webFormData = {
    ...webFormData,
    questionGroups: orderBy(questionGroups, 'order'),
  };
  return webFormData;
};

const toWebform = (formData, questionGroups) => {
  let webformData = {
    id: formData?.id || generateId(),
    name: formData.name,
    description: formData.description,
  };
  if (formData?.languages && formData?.languages?.length) {
    webformData = {
      ...webformData,
      languages: ['en', ...formData.languages],
      defaultLanguage: formData?.defaultLanguage || 'en',
    };
  }
  if (formData?.translations) {
    webformData = clearTranslations(webformData, formData.translations);
  }
  // Question Group & Question Definition
  const output = questionGroups.map((qg) => {
    const questions = qg.questions.map((q) => {
      const isNotOption = ![
        questionType.option,
        questionType.multiple_option,
      ].includes(q.type);
      if (q.type !== questionType.input) {
        q = clearQuestionObj(['requiredDoubleEntry', 'hiddenString'], q);
      }
      if (q.type !== questionType.number && q.type !== questionType.date) {
        q = clearQuestionObj(['rule'], q);
      }
      if (
        [questionType.option, questionType.multiple_option].includes(q.type)
      ) {
        const options = q.options.map((op) => {
          if (op?.translations) {
            return clearTranslations(op, op.translations);
          }
          return op;
        });
        q = { ...q, option: options };
      }
      if (isNotOption) {
        q = clearQuestionObj(['allowOther'], q);
      }
      if (q.type !== questionType.cascade) {
        q = clearQuestionObj(['api'], q);
      }
      if (q.type !== questionType.tree && isNotOption) {
        q = clearQuestionObj(['option'], q);
      }
      if (q.type !== questionType.table) {
        q = clearQuestionObj(['columns'], q);
      }
      if (!q?.tooltip) {
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
      if (q?.translations) {
        q = clearTranslations(q, q.translations);
      }
      if (q?.hint && !q?.hint?.static && !q?.hint?.endpoint) {
        q = clearQuestionObj(['hint'], q);
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
    if (qg?.translations) {
      result = clearTranslations(result, qg.translations);
    }
    return result;
  });
  return { ...webformData, question_group: output };
};

const generateTranslations = (
  key,
  value,
  savedTranslations,
  existingTranslation
) => {
  const newTranslations = [
    {
      language: existingTranslation,
      [key]: value,
    },
  ];
  let currentTranslations = null;
  if (savedTranslations && savedTranslations?.length) {
    currentTranslations = savedTranslations.map((tl) => {
      if (tl.language === existingTranslation) {
        return {
          ...tl,
          [key]: value,
        };
      }
      return tl;
    });
    const isExistingExist = findIndex(
      savedTranslations,
      (tr) => tr.language === existingTranslation
    );
    if (isExistingExist === -1) {
      currentTranslations = [...currentTranslations, ...newTranslations];
    }
  }
  return {
    newTranslations: newTranslations,
    currentTranslations: currentTranslations,
  };
};

const data = {
  clear: clearQuestionObj,
  toWebform: toWebform,
  toEditor: toEditor,
  generateTranslations: generateTranslations,
};

export default data;
