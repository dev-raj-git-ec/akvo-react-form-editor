import React, { useMemo } from 'react';
import { Card, Space, Button } from 'antd';
import { AddMoveButton } from '.';
import { UIStore } from '../lib/store';
import styles from '../styles.module.css';
import { BiMove } from 'react-icons/bi';
import { TbEdit, TbEditOff } from 'react-icons/tb';
import { RiDeleteBin2Line } from 'react-icons/ri';

const QuestionDefinition = ({ index, question, isLastItem }) => {
  const { buttonAddNewQuestionText } = UIStore.useState((s) => s.UIText);
  const activeEditQuestions = UIStore.useState((s) => s.activeEditQuestions);
  const { id, name } = question;

  const isEditQuestion = useMemo(() => {
    return activeEditQuestions.includes(id);
  }, [activeEditQuestions, id]);

  const handleEdit = () => {
    UIStore.update((s) => {
      s.activeEditQuestions = [...activeEditQuestions, id];
    });
  };

  const handleCancelEdit = () => {
    UIStore.update((s) => {
      s.activeEditQuestions = activeEditQuestions.filter((qId) => qId !== id);
    });
  };

  return (
    <div>
      <AddMoveButton text={buttonAddNewQuestionText} />
      <Card
        key={`${index}-${id}`}
        title={
          <Space>
            <Button
              type="link"
              className={styles['button-icon']}
              icon={<BiMove />}
            />
            {`${index + 1}. ${name}`}
          </Space>
        }
        headStyle={{ textAlign: 'left', padding: '0 12px' }}
        bodyStyle={{ padding: isEditQuestion ? 24 : 0 }}
        loading={false}
        extra={
          <Space>
            {!isEditQuestion ? (
              <Button
                type="link"
                className={styles['button-icon']}
                onClick={handleEdit}
                icon={<TbEdit />}
              />
            ) : (
              <Button
                type="link"
                className={styles['button-icon']}
                onClick={handleCancelEdit}
                icon={<TbEditOff />}
              />
            )}
            <Button
              type="link"
              className={styles['button-icon']}
              icon={<RiDeleteBin2Line />}
            />
          </Space>
        }
      >
        {isEditQuestion && 'Edit Question..'}
      </Card>
      {isLastItem && <AddMoveButton text={buttonAddNewQuestionText} />}
    </div>
  );
};

export default QuestionDefinition;
