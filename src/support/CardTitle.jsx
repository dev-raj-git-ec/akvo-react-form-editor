import React from 'react';
import { Space, Tag } from 'antd';
import ButtonWithIcon from './ButtonWithIcon';

const CardTitle = ({ id, title, buttons, dependency = [] }) => {
  return (
    <Space>
      {!!dependency.length && (
        <Tag style={{ margin: 'auto' }}>
          {dependency.length} Dependenc{dependency.length > 1 ? 'ies' : 'y'}
        </Tag>
      )}
      {buttons?.map((cfg) => (
        <ButtonWithIcon
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
