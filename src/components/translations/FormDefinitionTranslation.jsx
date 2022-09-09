import React from 'react';
import { Input } from 'antd';
import { UIStore, FormStore } from '../../lib/store';
import { TranslationFormItem } from '../../support';

const FormDefinitionTranslation = () => {
  const UIText = UIStore.useState((s) => s.UIText);
  const formStore = FormStore.useState((s) => s);

  return (
    <div>
      {formStore?.name && (
        <TranslationFormItem
          labelText={UIText.inputFormNameLabel}
          currentValue={formStore.name}
        >
          <Input />
        </TranslationFormItem>
      )}
      {formStore?.description && (
        <TranslationFormItem
          labelText={UIText.inputFormDescriptionLabel}
          currentValue={formStore.description}
        >
          <Input.TextArea rows={5} />
        </TranslationFormItem>
      )}
    </div>
  );
};

export default FormDefinitionTranslation;
