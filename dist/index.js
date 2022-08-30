function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('antd/dist/antd.min.css');
var antd = require('antd');
var pullstate = require('pullstate');
var bi = require('react-icons/bi');
var tb = require('react-icons/tb');
var ri = require('react-icons/ri');

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

var styles = {"container":"arfe-container","input-checkbox-wrapper":"arfe-input-checkbox-wrapper","button-icon":"arfe-button-icon","reorder-wrapper":"arfe-reorder-wrapper","select-dropdown":"arfe-select-dropdown","tabs-wrapper":"arfe-tabs-wrapper","space-align-right":"arfe-space-align-right","space-align-left":"arfe-space-align-left","space-vertical-align-left":"arfe-space-vertical-align-left","space-vertical-align-right":"arfe-space-vertical-align-right","more-question-setting-text":"arfe-more-question-setting-text"};

var FormWrapper = function FormWrapper(_ref) {
  var children = _ref.children;

  var _Form$useForm = antd.Form.useForm(),
      form = _Form$useForm[0];

  var handleOnValuesChange = function handleOnValuesChange(changedValues, allValues) {};

  var handleOnFinish = function handleOnFinish(values) {};

  var handleOnFinishFailed = function handleOnFinishFailed(_ref2) {
  };

  return /*#__PURE__*/React__default.createElement(antd.Form, {
    form: form,
    key: "akvo-react-form-editor",
    name: "akvo-react-form-editor",
    layout: "vertical",
    onValuesChange: handleOnValuesChange,
    onFinish: handleOnFinish,
    onFinishFailed: handleOnFinishFailed
  }, children);
};

var UIStaticText = {
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

var generateId = function generateId() {
  return new Date().getTime();
};
var questionType = {
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

var defaultQuestion = function defaultQuestion(_ref) {
  var id = _ref.id,
      questionGroup = _ref.questionGroup,
      _ref$name = _ref.name,
      name = _ref$name === void 0 ? 'New Question' : _ref$name,
      _ref$prevOrder = _ref.prevOrder,
      prevOrder = _ref$prevOrder === void 0 ? 0 : _ref$prevOrder,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? questionType.input : _ref$type,
      _ref$params = _ref.params,
      params = _ref$params === void 0 ? {} : _ref$params;

  var q = _extends({
    id: id || generateId(),
    questionGroupId: questionGroup.id,
    name: name,
    order: prevOrder + 1,
    type: type,
    required: false,
    tooltip: null
  }, params);

  if (type === questionType.option || type === questionType.multiple_option) {
    return _extends({}, q, {
      option: [],
      allowOther: false
    }, params);
  }

  if (type === questionType.cascade) {
    return _extends({}, q, {
      api: {
        endpoint: null,
        initial: 0,
        list: false
      }
    }, params);
  }

  return q;
};

var defaultQuestionGroup = function defaultQuestionGroup(_ref2) {
  var _ref2$name = _ref2.name,
      name = _ref2$name === void 0 ? 'New Question Group' : _ref2$name,
      _ref2$prevOrder = _ref2.prevOrder,
      prevOrder = _ref2$prevOrder === void 0 ? 0 : _ref2$prevOrder;
  var qg = {
    id: generateId(),
    name: name || 'New Question Group',
    order: prevOrder + 1,
    description: null,
    repeatable: false
  };
  return _extends({}, qg, {
    questions: [defaultQuestion({
      questionGroup: qg
    })]
  });
};

var UIStore = new pullstate.Store({
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
var FormStore = new pullstate.Store({
  id: generateId(),
  name: 'New Form',
  version: 1,
  description: 'New Form Description'
});
var QuestionGroupStore = new pullstate.Store({
  questionGroups: [defaultQuestionGroup({
    name: null
  })]
});
var questionGroupFn = {
  add: defaultQuestionGroup,
  store: QuestionGroupStore
};

var AddMoveButton = function AddMoveButton(_ref) {
  var prevOrder = _ref.order,
      text = _ref.text,
      className = _ref.className,
      _ref$cancelButton = _ref.cancelButton,
      cancelButton = _ref$cancelButton === void 0 ? false : _ref$cancelButton,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      _ref$onCancel = _ref.onCancel,
      onCancel = _ref$onCancel === void 0 ? function () {} : _ref$onCancel;

  var _UIStore$useState = UIStore.useState(function (s) {
    return s.UIText;
  }),
      buttonCancelText = _UIStore$useState.buttonCancelText;

  var _questionGroupFn$stor = questionGroupFn.store.useState(function (s) {
    return s;
  }),
      questionGroups = _questionGroupFn$stor.questionGroups;

  var prevQg = questionGroups.filter(function (qg) {
    return qg.order <= prevOrder;
  });
  var nextQg = questionGroups.filter(function (qg) {
    return qg.order > prevOrder;
  }).map(function (qg) {
    return _extends({}, qg, {
      order: prevOrder ? prevOrder + qg.order : 1 + qg.order
    });
  });

  var handleOnClick = function handleOnClick() {
    var newQuestionGroups = [].concat(prevQg, [questionGroupFn.add({
      prevOrder: prevOrder ? prevOrder : 0
    })], nextQg);
    questionGroupFn.store.update(function (s) {
      s.questionGroups = newQuestionGroups;
    });
    console.log(prevOrder, newQuestionGroups);
  };

  return /*#__PURE__*/React__default.createElement(antd.Row, {
    align: "middle",
    justify: "start",
    className: "arfe-reorder-wrapper " + className
  }, /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "secondary",
    className: "reorder-button",
    size: "small",
    onClick: handleOnClick,
    disabled: disabled
  }, text), cancelButton && /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "secondary",
    className: "reorder-button",
    size: "small",
    onClick: onCancel
  }, buttonCancelText)));
};

var CardTitle = function CardTitle(_ref) {
  var title = _ref.title,
      _ref$numbering = _ref.numbering,
      numbering = _ref$numbering === void 0 ? null : _ref$numbering,
      _ref$onMoveClick = _ref.onMoveClick,
      onMoveClick = _ref$onMoveClick === void 0 ? function () {} : _ref$onMoveClick;
  return /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "link",
    className: styles['button-icon'],
    icon: /*#__PURE__*/React__default.createElement(bi.BiMove, null),
    onClick: onMoveClick
  }), numbering ? numbering + ". " + title : title);
};

var CardExtraButton = function CardExtraButton(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'delete-button' : _ref$type,
      _ref$isExpand = _ref.isExpand,
      isExpand = _ref$isExpand === void 0 ? false : _ref$isExpand,
      _ref$onClick = _ref.onClick,
      onClick = _ref$onClick === void 0 ? function () {} : _ref$onClick,
      _ref$onCancel = _ref.onCancel,
      onCancel = _ref$onCancel === void 0 ? function () {} : _ref$onCancel;

  switch (type) {
    case 'show-button':
      if (isExpand) {
        return /*#__PURE__*/React__default.createElement(antd.Button, {
          type: "link",
          className: styles['button-icon'],
          onClick: onCancel,
          icon: /*#__PURE__*/React__default.createElement(bi.BiHide, null)
        });
      }

      return /*#__PURE__*/React__default.createElement(antd.Button, {
        type: "link",
        className: styles['button-icon'],
        onClick: onClick,
        icon: /*#__PURE__*/React__default.createElement(bi.BiShow, null)
      });

    case 'edit-button':
      if (isExpand) {
        return /*#__PURE__*/React__default.createElement(antd.Button, {
          type: "link",
          className: styles['button-icon'],
          onClick: onCancel,
          icon: /*#__PURE__*/React__default.createElement(tb.TbEditOff, null)
        });
      }

      return /*#__PURE__*/React__default.createElement(antd.Button, {
        type: "link",
        className: styles['button-icon'],
        onClick: onClick,
        icon: /*#__PURE__*/React__default.createElement(tb.TbEdit, null)
      });

    default:
      return /*#__PURE__*/React__default.createElement(antd.Button, {
        type: "link",
        className: styles['button-icon'],
        onClick: onClick,
        icon: /*#__PURE__*/React__default.createElement(ri.RiDeleteBin2Line, null)
      });
  }
};

var SaveButton = function SaveButton(_ref) {
  var _ref$onClickSave = _ref.onClickSave,
      onClickSave = _ref$onClickSave === void 0 ? function () {} : _ref$onClickSave,
      _ref$cancelButton = _ref.cancelButton,
      cancelButton = _ref$cancelButton === void 0 ? true : _ref$cancelButton,
      _ref$onClickCancel = _ref.onClickCancel,
      onClickCancel = _ref$onClickCancel === void 0 ? function () {} : _ref$onClickCancel;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  return /*#__PURE__*/React__default.createElement(antd.Space, {
    className: styles['space-align-right']
  }, /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "primary",
    onClick: onClickSave
  }, UIText.buttonSaveText), cancelButton && /*#__PURE__*/React__default.createElement(antd.Button, {
    onClick: onClickCancel
  }, UIText.buttonCancelText));
};

var FormDefinition = function FormDefinition() {
  var form = antd.Form.useFormInstance();
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  var inputFormNameLabel = UIText.inputFormNameLabel,
      inputFormDescriptionLabel = UIText.inputFormDescriptionLabel;
  return /*#__PURE__*/React__default.createElement("div", {
    key: "form-definition-input"
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: inputFormNameLabel,
    name: "form-name"
  }, /*#__PURE__*/React__default.createElement(antd.Input, null)), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: inputFormDescriptionLabel,
    name: "form-description"
  }, /*#__PURE__*/React__default.createElement(antd.Input.TextArea, {
    rows: 5
  })), /*#__PURE__*/React__default.createElement(SaveButton, {
    cancelButton: false,
    onClickSave: form.submit()
  }));
};

var QuestionGroupDefinition = function QuestionGroupDefinition(_ref) {
  var index = _ref.index,
      questionGroup = _ref.questionGroup,
      isLastItem = _ref.isLastItem;
  var form = antd.Form.useFormInstance();
  var activeQuestionGroups = UIStore.useState(function (s) {
    return s.activeQuestionGroups;
  });
  var activeEditQuestionGroups = UIStore.useState(function (s) {
    return s.activeEditQuestionGroups;
  });
  var id = questionGroup.id,
      name = questionGroup.name,
      questions = questionGroup.questions,
      order = questionGroup.order;

  var _UIStore$useState = UIStore.useState(function (s) {
    return s.UIText;
  }),
      buttonAddNewQuestionGroupText = _UIStore$useState.buttonAddNewQuestionGroupText;

  var showQuestion = React.useMemo(function () {
    return activeQuestionGroups.includes(id);
  }, [activeQuestionGroups, id]);
  var isEditQuestionGroup = React.useMemo(function () {
    return activeEditQuestionGroups.includes(id);
  }, [activeEditQuestionGroups, id]);

  var handleShowQuestions = function handleShowQuestions() {
    UIStore.update(function (s) {
      s.activeQuestionGroups = [].concat(activeQuestionGroups, [id]);
    });
  };

  var handleHideQuestions = function handleHideQuestions() {
    UIStore.update(function (s) {
      s.activeQuestionGroups = activeQuestionGroups.filter(function (qgId) {
        return qgId !== id;
      });
    });
  };

  var handleEditGroup = function handleEditGroup() {
    UIStore.update(function (s) {
      s.activeEditQuestionGroups = [].concat(activeEditQuestionGroups, [id]);
    });
  };

  var handleCancelEditGroup = function handleCancelEditGroup() {
    UIStore.update(function (s) {
      s.activeEditQuestionGroups = activeEditQuestionGroups.filter(function (qgId) {
        return qgId !== id;
      });
    });
  };

  var extraButtons = [{
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
    onClick: function onClick() {
      return console.log('delete');
    }
  }];
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(AddMoveButton, {
    text: buttonAddNewQuestionGroupText,
    order: order - 1
  }), /*#__PURE__*/React__default.createElement(antd.Card, {
    key: index + "-" + id,
    title: /*#__PURE__*/React__default.createElement(CardTitle, {
      title: name,
      onMoveClick: function onMoveClick() {
        return console.log('move');
      }
    }),
    headStyle: {
      textAlign: 'left',
      padding: '0 12px'
    },
    bodyStyle: {
      padding: isEditQuestionGroup || showQuestion ? 24 : 0
    },
    loading: false,
    extra: /*#__PURE__*/React__default.createElement(antd.Space, null, extraButtons.map(function (cfg) {
      return /*#__PURE__*/React__default.createElement(CardExtraButton, {
        key: cfg.type + "-" + id,
        type: cfg.type,
        isExpand: cfg.isExpand,
        onClick: function onClick() {
          return cfg.onClick();
        },
        onCancel: function onCancel() {
          return cfg.onCancel();
        }
      });
    }))
  }, isEditQuestionGroup && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(QuestionGroupSetting, questionGroup)), showQuestion && questions.map(function (q, qi) {
    return /*#__PURE__*/React__default.createElement(QuestionDefinition, {
      key: "question-definition-" + qi,
      index: qi,
      question: q,
      isLastItem: qi === questions.length - 1
    });
  })), isLastItem && /*#__PURE__*/React__default.createElement(AddMoveButton, {
    order: order,
    text: buttonAddNewQuestionGroupText
  }));
};

var QuestionGroupSetting = function QuestionGroupSetting(_ref) {
  var id = _ref.id,
      name = _ref.name,
      description = _ref.description,
      repeatable = _ref.repeatable;
  var namePreffix = "question_group-" + id;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });

  var handleChangeName = function handleChangeName(e) {
    questionGroupFn.store.update(function (s) {
      s.questionGroups = s.questionGroups.map(function (x) {
        if (x.id === id) {
          var _e$target;

          return _extends({}, x, {
            name: e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value
          });
        }

        return x;
      });
    });
  };

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionGroupNameLabel,
    initialValue: name,
    name: namePreffix + "-name",
    required: true
  }, /*#__PURE__*/React__default.createElement(antd.Input, {
    onChange: handleChangeName
  })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionGroupDescriptionLabel,
    initialValue: description,
    name: namePreffix + "-description"
  }, /*#__PURE__*/React__default.createElement(antd.Input.TextArea, {
    rows: 5
  })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    initialValue: repeatable,
    name: namePreffix + "-repeatable",
    className: styles['input-checkbox-wrapper']
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, null, " ", UIText.inputRepeatThisGroupCheckbox)));
};

var QuestionDefinition = function QuestionDefinition(_ref) {
  var index = _ref.index,
      question = _ref.question,
      isLastItem = _ref.isLastItem;
  var form = antd.Form.useFormInstance();
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  var activeEditQuestions = UIStore.useState(function (s) {
    return s.activeEditQuestions;
  });

  var _useState = React.useState('setting'),
      activeTab = _useState[0],
      setActiveTab = _useState[1];

  var id = question.id,
      name = question.name;
  var isEditQuestion = React.useMemo(function () {
    return activeEditQuestions.includes(id);
  }, [activeEditQuestions, id]);

  var handleEdit = function handleEdit() {
    UIStore.update(function (s) {
      s.activeEditQuestions = [].concat(activeEditQuestions, [id]);
    });
  };

  var handleCancelEdit = function handleCancelEdit() {
    UIStore.update(function (s) {
      s.activeEditQuestions = activeEditQuestions.filter(function (qId) {
        return qId !== id;
      });
    });
  };

  var extraButtons = [{
    type: 'edit-button',
    isExpand: isEditQuestion,
    onClick: handleEdit,
    onCancel: handleCancelEdit
  }, {
    type: 'delete-button',
    onClick: function onClick() {
      return console.log('delete');
    }
  }];
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(AddMoveButton, {
    text: UIText.buttonAddNewQuestionText
  }), /*#__PURE__*/React__default.createElement(antd.Card, {
    key: index + "-" + id,
    title: /*#__PURE__*/React__default.createElement(CardTitle, {
      title: name,
      numbering: index + 1,
      onMoveClick: function onMoveClick() {
        return console.log('move');
      }
    }),
    headStyle: {
      textAlign: 'left',
      padding: '0 12px'
    },
    bodyStyle: {
      padding: isEditQuestion ? 24 : 0
    },
    loading: false,
    extra: /*#__PURE__*/React__default.createElement(antd.Space, null, extraButtons.map(function (cfg) {
      return /*#__PURE__*/React__default.createElement(CardExtraButton, {
        key: cfg.type + "-" + id,
        type: cfg.type,
        isExpand: cfg.isExpand,
        onClick: cfg.onClick,
        onCancel: cfg.onCancel
      });
    }))
  }, isEditQuestion && /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Tabs, {
    defaultActiveKey: activeTab,
    onChange: function onChange(key) {
      return setActiveTab(key);
    },
    tabBarGutter: 24,
    className: styles['tabs-wrapper']
  }, /*#__PURE__*/React__default.createElement(antd.Tabs.TabPane, {
    tab: UIText.questionSettingTabPane,
    key: "setting"
  }), /*#__PURE__*/React__default.createElement(antd.Tabs.TabPane, {
    tab: UIText.questionSkipLogicTabPane,
    key: "skip-logic"
  })), activeTab === 'setting' && /*#__PURE__*/React__default.createElement(QuestionSetting, {
    question: question
  }), activeTab === 'skip-logic' && /*#__PURE__*/React__default.createElement(QuestionSkipLogic, {
    question: question
  }), /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(SaveButton, {
    onClickSave: function onClickSave() {
      return form.submit();
    },
    onClickCancel: handleCancelEdit
  })))), isLastItem && /*#__PURE__*/React__default.createElement(AddMoveButton, {
    text: UIText.buttonAddNewQuestionText
  }));
};

var SettingInput = function SettingInput(_ref) {
  var id = _ref.id;
  var namePreffix = "question-" + id;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", {
    className: styles['more-question-setting-text']
  }, UIText.questionMoreInputTypeSettingText), /*#__PURE__*/React__default.createElement(antd.Space, {
    className: styles['space-align-left']
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    initialValue: false,
    name: namePreffix + "-require_double_entry"
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, null, " ", UIText.inputQuestionRequireDoubleEntryCheckbox)), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    initialValue: false,
    name: namePreffix + "-hidden_string"
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, null, " ", UIText.inputQuestionHiddenStringCheckbox))));
};

var SettingNumber = function SettingNumber(_ref) {
  var id = _ref.id;
  var namePreffix = "question-" + id;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", {
    className: styles['more-question-setting-text']
  }, UIText.questionMoreInputNumberSettingText), /*#__PURE__*/React__default.createElement(antd.Space, {
    className: styles['space-align-left']
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    initialValue: false,
    name: namePreffix + "-allow_decimal"
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, null, " ", UIText.inputQuestionAllowDecimalCheckbox))), /*#__PURE__*/React__default.createElement(antd.Row, {
    align: "middle",
    justify: "space-between",
    gutter: [12, 12]
  }, /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 8
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: "Minimum Value",
    initialValue: '',
    name: namePreffix + "-min"
  }, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
    style: {
      width: '100%'
    },
    controls: false,
    keyboard: false
  }))), /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 8
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: "Maximum Value",
    initialValue: '',
    name: namePreffix + "-max"
  }, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
    style: {
      width: '100%'
    },
    controls: false,
    keyboard: false
  }))), /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 8
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: "Equal Value",
    initialValue: '',
    name: namePreffix + "-equal"
  }, /*#__PURE__*/React__default.createElement(antd.InputNumber, {
    style: {
      width: '100%'
    },
    controls: false,
    keyboard: false
  })))));
};

var SettingOption = function SettingOption(_ref) {
  var id = _ref.id;
  var namePreffix = "question-" + id;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("p", {
    className: styles['more-question-setting-text']
  }, UIText.questionMoreOptionTypeSettingText), /*#__PURE__*/React__default.createElement(antd.Row, {
    align: "middle",
    justify: "space-between",
    gutter: [12, 12]
  }, /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 24
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: "Option",
    initialValue: '',
    name: namePreffix + "-option"
  }, /*#__PURE__*/React__default.createElement(antd.Input, null)))), /*#__PURE__*/React__default.createElement(antd.Space, {
    className: styles['space-align-left']
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    initialValue: false,
    name: namePreffix + "-allow_other"
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, null, " ", UIText.inputQuestionAllowOtherCheckbox))));
};

var QuestionSetting = function QuestionSetting(_ref) {
  var question = _ref.question;
  var id = question.id,
      name = question.name,
      type = question.type,
      variable = question.variable,
      tooltip = question.tooltip,
      required = question.required;
  var namePreffix = "question-" + id;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  var form = antd.Form.useFormInstance();
  var qType = antd.Form.useWatch(namePreffix + "-type", form);
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionNameLabel,
    initialValue: name,
    name: namePreffix + "-name",
    required: true
  }, /*#__PURE__*/React__default.createElement(antd.Input, null)), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionTypeLabel,
    initialValue: type,
    name: namePreffix + "-type",
    required: true
  }, /*#__PURE__*/React__default.createElement(antd.Select, {
    className: styles['select-dropdown'],
    options: Object.keys(questionType).map(function (key) {
      var _questionType$key;

      return {
        label: (_questionType$key = questionType[key]) === null || _questionType$key === void 0 ? void 0 : _questionType$key.split('_').join(' '),
        value: key
      };
    }),
    getPopupContainer: function getPopupContainer(triggerNode) {
      return triggerNode.parentElement;
    }
  })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionVariableNameLabel,
    initialValue: variable,
    name: namePreffix + "-variable"
  }, /*#__PURE__*/React__default.createElement(antd.Input, null)), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionTooltipLabel,
    initialValue: tooltip,
    name: namePreffix + "-tooltip"
  }, /*#__PURE__*/React__default.createElement(antd.Input.TextArea, null)), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    initialValue: required,
    name: namePreffix + "-required",
    className: styles['input-checkbox-wrapper']
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, null, " ", UIText.inputQuestionRequiredCheckbox)), qType === 'input' && /*#__PURE__*/React__default.createElement(SettingInput, question), qType === 'number' && /*#__PURE__*/React__default.createElement(SettingNumber, question), ['option', 'multiple_option'].includes(qType) && /*#__PURE__*/React__default.createElement(SettingOption, question));
};

var QuestionSkipLogic = function QuestionSkipLogic(question) {
  var id = question.id;
  var namePreffix = "question-" + id;
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionDependentToLabel,
    initialValue: '',
    name: namePreffix + "-dependent_to"
  }, /*#__PURE__*/React__default.createElement(antd.Row, {
    align: "middle",
    justify: "space-between"
  }, /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 23
  }, /*#__PURE__*/React__default.createElement(antd.Select, {
    className: styles['select-dropdown'],
    options: [],
    getPopupContainer: function getPopupContainer(triggerNode) {
      return triggerNode.parentElement;
    }
  })), /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 1,
    align: "end"
  }, /*#__PURE__*/React__default.createElement(CardExtraButton, {
    type: "delete-button",
    onClick: function onClick() {
      return console.log('delete');
    }
  })))), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionDependentLogicLabel,
    initialValue: '',
    name: namePreffix + "-dependent_logic"
  }, /*#__PURE__*/React__default.createElement(antd.Select, {
    className: styles['select-dropdown'],
    options: [],
    getPopupContainer: function getPopupContainer(triggerNode) {
      return triggerNode.parentElement;
    }
  })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: UIText.inputQuestionDependentAnswerLabel,
    initialValue: '',
    name: namePreffix + "-dependent_answer"
  }, /*#__PURE__*/React__default.createElement(antd.Input, null)));
};

var WebformEditor = function WebformEditor() {
  var current = UIStore.useState(function (s) {
    return s.current;
  });
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  var questionGroups = questionGroupFn.store.useState(function (s) {
    return s.questionGroups;
  });
  var currentTab = current.tab;
  var formTabPane = UIText.formTabPane,
      previewTabPane = UIText.previewTabPane,
      mandatoryQuestionCount = UIText.mandatoryQuestionCount,
      version = UIText.version;

  var handleTabsOnChange = function handleTabsOnChange(e) {
    UIStore.update(function (s) {
      s.current = _extends({}, current, {
        tab: e
      });
    });
  };

  return /*#__PURE__*/React__default.createElement("div", {
    key: "container",
    className: styles.container
  }, /*#__PURE__*/React__default.createElement(antd.Card, null, /*#__PURE__*/React__default.createElement(antd.Tabs, {
    defaultActiveKey: current.tab,
    onChange: handleTabsOnChange,
    tabBarExtraContent: /*#__PURE__*/React__default.createElement("span", null, "1 / 10 " + mandatoryQuestionCount + " | " + version + " : 1"),
    tabBarGutter: 24,
    className: styles['tabs-wrapper']
  }, /*#__PURE__*/React__default.createElement(antd.Tabs.TabPane, {
    tab: formTabPane,
    key: "form"
  }), /*#__PURE__*/React__default.createElement(antd.Tabs.TabPane, {
    tab: previewTabPane,
    key: "preview"
  })), currentTab === 'form' && /*#__PURE__*/React__default.createElement(FormWrapper, null, /*#__PURE__*/React__default.createElement(FormDefinition, null), questionGroups.map(function (qg, qgi) {
    return /*#__PURE__*/React__default.createElement(QuestionGroupDefinition, {
      key: "question-group-definition-" + qgi,
      index: qgi,
      questionGroup: qg,
      isLastItem: qgi === questionGroups.length - 1
    });
  })), currentTab === 'preview' && /*#__PURE__*/React__default.createElement("h3", null, "Preview")));
};

module.exports = WebformEditor;
//# sourceMappingURL=index.js.map
