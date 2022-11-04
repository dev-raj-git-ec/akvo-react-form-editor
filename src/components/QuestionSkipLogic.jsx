import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Form,
  Select,
  Row,
  Col,
  InputNumber,
  Input,
  Alert,
  Space,
  DatePicker,
} from 'antd';
import styles from '../styles.module.css';
import { ButtonWithIcon } from '../support';
import {
  UIStore,
  questionGroupFn,
  generateId,
  questionType,
} from '../lib/store';
import { groupBy, map } from 'lodash';
import moment from 'moment';

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
  {
    type: [questionType.date],
    logicDropdowns: [
      {
        label: 'before',
        value: 'before',
      },
      {
        label: 'after',
        value: 'after',
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

const fetchDependencyLogicDropdown = (question) => {
  const value = dependencyTypes.find((dt) =>
    dt.type.includes(question.type)
  )?.logicDropdowns;
  return value || [];
};

const fetchDependencyAnswerDropdown = (question) => {
  if (question?.options) {
    return question.options.map((opt) => ({
      label: opt.name,
      value: opt.name,
    }));
  }
  return [];
};

const transformDependencyValue = (dependency, questionGroups) => {
  // transform dependency to match default skip logic format
  const questions = questionGroups.flatMap((qg) => qg.questions);
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
    const findQ = questions.find((q) => q.id === d.id);
    return {
      id: generateId(),
      dependentTo: d.id,
      dependentToType: findQ.type,
      dependentLogic: dependentLogic,
      dependentAnswer: dependentAnswer,
      dependencyLogicDropdownValue: fetchDependencyLogicDropdown(findQ),
      dependencyAnswerDropdownValue: fetchDependencyAnswerDropdown(findQ),
    };
  });
  return value;
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
  const form = Form.useFormInstance();

  const updateGlobalStore = useCallback(
    (dependencyValue, isDelete = false) => {
      const transformDependencies = dependencyValue
        .map((dp) => {
          return {
            id: dp.dependentTo,
            [dp.dependentLogic]: dp.dependentAnswer,
          };
        })
        .filter((d) => d.id);
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
              if (q.id === id && !isDelete && !transformDependencies.length) {
                q.dependency && delete q.dependency;
                return q;
              }
              if (q.id === id && isDelete && transformDependencies.length) {
                return {
                  ...q,
                  dependency: transformDependencies,
                };
              }
              if (q.id === id && isDelete && !transformDependencies.length) {
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
    const checkDependencies = dependencies.filter((dp) => {
      if (
        dp.dependentTo &&
        dp.dependentLogic &&
        Array.isArray(dp.dependentAnswer) &&
        dp.dependentAnswer.length
      ) {
        return dp;
      }
      if (
        dp.dependentTo &&
        dp.dependentLogic &&
        !Array.isArray(dp.dependentAnswer) &&
        dp.dependentAnswer
      ) {
        return dp;
      }
    });
    if (checkDependencies.length) {
      updateGlobalStore(checkDependencies);
    }
  }, [dependencies, id, questionGroupId, updateGlobalStore]);

  const updateLocalState = useCallback(
    (dependencyId, values = {}) => {
      const updatedDependencies = dependencies
        .map((d) => {
          if (d.id === dependencyId) {
            return {
              ...d,
              ...values,
            };
          }
          return d;
        })
        .filter((d) =>
          dependencyTypes.flatMap((dt) => dt.type).includes(d.dependentToType)
        );
      setDependencies(updatedDependencies);
    },
    [dependencies, setDependencies]
  );

  useEffect(() => {
    // delete logic if dependentTo question type changed
    setTimeout(() => {
      const checkChangedType = dependencies
        .map((d) => {
          const findQ = questions.find((q) => q.id === d.dependentTo);
          if (findQ?.id && findQ.type !== d.dependentToType) {
            return findQ;
          }
          return false;
        })
        .filter((x) => x);
      if (dependencies.length && checkChangedType.length) {
        checkChangedType.forEach((q) => {
          const updatedDependency = dependencies.find(
            (d) => d.dependentTo === q.id
          );
          updateLocalState(updatedDependency.id, {
            ...updatedDependency,
            dependentToType: q.type,
            dependencyLogicDropdownValue: fetchDependencyLogicDropdown(q),
            dependencyAnswerDropdownValue: fetchDependencyAnswerDropdown(q),
          });
          form.setFieldsValue({
            [`${namePreffix}-dependent_logic-${updatedDependency.id}`]: null,
          });
        });
      }
    }, 500);
  }, [dependencies, questions, form, namePreffix, updateLocalState]);

  const handleChangeDependentTo = (dependencyId, e) => {
    const question = questions.find((q) => q.id === e);
    const values = {
      dependentTo: e,
      dependentToType: question.type,
      dependencyLogicDropdownValue: fetchDependencyLogicDropdown(question),
      dependencyAnswerDropdownValue: fetchDependencyAnswerDropdown(question),
    };
    updateLocalState(dependencyId, values);
  };

  const handleChangeDependentLogic = (dependencyId, e) => {
    updateLocalState(dependencyId, { dependentLogic: e });
  };

  const handleChangeDependentAnswer = (dependencyId, val) => {
    updateLocalState(dependencyId, { dependentAnswer: val });
    // handle when answer value empty
    if (savedDependency?.length) {
      // delete dependency from global store
      const updatedDependencies = savedDependency.filter(
        (d) => d.id !== dependencyId
      );
      if (Array.isArray(val) && !val.length) {
        updateGlobalStore(updatedDependencies, true);
        return;
      }
      if (!Array.isArray(val) && !val) {
        updateGlobalStore(updatedDependencies, true);
        return;
      }
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
    } else {
      setDependencies(defaultSkipLogic());
      updateGlobalStore([], true);
    }
  };

  const dropdown = map(groupBy(dependentToQuestions, 'group'), (i, l) => ({
    label: l,
    item: i,
  })).map((g, gi) => ({ ...g, key: gi }));

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
              {dropdown.map((g) => (
                <Select.OptGroup
                  key={g.key}
                  label={g.label}
                >
                  {g.item.map((dq) => (
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
                </Select.OptGroup>
              ))}
            </Select>
          </Col>
          <Col
            span={2}
            align="end"
          >
            <Space>
              <ButtonWithIcon
                type="add-button"
                disabled={
                  !dependentToQuestions?.length ||
                  dependentToQuestions.length === dependencies.length
                }
                onClick={handleAddMoreDependency}
              />
              <ButtonWithIcon
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
              options={dependency.dependencyLogicDropdownValue}
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
            {!dependency.dependentTo && <Input disabled />}
            {/* Number */}
            {dependency.dependentToType === questionType.number && (
              <InputNumber
                style={{ width: '100%' }}
                controls={false}
                keyboard={false}
                onChange={(e) => handleChangeDependentAnswer(dependency.id, e)}
                value={dependency.dependentAnswer || null}
              />
            )}
            {/* Option / Multiple */}
            {[questionType.option, questionType.multiple_option].includes(
              dependency.dependentToType
            ) && (
              <Select
                className={styles['select-dropdown']}
                options={dependency.dependencyAnswerDropdownValue}
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
            {/* Date */}
            {dependency.dependentToType === questionType.date && (
              <DatePicker
                style={{ width: '100%' }}
                onChange={(e) =>
                  handleChangeDependentAnswer(
                    dependency.id,
                    moment(e).format('YYYY-MM-DD')
                  )
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
  const questionGroups = questionGroupFn.store.useState(
    (s) => s.questionGroups
  );
  const [dependencies, setDependencies] = useState(
    dependency?.length
      ? transformDependencyValue(dependency, questionGroups)
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
      .map((q) => {
        const group = questionGroups.find((g) => g.id === q.questionGroupId);
        return {
          label: `${group.order}.${q.order}. ${q.name}`,
          value: q.id,
          group: `${group.order}. ${group.name}`,
        };
      });
  }, [questions, questionGroups]);

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
