import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import {
  UIStore,
  FormStore,
  questionGroupFn,
  questionType,
} from '../lib/store';
import { SaveButton } from '../support';

const FormDefinition = ({ onSave }) => {
  const form = Form.useFormInstance();
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const formStore = FormStore.useState((s) => s);
  const UIText = UIStore.useState((s) => s.UIText);
  const { inputFormNameLabel, inputFormDescriptionLabel } = UIText;
  const clearQuestionObj = (keysToRemove, obj) => {
    let clearedQuestion = {};
    Object.keys(obj).forEach((key) => {
      if (!keysToRemove.includes(key)) {
        clearedQuestion = {
          ...clearedQuestion,
          [key]: obj[key],
        };
      }
    });
    return clearedQuestion;
  };

  const handleSave = () => {
    form.submit();
    if (onSave) {
      // transform questions to remove unused setting by question type
      const transformQuestionGroups = questionGroups.map((qg) => {
        const questions = qg.questions.map((q) => {
          if (q.type !== questionType.input) {
            q = clearQuestionObj(['requiredDoubleEntry', 'hiddenString'], q);
          }
          if (q.type !== questionType.number) {
            q = clearQuestionObj(['allowDecimal', 'min', 'max', 'equal'], q);
          }
          if (
            ![questionType.option, questionType.multiple_option].includes(
              q.type
            )
          ) {
            q = clearQuestionObj(['allowOther', 'options'], q);
          }
          if (q.type !== questionType.cascade) {
            q = clearQuestionObj(['api'], q);
          }
          return q;
        });
        return {
          ...qg,
          questions: questions,
        };
      });
      // TODO: FOLLOW AKVO REACT FORM
      const output = transformQuestionGroups.map((qg) => ({
        id: qg.id,
        name: qg.name,
        order: qg.order,
        description: qg?.description,
        repeatable: qg.repeatable,
        question: qg.questions.map((q) => ({
          ...q,
          option: q?.options || null,
          tooltip: q?.tooltip ? { text: q.tooltip } : null,
        })),
      }));
      FormStore.update((s) => {
        s.question_group = output;
      });
      onSave({
        ...formStore,
        question_group: output,
      });
      questionGroupFn.store.update((s) => {
        s.questionGroups = transformQuestionGroups;
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      'form-name': formStore.name,
      'form-description': formStore.description,
    });
  }, [form, formStore]);

  return (
    <div
      key="form-definition-input"
      className="arfe-form-definition"
    >
      <Form.Item
        label={inputFormNameLabel}
        name="form-name"
      >
        <Input
          onChange={(e) =>
            FormStore.update((u) => {
              u.name = e?.target?.value;
            })
          }
        />
      </Form.Item>
      <Form.Item
        label={inputFormDescriptionLabel}
        name="form-description"
      >
        <Input.TextArea
          rows={5}
          onChange={(e) =>
            FormStore.update((u) => {
              u.description = e?.target?.value;
            })
          }
        />
      </Form.Item>
      <SaveButton
        cancelButton={false}
        onClickSave={handleSave}
      />
    </div>
  );
};

export default FormDefinition;
