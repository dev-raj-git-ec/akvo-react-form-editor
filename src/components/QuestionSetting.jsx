import React, { useMemo } from 'react';
import { Form, Input, Select, Checkbox, Alert, Row, Col, Popover } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionType, questionGroupFn } from '../lib/store';
import {
  SettingInput,
  SettingTree,
  SettingNumber,
  SettingOption,
  SettingCascade,
  SettingDate,
  SettingTable,
} from './question-type';
import { map, groupBy, orderBy } from 'lodash';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const QuestionSetting = ({ question, dependant }) => {
  const { id, name, type, variable, tooltip, required, questionGroupId, meta } =
    question;
  const namePreffix = `question-${id}`;
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const form = Form.useFormInstance();
  const qType = Form.useWatch(`${namePreffix}-type`, form);
  const { limitQuestionType } = hostParams;

  const showMetaCheckbox = useMemo(() => {
    return ![questionType.geo, questionType.tree, questionType.table].includes(
      type
    );
  }, [type]);

  const questionTypeDropdownValue = useMemo(() => {
    if (limitQuestionType && limitQuestionType?.length) {
      return limitQuestionType;
    }
    return Object.keys(questionType).map((key) => ({
      label: questionType[key]?.split('_').join(' '),
      value: questionType[key],
    }));
  }, [limitQuestionType]);

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

  const handleChangeMeta = (e) => {
    updateState('meta', e?.target?.checked);
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
        <Input
          onChange={handleChangeName}
          allowClear
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTypeLabel}
        initialValue={type}
        name={`${namePreffix}-type`}
        required
      >
        <Select
          showSearch
          optionFilterProp="label"
          className={styles['select-dropdown']}
          options={questionTypeDropdownValue}
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
        <Input
          onChange={handleChangeVariableName}
          allowClear
        />
      </Form.Item>
      <Form.Item
        label={UIText.inputQuestionTooltipLabel}
        initialValue={tooltip?.text}
        name={`${namePreffix}-tooltip`}
      >
        <Input.TextArea
          onChange={handleChangeTooltip}
          allowClear
          rows={5}
        />
      </Form.Item>
      <Row
        gutter={[24, 24]}
        align="middle"
      >
        <Col>
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
        </Col>
        {showMetaCheckbox && (
          <Col>
            <div>
              <Form.Item
                name={`${namePreffix}-meta`}
                className={styles['input-checkbox-wrapper']}
              >
                <Checkbox
                  onChange={handleChangeMeta}
                  checked={meta}
                >
                  {' '}
                  {UIText.inputQuestionMetaCheckbox}
                </Checkbox>
                <Popover
                  placement="top"
                  content={<i>{UIText.inputQuestionMetaCheckboxHint}</i>}
                >
                  <AiOutlineQuestionCircle
                    style={{
                      cursor: 'pointer',
                      marginLeft: '-4px',
                    }}
                  />
                </Popover>
              </Form.Item>
            </div>
          </Col>
        )}
      </Row>
      {qType === questionType.input && <SettingInput {...question} />}
      {qType === questionType.number && <SettingNumber {...question} />}
      {[questionType.option, questionType.multiple_option].includes(qType) && (
        <SettingOption {...question} />
      )}
      {qType === questionType.tree && <SettingTree {...question} />}
      {qType === questionType.cascade && <SettingCascade {...question} />}
      {qType === questionType.date && <SettingDate {...question} />}
      {qType === questionType.table && <SettingTable {...question} />}
    </div>
  );
};

export default QuestionSetting;
