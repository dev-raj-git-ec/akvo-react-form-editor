import React, { useMemo } from 'react';
import styles from '../styles.module.css';
import { Form, Row, Col, Select, Input } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';
import { useCallback } from 'react';

const QuestionHint = ({
  id,
  questionGroupId,
  hint = {
    id: null,
    endpoint: null,
    path: [],
    static: null,
    buttonText: null,
  },
}) => {
  const namePreffix = `question-${id}`;
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const settingHintURL = hostParams?.settingHintURL?.settings;
  const form = Form.useFormInstance();

  const updateGlobalState = useCallback(
    (values = {}) => {
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id) {
                return {
                  ...q,
                  hint: {
                    ...q?.hint,
                    ...values,
                  },
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

  const hintURLDropdownValue = useMemo(() => {
    return settingHintURL && settingHintURL?.length
      ? settingHintURL.map((x) => ({
          label: x.name,
          value: x.id,
        }))
      : [];
  }, [settingHintURL]);

  const hintPathDropdownValue = useMemo(() => {
    let endpoint = hint.endpoint;
    if (hint.endpoint && endpoint.includes(String(id))) {
      endpoint = endpoint.replace(`/${String(id)}`, '');
    }
    const findURL = settingHintURL.find(
      (x) => x.id === hint.id || x.endpoint === endpoint
    );
    updateGlobalState({ id: findURL?.id });
    return findURL?.path || [];
  }, [settingHintURL, hint.id, hint.endpoint, id, updateGlobalState]);

  const handleChangeEndpoint = (e) => {
    const findURL = settingHintURL.find((x) => x.id === e);
    form.setFieldsValue({
      [`${namePreffix}-hint_path`]: [],
    });
    updateGlobalState({
      id: e, // set current URL id
      endpoint: findURL?.endpoint ? `${findURL.endpoint}/${id}` : null,
      path: [],
    });
  };

  const handleChangePath = (val) => {
    updateGlobalState({
      path: val,
    });
  };

  const handleChangeStaticValue = (e) => {
    updateGlobalState({
      id: null,
      static: e?.target?.value,
      endpoint: null,
      path: [],
    });
  };

  const handleChangeButtonText = (e) => {
    updateGlobalState({
      buttonText: e?.target?.value,
    });
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionHintSettingText}
      </p>
      <Form.Item
        label={UIText.inputSelectHintEndpointLabel}
        name={`${namePreffix}-hint_endpoint`}
      >
        <Row
          align="middle"
          gutter={[24, 24]}
        >
          <Col span={10}>
            <Select
              showSearch
              allowClear
              className={styles['select-dropdown']}
              optionFilterProp="label"
              options={hintURLDropdownValue}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              onChange={handleChangeEndpoint}
              value={hint.id}
              disabled={hint.static}
            />
          </Col>
          <Col span={14}>
            <Input
              value={hint?.endpoint}
              disabled
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        label={UIText.inputSelectHintPathLabel}
        name={`${namePreffix}-hint_path`}
        initialValue={hint.path}
      >
        <Select
          showSearch
          allowClear
          mode="multiple"
          showArrow
          className={styles['select-dropdown']}
          optionFilterProp="label"
          options={hintPathDropdownValue}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          onChange={handleChangePath}
          disabled={hint.static}
        />
      </Form.Item>
      <Row
        align="middle"
        gutter={[24, 24]}
      >
        <Col span={12}>
          <Form.Item
            label={UIText.inputQuestionStaticValueLabel}
            name={`${namePreffix}-hint_static_value`}
            initialValue={hint.static}
          >
            <Input
              onChange={handleChangeStaticValue}
              disabled={hint.endpoint}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={UIText.inputQuestionHintButtonTextLabel}
            name={`${namePreffix}-hint_button_text`}
            initialValue={hint.buttonText}
          >
            <Input onChange={handleChangeButtonText} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default QuestionHint;
