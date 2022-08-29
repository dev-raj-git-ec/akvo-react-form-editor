import React from 'react';
import { Space, Button } from 'antd';
import styles from '../styles.module.css';
import { BiMove } from 'react-icons/bi';

const CardTitle = ({ title, numbering = null, onMoveClick = () => {} }) => {
  return (
    <Space>
      <Button
        type="link"
        className={styles['button-icon']}
        icon={<BiMove />}
        onClick={onMoveClick}
      />
      {numbering ? `${numbering}. ${title}` : title}
    </Space>
  );
};

export default CardTitle;
