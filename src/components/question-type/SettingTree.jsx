import React from 'react';
import { Form, Select } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn } from '../../lib/store';

const SettingTree = ({ id, questionGroupId, option }) => {
  const namePreffix = `question-${id}`;
  const { UIText, hostParams } = UIStore.useState((s) => s);
  const { settingTreeDropdownValue } = hostParams;

  const handleChangeTreeDropdown = (e) => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return {
                ...q,
                option: e,
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

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreTreeSettingText}
      </p>
      <Form.Item
        label={UIText.inputSelectTreeDropdownValueLabel}
        name={`${namePreffix}-tree-options`}
      >
        <Select
          showSearch
          className={styles['select-dropdown']}
          optionFilterProp="label"
          options={settingTreeDropdownValue}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          value={option}
          onChange={handleChangeTreeDropdown}
        />
      </Form.Item>
    </div>
  );
};

export default SettingTree;
