import React, { useMemo } from 'react';
import { Form, Checkbox, Row, Col, Input, InputNumber, Select } from 'antd';
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
  const { settingCascadeURL } = hostParams;
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
        [`${namePreffix}-api-initial`]: findURL.initial,
        [`${namePreffix}-api-list`]: findURL.list,
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

  const handleChangeList = (value) => {
    updateGlobalState({
      list: value,
    });
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreCascadeSettingText}
      </p>
      <Form.Item
        label={UIText.inputQuestionEndpointLabel}
        name={`${namePreffix}-api-endpoint`}
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
            name={`${namePreffix}-api-initial`}
          >
            <InputNumber
              style={{ width: '100%' }}
              controls={false}
              keyboard={false}
              onChange={handleChangeInitial}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={`${namePreffix}-api-list-checkbox`}>
            <Checkbox
              onChange={(e) => handleChangeList(e?.target?.checked)}
              checked={api?.list ? true : false}
            >
              {' '}
              {UIText.inputQuestionListCheckbox}
            </Checkbox>
          </Form.Item>
        </Col>
        {api?.list && (
          <Col span={8}>
            <Form.Item
              label={UIText.inputQuestionListLabel}
              initialValue={
                api?.list ? (api.list !== true ? api.list : null) : null
              }
              name={`${namePreffix}-api-list`}
            >
              <Input
                onChange={(e) => handleChangeList(e?.target?.value)}
                allowClear
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default SettingCascade;
