import React, { useMemo } from 'react';
import { Input } from 'antd';
import { UIStore, FormStore } from '../../lib/store';
import { TranslationFormItem } from '../../support';
import findIndex from 'lodash/findIndex';

const FormDefinitionTranslation = () => {
  const { UIText, existingTranslation } = UIStore.useState((s) => s);
  const formStore = FormStore.useState((s) => s);
  const namePreffix = `translation-${existingTranslation}`;

  const existingTranslationValues = useMemo(() => {
    return formStore?.translations?.find(
      (tl) => tl.language === existingTranslation
    );
  }, [formStore, existingTranslation]);

  const updateTranslation = (key, value) => {
    const newTranslations = [
      {
        language: existingTranslation,
        [key]: value,
      },
    ];
    let currentTranslations = null;
    if (formStore?.translations && formStore?.translations?.length) {
      currentTranslations = formStore.translations.map((tl) => {
        if (tl.language === existingTranslation) {
          return {
            ...tl,
            [key]: value,
          };
        }
        return tl;
      });
      const isExistingExist = findIndex(
        formStore.translations,
        (tr) => tr.language === existingTranslation
      );
      if (isExistingExist === -1) {
        currentTranslations = [...currentTranslations, ...newTranslations];
      }
    }
    FormStore.update((u) => {
      u.translations = !currentTranslations
        ? newTranslations
        : currentTranslations;
    });
  };

  const handleChangeName = (e) => {
    updateTranslation('name', e?.target?.value);
  };

  const handleChangeDescription = (e) => {
    updateTranslation('description', e?.target?.value);
  };

  return (
    <div>
      {formStore?.name && (
        <TranslationFormItem
          labelText={UIText.inputFormNameLabel}
          currentValue={formStore.name}
          name={`${namePreffix}-form-name`}
        >
          <Input
            disabled={!existingTranslation}
            onChange={handleChangeName}
            value={existingTranslationValues?.name}
          />
        </TranslationFormItem>
      )}
      {formStore?.description && (
        <TranslationFormItem
          labelText={UIText.inputFormDescriptionLabel}
          currentValue={formStore.description}
          name={`${namePreffix}-form-description`}
        >
          <Input.TextArea
            rows={5}
            disabled={!existingTranslation}
            onChange={handleChangeDescription}
            value={existingTranslationValues?.description}
          />
        </TranslationFormItem>
      )}
    </div>
  );
};

export default FormDefinitionTranslation;
