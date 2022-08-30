import React from 'react';
import { Space, Button } from 'antd';
import styles from '../styles.module.css';
import { BiMove } from 'react-icons/bi';

const CardTitle = ({
  title,
  disableMoveButton,
  numbering = null,
  onMoveClick = () => {},
}) => {
  return (
    <Space>
      <Button
        type="link"
        className={styles['button-icon']}
        onClick={onMoveClick}
        disabled={disableMoveButton}
        icon={<BiMove />}
      />
      {numbering ? `${numbering}. ${title}` : title}
    </Space>
  );
};

export default CardTitle;
