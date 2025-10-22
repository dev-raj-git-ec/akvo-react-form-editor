# akvo-react-form-editor - clone

need to make it work and understand how to use it everywhere

Survey Editor for generating **[Akvo React Form](https://www.npmjs.com/package/akvo-react-form)** survey definition. [View Demo](https://akvo.github.io/akvo-react-form-editor/)

[![Build Status](https://akvo.semaphoreci.com/badges/akvo-react-form-editor/branches/main.svg?style=shields)](https://akvo.semaphoreci.com/projects/akvo-react-form-editor) [![Repo Size](https://img.shields.io/github/repo-size/akvo/akvo-react-form-editor)](https://img.shields.io/github/repo-size/akvo/akvo-react-form-editor) [![GitHub release](https://img.shields.io/github/release/akvo/akvo-react-form-editor.svg)](https://GitHub.com/akvo/akvo-react-form-editor/releases/) [![NPM](https://img.shields.io/npm/v/akvo-react-form-editor.svg)](https://www.npmjs.com/package/akvo-react-form-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![GitHub license](https://img.shields.io/github/license/akvo/akvo-react-form-editor.svg)](https://github.com/akvo/akvo-react-form-editor/blob/main/LICENSE) [![Documentation Status](https://readthedocs.org/projects/akvo-react-form-editor/badge/?version=latest)](https://akvo-react-form-editor.readthedocs.io/en/latest/?badge=latest)

## Install

#### Using NPM

```bash
npm install --save akvo-react-form-editor
```

#### Using Yarn

```bash
yarn add akvo-react-form-editor
```

## Supported Question Type

| Type                          | Value           |
| ----------------------------- | --------------- |
| **Input Text**                | input           |
| **Input Number**              | number          |
| **Cascade Select**            | cascade         |
| **TextArea**                  | text            |
| **Date**                      | date            |
| **Option**                    | option          |
| **Multiple Option**           | multiple_option |
| **Tree Select**               | tree            |
| **Geolocation**               | geo             |
| **Table (Multiple Question)** | table           |
| **Autofield (fn string)**     | autofield       |

## Usage

```jsx
import React from 'react';
import 'akvo-react-form-editor/dist/index.css'; /* REQUIRED */
import WebformEditor from 'akvo-react-form-editor';

const Example = () => {
  const onSave = (values) => {
    console.log(values)
  }

  render() {
    return <WebformEditor initialValue={{}} onSave={onSave} />;
  }
}
```

## API

### WebformEditor

| Props                 | Description                                                               | Type                                                                 | Default |
| --------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------- |
| **onSave**            | Trigger after save button click                                           | `function(values)`                                                   | -       |
| **limitQuestionType** | Support to limit question type available                                  | Array[[QuestionType](#supported-question-type)] \| `undefined`       | -       |
| **defaultQuestion**   | Support to set custom default new question type, name and required status | Object{[defaultQuestion](#default-question-optional)} \| `undefined` | -       |
| **initialValue**      | Set value by Form initialization (**Required** as empty object)           | Object{[initialValue](#initial-value-optional)} \| `{}`              | -       |
| **settingCascadeURL** | Value for Select Option on cascade question type                          | Array[[settingCascadeURL](#setting-cascade-url)] \| `undefined`      | -       |
| **settingHintURL**    | Value for Hint / Validate question setting                                | Object{[settingHintURL](#setting-hint-url)} \| `undefined`           | -       |
| **customParams**      | Custom Parameters                                                         | Object{[customParams](#custom-params)} \| `undefined`                |

## Properties

### Default Question (optional)

Default question should be defined as object.

| Props        | Description                                                                      | Type                                                                                           |
| ------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **type**     | Use one of [QuestionType](#supported-question-type) as default new question type | `number` \| `input` \| `text` \| `option` \| `multiple_option` \| `cascade` \| `tree` \| `geo` |
| **name**     | Set default new question title / name                                            | String                                                                                         |
| **required** | Set new question required `true`/`false` by default                              | Boolean                                                                                        |

Example:

```jsx
<WebformEditor
  defaultQuestion={{
    type: 'text',
    name: 'New Question Title',
    required: true,
  }}
/>
```

### Setting Cascade URL

Setting cascade URL should be defined as array of object. This value was used to fill Select Option value for cascade question type.

| Props        | Description               | Type                                                                 |
| ------------ | ------------------------- | -------------------------------------------------------------------- |
| **id**       | Unique id as option value | Integer                                                              |
| **name**     | Shown as option label     | String                                                               |
| **endpoint** | Cascade API               | String                                                               |
| **initial**  | Initial Parameter         | Integer \| String \| `undefined`                                     |
| **list**     | Object name of array      | `res.data?.[list]` \| `res.data` \| String \| `undefined` \| `false` |

Example:

```jsx
<WebformEditor
  settingCascadeURL={[
    {
      id: 1,
      name: 'Province',
      endpoint:
        'http://tech-consultancy.akvo.org/akvo-flow-web-api/cascade/seap/cascade-296940912-v1.sqlite',
      initial: 0,
      list: false,
    },
  ]}
/>
```

### Setting Hint URL

Setting Hint URL should be defined as array of object. This value was used to fill Select Option value for hint setting in a question.

Example:

```jsx
<WebformEditor
  settingHintURL={{
    questionTypes: ['number'],
    settings: [
      {
        id: 1,
        name: 'JMP Explorer API',
        endpoint: 'https://jmp-explorer.akvotest.org/api/hint',
        path: [
          {
            label: 'Maximum',
            value: 'max',
          },
          {
            label: 'Minimum',
            value: 'min',
          },
          {
            label: 'Average',
            value: 'mean',
          },
          {
            label: 'Quantile 1',
            value: 'q1',
          },
          {
            label: 'Quantile 2',
            value: 'q2',
          },
          {
            label: 'Quantile 3',
            value: 'q3',
          },
        ],
      },
    ],
  }}
/>
```

#### Setting Hint URL Object

| Props             | Description                                        | Type                                                           |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| **questionTypes** | Value to limit hint setting for a certain question | Array[[QuestionType](#supported-question-type)] \| `undefined` |
| **settings**      | Value for hint options                             | Array[[Settings Parameters](#settings-parameters)]             |

#### Settings Parameters

| Props        | Description                                                                                     | Type                                       |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **id**       | Unique id as option value                                                                       | Integer                                    |
| **name**     | Shown as option label                                                                           | String                                     |
| **endpoint** | Hint API                                                                                        | String                                     |
| **path**     | Hint of object path provided by API which containt the value will be shown as a hint/validation | Array[[Path Parameters](#path-parameters)] |

#### Path Parameters

| Props     | Description                | Type   |
| --------- | -------------------------- | ------ |
| **label** | Label for the path options | String |
| **value** | Value for the path options | String |

### Initial Value (optional)

Webform initial value use the same format as [Akvo React Form form structure](https://github.com/akvo/akvo-react-form#example-form-structure). This value was used to load a form into Akvo React Form Editor to update that form definition.

Example: [Initial Value Example](https://github.com/akvo/akvo-react-form-editor/blob/main/example/src/example-initial-value.json)

[![akvo-react-form](https://img.shields.io/github/package-json/dependency-version/akvo/akvo-react-form-editor/akvo-react-form)](https://www.npmjs.com/package/akvo-react-form) [![antd](https://img.shields.io/github/package-json/dependency-version/akvo/akvo-react-form-editor/antd)](https://www.npmjs.com/package/antd)

### Custom Params

Custom parameters are key-value pairs that we can implement in the Webform Editor.

Example:

```jsx
<WebformEditor
  customParams={{
    label: 'Set Custom Parameter',
    params: [
      {
        name: 'params_name_a',
        label: 'Single Option Param',
        type: 'option',
        multiple: false,
        options: [
          { label: 'Option 1', value: 'SO1' },
          { label: 'Option 2', value: 'SO2' },
        ],
      },
      {
        name: 'params_name_b',
        label: 'Multiple Option Param',
        type: 'option',
        multiple: true,
        options: [
          { label: 'Multiple Option 1', value: 'MO1' },
          { label: 'Multiple Option 2', value: 'MO2' },
        ],
      },
      {
        name: 'params_name_c',
        label: 'Input Param',
        type: 'input',
      },
    ],
  }}
/>
```

#### Custom Parameters Setting

| Props      | Description                     | Type                                           |
| ---------- | ------------------------------- | ---------------------------------------------- |
| **label**  | Label for the custom params tab | String \| `undefined`                          |
| **params** | List of custom parameters       | Array[[Custom Parameters](#custom-parameters)] |

#### Custom Parameters

| Props        | Description             | Type                                                          |
| ------------ | ----------------------- | ------------------------------------------------------------- |
| **name**     | Parameter name          | String                                                        |
| **label**    | Parameter label         | String \| `undefined`                                         |
| **type**     | Field Type              | `option` \| `input` \| `number`                               |
| **multiple** | Whether multiple or not | Boolean                                                       |
| **options**  | Parameter Options       | Array[[Option Parameters](#option-parameters)] \| `undefined` |

#### Option Parameters

| Props     | Description                  | Type                  |
| --------- | ---------------------------- | --------------------- |
| **label** | Label for the params options | String \| `undefined` |
| **value** | Value for the params options | String                |

## License

AGPL-3.0 © [akvo](https://github.com/akvo)
