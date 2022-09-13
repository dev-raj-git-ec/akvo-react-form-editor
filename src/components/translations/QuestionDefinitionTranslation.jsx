import React, { useMemo } from 'react';
import styles from '../../styles.module.css';
import { Card, Input } from 'antd';
import { CardTitle, TranslationFormItem } from '../../support';
import { UIStore, questionGroupFn, questionType } from '../../lib/store';
import data from '../../lib/data';
import orderBy from 'lodash/orderBy';

const QuestionSettingTranslation = ({
  id,
  questionGroupId,
  name,
  type,
  tooltip = {},
  allowOther,
  allowOtherText,
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
    const { newTranslations, currentTranslations } = data.generateTranslations(
      key,
      value,
      translations,
      existingTranslation
    );
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

  const handleChangeTooltip = (e) => {
    const key = 'text';
    const value = e?.target?.value;
    const { newTranslations, currentTranslations } = data.generateTranslations(
      key,
      value,
      tooltip?.translations,
      existingTranslation
    );
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

  const handleChangeName = (e) => {
    updateTranslation('name', e?.target?.value);
  };

  const handleChangeAllowOtherText = (e) => {
    updateTranslation('allowOtherText', e?.target?.value);
  };

  const handleChangeOptionName = (e, optionTranslations, optionId) => {
    const key = 'name';
    const value = e?.target?.value;
    const { newTranslations, currentTranslations } = data.generateTranslations(
      key,
      value,
      optionTranslations,
      existingTranslation
    );
    questionGroupFn.store.update((u) => {
      u.questionGroups = u.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (
              q.id === id &&
              [questionType.option, questionType.multiple_option].includes(
                q.type
              )
            ) {
              const options = q.options.map((opt) => {
                if (opt.id === optionId) {
                  return {
                    ...opt,
                    translations: !currentTranslations
                      ? newTranslations
                      : currentTranslations,
                  };
                }
                return opt;
              });
              return {
                ...q,
                options: options,
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
          initialValue={existingTranslationValues?.name}
        >
          <Input
            disabled={!existingTranslation}
            onChange={handleChangeName}
          />
        </TranslationFormItem>
      )}
      {tooltip?.text && (
        <TranslationFormItem
          labelText={UIText.inputQuestionTooltipLabel}
          currentValue={tooltip.text}
          name={`${namePreffix}-tooltip`}
          initialValue={existingTooltipTranslationValues?.text}
        >
          <Input.TextArea
            disabled={!existingTranslation}
            onChange={handleChangeTooltip}
          />
        </TranslationFormItem>
      )}
      {/* Option Translation */}
      {[questionType.option, questionType.multiple_option].includes(type) && (
        <div>
          <p className={styles['more-question-setting-text']}>
            {UIText.questionMoreOptionTranslationText}
          </p>
          {allowOther && allowOtherText && (
            <TranslationFormItem
              labelText={UIText.inputQuestionAllowOtherTextLabel}
              currentValue={allowOtherText}
              name={`${namePreffix}-allow_other_text`}
              initialValue={existingTranslationValues?.allowOtherText}
            >
              <Input
                disabled={!existingTranslation}
                onChange={handleChangeAllowOtherText}
              />
            </TranslationFormItem>
          )}
          {orderBy(options, 'order')
            .filter((d) => d?.name)
            .map((d, di) => {
              const existingOptionTranslationValues = d?.translations?.find(
                (tl) => tl.language === existingTranslation
              );
              return (
                <TranslationFormItem
                  key={`translation-option-${d.id}-${di}`}
                  labelText={`${UIText.inputQuestionOptionNameLabel} ${d.order}`}
                  currentValue={d.name}
                  name={`${namePreffix}-option-name-${d.id}`}
                  initialValue={existingOptionTranslationValues?.name}
                >
                  <Input
                    disabled={!existingTranslation}
                    onChange={(e) =>
                      handleChangeOptionName(e, d?.translations, d.id)
                    }
                  />
                </TranslationFormItem>
              );
            })}
        </div>
      )}
    </div>
  );
};

const QuestionDefinitionTranslation = ({ index, question }) => {
  const { id, name, order, questionGroupOrder } = question;
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
          title={`${questionGroupOrder}.${order}. ${name}`}
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
