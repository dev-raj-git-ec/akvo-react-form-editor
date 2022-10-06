import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Form, Input, Select } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionGroupFn } from '../lib/store';

const QuestionCustomParams = ({ question }) => {
  const { id, questionGroupId } = question;
  const form = Form.useFormInstance();
  const namePreffix = `question-${id}`;

  const { customParams } = UIStore.useState((s) => s.hostParams);
  const [initLoad, setInitLoad] = useState(true);
  const [selectedParam, setSelectedParam] = useState(null);
  const [paramValue, setParamValue] = useState(null);
  const [paramValueOptionProps, setParamValueOptionProps] = useState({});

  useEffect(() => {
    if (initLoad) {
      // initial value load
      const customParamObj = customParams
        .map((cp) => {
          const findValue = question?.[cp.name];
          if (findValue) {
            return { ...cp, paramValue: findValue };
          }
          return false;
        })
        .find((x) => x);
      if (customParamObj) {
        handleChangeSelectParameter(customParamObj.name);
        setParamValue(
          customParamObj.type === 'input'
            ? customParamObj.paramValue[0]
            : customParamObj.paramValue
        );
      }
      setInitLoad(false);
    }
  }, [customParams, question, initLoad, handleChangeSelectParameter]);

  const selectParameterOption = useMemo(() => {
    return customParams.map((cp) => ({
      label: cp.label,
      value: cp.name,
    }));
  }, [customParams]);

  const updateGlobalStore = useCallback(
    (objKey, value, isDelete = false) => {
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id) {
                if (isDelete && q?.[objKey]) {
                  delete q[objKey];
                  return q;
                }
                return { ...q, [objKey]: value };
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

  const handleChangeSelectParameter = useCallback(
    (val) => {
      if (selectedParam) {
        setParamValue(null);
        updateGlobalStore(selectedParam.name, null, true);
        form.setFieldsValue({
          [`${namePreffix}-parameter_value`]:
            selectedParam.type === 'input' ? null : [],
        });
      }
      form.setFieldsValue({
        [`${namePreffix}-select_parameter`]: val,
      });
      const findParam = customParams.find((cp) => cp.name === val);
      if (findParam?.multiple) {
        setParamValueOptionProps({
          mode: 'multiple',
          showArrow: true,
        });
      } else {
        setParamValueOptionProps({});
      }
      setSelectedParam(findParam);
    },
    [customParams, form, namePreffix, selectedParam, updateGlobalStore]
  );

  const handleChangeParameterValue = (val) => {
    setParamValue(val);
    const isDelete = !val;
    const objKey = selectedParam.name;
    const value = Array.isArray(val) ? val : [val];
    updateGlobalStore(objKey, value, isDelete);
  };

  return (
    <div>
      <Form.Item
        label="Select Parameter"
        name={`${namePreffix}-select_parameter`}
      >
        <Select
          showSearch
          allowClear
          className={styles['select-dropdown']}
          options={selectParameterOption}
          optionFilterProp="label"
          onChange={handleChangeSelectParameter}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          value={selectedParam?.name || []}
        />
      </Form.Item>
      <Form.Item
        label="Parameter Value"
        name={`${namePreffix}-parameter_value`}
      >
        {!selectedParam && <Input disabled />}
        {selectedParam?.type === 'option' && (
          <Select
            showSearch
            allowClear
            className={styles['select-dropdown']}
            options={selectedParam?.options || []}
            optionFilterProp="label"
            onChange={(val) => handleChangeParameterValue(val)}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            value={paramValue || []}
            {...paramValueOptionProps}
          />
        )}
        {selectedParam?.type === 'input' && (
          <Input
            onChange={(e) => handleChangeParameterValue(e?.target?.value)}
            value={paramValue || null}
          />
        )}
      </Form.Item>
    </div>
  );
};

export default QuestionCustomParams;
