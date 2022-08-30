import React from 'react';
import { Button, Row, Space } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';
import { orderBy } from 'lodash';

const AddMoveButton = ({
  order: prevOrder,
  text,
  className,
  cancelButton = false,
  disabled = false,
  onCancel = () => {},
}) => {
  const { buttonCancelText } = UIStore.useState((s) => s.UIText);
  const activeMoveQuestionGroup = UIStore.useState(
    (s) => s.activeMoveQuestionGroup
  );
  const { questionGroups } = questionGroupFn.store.useState((s) => s);

  const handleOnAdd = () => {
    const prevQg = questionGroups.filter((qg) => qg.order <= prevOrder);
    const nextQg = questionGroups
      .filter((qg) => qg.order > prevOrder)
      .map((qg) => ({
        ...qg,
        order: qg.order + 1,
      }));
    const newQuestionGroups = [
      ...prevQg,
      questionGroupFn.add({ prevOrder: prevOrder }),
      ...nextQg,
    ];
    questionGroupFn.store.update((s) => {
      s.questionGroups = newQuestionGroups;
    });
  };

  const handleOnMove = () => {
    const orderedQg = questionGroups
      .filter((qg) => qg.order !== activeMoveQuestionGroup.order)
      .map((x) => {
        if (x.order > prevOrder) {
          return x;
        }
        return { ...x, norder: x.order - prevOrder || 1 };
      });

    const currentQg = { ...activeMoveQuestionGroup, order: prevOrder || 1 };
    questionGroupFn.store.update((s) => {
      s.questionGroups = orderBy([...orderedQg, currentQg], 'order');
    });
    UIStore.update((s) => {
      s.activeMoveQuestionGroup = null;
    });
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
          onClick={activeMoveQuestionGroup ? handleOnMove : handleOnAdd}
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
