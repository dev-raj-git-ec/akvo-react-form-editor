import React from 'react';
import 'antd/dist/antd.css';
import styles from './styles.module.css';
import { Card, Tabs } from 'antd';
import { FormWrapper, FormDefinition } from './components';
import { UIStore } from './lib/store';

const WebformEditor = () => {
  const current = UIStore.useState((s) => s.current);
  const UIText = UIStore.useState((s) => s.UIText);
  const { tab: currentTab } = current;
  const { formTabPane, previewTabPane, mandatoryQuestionCount, version } =
    UIText;

  const handleTabsOnChange = (e) => {
    UIStore.update((s) => {
      s.current = {
        ...current,
        tab: e,
      };
    });
  };

  return (
    <div
      key="container"
      className={styles.container}
    >
      <Card>
        <Tabs
          defaultActiveKey={current.tab}
          onChange={handleTabsOnChange}
          tabBarExtraContent={
            <span>{`1 / 10 ${mandatoryQuestionCount} | ${version} : 1`}</span>
          }
          tabBarGutter={24}
        >
          <Tabs.TabPane
            tab={formTabPane}
            key="form"
          />
          <Tabs.TabPane
            tab={previewTabPane}
            key="preview"
          />
        </Tabs>
        {currentTab === 'form' && (
          <FormWrapper>
            <FormDefinition />
          </FormWrapper>
        )}
        {currentTab === 'preview' && <h3>Preview</h3>}
      </Card>
    </div>
  );
};

export default WebformEditor;
