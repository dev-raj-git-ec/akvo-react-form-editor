import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Select, Row, Col, Card, Button, Space } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn, generateId } from '../../lib/store';
import {
  MdOutlineRemoveCircleOutline,
  MdOutlineAddCircleOutline,
  MdOutlineArrowCircleDown,
  MdOutlineArrowCircleUp,
} from 'react-icons/md';
import { takeRight, orderBy } from 'lodash';

const generateColumnName = (text) =>
  text.trim().toLowerCase().split(' ').join('_');

const columnType = {
  input: 'input',
  number: 'number',
  option: 'option',
  text: 'text',
};

const defaultColumns = ({ init = false }) => {
  const column = {
    name: null,
    label: null,
    type: null,
  };
  if (init) {
    return [{ ...column, id: generateId() }];
  }
  return { ...column, id: generateId() };
};

const defaultColumnOptions = ({ init = false, order = 0 }) => {
  const option = {
    name: 'New Option',
    order: 1,
  };
  if (init) {
    return [{ ...option, id: generateId() }];
  }
  return { ...option, id: generateId(), order: order };
};

const SettingTable = ({ id, questionGroupId, columns: initialColumns }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const [columns, setColumns] = useState(
    initialColumns?.length
      ? initialColumns.map((cl, cli) => {
          if (cl?.options && cl?.options?.length) {
            const options = cl.options.map((op, opi) => ({
              ...op,
              id: op?.id || generateId() + initialColumns.length + opi + 1,
            }));
            return {
              ...cl,
              id: cl?.id || generateId() + cli,
              options: options,
            };
          }
          return {
            ...cl,
            id: cl?.id || generateId() + cli,
          };
        })
      : defaultColumns({ init: true })
  );

  const columnTypeOptions = Object.keys(columnType).map((key) => ({
    label: columnType[key],
    value: key,
  }));

  useEffect(() => {
    questionGroupFn.store.update((s) => {
      s.questionGroups = s.questionGroups.map((qg) => {
        if (qg.id === questionGroupId) {
          const questions = qg.questions.map((q) => {
            if (q.id === id) {
              return { ...q, columns: columns };
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
  }, [id, questionGroupId, columns]);

  const updateColumns = useCallback(
    (columnId, obj) => {
      const updatedColumn = columns.map((cl) => {
        if (cl.id === columnId) {
          return {
            ...cl,
            ...obj,
          };
        }
        return cl;
      });
      setColumns(updatedColumn);
    },
    [columns]
  );

  const handleChangeColumnName = (columnId, value) => {
    updateColumns(columnId, { name: generateColumnName(value), label: value });
  };

  const handleChangeColumnType = (columnId, value) => {
    let obj = { type: value };
    if (value === columnType.option) {
      obj = { ...obj, options: defaultColumnOptions({ init: true }) };
    }
    updateColumns(columnId, obj);
  };

  const handleAddColumn = () => {
    const addColumns = [...columns, defaultColumns({ init: false })];
    setColumns(addColumns);
  };

  const handleDeleteColumn = (currentColumn) => {
    const updatedColumn = columns.filter((cl) => cl.id !== currentColumn.id);
    setColumns(updatedColumn);
  };

  const handleOnAddOption = (currentColumn, currentOption) => {
    const { id: columnId, options } = currentColumn;
    const { order: currentOrder } = currentOption;
    const lastOrder = takeRight(orderBy(options, 'order'))[0].order;
    // reorder prev option
    const reorderOptions = options.map((opt) => {
      let order = opt.order;
      if (opt.order > currentOrder) {
        order = order + 1;
      }
      if (
        opt.order < currentOrder &&
        opt.order !== 1 &&
        currentOrder !== lastOrder
      ) {
        order = order - 1;
      }
      return { ...opt, order: order };
    });
    const addOptions = [
      ...reorderOptions,
      defaultColumnOptions({ order: currentOrder + 1 }),
    ];
    updateColumns(columnId, { options: addOptions });
  };

  const handleOnMoveOption = (currentColumn, currentOption, targetOrder) => {
    const { id: columnId, options } = currentColumn;
    const { order: currentOrder } = currentOption;
    // handle move
    const prevOptions = options.filter(
      (opt) => opt.order !== currentOrder && opt.order !== targetOrder
    );
    const currentOptions = options
      .filter((opt) => opt.order === currentOrder)
      .map((opt) => ({
        ...opt,
        order: targetOrder,
      }));
    const targetOptions = options
      .filter((opt) => opt.order === targetOrder)
      .map((opt) => ({
        ...opt,
        order: currentOrder,
      }));
    updateColumns(columnId, {
      options: orderBy(
        [...prevOptions, ...currentOptions, ...targetOptions],
        'order'
      ),
    });
  };

  const handleOnDeleteOption = (currentColumn, currentOptionId) => {
    const { id: columnId, options } = currentColumn;
    // delete and reorder
    updateColumns(columnId, {
      options: orderBy(options, 'order')
        .filter((opt) => opt.id !== currentOptionId)
        .map((opt, opti) => ({ ...opt, order: opti + 1 })),
    });
  };

  const handleOnChangeOption = (currentColumn, currentOption, value) => {
    const { id: columnId, options } = currentColumn;
    const { id: currentOptId } = currentOption;
    const updatedOptions = options.map((op) => {
      if (op.id === currentOptId) {
        return {
          ...op,
          name: value,
        };
      }
      return op;
    });
    updateColumns(columnId, { options: updatedOptions });
  };

  return (
    <div className={styles['more-question-setting-text']}>
      <p>{UIText.questionMoreTableTypeSettingText}</p>
      {columns.map((cl, cli) => {
        return (
          <Card
            key={`column-${id}-${cli}-${cl.id}`}
            title={
              <Row
                gutter={[24, 24]}
                align="middle"
                justify="space-between"
              >
                <Col span={20}>{`Column - ${cli + 1}`}</Col>
                <Col
                  span={4}
                  align="end"
                >
                  <Space>
                    <Button
                      type="link"
                      className={styles['button-icon']}
                      icon={<MdOutlineAddCircleOutline />}
                      onClick={() => handleAddColumn()}
                    />
                    <Button
                      type="link"
                      className={styles['button-icon']}
                      icon={<MdOutlineRemoveCircleOutline />}
                      onClick={() => handleDeleteColumn(cl)}
                      disabled={columns.length === 1}
                    />
                  </Space>
                </Col>
              </Row>
            }
          >
            <Row gutter={[24, 20]}>
              <Col span={12}>
                <Form.Item
                  name={`${namePreffix}-column_name_${cl.id}`}
                  className={styles['form-item-no-bottom-margin']}
                  label={UIText.inputColumnNameLabel}
                  initialValue={cl.label}
                >
                  <Input
                    allowClear
                    onChange={(e) =>
                      handleChangeColumnName(cl.id, e?.target?.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={`${namePreffix}-column_type_${cl.id}`}
                  className={styles['form-item-no-bottom-margin']}
                  label={UIText.inputColumnTypeLabel}
                  initialValue={cl.type}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={columnTypeOptions}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                    onChange={(val) => handleChangeColumnType(cl.id, val)}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                {cl.type === columnType.option && (
                  <div>
                    <p>{UIText.questionTableTypeDefineOptionsText}</p>
                    {cl?.options?.map((op, opi) => {
                      return (
                        <Row
                          key={`option-${id}-${opi}-${op.id}`}
                          gutter={[24, 24]}
                        >
                          <Col span={12}>
                            <Form.Item
                              initialValue={op.name}
                              name={`${namePreffix}-option_name_${op.id}_${cl.id}`}
                            >
                              <Input
                                allowClear
                                onChange={(e) =>
                                  handleOnChangeOption(cl, op, e?.target?.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col>
                            <Space>
                              <Button
                                type="link"
                                className={styles['button-icon']}
                                icon={<MdOutlineAddCircleOutline />}
                                onClick={() => handleOnAddOption(cl, op)}
                              />
                              <Button
                                type="link"
                                className={styles['button-icon']}
                                icon={<MdOutlineArrowCircleUp />}
                                onClick={() =>
                                  handleOnMoveOption(cl, op, op.order - 1)
                                }
                                disabled={opi === 0}
                              />
                              <Button
                                type="link"
                                className={styles['button-icon']}
                                icon={<MdOutlineArrowCircleDown />}
                                onClick={() =>
                                  handleOnMoveOption(cl, op, op.order + 1)
                                }
                                disabled={opi === cl.options.length - 1}
                              />
                              <Button
                                type="link"
                                className={styles['button-icon']}
                                icon={<MdOutlineRemoveCircleOutline />}
                                onClick={() => handleOnDeleteOption(cl, op.id)}
                                disabled={cl.options.length === 1}
                              />
                            </Space>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default SettingTable;
