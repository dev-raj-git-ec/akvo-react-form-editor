import React from 'react';
import { Button, Row, Space } from 'antd';
import { UIStore } from '../lib/store';

const AddMoveButton = ({
  text,
  onClick,
  className,
  cancelButton = false,
  disabled = false,
  onCancel = () => {},
}) => {
  const { buttonCancelText } = UIStore.useState((s) => s.UIText);

  return (
    <Row
      align="middle"
      justify="start"
      className={`arfe-reorder-wrapper ${className}`}
    >
      <Space>
        <Button
          type="secondary"
          className="reorder-button"
          size="small"
          onClick={onClick}
          disabled={disabled}
        >
          {text}
        </Button>
        {cancelButton && (
          <Button
            type="secondary"
            className="reorder-button"
            size="small"
            onClick={onCancel}
          >
            {buttonCancelText}
          </Button>
        )}
      </Space>
    </Row>
  );
};

export default AddMoveButton;
