import React, { useMemo } from 'react';
import { Card, Input } from 'antd';
import { UIStore, questionGroupFn } from '../../lib/store';
import { CardTitle, TranslationFormItem } from '../../support';
import QuestionDefinitionTranslation from './QuestionDefinitionTranslation';
import data from '../../lib/data';
import { uniq, difference, intersection } from 'lodash';

const QuestionGroupSettingTranslation = ({
  id,
  name,
  description,
  repeatable,
  repeatText,
  translations = [],
}) => {
  const { UIText, existingTranslation } = UIStore.useState((s) => s);
  const namePreffix = `translation-${existingTranslation}-question_group-${id}`;

  const existingTranslationValues = useMemo(() => {
    return translations?.find((tl) => tl.language === existingTranslation);
  }, [translations, existingTranslation]);

  const updateTranslation = (key, value) => {
    const { newTranslations, currentTranslations } = data.generateTranslations(
      key,
      value,
      translations,
      existingTranslation
    );
    questionGroupFn.store.update((u) => {
      u.questionGroups = u.questionGroups.map((qg) => {
        if (qg.id === id) {
          return {
            ...qg,
            translations: !currentTranslations
              ? newTranslations
              : currentTranslations,
          };
        }
        return qg;
      });
    });
  };

  const handleChangeName = (e) => {
    updateTranslation('name', e?.target?.value);
  };

  const handleChangeDescription = (e) => {
    updateTranslation('description', e?.target?.value);
  };

  const handleChangeRepeatText = (e) => {
    updateTranslation('repeatText', e?.target?.value);
  };

  return (
    <div>
      {name && (
        <TranslationFormItem
          labelText={UIText.inputQuestionGroupNameLabel}
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
      {description && (
        <TranslationFormItem
          labelText={UIText.inputQuestionGroupDescriptionLabel}
          currentValue={description}
          name={`${namePreffix}-description`}
        >
          <Input.TextArea
            rows={5}
            disabled={!existingTranslation}
            onChange={handleChangeDescription}
            value={existingTranslationValues?.description}
          />
        </TranslationFormItem>
      )}
      {repeatable && repeatText && (
        <TranslationFormItem
          labelText={UIText.inputRepeatTextLabel}
          currentValue={repeatText}
          name={`${namePreffix}-repeat_text`}
        >
          <Input
            disabled={!existingTranslation}
            onChange={handleChangeRepeatText}
            value={existingTranslationValues?.repeatText}
          />
        </TranslationFormItem>
      )}
    </div>
  );
};

const QuestionGroupDefinitionTranslation = ({ index, questionGroup }) => {
  const { id, name, order, questions } = questionGroup;
  const {
    activeTranslationQuestionGroups,
    activeEditTranslationQuestionGroups,
    activeEditTranslationQuestions,
  } = UIStore.useState((s) => s);
  const questionIds = questions.map((q) => q.id);

  const showTranslationQuestion = useMemo(() => {
    return activeTranslationQuestionGroups.includes(id);
  }, [activeTranslationQuestionGroups, id]);

  const isEditTranslationQuestionGroup = useMemo(() => {
    return activeEditTranslationQuestionGroups.includes(id);
  }, [activeEditTranslationQuestionGroups, id]);

  const handleHideTranslationQuestions = () => {
    UIStore.update((s) => {
      s.activeTranslationQuestionGroups =
        activeTranslationQuestionGroups.filter((qgId) => qgId !== id);
    });
  };

  const handleCancelEditTranslationGroup = () => {
    UIStore.update((s) => {
      s.activeEditTranslationQuestionGroups =
        activeEditTranslationQuestionGroups.filter((qgId) => qgId !== id);
    });
    handleHideTranslationQuestions();
  };

  const handleEditTranslationGroup = () => {
    UIStore.update((s) => {
      if (!activeEditTranslationQuestionGroups.includes(id)) {
        s.activeEditTranslationQuestionGroups = [
          ...activeEditTranslationQuestionGroups,
          id,
        ];
      } else {
        s.activeEditTranslationQuestionGroups =
          activeEditTranslationQuestionGroups.filter((a) => a !== id);
      }
    });
  };

  const handleExpandAll = () => {
    UIStore.update((s) => {
      s.activeEditTranslationQuestionGroups = uniq([
        ...activeEditTranslationQuestionGroups,
        id,
      ]);
      s.activeEditTranslationQuestions = uniq([
        ...s.activeEditTranslationQuestions,
        ...questionIds,
      ]);
    });
  };

  const handleCancelExpandAll = () => {
    handleCancelEditTranslationGroup();
    UIStore.update((s) => {
      s.activeEditTranslationQuestions = difference(
        s.activeEditTranslationQuestions,
        questionIds
      );
    });
  };

  const cardTitleButton = [
    {
      type: 'show-button',
      isExpand: isEditTranslationQuestionGroup,
      onClick: handleEditTranslationGroup,
      onCancel: handleCancelEditTranslationGroup,
    },
  ];

  const cardExtraButton = [
    {
      type: 'expand-all-button',
      isExpand: intersection(activeEditTranslationQuestions, questionIds)
        .length,
      onClick: handleExpandAll,
      onCancel: handleCancelExpandAll,
    },
  ];

  return (
    <Card
      key={`translation-${index}-${id}`}
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
        padding:
          isEditTranslationQuestionGroup || showTranslationQuestion ? 24 : 0,
        borderTop:
          isEditTranslationQuestionGroup || showTranslationQuestion
            ? '1px solid #f3f3f3'
            : 'none',
      }}
      extra={<CardTitle buttons={cardExtraButton} />}
    >
      {isEditTranslationQuestionGroup && (
        <QuestionGroupSettingTranslation {...questionGroup} />
      )}
      {isEditTranslationQuestionGroup &&
        questions.map((q, qi) => (
          <QuestionDefinitionTranslation
            key={`question-definition-translation-${qi}`}
            index={qi}
            question={{ ...q, questionGroupOrder: order }}
          />
        ))}
    </Card>
  );
};

export default QuestionGroupDefinitionTranslation;
