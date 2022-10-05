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

| Props                 | Description                                                               | Type                                            | Default |
| --------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- | ------- |
| **onSave**            | Trigger after save button click                                           | `function(values)`                              | -       |
| **limitQuestionType** | Support to limit question type available                                  | Array[[QuestionType](#supported-question-type)] | -       |
| **defaultQuestion**   | Support to set custom default new question type, name and required status | Object{[defaultQuestion](#default-question)}    | -       |

## Properties

### Default Question

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

[![akvo-react-form](https://img.shields.io/github/package-json/dependency-version/akvo/akvo-react-form-editor/akvo-react-form)](https://www.npmjs.com/package/akvo-react-form) [![antd](https://img.shields.io/github/package-json/dependency-version/akvo/akvo-react-form-editor/antd)](https://www.npmjs.com/package/antd)

## License

AGPL-3.0 © [akvo](https://github.com/akvo)
