import React from 'react';
import { Space } from 'antd';
import CardExtraButton from './CardExtraButton';

const CardTitle = ({ id, title, buttons }) => {
  return (
    <Space>
      {buttons?.map((cfg) => (
        <CardExtraButton
          key={`${cfg.type}-${id}`}
          type={cfg.type}
          isExpand={cfg.isExpand}
          onClick={() => cfg.onClick()}
          onCancel={() => cfg.onCancel()}
          disabled={cfg?.disabled}
        />
      ))}
      {title && <div className="arfe-question-group-title">{title}</div>}
    </Space>
  );
};

export default CardTitle;
