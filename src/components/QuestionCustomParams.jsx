import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Form, Input, Select } from 'antd';
import styles from '../styles.module.css';
import { UIStore, questionGroupFn } from '../lib/store';

const QuestionCustomParams = ({ question }) => {
  const { id, questionGroupId } = question;
  const namePreffix = `question-${id}`;

  const { customParams } = UIStore.useState((s) => s.hostParams);
  const [initLoad, setInitLoad] = useState(true);
  const [paramValue, setParamValue] = useState({});

  useEffect(() => {
    if (initLoad) {
      // initial value load
      const customParamObj = customParams
        .map((cp) => {
          const findValue = question?.[cp.name];
          if (findValue) {
            return { [cp.name]: findValue };
          }
          return false;
        })
        .filter((x) => x);
      if (customParamObj.length) {
        setParamValue(
          customParamObj.reduce((res, curr) => ({ ...res, ...curr }))
        );
      }
      setInitLoad(false);
    }
  }, [customParams, question, initLoad]);

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

  const handleChangeParameterValue = (objKey, val) => {
    setParamValue({
      ...paramValue,
      [objKey]: val,
    });
    const isDelete = !val || !val?.length;
    const value = Array.isArray(val) ? val : [val];
    updateGlobalStore(objKey, value, isDelete);
  };

  return customParams.map((cp, cpi) => {
    let multipleProps = {};
    if (cp?.multiple) {
      multipleProps = {
        mode: 'multiple',
        showArrow: true,
      };
    }
    return (
      <div key={`${cp.name}-${cpi}`}>
        <Form.Item
          label={cp.label}
          name={`${namePreffix}-${cp.name}`}
        >
          {cp.type === 'option' && (
            <Select
              showSearch
              allowClear
              className={styles['select-dropdown']}
              options={cp?.options || []}
              optionFilterProp="label"
              onChange={(val) => handleChangeParameterValue(cp.name, val)}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              value={paramValue?.[cp.name] || []}
              {...multipleProps}
            />
          )}
          {cp.type === 'input' && (
            <Input
              onChange={(e) =>
                handleChangeParameterValue(cp.name, e?.target?.value)
              }
              value={paramValue?.[cp.name] || null}
            />
          )}
        </Form.Item>
      </div>
    );
  });
};

export default QuestionCustomParams;
