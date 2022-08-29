import React from 'react';
import { Button } from 'antd';
import styles from '../styles.module.css';
import { BiShow, BiHide } from 'react-icons/bi';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import { RiDeleteBin2Line } from 'react-icons/ri';

const CardExtraButton = ({
  type = 'delete-button',
  isExpand = false,
  onClick = () => {},
  onCancel = () => {},
}) => {
  switch (type) {
    case 'show-button':
      if (isExpand) {
        return (
          <Button
            type="link"
            className={styles['button-icon']}
            onClick={onCancel}
            icon={<BiHide />}
          />
        );
      }
      return (
        <Button
          type="link"
          className={styles['button-icon']}
          onClick={onClick}
          icon={<BiShow />}
        />
      );

    case 'edit-button':
      if (isExpand) {
        return (
          <Button
            type="link"
            className={styles['button-icon']}
            onClick={onCancel}
            icon={<TbEditOff />}
          />
        );
      }
      return (
        <Button
          type="link"
          className={styles['button-icon']}
          onClick={onClick}
          icon={<TbEdit />}
        />
      );

    default:
      return (
        <Button
          type="link"
          className={styles['button-icon']}
          onClick={onClick}
          icon={<RiDeleteBin2Line />}
        />
      );
  }
};

export default CardExtraButton;
