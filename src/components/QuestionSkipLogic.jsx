import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Form, Select, Row, Col, InputNumber, Input, Alert, Space } from 'antd';
import styles from '../styles.module.css';
import { CardExtraButton } from '../support';
import {
  UIStore,
  questionGroupFn,
  generateId,
  questionType,
} from '../lib/store';

const dependencyTypes = [
  {
    type: [questionType.option, questionType.multiple_option],
    logicDropdowns: [
      {
        label: 'contains',
        value: 'options',
      },
    ],
  },
  {
    type: [questionType.number],
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
      dependentToType: null,
      dependentLogic: null,
      dependentAnswer: null,
      dependencyLogicDropdownValue: [],
      dependencyAnswerDropdownValue: [],
    },
  ];
};

const transformDependencyValue = (dependency, questionGroups = []) => {
  const questions = questionGroups.flatMap((qg) => qg.questions);
  // transform dependency to match default skip logic format
  const logicDropdowns = dependencyTypes
    .flatMap((d) => d.logicDropdowns)
    .map((x) => x.value);
  const value = dependency.map((d) => {
    const findQ = questions.find((q) => q.id === d.id);
    let dependecyLogicDropdownValue = [];
    let dependencyAnswerDropdownValue = [];
    if (findQ?.id) {
      dependecyLogicDropdownValue =
        dependencyTypes.find((dt) => dt.type.includes(findQ.type))
          ?.logicDropdowns || [];
      dependencyAnswerDropdownValue = findQ?.options
        ? findQ.options.map((opt) => ({
            label: opt.name,
            value: opt.name,
          }))
        : [];
    }

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
      dependentToType: findQ?.type || null,
      dependentLogic: dependentLogic,
      dependentAnswer: dependentAnswer,
      dependecyLogicDropdownValue: dependecyLogicDropdownValue,
      dependencyAnswerDropdownValue: dependencyAnswerDropdownValue,
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
      ? transformDependencyValue(dependency, questionGroups)
      : defaultSkipLogic()
  );
  const [dependentTo, setDependentTo] = useState(null);
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
        setDependentTo(selectedDependencyQuestion);
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

  const handleAddMoreDependency = () => {
    const newDependencies = [...dependencies, defaultSkipLogic()];
    setDependencies(newDependencies);
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

  if (!dependencies?.[0]?.dependentTo && !dependentToQuestions?.length) {
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
            name={`${namePreffix}-dependent_to-${dependency.id}`}
          >
            <Row
              align="middle"
              justify="space-between"
              gutter={[12, 12]}
            >
              <Col span={22}>
                <Select
                  className={styles['select-dropdown']}
                  options={dependentToQuestions}
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  onChange={(e) => handleChangeDependentTo(dependency.id, e)}
                  value={dependency.dependentTo || []}
                />
              </Col>
              <Col
                span={2}
                align="end"
              >
                <Space>
                  <CardExtraButton
                    type="add-button"
                    disabled={
                      !dependentToQuestions?.length ||
                      dependentToQuestions.length === dependencies.length
                    }
                    onClick={handleAddMoreDependency}
                  />
                  <CardExtraButton
                    type="delete-button"
                    disabled={!dependency.dependentTo}
                    onClick={() => handleDeleteDependentTo(dependency.id)}
                  />
                </Space>
              </Col>
            </Row>
          </Form.Item>
          <Row
            align="middle"
            justify="space-between"
            gutter={[12, 12]}
          >
            <Col span={8}>
              <Form.Item
                label={UIText.inputQuestionDependentLogicLabel}
                initialValue={dependency.dependentLogic || []}
                name={`${namePreffix}-dependent_logic-${dependency.id}`}
              >
                <Select
                  className={styles['select-dropdown']}
                  options={
                    dependecyLogicDropdownValue.length
                      ? dependecyLogicDropdownValue
                      : dependency.dependecyLogicDropdownValue
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  onChange={(e) => handleChangeDependentLogic(dependency.id, e)}
                  value={dependency.dependentLogic || []}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item
                label={UIText.inputQuestionDependentAnswerLabel}
                name={`${namePreffix}-dependent_answer-${dependency.id}`}
              >
                {!dependency?.dependentToType &&
                  !selectedDependencyQuestion && <Input disabled />}
                {(dependency?.dependentToType === questionType.number ||
                  selectedDependencyQuestion?.type === questionType.number) && (
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
                {([questionType.option, questionType.multiple_option].includes(
                  dependency?.dependentToType
                ) ||
                  [questionType.option, questionType.multiple_option].includes(
                    selectedDependencyQuestion?.type
                  )) && (
                  <Select
                    className={styles['select-dropdown']}
                    options={
                      dependencyAnswerDropdownValue.length
                        ? dependencyAnswerDropdownValue
                        : dependency.dependencyAnswerDropdownValue
                    }
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
                    value={
                      Array.isArray(dependency.dependentAnswer)
                        ? dependency.dependentAnswer
                        : dependency.dependentAnswer
                        ? [dependency.dependentAnswer]
                        : []
                    }
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
