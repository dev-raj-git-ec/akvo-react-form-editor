import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import WebformEditor from 'akvo-react-form-editor';
import * as initial_value from './example-initial-value.json';

import 'akvo-react-form-editor/dist/index.css';

const App = () => {
  const [source, setSource] = useState({});
  const [showJson, setShowJson] = useState(false);
  const [initialValue, setInitialValue] = useState(false);

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
            src="https://img.shields.io/npm/v/akvo-react-form?logo=npm&style=flat-square"
          />
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
            { label: 'Example First Tree Label', value: 'ex1' },
            { label: 'Example Second Tree Label', value: 'ex2' },
          ]}
          settingCascadeURL={[
            {
              id: 1,
              name: 'County',
              url: 'https://rtmis.akvotest.org/api/v1/administration',
              initial: 1,
              list: 'children',
            },
            {
              id: 2,
              name: 'Sub-County Baringo',
              url: 'https://rtmis.akvotest.org/api/v1/administration',
              initial: 2,
              list: 'children',
            },
          ]}
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
