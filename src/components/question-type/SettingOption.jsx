import React, { useState, useEffect, useCallback } from 'react';
import { Form, Checkbox, Space, Row, Col, Input, Button } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn, generateId } from '../../lib/store';
import {
  MdOutlineRemoveCircleOutline,
  MdOutlineAddCircleOutline,
  MdOutlineArrowCircleDown,
  MdOutlineArrowCircleUp,
} from 'react-icons/md';
import { orderBy, takeRight, snakeCase } from 'lodash';
import { SketchPicker } from 'react-color';

const defaultOptions = ({ init = false, order = 0 }) => {
  const optTextTemp = 'New Option';
  const option = {
    value: snakeCase(optTextTemp),
    label: optTextTemp,
    order: 1,
  };
  if (init) {
    return [
      {
        ...option,
        id: generateId(),
        label: `${optTextTemp} 1`,
        value: snakeCase(`${optTextTemp} 1`),
        order: 1,
      },
      {
        ...option,
        id: generateId() + 1,
        label: `${optTextTemp} 2`,
        value: snakeCase(`${optTextTemp} 2`),
        order: 2,
      },
    ];
  }
  return {
    ...option,
    id: generateId(),
    order: order,
  };
};

const SettingOption = ({
  id,
  questionGroupId,
  allowOther,
  allowOtherText,
  options: initialOptions,
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const [options, setOptions] = useState(
    initialOptions?.length
      ? initialOptions.map((x, xi) => ({
          ...x,
          label: x?.label || x.name,
          value: x?.value || snakeCase(x.name),
          id: x?.id || generateId() + xi,
          order: x?.order || xi + 1,
        }))
      : defaultOptions({ init: true })
  );
  const [displayColorPicker, setDisplayColorPicker] = useState(null);

  const updateState = useCallback(
    (name, value) => {
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id) {
                return {
                  ...q,
                  [name]: value,
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
    },
    [id, questionGroupId]
  );

  useEffect(() => {
    updateState('options', options);
  }, [options, id, questionGroupId, updateState]);

  const handleOnChangeAllowOther = (e) => {
    updateState('allowOther', e?.target?.checked);
  };

  const handleOnChangeAllowOtherText = (e) => {
    updateState('allowOtherText', e?.target?.value);
  };

  const handleOnChangeCode = (e, current) => {
    const { id: currentId } = current;
    const val = e?.target?.value;
    setOptions(
      options.map((opt) => {
        if (opt.id === currentId) {
          return {
            ...opt,
            value: val ? val : '',
          };
        }
        return opt;
      })
    );
  };

  const handleOnBlurCode = () => {
    const updatedOptions = options.map((opt) => ({
      ...opt,
      value: opt.value ? snakeCase(opt.value) : '',
    }));
    setOptions(updatedOptions);
    updateState('options', updatedOptions);
  };

  const handleOnChangeOption = (e, current) => {
    const { id: currentId } = current;
    const val = e?.target?.value;
    setOptions(
      options.map((opt) => {
        if (opt.id === currentId) {
          let valueTemp = opt.value;
          if (!opt?.value?.trim() || opt.value === snakeCase(opt.label)) {
            valueTemp = snakeCase(val);
          }
          return {
            ...opt,
            label: val ? val : '',
            value: valueTemp ? valueTemp : '',
          };
        }
        return opt;
      })
    );
  };

  const handleOnAddOption = (current) => {
    const { order: currentOrder } = current;
    const lastOrder = takeRight(orderBy(options, 'order'))[0].order;
    // reorder prev option
    const reorderOptions = options.map((opt) => {
      if (opt.order > currentOrder) {
        opt['order'] = opt['order'] + 1;
      }
      if (
        opt.order < currentOrder &&
        opt.order !== 1 &&
        currentOrder !== lastOrder
      ) {
        opt['order'] = opt['order'] - 1;
      }
      return opt;
    });
    const addOptions = [
      ...reorderOptions,
      defaultOptions({ order: currentOrder + 1 }),
    ];
    setOptions(orderBy(addOptions, 'order'));
  };

  const handleOnMoveOption = (current, targetOrder) => {
    const { order: currentOrder } = current;

    const prevOptions = options.filter(
      (opt) => opt.order !== currentOrder && opt.order !== targetOrder
    );
    const currentOption = options
      .filter((opt) => opt.order === currentOrder)
      .map((opt) => ({
        ...opt,
        order: targetOrder,
      }));
    const targetOption = options
      .filter((opt) => opt.order === targetOrder)
      .map((opt) => ({
        ...opt,
        order: currentOrder,
      }));
    setOptions(
      orderBy([...prevOptions, ...currentOption, ...targetOption], 'order')
    );
  };

  const handleOnDeleteOption = (currentId) => {
    // delete and reorder
    setOptions(
      orderBy(options, 'order')
        .filter((opt) => opt.id !== currentId)
        .map((opt, opti) => ({ ...opt, order: opti + 1 }))
    );
  };

  const handleDisplayColorPicker = (optionId) => {
    if (displayColorPicker === optionId) {
      // remove option id from display color picker
      setDisplayColorPicker(null);
      return;
    }
    setDisplayColorPicker(optionId);
  };

  const handleOnPickColor = (colorHex, current) => {
    const { id: currentId } = current;
    setOptions(
      options.map((opt) => {
        if (opt.id === currentId) {
          return {
            ...opt,
            color: colorHex || null,
          };
        }
        return opt;
      })
    );
    setDisplayColorPicker(null);
  };

  return (
    <div>
      <p className={styles['more-question-setting-text']}>
        {UIText.questionMoreOptionTypeSettingText}
      </p>
      <Row
        align="bottom"
        gutter={[24, 24]}
      >
        <Col>
          <Form.Item name={`${namePreffix}-allow_other`}>
            <Checkbox
              onChange={handleOnChangeAllowOther}
              checked={allowOther}
            >
              {' '}
              {UIText.inputQuestionAllowOtherCheckbox}
            </Checkbox>
          </Form.Item>
        </Col>
        {allowOther && (
          <Col span={11}>
            <Form.Item
              label={UIText.inputQuestionAllowOtherTextLabel}
              name={`${namePreffix}-allow_other_text`}
              initialValue={allowOtherText}
            >
              <Input
                onChange={handleOnChangeAllowOtherText}
                allowClear
              />
            </Form.Item>
          </Col>
        )}
      </Row>
      {/* Options */}
      {orderBy(options, 'order').map((d, di) => (
        <Row
          key={`option-${id}-${di}`}
          align="start"
          justify="start"
          gutter={[12, 12]}
        >
          <Col span={4}>
            <Form.Item
            // name={`${namePreffix}-option_value_${d.id}`}
            >
              <Input
                placeholder="Value"
                onChange={(e) => handleOnChangeCode(e, d)}
                onBlur={handleOnBlurCode}
                allowClear
                value={d.value}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              initialValue={d.label}
              name={`${namePreffix}-option_label_${d.id}`}
            >
              <Input
                onChange={(e) => handleOnChangeOption(e, d)}
                allowClear
              />
            </Form.Item>
          </Col>
          {/* color picker */}
          <Col span={2}>
            <Form.Item
              initialValue={d?.color || null}
              name={`${namePreffix}-option_color_${d.id}`}
            >
              <Input
                addonBefore={
                  <div
                    style={{
                      width: 20,
                      height: 15,
                      backgroundColor: d?.color || '#fffffff',
                    }}
                  >
                    &nbsp;
                  </div>
                }
                onClick={() => handleDisplayColorPicker(d.id)}
                onChange={(e) => handleOnPickColor(e?.target?.value, d)}
                placeholder="#FFFFFF"
                value={d?.color || null}
              />
              {displayColorPicker === d.id && (
                <div style={{ position: 'absolute', zIndex: '2' }}>
                  <SketchPicker
                    color={d?.color || '#ffffff'}
                    onChange={(e) => handleOnPickColor(e?.hex, d)}
                  />
                </div>
              )}
            </Form.Item>
          </Col>
          {/* eol color picker */}
          <Col>
            <Space>
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<MdOutlineAddCircleOutline />}
                onClick={() => handleOnAddOption(d)}
              />
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<MdOutlineArrowCircleUp />}
                onClick={() => handleOnMoveOption(d, d.order - 1)}
                disabled={di === 0}
              />
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<MdOutlineArrowCircleDown />}
                onClick={() => handleOnMoveOption(d, d.order + 1)}
                disabled={di === options.length - 1}
              />
              <Button
                type="link"
                className={styles['button-icon']}
                icon={<MdOutlineRemoveCircleOutline />}
                onClick={() => handleOnDeleteOption(d.id)}
                disabled={options.length === 1}
              />
            </Space>
          </Col>
        </Row>
      ))}
      {/* /* EOL Options */}
    </div>
  );
};

export default SettingOption;
