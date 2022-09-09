import React, { useMemo } from 'react';
import { Card, Input } from 'antd';
import { CardTitle, TranslationFormItem } from '../../support';
import { UIStore, questionGroupFn } from '../../lib/store';
import findIndex from 'lodash/findIndex';

const QuestionSettingTranslation = ({
  id,
  questionGroupId,
  name,
  tooltip = {},
  options = [],
  translations = [],
}) => {
  const { UIText, existingTranslation } = UIStore.useState((s) => s);
  const namePreffix = `translation-${existingTranslation}-question-${id}`;

  const existingTranslationValues = useMemo(() => {
    return translations?.find((tl) => tl.language === existingTranslation);
  }, [translations, existingTranslation]);

  const existingTooltipTranslationValues = useMemo(() => {
    return tooltip?.translations?.find(
      (tl) => tl.language === existingTranslation
    );
  }, [tooltip, existingTranslation]);

  const updateTranslation = (key, value) => {
    const newTranslations = [
      {
        language: existingTranslation,
        [key]: value,
      },
    ];
    let currentTranslations = null;
    if (translations && translations?.length) {
      currentTranslations = translations.map((tl) => {
        if (tl.language === existingTranslation) {
          return {
            ...tl,
            [key]: value,
          };
        }
        return tl;
      });
      const isExistingExist = findIndex(
        translations,
        (tr) => tr.language === existingTranslation
      );
      if (isExistingExist === -1) {
        currentTranslations = [...currentTranslations, ...newTranslations];
      }
    }
    questionGroupFn.store.update((u) => {
      u.questionGroups = u.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                translations: !currentTranslations
                  ? newTranslations
                  : currentTranslations,
              };
            }
            return q;
          });
          return {
            ...qg,
            questions: questions,
          };
        }
        return qg;
      });
    });
  };

  const handleChangeName = (e) => {
    updateTranslation('name', e?.target?.value);
  };

  const handleChangeTooltip = (e) => {
    const key = 'text';
    const value = e?.target?.value;
    const newTranslations = [
      {
        language: existingTranslation,
        [key]: value,
      },
    ];
    let currentTranslations = null;
    if (tooltip?.translations && tooltip?.translations?.length) {
      currentTranslations = tooltip?.translations.map((tl) => {
        if (tl.language === existingTranslation) {
          return {
            ...tl,
            [key]: value,
          };
        }
        return tl;
      });
      const isExistingExist = findIndex(
        tooltip?.translations,
        (tr) => tr.language === existingTranslation
      );
      if (isExistingExist === -1) {
        currentTranslations = [...currentTranslations, ...newTranslations];
      }
    }
    questionGroupFn.store.update((u) => {
      u.questionGroups = u.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id && q?.tooltip?.text) {
              return {
                ...q,
                tooltip: {
                  ...q.tooltip,
                  translations: !currentTranslations
                    ? newTranslations
                    : currentTranslations,
                },
              };
            }
            return q;
          });
          return {
            ...qg,
            questions: questions,
          };
        }
        return qg;
      });
    });
  };

  return (
    <div>
      {name && (
        <TranslationFormItem
          labelText={UIText.inputQuestionNameLabel}
          currentValue={name}
          name={`${namePreffix}-name`}
        >
          <Input
            disabled={!existingTranslation}
            onChange={handleChangeName}
            value={existingTranslationValues?.name}
          />
        </TranslationFormItem>
      )}
      {tooltip?.text && (
        <TranslationFormItem
          labelText={UIText.inputQuestionTooltipLabel}
          currentValue={tooltip.text}
          name={`${namePreffix}-tooltip`}
        >
          <Input.TextArea
            disabled={!existingTranslation}
            onChange={handleChangeTooltip}
            value={existingTooltipTranslationValues?.text}
          />
        </TranslationFormItem>
      )}
    </div>
  );
};

const QuestionDefinitionTranslation = ({ index, question }) => {
  const { id, name, order } = question;
  const { activeEditTranslationQuestions } = UIStore.useState((s) => s);

  const isEditTranslationQuestion = useMemo(() => {
    return activeEditTranslationQuestions.includes(id);
  }, [activeEditTranslationQuestions, id]);

  const handleEditTranslationQuestion = () => {
    UIStore.update((s) => {
      s.activeEditTranslationQuestions = [
        ...activeEditTranslationQuestions,
        id,
      ];
    });
  };

  const handleCancelEditTranslationQuestion = () => {
    UIStore.update((s) => {
      s.activeEditTranslationQuestions = activeEditTranslationQuestions.filter(
        (qId) => qId !== id
      );
    });
  };

  const cardTitleButton = [
    {
      type: 'show-button',
      isExpand: isEditTranslationQuestion,
      onClick: handleEditTranslationQuestion,
      onCancel: handleCancelEditTranslationQuestion,
    },
  ];

  return (
    <Card
      key={`translation-question-${index}-${id}`}
      title={
        <CardTitle
          title={`${order}. ${name}`}
          buttons={cardTitleButton}
        />
      }
      headStyle={{
        textAlign: 'left',
        padding: '0 12px',
      }}
      bodyStyle={{
        padding: isEditTranslationQuestion ? 24 : 0,
        borderTop: isEditTranslationQuestion ? '1px solid #f3f3f3' : 'none',
      }}
    >
      {isEditTranslationQuestion && (
        <QuestionSettingTranslation {...question} />
      )}
    </Card>
  );
};

export default QuestionDefinitionTranslation;
