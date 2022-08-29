import React from 'react';
import { Space, Button } from 'antd';
import { UIStore } from '../lib/store';

const SaveButton = ({ onClickSave, onClickCancel }) => {
  const UIText = UIStore.useState((s) => s.UIText);
  return (
    <Space>
      <Button
        type="primary"
        onClick={onClickSave}
      >
        {UIText.buttonSaveText}
      </Button>
      <Button onClick={onClickCancel}>{UIText.buttonCancelText}</Button>
    </Space>
  );
};

export default SaveButton;
