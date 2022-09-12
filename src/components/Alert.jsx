import React from 'react';
import { Modal } from 'antd';

const Alert = ({ onConfirm, onCancel, visible, children }) => {
  return (
    <Modal
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      style={{ top: '338px' }}
    >
      {children}
    </Modal>
  );
};

export default Alert;
