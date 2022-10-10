# akvo-react-form-editor

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

| Type            | Description     |
| --------------- | --------------- |
| input           | Input Text      |
| number          | Input Number    |
| cascade         | Cascade Select  |
| text            | TextArea        |
| date            | Date            |
| option          | Option          |
| multiple_option | Multiple Option |
| tree            | Tree Select     |
| geo             | Geolocation     |

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
    return <WebformEditor onSave={onSave} />;
  }
}
```

## API

### WebformEditor

| Props                 | Description                                                               | Type                                                                 | Default |
| --------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------- |
| **onSave**            | Trigger after save button click                                           | `function(values)`                                                   | -       |
| **limitQuestionType** | Support to limit question type available                                  | Array[[QuestionType] \| `undefined`(#supported-question-type)]       | -       |
| **defaultQuestion**   | Support to set custom default new question type, name and required status | Object{[defaultQuestion](#default-question-optional)} \| `undefined` | -       |
| **initialValue**      | Set value by Form initialization                                          | Object{[initialValue](#initial-value-optional)} \| `undefined`       | -       |
| **settingCascadeURL** | Value for Select Option on cascade question type                          | Array[[settingCascadeURL](#setting-cascade-url)] \| `undefined`      | -       |

## Properties

### Default Question (optional)

Default question should be defined as object.

| Props    | Description                                                                      | Type                                                                                           |
| -------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| type     | Use one of [QuestionType](#supported-question-type) as default new question type | `number` \| `input` \| `text` \| `option` \| `multiple_option` \| `cascade` \| `tree` \| `geo` |
| name     | Set default new question title / name                                            | String                                                                                         |
| required | Set new question required `true`/`false` by default                              | Boolean                                                                                        |

Example:

```json
{
  "type": "text",
  "name": "New Question Title",
  "required": true
}
```

### Setting Cascade URL

Setting cascade URL should be defined as array of object. This value was used to fill Select Option value for cascade question type.

| Props    | Description               | Type                                                                 |
| -------- | ------------------------- | -------------------------------------------------------------------- |
| id       | Unique id as option value | Integer                                                              |
| name     | Shown as option label     | String                                                               |
| endpoint | Cascade API               | String                                                               |
| initial  | Initial Parameter         | Integer \| String \| `undefined`                                     |
| list     | Object name of array      | `res.data?.[list]` \| `res.data` \| String \| `undefined` \| `false` |
| customParams | Custom Parameters     | [Custom Parameters Setting](#custom-parameters-setting) \| `undefined`|

Example:

```json
[
  {
    "id": 1,
    "name": "Province",
    "endpoint": "http://tech-consultancy.akvo.org/akvo-flow-web-api/cascade/seap/cascade-296940912-v1.sqlite",
    "initial": 0,
    "list": false
  }
]
```

### Initial Value (optional)

Webform initial value use the same format as [Akvo React Form form structure](https://github.com/akvo/akvo-react-form#example-form-structure). This value was used to load a form into Akvo React Form Editor to update that form definition.

Example: [Initial Value Example](https://github.com/akvo/akvo-react-form-editor/blob/main/example/src/example-initial-value.json)

[![akvo-react-form](https://img.shields.io/github/package-json/dependency-version/akvo/akvo-react-form-editor/akvo-react-form)](https://www.npmjs.com/package/akvo-react-form) [![antd](https://img.shields.io/github/package-json/dependency-version/akvo/akvo-react-form-editor/antd)](https://www.npmjs.com/package/antd)


### Custom Params

Custom parameters are key-value pairs that we can implement in the Webform Editor.

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

| Props    | Description                     | Type                                                                 |
| -------- | ------------------------------- | -------------------------------------------------------------------- |
| label    | Label for the custom params tab | String \| `undefined`                                                |
| params   | List of custom parameters       | Array[[Custom Parameters](#custom-parameters)]                       |

#### Custom Parameters

| Props    | Description                     | Type                                                                 |
| -------- | ------------------------------- | -------------------------------------------------------------------- |
| name     | Parameter name                  | String                                                               |
| label    | Parameter label                 | String \| `undefined`                                                |
| type     | Field Type                      | `option|input`                                                       |
| multiple | Whether multiple or not         | Boolean                                                              |
| options  | Parameter Options               | Array[[Option Parameters](#option-parameters)] \| `undefined`        |

#### Option Parameters

| Props    | Description                     | Type                                                                 |
| -------- | ------------------------------- | -------------------------------------------------------------------- |
| label    | Label for the params options    | String \| `undefined`                                                |
| value    | Value for the params options    | String                                                               |

## License

AGPL-3.0 © [akvo](https://github.com/akvo)
