import React from 'react';
import { Space } from 'antd';

const Wrapper = ({ isNotSpace, children }) => {
  if (isNotSpace) {
    return <div>{children}</div>;
  }
  return (
    <Space
      direction="vertical"
      size={18}
    >
      {children}
    </Space>
  );
};

export default Wrapper;
