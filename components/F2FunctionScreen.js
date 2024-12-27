
import React, { Component, Suspense, lazy } from 'react'
import file from './defaultScreenJson';
import { redirectToList, getDefaultLayoutId, getServerMode, fetchData, xpathFactory, removeButton, makeFunctionReadOnly } from '../form/xPathDataStore';
import { generateQueryStr, generateQueryStrFuncationbaselayout } from '../form/saveutils';
import { checkBrowserType, validateControlLength } from '../form/utils';
import { isempty } from '../jsonconverter/jsonBuilder';
import { displayCustomComponent, splitComponentModel } from '../ModalComponent/ModalBox';
import { getSTData } from '../services/CommonSecurity';
import { Modal, Table } from 'antd';
import _ from 'lodash';
import Palette from '../palette/jsCssFiles/Palette';
import Validation from './validation';
import { Provider } from 'react-redux';
import store from '../services/Store';
import HotKeyComponent from '../HotKeyComponent/HotKeyComponent';
import { I18NMessage } from '../i18n/errorMess/i18nMessage';
import request from 'superagent';
import { Switch, Route, Redirect } from 'react-router-dom';
import GlobalHelper from './GlobalHelper';
import ErrorHandler from '../form/ErrorHandler';
import $ from 'jquery';
import { Layout, Col, Row, Avatar, Tooltip, Popover, Badge, Menu, Icon, Alert, Spin, message, Button, Switch as ButtonSwitch } from 'antd'; //Sprint 9 (Task 60): Header template testing integration spin element
import Model from '../form/Model';
import { displayMessageBox, showF2Component } from '../ModalComponent/ModalBox';
import { Scrollbars } from 'react-custom-scrollbars';
import { uiNextButtonHandler } from '../form/NextButtonHandler';
import { uiPreviousButtonHandler } from '../form/PreviousButtonHandler';
import { onLoadUtil } from '../util/onLoadUtil';
import { onPreSaveUtil } from '../util/onPreSaveUtil';
import {onPostSaveUtil} from '../util/onPostSaveUtil';
import { postFetchEventHandler } from '../customcollection/screenOnLoadEventHandler';
import { customcollectionutils } from '../customcollection/customcollectionutils';
import PerfectScrollbar from 'perfect-scrollbar';
import { redirectToAceMenus } from '../form/logoff';
import { custutils } from '../form/customutils';
import { RuleExecutionUtility } from '../util/RuleExecutionUtility';
import 'babel-polyfill';
import { ReactJsonBuilder, createDefaultValueMap } from '../jsonconverter/jsonBuilder.js';
import { ReactUpdateData } from '../jsonconverter/jsonBuilder.js';
import { preFetch } from '../form/fetchutils';
import { preSave, postSave } from '../form/saveutils';
import ParentPKComponentData from "../form/ParentPKComponentData";
import { loadScript } from '../services/loadJavaScript.js';
import SplitScreenMainLayout from '../SplitScreenLayout/SplitScreenMainLayout';
import Log4r from '../util/Log4r';

const GridWorkList = lazy(() => import('./table/GridWorkList'));
const ScreenMeta = lazy(() => import('./screen/ScreenMeta'));
const UIScreen = lazy(() => import('./UIScreen'));

var styles = require('./css/MainLayout/MainLayoutDefault.css');
var stylesfu = require('./css/FollowUpDefault.css');
var stylesf = require('./css/Foll1Default.css');
const File1 = require('./demojson.json');
const { Header, Content, Sider, Footer } = Layout
const FA = require('react-fontawesome');
var nval = undefined;
var responsestatus = undefined;
var gridsavestatus = undefined;
var closepath = undefined;
var stopcount = 0;
var demoright = false;
const text = (
  <div style={{ minHeight: '30px', maxHeight: '30px', height: '100%', width: '250px' }}>
    <Row type="flex" justify="start">
      <Col span={14}>
        <div className={stylesf.title}>Validation  Messages</div>
      </Col>
      <Col span={4}>
        <div className={stylesf.Ava}><Avatar style={{ backgroundColor: "#BDCADB", color: "black" }} size="small">03</Avatar></div>
      </Col>
      <Col span={4} className={stylesf.col}>
        <div className={stylesf.fa}><FA name={"times"} ></FA></div>
      </Col>
    </Row>
  </div>
);
var funIconIndex = undefined;
var a = 0;

var right = 0;
var left = 0;
var countLeft = 0;
var countRightu = 0;
var countArrow = 0;
var Arrow = 0;
var names1 = file.name;
var names = file.name;
var nameOfTheme;
var backuperrjson = [];
var counter = 0;
var ObjFrPartialScrnRendr = [];
var sesHeadCount = 0;
var arrayOfRightSider = {};
var allScrnErrObj;
var tempJsonEditPropertyFlag = [];
var temp = false;
var data = [];
var size = 0;
var IconData;// = MyJason1.formheaderdata.formHeaderBookmarks;

var holdbasicdata;
var heighttable = "";
var widthTable = "";

var nval = undefined;
var optionsMapper = new Map();
var savetrigger = "no";
var preData = new Map();
var prejsonData = new Map();
var preCount = 0;
var selectedCodes = [];
var Rightsidermenu = [];
var topvalue = "";
var isfetchlinkclicked = false;
//Sprint 11: Task 83 No Hedaer Configuration Handling :Initialized to empty string because on first time it was showing string for few seconds.
var custname = "";
var custvalue = "";
//Sprint 9 (Task 60):Added variables to hold object data of header(ajax data)
var holdImageHeader = {};
var holdDataWithCap = {};
var holdDataWithoutCap = {};
var holdAvatarData = {};
var profilePictureFlag = false;
var TimeLineView = false;
var TimeLineWidth = '0px';
var timelineScreen = file.name;
var grayScaleTid = '';

var CardLinkFetch = false;
GlobalHelper.globlevar['timelineScreen'] = new Array();
var compHeadCounter = 0;
GlobalHelper.globlevar['toControlUpdateErrCheck'] = true;
var temlabel = "";

var shouldCloseBeCalled = false;

let onlyCloseButtonViews = null;
let showOnlyCloseButton = null;
let CloseButtonpalette = [];
let TimelineHistorypalatte = [];
let defaultFunctionId = "";
var screenLoadStartTime = "";
var screenPostSaveTime = "";
var screenLoadAndPostSaveFlag = "onload";
var groupidFAVCllicked = false;
var calledFromSubmit = false;
var buttonIdOnsave = "";
var activeMenu = undefined;
var historyFunctionFlag = false;//Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.
let cardHeaderInfo = [];

var pkvalue = undefined;
var layoutID = undefined;
var datajson = undefined;
var ParentPK = undefined;
var API_ROOT = GlobalHelper.globlevar.contextpathajax;
var file_name = 'data.json';
var jsonObjtemplet = undefined;
var jsonObjdata = undefined;
var url = API_ROOT;
var payload;
let functionScreenDataUrl = undefined;

class F2FunctionScreen extends Component {
  constructor(props) {
    super(props)
    this.holdNamess;
    this.namess = {};
    this.customHeaderFunctionsToRender = this.props.customHeaderFunctionsToRender;
    this.renderCustomHeaderFunctions = this.renderCustomHeaderFunctions.bind(this);
    this.customHeaderFunctionsExists = null;
    this.customHeaderFunctionIndex = this.props.customHeaderFunctionIndex;
    this.addTabScreen = [];
    this.addTabindex = 0;
    this.ellipsisFlag = props.ellipsisFlag;
    this.F2FunctionNames = undefined;
    this.addRowToGridTriggered = "No";
    this.hybridCount = 0;
    this.currentChangedForm = (this.props.outnames != null && this.props.outnames['extradata'] != null) ? this.props.outnames['extradata']['sessionId'] : "";
    this.firstRenderScreen = this.props.outnames['firstRenderScreenData'];
    this.firstTimeCapture = false;
    GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
    this.formSubTitle = "Screen Subtitle";
    this.headername = "Screen Title";
    this.containerDiv = [];
    this.isF2PopUpCalled = undefined;
    this.replaceSectionalButtonsWithPaletteButtons = this.replaceSectionalButtonsWithPaletteButtons.bind(this);
    this.f2CallBackFuncOnSectionalPopupClose = this.f2CallBackFuncOnSectionalPopupClose.bind(this);
    this.replaceCurrentGridDataWithPopupSectionFormdata = this.replaceCurrentGridDataWithPopupSectionFormdata.bind(this);
    this.screenMetaRef = React.createRef();
    cardHeaderInfo = this.props.cardHeaderInfo ? this.props.cardHeaderInfo : [];
    if(GlobalHelper.globlevar.closepath != undefined && GlobalHelper.globlevar.closepath == true){
      GlobalHelper.globlevar.closepath= false;
      closepath = undefined;
    }
    if (GlobalHelper.globlevar['myFunctionClicked'] === true) {
      GlobalHelper.globlevar['myFunctionClicked'] = undefined;
      cardHeaderInfo = [];
    }
    this.createHistoryTimelineView = false;
    this.SplitScreenMainLayout =  false;
	  this.isPopSectionClearClicked = { "isClicked": false };
    this.revertIsPopSectionClearClikedFlag = this.revertIsPopSectionClearClikedFlag.bind(this);
    this.createHybridView = false;
    this.refreshOnSave = this.props.refreshOnSave;
    if (this.props.outnames) {
      this.F2FunctionNames = this.props.outnames;
      if (this.props.outnames.data.length > 0)
        this.namess = this.props.outnames.data[0].name;

      if (this.props.functionMode === "B") {
        try {
          xpathFactory(this.namess)
          let utilObject = new onLoadUtil();
          let method = "onloadcollectionutil";
          utilObject[method](this.namess);
        }
        catch (e) {
          Log4r.error(e);
        }
      }

    }

    if (this.props.orientationType == "popup") {
      ErrorHandler.clear();
    }
    if (this.props.orientationType == "popup" && this.props.popupFunctionId) {
      if (GlobalHelper.holdFunGroupData != null && GlobalHelper.holdFunGroupData != "") {
        GlobalHelper.holdFunGroupData.forEach((value, key, map) => {
          for (let i = 0; i < value.content.length; i++) {
            if (value.content[i].id == this.props.popupFunctionId) {
              if (value.content[i].refreshOnSave === "Y") {
                this.refreshOnSave = true;
              }
              break;
            }
          }
        })
      }

      let calculatedPkValues = (GlobalHelper.globlevar.calculatedPkValuesForSave ? GlobalHelper.globlevar.calculatedPkValuesForSave : []);
      var functionid = "";
      var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      var contextencodevalue = contextprimarykeyvalue[0] + "=" + encodeURIComponent(contextprimarykeyvalue[1]);
      let contextKeys = "";

      if (this.props.customContextKeys && this.props.customContextKeys.length !== 0) {
        contextKeys = this.props.customContextKeys;
      } else {
        contextKeys = GlobalHelper.contextPKValues;
      }

      url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
      let basedOn = GlobalHelper.functionListMap.get(this.props.popupFunctionId) && GlobalHelper.functionListMap.get(this.props.popupFunctionId).basedOn;

      if (calculatedPkValues != undefined && calculatedPkValues.length !== 0 && basedOn != "BASE") {
        if (calculatedPkValues[0].contextPrimaryKyes.includes("|")) {
          // Encoding URL __CPK values
          let calcontextprimarykeyvalue = calculatedPkValues[0].contextPrimaryKyes.split('=');
          let calcontextencodevalue = calcontextprimarykeyvalue[0] + "=" + encodeURIComponent(calcontextprimarykeyvalue[1]);
          url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calcontextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
        } else {
          url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
        }
      }
      else {
        if (this.props.customContextKeys && this.props.customContextKeys.length !== 0) {
          url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&" + this.props.customContextKeys + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&functionMode=F&"
        } else {
          url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&" + contextKeys + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
        }
        if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] === undefined) {
          url = url + "&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&";
        }
      }
      if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
        var splitdata = GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'].split('&');
        for (let i = 1; i < splitdata.length; i++) {
          var cpkvalue = splitdata[i].split('=');
          if (cpkvalue[0] == "__cpl") {
            url = url + "&" + splitdata[i] + "&";
          }
        }
      }
      functionid = this.props.popupFunctionId;
      var requestData = {
        '__functionId': functionid,
        'token': 'indus'
      };
      layoutID = this.props.popupFunctionId;
      if (preFetch()) {
        let LAYOUTTOPICON_GetTemplateUrl = url.split("?")[1];
        let _stdata_LAYOUTTOPICON_GetTemplateUrl = getSTData("/" + GlobalHelper.menuContext + "/", LAYOUTTOPICON_GetTemplateUrl);
        var templetURL = url;
        request
          .post(url + "layouttopicon")
          .query({ _SID_: (_stdata_LAYOUTTOPICON_GetTemplateUrl.SID + _stdata_LAYOUTTOPICON_GetTemplateUrl.SINT) })
          .query({ _ADF_: "" })
          .send(JSON.stringify(requestData))
          .send({
            '__functionId': functionid,
            'token': 'indus'
          })
          .set('X-API-Key', functionid)
          .set('Accept', 'application/xml')
          .query({
            __functionId: functionid
          })
          .query({
            access: GlobalHelper.functionAccessMap.get(this.props.popupFunctionId)
          })
          .end((err, res) => {
            if (err) {
              const names = JSON.parse('["/reactapp/app/index"]');
            }
            var jsonText = res.text;
            let jsonObj = null
            try {
              jsonObj = JSON.parse(jsonText);
            } catch (e) {
            }

            let parentnode = new Model().handleDataChange(jsonObj);
            GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonObj;
            jsonObjtemplet = jsonObj.JSON_DATA;
            let buttonpalettes = jsonObj.BUTTON_JSON;
            let quickbuttons = jsonObj.QUICK_BUTTON_JSON;
            let ACCESS_MODE = jsonObj.ACCESS_MODE;
            let templist = {};
            templist[GlobalHelper.globlevar.dependablelayoutid] = jsonObj.DTL_SEC_LIST;

            if (GlobalHelper.globlevar.hybridOneThirdCardsCount.length === 0) {
              GlobalHelper.globlevar.templetObject = jsonObjtemplet;
            }
            if (res.text !== undefined) {

              let jsurl = '/' + GlobalHelper.menuContext + '/secure/js/customcollectionutils1.js';

              let jsScripts = jsonObj.JSSCRIPTS;
              loadScript("/FrameworkUtility/customGenUtils.js");

              if (jsScripts != null)
                for (let jsscriptIndex = 0; jsscriptIndex < jsScripts.length; jsscriptIndex++) {
                  loadScript("/" + jsScripts[jsscriptIndex].path);
                }

              var functioniddata = "";
              url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"

              functioniddata = this.props.popupFunctionId;
              let basedOndata = GlobalHelper.functionListMap.get(this.props.popupFunctionId) && GlobalHelper.functionListMap.get(this.props.popupFunctionId).basedOn;
              if (calculatedPkValues != undefined && calculatedPkValues.length !== 0 && basedOndata != "BASE") {
                if (calculatedPkValues[0].contextPrimaryKyes.includes("|")) {
                  let calcontextprimarykeyvalue = calculatedPkValues[0].contextPrimaryKyes.split('=');
                  let calcontextencodevalue = calcontextprimarykeyvalue[0] + "=" + encodeURIComponent(calcontextprimarykeyvalue[1]);
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calcontextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
                } else {
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
                }
              }
              else {
                if (this.props.customContextKeys && this.props.customContextKeys.length !== 0) {
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&" + this.props.customContextKeys + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&functionMode=F&"
                } else {
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&" + contextKeys + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
                }
                if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] === undefined) {
                  url = url + "&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&";
                }
              }
              if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
                var splitdata = GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'].split('&');
                for (let i = 1; i < splitdata.length; i++) {
                  var cpkvalue = splitdata[i].split('=');
                  if (cpkvalue[0] == "__cpl") {
                    url = url + "&" + splitdata[i] + "&";
                  }
                }
              }
              let LAYOUTTOPICON_GetDataUrl = url.split("?")[1];
              let _stdata_LAYOUTTOPICON_GetDataUrl = getSTData("/" + GlobalHelper.menuContext + "/", LAYOUTTOPICON_GetDataUrl);
              if (jsonObj.screenBasedOn !== "null" && jsonObj.screenBasedOn === "CUSTOM_JSON") {
                url = "/" + jsonObj.scrJSONPath;
                var dataURL = url;
                request
                  .get(url)
                  .query({ _SID_: (_stdata_LAYOUTTOPICON_GetDataUrl.SID + _stdata_LAYOUTTOPICON_GetDataUrl.SINT) })
                  .query({ _ADF_: "" })
                  .send(JSON.stringify(requestData)) // sends a JSON post body
                  .send({
                    'linkoption': functioniddata,
                    'token': 'indus'
                  })
                  .set('X-API-Key', functioniddata)
                  .query({
                    __functionId: functioniddata
                  })
                  .query({
                    access: GlobalHelper.functionAccessMap.get(functioniddata)
                  })
                  .set('Accept', 'application/xml')
                  .end((err, res) => {
                    if (err) {
                    Log4r.log('data-service err: call', err);
                    }
                    let jsonTxt22;
                    var jsonText = res.text;
                    let succFlag = true;
                    if (res.text !== "" && res.text !== undefined && res.text !== null) {
                      let tempJson = JSON.parse(res.text);
                      let newErrJson = {};
                      if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
                        let errjsn = tempJson.__f2_messages__;
                        for (var i = 0; i < errjsn.length; i++) {
                          if (errjsn[i][0] == "E") {
                            succFlag = false;
                            break;
                          }
                          //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                          if (errjsn[i][0] == "D") {
                            let dialogTitle = "Dialog Box";
                            if (!isempty(errjsn[i][4])) {
                              dialogTitle = errjsn[i][4];
                            }
                            displayMessageBox(dialogTitle, errjsn[i][1], "I", null)
                            break;
                          }//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                        }
                        newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
                      }
                      newErrJson['SuccessFlag'] = succFlag;
                      newErrJson['SuccessFlagReRender'] = true;
                      
                        jsonTxt22 = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
                    }
                    let jsonObj = null
                    try {
                      jsonObj = JSON.parse(jsonText);
                    }
                    catch (e) {
                      Log4r.error(e);
                    }
                    try {
                      jsonObjdata = jsonObj.JSON_DATA;
                    }
                    catch (e) {
                      Log4r.error(e);
                    }
                    // to storequerystring in all request from getdatacall and temp basis
                    //ParentPK= new ParentPKComponentData().getParentQueryString(jsonObjtemplet,jsonObjdata);
                    //let names = new ReactJsonBuilder(jsonObjtemplet, this.props.popupFunctionId, jsonObjdata).buildReactJson();
                    let names = jsonObj.name;
                    var jsonTxt = JSON.stringify(names);

                    jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": " + jsonTxt22 + ",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
                    names = JSON.parse(jsonTxt).name;
                    try {
                      names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
                      names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
                      names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
                      GlobalHelper.globlevar['ACCESS_MODE'] = ACCESS_MODE;
                      names.data[0].name['DTL_SEC_LIST'] = templist;
                      names.data[0].name['popupFunctionContextKeys'] = this.props.customContextKeys;
                      names.data[0].name['getTempUrl'] = templetURL;
                      names.data[0].name['getData'] = dataURL;
                    } catch (e) {
                      Log4r.log(e);
                    }

                    /****** REMOVING PALETTE BUTTONS FOR POPUP SCREENS ******/
                    let buttonsToBeRemoved = ['previous', 'saveandnext', 'next', 'saveandclose', 'close', 'submit'];

                    names.data[0].name.ButtonPalette[0].uiSchema[0].children.map((button, buttonIndex) => {
                      if (buttonsToBeRemoved.includes(button.children.fieldPath)) {
                        button.children.widget = "hidden";
                      }
                    });

                    if (names && Array.isArray(names.data) && names.data[0] && names.data[0].name) {
                      //let names = this.namess;
                      if (Array.isArray(names.data[0].name.screendata)) {
                        for (var i = 0; i < names.data[0].name.screendata.length; i++) {
                          if (Array.isArray(names.data[0].name.screendata[i].uiSchema[0].children)) {
                            let dummyErrJson = {};
                            let toCheckChang = {};
                            for (var j = 0; j < names.data[0].name.screendata[i].uiSchema[0].children.length; j++) {
                              let eachContl = names.data[0].name.screendata[i].uiSchema[0].children[j];
                              if (eachContl) {
                                if (eachContl.children.widget == "table") {
                                  names.data[0].name.screendata[i]['forTableSec'] = true;
                                  let holdForChngObj = {};
                                  let tableId = eachContl.children.fieldPath;
                                  let tmpDataSrc = names.data[0].name.screendata[i].formData[0][tableId].data.DataSource;
                                  names.data[0].name.screendata[i].formData[0][tableId].data.Columns.map((colItem, colIndex) => {
                                    let colId = colItem.dataIndex;
                                    holdForChngObj[colId] = false;
                                  })
                                  for (var k = 0; k < tmpDataSrc.length; k++) {
                                    tmpDataSrc[k]["holdForChngObj"] = JSON.parse(JSON.stringify(holdForChngObj));
                                    let arrkeys = Object.keys(tmpDataSrc[k]);
                                    let insKsy;
                                    arrkeys.map((kItm, kIndx) => { // NOSONAR: javascript:S2201
                                      insKsy = kItm + (k + 1) + "";
                                      dummyErrJson[insKsy] = undefined;
                                    })
                                  }
                                }
                                else {
                                  names.data[0].name.screendata[i]['forTableSec'] = false;
                                  dummyErrJson[eachContl.children.fieldPath] = undefined;
                                  toCheckChang[eachContl.children.fieldPath] = false;
                                }
                              }
                            }
                            names.data[0].name.screendata[i]['dummyErrJson'] = dummyErrJson;
                            names.data[0].name.screendata[i]['toCheckChang'] = toCheckChang;
                          }
                        }
                      }
                    }
                    this.F2FunctionNames = names;
                    GlobalHelper.globlevar["onloadPop"] = true;
                    GlobalHelper.globlevar['firstRenderScreen'] = true;
                    let foundNames = false;
                    GlobalHelper.holdFunGroupData ? GlobalHelper.holdFunGroupData.forEach((value, key, map) => {
                      if (foundNames === false) {
                        for (let i = 0; i < value.content.length; i++) {
                          if (value.content[i].id == this.props.popupFunctionId) {
                            this.headername = value.content[i].groupds;
                            this.formSubTitle = value.content[i].desc;
                            foundNames = true;
                            break;
                          }
                        }
                      } else {
                        return;
                      }

                    }) : null

                    if (foundNames === false) {
                      // This section of code is execte at the time of redirect function or popup function in case of link clicked of section/grid.
                      GlobalHelper.holdFunGroupData ? GlobalHelper.functionGroupData.formHeaderBookmarks.forEach((value, key, map) => {
                        for (let i = 0; i < value.content.length; i++) {
                          if (value.content[i].id == this.props.popupFunctionId) {
                            this.headername = value.content[i].groupds;
                            this.formSubTitle = value.content[i].desc;
                            foundNames = true;
                            break;
                          }
                        }
                      }) : null
                    }
                    this.forceUpdate();
                  });
              }
              else {
                dataURL = url;
                request
                  .post(url + "layouttopicondata")
                  .query({ _SID_: (_stdata_LAYOUTTOPICON_GetDataUrl.SID + _stdata_LAYOUTTOPICON_GetDataUrl.SINT) })
                  .query({ _ADF_: "" })
                  .send(JSON.stringify(requestData)) // sends a JSON post body
                  .send({
                    'linkoption': functioniddata,
                    'token': 'indus'
                  })
                  .set('X-API-Key', functioniddata)
                  .query({
                    __functionId: functioniddata
                  })
                  .query({
                    access: GlobalHelper.functionAccessMap.get(functioniddata)
                  })
                  .set('Accept', 'application/xml')
                  .end((err, res) => {
                    if (err) {
                      Log4r.log('data-service err: call', err);
                    }
                    let jsonTxt22;
                    var jsonText = res.text;
                    let succFlag = true;
                    if (res.text !== "" && res.text !== undefined && res.text !== null) {
                      let tempJson = JSON.parse(res.text);
                      let newErrJson = {};
                      if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
                        let errjsn = tempJson.__f2_messages__;
                        for (var i = 0; i < errjsn.length; i++) {
                          if (errjsn[i][0] == "E") {
                            succFlag = false;
                            break;
                          }
                          //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                          if (errjsn[i][0] == "D") {
                            let dialogTitle = "Dialog Box";
                            if (!isempty(errjsn[i][4])) {
                              dialogTitle = errjsn[i][4];
                            }
                            displayMessageBox(dialogTitle, errjsn[i][1], "I", null)
                            break;
                          }//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                        }
                        newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
                      }
                      newErrJson['SuccessFlag'] = succFlag;
                      newErrJson['SuccessFlagReRender'] = true;
                      if (succFlag) {
                        jsonTxt22 = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
                      }
                      else {
                        jsonTxt22 = JSON.stringify(newErrJson);
                      }
                    }
                    let jsonObj = null
                    try {
                      jsonObj = JSON.parse(jsonText);
                    }
                    catch (e) {
                      Log4r.error(e);
                    }
                    try {
                      jsonObjdata = jsonObj.JSON_DATA;
                    }
                    catch (e) {
                      Log4r.error(e);
                    }
                    // to storequerystring in all request from getdatacall and temp basis
                    ParentPK = new ParentPKComponentData().getParentQueryString(jsonObjtemplet, jsonObjdata);
                    let names = new ReactJsonBuilder(jsonObjtemplet, this.props.popupFunctionId, jsonObjdata).buildReactJson();

                    var jsonTxt = JSON.stringify(names);
                    jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": " + jsonTxt22 + ",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
                    names = JSON.parse(jsonTxt).name;
                    try {
                      names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
                      names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
                      names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
                      GlobalHelper.globlevar['ACCESS_MODE'] = ACCESS_MODE;
                      names.data[0].name['DTL_SEC_LIST'] = templist;
                      names.data[0].name['popupFunctionContextKeys'] = this.props.customContextKeys;
                      names.data[0].name['getTempUrl'] = templetURL;
                      names.data[0].name['getData'] = dataURL;
                    } catch (e) {
                      Log4r.log(e);
                    }

                    /****** REMOVING PALETTE BUTTONS FOR POPUP SCREENS ******/
                    let buttonsToBeRemoved = ['previous', 'saveandnext', 'next', 'saveandclose', 'close', 'submit'];

                    names.data[0].name.ButtonPalette[0].uiSchema[0].children.map((button, buttonIndex) => {
                      if (buttonsToBeRemoved.includes(button.children.fieldPath)) {
                        button.children.widget = "hidden";
                      }
                    });

                    if (names && Array.isArray(names.data) && names.data[0] && names.data[0].name) {
                      //let names = this.namess;
                      if (Array.isArray(names.data[0].name.screendata)) {
                        for (var i = 0; i < names.data[0].name.screendata.length; i++) {
                          if (Array.isArray(names.data[0].name.screendata[i].uiSchema[0].children)) {
                            let dummyErrJson = {};
                            let toCheckChang = {};
                            for (var j = 0; j < names.data[0].name.screendata[i].uiSchema[0].children.length; j++) {
                              let eachContl = names.data[0].name.screendata[i].uiSchema[0].children[j];
                              if (eachContl) {
                                if (eachContl.children.widget == "table") {
                                  names.data[0].name.screendata[i]['forTableSec'] = true;
                                  let holdForChngObj = {};
                                  let tableId = eachContl.children.fieldPath;
                                  let tmpDataSrc = names.data[0].name.screendata[i].formData[0][tableId].data.DataSource;
                                  names.data[0].name.screendata[i].formData[0][tableId].data.Columns.map((colItem, colIndex) => {
                                    let colId = colItem.dataIndex;
                                    holdForChngObj[colId] = false;
                                  })
                                  for (var k = 0; k < tmpDataSrc.length; k++) {
                                    tmpDataSrc[k]["holdForChngObj"] = JSON.parse(JSON.stringify(holdForChngObj));
                                    let arrkeys = Object.keys(tmpDataSrc[k]);
                                    let insKsy;
                                    arrkeys.map((kItm, kIndx) => {    // NOSONAR: javascript:S2201
                                      insKsy = kItm + (k + 1) + "";
                                      dummyErrJson[insKsy] = undefined;
                                    })
                                  }
                                }
                                else {
                                  names.data[0].name.screendata[i]['forTableSec'] = false;
                                  dummyErrJson[eachContl.children.fieldPath] = undefined;
                                  toCheckChang[eachContl.children.fieldPath] = false;
                                }
                              }
                            }
                            names.data[0].name.screendata[i]['dummyErrJson'] = dummyErrJson;
                            names.data[0].name.screendata[i]['toCheckChang'] = toCheckChang;
                          }
                        }
                      }
                    }
                    if (jsScripts != null) {
                      names.data[0].name['scriptsToLoad'] = jsScripts;
                    }
                    this.F2FunctionNames = names;
                    this.namess = this.F2FunctionNames.data[0].name;
                    this.props.outnames.data[0].name = this.namess;
                    GlobalHelper.globlevar["onloadPop"] = true;
                    GlobalHelper.globlevar['firstRenderScreen'] = true;
                    let foundNames = false;
                    GlobalHelper.holdFunGroupData ? GlobalHelper.holdFunGroupData.forEach((value, key, map) => {
                      if (foundNames === false) {
                        for (let i = 0; i < value.content.length; i++) {
                          if (value.content[i].id == this.props.popupFunctionId) {
                            this.headername = value.content[i].groupds;
                            this.formSubTitle = value.content[i].desc;
                            foundNames = true;
                            break;
                          }
                        }
                      } else {
                        return;
                      }

                    }) : null

                    if (foundNames === false) {
                      // This section of code is execte at the time of redirect function or popup function in case of link clicked of section/grid.
                      GlobalHelper.holdFunGroupData ? GlobalHelper.functionGroupData.formHeaderBookmarks.forEach((value, key, map) => {
                        for (let i = 0; i < value.content.length; i++) {
                          if (value.content[i].id == this.props.popupFunctionId) {
                            this.headername = value.content[i].groupds;
                            this.formSubTitle = value.content[i].desc;
                            foundNames = true;
                            break;
                          }
                        }
                      }) : null
                    }
                    this.forceUpdate();
                  });
              }
            }
          });
      }
    }
    this.handleClick = this.handleClick.bind(this);
    this.SaveF2function = this.SaveF2function.bind(this);
    this.GetF2LayoutTopIcons = this.GetF2LayoutTopIcons.bind(this);
    this.ClearFormsData = this.ClearFormsData.bind(this);
    this.customHelpFunctions = this.customHelpFunctions.bind(this);
    this.myFunction = this.myFunction.bind(this);
    this.setMyClass = this.setMyClass.bind(this);
    this.setMyFavClass = this.setMyFavClass.bind(this);
    this.refreshSectionLevelButton = this.refreshSectionLevelButton.bind(this);
    this.setFavoriteTooltip = this.setFavoriteTooltip.bind(this);
    this.optionsIntoArrayConverter = this.optionsIntoArrayConverter.bind(this);
    this.ChildrenHandler = this.ChildrenHandler.bind(this);
    this.fromMapToFormFieldOptions = this.fromMapToFormFieldOptions.bind(this);
    this.ChildrenHandlerFrmMap = this.ChildrenHandlerFrmMap.bind(this);
    this.getPredefinedData = this.getPredefinedData.bind(this);
    this.FunHeadercustomScreenCall = this.FunHeadercustomScreenCall.bind(this);
    this.HeaderFunCustomScreenCall = this.HeaderFunCustomScreenCall.bind(this);
    this.selectedCustomFunIcon = this.selectedCustomFunIcon.bind(this);
    this.functionForTest = this.functionForTest.bind(this);
    this.functionForSplitScreenForm = this.functionForSplitScreenForm.bind(this);
    this.functionForSplitScreenBackWordForm = this.functionForSplitScreenBackWordForm.bind(this);
    this.RenderingSplitform = this.RenderingSplitform.bind(this);
    this.emulateOnLoad = this.emulateOnLoad.bind(this);
    this.customcollectionObj = new customcollectionutils();
    this.state = {
      activeRight: "no",
      activeLeft: "no",
      completed: false,
      themeName: this.props.themeCode,
      tempJsonEditPropertyFlag: [],
      widths: (window.innerWidth - 142),
      defaultbutton: "0",
      size: 0,
      heighttable: (this.props.themeCode === "myCompact" ? window.innerHeight + 6 : window.innerHeight),
      hasError: false,
      refresh: false,
      refreshERROR: false,
      islinkclicked: false,
      isSaveClicked: false,
      isClearClicked: false,
      clearFormsubmit: false,
      topvalue: undefined,
      rowheaderdatamap: [],
      errorstatus: false,
      refetchresponsedata: false,
      timelineClicked: false,
      justRefresh: true,
      ref: false,
      fav: false,
      pin: false,
      refershCustomScreenFlag: false
    };
    if (this.props.orientationType == "popup") {
      this.formSubTitle = this.props.popformSubTitle;
      this.headername = this.props.popheadername;
    } else {
      this.formSubTitle = this.props.formSubTitle;
      this.headername = this.props.headername;
    }
    this.isActive = true;
    this.onloadtimelinedisplay = true;
    this.clearTriggered = false;
    this.funcObjForRefresh = {};
    nameOfTheme = this.state.themeName;
    this.setClassRightUI = this.setClassRightUI.bind(this);
    this.setPinUnpinIcon = this.setPinUnpinIcon.bind(this);
    this.manageFavoriteFunctions = this.manageFavoriteFunctions.bind(this);
    this.pinUnpinDefaultFunction = this.pinUnpinDefaultFunction.bind(this);
    this.quickButtons = this.quickButtons.bind(this);
    this.setClassLeft = this.setClassLeft.bind(this);
    this.OpFunction = this.OpFunction.bind(this);
    this.changeRefreshERROR = this.changeRefreshERROR.bind(this);
    this.setClassArrow = this.setClassArrow.bind(this);
    this.updatetablecycle = this.updatetablecycle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.applyOrientation = this.applyOrientation.bind(this);
    //ADDED START
    this.setFullTableClass = this.setFullTableClass.bind(this);
    this.setHalfTableClass = this.setHalfTableClass.bind(this);
    this.setOneThirdTableClass = this.setOneThirdTableClass.bind(this);
    this.setTwoThirdTableClass = this.setTwoThirdTableClass.bind(this);
    this.alertmessage = this.alertmessage.bind(this);
    this.setSpanClass = this.setSpanClass.bind(this);
    this.setIdToTimelineIcon = this.setIdToTimelineIcon.bind(this);
    this.setGrayScaleId = this.setGrayScaleId.bind(this);
    this.setGrayScaleClass = this.setGrayScaleClass.bind(this);
    this.setTimeLineButtonClass = this.setTimeLineButtonClass.bind(this);
    this.setTwoThirdHalfTableClass = this.setTwoThirdHalfTableClass.bind(this);
    this.setOneThirdHybridClass = this.setOneThirdHybridClass.bind(this);
    this.setTwoThirdHybridClass = this.setTwoThirdHybridClass.bind(this);
    this.collapseCards = this.collapseCards.bind(this);
    //Sprint 9 (Task 60):Added methods to load hedaer template after getting ajax data
    //this.getHeaderTemplate=this.getHeaderTemplate.bind(this);
    this.getAvatars = this.getAvatars.bind(this);
    this.returnEmptyTwoThirdContainer = this.returnEmptyTwoThirdContainer.bind(this);
    this.getGridValueForColumn = this.getGridValueForColumn.bind(this);
    this.getHistoryLayout = this.getHistoryLayout.bind(this);
    this.hideHistoryLayout = this.hideHistoryLayout.bind(this);
    this.getDefaultFunctionLayout = this.getDefaultFunctionLayout.bind(this);
    this.reRender = this.reRender.bind(this);
    this.timelinebutton = this.timelinebutton.bind(this);
    this.timelineScreen = this.timelineScreen.bind(this);
    this.callSave = this.callSave.bind(this);
    this.callClose = this.callClose.bind(this);
    this.checkNothingToSave = this.checkNothingToSave.bind(this);
    this.handleNullDataForCheckBox = this.handleNullDataForCheckBox.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.changeAppearance = this.changeAppearance.bind(this);
    this.onKeyPressGoToSection = this.onKeyPressGoToSection.bind(this);
    this.hasDetailSection = false;
    var selectedRowHeaderData = GlobalHelper.selectedRowData;
    let preColumnHeader = GlobalHelper.preColumnData;
    this.countDependablescreen = 0;
    this.handleAddCalled = undefined;
    this.addRowtoGrid = undefined;
    this.makeSectionsCompletelyReadonly = this.makeSectionsCompletelyReadonly.bind(this);

    // class variables created for rule execution - start
    this.targetToRulesMapper = new Map();
    this.ruleToTargetsMapper = new Map();
    this.fieldInExpressionToRulesMapper = new Map();
    this.defaultValueManagerMap = new Map();
    this.ruleExecutionStatusMap = new Map();
    this.isOnload = true;
    this.fieldsChangedForRuleExecution = [];
    this.throwValidationRulesArray = new Array();
    // class variables created for rule execution - end

    this.halfsectionheightFlag = false;//Sprint 35 - 50*50 section height if section has table with pagination
    this.halfsectionMapFlag = true;
    GlobalHelper.globlevar['section_formIDMap'].clear();//Task l60-924 - Need to provide hotkeys for sections within function
    GlobalHelper.globlevar['ScreenLayoutNameChk'] = true;
    //Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
    if (GlobalHelper.globlevar['promptmode'] != null && GlobalHelper.globlevar['promptmode'] === "prompt") {
      GlobalHelper.globlevar['ClipSearchRoot'] = "prompt";
      GlobalHelper.globlevar['promptmode'] = null;
    //  GlobalHelper.globlevar['promptmode'] = "NO_prompt";
    } else if (GlobalHelper.globlevar['ClipSearchRoot'] = "TableContainer") {
      GlobalHelper.globlevar['ClipSearchRoot'] = "UIScreen";
    } else {
      GlobalHelper.globlevar['ClipSearchRoot'] = "UIScreen";
    }//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.

    GlobalHelper.globlevar['UIScreenComponentRenderFlag'] = true;
    //Sprint 21 - COLLECTION/LOS issue fixed to saving data for function screen.
    if (GlobalHelper.globlevar['functionMenuClicked'] = "true") {
      GlobalHelper.globlevar['functionMenuClicked'] = "false";
      GlobalHelper.globlevar['ServerSideError'] = false;
      GlobalHelper.globlevar.toggleClicked = false;
    }//Sprint 21-end

    //Sprint 11: Task 83 No Hedaer Configuration Handling :[START]  First checking wether we have header function is configured or not.

    if (GlobalHelper.globlevar["myfunleftclicked"]) {
      GlobalHelper.globlevar["myfunleftclicked"] = undefined;
      cardHeaderInfo = [];
      this.createHistoryTimelineView = false;
      GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
      onlyCloseButtonViews = null;
    }
    if (GlobalHelper.globlevar.isHeaderConfigured) {
      //Sprint 11: Task 83 No Hedaer Configuration Handling : If Header is configured get it through data and template call.
      //Sprint 9 (Task 60):[START] Added code to make objects required to render header (middle) data with captions data
      var captionData = holdDataWithCap;
      for (var key in captionData) {
        var element = {};
        if (key.length === 0 || key === undefined || key === null) {
          element.section_header = "";
        }
        else {
          element.section_header = key;
        }
        if (captionData[key].length === 0 || captionData[key] === undefined || captionData[key] === null || captionData[key] === " ") {
          element.section_value = ".";
        }
        else {
          element.section_value = captionData[key];
        }
        if (element.section_value.length !== 0 && element.section_header.length !== 0) {
          this.state.rowheaderdatamap.push(element);
        }
      }
      //Sprint 9 (Task 60):[END]
    }
    else {
      if (preColumnHeader !== undefined && preColumnHeader !== "") {
        //Sprint 11: Task 83 No Hedaer Configuration Handling : If Header is not configured then go with row selected data values.
        holdDataWithCap = {};
        holdDataWithoutCap = {};
        holdDataWithCap[""] = "Demo Data";
        for (var key in selectedRowHeaderData) {
          //Sprint 9 (Task 60):Commented to load new ajax data into sealectedRowHeaderData
          var element = {};
          element.section_header = preColumnHeader.get(key);
          element.section_value = selectedRowHeaderData[key];
          if (preColumnHeader.get(key) == "Name" || preColumnHeader.get(key) == "Applicant Name" || preColumnHeader.get(key) == "Customer Name") {
            custname = selectedRowHeaderData[key];
            holdDataWithoutCap["custname"] = custname;
          }
          if (preColumnHeader.get(key) == "Account No") {
            custvalue = selectedRowHeaderData[key];
            holdDataWithoutCap["custvalue"] = selectedRowHeaderData[key];
          }
          //Sprint 9 (Task 60):Commented to load new ajax data into sealectedRowHeaderData
          if (key !== "internalTableData" && key !== "seq" && element.section_header !== "" && element.section_header !== undefined && element.section_header !== undefined && element.section_value !== undefined && element.section_value !== "")
            this.state.rowheaderdatamap.push(element);
        }
      }
    }
    //Sprint 11: Task 83 No Hedaer Configuration Handling :[END]  First checking wether we have header function is configured or not.

    var sMyString = '<a id="a"><b id="b">hey!</b></a>';
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(sMyString, "application/xml");
    // print the name of the root element or error message
    if (GlobalHelper.globlevar.responsestatus == "clear") {
      GlobalHelper.globlevar.responsestatus = undefined;
      responsestatus = undefined;
    }
    if (GlobalHelper.globlevar['clipsearchcloseprejson'] == undefined) {
      var informationofPrejson = {};
      informationofPrejson['holdDataWithCap'] = this.state.rowheaderdatamap;
      informationofPrejson['holdDataWithoutCap'] = holdDataWithoutCap;
      informationofPrejson['isHeaderConfigured'] = GlobalHelper.globlevar.isHeaderConfigured;
      informationofPrejson['jsonholdDataWithCap'] = holdDataWithCap;
      informationofPrejson['GlobalHelperdefaultfunction'] = GlobalHelper.defaultfunction;
      informationofPrejson['headername'] = this.headername;
      informationofPrejson['formSubTitle'] = this.formSubTitle;
      informationofPrejson['rightGroupid'] = right;
      informationofPrejson['removeHeaderFlag'] = GlobalHelper.globlevar["removeHeaderFlag"];
      informationofPrejson['menuFunctionFlag'] = GlobalHelper.globlevar['menuFunctionFlag'];
      this.formSubTitleForCloseClipsearch = undefined;
      GlobalHelper.globlevar['informationofPrejson'] = informationofPrejson;
    }
    // onload screen envent.
    new postFetchEventHandler().fetchEvent();
    GlobalHelper.globlevar['addrow'] = "false";

    //to hide section on basis of DTL_SEC_LIST when fetching detail sectionID
    if (this.F2FunctionNames.data != null) {
      if (this.F2FunctionNames.data[0] != null && this.F2FunctionNames.data[0].name != null) {
        if (this.F2FunctionNames.data[0].name.DTL_SEC_LIST != null) {
          Object.keys(this.F2FunctionNames.data[0].name.DTL_SEC_LIST).map((key) => {    // NOSONAR: javascript:S2201
            for (let sectionID in this.F2FunctionNames.data[0].name.DTL_SEC_LIST[key]) {
              if (this.F2FunctionNames.data[0].name.DTL_SEC_LIST[key][sectionID] !== undefined) {
                if (this.F2FunctionNames.data[0].name.DTL_SEC_LIST[key][sectionID] == true) {
                  this.F2FunctionNames.data[0].name.screendata.map((item, index) => {
                    if (item.sessionID === sectionID) {
                      item["hidden"] = "true";
                    }
                  })
                }
              }
            }
          })
        }
      }
    }

    if (GlobalHelper.globlevar['ruleExecutionStatusMap'] != null && GlobalHelper.globlevar['ruleExecutionStatusMap'].size > 0) {
      GlobalHelper.globlevar['ruleExecutionStatusMap'].forEach((value, key, map) => {
        value.forEach((value1, key1, map1) => {
          if (typeof value1 !== typeof []) {
            map1.set(key1, false);
          } else if (typeof value1 == typeof []) {
            let anArray = [];
            for (let i = 0; i < value1.length; i++) {
              anArray.push(false);
            }
            map1.set(key1, anArray);
          }
        });
      });
    }
  }

  refreshSectionLevelButton(sesId, xPathRefresh, parentPkRefresh, sectionprops) {
    let tmpObj = {};
    tmpObj['sessID'] = sesId;
    tmpObj['xPath'] = xPathRefresh;
    tmpObj['parentPkRefresh'] = parentPkRefresh;
    let sectionObj = sectionprops.namess.screendata.filter((item, index) => item.sessionID === sesId)[0];
    tmpObj['sectionXPath'] = sectionObj.sectionXPath;
    var values = tmpObj;
    store.dispatch({ type: 'SECTIONREFRESHCALL', values });
  }

  revertIsPopSectionClearClikedFlag() {
    this.isPopSectionClearClicked = { "isClicked": false };
  }

  //Task l60-924 - Need to provide hotkeys for sections within function
  onKeyPressGoToSection(event, priority) {
    if (priority != null && GlobalHelper.globlevar['section_formIDMap'].has(priority)) {
      let formID = '#' + GlobalHelper.globlevar['section_formIDMap'].get(priority);
      if ($(formID) != null) {
        $(formID).focus();
      }
    }
  }//END-//Task l60-924 - Need to provide hotkeys for sections within function

  reRender() {
    this.setState({ refershCustomScreenFlag: true }, () => {
      Log4r.log("refresh custom screen.........");
    })
  }

  handleBlur(sectionID, fieldId, rowKey) {
    if (sectionID == fieldId) {  // clause added to identify handleBlur call from TableWidget while next/previous button is clicked OR new row is added
      this.fieldsChangedForRuleExecution = [];
      this.isOnload = true;
    }
    else {
      let fieldChanged = sectionID + "." + fieldId;// make sure this is of the form sectionId.fieldId
      let rowAffected = "";
      if (rowKey != null && rowKey != undefined) {
        rowAffected = rowKey; // this represents actual row index in datasource array
      }
      let objectForFieldAffected = {};
      objectForFieldAffected.fieldId = fieldChanged;
      objectForFieldAffected.rowKey = rowAffected;
      this.fieldsChangedForRuleExecution.push(objectForFieldAffected);
    }
    this.setState({ justRefresh: !this.state.justRefresh }, () => {
      if (GlobalHelper.globlevar.cardAddButtonClicked) {
        GlobalHelper.globlevar.cardAddButtonClicked = undefined;
      }
    });
  }
  handleFocus(sectionID, fieldId, rowKey) {
    //core implimentaion goes here
      }
 handleKeydown(sectionID, fieldId, rowKey) {
        //core implimentaion goes here
          }
  //Sprint 9 (Task 60):[START] Method to get avatar logos and header template block depending on what data is coming from ajax call
  getAvatars(info) {
    if (holdAvatarData !== null || Object.keys(holdAvatarData).length !== 0) {
      return (
        <div className={styles.DataBlock2}>
          {
            Object.keys(holdAvatarData).map(function (post, i) {
              return (
                <Popover placement="topLeft" content={<div style={{ fontFamily: "Montserrat", fontSize: "11px", fontWeight: "600" }}>{post}</div>}><Avatar className={styles.customAvatar1} shape="square" size="large">{holdAvatarData[post]}</Avatar></Popover>
              )
            })
          }
        </div>
      )
    }
    else {
      return (
        null
      )
    }
  }
  collapseCards(value) {
    GlobalHelper.globlevar.cardCollapseClicked = true;
    for (var i = 0; i < this.namess.screendata.length; i++) {
      if (this.namess.screendata[i].sessionID === value) {
        if (!GlobalHelper.globlevar.CurrentlyClosedCard.includes(this.namess.screendata[i].sessionID)) {
          GlobalHelper.globlevar.CurrentlyClosedCard.push(this.namess.screendata[i].sessionID);
        }
        else {
          GlobalHelper.globlevar.CurrentlyClosedCard.unshift(this.namess.screendata[i].sessionID);
        }
        this.namess.screendata[i]['hidden'] = "true";
        this.forceUpdate();
        break;
      }
    }
  }

  expandCards(data) {
    GlobalHelper.globlevar.cardCollapseClicked = false;
    for (let i = 0; i < this.namess.screendata.length; i++) {
      for (let j = 0; j < GlobalHelper.globlevar.CurrentlyClosedCard.length; j++) {
        if (this.namess.screendata[i].sessionID === GlobalHelper.globlevar.CurrentlyClosedCard[j]) {
          GlobalHelper.globlevar.CurrentlyClosedCard.shift();
          if (this.namess.screendata[i].hasOwnProperty('hidden') && this.namess.screendata[i].hidden === "true") {
            delete this.namess.screendata[i]['hidden'];
          }
          this.forceUpdate();
          break;
        }
      }
    }
  }
  setSpanClass(id) {
    if (id === "TIMEL") {
      return styles.timeLineIcon;
    }
    else {
      return styles.normalRightIcon;
    }
  }

  setIdToTimelineIcon(id) {
    if (id === "TIMEL") {
      if (TimeLineView) {
        return styles.timeId;
      }
      else {
        return styles.normalId;
      }
    }
    else {
      return styles.normalId;
    }
  }

  setTimeLineButtonClass(id) {
    try {
      if (grayScaleTid.length === 0) {
        grayScaleTid = id;
      }
      if (grayScaleTid === id) {
        return styles.timelineSelectiveButtons_selected;
      }
      else {
        return styles.timelineSelectiveButtons;
      }
    }
    catch (e) { Log4r.log(e) }
    return "";
  }

  setGrayScaleId(id) {
    try {
      grayScaleTid = id;
      this.forceUpdate();
      var w = $('#' + id).parent();
      w.scrollTop(0);
      w.animate({ scrollTop: $('#' + id).position().top }, 500)
    }
    catch (e) { Log4r.log(e) }
  }

  setGrayScaleClass(id) {
    try {
      if (grayScaleTid.length === 0) {
        grayScaleTid = id;
      }
      if (id === grayScaleTid) {
        return styles.timelineBlocks;
      }
      else {
        return styles.grayscaleTimelineBlocks;
      }
    }
    catch (e) { Log4r.log(e) }
    return "";
  }

  checkUserProfilePicture(profileImgUrl) {
    if (profileImgUrl != null) {
      /*$.ajax({
      url:profileImgUrl,
      type:'HEAD',
      error: function(){
        return	profilePictureFlag = false;
      },
      success: function(){
        return	profilePictureFlag = true;
      }
      });*/
    }
  }

  getGridValueForColumn(formData, columnId, rowIndex) {
    for (let i = 0; i < formData.DataSource.length; i++) {
      if (formData.DataSource[i].key == rowIndex) {
        for (let j = 0; j < Object.keys(formData.DataSource[i]).length; j++) {
          if (Object.keys(formData.DataSource[i])[j] === columnId) {
            return formData.DataSource[i][Object.keys(formData.DataSource[i])[j]];
          }
        }
      }
    }
  }

  getHistoryLayout() {
    let legalBackActions = {};
    GlobalHelper.globlevar['summaryConfigType_save'] = false;
    GlobalHelper.globlevar['summaryConfigType'] = undefined;
    GlobalHelper.globlevar.linkclicked = undefined;
    GlobalHelper.globlevar['savedandfetch'] = true;
    this.props.storeF2VariablesForOpeningHistoryTimelineScreen();
    try {
      if (GlobalHelper.globlevar['clipsearchcloseprejson'] == undefined) {
        let SearchFromClipSearch = true;
        let previousScreenJSON = JSON.stringify(this.F2FunctionNames.data[0]);
        legalBackActions['SearchFromClipSearch'] = SearchFromClipSearch;
        legalBackActions['previousScreenJSON'] = previousScreenJSON;
        legalBackActions['functionID'] = GlobalHelper.globlevar.functionID;
        legalBackActions['GlobalHelperholdFunGroupData'] = GlobalHelper.holdFunGroupData;
        legalBackActions['listEntityId'] = GlobalHelper.listEntityId;
        legalBackActions['contextPKValues'] = GlobalHelper.contextPKValues;
        legalBackActions['contextPrimaryKey'] = GlobalHelper.contextPrimaryKey;
        legalBackActions['contextPrimaryKeyLength'] = GlobalHelper.contextPrimaryKeyLength;

        GlobalHelper.globlevar['clipsearchcloseprejson'] = legalBackActions;
      }
    } catch (e) {
      Log4r.error(e);
    }

    let values = GlobalHelper.worklistData.worklist.taskHistFunId;
    showOnlyCloseButton = true;
    store.dispatch({ type: 'LAYOUTTOPICON', values });
  }

  hideHistoryLayout(sessionid) {
    for (var i = 0; i < this.namess.screendata.length; i++) {
      if (this.namess.screendata[i].sessionID === sessionid) {
        if (this.namess.screendata[i].hasOwnProperty('hidden') && this.namess.screendata[i]['hidden'] == "true") {
          GlobalHelper.globlevar['historyHidden'] = false;
          delete this.namess.screendata[i]['hidden']
        }
        else {
          GlobalHelper.globlevar['historyHidden'] = true;
          this.namess.screendata[i]['hidden'] = "true";
        }
        break;
      }
    }
    this.forceUpdate();
  }

  getDefaultFunctionLayout() {
    this.props.getF2VariablesForOpeningHistoryTimelineScreen();
    GlobalHelper.globlevar['historyHidden'] = false;//Sprint 32 - To hide History Timeline Function Layout.
    this.showHideButtonPallete("show");//Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.
    let values = defaultFunctionId;
    showOnlyCloseButton = null;
    GlobalHelper.globlevar.linkclicked = false;
    GlobalHelper.globlevar['summaryConfigType_save'] = undefined;
    GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = undefined;
    GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] = undefined;
    GlobalHelper.globlevar['calculatedPkValuesForSave'] = undefined;
    this.createHistoryTimelineView = false;
    GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
    GlobalHelper.globlevar.historyContainerTitle = undefined;
    //store.dispatch({type: 'LAYOUTTOPICON',values});

    if (GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined) {
      var predata = JSON.parse(GlobalHelper.globlevar['clipsearchcloseprejson'].previousScreenJSON);
      this.F2FunctionNames.data[0] = predata;
      var legalcloseprejson = GlobalHelper.globlevar['clipsearchcloseprejson'];
      GlobalHelper.globlevar.functionID = legalcloseprejson.functionID;
      GlobalHelper.holdFunGroupData = legalcloseprejson['GlobalHelperholdFunGroupData'];
      GlobalHelper.listEntityId = legalcloseprejson['listEntityId'];
      GlobalHelper.contextPKValues = legalcloseprejson['contextPKValues'];
      GlobalHelper.contextPrimaryKey = legalcloseprejson['contextPrimaryKey'];
      GlobalHelper.contextPrimaryKeyLength = legalcloseprejson['contextPrimaryKeyLength'];

      var informationofPrejson = GlobalHelper.globlevar['informationofPrejson'];
      //holdDataWithoutCap = informationofPrejson['holdDataWithoutCap'];
      //GlobalHelper.globlevar.isHeaderConfigured = informationofPrejson['isHeaderConfigured'];
      //holdDataWithCap = informationofPrejson['jsonholdDataWithCap'];
      //this.state.rowheaderdatamap = informationofPrejson['holdDataWithCap'];
      this.headername = informationofPrejson['headername'];
      this.formSubTitle = informationofPrejson['formSubTitle'];
      //this.formSubTitleForCloseClipsearch = formSubTitle;
      //right = informationofPrejson['rightGroupid'];
      //GlobalHelper.globlevar.removeHeaderFlag = informationofPrejson['removeHeaderFlag'];
      //GlobalHelper['defaultfunction'][0] =  clipsearchcloseprejson.functionID;
      //a = legalcloseprejson.functionID;
      GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
      GlobalHelper.globlevar['clipsearchflagforbutton'] = undefined;
      GlobalHelper.globlevar['clipsearchcloseprejson'] = undefined;
      this.setState({ ref: false });
    }
  }

  SaveF2function(values, calledFromSubmit, buttonIdOnsave, calculatedPkValues) {

    let utilObject = new onPreSaveUtil(values.domaindata);
    let noErrorFromServer = true;
    let method = "onSavecollectionutil";
    GlobalHelper.globlevar['toControlUpdateErrCheck'] = true;
    let tmpArrVar = utilObject[method](values.name);

    if (tmpArrVar != null && tmpArrVar[0] != null && tmpArrVar[0] != false) {
      let txml;
      let succFlag = true;
      GlobalHelper.globlevar['toControlUpdateErrCheck'] = false;
      if (tmpArrVar[1] != null && tmpArrVar[1] !== "") {
        let tempJson = JSON.parse(tmpArrVar[1]);
        if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
          let errjsn = tempJson.__f2_messages__;
          for (var i = 0; i < errjsn.length; i++) {
            if (errjsn[i][0] == "E") {
              succFlag = false;
              noErrorFromServer = false;
              break;
            }
          }
        }
        tempJson['SuccessFlag'] = succFlag;
        tempJson['SuccessFlagReRender'] = true;
        var jsonTxt;
          jsonTxt = JSON.stringify(tempJson); //"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
        
        jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
        let names = JSON.parse(jsonTxt).name;
        // if (postSave()) {
        // } else {
        // }
      }

    } else {
      var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      var contextencodevalue = contextprimarykeyvalue[0] + "=" + encodeURIComponent(contextprimarykeyvalue[1]);
      var functionMode = "F";
      if (GlobalHelper.globlevar['functionMode'] == "B") {
        GlobalHelper.globlevar['functionMode'] = undefined;
        functionMode = "B";
      } else if (GlobalHelper.globlevar['functionMode'] == "Q") {
        GlobalHelper.globlevar['functionMode'] = undefined;
        functionMode = "Q";
      }
      if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
        if (calculatedPkValues) {
          url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calculatedPkValues[0].contextPrimaryKyes + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + this.props.popupFunctionId + "&functionMode=" + functionMode + "&calledFromSubmit=" + calledFromSubmit + "&_btnid=" + buttonIdOnsave + "&"
        } else {
          url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + this.props.popupFunctionId + "&functionMode=" + functionMode + "&calledFromSubmit=" + calledFromSubmit + "&_btnid=" + buttonIdOnsave + "&"
        }
      } else {
        url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + this.props.popupFunctionId + "&functionMode=" + functionMode + "&calledFromSubmit=" + calledFromSubmit + "&_btnid=" + buttonIdOnsave + "&"
      }
      if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
        url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=save&" + GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + "&"
      }
      var xpath = values.domaindata;

      if (tmpArrVar != null) {
        if (tmpArrVar[1] != null && tmpArrVar[1] !== "") {
          xpath = tmpArrVar[1];
        }
      }

      if (GlobalHelper.globlevar['savedFunctionID'] == "cb6b6e9465c04df9809fe6aea2b1df17") { // xpath changed for given function id to remove _mode value
        xpath = xpath.replace(/_mode=U/g, '_mode='); // all row need to replace mode by null;
      }
      var requestData = {
        // SET AT CALLSAVE METHOD IN UISCREEN. FOR CALCULATE USER SPEND TIME ON SCREEN.
        'lsecondSpend': GlobalHelper.globlevar['SecondSpendOnScreen']
      };
      // SET AT CALLSAVE METHOD IN UISCREEN. FOR CALCULATE USER SPEND TIME ON SCREEN.
      xpath = xpath + "&lsecondSpend=" + GlobalHelper.globlevar['SecondSpendOnScreen'] + "&";
      if (this.namess != null && this.namess.getData != null) {
        url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=save" + this.namess.getData.split("getData")[1] + "&calledFromSubmit=" + calledFromSubmit + "&_btnid=" + buttonIdOnsave + "&__functionId=" + this.props.popupFunctionId + "&";
      }
      if (preSave()) {

        let SAVEDATA_PostDataUrl = url.split("?")[1];
        let _stdata_SAVEDATA_PostDataUrl = getSTData("/" + GlobalHelper.menuContext + "/", SAVEDATA_PostDataUrl);

        request
          .post(url)
          .query({
            _SID_: (_stdata_SAVEDATA_PostDataUrl.SID + _stdata_SAVEDATA_PostDataUrl.SINT)
          })
          .query({
            _ADF_: ""
          })
          .send(xpath)
          .set('Accept', 'application/xml')
          .set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8;')
          .end((err, res) => {
            if (err) {
              // Return the error action
              const names = JSON.parse('["/reactapp/app/index"]');

            } else {
              var txml;
              let succFlag = true;
              if (res.text !== "" && res.text !== undefined && res.text !== null) {
                let tempJson = JSON.parse(res.text);
                if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
                  let errjsn = tempJson.__f2_messages__;
                  for (var i = 0; i < errjsn.length; i++) {
                    if (errjsn[i][0] == "E") {
                      succFlag = false;
                      noErrorFromServer = false;
                      break;
                    }
                    //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                    if (errjsn[i][0] == "D") {
                      let dialogTitle = "Dialog Box";
                      if (!isempty(errjsn[i][4])) {
                        dialogTitle = errjsn[i][4];
                      }
                      displayMessageBox(dialogTitle, errjsn[i][1], "I", null)
                      break;
                    } //END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                  }
                }
                tempJson['SuccessFlag'] = succFlag;
                tempJson['SuccessFlagReRender'] = true;
                var jsonTxt;
                  jsonTxt = JSON.stringify(tempJson); //"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
                
                jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
                // {'status' : 'E', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}
                let names = JSON.parse(jsonTxt).name;

                if (postSave()) {
                  ErrorHandler.setTotalErrJson([]);
                  ErrorHandler.setTotalWarningsJson([]);
                  ErrorHandler.setTotalInfoMessageJson([]);
                  ErrorHandler.setTotalSuccessMessageJson([]);
                  let ttlErrJsn;
                  let ttlErrJsnOrig;
                  let totalWarnJsn;
                  let totalInfoJsn;
                  let totalSuccJsn;
                  stopcount++;
                  var errjsn = names.data[0].name.__f2_messages__;
                  var sesID;

                  try {
                    let cflag = false;
                    var ttlErrJsnOrig = ErrorHandler.getTotalErrJson();
                    let totalWarnJsn = ErrorHandler.getTotalWarningsJson();
                    let totalInfoJsn = ErrorHandler.getTotalInfoMessageJson();
                    let totalSuccJsn = ErrorHandler.getTotalSuccessMessageJson();
                    for (var i = 0; i < errjsn.length; i++) {
                      let xpth; // = errjsn[i].ctl;
                      cflag = true;
                      if (errjsn[i][2] != "" && errjsn[i][2] != undefined && errjsn[i][2] != null) {
                        xpth = errjsn[i][2];
                      } else {
                        xpth = undefined;
                      }
                      if (errjsn[i][0] == "I") {
                        ttlErrJsn = totalInfoJsn;
                      } else if (errjsn[i][0] == "E") {
                        ErrorHandler.setHoldColorUIScreen('#f5222d');
                        ttlErrJsn = ttlErrJsnOrig;
                      } else if (errjsn[i][0] == "W") {
                        ttlErrJsn = totalWarnJsn;
                      } else if (errjsn[i][0] == "S") {
                        ErrorHandler.setHoldColorUIScreen('#1dd435');
                        ttlErrJsn = totalSuccJsn;
                      } else if (errjsn[i][0] == "D") {

                      }

                      if (xpth != "" && xpth != null && xpth != undefined) {
                        var aX, fpath;
                        for (var k = 0; k < this.namess.screendata.length; k++) {
                          aX = this.namess.screendata[k].uiSchema[0].children.filter(itm2 => itm2.children.xPath === xpth);
                          if (aX.length > 0) {
                            fpath = aX[0].children.fieldPath;
                            sesID = this.namess.screendata[k].sessionID;
                            break;
                          } else {
                            fpath = undefined;
                            sesID = undefined;
                          }
                        }

                        for (var j = 0; j < ttlErrJsn.length; j++) {
                          if (typeof ttlErrJsn[j][sesID] == typeof {}) {
                            let qwe = [];
                            qwe[0] = errjsn[i][1];
                            ttlErrJsn[j][sesID][fpath] = qwe;
                          }
                        }
                      } else {
                        //var ttlErrJsn = ErrorHandler.getTotalErrJson();
                        if (ttlErrJsn) {
                          if (Array.isArray(ttlErrJsn)) {
                            var res22 = ttlErrJsn.filter(itm => itm["generic"])[0];
                            if (res22) {
                              if (Array.isArray(res22["generic"])) {
                                var checkDuplicate = res22["generic"].filter(itm2 => itm2[0] === errjsn[i][1]);
                                if (checkDuplicate.length != 0) { } else {
                                  let qwe = [];
                                  qwe[0] = errjsn[i][1];
                                  res22["generic"][res22["generic"].length] = qwe;
                                }
                              }
                            } else {
                              let qwe = [];
                              qwe[0] = errjsn[i][1];
                              var errMsg = [];
                              errMsg[errMsg.length] = qwe;
                              var obj = {};
                              obj["generic"] = errMsg;
                              ttlErrJsn[ttlErrJsn.length] = obj;
                            }
                          }
                        }
                      }
                    }
                    GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg = ttlErrJsnOrig;
                    GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalWarnJsn = totalWarnJsn;
                    GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalInfoJsn = totalInfoJsn;
                    GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalSuccJsn = totalSuccJsn;

                    ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
                    ErrorHandler.setTotalWarningsJson(totalWarnJsn);
                    ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
                    ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
                    if (cflag) {
                      ErrorHandler.setHoldCount(0);
                    }
                    GlobalHelper.globlevar['buttonSpin'] = false;
                    if(succFlag === true){
                          let utilObject = new onPostSaveUtil(names);
                          utilObject["onPostSaveUtilcall"]();
                    }
                    this.forceUpdate();
                  } catch (e) {
                    Log4r.log(e);
                  }
                } else {

                }
              }
            }
          });
      }
    }
    if (this.refreshOnSave === true && noErrorFromServer === true) {
      this.refreshOnSave = undefined;
      this.GetF2LayoutTopIcons(this.props.popupFunctionId, calculatedPkValues, true)
    }
  }

  GetF2LayoutTopIcons(values, calculatedPkValues, forRefresh) {
    var functionid = "";
    var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
    var contextencodevalue = contextprimarykeyvalue[0] + "=" + encodeURIComponent(contextprimarykeyvalue[1]);
    let contextKeys = "";
    if (this.props.customContextKeys && this.props.customContextKeys.length !== 0) {
      contextKeys = this.props.customContextKeys;
    } else {
      contextKeys = GlobalHelper.contextPKValues;
    }

    url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
    if (calculatedPkValues != undefined && calculatedPkValues.length !== 0) {
      if (calculatedPkValues[0].contextPrimaryKyes.includes("|")) {
        let calcontextprimarykeyvalue = calculatedPkValues[0].contextPrimaryKyes.split('=');
        let calcontextencodevalue = calcontextprimarykeyvalue[0] + "=" + encodeURIComponent(calcontextprimarykeyvalue[1]);
        url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calcontextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
      } else {
        url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
      }
    } else {
      url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
    }
    if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
      functionid = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
    } else {
      functionid = values;
    }

    var requestData = {
      '__functionId': functionid,
      'token': 'indus'
    };
    layoutID = values;
    if (preFetch()) {
      let LAYOUTTOPICON_GetTemplateUrl = url.split("?")[1];
      let _stdata_LAYOUTTOPICON_GetTemplateUrl = getSTData("/" + GlobalHelper.menuContext + "/", LAYOUTTOPICON_GetTemplateUrl);

      request
        .post(url + "layouttopicon")
        .query({
          _SID_: (_stdata_LAYOUTTOPICON_GetTemplateUrl.SID + _stdata_LAYOUTTOPICON_GetTemplateUrl.SINT)
        })
        .query({
          _ADF_: ""
        })
        .send(JSON.stringify(requestData))
        .send({
          '__functionId': functionid,
          'token': 'indus'
        })
        .set('X-API-Key', functionid)
        .set('Accept', 'application/xml')
        .query({
          __functionId: functionid
        })
        .query({
          access: GlobalHelper.functionAccessMap.get(values)
        })
        .end((err, res) => {
          if (err) {
            const names = JSON.parse('["/reactapp/app/index"]');
          }
          var jsonText = res.text;
          let jsonObj = null
          try {
            jsonObj = JSON.parse(jsonText);
          } catch (e) { }
          let parentnode = new Model().handleDataChange(jsonObj);
          jsonObjtemplet = jsonObj.JSON_DATA;
          let buttonpalettes = jsonObj.BUTTON_JSON;
          let quickbuttons = jsonObj.QUICK_BUTTON_JSON;

          if (GlobalHelper.globlevar.hybridOneThirdCardsCount.length === 0) {
            GlobalHelper.globlevar.templetObject = jsonObjtemplet;
          }
          if (res.text !== undefined) {

            let jsurl = '/' + GlobalHelper.menuContext + '/secure/js/customcollectionutils1.js';

            let jsScripts = jsonObj.JSSCRIPTS;
            loadScript("/FrameworkUtility/customGenUtils.js");
            if (jsScripts != null)
              for (let jsscriptIndex = 0; jsscriptIndex < jsScripts.length; jsscriptIndex++) {

                loadScript("/" + jsScripts[jsscriptIndex].path);
              }

            var functioniddata = "";
            url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
            if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
              GlobalHelper.globlevar['summaryConfigType_save'] = false;
              functioniddata = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
            } else {
              functioniddata = values;
            }
            if (calculatedPkValues != undefined && calculatedPkValues.length !== 0) {
              if (calculatedPkValues[0].contextPrimaryKyes.includes("|")) {
                let calcontextprimarykeyvalue = calculatedPkValues[0].contextPrimaryKyes.split('=');
                let calcontextencodevalue = calcontextprimarykeyvalue[0] + "=" + encodeURIComponent(calcontextprimarykeyvalue[1]);
                url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calcontextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
              } else {
                url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
              }
            } else {
              url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&"
            }

            let LAYOUTTOPICON_GetDataUrl = url.split("?")[1];
            let _stdata_LAYOUTTOPICON_GetDataUrl = getSTData("/" + GlobalHelper.menuContext + "/", LAYOUTTOPICON_GetDataUrl);

            request
              .post(url + "layouttopicondata")
              .query({
                _SID_: (_stdata_LAYOUTTOPICON_GetDataUrl.SID + _stdata_LAYOUTTOPICON_GetDataUrl.SINT)
              })
              .query({
                _ADF_: ""
              })
              .send(JSON.stringify(requestData)) // sends a JSON post body
              .send({
                'linkoption': functioniddata,
                'token': 'indus'
              })
              .set('X-API-Key', functioniddata)
              .query({
                __functionId: functioniddata
              })
              .query({
                access: GlobalHelper.functionAccessMap.get(functioniddata)
              })
              .set('Accept', 'application/xml')
              .end((err, res) => {
                if (err) {
                  Log4r.log('data-service err: call', err);
                }
                let jsonTxt22;
                var jsonText = res.text;
                let succFlag = true;
                if (res.text !== "" && res.text !== undefined && res.text !== null) {
                  let tempJson = JSON.parse(res.text);
                  let newErrJson = {};
                  if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
                    let errjsn = tempJson.__f2_messages__;
                    for (var i = 0; i < errjsn.length; i++) {
                      if (errjsn[i][0] == "E") {
                        succFlag = false;
                        break;
                      }
                      //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                      if (errjsn[i][0] == "D") {
                        let dialogTitle = "Dialog Box";
                        if (!isempty(errjsn[i][4])) {
                          dialogTitle = errjsn[i][4];
                        }
                        displayMessageBox(dialogTitle, errjsn[i][1], "I", null)
                        break;
                      } //END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
                    }
                    newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
                  }
                  newErrJson['SuccessFlag'] = succFlag;
                  newErrJson['SuccessFlagReRender'] = true;
                    jsonTxt22 = JSON.stringify(newErrJson); //"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
                  
                }
                let jsonObj = null
                try {
                  jsonObj = JSON.parse(jsonText);
                } catch (e) {
                  Log4r.error(e);
                }
                try {
                  jsonObjdata = jsonObj.JSON_DATA;
                } catch (e) {
                  Log4r.error(e);
                }
                // to storequerystring in all request from getdatacall and temp basis
                ParentPK = new ParentPKComponentData().getParentQueryString(jsonObjtemplet, jsonObjdata);
                let names = new ReactJsonBuilder(jsonObjtemplet, values, jsonObjdata).buildReactJson();

                var jsonTxt = JSON.stringify(names);
                jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": " + jsonTxt22 + ",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
                names = JSON.parse(jsonTxt).name;

                try {
                  names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
                  names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
                } catch (e) {
                  Log4r.log(e);
                }

                /****** REMOVING PALETTE BUTTONS FOR POPUP SCREENS ******/
                let buttonsToBeRemoved = ['previous', 'saveandnext', 'next', 'saveandclose', 'close'];

                names.data[0].name.ButtonPalette[0].uiSchema[0].children.map((button, buttonIndex) => {
                  if (buttonsToBeRemoved.includes(button.children.fieldPath)) {
                    button.children.widget = "hidden";
                  }
                });

                this.FunctionF2FunctionNames = undefined;
                this.FunctionF2FunctionNames = names;
                if (forRefresh === true) {
                  this.namess.screendata = [];
                  this.namess.preButtonPalette = [];
                }
                GlobalHelper.globlevar['summaryConfigType'] = "summaryConfigType_F";
                let foundNames = false;
                GlobalHelper.holdFunGroupData.forEach((value, key, map) => {
                  if (foundNames === false) {
                    for (let i = 0; i < value.content.length; i++) {
                      if (value.content[i].id == values) {
                        this.headername = value.content[i].groupds;
                        this.formSubTitle = value.content[i].desc;
                        foundNames = true;
                        break;
                      }
                    }
                  } else {
                    return;
                  }

                })

                GlobalHelper.globlevar['summaryConfigType'] = undefined;

                if (Object.keys(this.FunctionF2FunctionNames.data[0].name.rules).length !== 0) {
                  GlobalHelper.globlevar['newFunctionNames'] = this.FunctionF2FunctionNames.data[0].name;
                } else {
                  GlobalHelper.globlevar['newFunctionNames'] = undefined;
                }

                let cardLayoutInclusion = false;
                try {
                  let breakpoint = false;
                  for (let p = 0; p < this.firstRenderScreen.screendata.length; p++) {
                    if (breakpoint) {
                      break;
                    } else {
                      for (let q = 0; q < this.firstRenderScreen.screendata[p].uiSchema[0].children.length; q++) {
                        if (this.firstRenderScreen.screendata[p].uiSchema[0].children[q].children.widget === "table" && this.firstRenderScreen.screendata[p].formData[0][this.firstRenderScreen.screendata[p].uiSchema[0].children[q].children.fieldPath].data.isCardDisplay === "true") {
                          breakpoint = true;
                          cardLayoutInclusion = true;
                          GlobalHelper.globlevar['cardLayoutInclusion'] = true;
                          break;
                        }
                      }
                    }
                  }
                } catch (e) {
                  Log4r.error(e);
                }

                this.namess.screendata.map((item, i) => {
                  try {
                    if (item['summaryConfigTypesection'] == "true") {
                      this.namess.screendata.splice(i);
                    }
                  } catch (e) {
                    Log4r.error(e)
                  }
                });


                this.FunctionF2FunctionNames.data[0].name.screendata.map((item, i) => {
                  try {
                    if (cardLayoutInclusion) {
                      item['layoutSize'] = "GridTwoThird";
                      item['addedFunctionLayout'] = true;
                    }
                    item['summaryConfigTypesection'] = "true";
                    this.namess.screendata.push(item);
                  } catch (e) {
                    Log4r.error(e)
                  }
                })

                if (this.namess['preButtonPalette'] == undefined) {
                  this.namess['preButtonPalette'] = [];
                  this.namess['preButtonPalette'][0] = this.namess.ButtonPalette;
                } else {
                  this.namess.preButtonPalette.push({
                    "functionId": GlobalHelper.globlevar.functionID,
                    "buttonPallete ": this.namess.preButtonPalette
                  });
                }
                let summaryConfigType = {};
                summaryConfigType['functionIDOfSummaryConfigType'] = functioniddata;
                summaryConfigType['getDataOfSummaryConfigType'] = url;
                this.namess['functionIDOfSummaryConfigType'] = functioniddata;
                this.namess['summaryConfigTypeParam'] = summaryConfigType;
                if (GlobalHelper.globlevar.CardCloseClicked) {
                  this.namess.ButtonPalette = this.namess.preButtonPalette[this.namess.preButtonPalette.length - 1];
                  this.namess.preButtonPalette.pop();
                } else {
                  this.namess.ButtonPalette = this.FunctionF2FunctionNames.data[0].name.ButtonPalette;
                }

                GlobalHelper.globlevar["onloadPop"] = true;
                ErrorHandler.clear();
                ErrorHandler.getsequenceJson(this.namess.screendata);
                this.forceUpdate();
              });
          }
        });
    }
  }

  componentWillUnmount() {
    ErrorHandler.tempfunc(ErrorHandler.getTotalErrJson());
    stopcount = 0;
    try{
      // this.setState({});
      this.namess = null;
      this.holdNamess = null;
      this.F2FunctionNames = null;
      // this.props = null; //nullify the inner variables from the
      jsonObjtemplet = undefined;
      jsonObjdata = undefined;
      let item = document.querySelector('#scrollbar11')
      if(item != null){
        item.innerHTML = '';
      }
      // Log4r.log("name123",this.namess);
      Log4r.log("after clear",this);
    }catch(e){
      Log4r.log('unmount screenMeta', e)
    }
  }
  componentWillMount() {
    if (this.props.orientationType == "popup" && this.props.popupFunctionId) {
      this.formSubTitle = "Loading Function Name...";
      this.headername = "Loading Function Group Name...";
    }
  }

  changeRefreshERROR(obj, buttonClicked) {
    if (obj != null) {
      this.addRowtoGrid = obj;
      this.addRowtoGridSection = obj;
      this.buttonClicked = buttonClicked;
      this.addRowToGridTriggered = "Yes";
    }
    else {
      this.addRowtoGrid = obj;
    }
    var rfsh = this.state.refreshERROR;
    this.setState({
      refreshERROR: !rfsh
    })
  }

  updatetablecycle() {
    GlobalHelper.consoleMessage("updatetablecycle ", this);
    this.setState({ flag: true })
  }

  getPredefinedData(fileData) {
    if (fileData.screendata !== undefined) {
      for (var i = 0; i < fileData.screendata.length; i++) {
        for (var j = 0; j < fileData.screendata[i].formData.length; j++) {
          var KeyArray = Object.keys(fileData.screendata[i].formData[j]);
          for (var k = 0; k < KeyArray.length; k++) {
            var customData = fileData.screendata[i].formData[j][KeyArray[k]].data;
            if (customData !== undefined) {
              if (customData.length !== 0) {
                preData.set(KeyArray[k], customData);
              }
            }
          }
        }
      }
    }
  }

  //Sprint 36 - Task - Add to Grid functionality fetch newly added data...
  setDetailsSectionDataTemp(detailsectionToPerform) {
    var tempstrdt = GlobalHelper.globlevar['tableLinkRecord']['addThroughSummGridmap'];
    var tempstrdtmap = new Map();
    var pairs = null;
    if (tempstrdt != null) {
      pairs = tempstrdt.split('&');
    }
    if (pairs != null) {
      for (var i = 0, total = pairs.length; i < total; i++) {
        var pair = pairs[i].trim().split('=');
        if (pair != null && pair[1] != null) {
          tempstrdtmap.set(pair[0], [pair[1]]);
        }
      }
    }

    let sectionIdToDataOperation = new Model().getLeaf(detailsectionToPerform);
    if (sectionIdToDataOperation != null && sectionIdToDataOperation.length != 0) {
      for (var k = 0; k < sectionIdToDataOperation.length; k++) {
        let optrSectId = Object.keys(sectionIdToDataOperation[k])[0];
        this.namess.screendata.map((sectobj, llk) => {
          if (sectobj.sessionID === optrSectId) {
            sectobj.uiSchema[0].children.map((childitm, ls) => {
              if (childitm.children.xPath != null && tempstrdtmap != null && tempstrdtmap.has(childitm.children.xPath)) {
                sectobj.formData[0][childitm.children.fieldPath].data = tempstrdtmap.get(childitm.children.xPath);
                if (sectobj.formData[0][childitm.children.fieldPath].desc != null) {
                  sectobj.formData[0][childitm.children.fieldPath].desc = tempstrdtmap.get(childitm.children.xPath);
                }
              }
            })
          }
        })
      }
    }
    this.reRender();
  }//END-Sprint 36 - Task - Add to Grid functionality fetch newly added data...

  //Sprint 38 - Task 35 - Issue-1.L60-566-Dropdown value getting clear on click of Save.
  get_refreshOnSave_of_defaultFunction() {
   //console.log("hgasjakshakjsd.......",Rightsidermenu,GlobalHelper.defaultfunction,defaultFunctionId);
   if(Rightsidermenu != null && GlobalHelper.defaultfunction != null){
    if(GlobalHelper.defaultfunction[0] != null){
      Rightsidermenu.map((item,index)=>{    // NOSONAR: javascript:S2201
        if(item != null && item.content != null){
         let grpFuncRefreshOnSave = item.content.filter(val=>val.id === GlobalHelper.defaultfunction[0])[0];
            //console.log("hgsahgjhdgsadj.........",grpFuncRefreshOnSave);
            if(grpFuncRefreshOnSave != null && grpFuncRefreshOnSave['refreshOnSave'] != null){
              //console.log("shfdkjhsfdk...........",grpFuncRefreshOnSave['refreshOnSave']);
              if(grpFuncRefreshOnSave['refreshOnSave'] === "Y"){
                //console.log("jhsdgjas.......",typeof(grpFuncRefreshOnSave.refreshOnSave));
                this.refreshOnSave = true;
              }
            }
        }
      })
    }
    }
  }//END-Sprint 38 - Task 35 - Issue-1.L60-566-Dropdown value getting clear on click of Save.

  componentDidUpdate(prevProps, prevState) {
    $('[class=widget_span]:empty').css('display', 'none');

    function testOverflow(element) {
      if (element.scrollHeight > element.clientHeight) {
        return true;
      } else {
        return false;
      }
    }

    let TextareaElements = $('[class*=MySimpletextarea] span[class=ant-form-item-children]');
    for (let k = 0; k < TextareaElements.length; k++) {
      let isOverflown = testOverflow(TextareaElements[k]);
      if (isOverflown === true && $('[class*=MySimpletextarea] span[class=ant-form-item-children][class=specialClass]').length === 0) {
        $(TextareaElements[k]).toggleClass('specialClass');
      }
    }
    if (GlobalHelper.globlevar["onPopDetailSectionLoad"] && this.F2FunctionNames.data[0].name !== undefined) { // onDetailSectionLoad() custom method will call on click of summeryGrid link / card click.
      GlobalHelper.globlevar["onPopDetailSectionLoad"] = false;
      try {
        let utilObject = new onLoadUtil();
        let method = "onDetailSectionLoad";
        utilObject[method](this.F2FunctionNames.data[0].name);
      }
      catch (e) { Log4r.error(e) }
    }

    if (GlobalHelper.globlevar["onloadPop"] && this.F2FunctionNames.data[0].name !== undefined) {
      GlobalHelper.globlevar["onloadPop"] = false;
      try {
        let utilObject = new onLoadUtil();
        let method = "onloadcollectionutil";
        utilObject[method](this.F2FunctionNames.data[0].name);
      }
      catch (e) { Log4r.error(e) }
    }

    if (this.popUpLinkClick === true) {
      this.popUpLinkClick = undefined;
      if (GlobalHelper.globlevar.linkclicked == true && this.F2FunctionNames.data[0].name['addToGridSectionalLinkClicked'] === true) {
        let aSectionalPopupScreen = false;
        let sectionalPopupOutnames = JSON.parse(JSON.stringify(this.F2FunctionNames));
        let dependantSection = [];
        delete this.props.outnames.data[0].name['addToGridSectionalLinkClicked'];
        sectionalPopupOutnames.parentGridXpathAndsessionID = null;
        sectionalPopupOutnames.parentGridXpathAndsessionID = this.F2FunctionNames.parentGridXpathAndsessionID;

        for (let n = 0; n < this.F2FunctionNames.data[0].name.screendata.length; n++) {
          let dependantSecionId = undefined;
          if (this.F2FunctionNames.data[0].name['addToGridSectionalLinkData'] !== undefined) {
            dependantSecionId = this.F2FunctionNames.data[0].name['addToGridSectionalLinkData'];
            if(this.F2FunctionNames.data[0].name.screendata[n].formData[0][this.F2FunctionNames.data[0].name.screendata[n].sessionID] != null) {
              if(this.F2FunctionNames.data[0].name.screendata[n].formData[0][this.F2FunctionNames.data[0].name.screendata[n].sessionID].data.detailsectionid === dependantSecionId ){
                this.F2FunctionNames.data[0].name['whichSectionClicked'] = this.F2FunctionNames.data[0].name.screendata[n].sessionID;
              }
            }
          }
          //delete this.props.outnames.data[0].name['addToGridSectionalLinkData'];
          let allDependantSections = undefined;
          if (dependantSecionId !== undefined) {
            allDependantSections = new Model().getLeafNodesForId(dependantSecionId);
          }
          let arrayKeys = [];
          if (allDependantSections !== undefined) {
            arrayKeys = Object.keys(allDependantSections);
          }

          if (arrayKeys.length > 0) {
            for (let o = 0; o < arrayKeys.length; o++) {
              let requiredSection = this.F2FunctionNames.data[0].name.screendata.filter(item => item.sessionID === arrayKeys[o])[0];
              if (requiredSection != undefined) {
                aSectionalPopupScreen = true;
                if (dependantSection.length === 0) {
                  dependantSection.push(requiredSection.sessionID);
                } else {
                  if (dependantSection.indexOf(requiredSection.sessionID) === -1) {
                    dependantSection.push(requiredSection.sessionID);
                  }
                }
              }
            }
          }
        }

        if (aSectionalPopupScreen === true) {
          for (let i = 0; i < sectionalPopupOutnames.data[0].name.screendata.length; i++) {
            sectionalPopupOutnames.data[0].name.screendata[i].layoutSize = "full";

            for (let k = 0; k < sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children.length; k++) {
              if (sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children[k].children.widget === "table" && sectionalPopupOutnames.data[0].name.screendata[i].formData[0][sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children[k].children.fieldPath].data.defaultCardView === "true") {
                sectionalPopupOutnames.data[0].name.screendata[i].formData[0][sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children[k].children.fieldPath].data.defaultCardView = "false";
              }
            }

            if (sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection) {
              if (dependantSection.length !== 0) {
                for (let q = 0; q < dependantSection.length; q++) {
                  if (sectionalPopupOutnames.data[0].name.screendata[i].sessionID === dependantSection[q]) {
                    let checkSomeSection = names.screendata.filter(item => item.sessionID === sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection)[0];
                    if (checkSomeSection.formData[0][sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection] != null) {
                      if (checkSomeSection.formData[0][sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection].data.detailsectionid === this.props.outnames.data[0].name['addToGridSectionalLinkData']) {
                        sectionalPopupOutnames.data[0].name.screendata[i].hidden = "false";
                      } else {
                        sectionalPopupOutnames.data[0].name.screendata[i].hidden = "true";
                        if (sectionalPopupOutnames.data[0].name.screendata[i]['triggerSectionButtonEvent'] != null) {
                          delete sectionalPopupOutnames.data[0].name.screendata[i]['triggerSectionButtonEvent']
                        }
                      }
                    }
                    break;
                  } else {
                    sectionalPopupOutnames.data[0].name.screendata[i].hidden = "true";
                    if (sectionalPopupOutnames.data[0].name.screendata[i]['triggerSectionButtonEvent'] != null) {
                      delete sectionalPopupOutnames.data[0].name.screendata[i]['triggerSectionButtonEvent']
                    }
                  }
                }
              }
            } else {
              sectionalPopupOutnames.data[0].name.screendata[i].hidden = "true";
              if (sectionalPopupOutnames.data[0].name.screendata[i]['triggerSectionButtonEvent'] != null) {
                delete sectionalPopupOutnames.data[0].name.screendata[i]['triggerSectionButtonEvent']
              }
            }
          }

          this.replaceSectionalButtonsWithPaletteButtons(sectionalPopupOutnames.data[0].name, dependantSection);

          sectionalPopupOutnames.data[0].name.parentGridXpathAndsessionID = null;
          sectionalPopupOutnames.data[0].name.parentGridXpathAndsessionID = this.F2FunctionNames.data[0].name.parentGridXpathAndsessionID;
          let isMultiLevel = true;
          showF2Component(undefined, sectionalPopupOutnames, this.headername, this.formSubTitle, "myCompact", this.f2CallBackFuncOnSectionalPopupClose, this.props.outnames.data[0].name, "", this.props.assignErrorObj, isMultiLevel, true);
        }
      }
    }

    if (GlobalHelper.globlevar['restoringNames'] === true) {
      let values = this.F2FunctionNames;
      store.dispatch({ type: 'RESTORENAMES', values });
    }

    if (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl") {
      $("[class*=customLabel]").css('text-align', 'right');
    } else {
      $("[class*=customLabel]").css('text-align', 'left');
    }
    var labelElement = $("[class*=customLabel]");
    for (let i = 0; i < labelElement.length; i++) {
      if ($(labelElement[i]).prop("scrollWidth") > $(labelElement[i]).prop("offsetWidth")) {
        $(labelElement[i]).attr("title", $(labelElement[i]).html());
      }
    }
    var dataElement = $("[class*=labelcolon]");
    for (let i = 0; i < dataElement.length; i++) {
      if ($(dataElement[i]).prop("scrollWidth") > $(dataElement[i]).prop("offsetWidth")) {
        $(dataElement[i]).attr("title", $(dataElement[i]).html());
      }
    }

    if (this.namess['check'] !== undefined && this.namess['check'] === "checked for errors." && this.addRowtoGrid !== undefined) {
      this.addRowtoGrid = undefined;
      delete this.namess['check'];
    }

    //Sprint 38 - Task 35 - Issue-1.L60-566-Dropdown value getting clear on click of Save.
    this.get_refreshOnSave_of_defaultFunction();

    //Sprint 27 -Task 20 - New Development - 50 x 50 section hight sholuld be same - 1)for Normal Screen & 2)for Grid to Card Layout Screen.
    //Sprint 34 - 50*50 section height issue is fixed by below new code.
    let halfSectionHeightUpdateFlag = false;//Sprint 35 - hide and show section.
    for (var i = 0; i < $('[class*=floatingboxfollowuptablehalf]').length; i++) {
      if (i % 2 === 0) {
        if ($($('[class*=floatingboxfollowuptablehalf]')[i]) != null && $($('[class*=floatingboxfollowuptablehalf]')[i + 1] != null)) {
          if ($($('[class*=floatingboxfollowuptablehalf]')[i])[0] != null && $($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0] != null) {
            //finding max height between two adjusant half sections....and applying it to section having less height...
            if ($($('[class*=floatingboxfollowuptablehalf]')[i])[0].offsetHeight < $($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0].offsetHeight) {
              //checking table has pagination or not to calculating actual height of half section
              if ($($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0].innerHTML.includes("ant-pagination ant-table-pagination")) {
                if (this.halfsectionheightFlag === false) {//Sprint 35 - 50*50 section height if section has table with pagination
                  if (this.props.themeCode === "myCompact") {

                  } else {
                    $($('[class*=floatingboxfollowuptablehalf]')[i + 1]).css('height', $($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0].offsetHeight + 38);
                  }
                  this.halfsectionheightFlag = true;
                }//End-Sprint 35 - 50*50 section height if section has table with pagination
                $($('[class*=floatingboxfollowuptablehalf]')[i]).css('height', $($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0].offsetHeight);
              } else {
                $($('[class*=floatingboxfollowuptablehalf]')[i]).css('height', $($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0].offsetHeight);
              }
              continue;
            } else {
              if ($($('[class*=floatingboxfollowuptablehalf]')[i])[0].innerHTML.includes("ant-pagination ant-table-pagination")) {
                if (this.halfsectionheightFlag === false) {//Sprint 35 - 50*50 section height if section has table with pagination
                  $($('[class*=floatingboxfollowuptablehalf]')[i]).css('height', $($('[class*=floatingboxfollowuptablehalf]')[i + 1])[0].offsetHeight + 38);
                  this.halfsectionheightFlag = true;
                }//End - Sprint 35 - 50*50 section height if section has table with pagination
                if (this.props.themeCode === "myCompact") {

                } else {
                  $($('[class*=floatingboxfollowuptablehalf]')[i + 1]).css('height', $($('[class*=floatingboxfollowuptablehalf]')[i])[0].offsetHeight);
                }
              } else {
                $($('[class*=floatingboxfollowuptablehalf]')[i + 1]).css('height', $($('[class*=floatingboxfollowuptablehalf]')[i])[0].offsetHeight);
              }
              continue;
            }
          }
        }
      }
      halfSectionHeightUpdateFlag = true;
    }
    //Sprint 35 - hide and show section
    if (halfSectionHeightUpdateFlag === true && this.halfsectionMapFlag === true) {
      for (var i = 0; i < $('[class*=floatingboxfollowuptablehalf]').length; i++) {
        GlobalHelper.halfsectionMap.set($($('[class*=floatingboxfollowuptablehalf]')[i])[0].id, $($('[class*=floatingboxfollowuptablehalf]')[i])[0].offsetHeight)
      }
      this.halfsectionMapFlag = false;
    }//END - Sprint 35 - hide and show section


    if (this.clearTriggered) {
      this.clearTriggered = false;
    }

    if ((this.firstTimeCapture && GlobalHelper.globlevar['ServerSideError'] !== true) || GlobalHelper.globlevar['firstRenderScreen']) {
      GlobalHelper.globlevar['firstRenderScreen'] = false;
      this.firstTimeCapture = false;
      let afterFirstRenderScreen = JSON.parse(JSON.stringify(this.namess));
      if (this.namess.parentGridXpathAndsessionID) {
        afterFirstRenderScreen.parentGridXpathAndsessionID = null;
        afterFirstRenderScreen.parentGridXpathAndsessionID = this.namess.parentGridXpathAndsessionID;
      }
      if (this.firstRenderScreen === null || this.firstRenderScreen === undefined || this.props.orientationType === "popup") {
        this.firstRenderScreen = Object.assign({}, afterFirstRenderScreen);
      }
      this.namess['firstRenderScreenData'] = this.firstRenderScreen;
    }

    //Sprint 36 - Task - Add to Grid functionality fetch newly added data...
    if (GlobalHelper.globlevar['NoRowDataForDetailSection'] === "true") {
      GlobalHelper.globlevar['NoRowDataForDetailSection'] = undefined;
      let detailsectionToPerform = this.namess.screendata.filter(item => item.sessionID === GlobalHelper.globlevar['sectionIdOfTableLinkClicked'])[0].formData[0][GlobalHelper.globlevar['sectionIdOfTableLinkClicked']].data.detailsectionid;
      if (detailsectionToPerform != null) {
        this.setDetailsSectionDataTemp(detailsectionToPerform);
      }
    }//END-Sprint 36 - Task - Add to Grid functionality fetch newly added data...

    let historyContainerDiv_height = 0;
    if ($('[class*=HorizontalTimeline').length !== 0) {

      if (this.props.orientationType === "popup") {
        historyContainerDiv_height = $('#PopUIcontents').height() - 51 - $('[class*=HorizontalTimeline').height();
      } else {
        historyContainerDiv_height = $('#UIcontents').height() - 51 - $('[class*=HorizontalTimeline').height();
      }
    } else {
      if ($('#nodatatimeline').length !== 0) {

        if (this.props.orientationType === "popup") {
          historyContainerDiv_height = $('#PopUIcontents').height() - $('#nodatatimeline').height() - 62;
        } else {
          historyContainerDiv_height = $('#UIcontents').height() - $('#nodatatimeline').height() - 62;
        }
      } else {
        if (this.props.orientationType === "popup") {
          historyContainerDiv_height = $('#PopUIcontents').height() - 15;
        } else {
          historyContainerDiv_height = $('#UIcontents').height() - 15;
        }
      }
    }

    if (this.props.themeCode == "myCompact") {
      historyContainerDiv_height = historyContainerDiv_height + 4;
    }

    $('[class*=historyContainerDiv]').css('cssText', 'height:' + ( historyContainerDiv_height + 45 ) + 'px;')

    let hwidth = 0;
    let containerDiv_width = 0;

    let hybridElement = null;
    if (this.props.orientationType === "popup") {
      hybridElement = $('[class*=PopHybridOneThird]')
    } else {
      hybridElement = $('[class*=HybridOneThird]')
    }

    if ($(hybridElement).length > 0) {

      for (var i = 0; i < $('[class*=HybridTwoThird]').length; i++) {
        if (i === (($('[class*=HybridTwoThird]').length) - 1)) {
          $($('[class*=HybridTwoThird]')[i]).css('cssText', 'margin-bottom:0px');
        }

      }
    }
    if ($(hybridElement).length === 2) {
      for (var i = 0; i < $(hybridElement).length; i++) {
        hwidth = hwidth + $($(hybridElement)[i]).width();

      }

      if (this.props.orientationType === "popup") {
        containerDiv_width = $('#PopUIcontents').width() - hwidth - 28;
      } else {
        containerDiv_width = $('#UIcontents').width() - hwidth - 28;
      }

      $(hybridElement).css('margin-right', '7px');
    }

    if ($(hybridElement).length === 1) {
      hwidth = $(hybridElement).width();

      if (this.props.orientationType === "popup") {
        containerDiv_width = $('#PopUIcontents').width() - hwidth - 17;
      } else {
        containerDiv_width = $('#UIcontents').width() - hwidth - 17;
      }

      $(hybridElement).css('margin-right', '4px');
    }

    if ($(hybridElement).length === 0) {
      if (this.props.orientationType === "popup") {
        containerDiv_width = $('#PopUIcontents').width() - 7;
      } else {
        containerDiv_width = $('#UIcontents').width() - 7;
      }
    }

    let containerDiv_height = 0;
    if (this.props.orientationType === "popup") {
      containerDiv_height = $('#PopUIcontents').height() - 11;
    } else {
      containerDiv_height = $('#UIcontents').height() - 11;
    }

    $('[class*=containerDiv]').css('cssText', 'width:' + (containerDiv_width - 8) + 'px ; height : ' + (containerDiv_height - 58) + 'px;')

    if (this.props.orientationType === "popup") {
      $('#PopHybridCardViewWrapper').css('cssText', 'width:' + (containerDiv_width - 2) + 'px; height:' + (containerDiv_height) + 'px; float:left; margin-top:4px;');
    }
    if (this.props.orientationType === "self") {
      $('#hybridCardViewWrapper').css('cssText', 'width:' + containerDiv_width + 'px; height:' + containerDiv_height + 'px; float:left; margin-top:4px;');
    }

    $('[class*=LoadingContainerDiv]').css('cssText', 'width:' + (containerDiv_width - 8) + 'px ; height : ' + containerDiv_height + 'px;')

    if ($(hybridElement).length === 0) {
      $('[class*=expandableIcon]').css('left', '5px');
      $('[class*=containerDiv]').css('left', '3px')
    }
    else if ($(hybridElement).length === 1) {
      $('[class*=expandableIcon]').css('left', '4px');
    }
    else {
      $('[class*=expandableIcon]').css('left', '9px');
    }

    let countOfOneThirdBoxes = 0;
    let oneThirdBoxWidths = 0;
    if (this.props.orientationType === "popup") {
      countOfOneThirdBoxes = $('[class*=PopFloatingboxfollowuptableOneThird]').length;
      oneThirdBoxWidths = $('[class*=PopFloatingboxfollowuptableOneThird]').width() * countOfOneThirdBoxes;
    } else {
      countOfOneThirdBoxes = $('[class*=floatingboxfollowuptableOneThird]').length;
      oneThirdBoxWidths = $('[class*=floatingboxfollowuptableOneThird]').width() * countOfOneThirdBoxes;
    }
    let cardViewWrapper_width = 0;
    if (countOfOneThirdBoxes > 1) {
      $($('[class*=floatingboxfollowuptableOneThird]')[1]).css('cssText', 'margin-left:3px !important');
      if (this.props.orientationType === "popup") {
        cardViewWrapper_width = $('#PopUIcontents').width() - oneThirdBoxWidths - 29;
      } else {
        cardViewWrapper_width = $('#UIcontents').width() - oneThirdBoxWidths - 29;
      }

    } else {
      if (this.props.orientationType === "popup") {
        if (window.innerWidth < 670) {
          cardViewWrapper_width = window.innerWidth - 80;
        } else {
          cardViewWrapper_width = $('#PopUIcontents').width() - oneThirdBoxWidths - 20;
        }
      } else {
        if (window.innerWidth < 670) {
          cardViewWrapper_width = window.innerWidth - 80;
        } else {
          cardViewWrapper_width = $('#UIcontents').width() - oneThirdBoxWidths - 20;
        }
      }
    }

    let leftProperty = (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? -7 : 0);
    if (this.props.orientationType === "popup") {
      $('[id=PopCardViewWrapper]').css('cssText', 'width:' + (cardViewWrapper_width) + 'px; left:' + leftProperty + 'px');
    } else {
      $('[id=cardViewWrapper]').css('cssText', 'width:' + cardViewWrapper_width + 'px; left:' + leftProperty + 'px');
    }

    $('[class*=floatingboxfollowuptableOneThird]').css('width', '');
    let element = null;
    if($('[class*=floatingboxfollowuptableOneThird1]').length > 0) {
       element = document.getElementById($('[class*=floatingboxfollowuptableOneThird1]')[0].id);
    }
    if(this.props.expandUI == true && GlobalHelper.globlevar["SplitScreenParams"].selectedConjunction === 2 && GlobalHelper.globlevar.linkclicked === true) {
      if(element !=null && element.classList.contains($('[class*=floatingboxfollowuptableOneThird1]')[0].className)){
        element.classList.remove($('[class*=floatingboxfollowuptableOneThird1]')[0].className) ;
        element.classList.add("splitViewWidth");
      }
      $('[class*=customCardLayout]').css('cssText', 'width:50% !important;')
      $('[class*=divcardlayoutmain]').css('cssText', 'height:auto !important;')
      $('[class*=cardvisible]').css('cssText', 'height:auto !important;')
    } else if(this.props.expandUI == false) {
      if(element !=null && element.classList.contains("splitViewWidth")){
        element.classList.remove("splitViewWidth");
	  }
    }
    try {
      if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) || navigator.userAgent.match(/Firefox/i)) {
        if (!navigator.userAgent.match(/Firefox/i)) {
          $('[class*=floatingboxfollowuptableOneThird1] span[class=ant-badge]').css('cssText', 'left:0px !important ; position:relative !important')
        }
        if ($('#twoThirdWrapper').length != 0) {
          new PerfectScrollbar('#twoThirdWrapper');
        }
        if ($('#historyDataDiv').length != 0) {
          new PerfectScrollbar('#historyDataDiv');
        }
      }
      if($('#form_28f4411ecc8041fb9489821f103c77c0')) {
        var secId = $('#cardViewWrapper');
        var wdh = secId && secId[0] && secId[0].offsetWidth - 15;
        $('#form_28f4411ecc8041fb9489821f103c77c0').css('cssText', `float:right !important; max-width: ${wdh}px !important; margin-right: 10px !important`);
      }
    } catch (e) {
      Log4r.error(e);
    }

    this.handleAddCalled = false;
    if (savetrigger == "yes") {
      
      var savenamesjson = this.namess;
      let currencyGroupingSymbol = GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL;
      //gridsavestatus = undefined;
      var flag = false, checkDepend = false;
      //**************************************************************************************
      for (var i = 0; i < this.holdNamess.screendata.length; i++) {
        if (this.holdNamess.screendata[i].sectionConditionallyHiddenFlag != true) {
          let sectionUISchema = this.holdNamess.screendata[i].uiSchema[0].children;
          for (let m = 0; m < sectionUISchema.length; m++) {
            if (sectionUISchema[m].children.widget == "table") {
              var arrTableWidg = this.holdNamess.screendata[i].uiSchema[0].children;
              for (var j = 0; j < arrTableWidg.length; j++) {
                // code for maxlength val in table on save
                let editColumnObj = undefined;
                try {
                  editColumnObj = this.holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.Columns.filter((colItm) => {
                    return colItm.style == "edit";
                  })[0];
                } catch (e) { Log4r.error(e) }
                if (editColumnObj) {
                  let tableDataSource = this.holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.DataSource;
                  let tableColumns = this.holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.Columns;
                  for (var d = 0; d < tableDataSource.length; d++) {
                    for (var c = 0; c < tableColumns.length; c++) {
                      if (tableColumns[c].edit == "true") {
                        let isValid = true;
                        let mantisa = 0;
                        let digitBeforeDecimal = 0;
                        let datatype = tableColumns[c].datatype;
                        let precision = tableColumns[c].precision;
                        if (tableColumns[c].widget == "currency") {
                          let digitAfterDecimal = GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_AFTER_DECIMAL;
                          mantisa = Math.min(digitAfterDecimal, tableColumns[c].mantisa);
                          digitBeforeDecimal = parseInt(precision) - parseInt(mantisa);
                          precision = digitBeforeDecimal + parseInt(mantisa);
                          let value = tableDataSource[d][tableColumns[c].dataIndex];
                          if (!isempty(value) && value != undefined) {
                            value = value.replace(new RegExp(currencyGroupingSymbol, 'g'), "");
                            isValid = validateControlLength(datatype, value, precision, mantisa, digitBeforeDecimal);
                          }
                        }
                        if (tableColumns[c].widget == "text") {
                          mantisa = tableColumns[c].mantisa;
                          digitBeforeDecimal = parseInt(precision) - parseInt(mantisa);
                          let value = tableDataSource[d][tableColumns[c].dataIndex];
                          isValid = validateControlLength(datatype, value, precision, mantisa, digitBeforeDecimal);
                        }
                        if (!isValid) {
                          if (datatype == "number") {
                            let errorMessage = "Value of " + tableColumns[c].title + " is greater than maxlength (" + precision + "," + mantisa + ")."
                            ErrorHandler.addErrorMessage(arrTableWidg[j].children.fieldPath, arrTableWidg[j].children.fieldPath, errorMessage, tableColumns[c].dataIndex, tableDataSource[d].key);
                          }
                        }
                      }
                    }
                  }
                }
                var tempp = this.holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.isrowSelectionMandatory;
                if (tempp === "true") {
                  var TotalErrJson = ErrorHandler.getTotalErrJson();
                  checkDepend = true;
                  var num = this.holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.DataSource.filter(item => "Y" === item.isRowSelected);
                  if (num.length == 0) {
                    flag = true;
                    for (var k = 0; k < TotalErrJson.length; k++) {
                      if (TotalErrJson[k][this.holdNamess.screendata[i].sessionID]) {
                        if (TotalErrJson[k][this.holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]) {
                          // if available..
                        } else {
                          //if not available..
                          var arrMsg = [];
                          if (this.holdNamess.screendata[i].sessionHeader !== "") {
                            arrMsg[arrMsg.length] = this.holdNamess.screendata[i].sessionHeader + " : " + I18NMessage("app.gridRowRequired");
                          }
                          else {
                            arrMsg[arrMsg.length] = I18NMessage("app.gridRowRequired");
                          }

                          TotalErrJson[k][this.holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath] = arrMsg;
                        }
                      }
                    }
                    /*var fObj={};
                    var arrMsg=[];
                    arrMsg[arrMsg.length]="At least one row should be selected for save.";
                    fObj[arrTableWidg[j].children.fieldPath]=arrMsg;
                    var scrnObj={};
                    scrnObj[this.holdNamess.screendata[i].sessionID]=fObj;
                    //this.getErrMsg(scrnObj);*/

                  } else {
                    flag = false;
                    for (var k = 0; k < TotalErrJson.length; k++) {
                      if (TotalErrJson[k][this.holdNamess.screendata[i].sessionID]) {
                        if (TotalErrJson[k][this.holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]) {
                          // if available..
                          TotalErrJson[k][this.holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath] = undefined;
                        } else {
                          //if not available..

                        }
                      }
                    }
                    /* var fObj={};
                    //var arrMsg=[];                arrMsg[arrMsg.length]=undefined;
                    fObj[arrTableWidg[j].children.fieldPath]=undefined;
                    var scrnObj={};
                    scrnObj[this.holdNamess.screendata[i].sessionID]=fObj;
                    this.getErrMsg(scrnObj);
                    Log4r.log("scrn  Objasdfjs...",scrnObj);*/
                  }
                }
                //end already done code
              }
            } else {
              //section level maxlength validation for currency and textwidget;
              if (this.holdNamess.screendata[i].editable) {
                if (sectionUISchema[m].children.edit == "true") {
                  let controlId = sectionUISchema[m].children.fieldPath;
                  let value;
                  if (this.holdNamess.screendata[i].formData[0][controlId] != null)
                    if (Array.isArray(this.holdNamess.screendata[i].formData[0][controlId].data)) {
                      value = this.holdNamess.screendata[i].formData[0][controlId].data[0];
                    } else {
                      value = this.holdNamess.screendata[i].formData[0][controlId].data;
                    }
                  if (!isempty(value) && value != undefined) {
                    let isValid = true;
                    let mantisa = 0;
                    let digitBeforeDecimal = 0;
                    let datatype = sectionUISchema[m].children.datatype;
                    let precision = sectionUISchema[m].children.precision;
                    if (sectionUISchema[m].children.widget == "currency") {
                      let digitAfterDecimal = GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_AFTER_DECIMAL;
                      mantisa = Math.min(digitAfterDecimal, sectionUISchema[m].children.mantisa);
                      digitBeforeDecimal = parseInt(precision) - parseInt(mantisa);
                      precision = digitBeforeDecimal + parseInt(mantisa);
                      isValid = validateControlLength(datatype, value, precision, mantisa, digitBeforeDecimal);
                    }
                    if (sectionUISchema[m].children.widget == "text") {
                      mantisa = sectionUISchema[m].children.mantisa;
                      digitBeforeDecimal = parseInt(precision) - parseInt(mantisa);
                      isValid = validateControlLength(datatype, value, precision, mantisa, digitBeforeDecimal);
                    }
                    if (!isValid) {
                      if (datatype == "number") {
                        let errorMessage = I18NMessage('app.value') + this.holdNamess.screendata[i].schema[0][sectionUISchema[m].children.fieldPath].title + (I18NMessage('app.greaterthan').trim()) + precision + "," + mantisa + ")."
                        ErrorHandler.addErrorMessage(this.holdNamess.screendata[i].sessionID, sectionUISchema[m].children.fieldPath, errorMessage);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (checkDepend) {
        /*START CLONE - L60-2287 - Unable to save the details in the chub retrieval screen as after save the screen goes blank and on refresh the same record is still is present*/
        try{
        GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg = TotalErrJson;
      }
      catch(e){   
          Log4r.log(e);
              }
              //END L60-2287
        ErrorHandler.setTotalErrJson(TotalErrJson);
        ErrorHandler.setHoldCount(0);
      }
      //**************************************************************************************
      savetrigger = "no";
      topvalue = "yes";
      if (this.props.functionMode == "Q") {
        GlobalHelper.globlevar['functionMode'] = "Q";
        GlobalHelper.globlevar['savedFunctionID'] = this.props.functionId;
      }
      else if (this.props.functionMode == "B") {
        GlobalHelper.globlevar['functionMode'] = "B";
        GlobalHelper.globlevar['savedFunctionID'] = this.props.functionId;
      } else if (GlobalHelper.globlevar['linkedFunctionId'] !== undefined && GlobalHelper.globlevar['linkedFunctionId'] !== null) {
        GlobalHelper.globlevar['savedFunctionID'] = GlobalHelper.globlevar['linkedFunctionId'];
        GlobalHelper.globlevar['linkedFunctionId'] = null;
      }
      else {
        GlobalHelper.globlevar['savedFunctionID'] = GlobalHelper.globlevar.functionID;
      }
      var ect = 0;
      var genericCount = 0;
      if (this.namess !== undefined && this.namess['SaveAsDraft'] !== true) {

        ect = ErrorHandler.getTotalErrJsonCount();
        genericCount = ErrorHandler.getGenericErrCount();

      }
      else {
        ErrorHandler.clear();
      }
      if (checkDepend) {
        if (GlobalHelper.globlevar['tabScreen'][this.addTabindex] != undefined) {
          GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg = TotalErrJson;
        }
        ErrorHandler.setTotalErrJson(TotalErrJson);
        ErrorHandler.setHoldCount(0);
      }
      //**************************************************************************************
      savetrigger = "no";
      topvalue = "yes";
      if (this.props.functionMode == "Q") {
        GlobalHelper.globlevar['functionMode'] = "Q";
        GlobalHelper.globlevar['savedFunctionID'] = this.props.functionId;
      }
      else if (this.props.functionMode == "B") {
        GlobalHelper.globlevar['functionMode'] = "B";
        GlobalHelper.globlevar['savedFunctionID'] = this.props.functionId;
      } else if (GlobalHelper.globlevar['linkedFunctionId'] !== undefined && GlobalHelper.globlevar['linkedFunctionId'] !== null) {
        GlobalHelper.globlevar['savedFunctionID'] = GlobalHelper.globlevar['linkedFunctionId'];
        GlobalHelper.globlevar['linkedFunctionId'] = null;
      }
      else {
        GlobalHelper.globlevar['savedFunctionID'] = GlobalHelper.globlevar.functionID;
      }
      var ect = 0;
      var genericCount = 0;
      if (this.namess !== undefined && this.namess['SaveAsDraft'] !== true) {

        ect = ErrorHandler.getTotalErrJsonCount();
        genericCount = ErrorHandler.getGenericErrCount();

      }
      else {
        ErrorHandler.clear();
      }
      if (ect == 0 || (ect == genericCount)) {
        let chk = "";
        if (GlobalHelper.globlevar['checkNothingToSave'] == true && (this.namess !== undefined && this.namess['SaveAsDraft'] !== true)) {
          chk = this.checkNothingToSave();
        }
        else {
          chk = false;
        }

        if (chk == true) {
          if (GlobalHelper.globlevar['tabScreen'][this.addTabindex] != undefined) {
            GlobalHelper.globlevar['tabScreen'][this.addTabindex].setErrorMessage = 'Nothing to save !!';
          }
          ErrorHandler.setstatusES("w");
          ErrorHandler.setErrMessage("Nothing to save !!");
          responsestatus = undefined;
          GlobalHelper.globlevar['savedandfetch'] = false;
          GlobalHelper.globlevar['buttonSpin'] = false;//Sprint 45 - To remove spin from button palette - used in data-service.js & Palette.js
          this.forceUpdate();

        }
        else {
          GlobalHelper.globlevar['afterSaveDataFlag'] = true;

          var values = "";
          if (GlobalHelper.globlevar['summaryConfigType_save'] == true && this.props.orientationType !== "popup") {
            values = generateQueryStrFuncationbaselayout(this.holdNamess)
          }
          else {
            values = generateQueryStr(this.holdNamess);
          }

          //ErrorHandler.setstatusES("s");
          //ErrorHandler.setErrMessage("SAVED Successfully...");
          var rfsh = this.state.refreshERROR;
          this.setState({
            refreshERROR: !rfsh,
          })

          if (GlobalHelper.globlevar['functionMode'] == "Q") {
            //-----code added to skip closing of quickfunction screen after save
            var jsonTxt;
            let contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
            let contextencodevalue = contextprimarykeyvalue[0] + "=" + encodeURIComponent(contextprimarykeyvalue[1]);
            let url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['savedFunctionID'] + "&functionMode=" + GlobalHelper.globlevar['functionMode'] + "&";
            let sid_GetTemplateUrl  = url.split("?")[1];
            let _stdata_sid_GetTemplateUrl = getSTData("/"+GlobalHelper.menuContext+"/", sid_GetTemplateUrl); 
           
            request
              .post(url)
              .send(values.domaindata)
              .set('Accept', 'application/xml')
              .set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8;')
              .query({_SID_:(_stdata_sid_GetTemplateUrl.SID + _stdata_sid_GetTemplateUrl.SINT)})
					    .query({_ADF_:""})
              .end((err, res) => {
                if (err) {
                  const names = JSON.parse('["/reactapp/app/index"]');
                }
                else {
                  var txml;
                  let succFlag = true;
                  if (res.text !== "" && res.text !== undefined && res.text !== null) {
                    let tempJson = JSON.parse(res.text);
                    if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
                      let errjsn = tempJson.__f2_messages__;
                      for (var i = 0; i < errjsn.length; i++) {
                        if (errjsn[i][0] == "E") {
                          succFlag = false;
                          break;
                        }
                      }
                    }
                    tempJson['SuccessFlag'] = succFlag;
                    tempJson['SuccessFlagReRender'] = true;
                    var jsonTxt;
                      jsonTxt = JSON.stringify(tempJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
                    
                    jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
                    let names = JSON.parse(jsonTxt).name;
                    if (names.data[0].name.SuccessFlag !== undefined) {
                      ErrorHandler.setTotalErrJson([]);
                      ErrorHandler.setTotalWarningsJson([]);
                      ErrorHandler.setTotalInfoMessageJson([]);
                      ErrorHandler.setTotalSuccessMessageJson([]);
                      let ttlErrJsn;
                      let ttlErrJsnOrig;
                      let totalWarnJsn;
                      let totalInfoJsn;
                      let totalSuccJsn;
                      var errjsn = names.data[0].name.__f2_messages__;
                      var sesID;

                      try {
                        let cflag = false;
                        var ttlErrJsnOrig = ErrorHandler.getTotalErrJson();
                        let totalWarnJsn = ErrorHandler.getTotalWarningsJson();
                        let totalInfoJsn = ErrorHandler.getTotalInfoMessageJson();
                        let totalSuccJsn = ErrorHandler.getTotalSuccessMessageJson();
                        for (var i = 0; i < errjsn.length; i++) {
                          let xpth;// = errjsn[i].ctl;
                          cflag = true;
                          if (errjsn[i][2] != "" && errjsn[i][2] != undefined && errjsn[i][2] != null) {
                            xpth = errjsn[i][2];
                          }
                          else {
                            xpth = undefined;
                          }
                          if (errjsn[i][0] == "I") {
                            ttlErrJsn = totalInfoJsn;
                          }
                          else if (errjsn[i][0] == "E") {
                            ErrorHandler.setHoldColorUIScreen('#f5222d');
                            ttlErrJsn = ttlErrJsnOrig;
                          }
                          else if (errjsn[i][0] == "W") {
                            ttlErrJsn = totalWarnJsn;
                          } else if (errjsn[i][0] == "S") {
                            ErrorHandler.setHoldColorUIScreen('#1dd435');
                            ttlErrJsn = totalSuccJsn;
                          } else if (errjsn[i][0] == "D") {
                            let secondsToGo = 2;
                            let dialogTitle = "Dialog Box";
                            if (!isempty(errjsn[i][4])) {
                              dialogTitle = errjsn[i][4];
                            }
                            const modalBox = Modal.success({
                              title: dialogTitle,
                              content: errjsn[i][1],
                            });
                            setTimeout(() => {
                              modalBox.destroy();
                            }, secondsToGo * 1000);
                          }

                          if (errjsn[i][0] !== "S") {
                            GlobalHelper.globlevar.savespin = false;
                          }

                          if (this.refreshOnSave !== true) {
                            GlobalHelper.globlevar.savespin = false;
                          }

                          if (xpth != "" && xpth != null && xpth != undefined) {
                            var aX, fpath;
                            for (var k = 0; k < this.namess.screendata.length; k++) {
                              aX = this.namess.screendata[k].uiSchema[0].children.filter(itm2 => itm2.children.xPath === xpth);
                              if (aX.length > 0) {
                                fpath = aX[0].children.fieldPath;
                                sesID = this.namess.screendata[k].sessionID;
                                break;
                              }
                              else {
                                fpath = undefined;
                                sesID = undefined;
                              }
                            }

                            for (var j = 0; j < ttlErrJsn.length; j++) {
                              if (typeof ttlErrJsn[j][sesID] == typeof {}) {
                                let qwe = [];
                                qwe[0] = errjsn[i][1];
                                ttlErrJsn[j][sesID][fpath] = qwe;
                              }
                            }
                          }
                          else {
                            //var ttlErrJsn = ErrorHandler.getTotalErrJson();
                            if (ttlErrJsn) {
                              if (typeof ttlErrJsn === typeof []) {
                                var res22 = ttlErrJsn.filter(itm => itm["generic"])[0];
                                if (res22) {
                                  if (typeof res22["generic"] === typeof []) {
                                    var checkDuplicate = res22["generic"].filter(itm2 => itm2[0] === errjsn[i][1]);
                                    if (checkDuplicate.length != 0) {
                                    }
                                    else {
                                      let qwe = [];
                                      qwe[0] = errjsn[i][1];
                                      res22["generic"][res22["generic"].length] = qwe;
                                    }
                                  }
                                }
                                else {
                                  let qwe = [];
                                  qwe[0] = errjsn[i][1];
                                  var errMsg = [];
                                  errMsg[errMsg.length] = qwe;
                                  var obj = {};
                                  obj["generic"] = errMsg;
                                  ttlErrJsn[ttlErrJsn.length] = obj;
                                }
                              }
                            }

                          }
                        }
                        GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg = ttlErrJsnOrig;
                        GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalWarnJsn = totalWarnJsn;
                        GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalInfoJsn = totalInfoJsn;
                        GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalSuccJsn = totalSuccJsn;
                        ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
                        ErrorHandler.setTotalWarningsJson(totalWarnJsn);
                        ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
                        ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
                        if (cflag) {
                          ErrorHandler.setHoldCount(0);
                        }
                      }
                      catch (e) {
                        Log4r.log(e);
                      }
                    }
                    if (this.state.isSaveClicked == true) {
                      preData.clear();
                      this.ClearFormData();
                      this.setState({
                        isSaveClicked: false,
                        clearForm: true
                      })
                    }
                  }
                }
              });
          }
          else if (GlobalHelper.globlevar['functionMode'] == "B") {
            GlobalHelper.globlevar['ScreenLayoutNameChk'] = false;
            // GlobalHelper.globlevar['buttonSpin'] = true; // want to show spinner on button pallet only but now working for me.
            GlobalHelper.globlevar.savespin = true; // This is use for L60-2244 to show spinner on save hit.
            store.dispatch({ type: 'SAVEDATABULKOPERATION', values, refreshQB: this.props.refreshQB });
            if (this.state.isSaveClicked == true) {
              preData.clear();
              this.ClearFormData();
              this.setState({
                isSaveClicked: false,
                clearForm: true
              })
            }
          }

          if (activeMenu !== undefined && activeMenu.refreshOnSave == "Y") {
            this.refreshOnSave = true;
          }
          if (GlobalHelper.globlevar.isreadysaveclicked && this.addRowtoGrid === undefined) {
            GlobalHelper.globlevar.isreadysaveclicked = undefined;

            if (GlobalHelper.globlevar.calculatedPkValuesForSave !== undefined && GlobalHelper.globlevar.calculatedPkValuesForSave.length !== 0) {
              let calculatedPkValues = GlobalHelper.globlevar.calculatedPkValuesForSave;
              if (this.props.orientationType === "popup") {
                this.SaveF2function(values, calledFromSubmit, buttonIdOnsave, calculatedPkValues);
              } else {
                if (this.props.screenLayouType !== "BulkFunction") {
                  store.dispatch({ type: 'SAVEDATA', values, calledFromSubmit, buttonIdOnsave, calculatedPkValues, orientationType: this.props.orientationType, refreshOnSave: this.refreshOnSave });
                }
              }

            }
            else {
              if (this.props.orientationType === "popup") {
                this.SaveF2function(values, calledFromSubmit, buttonIdOnsave);
              } else {
                if (this.props.screenLayouType !== "BulkFunction") {
                  store.dispatch({ type: 'SAVEDATA', values, calledFromSubmit, buttonIdOnsave, orientationType: this.props.orientationType, refreshOnSave: this.refreshOnSave });
                }
              }

            }
          }
          else if (GlobalHelper.globlevar.isreadysaveclicked == undefined && this.addRowtoGrid === undefined) {
            if (GlobalHelper.globlevar.calculatedPkValuesForSave !== undefined && GlobalHelper.globlevar.calculatedPkValuesForSave.length !== 0) {
              let calculatedPkValues = GlobalHelper.globlevar.calculatedPkValuesForSave;
              if (this.props.orientationType === "popup") {
                this.SaveF2function(values, calledFromSubmit, buttonIdOnsave, calculatedPkValues);
              } else {
                if (this.props.screenLayouType !== "BulkFunction") {
                  store.dispatch({ type: 'SAVEDATA', values, calledFromSubmit, buttonIdOnsave, calculatedPkValues, orientationType: this.props.orientationType, refreshOnSave: this.refreshOnSave });
                }
              }

            }
            else {
              if (this.props.orientationType === "popup") {
                this.SaveF2function(values, calledFromSubmit, buttonIdOnsave);
              } else {
                if (this.props.screenLayouType !== "BulkFunction") {
                  store.dispatch({ type: 'SAVEDATA', values, calledFromSubmit, buttonIdOnsave, orientationType: this.props.orientationType, refreshOnSave: this.refreshOnSave });
                }

              }

            }

          }
          else if (GlobalHelper.globlevar.isreadysaveclicked == false) {
            gridsavestatus = true;
          }

          /*if(this.shouldCloseBeCalled){
        this.shouldCloseBeCalled = false;
        this.callClose();
        }*/
        }//END OF ELSE : IF SOME NEW DATA IS ADDED OR MODIFIED
      }// END OF IF : ERROR COUNT IS ZERO
      else {
        GlobalHelper.globlevar['buttonSpin'] = false;//Sprint 45 - To remove spin from button palette - used in data-service.js & Palette.js
      }
      //this.addRowtoGrid = undefined;
      this.setState({
        isSaveClicked: false
      })
    }// END OF IF : savetrigger=="yes"
    setTimeout(() => {
      if (this.addRowToGridTriggered === "Yes") {
        this.addRowToGridTriggered = "No";
        if (ErrorHandler.getErrCount() === 0) {
          this.buttonTriggered = { 'buttonTriggered': true, 'buttonClicked': this.buttonClicked };
          this.forceUpdate();
        }
      }
    }, 1000);


    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) {
      $('.MainLayoutDefault__MainData___2JvWs').css("top", "5px");
      $('.MainLayoutDefault__DataBlock2___2XP-m').css("top", "7px");

      $('.MainLayoutDark__MainData___1r6N1').css("top", "5px");
      $('.MainLayoutDark__DataBlock2___TSAuK').css("top", "7px");

      $('.MainLayoutRedThm__MainData___A6sWo').css("top", "5px");
      $('.MainLayoutRedThm__DataBlock2___F-765').css("top", "7px");
      $('.MainLayoutRedThm__customAvatar1___3e39B').css("cssText", "border: none !important;");
    }

    if (window.event) {
      $('[class*=timeLineRadioButtons]').on('mousewheel', function (event) {

        event = window.event;

        if (event.wheelDelta > 0) {
          $(this).scrollLeft($(this).scrollLeft() + 10);
        }
        if (event.wheelDelta < 0) {
          $(this).scrollLeft($(this).scrollLeft() - 10);
        }
        event.preventDefault();
      });
    } else {
      $('[class*=DataBlock1]').on('DOMMouseScroll', function (event) {
        if (event.originalEvent.detail < 0) {
          $(this).scrollLeft($(this).scrollLeft() + 10);
        }
        if (event.originalEvent.detail > 0) {
          $(this).scrollLeft($(this).scrollLeft() - 10);
        }
        event.preventDefault();
      });
    }


    if (window.event) {
      $('[id=cardHeaderMainBlock]').on('mousewheel', function (event) {

        event = window.event;

        if (event.wheelDelta > 0) {
          $(this).scrollLeft($(this).scrollLeft() + 10);
        }
        if (event.wheelDelta < 0) {
          $(this).scrollLeft($(this).scrollLeft() - 10);
        }
        event.preventDefault();
      });
    } else {
      $('[id=cardHeaderMainBlock]').on('DOMMouseScroll', function (event) {
        if (event.originalEvent.detail < 0) {
          $(this).scrollLeft($(this).scrollLeft() + 10);
        }
        if (event.originalEvent.detail > 0) {
          $(this).scrollLeft($(this).scrollLeft() - 10);
        }
        event.preventDefault();
      });
    }

    var lastElement = $('[class*=DataBlock1] > div').length - 1;
    var lastDivPosition;
    if (GlobalHelper.globlevar.colorCodeForCircleInHeader !== undefined) {
      $('[class*=HeadDataDiv]').width($('[class*=HeadDivWrap]').width() - $('[class*=HeadIdDiv]').width() - $('#colorCodeBlock').width());
    } else {
      $('[class*=HeadDataDiv]').width($('[class*=HeadDivWrap]').width() - $('[class*=HeadIdDiv]').width());
    }

    for (var i = 0; i < $('[class*=DataBlock1] > div').length; i++) {
      if (i === (($('[class*=DataBlock1] > div').length) - 1)) {
        lastDivPosition = $($('[class*=DataBlock1] > div')[i]).offset().top;
      }
    }

    if (lastDivPosition > 100) {
      var rightPosition;
      var leftPosition;

      rightPosition = $('[class*=DataBlock1]').width() - ($($('[class*=DataBlock1] > div')[lastElement]).position().left + $($('[class*=DataBlock1] > div')[lastElement]).outerWidth());
      leftPosition = $($('[class*=DataBlock1] > div')[0]).position().left;

      if (leftPosition == 0) {
        $('[class*=HiddenDivRight]').css("display", "block");
        $('[class*=rightScrollButton]').css("display", "block");
      }

      $('[class*=DataBlock1]').scroll(function () {

        rightPosition = $('[class*=DataBlock1]').width() - ($($('[class*=DataBlock1] > div')[lastElement]).position().left + $($('[class*=DataBlock1] > div')[lastElement]).outerWidth());
        leftPosition = $($('[class*=DataBlock1] > div')[0]).position().left;

        if (rightPosition == 0.015625 || rightPosition == 0.328125 || rightPosition < -0 && rightPosition > -20) {
          $('[class*=HiddenDivRight]').css("display", "none");
          $('[class*=rightScrollButton]').css("display", "none");
          $('[class*=HiddenDivLeft]').css("display", "block");
          $('[class*=leftScrollButton]').css("display", "block");
        }

        else if (leftPosition == 0) {
          $('[class*=HiddenDivRight]').css("display", "block");
          $('[class*=rightScrollButton]').css("display", "block");
          $('[class*=HiddenDivLeft]').css("display", "none");
          $('[class*=leftScrollButton]').css("display", "none");
        }

        else if (rightPosition < -0 && leftPosition < -0) {
          $('[class*=HiddenDivRight]').css("display", "block");
          $('[class*=rightScrollButton]').css("display", "block");
          $('[class*=HiddenDivLeft]').css("display", "block");
          $('[class*=leftScrollButton]').css("display", "block");
        }
      })

      $('[class*=DataBlock1]').width($('[class*=HeadDataDiv]').width() - 42);
      $('[class*=DataBlock1]').css({ "left": "20px", "overflowX": "scroll", "overflowY": "hidden", "whiteSpace": "nowrap" });

      if (window.event) {
        $('[class*=DataBlock1]').on('mousewheel', function (event) {

          event = window.event;

          if (event.wheelDelta > 0) {
            $(this).scrollLeft($(this).scrollLeft() + 10);
          }
          if (event.wheelDelta < 0) {
            $(this).scrollLeft($(this).scrollLeft() - 10);
          }
          event.preventDefault();
        });
      }
      else {
        $('[class*=DataBlock1]').on('DOMMouseScroll', function (event) {
          if (event.originalEvent.detail < 0) {
            $(this).scrollLeft($(this).scrollLeft() + 10);
          }
          if (event.originalEvent.detail > 0) {
            $(this).scrollLeft($(this).scrollLeft() - 10);
          }
          event.preventDefault();
        });
      }
    }

    $('[class*=leftScrollButton]').click(function () {

      $('[class*=DataBlock1]').animate({ scrollLeft: "-=50px" });
    });

    $('[class*=rightScrollButton]').click(function () {

      $('[class*=DataBlock1]').animate({ scrollLeft: "+=50px" });
    });

    var lastIconElement = $('[class*=MyHeaderDiv] > div[class*=iconGroup]').length - 1;
    var lastIconPosition;

    for (var i = 0; i < $('[class*=MyHeaderDiv] > div[class*=iconGroup]').length; i++) {
      if (i === lastIconElement) {
        lastIconPosition = $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[i]).offset().top;
      }
    }
    if (lastIconPosition > 210 || $('[class*=iconGroup]').width() > $('[class*=MyHeaderDiv]').width()) {

      var rightPosition;
      var leftPosition;

      rightPosition = $('[class*=MyHeaderDiv]').width() - ($($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).position().left + $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).outerWidth());
      leftPosition = $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[0]).position().left;

      if (leftPosition == 0) {
        $('[class*=SubHDR]').css("display", "block");
        $('[class*=SubRSB]').css("display", "block");
      }

      $('[class*=MyHeaderDiv]').scroll(function () {

        rightPosition = $('[class*=MyHeaderDiv]').width() - ($($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).position().left + $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).outerWidth());
        leftPosition = $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[0]).position().left;

        if (rightPosition == 10) {
          $('[class*=SubHDR]').css("display", "none");
          $('[class*=SubRSB]').css("display", "none");
          $('[class*=SubHDL]').css("display", "block");
          $('[class*=SubLSB]').css("display", "block");
        }

        else if (leftPosition == 0) {
          $('[class*=SubHDR]').css("display", "block");
          $('[class*=SubRSB]').css("display", "block");
          $('[class*=SubHDL]').css("display", "none");
          $('[class*=SubLSB]').css("display", "none");
        }

        else if (rightPosition < -0 && leftPosition < -0) {
          $('[class*=SubHDR]').css("display", "block");
          $('[class*=SubRSB]').css("display", "block");
          $('[class*=SubHDL]').css("display", "block");
          $('[class*=SubLSB]').css("display", "block");
        }
      })

      $('[class*=MyHeaderDiv]').width($('[class*=headerConslidercssfollowup]').width() - 40);
      $('[class*=MyHeaderDiv]').css({ "left": "10px", "overflowX": "scroll", "overflowY": "hidden", "whiteSpace": "nowrap" });

      if (window.event) {
        $('[class*=MyHeaderDiv]').on('mousewheel', function (event) {

          event = window.event;

          if (event.wheelDelta > 0) {
            $(this).scrollLeft($(this).scrollLeft() + 10);
          }
          if (event.wheelDelta < 0) {
            $(this).scrollLeft($(this).scrollLeft() - 10);
          }
          event.preventDefault();
        });
      }
      else {
        $('[class*=MyHeaderDiv]').on('DOMMouseScroll', function (event) {
          if (event.originalEvent.detail < 0) {
            $(this).scrollLeft($(this).scrollLeft() + 10);
          }
          if (event.originalEvent.detail > 0) {
            $(this).scrollLeft($(this).scrollLeft() - 10);
          }
          event.preventDefault();
        });
      }
    }

    $('[class*=SubLSB]').click(function () {

      $('[class*=MyHeaderDiv]').animate({ scrollLeft: "-=50px" });
    });

    $('[class*=SubRSB]').click(function () {

      $('[class*=MyHeaderDiv]').animate({ scrollLeft: "+=50px" });
    });


    if (responsestatus === "S") {
      if (topvalue !== undefined) {
        topvalue = undefined;
        // this.handleClick("CLEAR","sesHeadr");
        this.setState({ clearForm: true });
      }
    }
    /*changes made to clera popserach*/
    if (GlobalHelper.globlevar.popsearchclear === true) { GlobalHelper.globlevar.popsearchclear = false; }
    /*end*/
    $('[class*=timeLineIcon]').css('cssText', 'position:absolute !important; bottom:0px !important;');
    if(this.namess['whichSectionClicked'] != null){
      if((GlobalHelper.globlevar['showF2ModalClosed'].get(this.namess['whichSectionClicked']) === true) || (GlobalHelper.globlevar['sectionScroll'] == true)){
        $('#form_' + this.namess['whichSectionClicked']).focus();
      }
    }
    GlobalHelper.globlevar['showF2ModalClosed'] = new Map();
    console.log("DidUpdated Names", this.namess)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.customHeaderFunctionsToRender !== nextProps.customHeaderFunctionsToRender){
        this.customHeaderFunctionsToRender = nextProps.customHeaderFunctionsToRender;
    }

    if(this.customHeaderFunctionIndex !== nextProps.customHeaderFunctionIndex){
        this.customHeaderFunctionIndex = nextProps.customHeaderFunctionIndex;
    }

    if (this.props.outnames !== nextProps.outnames) {
      this.F2FunctionNames = nextProps.outnames;
      this.namess = nextProps.outnames.data[0].name;
    }

    if (nextProps.themeCode != this.props.themeCode) {
      if (this.props.themeCode == "myDefault") {
        this.setState({ themeName: nextProps.themeCode });
      }
      else if (this.props.themeCode == "myDark") {
        this.setState({ themeName: nextProps.themeCode });
      }
      else if (this.props.themeCode == "myRed") {
        this.setState({ themeName: nextProps.themeCode });
      }
      else if (this.props.themeCode == "myCompact") {
        this.setState({ themeName: nextProps.themeCode });
      }
    }
    else { }
  }

  state = {
    collapsed: true,
    rightcollapsed: true,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  righttoggle = () => {
    this.setState({
      rightcollapsed: !this.state.rightcollapsed,
    });
  }

  setFullTableClass(valueStyleFullTable) {
    if (valueStyleFullTable === null || valueStyleFullTable === undefined || valueStyleFullTable === " ") {
      return stylesfu.floatingboxfollowuptablefull1;
    }
    else {
      if (valueStyleFullTable === false) {
        return stylesfu.floatingboxfollowuptablefull;
      }
      else {
        return stylesfu.floatingboxfollowuptablefull1;
      }
    }
  }

  setHalfTableClass(valueStyleHalfTable) {
    if (valueStyleHalfTable === null || valueStyleHalfTable === undefined || valueStyleHalfTable === " ") {
      return stylesfu.floatingboxfollowuptablehalf1;
    }
    else {
      if (valueStyleHalfTable === false) {

        return stylesfu.floatingboxfollowuptablehalf;
      }
      else {
        return stylesfu.floatingboxfollowuptablehalf1;
      }
    }
  }

  setTwoThirdHalfTableClass(valueStyleHalfTable) {
    if (valueStyleHalfTable === null || valueStyleHalfTable === undefined || valueStyleHalfTable === " ") {
      return stylesfu.gridtwothirdhalfscreen;
    }
    else {
      if (valueStyleHalfTable === false) {
        return stylesfu.gridtwothirdhalfscreen_chk;
      }
      else {
        return stylesfu.gridtwothirdhalfscreen;
      }
    }
  }

  setOneThirdTableClass(valueStyleHalfTable) {
    if (valueStyleHalfTable === null || valueStyleHalfTable === undefined || valueStyleHalfTable === " ") {
      if (this.props.orientationType === "popup") {
        return stylesfu.PopFloatingboxfollowuptableOneThird1;
      } else {
        return stylesfu.floatingboxfollowuptableOneThird1;
      }
    }
    else {
      if (valueStyleHalfTable === false) {
        if (this.props.orientationType === "popup") {
          return stylesfu.PopFloatingboxfollowuptableOneThird;
        } else {
          return stylesfu.floatingboxfollowuptableOneThird;
        }
      }
      else {
        if (this.props.orientationType === "popup") {
          return stylesfu.PopFloatingboxfollowuptableOneThird1;
        } else {
          return stylesfu.floatingboxfollowuptableOneThird1;
        }
      }
    }
  }

  setTwoThirdTableClass(valueStyleHalfTable, layoutSize) {
    if (valueStyleHalfTable === null || valueStyleHalfTable === undefined || valueStyleHalfTable === " ") {
      return stylesfu.floatingboxfollowuptableTwoThird1;
    }
    else {
      if (valueStyleHalfTable === false) {
        return stylesfu.floatingboxfollowuptableTwoThird;
      }
      else {
        if (layoutSize == "half" && GlobalHelper.globlevar.crdView == true) {
          return stylesfu.floatingboxfollowuptableTwoThird1_cardview;
        } else {
          return stylesfu.floatingboxfollowuptableTwoThird1;
        }
      }
    }
  }

  setOneThirdHybridClass(valueStyleHalfTable) {
    if (valueStyleHalfTable === null || valueStyleHalfTable === undefined || valueStyleHalfTable === " ") {
      if (this.props.orientationType === "popup") {
        return stylesfu.PopHybridOneThird1;
      } else {
        return stylesfu.HybridOneThird1;
      }
    }
    else {
      if (valueStyleHalfTable === false) {
        if (this.props.orientationType === "popup") {
          return stylesfu.PopHybridOneThird;
        } else {
          return stylesfu.HybridOneThird;
        }
      }
      else {
        if (this.props.orientationType === "popup") {
          return stylesfu.PopHybridOneThird1;
        } else {
          return stylesfu.HybridOneThird1;
        }
      }
    }
  }

  setTwoThirdHybridClass(valueStyleHalfTable) {
    if (valueStyleHalfTable === null || valueStyleHalfTable === undefined || valueStyleHalfTable === " ") {
      return stylesfu.HybridTwoThird1;
    }
    else {
      if (valueStyleHalfTable === false) {
        return stylesfu.HybridTwoThird;
      }
      else {
        return stylesfu.HybridTwoThird1;
      }
    }
  }

  returnEmptyTwoThirdContainer(namess) {
    if (this.createHybridView === true && (GlobalHelper.globlevar.hybridView === false || GlobalHelper.globlevar.hybridView === undefined)) {
      return (
        <div className={stylesfu.LoadingContainerDiv}>
          <span style={{ top: "45%", position: "relative", display: "inline-block" }}>
            <Spin spinning={true}>
              <Alert
                message="Loading LOS Screen"
                description="Further details are about to load."
                type="info"
              />
            </Spin>
          </span>
        </div>
      );
    }
    else {
      return null;
    }
  }


  handleNullDataForCheckBox(screenDataNamess) {
    if (screenDataNamess.screendata !== undefined && screenDataNamess.screendata !== "") {
      for (let namesIterator = 0; namesIterator < screenDataNamess.screendata.length; namesIterator++) {
        try {
          let childrenArray = screenDataNamess.screendata[namesIterator].uiSchema[0].children;
          let childrenArrayLength = childrenArray.length;
          for (let tempIter = 0; tempIter < childrenArrayLength; tempIter++) {

            if (childrenArray[tempIter].children.widget === "checkbox") {
              let fieldPathforSame = childrenArray[tempIter].children.fieldPath;
              let dataForSame = screenDataNamess.screendata[namesIterator].formData[0][fieldPathforSame].data;
              if (dataForSame == undefined || dataForSame == null || dataForSame == "" || dataForSame == {}) {
                screenDataNamess.screendata[namesIterator].formData[0][fieldPathforSame].data = 'N';
              }
            }
          }
        }
        catch (e) { Log4r.error(e) }
      }
    }
  }

  componentDidMount() {

    $('[class=widget_span]:empty').css('display', 'none');

    var labelElement = $("[class*=customLabel]");
    for (let i = 0; i < labelElement.length; i++) {
      if ($(labelElement[i]).prop("scrollWidth") > $(labelElement[i]).prop("offsetWidth")) {
        $(labelElement[i]).attr("title", $(labelElement[i]).html());
      }
    }

    var dataElement = $("[class*=labelcolon]");
    for (let i = 0; i < dataElement.length; i++) {
      if ($(dataElement[i]).prop("scrollWidth") > $(dataElement[i]).prop("offsetWidth")) {
        $(dataElement[i]).attr("title", $(dataElement[i]).html());
      }
    }


    $('#NextDisabled').prop('disabled', true);
    $('#NextDisabled2').prop('disabled', true);
    GlobalHelper.globlevar['firstRenderScreen'] = true;
    if (this.firstTimeCapture == false && GlobalHelper.globlevar.toggleClicked !== true) {
      this.firstTimeCapture = true;
    }

    if (GlobalHelper.globlevar["onDetailSectionLoad"] && this.F2FunctionNames.data[0].name !== undefined) { // onDetailSectionLoad() custom method will call on click of summeryGrid link / card click.
      GlobalHelper.globlevar["onDetailSectionLoad"] = false;
      try {
        let utilObject = new onLoadUtil();
        let method = "onDetailSectionLoad";
        utilObject[method](this.F2FunctionNames.data[0].name);
      }
      catch (e) { Log4r.error(e) }
    }

    if (GlobalHelper.globlevar["onload"] && this.F2FunctionNames.data[0].name !== undefined) {
      GlobalHelper.globlevar["onload"] = false;
      try {
        let utilObject = new onLoadUtil();
        let method = "onloadcollectionutil";
        utilObject[method](this.F2FunctionNames.data[0].name);
      }
      catch (e) { Log4r.error(e) }
    }
    temp = true;
    this.setState({
      editable: tempJsonEditPropertyFlag,
      completed: true,
      visible: false,
      widths: this.props.widths,
      themeName: this.props.themeCode
    }, () => {
      let countOfOneThirdBoxes = 0;
      let oneThirdBoxWidths = 0;
      if (this.props.orientationType === "popup") {
        countOfOneThirdBoxes = $('[class*=PopFloatingboxfollowuptableOneThird]').length;
        oneThirdBoxWidths = $('[class*=PopFloatingboxfollowuptableOneThird]').width() * countOfOneThirdBoxes;
      } else {
        countOfOneThirdBoxes = $('[class*=floatingboxfollowuptableOneThird]').length;
        oneThirdBoxWidths = $('[class*=floatingboxfollowuptableOneThird]').width() * countOfOneThirdBoxes;
      }

      let cardViewWrapper_width = 0;
      if (countOfOneThirdBoxes > 1) {
        $($('[class*=floatingboxfollowuptableOneThird]')[1]).css('cssText', 'margin-left:3px !important');
        if (this.props.orientationType === "popup") {
          cardViewWrapper_width = $('#PopUIcontents').width() - oneThirdBoxWidths - 29;
        } else {
          cardViewWrapper_width = $('#UIcontents').width() - oneThirdBoxWidths - 29;
        }

      } else {
        if (this.props.orientationType === "popup") {
          if (window.innerWidth < 670) {
            cardViewWrapper_width = window.innerWidth - 80;
          } else {
            cardViewWrapper_width = $('#PopUIcontents').width() - oneThirdBoxWidths - 20;
          }
        } else {
          if (window.innerWidth < 670) {
            cardViewWrapper_width = window.innerWidth - 80;
          } else {
            cardViewWrapper_width = $('#UIcontents').width() - oneThirdBoxWidths - 20;
          }
        }
      }

      let leftProperty = (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? -7 : 0);

      if (this.props.orientationType === "popup") {
        $('[id=PopCardViewWrapper]').css('cssText', 'width:' + (cardViewWrapper_width) + 'px; left:' + leftProperty + 'px');
      } else {
        $('[id=cardViewWrapper]').css('cssText', 'width:' + cardViewWrapper_width + 'px; left:' + leftProperty + 'px');
      }


      $('[class*=floatingboxfollowuptableOneThird]').css('width', '');

      if (GlobalHelper.globlevar.detailsectionidsmap !== undefined  && this.props.orientationType != "popup") {
        if (GlobalHelper.globlevar.detailsectionidsmap.get(this.currentChangedForm) !== undefined && GlobalHelper.globlevar.detailsectionidsmap.get(this.currentChangedForm).length !== 0) {
          try {
            var w = $('#form_' + this.currentChangedForm).parent();
            w.animate({ scrollTop: $('#form_' + this.currentChangedForm).position().top }, 50)
          }
          catch (e) { Log4r.log(e) }
        }
      }
    })

    if (this.props.orientationType != "popup") {
      if (Array.isArray(this.namess.screendata)) {
        for (var i = 0; i < this.namess.screendata.length; i++) {
          if (Array.isArray(this.namess.screendata[i].uiSchema[0].children)) {
            let dummyErrJson = {};
            let toCheckChang = {};
            for (var j = 0; j < this.namess.screendata[i].uiSchema[0].children.length; j++) {
              let eachContl = this.namess.screendata[i].uiSchema[0].children[j];
              if (eachContl) {
                if (eachContl.children.widget == "table") {
                  this.namess.screendata[i]['forTableSec'] = true;
                  let holdForChngObj = {};
                  let tableId = eachContl.children.fieldPath;
                  let tmpDataSrc = this.namess.screendata[i].formData[0][tableId].data.DataSource;
                  this.namess.screendata[i].formData[0][tableId].data.Columns.map((colItem, colIndex) => {
                    let colId = colItem.dataIndex;
                    holdForChngObj[colId] = false;
                  })
                  for (var k = 0; k < tmpDataSrc.length; k++) {
                    tmpDataSrc[k]["holdForChngObj"] = JSON.parse(JSON.stringify(holdForChngObj));
                    let arrkeys = Object.keys(tmpDataSrc[k]);
                    let insKsy;
                    arrkeys.map((kItm, kIndx) => {  // NOSONAR: javascript:S2201
                      insKsy = kItm + (k + 1) + "";
                      dummyErrJson[insKsy] = undefined;
                    })
                  }
                }
                else {
                  this.namess.screendata[i]['forTableSec'] = false;
                  dummyErrJson[eachContl.children.fieldPath] = undefined;
                  toCheckChang[eachContl.children.fieldPath] = false;
                }
              }
            }
            this.namess.screendata[i]['dummyErrJson'] = dummyErrJson;
            this.namess.screendata[i]['toCheckChang'] = toCheckChang;
          }
        }
      }
    }
  }

  OpFunction() {
    if (this.state.collapsed == true) {
      return styles.custMenu;
    }
    else {
      return styles.custMenuHide;
    }
  }

  manageFavoriteFunctions() {
    var chkFavoriteYN = "Y";
    var favGroupIndex;
    var i = 0;
    if (this.ellipsisFlag == true) {
      i = Rightsidermenu.length - 2;
    } else {
      i = Rightsidermenu.length - 1;
    }
    if (Rightsidermenu[i].groupid == "FAV") {
      favGroupIndex = i;
      for (var j = 0; j < Rightsidermenu[i].content.length; j++) {
        if (Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']) {
          chkFavoriteYN = "N";
        }
      }
    }
    var requestData = {
      '__functionId': GlobalHelper.globlevar['functionID'],
      'token': 'indus',
      'chkFavoriteYN': chkFavoriteYN
    };

    let url_manageFavoriteFunctions = "/" + GlobalHelper.menuContext + "/secure/listAction.do?_rt=manageFavouriteFunction&";

    let FavouriteFunctionsPostDataUrl = url_manageFavoriteFunctions.split("?")[1];
    let _stdata_favouritefunctions = getSTData("/" + GlobalHelper.menuContext + "/", FavouriteFunctionsPostDataUrl);

    request
      .get("/" + GlobalHelper.menuContext + "/secure/listAction.do?_rt=manageFavouriteFunction&")
      .query({ _SID_: (_stdata_favouritefunctions.SID + _stdata_favouritefunctions.SINT) })
      .query({ _ADF_: "" })
      .set('Accept', 'application/json')
      .query({
        __functionId: GlobalHelper.globlevar['functionID'],
        chkFavoriteYN: chkFavoriteYN
      })
      .send(JSON.stringify(requestData))
      .end((err, res) => {
        if (err) {
          Log4r.log('Error ', err);
        } else {
          var xmlDoc = $.parseXML(res.text);
          var $xml = $(xmlDoc);
          var $title = $xml.find("success");
          var jsonText = $title.text();
          var jsonTxt = jsonText;
          const jsonObj = JSON.parse(jsonTxt);
          if (jsonObj == true && chkFavoriteYN == "Y") {
            for (let i = 0; i < Rightsidermenu.length; i++) {
              if (Rightsidermenu[i].groupid != "FAV") {
                for (let j = 0; j < Rightsidermenu[i].content.length; j++) {
                  if (Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']) {
                    Rightsidermenu[i].content[j].favorite = "Y";
                    Rightsidermenu[favGroupIndex].content.push(Rightsidermenu[i].content[j]);
                    break;
                  }
                }
              }
            }
          } else if (jsonObj == true && chkFavoriteYN == "N") {
            for (let j = 0; j < Rightsidermenu[i].content.length; j++) {
              if (Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']) {
                  Rightsidermenu[i].content[j].favorite = "N";
                }
            }
            for (let i = 0; i < Rightsidermenu[favGroupIndex].content.length; i++) {
              if (Rightsidermenu[favGroupIndex].content[i].id == GlobalHelper.globlevar['functionID']) {
                Rightsidermenu[i].content[i].favorite = "N";
                Rightsidermenu[favGroupIndex].content = Rightsidermenu[favGroupIndex].content.filter(item => item.id !== GlobalHelper.globlevar['functionID']);
                if (groupidFAVCllicked == true) {
                  this.F2FunctionNames.data[0].name = file.name;
                  this.namess = file.name;
                }
                break;
              }
            }
          }
          this.setState({ fav: !this.state.fav })
        }
      })
  }

  pinUnpinDefaultFunction() {

    var functionId;
    if (GlobalHelper.worklistData != undefined && GlobalHelper.worklistData.worklist.userDefFunctionId != null && GlobalHelper.worklistData.worklist.userDefFunctionId == GlobalHelper.globlevar['functionID']) {
      functionId = "";
    } else {
      functionId = GlobalHelper.globlevar['functionID'];
    }
    var requestData = {
      '__functionId': functionId,
      'token': 'indus',
      'txtListEntityId': GlobalHelper.listEntityId
    };

    let url_pinUnpinFunctions = "/" + GlobalHelper.menuContext + "/secure/listAction.do?_rt=setDefaultFunction&";
    let PinUnpinFunctionsPostDataUrl = url_pinUnpinFunctions.split("?")[1];

    let _stdata_pinunpinfunctions = getSTData("/" + GlobalHelper.menuContext + "/", PinUnpinFunctionsPostDataUrl);

    request
      .get("/" + GlobalHelper.menuContext + "/secure/listAction.do?_rt=setDefaultFunction&")
      .query({ _SID_: (_stdata_pinunpinfunctions.SID + _stdata_pinunpinfunctions.SINT) })
      .query({ _ADF_: "" })
      .set('Accept', 'application/json')
      .query({
        __functionId: functionId,
        txtListEntityId: GlobalHelper.listEntityId
      })
      .send(JSON.stringify(requestData))
      .end((err, res) => {
        if (err) {
          Log4r.log('Error ', err);
        } else {
          var xmlDoc = $.parseXML(res.text);
          var $xml = $(xmlDoc);
          var $title = $xml.find("success");
          var jsonText = $title.text();
          var jsonTxt = jsonText;
          const jsonObj = JSON.parse(jsonTxt);
          if (jsonObj == true && functionId != "") {
            GlobalHelper.worklistData.worklist.userDefFunctionId = functionId;
          } else {
            GlobalHelper.worklistData.worklist.userDefFunctionId = "";
          }
          this.setState({ pin: !this.state.pin })
        }
      })
  }

  setPinUnpinIcon() {

    if (GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist.userDefFunctionId != "" && GlobalHelper.worklistData.worklist.userDefFunctionId == GlobalHelper.globlevar['functionID']) {
      return styles.myspanPinned;
    } else {
      return styles.myspanUnpinned;
    }
  }

  setClassRightUI(index, activeness) {
    if (activeness == "yes" && countRightu == 0) {
      return styles.siderrightsettingMenuItemSelected;
    }
    else if (index == right) {
      return styles.siderrightsettingMenuItemSelected;
    }
    else {
      return styles.siderrightsettingMenuItem;
    }
  }

  setClassLeft(index, activeness) {
    if (activeness == "yes" && countLeft == 0) {
      countLeft++;
      return styles.siderleftsettingMenuItemSelected;
    }
    else if (index == left) {
      return styles.siderleftsettingMenuItemSelected;
    }
    else {
      return styles.siderleftsettingMenuItem;
    }
  }

  setMyClass(index, aa) {
    if (aa == 0) {
      return stylesf.iconDSelected;
    }
    if (aa == index) {
      return stylesf.iconDSelected;
    }
    else {
      return stylesf.iconD;
    }
  }

  selectedCustomFunIcon(index) {
    if (this.customHeaderFunctionIndex === index) {
      return styles.headexampleselected;
    }
    else {
      return styles.headexample;
    }
  }

  FunHeadercustomScreenCall(varr, IconFunctionName) {
    funIconIndex = varr;
    this.setState({
      ref: this.state.ref,
    })
    if ((IconFunctionName != undefined) && (IconFunctionName != null) && (IconFunctionName != "")) {
      var custfun = new custutils();
      let custfunction = IconFunctionName;
      let json = custfun["customOnChange"](custfunction);
    }
  }

  HeaderFunCustomScreenCall(index) {
    funIconIndex = index;
    this.setState({
      ref: this.state.ref,
    })
    let methodToBeCalled = eval(window['onHeaderFunCustomScreenCall']);
    GlobalHelper.globlevar['changeTitle'] = undefined;
    let functionId = methodToBeCalled();
    if (functionId != null) {
      let values = functionId;
      //this.props.outnames.f2FunctionId = functionId;
      GlobalHelper.globlevar['HeaderFunCustomScreenCall'] = true;
      GlobalHelper.globlevar.functionID = functionId;
      GlobalHelper.globlevar.linkclicked = false;
      window.dispatchAction(values, 'LAYOUTTOPICON');
    }
  }

  setMyFavClass() {
    var i = 0;
    if (this.ellipsisFlag == true) {
      i = Rightsidermenu.length - 2;
    } else {
      i = Rightsidermenu.length - 1;
    }

    if (Rightsidermenu[i]) {
      if (Rightsidermenu[i].groupid == "FAV") {
        for (var j = 0; j < Rightsidermenu[i].content.length; j++) {
          if (Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']) {
            return styles.headexampleFAV;
          }
        }
      }
    }
    return styles.headexample;
  }

  setFavoriteTooltip() {
    try {
      var i = 0;
      if (this.ellipsisFlag == true) {
        i = Rightsidermenu.length - 2;
      } else {
        i = Rightsidermenu.length - 1;
      }
      if (Rightsidermenu[i]) {
        if (Rightsidermenu[i].groupid == "FAV") {
          for (var j = 0; j < Rightsidermenu[i].content.length; j++) {
            if (Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']) {
              return 'Remove from Favorites';
            }
          }
        }
      }

    } catch (e) {
      Log4r.error(e);
    }

    return 'Add to Favourites';
  }

  checkForUnHiddenSection() {
    let returnFlag = true;
    this.namess.screendata.map((screenObj, index) => {
      if (screenObj.hidden != null && screenObj.hidden != "true") {
        returnFlag = false;
      }
      if (screenObj.hidden == undefined) {
        screenObj.uiSchema[0].children.map((uiobj, i) => {
          if (uiobj.children != null && uiobj.children.widget != "hidden" && uiobj.children.widget != "table") {
            returnFlag = false;
          }
        })
      }
    })
    return returnFlag;
  }

  myFunction(index, name, functionObj) {
    cardHeaderInfo = [];
    activeMenu = functionObj;
    GlobalHelper.globlevar['historyHidden'] = false;//Sprint 32 - To hide History Timeline Function Layout.
    this.refreshOnSave = undefined;

    //refreshOnSave
    if (functionObj != null && functionObj.refreshOnSave != undefined && functionObj.refreshOnSave.toLowerCase() == 'y') {
      this.refreshOnSave = true;
    }
    //this.setState({isClearClicked:false}) ;
    if (this.createHybridView) {
      this.createHybridView = false;
    }

    if (index == defaultFunctionId) {
      this.createHistoryTimelineView = true;
      GlobalHelper.globlevar['HistoryTimelineView'] = true;
      showOnlyCloseButton = null;
    } else {
      if (onlyCloseButtonViews == true) {
        showOnlyCloseButton = true;
      }
      this.createHistoryTimelineView = false;
      GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
    }
    this.setPinUnpinIcon();
    GlobalHelper['DefaultFunctionHeadername'] = undefined;
    GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
    GlobalHelper.globlevar['newFunctionNames'] = undefined;
    GlobalHelper.globlevar['newfunctionInitiated'] = undefined;
    GlobalHelper.globlevar['summaryConfigType'] = undefined;
    GlobalHelper.globlevar.getDataUrls = [];
    GlobalHelper.globlevar.savespin = false;
    GlobalHelper.globlevar.cardCollapseClicked = true;
    GlobalHelper.globlevar.CurrentlyClosedCard = [];
    GlobalHelper.globlevar.selectedCardIndex.clear();
    if (this.containerDiv.length >= 0 || this.hybridCount >= 0) {
      this.containerDiv = [];
      this.hybridCount = 0;
    }
    GlobalHelper.globlevar.hybridView = undefined;

    GlobalHelper.globlevar['timelinedisplay'] = undefined;
    GlobalHelper.globlevar['timelineScreen'] = [];
    GlobalHelper.globlevar['subFuncName'] = undefined;
    names['formSubTitle'] = undefined;//Sprint 38 - Task 53-Custom API to set Layout SubFunction Name/ Sub Title.

    if (GlobalHelper.globlevar.cardLayoutInclusion) {
      GlobalHelper.globlevar.cardLayoutInclusion = undefined;
    }
    this.clearTriggered = false;
    if (GlobalHelper.globlevar.toggleClicked === true) {
      GlobalHelper.globlevar.toggleClicked = undefined;
    }
    if (TimeLineView) {
      TimeLineView = false;
      TimeLineWidth = '0px';
    }

    GlobalHelper.globlevar.targetCard = "";
    this.currentChangedForm = "";
    demoright = false;
    //file.name.screendata[0].layoutSize = "full";
    // if(index!=a)
    // {
    if (GlobalHelper.globlevar.linkclicked === true) {
      GlobalHelper.globlevar.linkclicked = false;
    }
    ErrorHandler.clear();
    /*if(Object.keys(allScrnErrObj).includes(a))    //WORKING CODE FOR ALL BACKUP ERROR
    {
      if(ErrorHandler.getErrCount()>0)
      {
        allScrnErrObj[a]=backuperrjson;
    }else {
        allScrnErrObj[a]=[];
    }
    }      else    {allScrnErrObj[a]=backuperrjson;}
    if(Object.keys(allScrnErrObj).includes(index))
    {backuperrjson=allScrnErrObj[index];}else {backuperrjson=[];
      tempArrForScrn.splice(0,tempArrForScrn.length);}*/

    /*asset summery screen. Grid link clicked false change to default position  */
    GlobalHelper.globlevar.linkclicked = false;

    responsestatus = undefined;
    gridsavestatus = undefined;

    a = index;
    this.formSubTitle = name;
    var values = index;
    //store.dispatch({type: 'LAYOUTRIGHTICON', values});
    GlobalHelper.globlevar['functionID'] = values;
    GlobalHelper.globlevar['savedFunctionID'] = "" + values;
    GlobalHelper.globlevar['demolocalmenuid'] = values;
    GlobalHelper.globlevar['summaryConfigType_save'] = undefined;

    // spring 13 - add button on cardlayout
    GlobalHelper['cardaddbutton'] = false;

    //Sprint 11: Checking wether top menu icons are clicked throgh prompt ui or through on row click of worklist

    screenLoadAndPostSaveFlag = true;

    if(this.props.outnames.data[0].name.layoutType === "CustomScreen"){
     GlobalHelper.globlevar['worklistRefresh'] = true;
     this.props.refreshQB();
    } else {
      if (GlobalHelper.globlevar.promptClicked) {
        let pr_mode = "prompt";
        store.dispatch({ type: 'LAYOUTTOPICON', values, pr_mode });
      } else {
        store.dispatch({ type: 'LAYOUTTOPICON', values });
      }  
    }
  }

  renderButtonPalette(user, i) {
    // if directly landing from userselector page for custom screen. hence check conditions.
    if (GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist !== null) {
      var addSubmit = false;
      if (user.schema[i].submit == undefined) {
        //	if(GlobalHelper.worklistData.worklist.taskId != undefined && GlobalHelper.worklistData.worklist.taskId != "" && showOnlyCloseButton == null){
        if (GlobalHelper.worklistData.worklist.taskId != undefined && GlobalHelper.worklistData.worklist.taskId != "") {
          if ((GlobalHelper.defaultfunction != null && GlobalHelper.defaultfunction.indexOf(GlobalHelper.globlevar['functionID']) >= 0) || GlobalHelper.contextPKValues != undefined && GlobalHelper.contextPKValues != "" && GlobalHelper.contextPKValues.toLowerCase().indexOf("_submitbutton=y") > -1) {
            addSubmit = true;
            this.namess['removedsubmit']=false;
          }
          if (addSubmit && this.namess['removedsubmit'] !== true) {
            user.schema[i]['submit'] = { "title": "" }
            user.uiSchema[i].children.push({ "xType": "col", "span": 6, "children": { "xType": "field", "widget": "button", "fieldPath": "submit" } })
            user.formData[i]['submit'] = { "style": { "type": "default", "size": "large", "label": "SUBMIT", "classname": "paletteClassSave", "icon": "eraser", "accessCat": "W", "buttonCategory": "STANDARD", "eventName": "" } }
          }
        }
      }
      let relevantFunctionId = GlobalHelper.functionAccessMap.get(GlobalHelper.globlevar.functionID);
      if (relevantFunctionId != undefined && relevantFunctionId != null) {
        if ((relevantFunctionId != 2 && relevantFunctionId != 3)
          || (addSubmit && GlobalHelper.defaultfunction != null && GlobalHelper.defaultfunction.indexOf(GlobalHelper.globlevar.functionID) == -1)) {
          for (let butonId in user.formData[i]) {
            if (user.formData[i][butonId].style.accessCat == undefined || user.formData[i][butonId].style.accessCat == "" || user.formData[i][butonId].style.accessCat == "W") {
              delete user.formData[i][butonId];
              delete user.schema[i][butonId];
              for (let j = 0; j < user.uiSchema[i].children.length; j++) {
                if (user.uiSchema[i].children[j].children.fieldPath == butonId) {
                  user.uiSchema[i].children.splice(j, 1);
                  break;
                }
              }
            }
          }
        }
      }
    }

    if (this.hasDetailSection) {
      if (!GlobalHelper.globlevar.linkclicked && this.checkForUnHiddenSection()) {
        for (let buttonId in user.formData[i]) {
          if (buttonId == 'save' || buttonId == 'saveandclose' || buttonId == 'saveandnext' || buttonId == 'submit' || buttonId == 'btnDone') {
            if (GlobalHelper.globlevar.showButtonOnReadonlyScreen === buttonId) {
              user.schema[i][buttonId]['hidden'] = false;
            } else {
              user.schema[i][buttonId]['hidden'] = true;
            }
          }
        }
      }
      else {
        for (let buttonId in user.formData[i]) {
          if (buttonId == 'save' || buttonId == 'saveandclose' || buttonId == 'saveandnext' || buttonId == 'submit' || buttonId == 'btnDone') {
            if (buttonId == 'btnDone' && (GlobalHelper.worklistData.worklist.taskId != undefined && GlobalHelper.worklistData.worklist.taskId != "")) {
              user.schema[i][buttonId]['hidden'] = true;
            } else {
              user.schema[i][buttonId]['hidden'] = false;
            }
          }
        }
      }
      //Issue -Save button visibility issue for summary Grid Section Screen in case of addrow to grid functionality through popup window.
      let hasSectionChanged = false;
      this.namess.screendata.map((objectSec, inx) => {
        if (objectSec != null && objectSec.sessionID != null && objectSec.toCheckChang != null && objectSec.toCheckChang[objectSec.sessionID] != null) {
          if ((objectSec.toCheckChang[objectSec.sessionID] === true || objectSec.toCheckChang[objectSec.sessionID] === "true")) {
            hasSectionChanged = true;
          }
        }
      })
      if (hasSectionChanged == true) {
        for (let buttonId in user.formData[i]) {
          if (buttonId == 'save' || buttonId == 'saveandclose' || buttonId == 'saveandnext' || buttonId == 'submit' || buttonId == 'btnDone') {
            user.schema[i][buttonId]['hidden'] = false;
          }
        }//END - Issue -Save button visibility issue for summary Grid Section Screen in case of addrow to grid functionality through popup window.
      }
    }

 
   if((GlobalHelper.globlevar['historyTimelineclicked']!=undefined && GlobalHelper.globlevar['historyTimelineclicked']==true) )
   {
    names = makeFunctionReadOnly(names);
    names.ACCESS_MODE = 1;
   }

    if (names.ACCESS_MODE == 1 || (GlobalHelper.globlevar['ACCESS_MODE'] == 1 && GlobalHelper.globlevar['historyTimelineclicked'])) {
      GlobalHelper.globlevar['historyTimelineclicked'] = false;
      names = makeFunctionReadOnly(names);
      let key = user.uiSchema[0].children;
      var save = key.filter(itm2 => itm2.children.fieldPath == "save")[0];
      var submit = key.filter(itm2 => itm2.children.fieldPath == "submit")[0];
      var saveandnext = key.filter(itm2 => itm2.children.fieldPath == "saveandnext")[0];
      var saveandclose = key.filter(itm2 => itm2.children.fieldPath == "saveandclose")[0];
      let preview = key.filter(itm2 => itm2.children.fieldPath == "preview")[0];

      if (save !== undefined) {
        user.schema[0][save.children.fieldPath]['hidden'] = true;
      }
      if (submit !== undefined) {
        user.schema[0][submit.children.fieldPath]['hidden'] = true;
      }
      if (saveandnext !== undefined) {
        user.schema[0][saveandnext.children.fieldPath]['hidden'] = true;
      }
      if (saveandclose !== undefined) {
        user.schema[0][saveandclose.children.fieldPath]['hidden'] = true;
      }
      if (preview !== undefined) {
        user.schema[0][preview.children.fieldPath]['hidden'] = true;
      }
    }
    if (this.props.orientationType === "popup" || GlobalHelper.globlevar['hideSubmitButtonflag'] === true) {
      removeButton("submit");
      GlobalHelper.globlevar['hideSubmitButtonflag'] = false;
    }
    if (this.props.orientationType === "popup") {
      let key = user.uiSchema[0].children;
      let submit = key.filter(itm2 => itm2.children.fieldPath == "submit")[0];

      if (submit !== undefined) {
        let addRowtoGrid = key.filter(itm2 => itm2.children.fieldPath == "addRowtoGrid")[0];
        let editRowtoGrid = key.filter(itm2 => itm2.children.fieldPath == "editRowtoGrid")[0];
        //var clearPopupSection =  key.filter(itm2 => itm2.children.fieldPath == "clearPopupSection")[0];
        if (addRowtoGrid !== undefined || editRowtoGrid !== undefined) {
          user.schema[0][submit.children.fieldPath]['hidden'] = true;
        }
      }

      if (names.ACCESS_MODE == 1) {
        let addRowtoGrid = key.filter(itm2 => itm2.children.fieldPath == "addRowtoGrid")[0];
        let editRowtoGrid = key.filter(itm2 => itm2.children.fieldPath == "editRowtoGrid")[0];
        let clearPopupSection = key.filter(itm2 => itm2.children.fieldPath == "clearPopupSection")[0];
        if (addRowtoGrid !== undefined) {
          user.schema[0][addRowtoGrid.children.fieldPath]['hidden'] = true;
        }
        if (editRowtoGrid !== undefined) {
          user.schema[0][editRowtoGrid.children.fieldPath]['hidden'] = true;
        }
        if (clearPopupSection !== undefined) {
          user.schema[0][clearPopupSection.children.fieldPath]['hidden'] = true;
        }
      }
    }

    for (let buttonId in user.formData[i]) {
      if (this.namess['removed' + buttonId] != null) {
        if (this.namess['removed' + buttonId] === true) {
          user.schema[i][buttonId]['hidden'] = true;
        }
      }
    }
    if (GlobalHelper.globlevar['tabScreen'].length > this.addTabindex) {
      if ((GlobalHelper.globlevar['HeaderFunCustomScreenCall'] == true || GlobalHelper.globlevar['tabScreen'][this.addTabindex].HeaderFunCustomScreenCall == true) && GlobalHelper.globlevar.functionID == this.props.outnames.f2FunctionId) {
        GlobalHelper.globlevar['HeaderFunCustomScreenCall'] = false;
        GlobalHelper.globlevar['tabScreen'][this.addTabindex].HeaderFunCustomScreenCall = true;
        let isSavebutton = user.uiSchema[0].children.filter((item)=> item.children.fieldPath == "save" || item.children.fieldPath == "SAVE")[0];
        Log4r.log("isSavebutton => " ,isSavebutton)
        if(isSavebutton == undefined ){
          user.schema[i]['SAVE'] = { "title": "" }
          user.uiSchema[i].children.push({ "xType": "col", "span": 6, "children": { "xType": "field", "widget": "button", "fieldPath": "SAVE" } })
          user.formData[i]['SAVE'] = { "style": { "type": "default", "size": "large", "label": "SAVE", "classname": "paletteClassSave", "icon": "eraser", "accessCat": "W", "buttonCategory": "STANDARD", "eventName": "" } }
        }
      }
    }

    return (<Palette themeCode={this.state.themeName} schema={user.schema[i]} uiSchema={user.uiSchema[i]} formData={user.formData[i]} onClick={this.handleClick} changeRefreshERROR={this.changeRefreshERROR} namess={this.namess} />);
  }

  renderQuickButton(item, i) {
    try {
      let relevantFunctionId = GlobalHelper.functionAccessMap.get(GlobalHelper.globlevar.functionID);
      if (Object.keys(item.formData[i]).length != 0) {
        if (relevantFunctionId != undefined && relevantFunctionId != null) {
          if (relevantFunctionId != 2 && relevantFunctionId != 3) {
            for (let buttonId in item.formData[i]) {
              if (item.formData[i][buttonId].style.accessCat == undefined || item.formData[i][buttonId].style.accessCat == "" || item.formData[i][buttonId].style.accessCat == "W") {
                delete item.formData[i][buttonId];
                delete item.schema[i][buttonId];
                for (let j = 0; j < item.uiSchema[i].children.length; j++) {
                  if (item.uiSchema[i].children[j].children.fieldPath == buttonId) {
                    item.uiSchema[i].children.splice(j, 1);
                    break;
                  }
                }
              }
            }
          }
        }
        return item.uiSchema[i].children.map(this.getQuickButton.bind(this));
      }
    }
    catch (e) {
      Log4r.log("The error is " + e);
    }
  }

  getQuickButton(uiSchema, key) {
    let buttonObj = this.namess.QuickButtonPalette[0].formData[0][uiSchema.children.fieldPath].style;
    let icon = buttonObj.icon;
    let content = buttonObj.label;
    return (<div style={{ position: 'relative', marginRight: 10, display: 'inline-block', cursor: 'pointer' }} onClick={() => this.quickButtons(buttonObj)}>
      <Popover className={styles.pop} placement="bottomRight" content={content} style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover" >
        <FA name={icon} className={this.setPinUnpinIcon()} stack="0.5x" style={{ padding: '6px', fontSize: '16px' }} />
      </Popover>
    </div>);
  }

  quickButtons(buttonObj) {
    if (buttonObj != undefined && buttonObj.buttonCategory == "CUSTOMIZED" && buttonObj.buttonType == "QUICK_BUTTON") {
      var custfun = new custutils();
      let custfunction = buttonObj.eventName;
      let json = custfun["customOnChange"](custfunction);
    }
  }
  renderScreen(user, i) {
    if (GlobalHelper.globlevar['tabScreen'] != null) {
      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex] != null) {
        if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].cardHeaderInfo != null) {
          GlobalHelper.globlevar['tabScreen'][this.addTabindex].cardHeaderInfo = cardHeaderInfo;
        }
      }
    }

    if(this.props.profileFlag == true){
      this.namess.profileFlag = this.props.profileFlag;
    }

    //Task l60-924 - Need to provide hotkeys for sections within function
    if (user.sessionID != null && user.sessionID != "") {
      let key = 'alt+' + (i + 1);
      let formID = 'form_' + user.sessionID;
      GlobalHelper.globlevar['section_formIDMap'].set(key, formID)
    }//END - //Task l60-924 - Need to provide hotkeys for sections within function

    user['collapseKey'] = i;
    if (!temp) {
      return null;
    }
    try {
      if (user.uiSchema[0].children[0].children.widget == "table") {
        if (user.formData[0][user.sessionID]['data']['isTimelineDisplay'] == "true" && user.formData[0][user.sessionID]['data']['summaryConfigType'] !== "F") {
          GlobalHelper.globlevar['timelinedisplay'] = true;
          if (user.uiSchema[0].children[0].children.reactatttimeline !== true) {
            user.uiSchema[0].children[0].children.reactatttimeline = true;
            GlobalHelper.globlevar['timelineScreen'].push(user);
          }
          return null;
        }
      }
      var uiSchemaForSectionRendering = user.uiSchema[0].children;
      var sectionRenderingFlag = false;
      for (let iterationIndex = 0; iterationIndex < uiSchemaForSectionRendering.length; iterationIndex++) {
        if (uiSchemaForSectionRendering[iterationIndex].children.widget != "hidden") {
          sectionRenderingFlag = true;
          break;
        }
      }
      const widgetTypeCheck = uiSchemaForSectionRendering[0].children.widget;
      if (widgetTypeCheck == "table") {
        user.editable = true;
      }
      if (!sectionRenderingFlag) {
        return null;
      }
      else {
        //SPRINT 6- TASK 59 - TO HIDE/SHOW SECTION - Added 'hidden' flag at section level.
        if (user.hidden !== undefined && user.hidden === "true" && (user.triggerSectionButtonEvent === undefined || user.triggerSectionButtonEvent.buttonClicked === undefined)) {
          return null;
        }
        else if (user.sectionConditionallyHiddenFlag == true) {
          return null;
        }
        else {
          if (this.state.completed) {
            var dataSourceParam = user.formData[0];
            var uiSchemaSourceParam = user.uiSchema[0].children;
            if (optionsMapper.size > 0) {
              for (var iterMap = 0; iterMap < uiSchemaSourceParam.length; iterMap++) {
                if (uiSchemaSourceParam[iterMap].children.widget === "select") {
                  let fieldPathParam = uiSchemaSourceParam[iterMap].children.fieldPath;
                  let mapKey = fieldPathParam;
                  if (optionsMapper.has(mapKey)) {

                    //let dataFromSelectField = dataSourceParam[mapKey].options;
                    let dataFromSelectField = uiSchemaSourceParam[iterMap].children.options
                    let resultantArrayFromMap = optionsMapper.get(mapKey);

                    let optionsArrayFrmMap = this.fromMapToFormFieldOptions(dataFromSelectField, resultantArrayFromMap);

                    user.formData[0][mapKey].options = optionsArrayFrmMap;
                  }
                }
              }
            }
            else {
              for (var mapIterator = 0; mapIterator < uiSchemaSourceParam.length; mapIterator++) {
                if (uiSchemaSourceParam[mapIterator].children.widget === "select") {
                  let fieldPathParam = uiSchemaSourceParam[mapIterator].children.fieldPath;

                  //let dataFromSelectField = dataSourceParam[fieldPathParam].options;

                  let dataFromSelectField = uiSchemaSourceParam[mapIterator].children.options;
                  var selectCodeDescMapping = this.optionsIntoArrayConverter(dataFromSelectField);
                  optionsMapper.set(fieldPathParam, selectCodeDescMapping); // Note that key of optionsMapper Map is fieldPath which will be unique32 bit identifier
                  //Each of this 32 bit key will have to be unique atleast in one whole screen.
                }
              }
            }

            var layoutSize = user.layoutSize;
			var summConfigType = undefined;
            var defCardView = undefined;
            var hybridView = undefined;
            this.hybridCount++;

            for (let i = 0; i < user.uiSchema[0].children.length; i++) {
              if(user.formData[0][user.uiSchema[0].children[i].children.fieldPath] != null){
                if(user.formData[0][user.uiSchema[0].children[i].children.fieldPath].data != null){
                  if(user.formData[0][user.uiSchema[0].children[i].children.fieldPath].data.defaultCardView != null){
                    defCardView = user.formData[0][user.uiSchema[0].children[i].children.fieldPath].data.defaultCardView;
                  }
				  if(user.formData[0][user.uiSchema[0].children[i].children.fieldPath].data.summaryConfigType != null){
                    summConfigType = user.formData[0][user.uiSchema[0].children[i].children.fieldPath].data.summaryConfigType;
                    if (summConfigType == "F") {
                      defCardView = false;
                    }
                  }
                }
              }
              // defaultCardView flag is coming with string value as "true" or  "false" so added check against "true" value
              if (user.uiSchema[0].children[i].children.widget === "table" && (defCardView != null && (defCardView === true || defCardView === "true"))) {
                hybridView = true;
                this.createHybridView = true;
                if (GlobalHelper.globlevar.hybridOneThirdCardsCount.indexOf(user.uiSchema[0].children[i].children.fieldPath) === -1) {
                  GlobalHelper.globlevar.hybridOneThirdCardsCount.push(user.uiSchema[0].children[i].children.fieldPath);
                }
              }
            }

            if (hybridView === true) {
              this.hybridCount--;
              return (
                <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setOneThirdHybridClass(user.editable)} aria-label = {user.sessionHeader}>
                  <FA name={"caret-left"} onClick={this.collapseCards.bind(this, user.sessionID)} className={stylesfu.collapsibleIcon} stack="0.5x" />
                  <Suspense fallback={null}>
                    <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} hybridView={hybridView} collapseCards={this.collapseCards} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                  </Suspense>
                </div>
              );
            }

            else {

              let isGridInCard = undefined;
              for (let i = 0; i < GlobalHelper.globlevar.hybridOneThirdCardsCount.length; i++) {
                if (this.namess.addtoGridJsons[GlobalHelper.globlevar.hybridOneThirdCardsCount[i]] != null) {
                  isGridInCard = this.namess.addtoGridJsons[GlobalHelper.globlevar.hybridOneThirdCardsCount[i]].filter((val) => val.sessionID == user.sessionID)[0]
                }
              }

              if (isGridInCard != undefined && this.createHybridView && GlobalHelper.globlevar.hybridOneThirdCardsCount.length > 0) {
                let addingElement = (
                  <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setTwoThirdHybridClass(user.editable)} aria-label = {user.sessionHeader}>
                    <Suspense fallback={null}>
                      <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} isClearClicked={this.clearTriggered} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                    </Suspense>
                  </div>
                );

                this.containerDiv.push(addingElement);

                if (this.containerDiv.length === this.hybridCount) {
                  this.hybridCount = 0;
                  GlobalHelper.globlevar['hybridView'] = true;
                  return (
                    <div style={{ display: "inline-block", position: "relative" }}>
                      <Badge count={GlobalHelper.globlevar.CurrentlyClosedCard.length} style={{ display: (GlobalHelper.globlevar.hybridOneThirdCardsCount.length === GlobalHelper.globlevar.CurrentlyClosedCard.length ? "inline-block" : "none"), top: '12px', left: '8px', position: 'absolute' }}>
                        <FA name={"thumb-tack"} onClick={this.expandCards.bind(this, "expanding")} className={stylesfu.expandableIcon} style={{ display: (GlobalHelper.globlevar.hybridOneThirdCardsCount.length === GlobalHelper.globlevar.CurrentlyClosedCard.length ? "inline-block" : "none") }} stack="0.5x" />
                      </Badge>

                      <div id={this.props.orientationType == "popup" ? 'PopHybridCardViewWrapper' : 'hybridCardViewWrapper'} style={{ display: "inline-block", position: "relative" }}>
                        <div className={stylesfu.cardContainerDiv} style={{ width: '100% !important' }}>
                          <div className={stylesfu.cardContainerHeader}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} className={stylesfu.cardContainerTitle}>
                              <div id={'cardHeaderMainBlock'} style={{ display: "flex", alignItems: "center", alignContent: "center", width: '100%', height: '100%', overflowY: 'hidden', overflowX: 'scroll' }}>
                                {
                                  cardHeaderInfo.map((item, index) => {
                                    return <div style={{ marginRight: 20, whiteSpace: 'nowrap', display: "inline-block", position: "relative" }}>
                                      <div style={{ width: "auto", height: "100%", display: "inline-block", position: "relative" }}>
                                        <span style={{ color: 'black', position: 'relative', left: 5 }}>
                                          {
                                            this.holdNamess.screendata.map((cardTitleObject, cardTitleIndex) => {
                                              if (item.key === cardTitleObject.sessionID) {
                                                return cardTitleObject.sessionHeader;
                                              }
                                            })
                                          }
                                        </span>
                                      </div>
                                      <div style={{ display: "inline-block", position: "relative", fontSize: 25, top: 3, marginLeft: 10, color: "#009abf", fontWeight: 800 }}>
                                        <FA name={"fas fa-angle-double-right"} />
                                      </div>
                                      <div style={{ fontWeight: 700, fontSize: 13, color: "#009abf", width: "auto", height: "100%", display: "inline-block", position: "relative" }}>
                                        <span style={{ position: 'relative', left: 5 }}>{item.value}</span>
                                      </div>
                                    </div>
                                  })
                                }
                              </div>
                            </div>
                          </div>
                          <div className={stylesfu.cardDataDiv}>{this.containerDiv}</div>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
              else if (this.createHistoryTimelineView) {
                let addingElement = null;
                if (layoutSize === "oneThird") {
                  addingElement = (
                    <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} /* style={{ boxShadow: '0px 0px 3px #8c8686' }} */className={this.setOneThirdTableClass(user.editable)} aria-label = {user.sessionHeader}> {/*Sprint 7 Task 77: Added section Button to load buttons at the top of section */}
                      <Suspense fallback={null}>
                        <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                      </Suspense>
                    </div>
                  );
                } else if (layoutSize === "GridTwoThird") {
                  addingElement = (
                    <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} /*style={{ boxShadow: '0px 0px 3px #8c8686' }} */ className={this.setTwoThirdTableClass(user.editable)} aria-label = {user.sessionHeader}>
                      <Suspense fallback={null}>
                        <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} layoutIdentification={"Second Layer"} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} handleAddCalled={this.handleAddCalled} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                      </Suspense>
                    </div>
                  );
                } else {
                  addingElement = (
                    <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} /* style={{ boxShadow: '0px 0px 3px #8c8686' }} */ className={(user.layoutSize === 'full' ? this.setFullTableClass(user.editable) : this.setHalfTableClass(user.editable))} aria-label = {user.sessionHeader}>
                      <Suspense fallback={null}>
                        <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                      </Suspense>
                    </div>
                  );
                }

                let toBeAdd = true;

                for (let i = 0; i < user.uiSchema[0].children.length; i++) {
                  if (user.uiSchema[0].children[i].children.widget == "table") {
                    let fieldPathOfTable = user.uiSchema[0].children[i].children.fieldPath;
                    if (user.formData[0][fieldPathOfTable].data.isTimelineDisplay == "true" && user.formData[0][fieldPathOfTable].data.summaryConfigType.length !== 0) {
                      toBeAdd = false;
                    }
                    else {
                      toBeAdd = true;
                    }
                  }
                  else {
                    toBeAdd = true;
                  }
                }

                if (toBeAdd === true) {
                  this.containerDiv.push(addingElement);
                }

                if (this.containerDiv.length === this.hybridCount) {
                  this.hybridCount = 0;
                  if (GlobalHelper.globlevar['historyHidden']) {
                    return (
                      <div style={{ display: "inline-block", position: "relative", width: '100%' }}>
                        <div className={stylesfu.historyContainerDiv} style={{ width: '100% !important' }}>
                          <div className={stylesfu.historyContainerHeader}><span style={{ float: 'right', margin: '13px' }}><span><div style={{ color: 'black' }} onClick={this.hideHistoryLayout.bind(this, GlobalHelper.globlevar['historyTableSessionId'])} className={stylesfu.historyContainerIcon}><Popover content={<div style={{ fontFamily: "Montserrat", fontSize: "11px", fontWeight: "600" }}>COMPRESS LAYOUT</div>} trigger="hover" ><FA name={'clock-o'} /></Popover></div></span><Popover content={<div style={{ fontFamily: "Montserrat", fontSize: "11px", fontWeight: "600" }}>GO BACK TO DEFAULT FUNCTION</div>} trigger="hover" ><div style={{ display: "inline-block" }} onClick={this.getDefaultFunctionLayout} className={stylesfu.historyContainerBack}> <FA name={"fas fa-angle-left"} style={{ fontSize: '14px', fontWeight: '700', marginRight: '4px' }} /> BACK</div></Popover></span><div style={{ float: 'left' }} className={stylesfu.historyContainerTitle}>{(GlobalHelper.globlevar.historyContainerTitle == undefined ? "Loading" : GlobalHelper.globlevar.historyContainerTitle)}</div></div>
                          <div id={"historyDataDiv"} className={stylesfu.historyDataDiv} style={{ height: '85%' }}>{this.containerDiv}</div>
                        </div>
                      </div>
                    );
                  }
                  else {
                    return (
                      <div style={{ display: "inline-block", position: "relative", width: '100%' }}>
                        <div className={stylesfu.historyContainerDiv} style={{ width: '100% !important' }}>
                          <div className={stylesfu.historyContainerHeader}><span style={{ float: 'right', margin: '13px' }}><span><div style={{ color: 'black' }} onClick={this.getHistoryLayout} className={stylesfu.historyContainerIcon}><Popover content={<div style={{ fontFamily: "Montserrat", fontSize: "11px", fontWeight: "600" }}>GO TO HISTORY FUNCTION</div>} trigger="hover" ><FA name={'clock-o'} onClick={historyFunctionFlag = false} /></Popover></div></span><div style={{ display: "none" }} onClick={this.getDefaultFunctionLayout} className={stylesfu.historyContainerBack}> <FA name={"fas fa-angle-left"} style={{ fontSize: '14px', fontWeight: '700', marginRight: '4px' }} /> BACK</div></span><div style={{ float: 'left' }} className={stylesfu.historyContainerTitle}>{names['formSubTitle'] != null ? names['formSubTitle'] : this.formSubTitle}</div></div>
                          <div id={"historyDataDiv"} className={stylesfu.historyDataDiv} style={{ height: '85%' }}>{this.containerDiv}</div>
                        </div>
                      </div>
                    );
                  }
                }
                else {
                  if (toBeAdd == false) {
                    return (
                      <div style={{ display: "inline-block", position: "relative", width: '100%' }}>
                        <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setFullTableClass(user.editable)} aria-label = {user.sessionHeader}>
                          <Suspense fallback={null}>
                            <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} isClearClicked={this.clearTriggered} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus}onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                          </Suspense>
                        </div>
                        <div className={stylesfu.historyContainerDiv} style={{ width: '100% !important' }}>
                          <div className={stylesfu.historyContainerHeader}><span style={{ float: 'right', margin: '13px' }}><span><div style={{ color: '#60c0ec' }} onClick={this.hideHistoryLayout.bind(this, GlobalHelper.globlevar['historyTableSessionId'])} className={stylesfu.historyContainerIcon}><Popover content={<div style={{ fontFamily: "Montserrat", fontSize: "11px", fontWeight: "600" }}>EXPAND LAYOUT</div>} trigger="hover" ><FA name={'clock-o'} /></Popover></div></span><Popover content={<div style={{ fontFamily: "Montserrat", fontSize: "11px", fontWeight: "600" }}>GO BACK TO DEFAULT FUNCTION</div>} trigger="hover" ><div style={{ display: "inline-block" }} onClick={this.getDefaultFunctionLayout} className={stylesfu.historyContainerBack}> <FA name={"fas fa-angle-left"} onClick={ ()=> { historyFunctionFlag = true, this.showHideButtonPallete("hide")}} style={{ fontSize: '14px', fontWeight: '700', marginRight: '4px' }} /> BACK</div></Popover></span><div style={{ float: 'left' }} className={stylesfu.historyContainerTitle}>{(GlobalHelper.globlevar.historyContainerTitle == undefined ? "Loading" : GlobalHelper.globlevar.historyContainerTitle)}</div></div>
                          <div id={"historyDataDiv"} className={stylesfu.historyDataDiv} style={{ height: '85%' }}>{(GlobalHelper.globlevar.historyContainerTitle !== undefined ? this.containerDiv :
                            <div className={stylesfu.LoadingHistoryContainerDiv}>
                              <span style={{ top: "45%", position: "relative", display: "inline-block" }}>
                                <Spin spinning={true}>
                                  <Alert
                                    message="Loading Late Collection Screen"
                                    description="Further details are about to load."
                                    type="info"
                                  />
                                </Spin>
                              </span>
                            </div>
                          )}</div>
                        </div>
                      </div>
                    );
                  }
                }
              }
              else {
                if (layoutSize === "" || layoutSize === undefined) {
                  this.hybridCount--;
                  return (
                    <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setHalfTableClass(user.editable)} aria-label = {user.sessionHeader}> {/*Sprint 7 Task 77: Added section Button to load buttons at the top of section */}
                      <Suspense fallback={null}>
                        <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                      </Suspense>
                    </div>
                  );
                }
                else {
                  if (layoutSize === "full") {
                    this.hybridCount--;
                    return (
                      <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setFullTableClass(user.editable)} aria-label = {user.sessionHeader}> {/*Sprint 7 Task 77: Added section Button to load buttons at the top of section */}
                        <Suspense fallback={null}>
                          <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur}  onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                        </Suspense>
                      </div>
                    );
                  }
                  else if (layoutSize === "half" && GlobalHelper.globlevar.crdView == false) {
                    this.hybridCount--;
                    return (
                      <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setTwoThirdHalfTableClass(user.editable)} aria-label = {user.sessionHeader}> {/*Sprint 7 Task 77: Added section Button to load buttons at the top of section */}
                        <Suspense fallback={null}>
                          <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                        </Suspense>
                      </div>
                    );
                  }
                  else if (layoutSize === "oneThird") {
                    this.hybridCount--;
                    return (
                      <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setOneThirdTableClass(user.editable)} aria-label = {user.sessionHeader}> { /*Sprint 7 Task 77: Added section Button to load buttons at the top of section */}
                        <FA name={"caret-left"} onClick={this.collapseCards.bind(this, user.sessionID)} className={stylesfu.collapsibleIcon} stack="0.5x" style={{ display: (defCardView === "false" ? 'inline-block' : 'none') }} />
                        <Suspense fallback={null}>
                          <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} hybridView={hybridView} handleAddCalled={this.handleAddCalled} collapseCards={this.collapseCards} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                        </Suspense>
                      </div>
                    );
                  }
                  else if (layoutSize === "TwoThird") {
                    if (this.countDependablescreen == 0) {
                      return (
                        <Layout className={this.setTwoThirdTableClass(user.editable)} style={{ background: "#dee5ef", border: "1px solid #dee5ef", marginTop: '3px', maxHeight: window.innerHeight - 300, overflowY: 'auto' }} >
                          <Content style={{ display: 'inline', maxHeight: window.innerHeight - 300 }}>
                            {
                              this.namess.screendata.map((item, index) => {
                                var arr = GlobalHelper.globlevar['detailsectionidsmapitem'];
                                for (let detailsarr = 0; detailsarr < arr.length; detailsarr++) {
                                  //if(GlobalHelper.globlevar['detailsectionidsmapitem']['sessionID'] == item.sessionID)
                                  if (arr[detailsarr] !== undefined)
                                    if (arr[detailsarr]['sessionID'] == item.sessionID) {
                                      return (
                                        <div id={'form_' + item.sessionID} tabindex='0' style={{ background: "#ffffff", marginBottom: '10px', borderRadius: '6px', border: '1px solid #FFF' }} aria-label = {user.sessionHeader}> 
                                          <Suspense fallback={null}>
                                            <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={item.cFixedSectionColumn} columnCount={item.columnCount} layoutSize={item.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={item.sectionButton} sessionID={item.sessionID} sectionId={item.sessionID} sectionhead={item.sessionHeader} schema={item.schema[0]} uiSchema={item.uiSchema[0]} formData={item.formData[0]} editable={item.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} style={{ width: window.innerWidth - 100 }} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                                          </Suspense>
                                        </div>
                                      );
                                    }
                                }
                              })
                            }
                          </Content>
                        </Layout>
                      )
                    }
                    else {
                      return <Layout className={this.setTwoThirdTableClass(user.editable)} style={{ background: "#dee5ef", border: "0px solid #dee5ef", marginTop: '3px', maxHeight: window.innerHeight - 300, overflowY: 'auto' }} >
                        <Content style={{ display: 'inline', maxHeight: window.innerHeight - 300 }}>
                          <div style={{ marginBottom: '10px' }}>
                          </div>
                        </Content>
                      </Layout>;
                    }
                  }

                  else if (layoutSize === "GridTwoThird" || layoutSize === "half") {
                    GlobalHelper.globlevar['crdView'] = true;

                    let addingElement = (
                      <div id={'form_' + user.sessionID} tabindex='0' style={{ position: 'relative', left: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? '-7px' : '0px') }} className={this.setTwoThirdTableClass(user.editable, layoutSize)} aria-label = {user.sessionHeader}>
                        <Suspense fallback={null}>
                          <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={user.cFixedSectionColumn} columnCount={user.columnCount} layoutSize={user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} layoutIdentification={"Second Layer"} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema={user.schema[0]} uiSchema={user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection} namess={this.namess} handleAddCalled={this.handleAddCalled} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} aria-label = {user.sessionHeader}/>
                        </Suspense>
                      </div>
                    );


                    this.containerDiv.push(addingElement);

                    if (this.containerDiv.length === this.hybridCount) {
                      this.hybridCount = 0;
                      return (
                        <div id={this.props.orientationType == "popup" ? 'PopCardViewWrapper' : 'cardViewWrapper'} className={stylesfu.cardViewWrapper}>
                          <div className={stylesfu.cardContainerDiv} style={{ width: '100% !important' }}>
                            <div className={stylesfu.cardContainerHeader}>
                              <Badge count={GlobalHelper.globlevar.CurrentlyClosedCard.length} style={{ display: (GlobalHelper.globlevar.CurrentlyClosedCard && GlobalHelper.globlevar.CurrentlyClosedCard.length > 0 ? "inline-block" : "none"), top: '12px', left: '8px', position: 'absolute' }}>
                                <FA name={"thumb-tack"} onClick={this.expandCards.bind(this, "expanding")} className={stylesfu.expandableIcon} style={{ display: (GlobalHelper.globlevar.CurrentlyClosedCard && GlobalHelper.globlevar.CurrentlyClosedCard.length > 0 ? "inline-block" : "none") }} stack="0.5x"/>
                              </Badge>
                              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} className={stylesfu.cardContainerTitle}>
                                <div id={'cardHeaderMainBlock'} style={{ display: "flex", alignItems: "center", alignContent: "center", width: '100%', height: '100%', overflowY: 'hidden', overflowX: 'scroll' }}>
                                  {
                                    cardHeaderInfo.map((item, index) => {
                                      return <div style={{ marginRight: 20, whiteSpace: 'nowrap', display: "inline-block", position: "relative" }}>
                                        <div style={{ width: "auto", height: "100%", display: "inline-block", position: "relative" }}>
                                          <span style={{ color: 'black', position: 'relative', left: 5 }}>
                                            {
                                              this.holdNamess.screendata.map((cardTitleObject, cardTitleIndex) => {
                                                if (item.key === cardTitleObject.sessionID) {
                                                  return cardTitleObject.sessionHeader;
                                                }
                                              })
                                            }
                                          </span>
                                        </div>
                                        <div style={{ display: "inline-block", position: "relative", fontSize: 25, top: 3, marginLeft: 10, color: "#009abf", fontWeight: 800 }}>
                                          <FA name={"fas fa-angle-double-right"} />
                                        </div>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: "#009abf", width: "auto", height: "100%", display: "inline-block", position: "relative" }}>
                                          <span style={{ position: 'relative', left: 5 }}>{item.value}</span>
                                        </div>
                                      </div>
                                    })
                                  }
                                </div>
                              </div>
                            </div>
                            <div className={stylesfu.cardDataDiv} >{this.containerDiv}</div>
                          </div>
                        </div>
                      );
                    }
                  }
                } // END ELSE
              }
            }
          }
        }
      }
    }
    catch (e) { Log4r.error(e) }
  };

  /*return (
          <div className={this.setTwoThirdTableClass(user.editable)} > { //Sprint 7 Task 77: Added section Button to load buttons at the top of section
          }
              <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn = {user.cFixedSectionColumn}  columnCount = {user.columnCount} layoutSize = {user.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered}  forTableSec={user.forTableSec} dummyErrJson={user.dummyErrJson} toCheckChang={user.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={user.triggerSectionButtonEvent}  orientationType = {this.props.orientationType} sectionXPath={user.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} reRender={this.reRender} sectionButton={user.sectionButton} sessionID={user.sessionID} sectionId={user.sessionID} sectionhead={user.sessionHeader} schema = {user.schema[0]} uiSchema = {user.uiSchema[0]} formData={user.formData[0]} editable={user.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName}  widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isSaveClicked={this.state.isSaveClicked} addRowtoGrid={this.addRowtoGrid} addRowtoGridSectionID={user.addRowtoGridSection}   namess = {this.namess} />
           </div>
          );
  */

  optionsIntoArrayConverter(options) {

    var selectCodeDescMapperArray = [];
    options.map((item, index) => {
      let descObjectSubMap = {};
      descObjectSubMap['description'] = item.description;
      if (item.children != null && item.children != "" && item.children != undefined) {
        var childrenArray = this.ChildrenHandler(item.children);
        descObjectSubMap['children'] = childrenArray;
      }
      let descObjectMap = new Map();

      descObjectMap.set(item.code, descObjectSubMap);
      selectCodeDescMapperArray.push(descObjectMap);
    })
    return selectCodeDescMapperArray;
  }

  ChildrenHandler(itemChildrenParam) {
    var childrenArrayInHandler = this.optionsIntoArrayConverter(itemChildrenParam);
    return childrenArrayInHandler;
  }

  fromMapToFormFieldOptions(passedOptions, resultantArrayFromMap) {
    let finalMappedArrayOfOptionsForFieldPath = [];
    passedOptions.map((item, index) => {

      for (var iterMap = 0; iterMap < resultantArrayFromMap.length; iterMap++) {
        if (resultantArrayFromMap[iterMap].has(item.code)) {
          let tempOptionObject = {};
          tempOptionObject.description = resultantArrayFromMap[iterMap].get(item.code).description;
          tempOptionObject.code = item.code;

          if (item.children != null && item.children != "" && item.children != undefined) {
            let childrenArrayInMap = resultantArrayFromMap[iterMap].get(item.code).children;
            var childrenArrayMapping = this.ChildrenHandlerFrmMap(item.children, childrenArrayInMap);
            tempOptionObject.children = childrenArrayMapping;
          }

          finalMappedArrayOfOptionsForFieldPath.push(tempOptionObject);
          break;
        }
      }
    })
    return finalMappedArrayOfOptionsForFieldPath;
  }

  ChildrenHandlerFrmMap(childrenArrayParam, childrenArrayInMapParam) {

    var childrenArrayMapping = this.fromMapToFormFieldOptions(childrenArrayParam, childrenArrayInMapParam);
    return childrenArrayMapping;
  }

  handleChange(fieldPath, sessionID, frmdata, objk, string, cellUpdated) {
    if(this.namess['whichSectionClicked'] != null){
      if(GlobalHelper.globlevar['showF2ModalClosed'].get(this.namess['whichSectionClicked']) === true){
        GlobalHelper.globlevar['showF2ModalClosed'].delete(this.namess['whichSectionClicked']);
      }
    }
    GlobalHelper.globlevar['changeTitle'] = undefined;
    if(GlobalHelper.layoutCaption !== "Agency on Boarding"){
      ErrorHandler.clear();
    }
    
    if (frmdata[sessionID]) {
      if (frmdata[sessionID].data) {
        if (frmdata[sessionID].data.addThroughSummGrid && frmdata[sessionID].data.addThroughSummGrid === "true") {
          if (objk) {
            //ErrorHandler.clear();
            this.props.outnames.data[0].name['errorObjectForScreen'] = ErrorHandler.backupErrorJson();
            this.props.outnames.data[0].name['addToGridSectionalLinkClicked'] = true;
            this.props.outnames.data[0].name['addToGridSectionalLinkData'] = frmdata[sessionID].data.detailsectionid;

            GlobalHelper.globlevar['multiLevelAddtoGridLinks'].set(objk.sessionID, GlobalHelper.globlevar['tableLinkRecord']);

          }
        }
      }
    }

    if (frmdata[sessionID] != null) {
      if (frmdata[sessionID].data != null) {
        if (frmdata[sessionID].data.detailsectionid != null) {
          if (frmdata[sessionID].data.addThroughSummGrid === "false") {
            if (objk != null) {
              if (this.props.orientationType === "self") {
                GlobalHelper.globlevar['modalClosedClicked'] = undefined;
              }
            }
          }
        }
      }
    }

    let fieldChanged = sessionID + "." + fieldPath; //make sure this is of the form sectionId.fieldId
    let rowAffected = "";
    if (cellUpdated != null && cellUpdated != undefined && cellUpdated.length > 0) {
      fieldChanged = sessionID + "." + cellUpdated[1];
      rowAffected = cellUpdated[0];
    }
    let objectForFieldAffected = {};
    objectForFieldAffected.fieldId = fieldChanged;
    objectForFieldAffected.rowKey = rowAffected;
    this.fieldsChangedForRuleExecution.push(objectForFieldAffected);
    this.currentChangedForm = sessionID;
    if (GlobalHelper.globlevar['dotForm'] === fieldPath || GlobalHelper.globlevar.onlyForCondValidationOnClickOfCard) {
      this.hybridCount = 0;

      if (GlobalHelper.globlevar['dotForm']) {
        let indexToTrim = null;
        for (var i = 0; i < cardHeaderInfo.length; i++) {
          if (cardHeaderInfo[i].key === GlobalHelper.globlevar['dotForm']) {
            indexToTrim = i;
          }
        }
        cardHeaderInfo.length = (indexToTrim);
        GlobalHelper.globlevar['dotForm'] = undefined;
      }
      for (var i = 0; i < this.namess.screendata.length; i++) {
        if (this.namess.screendata[i].hasOwnProperty('addedFunctionLayout') && this.namess.screendata[i].addedFunctionLayout == true) {
          delete this.namess.screendata[i]['addedFunctionLayout'];
          this.namess.screendata[i]['hidden'] = "true";
        }
      }
      if ($('[class*=triLayer_twoThirdWrapper]').length !== 0 || $('[class*=twoThirdWrapper]').length !== 0) {
        $('[class*=floatingboxfollowuptableTwoThird]').unwrap();
      }
      //ErrorHandler.clear();
      if (GlobalHelper.globlevar.onlyForCondValidationOnClickOfCard) {
        GlobalHelper.globlevar.onlyForCondValidationOnClickOfCard = false;
        CardLinkFetch = true;
      }
    }
    let NothingSaveError = ErrorHandler.getErrMessage();
    if (NothingSaveError === "Nothing to save !!") {
      ErrorHandler.setstatusES(null);
      ErrorHandler.setErrMessage(null);
    }
    this.setState({
      justRefresh: !this.state.justRefresh
    });
    try {
      if (objk !== null) // in case of change in link widget of any section
      {
        //let REFKEY = frmdata[objk.sessionID].data.smrykeyconfig.split(",");
        let smrykeyconfigvalues = "";

        if (objk.formData !== undefined) // objk.formData stores changed value in link
        {

          let AnObject = {};
          AnObject['key'] = objk.sessionID;
          AnObject['value'] = GlobalHelper.globlevar.tableLinkRecord[frmdata[objk.sessionID].data.Columns[0].dataIndex] == undefined? GlobalHelper.globlevar.tableLinkRecord[frmdata[objk.sessionID].data.Columns.length>0?frmdata[objk.sessionID].data.Columns[1].dataIndex:frmdata[objk.sessionID].data.Columns[0].dataIndex]: GlobalHelper.globlevar.tableLinkRecord[frmdata[objk.sessionID].data.Columns[0].dataIndex];
          let tempArray = [];
          tempArray.push(AnObject);
          Array.prototype.inArray = function (copmarer) {
            for (let i = 0; i < this.length; i++) {
              if (copmarer(this[i])) {
                return true;
              }
            }
            return false;
          }

          Array.prototype.pushIfNotExist = function (element, comparer) {
            if (!this.inArray(comparer)) {
              this.push(element);
            } else {
              for (var i = 0; i < this.length; i++) {
                if (this[i].key === element.key) {
                  this[i].value = element.value;
                }
              }
            }
          };

          for (let i = 0; i < tempArray.length; i++) {
            cardHeaderInfo.pushIfNotExist(tempArray[i], function (e) {
              return e.key === tempArray[i].key
            })
          }

          var values = {};
          if (frmdata[objk.sessionID].data.detailsectionid !== undefined || frmdata[objk.sessionID].data.detailsectionid !== null) {
            values = {
              clickedData: objk.formData[0],
              detailsectionid: frmdata[objk.sessionID].data.detailsectionid,
              smryclickablecol: frmdata[objk.sessionID].data.smryclickablecol
            };
          } else {
            values = {
              clickedData: objk.formData[0]
            };
          }
          //var values = frmdata[objk.sessionID].data.smrykeyconfig;
          isfetchlinkclicked = true; // for bindig xpathmap which called at maptopropse
          if (frmdata[fieldPath].data.isCardDisplay === "true") {
            if (cardHeaderInfo.length > 1) {
              let indexToTrim = null;
              for (var i = 0; i < cardHeaderInfo.length; i++) {
                if (cardHeaderInfo[i].key === fieldPath) {
                  indexToTrim = i;
                }
              }
              cardHeaderInfo.length = (indexToTrim + 1);
            }

            CardLinkFetch = true;
            if (string === "Second Layer") {
              /* Can implement any code in case any change happened in detail section of second level summary card*/
            }
          }

          if (responsestatus === "S") {
            responsestatus = undefined;
          }

          GlobalHelper.globlevar['parentfieldpath'] = fieldPath;
          var calculatedPkValues = [];
          let extraData;
          if (frmdata[fieldPath]['data'].summaryConfigType === "F") {
            if (frmdata[fieldPath]['data'].funcBaseDtlCntxtIds !== undefined) {
              let functionContext = frmdata[fieldPath]['data'].funcBaseDtlCntxtIds;
              let newContextValues = [];
              for (let key in functionContext) {
                let contextValueExpression = functionContext[key];
                let contextValue = undefined
                if (GlobalHelper.globlevar.targetCard === "" || GlobalHelper.globlevar.targetCard === null || GlobalHelper.globlevar.targetCard === undefined) {
                  if (GlobalHelper.globlevar['tableLinkRecord'] !== undefined && GlobalHelper.globlevar['tableLinkRecord'] !== null && GlobalHelper.globlevar['tableLinkRecord'] !== "") {
                    contextValue = this.getGridValueForColumn(frmdata[fieldPath]['data'], contextValueExpression, GlobalHelper.globlevar['tableLinkRecord'].key);
                  }
                } else {
                  contextValue = this.getGridValueForColumn(frmdata[fieldPath]['data'], contextValueExpression, GlobalHelper.globlevar.targetCard);
                }

                if (contextValueExpression == "$P!{BASE_ENTITY}") {

                  let functionIdColumnValue = undefined
                  if (GlobalHelper.globlevar.targetCard === "" || GlobalHelper.globlevar.targetCard === null || GlobalHelper.globlevar.targetCard === undefined) {
                    if (GlobalHelper.globlevar['tableLinkRecord'] !== undefined && GlobalHelper.globlevar['tableLinkRecord'] !== null && GlobalHelper.globlevar['tableLinkRecord'] !== "") {
                      functionIdColumnValue = this.getGridValueForColumn(frmdata[fieldPath]['data'], frmdata[fieldPath]['data'].functionIdColumn, GlobalHelper.globlevar['tableLinkRecord'].key);
                    }
                  } else {
                    functionIdColumnValue = this.getGridValueForColumn(frmdata[fieldPath]['data'], frmdata[fieldPath]['data'].functionIdColumn, GlobalHelper.globlevar.targetCard);
                  }

                  for (let i = 0; i < GlobalHelper.functionGroupData.formHeaderBookmarks.length; i++) {
                    for (let j = 0; j < GlobalHelper.functionGroupData.formHeaderBookmarks[i].content.length; j++) {
                      if (GlobalHelper.functionGroupData.formHeaderBookmarks[i].content[j].id === functionIdColumnValue) {
                        contextValue = GlobalHelper.functionGroupData.formHeaderBookmarks[i].content[j].entityid;
                        break;
                      }
                    }
                    if (contextValue != null) break;
                  }
                }
                newContextValues.push({
                  "key": key,
                  "contextValue": contextValue
                });
              }

              let newContextPKValues = GlobalHelper.contextPKValues;
              let __cpk = GlobalHelper.contextPrimaryKey;
              for (let i = 0; i < newContextValues.length; i++) {
                let currentContextKey = newContextValues[i].key;

                let currentContextValue = newContextValues[i].contextValue;

                let isKeyPresentInPKValues = newContextPKValues.indexOf(currentContextKey + "=") >= 0;

                if (isKeyPresentInPKValues) {
                  let startIndex = newContextPKValues.indexOf(currentContextKey + "=") + (currentContextKey + "=").length;
                  let endIndex = (newContextPKValues.indexOf("&", startIndex) == -1 ? newContextPKValues.length : newContextPKValues.indexOf("&", startIndex));
                  newContextPKValues = newContextPKValues.substring(0, startIndex) + currentContextValue + newContextPKValues.substring(endIndex);
                } else {
                  newContextPKValues = newContextPKValues + "&" + currentContextKey + "=" + currentContextValue;
                }
                if (__cpk != null && __cpk.indexOf("=") >= 0) {
                  __cpk = __cpk.split("=")[1];
                  __cpk = "|" + __cpk + "|";
                  let isKeyPresentIn_cpk = __cpk.indexOf("|" + currentContextKey + "|") >= 0;
                  if (!isKeyPresentIn_cpk) {
                    __cpk = __cpk + currentContextKey;
                  }
                  __cpk = __cpk.substring(1);
                  if (isKeyPresentIn_cpk) {
                    __cpk = __cpk.substring(0, __cpk.length - 1);
                  }
                  __cpk = "__cpk=" + __cpk;
                }
              }
              let newPkValuesObject = {}
              newPkValuesObject["contextPrimaryKyes"] = __cpk;
              newPkValuesObject["contextPrimaryKyeValues"] = newContextPKValues;
              calculatedPkValues.push(newPkValuesObject);
              GlobalHelper.globlevar['calculatedPkValuesForSave'] = calculatedPkValues;
              GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] = calculatedPkValues;
            }

            let values = "";

            values = GlobalHelper.globlevar['tableLinkRecord'][frmdata[fieldPath]['data'].functionIdColumn];
            GlobalHelper.globlevar['summaryConfigType_save'] = undefined;
            GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = values;
            GlobalHelper.globlevar['summaryConfigType'] = "F";
            GlobalHelper.globlevar.savespin = true;
            if (this.props.orientationType === "popup") {
              if (calculatedPkValues != undefined && calculatedPkValues.length == 0) {
                this.GetF2LayoutTopIcons(values)
              } else {
                this.GetF2LayoutTopIcons(values, calculatedPkValues)
              }
            } else {
              GlobalHelper.globlevar.linkclicked = false;
              if (calculatedPkValues != undefined && calculatedPkValues.length == 0) {
                store.dispatch({
                  type: 'LAYOUTTOPICON',
                  values
                });
              } else {
                store.dispatch({
                  type: 'LAYOUTTOPICON',
                  values,
                  calculatedPkValues
                });
              }
            }


          } else {
            GlobalHelper.globlevar['summaryConfigType'] = "D";
            frmdata[fieldPath]['data'].checkForWarningAddRowToGridTrigger = false;
            extraData = {
              "fieldPath": fieldPath,
              "sessionId": ((objk != null && objk.sessionID != null) ? objk.sessionID : null),
              "formDataVal": frmdata[fieldPath],
              "recordObj": GlobalHelper.globlevar['tableLinkRecord']
            }
            let dtailsecId = frmdata[fieldPath]['data'].detailsectionid;
            if (this.props.orientationType == "popup" && dtailsecId != null) {

              /*************** GRID FETCH DATA  *************/
              let calculatedPkValues = (GlobalHelper.globlevar.calculatedPkValuesForSave ? GlobalHelper.globlevar.calculatedPkValuesForSave : []);
              var functionid = "";
              var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
              var contextencodevalue = contextprimarykeyvalue[0] + "=" + encodeURIComponent(contextprimarykeyvalue[1]);
              let contextKeys = "";
              if (this.props.customContextKeys && this.props.customContextKeys.length !== 0) {
                contextKeys = this.props.customContextKeys;
              } else {
                contextKeys = GlobalHelper.contextPKValues;
              }
              let functioniddata = (this.props.popupFunctionId != null ? this.props.popupFunctionId : GlobalHelper.globlevar.functionID);
              let basedOnDetails = GlobalHelper.functionListMap.get(this.props.popupFunctionId) && GlobalHelper.functionListMap.get(this.props.popupFunctionId).basedOn;
              if (calculatedPkValues != undefined && calculatedPkValues.length !== 0 && basedOnDetails != "BASE") {
                if (calculatedPkValues[0].contextPrimaryKyes.includes("|")) {
                  let calcontextprimarykeyvalue = calculatedPkValues[0].contextPrimaryKyes.split('=');
                  let calcontextencodevalue = calcontextprimarykeyvalue[0] + "=" + encodeURIComponent(calcontextprimarykeyvalue[1]);
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calcontextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&LAYOUT_MODE=SUMMARY_DETAILS&"
                }
                else {
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + calculatedPkValues[0].contextPrimaryKyeValues + "&" + calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&LAYOUT_MODE=SUMMARY_DETAILS&"
                }
              }
              else {
                if (this.props.customContextKeys && this.props.customContextKeys.length !== 0) {
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + this.props.customContextKeys + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&functionMode=F&LAYOUT_MODE=SUMMARY_DETAILS&"
                }
                else {
                  url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + contextKeys + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&_ut=ALLOCATED_USER&" + "functionMode=F&LAYOUT_MODE=SUMMARY_DETAILS&"
                }
              }
              if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
                url = "/" + GlobalHelper.menuContext + "/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=undefined&LAYOUT_MODE=SUMMARY_DETAILS&" + GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + "&";
              }
              functionid = (this.props.popupFunctionId != null ? this.props.popupFunctionId : GlobalHelper.globlevar.functionID);
              var requestData = {
                'linkoption': values,
                '__functionId': functionid,
                'token': 'indus'
              };


              if (GlobalHelper.globlevar['tableLinkRecord'].addThroughSummGridjson != null && GlobalHelper.globlevar['tableLinkRecord'].addThroughSummGridjson !== "") {
                var jsonTxt = JSON.parse(GlobalHelper.globlevar['tableLinkRecord'].addThroughSummGridjson);
                jsonTxt.forEach(function (value, key) {
                  let gridFieldPath = undefined;
                  gridFieldPath = value.uiSchema[0].children.filter(item => item.children.widget === "table")[0];
                  if (gridFieldPath != null) {
                    gridFieldPath = gridFieldPath.children.fieldPath;
                    let dataAndStyleObjectCopy = JSON.parse(JSON.stringify(value.formData[0][gridFieldPath]));
                    delete value.formData[0][gridFieldPath];
                    value.formData[0] = dataAndStyleObjectCopy;
                  }

                  delete value.schema
                  delete value.uiSchema
                });
                GlobalHelper.globlevar['onlyDataCalled'] = true;
                GlobalHelper.globlevar["onPopDetailSectionLoad"] = true;
                var jsonText = JSON.stringify(jsonTxt);
                jsonText = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": null,\"data\":[{\"name\" : {\"screendata\" :" + jsonText + "}}]}}";
                let newnames = JSON.parse(jsonText).name;
                if (GlobalHelper.globlevar['onlyDataCalled']) {
                  if (newnames.data.length > 0) {
                    if (newnames.data[0].name.screendata[0].schema == undefined) {
                      let dependantSections = null;
                      this.popUpLinkClick = true;
                      if (extraData != null) {
                        if (extraData.formDataVal != null) {
                          if (extraData.formDataVal.data.detailsectionid != null) {
                            dependantSections = new Model().getLeafNodesForId(extraData.formDataVal.data.detailsectionid);
                          }
                        }
                      }
                      if (dependantSections != null) {
                        for (let i = 0; i < Object.keys(dependantSections).length; i++) {
                          this.ClearFormsData(Object.keys(dependantSections)[i]);
                        }
                      }

                      for (var i = 0; i < this.namess.screendata.length; i++) {
                        for (var j = 0; j < newnames.data[0].name.screendata.length; j++) {
                          if (this.namess.screendata[i].sessionID === newnames.data[0].name.screendata[j].sessionID) {
                            for (var k = 0; k < this.namess.screendata[i].uiSchema[0].children.length; k++) {
                              /******************/
                              if (responsestatus === "S") {
                                if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "table") {
                                  if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                    this.namess.screendata[i].formData = newnames.data[0].name.screendata[j].formData;
                                  }
                                  break;
                                }
                                else {
                                  if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                    this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = newnames.data[0].name.screendata[j].formData[0].data.DataSource;
                                  }
                                  break;
                                }
                              }
                              else {
                                if (this.namess.screendata[i].uiSchema !== undefined) {
                                  if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "table") {
                                    let tempFormData = newnames.data[0].name.screendata[j].formData;
                                    if (Array.isArray(tempFormData) && tempFormData.length == 0) {
                                      let tempUIschema = this.namess.screendata[i].uiSchema[0].children;
                                      for (let j = 0; j < tempUIschema.length; j++) {
                                        this.namess.screendata[i].formData[0][tempUIschema[j].children.fieldPath].data = [""];
                                      }
                                    }
                                    else if (Array.isArray(tempFormData) && tempFormData.length > 0) {
                                      if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                        this.namess.screendata[i].formData = newnames.data[0].name.screendata[j].formData;
                                      }
                                      break;
                                    }
                                  }
                                  else {
                                    if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                      this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = newnames.data[0].name.screendata[j].formData[0].data.DataSource;

                                      if (newnames.data[0].name.screendata[j].formData[0].data['parentPK'] !== undefined) {
                                        this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data['parentPK'] = newnames.data[0].name.screendata[j].formData[0].data['parentPK'];
                                      }

                                      if (newnames.data[0].name.screendata[j].formData[0].data.moreRows) {
                                        this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.moreRows = newnames.data[0].name.screendata[j].formData[0].data.moreRows;
                                      }

                                      if (newnames.data[0].name.screendata[j].formData[0].data.tableRefreshed !== undefined) {
                                        this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.tableRefreshed = newnames.data[0].name.screendata[j].formData[0].data.tableRefreshed;
                                      }

                                    }

                                    break;
                                  }
                                }
                              }
                              /*****************/
                            }
                          }// END IF
                        }
                        GlobalHelper.globlevar.onlyCardClicked = false;
                      }
                    }

                  }
                  GlobalHelper.globlevar['sectionlevelrefresh'] = false;
                  GlobalHelper.globlevar['onlyDataCalled'] = false;
                  this.F2FunctionNames.data[0].name = this.namess;
                  GlobalHelper.globlevar['defaultValueManagerMap'] = createDefaultValueMap(this.namess, GlobalHelper.globlevar['targetToRulesMapper']);
                  this.forceUpdate();
                }
              } else {
                let xpathQ = GlobalHelper.globlevar['dependablerecordrequest'] && Object.keys(GlobalHelper.globlevar['dependablerecordrequest']).map(function(k) {
                  return encodeURIComponent(k) + '=' + encodeURIComponent(GlobalHelper.globlevar['dependablerecordrequest'][k])
                }).join('&');
                xpathQ = xpathQ +"&__functionId="+ functionid;
                xpathQ = xpathQ +"&token=indus&";
                let LAYOUTTOPICON_a_GetTemplateUrl = url.split("?")[1];
                let _stdata_LAYOUTTOPICON_a_GetTemplateUrl = getSTData("/" + GlobalHelper.menuContext + "/", LAYOUTTOPICON_a_GetTemplateUrl);
                request
                  .post(url)
                  .query({
                    linkClicked: values.clickedData
                  })
                  .query({ _SID_: (_stdata_LAYOUTTOPICON_a_GetTemplateUrl.SID + _stdata_LAYOUTTOPICON_a_GetTemplateUrl.SINT) })
                  .query({ _ADF_: "" })
                  .query({
                    detailsectionid: values.detailsectionid
                  })
                  .query(values.smrykeyconfig)
                  .send(xpathQ)
                  .query({
                    layoutId: GlobalHelper.globlevar['dependablelayoutid']
                  })
                  .send(JSON.stringify(requestData))
                  /*.send({
                    '__functionId': functionid,
                    'token': 'indus'
                  })*/
                  .end((err, res) => {
                    if (err) {
                      Log4r.log('data-service err: call', err);
                    }
                    let remarktoadd = undefined;
                    let spliceindex = undefined;
                    let replacingurl = undefined;
                    if (GlobalHelper.globlevar.getDataUrls.length !== 0) {
                      for (let i = 0; i < GlobalHelper.globlevar.getDataUrls.length; i++) {
                        let index = GlobalHelper.globlevar.getDataUrls[i].indexOf(values.detailsectionid);
                        if (index == -1) {
                          remarktoadd = true;
                        } else {
                          remarktoadd = false;
                          spliceindex = i;
                          replacingurl = res.req.url;
                          break;
                        }
                      }
                    }
                    if (remarktoadd == true || remarktoadd == undefined) {
                      let addtoGridCheck = false;
                      if (extraData !== undefined) {
                        if (extraData.formDataVal.data !== undefined) {
                          if (extraData.formDataVal.data.addThroughSummGrid !== undefined && extraData.formDataVal.data.addThroughSummGrid === "true") {
                            addtoGridCheck = true;
                          }
                        }
                      }
                      if (addtoGridCheck === false) {
                        GlobalHelper.globlevar.getDataUrls.push(res.req.url);
                        GlobalHelper.getDataUrlsMap.set(res.req.url, extraData);
                      }
                    } else {
                      if (spliceindex !== undefined) {
                        GlobalHelper.globlevar.getDataUrls.splice(spliceindex, 1);
                        GlobalHelper.globlevar.getDataUrls.splice(spliceindex, 0, replacingurl);
                        spliceindex = undefined;
                        replacingurl = undefined;
                      }
                    }

                    var jsonText = res.text;
                    let succFlag = true;
                    let jsonTxt22 = null;
                    if (res.text !== "" && res.text !== undefined && res.text !== null) {
                      let tempJson = JSON.parse(res.text);
                      let newErrJson = {};
                      if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
                        let errjsn = tempJson.__f2_messages__;
                        for (var i = 0; i < errjsn.length; i++) {
                          if (errjsn[i][0] == "E") {
                            succFlag = false;
                            let dialogTitle = "Error From Server !";
                            if (!isempty(errjsn[i][4])) {
                              dialogTitle = errjsn[i][4];
                            }
                            displayMessageBox(dialogTitle, errjsn[i][1], "E", null)
                            break;
                          }
                          if (errjsn[i][0] == "D") {
                            let dialogTitle = "Dialog Box";
                            if (!isempty(errjsn[i][4])) {
                              dialogTitle = errjsn[i][4];
                            }
                            displayMessageBox(dialogTitle, errjsn[i][1], "I", null)
                            break;
                          }
                        }
                        newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
                      }
                      newErrJson['SuccessFlag'] = succFlag;
                      newErrJson['SuccessFlagReRender'] = true;
                        jsonTxt22 = JSON.stringify(newErrJson);
                     
                    }
                    var objDetailSectionList;
                    GlobalHelper['dependablegriddata'] = true;
                    let jsonObj = null
                    try {
                      jsonObj = JSON.parse(jsonText);
                    } catch (e) { }
                    if (jsonObj != null && jsonObj.JSON_DATA != null) {
                      jsonObjdata = jsonObj.JSON_DATA;
                      objDetailSectionList = jsonObj.DTL_SEC_LIST;
                    } else {
                      GlobalHelper.globlevar['NoRowDataForDetailSection'] = "true";
                    }

                    let updatedata = undefined;

                    var layoutObject = undefined;
                    try {
                      layoutObject = new Model().getLeafNodesForId(values.detailsectionid);
                    } catch (e) {
                      Log4r.log(e);
                    }

                    try {
                      ParentPK = new ParentPKComponentData().getParentQueryStringFetchData(jsonObjdata);
                    } catch (e) {
                      Log4r.error(e)
                    }
                    let newnames = [];
                    try {
                      newnames = new ReactUpdateData(layoutObject, jsonObjdata, objDetailSectionList).buildFinalUpdateJson();
                    } catch (e) {
                      Log4r.log(e);
                    }

                    var jsonTxt = JSON.stringify(newnames);
                    jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": " + jsonTxt22 + ",\"LayoutHeader\": null,\"data\":[{\"name\" : " + jsonTxt + "}]}}";
                    newnames = JSON.parse(jsonTxt).name;
                    newnames['DTL_SEC_LIST'] = jsonObj.DTL_SEC_LIST;
                    let templist = {};
                    templist[GlobalHelper.globlevar.dependablelayoutid] = jsonObj.DTL_SEC_LIST;
                    newnames.data[0].name['DTL_SEC_LIST'] = templist;
                    responsestatus = "S";
                    GlobalHelper.globlevar['onlyDataCalled'] = true;
                    // GlobalHelper.globlevar["onDetailSectionLoad"] = true;
                    GlobalHelper.globlevar["onPopDetailSectionLoad"] = true;

                    if (newnames.data != null && succFlag === true) {
                      if (newnames.data[0] != null && newnames.data[0].name != null) {
                        if (newnames.data[0].name.DTL_SEC_LIST != null) {
                          Object.keys(newnames.data[0].name.DTL_SEC_LIST).map((key) => {    // NOSONAR: javascript:S2201
                            for (var sectionID in newnames.data[0].name.DTL_SEC_LIST[key]) {
                              if (newnames.data[0].name.DTL_SEC_LIST[key][sectionID] !== undefined) {
                                if (newnames.data[0].name.DTL_SEC_LIST[key][sectionID] == true) {
                                  newnames.data[0].name.screendata.map((item, index) => {
                                    if (item.sessionID === sectionID) {
                                      item["hidden"] = "true";
                                    }
                                  })
                                }
                              }
                            }
                          })
                        }
                      }
                    }

                    /*************** GRID FETCH DATA  *************/
                    if (GlobalHelper.globlevar['onlyDataCalled']) {
                      if (newnames.data.length > 0 && succFlag === true) {
                        if (newnames.data[0].name.screendata[0].schema == undefined) {
                          let dependantSections = null;
                          this.popUpLinkClick = true;
                          if (extraData != null) {
                            if (extraData.formDataVal != null) {
                              if (extraData.formDataVal.data.detailsectionid != null) {
                                dependantSections = new Model().getLeafNodesForId(extraData.formDataVal.data.detailsectionid);
                              }
                            }
                          }
                          if (dependantSections != null) {
                            for (let i = 0; i < Object.keys(dependantSections).length; i++) {
                              this.ClearFormsData(Object.keys(dependantSections)[i]);
                            }
                          }

                          for (var i = 0; i < this.namess.screendata.length; i++) {
                            for (var j = 0; j < newnames.data[0].name.screendata.length; j++) {
                              if (this.namess.screendata[i].sessionID === newnames.data[0].name.screendata[j].sessionID) {
                                for (var k = 0; k < this.namess.screendata[i].uiSchema[0].children.length; k++) {
                                  /******************/
                                  if (responsestatus === "S") {
                                    if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "table") {
                                      if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                        this.namess.screendata[i].formData = newnames.data[0].name.screendata[j].formData;
                                      }
                                      break;
                                    }
                                    else {
                                      if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                        this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = newnames.data[0].name.screendata[j].formData[0].data.DataSource;
                                        GlobalHelper.globlevar.setValInGridRender.push(this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath);
                                      }
                                      break;
                                    }
                                  }
                                  else {
                                    if (this.namess.screendata[i].uiSchema !== undefined) {
                                      if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "table") {
                                        let tempFormData = newnames.data[0].name.screendata[j].formData;
                                        if (Array.isArray(tempFormData) && tempFormData.length == 0) {
                                          let tempUIschema = this.namess.screendata[i].uiSchema[0].children;
                                          for (let j = 0; j < tempUIschema.length; j++) {
                                            this.namess.screendata[i].formData[0][tempUIschema[j].children.fieldPath].data = [""];
                                          }
                                        }
                                        else if (Array.isArray(tempFormData) && tempFormData.length > 0) {
                                          if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                            this.namess.screendata[i].formData = newnames.data[0].name.screendata[j].formData;
                                          }
                                          break;
                                        }
                                      }
                                      else {
                                        if (newnames.data[0].name.screendata[j].formData.length !== 0) {
                                          this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = newnames.data[0].name.screendata[j].formData[0].data.DataSource;

                                          if (newnames.data[0].name.screendata[j].formData[0].data['parentPK'] !== undefined) {
                                            this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data['parentPK'] = newnames.data[0].name.screendata[j].formData[0].data['parentPK'];
                                          }

                                          if (newnames.data[0].name.screendata[j].formData[0].data.moreRows) {
                                            this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.moreRows = newnames.data[0].name.screendata[j].formData[0].data.moreRows;
                                          }

                                          if (newnames.data[0].name.screendata[j].formData[0].data.tableRefreshed !== undefined) {
                                            this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.tableRefreshed = newnames.data[0].name.screendata[j].formData[0].data.tableRefreshed;
                                          }

                                        }

                                        break;
                                      }
                                    }
                                  }
                                  /*****************/
                                }
                              }// END IF
                            }
                            GlobalHelper.globlevar.onlyCardClicked = false;
                          }
                        }

                      }
                      // GlobalHelper.globlevar["onDetailSectionLoad"] = true;
                      GlobalHelper.globlevar["onPopDetailSectionLoad"] = true;
                      GlobalHelper.globlevar['sectionlevelrefresh'] = false;
                      GlobalHelper.globlevar['onlyDataCalled'] = false;
                      this.targetToRulesMapper = new Map();
                      this.ruleToTargetsMapper = new Map();
                      this.fieldInExpressionToRulesMapper = new Map();
                      this.defaultValueManagerMap = new Map();
                      this.ruleExecutionStatusMap = new Map();
                      this.isOnload = true;
                      this.fieldsChangedForRuleExecution = [];
                      this.throwValidationRulesArray = new Array();
                      this.F2FunctionNames.data[0].name = this.namess;
                      GlobalHelper.globlevar['defaultValueManagerMap'] = createDefaultValueMap(this.namess, GlobalHelper.globlevar['targetToRulesMapper']);
                      this.forceUpdate();
                    }

                  });
              }
            } else if (dtailsecId != null) {
              let functionIdForDetailSection = undefined;
              if (objk != null) {
                let sectionObject = this.namess.screendata.filter(item => item.sessionID == objk.sessionID)[0];
                if (sectionObject != null) {
                  if (sectionObject['summaryConfigTypesection'] == "true") {
                    functionIdForDetailSection = this.namess.functionIDOfSummaryConfigType;
                  } else {
                    functionIdForDetailSection = this.namess.functionID;
                    this.namess.functionIDOfSummaryConfigType = undefined;
                  }
                }

              } else {
                functionIdForDetailSection = this.namess.functionID;
                this.namess.functionIDOfSummaryConfigType = undefined;
              }
              if (this.addTabScreen.length > 0) {
                GlobalHelper.globlevar['tabScreen'][this.addTabindex].linkclicked = GlobalHelper.globlevar.linkclicked;
              }

if ((GlobalHelper.globlevar['workflow'] === true) || (GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] === undefined)){ 
      GlobalHelper.globlevar['workflow'] = false;
                store.dispatch({
                  type: 'GRIDFETCHDATA',
                  extraData: extraData,
                  values,
                  orientationType: this.props.orientationType,
                  functionID: functionIdForDetailSection
                });
              } else {
                let calculatedPkValues = GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'];
                if(calculatedPkValues.length > 0 && calculatedPkValues[0].contextPrimaryKyeValues.indexOf('_ut=NORMAL_BUSINESS_USER') && GlobalHelper.globlevar['clickCLIPSEARCH'] == false){
                  store.dispatch({
                    type: 'GRIDFETCHDATA',
                    extraData: extraData,
                    values,
                    orientationType: this.props.orientationType,
                    calculatedPkValues,
                    functionID: functionIdForDetailSection
                  });
                } else{
                  store.dispatch({
                    type: 'GRIDFETCHDATA',
                    extraData: extraData,
                    values,
                    orientationType: this.props.orientationType,
                    calculatedPkValues,
                    functionID: functionIdForDetailSection
                  });
                }
              }

            }
          }

          this.setState({
            islinkclicked: true
          })
        }

      } else {
        if (responsestatus === "S") {
          responsestatus = undefined;
        }
      }
      //}
      //}
    } catch (error) {
      Log4r.log('Error......', error);
    }

  }

  replaceSectionalButtonsWithPaletteButtons(names, sectionId) {
    names.ButtonPalette = [];

    for (let i = 0; i < sectionId.length; i++) {

      let requiredSection = names.screendata.filter(item => item.sessionID === sectionId[i])[0];

      //Temporary adding a clear button in to filtered section
      if (requiredSection.sectionButton !== undefined) {
        if (requiredSection.addRowtoGridSection != null) {
          let checkSomeSection = names.screendata.filter(item => item.sessionID === requiredSection.addRowtoGridSection)[0];
          if (checkSomeSection.formData[0][requiredSection.addRowtoGridSection] != null) {
            if (checkSomeSection.formData[0][requiredSection.addRowtoGridSection].data.detailsectionid === this.props.outnames.data[0].name['addToGridSectionalLinkData']) {
              requiredSection.sectionButton.buttons.push({ 'fname': '', 'id': 'clearPopupSection', 'title': 'Clear Pop Section' });
              if (requiredSection.sectionButton.applicable === "true") {
                let buttonPaletteObject = {};

                buttonPaletteObject['schema'] = [{}];
                buttonPaletteObject['uiSchema'] = [{ 'children': [], 'xType': 'grid' }];
                buttonPaletteObject['formData'] = [{}]

                //Temporary button icons
                let buttonIcon = "";

                for (let i = 0; i < requiredSection.sectionButton.buttons.length; i++) {
                  if (requiredSection.sectionButton.buttons[i] != null) {
                    if (GlobalHelper.globlevar['handleAddClicked'] === true) {

                      if (requiredSection.sectionButton.buttons[i].id === "editRowtoGrid") {
                        requiredSection.sectionButton.buttons[i].hidden = true;
                      }
                      if (requiredSection.sectionButton.buttons[i].id !== "refreshButton" && requiredSection.sectionButton.buttons[i].id !== "editRowtoGrid") {
                        if (requiredSection.sectionButton.buttons[i].id == "addRowtoGrid") {
                          buttonIcon = "plus";
                        } else if (requiredSection.sectionButton.buttons[i].id == "editRowtoGrid") {
                          buttonIcon = "pencil";
                        } else if (requiredSection.sectionButton.buttons[i].id == "clearPopupSection") {
                          buttonIcon = "eraser";
                        } else {
                          buttonIcon = "start";
                        }
                        buttonPaletteObject.schema[0][requiredSection.sectionButton.buttons[i].id] = { "title": requiredSection.sectionButton.buttons[i].title };
                        buttonPaletteObject.uiSchema[0].children.push({ "xType": "col", "span": 6, "children": { "xType": "field", "widget": "button", "fieldPath": requiredSection.sectionButton.buttons[i].id } });
                        buttonPaletteObject.formData[0][requiredSection.sectionButton.buttons[i].id] = { "style": { "type": "default", "size": "large", "label": requiredSection.sectionButton.buttons[i].title, "classname": "paletteClassSave", "icon": buttonIcon, "accessCat": "W", "buttonCategory": "STANDARD", "eventName": "", "sesctionEventToCarryOnButton": requiredSection.sectionButton.buttons[i].fname, "requiredSectionId": requiredSection.sessionID, "parentSectionId": (requiredSection.sectionButton.buttons[i].id == "clearPopupSection" ? requiredSection.sectionButton.buttons[0].parentSectionId : requiredSection.sectionButton.buttons[i].parentSectionId), "sectionButtonId": requiredSection.sectionButton.buttons[i].id } };
                        requiredSection.sectionButton.buttons[i].hidden = true;

                      }

                    } else {

                      if (requiredSection.sectionButton.buttons[i].id === "addRowtoGrid") {
                        requiredSection.sectionButton.buttons[i].hidden = true;
                      }
                      if (requiredSection.sectionButton.buttons[i].id !== "refreshButton" && requiredSection.sectionButton.buttons[i].id !== "addRowtoGrid") {
                        if (requiredSection.sectionButton.buttons[i].id == "addRowtoGrid") {
                          buttonIcon = "plus";
                        } else if (requiredSection.sectionButton.buttons[i].id == "editRowtoGrid") {
                          buttonIcon = "pencil";
                        } else if (requiredSection.sectionButton.buttons[i].id == "clearPopupSection") {
                          buttonIcon = "eraser";
                        } else {
                          buttonIcon = "start";
                        }
                        buttonPaletteObject.schema[0][requiredSection.sectionButton.buttons[i].id] = { "title": requiredSection.sectionButton.buttons[i].title };
                        buttonPaletteObject.uiSchema[0].children.push({ "xType": "col", "span": 6, "children": { "xType": "field", "widget": "button", "fieldPath": requiredSection.sectionButton.buttons[i].id } });
                        buttonPaletteObject.formData[0][requiredSection.sectionButton.buttons[i].id] = { "style": { "type": "default", "size": "large", "label": requiredSection.sectionButton.buttons[i].title, "classname": "paletteClassSave", "icon": buttonIcon, "accessCat": "W", "buttonCategory": "STANDARD", "eventName": "", "sesctionEventToCarryOnButton": requiredSection.sectionButton.buttons[i].fname, "requiredSectionId": requiredSection.sessionID, "parentSectionId": (requiredSection.sectionButton.buttons[i].id == "clearPopupSection" ? requiredSection.sectionButton.buttons[0].parentSectionId : requiredSection.sectionButton.buttons[i].parentSectionId), "sectionButtonId": requiredSection.sectionButton.buttons[i].id } };

                        requiredSection.sectionButton.buttons[i].hidden = true;

                      }
                    }
                  }
                }
                GlobalHelper.globlevar['handleAddClicked'] = undefined;

                names.ButtonPalette.push(buttonPaletteObject);
              }
            }
          }
        }
      }
    }
  }

  f2CallBackFuncOnSectionalPopupClose(namesValues, modifiedNames, addonValues, newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked) {
    this.replaceCurrentGridDataWithPopupSectionFormdata(namesValues, modifiedNames, addonValues, newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked);
  }

  replaceCurrentGridDataWithPopupSectionFormdata(namesValues, modifiedNames, addonValues, newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked) {
    GlobalHelper.globlevar['linkclicked'] = linkclicked;
    GlobalHelper.globlevar['newFunctionNames'] = newGlobalNames;
    GlobalHelper.globlevar['assortedMapOfParent'] = assortedMapOfParent;
    GlobalHelper.globlevar['assortedMapOfLeaf'] = assortedMapOfLeaf;
    GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonTemplateObjectOfBackScreen;
    GlobalHelper.globlevar['targetToRulesMapper'] = targetToRulesMapper;
    GlobalHelper.globlevar['ruleToTargetsMapper'] = ruleToTargetsMapper;
    GlobalHelper.globlevar['fieldInExpressionToRulesMapper'] = fieldInExpressionToRulesMapper;
    GlobalHelper.globlevar['defaultValueManagerMap'] = defaultValueManagerMap;
    GlobalHelper.globlevar['ruleExecutionStatusMap'] = ruleExecutionStatusMap;
    GlobalHelper.globlevar['throwValidationRulesArray'] = throwValidationRulesArray;
    GlobalHelper.globlevar['hybridOneThirdCardsCount'] = hybridOneThirdCardsCount;
    GlobalHelper.globlevar['summaryConfigType_save'] = summaryConfigType_save;
    GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = summaryConfigTypeFunctionid;
    GlobalHelper.globlevar['summaryConfigType'] = summaryConfigType;

    for (let i = 0; i < modifiedNames.data[0].name.screendata.length; i++) {
      let dependantSecionId = namesValues['addToGridSectionalLinkData'];
      let allDependantSections = new Model().getLeafNodesForId(dependantSecionId);
      let arrayKeys = Object.keys(allDependantSections);
      for (let o = 0; o < arrayKeys.length; o++) {
        let requiredSection = namesValues.screendata.filter(item => item.sessionID === arrayKeys[o])[0];
        if (requiredSection != null) {
          let sectionInCurrentNames = namesValues.screendata.filter(item => item.sessionID === modifiedNames.data[0].name.screendata[i].addRowtoGridSection)[0];
          if (sectionInCurrentNames != null) {
            let parentSectionId = sectionInCurrentNames.sessionID;
            let sectionInModifiedNames = modifiedNames.data[0].name.screendata.filter(item => item.sessionID == parentSectionId)[0];
            if (sectionInCurrentNames) {
              sectionInCurrentNames.formData[0][parentSectionId].data.DataSource = [];
              sectionInModifiedNames.formData[0][parentSectionId].data.DataSource.map((item, index) => {
                sectionInCurrentNames.formData[0][parentSectionId].data.DataSource.push(item);
              });

            }
            break;
          }
          let otherSectionsToModify = modifiedNames.data[0].name.screendata.filter(item => item.sessionID == requiredSection.sessionID)[0];
          let sameSectionInCurrentNames = namesValues.screendata.filter(item => (item.sessionID === requiredSection.sessionID && item.sessionID !== modifiedNames.data[0].name.screendata[i].addRowtoGridSection))[0];
          if (otherSectionsToModify != null && sameSectionInCurrentNames != null) {
            sameSectionInCurrentNames.formData = [];
            otherSectionsToModify.formData.map((item, index) => {
              sameSectionInCurrentNames.formData.push(item);
            });
          }
        }
      }

    }
    this.namess = namesValues;
    this.F2FunctionNames.data[0].name = namesValues;
    GlobalHelper.globlevar['restoringNames'] = true;
    this.forceUpdate();
  }

  // currently used
  ClearFormsData(leafIds) {
    let resSecIdKeys;
    if (Array.isArray(leafIds)) {
      resSecIdKeys = leafIds
    } else if (typeof leafIds == "object") {
      resSecIdKeys = Object.keys(leafIds);
    } else if (typeof leafIds == "string") {
      let arrnew = [];
      arrnew.push(leafIds);
      resSecIdKeys = arrnew;
    }

    for (let i = 0; i < this.namess.screendata.length; i++) {
      if (resSecIdKeys.includes(this.namess.screendata[i].sessionID)) {
        for (let j = 0; j < this.namess.screendata[i].uiSchema[0].children.length; j++) {
          //  if(this.namess.screendata[i].uiSchema[0].children[j].children.widget !== "table" &&  this.namess.screendata[i].uiSchema[0].children[j].children.widget !== "popsearch" && this.namess.screendata[i].uiSchema[0].children[j].children.widget !== "hidden")
          if (this.namess.screendata[i].uiSchema[0].children[j].children.widget !== "table" && this.namess.screendata[i].uiSchema[0].children[j].children.widget !== "popsearch") {
            for (let l = 0; l < Object.keys(this.namess.screendata[i].formData[0]).length; l++) {
              if (Object.keys(this.namess.screendata[i].formData[0])[l] == this.namess.screendata[i].uiSchema[0].children[j].children.fieldPath) {
                let formDataObject = this.namess.screendata[i].formData[0][Object.keys(this.namess.screendata[i].formData[0])[l]];
                formDataObject.data = "";
                break;
              }
            }
          } else if (this.namess.screendata[i].uiSchema[0].children[j].children.widget == "popsearch") {
            for (let l = 0; l < Object.keys(this.namess.screendata[i].formData[0]).length; l++) {
              if (Object.keys(this.namess.screendata[i].formData[0])[l] == this.namess.screendata[i].uiSchema[0].children[j].children.fieldPath) {
                let formDataObject = this.namess.screendata[i].formData[0][Object.keys(this.namess.screendata[i].formData[0])[l]];
                formDataObject.data = "";
                formDataObject.desc = "";
                break;
              }
            }
          } else if (this.namess.screendata[i].uiSchema[0].children[j].children.widget == "table") {
            for (let l = 0; l < Object.keys(this.namess.screendata[i].formData[0]).length; l++) {
              if (Object.keys(this.namess.screendata[i].formData[0])[l] == this.namess.screendata[i].uiSchema[0].children[j].children.fieldPath) {
                let formDataObject = this.namess.screendata[i].formData[0][Object.keys(this.namess.screendata[i].formData[0])[l]];

                try {
                  formDataObject.data.DataSource = [];
                  var detailsectionidmatch = this.namess.screendata.filter(items => items.sessionID === formDataObject.data.detailsectionid)[0];
                  if (detailsectionidmatch != null) {
                    let excludexpath = this.namess.screendata[i].uiSchema[0].children[0].children.xPath.split('.');
                    let tempxpath = "";
                    for (let i = 0; i < excludexpath.length - 1; i++) {
                      if (i == 0) {
                        tempxpath = tempxpath + excludexpath[i];
                      } else {
                        tempxpath = tempxpath + "." + excludexpath[i];
                      }

                    }
                    detailsectionidmatch['excludePKValue'] = tempxpath;
                    this.ClearFormsData(detailsectionidmatch.sessionID);
                  } else {

                    let dependantSections = new Model().getLeaf(formDataObject.data.detailsectionid);
                    if (dependantSections) {
                      for (let m = 0; m < dependantSections.length; m++) {

                        var detailsectionidmatch = this.namess.screendata.filter(items => items.sessionID === Object.keys(dependantSections[m])[0])[0];
                        let excludexpath = detailsectionidmatch.uiSchema[0].children[0].children.xPath.split('.');
                        let tempxpath = "";
                        for (let i = 0; i < excludexpath.length - 1; i++) {
                          if (i == 0) {
                            tempxpath = tempxpath + excludexpath[i];
                          } else {
                            tempxpath = tempxpath + "." + excludexpath[i];
                          }
                        }
                        detailsectionidmatch['excludePKValue'] = tempxpath;

                        this.ClearFormsData(Object.keys(dependantSections[m])[0]);
                      }
                    }
                  }

                } catch (e) {
                  Log4r.error(e)
                }

                break;
              }
            }
          } else { }
        }
      }
    }

  }

  // currently not used
  ClearFormData(sesHeadr) {
    var deleteFlag = false;
    var detailsectonToClear;
    var leafSectionIdsOfParent;
    for (var i = 0; i < this.holdNamess.screendata.length; i++) {
      for (var j = 0; j < this.holdNamess.screendata[i].formData.length; j++) {
        var KeyArray = Object.keys(this.holdNamess.screendata[i].formData[j]);

        if (this.holdNamess.screendata[i].uiSchema[0].children[0].children.widget === "table") {
          if (this.holdNamess.screendata[i].sessionID === sesHeadr) {
            detailsectonToClear = this.holdNamess.screendata[i].formData[0][sesHeadr].data.detailsectionid;
            leafSectionIdsOfParent = new Model().getLeaf(detailsectonToClear);
          }
        }

        if (this.holdNamess.screendata[i].uiSchema[0].children[0].children.widget !== "table") {
          for (var k = 0; k < KeyArray.length; k++) {
            let widget = undefined;
            if (this.holdNamess.screendata[i].uiSchema[0].children.filter(item => item.children.fieldPath === KeyArray[k])[0]) {
              widget = this.holdNamess.screendata[i].uiSchema[0].children.filter(item => item.children.fieldPath === KeyArray[k])[0].children.widget;
            }
            if (widget !== "table" && widget !== "hidden" && widget !== undefined) {
              if (GlobalHelper.globlevar['addrow'] == "true") // section should clear if Gridsummery link will click
              {
                if (detailsectonToClear != null && this.holdNamess.screendata[i].sessionID === detailsectonToClear) {
                  if (this.holdNamess.screendata[i].formData[j][KeyArray[k]].desc !== undefined) {
                    this.holdNamess.screendata[i].formData[j][KeyArray[k]].desc = [];
                  }
                  this.holdNamess.screendata[i].formData[j][KeyArray[k]].data = '';

                } else if (leafSectionIdsOfParent != null && leafSectionIdsOfParent.length != 0) {
                  for (let i = 0; i < leafSectionIdsOfParent.length; i++) {
                    let detalsection = Object.keys(leafSectionIdsOfParent[i])[0];
                    this.holdNamess.screendata.map((item, index) => {
                      if (detalsection === item.sessionID) {
                        let keyObjarr = Object.keys(item.formData[0]);
                        for (let g = 0; g < keyObjarr.length; g++) {
                          if (item.formData[0][keyObjarr[g]].desc !== undefined) {
                            item.formData[0][keyObjarr[g]].desc = [];
                          }
                          if (item.formData[0][keyObjarr[g]].data != null) {
                            item.formData[0][keyObjarr[g]].data = '';
                          }
                          if (typeof (item.formData[0][keyObjarr[g]]) === "string") {
                            item.formData[0][keyObjarr[g]] = [];
                          }
                        }
                      }
                    })
                  }
                }
              }
              else {
                // section will in default state if clear / submite button clicked.
                preData.forEach(function (value, key) {
                  if (key === KeyArray[k]) {
                    this.holdNamess.screendata[i].formData[j][KeyArray[k]].data = value;
                    deleteFlag = true;
                  }
                })
                if (!deleteFlag) {
                  if (this.holdNamess.screendata[i].formData[j][KeyArray[k]].desc !== undefined) {
                    this.holdNamess.screendata[i].formData[j][KeyArray[k]].desc = [];
                  }
                  this.holdNamess.screendata[i].formData[j][KeyArray[k]].data = '';
                }
                else {
                  deleteFlag = false;
                }
              }
            }
          }

          /* if( GlobalHelper.globlevar['addrow'] == "true") // section should clear if Gridsummery link will click
          {
            alert("clear addrow false");
            GlobalHelper.globlevar['addrow'] = "false";
          }*/
        }
        else if (this.holdNamess.screendata[i].uiSchema[0].children[0].children.widget === "table") {
          let fpath = this.holdNamess.screendata[i].uiSchema[0].children[0].children.fieldPath;
          let len = this.holdNamess.screendata[i].formData[j][fpath].data.DataSource.length;
          let dsArr = [];
          let count2 = 0;
          for (var k = 0; k < len; k++) {
            if (this.holdNamess.screendata[i].formData[j][fpath].data.DataSource[k].flagOnClearButton === true) {
              GlobalHelper.globlevar['setValInGridRender'].push(fpath);
            }
            else {
              dsArr[count2] = JSON.parse(JSON.stringify(this.holdNamess.screendata[i].formData[j][fpath].data.DataSource[k]));
              count2++;
            }
          }
          this.holdNamess.screendata[i].formData[j][fpath].data.DataSource = dsArr;
        }
      }
    }

    /*if( GlobalHelper.globlevar['addrow'] == "true") // section should clear if Gridsummery link will click
    {
        GlobalHelper.globlevar['addrow'] = "false";
    }*/
  }

  /*Sprint 17 : [Task 12] : [START]  Added method to check wether data is changed or not */
  checkNothingToSave() {
    let tempchk = true;
    let chk = true;

    if (GlobalHelper.globlevar['checkNothingToSave'] === true) {
      GlobalHelper.globlevar['checkNothingToSave'] = false;

      for (var i = 0; i < this.namess.screendata.length; i++) {
        if (this.firstRenderScreen != undefined)
          if (this.firstRenderScreen.screendata != undefined)
            for (var j = 0; j < this.firstRenderScreen.screendata.length; j++) {
              if (this.namess.screendata[i].sessionID === this.firstRenderScreen.screendata[j].sessionID) {
                Object.keys(this.firstRenderScreen.screendata[j].formData[0]).map((item, index) => {    // NOSONAR: javascript:S2201

                  let widgetType = "";
                  try {
                    widgetType = this.firstRenderScreen.screendata[j].uiSchema[0].children.filter(widgetName => widgetName.children.fieldPath === item)[0].children.widget;
                  } catch (e) { Log4r.error(e) }
                  if (widgetType !== "table") {
                    try {
                      if (this.namess.screendata[i].formData[0][item].data !== undefined && this.firstRenderScreen.screendata[j].formData[0][item].data !== undefined) {
                        if (this.namess.screendata[i].formData[0][item].data.length <= 1) {
                          if (Array.isArray(this.namess.screendata[i].formData[0][item].data) && this.namess.screendata[i].formData[0][item].data.length === 0) {
                            tempchk = true;
                          }
                          else if (Array.isArray(this.namess.screendata[i].formData[0][item].data)) {
                            if (this.namess.screendata[i].formData[0][item].data[0] !== undefined) {
                              if (this.namess.screendata[i].formData[0][item].data[0].length === 0) {
                                tempchk = true;
                              } else {
                                if (this.namess.screendata[i].formData[0][item].data[0] !== this.firstRenderScreen.screendata[j].formData[0][item].data[0]) {
                                  tempchk = false;
                                }
                              }
                            }

                          }
                          else if (this.namess.screendata[i].formData[0][item].data.length === 0 && this.firstRenderScreen.screendata[j].formData[0][item].data.length === 0) {
                            tempchk = true;
                          }
                          else if (this.namess.screendata[i].formData[0][item].data.length === 0 && this.firstRenderScreen.screendata[j].formData[0][item].data.length !== 0) {
                            tempchk = false;
                          }
                        }
                        else {
                          if (Array.isArray(this.namess.screendata[i].formData[0][item].data)) {
                            if (JSON.stringify(this.namess.screendata[i].formData[0][item].data) === JSON.stringify(this.firstRenderScreen.screendata[j].formData[0][item].data)) {
                              tempchk = true;
                            }
                            else {
                              tempchk = false;
                            }
                          }
                          else {
                            tempchk = false;
                          }
                        }


                        if (this.namess.screendata[i].formData[0][item].data.length !== 0 && typeof this.namess.screendata[i].formData[0][item].data !== typeof []) {
                          if (widgetType === "checkbox") {
                            if (this.firstRenderScreen.screendata[j].formData[0][item].data[0] !== "Y") {
                              if (this.namess.screendata[i].formData[0][item].data === "N") {
                                tempchk = true;
                              }
                              else {
                                tempchk = false;
                              }
                            }
                            else {
                              if (this.namess.screendata[i].formData[0][item].data !== this.firstRenderScreen.screendata[j].formData[0][item].data[0]) {
                                tempchk = false;
                              }
                              else {
                                tempchk = false;
                              }
                            }

                          }
                          else {
                            if (JSON.stringify(this.namess.screendata[i].formData[0][item].data) === JSON.stringify(this.firstRenderScreen.screendata[j].formData[0][item].data)) {
                              tempchk = true;
                            }
                            else if (this.namess.screendata[i].formData[0][item].data.length !== 0 && typeof this.firstRenderScreen.screendata[j].formData[0][item].data === typeof [] && this.firstRenderScreen.screendata[j].formData[0][item].data[0] !== undefined) {
                              if (this.namess.screendata[i].formData[0][item].data === this.firstRenderScreen.screendata[j].formData[0][item].data[0]) {
                                tempchk = true;
                              }
                              // else {
                              //   tempchk = false;
                              // }
                            }
                            else {
                              tempchk = false;
                            }
                          }

                        }
                      }
                      else {
                        tempchk = true;
                      }
                    } catch (e) {
                      tempchk = true;
                      Log4r.error(e);
                    }
                  }
                  else {
                    if (widgetType === "table") {
                      if (this.namess.screendata[i].formData[0][item].data.DataSource.length !== 0) {
                        for (var k = 0; k < this.namess.screendata[i].formData[0][item].data.DataSource.length; k++) {
                          if (this.namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('mode') && this.namess.screendata[i].formData[0][item].data.DataSource[k].mode !== undefined) {
                            if (this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k] !== undefined) {
                              let temptablechk = true;
                              for (var x = 0; x < Object.keys(this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k]).length; x++) {
                                for (var y = 0; y < Object.keys(this.namess.screendata[i].formData[0][item].data.DataSource[k]).length; y++) {
                                  if (Object.keys(this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x] !== "errorList" && Object.keys(this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x] !== "holdForChngObj") {
                                    if (Object.keys(this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x] === Object.keys(this.namess.screendata[i].formData[0][item].data.DataSource[k])[y]) {
                                      let sfpath = ""; sfpath = Object.keys(this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x];
                                      let ospath = ""; ospath = Object.keys(this.namess.screendata[i].formData[0][item].data.DataSource[k])[y];
                                      if ((this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k][sfpath] !== this.namess.screendata[i].formData[0][item].data.DataSource[k][ospath]) || (this.firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k]['isRowSelected'] !== this.namess.screendata[i].formData[0][item].data.DataSource[k]['isRowSelected'])) {
                                        temptablechk = false;
                                      }
                                      else {
                                        temptablechk = true;
                                      }
                                      break;
                                    }
                                  }
                                }
                                tempchk = (temptablechk && tempchk);
                                if (this.namess.screendata[i].formData['isTableRowSelected'] != null && this.namess.screendata[i].formData['isTableRowSelected'] != undefined && this.namess.screendata[i].formData['isTableRowSelected'] === true) {
                                  tempchk = false;
                                }
                              }

                              if (this.namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('mode') && this.namess.screendata[i].formData[0][item].data.DataSource[k].mode !== undefined) {
                                if (this.namess.screendata[i].formData[0][item].data.DataSource[k].mode === "I" || this.namess.screendata[i].formData[0][item].data.DataSource[k].mode === "U" || this.namess.screendata[i].formData[0][item].data.DataSource[k].mode === "D") {
                                  tempchk = false;
                                }
                              }
                            }
                            else {
                              if (this.namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('mode') && this.namess.screendata[i].formData[0][item].data.DataSource[k].mode !== undefined) {
                                if (this.namess.screendata[i].formData[0][item].data.DataSource[k].mode === "I" || this.namess.screendata[i].formData[0][item].data.DataSource[k].mode === "U") {
                                  tempchk = false;
                                }
                              }
                            }

                          }
                          else {
                            if (this.namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('modifiedmode') && this.namess.screendata[i].formData[0][item].data.DataSource[k].modifiedmode !== undefined) {
                              tempchk = false;
                            }
                          }
                        }
                      }
                    }
                  }

                  chk = (chk && tempchk);
                });
                break;
              }
            }
      }

      var originaljson = JSON.stringify(this.namess.screendata);
      var updatedJson = JSON.stringify(this.firstRenderScreen.screendata);
      let checkNothingToSaveFlag = true;
      if (originaljson !== updatedJson) {
        /*for(var i=0 ; i <this.namess.screendata.length ; i++ ){
          if( this.namess.screendata[i].uiSchema[0].children[0].children.widget === "table")
          {
            let fieldPath = this.namess.screendata[i].uiSchema[0].children[0].children.fieldPath;
            var data1 = JSON.stringify(this.namess.screendata[i].formData[0][fieldPath].data.DataSource);
            var data2 = JSON.stringify(this.firstRenderScreen.screendata[i].formData[0][fieldPath].data.DataSource);
            if(data1 !== data2){
            checkNothingToSaveFlag =  false;
            }
          }
        }*/
        return chk;
      }
    }
    return chk;
  }
  /*Sprint 17 : [Task 12] : [END] */

  //Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
  redirectingToPrevScreenOnClosingClipScreen(pathtoredirect) {
    if (pathtoredirect === "CloseUIScreen_ClipSearch") {
      closepath = undefined;
      GlobalHelper.globlevar['WrappedTableContainerObject'].onRowClick(GlobalHelper.globlevar['expandablerecord'], GlobalHelper.globlevar['expandableindex'], GlobalHelper.globlevar['expandableevent']);

      GlobalHelper.globlevar['ClipSearchViaWorklist'] = false;
      GlobalHelper.globlevar['ClipSearchViaUIScreen'] = false;
      GlobalHelper.globlevar['ClipSearchViaPrompMode'] = false;
      GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = false;
      GlobalHelper.globlevar['promptmode'] = null;

      let values = GlobalHelper.storeapFunction.substring(GlobalHelper.storeapFunction.indexOf("$") + 1);

    }
    else if (pathtoredirect === "ClosePromptScreen_ClipSearch") {
      closepath = undefined;
      GlobalHelper.globlevar['ClipSearchViaPrompMode'] = false;
      GlobalHelper.globlevar['MainLayoutObject'].MyFuncLeft(GlobalHelper.globlevar["LeftMenuClickedData"]);

      GlobalHelper.globlevar['ClipSearchViaWorklist'] = false;
      GlobalHelper.globlevar['ClipSearchViaUIScreen'] = false;
      GlobalHelper.globlevar['ClipSearchViaPrompMode'] = false;
      GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = false;
      GlobalHelper.globlevar['promptmode'] = null;

      let values = GlobalHelper.storeapFunction.substring(GlobalHelper.storeapFunction.indexOf("$") + 1);

    }
  }//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.

  handleClick(label, sesHeadr, buttonId) {
	  if(buttonId==='next'||buttonId==='previous')
    {
     GlobalHelper.globlevar.savespin = true;
    this.forceUpdate();   
    }
    GlobalHelper.globlevar.btnLabel = label;
    buttonIdOnsave = buttonId;
    if (sesHeadr != undefined || GlobalHelper.globlevar.clearButtonclick === "true") {
      GlobalHelper.globlevar.clearButtonclick = undefined;
      var x = new Map();
      if ("CLOSE" === label || "close" === buttonId) {
        ErrorHandler.clear();
        this.callClose();
      } else if ("SAVE & NEXT" === label || "saveandnext" === buttonId) {
        this.callSave();
        temlabel = "SAVE & NEXT";
        // uiNextButtonHandler(label);
        // GlobalHelper.globlevar.linkclicked = false;
      } else if ("Clear Pop Section" === label) { //&& GlobalHelper.globlevar.detectFirstChangeOnScrn
        let allDependantSections = undefined;
        let requiredDetailSectionId = null;
        let findeSection = this.namess.screendata.filter(item => item.sessionID === sesHeadr.parentSectionId)[0];
        if (findeSection != null) {
          if (findeSection.formData[0][sesHeadr.parentSectionId] != null) {
            if (findeSection.formData[0][sesHeadr.parentSectionId].data.detailsectionid != null) {
              requiredDetailSectionId = findeSection.formData[0][sesHeadr.parentSectionId].data.detailsectionid;
            }
          }
        }
        allDependantSections = new Model().getLeafNodesForId(requiredDetailSectionId);
        this.isPopSectionClearClicked = { "isClicked": true };
        this.namess.screendata.map((item, index) => {
          if (item['popSectionToBeCleared'] != null) {
            delete item['popSectionToBeCleared'];
          }
        });
        let arrayKeys = [];
        if (allDependantSections !== undefined) {
          arrayKeys = Object.keys(allDependantSections);
        }
        if (arrayKeys.length > 0) {
          for (let o = 0; o < arrayKeys.length; o++) {
            this.namess.screendata.map((item, index) => {
              if (item.sessionID === arrayKeys[o]) {
                item['popSectionToBeCleared'] = true;
              }
            })
            this.ClearFormsData(arrayKeys[o]);
          }
        }
        this.forceUpdate();
      } else if ("AddToGrid" === label || "UpdateRow" === label) { //&& GlobalHelper.globlevar.detectFirstChangeOnScrn
        GlobalHelper.globlevar['sectionLinkclicked'] = false;
        let jsonObjectIdToUpdate = undefined;
        let sectionIdToUpdate = undefined;
        if (sesHeadr.sesctionEventToCarryOnButton) {
          for (let i = 0; i < this.F2FunctionNames.data[0].name.screendata.length; i++) {
            jsonObjectIdToUpdate = this.F2FunctionNames.data[0].name.screendata[i].addRowtoGridSection;
            sectionIdToUpdate = this.F2FunctionNames.data[0].name.screendata[i].sessionID;

            if (sectionIdToUpdate && jsonObjectIdToUpdate) {
              let addtoGridJsonsSectionToUpdate = this.F2FunctionNames.data[0].name.addtoGridJsons[jsonObjectIdToUpdate];
              for (let i = 0; i < addtoGridJsonsSectionToUpdate.length; i++) {
                if (addtoGridJsonsSectionToUpdate[i].sessionID === sectionIdToUpdate) {
                  addtoGridJsonsSectionToUpdate[i].formData[0] = {};
                  addtoGridJsonsSectionToUpdate[i].formData[0] = this.F2FunctionNames.data[0].name.screendata.filter(item => item.sessionID === sectionIdToUpdate)[0].formData[0];
                  break;
                }
              }
            }
            if (sesHeadr.requiredSectionId === this.F2FunctionNames.data[0].name.screendata[i].sessionID) {
              this.F2FunctionNames.data[0].name.screendata[i]['triggerSectionButtonEvent'] = { 'buttonClicked': sesHeadr.sectionButtonId };
            }

            //break;
          }
          this.forceUpdate();
        }
      } else if ("SAVE" === label || "DONE" === label || "done" === buttonId || "SUBMIT" === label || "submit" === buttonId || "save" === buttonId || "DONE" === label || "btnDone" === buttonId) {
        GlobalHelper.globlevar['buttonSpin'] = true;//Sprint 44 - To show spin on click of button palette - used in palette.js & data-service.js
        let tempVar = ErrorHandler.getstatusES();
        GlobalHelper.globlevar['setRefreshPropsOfTab'] = true;

        if (tempVar == 's') {
          responsestatus = undefined;
          let tmpvvv = undefined;
          ErrorHandler.setstatusES(tmpvvv);
          ErrorHandler.setErrMessage(tmpvvv);
          ErrorHandler.setType(tmpvvv);
        }
        if ("DONE" === label || "done" === buttonId || "SUBMIT" === label || "submit" === buttonId) {
          calledFromSubmit = true;
          GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
        } else {
          calledFromSubmit = false;
        }

        if (this.props.functionMode === "B") {
          if (this.props.selectedRowKeysArray.length > 0) {
            this.callSave();
          } else {
            displayMessageBox("WARNING", I18NMessage('app.gridRowRequired'), "W")
          }
        }
        else {
          this.callSave();
        }
        //this.callSave();
      } else if ("ClickGridAddButton" === label) //&& GlobalHelper.globlevar.detectFirstChangeOnScrn
      {
        //Click Grid Add Button In case of DetailssectionId
        // earlier handling starts
        preData.clear();
        if (sesHeadr !== "sesHeadr") {
          if (buttonId !== "addRowtoGrid") {
            //ErrorHandler.clear();
          }
        }
        //this.getPredefinedData(holdbasicdata.data[0].name);


        let requiredSectionToBeCleared = this.holdNamess.screendata.filter(item => item.sessionID === sesHeadr)[0];
        if (requiredSectionToBeCleared != null) {
          this.ClearFormsData(requiredSectionToBeCleared.sessionID);
        } else {
          let allDependantSections = undefined;
          allDependantSections = new Model().getLeafNodesForId(sesHeadr);
          let arrayKeys = [];
          if (allDependantSections !== undefined) {
            arrayKeys = Object.keys(allDependantSections);
          }
          if (arrayKeys.length > 0) {
            for (let o = 0; o < arrayKeys.length; o++) {
              this.ClearFormsData(arrayKeys[o]);
            }
          }
        }

        if (buttonId === "addThroughSummaryGrid") {
          let aSectionalPopupScreen = false;
          let sectionalPopupOutnames = JSON.parse(JSON.stringify(this.holdNamess));

          let dependantSection = [];

          for (let e = 0; e < this.holdNamess.screendata.length; e++) {

            let dependantSecionId = undefined;

            if (this.props.outnames.data[0].name['addToGridSectionalLinkData'] !== undefined) {
              dependantSecionId = this.props.outnames.data[0].name['addToGridSectionalLinkData']

            }
            let allDependantSections = undefined;
            if (dependantSecionId !== undefined) {
              allDependantSections = new Model().getLeafNodesForId(dependantSecionId);
            }

            let arrayKeys = [];
            if (allDependantSections !== undefined) {
              arrayKeys = Object.keys(allDependantSections);
            }

            if (arrayKeys.length > 0) {
              for (let o = 0; o < arrayKeys.length; o++) {
                let requiredSection = this.holdNamess.screendata.filter(item => item.sessionID === arrayKeys[o])[0];
                if (requiredSection != undefined) {
                  aSectionalPopupScreen = true;
                  this.hasDetailSection = true; //Issue -Save button visibility issue for summary Grid Section Screen in case of addrow to grid functionality through popup window.
                  if (dependantSection.length === 0) {
                    dependantSection.push(requiredSection.sessionID);
                  } else {
                    if (dependantSection.indexOf(requiredSection.sessionID) === -1) {
                      dependantSection.push(requiredSection.sessionID);
                    }
                  }
                }
              }
            }
          }

          if (aSectionalPopupScreen === true) {
            for (let w = 0; w < sectionalPopupOutnames.screendata.length; w++) {
              sectionalPopupOutnames.screendata[w].layoutSize = "full";
              if (sectionalPopupOutnames.screendata[w].addRowtoGridSection) {
                if (dependantSection.length !== 0) {
                  for (let q = 0; q < dependantSection.length; q++) {
                    if (sectionalPopupOutnames.screendata[w].sessionID === dependantSection[q]) {
                      let checkSomeSection = names.screendata.filter(item => item.sessionID === sectionalPopupOutnames.screendata[w].addRowtoGridSection)[0];
                      if (checkSomeSection.formData[0][sectionalPopupOutnames.screendata[w].addRowtoGridSection] != null) {
                        if (checkSomeSection.formData[0][sectionalPopupOutnames.screendata[w].addRowtoGridSection].data.detailsectionid === this.props.outnames.data[0].name['addToGridSectionalLinkData']) {
                          sectionalPopupOutnames.screendata[w].hidden = "false";
                        } else {
                          sectionalPopupOutnames.screendata[w].hidden = "true";
                          if (sectionalPopupOutnames.screendata[w]['triggerSectionButtonEvent'] != null) {
                            delete sectionalPopupOutnames.screendata[w]['triggerSectionButtonEvent']
                          }
                        }
                      }
                      break;
                    } else {
                      sectionalPopupOutnames.screendata[w].hidden = "true";
                      if (sectionalPopupOutnames.screendata[w]['triggerSectionButtonEvent'] != null) {
                        delete sectionalPopupOutnames.screendata[w]['triggerSectionButtonEvent']
                      }
                    }
                  }
                }
              } else {
                sectionalPopupOutnames.screendata[w].hidden = "true";
                if (sectionalPopupOutnames.screendata[w]['triggerSectionButtonEvent'] != null) {
                  delete sectionalPopupOutnames.screendata[w]['triggerSectionButtonEvent']
                }
              }
            }
            //ErrorHandler.clear();
            this.replaceSectionalButtonsWithPaletteButtons(sectionalPopupOutnames, dependantSection);
            this.holdNamess['errorObjectForScreen'] = ErrorHandler.backupErrorJson();
            let jsonTxt = JSON.stringify(sectionalPopupOutnames);
            jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": \"NA\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
            sectionalPopupOutnames = JSON.parse(jsonTxt).name;

            sectionalPopupOutnames.data[0].name.parentGridXpathAndsessionID = null;
            sectionalPopupOutnames.data[0].name.parentGridXpathAndsessionID = this.holdNamess.parentGridXpathAndsessionID;
            this.isF2PopUpCalled = true;
            let isMultiLevel = false;
            if (this.props.orientationType == "popup") {
              isMultiLevel = true;
            } else {
              isMultiLevel = false;
            }
            GlobalHelper.globlevar['splitScreenObject'] = this.props;
            showF2Component(undefined, sectionalPopupOutnames, this.headername, this.formSubTitle, "myCompact", this.f2CallBackFuncOnSectionalPopupClose, this.holdNamess, "", this.props.assignErrorObj, isMultiLevel, true);
          }
        }

        if (sesHeadr) {
          this.handleAddCalled = true;
          if (GlobalHelper.globlevar.handleAddForCardLayout === true) {
            GlobalHelper.globlevar.handleAddForCardLayout = undefined;

          }
        } else {
          this.clearTriggered = true;
        }
        this.isOnload = true;
        if (this.isF2PopUpCalled) {
          this.isF2PopUpCalled = undefined;
        }
        else {
          this.setState({
            clearForm: true,
            isClearClicked: true
          });
        }
        //-- earlier handling ends
        /*COMMENTED BELOW LINE to work Error Handleing for POPSEARCH.
             Also tested popsearch clear even though below line commited.

               //GlobalHelper.globlevar.popsearchclear = true;
             */

      } else if ("CLEAR" === label || "clear" === buttonId) //&& GlobalHelper.globlevar.detectFirstChangeOnScrn
      {
        //Sprint 42 - Task - To clear bulk function screen on CLEAR button
        if (this.props.screenLayouType === "BulkFunction" || this.props.screenLayouType === "QuickFunction") {
          preData.clear();
          if (sesHeadr !== "sesHeadr") {
            ErrorHandler.clear();
          }
          //this.getPredefinedData(GlobalHelper.globlevar['basicjson'].data[0].name);
          //this.getPredefinedData(holdbasicdata.data[0].name);
          this.ClearFormData();
          if (sesHeadr) {
            this.handleAddCalled = true;
            if (GlobalHelper.globlevar.handleAddForCardLayout === true) {
              GlobalHelper.globlevar.handleAddForCardLayout = undefined;
              CardLinkFetch = true;
            }
          } else {
            this.clearTriggered = true;
          }
          this.setState({ clearForm: true, isClearClicked: true });
          GlobalHelper.globlevar.popsearchclear = true;
        }//END-Sprint 42 - Task - To clear bulk function screen on CLEAR button
        else {
          //Code to refresh screen on CLEAR button
          let functionIdForRefresh = this.funcObjForRefresh.id;
          let functionNameForRefresh = this.funcObjForRefresh.desc;
          let objForFunctionDetails = this.funcObjForRefresh;
          this.myFunction(functionIdForRefresh, functionNameForRefresh, objForFunctionDetails);
        }
      
        /*// earlier handling starts
              preData.clear();
              if (sesHeadr !== "sesHeadr") {
                ErrorHandler.clear();
              }
              //this.getPredefinedData(GlobalHelper.globlevar['basicjson'].data[0].name);
              this.getPredefinedData(holdbasicdata.data[0].name);
              this.ClearFormData();
              if (sesHeadr)
              {
                this.handleAddCalled = true;
                if(GlobalHelper.globlevar.handleAddForCardLayout === true){
                  GlobalHelper.globlevar.handleAddForCardLayout = undefined;
                  CardLinkFetch = true;
                }
              }else {
              this.clearTriggered = true;
              }
              this.setState({clearForm:true,
                      isClearClicked:true});
              */ //-- earlier handling ends
        /*COMMENTED BELOW LINE to work Error Handleing for POPSEARCH.
               Also tested popsearch clear even though below line commited.

                 //GlobalHelper.globlevar.popsearchclear = true;
               */

      }
      //Sprint 10 (TASK 69): Calling next prompt UI page data on next button clicked!!.
      else if (label === "NEXT" || label === "PREVIOUS" || "next" === buttonId || "previous" === buttonId) {
        let tempVar = ErrorHandler.getstatusES();
        if (tempVar == 's') {
          responsestatus = undefined;
        }
        GlobalHelper.globlevar.linkclicked = false;
        if (TimeLineView) {
          TimeLineView = false;
          TimeLineWidth = '0px';
        }

        ErrorHandler.clear();
        //nextPromtScreen();
        if (label == "NEXT" || "next" === buttonId) {
          GlobalHelper.globlevar['shouldResettingMapInWrapper'] = true;
          uiNextButtonHandler(label);
        } else {
          if (GlobalHelper.globlevar['lastRecordOfList'] === true) {
            GlobalHelper.globlevar['lastRecordOfList'] = undefined;
          }
          uiPreviousButtonHandler(label);
        }
        this.setButtonActionForTabPropsRefreshing(label);
      } else if ("Add" === label) {
        for (var i = 0; i < this.namess.screendata.length; i++) {
          if (this.namess.screendata[i].sessionHeader == sesHeadr) {
            var asd = (this.namess.screendata[i].sessionHeader).slice();
            asd = asd + "";
            var ss = asd.indexOf("$#@");
            if (ss == -1) {
              this.namess.screendata[i].sessionHeader = asd.concat("$#@" + sesHeadCount);
              sesHeadCount++;
            }
            var temppp = this.namess.screendata.slice(i, this.namess.screendata.length);
            this.namess.screendata[i] = JSON.parse(JSON.stringify(this.namess.screendata[i]));
            this.namess.screendata[i].sessionHeader = (this.namess.screendata[i].sessionHeader).slice(0, (this.namess.screendata[i].sessionHeader).indexOf("$#@") + 3);
            this.namess.screendata[i].sessionHeader = this.namess.screendata[i].sessionHeader + sesHeadCount;
            sesHeadCount++;
            for (var j = 0; j < temppp.length; j++) {
              this.namess.screendata[i + 1 + j] = temppp[j];
            }
            break;
          }
        }
        this.setState({
          refresh: !this.state.refresh
        });
      } else if ("fetch" === label || "Fetch" === label || "FETCH" === label || "fetch" === buttonId) {
        for (var i = 0; i < this.namess.screendata.length; i++) {
          if (this.namess.screendata[i].sessionHeader == sesHeadr) {
            var ect = ErrorHandler.getErrCount();
            if (ect == 0) {
              var allDataArr = [];
              for (var i = 0; i < this.holdNamess.screendata.length; i++) {
                var singleScreen = {};
                for (var j = 0; j < this.holdNamess.screendata[i].formData.length; j++) {
                  var kArr = Object.keys(this.holdNamess.screendata[i].formData[j]);
                  var jsObj = {};
                  kArr.map((item, z) => {     // NOSONAR: javascript:S2201
                    if (this.holdNamess.screendata[i].uiSchema[j].children[z].children.widget == "table") {
                      var karr = Object.keys(this.holdNamess.screendata[i].formData[j][item].data);
                      var karr2 = karr.map(v => v.toLowerCase());
                      var locaton = karr2.indexOf("datasource");
                      if (locaton != -1) {
                        var rowindex = 0;
                        for (var tabarr = 0; tabarr < this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]].length; tabarr++) {
                          if (this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr].mode !== undefined) {
                            for (var key in this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr]) {
                              if (this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr].hasOwnProperty(key)) {
                                jsObj[this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath + "[" + tabarr + "]." + key] = this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr][key];

                                if (this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath == undefined) {
                                  x.set("undefined_xPath[" + rowindex + "]." + key, this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr][key]);
                                } else {
                                  if (!key.startsWith("error")) {
                                    x.set(this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath + "[" + rowindex + "]." + key, this.holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr][key]);
                                  }
                                }
                              }
                            }
                            rowindex = rowindex + 1;
                          }
                        }
                      } else {
                        Log4r.error("DataSource Not Found for table....");
                      }
                    } else if (this.holdNamess.screendata[i].uiSchema[j].children[z].children.widget == "popsearch") {
                      jsObj[item] = this.holdNamess.screendata[i].formData[j][item].data.code;


                      Object.keys(this.holdNamess.screendata[i].formData[j][item].data).map((iter, k) => {    // NOSONAR: javascript:S2201
                        jsObj[iter] = this.holdNamess.screendata[i].formData[j][item].data[iter];
                        x.set(this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath, this.holdNamess.screendata[i].formData[j][item].data[iter]);

                      })
                    } else {
                      if (this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath == undefined) {
                        x.set('undefined_xPath[' + z + ']', this.holdNamess.screendata[i].formData[j][item].data);
                      } else {
                        x.set(this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath, this.holdNamess.screendata[i].formData[j][item].data);
                      }
                      jsObj[this.holdNamess.screendata[i].uiSchema[j].children[z].children.xPath] = this.holdNamess.screendata[i].formData[j][item].data;
                    }

                  })
                }
                singleScreen[this.holdNamess.screendata[i].sessionHeader] = jsObj;
                allDataArr[i] = singleScreen;
              }

              var queryString = "";
              x.forEach((value, key, map) => {

                if (key !== undefined) {
                  queryString = queryString + `${key}=${value}&`;
                }
              });
              var values = {
                "domaindata": queryString.slice(0, -1)
              };
              //store.dispatch({type: 'SECTIONFETCH',values});
              store.dispatch({
                type: 'LAYOUTTOPICON',
                values
              });
              //LAYOUTTOPICON
            } else {
              Log4r.log("Please .. Remove errors.....");
            }
            break;
          }
        }
        this.setState({
          refresh: !this.state.refresh
        });
      } else if (label === 'SAVE & CLOSE' || "saveandclose" === buttonId) {

        shouldCloseBeCalled = true;
        this.callSave();
      } else if (label === 'SaveAsDraft' || "saveasdraft" === buttonId) {
        GlobalHelper.globlevar['SaveAsDraftClicked'] = true;
        // ---------------------------
        let values = "";
        GlobalHelper.globlevar['this.namess'] = this.namess;
        if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
          values = generateQueryStrFuncationbaselayout(this.holdNamess)
        } else {
          values = generateQueryStr(this.holdNamess);
        }

        store.dispatch({
          type: 'SAVEASDRAFT',
          values
        });
        //------------------------------------

      } else if (label === 'FetchDraft' || "fetchdraft" === buttonId) {
        let values = "";
        GlobalHelper.globlevar['this.namess'] = this.namess;
        if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
          values = generateQueryStrFuncationbaselayout(this.holdNamess)
        } else {
          values = generateQueryStr(this.holdNamess);
        }
        store.dispatch({
          type: 'GETDRAFTDATA',
          values
        });
        //------------------------------------

      } else {
        this.changeRefreshERROR();
      }
    } else if (sesHeadr != undefined && sesHeadr.buttonCategory == "CUSTOMIZED") {
      // var custfun = new custutils();
      // let custfunction=sesHeadr.eventName;
      //     let json = custfun["customOnChange"](custfunction);
      this.changeRefreshERROR();
    }
  }

  customHelpFunctions() {
    var custfun = new custutils();
    let json = custfun["customOnHelp"]('COLLECTION.helpCustomFunctions');
  }

  setClassArrow(index, activeness) {
    if (activeness == "yes" && countArrow == 0) {
      return stylesfu.arrowleft;
    }
    else if (index == Arrow) {
      return stylesfu.arrowleft;
    }
    else {
      return stylesfu.arrowlefthide;
    }
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  applyOrientation() {
    if (window.innerHeight > window.innerWidth) {
      alert("You are now in portrait");
    } else {
      alert("You are now in landscape");
    }
    return 250;
  }


  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
  }


  alertmessage() {

    if (gridsavestatus) {
      gridsavestatus = undefined;
      responsestatus = undefined;
      return (<Alert message="Warning Please click on Grid save." type="warning" showIcon closable />);
    }

  }

  rowLinkClick(namess) {
    /* Spring 7 TASK 74 Asset summery screen used with new UI Grid - Card layout  */
    var detailsectionidsmap = new Map();
    var detailsectionidsmapvalue = new Map();
    var parentAndChildMapkey = new Map();

    function addDetailSectionidsMapValue(value, key) {
      detailsectionidsmapvalue.set(key, value)
    }

    if (this.props.orientationType === "popup") {
      if (GlobalHelper.globlevar['detailsectionidsmapvalue'] != null) {
        if (GlobalHelper.globlevar['detailsectionidsmapvalue'].size !== 0) {
          GlobalHelper.globlevar['detailsectionidsmapvalue'].forEach(addDetailSectionidsMapValue);
        }
      }
    }

    function addDetailSectionidsMap(value, key) {
      detailsectionidsmap.set(key, value)
    }

    if (this.props.orientationType === "popup") {
      if (GlobalHelper.globlevar['detailsectionidsmap'] != null) {
        if (GlobalHelper.globlevar['detailsectionidsmap'].size !== 0) {
          GlobalHelper.globlevar['detailsectionidsmap'].forEach(addDetailSectionidsMap);
        }
      }
    }

    function addParentAndChildMapkey(value, key) {
      parentAndChildMapkey.set(key, value)
    }

    if (this.props.orientationType === "popup") {
      if (GlobalHelper.globlevar['parentAndChildMapkey'] != null) {
        if (GlobalHelper.globlevar['parentAndChildMapkey'].size !== 0) {
          GlobalHelper.globlevar['parentAndChildMapkey'].forEach(addParentAndChildMapkey);
        }
      }
    }

    this.namess.screendata.map((item, i) => {
      for (let key in item.formData[0]) {
        if (key != null && key != "" && item.formData != null) {
          if (item.formData[0].hasOwnProperty(key)) {
            if (item.formData[0][key].data != null) {
              let detailSectionId = item.formData[0][key].data.detailsectionid;
              if (detailSectionId != null && detailSectionId != "") {
                //section level button in case of addrowtoGrid configuration
                let addRowtoGridSectionButton = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"addRowtoGrid\",\"title\": \"AddToGrid\",\"fname\": \"updateRowToGrid\"},{\"id\": \"editRowtoGrid\",\"title\": \"UpdateRow\",\"fname\": \"updateRowToGrid\"}]}";
                var addrowbuttonjson = JSON.parse(addRowtoGridSectionButton);
                if (addrowbuttonjson != null && addrowbuttonjson.buttons != null) {
                  addrowbuttonjson.buttons.map((sectionButtonObj, index) => {
                    sectionButtonObj['parentSectionId'] = item.sessionID;
                  })
                }
                var buttonAdd = item.formData[0][key].data.Columns.filter(colitem => (colitem.title == "add" || colitem.style == "add"))[0]
                if (buttonAdd == undefined) {    // removing add button from json bez Grid is not contain add button
                  //delete addrowbuttonjson.buttons[0];
                  addrowbuttonjson.buttons.splice(0, 1);
                }

                try {
                  // below code set as hidden if details section id itself match with some other section ID.
                  var detailsectionidmatch = this.namess.screendata.filter(items => items.sessionID === detailSectionId)[0];
                  if (detailsectionidmatch != null) {
                    if (item.formData[0][key].data.addThroughSummGrid === "true") {
                      if (detailsectionidmatch["sectionButton"] == undefined) {
                        detailsectionidmatch["sectionButton"] = addrowbuttonjson;
                      } else {
                        var origArr = detailsectionidmatch.sectionButton.buttons;
                        var updatingArr = addrowbuttonjson.buttons;
                        for(var m = 0, l = origArr.length; m < l; m++) {
                          for(var n = 0, ll = updatingArr.length; n < ll; n++) {
                            if(origArr[m].id == updatingArr[n].id) {
                              origArr.splice(m, 1, updatingArr[n]);
                              break;
                            }
                          }
                        }
                        detailsectionidmatch.sectionButton.buttons = origArr;
                      }
                      parentAndChildMapkey.set(detailsectionidmatch.sessionID, item.sessionID)
                    }
                    detailsectionidmatch['hidden'] = "true";
                  }
                } catch (e) {
                  Log4r.error(e)
                }

                this.hasDetailSection = true;
                var parentnodemap = new Model();
                if (parentnodemap.getLeaf(detailSectionId) != undefined && parentnodemap.getLeaf(detailSectionId) != null && parentnodemap.getLeaf(detailSectionId) != "") {
                  var leaf = parentnodemap.getLeaf(detailSectionId);
                  for (var id in leaf) {
                    for (var pkey in leaf[id]) {
                      if (item.formData[0][key].data.addThroughSummGrid === "true" && item.formData[0][key].data['addedAddrowtoGridButton'] !== true) {
                        let detailsectionidadd = this.namess.screendata.filter(items => items.sessionID === pkey)[0];
                        if (detailsectionidadd['hidden'] !== true) {
                          item.formData[0][key].data['addedAddrowtoGridButton'] = true;
                          if (detailsectionidadd["sectionButton"] == undefined) {
                            detailsectionidadd["sectionButton"] = addrowbuttonjson;
                          } else {
                            var origArr = detailsectionidadd.sectionButton.buttons;
                            var updatingArr = addrowbuttonjson.buttons;
                            for(var m = 0, l = origArr.length; m < l; m++) {
                              for(var n = 0, ll = updatingArr.length; n < ll; n++) {
                                if(origArr[m].id == updatingArr[n].id) {
                                  origArr.splice(m, 1, updatingArr[n]);
                                  break;
                                }
                              }
                            }
                            detailsectionidadd.sectionButton.buttons = origArr;
                          }
                        }
                      }

                      parentAndChildMapkey.set(Object.keys(leaf[id])[0], item.sessionID)

                      detailsectionidsmap.set(pkey, item.sessionID);
                      if (detailsectionidsmapvalue.get(item.sessionID) == undefined) {
                        detailsectionidsmapvalue.set(item.sessionID, pkey);
                      }
                      else {
                        let prevalue = detailsectionidsmapvalue.get(item.sessionID) + "," + pkey;
                        detailsectionidsmapvalue.set(item.sessionID, prevalue);
                      }
                    }
                  }
                }
                else {
                  detailsectionidsmap.set(detailSectionId, item.sessionID);
                  detailsectionidsmapvalue.set(item.sessionID, detailSectionId);
                }

              }
            }
          }

        }
      }
    })
    GlobalHelper.globlevar['detailsectionidsmap'] = detailsectionidsmap; // contains detailsectionid as key and the container section having link to open details as its value.
    GlobalHelper.globlevar['detailsectionidsmapvalue'] = detailsectionidsmapvalue; /// contains container section having link to open details as key and string of comma separated leaf node ids ( detail sections) as its value.
    GlobalHelper.globlevar['parentAndChildMapkey'] = parentAndChildMapkey;
    /*END Spring 7 TASK 74 */
    this.changeAppearance(this.namess, parentAndChildMapkey);
  }

  changeAppearance(namessObj, parentAndChildMapkey) {
    let keys = [...GlobalHelper.globlevar['detailsectionidsmap'].keys()];
    let screenData = namessObj.screendata;
    this.namess['addtoGridJsons'] = {};
    this.namess['parentGridXpathAndsessionID'] = new Map();
    //this.namess['parentGridlength'] = new Map();
    let cardLayoutInclusion = false;
    try {
      let breakpoint = false;
      for (let p = 0; p < namessObj.screendata.length; p++) {
        if (breakpoint) {
          break;
        } else {
          for (let q = 0; q < namessObj.screendata[p].uiSchema[0].children.length; q++) {
            if (namessObj.screendata[p].uiSchema[0].children[q].children.widget === "table" && namessObj.screendata[p].formData[0][namessObj.screendata[p].uiSchema[0].children[q].children.fieldPath].data.isCardDisplay === "true") {
              breakpoint = true;
              cardLayoutInclusion = true;
              break;
            }
          }
        }
      }
    } catch (e) {
      Log4r.error(e);
    }

    keys.map((item, i) => {   // NOSONAR: javascript:S2201
      let specificSection = {};
      var arr = [];
      var tempjson = {};
      for (let j = 0; j < screenData.length; j++) {
        for (let widgetIdentify = 0; widgetIdentify < screenData[j].uiSchema[0].children.length; widgetIdentify++) {

          if (screenData[j].uiSchema[0].children[widgetIdentify]['children'].widget === "table") {
            this.namess['parentGridXpathAndsessionID'].set(screenData[j].uiSchema[0].children[widgetIdentify]['children'].fieldPath, screenData[j].uiSchema[0].children[widgetIdentify]['children'].xPath);
          }
        }

        if (screenData[j].sessionID == item) {
          try {
            if (this.namess['addtoGridJsons'][parentAndChildMapkey.get(item)] !== undefined) {
              let isSectionAvailable = false;
              var jsonobj = {}
              for (let k = 0; k < this.namess['addtoGridJsons'][parentAndChildMapkey.get(item)].length; k++) {
                jsonobj = this.namess['addtoGridJsons'][parentAndChildMapkey.get(item)][k];
                if (jsonobj['sessionID'] === item) {
                  isSectionAvailable = true;
                }
              }
              if (!isSectionAvailable) {
                this.namess['addtoGridJsons'][parentAndChildMapkey.get(item)].push(screenData[j]);
              }
            }
            else {
              arr.push(screenData[j]);
              tempjson[parentAndChildMapkey.get(item)] = arr;
              let check = false
              if (Object.keys(this.namess['addtoGridJsons']).length !== 0) {
                this.namess['addtoGridJsons'][parentAndChildMapkey.get(item)] = arr;
              } else {
                this.namess['addtoGridJsons'] = tempjson;
              }
            }
          }
          catch (e) { Log4r.error(e) }

          var objectGrid = screenData.filter(items => items.sessionID === parentAndChildMapkey.get(item))[0];
          if (objectGrid != null) {
            if (objectGrid.formData[0][parentAndChildMapkey.get(item)].data.addThroughSummGrid === "true") {
              screenData[j]['addRowtoGridSection'] = parentAndChildMapkey.get(item);
            }
          }

          specificSection = screenData[j];
          break;
        }
      }

      if (specificSection.layoutSize !== "oneThird" && specificSection.layoutSize !== "GridTwoThird") {
        specificSection['hidden'] = "true";
        if (cardLayoutInclusion === true) {
          if (specificSection.layoutSize !== "half") {
            specificSection['layoutSize'] = "GridTwoThird";
          }
        }

        /* Sprint- 12 Task - 80 Hidden all data which is dependable even though data is their as per request by Kuntal and descuss
            with Nilesh for LOS Bankdeatil demo*/
        try {
          if ((specificSection.uiSchema && specificSection.uiSchema[0].children[0].children.widget !== "table")
            && (specificSection.uiSchema && specificSection.uiSchema[0].children[0].children.widget !== "hidden")) {
            for (let k = 0; k < specificSection.formData.length; k++) {
              let KeyArray = Object.keys(specificSection.formData[k]);
              for (let n = 0; n < KeyArray.length; n++) {
                specificSection.formData[k][KeyArray[n]].data = '';
              }
            }
          }
        }
        catch (e) { Log4r.error(" Error @@@@. ", e) }
      }
    })
  }

  callSave() {
    if (ErrorHandler.getErrCount() == 0) {
      let ruleUtilityObject = new RuleExecutionUtility(this.namess, this.targetToRulesMapper, this.ruleToTargetsMapper, this.fieldInExpressionToRulesMapper, this.defaultValueManagerMap, this.ruleExecutionStatusMap, this.throwValidationRulesArray, this.fieldsChangedForRuleExecution, this.isOnload);
      let onlyThrowValidationError = true;
      this.namess = ruleUtilityObject.executeRules(onlyThrowValidationError);
    }
    screenPostSaveTime = new Date().getTime();
    GlobalHelper.globlevar['SecondSpendOnScreen'] = "" + ((screenPostSaveTime - screenLoadStartTime) / 1000);
    this.moveBeyondSaveFunctionality = true;
    if (calledFromSubmit != true && buttonIdOnsave != "btnDone") {
      GlobalHelper.globlevar['checkNothingToSave'] = true;
    } else if (calledFromSubmit != true && buttonIdOnsave == "btnDone") {
      GlobalHelper.globlevar['checkNothingToSave'] = false;
    }
    else {
      GlobalHelper.globlevar['checkNothingToSave'] = false;
    }

    if (TimeLineView) {
      TimeLineView = false;
      TimeLineWidth = '0px';
    }
    if (GlobalHelper.globlevar.linkclicked === true) {
      //GlobalHelper.globlevar.linkclicked = false;
    }
    GlobalHelper.globlevar['buttonSpin'] = true; //Sprint 44 - To show spin on click of button palette - used in palette.js & data-service.js
    savetrigger = "yes";
    this.setState({
      isSaveClicked: true,
    });

  }

  callClose() {
    //SPRINT 31 : Code Added for maintaining the previous screen data when clipsearched also added in the constructor and ClipSearchComponent.
    if (GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].SearchFromClipSearch == true) {
      try {
        var predata = JSON.parse(GlobalHelper.globlevar['clipsearchcloseprejson'].previousScreenJSON);
        if (predata != null && predata.data != null) {
          this.F2FunctionNames.data[0] = predata.data[0];
        }
        var clipsearchcloseprejson = GlobalHelper.globlevar['clipsearchcloseprejson'];
        GlobalHelper.globlevar.functionID = clipsearchcloseprejson.functionID;
        GlobalHelper.holdFunGroupData = clipsearchcloseprejson['GlobalHelperholdFunGroupData'];
        GlobalHelper.listEntityId = clipsearchcloseprejson['listEntityId'];
        GlobalHelper.contextPKValues = clipsearchcloseprejson['contextPKValues'];
        GlobalHelper.contextPrimaryKey = clipsearchcloseprejson['contextPrimaryKey'];
        GlobalHelper.contextPrimaryKeyLength = clipsearchcloseprejson['contextPrimaryKeyLength'];

        var informationofPrejson = GlobalHelper.globlevar['informationofPrejson'];
        holdDataWithoutCap = informationofPrejson['holdDataWithoutCap'];
        GlobalHelper.globlevar.isHeaderConfigured = informationofPrejson['isHeaderConfigured'];
        holdDataWithCap = informationofPrejson['jsonholdDataWithCap'];
        this.state.rowheaderdatamap = informationofPrejson['holdDataWithCap'];
        this.headername = informationofPrejson['headername'];
        this.formSubTitle = informationofPrejson['formSubTitle'];
        this.formSubTitleForCloseClipsearch = this.formSubTitle;
        right = informationofPrejson['rightGroupid'];
        GlobalHelper.globlevar.removeHeaderFlag = informationofPrejson['removeHeaderFlag'];
        GlobalHelper.globlevar['menuFunctionFlag'] = informationofPrejson['menuFunctionFlag'];
        //GlobalHelper['defaultfunction'][0] =  clipsearchcloseprejson.functionID;
        a = clipsearchcloseprejson.functionID;
        GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
        GlobalHelper.globlevar['clipsearchflagforbutton'] = undefined;
        GlobalHelper.globlevar['clipsearchcloseprejson'] = undefined;
      } catch (e) { Log4r.log(e); }
    }
    //------------------------------------------------------------------------------------------------------------
    onlyCloseButtonViews = null;
    showOnlyCloseButton = null;
    GlobalHelper.globlevar['multiRecordViaClipsearch'] = false;
    GlobalHelper.globlevar['UIScreenComponentRenderFlag'] = false;
    GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
    if (GlobalHelper.globlevar.linkclicked === true) {
      GlobalHelper.globlevar.linkclicked = false;
    }
    // spring 13 - add button on cardlayout
    GlobalHelper['cardaddbutton'] = false;
    let initialscreenid = GlobalHelper.globlevar.InitialScreenFunctionID;
    let currentFunctId = GlobalHelper.globlevar.functionID;

    if (GlobalHelper.worklistData == null || GlobalHelper.worklistData == undefined || GlobalHelper.worklistData == "") {
      GlobalHelper.globlevar.promptClicked = false;
      GlobalHelper.globlevar.customScreenFlag = false;
      closepath = undefined;
      let url = "index.html?noneedge=true&pinCategory=Transaction";
      let title = "Transaction";
      redirectToAceMenus(url, title);
    }
    else if (GlobalHelper.worklistData.worklist != null && GlobalHelper.worklistData.worklist.DataSource.rows.length == 1) {
      closepath = "GridWorkList";//Sprint 24 - Issue Fixed ClipSearch - redirection to Grid worklist after closing screen.
    }
    else {
      //Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
      if (GlobalHelper.globlevar['ClipSearchViaWorklist'] === true) {
        closepath = "GridWorkList";
      } else if (GlobalHelper.globlevar['ClipSearchViaPrompMode'] === true) {
        GlobalHelper.globlevar['ClipSearchViaWorklist'] = true;
        closepath = "ClosePromptScreen_ClipSearch";
        //  this.redirectingToPrevScreenOnClosingClipScreen(closepath);
      }
      else if (GlobalHelper.globlevar['ClipSearchViaUIScreen'] === true) {
        GlobalHelper.globlevar['ClipSearchViaWorklist'] = true;
        closepath = "CloseUIScreen_ClipSearch";
        //  this.redirectingToPrevScreenOnClosingClipScreen(closepath);
      } else {
        closepath = "GridWorkList";
      }//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
    }
    if (closepath == "GridWorkList" && GlobalHelper.globlevar.worklistDataClicked != undefined) {
      //GlobalHelper.globlevar['worklistDataClickedFunction']
      GlobalHelper.globlevar["LeftMenuClickedData"] = GlobalHelper.globlevar["worklistLeftMenuClickedData"];
      try{
        this.F2FunctionNames.data[0].name = file.name;
        this.namess = file.name;
        GlobalHelper.holdFunGroupData = new Map();
        Rightsidermenu = new Array();
        GlobalHelper.globlevar.UISCreenObject.clearScreenHeaderData();
      }catch(e){console.error(e)}
      redirectToList(GlobalHelper.globlevar.worklistDataClickedFunction);
    }
    GlobalHelper.globlevar["closeButtonCall"] = true;
    this.setState({ refresh: false });//Sprint 21-end
    if (this.props.refreshQB != null)
      this.props.refreshQB(); // this is a method from MainLayout.js.

  }

  //Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.
  checkForWorkflowHistoryFunction() {
    let worklistColumnObject = null;
    let historyFunctions = null;
    if (GlobalHelper.globlevar.defaultfunction == null && GlobalHelper.worklistData != null && GlobalHelper.worklistData.worklist) {
      if (GlobalHelper.worklistData.worklist.Columns != null) {
        worklistColumnObject = GlobalHelper.worklistData.worklist.Columns.filter((item, index) => {
          if (item.title != null && item.title === "Function Id" || item.dataIndex != null && item.dataIndex === "FNCTND") {
            return item;
          }
        })
      }
    }
    if (worklistColumnObject != null && worklistColumnObject[0] != null) {
      if (GlobalHelper.selectedRowData != null && GlobalHelper.selectedRowData[worklistColumnObject[0].dataIndex] != null) {
        historyFunctions = GlobalHelper.selectedRowData[worklistColumnObject[0].dataIndex].split(",");
      }
    }
    if (historyFunctions != null) {
      if (historyFunctions.includes(GlobalHelper.globlevar.functionID)) {
        return true;
      }
    }
    return false;
  }//END - Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.

  //Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.
  showHideButtonPallete(flag) {
    if (flag === "hide") {
      this.namess.ButtonPalette.map((item, index) => {
        if (item.uiSchema != null) {
          if (item.uiSchema[0] != null && item.uiSchema[0].children != null) {
            item.uiSchema[0].children.map((buttonObj, indx) => {
              buttonObj.children.widget = "hidden";
            })
          }
        }
      })
    }
    if (flag === "show") {
      historyFunctionFlag = false;
      this.namess.ButtonPalette.map((item, index) => {
        if (item.uiSchema != null) {
          if (item.uiSchema[0] != null && item.uiSchema[0].children != null) {
            item.uiSchema[0].children.map((buttonObj, indx) => {
              buttonObj.children.widget = "button";
            })
          }
        }
      })
    }
  }//END - Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.

  makeSectionsCompletelyReadonly() {
    this.namess.screendata.map((item, index) => {
      item['editable'] = false;
      if (item.uiSchema[0] != null && item.uiSchema[0].children != null) {
        if (item.uiSchema[0].children[0].children.edit != null) {
          item.uiSchema[0].children[0].children.edit = "false";
          if (item.uiSchema[0].children[0].children.widget === "table") {
            item.formData[0][item.uiSchema[0].children[0].children.fieldPath].data.Columns.map((colItem, colIndex) => {
              colItem['completeEditable'] = false;
              if (colItem['id'] === "add" || colItem['id'] === "edit" || colItem['id'] === "delete"
                || colItem['title'] === "add" || colItem['title'] === "edit" || colItem['title'] === "delete"
                || colItem['style'] === "add" || colItem['style'] === "edit" || colItem['style'] === "delete"
                || colItem['fieldPath'] === "add" || colItem['fieldPath'] === "edit" || colItem['fieldPath'] === "delete") {
                colItem['removeColumnForHistoryScreen'] = "true";
                colItem['widget'] = "hidden";
              } else {
                if (colItem['edit'] === "true") {
                  colItem['edit'] = "false";
                }
              }
            })
          }
        }
      }
      if (item.sectionButton != null) {
        item.sectionButton['disabled'] = true;
        item.sectionButton['widgetEditFlag'] == "false";
        item.sectionButton.buttons.map((buttonobj, btnindex) => {
          buttonobj['readOnlyButton'] = true;
        })
        // GlobalHelper.globlevar['HistoryTimelineViewSectionButton'] = true;
      }
    })
  }

  functionForSplitScreenForm(functId,screenJson){
    splitComponentModel(this.RenderingSplitform)
  }


  functionForSplitScreenBackWordForm (functId,screenJson) {
    this.SplitScreenMainLayout = false;
    GlobalHelper.globlevar["SplitScreenMainLayout"] = false;
    GlobalHelper.globlevar["SplitScreenParams"]  = undefined;
    if(GlobalHelper.globlevar['tabScreen'].length > 0){
      GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar.addTabIndex].SplitScreenMainLayout = false;
      GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar.addTabIndex].SplitScreenParams = undefined;
    }
    this.setState({
      isBoxVisible: false,
      splitView : true
    })
    GlobalHelper.globlevar.imagePreviewUrl = undefined;
    GlobalHelper.globlevar.splitProps = undefined;
    GlobalHelper.globlevar.zoomKey = 200;
    GlobalHelper.globlevar.slideIndex = 1;
    this.forceUpdate();
  }

  RenderingSplitform(params) {
    this.state.params = params;
    if(params.submitValue == "submit"){
      GlobalHelper.globlevar["SplitScreenParams"] = params ;
      GlobalHelper.globlevar["SplitScreenMainLayout"] = true;
      if(GlobalHelper.globlevar['tabScreen'].length > 0){
        GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar.addTabIndex].SplitScreenMainLayout = true;
        GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar.addTabIndex].SplitScreenParams = params;
      }

      this.setState({
        isBoxVisible: true
      })
      this.SplitScreenMainLayout= true;
	 }else{
      this.SplitScreenMainLayout= false;
      this.setState({
        isBoxVisible: false
      })
    }

    this.forceUpdate();
  }

  functionForTest(functId, screenJson) {
    let defaultLayoutId = getDefaultLayoutId();
    //Sprint 39 - Task 61 - to validate Layout brms file - setting DefaulLayoutId and Pks parameter which will pass with URL from react
    let _b_pk1;
    let contextPKStr = GlobalHelper.contextPKValues.replace(/&/g, '\",\"');
    contextPKStr = contextPKStr.replace(/=/g, '\":\"');
    contextPKStr = "{\"" + contextPKStr + "\"}" + '';
    let contextPKJson = JSON.parse(contextPKStr);
    if (contextPKJson != null) {
      _b_pk1 = contextPKJson['_b_pk1'];
    }//END - Sprint 39 - Task 61 - to validate Layout brms file - setting DefaulLayoutId and Pks parameter which will pass with URL from react

    var cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=validateLayoutConfig&_en=onLoad&layoutId=" + defaultLayoutId + "&szPKs=" + _b_pk1, '');
    var obj;
    //Sprint 39 - Task 61 & 63 - to validate Layout brms file - setting DefaulLayoutId and Pks parameter which will pass with URL from react
    if (cst.includes("<?xml version") || cst.includes("xml version") || cst.includes("<html>")) {
      var parser, xmlDoc;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(cst, "text/xml");
      obj = xmlDoc;
      if (obj != null) {
        displayMessageBox("No Record Available/No Data from Server", new XMLSerializer().serializeToString(obj), "E");
      }
    } else {
      obj = eval("cst = " + cst);
    }

    if (obj != null) {
      let columns = new Array();
      let dataSource;
      if (obj.fetch_errors != null && obj.fetch_errors['rows'] != null) {

        if (obj.fetch_errors.rows.length > 0) {
          let keyArrCol = Object.keys(obj.fetch_errors.rows[0]);
          keyArrCol.map((item, index) => {    // NOSONAR: javascript:S2201
            columns.push(
              {
                "title": item,
                "dataIndex": item,
                "key": index + 1,
              }
            )
          })
        }

        dataSource = obj.fetch_errors['rows'];
        let contentData = null;
        if (dataSource != null && columns != null) {
          contentData = <Table pagination={false} id="customTableInModal" bordered dataSource={dataSource} columns={columns} />;
        }

        if (contentData != null) {
          displayCustomComponent(contentData)
        }

      }
    }//END - Sprint 39 - Task 61 & 63 - to validate Layout brms file - setting DefaulLayoutId and Pks parameter which will pass with URL from react
  }

  setButtonActionForTabPropsRefreshing(label) {
    for (let index = 0; index < GlobalHelper.globlevar['tabScreen'].length; index++) {
      if (this.addTabindex != index) {
        GlobalHelper.globlevar['tabScreen'].splice(index);
      }
    }

  }

  showErrorMessage() {
    try {
      ErrorHandler.clear();
      ErrorHandler.setTotalErrJson([]);
      ErrorHandler.setTotalWarningsJson([]);
      ErrorHandler.setTotalInfoMessageJson([]);
      ErrorHandler.setTotalSuccessMessageJson([]);
      let ttlErrJsnOrig, totalWarnJsn, totalInfoJsn, totalSuccJsn;
      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg) {
        ttlErrJsnOrig = GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg;
      }
      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalWarnJsn) {
        totalWarnJsn = GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalWarnJsn;
      }
      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalInfoJsn) {
        totalInfoJsn = GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalInfoJsn;
      }
      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalSuccJsn) {
        totalSuccJsn = GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalSuccJsn;
      }

      ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
      ErrorHandler.setTotalWarningsJson(totalWarnJsn);
      ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
      ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
      ErrorHandler.setHoldCount(0);
    } catch (e) {
      Log4r.log(e);
    }
    GlobalHelper.globlevar['ServerSideError'] = true;
    this.state.errorstatus = true;
  }

  renderCustomHeaderFunctions(){
    let customHeaderFunctionArray = [];
    if(this.customHeaderFunctionsToRender != null){
      if(this.customHeaderFunctionsToRender.size !== 0){
        this.customHeaderFunctionsToRender.forEach((value, key) => {
          customHeaderFunctionArray.push(value);
        });
      }
    }
    if(customHeaderFunctionArray.length !== 0){
      this.customHeaderFunctionsExists = true;
      return (
        customHeaderFunctionArray.map((item,index)=>{
          let functionHotKeyConfigured;
          if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(item.id) != null){
            functionHotKeyConfigured = GlobalHelper.HotKeyMap.get(item.id)['SZHOTKEYS'];
          } else {
            if(index < 9)
            functionHotKeyConfigured = 'shift+'+(index+1);
          }
          return(
              <div id={functionHotKeyConfigured} className={styles.funLevelIcon} onClick={() => {
                this.props.customHeaderFunctionCall(item.id, item.desc, item, index)
              }}>
                <Popover className={styles.pop} placement="bottomRight" content={<span>{item.desc} <span style={{marginLeft:'30px'}}>{functionHotKeyConfigured}</span></span>}>
                  <FA name={GlobalHelper.getFontIcon(item.icon)} className={this.selectedCustomFunIcon(index)} stack="0.5x" style={{ padding: '6px', fontSize: '16px' }} aria-label={item.desc}/>
                </Popover>
              </div>
          );
        })
      )
    } else {
      return null;
    }

  }


  render() {    // Will work with function modeling....
    this.addTabScreen = GlobalHelper.globlevar['tabScreen'].filter((a) => a.f2FunctionId == GlobalHelper.globlevar.functionID);
    if (this.addTabScreen.length > 0) {
      this.addTabindex = GlobalHelper.globlevar['tabScreen'].indexOf(this.addTabScreen[0]);
      GlobalHelper.globlevar['addTabIndex'] = this.addTabindex;

      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg != null && GlobalHelper.globlevar['changeTitle'] != undefined) {
        this.showErrorMessage();
      }
      if (GlobalHelper.globlevar['tabScreen'][this.addTabindex].setErrorMessage && GlobalHelper.globlevar['changeTitle'] != undefined) {
        ErrorHandler.setErrMessage(GlobalHelper.globlevar['tabScreen'][this.addTabindex].setErrorMessage);
      }
    }

    //Sprint 38 - Task - Issue L60-585 - IC6/Prompt Mode/screen name displayed is wrong , if open from prompt mode
    //END - Sprint 38 - Task - Issue L60-585 - IC6/Prompt Mode/screen name displayed is wrong , if open from prompt mode

    if (Rightsidermenu.length > 0) {
      Rightsidermenu.splice(0, Rightsidermenu.length);
    }
    if (GlobalHelper.holdFunGroupData !== undefined && GlobalHelper.holdFunGroupData !== null && GlobalHelper.holdFunGroupData !== "") {
      GlobalHelper.holdFunGroupData.forEach((value, key, map) => {
        Rightsidermenu[Rightsidermenu.length] = value;
      })
    }
    Rightsidermenu.map((funcgroup, index) => {    // NOSONAR: javascript:S2201
      funcgroup.content.map((func, j) => {        // NOSONAR: javascript:S2201
        if (func.id == GlobalHelper.globlevar.functionID) {
          this.funcObjForRefresh = func;
        }
      })
    })
    // after worlist data 20 row from 21th row one extra call given internally
    if (GlobalHelper.globlevar['paginationcalled'] == true) {
      GlobalHelper.globlevar['paginationcalled'] = false;
      //uiNextButtonHandler();
      // nextPromtScreen();
    }
    GlobalHelper.globlevar['QBsearch'] = "false";// Sprint 16 - Task - QueryBuilder development,Integration and Testing - to add search button if QueryBuilder used in screen.
    //****************************** NOTE **********************************//
    // Please do not delete below commented code , it is working for timeline layout.
    if (GlobalHelper.globlevar['timelinedisplay'] == true) {
      let timeLineObject = {};
      timeLineObject.groupid = "TIMEL"
      timeLineObject.groupcd = "TIMEL"
      timeLineObject.groupdesc = "Timeline View";
      timeLineObject.icon_exp = "fa fa-clock-o iconCenter {#6d9eeb}"
      timeLineObject.icon_col = ""
      timeLineObject.iorder = "37"
      timeLineObject.content = ["timeline"];
      timeLineObject.isactive = "Y"
      Rightsidermenu.splice(Rightsidermenu.length, 0, timeLineObject);

      if (this.onloadtimelinedisplay === true) {
        this.onloadtimelinedisplay = false;
      }
    } else {
      if (TimeLineView) {
        TimeLineView = false;
        TimeLineWidth = '0px';
      }
    }
    //****************************TILL HERE**********************************//

    const info = File1.dataprofile;
    const info3 = File1.Layoutdata;
    var pathname = this.F2FunctionNames.ScreenLayoutName;
    //this.namess = this.F2FunctionNames;
    if (this.state.themeName == "myDefault") {
      styles = require('./css/MainLayout/MainLayoutDefault.css');
      stylesfu = require('./css/FollowUpDefault.css');
      stylesf = require('./css/Foll1Default.css');
    }
    else if (this.state.themeName == "myCompact") {
      styles = require('./css/MainLayout/MainLayoutCompact.css');
      stylesfu = require('./css/FollowUpCompact.css');
      stylesf = require('./css/Foll1Default.css');
    }
    else if (this.state.themeName == "myDark") {
      styles = require('./css/MainLayout/MainLayoutDark.css');
      stylesfu = require('./css/FollowUpDark.css');
      stylesf = require('./css/Foll1Dark.css');
    }
    else if (this.state.themeName == "myRed") {
      styles = require('./css/MainLayout/MainLayoutRedThm.css');
      stylesfu = require('./css/FollowUpRedThm.css');
      stylesf = require('./css/Foll1RedThm.css');
    }
    else {

    }

    //Sprint 37 - Task - MultiBrowser Compatibity and Testing - changes for IE
    var browserMap = checkBrowserType();
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) || (browserMap.has("isIE") && browserMap.get("isIE") === true) || isIE === true) {

    } else {

    }//END - Sprint 37 - Task - MultiBrowser Compatibity and Testing - changes for IE

    if (this.state.hasError) {
      this.namess = file.name;
    }
    else {
      try {
        if (this.containerDiv.length >= 0 || this.hybridCount >= 0) {
          this.createHybridView = false;
          this.containerDiv = [];
          this.hybridCount = 0;
        }
        try {
          xpathFactory(this.F2FunctionNames.data[0].name)
          let custXpathFactory = eval(window.xpathFactory);
          if (typeof custXpathFactory != typeof undefined) {
            custXpathFactory(this.namess);
          }
        }
        catch (e) { Log4r.log(e) }

        if (this.F2FunctionNames.data[0].name.entities != null && this.F2FunctionNames.data[0].name.entities.length != 0 && this.F2FunctionNames.data[0].name.defaultListEntityId) {
          this.F2FunctionNames.data[0].name.entities.map((item, inedx) => {
            if (item.worklist.id === this.F2FunctionNames.data[0].name.defaultListEntityId) {
              this.namess = item;
              closepath = "GridWorkList";
            }
          })
        }

        if (GlobalHelper.globlevar['summaryConfigType'] == "summaryConfigType_F" && this.props.orientationType !== "popup") {
          GlobalHelper.globlevar['summaryConfigType'] = undefined;
          GlobalHelper.globlevar['newfunctionInitiated'] = true;
          GlobalHelper.globlevar['summaryConfigType_save'] = true;
          this.namess['functionIDOfSummaryConfigType'] = this.F2FunctionNames.data[0].name['functionIDOfSummaryConfigType'];

          if (Object.keys(this.F2FunctionNames.data[0].name.rules).length !== 0) {
            GlobalHelper.globlevar['newFunctionNames'] = this.F2FunctionNames.data[0].name;
          } else {
            GlobalHelper.globlevar['newFunctionNames'] = undefined;
          }

          let cardLayoutInclusion = false;
          try {
            let breakpoint = false;
            for (let p = 0; p < this.firstRenderScreen.screendata.length; p++) {
              if (breakpoint) {
                break;
              } else {
                for (let q = 0; q < this.firstRenderScreen.screendata[p].uiSchema[0].children.length; q++) {
                  if (this.firstRenderScreen.screendata[p].uiSchema[0].children[q].children.widget === "table" && this.firstRenderScreen.screendata[p].formData[0][this.firstRenderScreen.screendata[p].uiSchema[0].children[q].children.fieldPath].data.isCardDisplay === "true") {
                    breakpoint = true;
                    cardLayoutInclusion = true;
                    GlobalHelper.globlevar['cardLayoutInclusion'] = true;
                    break;
                  }
                }
              }
            }
          } catch (e) {
            Log4r.error(e);
          }
          this.namess.screendata.map((item, i) => {
            try {
              if (item['summaryConfigTypesection'] == "true") {
                item['summaryConfigTypesection'] = "false";
                //this.namess.screendata.pop(item);
                this.namess.screendata.splice(i);
                // delete this.namess.screendata[i];
              }
            } catch (e) {
              Log4r.error(e)
            }
          });
          // adding new function sections.
          this.F2FunctionNames.data[0].name.screendata.map((item, i) => {
            try {
              if (cardLayoutInclusion) {
                item['layoutSize'] = "GridTwoThird";
                item['addedFunctionLayout'] = true;
              }
              item['summaryConfigTypesection'] = "true";
              /* if(this.namess.screendata[i].sessionID == item.sessionID)
              {
               this.namess.screendata.splice(i, 1);
              }*/

              this.namess.screendata.push(item);
            } catch (e) {
              Log4r.error(e)
            }
          })
          // Changes for different button for multi level layouts - not tested
          if (this.namess['preButtonPalette'] == undefined) {
            this.namess['preButtonPalette'] = [];
            this.namess['preButtonPalette'][0] = this.namess.ButtonPalette;
          } else {
            this.namess.preButtonPalette.push({
              "functionId": GlobalHelper.globlevar.functionID,
              "buttonPallete ": this.namess.preButtonPalette
            });
          }

          if (GlobalHelper.globlevar.CardCloseClicked) {
            this.namess.ButtonPalette = this.namess.preButtonPalette[this.namess.preButtonPalette.length - 1];
            this.namess.preButtonPalette.pop();
          } else {
            this.namess.ButtonPalette = this.F2FunctionNames.data[0].name.ButtonPalette;
          }
          //Changes for different button for multi level layouts - not tested end
          //ErrorHandler.setstatusES("");
          //ErrorHandler.setErrMessage("");
          ErrorHandler.clear();
          ErrorHandler.getsequenceJson(this.namess.screendata);

        } else if (this.F2FunctionNames.data[0].name != null) // starts here
        {
          /*THIS IF IS FOR POSTSAVE RESPONSE[SUCH AS ERROR MESSAGES OR SUCCESSFUL MESSAGES]....*/
          if (this.F2FunctionNames.data[1] != null && this.F2FunctionNames.data[1].name != null) {
            if (this.F2FunctionNames.data[1].name.SuccessFlag !== undefined && this.F2FunctionNames.data[1].name.__f2_messages__ && this.F2FunctionNames.data[1].name.__f2_messages__.length > 0 && stopcount == 0) {

              if (this.F2FunctionNames.data[1].name.SuccessFlag !== undefined) {

                ErrorHandler.setTotalErrJson([]);
                ErrorHandler.setTotalWarningsJson([]);
                ErrorHandler.setTotalInfoMessageJson([]);
                ErrorHandler.setTotalSuccessMessageJson([]);
                let ttlErrJsn;
                let ttlErrJsnOrig;
                let totalWarnJsn;
                let totalInfoJsn;
                let totalSuccJsn;
                stopcount++;
                var errjsn = this.F2FunctionNames.data[1].name.__f2_messages__;
                var sesID;

                try {
                  let cflag = false;
                  var ttlErrJsnOrig = ErrorHandler.getTotalErrJson();
                  let totalWarnJsn = ErrorHandler.getTotalWarningsJson();
                  let totalInfoJsn = ErrorHandler.getTotalInfoMessageJson();
                  let totalSuccJsn = ErrorHandler.getTotalSuccessMessageJson();
                  for (var i = 0; i < errjsn.length; i++) {
                    let xpth; // = errjsn[i].ctl;
                    cflag = true;
                    if (errjsn[i][2] != "" && errjsn[i][2] != undefined && errjsn[i][2] != null) {
                      xpth = errjsn[i][2];
                    } else {
                      xpth = undefined;
                    }
                    if (errjsn[i][0] == "I") {
                      ttlErrJsn = totalInfoJsn;
                    } else if (errjsn[i][0] == "E") {
                      ErrorHandler.setHoldColorUIScreen('#f5222d');
                      ttlErrJsn = ttlErrJsnOrig;
                    } else if (errjsn[i][0] == "W") {
                      ttlErrJsn = totalWarnJsn;
                    } else if (errjsn[i][0] == "S") {
                      ErrorHandler.setHoldColorUIScreen('#1dd435');
                      ttlErrJsn = totalSuccJsn;
                    } else if (errjsn[i][0] == "D") {
                      /*let secondsToGo = 15;
           const modalBox = Modal.success({
             title: 'Dialog Box',
             content: errjsn[i][1],
           });
           setTimeout(() => {
           modalBox.destroy();
         }, secondsToGo * 1000);*/
                    }

                    if (errjsn[i][0] !== "S") {
                      GlobalHelper.globlevar.savespin = false;
                    }

                    if (this.refreshOnSave !== true) {
                      GlobalHelper.globlevar.savespin = false;
                    }

                    if (xpth != "" && xpth != null && xpth != undefined) {
                      var aX, fpath;
                      for (var k = 0; k < this.namess.screendata.length; k++) {
                        aX = this.namess.screendata[k].uiSchema[0].children.filter(itm2 => itm2.children.xPath === xpth);
                        if (aX.length > 0) {
                          fpath = aX[0].children.fieldPath;
                          sesID = this.namess.screendata[k].sessionID;
                          break;
                        } else {
                          fpath = undefined;
                          sesID = undefined;
                        }
                      }

                      for (var j = 0; j < ttlErrJsn.length; j++) {
                        if (typeof ttlErrJsn[j][sesID] == typeof {}) {
                          let qwe = [];
                          qwe[0] = errjsn[i][1];
                          ttlErrJsn[j][sesID][fpath] = qwe;
                        }
                      }
                    } else {
                      //var ttlErrJsn = ErrorHandler.getTotalErrJson();
                      if (ttlErrJsn) {
                        if (Array.isArray(ttlErrJsn)) {
                          var res22 = ttlErrJsn.filter(itm => itm["generic"])[0];
                          if (res22) {
                            if (Array.isArray(res22["generic"])) {
                              var checkDuplicate = res22["generic"].filter(itm2 => itm2[0] === errjsn[i][1]);
                              if (checkDuplicate.length != 0) { } else {
                                let qwe = [];
                                qwe[0] = errjsn[i][1];
                                res22["generic"][res22["generic"].length] = qwe;
                              }
                            }
                          } else {
                            let qwe = [];
                            qwe[0] = errjsn[i][1];
                            var errMsg = [];
                            errMsg[errMsg.length] = qwe;
                            var obj = {};
                            obj["generic"] = errMsg;
                            ttlErrJsn[ttlErrJsn.length] = obj;
                          }
                        }
                      }

                    }
                  }
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg = ttlErrJsnOrig;
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalWarnJsn = totalWarnJsn;
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalInfoJsn = totalInfoJsn;
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalSuccJsn = totalSuccJsn;
                  ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
                  ErrorHandler.setTotalWarningsJson(totalWarnJsn);
                  ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
                  ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
                  if (cflag) {
                    ErrorHandler.setHoldCount(0);
                  }
                } catch (e) {
                  Log4r.log(e);
                }
              }
              GlobalHelper.globlevar['ServerSideError'] = true;
              this.state.errorstatus = true;

              if (this.F2FunctionNames.data[1].name.SuccessFlag === true) {
                this.F2FunctionNames.data[1].name.SuccessFlag = false;
                GlobalHelper.globlevar['ServerSideError'] = false;
                GlobalHelper.globlevar['responsestatus'] = "s";
                responsestatus = "S";
                // used for save&close call if save will success so will go for close
                // used for save&close call if save will success so will go for close     if(shouldCloseBeCalled){
                if (shouldCloseBeCalled) {
                  // ErrorHandler.setErrMessage("Saved Successfully." , shouldCloseBeCalled);
                  /*
                   time reduced for settimeout function AND "savespin = false" set for spin.
                  */
                  GlobalHelper.globlevar.savespin = false;
                 

                  if (GlobalHelper.globlevar['crdView']) {
                    GlobalHelper.globlevar['crdView'] = undefined;
                    //this.callClose();
                    var timeout = setTimeout(() => {
                      shouldCloseBeCalled = false;
                      GlobalHelper.globlevar.buttonSpin = false;
                      this.callClose();
                    }, 50);
                  } else {
                    var timeout = setTimeout(() => {
                      shouldCloseBeCalled = false;
                      GlobalHelper.globlevar.buttonSpin = false;
                      this.callClose();
                    }, 100);
                  }

                }
                // working for refresh after save success....
                if (GlobalHelper.globlevar.linkclicked == true) {
                  var savedAndFetchData = this.F2FunctionNames.data[0].name;
                } else if (GlobalHelper.globlevar['savedandfetch']) {
                  GlobalHelper.globlevar['savedandfetch'] = false;
                  this.namess = this.F2FunctionNames.data[0].name;
                } else if (GlobalHelper.globlevar.linkclicked == false) {
                  if (GlobalHelper.globlevar['modalClosedClicked'] !== true) {
                    this.namess = this.F2FunctionNames.data[0].name;
                  } else {
                    GlobalHelper.globlevar['modalClosedClicked'] = undefined;
                  }

                }

                // if submit button clicked after success screen navigation to worklist page without nothing to save message.
                if (calledFromSubmit === true) {
                  var timeoutcalledFromSubmit = setTimeout(() => {
                    GlobalHelper.globlevar['buttonSpin'] = false;
                    this.callClose();
                  }, 500);
                } else {

                  let values = GlobalHelper.globlevar.functionID;
                  if(GlobalHelper.globlevar.tabScreen[0].title === "Audit Activity Details"){
                    GlobalHelper.globlevar['linkclicked'] = false;
                   }
                  if (GlobalHelper.globlevar.linkclicked) {
                    // post success save in dependable Grid / screen. i.e. parent & Leaf node
                    if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
                      if (this.refreshOnSave) {
                        this.refreshOnSave = undefined;
                        if (calledFromSubmit !== true && shouldCloseBeCalled !== true) { // this added because on click on submit / done refresh should not call;
                          store.dispatch({
                            type: 'LAYOUTTOPICON',
                            values
                          });
                        }
                      } else {
                        GlobalHelper.globlevar.savespin = false;
                      }
                    } else {
                      if (this.refreshOnSave) {
                        if (calledFromSubmit !== true && shouldCloseBeCalled !== true) {
                          let testCardLayoutInclusion = false;
                          try {
                            for (let p = 0; p < this.namess.screendata.length; p++) {
                              if (testCardLayoutInclusion) {
                                break;
                              } else {
                                for (let q = 0; q < this.namess.screendata[p].uiSchema[0].children.length; q++) {
                                  if (this.namess.screendata[p].uiSchema[0].children[q].children.widget === "table" && (this.namess.screendata[p].formData[0][this.namess.screendata[p].uiSchema[0].children[q].children.fieldPath].data.carddisplay === "true" || GlobalHelper.globlevar.linkclicked)) {
                                    testCardLayoutInclusion = true;
                                    break;
                                  }
                                }
                              }
                            }
                          } catch (e) {
                            Log4r.error(e);
                          }


                          // this added because on click on submit / done refresh should not call;
                          if (testCardLayoutInclusion == false) {
                            GlobalHelper.globlevar.linkclicked = false;
                            store.dispatch({
                              type: 'LAYOUTTOPICON',
                              values
                            });
                            // In case of link click which does not contain card layout so sending call to LAYOUTTOPICON
                          } else {
                            // due to only all data call should get invoke in case of link click.
                            store.dispatch({
                              type: 'GETREFRESHDATA',
                              extraData: undefined,
                              values,
                              orientationType: this.props.orientationType
                            });
                          }
                        }
                      }
                    }

                  } else {
                    if (this.refreshOnSave) {
                      this.refreshOnSave = undefined;
                      if (calledFromSubmit !== true && shouldCloseBeCalled !== true) { // this added because on click on submit / done refresh should not call;
                        store.dispatch({
                          type: 'LAYOUTTOPICON',
                          values
                        });
                      }
                    } else {
                      GlobalHelper.globlevar.savespin = false;
                    }
                  }
                  if (this.F2FunctionNames.data[1].name.SuccessFlag !== undefined) {
                    this.F2FunctionNames.data[1].name.SuccessFlag = undefined;
                  }
                }
              } else {
                responsestatus = undefined;
                GlobalHelper.globlevar['ServerSideError'] = true;
                this.state.errorstatus = true;
              }

            }
          } else if ((this.F2FunctionNames.data[0].name.success != undefined || responsestatus == "S" || GlobalHelper.globlevar['savedandfetch'] == true)) {
            GlobalHelper.globlevar['ServerSideError'] = false;
            GlobalHelper.globlevar['responsestatus'] = "s";
            if (responsestatus == "S") {
              // ErrorHandler.setstatusES("s");
              // ErrorHandler.setErrMessage("Saved Successfully.");
              // ErrorHandler.setType('S');
            }

            // used for save&close call if save will success so will go for close
            if (shouldCloseBeCalled) {
              GlobalHelper.globlevar['deleteButtonForDMSUpload'] = false;
              GlobalHelper.globlevar['tabScreen'][this.addTabindex].setErrorMessage = "Saved Successfully.";
              ErrorHandler.setErrMessage("Saved Successfully.", shouldCloseBeCalled);
              shouldCloseBeCalled = false;
              var timeout = setTimeout(() => {
                this.callClose();
              }, 500);
            }

            // working for refresh after save success....
            if (GlobalHelper.globlevar.linkclicked == true) {
              /* preData.clear();
               this.getPredefinedData(holdbasicdata.data[0].name);
               this.ClearFormData();*/
              var savedAndFetchData = this.F2FunctionNames.data[0].name;

            } else if (GlobalHelper.globlevar['savedandfetch']) {
              GlobalHelper.globlevar['savedandfetch'] = false;

              this.namess = this.F2FunctionNames.data[0].name;

            } else if (GlobalHelper.globlevar.linkclicked == false) {
              if (GlobalHelper.globlevar['modalClosedClicked'] !== true) {
                this.namess = this.F2FunctionNames.data[0].name;
              } else {
                GlobalHelper.globlevar['modalClosedClicked'] = undefined;
              }

            }
          }
          /*else if(gridsavestatus)
          {
               //return( <Alert type="error" message="Error...." closable/> );
            gridsavestatus = undefined;
            ErrorHandler.setstatusES("w");
            ErrorHandler.setErrMessage("Warning please click on GRID ROW save button.");
            //return(<Alert message="Warning Please click on Grid save." type="warning" showIcon closable/>);
          }*/
          else if (this.F2FunctionNames.data[0].name.screendata.length == 0 && GlobalHelper.globlevar.worklistinfo != null && GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows.length == 0 && GlobalHelper.globlevar["flagToControlPopupForEmptyworklist"] == true) {
            let closefuc = this.callClose;
            //Sprint 37 - Task - Prompt Mode - Changes made to show message modal box if no record from server.
            GlobalHelper.globlevar["flagToControlPopupForEmptyworklist"] = false;
            displayMessageBox("No Record", "No Record Available/No Data from Server", "E", this.callClose);

            /*Modal.success({
              title: 'No Record',
              content: "No Record Available/No Data from Server",
              onOk:this.callClose
            });
            //this.callClose()
            */
            //END-Sprint 37 - Task - Prompt Mode - Changes made to show message modal box if no record from server.
          } else if (this.F2FunctionNames.data[0].name.screendata.length != 0 && this.F2FunctionNames.data[0].name.screendata[0].schema !== undefined) {
            if (this.F2FunctionNames.ErrorMesgJsonOnload != undefined) {
              if (this.F2FunctionNames.ErrorMesgJsonOnload.SuccessFlag !== undefined) {

                // ErrorHandler.setTotalErrJson([]);
                // ErrorHandler.setTotalWarningsJson([]);
                // ErrorHandler.setTotalInfoMessageJson([]);
                // ErrorHandler.setTotalSuccessMessageJson([]);
                let ttlErrJsn;
                let ttlErrJsnOrig;
                let totalWarnJsn;
                let totalInfoJsn;
                let totalSuccJsn;
                stopcount++;
                var errjsn = this.F2FunctionNames.ErrorMesgJsonOnload.__f2_messages__;
                var sesID;

                try {
                  let cflag = false;
                  var ttlErrJsnOrig = ErrorHandler.getTotalErrJson();
                  let totalWarnJsn = ErrorHandler.getTotalWarningsJson();
                  let totalInfoJsn = ErrorHandler.getTotalInfoMessageJson();
                  let totalSuccJsn = ErrorHandler.getTotalSuccessMessageJson();
                  for (var i = 0; i < errjsn.length; i++) {
                    let xpth; // = errjsn[i].ctl;
                    cflag = true;
                    if (errjsn[i][2] != "" && errjsn[i][2] != undefined && errjsn[i][2] != null) {
                      xpth = errjsn[i][2];
                    } else {
                      xpth = undefined;
                    }
                    if (errjsn[i][0] == "I") {
                      ttlErrJsn = totalInfoJsn;
                    } else if (errjsn[i][0] == "E") {
                      ErrorHandler.setHoldColorUIScreen('#f5222d');
                      ttlErrJsn = ttlErrJsnOrig;
                    } else if (errjsn[i][0] == "W") {
                      ttlErrJsn = totalWarnJsn;
                    } else if (errjsn[i][0] == "S") {
                      ErrorHandler.setHoldColorUIScreen('#1dd435');
                      ttlErrJsn = totalSuccJsn;
                    } else if (errjsn[i][0] == "D") {
                      /*let secondsToGo = 15;
         const modalBox = Modal.success({
           title: 'Dialog Box',
           content: errjsn[i][1],
         });
         setTimeout(() => {
         modalBox.destroy();
       }, secondsToGo * 1000);*/
                    }

                    if (errjsn[i][0] !== "S") {
                      GlobalHelper.globlevar.savespin = false;
                    }

                    if (this.refreshOnSave !== true) {
                      GlobalHelper.globlevar.savespin = false;
                    }

                    if (xpth != "" && xpth != null && xpth != undefined) {
                      var aX, fpath;
                      for (var k = 0; k < this.namess.screendata.length; k++) {
                        aX = this.namess.screendata[k].uiSchema[0].children.filter(itm2 => itm2.children.xPath === xpth);
                        if (aX.length > 0) {
                          fpath = aX[0].children.fieldPath;
                          sesID = this.namess.screendata[k].sessionID;
                          break;
                        } else {
                          fpath = undefined;
                          sesID = undefined;
                        }
                      }

                      for (var j = 0; j < ttlErrJsn.length; j++) {
                        if (typeof ttlErrJsn[j][sesID] == typeof {}) {
                          let qwe = [];
                          qwe[0] = errjsn[i][1];
                          ttlErrJsn[j][sesID][fpath] = qwe;
                        }
                      }
                    } else {
                      //var ttlErrJsn = ErrorHandler.getTotalErrJson();
                      if (ttlErrJsn) {
                        if (Array.isArray(ttlErrJsn)) {
                          var res22 = ttlErrJsn.filter(itm => itm["generic"])[0];
                          if (res22) {
                            if (Array.isArray(res22["generic"])) {
                              var checkDuplicate = res22["generic"].filter(itm2 => itm2[0] === errjsn[i][1]);
                              if (checkDuplicate.length != 0) { } else {
                                let qwe = [];
                                qwe[0] = errjsn[i][1];
                                res22["generic"][res22["generic"].length] = qwe;
                              }
                            }
                          } else {
                            let qwe = [];
                            qwe[0] = errjsn[i][1];
                            var errMsg = [];
                            errMsg[errMsg.length] = qwe;
                            var obj = {};
                            obj["generic"] = errMsg;
                            ttlErrJsn[ttlErrJsn.length] = obj;
                          }
                        }
                      }

                    }
                  }
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].errorMsg = ttlErrJsnOrig;
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalWarnJsn = totalWarnJsn;
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalInfoJsn = totalInfoJsn;
                  GlobalHelper.globlevar['tabScreen'][this.addTabindex].totalSuccJsn = totalSuccJsn;
                  ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
                  ErrorHandler.setTotalWarningsJson(totalWarnJsn);
                  ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
                  ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
                  if (cflag) {
                    ErrorHandler.setHoldCount(0);
                  }
                } catch (e) {
                  Log4r.log(e);
                }
              }
            }
            if (this.state.errorstatus == true && this.F2FunctionNames.data[1].name.SuccessFlag === undefined) {
              preData.clear();
              this.getPredefinedData(holdbasicdata.data[0].name);
              this.ClearFormData();
              this.setState({
                clearForm: true,
                errorstatus: false
              })
            }
            //localfile test...
            //this.namess = file.name;
            this.namess = this.F2FunctionNames.data[0].name;
          }

          if (!GlobalHelper.globlevar.linkclicked) {
            if (GlobalHelper.globlevar['modalClosedClicked'] === true) {

            } else {
              this.rowLinkClick(this.namess);
            }
          } else {
            //  this.namess = file.name;
          }
        } // ends here
      } catch (error) {
        Log4r.error('Error......', error);
        //this.namess = file.name;
        if (this.F2FunctionNames.data == undefined) {
          this.namess = file.name;
        }
      }
    }
    // Sprint 19 - Task 15 save&NEXT - success message should show for time and clean when next screen open
    if (GlobalHelper['uiNextButtonHandler'] == true) {
      GlobalHelper['uiNextButtonHandler'] = undefined;
      responsestatus = undefined;
      let tmpvvv = undefined;
      ErrorHandler.setstatusES(tmpvvv);
      ErrorHandler.setErrMessage(tmpvvv);
      ErrorHandler.setType(tmpvvv);
    }



    /*if(pathname == "rightoptiontwo" )
    {
      IconData = SubmenuIcons2.formheaderdata.formHeaderBookmarks;
      headername =  SubmenuIcons2.formheaderdata.formTitle.mainTitle;
    }

    if(pathname == "rightoptionone")
    {
      IconData = MyJason1.formheaderdata.formHeaderBookmarks;
      headername = MyJason1.formheaderdata.formTitle.mainTitle;
    }*/

    if (closepath === 'GridWorkList') {
      closepath = undefined;
      ErrorHandler.clear();
      this.F2FunctionNames.ScreenLayoutName = "GridWorkList";
      return (<Provider store={store}>
        <Suspense fallback={null}>
          <Switch>
            <Route path={GlobalHelper.globlevar.contextpath + 'GridWorkList'} component={state => <GridWorkList widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" mainpathname="GridWorkList" />} />
            <Route path="/*" render={() => (
              <Redirect to={"GridWorkList"} />
            )} />
          </Switch>
        </Suspense>
      </Provider>);
    }

    if (this.state.refresh == true) {
      this.setState({ refresh: false });
      return (<Provider store={store}>
        <Suspense fallback={null}>
          <Switch>
            <Route path="/*" render={() => (
              <Redirect to={"UIScreen"} />
            )} />
            <Route path={GlobalHelper.globlevar.contextpath + 'UIScreen'} component={state => <UIScreen widths={this.state.widths} themeCode={this.state.themeName} />} />

          </Switch>
        </Suspense>
      </Provider>);
    }
    try {
      if (this.F2FunctionNames.length !== 0 && this.F2FunctionNames !== null) {
        if (this.F2FunctionNames.data.length > 1) {
          if (responsestatus === "S") {

            if (topvalue !== undefined) {

              // responseaction value need to take from configurations..
              var responseaction = "refresh";
              //topvalue = undefined;
              this.handleClick("REFRESH", "sesHeadr");

              if (this.refreshOnSave && calledFromSubmit !== true) {
                // ------------------ refreshing data with server fetch call...
                let values = GlobalHelper.globlevar.functionID;

                /*if(GlobalHelper.globlevar.linkclicked)
                {
                 // post success save in dependable Grid / screen. i.e. parent & Leaf node
                 store.dispatch({type: 'GETREFRESHDATA',values});
                }
                else
                {
                 store.dispatch({type: 'LAYOUTTOPICON',values});
                }*/

                if (temlabel === "") {
                  if (GlobalHelper.globlevar.linkclicked) {
                    // post success save in dependable Grid / screen. i.e. parent & Leaf node
                    if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
                      store.dispatch({ type: 'LAYOUTTOPICON', values });
                    }
                    else {
                      //store.dispatch({type: 'GETREFRESHDATA',values});
                    }

                  }
                  else {
                    store.dispatch({ type: 'LAYOUTTOPICON', values });
                  }
                }
                else if (temlabel !== "next") {
                  //GlobalHelper.globlevar['savedandfetch'] = true;
                  var timeout = setTimeout(() => { uiNextButtonHandler("NEXT"); GlobalHelper['uiNextButtonHandler'] = true; }, 500);
                  temlabel = "next"
                }


                this.setState({ refetchresponsedata: false });
                // --------------------------
              }
              else {

                if (temlabel !== "next" && temlabel === "SAVE & NEXT") {
                  //GlobalHelper.globlevar['savedandfetch'] = true;

                  var timeout = setTimeout(() => { ErrorHandler.clear(); uiNextButtonHandler("NEXT"); GlobalHelper['uiNextButtonHandler'] = true; }, 500);
                  temlabel = "next"

                  this.setState({ refetchresponsedata: false });
                }

                GlobalHelper.globlevar.savespin = false;
              }
            }

          }
          else {
            this.state.clearFormsubmit = false;
          }
        }
      }

      if (GlobalHelper.globlevar['onlyDataCalled']) {
        if (this.F2FunctionNames.data.length > 0) {
          if (this.F2FunctionNames.data[0].name.screendata[0].schema == undefined) {
            // if(this.namess.LayoutHeader === this.F2FunctionNames.data[0].name.LayoutHeader)
            //  {
            for (var i = 0; i < this.namess.screendata.length; i++) {
              for (var j = 0; j < this.F2FunctionNames.data[0].name.screendata.length; j++) {
                if (this.namess.screendata[i].sessionID === this.F2FunctionNames.data[0].name.screendata[j].sessionID) {
                  for (var k = 0; k < this.namess.screendata[i].uiSchema[0].children.length; k++) {
                    /******************/
                    if (responsestatus === "S") {
                      if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "table") {
                        if (savedAndFetchData.screendata[j].formData.length !== 0) {
                          this.namess.screendata[i].formData = savedAndFetchData.screendata[j].formData;
                          this.namess.screendata[i]['ToKeepSafe'] = true;
                        }
                        break;
                      }
                      else {
                        if (savedAndFetchData.screendata[j].formData.length !== 0) {
                          this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = savedAndFetchData.screendata[j].formData[0].data.DataSource;
                          this.namess.screendata[i]['ToKeepSafe'] = true;
                        }
                        break;
                      }
                    }
                    else {
                      if (this.namess.screendata[i].uiSchema !== undefined) {
                        if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "table") {
                          if (this.F2FunctionNames.data[0].name.screendata[j].formData.length !== 0) {
                            this.namess.screendata[i].formData = this.F2FunctionNames.data[0].name.screendata[j].formData;
                            this.namess.screendata[i]['ToKeepSafe'] = true;
                          }
                          break;
                        }
                        else {
                          if (this.F2FunctionNames.data[0].name.screendata[j].formData.length !== 0) {
                            this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = this.F2FunctionNames.data[0].name.screendata[j].formData[0].data.DataSource;

                            if (this.F2FunctionNames.data[0].name.screendata[j].formData[0].data['parentPK'] !== undefined) {
                              this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data['parentPK'] = this.F2FunctionNames.data[0].name.screendata[j].formData[0].data['parentPK'];
                            }

                            if (this.F2FunctionNames.data[0].name.screendata[j].formData[0].data.moreRows) {
                              this.namess.screendata[i].formData[0][this.namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.moreRows = this.F2FunctionNames.data[0].name.screendata[j].formData[0].data.moreRows;
                            }
                            this.namess.screendata[i]['ToKeepSafe'] = true;
                          }

                          break;
                        }
                      }
                    }

                    /*****************/
                  }
                }// END IF
              }
              //Sprint 15:Task 45:[START]  Added code to identify which forms are to be filled with new data and remainig are cleared for refreshing purpose.
              GlobalHelper.globlevar.onlyCardClicked = false;
              if (this.namess.screendata[i].ToKeepSafe === undefined && GlobalHelper.globlevar.refreshDependantData === true) {
                for (let k = 0; k < this.namess.screendata[i].uiSchema[0].children.length; k++) {
                  if (this.namess.screendata[i].uiSchema[0].children[k].children.widget !== "hidden") {
                    if (this.namess.screendata[i].uiSchema[0].children[k].children.widget === "table") {
                      Object.keys(this.namess.screendata[i].formData[0]).map((ind1, num1) => {  // NOSONAR: javascript:S2201
                        if (this.namess.screendata[i].formData[0][ind1].data.isCardDisplay !== "true" && this.namess.screendata[i].formData[0][ind1].data.defaultCardView !== "true") {
                          this.namess.screendata[i].formData[0][ind1].data.DataSource = [];

                        }
                      });
                      break;
                    }
                    else {
                      Object.keys(this.namess.screendata[i].formData[0]).map((ind2, num) => {   // NOSONAR: javascript:S2201
                        if (ind2.length <= 32) {
                          if (this.namess.screendata[i].uiSchema[0].children[k].children.widget === "popsearch") {
                            if (Array.isArray(this.namess.screendata[i].formData[0][ind2].data)) {
                              this.namess.screendata[i].formData[0][ind2].data[0] = "";

                            } else {
                              this.namess.screendata[i].formData[0][ind2].data = "";

                            }
                            try {
                              if (Array.isArray(this.namess.screendata[i].formData[0][ind2].desc)) {
                                this.namess.screendata[i].formData[0][ind2].desc[0] = "";

                              } else {
                                this.namess.screendata[i].formData[0][ind2].desc = "";

                              }
                            }
                            catch (e) {
                              Log4r.error("Eooero", e)
                            }
                          }
                          else {
                            if (!GlobalHelper.globlevar['sectionlevelrefresh']) {
                              this.namess.screendata[i].formData[0][ind2].data = "";
                            }

                          }
                        }

                      });
                      break;
                    }
                  }

                }
              }
              else {
                delete this.namess.screendata[i]["ToKeepSafe"];
              }
              //Sprint 15:Task 45:[END]
            }
          }

        }
        GlobalHelper.globlevar['sectionlevelrefresh'] = false;
        GlobalHelper.globlevar['onlyDataCalled'] = false;
        GlobalHelper.globlevar['defaultValueManagerMap'] = createDefaultValueMap(this.namess, GlobalHelper.globlevar['targetToRulesMapper']);
      }

    } // END try
    catch (error) {
      GlobalHelper.globlevar['sectionlevelrefresh'] = false;
      GlobalHelper.globlevar['onlyDataCalled'] = false;
    }

    if (this.namess.screendata != null) {
      this.namess.screendata.map((item, i) => {
        if (item.uiSchema != undefined) {
          if (item.uiSchema[0].children[0].children.widget === "table") {
            var fieldPath = item.uiSchema[0].children[0].children.fieldPath;
            var colFilter = item.formData[0][fieldPath].data.Columns.filter(itm => itm.onFilter === "true");
            if (colFilter.length > 0) {
              var user = this.namess.screendata[i];
              item.formData[0][fieldPath].data['isGridWithFilter'] = true;
              if (user.sectionButton == undefined) {
                let addRowtoGridSectionButton2 = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"gridsearch\",\"title\": \"Search\",\"fname\": \"gridSearchButton\"}]}";
                user['sectionButton'] = JSON.parse(addRowtoGridSectionButton2);
              }
              else {
                if (user.sectionButton.buttons != undefined && Array.isArray(user.sectionButton.buttons)) {
                  let resArr2 = user.sectionButton.buttons.filter(itm2 => itm2.id == "gridsearch")[0];
                  if (resArr2 == undefined) {
                    let refshBtn = "{\"id\": \"gridsearch\",\"title\": \"Search\",\"fname\": \"gridSearchButton\"}";
                    let btn = JSON.parse(refshBtn);
                    user.sectionButton.buttons.push(btn);
                  }
                }
                else if (user.sectionButton.buttons == undefined) {
                  let addRowtoGridSectionButton2 = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"gridsearch\",\"title\": \"Search\",\"fname\": \"gridSearchButton\"}]}";
                  user['sectionButton'] = JSON.parse(addRowtoGridSectionButton2);
                }
              }
            }
          }
        }
      })
    }

    names = this.namess;
    this.holdNamess = this.namess;

    if (names != null && names.screendata != null)
      for (var i = 0; i < names.screendata.length; i++) {
        let user = names.screendata[i];
        if (user.allowRefresh === "true") {
          if (user.sectionButton == undefined) {
            let addRowtoGridSectionButton2 = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"refreshButton\",\"title\": \"Refresh\",\"fname\": \"refreshFun\"}]}";
            user['sectionButton'] = JSON.parse(addRowtoGridSectionButton2);
          }
          else {
            if (user.sectionButton.buttons != undefined && Array.isArray(user.sectionButton.buttons)) {
              let resArr2 = user.sectionButton.buttons.filter(itm2 => itm2.id == "refreshButton")[0];
              if (resArr2 == undefined) {
                let refshBtn = "{\"id\": \"refreshButton\",\"title\": \"Refresh\",\"fname\": \"refreshFun\"}";
                let btn = JSON.parse(refshBtn);
                user.sectionButton.buttons.push(btn);
              }
            }
            else if (user.sectionButton.buttons == undefined) {
              let addRowtoGridSectionButton2 = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"refreshButton\",\"title\": \"Refresh\",\"fname\": \"refreshFun\"}]}";
              user['sectionButton'] = JSON.parse(addRowtoGridSectionButton2);
            }
          }
        }
      }

    try {
      this.F2FunctionNames.data[0].name = this.namess;
      GlobalHelper.globlevar['UIScreenLayoutJson']['names'] = this.F2FunctionNames;
      xpathFactory(this.namess)
      let custXpathFactory = eval(window.xpathFactory);
      if (typeof custXpathFactory != typeof undefined) {
        custXpathFactory(this.namess);
      }
    }
    catch (e) { Log4r.log(e) }
    //headername = Rightsidermenu[0].groupDesc
    /* for (var r =0; r < Rightsidermenu.length ; r++) {
       headername=      Rightsidermenu[r].groupDesc;
       }*/

    if (GlobalHelper.globlevar.headername == true) {
      /* First time Group header set when controll will come from Worlist  */
      if (Rightsidermenu[0].groupid == "FAV") {
        this.headername = Rightsidermenu[1]['groupdesc'];
        this.formSubTitle = Rightsidermenu[1].content[0].desc;
        a = Rightsidermenu[1].content[0].id;
        right = Rightsidermenu[1].content[0].id;
      } else {
        this.headername = Rightsidermenu[0]['groupdesc'];
        this.formSubTitle = Rightsidermenu[0].content[0].desc;
        a = Rightsidermenu[0].content[0].id;
        right = Rightsidermenu[0].content[0].id;
      }

      if (GlobalHelper.defaultfunction !== undefined && GlobalHelper.defaultfunction !== "" && this.props.orientationType !== "popup") {
        if (GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist.taskHistFunId !== undefined && GlobalHelper.worklistData.worklist.taskHistFunId !== "null" && GlobalHelper.worklistData.worklist.taskId !== undefined && GlobalHelper.worklistData.worklist.taskId !== "") {
          defaultFunctionId = GlobalHelper.defaultfunction[0];
          GlobalHelper.globlevar['HistoryTimelineView'] = true;
          this.createHistoryTimelineView = true;
          //onlyCloseButtonViews = true;
          onlyCloseButtonViews = null;
          showOnlyCloseButton = null;
          TimelineHistorypalatte = JSON.parse(JSON.stringify(this.namess.ButtonPalette));
          CloseButtonpalette = [];
          let aCombinedObject = {};

          let schemaArray = [];
          let uischemaArray = [];
          let formdataArray = [];

          formdataArray.push({ 'close': { "style": { "type": "default", "size": "large", "label": "CLOSE", "classname": "paletteClassSave", "icon": "times", "accessCat": "W", "buttonCategory": "STANDARD", "eventName": "" } } });
          schemaArray.push({ 'close': { "title": "" } });
          let uiChildrenObject = {};
          uiChildrenObject['xType'] = "grid";
          uiChildrenObject['children'] = [];
          uiChildrenObject['children'].push({ "xType": "col", "span": 6, "children": { "xType": "field", "widget": "button", "fieldPath": "close" } });
          uischemaArray.push(uiChildrenObject);

          aCombinedObject['formData'] = formdataArray;
          aCombinedObject['uiSchema'] = uischemaArray;
          aCombinedObject['schema'] = schemaArray;

          CloseButtonpalette.push(aCombinedObject);
        }
        else {
          this.createHistoryTimelineView = false;
          GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
          onlyCloseButtonViews = null;
        }

      }
      else {
        this.createHistoryTimelineView = false;
        GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
        onlyCloseButtonViews = null;
      }
      GlobalHelper.globlevar.headername = false;
    } else {
      //Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.
      if (this.checkForWorkflowHistoryFunction() && this.props.orientationType !== "popup") {
        GlobalHelper.globlevar['HistoryTimelineView'] = true;
        this.createHistoryTimelineView = true;
        //onlyCloseButtonViews = true;
        onlyCloseButtonViews = null;
        showOnlyCloseButton = null;
        TimelineHistorypalatte = JSON.parse(JSON.stringify(this.namess.ButtonPalette));
        CloseButtonpalette = [];
        let aCombinedObject = {};

        let schemaArray = [];
        let uischemaArray = [];
        let formdataArray = [];

        formdataArray.push({ 'close': { "style": { "type": "default", "size": "large", "label": "CLOSE", "classname": "paletteClassSave", "icon": "times", "accessCat": "W", "buttonCategory": "STANDARD", "eventName": "" } } });
        schemaArray.push({ 'close': { "title": "" } });
        let uiChildrenObject = {};
        uiChildrenObject['xType'] = "grid";
        uiChildrenObject['children'] = [];
        uiChildrenObject['children'].push({ "xType": "col", "span": 6, "children": { "xType": "field", "widget": "button", "fieldPath": "close" } });
        uischemaArray.push(uiChildrenObject);

        aCombinedObject['formData'] = formdataArray;
        aCombinedObject['uiSchema'] = uischemaArray;
        aCombinedObject['schema'] = schemaArray;

        CloseButtonpalette.push(aCombinedObject);
      } else {
        this.createHistoryTimelineView = false;
        GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
        onlyCloseButtonViews = null;
      }
      //END - Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.
    }


    var imgpath = window.location.origin;
    /*Sprint 13 - Added to hide header in function screen*/
    var headerClassProp;
    var layoutClassProp;
    if (GlobalHelper.globlevar.removeHeaderFlag) {
      headerClassProp = styles.head_chk;
      layoutClassProp = styles.layout_near_rightsider_chk;
    }
    else {
      headerClassProp = styles.head;
      layoutClassProp = styles.layout_near_rightsider;
    }//end

    //var path = "/MainLayout";
    let subFuncName = ""
    if (GlobalHelper.globlevar['subFuncName'] !== undefined) {
      subFuncName = " | " + GlobalHelper.globlevar['subFuncName'];
    }

    //Sprint 32 - Task - To make history timeline sections readonly
    if (this.createHistoryTimelineView == true && GlobalHelper.globlevar['HistoryTimelineView'] == true) {
      if (historyFunctionFlag === true) {
        this.namess.screendata.map((item, index) => {
          if (index > 0) {
            item['editable'] = false;
            //To make Section Grid readonly....
            if (item.uiSchema[0] != null && item.uiSchema[0].children != null) {
              if (item.uiSchema[0].children[0].children.edit != null) {
                item.uiSchema[0].children[0].children.edit = "false";
                if (item.uiSchema[0].children[0].children.widget === "table") {
                  item.formData[0][item.uiSchema[0].children[0].children.fieldPath].data.Columns.map((colItem, colIndex) => {
                    colItem['completeEditable'] = false;
                    //Sprint 32 - To remove add,edit and delete column from history functionn screen after making it readonly.
                    if (colItem['id'] === "add" || colItem['id'] === "edit" || colItem['id'] === "delete"
                      || colItem['title'] === "add" || colItem['title'] === "edit" || colItem['title'] === "delete"
                      || colItem['style'] === "add" || colItem['style'] === "edit" || colItem['style'] === "delete"
                      || colItem['fieldPath'] === "add" || colItem['fieldPath'] === "edit" || colItem['fieldPath'] === "delete") {
                      colItem['removeColumnForHistoryScreen'] = "true";
                      colItem['widget'] = "hidden";
                    } else {
                      if (colItem['edit'] === "true") {
                        colItem['edit'] = "false";
                      }
                    }
                    //END - Sprint 32 - To remove add,edit and delete column from history functionn screen after making it readonly.
                  })
                }
              }
            }
            //Sprint 32 - Task - To make history timeline sections and section button readonly...
            if (item.sectionButton != null) {
              item.sectionButton['disabled'] = true;
              item.sectionButton['widgetEditFlag'] == "false";
              item.sectionButton.buttons.map((buttonobj, btnindex) => {
                buttonobj['readOnlyButton'] = true;
              })
              GlobalHelper.globlevar['HistoryTimelineViewSectionButton'] = true;
            }//END - Sprint 32 - Task - To make history timeline sections and section button readonly...
          }
        })
      }
    }
    //END - Sprint 32 - Task - To make history timeline sections readonly

    /* Sprint 34: [START] -  Making all section readonly if not found in tasklist's defFunction array*/

    if (GlobalHelper.globlevar["promptClicked"] != true && GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist !== null) {
      if (GlobalHelper.worklistData.worklist.taskId != undefined && GlobalHelper.worklistData.worklist.taskId != "") {
        //if(GlobalHelper.globlevar['clipsearchcloseprejson'] != undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].SearchFromClipSearch != undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].SearchFromClipSearch !== true ){
        if (GlobalHelper.selectedRowData) {
          if (GlobalHelper.worklistData.worklist.defFunction) {
            let functionIdsFound = new Array();
            try {
              functionIdsFound = GlobalHelper.selectedRowData[GlobalHelper.worklistData.worklist.defFunction].split(",");
            } catch (e) {
              Log4r.error(e);
            }
            let found = false;
            for (let i = 0; i < functionIdsFound.length; i++) {
              if (functionIdsFound[i] == GlobalHelper.globlevar.functionID ) {
                found = true;
                break;
              }
            }

            if (GlobalHelper.globlevar.globalFunctionsMap != undefined && GlobalHelper.globlevar.globalFunctionsMap.length != 0) {
              if (GlobalHelper.globlevar.globalFunctionsMap.has(GlobalHelper.globlevar.functionID)) {
                found = true;
              }
            }
            //Sprint 38 - Task 53- To remove DONE button from TaskList function.
            if (found) {
              removeButton("btnDone");
            }//END-Sprint 38 - Task 53- To remove DONE button from TaskList function.

			if (!found && (this.props.orientationType =='popup' || GlobalHelper.globlevar.functionID == this.props.outnames.data[0].name.functionID )) {
                this.makeSectionsCompletelyReadonly();
                this.showHideButtonPallete("hide");
              }
          }
        }
        //}
      }
    }
    /* Sprint 34: [END] - Making all section readonly if not found in tasklist's defFunction array*/

    /* code to execute rule execution starts */
   // if (this.targetToRulesMapper != undefined && (this.ruleToTargetsMapper != undefined) && (this.fieldInExpressionToRulesMapper != undefined) && (this.defaultValueManagerMap != undefined) && (this.ruleExecutionStatusMap != undefined) && (this.throwValidationRulesArray != undefined)) {
      //if (this.targetToRulesMapper.size == 0 && (this.ruleToTargetsMapper.size == 0) && (this.fieldInExpressionToRulesMapper.size == 0) && (this.defaultValueManagerMap.size == 0) && (this.ruleExecutionStatusMap.size == 0) && (this.throwValidationRulesArray.length == 0)) {
        this.targetToRulesMapper = GlobalHelper.globlevar['targetToRulesMapper'];
        this.ruleToTargetsMapper = GlobalHelper.globlevar['ruleToTargetsMapper'];
        this.fieldInExpressionToRulesMapper = GlobalHelper.globlevar['fieldInExpressionToRulesMapper'];
        this.defaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
        this.ruleExecutionStatusMap = GlobalHelper.globlevar['ruleExecutionStatusMap'];
        this.throwValidationRulesArray = GlobalHelper.globlevar['throwValidationRulesArray'];
      //}
   // }
    let ruleUtilityObject = new RuleExecutionUtility(this.namess, this.targetToRulesMapper, this.ruleToTargetsMapper, this.fieldInExpressionToRulesMapper, this.defaultValueManagerMap, this.ruleExecutionStatusMap, this.throwValidationRulesArray, this.fieldsChangedForRuleExecution, this.isOnload);
    let onlyThrowValidationError = false;
    this.namess = ruleUtilityObject.executeRules(onlyThrowValidationError);
    this.fieldsChangedForRuleExecution = []; // clear the array as it should get refreshed after execution of a rule cycle
    this.isOnload = false; // once rule execution occurs onLoad, this flag should turn false to differentiate re rendering of page due to other events from onLoad
    /* code to execute rule execution ends */

    if (this.props['screenLayouType'] === "BulkFunction") {
      // the below attribure added to pass selected rows in case of popsearch widget.
      this.namess['screenLayouType'] = "BulkFunction";
    }
    try {
      if (onlyCloseButtonViews == true) {
        if (showOnlyCloseButton == true) {
          this.namess.ButtonPalette.splice(0, this.namess.ButtonPalette.length);
          this.namess.ButtonPalette.splice(0, 0, CloseButtonpalette[0]);
        } else {
          this.namess.ButtonPalette.splice(0, this.namess.ButtonPalette.length);
          this.namess.ButtonPalette.splice(0, 0, TimelineHistorypalatte[0]);
        }
      }

      return (
        <Layout style={{ width: '100%', backgroundColor: '#e7ecf4' }}>
          <HotKeyComponent Component={this} F2FunctionScreenFlag={true} />
          {this.props.pageSpliting ||this.props.profileFlag || (this.props.screenLayouType === "QuickFunction" && (this.namess['ACCESS_MODE'] == 1 || GlobalHelper.globlevar['ACCESS_MODE'] == 1)) ? null : <Header className={stylesfu.headerConslidercssfollowup} style={{ height: 5, minHeight: 40, background: '#fff', width: '100%', display: 'inline-block' }}>

            {
              //Sprint 23 - To change layout title for menu function screen.
               //GlobalHelper.globlevar['menuFunctionFlag']
               Rightsidermenu.length >1  || Rightsidermenu.length==0 ?
        GlobalHelper.globlevar['menuFunctionFlag'] 
                ? <div style={{ marginLeft: '-30px', position: "absolute", height: 40, width: "60%" }}>
                  <div className={stylesf.firstheader1div}>
                    {
                      GlobalHelper["layoutCaption"]
                    }
                  </div>
                </div>
                : (this.props.screenLayouType === "BulkFunction" || this.props.screenLayouType === "QuickFunction") ? null : <div style={{ marginLeft: '-30px', position: "absolute", height: 40, width: "60%" }}>
                  <div className={stylesf.firstheader1div}>
                    {
                      this.headername
                    }
                  </div>
                  <div className={stylesf.firstheader2div}> | </div>
                  <div className={stylesf.firstheader3div}>
                    {this.formSubTitleForCloseClipsearch !== undefined ? this.formSubTitleForCloseClipsearch : (names['formSubTitle'] != null ? names['formSubTitle'] : this.formSubTitle)} &nbsp; {subFuncName}
                  </div>

                </div>:null
            }
            <div className={stylesf.scrollheader}>
            <div  style={{ float: 'right', height: '40px', display: 'inline-block', marginRight: '-46px', position: 'relative', top: '-11px' }}>
              {
                this.namess.QuickButtonPalette !== undefined ? this.namess.QuickButtonPalette.map(this.renderQuickButton.bind(this)) : null
              }
              {GlobalHelper.globlevar.removeHeaderFlag ? null : GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist.defFunction == undefined ?
                (
                  <div style={{ position: 'relative', marginRight: 10, display: 'inline-block', cursor: 'pointer' }} onClick={this.pinUnpinDefaultFunction}>
                    <Popover className={styles.pop} placement="bottomRight" content={"Pin"} style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover">
                      <FA name={"thumb-tack"} className={this.setPinUnpinIcon()} stack="0.5x" style={{ padding: '6px', fontSize: '16px' }}/>
                    </Popover>
                  </div>
                ) : null
              }
              {(GlobalHelper.globlevar.removeHeaderFlag || this.props.screenLayouType === "BulkFunction" || this.props.screenLayouType === "QuickFunction") ? null :
                (<div style={{ position: 'relative', marginRight: 10, display: 'inline-block', cursor: 'pointer' }} onClick={this.manageFavoriteFunctions}>
                  <Popover className={styles.pop} placement="bottomRight" content={this.setFavoriteTooltip()} style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover">
                    <FA name={"star"} className={this.setMyFavClass()} stack="0.5x" style={{ padding: '6px', fontSize:16 }} aria-label="Add to Favourites"/>
                  </Popover>
                </div>)
              }

              {
                  (process.env.NODE_ENV === 'production') ? null : (this.props.screenLayouType==="BulkFunction" || this.props.screenLayouType==="QuickFunction")?null:(getServerMode() == 'TEST') ? (
                  <div  style={{position:'relative',marginRight:10,  display: GlobalHelper.globlevar["SplitScreenMainLayout"] == true && this.props.orientationType !='popup' ? 'inline-block' : 'none' ,cursor:'pointer'}}
                    onClick={()=>{  this.functionForSplitScreenBackWordForm(GlobalHelper.globlevar.functionID,this.namess);}}>
                      <Popover className={styles.pop}  placement="bottomRight" content={'back screen'} style={{height:'100px',width:'50px', cursor:'pointer'}} trigger="hover">
                        <FA name={"reply"} className={styles.headexample} stack="0.5x" style={{padding:'8px'}}/>
                        </Popover>
                    </div>) : null
              }
              {
                (process.env.NODE_ENV === 'production') ? null : (this.props.screenLayouType==="BulkFunction" || this.props.screenLayouType==="QuickFunction")?null:(getServerMode() == 'TEST') ? (
                <div style={{position:'relative',marginRight:10, display: GlobalHelper.globlevar["SplitScreenMainLayout"] == true || this.props.orientationType =='popup' ? 'none' : 'inline-block' ,cursor:'pointer'}}
                  onClick={()=>{  this.functionForSplitScreenForm(GlobalHelper.globlevar.functionID,this.namess);}}>
                    <Popover className={styles.pop}  placement="bottomRight" content={'split screen'} style={{height:'100px',width:'50px', cursor:'pointer'}} trigger="hover">
                      <FA name={"tasks"} className={styles.headexample} stack="0.5x" style={{padding:'8px'}} aria-label="split screen"/>
                    </Popover>
                  </div>) : null
                }
              {(process.env.NODE_ENV === 'production') ? null : (this.props.screenLayouType === "BulkFunction" || this.props.screenLayouType === "QuickFunction") ? null : (getServerMode() == 'TEST') ? (<div style={{ position: 'relative', marginRight: 10, display: 'inline-block', cursor: 'pointer' }} onClick={() => { this.functionForTest(GlobalHelper.globlevar.functionID, this.namess); }}>
                <Popover className={styles.pop} placement="bottomRight" content={'Test'} style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover">
                  <FA name={"play"} className={styles.headexample} stack="0.5x" style={{ padding: '8px' }} aria-label="Test"/>
                </Popover>
              </div>) : null
              }
              {
                (this.props.screenLayouType === "BulkFunction" || this.props.screenLayouType === "QuickFunction") ? null : <div style={{ position: 'relative', marginRight: 10, display: 'inline-block', cursor: 'pointer' }} onClick={this.customHelpFunctions}>
                  <Popover className={styles.pop} placement="bottomRight" content={'Help'} style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover">
                    <FA name={"question-circle"} className={styles.headexample} stack="0.5x" style={{ padding: '6px', fontSize:16 }} aria-label="Help"/>
                  </Popover>
                </div>
              }
              <div style={{ marginRight: 10, display: 'inline-block', cursor: 'pointer' }}>
                <Popover className={styles.pop} placement="bottomRight" visible={this.state.visible} onVisibleChange={this.handleVisibleChange}
                  title={
                    <div style={{ minHeight: '30px', maxHeight: '30px', height: '100%', width: '250px', marginRight: '-10px' }}>
                      <Row type="flex" justify="start">
                        <Col span={13}>
                          <div className={stylesf.title}>Validation Messages</div>
                        </Col>
                        <Col span={4}>
                          <div className={stylesf.Ava}><div className={stylesf.type1}>{ErrorHandler.getErrCount()}</div></div>
                        </Col>
                        <Col span={4} className={stylesf.col}>
                          <div className={stylesf.fa}><a onClick={this.hide} style={{ color: '#8493a7' }}> <FA name={"times"}> </FA></a></div>
                        </Col>
                      </Row>
                    </div>
                  }
                  content={<Validation changeRefreshERROR={this.changeRefreshERROR}  aria-label={this.changeRefreshERROR}/>}
                  trigger="click">
                  <Popover content={'Validation Messages'} placement="bottomRight" style={{ height: '100px', width: '50px', cursor: 'pointer', position: 'absolute' }} trigger="hover">
                    <Badge count={ErrorHandler.getErrCount()} style={{ backgroundColor: ErrorHandler.getHoldColorUIScreen() === undefined ? '#f5222d' : ErrorHandler.getHoldColorUIScreen(), fontSize: '9px', position: 'absolute' }} aria-label="Validation Messages">
                      <FA name={"exclamation-triangle"} className={styles.headexample} stack="0.5x" style={{ padding: '6px', fontSize:16 }}/>
                    </Badge>
                  </Popover>
                </Popover>
              </div>
              {
                this.renderCustomHeaderFunctions()
              }
              {
                this.customHeaderFunctionsExists === true ? <div style={{display:'inline-block', width:'auto', position:'relative', top:'14px', left:'-5px', margin:'5px', float:'left', height:25, borderRight:'2px solid gray'}}></div> : null
              }
              <div style={{ display: "inline-block", float: 'right', marginRight: '0%' }}><Icon style={{ marginTop: '-10px', paddingTop: '-10px' }} type="caret-right" rotate={this.isActive ? 90 : 0} onClick={() => { this.isActive = !this.isActive; this.namess['isActive'] = this.isActive; this.reRender(); }} aria-label="Collapse-All"/></div>

            </div>
            </div>

          </Header>}

          <Layout style={{ width: '100%', backgroundColor: '#e7ecf4' }}>
            <Spin spinning={GlobalHelper.globlevar.savespin}>
              <Content id={this.props.orientationType === "popup" ? 'PopUIcontents' : 'UIcontents'} className={stylesfu.UIcontents} style={{
                height: (GlobalHelper.globlevar.removeHeaderFlag ? (this.props.orientationType === "popup" ? this.state.heighttable - 250 : this.state.heighttable - 150) : (this.props.screenLayouType === "BulkFunction" ? this.state.heighttable - 260 : this.props.screenLayouType === "QuickFunction" ? this.state.heighttable - 400 : (window.innerHeight > 1000 ? this.state.heighttable - 330 : this.state.heighttable - 323 ))),
                paddingTop: this.props.screenLayouType === "BulkFunction" ? 0 : 4,
                paddingRight: this.props.screenLayouType === "BulkFunction" ? 3 : 'none'
              }}
                dir={GlobalHelper.contextSetting.ORG_LANGUAGE_CODE}>
                {
                  this.alertmessage()
                }
                <Scrollbars id="scrollbar11"
                  thumbSize={($('[id=cardViewWrapper]') != null && $('[id=cardViewWrapper]').length != 0) ? 1 : 100}
                  autoHide={true}
                  universal={true}
                >
                  {
                    this.handleNullDataForCheckBox(this.namess)
                  }

                  {
                    GlobalHelper.globlevar["SplitScreenMainLayout"] == true && this.props.pageSpliting != true && this.props.orientationType != "popup" ?
                    <SplitScreenMainLayout {...this.props} splitScreenData ={ GlobalHelper.globlevar["SplitScreenParams"] }  /> :
                    Rightsidermenu.length >1 || Rightsidermenu.length==0 ? this.namess.screendata.map(this.renderScreen.bind(this)) : null
                    /*(
                      (this.namess['functionID'] === GlobalHelper.globlevar['functionID']) ||
                      (this.namess['layoutType'] == "CustomScreen")                        ||
                      (names.data[0].name["layoutType"] ==  "FunctionScreen")              ||
                      (this.props.orientationType == "popup")
                    ) ? this.namess.screendata.map(this.renderScreen.bind(this)) : null*/
                  }

                  {
                    this.returnEmptyTwoThirdContainer(this.namess)
                  }

                  {
                    ErrorHandler.getsequenceJson(this.namess.screendata)
                  }

                </Scrollbars>
              </Content>
            </Spin>
            {
              this.props.pageSpliting ||this.props.profileFlag || (this.props.screenLayouType === "QuickFunction" && (this.namess['ACCESS_MODE'] == 1 || GlobalHelper.globlevar['ACCESS_MODE'] == 1)) ? null : <div style={{ height: (this.props.themeCode === "myCompact" ? '45px' : '52px') }}>
                {
                   Rightsidermenu.length >1  || Rightsidermenu.length==0 ? this.namess.ButtonPalette.map(this.renderButtonPalette.bind(this)) : null
                }
              </div>
            }

          </Layout>
        </Layout>
      )
    }
    catch (e) {
      Log4r.error("F2functionscreen Error Got !...", e);
      return (
        <Layout className={styles.layout_near_main_header}>
          { this.props.pageSpliting != true ? <Header className={headerClassProp} style={{ width: this.props.widths + 65, overflow: 'hidden', borderRadius: '5px', paddingLeft: '0px', background: 'white', minHeight: 80 }}>
            {/*this.getHeaderTemplate()*/}
          </Header> : null }

          <Layout id={stylesfu.screen} className={layoutClassProp} style={{ height: (GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable - 54 : this.state.heighttable - 144) }}>
            <Layout id={stylesfu.screen} style={{ overflow: 'hidden', position: 'absolute', width: (TimeLineView ? (this.props.themeCode === "myCompact" ? this.state.widths - $('[class*=layout_near_timeline]').width() - 3 : this.state.widths - $('[class*=layout_near_timeline]').width() - 9.5) : (this.props.themeCode === "myCompact" ? (Rightsidermenu != null && Rightsidermenu.length !== 0 ? this.state.widths + 6 : this.state.widths + 65) : (Rightsidermenu != null && Rightsidermenu.length !== 0 ? this.state.widths : this.state.widths + 65))), height: (GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable - 54 : this.state.heighttable - 144), left: (window.innerWidth > 760 ? 0 : 2) }} className={stylesfu.headerConslidercssfollowup}>
            {
              this.props.pageSpliting != true ||  Rightsidermenu != null && Rightsidermenu.length !== 0 ? <Header className={styles.customHeader1} style={{ height: 52, minHeight: '40px', maxHeight: 55, overflow: "hidden", width: '100%', display: 'inline-block', paddingLeft: '10px' }}>
                  <div className={styles.SubHDL}><FA name={"fas fa-angle-left"} className={styles.SubLSB} /></div>
                  <div className={styles.MyHeaderDiv}>
                    {
                      // will work with funcation modling part
                      Rightsidermenu.map((post, jj) => {
                        let col = undefined;
                        let ici = undefined;

                        if (right == 0 && jj == 0) {
                          const MyContent = post.content;
                          return (
                            <div className={stylesf.iconGroup}>
                              {
                                MyContent.map((id, mn) => {

                                  ici = GlobalHelper.getFontIcon(id.icon);
                                  col = GlobalHelper.getFontColor(id.icon);
                                  // if(id.icon == "" || id.icon==null || id.icon==undefined){
                                  //   id.icon="sticky-note";
                                  // }
                                  if (a == 0 && mn == 0) {
                                    this.headername = id.groupds;
                                    this.formSubTitle = id.desc;
                                    a = id.id;
                                    if (arrayOfRightSider[post.groupid] == undefined) {
                                      allScrnErrObj = {};
                                      arrayOfRightSider[post.groupid] = allScrnErrObj;
                                    } else {
                                      backuperrjson = allScrnErrObj[a];
                                    }
                                    return (<Popover content={<span>{id.desc}</span>} trigger="hover" >
                                      <div style={{ marginRight: '1px', cursor: 'pointer' }} className={this.setMyClass(id.id, a)} onClick={() => this.myFunction(id.id, id.desc, id)}>
                                        <FA name={ici} stack="0.5x" className={stylesf.customIcons} >
                                        </FA>
                                      </div>
                                    </Popover>);
                                  } else if (id.id == a) {
                                    this.headername = id.groupds;
                                    this.formSubTitle = id.desc;
                                    return (<Popover content={<span>{id.desc}</span>} trigger="hover" >
                                      <div style={{ marginRight: '1px', cursor: 'pointer' }} className={this.setMyClass(id.id, a)} onClick={() => this.myFunction(id.id, id.desc, id)}>
                                        <FA name={ici} stack="0.5x" className={stylesf.customIcons} >
                                        </FA>
                                      </div>
                                    </Popover>);
                                  }
                                  return (
                                    <Popover content={<span>{id.desc}</span>} trigger="hover" >
                                      <div style={{ marginRight: '1px', cursor: 'pointer' }} className={this.setMyClass(id.id, a)} onClick={() => this.myFunction(id.id, id.desc, id)}>
                                        <FA name={ici} stack="0.5x" className={stylesf.customIcons} >
                                        </FA>
                                      </div>
                                    </Popover>
                                  )
                                })
                              }
                            </div>
                          )
                        } else if (post.groupid == right) {
                          const MyContent = post.content;
                          return (
                            <div className={stylesf.iconGroup}>
                              {
                                MyContent.map((id, mn) => {
                                  ici = GlobalHelper.getFontIcon(id.icon);
                                  col = GlobalHelper.getFontColor(id.icon);
                                  if (GlobalHelper.globlevar.UIScreen == "UIScreen") {
                                    // top 1 menu should selected
                                    a = 0;
                                  }
                                  if (a == 0 && mn == 0) {
                                    a = id.id;
                                    this.headername = id.groupds;
                                    this.formSubTitle = id.desc;
                                    return (<Popover content={<span>{id.desc}</span>} trigger="hover" >
                                      <div style={{ marginRight: '1px', cursor: 'pointer' }} className={this.setMyClass(id.id, a)} onClick={() => this.myFunction(id.id, id.desc, id)}>
                                        <FA name={ici} stack="0.5x" className={stylesf.customIcons} >
                                        </FA>
                                      </div>
                                    </Popover>);
                                  } else if (id.id == a) {
                                    this.headername = id.groupds;
                                    this.formSubTitle = id.desc;
                                    return (<Popover content={<span>{id.desc}</span>} trigger="hover" >
                                      <div style={{ marginRight: '1px', cursor: 'pointer' }} className={this.setMyClass(id.id, a)} onClick={() => this.myFunction(id.id, id.desc, id)}>
                                        <FA name={ici} stack="0.5x" className={stylesf.customIcons} >
                                        </FA>
                                      </div>
                                    </Popover>);
                                  }
                                  return (
                                    <Popover content={<span>{id.desc}</span>} trigger="hover" >
                                      <div style={{ marginRight: '1px', cursor: 'pointer' }} className={this.setMyClass(id.id, a)} onClick={() => this.myFunction(id.id, id.desc, id)}>
                                        <FA name={ici} stack="0.5x" className={stylesf.customIcons} >
                                        </FA>
                                      </div>
                                    </Popover>
                                  )
                                })
                              }
                            </div>
                          )
                        }
                      })
                    }
                  </div>
                  <div className={styles.SubHDR}><FA name={"fas fa-angle-right"} className={styles.SubRSB} /></div>
                </Header> : null
              }
              {this.props.profileFlag || (this.props.screenLayouType === "QuickFunction" && (this.namess['ACCESS_MODE'] == 1 || GlobalHelper.globlevar['ACCESS_MODE'] == 1)) ? null :
              <Header className={stylesfu.headerConslidercssfollowup} style={{ height: 5, minHeight: 40, background: '#fff', width: '100%', display: 'inline-block' }}>

                {
                  //Sprint 23 - To change layout title for menu function screen.
                  GlobalHelper.globlevar['menuFunctionFlag']
                    ? <div style={{ marginLeft: '-30px', position: "absolute", height: 40, width: "60%" }}>
                      <div className={stylesf.firstheader1div}>
                        {
                          GlobalHelper["layoutCaption"]
                        }
                      </div>
                    </div>
                    : this.props.screenLayouType === "BulkFunction" ? null : <div style={{ marginLeft: '-30px', position: "absolute", height: 40, width: "60%" }}>
                      <div className={stylesf.firstheader1div}>
                        {
                          this.headername
                        }
                      </div>

                      <div className={stylesf.firstheader2div}>
                        |
        </div>

                      <div className={stylesf.firstheader3div}>
                        {this.formSubTitleForCloseClipsearch !== undefined ? this.formSubTitleForCloseClipsearch : (names['formSubTitle'] != null ? names['formSubTitle'] : this.formSubTitle)} &nbsp; {subFuncName}
                      </div>

                    </div>
                }

                <div style={{ float: 'right', height: '40px', display: 'inline-block', marginRight: '-46px', position: 'relative', top: '-11px' }}>

                  <div style={{ position: 'relative', marginRight: 10, display: 'inline-block', cursor: 'pointer' }} onClick={this.customHelpFunctions}>
                    <Popover className={styles.pop} placement="bottomRight" content={'Help'} style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover" >
                      <FA name={"question-circle"} className={styles.headexample} stack="0.5x" style={{ padding: '6px', fontSize:16 }} />
                    </Popover>
                  </div>
                  <div style={{ marginRight: 10, display: 'inline-block', cursor: 'pointer' }}>
                    <Popover className={styles.pop} placement="bottomRight" visible={this.state.visible} onVisibleChange={this.handleVisibleChange} title={<div style={{ minHeight: '30px', maxHeight: '30px', height: '100%', width: '250px', marginRight: '-10px' }}>
                      <Row type="flex" justify="start">
                        <Col span={13}>
                          <div className={stylesf.title}>Validation Messages</div>
                        </Col>
                        <Col span={4}>
                          <div className={stylesf.Ava}><div className={stylesf.type1}>{ErrorHandler.getErrCount()}</div></div>
                        </Col>
                        <Col span={4} className={stylesf.col}>
                          <div className={stylesf.fa}><a onClick={this.hide} style={{ color: '#8493a7' }}> <FA name={"times"}> </FA></a></div>
                        </Col>
                      </Row>
                    </div>}
                      content={<Validation changeRefreshERROR={this.changeRefreshERROR} />} trigger="click" >

                      <Popover content={'Validation Messages'} placement="bottomRight" style={{ height: '100px', width: '50px', cursor: 'pointer' }} trigger="hover" >
                        <Badge count={ErrorHandler.getErrCount()} style={{ backgroundColor: ErrorHandler.getHoldColorUIScreen() === undefined ? '#f5222d' : ErrorHandler.getHoldColorUIScreen(), fontSize: '9px', position: 'absolute' }} >
                          <FA name={"exclamation-triangle"} className={styles.headexample} stack="0.5x" style={{ padding: '6px', fontSize:16 }} />
                        </Badge>
                      </Popover>
                    </Popover>
                  </div>

                </div>

              </Header>}

              <Layout style={{ width: '100%', backgroundColor: '#e7ecf4' }}>

                <Content className={stylesfu.UIcontents} style={{ height: (GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable - 150 : this.state.heighttable - 330) }}>
                  <div style={{ textAlign: 'center' }}>
                    <Spin size="large">
                      <Alert
                        message="Wait..."
                        description="Data is loading..."
                        type="info"
                      />
                    </Spin>
                    <Spin></Spin>
                  </div>

                </Content>

                <div style={{ height: (this.props.themeCode === "myCompact" ? '45px' : '52px') }}>

                </div>
              </Layout>
            </Layout>

            {
              Rightsidermenu != null && Rightsidermenu.length !== 0 ? <Sider
                trigger={null}
                collapsible
                collapsed={!this.state.rightcollapsed}
                className={styles.siderrightsetting}
                id={stylesfu.componentslayoutdemocustomtrigger}
                style={{ right: (TimeLineView ? $('[class*=layout_near_timeline]').width() + 9 : (window.innerWidth > 760 ? 0 : 2)), position: 'absolute', height: (GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable - 54 : this.state.heighttable - 144), borderRadius: '5px' }}
              >

                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className={styles.siderrightsettingMenu}  >
                  {
                    Rightsidermenu.map((post, ll) => {
                      var isdefaultactive = "no";
                      let col = undefined;
                      let ici = undefined;

                      if (GlobalHelper.globlevar.UIScreen == "UIScreen") {
                        // top 1 and right 1st menu should selected
                        GlobalHelper.globlevar.UIScreen = undefined;
                        right = 0;
                      }
                      if (right == 0 && ll == 0) {
                        isdefaultactive = "yes";
                        right = post.groupid;
                        Arrow = post.groupid;
                      } else if (right == post.groupid) {
                        isdefaultactive = "yes";
                        right = post.groupid;
                        Arrow = post.groupid;
                      }
                      else if (right == post.iorder) {
                        isdefaultactive = "yes";
                        right = post.groupid;
                        Arrow = post.groupid;
                      }
                      else {
                        isdefaultactive = "no";
                      }
                      if (post.icon_exp == "" || post.icon_exp == null || post.icon_exp == undefined) {
                        //post.icon_exp="sticky-note";
                        ici = "sticky-note";
                      } else {
                        ici = GlobalHelper.getFontIcon(post.icon_exp);
                        col = GlobalHelper.getFontColor(post.icon_exp);
                      }
                      return (
                        <span id={this.setSpanClass(post.groupid)}>
                          <Tooltip placement="left" title={<span>{post.groupdesc}</span>}>
                            <div className={this.setClassArrow(post.groupid, isdefaultactive)} />
                            <div className={this.setClassRightUI(post.groupid, isdefaultactive)} id={this.setIdToTimelineIcon(post.groupid)} onClick={() => this.MyFuncRight(post)} style={{ marginTop: '1px', borderRadius: '5px', marginTop: '-20px', cursor: 'pointer' }}>
                              <FA name={ici} stack='2' style={{ fontSize: (this.props.themeCode === "myCompact" ? '12pt' : '13pt'), paddingTop: '20px', textAlign: "center" }} className={styles.rightsidericons} />
                            </div>
                          </Tooltip>
                        </span>
                      )
                    })
                  }
                </Menu>
              </Sider> : null
            }

            <div className={styles.layout_near_timeline} style={{ width: (TimeLineWidth), minWidth: (TimeLineView ? '450px' : '0px'), maxWidth: (TimeLineView ? '400px' : '0px'), display: (TimeLineView ? 'inline-block' : 'none'), height: (GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable - 54 : this.state.heighttable - 144) }}>
              <div style={{ width: "90%" }} className={styles.timeLineWrapperTitle}>Timeline Layout<div style={{ float: 'right' }}>
                <ButtonSwitch checkedChildren="Timeline" unCheckedChildren="Grid" defaultChecked={(GlobalHelper.globlevar.GridToTimeline ? true : false)} onChange={function (checked) { if (checked) { GlobalHelper.globlevar.GridToTimeline = true; this.forceUpdate(); } else { GlobalHelper.globlevar.GridToTimeline = false; this.forceUpdate(); } }.bind(this)} />
              </div>
              </div>
              <div className={styles.timeLineRadioButtons}>
              </div>
              <div className={styles.timeLineContainer}>
              </div>
            </div>

          </Layout>
        </Layout>
      )
    }
  }

  timelinebutton(arr) {
    try {

      if (screenLoadAndPostSaveFlag == true || screenLoadAndPostSaveFlag == "onload") {
        screenLoadAndPostSaveFlag = false;
        screenLoadStartTime = new Date().getTime();
        //alert(screenLoadStartTime);
      }

      return (arr.map((item, index) => {
        return (
          <Button  onClick={this.setGrayScaleId.bind(this, item.sessionID)} className={this.setTimeLineButtonClass(item.sessionID)}>{item.sessionHeader}</Button>
        );
      }));
    } catch (e) {
      Log4r.error(e)
    }
  }

  timelineScreen(arr) {
    try {
      return (arr.map((item, index) => {
        return (
          <span id={item.sessionID} className={this.setGrayScaleClass(item.sessionID)}>
            <Suspense fallback={null}>
              <ScreenMeta revertIsPopSectionClearClikedFlag={this.revertIsPopSectionClearClikedFlag} isPopSectionClearClicked={this.isPopSectionClearClicked} cFixedSectionColumn={item.cFixedSectionColumn} columnCount={item.columnCount} layoutSize={item.layoutSize} addRowToGridSection={this.addRowtoGridSection} sectionButtonTriggered={this.buttonTriggered} forTableSec={item.forTableSec} dummyErrJson={item.dummyErrJson} toCheckChang={item.toCheckChang} assignErrorObj={this.props.assignErrorObj} closeModal={this.props.closeModal} selectedRowKeysArray={this.props['selectedRowKeysArray']} functionMode={this.props['functionMode']} screenLayouType={this.props['screenLayouType']} functionId={this.props['functionId']} screenLoadAndPostSaveFlag={this.props['screenLoadAndPostSaveFlag']} triggerSectionButtonEvent={item.triggerSectionButtonEvent} orientationType={this.props.orientationType} sectionXPath={item.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} sectionButton={item.sectionButton} sessionID={item.sessionID} sectionId={item.sessionID} sectionhead={""} schema={item.schema[0]} uiSchema={item.uiSchema[0]} formData={item.formData[0]} editable={item.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName} widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} fieldToActionMapper={this.fieldToActionMapper} namess={this.namess} onBlur={this.handleBlur}  onFocus={this.handleFocus} onKeyDown={this.handleKeydown} emulateOnLoad={this.emulateOnLoad} focusHandlerFormEditor={this.props.focusHandlerFormEditor} />
            </Suspense>
          </span>
        );
      }));
    }
    catch (e) {
      Log4r.error(e)
    }
  }
  emulateOnLoad() {
    this.isOnload = true;
    this.setState({ justRefresh: !this.state.justRefresh }, () => {
      if (GlobalHelper.globlevar.cardAddButtonClicked) {
        GlobalHelper.globlevar.cardAddButtonClicked = undefined;
      }
    });
  }
}

export default F2FunctionScreen;
