import React, { useCallback, useMemo } from 'react';
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
import QuestionHint from './QuestionHint';
import { map, groupBy, orderBy, isEmpty } from 'lodash';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const QuestionSetting = ({ question, dependant }) => {
  const {
    id,
    name,
    type,
    variable,
    tooltip,
    required,
    questionGroupId,
    meta,
    disableDelete,
  } = question;
  const namePreffix = `question-${id}`;
  const form = Form.useFormInstance();
  const qType = Form.useWatch(`${namePreffix}-type`, form);
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const limitQuestionType = hostParams?.limitQuestionType;
  const settingHintURL = hostParams?.settingHintURL;
  const defaultQuestionParam = hostParams?.defaultQuestionParam;
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );

  const disableMetaForGeo = useMemo(() => {
    const metaGeoQuestionDefined = questionGroups
      .flatMap((qg) =>
        qg.questions.filter((q) => q.type === questionType.geo && q?.meta)
      )
      .map((q) => q.id);
    return (
      type === questionType.geo &&
      metaGeoQuestionDefined.length &&
      !metaGeoQuestionDefined.includes(id)
    );
  }, [questionGroups, type, id]);

  const showMetaCheckbox = useMemo(() => {
    const currentQuestionGroup = questionGroups.find(
      (qg) => qg.id === questionGroupId
    );
    return (
      ![questionType.tree, questionType.table].includes(type) &&
      !currentQuestionGroup?.repeatable
    );
  }, [type, questionGroups, questionGroupId]);

  const questionTypeDropdownValue = useMemo(() => {
    if (limitQuestionType && limitQuestionType?.length) {
      return limitQuestionType;
    }
    return Object.keys(questionType).map((key) => ({
      label: questionType[key]?.split('_').join(' '),
      value: questionType[key],
    }));
  }, [limitQuestionType]);

  const showHintSetting = useMemo(() => {
    if (!settingHintURL || !settingHintURL?.settings?.length) {
      return false;
    }
    if (
      settingHintURL?.questionTypes &&
      settingHintURL?.questionTypes?.length
    ) {
      return settingHintURL.questionTypes.includes(type);
    }
    return settingHintURL?.settings?.length;
  }, [settingHintURL, type]);

  const updateState = useCallback(
    (name, value) => {
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
    },
    [id, questionGroupId]
  );

  const defaultTypeValue = useMemo(() => {
    if (questionTypeDropdownValue.length) {
      const checkType = questionTypeDropdownValue.find((x) => x.value === type);
      if (checkType) {
        return type;
      }
      if (!isEmpty(defaultQuestionParam) && defaultQuestionParam?.type) {
        updateState('type', defaultQuestionParam.type);
        return defaultQuestionParam.type;
      }
      const checkText = questionTypeDropdownValue.find(
        (x) => x.value === questionType.text
      );
      const defType = checkText
        ? checkText.value
        : questionTypeDropdownValue?.[0]?.value;
      updateState('type', defType);
      return defType;
    }
    return type;
  }, [type, questionTypeDropdownValue, defaultQuestionParam, updateState]);

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
        initialValue={defaultTypeValue}
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
          disabled={dependant.length || disableDelete}
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
                  disabled={disableMetaForGeo}
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
      {showHintSetting && <QuestionHint {...question} />}
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
