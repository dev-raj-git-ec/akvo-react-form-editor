import React, { useState } from 'react';
import { Form, Input, Select, Row, Col, Card } from 'antd';
import styles from '../../styles.module.css';
import { UIStore, questionGroupFn, generateId } from '../../lib/store';

const generateColumnName = (text) =>
  text.trim().toLowerCase().split(' ').join('_');

const columnType = {
  input: 'input',
  number: 'number',
  option: 'option',
};

const defaultColumns = ({ init = false }) => {
  const column = {
    name: null,
    label: 'Column Name',
    type: columnType.input,
  };
  if (init) {
    return [{ ...column, id: generateId() }];
  }
  return { ...column, id: generateId() };
};

const SettingTable = ({ id, questionGroupId, columns: initialColumns }) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const [columns, setColumns] = useState(
    initialColumns?.length ? initialColumns : defaultColumns({ init: true })
  );

  const columnTypeOptions = Object.keys(columnType).map((key) => ({
    label: columnType[key],
    value: key,
  }));

  return (
    <div className={styles['more-question-setting-text']}>
      <p>{UIText.questionMoreTableTypeSettingText}</p>
      {columns.map((cl, cli) => {
        return (
          <Card
            key={`column-${id}-${cli}-${cl.id}`}
            title={`Column - ${cli + 1}`}
          >
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Form.Item
                  name={`${namePreffix}-${cl.name}`}
                  className={styles['form-item-no-bottom-margin']}
                  label={UIText.inputColumnNameLabel}
                >
                  <Input allowClear />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={`${namePreffix}-${cl.type}`}
                  className={styles['form-item-no-bottom-margin']}
                  label={UIText.inputColumnTypeLabel}
                >
                  <Select
                    showSearch
                    optionFilterProp="label"
                    options={columnTypeOptions}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        );
      })}
    </div>
  );
};

export default SettingTable;
