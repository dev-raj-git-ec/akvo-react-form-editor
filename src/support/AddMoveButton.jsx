import React, { useMemo } from 'react';
import { Button, Row, Space } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';

const AddMoveButton = ({
  order: prevOrder,
  text,
  className,
  cancelButton = false,
  disabled = false,
  onCancel = () => {},
}) => {
  const { buttonCancelText } = UIStore.useState((s) => s.UIText);
  const { questionGroups } = questionGroupFn.store.useState((s) => s);

  const prevQg = questionGroups.filter((qg) => qg.order <= prevOrder);
  const nextQg = questionGroups
    .filter((qg) => qg.order > prevOrder)
    .map((qg) => ({
      ...qg,
      order: prevOrder ? prevOrder + qg.order : 1 + qg.order,
    }));

  const handleOnClick = () => {
    const newQuestionGroups = [
      ...prevQg,
      questionGroupFn.add({ prevOrder: prevOrder ? prevOrder : 0 }),
      ...nextQg,
    ];
    questionGroupFn.store.update((s) => {
      s.questionGroups = newQuestionGroups;
    });
    console.log(prevOrder, newQuestionGroups);
  };

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
          onClick={handleOnClick}
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
