import React, { useMemo, useState, useEffect } from 'react';
import { Form, Select, Row, Col, InputNumber, Input, Alert } from 'antd';
import styles from '../styles.module.css';
import { CardExtraButton } from '../support';
import { UIStore, questionGroupFn, generateId } from '../lib/store';
import { useCallback } from 'react';

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

const transformDependencyValue = (dependency) => {
  // transform dependency to match default skip logic format
  const logicDropdowns = dependencyTypes
    .flatMap((d) => d.logicDropdowns)
    .map((x) => x.value);
  const value = dependency.map((d) => {
    let dependentLogic = null;
    const dependentAnswer = logicDropdowns
      .map((lg) => {
        if (d?.[lg]) {
          dependentLogic = lg;
        }
        return d?.[lg];
      })
      .filter((x) => x)?.[0];
    return {
      id: generateId(),
      dependentTo: d.id,
      dependentLogic: dependentLogic,
      dependentAnswer: dependentAnswer,
    };
  });
  return value;
};

const findDependentTo = (dependency, questionGroups) => {
  const questions = questionGroups.flatMap((qg) => qg.questions);
  const current = questions.find((q) => q.id === dependency[0].id);
  return current;
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
  const [dependencies, setDependencies] = useState(
    dependency?.length
      ? transformDependencyValue(dependency)
      : defaultSkipLogic()
  );
  const [dependentTo, setDependentTo] = useState(
    dependency?.length ? findDependentTo(dependency, questionGroups) : null
  );
  const form = Form.useFormInstance();

  const updateGlobalStore = useCallback(
    (dependencyValue, isDelete = false) => {
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id && !isDelete) {
                return {
                  ...q,
                  dependency: dependencyValue,
                };
              }
              if (q.id === id && isDelete) {
                q.dependency && delete q.dependency;
                return q;
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
    },
    [id, questionGroupId]
  );

  useEffect(() => {
    // add dependency to global store if all dependency value defined
    const check = dependencies.filter(
      (dp) =>
        dp.dependentTo &&
        dp.dependentLogic &&
        (Array.isArray(dp.dependentAnswer)
          ? dp.dependentAnswer.length
          : dp.dependentAnswer)
    );
    if (check.length) {
      const transformDependencies = dependencies.map((dp) => {
        return {
          id: dp.dependentTo,
          [dp.dependentLogic]: dp.dependentAnswer,
        };
      });
      updateGlobalStore(transformDependencies);
    }
  }, [dependencies, id, questionGroupId, updateGlobalStore]);

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
  }, [questionGroups, questionGroupId]);

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
  }, [
    questionGroups,
    currentQuestionGroupOrder,
    currentQuestionOrder,
    questionGroupId,
  ]);

  // dependency question dropdown value
  const dependentToQuestions = useMemo(() => {
    return questions
      .filter((q) => dependencyTypes.flatMap((dt) => dt.type).includes(q.type))
      .map((q) => ({
        label: q.name,
        value: q.id,
      }));
  }, [questions]);

  const selectedDependencyQuestion = useMemo(() => {
    if (dependentTo?.id) {
      const question = questions.find((q) => q.id === dependentTo.id);
      return question;
    }
    return null;
  }, [dependentTo, questions]);

  const dependecyLogicDropdownValue = useMemo(() => {
    if (selectedDependencyQuestion) {
      const value = dependencyTypes.find((dt) =>
        dt.type.includes(selectedDependencyQuestion.type)
      )?.logicDropdowns;
      return value || [];
    }
    return [];
  }, [selectedDependencyQuestion]);

  const dependencyAnswerDropdownValue = useMemo(() => {
    if (selectedDependencyQuestion && selectedDependencyQuestion?.options) {
      return selectedDependencyQuestion.options.map((opt) => ({
        label: opt.name,
        value: opt.name,
      }));
    }
    return [];
  }, [selectedDependencyQuestion]);

  useEffect(() => {
    // delete logic if dependentTo question type changed
    if (dependencies.length && dependentTo?.id) {
      const findDependencyId = dependencies.find(
        (dp) =>
          dp.dependentTo === dependentTo.id &&
          selectedDependencyQuestion.type !== dependentTo?.type
      )?.id;
      if (findDependencyId) {
        form.setFieldsValue({
          [`${namePreffix}-dependent_logic-${findDependencyId}`]: null,
        });
      }
    }
  }, [
    dependencies,
    selectedDependencyQuestion,
    dependentTo,
    form,
    namePreffix,
  ]);

  const handleChangeDependentTo = (dependencyId, e) => {
    const question = questions.find((q) => q.id === e);
    setDependentTo(question);
    updateLocalState(dependencyId, 'dependentTo', e);
  };

  const handleChangeDependentLogic = (dependencyId, e) => {
    updateLocalState(dependencyId, 'dependentLogic', e);
  };

  const handleChangeDependentAnswer = (dependencyId, val) => {
    updateLocalState(dependencyId, 'dependentAnswer', val);
    // handle when answer value empty
    if (dependency?.length && (!val || !val?.length)) {
      // delete dependency from global store
      updateGlobalStore([], true);
    }
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
    updateGlobalStore([], true);
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
                  value={dependency.dependentTo || []}
                />
              </Col>
              <Col
                span={1}
                align="end"
              >
                <CardExtraButton
                  type="delete-button"
                  disabled={!dependentTo}
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
                  options={dependecyLogicDropdownValue}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  onChange={(e) => handleChangeDependentLogic(dependency.id, e)}
                  value={dependency.dependentLogic || []}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={UIText.inputQuestionDependentAnswerLabel}
                initialValue={
                  selectedDependencyQuestion?.type === 'number'
                    ? dependency.dependentAnswer || null
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
                    value={dependency.dependentAnswer || null}
                  />
                )}
                {['option', 'multiple_option'].includes(
                  selectedDependencyQuestion?.type
                ) && (
                  <Select
                    className={styles['select-dropdown']}
                    options={dependencyAnswerDropdownValue}
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
                    value={dependency.dependentAnswer || []}
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
