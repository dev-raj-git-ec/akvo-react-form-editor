import React from 'react';
import { Form, Input, Select, Checkbox, Alert } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionType, questionGroupFn } from '../lib/store';
import {
  SettingInput,
  SettingTree,
  SettingNumber,
  SettingOption,
  SettingCascade,
  SettingDate,
} from './question-type';
import { map, groupBy, orderBy } from 'lodash';

const QuestionSetting = ({ question, dependant }) => {
  const { id, name, type, variable, tooltip, required, questionGroupId } =
    question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const form = Form.useFormInstance();
  const qType = Form.useWatch(`${namePreffix}-type`, form);

  const updateState = (name, value) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                [name]: value,
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
    updateState('name', e?.target?.value);
  };

  const handleChangeType = (e) => {
    updateState('type', e);
  };

  const handleChangeVariableName = (e) => {
    updateState('variableName', e?.target?.value);
  };

  const handleChangeTooltip = (e) => {
    const value = e?.target?.value;
    if (value) {
      updateState('tooltip', { ...tooltip, text: value });
    } else {
      updateState('tooltip', null);
    }
  };

  const handleChangeRequired = (e) => {
    updateState('required', e?.target?.checked);
  };

  const dependantGroup = map(
    groupBy(
      dependant.map((x) => ({
        name: `${x.questionGroup.order}.${x.order}. ${x.name}`,
        group: `${x.questionGroup.order}. ${x.questionGroup.name}`,
      })),
      'group'
    ),
    (i, g) => ({
      items: orderBy(i, 'name'),
      group: g,
    })
  );

  return (
    <div>
      {!!dependant.length && (
        <Alert
          message={
            <div>
              <ul className="arfe-dependant-list-box">
                Dependant Questions:
                {dependantGroup.map((d, di) => (
                  <li key={di}>
                    {d.group}
                    <ul>
                      {d.items.map((i, ii) => (
                        <li key={ii}>{i.name}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          }
          type="info"
          style={{ marginBottom: 24 }}
        />
      )}
      <Form.Item
        label={UIText.inputQuestionNameLabel}
        initialValue={name}
        name={`${namePreffix}-name`}
        required
      >
        <Input onChange={handleChangeName} />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTypeLabel}
        initialValue={type}
        name={`${namePreffix}-type`}
        required
      >
        <Select
          className={styles['select-dropdown']}
          options={Object.keys(questionType).map((key) => ({
            label: questionType[key]?.split('_').join(' '),
            value: questionType[key],
          }))}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          onChange={handleChangeType}
          disabled={dependant.length}
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionVariableNameLabel}
        initialValue={variable}
        name={`${namePreffix}-variable`}
      >
        <Input onChange={handleChangeVariableName} />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTooltipLabel}
        initialValue={tooltip?.text}
        name={`${namePreffix}-tooltip`}
      >
        <Input.TextArea onChange={handleChangeTooltip} />
      </Form.Item>
      <Form.Item
        name={`${namePreffix}-required`}
        className={styles['input-checkbox-wrapper']}
      >
        <Checkbox
          onChange={handleChangeRequired}
          checked={required}
        >
          {' '}
          {UIText.inputQuestionRequiredCheckbox}
        </Checkbox>
      </Form.Item>
      {qType === questionType.input && <SettingInput {...question} />}
      {qType === questionType.number && <SettingNumber {...question} />}
      {[questionType.option, questionType.multiple_option].includes(qType) && (
        <SettingOption {...question} />
      )}
      {qType === questionType.tree && <SettingTree {...question} />}
      {qType === questionType.cascade && <SettingCascade {...question} />}
      {qType === questionType.date && <SettingDate {...question} />}
    </div>
  );
};

export default QuestionSetting;
