import React from 'react';
import { Input } from 'antd';
import { UIStore, FormStore } from '../../lib/store';
import { TranslationFormItem } from '../../support';

const FormDefinitionTranslation = () => {
  const { UIText, existingTranslation } = UIStore.useState((s) => s);
  const formStore = FormStore.useState((s) => s);

  return (
    <div>
      {formStore?.name && (
        <TranslationFormItem
          labelText={UIText.inputFormNameLabel}
          currentValue={formStore.name}
          name="translation-form-name"
        >
          <Input disabled={!existingTranslation} />
        </TranslationFormItem>
      )}
      {formStore?.description && (
        <TranslationFormItem
          labelText={UIText.inputFormDescriptionLabel}
          currentValue={formStore.description}
          name="translation-form-description"
        >
          <Input.TextArea
            rows={5}
            disabled={!existingTranslation}
          />
        </TranslationFormItem>
      )}
    </div>
  );
};

export default FormDefinitionTranslation;
