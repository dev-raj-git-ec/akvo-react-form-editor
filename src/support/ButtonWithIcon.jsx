import React from 'react';
import { Button } from 'antd';
import styles from '../styles.module.css';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import {
  RiSettings5Fill,
  RiSettings5Line,
  RiDeleteBin2Line,
  RiSave3Fill,
} from 'react-icons/ri';
import { BiMove, BiCopy } from 'react-icons/bi';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const ButtonWithIcon = ({
  type = 'delete-button',
  isExpand = false,
  onClick = () => {},
  onCancel = () => {},
  disabled = false,
}) => {
  let buttonProps = {};
  switch (type) {
    case 'show-button':
      if (isExpand) {
        buttonProps = {
          onClick: onCancel,
          icon: <TbEditOff />,
        };
        break;
      }
      buttonProps = {
        onClick: onClick,
        icon: <TbEdit />,
      };
      break;
    case 'copy-button':
      buttonProps = {
        onClick: onClick,
        icon: <BiCopy />,
      };
      break;
    case 'move-button':
      buttonProps = {
        onClick: onClick,
        icon: <BiMove />,
      };
      break;
    case 'edit-button':
      if (isExpand) {
        buttonProps = {
          onClick: onCancel,
          icon: <RiSettings5Fill />,
        };
        break;
      }
      buttonProps = {
        onClick: onClick,
        icon: <RiSettings5Line />,
      };
      break;
    case 'add-button':
      buttonProps = {
        onClick: onClick,
        icon: <MdOutlineAddCircleOutline />,
      };
      break;
    case 'save-button':
      buttonProps = {
        onClick: onClick,
        icon: <RiSave3Fill />,
      };
      break;
    case 'expand-all-button':
      if (isExpand) {
        buttonProps = {
          onClick: onCancel,
          icon: <AiOutlineEyeInvisible />,
        };
        break;
      }
      buttonProps = {
        onClick: onClick,
        icon: <AiOutlineEye />,
      };
      break;
    default:
      buttonProps = {
        onClick: onClick,
        icon: <RiDeleteBin2Line />,
      };
      break;
  }
  return (
    <Button
      type="link"
      className={styles['button-icon']}
      disabled={disabled}
      {...buttonProps}
    />
  );
};

export default ButtonWithIcon;
