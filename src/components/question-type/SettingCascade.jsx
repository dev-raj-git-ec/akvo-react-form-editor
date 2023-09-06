import React, { useMemo } from 'react';
import { Form, Row, Col, Input, InputNumber, Select } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingCascade = ({
  id,
  questionGroupId,
  api = {
    endpoint: null,
    initial: 0,
    list: false,
  },
}) => {
  const namePreffix = `question-${id}`;
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const settingCascadeURL = hostParams?.settingCascadeURL;
  const form = Form.useFormInstance();

  const cascadeURLDropdownValue = useMemo(() => {
    return settingCascadeURL.map((x) => ({ label: x.name, value: x.id }));
  }, [settingCascadeURL]);

  const updateGlobalState = (values = {}) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                api: {
                  ...q?.api,
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
    const findURL = settingCascadeURL.find((x) => x.id === e);
    if (findURL) {
      form.setFieldsValue({
        [`${namePreffix}-api_initial`]: findURL.initial,
        [`${namePreffix}-api_list`]: findURL.list,
      });
      updateGlobalState({
        endpoint: findURL.endpoint,
        initial: findURL.initial || 0,
        list: findURL.list || false,
      });
    }
  };

  const handleChangeInitial = (e) => {
    updateGlobalState({ initial: e });
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreCascadeSettingText}
      </p>
      <Form.Item
        label={UIText.inputQuestionEndpointLabel}
        name={`${namePreffix}-api_endpoint`}
      >
        <Row
          align="middle"
          gutter={[24, 24]}
        >
          <Col span={10}>
            <Select
              showSearch
              className={styles['select-dropdown']}
              optionFilterProp="label"
              options={cascadeURLDropdownValue}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              onChange={handleChangeEndpoint}
            />
          </Col>
          <Col span={14}>
            <Input
              value={api?.endpoint}
              disabled
            />
          </Col>
        </Row>
      </Form.Item>
      <Row
        align="bottom"
        gutter={[24, 24]}
      >
        <Col span={4}>
          <Form.Item
            label={UIText.inputQuestionInitialValueLabel}
            initialValue={api?.initial}
            name={`${namePreffix}-api_initial`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
              onChange={handleChangeInitial}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default SettingCascade;
