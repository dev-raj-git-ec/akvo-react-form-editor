import React, { useMemo } from 'react';
import { Input } from 'antd';
import { UIStore, formFn } from '../../lib/store';
import { TranslationFormItem } from '../../support';
import data from '../../lib/data';

const FormDefinitionTranslation = () => {
  const { UIText, existingTranslation } = UIStore.useState((s) => s);
  const formStore = formFn.store.useState((s) => s);
  const namePreffix = `translation-${existingTranslation}`;

  const existingTranslationValues = useMemo(() => {
    return formStore?.translations?.find(
      (tl) => tl.language === existingTranslation
    );
  }, [formStore, existingTranslation]);

  const updateTranslation = (key, value) => {
    const { newTranslations, currentTranslations } = data.generateTranslations(
      key,
      value,
      formStore?.translations,
      existingTranslation
    );
    formFn.store.update((u) => {
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
          initialValue={existingTranslationValues?.name}
        >
          <Input
            disabled={!existingTranslation}
            onChange={handleChangeName}
          />
        </TranslationFormItem>
      )}
      {formStore?.description && (
        <TranslationFormItem
          labelText={UIText.inputFormDescriptionLabel}
          currentValue={formStore.description}
          name={`${namePreffix}-form-description`}
          initialValue={existingTranslationValues?.description}
        >
          <Input.TextArea
            rows={5}
            disabled={!existingTranslation}
            onChange={handleChangeDescription}
          />
        </TranslationFormItem>
      )}
    </div>
  );
};

export default FormDefinitionTranslation;
