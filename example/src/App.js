import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import WebformEditor from 'akvo-react-form-editor';
import 'akvo-react-form-editor/dist/index.css';

const App = () => {
  const [source, setSource] = useState({});
  const [showJson, setShowJson] = useState(false);

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
          <button onClick={() => setShowJson(!showJson)}>
            {showJson ? '☑' : '☒'} JSON
          </button>
        </div>

        <WebformEditor onSave={setSource} />
      </div>
      <div className={'half-width json-source' + (!showJson ? ' shrink' : '')}>
        <ReactJson
          src={source}
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
