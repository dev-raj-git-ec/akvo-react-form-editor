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

const findDependentTo = (currentDependency, questions) => {
  const current = questions.find((q) => q.id === currentDependency.dependentTo);
  return current;
};

const SettingSkipLogic = ({
  question,
  questions,
  dependency,
  dependencies,
  setDependencies,
  dependentToQuestions,
}) => {
  const { id, questionGroupId, dependency: savedDependency } = question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState((s) => s.UIText);
  const [dependentTo, setDependentTo] = useState(
    savedDependency?.length ? findDependentTo(dependency, questions) : null
  );
  const form = Form.useFormInstance();

  const updateGlobalStore = useCallback(
    (dependencyValue, isDelete = false) => {
      const transformDependencies = dependencyValue.map((dp) => {
        return {
          id: dp.dependentTo,
          [dp.dependentLogic]: dp.dependentAnswer,
        };
      });
      questionGroupFn.store.update((s) => {
        s.questionGroups = s.questionGroups.map((qg) => {
          if (qg.id === questionGroupId) {
            const questions = qg.questions.map((q) => {
              if (q.id === id && !isDelete) {
                return {
                  ...q,
                  dependency: transformDependencies,
                };
              }
              if (q.id === id && isDelete) {
                if (!transformDependencies.length) {
                  q.dependency && delete q.dependency;
                  return q;
                }
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
      updateGlobalStore(dependencies);
    }
  }, [dependencies, id, questionGroupId, updateGlobalStore]);

  const updateLocalState = (dependencyId, name, value) => {
    const updatedDependencies = dependencies.map((d) => {
      if (d.id === dependencyId) {
        return {
          ...d,
          [name]: value,
        };
      }
      return d;
    });
    setDependencies(updatedDependencies);
  };

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
    if (savedDependency?.length && (!val || !val?.length)) {
      // delete dependency from global store
      const updatedDependencies = dependencies.filter(
        (d) => d.id !== dependencyId
      );
      updateGlobalStore(updatedDependencies, true);
    }
  };

  const handleAddMoreDependency = () => {
    const newDependencies = [...dependencies, ...defaultSkipLogic()];
    setDependencies(newDependencies);
  };

  const handleDeleteDependentTo = (dependencyId) => {
    form.setFieldsValue({
      [`${namePreffix}-dependent_logic-${dependencyId}`]: null,
    });
    const updatedDependencies = dependencies.filter(
      (dependency) => dependency.id !== dependencyId
    );
    if (updatedDependencies.length) {
      setDependencies(updatedDependencies);
      updateGlobalStore(updatedDependencies, true);
    } else {
      setDependentTo(null);
      setDependencies(defaultSkipLogic());
      updateGlobalStore([], true);
    }
  };

  return (
    <Col
      key={`dependency-${id}-${dependency.id}`}
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
              showSearch
              className={styles['select-dropdown']}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              onChange={(e) => handleChangeDependentTo(dependency.id, e)}
              value={dependency.dependentTo || []}
              optionFilterProp="children"
            >
              {dependentToQuestions.map((dq) => (
                <Select.Option
                  key={`${dq.value}-dq`}
                  value={dq.value}
                  disabled={dependencies
                    .map((d) => d.dependentTo)
                    .includes(dq.value)}
                >
                  {dq.label}
                </Select.Option>
              ))}
            </Select>
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
              options={dependecyLogicDropdownValue}
              getPopupContainer={(triggerNode) => triggerNode.parentElement}
              onChange={(e) => handleChangeDependentLogic(dependency.id, e)}
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item
            label={UIText.inputQuestionDependentAnswerLabel}
            name={`${namePreffix}-dependent_answer-${dependency.id}`}
          >
            {!selectedDependencyQuestion && <Input disabled />}
            {selectedDependencyQuestion?.type === questionType.number && (
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
                keyboard={false}
                onChange={(e) => handleChangeDependentAnswer(dependency.id, e)}
                value={dependency.dependentAnswer || null}
              />
            )}
            {[questionType.option, questionType.multiple_option].includes(
              selectedDependencyQuestion?.type
            ) && (
              <Select
                className={styles['select-dropdown']}
                options={dependencyAnswerDropdownValue}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                onChange={(e) => handleChangeDependentAnswer(dependency.id, e)}
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
  );
};

const QuestionSkipLogic = ({ question }) => {
  const {
    id,
    questionGroupId,
    dependency,
    order: currentQuestionOrder,
  } = question;
  const UIText = UIStore.useState((s) => s.UIText);
  const { questionGroups } = questionGroupFn.store.useState((s) => s);
  const [dependencies, setDependencies] = useState(
    dependency?.length
      ? transformDependencyValue(dependency)
      : defaultSkipLogic()
  );

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
        <SettingSkipLogic
          key={`dependency-${id}-${di}`}
          dependency={dependency}
          question={question}
          questions={questions}
          dependencies={dependencies}
          setDependencies={setDependencies}
          dependentToQuestions={dependentToQuestions}
        />
      ))}
    </Row>
  );
};

export default QuestionSkipLogic;
