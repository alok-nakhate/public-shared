import fileAstDtlData from './Asset_Details_Data.json';
import fileAstDtlLayout from './Asset_Details_Layout.json';
import { replaceFromString, checkIfFieldIsAColumn, findSectionalIndex } from '../form/utils';
import Model from '../form/Model';
import GlobalHelper from '../components/GlobalHelper';
import Log4r from '../../src/util/Log4r';

function isnull(o) {
	return (undefined === o || 'undefined' == typeof (o) || 'undefined' == typeof (o) || null === o || 'null' === o || (Object.keys(o).length === 0 && o.constructor === Object));
}

export function isempty(o) {
	if (isnull(o)) {
		return true;
	} else if (o.length === 0) {
		return true;
	} else if (o.length === 1) {
		if (o[0] === "") {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

var mapTreeViewSections = [];
var valRule = ['required', 'max', 'min', 'len', 'type', 'enum', 'pattern'];

export class ReactJsonBuilder {
	constructor(scrnjson, index, datajson, isDevEnv) {
		Log4r.log("Alok RnD ReactJsonBuilder jsonBuilder.js constructor");
		let sJson = null;
		let dJson = null;
		this.reactJson = {};
		this.reactJson.LayoutName = "#";
		this.reactJson.JsScripts = new Array();
		this.reactJson.LayoutHeader = null;
		this.reactJson.rules = {};
		this.targetToRulesMapper = new Map(); // map containing targetId as key and an array of objects as its value. Each object in the array has two property-Value pair. One for "ruleId"-value and other one for "actionId"-value.
		this.ruleToTargetsMapper = new Map(); // map containing ruleId as key and an array of objects as its value. Each object in the array has two property-Value pair. One for "targetId"-value and other one for "actionId"-value.
		this.fieldInExpressionToRulesMapper = new Map(); // map containing controlId(fieldId) as key and an array of ruleIds as its value. Each ruleId in the array corresponds to the rule whose expression contains the control(field).
		this.defaultValueManagerMap = new Map();
		this.ruleExecutionStatusMap = new Map();
		this.throwValidationRulesArray = new Array();
		this.reactJson.screendata = new Array();
		this.reactJson.ButtonPalette = new Array();
		this.reactJson.QuickButtonPalette = new Array();
		if (isDevEnv == true) {
			sJson = eval(fileAstDtlLayout.layout);
			dJson = eval(fileAstDtlData.data);
			this.findTreeViewSections(sJson, mapTreeViewSections);
			this.parseJson(sJson, dJson, 1, "Title");
			// Log4r.log("Alok RnD JSON data if: ", sJson, dJson, this.reactJson);
		}
		else {
			if (!isempty(scrnjson)) {
				if (scrnjson.JSSCRIPTS != undefined) {
					this.reactJson.JsScripts = null;
					this.reactJson.JsScripts = scrnjson.JSSCRIPTS;
				}
				sJson = eval(scrnjson);
				if (!isempty(datajson))
					dJson = null;
				dJson = eval(datajson.dataJson);
				this.findTreeViewSections(sJson, mapTreeViewSections);
				this.parseJson(sJson, dJson, 1, "Title");
				// Log4r.log("Alok RnD JSON data else: ", sJson, dJson, this.reactJson);
			}
		}
		this.reactJson.ButtonPalette.push({ 'schema': [{ 'btn1': { 'title': '' }, 'btn2': { 'title': '' } }], 'uiSchema': [{ 'xType': 'grid', 'children': [{ 'xType': 'col', 'span': 6, 'children': { 'xType': 'field', 'widget': 'button', 'fieldPath': 'btn1' } }, { 'xType': 'col', 'span': 6, 'children': { 'xType': 'field', 'widget': 'button', 'fieldPath': 'btn2' } }] }], 'formData': [{ 'btn1': { 'style': { 'type': 'default', 'size': 'large', 'label': 'SAVE', 'classname': 'paletteClassSave', 'icon': 'floppy-o' } }, 'btn2': { 'style': { 'type': 'default', 'size': 'large', 'label': 'CLEAR', 'classname': 'paletteClassSave', 'icon': 'eraser' } } }] });
		sJson = null;
		dJson = null;
	}

	destroy() {
		Log4r.log("Alok RnD ReactJsonBuilder jsonBuilder.js destroy");
	}

	parseJson(screen, data, parentCount, parentTitle) {
		if (!isempty(this.reactJson.LayoutHeader)) {
			this.reactJson.LayoutHeader = null;
			this.reactJson.LayoutHeader = screen.cap;
		}

		if (Array.isArray(screen)) {
			for (let i = 0; i < screen.length; i++) {
				if (isempty(data)) {
					this.buildScreenJson(screen[i], null, parentCount, parentTitle);
				} else {
					if (isempty(data[i])) {
						if (isempty(data[0])) {
							this.buildScreenJson(screen[i], data, parentCount, parentTitle);
						} else {
							this.buildScreenJson(screen[i], data[0], parentCount, parentTitle);
						}
					} else {
						this.buildScreenJson(screen[i], data[i], parentCount, parentTitle);
					}
				}
			}
		}
		else {
			this.buildScreenJson(screen, data, parentCount, parentTitle);
		}
		if (!isempty(screen.rules)) {
			// let newRules = JSON.stringify(screen.rules);
			let rulesObj = JSON.parse(JSON.stringify(screen.rules));
			this.reactJson.rules = rulesObj;
			if (rulesObj != null && rulesObj != undefined && rulesObj != "" && rulesObj != {}) {
				if (this.targetToRulesMapper.size == 0 && this.ruleToTargetsMapper.size == 0 && this.fieldInExpressionToRulesMapper.size == 0 && this.defaultValueManagerMap.size == 0 && this.ruleExecutionStatusMap.size == 0) {
					this.ruleKeys = Object.entries(rulesObj);
					Object.entries(rulesObj).map(this.separateRules.bind(this));
					this.defaultValueManagerMap = createDefaultValueMap(this.reactJson, this.targetToRulesMapper);
				}
			}
			rulesObj = null;
		}
		GlobalHelper.globlevar['targetToRulesMapper'] = null;
		GlobalHelper.globlevar['ruleToTargetsMapper'] = null;
		GlobalHelper.globlevar['fieldInExpressionToRulesMapper'] = null;
		GlobalHelper.globlevar['defaultValueManagerMap'] = null;
		GlobalHelper.globlevar['ruleExecutionStatusMap'] = null;
		GlobalHelper.globlevar['throwValidationRulesArray'] = null;

		GlobalHelper.globlevar['targetToRulesMapper'] = this.targetToRulesMapper;
		GlobalHelper.globlevar['ruleToTargetsMapper'] = this.ruleToTargetsMapper;
		GlobalHelper.globlevar['fieldInExpressionToRulesMapper'] = this.fieldInExpressionToRulesMapper;
		GlobalHelper.globlevar['defaultValueManagerMap'] = this.defaultValueManagerMap;
		GlobalHelper.globlevar['ruleExecutionStatusMap'] = this.ruleExecutionStatusMap;
		GlobalHelper.globlevar['throwValidationRulesArray'] = this.throwValidationRulesArray;
	}

	buildScreenJson(screen, data, parentCount, parentTitle) {
		if (isempty(screen.controls)) {
			let layoutData = null;
			if (!isempty(data)) {
				if (!isempty(data[screen.id])) {
					layoutData = data[screen.id];
				} else {
					layoutData = data;
				}
			} else {
				layoutData = null;
			}
			if (parentCount > screen.columncount) {
				this.parseJson(screen.layouts, layoutData, parentCount, screen.cap);
				parentCount = 0;
			} else {
				this.parseJson(screen.layouts, layoutData, screen.columncount, screen.cap);
			}
			layoutData = null;
		}
		else {
			if (isempty(data)) {
				this.reactJson.screendata.push(this.buildScreenLayout(screen, null, parentCount, parentTitle));
			} else {
				if (isempty(data[screen.id])) {
					this.reactJson.screendata.push(this.buildScreenLayout(screen, null, parentCount, parentTitle));
				} else {
					this.reactJson.screendata.push(this.buildScreenLayout(screen, data[screen.id][0], parentCount, parentTitle));
				}
			}
		}
	}

	buildScreenLayout(screen, data, parentCount, parentTitle) {
		let section = {};
		let sectionButton = {
			"applicable": "",
			"buttons": []
		};

		section.sessionID = screen.id;
		section.allowRefresh = "false";
		if (isempty(screen.cap)) {
			section.sessionHeader = parentTitle;
		}
		else {
			section.sessionHeader = screen.cap;
		}
		if (!isempty(screen.entityid)) {
			section.sectionXPath = screen.entityid;
		}
		if (!isempty(screen.sectionVisibilityType)) {
			section.sectionType = screen.sectionVisibilityType;
		}
		else {
			section.sectionType = "";
		}
		if (!isempty(screen.allowrefresher) && screen.allowrefresher == "Y") {
			section.allowRefresh = "true";
		}
		if (screen.cFixedSectionColumn == "Y") {
			section.cFixedSectionColumn = "true";
			section.columnCount = screen.columncount;
		}
		if (parentCount == '1') {
			section.layoutSize = "full";
		}
		if (screen.isreadonlysection == "Y") {
			section.editable = false;
		} else {
			section.editable = true;
		}
		if (screen.isButtonAttached == "Y") {
			sectionButton.applicable = "true";
			sectionButton.buttons.push({ "id": 1, "title": (screen.buttonLabel), "fname": (screen.buttonFunction) });
			section.sectionButton = sectionButton;
		}
		section.schema = new ReactSchemaBuilder(screen).ctls;
		section.uiSchema = new ReactUISchemaBuilder(screen).uiSchema;
		section.formData = new ReactFormDataBuilder(screen, data).ctls;
		return section;
	}

	buildReactJson() {
		return this.reactJson;
	}

	buildUpdateFormJson() {
		return this.formUpdateJson;
	}

	findTreeViewSections(sJson, mapTreeViewSections) {
		if (Array.isArray(sJson)) {
			let obj = [];
			for (let i = 0; i < sJson.length; i++) {
				if (sJson[i].isTreeView == 'Y') {
					mapTreeViewSections[sJson[i].id] = { parentKey: sJson[i].parentKey, connectKey: sJson[i].connectKey };
					obj = [];
					obj.push({
						"accept": "", "actionType": "none", "actionURL": "", "allowmultiselect": "N", "attributeJson": {}, "attributeid": "",
						"buttonFunction": "", "buttonLabel": "", "cAvailaibleInFilter": "N", "cDisplayAsImage": "N", "cDisplayDialerIcon": "N",
						"cDisplayFullValue": "N", "cDisplayInCard": "N", "cDisplayInTimeLine": "N", "cIsOverviewColumn": "N", "cap": "", "chartHeight": "60",
						"chartName": "", "chartWidth": "60", "controlcord": "", "controlpgno": "", "controlsubtype": "", "controltype": "",
						"cshowingridyn": "N", "ctlevents": [], "docAttrId": "none", "dragdrop": "N", "id": "tree_nav", "imageheight": "0", "imagewidth": "0",
						"ingridsummary": "N", "inputmap": "", "iorder": 0, "isButtonAttached": "N", "iscurrency": "N", "isdisabled": "Y", "isinteger": "N",
						"ismandatory": "N", "listType": "none", "maxFileSize": "5120", "otype": "A", "popSrchFetchOnLoad": "N", "popoutmap": "",
						"skiptosave": "N", "smryfunc": "null", "strAlignment": "center", "strOperator": "", "width": "20", "x": "0", "y": "0"
					});
					let item = {};
					for (let controls; controls < sJson[i].controls.length; controls++) {
						item = sJson[i].controls[controls];
						item.iorder = parseInt(item.iorder) + 1;
						obj.push(item);
					}
					sJson[i].controls = obj;
					sJson[i].controls.map((item, index) => {
						return item.iorder = parseInt(item.iorder) + 1;
					});
				}
				this.findTreeViewSections(sJson[i].layouts, mapTreeViewSections);
			}
			obj = null;
		} else {
			this.findTreeViewSections(sJson.layouts, mapTreeViewSections);
		}
	}

	separateRules(item, index) {
		let ruleId = item[0];
		let arrayOfRulesId = [];
		let involvedControlsArray = replaceFromString(this.reactJson.rules[ruleId]["expression"]);
		for (let i = 0; i < involvedControlsArray.length; i++) {
			arrayOfRulesId = [];
			if ((this.fieldInExpressionToRulesMapper.has(involvedControlsArray[i]))) {
				arrayOfRulesId = this.fieldInExpressionToRulesMapper.get(involvedControlsArray[i]);
			};
			if (arrayOfRulesId.indexOf(ruleId) == -1) {
				arrayOfRulesId.push(ruleId);
				this.fieldInExpressionToRulesMapper.set(involvedControlsArray[i], arrayOfRulesId);
			}
		}
		arrayOfRulesId = null;
		this.traverseRuleDetails(Object.entries(item[1]), ruleId);
	}

	traverseRuleDetails(ruleObject, ruleId) {
		let actionObjectArray = Object.entries(ruleObject[1][1]);
		for (let actionIndex = 0; actionIndex < actionObjectArray.length; actionIndex++) {
			this.separateActions(actionObjectArray[actionIndex], ruleId);
		}
		actionObjectArray = null;
	}

	separateActions(actionItem, ruleId) {
		let actionDetailsObject = actionItem[1]; // refers to action Details against key as actionId
		if (actionDetailsObject['action'] != "ERROR") {
			this.setInFieldActionMapper(actionDetailsObject, ruleId, actionItem[0]);
		}
		else {
			if (!this.throwValidationRulesArray.includes(ruleId)) { // To handle the case if in future multiple ERROR actions are part of a single rule
				this.throwValidationRulesArray.push(ruleId);
			}
			let residualFieldArray = replaceFromString(this.reactJson.rules[ruleId]["expression"]);
			for (let iterFieldArray = 0; iterFieldArray < residualFieldArray.length; iterFieldArray++) {
				actionDetailsObject['targetContId'] = residualFieldArray[iterFieldArray];
				this.setInFieldActionMapper(actionDetailsObject, ruleId, actionItem[0]);
			}
		}
		actionDetailsObject = null;
	}

	setInFieldActionMapper(actionDetailsObject, ruleId, actionId) {
		let leafSecArry = [];
		let targetAndActionArray = [];
		let ruleAndActionArray = [];
		leafSecArry = this.rtrnPossibleLeafSections(actionDetailsObject['targetContId']);
		for (let iterSec = 0; iterSec < leafSecArry.length; iterSec++) {
			targetAndActionArray = [];
			ruleAndActionArray = [];
			let targetAndActionToAttach = this.attachTargetAndActionAsObject(leafSecArry[iterSec], actionId);
			if ((this.ruleToTargetsMapper.has(ruleId))) {
				targetAndActionArray = this.ruleToTargetsMapper.get(ruleId);
			};
			if (this.targetToRulesMapper.has(leafSecArry[iterSec])) {
				ruleAndActionArray = this.targetToRulesMapper.get(leafSecArry[iterSec]);
			};
			targetAndActionArray.push(targetAndActionToAttach);
			ruleAndActionArray.push(this.attachRuleAndActionAsObject(ruleId, actionId));
			this.ruleToTargetsMapper.set(ruleId, targetAndActionArray);
			this.targetToRulesMapper.set(leafSecArry[iterSec], ruleAndActionArray);
		}
		leafSecArry = null;
		targetAndActionArray = null;
		ruleAndActionArray = null;
	}

	attachTargetAndActionAsObject(targetId, actionId) {
		let targetAndActionToAttach = {};
		targetAndActionToAttach["targetId"] = targetId;
		targetAndActionToAttach["actionId"] = actionId;
		return targetAndActionToAttach;
	}

	attachRuleAndActionAsObject(ruleId, actionId) {
		let ruleAndActionToAttach = {};
		ruleAndActionToAttach["ruleId"] = ruleId;
		ruleAndActionToAttach["actionId"] = actionId;
		return ruleAndActionToAttach;
	}

	rtrnPossibleLeafSections(idParam) {
		let arrayOfLeafSectns = [];
		if (idParam.indexOf(".") != -1) {
			arrayOfLeafSectns.push(idParam);
		}
		else {
			let leafObj = new Model().getLeafNodesForId(idParam);
			arrayOfLeafSectns = Object.keys(leafObj);
		}
		return arrayOfLeafSectns;
	}
}

class ReactLayoutParser {
	constructor(jsonObj) {
		this.ctls = false;
		this.parseJson(jsonObj);
	}
	parseJson(layout) {
	}
}

class ReactSchemaBuilder {
	constructor(objJson) {
		this.ctls = [];
		this.schemaField = {};
		this.parseJson(objJson);
	}
	parseJson(layout) {
		if (layout.type == "GRID") {
			let gridField = {};
			gridField.title = layout.cap;
			this.schemaField[layout.id] = gridField;
		} else {
			for (let i = 0; i < layout.controls.length; i++) {
				if (layout.controls[i].controltype != "InputBox" && layout.controls[i].cap != "null") {
					// var schemaFieldBuilder = new ReactSchemaField(layout.controls[i]).schemaField;
					this.schemaField[layout.controls[i].id] = new ReactSchemaField(layout.controls[i]).schemaField;
				}
			}
		}
		this.ctls.push(this.schemaField);
	}
	schemaJson() {
		return "schemaJson";
	}
}

class ReactSchemaField {
	constructor(ctlsJson) {
		this.schemaField = {};
		this.parseJson(ctlsJson);
	}

	parseJson(ctlsJson) {
		let CtlPlaceHolder = "";
		let ctlTitle = "";
		let ismandatory = ctlsJson.ismandatory;
		let max = ctlsJson.attributeJson.maxlength;
		let validation = new Array();
		let valObj = {};

		if (isempty(ctlsJson.cap)) {
			ctlTitle = "";
		} else {
			ctlTitle = ctlsJson.cap;
		}

		for (let i = 0; i < valRule.length; i++) {
			valObj = {};
			valObj.rule = valRule[i];
			valObj.applicable = "";
			valObj.reference = "";
			if (ismandatory == "Y" && valRule[i] == "required") {
				valObj.applicable = "yes";
				valObj.reference = "true";
			}
			if (!isempty(ctlsJson.attributeJson.regexp)) {
				if (valRule[i] == "pattern") {
					valObj.applicable = "yes";
					valObj.reference = ctlsJson.attributeJson.regexp;
				}
			}
			if (!isempty(max) && max > 0 && valRule[i] == "max" && ctlsJson.controltype != "radio" && ctlsJson.controltype != "currency" && ctlsJson.controltype != "text" && ctlsJson.controltype != "checkbox" && ctlsJson.controltype != "popsearch" && ctlsJson.controltype != "listbox" && ctlsJson.controltype != "date") {
				valObj.applicable = "yes";
				valObj.reference = max;
			}
			validation.push(valObj);
		}
		this.schemaField.title = ctlTitle;
		this.schemaField.validation = validation;
		this.schemaField.placeholder = CtlPlaceHolder;

		CtlPlaceHolder = null;
		ctlTitle = null;
		ismandatory = null;
		max = null;
		validation = null;
		valObj = null;
	}
}

class ReactUISchemaBuilder {
	constructor(objJson) {
		Log4r.log("Alok RnD ReactUISchemaBuilder jsonBuilder.js constructor");
		this.uiSchema = [];
		this.ctls = {}
		this.ctls.xType = "grid";
		this.ctls.children = new Array();
		this.parseJson(objJson);
	}

	parseJson(layout) {
		if (layout.type == "GRID") {
			let uiSchemaFieldBuilder = new ReactUISchemaField(layout);
			this.ctls.children.push(uiSchemaFieldBuilder);
		} else {
			for (let i = 0; i < layout.controls.length; i++) {
				if (layout.controls[i].controltype != "InputBox" && layout.controls[i].cap != "null") {
					let uiSchemaFieldBuilder = new ReactUISchemaField(layout.controls[i]);
					this.ctls.children.push(uiSchemaFieldBuilder);
				}
			}
		}
		this.uiSchema.push(this.ctls);
	}
}

class ReactUISchemaField {
	constructor(ctlsJson) {
		Log4r.log("Alok RnD ReactUISchemaField jsonBuilder.js constructor");
		this.xType = 'col';
		this.span = '6';
		this.children = {};
		this.children.datatype = "";
		this.children.xType = 'field';
		this.children.widget = 'text';
		this.children.fieldPath = 'action';
		this.children.xPath = 'xPath';
		this.children.edit = "true";
		this.children.param = {};
		this.children.fieldButton = { "applicable": "", "buttons": [] };
		this.parseJson(ctlsJson);
	}

	destroy() {
		Log4r.log("Alok RnD ReactUISchemaField jsonBuilder.js destroy");
	}

	parseJson(ctlsJson) {
		if (ctlsJson.type !== "GRID") {
			this.children.datatype = ctlsJson.attributeJson.dtype;
			this.children.precision = ctlsJson.attributeJson.maxlength;
			this.children.mantisa = ctlsJson.attributeJson.mantisa;
			this.children.allowNegative = ctlsJson.attributeJson.allowNegative;
			this.children.dateVal = ctlsJson.attributeJson.dateVal;
			this.children.mask = ctlsJson.attributeJson.mask;
			this.children.formatType = ctlsJson.attributeJson.formatString;
			if (ctlsJson.cDisplayFullValue == "Y") {
				this.children.cDisplayFullValue = "true";
			}
			if (!isempty(ctlsJson.controlcord)) {
				this.children.controlcord = ctlsJson.controlcord;
			}
			if (!isempty(ctlsJson.controlpgno)) {
				this.children.controlpgno = ctlsJson.controlpgno;
			}
			if (ctlsJson.cDisplayDialerIcon == "Y") {
				this.children.cDisplayDialerIcon = true;
			}
			if (ctlsJson.isdisabled == "Y") {
				this.children.edit = "false";
			}
			if (ctlsJson.isButtonAttached == "Y") {
				this.children.fieldButton.applicable = "true";
				this.children.fieldButton.buttons.push({ "id": 1, "title": (ctlsJson.buttonLabel), "fname": (ctlsJson.buttonFunction) });
			}
		}

		if (!isempty(ctlsJson.ctlevents)) {
			for (let j = 0; j < ctlsJson.ctlevents.length; j++) {
				this.children[ctlsJson.ctlevents[j].eventName] = ctlsJson.ctlevents[j].functionName;
				if (!isempty(ctlsJson.ctlevents[j].functionParameters)) {
					this.children.functionParameters = ctlsJson.ctlevents[j].functionParameters;
				}
			}
		}
		this.children.fieldPath = ctlsJson.id;
		this.children.xPath = ctlsJson.attributeid;
		if (!isempty(ctlsJson.controltype) && ctlsJson.controltype != "hidden") {
			this.children.widget = ctlsJson.controltype;
		}
		if (ctlsJson.controltype == "hyperlink") {
			this.children.widget = "link";
		}
		if (ctlsJson.controltype == "label" && !isempty(ctlsJson.attributeid)) {
			let dividerAttrId = ctlsJson.attributeid;
			if (dividerAttrId.lastIndexOf(".") != -1 && dividerAttrId.length > 0) {
				if ((dividerAttrId.substring(dividerAttrId.lastIndexOf(".") + 1, dividerAttrId.length)) == "__DIVIDER__") {
					this.children.widget = "divider";
				}
			}
		}

		if (ctlsJson.type == "GRID") {
			this.children.xPath = ctlsJson.entityid;
			this.children.widget = 'table';
		} else if (ctlsJson.controltype == "date" || ctlsJson.controltype == "DATE" || ctlsJson.controltype == "datepicker") {
			this.children.widget = 'date';
		} else if (ctlsJson.controltype == "datetime" || ctlsJson.controltype == "DATETIME") {
			this.children.widget = 'date-time';
		} else if (ctlsJson.controltype == "LISTBOX" || ctlsJson.controltype == "listbox") {
			this.children.widget = 'list';
		} else if (ctlsJson.controltype == "fileupload" || ctlsJson.controltype == "FILEUPLOAD") {
			this.children.widget = 'upload';
		} else if (ctlsJson.controltype == "querybuilder" || ctlsJson.controltype == "QUERYBUILDER") {
			this.children.widget = 'querybuilder';
		}
		if (ctlsJson.controltype == "select" || ctlsJson.controltype == "listbox" || ctlsJson.controltype == "radio") {
			if (ctlsJson.allowmultiselect == "Y") {
				this.children.type = "multipleselect";
			}
			if (ctlsJson.controlsubtype == "toggleButton") {
				this.children.toggleButton = "true";
			}
			if (ctlsJson.controlsubtype == "groupButton") {
				this.children.groupButton = "true";
			}
			if (!isempty(ctlsJson.inputmap)) {
				this.children.inputfieldMap = ctlsJson.inputmap;
			}
			this.children.options = [];
			if (!isempty(ctlsJson.attributeJson.queryid)) {
				let reactOptionField = {};
				for (let i = 0; i < ctlsJson.attributeJson.queryid.length; i++) {
					reactOptionField = {};
					reactOptionField.code = ctlsJson.attributeJson.queryid[i].id;
					reactOptionField.description = ctlsJson.attributeJson.queryid[i].cap;
					reactOptionField.icon = ctlsJson.attributeJson.queryid[i].icon;
					this.children.options.push(reactOptionField);
				}
				reactOptionField = null;
			}
		} else if (ctlsJson.controltype == "POPSEARCH" || ctlsJson.controltype == "popsearch") {
			let arrColumnTitles = [];
			if (ctlsJson.attributeJson.qmJSON != undefined) {
				let qmJSON = ctlsJson.attributeJson.qmJSON;
				if (!isempty(qmJSON.codeLbl) && qmJSON.hideCodeCol != "Y") {
					arrColumnTitles.push(qmJSON.codeLbl);
				}
				else if (isempty(qmJSON.codeLbl) && qmJSON.hideCodeCol == "N") {
					arrColumnTitles.push("Code");
				}
				else if (isempty(qmJSON.hideCodeCol)) {
					arrColumnTitles.push("Code");
				}

				if (!isempty(qmJSON.descLbl)) {
					arrColumnTitles.push(qmJSON.descLbl);
				} else {
					arrColumnTitles.push("Description");
				}
				if (qmJSON.qmCol != undefined && Object.keys(qmJSON.qmCol).length > 0) {
					let qmColumn = Object.keys(qmJSON.qmCol);
					for (let i = 0; i < qmColumn.length; i++) {
						if (qmJSON.qmCol[qmColumn[i]].isColHidden == "hidden") {
							continue;
						}
						if (!isempty(qmJSON.qmCol[qmColumn[i]].colDesc)) {
							arrColumnTitles.push(qmJSON.qmCol[qmColumn[i]].colDesc);
						}
					}
				}
			}

			if (arrColumnTitles.length > 0) {
				this.children.popUpColumnsTitle = arrColumnTitles;
			} else {
				this.children.popUpColumnsTitle = ["Code", "Description"];
			}
			this.children.widget = 'popsearch';
			this.children.param.attributeId = ctlsJson.attributeid;
			this.children.param.strSearchText = "";
			this.children.param.iPageNumber = "1";
			this.children.param.inputfieldMap = "";
			this.children.param.outputfieldMap = "";
			if (!isempty(ctlsJson.inputmap)) this.children.param.inputfieldMap = ctlsJson.inputmap;
			if (!isempty(ctlsJson.popoutmap)) this.children.param.outputfieldMap = ctlsJson.popoutmap;
			if (ctlsJson.popSrchFetchOnLoad !== undefined) {
				if (!isempty(ctlsJson.popSrchFetchOnLoad) && ctlsJson.popSrchFetchOnLoad == "Y") {
					this.children.popSrchFetchOnLoad = "true";
				} else if (ctlsJson.popSrchFetchOnLoad == "N") {
					if (ctlsJson.attributeJson.popSrchFetchOnLoad != undefined) {
						if (ctlsJson.attributeJson.popSrchFetchOnLoad == "Y") {
							this.children.popSrchFetchOnLoad = "true";
						} else {
							this.children.popSrchFetchOnLoad = "false";
						}
					} else {
						this.children.popSrchFetchOnLoad = "false";
					}
				}
				if (ctlsJson.allowmultiselect == "Y") {
					this.children.type = "multipleselect";
				} else {
					if (ctlsJson.attributeJson.allowMultiselect != undefined) {
						if (ctlsJson.attributeJson.allowMultiselect == "Y") {
							this.children.type = "multipleselect";
						}
					}
				}
			}
		} else if (ctlsJson.controltype == "fileupload" || ctlsJson.controltype == "FILEUPLOAD") {
			this.children.listType = ctlsJson.listType;
			this.children.accept = ctlsJson.accept;
			this.children.maxFileSize = ctlsJson.maxFileSize;
			this.children.docAttrId = ctlsJson.docAttrId;
			this.children.multiple = ctlsJson.allowmultiselect;
			this.children.action = ctlsJson.actionURL;
			this.children.actionType = ctlsJson.actionType;

		} else if (ctlsJson.controltype == "dmsupload" || ctlsJson.controltype == "DMSUPLOAD") {
			this.children.listType = ctlsJson.listType;
			this.children.accept = ctlsJson.accept;
			this.children.maxFileSize = ctlsJson.maxFileSize;
			this.children.docAttrId = ctlsJson.docAttrId;
			this.children.multiple = ctlsJson.allowmultiselect;
			this.children.action = ctlsJson.actionURL;
			this.children.actionType = ctlsJson.actionType;
			this.children.param.dmsUploadMap = "";
			if (!isempty(ctlsJson.DMSUploadMap)) this.children.param.dmsUploadMap = ctlsJson.DMSUploadMap;

		} else if (ctlsJson.controltype == "querybuilder" || ctlsJson.controltype == "QUERYBUILDER") {
			this.children.QBEntityId = ctlsJson.QBEntityId;
		} else if (ctlsJson.controltype == "hidden") {
			this.children.widget = 'hidden';
		}

		if (ctlsJson.controlsubtype == "hidden") {
			this.children.widget = 'hidden';
		}
	}
}

class ReactFormDataBuilder {
	constructor(objJson, dataJson) {
		Log4r.log("Alok RnD ReactFormDataBuilder jsonBuilder.js constructor");
		this.ctls = new Array();
		this.schemaField = {};
		this.parseJson(objJson, dataJson);
	}

	destroy() {
		Log4r.log("Alok RnD ReactFormDataBuilder jsonBuilder.js destroy");
	}

	parseJson(layout, dataJson) {
		if (layout.type == "GRID") {
			if (!isempty(layout.controls)) {
				let sdColumnGrps = null;
				if (!isempty(layout.groupColumns)) {
					sdColumnGrps = new SDGroupColumns(layout.groupColumns);
				}
				let formDataFieldBuilder = new ReactGridDataField(layout, dataJson, sdColumnGrps); //dataJson[layout.id][0]
				this.schemaField[layout.id] = formDataFieldBuilder.gridDataField;
			}
		} else {
			if (!isempty(dataJson)) {
				if (!isempty(dataJson.data)) {
					dataJson = dataJson.data;
				}
			}
			for (let i = 0; i < layout.controls.length; i++) {
				if (layout.controls[i].controltype != "InputBox" && layout.controls[i].cap != "null") {

					var formDataDesc = null;
					if (isempty(dataJson)) {
						dataJson = [];
					} else {

						if ((layout.controls[i].id.concat("desc")) in dataJson) {
							formDataDesc = dataJson[layout.controls[i].id.concat("desc")];
						}
					}
					var formDataFieldBuilder = new ReactFormDataField(layout.controls[i], dataJson, formDataDesc);
					this.schemaField[layout.controls[i].id] = formDataFieldBuilder.formDataField;
				}
			}
		}
		this.ctls.push(this.schemaField);
	}
}

class ReactFormDataField {
	constructor(ctlsJson, dataJson, dataJsonDesc) {
		Log4r.log("Alok RnD ReactFormDataField jsonBuilder.js constructor");
		this.formDataField = {};
		this.formDataField.style = {};
		this.formDataField.style.classname = '';
		this.formDataField.data = null;
		this.ctlArray = [];
		this.parseJson(ctlsJson, dataJson, dataJsonDesc);
	}

	parseJson(ctlsJson, dataJson, dataJsonDesc) {
		if (dataJson == "GRID") {
			let gridColumn = { Columns: [] };
			for (let i = 0; i < ctlsJson.controls.length; i++) {
				if (!isempty(ctlsJson.controls[i])) {
					var reactGridColumn = new ReactGridColumn(ctlsJson.controls[i]);
					gridColumn.Columns.push(reactGridColumn);
				}
			}
			this.formDataField.data = gridColumn;
			gridColumn = null;
		} else {
			if (!isempty(dataJson[ctlsJson.id]) || dataJson[ctlsJson.id] !== undefined) {
				this.formDataField.data = dataJson[ctlsJson.id];
			}
			else {
				if (!isempty(ctlsJson.attributeJson.defaultValue)) {
					if (ctlsJson.attributeJson.defaultValue.indexOf("$E!{") !== -1 || ctlsJson.attributeJson.defaultValue.indexOf("$P!{") !== -1) {
						this.formDataField.data = [];
					} else {
						this.formDataField.data = ctlsJson.attributeJson.defaultValue.split();
					}
				} else {
					this.formDataField.data = [];
				}
			}
			if (!isempty(dataJsonDesc)) {
				this.formDataField.desc = dataJsonDesc;
			}
		}
	}
}

var mapFinalTreeJson = [];
var trackerMap = [];
var trackerArr = [];

class ReactGridDataField {
	constructor(ctlsJson, dataJson, sdColumnGrps) {
		Log4r.log("Alok RnD ReactGridDataField jsonBuilder.js constructor");
		this.gridDataField = {};
		this.gridDataField.style = {};
		this.gridDataField.style.classname = '';
		this.gridDataField.data = null;
		this.parseJson(ctlsJson, dataJson, sdColumnGrps);
	}

	parseJson(ctlsJson, dataJson, sdColumnGrps) {
		let gridColumn = { Columns: [], DataSource: [] };
		let reactGrpColumn = null;
		let moreRows = "false";
		let isgridSummary = "";
		let parentPKMap = {};
		gridColumn.isrowSelection = "false";
		gridColumn.isrowSelectionMandatory = "false";
		gridColumn.isrowSequence = "false";
		gridColumn.isCardDisplay = "false";
		gridColumn.isTimelineDisplay = "false";
		if (ctlsJson.isCardDisplay == "Y") {
			gridColumn.isCardDisplay = "true"
			if (ctlsJson.cardType !== undefined) {
				if (!isempty(ctlsJson.cardType)) {
					gridColumn.cardType = ctlsJson.cardType;
				}
			}
		}
		if (ctlsJson.isTimelineDisplay == "Y") {
			gridColumn.isTimelineDisplay = "true"
			gridColumn.timeLineAxisAttribute = ctlsJson.timeLineAxisAttribute
			if (ctlsJson.cardType !== undefined) {
				if (!isempty(ctlsJson.cardType)) {
					gridColumn.cardType = ctlsJson.cardType;
				}
			}
		}

		if (ctlsJson.defalutCardView == "Y" && ctlsJson.defalutCardView != undefined) {
			gridColumn.defaultCardView = "true";
		}

		if (ctlsJson.isRowGroup == "Y" && ctlsJson.isRowGroup != undefined) {
			if (!isempty(ctlsJson.rowGroupAttribute) && ctlsJson.rowGroupAttribute != undefined) {
				gridColumn.isRowGroup = "true";
				gridColumn.rowGroupAttribute = ctlsJson.rowGroupAttribute;
			}
		}

		if (!isempty(ctlsJson.isOrderFeatureYN) && ctlsJson.isOrderFeatureYN != undefined) {
			if (ctlsJson.isOrderFeatureYN == "Y") {
				gridColumn.isOrderFeatureYN = "true";
				if (!isempty(ctlsJson.orderColumn)) {
					gridColumn.orderColumn = ctlsJson.orderColumn;
				}
			}
		} else {
			gridColumn.isOrderFeatureYN = "false";
			gridColumn.orderColumn = "";
		}
		if (ctlsJson.showrownumber == "Y") {
			gridColumn.isrowSequence = "true";
		}
		if (ctlsJson.noMode == "Y") {
			gridColumn.nomode = "true";
		} else {
			gridColumn.nomode = "false";
		}
		if (ctlsJson.showrowsection == "Y") {
			gridColumn.isrowSelection = "true";
			if (ctlsJson.isRowSelectionMandatory == "Y") {
				gridColumn.isrowSelectionMandatory = "true";
			}
		}
		if (!isempty(ctlsJson.allowpagination)) {
			if (ctlsJson.allowpagination == "classic") {
				gridColumn.isPagination = "true";
				gridColumn.pagesize = ctlsJson.rowsperpage;
			} else if (ctlsJson.allowpagination == "none" || ctlsJson.allowpagination == "") {
				gridColumn.isPagination = "false";
			}
			if (!isempty(dataJson)) {
				if (ctlsJson.allowpagination == "classic") {
					if (dataJson.moreRows !== undefined && !isempty(dataJson.moreRows)) {
						moreRows = JSON.stringify(dataJson.moreRows)
					}
				}
				if (dataJson.parentPK !== undefined && !isempty(dataJson.parentPK)) {
					parentPKMap = dataJson.parentPK;
				}
				gridColumn.moreRows = moreRows;
				gridColumn.parentPK = parentPKMap;
			}
		}
		if (ctlsJson.csummaryyn == "Y") {
			if (ctlsJson.detailsectionid == null) {
				gridColumn.detailsectionid = "";
			} else {
				gridColumn.detailsectionid = ctlsJson.detailsectionid;
			}
			if (!isempty(ctlsJson.addThroughSummGrid) && ctlsJson.addThroughSummGrid == "Y") {
				gridColumn.addThroughSummGrid = "true";
			} else {
				gridColumn.addThroughSummGrid = "false";
			}
			gridColumn.smryclickablecol = ctlsJson.smryclickablecol;
			gridColumn.smrykeyconfig = ctlsJson.smrykeyconfig;
			gridColumn.summaryConfigType = ctlsJson.summaryConfigType;
			if (ctlsJson.summaryConfigType == "F") {
				if (ctlsJson.funcBaseDtlCntxtIds != undefined && !isempty(ctlsJson.funcBaseDtlCntxtIds)) {
					gridColumn.funcBaseDtlCntxtIds = ctlsJson.funcBaseDtlCntxtIds;
				}
			}
			gridColumn.functionIdColumn = ctlsJson.functionIdColumn;
			gridColumn.isFullScreen = ctlsJson.isFullScreen;
		}
		let rowCount = 1;
		if (!isempty(dataJson)) {
			if (!isempty(dataJson.data)) {
				dataJson = dataJson.data;
			}
		}
		let columnCount;
		for (let i = 0; i < ctlsJson.controls.length; i++) {
			columnCount = i;
			if (ctlsJson.controls[i].ingridsummary == "Y" && ctlsJson.controls[i].ingridsummary != undefined) {
				isgridSummary = "true";
			}
			if (!isempty(ctlsJson.controls[i])) {
				try {
					if (!isempty(dataJson[ctlsJson.controls[i].id])) {
						rowCount = dataJson[ctlsJson.controls[i].id].length;
					}
				} catch (e) { }
				if (!isempty(sdColumnGrps)) {
					if (!isempty(sdColumnGrps.getColumnById(ctlsJson.controls[i].id))) {
						let sdColumn = sdColumnGrps.getColumnById(ctlsJson.controls[i].id);
						if (sdColumn.columnSeq == 0) {
							//add new title
							reactGrpColumn = new ReactGrpColumn(sdColumn, ctlsJson.controls[i], ctlsJson, columnCount);
						} else {
							//add column
							reactGrpColumn.addGrpColumn(sdColumn, ctlsJson.controls[i], ctlsJson, columnCount);
						}
						if (sdColumn.columnCnt == sdColumn.columnSeq + 1) {
							let widgetTypeCount = 0;
							// let totalgroupedColmns = reactGrpColumn.children.length;
							for (let k = 0; k < reactGrpColumn.children.length; k++) {
								if (reactGrpColumn.children[k].widget == "hidden") {
									widgetTypeCount = widgetTypeCount + 1;
								}
							}
							if (reactGrpColumn.children.length == widgetTypeCount) {
								widgetTypeCount = 0;
								reactGrpColumn.hideGroup = true;
							}
							gridColumn.Columns.push(reactGrpColumn);
							reactGrpColumn = null;
						}
					}
					else {
						let reactGridColumn = new ReactGridColumn(ctlsJson.controls[i], ctlsJson, columnCount);
						gridColumn.Columns.push(reactGridColumn.gridColumn);
					}
				} else {
					let reactGridColumn = new ReactGridColumn(ctlsJson.controls[i], ctlsJson, columnCount);
					gridColumn.Columns.push(reactGridColumn.gridColumn);
				}
			}
		}
		if (isgridSummary == "true") {
			gridColumn.isOrderFeatureYN = "false";
			gridColumn.orderColumn = "";
		}
		if (ctlsJson.isreadonlysection !== 'Y') {
			gridColumn.Columns.unshift({ "title": "edit", "width": 100, "dataIndex": "operation", "render": "" });
		}
		if (ctlsJson.allowadd == "Y") {
			gridColumn.Columns.unshift({ "title": "add", "width": 100, "dataIndex": "operation", "render": "" });
		}
		if (ctlsJson.allowdelete == "Y") {
			gridColumn.Columns.unshift({ "title": "delete", "width": 100, "dataIndex": "operation", "render": "" });
		}
		let reactGridDataSource;
		for (let j = 0; j < rowCount; j++) {
			reactGridDataSource = new ReactGridDataSource(gridColumn.Columns, j + 1, dataJson);//dataJson
			if (!isempty(reactGridDataSource.datasource)) {
				gridColumn.DataSource.push(reactGridDataSource.datasource);
			}
			reactGridDataSource = null;
		}
		if (!isempty(mapTreeViewSections[ctlsJson.id])) {
			gridColumn.DataSource = this.replaceTreeViewData(gridColumn.DataSource, mapTreeViewSections[ctlsJson.id]);
		}
		this.gridDataField.data = gridColumn;

		gridColumn = null;
		reactGrpColumn = null;
		moreRows = null;
		isgridSummary = null;
		parentPKMap = null;
	}

	replaceTreeViewData(dataJson, treeViewKeyConfig) {
		if (!isempty(treeViewKeyConfig)) {
			mapFinalTreeJson = [];
			trackerMap = [];
			trackerArr = [];
			let parentControlId = treeViewKeyConfig.parentKey;
			let mainControlId = treeViewKeyConfig.connectKey;
			let currDataJson = dataJson;
			let parentData = "";
			this.getAlteredJson(currDataJson, parentData, parentControlId, mainControlId);
			for (let k = 0; k < trackerArr.length; k++) {
				if (isempty(trackerArr[k])) {
					continue;
				}
				this.getAlteredJson(currDataJson, trackerArr[k], parentControlId, mainControlId);
			}
		}
		return mapFinalTreeJson;
	}

	getAlteredJson(dataJson, parentData, parentControlId, mainControlId) {
		let row = "";
		let bFound;
		for (let i = 0; i < dataJson.length; i++) {
			row = dataJson[i];
			if (row[parentControlId] == parentData) {
				bFound = this.findAndAddNode(parentData, row, mainControlId, mapFinalTreeJson);
				if (!bFound && isempty(trackerMap[row[mainControlId]])) {
					mapFinalTreeJson.push(row);
					trackerArr.push(row[mainControlId]);
					trackerMap[row[mainControlId]] = row[mainControlId];
				}
			}
		}
		row = null;
	}

	findAndAddNode(parentData, node, mainControlId, finalJson) {
		for (let i = 0; i < finalJson.length; i++) {
			if (finalJson[i][mainControlId] == parentData) {
				if (isempty(finalJson[i].children)) {
					finalJson[i].children = [];
				}
				finalJson[i].children.push(node);
				trackerArr.push(node[mainControlId]);
				trackerMap[node[mainControlId]] = node[mainControlId];
				return true;
			}
			if (!isempty(finalJson[i].children)) {
				for (let j = 0; j < finalJson[i].children.length; j++) {
					if (this.findAndAddNode(parentData, node, mainControlId, [finalJson[i].children[j]])) {
						return true;
					}
				}
			}
		}
		return false;
	}
}

class SDGroupColumns {
	constructor(grpStrings) {
		this.grpColumns = [];
		this.parseString(grpStrings);
	}

	parseString(grpStrings) {
		let grpArray = grpStrings.split("$");
		let grpString;
		for (let i = 0; i < grpArray.length; i++) {
			grpString = grpArray[i].split("=");
			if (!isempty(grpString) && grpString.length > 1) {
				let columnArray = grpString[1].split(",");
				for (let j = 0; j < columnArray.length; j++) {
					this.grpColumns.push(new ReactGroupColumn(grpString[0], i, columnArray.length, columnArray[j], j));
				}
			}
			grpString = null;
		}
		grpArray = null;
	}

	getColumnById(columnId) {
		for (let i = 0; i < this.grpColumns.length; i++) {
			if (this.grpColumns[i].columnId == columnId) {
				return this.grpColumns[i];
			}
		}
		return null;
	}
}

class ReactGroupColumn {
	constructor(grpTitle, grpSeq, columnCnt, columnId, columnSeq) {
		this.grpTitle = grpTitle;
		this.grpSeq = grpSeq;
		this.columnCnt = columnCnt;
		this.columnId = columnId;
		this.columnSeq = columnSeq;
	}
}

class ReactGrpColumn {
	constructor(sdColumn, ctlsJson, layouts, columnCount) {
		this.title = sdColumn.grpTitle;
		this.children = [];
		this.addGrpColumn(sdColumn, ctlsJson, layouts, columnCount);
	}

	addGrpColumn(sdColumn, ctlsJson, layouts, columnCount) {
		var reactGridColumn = new ReactGridColumn(ctlsJson, layouts, columnCount);
		this.children.push(reactGridColumn.gridColumn);
	}
}

class ReactGridColumn {
	constructor(ctlsJson, layouts, columnCount) {
		Log4r.log("Alok RnD ReactGridColumn jsonBuilder.js constructor");
		this.gridColumn = {};
		this.gridColumn.id = ctlsJson.id;
		this.gridColumn.title = ctlsJson.cap;
		this.gridColumn.dataIndex = ctlsJson.id;
		this.gridColumn.key = ctlsJson.id;
		this.gridColumn.xPath = 'xPath';
		this.gridColumn.sorter = "";
		this.gridColumn.onFilter = "";
		this.gridColumn.datatype = "string";
		this.gridColumn.render = "";
		this.gridColumn.colorDesc = "";
		this.gridColumn.isLink = false;
		this.gridColumn.displayOnCard = false;
		this.gridColumn.displayOnTimeLine = false;
		this.gridColumn.orderByAttribute = false;
		this.gridColumn.param = {};
		this.parseJson(ctlsJson, layouts, columnCount);
	}

	parseJson(ctlsJson, layouts, columnCount) {
		let max = ctlsJson.attributeJson.maxlength;
		let validation = new Array();
		let valObj = {};
		for (let i = 0; i < valRule.length; i++) {
			valObj = {};
			valObj.rule = valRule[i];
			valObj.applicable = "";
			valObj.reference = "";
			if (ctlsJson.ismandatory == "Y" && valRule[i] == "required") {
				valObj.applicable = "yes";
				valObj.reference = "true";
			}
			if (!isempty(ctlsJson.attributeJson.regexp)) {
				if (valRule[i] == "pattern") {
					valObj.applicable = "yes";
					valObj.reference = ctlsJson.attributeJson.regexp;
				}
			}
			if (!isempty(max) && max > 0 && valRule[i] == "max" && ctlsJson.controltype != "radio" && ctlsJson.controltype != "currency" && ctlsJson.controltype != "text" && ctlsJson.controltype != "checkbox" && ctlsJson.controltype != "popsearch" && ctlsJson.controltype != "listbox" && ctlsJson.controltype != "date") {
				valObj.applicable = "yes";
				valObj.reference = max;
			}
			validation.push(valObj);
		}
		valObj = null;
		if (ctlsJson.cDisplayInCard == "Y" && ctlsJson.cDisplayInCard !== undefined) {
			this.gridColumn.displayOnCard = true;
		}
		if (ctlsJson.cDisplayInTimeLine == "Y" && ctlsJson.cDisplayInTimeLine !== undefined) {
			this.gridColumn.displayOnTimeLine = true;
		}
		if (ctlsJson.cOrderByAttributeYn == "Y" && ctlsJson.cOrderByAttributeYn !== undefined) {
			this.gridColumn.orderByAttribute = true;
		}
		this.gridColumn.validation = validation;
		if (!isempty(ctlsJson.ctlevents)) {
			for (let i = 0; i < ctlsJson.ctlevents.length; i++) {
				this.gridColumn[ctlsJson.ctlevents[i].eventName] = ctlsJson.ctlevents[i].functionName;
				if (!isempty(ctlsJson.ctlevents[i].functionParameters)) {
					this.gridColumn.functionParameters = ctlsJson.ctlevents[i].functionParameters;
				}
			}
		}
		this.gridColumn.xPath = ctlsJson.attributeid;
		if (columnCount < layouts.freezecols) {
			this.gridColumn.fixed = "left";
		}
		if (ctlsJson.cAvailaibleInFilter == "Y") {
			this.gridColumn.onFilter = "true";
			if (ctlsJson.strOperator != undefined && !isempty(ctlsJson.strOperator)) {
				this.gridColumn.Operator = ctlsJson.strOperator;
			}
		} else {
			this.gridColumn.onFilter = "false";
		}
		if (!isempty(ctlsJson.controlsubtype) && ctlsJson.controlsubtype != undefined) {
			if (ctlsJson.controlsubtype == "url") {
				this.gridColumn.subType = ctlsJson.controlsubtype;
				this.gridColumn.isLink = true;
			}
		}
		this.gridColumn.datatype = ctlsJson.attributeJson.dtype;
		this.gridColumn.precision = ctlsJson.attributeJson.maxlength;
		this.gridColumn.mantisa = ctlsJson.attributeJson.mantisa;
		this.gridColumn.allowNegative = ctlsJson.attributeJson.allowNegative;
		this.gridColumn.dateVal = ctlsJson.attributeJson.dateVal;
		this.gridColumn.mask = ctlsJson.attributeJson.mask;
		this.gridColumn.formatType = ctlsJson.attributeJson.formatString;

		if (ctlsJson.cDisplayFullValue == "Y") {
			this.gridColumn.cDisplayFullValue = "true";
		}
		if (!isempty(ctlsJson.controlcord)) {
			this.gridColumn.controlcord = ctlsJson.controlcord;
		}
		if (!isempty(ctlsJson.controlpgno)) {
			this.gridColumn.controlpgno = ctlsJson.controlpgno;
		}
		if (ctlsJson.cDisplayDialerIcon == "Y") {
			this.gridColumn.cDisplayDialerIcon = true;
		}
		if (ctlsJson.cIsOverviewColumn == "Y") {
			this.gridColumn.level = "2";
		} else {
			this.gridColumn.level = "1";
		}
		if (!isempty(ctlsJson.strAlignment)) {
			this.gridColumn.align = ctlsJson.strAlignment;
		} else {
			this.gridColumn.align = "center";
		}
		if (ctlsJson.cDisplayAsImage === "Y") {
			this.gridColumn.style = "Font";
		}
		if (!isempty(ctlsJson.width)) {
			this.gridColumn.width = ctlsJson.width;
		}
		else {
			this.gridColumn.width = 100;
		}

		if (layouts.readonly !== 'Y') {
			if (ctlsJson.isdisabled == "N") {
				this.gridColumn.edit = "true";
			} else {
				this.gridColumn.edit = "false";
			}
			if (!isempty(ctlsJson.controltype) && ctlsJson.controltype != "hidden") {
				this.gridColumn.widget = ctlsJson.controltype;
			}
			if (ctlsJson.controltype == "select" || ctlsJson.controltype == "listbox" || ctlsJson.controltype == "radio") {
				if (ctlsJson.allowmultiselect == "Y") {
					this.gridColumn.type = "multipleselect";
				}
				if (ctlsJson.controlsubtype == "toggleButton") {
					this.gridColumn.toggleButton = "true";
				}
				if (ctlsJson.controlsubtype == "groupButton") {
					this.gridColumn.groupButton = "true";
				}
				this.gridColumn.options = [];
				if (!isempty(ctlsJson.attributeJson.queryid)) {
					let reactOptionField = {};
					for (let i = 0; i <= ctlsJson.attributeJson.queryid.length; i++) {
						reactOptionField = {};
						try {
							reactOptionField.code = ctlsJson.attributeJson.queryid[i].id;
							reactOptionField.description = ctlsJson.attributeJson.queryid[i].cap;
							reactOptionField.icon = ctlsJson.attributeJson.queryid[i].icon;
							this.gridColumn.options.push(reactOptionField);
						} catch (e) {
						}
						reactOptionField = null;
					}
				}
			} else if (ctlsJson.controltype == "date" || ctlsJson.controltype == "DATE" || ctlsJson.controltype == "datepicker") {
				this.gridColumn.widget = 'date';
			} else if (ctlsJson.controltype == "fileupload" || ctlsJson.controltype == "FILEUPLOAD") {
				this.gridColumn.widget = 'upload';
				this.gridColumn.listType = ctlsJson.listType;
				this.gridColumn.accept = ctlsJson.accept;
				this.gridColumn.maxFileSize = ctlsJson.maxFileSize;
				this.gridColumn.docAttrId = ctlsJson.docAttrId;
				this.gridColumn.multiple = ctlsJson.allowmultiselect;
				this.gridColumn.action = ctlsJson.actionURL;
				this.gridColumn.actionType = ctlsJson.actionType;
			} else if (ctlsJson.controltype == "dmsupload" || ctlsJson.controltype == "DMSUPLOAD") {
				this.gridColumn.listType = ctlsJson.listType;
				this.gridColumn.accept = ctlsJson.accept;
				this.gridColumn.maxFileSize = ctlsJson.maxFileSize;
				this.gridColumn.docAttrId = ctlsJson.docAttrId;
				this.gridColumn.multiple = ctlsJson.allowmultiselect;
				this.gridColumn.action = ctlsJson.actionURL;
				this.gridColumn.actionType = ctlsJson.actionType;
				this.gridColumn.param.dmsUploadMap = "";
				if (!isempty(ctlsJson.DMSUploadMap)) this.gridColumn.param.dmsUploadMap = ctlsJson.DMSUploadMap;

			} else if (ctlsJson.controltype == "datetime" || ctlsJson.controltype == "DATETIME") {
				this.gridColumn.widget = 'date-time';
			} else if (ctlsJson.controltype == "LISTBOX" || ctlsJson.controltype == "listbox") {
				this.gridColumn.widget = 'list';
			} else if (ctlsJson.controltype == "POPSEARCH" || ctlsJson.controltype == "popsearch") {
				let arrColumnTitles = [];
				if (ctlsJson.attributeJson.qmJSON != undefined) {

					let qmJSON = ctlsJson.attributeJson.qmJSON;
					if (!isempty(qmJSON.codeLbl) && qmJSON.hideCodeCol != "Y") {
						arrColumnTitles.push(qmJSON.codeLbl);
					}
					else if (isempty(qmJSON.codeLbl) && qmJSON.hideCodeCol == "N") {
						arrColumnTitles.push("Code");
					}
					else if (isempty(qmJSON.hideCodeCol)) {
						arrColumnTitles.push("Code");
					}

					if (!isempty(qmJSON.descLbl)) {
						arrColumnTitles.push(qmJSON.descLbl);
					} else {
						arrColumnTitles.push("Description");
					}
					if (qmJSON.qmCol != undefined && Object.keys(qmJSON.qmCol).length > 0) {
						let qmColumn = Object.keys(qmJSON.qmCol);
						for (let i = 0; i < qmColumn.length; i++) {
							if (qmJSON.qmCol[qmColumn[i]].isColHidden == "hidden") {
								continue;
							}
							if (!isempty(qmJSON.qmCol[qmColumn[i]].colDesc)) {
								arrColumnTitles.push(qmJSON.qmCol[qmColumn[i]].colDesc);
							}
						}
					}
					qmJSON = null;
				}

				if (arrColumnTitles.length > 0) {
					this.gridColumn.popUpColumnsTitle = arrColumnTitles;
				} else {
					this.gridColumn.popUpColumnsTitle = ["Code", "Description"];
				}
				this.gridColumn.widget = 'popsearch';
				this.gridColumn.param.attributeId = ctlsJson.attributeid;
				this.gridColumn.param.iPageNumber = "1";
				this.gridColumn.param.inputfieldMap = "";
				this.gridColumn.param.outputfieldMap = "";
				if (!isempty(ctlsJson.inputmap)) this.gridColumn.param.inputfieldMap = ctlsJson.inputmap;
				if (!isempty(ctlsJson.popoutmap)) this.gridColumn.param.outputfieldMap = ctlsJson.popoutmap;
				if (ctlsJson.popSrchFetchOnLoad !== undefined) {
					if (!isempty(ctlsJson.popSrchFetchOnLoad) && ctlsJson.popSrchFetchOnLoad == "Y") {
						this.gridColumn.popSrchFetchOnLoad = "true";
					} else if (ctlsJson.popSrchFetchOnLoad == "N") {
						if (ctlsJson.attributeJson.popSrchFetchOnLoad != undefined) {
							if (ctlsJson.attributeJson.popSrchFetchOnLoad == "Y") {
								this.gridColumn.popSrchFetchOnLoad = "true";
							} else {
								this.gridColumn.popSrchFetchOnLoad = "false";
							}
						} else {
							this.gridColumn.popSrchFetchOnLoad = "false";
						}
					}
				}
				if (ctlsJson.allowmultiselect == "Y" && ctlsJson.allowmultiselect != undefined) {
					this.gridColumn.type = "multipleselect";
				} else {
					if (ctlsJson.attributeJson.allowMultiselect != undefined) {
						if (ctlsJson.attributeJson.allowMultiselect == "Y") {
							this.gridColumn.type = "multipleselect";
						}
					}
				}
				arrColumnTitles = null;
			} else if (ctlsJson.controltype == "hidden" || ctlsJson.controlsubtype == "hidden") {
				this.gridColumn.widget = 'hidden';
			}
		} else {
			this.gridColumn.widget = "text";
			this.gridColumn.edit = "";
		}
		if (layouts.smryclickablecol == ctlsJson.id) {
			this.gridColumn.isLink = true;
			this.gridColumn.linkaction = "summaryaction";
			//commented below flag because if summ grid is editable then for controls which should be readonly edit flag false need to come and which need to be editable true falg should come.
			//this.gridColumn.edit = "true";
		}
		if (ctlsJson.controlsubtype == "hidden" || ctlsJson.controltype == "hidden") {
			this.gridColumn.widget = 'hidden';
		}
		if (ctlsJson.ingridsummary == "Y" && ctlsJson.smryfunc == "sum") {
			this.gridColumn.sum = "true";
		} else if (ctlsJson.ingridsummary == "Y" && ctlsJson.smryfunc == "max") {
			this.gridColumn.max = "true";
		} else if (ctlsJson.ingridsummary == "Y" && ctlsJson.smryfunc == "min") {
			this.gridColumn.min = "true";
		} else if (ctlsJson.ingridsummary == "Y" && ctlsJson.smryfunc == "count") {
			this.gridColumn.count = "true";
		} else if (ctlsJson.ingridsummary == "Y" && ctlsJson.smryfunc == "avg") {
			this.gridColumn.avg = "true";
		}
	}
}

class ReactGridDataSource {
	constructor(gridColumnsObj, cnt, dataJson) {
		Log4r.log("Alok RnD ReactGridDataSource jsonBuilder.js constructor");
		this.datasource = {};
		this.parseJson(gridColumnsObj, cnt, dataJson);
	}

	parseJson(gridColumnsObj, cnt, dataJson) {
		for (let i = 0; i < gridColumnsObj.length; i++) {
			try {
				if (undefined !== gridColumnsObj[i].children) {
					if (gridColumnsObj[i].children.length > 0) {
						for (let k = 0; k < gridColumnsObj[i].children.length; k++) {
							if (undefined != gridColumnsObj[i].children[k]) {
								this.datasource[gridColumnsObj[i].children[k].key] = dataJson[gridColumnsObj[i].children[k].id][cnt - 1];
								if ((gridColumnsObj[i].children[k].key.concat("desc")) in dataJson) {
									this.datasource[gridColumnsObj[i].children[k].key.concat("desc")] = dataJson[gridColumnsObj[i].children[k].key.concat("desc")][cnt - 1]
								}
							}
						}
					}
				}
				if (!isempty(dataJson[gridColumnsObj[i].id])) {
					this.datasource[gridColumnsObj[i].key] = dataJson[gridColumnsObj[i].id][cnt - 1];
					if ((gridColumnsObj[i].id.concat("desc")) in dataJson) {
						this.datasource[gridColumnsObj[i].key.concat("desc")] = dataJson[gridColumnsObj[i].id.concat("desc")][cnt - 1]
					}
				} else {
					this.datasource[gridColumnsObj[i].key] = "";
				}
				if (!isempty(this.datasource)) {
					this.datasource['key'] = cnt;
				}
			} catch (e) {
			}
		}
	}
}

export class ReactUpdateData {
	constructor(layoutIDObj, dataJson, objDetailSectionList) {
		Log4r.log("Alok RnD ReactUpdateData jsonBuilder.js constructor");
		this.FinalDataJson = {
			"screendata": []
		};
		// let dataJson = dataJson['dataJson'];
		this.screendata = {};
		this.formUpdateDataJson = [];
		this.gridUpdateDataJson = [];
		this.extraLayoutConfig = [];
		this.actualDataObjToConvert = {};
		this.defaultValueManagerMap = new Map();
		this.parseJson(layoutIDObj, dataJson['dataJson'], objDetailSectionList);
	}
	destroy() {
		Log4r.log("Alok RnD ReactUpdateData jsonBuilder.js destroy");
	}
	// parsing of datajson
	parseJson(layoutIDObj, dataJson, objDetailSectionList) {
		//Variables Declaration
		let formUpdateJson;
		let gridUpdateJson;
		let gridDataObj = "";
		let sectionDataObj = "";
		let type = "";
		this.getActualData(dataJson, Object.keys(layoutIDObj));

		dataJson = this.actualDataObjToConvert;
		if (!isempty(objDetailSectionList)) {
			this.defineExtraLayoutConfig(objDetailSectionList);
		}
		// LOOP TO CHECK REACTID PRESENT IN DATA JSON
		for (let gridOrSectionKey in layoutIDObj) {
			type = layoutIDObj[gridOrSectionKey];
			if (dataJson[gridOrSectionKey] != undefined) {
				// CHECK FOR TYPE AND PASS TO RESPECTIVE METHOD
				if (type == "GRID") {
					if (!isempty(dataJson[gridOrSectionKey])) {
						gridDataObj = dataJson[gridOrSectionKey][0];
					} else {
						gridDataObj = null;
					}
					gridUpdateJson = this.ReactUpdateGridData(gridOrSectionKey, gridDataObj);
					if (!isempty(gridUpdateJson)) {
						this.gridUpdateDataJson.push(gridUpdateJson);
					}
				}
				else {
					sectionDataObj = dataJson[gridOrSectionKey][0];
					formUpdateJson = this.ReactUpdateFormData(gridOrSectionKey, sectionDataObj);
					if (!isempty(formUpdateJson)) {
						this.formUpdateDataJson.push(formUpdateJson);
					}
				}
			} else {
				continue;
			}
		}
	}

	getActualData(input, forKeys) {
		//create object having only actual data against leaf section or grid id (Recusrion)
		if (Array.isArray(input)) {
			for (let i = 0; i < input.length; i++) {
				this.getActualData(input[i], forKeys);
			}
		} else if (typeof (input) == "object") {
			let keys = Object.keys(input);
			for (let i = 0; i < keys.length; i++) {
				if (forKeys.includes(keys[i])) {
					this.actualDataObjToConvert[keys[i]] = input[keys[i]];
				} else {
					this.getActualData(input[keys[i]], forKeys);
				}
			}
			keys = null;
		}
	}

	defineExtraLayoutConfig(objDetailSectionList) {
		let extraLayoutConfigList;
		for (let gridOrSectionID in objDetailSectionList) {
			if (objDetailSectionList[gridOrSectionID] !== undefined) {
				if (objDetailSectionList[gridOrSectionID] == true) {
					extraLayoutConfigList = this.ShowHide(gridOrSectionID);
					if (!isempty(extraLayoutConfigList)) {
						this.extraLayoutConfig.push(extraLayoutConfigList);
					}
					let extraLayoutConfigList = null;
				}
			}
		}
	}

	//METHOD GIVES FINAL UPDATED SCREENDATA JSON FOR REACT
	buildFinalUpdateJson(type) {
		if (!isempty(this.formUpdateDataJson)) {
			this.FinalDataJson.screendata.push.apply(this.FinalDataJson.screendata, this.formUpdateDataJson);
		}
		if (!isempty(this.gridUpdateDataJson)) {
			this.FinalDataJson.screendata.push.apply(this.FinalDataJson.screendata, this.gridUpdateDataJson)
		}
		if (!isempty(this.extraLayoutConfig)) {
			this.FinalDataJson.screendata.push.apply(this.FinalDataJson.screendata, this.extraLayoutConfig)
		}

		// Code to handle default Value case of conditional rule when data of the section/grid comes in subsequent data call
		try {
			// this.defaultValueManagerMap = null;
			this.defaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
			if (this.defaultValueManagerMap.size != 0) {
				if (type == "GETGRIDDATA") {
					let targetId = [];
					let valueAgainstKey = [];
					let sectionalIndex = "";
					let fieldSectionCombo = [];
					let counterAndDetailObject = {};
					let counterAndDetailArray = [];
					let tableAsSectionID = [];
					let columnId = [];
					let formValueDataSource = {};
					let formValueDataArray = {};
					for (let targetObject of this.defaultValueManagerMap) {
						targetId = targetObject[0];
						valueAgainstKey = targetObject[1];
						sectionalIndex = findSectionalIndex(targetId, this.FinalDataJson);
						if (!isempty(sectionalIndex)) {
							fieldSectionCombo = targetId.split(".");
							if (valueAgainstKey.objectFromTable) { // grid column is target
								counterAndDetailArray = [];
								tableAsSectionID = fieldSectionCombo[0];
								columnId = fieldSectionCombo[1];
								formValueDataSource = this.FinalDataJson.screendata[sectionalIndex].formData[0].data.DataSource;
								if (formValueDataSource.length > 0) {
									for (let i = 0; i < formValueDataSource.length; i++) {
										counterAndDetailObject = {};
										if (!isempty(formValueDataSource[i][columnId])) {
											counterAndDetailObject["originalValue"] = formValueDataSource[i][columnId];
										}
										else {
											counterAndDetailObject["originalValue"] = "";
										}
										counterAndDetailObject["totalCount"] = valueAgainstKey.totalCount;
										counterAndDetailObject["presentCount"] = valueAgainstKey.presentCount;
										counterAndDetailArray[i] = counterAndDetailObject;
									}
									this.defaultValueManagerMap.set(targetId, counterAndDetailArray);
								}
								else { // handling case when even second data call is not fetching grid details.
									this.defaultValueManagerMap.set(targetId, valueAgainstKey);
								}
							}
							else { // normal field is target
								counterAndDetailObject = valueAgainstKey;
								formValueDataArray = this.FinalDataJson.screendata[sectionalIndex].formData[0][fieldSectionCombo[1]].data;
								if (Array.isArray(formValueDataArray)) {
									if (!isempty(formValueDataArray[0])) {
										counterAndDetailObject["originalValue"] = formValueDataArray[0];
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
								}
								else {
									if (!isempty(formValueDataArray)) {
										counterAndDetailObject["originalValue"] = formValueDataArray;
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
								}
								this.defaultValueManagerMap.set(targetId, counterAndDetailObject);
							}
						}
						else {
							continue;
						}
					}
					targetId = null;
					valueAgainstKey = null;
					sectionalIndex = null;
					fieldSectionCombo = null;
					counterAndDetailObject = null;
					counterAndDetailArray = null;
					tableAsSectionID = null;
					columnId = null;
					formValueDataSource = null;
					formValueDataArray = null;
				}
				else if (type == "NEXTPAGEDATA") {
					let targetId = [];
					let valueAgainstKey = [];
					let existingDataSourceLength = "";
					let sectionalIndex = "";
					let fieldSectionCombo = "";
					let counterAndDetailArray = [];
					let tableAsSectionID = [];
					let columnId = [];
					let formValueDataSource = {};
					let counterAndDetailObject = {};
					for (let targetObject of this.defaultValueManagerMap) {
						targetId = targetObject[0];
						valueAgainstKey = targetObject[1];
						existingDataSourceLength = valueAgainstKey.length;
						sectionalIndex = findSectionalIndex(targetId, this.FinalDataJson);
						if (!isempty(sectionalIndex)) {
							fieldSectionCombo = targetId.split(".");
							counterAndDetailArray = [...valueAgainstKey];
							tableAsSectionID = fieldSectionCombo[0];
							columnId = fieldSectionCombo[1];
							formValueDataSource = this.FinalDataJson.screendata[sectionalIndex].formData[0].data.DataSource;
							if (formValueDataSource.length > 0) {
								for (let i = 0; i < formValueDataSource.length; i++) {
									counterAndDetailObject = {};
									if (!isempty(formValueDataSource[i][columnId])) {
										counterAndDetailObject["originalValue"] = formValueDataSource[i][columnId];
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
									counterAndDetailObject["totalCount"] = valueAgainstKey[0].totalCount;
									counterAndDetailObject["presentCount"] = 0;
									counterAndDetailArray[existingDataSourceLength] = counterAndDetailObject;
									existingDataSourceLength = existingDataSourceLength + 1;
								}
								this.defaultValueManagerMap.set(targetId, counterAndDetailArray);
							}
						}
						else {
							continue;
						}
					}
					targetId = null;
					valueAgainstKey = null;
					existingDataSourceLength = null;
					sectionalIndex = null;
					fieldSectionCombo = null;
					counterAndDetailArray = null;
					tableAsSectionID = null;
					columnId = null;
					formValueDataSource = null;
					counterAndDetailObject = null;
				}
				else if (type == "REFRESHDATA") {
					let targetId = [];
					let valueAgainstKey = [];
					let sectionalIndex = "";
					let fieldSectionCombo = "";
					let counterAndDetailArray = [];
					let tableAsSectionID = [];
					let columnId = [];
					let formValueDataSource = {};
					let counterAndDetailObject = {};
					let controlId = [];
					let formValueDataArray = {};
					for (let targetObject of this.defaultValueManagerMap) {
						targetId = targetObject[0];
						valueAgainstKey = targetObject[1];
						sectionalIndex = findSectionalIndex(targetId, this.FinalDataJson);
						if (!isempty(sectionalIndex)) {
							fieldSectionCombo = targetId.split(".");
							if (Array.isArray(valueAgainstKey)) { // grid column is target
								counterAndDetailArray = [];
								tableAsSectionID = fieldSectionCombo[0];
								columnId = fieldSectionCombo[1];
								formValueDataSource = this.FinalDataJson.screendata[sectionalIndex].formData[0].data.DataSource;
								if (formValueDataSource.length > 0) {
									for (let i = 0; i < formValueDataSource.length; i++) {
										counterAndDetailObject = {};
										if (!isempty(formValueDataSource[i][columnId])) {
											counterAndDetailObject["originalValue"] = formValueDataSource[i][columnId];
										}
										else {
											counterAndDetailObject["originalValue"] = "";
										}
										counterAndDetailObject["totalCount"] = valueAgainstKey[0].totalCount; // total count for all rows is same. hence taking the value from first row
										counterAndDetailObject["presentCount"] = 0; // Refreshing data should bring every calculation back to normal.
										counterAndDetailArray[i] = counterAndDetailObject;
									}
									this.defaultValueManagerMap.set(targetId, counterAndDetailArray);
								}
							}
							else { // normal field is target and total count will remain same as before.
								counterAndDetailObject = valueAgainstKey;
								controlId = fieldSectionCombo[1];
								formValueDataArray = this.FinalDataJson.screendata[sectionalIndex].formData[0][controlId].data;
								if (Array.isArray(formValueDataArray)) {
									if (!isempty(formValueDataArray[0])) {
										counterAndDetailObject["originalValue"] = formValueDataArray[0];
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
								}
								else {
									if (!isempty(formValueDataArray)) {
										counterAndDetailObject["originalValue"] = formValueDataArray;
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
								}
								counterAndDetailObject["presentCount"] = 0; // Refreshing data should bring every calculation back to normal.
								this.defaultValueManagerMap.set(targetId, counterAndDetailObject);
							}
						}
						else {
							continue;
						}
					}
					targetId = null;
					valueAgainstKey = null;
					sectionalIndex = null;
					fieldSectionCombo = null;
					counterAndDetailArray = null;
					tableAsSectionID = null;
					columnId = null;
					formValueDataSource = null;
					counterAndDetailObject = null;
					controlId = null;
					formValueDataArray = null;
				}
				GlobalHelper.globlevar['defaultValueManagerMap'] = null;
				GlobalHelper.globlevar['defaultValueManagerMap'] = this.defaultValueManagerMap;
			}
		}
		catch (e) {
			Log4r.error(e);
		}
		return this.FinalDataJson;
	}

	//METHOD gives List of Section to HIDE
	ShowHide(gridOrSectionID) {
		return {
			"sessionID": gridOrSectionID,
			"hidden": "true"
		}
	}

	//UPDATE SECTION DATA
	ReactUpdateFormData(layoutid, dataJson) {
		//check for undefined or null before performing logic
		if (isempty(dataJson)) {
			return {
				"sessionID": layoutid,
				"formData": []
			};
		}
		//Variables Declaration
		let formDataFields = {};
		let flag = false;
		let ctlsJson = {};
		// CONVERTS THE DATASOURCE ACCORDING TO REACT {sessionID: "3c81589b11454229804593ef8cdb0a65",formData: {}}
		if (dataJson.data != undefined) {
			ctlsJson = dataJson.data;
		}
		if (isempty(ctlsJson)) {
			return {};
		}
		let id;
		for (let key in ctlsJson) {
			flag = false;
			id = key.substring(0, 32);
			for (let InnerKey in formDataFields) {
				if (InnerKey == id) {
					if (key.substring(32, 36) == "desc" && key.length == 36) {
						formDataFields[InnerKey].desc = ctlsJson[key];
						flag = true;
						break;
					}
				}
			}
			if (flag == true) {
				continue;
			}
			let formDataField = {};
			formDataField["style"] = {};
			formDataField.style["classname"] = '';
			formDataField["data"] = ctlsJson[key];
			formDataFields[key] = formDataField;
			// formDataField = null;
		}
		let formDataFieldsObj = formDataFields;
		// formDataFields = null;
		return {
			"sessionID": layoutid,
			"formData": [formDataFieldsObj]
		};
	}

	//UPDATE GRID DATA
	ReactUpdateGridData(layoutid, dataJson) {
		//Variables Declaration
		let datasource = {};
		let cnt = 0;
		let tempDataDource = [];
		let CtlsJson = null;
		let parentPKMap = {};
		let moreRows = "false";
		let totalRows = 0;
		let flag; let count;
		if (isempty(dataJson)) {
			tempDataDource = [];
		}
		else {
			if (dataJson.data != undefined) {
				CtlsJson = dataJson.data;
			}
			// CONVERTS THE DATASOURCE ACCORDING TO REACT
			for (let i = 0; i < CtlsJson[Object.keys(CtlsJson)[0]].length; i++) {
				if (flag == true) {
					cnt++;
				}
				datasource['key'] = cnt + 1;
				for (let Key in CtlsJson) {
					count = CtlsJson[Key].length;
					datasource[Key] = CtlsJson[Key][cnt];
					flag = true;
				}
				if (cnt == count) {
					cnt = 0;
					break;
				}
				tempDataDource.push(datasource);
				datasource = {};
			}
			// PUSH THE DATA IN REQUIRED STRUCTURE I.E. SCREENDATA :{ "sessionID": "7bf5202a81ff4ef39e4c3ed2f5740e62" ,"formData": []}
			if (!isempty(tempDataDource)) {
				if (dataJson.moreRows !== undefined && !isempty(dataJson.moreRows)) {
					moreRows = JSON.stringify(dataJson.moreRows);
				}
				if (dataJson.totalRows !== undefined && !isempty(dataJson.moreRows)) {
					totalRows = dataJson.totalRows;
				}
				if (dataJson.parentPK !== undefined && !isempty(dataJson.parentPK)) {
					parentPKMap = dataJson.parentPK;
				}
			}
		}

		this.screendata = {
			"sessionID": layoutid,
			"formData": [{
				"data": {
					"DataSource": tempDataDource,
					"moreRows": moreRows,
					"totalRows": totalRows,
					"parentPK": parentPKMap
				}
			}]
		};
		datasource = null;
		tempDataDource = null;
		CtlsJson = null;
		parentPKMap = null;

		return this.screendata;
	}
}

export function createDefaultValueMap(reactJson, targetToRulesMapper) {
	let defaultValueManagerMap = new Map();
	try {
		if (targetToRulesMapper.size != 0) {
			for (let targetObject of targetToRulesMapper) {
				let targetId = targetObject[0];
				let valueArray = targetObject[1]; // array of objects where each object corresponds to ruleId and associated actionId
				for (let i = 0; i < valueArray.length; i++) {
					let ruleActionObject = valueArray[i];
					let ruleId = ruleActionObject.ruleId;
					let actionId = ruleActionObject.actionId;
					let actionName = reactJson["rules"][ruleId]["ruleDetails"][actionId]["action"];
					if (actionName === "DEFAULTVALUE") {
						if ((defaultValueManagerMap.has(targetId))) {
							let counterAndDetail = defaultValueManagerMap.get(targetId);
							if (checkIfFieldIsAColumn(targetId, reactJson)) {
								if (Array.isArray(counterAndDetail)) {
									if (counterAndDetail.length > 0) {
										for (let j = 0; j < counterAndDetail.length; j++) {
											counterAndDetail[j]["totalCount"] = counterAndDetail[j]["totalCount"] + 1;
										}
									}
								}
								else {
									counterAndDetail["totalCount"] = counterAndDetail["totalCount"] + 1;
								}
							}
							else {
								counterAndDetail["totalCount"] = counterAndDetail["totalCount"] + 1;
							}
						}
						else {
							let sectionalIndex = findSectionalIndex(targetId, reactJson);
							let fieldSectionCombo = targetId.split(".");
							if (checkIfFieldIsAColumn(targetId, reactJson)) {
								let counterAndDetail = [];
								let tableAsSectionID = fieldSectionCombo[0];
								let columnId = fieldSectionCombo[1];
								let formValueDataSource = reactJson.screendata[sectionalIndex].formData[0][tableAsSectionID].data.DataSource;
								if (formValueDataSource.length > 0) { // this is the case when grid exists and dataSource initially has atleast one row.
									for (let k = 0; k < formValueDataSource.length; k++) {
										let counterAndDetailObject = {};
										if (!isempty(formValueDataSource[k][columnId])) {
											counterAndDetailObject["originalValue"] = formValueDataSource[k][columnId];
										}
										else {
											counterAndDetailObject["originalValue"] = "";
										}
										counterAndDetailObject["totalCount"] = 1;
										counterAndDetailObject["presentCount"] = 0;
										counterAndDetail[k] = counterAndDetailObject;
									}
								}
								else { // this is the case when grid exists but there is no dataSource initially.  'objectFromTable' property is just to handle GRIDFETCHDATA CALL(i.e. subsequent data fetch call to fill table datasource as in summary view screen) OR the case when grid is a simple grid but initial datasource is empty
									counterAndDetail = {};
									counterAndDetail["totalCount"] = 1;
									counterAndDetail["presentCount"] = 0;
									counterAndDetail["objectFromTable"] = true;
								}
								defaultValueManagerMap.set(targetId, counterAndDetail);
							}
							else {
								let counterAndDetailObject = {};
								let controlId = fieldSectionCombo[1];
								let formValueDataArray = reactJson.screendata[sectionalIndex].formData[0][controlId].data;
								if (Array.isArray(formValueDataArray)) {
									if (!isempty(formValueDataArray[0])) {
										counterAndDetailObject["originalValue"] = formValueDataArray[0];
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
								}
								else {
									if (!isempty(formValueDataArray)) {
										counterAndDetailObject["originalValue"] = formValueDataArray;
									}
									else {
										counterAndDetailObject["originalValue"] = "";
									}
								}
								counterAndDetailObject["totalCount"] = 1;
								counterAndDetailObject["presentCount"] = 0;
								counterAndDetailObject["objectFromTable"] = false;
								defaultValueManagerMap.set(targetId, counterAndDetailObject);
							}
						}
					}
				}
			}
		}
	}
	catch (e) {
		Log4r.error(e);
	}
	return defaultValueManagerMap;
}
