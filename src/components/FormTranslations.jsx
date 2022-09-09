import React from 'react';
import styles from '../styles.module.css';
import { Row, Col, Card, Tag, Select, Form, Space } from 'antd';
import { UIStore, FormStore, questionGroupFn } from '../lib/store';
import FormDefinitionTranslation from './translations/FormDefinitionTranslation';

const ExistingTranslation = () => {
  const { localeDropdownValue, existingTranslation } = UIStore.useState(
    (s) => s
  );
  const formStore = FormStore.useState((s) => s);
  const languages = formStore?.languages || [];

  const handleCloseTag = (lang) => {
    FormStore.update((u) => {
      u.languages = languages.filter((ln) => ln !== lang);
    });
    // TODO:: remove deleted translation from translations obj
  };

  return languages.map((lang) => {
    const findLang = localeDropdownValue.find((lc) => lc.value === lang);
    return (
      <a
        key={lang}
        href="#"
        onClick={() =>
          UIStore.update((u) => {
            u.existingTranslation = existingTranslation !== lang ? lang : null;
          })
        }
      >
        <Tag
          className={`${styles.tags} ${
            existingTranslation === lang ? styles['tags-active'] : ''
          }`}
          closable
          onClose={() => handleCloseTag(lang)}
        >
          {findLang.label}
        </Tag>
      </a>
    );
  });
};

const FormTranslations = () => {
  const [formTranslation] = Form.useForm();
  const { UIText, localeDropdownValue } = UIStore.useState((s) => s);
  const formStore = FormStore.useState((s) => s);
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const languages = formStore?.languages || [];

  console.info(questionGroups);

  return (
    <Space
      direction="vertical"
      style={{ width: '100%' }}
      size={24}
    >
      <Card>
        <Row
          align="top"
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
              style={{ width: '70%' }}
              options={localeDropdownValue}
              optionFilterProp="label"
              onChange={(e) =>
                FormStore.update((u) => {
                  u.languages = [...languages, e];
                })
              }
              value={[]}
            />
          </Col>
          <Col span={12}>
            <h4>{UIText.inputFormExistingTranslationsLabel}</h4>
            <ExistingTranslation />
          </Col>
        </Row>
      </Card>
      <Form
        form={formTranslation}
        key="akvo-react-form-editor-translation"
        name="akvo-react-form-editor-translation"
      >
        <FormDefinitionTranslation />
      </Form>
    </Space>
  );
};

export default FormTranslations;
