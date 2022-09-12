import React from 'react';
import styles from '../styles.module.css';
import { Row, Col, Divider, Tag, Select, Form, Space } from 'antd';
import { UIStore, FormStore, questionGroupFn } from '../lib/store';
import {
  FormDefinitionTranslation,
  QuestionGroupDefinitionTranslation,
} from './translations';

const ExistingTranslation = () => {
  const { localeDropdownValue, existingTranslation } = UIStore.useState(
    (s) => s
  );
  const formStore = FormStore.useState((s) => s);
  const languages = formStore?.languages || [];

  const handleCloseTag = (lang) => {
    UIStore.update((u) => {
      u.existingTranslation =
        existingTranslation === lang ? null : existingTranslation;
    });
    // remove deleted translation from translations list
    FormStore.update((u) => {
      u.languages = languages.filter((ln) => ln !== lang);
      u.translations = formStore?.translations?.filter(
        (tl) => tl.language !== lang
      );
    });
    questionGroupFn.store.update((u) => {
      u.questionGroups = u.questionGroups.map((qg) => {
        const questions = qg.questions.map((q) => {
          let newObj = q;
          if (q?.options && q?.options?.length) {
            const options = q.options.map((op) => ({
              ...op,
              translations: op?.translations?.filter(
                (tl) => tl.language !== lang
              ),
            }));
            newObj = {
              ...newObj,
              options: options,
            };
          }
          return {
            ...newObj,
            translations: q?.translations?.filter((tl) => tl.language !== lang),
          };
        });
        return {
          ...qg,
          questions: questions,
          translations: qg?.translations?.filter((tl) => tl.language !== lang),
        };
      });
    });
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

  return (
    <Space
      direction="vertical"
      style={{ width: '100%' }}
      size={24}
    >
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
            optionFilterProp="children"
            onChange={(e) =>
              FormStore.update((u) => {
                u.languages = [...languages, e];
              })
            }
            value={[]}
          >
            {localeDropdownValue.map((ld, ldi) => (
              <Select.Option
                key={`${ld.value}-${ldi}`}
                value={ld.value}
                disabled={languages.includes(ld.value) || ld.value === 'en'}
              >
                {ld.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <h4>{UIText.inputFormExistingTranslationsLabel}</h4>
          <ExistingTranslation />
        </Col>
      </Row>
      <Divider />
      <Form
        form={formTranslation}
        key="akvo-react-form-editor-translation"
        name="akvo-react-form-editor-translation"
        layout="vertical"
      >
        <FormDefinitionTranslation />
        {questionGroups.map((qg, qgi) => {
          return (
            <QuestionGroupDefinitionTranslation
              key={`translation-question-group-definition-${qgi}`}
              index={qgi}
              questionGroup={qg}
            />
          );
        })}
      </Form>
    </Space>
  );
};

export default FormTranslations;
