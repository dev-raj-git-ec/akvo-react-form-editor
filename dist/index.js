function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('antd/dist/antd.min.css');
var antd = require('antd');
var pullstate = require('pullstate');
var lodash = require('lodash');
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

var styles = {"container":"arfe-container","form-definition":"arfe-form-definition","input-checkbox-wrapper":"arfe-input-checkbox-wrapper","button-icon":"arfe-button-icon","reorder-wrapper":"arfe-reorder-wrapper","select-dropdown":"arfe-select-dropdown","tabs-wrapper":"arfe-tabs-wrapper","question-group-title":"arfe-question-group-title","space-align-right":"arfe-space-align-right","space-align-left":"arfe-space-align-left","space-vertical-align-left":"arfe-space-vertical-align-left","space-vertical-align-right":"arfe-space-vertical-align-right","more-question-setting-text":"arfe-more-question-setting-text"};

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
    buttonMoveQuestionGroupText: 'Move group here',
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

var _char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var dummyName = function dummyName() {
  return [1, 2].reduce(function (curr) {
    return curr + _char.charAt(Math.floor(Math.random() * _char.length));
  }, '');
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
      name = _ref2$name === void 0 ? dummyName() : _ref2$name,
      _ref2$prevOrder = _ref2.prevOrder,
      prevOrder = _ref2$prevOrder === void 0 ? 0 : _ref2$prevOrder;
  var qg = {
    id: generateId(),
    name: name || dummyName(),
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
  activeMoveQuestionGroup: null,
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
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      _ref$isLastItem = _ref.isLastItem,
      isLastItem = _ref$isLastItem === void 0 ? false : _ref$isLastItem;

  var _UIStore$useState = UIStore.useState(function (s) {
    return s.UIText;
  }),
      buttonCancelText = _UIStore$useState.buttonCancelText;

  var movingQg = UIStore.useState(function (s) {
    return s.activeMoveQuestionGroup;
  });

  var _questionGroupFn$stor = questionGroupFn.store.useState(function (s) {
    return s;
  }),
      questionGroups = _questionGroupFn$stor.questionGroups;

  var handleOnAdd = function handleOnAdd() {
    var prevQg = questionGroups.filter(function (qg) {
      return qg.order <= prevOrder;
    });
    var nextQg = questionGroups.filter(function (qg) {
      return qg.order > prevOrder;
    }).map(function (qg) {
      return _extends({}, qg, {
        order: qg.order + 1
      });
    });
    var newQuestionGroups = [].concat(prevQg, [questionGroupFn.add({
      prevOrder: prevOrder
    })], nextQg);
    questionGroupFn.store.update(function (s) {
      s.questionGroups = newQuestionGroups;
    });
  };

  var handleOnMove = function handleOnMove() {
    var currentQg = _extends({}, movingQg, {
      order: isLastItem ? prevOrder : prevOrder ? prevOrder > movingQg.order ? prevOrder : prevOrder + 1 : 1
    });

    var orderedQg = questionGroups.filter(function (qg) {
      return qg.order !== movingQg.order;
    }).map(function (x) {
      if (isLastItem) {
        if (x.order > movingQg.order) {
          return _extends({}, x, {
            order: x.order - 1
          });
        }

        return x;
      }

      if (prevOrder > movingQg.order) {
        if (x.order <= prevOrder && x.order > movingQg.order) {
          return _extends({}, x, {
            order: x.order - movingQg.order || 1
          });
        }

        if (x.order >= prevOrder && x.order > movingQg.order) {
          return x;
        }

        return x;
      }

      if (prevOrder < movingQg.order && x.order < movingQg.order && x.order >= prevOrder + 1) {
        return _extends({}, x, {
          order: x.order + (prevOrder || 1)
        });
      }

      return x;
    });
    questionGroupFn.store.update(function (s) {
      s.questionGroups = lodash.orderBy([].concat(orderedQg, [currentQg]), 'order');
    });
    UIStore.update(function (s) {
      s.activeMoveQuestionGroup = null;
    });
  };

  var handleOnCancel = function handleOnCancel() {
    UIStore.update(function (s) {
      s.activeMoveQuestionGroup = null;
    });
  };

  return /*#__PURE__*/React__default.createElement(antd.Row, {
    align: "middle",
    justify: "start",
    className: "arfe-reorder-wrapper " + className
  }, /*#__PURE__*/React__default.createElement(antd.Col, {
    span: movingQg ? 12 : 24,
    align: "left"
  }, /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "dashed",
    className: "reorder-button",
    size: "small",
    onClick: movingQg ? handleOnMove : handleOnAdd,
    disabled: disabled
  }, text)), movingQg && /*#__PURE__*/React__default.createElement(antd.Col, {
    span: 12,
    align: "right"
  }, /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "danger",
    className: "reorder-button",
    size: "small",
    onClick: handleOnCancel
  }, buttonCancelText)));
};

var CardTitle = function CardTitle(_ref) {
  var title = _ref.title,
      disableMoveButton = _ref.disableMoveButton,
      _ref$numbering = _ref.numbering,
      numbering = _ref$numbering === void 0 ? null : _ref$numbering,
      _ref$onMoveClick = _ref.onMoveClick,
      onMoveClick = _ref$onMoveClick === void 0 ? function () {} : _ref$onMoveClick;
  return /*#__PURE__*/React__default.createElement(antd.Space, null, /*#__PURE__*/React__default.createElement(antd.Button, {
    type: "link",
    className: styles['button-icon'],
    onClick: onMoveClick,
    disabled: disableMoveButton,
    icon: /*#__PURE__*/React__default.createElement(bi.BiMove, null)
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

var FormDefinition = function FormDefinition(_ref) {
  var onSave = _ref.onSave;
  var form = antd.Form.useFormInstance();

  var _questionGroupFn$stor = questionGroupFn.store.useState(function (s) {
    return s;
  }),
      questionGroups = _questionGroupFn$stor.questionGroups;

  var formStore = FormStore.useState(function (s) {
    return s;
  });
  var UIText = UIStore.useState(function (s) {
    return s.UIText;
  });
  var inputFormNameLabel = UIText.inputFormNameLabel,
      inputFormDescriptionLabel = UIText.inputFormDescriptionLabel;

  var handleSave = function handleSave() {
    form.submit();

    if (onSave) {
      onSave(_extends({}, formStore, {
        questionGroups: questionGroups
      }));
    }
  };

  React.useEffect(function () {
    form.setFieldsValue({
      'form-name': formStore.name,
      'form-description': formStore.description
    });
  }, [form, formStore]);
  return /*#__PURE__*/React__default.createElement("div", {
    key: "form-definition-input",
    className: "arfe-form-definition"
  }, /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: inputFormNameLabel,
    name: "form-name"
  }, /*#__PURE__*/React__default.createElement(antd.Input, {
    onChange: function onChange(e) {
      return FormStore.update(function (u) {
        var _e$target;

        u.name = e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value;
      });
    }
  })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    label: inputFormDescriptionLabel,
    name: "form-description"
  }, /*#__PURE__*/React__default.createElement(antd.Input.TextArea, {
    rows: 5,
    onChange: function onChange(e) {
      return FormStore.update(function (u) {
        var _e$target2;

        u.description = e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.value;
      });
    }
  })), /*#__PURE__*/React__default.createElement(SaveButton, {
    cancelButton: false,
    onClickSave: handleSave
  }));
};

var QuestionGroupDefinition = function QuestionGroupDefinition(_ref) {
  var index = _ref.index,
      questionGroup = _ref.questionGroup,
      isLastItem = _ref.isLastItem;
  var activeQuestionGroups = UIStore.useState(function (s) {
    return s.activeQuestionGroups;
  });
  var activeEditQuestionGroups = UIStore.useState(function (s) {
    return s.activeEditQuestionGroups;
  });
  var movingQg = UIStore.useState(function (s) {
    return s.activeMoveQuestionGroup;
  });
  var id = questionGroup.id,
      name = questionGroup.name,
      questions = questionGroup.questions,
      order = questionGroup.order;

  var _UIStore$useState = UIStore.useState(function (s) {
    return s.UIText;
  }),
      buttonAddNewQuestionGroupText = _UIStore$useState.buttonAddNewQuestionGroupText,
      buttonMoveQuestionGroupText = _UIStore$useState.buttonMoveQuestionGroupText;

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

  var handleMove = function handleMove() {
    UIStore.update(function (s) {
      s.activeMoveQuestionGroup = movingQg === questionGroup ? null : questionGroup;
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
    text: movingQg ? buttonMoveQuestionGroupText : buttonAddNewQuestionGroupText,
    order: order - 1,
    disabled: movingQg === questionGroup || (movingQg === null || movingQg === void 0 ? void 0 : movingQg.order) + 1 === order
  }), /*#__PURE__*/React__default.createElement(antd.Card, {
    key: index + "-" + id,
    title: /*#__PURE__*/React__default.createElement(CardTitle, {
      title: /*#__PURE__*/React__default.createElement("div", {
        className: "arfe-question-group-title"
      }, name, " | Order: ", order),
      onMoveClick: handleMove,
      disableMoveButton: !index && isLastItem
    }),
    headStyle: {
      textAlign: 'left',
      padding: '0 12px',
      backgroundColor: (movingQg === null || movingQg === void 0 ? void 0 : movingQg.id) === id ? '#FFF2CA' : '#FFF',
      border: (movingQg === null || movingQg === void 0 ? void 0 : movingQg.id) === id ? '1px dashed #ffc107' : 'none'
    },
    bodyStyle: {
      padding: isEditQuestionGroup || showQuestion ? 24 : 0,
      borderTop: isEditQuestionGroup || showQuestion ? '1px solid #f3f3f3' : 'none'
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
    text: movingQg ? buttonMoveQuestionGroupText : buttonAddNewQuestionGroupText,
    disabled: movingQg === questionGroup,
    isLastItem: true
  }));
};

var QuestionGroupSetting = function QuestionGroupSetting(_ref) {
  var id = _ref.id,
      name = _ref.name,
      description = _ref.description;
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

  var handleChangeDescription = function handleChangeDescription(e) {
    questionGroupFn.store.update(function (s) {
      s.questionGroups = s.questionGroups.map(function (x) {
        if (x.id === id) {
          var _e$target2;

          return _extends({}, x, {
            description: e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.value
          });
        }

        return x;
      });
    });
  };

  var handleChangeRepeatable = function handleChangeRepeatable(e) {
    questionGroupFn.store.update(function (s) {
      s.questionGroups = s.questionGroups.map(function (x) {
        if (x.id === id) {
          var _e$target3;

          return _extends({}, x, {
            repeatable: e === null || e === void 0 ? void 0 : (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : _e$target3.checked
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
    onChange: handleChangeDescription,
    rows: 5
  })), /*#__PURE__*/React__default.createElement(antd.Form.Item, {
    name: namePreffix + "-repeatable",
    className: styles['input-checkbox-wrapper']
  }, /*#__PURE__*/React__default.createElement(antd.Checkbox, {
    onChange: handleChangeRepeatable
  }, ' ', UIText.inputRepeatThisGroupCheckbox)));
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
        console.log('move');
      }
    }),
    headStyle: {
      textAlign: 'left',
      padding: '0 12px'
    },
    bodyStyle: {
      borderTop: isEditQuestion ? '1px solid #f3f3f3' : 'none',
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

var WebformEditor = function WebformEditor(_ref) {
  var _ref$onSave = _ref.onSave,
      onSave = _ref$onSave === void 0 ? false : _ref$onSave;
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
  })), currentTab === 'form' && /*#__PURE__*/React__default.createElement(FormWrapper, null, /*#__PURE__*/React__default.createElement(FormDefinition, {
    onSave: onSave
  }), questionGroups.map(function (qg, qgi) {
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
