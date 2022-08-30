import React, { useMemo, useState } from 'react';
import 'antd/dist/antd.min.css';
import { Form, Row, Space, Button, Input, Card, Checkbox, Tabs, Col, InputNumber, Select } from 'antd';
import { Store } from 'pullstate';
import { BiMove, BiHide, BiShow } from 'react-icons/bi';
import { TbEditOff, TbEdit } from 'react-icons/tb';
import { RiDeleteBin2Line } from 'react-icons/ri';

var styles = {"container":"arfe-container","input-checkbox-wrapper":"arfe-input-checkbox-wrapper","button-icon":"arfe-button-icon","reorder-wrapper":"arfe-reorder-wrapper","select-dropdown":"arfe-select-dropdown","tabs-wrapper":"arfe-tabs-wrapper","space-align-right":"arfe-space-align-right","space-align-left":"arfe-space-align-left","space-vertical-align-left":"arfe-space-vertical-align-left","space-vertical-align-right":"arfe-space-vertical-align-right","more-question-setting-text":"arfe-more-question-setting-text"};

const FormWrapper = ({
  children
}) => {
  const [form] = Form.useForm();

  const handleOnValuesChange = (changedValues, allValues) => {};

  const handleOnFinish = values => {};

  const handleOnFinishFailed = ({
    values,
    errorFields,
    outOfDate
  }) => {};

  return /*#__PURE__*/React.createElement(Form, {
    form: form,
    key: "akvo-react-form-editor",
    name: "akvo-react-form-editor",
    layout: "vertical",
    onValuesChange: handleOnValuesChange,
    onFinish: handleOnFinish,
    onFinishFailed: handleOnFinishFailed
  }, children);
};

const UIStaticText = {
  en: {
    inputFormNameLabel: 'Form Name',
    inputFormDescriptionLabel: 'Form Description',
    formTabPane: 'Form',
    previewTabPane: 'Preview',
    mandatoryQuestionCount: 'Mandatory Questions',
    version: 'Version',
    inputQuestionGroupNameLabel: 'Question Group Name',
    inputQuestionGroupDescriptionLabel: 'Question Group Description',
    inputRepeatThisGroupCheckbox: 'Repeat this group',
    buttonShowQuestionsText: 'Show Questions',
    buttonHideQuestionsText: 'Hide Questions',
    buttonEditGroupText: 'Edit Group',
    buttonCancelEditGroupText: 'Cancel Edit Group',
    buttonDeleteText: 'Delete',
    buttonCancelText: 'Cancel',
    buttonAddNewQuestionGroupText: 'Insert group here',
    buttonAddNewQuestionText: 'Add new question',
    inputQuestionNameLabel: 'Question Name',
    inputQuestionTypeLabel: 'Question Type',
    inputQuestionVariableNameLabel: 'Variable Name',
    inputQuestionTooltipLabel: 'Question Tooltip',
    inputQuestionRequiredCheckbox: 'Required',
    buttonSaveText: 'Save',
    questionSettingTabPane: 'Setting',
    questionSkipLogicTabPane: 'Skip Logic',
    questionTranslationTabPane: 'Translation',
    questionExtraTabPane: 'Extra',
    inputQuestionDependentToLabel: 'Dependent to Question',
    inputQuestionDependentLogicLabel: 'Logic',
    inputQuestionDependentAnswerLabel: 'Value',
    questionMoreInputTypeSettingText: 'More Input Question Setting',
    inputQuestionRequireDoubleEntryCheckbox: 'Require double entry of answer',
    inputQuestionHiddenStringCheckbox: 'Hidden String/Password',
    questionMoreInputNumberSettingText: 'More Number Question Setting',
    inputQuestionAllowDecimalCheckbox: 'Allow Decimal',
    questionMoreOptionTypeSettingText: 'More Option Question Setting',
    inputQuestionAllowOtherCheckbox: 'Allow Other'
  }
};

const generateId = () => new Date().getTime();
const questionType = {
  input: 'input',
  number: 'number',
  cascade: 'cascade',
  text: 'text',
  date: 'date',
  option: 'option',
  multiple_option: 'multiple_option',
  tree: 'tree',
  autofield: 'autofield'
};

const defaultQuestion = ({
  id,
  questionGroup,
  name: _name = 'New Question',
  prevOrder: _prevOrder = 0,
  type: _type = questionType.input,
  params: _params = {}
}) => {
  const q = {
    id: id || generateId(),
    questionGroupId: questionGroup.id,
    name: _name,
    order: _prevOrder + 1,
    type: _type,
    required: false,
    tooltip: null,
    ..._params
  };

  if (_type === questionType.option || _type === questionType.multiple_option) {
    return { ...q,
      option: [],
      allowOther: false,
      ..._params
    };
  }

  if (_type === questionType.cascade) {
    return { ...q,
      api: {
        endpoint: null,
        initial: 0,
        list: false
      },
      ..._params
    };
  }

  return q;
};

const defaultQuestionGroup = ({
  name: _name2 = 'New Question Group',
  prevOrder: _prevOrder2 = 0
}) => {
  const qg = {
    id: generateId(),
    name: _name2 || 'New Question Group',
    order: _prevOrder2 + 1,
    description: null,
    repeatable: false
  };
  return { ...qg,
    questions: [defaultQuestion({
      questionGroup: qg
    })]
  };
};

const UIStore = new Store({
  current: {
    tab: 'form',
    formId: null,
    questionGroupId: null,
    questionId: null
  },
  activeQuestionGroups: [],
  activeEditQuestionGroups: [],
  activeEditQuestions: [],
  UIText: UIStaticText.en
});
const FormStore = new Store({
  id: generateId(),
  name: 'New Form',
  version: 1,
  description: 'New Form Description'
});
const QuestionGroupStore = new Store({
  questionGroups: [defaultQuestionGroup({
    name: null
  })]
});
const questionGroupFn = {
  add: defaultQuestionGroup,
  store: QuestionGroupStore
};

const AddMoveButton = ({
  order: prevOrder,
  text,
  className,
  cancelButton: _cancelButton = false,
  disabled: _disabled = false,
  onCancel: _onCancel = () => {}
}) => {
  const {
    buttonCancelText
  } = UIStore.useState(s => s.UIText);
  const {
    questionGroups
  } = questionGroupFn.store.useState(s => s);
  const prevQg = questionGroups.filter(qg => qg.order <= prevOrder);
  const nextQg = questionGroups.filter(qg => qg.order > prevOrder).map(qg => ({ ...qg,
    order: prevOrder ? prevOrder + qg.order : 1 + qg.order
  }));

  const handleOnClick = () => {
    const newQuestionGroups = [...prevQg, questionGroupFn.add({
      prevOrder: prevOrder ? prevOrder : 0
    }), ...nextQg];
    questionGroupFn.store.update(s => {
      s.questionGroups = newQuestionGroups;
    });
    console.log(prevOrder, newQuestionGroups);
  };

  return /*#__PURE__*/React.createElement(Row, {
    align: "middle",
    justify: "start",
    className: `arfe-reorder-wrapper ${className}`
  }, /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
    type: "secondary",
    className: "reorder-button",
    size: "small",
    onClick: handleOnClick,
    disabled: _disabled
  }, text), _cancelButton && /*#__PURE__*/React.createElement(Button, {
    type: "secondary",
    className: "reorder-button",
    size: "small",
    onClick: _onCancel
  }, buttonCancelText)));
};

const CardTitle = ({
  title,
  numbering: _numbering = null,
  onMoveClick: _onMoveClick = () => {}
}) => {
  return /*#__PURE__*/React.createElement(Space, null, /*#__PURE__*/React.createElement(Button, {
    type: "link",
    className: styles['button-icon'],
    icon: /*#__PURE__*/React.createElement(BiMove, null),
    onClick: _onMoveClick
  }), _numbering ? `${_numbering}. ${title}` : title);
};

const CardExtraButton = ({
  type: _type = 'delete-button',
  isExpand: _isExpand = false,
  onClick: _onClick = () => {},
  onCancel: _onCancel = () => {}
}) => {
  switch (_type) {
    case 'show-button':
      if (_isExpand) {
        return /*#__PURE__*/React.createElement(Button, {
          type: "link",
          className: styles['button-icon'],
          onClick: _onCancel,
          icon: /*#__PURE__*/React.createElement(BiHide, null)
        });
      }

      return /*#__PURE__*/React.createElement(Button, {
        type: "link",
        className: styles['button-icon'],
        onClick: _onClick,
        icon: /*#__PURE__*/React.createElement(BiShow, null)
      });

    case 'edit-button':
      if (_isExpand) {
        return /*#__PURE__*/React.createElement(Button, {
          type: "link",
          className: styles['button-icon'],
          onClick: _onCancel,
          icon: /*#__PURE__*/React.createElement(TbEditOff, null)
        });
      }

      return /*#__PURE__*/React.createElement(Button, {
        type: "link",
        className: styles['button-icon'],
        onClick: _onClick,
        icon: /*#__PURE__*/React.createElement(TbEdit, null)
      });

    default:
      return /*#__PURE__*/React.createElement(Button, {
        type: "link",
        className: styles['button-icon'],
        onClick: _onClick,
        icon: /*#__PURE__*/React.createElement(RiDeleteBin2Line, null)
      });
  }
};

const SaveButton = ({
  onClickSave: _onClickSave = () => {},
  cancelButton: _cancelButton = true,
  onClickCancel: _onClickCancel = () => {}
}) => {
  const UIText = UIStore.useState(s => s.UIText);
  return /*#__PURE__*/React.createElement(Space, {
    className: styles['space-align-right']
  }, /*#__PURE__*/React.createElement(Button, {
    type: "primary",
    onClick: _onClickSave
  }, UIText.buttonSaveText), _cancelButton && /*#__PURE__*/React.createElement(Button, {
    onClick: _onClickCancel
  }, UIText.buttonCancelText));
};

const FormDefinition = () => {
  const form = Form.useFormInstance();
  const UIText = UIStore.useState(s => s.UIText);
  const {
    inputFormNameLabel,
    inputFormDescriptionLabel
  } = UIText;
  return /*#__PURE__*/React.createElement("div", {
    key: "form-definition-input"
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: inputFormNameLabel,
    name: "form-name"
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    label: inputFormDescriptionLabel,
    name: "form-description"
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    rows: 5
  })), /*#__PURE__*/React.createElement(SaveButton, {
    cancelButton: false,
    onClickSave: form.submit()
  }));
};

const QuestionGroupDefinition = ({
  index,
  questionGroup,
  isLastItem
}) => {
  const form = Form.useFormInstance();
  const activeQuestionGroups = UIStore.useState(s => s.activeQuestionGroups);
  const activeEditQuestionGroups = UIStore.useState(s => s.activeEditQuestionGroups);
  const {
    id,
    name,
    questions,
    order
  } = questionGroup;
  const {
    buttonAddNewQuestionGroupText
  } = UIStore.useState(s => s.UIText);
  const showQuestion = useMemo(() => {
    return activeQuestionGroups.includes(id);
  }, [activeQuestionGroups, id]);
  const isEditQuestionGroup = useMemo(() => {
    return activeEditQuestionGroups.includes(id);
  }, [activeEditQuestionGroups, id]);

  const handleShowQuestions = () => {
    UIStore.update(s => {
      s.activeQuestionGroups = [...activeQuestionGroups, id];
    });
  };

  const handleHideQuestions = () => {
    UIStore.update(s => {
      s.activeQuestionGroups = activeQuestionGroups.filter(qgId => qgId !== id);
    });
  };

  const handleEditGroup = () => {
    UIStore.update(s => {
      s.activeEditQuestionGroups = [...activeEditQuestionGroups, id];
    });
  };

  const handleCancelEditGroup = () => {
    UIStore.update(s => {
      s.activeEditQuestionGroups = activeEditQuestionGroups.filter(qgId => qgId !== id);
    });
  };

  const extraButtons = [{
    type: 'show-button',
    isExpand: showQuestion,
    onClick: handleShowQuestions,
    onCancel: handleHideQuestions
  }, {
    type: 'edit-button',
    isExpand: isEditQuestionGroup,
    onClick: handleEditGroup,
    onCancel: handleCancelEditGroup
  }, {
    type: 'delete-button',
    onClick: () => console.log('delete')
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddMoveButton, {
    text: buttonAddNewQuestionGroupText,
    order: order - 1
  }), /*#__PURE__*/React.createElement(Card, {
    key: `${index}-${id}`,
    title: /*#__PURE__*/React.createElement(CardTitle, {
      title: name,
      onMoveClick: () => console.log('move')
    }),
    headStyle: {
      textAlign: 'left',
      padding: '0 12px'
    },
    bodyStyle: {
      padding: isEditQuestionGroup || showQuestion ? 24 : 0
    },
    loading: false,
    extra: /*#__PURE__*/React.createElement(Space, null, extraButtons.map(cfg => /*#__PURE__*/React.createElement(CardExtraButton, {
      key: `${cfg.type}-${id}`,
      type: cfg.type,
      isExpand: cfg.isExpand,
      onClick: () => cfg.onClick(),
      onCancel: () => cfg.onCancel()
    })))
  }, isEditQuestionGroup && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(QuestionGroupSetting, questionGroup)), showQuestion && questions.map((q, qi) => /*#__PURE__*/React.createElement(QuestionDefinition, {
    key: `question-definition-${qi}`,
    index: qi,
    question: q,
    isLastItem: qi === questions.length - 1
  }))), isLastItem && /*#__PURE__*/React.createElement(AddMoveButton, {
    order: order,
    text: buttonAddNewQuestionGroupText
  }));
};

const QuestionGroupSetting = ({
  id,
  name,
  description,
  repeatable
}) => {
  const namePreffix = `question_group-${id}`;
  const UIText = UIStore.useState(s => s.UIText);

  const handleChangeName = e => {
    questionGroupFn.store.update(s => {
      s.questionGroups = s.questionGroups.map(x => {
        if (x.id === id) {
          var _e$target;

          return { ...x,
            name: e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value
          };
        }

        return x;
      });
    });
  };

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionGroupNameLabel,
    initialValue: name,
    name: `${namePreffix}-name`,
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    onChange: handleChangeName
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionGroupDescriptionLabel,
    initialValue: description,
    name: `${namePreffix}-description`
  }, /*#__PURE__*/React.createElement(Input.TextArea, {
    rows: 5
  })), /*#__PURE__*/React.createElement(Form.Item, {
    initialValue: repeatable,
    name: `${namePreffix}-repeatable`,
    className: styles['input-checkbox-wrapper']
  }, /*#__PURE__*/React.createElement(Checkbox, null, " ", UIText.inputRepeatThisGroupCheckbox)));
};

const QuestionDefinition = ({
  index,
  question,
  isLastItem
}) => {
  const form = Form.useFormInstance();
  const UIText = UIStore.useState(s => s.UIText);
  const activeEditQuestions = UIStore.useState(s => s.activeEditQuestions);
  const [activeTab, setActiveTab] = useState('setting');
  const {
    id,
    name
  } = question;
  const isEditQuestion = useMemo(() => {
    return activeEditQuestions.includes(id);
  }, [activeEditQuestions, id]);

  const handleEdit = () => {
    UIStore.update(s => {
      s.activeEditQuestions = [...activeEditQuestions, id];
    });
  };

  const handleCancelEdit = () => {
    UIStore.update(s => {
      s.activeEditQuestions = activeEditQuestions.filter(qId => qId !== id);
    });
  };

  const extraButtons = [{
    type: 'edit-button',
    isExpand: isEditQuestion,
    onClick: handleEdit,
    onCancel: handleCancelEdit
  }, {
    type: 'delete-button',
    onClick: () => console.log('delete')
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AddMoveButton, {
    text: UIText.buttonAddNewQuestionText
  }), /*#__PURE__*/React.createElement(Card, {
    key: `${index}-${id}`,
    title: /*#__PURE__*/React.createElement(CardTitle, {
      title: name,
      numbering: index + 1,
      onMoveClick: () => console.log('move')
    }),
    headStyle: {
      textAlign: 'left',
      padding: '0 12px'
    },
    bodyStyle: {
      padding: isEditQuestion ? 24 : 0
    },
    loading: false,
    extra: /*#__PURE__*/React.createElement(Space, null, extraButtons.map(cfg => /*#__PURE__*/React.createElement(CardExtraButton, {
      key: `${cfg.type}-${id}`,
      type: cfg.type,
      isExpand: cfg.isExpand,
      onClick: cfg.onClick,
      onCancel: cfg.onCancel
    })))
  }, isEditQuestion && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tabs, {
    defaultActiveKey: activeTab,
    onChange: key => setActiveTab(key),
    tabBarGutter: 24,
    className: styles['tabs-wrapper']
  }, /*#__PURE__*/React.createElement(Tabs.TabPane, {
    tab: UIText.questionSettingTabPane,
    key: "setting"
  }), /*#__PURE__*/React.createElement(Tabs.TabPane, {
    tab: UIText.questionSkipLogicTabPane,
    key: "skip-logic"
  })), activeTab === 'setting' && /*#__PURE__*/React.createElement(QuestionSetting, {
    question: question
  }), activeTab === 'skip-logic' && /*#__PURE__*/React.createElement(QuestionSkipLogic, {
    question: question
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SaveButton, {
    onClickSave: () => form.submit(),
    onClickCancel: handleCancelEdit
  })))), isLastItem && /*#__PURE__*/React.createElement(AddMoveButton, {
    text: UIText.buttonAddNewQuestionText
  }));
};

const SettingInput = ({
  id
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState(s => s.UIText);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: styles['more-question-setting-text']
  }, UIText.questionMoreInputTypeSettingText), /*#__PURE__*/React.createElement(Space, {
    className: styles['space-align-left']
  }, /*#__PURE__*/React.createElement(Form.Item, {
    initialValue: false,
    name: `${namePreffix}-require_double_entry`
  }, /*#__PURE__*/React.createElement(Checkbox, null, " ", UIText.inputQuestionRequireDoubleEntryCheckbox)), /*#__PURE__*/React.createElement(Form.Item, {
    initialValue: false,
    name: `${namePreffix}-hidden_string`
  }, /*#__PURE__*/React.createElement(Checkbox, null, " ", UIText.inputQuestionHiddenStringCheckbox))));
};

const SettingNumber = ({
  id
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState(s => s.UIText);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: styles['more-question-setting-text']
  }, UIText.questionMoreInputNumberSettingText), /*#__PURE__*/React.createElement(Space, {
    className: styles['space-align-left']
  }, /*#__PURE__*/React.createElement(Form.Item, {
    initialValue: false,
    name: `${namePreffix}-allow_decimal`
  }, /*#__PURE__*/React.createElement(Checkbox, null, " ", UIText.inputQuestionAllowDecimalCheckbox))), /*#__PURE__*/React.createElement(Row, {
    align: "middle",
    justify: "space-between",
    gutter: [12, 12]
  }, /*#__PURE__*/React.createElement(Col, {
    span: 8
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "Minimum Value",
    initialValue: '',
    name: `${namePreffix}-min`
  }, /*#__PURE__*/React.createElement(InputNumber, {
    style: {
      width: '100%'
    },
    controls: false,
    keyboard: false
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 8
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "Maximum Value",
    initialValue: '',
    name: `${namePreffix}-max`
  }, /*#__PURE__*/React.createElement(InputNumber, {
    style: {
      width: '100%'
    },
    controls: false,
    keyboard: false
  }))), /*#__PURE__*/React.createElement(Col, {
    span: 8
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "Equal Value",
    initialValue: '',
    name: `${namePreffix}-equal`
  }, /*#__PURE__*/React.createElement(InputNumber, {
    style: {
      width: '100%'
    },
    controls: false,
    keyboard: false
  })))));
};

const SettingOption = ({
  id
}) => {
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState(s => s.UIText);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: styles['more-question-setting-text']
  }, UIText.questionMoreOptionTypeSettingText), /*#__PURE__*/React.createElement(Row, {
    align: "middle",
    justify: "space-between",
    gutter: [12, 12]
  }, /*#__PURE__*/React.createElement(Col, {
    span: 24
  }, /*#__PURE__*/React.createElement(Form.Item, {
    label: "Option",
    initialValue: '',
    name: `${namePreffix}-option`
  }, /*#__PURE__*/React.createElement(Input, null)))), /*#__PURE__*/React.createElement(Space, {
    className: styles['space-align-left']
  }, /*#__PURE__*/React.createElement(Form.Item, {
    initialValue: false,
    name: `${namePreffix}-allow_other`
  }, /*#__PURE__*/React.createElement(Checkbox, null, " ", UIText.inputQuestionAllowOtherCheckbox))));
};

const QuestionSetting = ({
  question
}) => {
  const {
    id,
    name,
    type,
    variable,
    tooltip,
    required
  } = question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState(s => s.UIText);
  const form = Form.useFormInstance();
  const qType = Form.useWatch(`${namePreffix}-type`, form);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionNameLabel,
    initialValue: name,
    name: `${namePreffix}-name`,
    required: true
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionTypeLabel,
    initialValue: type,
    name: `${namePreffix}-type`,
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    className: styles['select-dropdown'],
    options: Object.keys(questionType).map(key => {
      var _questionType$key;

      return {
        label: (_questionType$key = questionType[key]) === null || _questionType$key === void 0 ? void 0 : _questionType$key.split('_').join(' '),
        value: key
      };
    }),
    getPopupContainer: triggerNode => triggerNode.parentElement
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionVariableNameLabel,
    initialValue: variable,
    name: `${namePreffix}-variable`
  }, /*#__PURE__*/React.createElement(Input, null)), /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionTooltipLabel,
    initialValue: tooltip,
    name: `${namePreffix}-tooltip`
  }, /*#__PURE__*/React.createElement(Input.TextArea, null)), /*#__PURE__*/React.createElement(Form.Item, {
    initialValue: required,
    name: `${namePreffix}-required`,
    className: styles['input-checkbox-wrapper']
  }, /*#__PURE__*/React.createElement(Checkbox, null, " ", UIText.inputQuestionRequiredCheckbox)), qType === 'input' && /*#__PURE__*/React.createElement(SettingInput, question), qType === 'number' && /*#__PURE__*/React.createElement(SettingNumber, question), ['option', 'multiple_option'].includes(qType) && /*#__PURE__*/React.createElement(SettingOption, question));
};

const QuestionSkipLogic = question => {
  const {
    id
  } = question;
  const namePreffix = `question-${id}`;
  const UIText = UIStore.useState(s => s.UIText);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionDependentToLabel,
    initialValue: '',
    name: `${namePreffix}-dependent_to`
  }, /*#__PURE__*/React.createElement(Row, {
    align: "middle",
    justify: "space-between"
  }, /*#__PURE__*/React.createElement(Col, {
    span: 23
  }, /*#__PURE__*/React.createElement(Select, {
    className: styles['select-dropdown'],
    options: [],
    getPopupContainer: triggerNode => triggerNode.parentElement
  })), /*#__PURE__*/React.createElement(Col, {
    span: 1,
    align: "end"
  }, /*#__PURE__*/React.createElement(CardExtraButton, {
    type: "delete-button",
    onClick: () => console.log('delete')
  })))), /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionDependentLogicLabel,
    initialValue: '',
    name: `${namePreffix}-dependent_logic`
  }, /*#__PURE__*/React.createElement(Select, {
    className: styles['select-dropdown'],
    options: [],
    getPopupContainer: triggerNode => triggerNode.parentElement
  })), /*#__PURE__*/React.createElement(Form.Item, {
    label: UIText.inputQuestionDependentAnswerLabel,
    initialValue: '',
    name: `${namePreffix}-dependent_answer`
  }, /*#__PURE__*/React.createElement(Input, null)));
};

const WebformEditor = () => {
  const current = UIStore.useState(s => s.current);
  const UIText = UIStore.useState(s => s.UIText);
  const questionGroups = questionGroupFn.store.useState(s => s.questionGroups);
  const {
    tab: currentTab
  } = current;
  const {
    formTabPane,
    previewTabPane,
    mandatoryQuestionCount,
    version
  } = UIText;

  const handleTabsOnChange = e => {
    UIStore.update(s => {
      s.current = { ...current,
        tab: e
      };
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    key: "container",
    className: styles.container
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Tabs, {
    defaultActiveKey: current.tab,
    onChange: handleTabsOnChange,
    tabBarExtraContent: /*#__PURE__*/React.createElement("span", null, `1 / 10 ${mandatoryQuestionCount} | ${version} : 1`),
    tabBarGutter: 24,
    className: styles['tabs-wrapper']
  }, /*#__PURE__*/React.createElement(Tabs.TabPane, {
    tab: formTabPane,
    key: "form"
  }), /*#__PURE__*/React.createElement(Tabs.TabPane, {
    tab: previewTabPane,
    key: "preview"
  })), currentTab === 'form' && /*#__PURE__*/React.createElement(FormWrapper, null, /*#__PURE__*/React.createElement(FormDefinition, null), questionGroups.map((qg, qgi) => {
    return /*#__PURE__*/React.createElement(QuestionGroupDefinition, {
      key: `question-group-definition-${qgi}`,
      index: qgi,
      questionGroup: qg,
      isLastItem: qgi === questionGroups.length - 1
    });
  })), currentTab === 'preview' && /*#__PURE__*/React.createElement("h3", null, "Preview")));
};

export default WebformEditor;
//# sourceMappingURL=index.modern.js.map
