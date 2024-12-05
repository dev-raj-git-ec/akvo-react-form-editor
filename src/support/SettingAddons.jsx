import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import { UIStore } from '../lib/store';

const SettingAddons = ({
  namePreffix,
  addonBefore,
  addonAfter,
  onAddonBefore,
  onAddonAfter,
}) => {
  const UIText = UIStore.useState((s) => s.UIText);

  return (
    <Row gutter={[16, 8]}>
      <Col span={12}>
        <Form.Item
          label={UIText.addonBefore}
          name={`${namePreffix}-addon_before`}
        >
          <Input
            placeholder={UIText.addonBeforePlaceholder}
            onChange={(e) => onAddonBefore(e.target.value)}
            defaultValue={addonBefore}
            maxLength={50}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={UIText.addonAfter}
          name={`${namePreffix}-addon_after`}
        >
          <Input
            placeholder={UIText.addonAfterPlaceholder}
            onChange={(e) => onAddonAfter(e.target.value)}
            defaultValue={addonAfter}
            maxLength={50}
          />
        </Form.Item>
      </Col>
    </Row>
  );
};

export default SettingAddons;
