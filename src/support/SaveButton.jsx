import React from 'react';
import { Space, Button } from 'antd';
import styles from '../styles.module.css';
import { UIStore } from '../lib/store';

const SaveButton = ({
  onClickSave = () => {},
  cancelButton = true,
  onClickCancel = () => {},
}) => {
  const UIText = UIStore.useState((s) => s.UIText);
  return (
    <Space className={styles['space-align-right']}>
      <Button
        type="primary"
        onClick={onClickSave}
      >
        {UIText.buttonSaveText}
      </Button>
      {cancelButton && (
        <Button onClick={onClickCancel}>{UIText.buttonCancelText}</Button>
      )}
    </Space>
  );
};

export default SaveButton;
