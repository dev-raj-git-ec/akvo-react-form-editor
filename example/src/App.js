import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import WebformEditor from 'akvo-react-form-editor';
import * as initial_value from './example-initial-value.json';

import 'akvo-react-form-editor/dist/index.css';

const defaultQuestion = {
  type: 'text',
  name: 'New Question',
  required: true,
};

const App = () => {
  const [source, setSource] = useState({});
  const [showJson, setShowJson] = useState(false);
  const [initialValue, setInitialValue] = useState(false);
  const [defaultQuestionValue, setDefaultQuestionValue] = useState(false);

  const onJsonEdit = ({ updated_src }) => {
    setSource(updated_src);
  };

  return (
    <div className="display-container">
      <div className={showJson ? 'half-width' : 'half-width full'}>
        <div className="btn-group-toggle">
          <img
            alt="github"
            src="https://img.shields.io/badge/Akvo-React Form Editor-009688?logo=github&style=flat-square"
          />
          <img
            alt="npm"
            src="https://img.shields.io/npm/v/akvo-react-form-editor?logo=npm&style=flat-square"
          />
          <button
            onClick={() => setDefaultQuestionValue(!defaultQuestionValue)}
          >
            {defaultQuestionValue ? '☑' : '☒'} Default Question
          </button>
          <button onClick={() => setInitialValue(!initialValue)}>
            {initialValue ? '☑' : '☒'} Initial Value
          </button>
          <button onClick={() => setShowJson(!showJson)}>
            {showJson ? '☑' : '☒'} JSON
          </button>
        </div>

        <WebformEditor
          onSave={setSource}
          initialValue={initialValue ? initial_value.default : source}
          settingTreeDropdownValue={[
            { label: 'Administration Tree', value: 'administration' },
            { label: 'Example Tree', value: 'example' },
          ]}
          settingCascadeURL={[
            {
              id: 1,
              name: 'County',
              endpoint: 'https://rtmis.akvotest.org/api/v1/administration',
              initial: 1,
              list: 'children',
            },
            {
              id: 2,
              name: 'Sub-County Baringo',
              endpoint: 'https://rtmis.akvotest.org/api/v1/administration',
              initial: 2,
              list: 'children',
            },
          ]}
          defaultQuestion={defaultQuestionValue ? defaultQuestion : null}
          // limitQuestionType={[
          //   'text',
          //   'number',
          //   'option',
          //   'multiple_option',
          //   'date',
          // ]}
        />
      </div>
      <div className={'half-width json-source' + (!showJson ? ' shrink' : '')}>
        <ReactJson
          src={initialValue ? initial_value.default : source}
          theme="monokai"
          displayDataTypes={false}
          onEdit={onJsonEdit}
          indentWidth={2}
        />
      </div>
    </div>
  );
};

export default App;
