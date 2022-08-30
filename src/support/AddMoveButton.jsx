import React from 'react';
import { Button, Row, Col, Space } from 'antd';
import { UIStore, questionGroupFn } from '../lib/store';
import { orderBy } from 'lodash';

const AddMoveButton = ({
  order: prevOrder,
  text,
  className,
  disabled = false,
  isLastItem = false,
}) => {
  const { buttonCancelText } = UIStore.useState((s) => s.UIText);
  const movingQg = UIStore.useState((s) => s.activeMoveQuestionGroup);
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
    const currentQg = {
      ...movingQg,
      order: isLastItem
        ? prevOrder
        : prevOrder
        ? prevOrder > movingQg.order
          ? prevOrder
          : prevOrder + 1
        : 1,
    };
    const orderedQg = questionGroups
      .filter((qg) => qg.order !== movingQg.order)
      .map((x) => {
        if (isLastItem) {
          if (x.order > movingQg.order) {
            return { ...x, order: x.order - 1 };
          }
          return x;
        }
        if (prevOrder > movingQg.order) {
          if (x.order <= prevOrder && x.order > movingQg.order) {
            return { ...x, order: x.order - movingQg.order || 1 };
          }
          if (x.order >= prevOrder && x.order > movingQg.order) {
            return x;
          }
          return x;
        }
        if (
          prevOrder < movingQg.order &&
          x.order < movingQg.order &&
          x.order >= prevOrder + 1
        ) {
          return { ...x, order: x.order + (prevOrder || 1) };
        }
        return x;
      });
    questionGroupFn.store.update((s) => {
      s.questionGroups = orderBy([...orderedQg, currentQg], 'order');
    });
    UIStore.update((s) => {
      s.activeMoveQuestionGroup = null;
    });
  };

  const handleOnCancel = () => {
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
      <Col
        span={movingQg ? 12 : 24}
        align="left"
      >
        <Button
          type="dashed"
          className="reorder-button"
          size="small"
          onClick={movingQg ? handleOnMove : handleOnAdd}
          disabled={disabled}
        >
          {text}
        </Button>
      </Col>
      {movingQg && (
        <Col
          span={12}
          align="right"
        >
          <Button
            type="dashed"
            className="reorder-button"
            size="small"
            onClick={handleOnCancel}
          >
            {buttonCancelText}
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default AddMoveButton;
