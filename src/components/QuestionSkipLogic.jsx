import React, { useMemo, useState, useEffect } from 'react';
import { Form, Select, Row, Col, InputNumber, Input } from 'antd';
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
    Component: ({ props, options = [] }) => (
      <Select
        className={styles['select-dropdown']}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        mode="multiple"
        showSearch
        allowClear
        showArrow
        options={options}
        {...props}
      />
    ),
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
    Component: ({ props }) => (
      <InputNumber
        style={{ width: '100%' }}
        controls={false}
        keyboard={false}
        {...props}
      />
    ),
  },
];

console.log();

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

  const [dependencies, setDependencies] = useState(
    dependency?.length ? dependency : defaultSkipLogic()
  );
  const [dependentTo, setDependentTo] = useState(null);

  // useEffect(() => {
  //   // add default skip logic value
  //   questionGroupFn.store.update((s) => {
  //     s.questionGroups = s.questionGroups.map((qg) => {
  //       if (qg.id === questionGroupId) {
  //         const questions = qg.questions.map((q) => {
  //           if (q.id === id) {
  //             return {
  //               ...q,
  //               skipLogic: defaultSkipLogic(),
  //             };
  //           }
  //           return q;
  //         });
  //         return {
  //           ...qg,
  //           questions: questions,
  //         };
  //       }
  //       return qg;
  //     });
  //   });
  // }, []);

  const updateLocalState = (dependencyId, name, value) => {
    const updatedDependencies = dependencies.map((dependency) => {
      if (dependency.id === dependencyId) {
        return {
          ...dependency,
          [name]: value,
        };
      }
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
    // questionGroupFn.store.update((s) => {
    //   s.questionGroups = s.questionGroups.map((qg) => {
    //     if (qg.id === questionGroupId) {
    //       const questions = qg.questions.map((q) => {
    //         if (q.id === id) {
    //           let skipLogic = q.skipLogic.filter((sk) => sk.id !== skId);
    //           if (!skipLogic.length) {
    //             skipLogic = defaultSkipLogic();
    //           }
    //           return {
    //             ...q,
    //             skipLogic: skipLogic,
    //           };
    //         }
    //         return q;
    //       });
    //       return {
    //         ...qg,
    //         questions: questions,
    //       };
    //     }
    //     return qg;
    //   });
    // });
  };

  const DependencyAnswerComponent = ({ dependencyId }) => {
    if (selectedDependencyQuestion) {
      const Component = dependencyTypes.find((dt) =>
        dt.type.includes(selectedDependencyQuestion.type)
      ).Component;
      return (
        <Component
          props={{
            onChange: (e) => handleChangeDependentAnswer(dependencyId, e),
          }}
          options={dependencyAnswerOptions}
        />
      );
    }
    return <Input disabled />;
  };

  console.log(DependencyAnswerComponent);

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
                <DependencyAnswerComponent dependencyId={dependency.id} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
};

export default QuestionSkipLogic;
