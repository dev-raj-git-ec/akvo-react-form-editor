import React from 'react';
import { Form, Select } from 'antd';
import styles from '../../styles.module.css';
import { UIStore } from '../../lib/store';

const SettingTree = ({ id, dropdownValues = [] }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreTreeSettingText}
      </p>
      <Form.Item
        label={UIText.inputSelectTreeDropdownValueLabel}
        initialValue={false}
        name={`${namePreffix}-tree-options`}
      >
        <Select
          className={styles['select-dropdown']}
          options={dropdownValues}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
        />
      </Form.Item>
    </div>
  );
};

export default SettingTree;
