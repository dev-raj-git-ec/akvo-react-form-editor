import React, { useMemo, useState, useEffect } from 'react';
import { Form, Select, Row, Col, InputNumber, Input, Alert } from 'antd';
import styles from '../styles.module.css';
import { CardExtraButton } from '../support';
import { UIStore, questionGroupFn, generateId } from '../lib/store';

const dependencyTypes = [
  {
    type: ['option', 'multiple_option'],
    logicDropdowns: [
      {
        label: 'contains',
        value: 'options',
      },
    ],
  },
  {
    type: ['number'],
    logicDropdowns: [
      {
        label: 'equal',
        value: 'equal',
      },
      {
        label: 'not equal',
        value: 'notEqual',
      },
      {
        label: 'less than',
        value: 'max',
      },
      {
        label: 'greater than',
        value: 'min',
      },
    ],
  },
];

const defaultSkipLogic = () => {
  return [
    {
      id: generateId(),
      dependentTo: null,
      dependentLogic: null,
      dependentAnswer: null,
    },
  ];
};

const QuestionSkipLogic = ({ question }) => {
  const {
    id,
    questionGroupId,
    dependency,
    order: currentQuestionOrder,
  } = question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const [dependencies, setDependencies] = useState([]);
  const [dependentTo, setDependentTo] = useState(null);

  useEffect(() => {
    const value = dependency?.length ? dependency : defaultSkipLogic();
    setDependencies(value);
    //#TODO:: transform dependency to match default skip logic format
  }, []);

  useEffect(() => {
    const check = dependencies.filter(
      (dp) =>
        dp.dependentTo &&
        dp.dependentLogic &&
        (dp.dependentAnswer || dp.dependentAnswer?.length)
    );
    if (check.length) {
      const transformDependencies = dependencies.map((dp) => {
        return {
          id: dp.dependentTo,
          [dp.dependentLogic]: dp.dependentAnswer,
        };
      });
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id) {
                return {
                  ...q,
                  dependency: transformDependencies,
                };
              }
              return q;
            });
            return {
              ...qg,
              questions: questions,
            };
          }
          return qg;
        });
      });
    }
  }, [dependencies]);

  const updateLocalState = (dependencyId, name, value) => {
    const updatedDependencies = dependencies.map((dependency) => {
      if (dependency.id === dependencyId) {
        return {
          ...dependency,
          [name]: value,
        };
      }
      return dependency;
    });
    setDependencies(updatedDependencies);
  };

  const currentQuestionGroupOrder = useMemo(() => {
    return questionGroups.find((qg) => qg.id === questionGroupId)?.order;
  }, [questionGroups]);

  const questions = useMemo(() => {
    return questionGroups
      .filter((qg) => qg.order <= currentQuestionGroupOrder) // filter by group order
      .flatMap((qg) => qg.questions)
      .filter(
        (q) =>
          (q.questionGroupId === questionGroupId &&
            q.order < currentQuestionOrder) ||
          q.questionGroupId !== questionGroupId
      ); // filter by question order
  }, [questionGroups]);

  const dependentToQuestions = useMemo(() => {
    return questions
      .filter((q) => dependencyTypes.flatMap((dt) => dt.type).includes(q.type))
      .map((q) => ({
        label: q.name,
        value: q.id,
      }));
  }, [questions]);

  const selectedDependencyQuestion = useMemo(() => {
    if (dependentTo) {
      const question = questions.find((q) => q.id === dependentTo);
      const findDependencyId = dependencies.find(
        (dp) => dp.dependentTo === dependentTo
      )?.id;
      if (findDependencyId) {
        updateLocalState(findDependencyId, 'dependentLogic', null);
      }
      return question;
    }
    return null;
  }, [dependentTo, questions]);

  const dependecyLogics = useMemo(() => {
    if (selectedDependencyQuestion) {
      return dependencyTypes.find((dt) =>
        dt.type.includes(selectedDependencyQuestion.type)
      ).logicDropdowns;
    }
    return [];
  }, [selectedDependencyQuestion]);

  const dependencyAnswerOptions = useMemo(() => {
    if (selectedDependencyQuestion && selectedDependencyQuestion?.options) {
      return selectedDependencyQuestion.options.map((opt) => ({
        label: opt.name,
        value: opt.name,
      }));
    }
    return [];
  }, [selectedDependencyQuestion]);

  const handleChangeDependentTo = (dependencyId, e) => {
    setDependentTo(e);
    updateLocalState(dependencyId, 'dependentTo', e);
  };

  const handleChangeDependentLogic = (dependencyId, e) => {
    updateLocalState(dependencyId, 'dependentLogic', e);
  };

  const handleChangeDependentAnswer = (dependencyId, val) => {
    updateLocalState(dependencyId, 'dependentAnswer', val);
  };

  const handleDeleteDependentTo = (dependencyId) => {
    setDependentTo(null);
    const updatedDependencies = dependencies.filter(
      (dependency) => dependency.id !== dependencyId
    );
    if (updatedDependencies.length) {
      setDependencies(updatedDependencies);
    } else {
      setDependencies(defaultSkipLogic());
    }
  };

  if (!dependentToQuestions?.length) {
    return (
      <Alert
        message={UIText.infoNoDependentQuestionText}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
    );
  }

  return (
    <Row gutter={[24, 24]}>
      {dependencies?.map((dependency, di) => (
        <Col
          key={`dependency-${id}-${di}`}
          span={24}
        >
          <Form.Item
            label={UIText.inputQuestionDependentToLabel}
            initialValue={dependency.dependentTo || []}
            name={`${namePreffix}-dependent_to-${dependency.id}`}
          >
            <Row
              align="middle"
              justify="space-between"
            >
              <Col span={23}>
                <Select
                  className={styles['select-dropdown']}
                  options={dependentToQuestions}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  onChange={(e) => handleChangeDependentTo(dependency.id, e)}
                />
              </Col>
              <Col
                span={1}
                align="end"
              >
                <CardExtraButton
                  type="delete-button"
                  onClick={() => handleDeleteDependentTo(dependency.id)}
                />
              </Col>
            </Row>
          </Form.Item>
          <Row
            align="middle"
            justify="space-between"
            gutter={[12, 12]}
          >
            <Col span={12}>
              <Form.Item
                label={UIText.inputQuestionDependentLogicLabel}
                initialValue={dependency.dependentLogic || []}
                name={`${namePreffix}-dependent_logic-${dependency.id}`}
              >
                <Select
                  className={styles['select-dropdown']}
                  options={dependecyLogics}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  onChange={(e) => handleChangeDependentLogic(dependency.id, e)}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={UIText.inputQuestionDependentAnswerLabel}
                initialValue={
                  selectedDependencyQuestion?.type === 'number'
                    ? dependency.dependentAnswer
                    : dependency.dependentAnswer || []
                }
                name={`${namePreffix}-dependent_answer-${dependency.id}`}
              >
                {!selectedDependencyQuestion && <Input disabled />}
                {selectedDependencyQuestion?.type === 'number' && (
                  <InputNumber
                    style={{ width: '100%' }}
                    controls={false}
                    keyboard={false}
                    onChange={(e) =>
                      handleChangeDependentAnswer(dependency.id, e)
                    }
                  />
                )}
                {['option', 'multiple_option'].includes(
                  selectedDependencyQuestion?.type
                ) && (
                  <Select
                    className={styles['select-dropdown']}
                    options={dependencyAnswerOptions}
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement
                    }
                    onChange={(e) =>
                      handleChangeDependentAnswer(dependency.id, e)
                    }
                    mode="multiple"
                    showSearch
                    allowClear
                    showArrow
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
};

export default QuestionSkipLogic;
