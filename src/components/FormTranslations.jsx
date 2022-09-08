import React from 'react';
import styles from '../styles.module.css';
import { Row, Col, Card, Tag, Select, Form, Input } from 'antd';
import { UIStore, FormStore, questionGroupFn } from '../lib/store';
import { TranslationFormItem } from '../support';

const FormTranslations = () => {
  const [formTranslation] = Form.useForm();
  const UIText = UIStore.useState((s) => s.UIText);
  const formStore = FormStore.useState((s) => s);
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const languages = formStore?.languages || [];

  // console.log(formStore, questionGroups);

  return (
    <div>
      <Card title="Select an existing translation or add a new one">
        <Row
          align="middle"
          justify="space-between"
          gutter={[24, 24]}
        >
          <Col span={4}>
            <h4>{UIText.inputFormDefaultLanguageLabel}</h4>
            <Tag className={styles.tags}>English</Tag>
          </Col>
          <Col span={8}>
            <h4>{UIText.inputFormTranslationLabel}</h4>
            <Select
              showSearch
              allowClear
              style={{ width: '70%' }}
              options={[]}
              onChange={(e) =>
                FormStore.update((u) => {
                  u.languages = [...languages, e];
                })
              }
            />
          </Col>
          <Col span={12}>
            <h4>{UIText.inputFormExistingTranslationsLabel}</h4>
            <a
              href="#"
              onClick={() => console.info('a')}
            >
              <Tag
                className={styles.tags}
                closable
                onClose={() => {}}
              >
                Existing
              </Tag>
            </a>
          </Col>
        </Row>
      </Card>
      <Card>
        <Form
          form={formTranslation}
          key="akvo-react-form-editor-translation"
          name="akvo-react-form-editor-translation"
          layout="vertical"
        >
          {formStore?.name && (
            <TranslationFormItem
              labelText={UIText.inputFormNameLabel}
              currentValue={formStore.name}
              children={<Input />}
            />
          )}
          {formStore?.description && (
            <TranslationFormItem
              labelText={UIText.inputFormDescriptionLabel}
              currentValue={formStore.description}
              children={<Input.TextArea rows={5} />}
            />
          )}
        </Form>
      </Card>
    </div>
  );
};

export default FormTranslations;
