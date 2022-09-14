import React from 'react';
import { Modal } from 'antd';

const AlertPopup = ({
  onConfirm,
  onCancel,
  visible,
  children,
  title = 'Alert',
  okButtonProps = {},
  okText = 'OK',
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      centered={true}
      okButtonProps={okButtonProps}
      okText={okText}
    >
      {children}
    </Modal>
  );
};

export default AlertPopup;
