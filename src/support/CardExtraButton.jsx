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
  disabled = false,
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
            disabled={disabled}
          />
        );
      }
      return (
        <Button
          type="link"
          className={styles['button-icon']}
          onClick={onClick}
          icon={<BiShow />}
          disabled={disabled}
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
            disabled={disabled}
          />
        );
      }
      return (
        <Button
          type="link"
          className={styles['button-icon']}
          onClick={onClick}
          icon={<TbEdit />}
          disabled={disabled}
        />
      );

    default:
      return (
        <Button
          type="link"
          className={styles['button-icon']}
          onClick={onClick}
          icon={<RiDeleteBin2Line />}
          disabled={disabled}
        />
      );
  }
};

export default CardExtraButton;
