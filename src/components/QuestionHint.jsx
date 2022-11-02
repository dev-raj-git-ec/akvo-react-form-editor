import React, { useState, useMemo } from 'react';
import styles from '../styles.module.css';
import { Form, Row, Col, Select, Input } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';

const QuestionHint = ({
  id,
  questionGroupId,
  hint = {
    endpoint: null,
    path: [],
    static: null,
    buttonText: null,
  },
}) => {
  const namePreffix = `question-${id}`;
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const { settingHintURL } = hostParams;
  const form = Form.useFormInstance();
  const [selectedURL, setSelectedURL] = useState(null);

  const hintURLDropdownValue = useMemo(() => {
    return settingHintURL.map((x) => ({
      label: x?.name,
      value: x.id,
    }));
  }, [settingHintURL]);

  const hintPathDropdownValue = useMemo(() => {
    return settingHintURL.find((x) => x.endpoint === hint.endpoint)?.path || [];
  }, [settingHintURL, hint.endpoint]);

  const updateGlobalState = (values = {}) => {
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
  };

  const handleChangeEndpoint = (e) => {
    setSelectedURL(e);
    const findURL = settingHintURL.find((x) => x.id === e);
    form.setFieldsValue({
      [`${namePreffix}-hint_path`]: [],
    });
    updateGlobalState({
      endpoint: findURL?.endpoint,
      path: [],
    });
  };

  const handleChangePath = (val) => {
    updateGlobalState({
      path: val,
    });
  };

  const handleChangeStaticValue = (e) => {
    setSelectedURL(null);
    updateGlobalState({
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
              value={selectedURL}
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
