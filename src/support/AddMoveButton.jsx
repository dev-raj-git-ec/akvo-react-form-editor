import React from 'react';
import { Button, Row, Col } from 'antd';
import { UIStore } from '../lib/store';

const AddMoveButton = ({
  text,
  className,
  movingItem = null,
  handleCancelMove = () => {},
  disabled = false,
  handleOnAdd = () => {},
  handleOnMove = () => {},
}) => {
  const { buttonCancelText } = UIStore.useState((s) => s.UIText);

  return (
    <Row
      align="middle"
      justify="start"
      className={`arfe-reorder-wrapper ${className}`}
    >
      <Col
        span={movingItem ? 12 : 24}
        align="left"
      >
        <Button
          type="dashed"
          className="reorder-button"
          size="small"
          onClick={movingItem ? handleOnMove : handleOnAdd}
          disabled={disabled}
        >
          {text}
        </Button>
      </Col>
      {movingItem && (
        <Col
          span={12}
          align="right"
        >
          <Button
            type="danger"
            className="reorder-button"
            size="small"
            onClick={handleCancelMove}
          >
            {buttonCancelText}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default AddMoveButton;
