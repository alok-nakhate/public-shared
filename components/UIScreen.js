import React, {Component, Suspense, lazy} from 'react'
import {loadScript} from '../services/loadJavaScript.js';
import file from'./defaultScreenJson';
import {xpathFactory,currencyFormatedValue}  from '../form/xPathDataStore';
import {generateQueryStr,generateQueryStrFuncationbaselayout}  from '../form/saveutils';
import { checkBrowserType } from '../form/utils';
import { getSTData } from '../services/CommonSecurity';
import {Modal} from 'antd';
import {I18NMessage} from '../i18n/errorMess/i18nMessage';
import _ from 'lodash';
import { Provider } from 'react-redux';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import store from '../services/Store';
import * as action from '../actions/action';
import request from 'superagent';
import { Switch, Route, Redirect } from 'react-router-dom';
import GlobalHelper from './GlobalHelper';
import ErrorHandler from '../form/ErrorHandler';
import $ from 'jquery';
import PropTypes from 'prop-types';
import {Layout,Col, Row ,Avatar, Tooltip,Popover, Menu,Alert,Spin,message, Button, Switch as ButtonSwitch, Tabs, Icon } from 'antd'; //Sprint 9 (Task 60): Header template testing integration spin element
import Model from '../form/Model';
import { displayMessageBox, showF2Component } from '../ModalComponent/ModalBox';
import HotKeyComponent from '../HotKeyComponent/HotKeyComponent';
//Sprint 10 (TASK 69): Added method import for NEXT button of prompt screen.
import {uiNextButtonHandler} from '../form/NextButtonHandler';
import {uiPreviousButtonHandler} from '../form/PreviousButtonHandler';
import {onLoadUtil} from '../util/onLoadUtil';
import {postFetchEventHandler} from '../customcollection/screenOnLoadEventHandler';
import {customcollectionutils} from '../customcollection/customcollectionutils';
import {redirectToAceMenus} from '../form/logoff';
import {custutils} from '../form/customutils';
import {RuleExecutionUtility} from '../util/RuleExecutionUtility';
import {setUIScreenObjToUtil}  from '../form/utils';
import Log4r from '../util/Log4r';

const ScreenMeta = lazy(() => import('./screen/ScreenMeta'));
const GridWorkList = lazy(() => import('./table/GridWorkList'));
const F2FunctionScreen = lazy(() => import('./F2FunctionScreen'));

var styles=require('./css/MainLayout/MainLayoutDefault.css');
var stylesfu =require('./css/FollowUpDefault.css');
var stylesf =require('./css/Foll1Default.css');
var customColumns;
const SubMenu = Menu.SubMenu;
const File1 = require('./demojson.json');
const { Header, Content, Sider,Footer } = Layout
const FA = require('react-fontawesome');
var nval=undefined;
var responsestatus = undefined;
var gridsavestatus = undefined;
var closepath = undefined;
var stopcount = 0;
var demoright = false;
const { TabPane } = Tabs;
const text=(
  <div style={{minHeight:'30px', maxHeight:'30px' , height:'100%',width:'250px'}}>
  <Row type="flex" justify="start">
  <Col span={14}>
  <div className={stylesf.title}>Validation  Messages</div>
  </Col>
  <Col span={4}>
  <div className={stylesf.Ava}><Avatar style={{backgroundColor: "#BDCADB",color:"black"}} size="small">03</Avatar></div>
  </Col>
  <Col span={4} className={stylesf.col}>
  <div className={stylesf.fa}><FA  name={"times"} ></FA></div>
  </Col>
  </Row>
  </div>
);
var funIconIndex = undefined;
var FunArray=[];
var a=0;
var formSubTitle="screen";
var right=0;
var left=0;
var countLeft=0;
var countRightu=0;
var countArrow=0;
var Arrow=0;
var clickedGroup = undefined;
var names1 = file.name;
var names = file.name;
var nameOfTheme;
var  backuperrjson=[];
var counter = 0;
var ObjFrPartialScrnRendr=[];
var sesHeadCount=0;
var arrayOfRightSider={};
var allScrnErrObj;
var tempJsonEditPropertyFlag = [];
var temp = false;
var data = [];
var size = 0;
var IconData;// = MyJason1.formheaderdata.formHeaderBookmarks;
var headername;// = MyJason1.formheaderdata.formTitle.mainTitle;
var holdNamess;
var holdbasicdata;
var heighttable ="";
var widthTable = "";
var namess ={};
var newArr=[];
var nval=undefined;
var optionsMapper = new Map();
var savetrigger="no";
var preData = new Map();
var prejsonData = new Map();
var preCount = 0;
var selectedCodes=[];
var Rightsidermenu=[];
var  topvalue = "";
var isfetchlinkclicked=false;
//Sprint 11: Task 83 No Hedaer Configuration Handling :Initialized to empty string because on first time it was showing string for few seconds.
var custname = "";
var custvalue = "";
//Sprint 9 (Task 60):Added variables to hold object data of header(ajax data)
var holdImageHeader={};
var holdDataWithCap={};
var holdDataWithoutCap={};
var holdAvatarData={};
var profilePictureFlag = false;
var TimeLineView = false;
var TimeLineWidth = '0px';
var timelineScreen = file.name;
var grayScaleTid='';
var currentChangedForm="";
var CardLinkFetch = false;
GlobalHelper.globlevar['timelineScreen'] =new Array();
GlobalHelper.globlevar["closeButtonCall"] = false;
var compHeadCounter=0;
GlobalHelper.globlevar['toControlUpdateErrCheck']=true;
var temlabel = "";
var firstRenderScreen;
var firstTimeCapture=false;
var shouldCloseBeCalled = false;
let containerDiv = [];
let createHybridView = false;
let createHistoryTimelineView = false;
let onlyCloseButtonViews = null;
let showOnlyCloseButton = null;
let CloseButtonpalette = [];
let TimelineHistorypalatte = [];
let defaultFunctionId = "";
let hybridCount = 0;
var screenLoadStartTime  = "";
var screenPostSaveTime = "";
var screenLoadAndPostSaveFlag = "onload";
var groupidFAVCllicked =false;
var calledFromSubmit = false;
var buttonIdOnsave = "";
var refreshOnSave = undefined;
var activeMenu = undefined;
var historyFunctionFlag = false;//Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.
let cardHeaderInfo = [];
let myPreviousScreenNamess = null;
let customHeaderFunctionIndex = null;
class UIScreen extends Component {
  constructor (props) {
    super(props)
    this.addTabScreen = [];
    this.customHeaderFunctionsToRender = new Map();
    //this.addTabindex = 0;
    this.newGlobalNames = GlobalHelper.globlevar['newFunctionNames'];
    this.assortedMapOfParent = GlobalHelper.globlevar['assortedMapOfParent'];
    this.assortedMapOfLeaf = GlobalHelper.globlevar['assortedMapOfLeaf'];
    this.jsonTemplateObjectOfBackScreen = GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'];
    this.storeF2VariablesForOpeningHistoryTimelineScreen = this.storeF2VariablesForOpeningHistoryTimelineScreen.bind(this);
    this.getF2VariablesForOpeningHistoryTimelineScreen = this.getF2VariablesForOpeningHistoryTimelineScreen.bind(this);
    this.replaceSectionalButtonsWithPaletteButtons = this.replaceSectionalButtonsWithPaletteButtons.bind(this);
    this.replaceCurrentGridDataWithPopupSectionFormdata = this.replaceCurrentGridDataWithPopupSectionFormdata.bind(this);
    this.f2CallBackFuncOnSectionalPopupClose = this.f2CallBackFuncOnSectionalPopupClose.bind(this);
    this.onReverseTab = this.onReverseTab.bind(this);
    this.onForwardTab = this.onForwardTab.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.ClearFormsData =  this.ClearFormsData.bind(this);
    this.customHelpFunctions = this.customHelpFunctions.bind(this);
    this.myFunction = this.myFunction.bind(this);
    this.setMyClass=this.setMyClass.bind(this);
    this.setMyFavClass=this.setMyFavClass.bind(this);
    this.assignErrorObj = this.assignErrorObj.bind(this);
    //this.refreshSectionLevelButton = this.refreshSectionLevelButton.bind(this);
    this.setFavoriteTooltip=this.setFavoriteTooltip.bind(this);
    this.optionsIntoArrayConverter = this.optionsIntoArrayConverter.bind(this);
    this.ChildrenHandler = this.ChildrenHandler.bind(this);
    this.fromMapToFormFieldOptions = this.fromMapToFormFieldOptions.bind(this);
    this.ChildrenHandlerFrmMap = this.ChildrenHandlerFrmMap.bind(this);
    this.getPredefinedData=this.getPredefinedData.bind(this);
    this.FunHeadercustomScreenCall = this.FunHeadercustomScreenCall.bind(this);
    this.selectedCustomFunIcon =this.selectedCustomFunIcon.bind(this);
    this.emulateOnLoad = this.emulateOnLoad.bind(this);
    // this.handleCopyText = this.handleCopyText.bind(this);
    this.customcollectionObj = new customcollectionutils();
    this.state={
      activeRight:"no",
      activeLeft:"no",
      completed:false,
      themeName:this.props.themeCode,
      tempJsonEditPropertyFlag:[],
      widths:(window.innerWidth-142),
      defaultbutton:"0",
      size:0,
      heighttable:(this.props.themeCode==="myCompact" ? window.innerHeight + 6 : window.innerHeight),
      widths:(window.innerWidth-142),
      hasError:false,
      refresh:false,
      refreshERROR:false,
      islinkclicked:false,
      isSaveClicked:false,
      isClearClicked:false,
      clearFormsubmit :false,
      topvalue:undefined,
      rowheaderdatamap :[],
      errorstatus : false,
      refetchresponsedata :false,
      timelineClicked : false,
      justRefresh : true,
      ref : false,
  	  fav : false,
  	  pin : false,
      refershCustomScreenFlag:false
    };
    this.F2FunctionScreenRef = React.createRef();
    this.isActive = true;
    this.ellipsisFlag = false;
    this.successFlag = undefined;
    this.onloadtimelinedisplay = true;
    this.clearTriggered = false;
    this.funcObjForRefresh = {};
    nameOfTheme = this.state.themeName;
    this.setClassRightUI=this.setClassRightUI.bind(this);
    this.MyFuncRight=this.MyFuncRight.bind(this);
    this.setPinUnpinIcon=this.setPinUnpinIcon.bind(this);
    this.pinUnpinDefaultFunction=this.pinUnpinDefaultFunction.bind(this);
    this.OpFunction=this.OpFunction.bind(this);
    this.changeRefreshERROR=this.changeRefreshERROR.bind(this);
    this.setClassArrow=this.setClassArrow.bind(this);
    this.updatetablecycle=this.updatetablecycle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.applyOrientation= this.applyOrientation.bind(this);
    //ADDED START
    this.setFullTableClass=this.setFullTableClass.bind(this);
    this.setHalfTableClass=this.setHalfTableClass.bind(this);
    this.setOneThirdTableClass=this.setOneThirdTableClass.bind(this);
    this.setTwoThirdTableClass=this.setTwoThirdTableClass.bind(this);
    this.alertmessage = this.alertmessage.bind(this);
    this.setSpanClass=this.setSpanClass.bind(this);
    this.setIdToTimelineIcon=this.setIdToTimelineIcon.bind(this);
    this.setGrayScaleId=this.setGrayScaleId.bind(this);
    this.setGrayScaleClass=this.setGrayScaleClass.bind(this);
    this.setTimeLineButtonClass=this.setTimeLineButtonClass.bind(this);
    this.setTwoThirdHalfTableClass=this.setTwoThirdHalfTableClass.bind(this);
	  this.setOneThirdHybridClass=this.setOneThirdHybridClass.bind(this);
    this.setTwoThirdHybridClass=this.setTwoThirdHybridClass.bind(this);
    this.collapseCards=this.collapseCards.bind(this);
    //Sprint 9 (Task 60):Added methods to load hedaer template after getting ajax data
    this.getHeaderTemplate=this.getHeaderTemplate.bind(this);
    this.getAvatars=this.getAvatars.bind(this);
	  this.returnEmptyTwoThirdContainer = this.returnEmptyTwoThirdContainer.bind(this);
    this.getGridValueForColumn = this.getGridValueForColumn.bind(this);
    //this.getHistoryLayout = this.getHistoryLayout.bind(this);
    //this.hideHistoryLayout = this.hideHistoryLayout.bind(this);
    this.uiScreenCallBackFunction = this.uiScreenCallBackFunction.bind(this);
    this.reRender=this.reRender.bind(this);
    this.timelinebutton = this.timelinebutton.bind(this);
    this.timelineScreen = this.timelineScreen.bind(this);
    this.callSave = this.callSave.bind(this);
    this.callClose = this.callClose.bind(this);
    this.checkNothingToSave=this.checkNothingToSave.bind(this);
    this.handleNullDataForCheckBox = this.handleNullDataForCheckBox.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.changeAppearance = this.changeAppearance.bind(this);
    this.hasDetailSection = false;
    var selectedRowHeaderData = GlobalHelper.selectedRowData;
    let preColumnHeader =   GlobalHelper.preColumnData ;
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
    this.fieldsChangedForRuleExecution =[];
    this.throwValidationRulesArray= new Array();
    // class variables created for rule execution - end

    this.halfsectionheightFlag = false;//Sprint 35 - 50*50 section height if section has table with pagination
    this.halfsectionMapFlag = true;

    GlobalHelper.globlevar['ScreenLayoutNameChk'] = true;
    //Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
    if(GlobalHelper.globlevar['promptmode'] != null && GlobalHelper.globlevar['promptmode'] === "prompt"){
      GlobalHelper.globlevar['ClipSearchRoot'] = "prompt";
      GlobalHelper.globlevar['promptmode'] = null;
      GlobalHelper.globlevar['promptmode'] = "NO_prompt";
    }else if(GlobalHelper.globlevar['ClipSearchRoot'] = "TableContainer"){
      GlobalHelper.globlevar['ClipSearchRoot'] = "UIScreen";
    }else{
      GlobalHelper.globlevar['ClipSearchRoot'] = "UIScreen";
    }//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.

    GlobalHelper.globlevar['UIScreenComponentRenderFlag'] = true;
    //Sprint 21 - COLLECTION/LOS issue fixed to saving data for function screen.
    if(GlobalHelper.globlevar['functionMenuClicked'] = "true"){
      GlobalHelper.globlevar['functionMenuClicked'] = "false";
      GlobalHelper.globlevar['ServerSideError'] = false;
      GlobalHelper.globlevar.toggleClicked = false;
    }//Sprint 21-end

    //Sprint 11: Task 83 No Hedaer Configuration Handling :[START]  First checking wether we have header function is configured or not.

	if(GlobalHelper.globlevar["myfunleftclicked"]){
      GlobalHelper.globlevar["myfunleftclicked"] = undefined;
      cardHeaderInfo = [];
      createHistoryTimelineView = false;
      GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
      onlyCloseButtonViews = null;
      customHeaderFunctionIndex = null;
      groupidFAVCllicked = false;
    }
    if(GlobalHelper.globlevar.isHeaderConfigured){
      //Sprint 11: Task 83 No Hedaer Configuration Handling : If Header is configured get it through data and template call.
      //Sprint 9 (Task 60):[START] Added code to make objects required to render header (middle) data with captions data
       var captionData = holdDataWithCap;
       for (var key in captionData) {
       var element = {};
         if(key.length===0||key===undefined||key===null){
           element.section_header = "";
         }
         else{
           element.section_header = key;
         }
         if((captionData[key]===undefined||captionData[key]===null || captionData[key] === " ") || captionData[key].length===0){
           element.section_value = ".";
         }
         else{
          element.section_value =  captionData[key];
         }
         if(element.section_value.length!==0 && element.section_header.length!==0){
           this.state.rowheaderdatamap.push(element);
         }
       }
       //Sprint 9 (Task 60):[END]
    }
    else{
      if(preColumnHeader !==undefined && preColumnHeader !== ""){
        //Sprint 11: Task 83 No Hedaer Configuration Handling : If Header is not configured then go with row selected data values.
        holdDataWithCap={};
        holdDataWithoutCap={};
        holdDataWithCap[""]="Demo Data";
        for (var key in selectedRowHeaderData){
        //Sprint 9 (Task 60):Commented to load new ajax data into sealectedRowHeaderData
        var element = {};
        element.section_header = preColumnHeader.get(key);
        element.section_value =  selectedRowHeaderData[key] ;
        if(preColumnHeader.get(key) == "Name" || preColumnHeader.get(key) == "Applicant Name" || preColumnHeader.get(key) == "Customer Name"){
          custname = selectedRowHeaderData[key];
          holdDataWithoutCap["custname"]=custname;
        }
        if(preColumnHeader.get(key) == "Account No"){
          custvalue =  selectedRowHeaderData[key];
          holdDataWithoutCap["custvalue"]=selectedRowHeaderData[key];
        }
        //Sprint 9 (Task 60):Commented to load new ajax data into sealectedRowHeaderData
        if(key !== "internalTableData" && key !== "seq" && element.section_header !== "" && element.section_header !== undefined  && element.section_header !== undefined && element.section_value !== undefined && element.section_value !== "")
        this.state.rowheaderdatamap.push(element);
        }
      }
    }
      //Sprint 11: Task 83 No Hedaer Configuration Handling :[END]  First checking wether we have header function is configured or not.

    var sMyString = '<a id="a"><b id="b">hey!</b></a>';
    var oParser = new DOMParser();
    var oDOM = oParser.parseFromString(sMyString, "application/xml");
    // print the name of the root element or error message
     if(GlobalHelper.globlevar.responsestatus == "clear"){
        GlobalHelper.globlevar.responsestatus = undefined;
        responsestatus = undefined;
     }
     if(GlobalHelper.globlevar['clipsearchcloseprejson'] == undefined){
       var informationofPrejson = {};
       informationofPrejson['holdDataWithCap'] = this.state.rowheaderdatamap;
       informationofPrejson['holdDataWithoutCap'] =  holdDataWithoutCap;
       informationofPrejson['isHeaderConfigured'] = GlobalHelper.globlevar.isHeaderConfigured;
       informationofPrejson['jsonholdDataWithCap'] = holdDataWithCap;
       informationofPrejson['GlobalHelperdefaultfunction']  = GlobalHelper.defaultfunction ;
       informationofPrejson['headername'] = headername;
       informationofPrejson['formSubTitle'] = formSubTitle;
       informationofPrejson['rightGroupid'] = right;
       informationofPrejson['removeHeaderFlag'] = GlobalHelper.globlevar["removeHeaderFlag"];
       informationofPrejson['menuFunctionFlag'] = GlobalHelper.globlevar['menuFunctionFlag'];
       this.formSubTitleForCloseClipsearch = undefined;
       GlobalHelper.globlevar['informationofPrejson'] = informationofPrejson;
     }
    // onload screen envent.
    new postFetchEventHandler().fetchEvent();
    GlobalHelper.globlevar['addrow'] = "false";
 this.clearScreenHeaderData = this.clearScreenHeaderData.bind(this);
    setUIScreenObjToUtil(this);
  }
  clearScreenHeaderData(){
      try{
        holdDataWithCap={};
        holdDataWithoutCap={};
        GlobalHelper.globlevar.UIScreenLayoutJson.names.headerNames.screendata = [];
        this.props.outnames.headerNames.screendata=[];
      }catch(e){console.error(e)}
  }
  storeF2VariablesForOpeningHistoryTimelineScreen() {
    this.newGlobalNames = GlobalHelper.globlevar['newFunctionNames'];
    this.assortedMapOfParent = GlobalHelper.globlevar['assortedMapOfParent'];
    this.assortedMapOfLeaf = GlobalHelper.globlevar['assortedMapOfLeaf'];
    this.jsonTemplateObjectOfBackScreen = GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'];
    myPreviousScreenNamess = namess;
  }

  getF2VariablesForOpeningHistoryTimelineScreen() {
    GlobalHelper.globlevar['newFunctionNames'] = this.newGlobalNames;
    GlobalHelper.globlevar['assortedMapOfParent'] = this.assortedMapOfParent;
    GlobalHelper.globlevar['assortedMapOfLeaf'] = this.assortedMapOfLeaf;
    GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = this.jsonTemplateObjectOfBackScreen;
    namess = myPreviousScreenNamess;
  }


  reRender(){
    this.setState({refershCustomScreenFlag:true},()=>{
      Log4r.log("refresh custom screen.........");
    })
  }
  // handleCopyText(inputVal){
  //   new Promise(()=>
  //   this.CopyText(inputVal))
  // }
  // async CopyText(value){
  // window.focus();
  // await navigator.clipboard.writeText(value);
  // }

  handleBlur(sectionID,fieldId,rowKey){
    if(sectionID==fieldId){ // clause added to identify handleBlur call from TableWidget while next/previous button is clicked OR new row is added
      this.fieldsChangedForRuleExecution=[];
      this.isOnload=true;
    }
    else{
      let fieldChanged = sectionID+"."+fieldId;// make sure this is of the form sectionId.fieldId
      let rowAffected = "";
      if(rowKey!=null && rowKey!=undefined){
        rowAffected = rowKey; // this represents actual row index in datasource array
      }
      let objectForFieldAffected = {};
      objectForFieldAffected.fieldId = fieldChanged;
      objectForFieldAffected.rowKey = rowAffected;
      this.fieldsChangedForRuleExecution.push(objectForFieldAffected);
    }
    this.setState({justRefresh:!this.state.justRefresh},()=>{
    if(GlobalHelper.globlevar.cardAddButtonClicked){
    GlobalHelper.globlevar.cardAddButtonClicked = undefined;
  }
  });
}
  //Sprint 9 (Task 60):[START] Method to get avatar logos and header template block depending on what data is coming from ajax call
  getAvatars(info){
    if(holdAvatarData!==null || Object.keys(holdAvatarData).length!==0){
      return(
        <div className={styles.DataBlock2}>
          {
            Object.keys(holdAvatarData).map(function(post,i)
            {
              return(
                  <Popover placement="topLeft"  content={<div style={{fontFamily:"Montserrat",fontSize:"11px",fontWeight:"600"}}>{post}</div>}><Avatar className={styles.customAvatar1}  shape="square" size="large">{holdAvatarData[post]}</Avatar></Popover>
                )
            })
          }
        </div>
      )
    }
    else{
      return(
      null
      )
    }
  }
  collapseCards(value){
    GlobalHelper.globlevar.cardCollapseClicked=false;
    for (var i = 0; i < namess.screendata.length; i++){
      if(namess.screendata[i].sessionID===value){
        if(!GlobalHelper.globlevar.CurrentlyClosedCard.includes(namess.screendata[i].sessionID)){
          GlobalHelper.globlevar.CurrentlyClosedCard.push(namess.screendata[i].sessionID);
        }
        else{
          GlobalHelper.globlevar.CurrentlyClosedCard.unshift(namess.screendata[i].sessionID);
        }
        namess.screendata[i]['hidden']="true";
        this.forceUpdate();
        break;
      }
    }
  }

  setSpanClass(id){
    if(id==="TIMEL"){
      return styles.timeLineIcon;
    }
    else{
      return styles.normalRightIcon;
    }
  }

  setIdToTimelineIcon(id){
    if(id==="TIMEL"){
      if(TimeLineView){
        return styles.timeId;
      }
      else{
        return styles.normalId;
      }
    }
    else{
      return styles.normalId;
    }
  }

  setTimeLineButtonClass(id){
    try{
    if(grayScaleTid.length===0){
      grayScaleTid=id;
    }
    if(grayScaleTid===id){
      return styles.timelineSelectiveButtons_selected;
    }
    else{
      return styles.timelineSelectiveButtons;
    }
  }
  catch(e){Log4r.log(e)}
  return "";
  }

  setGrayScaleId(id){
    try{
    grayScaleTid=id;
    this.forceUpdate();
    var w = $('#'+id).parent();
    Log4r.log("TOP WAR",$('#'+id).position().top,);
    w.scrollTop(0);
    w.animate({scrollTop:$('#'+id).position().top}, 500)
  }
  catch(e){Log4r.log(e)}
  }

  setGrayScaleClass(id){
     try{
    if(grayScaleTid.length===0){
      grayScaleTid=id;
    }
    if(id===grayScaleTid){
      return styles.timelineBlocks;
    }
    else{
      return styles.grayscaleTimelineBlocks;
    }
     }
  catch(e){Log4r.log(e)}
  return "";
  }

  checkUserProfilePicture(profileImgUrl){
    if(profileImgUrl != null){
      Log4r.log("picture............"+profileImgUrl);
      return  profilePictureFlag = false;
     /* $.ajax({
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

  getHeaderTemplate(){
    const info=File1.dataprofile;
    
    var imgpath = window.location.origin;
    var x = window.location.pathname.split("/"); // /react/UIScreen
    Log4r.log("x " , x);
    var imgdisplaypath = x.slice(0, x.length - 1).join("/");
    Log4r.log("imgdisplaypath " , imgdisplaypath);
    if(holdDataWithCap =={} || holdDataWithCap ===null || holdDataWithCap ===undefined || Object.keys(holdDataWithCap).length===0){
      let custname1 = custname.substring(0,custname.indexOf(" "));

      let colr;
      if (GlobalHelper.globlevar.colorCodeForCircleInHeader !== undefined) {
        colr = GlobalHelper.globlevar.colorCodeForCircleInHeader;
      }
      else{
        let colr = '#F5F7F9';
      }
      return(
        <div className={styles.HeadDivWrap} style={{width:"100%",display:"inline-block",height:"100%",position:"relative"}}>
        <div className={styles.HeadIdDiv} style={{width:"fit-content",height:"100%",display:"inline-block",minWidth:240,position:"relative"}}>
        {/* {
          this.checkUserProfilePicture(imgdisplaypath + "/images/"+ custname1 +".jpg")
          ?<Avatar size="large" src={imgdisplaypath + "/images/"+ custname1 +".jpg"} className={styles.customImage} />
          :<Avatar size="large" className={styles.no_customImage}> {custname1[0]} </Avatar>
        } */}
        {/* <div className={styles.HrLine}></div> */}
        <div className={styles.customUserData}>
        <p className={styles.customTitle}>{custname1}
        <Popover placement="bottomLeft" content={custname1}>{custname1}</Popover>
        </p>
        <p className={styles.customInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'left' : 'none')}}>{custvalue}</p>
        </div>
        </div>
        <div  id={'colorCodeBlock'} style={{width:"2%",height:"100%",display:(colr == undefined ? "none" : "inline-block" ),minWidth:40,position:"relative"}}>
        <FA name={"fa-circle"} className={styles.colorCircle} style={{background:colr}}/>
        </div>
        <div className={styles.HeadDataDiv} style={{height:"100%",display:"inline-block",position:"absolute",float:"right"}}>
        <div className={styles.HiddenDivLeft}><FA name={"fas fa-angle-left"} className={styles.leftScrollButton} aria-label="Left-Scroll Button"/></div>
        <Spin spinning={this.state.loading}>
        <div className={styles.DataBlock1}>
        <h3>LOADING DATA..</h3>
        <div className={styles.DataBlock2}>
        </div>
        </div>
        </Spin>
        <div className={styles.HiddenDivRight}><FA name={"fas fa-angle-right"} className={styles.rightScrollButton} aria-label="Right-Scroll Button"/></div>
        </div>
        </div>
      );
    }
    else{
      let colr;
      var custname1="";
      if(holdDataWithoutCap != null){
        if(holdDataWithoutCap.Name != null){
          custname1=holdDataWithoutCap.Name;
        }else if(holdDataWithoutCap.custname != null){
          custname1 = holdDataWithoutCap.custname;
          custname1 = custname1.split(" ")[1];
        }else{
          let keyArr = Object.keys(holdDataWithoutCap);
          if(keyArr != null && keyArr.lenght != 0){
            custname1=holdDataWithoutCap[keyArr[0]];
            if(custname1 != null){
              custname1 = custname1.split(" ")[1];
            }
          }
        }
      }
      if (GlobalHelper.globlevar.colorCodeForCircleInHeader !== undefined) {
        colr = GlobalHelper.globlevar.colorCodeForCircleInHeader;
      }
      else{
        let colr = '#F5F7F9';
      }

      //Sprint 37 - Task - MultiBrowser Compatibity and Testing - changes for IE
      let classMainData;
      var browserMap = checkBrowserType();
      var isIE = /*@cc_on!@*/false || !!document.documentMode;
      Log4r.log("jhsagdjhgsad.....",browserMap);
      if(navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) || (browserMap.has("isIE") && browserMap.get("isIE") === true) || isIE === true){
        classMainData = styles.MainDataforIE;
      }else{
        Log4r.log("saydkjsahd.....",browserMap.get("isIE"),isIE);
        classMainData = styles.MainData;
      }//END - Sprint 37 - Task - MultiBrowser Compatibity and Testing - changes for IE

      return(
            <div className={styles.HeadDivWrap} style={{width:"100%",display:"inline-block",height:"100%",position:"relative"}}>
            <div className={styles.HeadIdDiv} style={{width:"fit-content",height:"100%",display:"inline-block",minWidth:240,position:"relative"}}>
            {/* {
              this.checkUserProfilePicture(imgdisplaypath + "/images/"+ custname1 +".jpg")
              ?<Avatar size="large" src={imgdisplaypath + "/images/"+ custname1 +".jpg"} className={styles.customImage} />
              :<Avatar size="large" className={styles.no_customImage}> { custname1 ? custname1[0] :""} </Avatar>
            } */}
            {/* <div className={styles.HrLine}></div> */}
            <div className={styles.customUserData}>
              {
                Object.keys(holdDataWithoutCap).map((item,key)=>{
                  if(key===0){
                    if(holdDataWithoutCap[item].length!==0){
                      return(
                        <p className={styles.customTitle} style={{width:'fit-content' , textOverflow: 'ellipsis'}}>
                        <Popover placement="topLeft" content={holdDataWithoutCap[item]}>{holdDataWithoutCap[item]}</Popover>
                        </p>
                      )
                    }
                    else{
                      return(
                        <p className={styles.customTitle}></p>
                      )
                    }
                  }
                  else{
                    if(holdDataWithoutCap[item].length!==0){
                      return(
                        <p className={styles.customInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'left' : 'none')}}>{holdDataWithoutCap[item]}</p>
                      )
                    }
                    else{
                      return(
                        <p className={styles.customInfo}></p>
                      )
                    }
                  }
                })
              }
            </div>
            </div>
            <div id={'colorCodeBlock'} style={{width:"2%",height:"100%",display:(colr == undefined ? "none" : "inline-block" ),minWidth:40,position:"relative"}}>
            <FA name={"fa-circle"} className={styles.colorCircle} style={{background:colr}}/>
            </div>
            <div className={styles.HeadDataDiv} style={{height:"100%",display:"inline-block",position:"absolute",float:"right"}}>
            <div className={styles.HiddenDivLeft}><FA name={"fas fa-angle-left"} className={styles.leftScrollButton} aria-label="Left-Scroll Button"/></div>
            <div className={styles.DataBlock1}>
            {
             this.state.rowheaderdatamap.map((post,i)=>{
                if(post.section_header.length!==0 || post.section_value.length!==0){
                try{
                  if(this.state.rowheaderdatamap[i+1]){
                    if(this.props.themeCode==="myCompact" && (this.state.rowheaderdatamap[i+1].section_header!==undefined || this.state.rowheaderdatamap[i+1].section_value!==undefined )){
                        if(compHeadCounter!==i){
                          if(this.state.rowheaderdatamap[i].section_value === "." && this.state.rowheaderdatamap[i+1].section_value === "."){
                          compHeadCounter=i+1;
                          return(
                            <div className={classMainData}>
                              <div className={styles.MainDataTitle}>
                              {this.state.rowheaderdatamap[i].section_header}
                              </div>
                              <div className={styles.MainDataInfo} aria-label={this.state.rowheaderdatamap[i].section_header}>
                                {this.state.rowheaderdatamap[i].section_value}
                              </div>
                              <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i+1].section_header}
                              </div>
                              <div className={styles.MainDataInfo} aria-label={this.state.rowheaderdatamap[i+1].section_header}>
                                {this.state.rowheaderdatamap[i+1].section_value}
                              </div>
                            </div>
                            )
                          }
                          else if (this.state.rowheaderdatamap[i].section_value === "." && this.state.rowheaderdatamap[i+1].section_value !== ".") {
                            compHeadCounter=i+1;
                            return(
                              <div className={classMainData}>
                                <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i].section_header}
                                </div>
                                <div className={styles.MainDataInfo} aria-label={this.state.rowheaderdatamap[i].section_header}>
                                  {this.state.rowheaderdatamap[i].section_value}
                                </div>
                                <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i+1].section_header}
                                </div>
                                <div className={styles.MainDataInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'right' : 'left')}} aria-label={this.state.rowheaderdatamap[i+1].section_header}>
                                {this.state.rowheaderdatamap[i+1].section_value}
                                {/* <FA onClick={this.handleCopyText.bind(this,this.state.rowheaderdatamap[i+1].section_value)} name={"fas fa-copy"}/> */}
                                </div>
                              </div>
                              )

                          }
                          else if (this.state.rowheaderdatamap[i].section_value !== "." && this.state.rowheaderdatamap[i+1].section_value === ".") {
                            compHeadCounter=i+1;
                            return(
                              <div className={classMainData}>
                                <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i].section_header}
                                </div>
                                <div className={styles.MainDataInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'right' : 'left')}} aria-label={this.state.rowheaderdatamap[i].section_header}>
                                {this.state.rowheaderdatamap[i].section_value}
                                {/* <FA onClick={this.handleCopyText.bind(this,this.state.rowheaderdatamap[i].section_value)} name={"fas fa-copy"}/> */}
                                </div>
                                <div className={styles.MainDataTitle}>
                                  {this.state.rowheaderdatamap[i+1].section_header}
                                </div>
                                <div className={styles.MainDataInfo} aria-label={this.state.rowheaderdatamap[i+1].section_header}>
                                  {this.state.rowheaderdatamap[i+1].section_value}
                                </div>
                              </div>
                              )
                          }
                          else{
                            compHeadCounter=i+1;
                            return(
                              <div className={classMainData}>
                                <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i].section_header}
                                </div>
                                <div className={styles.MainDataInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'right' : 'left')}} aria-label={this.state.rowheaderdatamap[i].section_header}>
                                {this.state.rowheaderdatamap[i].section_value}
                                {/* <FA onClick={this.handleCopyText.bind(this,this.state.rowheaderdatamap[i].section_value)} name={"fas fa-copy"}/> */}
                                </div>
                                <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i+1].section_header}
                                </div>
                                <div className={styles.MainDataInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'right' : 'left')}} aria-label={this.state.rowheaderdatamap[i+1].section_header}>
                                {this.state.rowheaderdatamap[i+1].section_value}
                                {/* <FA onClick={this.handleCopyText.bind(this,this.state.rowheaderdatamap[i+1].section_value)} name={"fas fa-copy"}/> */}
                                </div>
                              </div>
                            )
                          }
                        }
                        else{
                          Log4r.log("Last Print !",this.state.rowheaderdatamap.length-1,i,compHeadCounter);
                          if(this.state.rowheaderdatamap.length-1===i+1){
                            if(this.state.rowheaderdatamap[i+1].section_value === "."){
                            return(
                              <div className={classMainData}>
                                <div className={styles.MainDataTitle}>
                                {this.state.rowheaderdatamap[i+1].section_header}
                                </div>
                                <div className={styles.MainDataInfo}>
                                  {this.state.rowheaderdatamap[i+1].section_value}
                                </div>
                              </div>
                              )
                            }
                            else{
                              return(
                                <div className={classMainData} style={{top: '-25px',height: '30px'}}>
                                  <div className={styles.MainDataTitle}>
                                  {this.state.rowheaderdatamap[i+1].section_header}
                                  </div>
                                  <div className={styles.MainDataInfo} style={{textAlign:(GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? 'right' : 'left')}}>
                                  {this.state.rowheaderdatamap[i+1].section_value}
                                  {/* <FA onClick={this.handleCopyText.bind(this,this.state.rowheaderdatamap[i+1].section_value)} name={"fas fa-copy"}/> */}
                                  </div>
                                </div>
                              )
                            }
                          }
                          else{
                            Log4r.log("Already Printed !");
                          }
                        }
                      }
                      else{
                        if(this.state.rowheaderdatamap[i].section_value === "."){
                        return(
                          <div className={classMainData}>
                            <div className={styles.MainDataTitle}>
                            {this.state.rowheaderdatamap[i].section_header}
                            </div>
                            <div className={styles.MainDataInfo}>
                            {this.state.rowheaderdatamap[i].section_value}
                            </div>
                          </div>
                          )
                        }
                        return(
                          <div className={classMainData}>
                            <div className={styles.MainDataTitle}>
                            {this.state.rowheaderdatamap[i].section_header}
                            </div>
                            <div className={styles.MainDataInfo}>
                            {this.state.rowheaderdatamap[i].section_value}
                            {/* <FA onClick={this.handleCopyText.bind(this,this.state.rowheaderdatamap[i].section_value)} name={"fas fa-copy"}/> */}
                            </div>
                          </div>
                        )
                      }
                  }

                  } catch (e) {
                      Log4r.error(e);
                  }
                }
                else{
                  return null;
                }
              }
            )
            }
            {this.getAvatars(info)}
            </div>
            <div className={styles.HiddenDivRight}><FA name={"fas fa-angle-right"} className={styles.rightScrollButton} aria-label={"Right-Scroll Button"}/></div>
            </div>
            </div>
        );
    }
    }
  //Sprint 9 (Task 60):[END]


    getGridValueForColumn(formData,columnId,rowIndex){
      for (let i = 0; i < formData.DataSource.length; i++){
        if(formData.DataSource[i].key == rowIndex){
          for (let j = 0; j < Object.keys(formData.DataSource[i]).length; j++){
            if(Object.keys(formData.DataSource[i])[j]===columnId){
              return formData.DataSource[i][Object.keys(formData.DataSource[i])[j]];
            }
          }
        }
      }
    }



    componentWillUnmount()
    {
      ErrorHandler.tempfunc(ErrorHandler.getTotalErrJson());
      stopcount = 0;
    }
    componentWillMount(){
      Log4r.log("inside component will mount");
    }

    changeRefreshERROR(obj)
    {
      if(obj)
      {
        this.addRowtoGrid = obj;
        //this.callSave();
      }
      var rfsh = this.state.refreshERROR;
      this.setState({
        refreshERROR : !rfsh
      })
    }

updatetablecycle()
{
  GlobalHelper.consoleMessage("updatetablecycle ", this);
  this.setState({flag : true})
}

  getPredefinedData(fileData)
  {
    if(fileData.screendata !== undefined)
    {
    for (var i = 0; i < fileData.screendata.length; i++)
    {
      for (var j = 0; j < fileData.screendata[i].formData.length; j++)
      {
        var KeyArray=Object.keys(fileData.screendata[i].formData[j]);
        for (var k = 0; k < KeyArray.length; k++)
        {
          var customData = fileData.screendata[i].formData[j][KeyArray[k]].data;
          if(customData !==undefined)
          {
                  if(customData.length !==0)
                  {
                    preData.set(KeyArray[k],customData);
                  }
          }
        }
      }
    }
   }
  }
//****************************************************************************************

//***********************************************

//Sprint 36 - Task - Add to Grid functionality fetch newly added data...
 setDetailsSectionDataTemp(detailsectionToPerform){
   var tempstrdt = GlobalHelper.globlevar['tableLinkRecord']['addThroughSummGridmap'];
   var tempstrdtmap= new Map();
   var pairs=tempstrdt.split('&');
   for(var i=0, total=pairs.length; i<total; i++) {
     var pair=pairs[i].trim().split('=');
     //Log4r.log("jhskjhskj....",pair);
     if(pair != null && pair[1] != null){
       tempstrdtmap.set(pair[0],[pair[1]]);
     }
   }
   //Log4r.log("jhkhskfhs.....",tempstrdtmap);

   let sectionIdToDataOperation = new Model().getLeaf(detailsectionToPerform);
   //Log4r.log("jahjahkjhsjd......",sectionIdToDataOperation);
   if(sectionIdToDataOperation != null && sectionIdToDataOperation.length != 0){
       for(var k=0;k<sectionIdToDataOperation.length;k++){
         let optrSectId = Object.keys(sectionIdToDataOperation[k])[0];
         //Log4r.log("jhskjfhsjfh,.........",optrSectId);
         namess.screendata.map((sectobj,llk)=>{
           if(sectobj.sessionID === optrSectId){
             Log4r.log("hkfhsdikjhf........",sectobj);
             sectobj.uiSchema[0].children.map((childitm,ls)=>{
               //Log4r.log("sfhskjhfjsdhf.......",childitm);
               if(childitm.children.xPath !=null && tempstrdtmap != null && tempstrdtmap.has(childitm.children.xPath)){
                 //Log4r.log("ygasgsjhgfhs..........",tempstrdtmap.has(childitm.children.xPath));
                 //Log4r.log("gjhgsjhfgs........",sectobj.formData[0][childitm.children.fieldPath]);
                 sectobj.formData[0][childitm.children.fieldPath].data = tempstrdtmap.get(childitm.children.xPath);
                 if(sectobj.formData[0][childitm.children.fieldPath].desc != null){
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
 get_refreshOnSave_of_defaultFunction(){
   //Log4r.log("hgasjakshakjsd.......",Rightsidermenu,GlobalHelper.defaultfunction,defaultFunctionId);
   if(GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] != null ){refreshOnSave =undefined;}
   if(Rightsidermenu != null && GlobalHelper.defaultfunction != null){
     if(GlobalHelper.defaultfunction[0] != null){
       Rightsidermenu.map((item,index)=>{   // NOSONAR: javascript:S2201
         if(item != null && item.content != null){
          let grpFuncRefreshOnSave = item.content.filter(val=>val.id === GlobalHelper.defaultfunction[0])[0];
             //Log4r.log("hgsahgjhdgsadj.........",grpFuncRefreshOnSave);
             if(grpFuncRefreshOnSave != null && grpFuncRefreshOnSave['refreshOnSave'] != null){
               //Log4r.log("shfdkjhsfdk...........",grpFuncRefreshOnSave['refreshOnSave']);
               if(grpFuncRefreshOnSave['refreshOnSave'] === "Y"){
                 //Log4r.log("jhsdgjas.......",typeof(grpFuncRefreshOnSave.refreshOnSave));
                 refreshOnSave = true;
               }
             }
         }
       })
     }
   }
 }//END-Sprint 38 - Task 35 - Issue-1.L60-566-Dropdown value getting clear on click of Save.
 assignErrorObj()
 {
   Log4r.log("asdkgh...",this.props.outnames.data);
   ErrorHandler.setBackupErrorJsonToErrJsn(this.props.outnames.data[0].name['errorObjectForScreen']);
   Log4r.log("names==",names);
 }
  componentDidUpdate(prevProps, prevState)
  {
    var dataElement = $("[class*=labelcolon]");
    for (let i = 0; i < dataElement.length; i++) {
      if ($(dataElement[i]).prop("scrollWidth") > $(dataElement[i]).prop("offsetWidth")) {
        $(dataElement[i]).attr("title", $(dataElement[i]).html());
      }
    }

    if(GlobalHelper.globlevar.linkclicked == true && this.props.outnames.data[0].name['addToGridSectionalLinkClicked'] === true) {
      let aSectionalPopupScreen = false;
      let sectionalPopupOutnames =  JSON.parse(JSON.stringify(this.props.outnames));
      let dependantSection = [];
      delete this.props.outnames.data[0].name['addToGridSectionalLinkClicked'];
      sectionalPopupOutnames.parentGridXpathAndsessionID = null;
      sectionalPopupOutnames.parentGridXpathAndsessionID = this.props.outnames.parentGridXpathAndsessionID;

      for (let n = 0; n < this.props.outnames.data[0].name.screendata.length; n++) {
            Log4r.log("SECTION ", this.props.outnames.data[0].name.screendata[n],n);
            let dependantSecionId = undefined;
            if(this.props.outnames.data[0].name['addToGridSectionalLinkData'] !== undefined){
              dependantSecionId = this.props.outnames.data[0].name['addToGridSectionalLinkData']
              if(this.props.outnames.data[0].name.screendata[n].formData[0][this.props.outnames.data[0].name.screendata[n].sessionID] != null) {
                if(this.props.outnames.data[0].name.screendata[n].formData[0][this.props.outnames.data[0].name.screendata[n].sessionID].data.detailsectionid === dependantSecionId ){
                  this.props.outnames.data[0].name['whichSectionClicked'] = this.props.outnames.data[0].name.screendata[n].sessionID;
                }
              }
            }
            //delete this.props.outnames.data[0].name['addToGridSectionalLinkData'];
            let allDependantSections = undefined;
            if(dependantSecionId !== undefined){
              allDependantSections = new Model().getLeafNodesForId(dependantSecionId);
            }
            let arrayKeys = [];
            if(allDependantSections !== undefined){
              arrayKeys = Object.keys(allDependantSections);
            }

            if(arrayKeys.length > 0){
              for (let o = 0; o < arrayKeys.length; o++) {
                let requiredSection = this.props.outnames.data[0].name.screendata.filter(item => item.sessionID === arrayKeys[o])[0];
                if(requiredSection != undefined){
                  aSectionalPopupScreen = true;
                  if(dependantSection.length === 0){
                    dependantSection.push(requiredSection.sessionID);
                  } else {
                    if(dependantSection.indexOf(requiredSection.sessionID) === -1){
                      dependantSection.push(requiredSection.sessionID);
                    }
                  }
                }
              }
            }
        }

      if(aSectionalPopupScreen === true) {
        for (let i = 0; i < sectionalPopupOutnames.data[0].name.screendata.length; i++) {
            sectionalPopupOutnames.data[0].name.screendata[i].layoutSize = "full";

            for (let k = 0; k < sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children.length; k++) {
                 if(sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children[k].children.widget==="table" && sectionalPopupOutnames.data[0].name.screendata[i].formData[0][sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children[k].children.fieldPath].data.defaultCardView==="true")
                 {
                   sectionalPopupOutnames.data[0].name.screendata[i].formData[0][sectionalPopupOutnames.data[0].name.screendata[i].uiSchema[0].children[k].children.fieldPath].data.defaultCardView ="false";
                 }
              }

            if(sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection ){
              if(dependantSection.length !== 0) {
                for (let q = 0; q < dependantSection.length; q++) {
                  if (sectionalPopupOutnames.data[0].name.screendata[i].sessionID === dependantSection[q]) {
                    let checkSomeSection = names.screendata.filter(item=>item.sessionID === sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection)[0];
                      if(checkSomeSection.formData[0][sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection] != null) {
                        if(checkSomeSection.formData[0][sectionalPopupOutnames.data[0].name.screendata[i].addRowtoGridSection].data.detailsectionid === names.addToGridSectionalLinkData) {
                              sectionalPopupOutnames.data[0].name.screendata[i].hidden = "false";
                          } else {
                              sectionalPopupOutnames.data[0].name.screendata[i].hidden = "true";
                          }
                        }
                      break;
                    } else {
                      sectionalPopupOutnames.data[0].name.screendata[i].hidden = "true";
                 }
              }
            }
          } else {
                sectionalPopupOutnames.data[0].name.screendata[i].hidden = "true";
            }
        }

        this.replaceSectionalButtonsWithPaletteButtons(sectionalPopupOutnames.data[0].name, dependantSection);

        sectionalPopupOutnames.data[0].name.parentGridXpathAndsessionID = null;
        sectionalPopupOutnames.data[0].name.parentGridXpathAndsessionID = this.props.outnames.data[0].name.parentGridXpathAndsessionID;
        Log4r.log("FINAL PROPS OPTIMUS : ",sectionalPopupOutnames);
        let isMultiLevel = false;
        showF2Component(undefined, sectionalPopupOutnames, headername, formSubTitle, "myCompact", this.f2CallBackFuncOnSectionalPopupClose, this.props.outnames, "",this.assignErrorObj, isMultiLevel, true);
      }
    }

	  //Sprint 38 - Task 35 - Issue-1.L60-566-Dropdown value getting clear on click of Save.
    this.get_refreshOnSave_of_defaultFunction();
    //Log4r.log("ahdkjahgdkjasgdjasd.........",refreshOnSave);
	  //END-Sprint 38 - Task 35 - Issue-1.L60-566-Dropdown value getting clear on click of Save.


    if (this.clearTriggered) {
      this.clearTriggered = false;
    }
    if (this.addRowtoGrid != undefined && this.addRowtoGrid != null) {
      //this.addRowtoGrid = undefined;
    }
    if((firstTimeCapture && GlobalHelper.globlevar['ServerSideError'] !==true ) || GlobalHelper.globlevar['firstRenderScreen'])
    {
      GlobalHelper.globlevar['firstRenderScreen'] = false;
      firstTimeCapture=false;
      let afterFirstRenderScreen = JSON.parse(JSON.stringify(namess));
      if(namess.parentGridXpathAndsessionID){
        afterFirstRenderScreen.parentGridXpathAndsessionID = null;
        afterFirstRenderScreen.parentGridXpathAndsessionID = namess.parentGridXpathAndsessionID;
      }
      firstRenderScreen = Object.assign({}, afterFirstRenderScreen);

      Log4r.log("FIRST TIME SAVED DATA",firstRenderScreen);
    }

    //Sprint 36 - Task - Add to Grid functionality fetch newly added data...
    if(GlobalHelper.globlevar['NoRowDataForDetailSection'] === "true"){
      GlobalHelper.globlevar['NoRowDataForDetailSection'] = undefined;
      //Log4r.log("gjdgjasdjhgd.......",namess,GlobalHelper.globlevar['tableLinkRecord']);
      //Log4r.log("hgdjhgjhgdjhg.........",GlobalHelper.globlevar['sectionIdOfTableLinkClicked']);
      let detailsectionToPerform = namess.screendata.filter(item => item.sessionID === GlobalHelper.globlevar['sectionIdOfTableLinkClicked'])[0].formData[0][GlobalHelper.globlevar['sectionIdOfTableLinkClicked']].data.detailsectionid;
      //Log4r.log("gjhgdjhsagd,.......",detailsectionToPerform);
      if(detailsectionToPerform != null){
        this.setDetailsSectionDataTemp(detailsectionToPerform);
      }
    }//END-Sprint 36 - Task - Add to Grid functionality fetch newly added data...

    //Log4r.log("Inside componentDidUpdate of uiScreen....savetrigger==>",savetrigger);
    //Log4r.log("this.state.isSaveClicked",this.state.isSaveClicked);

    /*let flagTab; // sultans code from here
    holdNamess.screendata.map((item,index)=>{
    Log4r.log("holdnmsess...",item.uiSchema[0].children[0].children.widget);
    if(item.uiSchema[0].children[0].children.widget==="tab"){
      Log4r.log("sdasf...");
      flagTab="tab";
    }
  })

  if(flagTab==="tab")
  {
     holdNamess=GlobalHelper.globlevar.screenWithTab;
  } */  // sultans code till here
  Log4r.log("!@#!#21jjjjj");
  this.handleAddCalled = false;
 if(savetrigger == "yes")
 {

  var savenamesjson = namess;
   //gridsavestatus = undefined;
   var flag=false,checkDepend=false;
//**************************************************************************************
   Log4r.log("holdNamess==sdfnb///...",holdNamess);

   var TotalErrJson = ErrorHandler.getTotalErrJson();
   for (var i = 0; i < holdNamess.screendata.length; i++)
   {
     if (holdNamess.screendata[i].sectionConditionallyHiddenFlag != true)
     {
       var arrTableWidg=holdNamess.screendata[i].uiSchema[0].children.filter(item => "table" === item.children.widget );
       for (var j = 0; j < arrTableWidg.length; j++)
       {
         //Log4r.log("arrTableWidg",arrTableWidg);
         var tempp=holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.isrowSelectionMandatory;
         if (tempp === "true")
         {
           checkDepend=true;
           //Log4r.log(holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.DataSource);
           var num=holdNamess.screendata[i].formData[0][arrTableWidg[j].children.fieldPath].data.DataSource.filter(item => "Y" === item.isRowSelected );
           Log4r.log("num===>",num);
           if (num.length == 0)
           {
             flag=true;
             for(var k=0; k<TotalErrJson.length ;k++)
             {
               //Log4r.log(TotalErrJson[k][holdNamess.screendata[i].sessionID]);
               if (TotalErrJson[k][holdNamess.screendata[i].sessionID]) {
                 //Log4r.log(TotalErrJson[k][holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]);
                 if (TotalErrJson[k][holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]) {
                   // if available..
                 }else {
                   //if not available..
                   var arrMsg=[];
                   arrMsg[arrMsg.length]=I18NMessage('app.gridRowRequired');
                   TotalErrJson[k][holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]=arrMsg;
                 }
               }
             }

           }else {
             flag=false;
             for(var k=0; k<TotalErrJson.length ;k++)
             {
               //Log4r.log(TotalErrJson[k][holdNamess.screendata[i].sessionID]);
               if (TotalErrJson[k][holdNamess.screendata[i].sessionID]) {
                 //Log4r.log(TotalErrJson[k][holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]);
                 if (TotalErrJson[k][holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]) {
                   // if available..
                   //Log4r.log("assigning undefined..");
                   TotalErrJson[k][holdNamess.screendata[i].sessionID][arrTableWidg[j].children.fieldPath]=undefined;
                 }else {
                   //if not available..

                 }
               }
             }

           }
         }
       }
     }
   }
   ErrorHandler.setTotalErrJson(TotalErrJson);
//**************************************************************************************
   savetrigger = "no";
   topvalue = "yes";
   if ( GlobalHelper.globlevar['linkedFunctionId'] !==  undefined && GlobalHelper.globlevar['linkedFunctionId'] !== null){
    GlobalHelper.globlevar['savedFunctionID'] = GlobalHelper.globlevar['linkedFunctionId'];
    GlobalHelper.globlevar['linkedFunctionId'] = null;
   }
   else{
   GlobalHelper.globlevar['savedFunctionID'] = GlobalHelper.globlevar.functionID;
   }
   var ect=ErrorHandler.getTotalErrJsonCount();
   var genericCount = ErrorHandler.getGenericErrCount();
   if(ect==0 || (ect == genericCount))
   {
     let chk="";
  	 if(GlobalHelper.globlevar['checkNothingToSave'] == true)
  	 {
  			chk=this.checkNothingToSave();
  	 }
  	 else
  	 {
  		 chk = false;
  	 }

     if(chk===true )
     {

		   ErrorHandler.setstatusES("w");
		   ErrorHandler.setErrMessage("Nothing to save !!");
		   responsestatus = undefined;
		   GlobalHelper.globlevar['savedandfetch'] = false;
		   this.forceUpdate();

     }
     else
     {

     var values = "";

     if(  GlobalHelper.globlevar['summaryConfigType_save'] ==  true)
     {
      values = generateQueryStrFuncationbaselayout(holdNamess)
     }
     else
     {
       values = generateQueryStr(holdNamess);
     }

     //ErrorHandler.setstatusES("s");
     //ErrorHandler.setErrMessage("SAVED Successfully...");
     var rfsh = this.state.refreshERROR;
       this.setState({
           refreshERROR:!rfsh,
         })


    if(activeMenu !== undefined && activeMenu.refreshOnSave == "Y")
    {
      refreshOnSave = true;
    }
     if(GlobalHelper.globlevar.isreadysaveclicked && this.addRowtoGrid === undefined)
     {
       GlobalHelper.globlevar.isreadysaveclicked = undefined;


       if(GlobalHelper.globlevar.calculatedPkValuesForSave !== undefined && GlobalHelper.globlevar.calculatedPkValuesForSave.length !== 0 ){
         let calculatedPkValues = GlobalHelper.globlevar.calculatedPkValuesForSave;
         store.dispatch({type: 'SAVEDATA',values,calledFromSubmit,buttonIdOnsave,calculatedPkValues,orientationType: this.props.outnames.orientationType});
       }
       else {
         store.dispatch({type: 'SAVEDATA',values,calledFromSubmit,buttonIdOnsave,orientationType: this.props.outnames.orientationType});
       }

     }
     else if(GlobalHelper.globlevar.isreadysaveclicked == undefined && this.addRowtoGrid === undefined)
     {

        if(GlobalHelper.globlevar.calculatedPkValuesForSave !== undefined && GlobalHelper.globlevar.calculatedPkValuesForSave.length !== 0 ){
          let calculatedPkValues = GlobalHelper.globlevar.calculatedPkValuesForSave;
          store.dispatch({type: 'SAVEDATA',values,calledFromSubmit,buttonIdOnsave,calculatedPkValues,orientationType: this.props.outnames.orientationType});
        }
        else {
          store.dispatch({type: 'SAVEDATA',values,calledFromSubmit,buttonIdOnsave,orientationType: this.props.outnames.orientationType});
        }

     }
     else  if(GlobalHelper.globlevar.isreadysaveclicked == false)
     {
       gridsavestatus = true;
     }


   }//END OF ELSE : IF SOME NEW DATA IS ADDED OR MODIFIED
  }// END OF IF : ERROR COUNT IS ZERO
   else
   {
     Log4r.log("Please .. Remove errors.....");
   }
   //this.addRowtoGrid = undefined;
   this.setState({
    isSaveClicked:false
    })
 }// END OF IF : savetrigger=="yes"


   if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) )
   {
       $('.MainLayoutDefault__MainData___2JvWs').css("top","5px");
       $('.MainLayoutDefault__DataBlock2___2XP-m').css("top","7px");

       $('.MainLayoutDark__MainData___1r6N1').css("top","5px");
       $('.MainLayoutDark__DataBlock2___TSAuK').css("top","7px");

       $('.MainLayoutRedThm__MainData___A6sWo').css("top","5px");
       $('.MainLayoutRedThm__DataBlock2___F-765').css("top","7px");
       $('.MainLayoutRedThm__customAvatar1___3e39B').css("cssText", "border: none !important;");

     }

      if(window.event)
      {
        $('[class*=timeLineRadioButtons]').on('mousewheel', function(event)
        {


          event=window.event;

          if(event.wheelDelta>0)
          {
            $(this).scrollLeft($(this).scrollLeft()+10);
          }
          if(event.wheelDelta<0)
          {
            $(this).scrollLeft($(this).scrollLeft()-10);
          }
          event.preventDefault();
        });
     }
     else
     {
         $('[class*=DataBlock1]').on('DOMMouseScroll', function(event)
         {
           if(event.originalEvent.detail<0)
           {
             $(this).scrollLeft($(this).scrollLeft()+10);
           }
           if(event.originalEvent.detail>0)
           {
             $(this).scrollLeft($(this).scrollLeft()-10);
           }
           event.preventDefault();
         });
     }


     if(window.event)
     {
       $('[id=cardHeaderMainBlock]').on('mousewheel', function(event)
       {


         event=window.event;

         if(event.wheelDelta>0)
         {
           $(this).scrollLeft($(this).scrollLeft()+10);
         }
         if(event.wheelDelta<0)
         {
           $(this).scrollLeft($(this).scrollLeft()-10);
         }
         event.preventDefault();
       });
    }
    else
    {
        $('[id=cardHeaderMainBlock]').on('DOMMouseScroll', function(event)
        {
          if(event.originalEvent.detail<0)
          {
            $(this).scrollLeft($(this).scrollLeft()+10);
          }
          if(event.originalEvent.detail>0)
          {
            $(this).scrollLeft($(this).scrollLeft()-10);
          }
          event.preventDefault();
        });
    }

      var lastElement=$('[class*=DataBlock1] > div').length-1;
      var lastDivPosition;
      if (GlobalHelper.globlevar.colorCodeForCircleInHeader !== undefined) {
        $('[class*=HeadDataDiv]').width($('[class*=HeadDivWrap]').width() - $('[class*=HeadIdDiv]').width() - $('#colorCodeBlock').width());
      } else {
        $('[class*=HeadDataDiv]').width($('[class*=HeadDivWrap]').width() - $('[class*=HeadIdDiv]').width());
      }

      for (var i=0;i<$('[class*=DataBlock1] > div').length;i++)
      {
          if(i===(($('[class*=DataBlock1] > div').length)-1))
          {
            lastDivPosition=$($('[class*=DataBlock1] > div')[i]).offset().top;

          }

      }

      if(lastDivPosition>100)
      {
        var rightPosition;
        var leftPosition;

        rightPosition=$('[class*=DataBlock1]').width()-($($('[class*=DataBlock1] > div')[lastElement]).position().left+$($('[class*=DataBlock1] > div')[lastElement]).outerWidth());

        leftPosition= $($('[class*=DataBlock1] > div')[0]).position().left;

        if( leftPosition == 0)
        {
            $('[class*=HiddenDivRight]').css("display","block");
            $('[class*=rightScrollButton]').css("display","block");
        }

        $('[class*=DataBlock1]').scroll(function(){

          rightPosition=$('[class*=DataBlock1]').width()-($($('[class*=DataBlock1] > div')[lastElement]).position().left+$($('[class*=DataBlock1] > div')[lastElement]).outerWidth());

          leftPosition= $($('[class*=DataBlock1] > div')[0]).position().left;

          if (rightPosition == 0.015625 || rightPosition == 0.328125 || rightPosition < -0 && rightPosition > -20)
          {
            $('[class*=HiddenDivRight]').css("display","none");
            $('[class*=rightScrollButton]').css("display","none");
            $('[class*=HiddenDivLeft]').css("display","block");
            $('[class*=leftScrollButton]').css("display","block");
          }

          else if (leftPosition == 0)
          {
            $('[class*=HiddenDivRight]').css("display","block");
            $('[class*=rightScrollButton]').css("display","block");
            $('[class*=HiddenDivLeft]').css("display","none");
            $('[class*=leftScrollButton]').css("display","none");
          }

          else if (rightPosition < -0 && leftPosition < -0)
          {
            $('[class*=HiddenDivRight]').css("display","block");
            $('[class*=rightScrollButton]').css("display","block");
            $('[class*=HiddenDivLeft]').css("display","block");
            $('[class*=leftScrollButton]').css("display","block");
          }

        })


        $('[class*=DataBlock1]').width($('[class*=HeadDataDiv]').width()-42);
        $('[class*=DataBlock1]').css({"left":"20px","overflowX":"scroll","overflowY":"hidden","whiteSpace":"nowrap"});

        if(window.event)
        {
          $('[class*=DataBlock1]').on('mousewheel', function(event)
          {


            event=window.event;

            if(event.wheelDelta>0)
            {
              $(this).scrollLeft($(this).scrollLeft()+10);
            }
            if(event.wheelDelta<0)
            {
              $(this).scrollLeft($(this).scrollLeft()-10);
            }
            event.preventDefault();
          });
       }
       else
       {
           $('[class*=DataBlock1]').on('DOMMouseScroll', function(event)
           {
             if(event.originalEvent.detail<0)
             {
               $(this).scrollLeft($(this).scrollLeft()+10);
             }
             if(event.originalEvent.detail>0)
             {
               $(this).scrollLeft($(this).scrollLeft()-10);
             }
             event.preventDefault();
           });
       }
      }


      $('[class*=leftScrollButton]').click(function(){

          $('[class*=DataBlock1]').animate({scrollLeft:"-=50px"});
      });

      $('[class*=rightScrollButton]').click(function(){

        $('[class*=DataBlock1]').animate({scrollLeft:"+=50px"});
      });



      var lastIconElement=$('[class*=MyHeaderDiv] > div[class*=iconGroup]').length-1;
      var lastIconPosition;

      for (var i=0;i<$('[class*=MyHeaderDiv] > div[class*=iconGroup]').length;i++)
      {
          if(i===lastIconElement)
          {
            lastIconPosition=$($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[i]).offset().top;
          }
      }

      if(lastIconPosition>210 || $('[class*=iconGroup]').width() > $('[class*=MyHeaderDiv]').width())
      {

        var rightPosition;
        var leftPosition;

        rightPosition=$('[class*=MyHeaderDiv]').width()-($($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).position().left+$($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).outerWidth());

        leftPosition= $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[0]).position().left;


        if( leftPosition == 0)
        {
            $('[class*=SubHDR]').css("display","block");
            $('[class*=SubRSB]').css("display","block");
        }

        $('[class*=MyHeaderDiv]').scroll(function(){

          rightPosition=$('[class*=MyHeaderDiv]').width()-($($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).position().left+$($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[lastIconElement]).outerWidth());


          leftPosition= $($('[class*=MyHeaderDiv] > div[class*=iconGroup]')[0]).position().left;


          if (rightPosition == 10)
          {
            $('[class*=SubHDR]').css("display","none");
            $('[class*=SubRSB]').css("display","none");
            $('[class*=SubHDL]').css("display","block");
            $('[class*=SubLSB]').css("display","block");
          }

          else if (leftPosition == 0)
          {
            $('[class*=SubHDR]').css("display","block");
            $('[class*=SubRSB]').css("display","block");
            $('[class*=SubHDL]').css("display","none");
            $('[class*=SubLSB]').css("display","none");
          }

          else if (rightPosition < -0 && leftPosition < -0)
          {
            $('[class*=SubHDR]').css("display","block");
            $('[class*=SubRSB]').css("display","block");
            $('[class*=SubHDL]').css("display","block");
            $('[class*=SubLSB]').css("display","block");
          }

        })

        $('[class*=MyHeaderDiv]').width($('[class*=headerConslidercssfollowup]').width()-40);
        $('[class*=MyHeaderDiv]').css({"left":"10px","overflowX":"scroll","overflowY":"hidden","whiteSpace":"nowrap"});

        if(window.event)
        {
          $('[class*=MyHeaderDiv]').on('mousewheel', function(event)
          {

            event=window.event;

            if(event.wheelDelta>0)
            {
              $(this).scrollLeft($(this).scrollLeft()+10);
            }
            if(event.wheelDelta<0)
            {
              $(this).scrollLeft($(this).scrollLeft()-10);
            }
            event.preventDefault();
          });
       }
       else
       {
           $('[class*=MyHeaderDiv]').on('DOMMouseScroll', function(event)
           {
             if(event.originalEvent.detail<0)
             {
               $(this).scrollLeft($(this).scrollLeft()+10);
             }
             if(event.originalEvent.detail>0)
             {
               $(this).scrollLeft($(this).scrollLeft()-10);
             }
             event.preventDefault();
           });
       }

      }

      $('[class*=SubLSB]').click(function(){

          $('[class*=MyHeaderDiv]').animate({scrollLeft:"-=50px"});
      });

      $('[class*=SubRSB]').click(function(){

        $('[class*=MyHeaderDiv]').animate({scrollLeft:"+=50px"});
      });


if(responsestatus==="S")
        {
          if(topvalue !== undefined)
          {
            topvalue = undefined;
           // this.handleClick("CLEAR","sesHeadr");
             this.setState({clearForm:true});
          }
        }
        /*changes made to clera popserach*/
        if(GlobalHelper.globlevar.popsearchclear === true)
        {GlobalHelper.globlevar.popsearchclear = false;}
        /*end*/
        $('[class*=timeLineIcon]').css('cssText','position:absolute !important; bottom:0px !important;');
}




componentWillReceiveProps(nextProps)
{
  if(nextProps.themeCode!=this.props.themeCode)
  {
    if(this.props.themeCode=="myDefault")
    {
      this.setState({themeName:nextProps.themeCode});
    }
    else if (this.props.themeCode=="myDark")
    {
      this.setState({themeName:nextProps.themeCode});
    }
    else if (this.props.themeCode=="myRed")
    {
      this.setState({themeName:nextProps.themeCode});
    }
    else if (this.props.themeCode=="myCompact")
    {
      this.setState({themeName:nextProps.themeCode});
    }
  }
  else{  }

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


setFullTableClass(valueStyleFullTable)
{
  if(valueStyleFullTable===null||valueStyleFullTable===undefined||valueStyleFullTable===" "){
    return stylesfu.floatingboxfollowuptablefull1;
  }
  else{
    if(valueStyleFullTable===false)
    {
      return stylesfu.floatingboxfollowuptablefull;
    }
    else
    {
      return stylesfu.floatingboxfollowuptablefull1;
    }
  }
}

setHalfTableClass(valueStyleHalfTable)
{
  if(valueStyleHalfTable===null||valueStyleHalfTable===undefined||valueStyleHalfTable===" "){
    return stylesfu.floatingboxfollowuptablehalf1;
  }
  else{
    if(valueStyleHalfTable===false)
    {

      return stylesfu.floatingboxfollowuptablehalf;
    }
    else
    {
    return stylesfu.floatingboxfollowuptablehalf1;
    }
  }
}

setTwoThirdHalfTableClass(valueStyleHalfTable){
  if(valueStyleHalfTable===null||valueStyleHalfTable===undefined||valueStyleHalfTable===" "){
    return stylesfu.gridtwothirdhalfscreen;
  }
  else{
    if(valueStyleHalfTable===false)
    {
      return stylesfu.gridtwothirdhalfscreen_chk;
    }
    else
    {
      return stylesfu.gridtwothirdhalfscreen;
    }
  }
}

setOneThirdTableClass(valueStyleHalfTable)
{
  if(valueStyleHalfTable===null||valueStyleHalfTable===undefined||valueStyleHalfTable===" "){
    return stylesfu.floatingboxfollowuptableOneThird1;
  }
  else{
    if(valueStyleHalfTable===false)
    {

      return stylesfu.floatingboxfollowuptableOneThird;
    }
    else
    {
    return stylesfu.floatingboxfollowuptableOneThird1;
    }
  }
}

setTwoThirdTableClass(valueStyleHalfTable)
{
  if(valueStyleHalfTable===null||valueStyleHalfTable===undefined||valueStyleHalfTable===" "){
    return stylesfu.floatingboxfollowuptableTwoThird1;
  }
  else{
    if(valueStyleHalfTable===false)
    {
      return stylesfu.floatingboxfollowuptableTwoThird;
    }
    else
    {
    return stylesfu.floatingboxfollowuptableTwoThird1;
    }
  }
}


setOneThirdHybridClass(valueStyleHalfTable)
{
  if(valueStyleHalfTable===null||valueStyleHalfTable===undefined||valueStyleHalfTable===" ")
  {
    return stylesfu.HybridOneThird1;
  }
  else
  {
    if(valueStyleHalfTable===false)
    {
      return stylesfu.HybridOneThird;
    }
    else
    {
      return stylesfu.HybridOneThird1;
    }
  }
}
setTwoThirdHybridClass(valueStyleHalfTable)
{
  if(valueStyleHalfTable===null||valueStyleHalfTable===undefined||valueStyleHalfTable===" ")
  {
    return stylesfu.HybridTwoThird1;
  }
  else
  {
    if(valueStyleHalfTable===false)
    {
      return stylesfu.HybridTwoThird;
    }
    else
    {
      return stylesfu.HybridTwoThird1;
    }
  }
}

returnEmptyTwoThirdContainer(namess)
{
  Log4r.log("DESCHECK",GlobalHelper.globlevar.hybridView);
  if(createHybridView === true && (GlobalHelper.globlevar.hybridView===false || GlobalHelper.globlevar.hybridView===undefined) )
  {
    return (
      <div className={stylesfu.LoadingContainerDiv}>
        <span style={{top:"45%",position:"relative",display:"inline-block"}}>
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
  else
  {
    return null;
  }
}


handleNullDataForCheckBox(screenDataNamess){
  if(screenDataNamess.screendata !== undefined && screenDataNamess.screendata !=="")
    {
      for (let namesIterator = 0; namesIterator < screenDataNamess.screendata.length; namesIterator++ ){
        try
        {
          let childrenArray = screenDataNamess.screendata[namesIterator].uiSchema[0].children;
          let childrenArrayLength = childrenArray.length;
          for( let tempIter = 0; tempIter < childrenArrayLength; tempIter++){

            if(childrenArray[tempIter].children.widget==="checkbox"){
              let fieldPathforSame = childrenArray[tempIter].children.fieldPath;
              let dataForSame = screenDataNamess.screendata[namesIterator].formData[0][fieldPathforSame].data;
              if (dataForSame==undefined || dataForSame==null || dataForSame=="" || dataForSame=={}){
                screenDataNamess.screendata[namesIterator].formData[0][fieldPathforSame].data = 'N';
              }
            }
          }
        }
        catch(e){Log4r.error(e)}
    }
  }
}


componentDidMount(){
  $('#NextDisabled').prop('disabled',true);
  $('#NextDisabled2').prop('disabled',true);
  if(firstTimeCapture==false && GlobalHelper.globlevar.toggleClicked!==true){
    firstTimeCapture=true;
  }

  // //Sprint 37 - Task - Detailsection - hiding cardheaderdiv if no conversion of grid to Card Layout.
  // if(namess != null && namess['screendata'] != null){
  //   let screenObjGrid = namess.screendata.filter(item=>(item.formData[0][item.sessionID] != null && item.formData[0][item.sessionID].data != null && item.formData[0][item.sessionID].data['isCardDisplay']==="false"))[0];
  //   if(screenObjGrid != null){
  //     $('[class*=cardContainerHeader]').css('cssText','display:none');
  //   }else{
  //     $('[class*=cardContainerHeader]').css('cssText','display:block');
  //   }
  // }//END-Sprint 37 - Task - Detailsection - hiding cardheaderdiv if no conversion of grid to Card Layout.

  if(GlobalHelper.globlevar["onload"]  && this.props.outnames.data[0].name !== undefined)
  {
    GlobalHelper.globlevar["onload"] = false;
  try
    {
    let utilObject = new onLoadUtil();
    let method = "onloadcollectionutil";
    utilObject[method](this.props.outnames.data[0].name);
    }
    catch(e){Log4r.error(e)}
  }
  temp =true;
  this.setState({
      editable:tempJsonEditPropertyFlag,
      completed:true,
      visible: false,
      widths:this.props.widths,
      themeName:this.props.themeCode
    })
}

OpFunction(){
  if(this.state.collapsed==true)
  {
  return styles.custMenu;
  }
  else {
  return styles.custMenuHide;
  }
}

MyFuncRight(post,isSubmenuclick)
{
  if(isSubmenuclick !== undefined && isSubmenuclick == "ellipsisGroupMenuClicked"){
    clickedGroup = post;
    GlobalHelper.globlevar['rightGroupFunctionClick'] = true;
  }
  GlobalHelper.globlevar["ClearTabArray"] = undefined;
  GlobalHelper.globlevar['changeTitle'] = undefined;
  GlobalHelper.globlevar['historyTimelineclicked'] = undefined;
  GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
  GlobalHelper.globlevar["SplitScreenMainLayout"] = false;
  GlobalHelper.globlevar["SplitScreenParams"]  = undefined;
  GlobalHelper.globlevar['calculatedPkValuesForSave'] = undefined;
  GlobalHelper.globlevar['sectionScroll']  = undefined;
  ErrorHandler.clear();
  if(onlyCloseButtonViews == true){
    showOnlyCloseButton = true;
  } else {
    showOnlyCloseButton = null;
  }

	if(post.groupid == "FAV"){
		groupidFAVCllicked = true;
	}else{
		groupidFAVCllicked = false;
	}
	if(post.content.length == 0 ){
		let secondsToGo = 2;
		const modal = Modal.success({
			title: 'Favorites',
			content: `No function Added as Favorite yet.`,
		});
		setTimeout(() => {
			modal.destroy();
		}, secondsToGo * 1000);
		return;
	}

  //this.setState({isClearClicked:false}) ;
 if(createHybridView)
  {
    createHybridView=false;
  }
  GlobalHelper['DefaultFunctionHeadername'] =undefined;
  //GlobalHelper.defaultfunction=undefined;
  GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
  GlobalHelper.globlevar['summaryConfigType'] = undefined;
  GlobalHelper.globlevar['modalClosedClicked'] = undefined;
  GlobalHelper.globlevar['newfunctionInitiated'] = undefined;
  GlobalHelper.globlevar.CurrentlyClosedCard=[];
  GlobalHelper.globlevar.getDataUrls=[];
  GlobalHelper.globlevar.savespin = false;
  GlobalHelper.globlevar['newFunctionNames'] = undefined;
  GlobalHelper.globlevar.cardCollapseClicked=true;
  GlobalHelper.globlevar.selectedCardIndex.clear();
  GlobalHelper.globlevar['historyHidden'] = false;//Sprint 32 - To hide History Timeline Function Layout.
  createHistoryTimelineView=false;
  if(containerDiv.length>=0 || hybridCount >=0)
  {
    containerDiv=[];
    hybridCount=0;
  }
  if(GlobalHelper.globlevar.cardLayoutInclusion){
    GlobalHelper.globlevar.cardLayoutInclusion = undefined;
  }
  GlobalHelper.globlevar.hybridView=undefined;
  this.clearTriggered = false;
  GlobalHelper.globlevar.targetCard="";
  GlobalHelper.globlevar['subFuncName'] = undefined;
  names['formSubTitle'] = undefined;//Sprint 38 - Task 53-Custom API to set Layout SubFunction Name/ Sub Title.

  currentChangedForm="";
  if(GlobalHelper.globlevar.toggleClicked===true)
  {
    GlobalHelper.globlevar.toggleClicked=undefined;
  }
  if(post.groupid!=="TIMEL")
  {
    headername = post.groupdesc
  }
  demoright = true;
  if(post.groupid==="TIMEL")
  {
    // const hide = notification.open({
    // message: 'Timeline View',
    // description: 'Loading timeline ! ...',
    // });
    TimeLineView = !TimeLineView;
    if(TimeLineView)
    {
      const hide = message.loading('Loading Timeline...', 0);
      setTimeout(hide, 2500);
      Log4r.log("TAKEN WIDTH",this.state.widths, window.innerWidth , (window.innerWidth - this.state.widths), (this.state.widths-800-(window.innerWidth - this.state.widths)), (this.state.widths-800) );
      if((this.state.widths-800)<0){
        TimeLineWidth='450px';
      }
      else {
        TimeLineWidth= "auto";
      }

    }else
    {
      TimeLineWidth='0px';
    }
    this.setState({timelineClicked:true},()=>{this.forceUpdate()});
    return null;
  }
  else {
    TimeLineWidth='0px';
    TimeLineView=false;
  }

  if(right!=post.groupid)
  {
    GlobalHelper.globlevar['timelinedisplay'] = undefined;
    GlobalHelper.globlevar['timelineScreen'] = [];
    if(GlobalHelper.globlevar.linkclicked === true){
        GlobalHelper.globlevar.linkclicked = false;
      }
    var testVar = post.groupid;
    ErrorHandler.clear();
    /*if(arrayOfRightSider[post.groupid] == undefined)      WORKING CODE FOR ALL BACKUP ERROR
    {
      tempArrForScrn=[];
      backuperrjson=[];
      allScrnErrObj={};
      arrayOfRightSider[post.groupid]=allScrnErrObj;
    }else {
      allScrnErrObj=arrayOfRightSider[post.groupid];
      Log4r.log("allScrnErrObj after switch",allScrnErrObj);
      var asd=Object.keys(allScrnErrObj);
      Log4r.log("asd",asd);
      backuperrjson=allScrnErrObj[asd[0]]
    }*/

    /*asset summery screen. Grid link clicked false change to default position  */
    GlobalHelper.globlevar.linkclicked = false;

    countRightu++;
    countArrow++;
    right=post.groupid;
    Arrow=post.groupid;
    a=0;

    let firstTopLayoutFunction = null;
    let topLayoutFunctions = [];
    let values = "";
    if(post.content != null) {
      if(post.content.length > 0) {
        topLayoutFunctions = post.content.filter(item => item.functionType !== "U"); //functionType
      }
    }
    if(topLayoutFunctions.length > 0){
      if(topLayoutFunctions[0] != null && topLayoutFunctions[0].refreshOnSave != undefined && topLayoutFunctions[0].refreshOnSave.toLowerCase() == 'y'){
        refreshOnSave = true;
      }
      activeMenu = topLayoutFunctions[0];
      values = topLayoutFunctions[0].id;
      formSubTitle = topLayoutFunctions[0].desc;
      headername = post.groupdesc;
      customHeaderFunctionIndex = null;
      GlobalHelper.globlevar['tabScreen'] = GlobalHelper.globlevar['tabScreen'].filter((a) => a.title !== formSubTitle);
    } else {
      if(post.content[0] != null && post.content[0].refreshOnSave != undefined && post.content[0].refreshOnSave.toLowerCase() == 'y'){
        refreshOnSave = true;
      }
      activeMenu = post.content[0];
      values = post.content[0].id;
      formSubTitle = post.content[0].desc;
      headername = post.groupdesc;
      if(this.customHeaderFunctionsToRender.size !== 0){
        let contentItemIndex = 0;
        const contentItemIterator =  this.customHeaderFunctionsToRender.entries();
        while (contentItemIterator.next().value[1].id !== post.content[0].id ) {
          contentItemIndex++;
        }
        customHeaderFunctionIndex = contentItemIndex;
      }
      GlobalHelper.globlevar['tabScreen'] = GlobalHelper.globlevar['tabScreen'].filter((a) => a.title !== formSubTitle);
    }

    refreshOnSave = undefined;
    GlobalHelper.globlevar.savedFunctionID = ""+values;
    GlobalHelper.globlevar.functionID = ""+values;
    GlobalHelper.globlevar['InitialScreenFunctionID'] = values;
    GlobalHelper.globlevar['FirstFuncatoinIdFromGroupFunction'] = values;
    GlobalHelper.globlevar['summaryConfigType_save'] = undefined;

    GlobalHelper['cardaddbutton'] = false;
    screenLoadAndPostSaveFlag = true;

    if(GlobalHelper.globlevar.promptClicked)
    {
      let pr_mode = "prompt";
      store.dispatch({type: 'INITIALSCREEN', values , pr_mode });
    }
    else
    {
      store.dispatch({type: 'INITIALSCREEN', values});
    }
    responsestatus = undefined;
    gridsavestatus = undefined;
    GlobalHelper.globlevar.onScreenLoadSpin = true;
    this.forceUpdate();
  }
}

pinUnpinDefaultFunction(){
	Log4r.log("Work List Data :", GlobalHelper.worklistData.worklist);

	var functionId;
	if(GlobalHelper.worklistData.worklist.userDefFunctionId != null && GlobalHelper.worklistData.worklist.userDefFunctionId == GlobalHelper.globlevar['functionID']){
		functionId = "";
	}else{
		functionId = GlobalHelper.globlevar['functionID'];
	}
	var requestData = {
		'__functionId': functionId,
		'token': 'indus',
		'txtListEntityId' :GlobalHelper.listEntityId
	};

 let url_pinUnpinFunctions = "/"+GlobalHelper.menuContext+"/secure/listAction.do?_rt=setDefaultFunction&";
  let PinUnpinFunctionsPostDataUrl  = url_pinUnpinFunctions.split("?")[1];

  let _stdata_pinunpinfunctions = getSTData("/"+GlobalHelper.menuContext+"/", PinUnpinFunctionsPostDataUrl);
	request
		.get("/"+GlobalHelper.menuContext+"/secure/listAction.do?_rt=setDefaultFunction&")
	  .query({_SID_:(_stdata_pinunpinfunctions.SID + _stdata_pinunpinfunctions.SINT)})
    .query({_ADF_:""})
		.set('Accept', 'application/json')
		.query({
			__functionId:  functionId,
			txtListEntityId : GlobalHelper.listEntityId
		})
		.send(JSON.stringify(requestData))
		.end((err, res) =>{
			Log4r.log('Wat is the response ', res);
			if (err ){
				Log4r.log('Error ', err);
			}else{
				var xmlDoc = $.parseXML(res.text);
				var $xml = $( xmlDoc );
				var $title = $xml.find( "success" );
				var jsonText = $title.text();
				var jsonTxt = jsonText;
				Log4r.log('JSON retrived data', jsonTxt);
				const jsonObj=JSON.parse(jsonTxt);
				Log4r.log('JSON retrived Object data ', jsonObj);
				if(jsonObj == true && functionId != ""){
					GlobalHelper.worklistData.worklist.userDefFunctionId = functionId;
				}else{
					GlobalHelper.worklistData.worklist.userDefFunctionId = "";
				}
				Log4r.log("GlobalHelper.worklistData.worklist.userDefFunctionId", GlobalHelper.worklistData.worklist.userDefFunctionId);
				this.setState({pin : !this.state.pin})
			}
		})
}

setPinUnpinIcon(){
  if(GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist.userDefFunctionId != "" && GlobalHelper.worklistData.worklist.userDefFunctionId == GlobalHelper.globlevar['functionID']){
		return styles.myspanPinned;
	}else{
		return styles.myspanUnpinned;
	}
}

setClassRightUI(index,activeness)
{
  if(activeness=="yes" && countRightu==0 )
  {
    return styles.siderrightsettingMenuItemSelected;
  }
  else if(index==right)
  {
    return styles.siderrightsettingMenuItemSelected;
  }
  else {
    return styles.siderrightsettingMenuItem;
  }
}

setMyClass(index,aa)
{
  if (aa==0) {
    return stylesf.iconDSelected;
  }
  if(aa==index)
  {
    return stylesf.iconDSelected;
  }
  else
  {
    return stylesf.iconD;
  }

  return stylesf.iconDSelected;
}

selectedCustomFunIcon(index){
      if(funIconIndex == index){
        return styles.headexampleselected;
    }
    else {
        return styles.headexample;
    }
}

FunHeadercustomScreenCall(varr,IconFunctionName){
  Log4r.log("INSIDE FUN...",IconFunctionName);
  funIconIndex=varr ;
  this.setState({
    ref :this.state.ref,
  })
  if ((IconFunctionName!=undefined) && (IconFunctionName!=null)  && (IconFunctionName!="")) {
    var custfun = new custutils();
    let custfunction=IconFunctionName;
    let json = custfun["customOnChange"](custfunction);
  }
}

setMyFavClass(){
	var i = Rightsidermenu.length -1;
	if(Rightsidermenu[i].groupid == "FAV"){
		for(var j = 0; j < Rightsidermenu[i].content.length; j++){
			if(Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']){
				return styles.headexampleFAV;
			}
		}
	}
	return styles.headexample;
}

setFavoriteTooltip(){
  try {
    var i = Rightsidermenu.length -1;
  	if(Rightsidermenu[i].groupid == "FAV"){
  		for(var j = 0; j < Rightsidermenu[i].content.length; j++){
  			if(Rightsidermenu[i].content[j].id == GlobalHelper.globlevar['functionID']){
  				return 'Remove from Favorites';
  			}
  		}
  	}

  } catch (e) {
    Log4r.error(e);
  }

	return 'Add to Favourites';
}

myFunction(index, name, functionObj, headerFunctionIndex)
{
  if(headerFunctionIndex != null) {
    customHeaderFunctionIndex = headerFunctionIndex;
  } else {
    customHeaderFunctionIndex = null;
  }
  GlobalHelper.globlevar['tabScreen'] = GlobalHelper.globlevar['tabScreen'].filter((a) => a.title !== name);
  GlobalHelper.globlevar['changeTitle'] = undefined;
  GlobalHelper.globlevar["ClearTabArray"] = undefined;
  GlobalHelper.globlevar['sectionScroll']  = undefined;
  GlobalHelper.globlevar['historyTimelineclicked'] = undefined;
  GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
  GlobalHelper.globlevar["SplitScreenMainLayout"] = false;
  GlobalHelper.globlevar["SplitScreenParams"]  = undefined;
  GlobalHelper.globlevar['postSaveScreenLoad'] = {"refreshFrom":"normalFunction", customIndex:index, customName:name, customFunctionObj:functionObj};
  //spinning on function click.
  GlobalHelper.globlevar.onScreenLoadSpin = true;
  this.forceUpdate();
  cardHeaderInfo = [];
  activeMenu = functionObj;
  GlobalHelper.globlevar['shouldResettingMapInWrapper'] = true;
  GlobalHelper.globlevar['modalClosedClicked'] = undefined;
  GlobalHelper.globlevar['myFunctionClicked'] = true;
  GlobalHelper.globlevar['buttonSpin'] = undefined;
  GlobalHelper.globlevar['isolatedRefreshOnSave'] = undefined;
  GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = undefined;
  GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] = undefined;
  GlobalHelper.globlevar['calculatedPkValuesForSave'] = undefined;
  GlobalHelper.globlevar['historyHidden'] = false;//Sprint 32 - To hide History Timeline Function Layout.
  refreshOnSave = undefined;

  if(functionObj != null && functionObj.refreshOnSave != undefined && functionObj.refreshOnSave.toLowerCase() == 'y'){
		refreshOnSave = true;
	}

  if(createHybridView) {
    createHybridView=false;
  }

  if(index == defaultFunctionId){
    createHistoryTimelineView = true;
    GlobalHelper.globlevar['HistoryTimelineView'] = true;
    showOnlyCloseButton = null;
    } else {
      if(onlyCloseButtonViews == true){
        showOnlyCloseButton = true;
      }
      createHistoryTimelineView = false;
      GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
  }
  this.setPinUnpinIcon();
  GlobalHelper['DefaultFunctionHeadername'] =undefined;
  GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
  GlobalHelper.globlevar['newFunctionNames'] = undefined;
  GlobalHelper.globlevar['newfunctionInitiated'] = undefined;
  GlobalHelper.globlevar['summaryConfigType'] = undefined;
  GlobalHelper.globlevar.getDataUrls=[];
  GlobalHelper.globlevar.savespin = false;
  GlobalHelper.globlevar.cardCollapseClicked=true;
  GlobalHelper.globlevar.CurrentlyClosedCard=[];
  GlobalHelper.globlevar.selectedCardIndex.clear();
  if(containerDiv.length>=0 || hybridCount >=0) {
    containerDiv=[];
    hybridCount=0;
  }
  GlobalHelper.globlevar.hybridView=undefined;
  GlobalHelper.globlevar['timelinedisplay'] = undefined;
  GlobalHelper.globlevar['timelineScreen'] = [];
  GlobalHelper.globlevar['subFuncName'] = undefined;
  names['formSubTitle'] = undefined;
  if(GlobalHelper.globlevar.cardLayoutInclusion) {
     GlobalHelper.globlevar.cardLayoutInclusion = undefined;
   }

  this.clearTriggered = false;

  if(GlobalHelper.globlevar.toggleClicked===true) {
     GlobalHelper.globlevar.toggleClicked=undefined;
  }

  if(TimeLineView) {
    TimeLineView=false;
    TimeLineWidth='0px';
  }

  GlobalHelper.globlevar.targetCard="";
  currentChangedForm="";
  demoright = false;
  if(GlobalHelper.globlevar.linkclicked === true) {
    GlobalHelper.globlevar.linkclicked = false;
  }
  ErrorHandler.clear();
  GlobalHelper.globlevar.linkclicked = false;

  responsestatus = undefined;
  gridsavestatus = undefined;

  a=index;
  formSubTitle=name;
  var values =  index;
  GlobalHelper.globlevar['functionID']= values;
  GlobalHelper.globlevar['savedFunctionID'] = ""+values;
  GlobalHelper.globlevar['demolocalmenuid']  =values ;
  GlobalHelper.globlevar['summaryConfigType_save'] = undefined;

  GlobalHelper['cardaddbutton'] = false;
  screenLoadAndPostSaveFlag = true;

  if(GlobalHelper.globlevar.promptClicked) {
    let pr_mode = "prompt";
    store.dispatch({type: 'LAYOUTTOPICON',values, pr_mode });
  } else {
    store.dispatch({type: 'LAYOUTTOPICON',values});
  }
}

optionsIntoArrayConverter(options) {

var selectCodeDescMapperArray = [];
  options.map((item,index) => {
  let descObjectSubMap = {};
  descObjectSubMap['description'] = item.description;
  if( item.children != null && item.children!="" && item.children != undefined){
    var childrenArray = this.ChildrenHandler(item.children);
    descObjectSubMap['children'] = childrenArray;
  }
  let descObjectMap = new Map();

  descObjectMap.set(item.code,descObjectSubMap);
  selectCodeDescMapperArray.push(descObjectMap);
})
 return selectCodeDescMapperArray;
}

ChildrenHandler(itemChildrenParam){
        var childrenArrayInHandler = this.optionsIntoArrayConverter(itemChildrenParam);
        return childrenArrayInHandler;
  }

  fromMapToFormFieldOptions(passedOptions, resultantArrayFromMap){
    let finalMappedArrayOfOptionsForFieldPath = [];
    passedOptions.map((item,index) => {

    for ( var iterMap = 0; iterMap < resultantArrayFromMap.length; iterMap++ ){
      if(resultantArrayFromMap[iterMap].has(item.code)){
        let tempOptionObject = {};
         tempOptionObject.description = resultantArrayFromMap[iterMap].get(item.code).description;
         tempOptionObject.code = item.code;

         if( item.children != null && item.children!="" && item.children != undefined){
           let childrenArrayInMap = resultantArrayFromMap[iterMap].get(item.code).children;
           var childrenArrayMapping = this.ChildrenHandlerFrmMap(item.children,childrenArrayInMap);
           tempOptionObject.children = childrenArrayMapping;
         }

         finalMappedArrayOfOptionsForFieldPath.push(tempOptionObject);
         break;
      }
    }
   })
   return finalMappedArrayOfOptionsForFieldPath;
  }

  ChildrenHandlerFrmMap(childrenArrayParam, childrenArrayInMapParam ){

    var childrenArrayMapping = this.fromMapToFormFieldOptions(childrenArrayParam, childrenArrayInMapParam);
    return childrenArrayMapping;
  }



handleChange(fieldPath,sessionID,frmdata,objk,string,cellUpdated){
  Log4r.log("inside handleChange of uiScreen");
  Log4r.log("UISCreen handleChange ", fieldPath, sessionID, frmdata, objk, string);
  Log4r.log("UISCreen data ", frmdata[fieldPath]['data']);
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
  currentChangedForm=sessionID;
  if(GlobalHelper.globlevar['dotForm']===fieldPath || GlobalHelper.globlevar.onlyForCondValidationOnClickOfCard)
   {
    hybridCount=0;

    if(GlobalHelper.globlevar['dotForm']){
      let indexToTrim = null;
      for (var i = 0; i < cardHeaderInfo.length; i++) {
        if(cardHeaderInfo[i].key === GlobalHelper.globlevar['dotForm'])
        {
          indexToTrim = i;
        }
      }
      cardHeaderInfo.length = (indexToTrim);
      GlobalHelper.globlevar['dotForm'] = undefined;
     }
     for (var i = 0; i < namess.screendata.length; i++) {
       if(namess.screendata[i].hasOwnProperty('addedFunctionLayout') && namess.screendata[i].addedFunctionLayout == true){
        delete namess.screendata[i]['addedFunctionLayout'];
        namess.screendata[i]['hidden'] = "true";
       }
     }
     if($('[class*=triLayer_twoThirdWrapper]').length!==0 || $('[class*=twoThirdWrapper]').length!==0  ){
       Log4r.log("inside test cond "+$('[class*=triLayer_twoThirdWrapper]').length+""+$('[class*=twoThirdWrapper]').length);
    $('[class*=floatingboxfollowuptableTwoThird]').unwrap();
 }
     //ErrorHandler.clear();
     if (GlobalHelper.globlevar.onlyForCondValidationOnClickOfCard)
     {
       GlobalHelper.globlevar.onlyForCondValidationOnClickOfCard = false;
       CardLinkFetch = true;
     }
   }
   let NothingSaveError = ErrorHandler.getErrMessage();
   if(NothingSaveError==="Nothing to save !!")
   {
     ErrorHandler.setstatusES(null);
     ErrorHandler.setErrMessage(null);
   }
   this.setState({justRefresh:!this.state.justRefresh}) ;
   try
     {
     if(objk !== null) // in case of change in link widget of any section
       {
     //let REFKEY = frmdata[objk.sessionID].data.smrykeyconfig.split(",");
     let smrykeyconfigvalues = "";

        if(objk.formData !== undefined) // objk.formData stores changed value in link
          {

            let AnObject = {};
            AnObject['key'] = objk.sessionID;
            AnObject['value'] = GlobalHelper.globlevar.tableLinkRecord[frmdata[objk.sessionID].data.Columns[0].dataIndex];
            let tempArray = [];
            tempArray.push(AnObject);
            Array.prototype.inArray = function(copmarer) {
            for (let i = 0; i < this.length; i++) {
                if(copmarer(this[i])){
                  return true;
                }
              }
              return false;
            }

          Array.prototype.pushIfNotExist = function(element, comparer) {
            if (!this.inArray(comparer)){
                  this.push(element);
              } else {
                for (var i = 0; i < this.length; i++) {
                  if(this[i].key === element.key)
                  {
                    this[i].value = element.value;
                  }
                }
              }
            };

            for (let i = 0; i < tempArray.length; i++) {
            cardHeaderInfo.pushIfNotExist(tempArray[i], function(e){
                return e.key === tempArray[i].key
              })
           }

           Log4r.log("TABLE CARD INFO :",cardHeaderInfo);
           var values = {};
           Log4r.log("frmdata[objk.sessionID].data.detailsectionid",frmdata[objk.sessionID].data.detailsectionid);
           if(frmdata[objk.sessionID].data.detailsectionid !== undefined || frmdata[objk.sessionID].data.detailsectionid !== null){
              values={clickedData:objk.formData[0],detailsectionid:frmdata[objk.sessionID].data.detailsectionid, smryclickablecol:frmdata[objk.sessionID].data.smryclickablecol};
            }
            else {
              values={clickedData:objk.formData[0]};
            }
            //var values = frmdata[objk.sessionID].data.smrykeyconfig;
           isfetchlinkclicked = true; // for bindig xpathmap which called at maptopropse
           if(frmdata[fieldPath].data.isCardDisplay==="true")
           {
             if(cardHeaderInfo.length > 1) {
               let indexToTrim = null;
               for (var i = 0; i < cardHeaderInfo.length; i++) {
                 if(cardHeaderInfo[i].key === fieldPath)
                 {
                   indexToTrim = i;
                 }
               }
               cardHeaderInfo.length = (indexToTrim+1);
             }

             CardLinkFetch=true;
             if(string==="Second Layer")
             {
              /* Can implement any code in case any change happened in detail section of second level summary card*/
             }
           }

           if(responsestatus==="S")
           {
             responsestatus=undefined;
           }

           GlobalHelper.globlevar['parentfieldpath'] = fieldPath;
           var calculatedPkValues=[];
           if(frmdata[fieldPath]['data'].summaryConfigType === "F")
           {
             if(frmdata[fieldPath]['data'].funcBaseDtlCntxtIds !== undefined){
                let functionContext = frmdata[fieldPath]['data'].funcBaseDtlCntxtIds;
                let newContextValues = [];
                for(let key in functionContext){
                  let contextValueExpression = functionContext[key];
                  let contextValue = this.getGridValueForColumn(frmdata[fieldPath]['data'], contextValueExpression, GlobalHelper.globlevar.targetCard);
                  if(contextValueExpression == "$P!{BASE_ENTITY}"){
                    let functionIdColumnValue = this.getGridValueForColumn(frmdata[fieldPath]['data'], frmdata[fieldPath]['data'].functionIdColumn, GlobalHelper.globlevar.targetCard);
                    for (let i = 0; i < GlobalHelper.functionGroupData.formHeaderBookmarks.length; i++){
                      for (let j = 0; j < GlobalHelper.functionGroupData.formHeaderBookmarks[i].content.length; j++){
                        if(GlobalHelper.functionGroupData.formHeaderBookmarks[i].content[j].id === functionIdColumnValue){
                          contextValue = GlobalHelper.functionGroupData.formHeaderBookmarks[i].content[j].entityid;
                          break;
                        }
                      }
                      if(contextValue != null) break;
                    }
                  }
                  newContextValues.push({"key" : key , "contextValue" : contextValue});
                }
                Log4r.log("newContextValues Array : ", newContextValues);

                let newContextPKValues = GlobalHelper.contextPKValues;
                let __cpk = GlobalHelper.contextPrimaryKey;
                Log4r.log("__cpk:", __cpk);
                for (let i = 0; i < newContextValues.length; i++){
                  let currentContextKey = newContextValues[i].key;

                  let currentContextValue = newContextValues[i].contextValue;

                  let isKeyPresentInPKValues = newContextPKValues.indexOf( currentContextKey + "=") >= 0;

                  if(isKeyPresentInPKValues){
                    let startIndex = newContextPKValues.indexOf( currentContextKey + "=") + ( currentContextKey + "=").length;
                    let endIndex = (newContextPKValues.indexOf("&", startIndex) == -1 ? newContextPKValues.length : newContextPKValues.indexOf("&", startIndex));
                    newContextPKValues = newContextPKValues.substring(0, startIndex) + currentContextValue + newContextPKValues.substring(endIndex);
                  }else{
                    newContextPKValues = newContextPKValues + "&" + currentContextKey + "=" + currentContextValue;
                  }
                  if(__cpk != null && __cpk.indexOf("=") >= 0){
                    __cpk = __cpk.split("=")[1];
                    __cpk = "|" + __cpk + "|";
                    let isKeyPresentIn_cpk = __cpk.indexOf("|" + currentContextKey + "|") >= 0;
                    if(!isKeyPresentIn_cpk){
                      __cpk = __cpk + currentContextKey;
                    }
                    __cpk = __cpk.substring(1);
                    if(isKeyPresentIn_cpk){
                      __cpk = __cpk.substring(0, __cpk.length-1);
                    }
                    __cpk = "__cpk=" + __cpk;
                  }
                }
                Log4r.log("new __cpk:", __cpk);
                let newPkValuesObject = {}
                newPkValuesObject["contextPrimaryKyes"]=__cpk;
                newPkValuesObject["contextPrimaryKyeValues"]=newContextPKValues;
                calculatedPkValues.push(newPkValuesObject);
                GlobalHelper.globlevar['calculatedPkValuesForSave'] = calculatedPkValues;
              }

            let values ="";

			      values = GlobalHelper.globlevar['tableLinkRecord'][frmdata[fieldPath]['data'].functionIdColumn];
            // if(GlobalHelper.globlevar['switch'] == undefined )
            // {
            //   GlobalHelper.globlevar['switch'] = true;
            //  // values = GlobalHelper.globlevar['tableLinkRecord'][frmdata[fieldPath]['data'].functionIdColumn];
            //   values = "8fc778be480d479887fc965b78720345";
            // }
            // else  if(GlobalHelper.globlevar['switch'] == true )
            // {
            //   GlobalHelper.globlevar['switch'] =undefined;
            //   values = "4192d5b655624980a467050d1f6ab313";
            // }
            GlobalHelper.globlevar['summaryConfigType_save'] = undefined;
            GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = values;
            GlobalHelper.globlevar['summaryConfigType'] = "F";
            let addTabScreen = GlobalHelper.globlevar['tabScreen'].filter((a) => a.f2FunctionId == GlobalHelper.globlevar.functionID);
            if (addTabScreen.length > 0) {
              let addTabindex = GlobalHelper.globlevar['tabScreen'].indexOf(addTabScreen[0]);
              GlobalHelper.globlevar['tabScreen'][addTabindex].summaryConfigTypeFunctionid =  GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
              GlobalHelper.globlevar['tabScreen'][addTabindex].summaryConfigType_save =  undefined;
              GlobalHelper.globlevar['tabScreen'][addTabindex].summaryConfigType =  "F";
            }
              if(calculatedPkValues.length == 0){
                  store.dispatch({type: 'LAYOUTTOPICON',values});
              }
              else{
                  store.dispatch({type: 'LAYOUTTOPICON',values,calculatedPkValues});
              }

           }
           else
           {
            GlobalHelper.globlevar['summaryConfigType'] = "D";
            store.dispatch({type: 'GRIDFETCHDATA',values, orientationType : this.props.outnames.orientationType});
           }


           this.setState({
             islinkclicked: true
           })
           }

         }
         else {
            if(responsestatus==="S")
            {
              responsestatus=undefined;
            }
        }
       //}
     //}
   }
   catch (error) {

     Log4r.log('Error......', error);
   }

}
// currently used
ClearFormsData(leafIds){
  Log4r.log("CLEARING SECTION",leafIds);
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

  for(let i = 0; i < holdNamess.screendata.length; i++)
  {
    if(resSecIdKeys.includes(holdNamess.screendata[i].sessionID))
    {
      for(let j = 0; j < holdNamess.screendata[i].uiSchema[0].children.length; j++)
      {
        if(holdNamess.screendata[i].uiSchema[0].children[j].children.widget !== "table" &&  holdNamess.screendata[i].uiSchema[0].children[j].children.widget !== "popsearch" )
        {
          for (let l = 0; l < Object.keys(holdNamess.screendata[i].formData[0]).length; l++)
          {
            if(Object.keys(holdNamess.screendata[i].formData[0])[l] == holdNamess.screendata[i].uiSchema[0].children[j].children.fieldPath)
            {
              let formDataObject = holdNamess.screendata[i].formData[0][Object.keys(holdNamess.screendata[i].formData[0])[l]];
              formDataObject.data = "";
              break;
            }
          }
        }
        else if (holdNamess.screendata[i].uiSchema[0].children[j].children.widget == "popsearch")
        {
          for (let l = 0; l < Object.keys(holdNamess.screendata[i].formData[0]).length; l++)
          {
            if(Object.keys(holdNamess.screendata[i].formData[0])[l] == holdNamess.screendata[i].uiSchema[0].children[j].children.fieldPath)
            {
              let formDataObject = holdNamess.screendata[i].formData[0][Object.keys(holdNamess.screendata[i].formData[0])[l]];
              formDataObject.data = "";
              formDataObject.desc = "";
              break;
            }
          }
        }
        else if (holdNamess.screendata[i].uiSchema[0].children[j].children.widget == "table")
        {
          for (let l = 0; l < Object.keys(holdNamess.screendata[i].formData[0]).length; l++)
          {
            Log4r.log("Object.keys(holdNamess.screendata[i].formData[0])",Object.keys(holdNamess.screendata[i].formData[0]),l);
            if(Object.keys(holdNamess.screendata[i].formData[0])[l] == holdNamess.screendata[i].uiSchema[0].children[j].children.fieldPath)
            {
              let formDataObject = holdNamess.screendata[i].formData[0][Object.keys(holdNamess.screendata[i].formData[0])[l]];
              formDataObject.data.DataSource = [];
              try {
                 var detailsectionidmatch =  holdNamess.screendata.filter(items => items.sessionID === formDataObject.data.detailsectionid)[0];
                 if(detailsectionidmatch != null) {
                   this.ClearFormsData(detailsectionidmatch.sessionID);
                 } else {
                   let dependantSections = new Model().getLeaf(formDataObject.data.detailsectionid);
                   Log4r.log("dependantSections",dependantSections);
                     if(dependantSections)
                     {
                       for (let m = 0; m < dependantSections.length; m++)
                       {
                         var detailsectionidmatch =  holdNamess.screendata.filter(items => items.sessionID ===  Object.keys(dependantSections[m])[0])[0];
                         this.ClearFormsData(Object.keys(dependantSections[m])[0]);
                       }
                     }
                   }
                 } catch(e) {
                   Log4r.error(e)
                 }

                break;
            }
          }
        }
        else
        {
          Log4r.log("Other Widget ?",holdNamess.screendata[i].uiSchema[0].children[j].children.widget);
        }
      }
    }
  }
}


// currently not used
ClearFormData(sesHeadr)
{
  //Log4r.log("sabgdkjhsadh.......",sesHeadr,holdNamess);
  var deleteFlag=false;
  var detailsectonToClear;
  var leafSectionIdsOfParent;
    for(var i=0;i<holdNamess.screendata.length;i++)
      {
        for(var j=0;j<holdNamess.screendata[i].formData.length;j++)
         {
         var KeyArray=Object.keys(holdNamess.screendata[i].formData[j]);

         if(holdNamess.screendata[i].uiSchema[0].children[0].children.widget === "table"){
           //Log4r.log("jhasgdgsad.......",holdNamess.screendata[i].uiSchema[0].children[0]);
           if(holdNamess.screendata[i].sessionID === sesHeadr){
             // Log4r.log("jhasgduyagdujagd........",holdNamess.screendata[i]);
             // Log4r.log("hdkjahdikhad.......",holdNamess.screendata[i].formData[0][sesHeadr].data.detailsectionid,sesHeadr);
             detailsectonToClear = holdNamess.screendata[i].formData[0][sesHeadr].data.detailsectionid;
             //Log4r.log("sabgdhsagd.......",detailsectonToClear);
             leafSectionIdsOfParent = new Model().getLeaf(detailsectonToClear);
             //Log4r.log("sahdjhsakdhsadh........",leafSectionIdsOfParent);
             // Log4r.log("shgdjhshjsh......",GlobalHelper.globlevar['assortedMapOfParent']);
             // Log4r.log("sahgdiahskjd.......",,GlobalHelper.globlevar['assortedMapOfLeaf']);
          }
         }

         if(holdNamess.screendata[i].uiSchema[0].children[0].children.widget !== "table")
         {
           for (var k = 0; k < KeyArray.length; k++)
             {
               let widget = undefined;
               if(holdNamess.screendata[i].uiSchema[0].children.filter(item=>item.children.fieldPath === KeyArray[k])[0]){
                 widget = holdNamess.screendata[i].uiSchema[0].children.filter(item=>item.children.fieldPath === KeyArray[k])[0].children.widget;
               }
              //Log4r.log("WIDGET FIND",widget);
              if(widget !== "table" && widget !== "hidden" && widget !== undefined)
              {
                // Log4r.log("WIDGET:",widget);
                // Log4r.log("FIELDPATH:",KeyArray[k]);
                // Log4r.log("FORMDATA OBJECT:",holdNamess.screendata[i].formData[j]);
              if(GlobalHelper.globlevar['addrow'] == "true") // section should clear if Gridsummery link will click
              {
                //Log4r.log("shdkjsjd..........1",detailsectonToClear,holdNamess.screendata[i]);
                if(detailsectonToClear != null && holdNamess.screendata[i].sessionID === detailsectonToClear){
                  //Log4r.log("detailsectonToClear TO CLEAR",detailsectonToClear);
                    if(holdNamess.screendata[i].formData[j][KeyArray[k]].desc!== undefined)
                    {
                      holdNamess.screendata[i].formData[j][KeyArray[k]].desc=[];
                    }
                    holdNamess.screendata[i].formData[j][KeyArray[k]].data='';

                }else if(leafSectionIdsOfParent != null && leafSectionIdsOfParent.length != 0){
                  //Log4r.log("sections to be clear.....",leafSectionIdsOfParent);
                  for(let i=0;i<leafSectionIdsOfParent.length;i++){
                    let detalsection=Object.keys(leafSectionIdsOfParent[i])[0];
                    //Log4r.log("detalsection to clear.......",detalsection);
                    holdNamess.screendata.map((item,index)=>{
                      if(detalsection === item.sessionID){
                        //Log4r.log("sbgjhgshfg.......",item.formData[0]);
                        let keyObjarr = Object.keys(item.formData[0]);
                        for(let g=0;g<keyObjarr.length;g++){
                          if(item.formData[0][keyObjarr[g]].desc!== undefined)
                          {
                            item.formData[0][keyObjarr[g]].desc=[];
                          }
                          if(item.formData[0][keyObjarr[g]].data != null){
                            item.formData[0][keyObjarr[g]].data='';
                          }
                          if(typeof(item.formData[0][keyObjarr[g]]) === "string" ){
                            item.formData[0][keyObjarr[g]] = [];
                          }
                        }
                      }
                    })
                  }
                }
              }
              else
              {
                //Log4r.log("shdkjsjd..........2");
                // section will in default state if clear / submite button clicked.
                preData.forEach(function(value, key){
                  if(key===KeyArray[k])
                  {
                    holdNamess.screendata[i].formData[j][KeyArray[k]].data=value;
                    deleteFlag=true;
                  }
                })
                if(!deleteFlag)
                {
                  if(holdNamess.screendata[i].formData[j][KeyArray[k]].desc!== undefined)
                  {
                    holdNamess.screendata[i].formData[j][KeyArray[k]].desc=[];
                  }
                  holdNamess.screendata[i].formData[j][KeyArray[k]].data='';
                }
                else
                {
                  deleteFlag=false;
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
         else if(holdNamess.screendata[i].uiSchema[0].children[0].children.widget === "table"){
            Log4r.log("holdNamess.screendata[i].uiSchema[0].children[0].children.widget",holdNamess.screendata[i].uiSchema[0].children[0].children.widget);
            let fpath = holdNamess.screendata[i].uiSchema[0].children[0].children.fieldPath;
            Log4r.log(fpath);
            Log4r.log(holdNamess.screendata[i].formData[j]);
            Log4r.log("",JSON.stringify(holdNamess.screendata[i].formData[j]));
            let len = holdNamess.screendata[i].formData[j][fpath].data.DataSource.length;
            Log4r.log("len===",len);
            let dsArr = [];
            let count2 = 0;
            for (var k = 0; k < len; k++) {
              if (holdNamess.screendata[i].formData[j][fpath].data.DataSource[k].flagOnClearButton === true) {
                GlobalHelper.globlevar['setValInGridRender'].push(fpath);
              }
              else {
                dsArr[count2] = JSON.parse(JSON.stringify(holdNamess.screendata[i].formData[j][fpath].data.DataSource[k]));
                count2++;
              }
            }
            holdNamess.screendata[i].formData[j][fpath].data.DataSource = dsArr;
          }
        }
    }

    /*if( GlobalHelper.globlevar['addrow'] == "true") // section should clear if Gridsummery link will click
    {
        GlobalHelper.globlevar['addrow'] = "false";
    }*/
}

/*Sprint 17 : [Task 12] : [START]  Added method to check wether data is changed or not */
checkNothingToSave()
{
  let tempchk=true;
  let chk=true;


  if( GlobalHelper.globlevar['checkNothingToSave'] === true)
  {
    GlobalHelper.globlevar['checkNothingToSave'] = false;



  for(var i=0;i<namess.screendata.length;i++)
  {
  if(firstRenderScreen != undefined)
	if(firstRenderScreen.screendata != undefined)
    for(var j=0;j<firstRenderScreen.screendata.length;j++)
        {
          if(namess.screendata[i].sessionID===firstRenderScreen.screendata[j].sessionID)
          {
            Object.keys(firstRenderScreen.screendata[j].formData[0]).map((item,index)=>{    // NOSONAR: javascript:S2201

            let widgetType = "";
            try{
            widgetType=firstRenderScreen.screendata[j].uiSchema[0].children.filter(widgetName => widgetName.children.fieldPath === item)[0].children.widget;
           }catch(e){Log4r.error(e)}
            if(widgetType!=="table")
            {
              //Log4r.log("WIDGET CHECK",firstRenderScreen.screendata[j].uiSchema[0].children.filter(widgetName => widgetName.children.fieldPath === item)[0].children.widget);
              //Log4r.log("CHECK VALUES IN NAMES",namess.screendata[i].formData[0][item].data);
              //Log4r.log("CHECK VALUES IN PRESET",firstRenderScreen.screendata[j].formData[0][item].data);
              if(namess.screendata[i].formData[0][item].data!==undefined && firstRenderScreen.screendata[j].formData[0][item].data !== undefined)
              {
                //Log4r.log("DATA NOT UNDFINED !",namess.screendata[i].formData[0][item].data.length);
                //Log4r.log("DATA NOT UNDFINED FIRST TIME RENDERED FORM !",firstRenderScreen.screendata[j].formData[0][item].data.length);
                if(namess.screendata[i].formData[0][item].data.length<=1)
                {
                  if(Array.isArray(namess.screendata[i].formData[0][item].data) && namess.screendata[i].formData[0][item].data.length===0)
                  {
                    //Log4r.log("DATA CHECK data=[] ",namess.screendata[i].formData[0][item].data);
                    tempchk=true;
                  }
                  else if(Array.isArray(namess.screendata[i].formData[0][item].data))
                  {
                    if(namess.screendata[i].formData[0][item].data[0]!==undefined){
                      if(namess.screendata[i].formData[0][item].data[0].length===0)
                      {
                        //Log4r.log("DATA CHECK data=[''] ",namess.screendata[i].formData[0][item].data);
                        tempchk=true;
                      }
                    }

                  }
                  else if(namess.screendata[i].formData[0][item].data.length===0 && firstRenderScreen.screendata[j].formData[0][item].data.length===0)
                  {
                    //Log4r.log("DATA CHECK data=''",namess.screendata[i].formData[0][item].data);
                    tempchk=true;
                  }
                  else if(namess.screendata[i].formData[0][item].data.length===0 && firstRenderScreen.screendata[j].formData[0][item].data.length!==0)
                  {
                    //Log4r.log("DATA CHECK data=['SOMETHING VALUE']",namess.screendata[i].formData[0][item].data);
                    tempchk=false;
                  }
                }
                else
                {
                  if(Array.isArray(namess.screendata[i].formData[0][item].data))
                  {
                      if(JSON.stringify(namess.screendata[i].formData[0][item].data)===JSON.stringify(firstRenderScreen.screendata[j].formData[0][item].data))
                      {
                        //Log4r.log("DATA CHECK WITH DEFAULT VALUES",namess.screendata[i].formData[0][item].data);
                        tempchk=true;
                      }
                      else
                      {
                        tempchk=false;
                      }
                  }
                  else
                  {
                    //Log4r.log("DATA CHANGED !",namess.screendata[i].formData[0][item].data);
                    tempchk=false;
                  }
                }


                if(namess.screendata[i].formData[0][item].data.length!==0 && typeof namess.screendata[i].formData[0][item].data !== typeof [])
                {
                  //Log4r.log("SOMETHING NEWLY ADDED",namess.screendata[i].formData[0][item].data);
                  if(widgetType==="checkbox")
                  {
                    if(firstRenderScreen.screendata[j].formData[0][item].data[0]!=="Y")
                    {
                      if(namess.screendata[i].formData[0][item].data==="N")
                      {
                        //Log4r.log("DATA CHECK WITH CHECKBOX VALUES AS N",namess.screendata[i].formData[0][item].data);
                        tempchk=true;
                      }
                      else
                      {
                        tempchk=false;
                      }
                    }
                    else
                    {
                      if(namess.screendata[i].formData[0][item].data!==firstRenderScreen.screendata[j].formData[0][item].data[0])
                      {
                        //Log4r.log("DATA CHECK WITH CHECKBOX AS VALUE CHANGED",namess.screendata[i].formData[0][item].data);
                        tempchk=false;
                      }
                      else
                      {
                        //Log4r.log("CHECKBOX VALUE IS SAME",namess.screendata[i].formData[0][item].data,firstRenderScreen.screendata[j].formData[0][item].data[0]);
                        tempchk=false;
                      }
                    }

                  }
                  else
                  {
                    if(JSON.stringify(namess.screendata[i].formData[0][item].data)===JSON.stringify(firstRenderScreen.screendata[j].formData[0][item].data)) {
                      //Log4r.log("DATA CHECK WITH DEFAULT VALUES",namess.screendata[i].formData[0][item].data);
                      tempchk=true;
                    }
                    else if (namess.screendata[i].formData[0][item].data.length!==0 && typeof firstRenderScreen.screendata[j].formData[0][item].data === typeof [] && firstRenderScreen.screendata[j].formData[0][item].data[0] !==undefined ) {
                      if(namess.screendata[i].formData[0][item].data===firstRenderScreen.screendata[j].formData[0][item].data[0])
                      {
                        //Log4r.log("DATA CHECK WITH DEFAULT VALUES AND CHANGED TO SAME VALUE",namess.screendata[i].formData[0][item].data);
                        tempchk=true;
                      }
                      else
                      {
                        tempchk=false;
                      }
                    }
                    else
                    {
                      tempchk=false;
                    }
                  }

                }
              }
              else
              {
                //Log4r.log("DATA CHECK WITH data=undefined ",namess.screendata[i].formData[0][item].data);
                tempchk=true;
              }
            }
            else
            {
              //Log4r.log("WIDGET CHECK",firstRenderScreen.screendata[j].uiSchema[0].children.filter(widgetName => widgetName.children.fieldPath === item)[0].children.widget);
              //Log4r.log("CHECK VALUES IN NAMES",namess.screendata[i].formData[0][item].data);
              //Log4r.log("CHECK VALUES IN PRESET",firstRenderScreen.screendata[j].formData[0][item].data);
              if(widgetType==="table")
              {
                if(namess.screendata[i].formData[0][item].data.DataSource.length!==0)
                {
                  for (var k = 0; k < namess.screendata[i].formData[0][item].data.DataSource.length; k++)
                  {
                    //Log4r.log("DATA SOURCE",namess.screendata[i].formData[0][item].data.DataSource[k]);
                    if(namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('mode') && namess.screendata[i].formData[0][item].data.DataSource[k].mode!==undefined )
                    {
                      if(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k]!==undefined)
                      {
                        //Log4r.log("DATA SOURCE NAMES C",namess.screendata[i].formData[0][item].data.DataSource[k]);
                        //Log4r.log("DATA SOURCE FIRST RENDER SCREEEN C",firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k]);
                        let temptablechk=true;
                        for (var x = 0; x < Object.keys(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k]).length; x++) {
                            for (var y = 0; y < Object.keys(namess.screendata[i].formData[0][item].data.DataSource[k]).length; y++) {
                              if(Object.keys(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x]!=="errorList" && Object.keys(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x]!=="holdForChngObj")
                              {
                                if(Object.keys(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x] === Object.keys(namess.screendata[i].formData[0][item].data.DataSource[k])[y])
                                {
                                  let sfpath=""; sfpath=Object.keys(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k])[x];
                                  let ospath=""; ospath=Object.keys(namess.screendata[i].formData[0][item].data.DataSource[k])[y];
                                  //Log4r.log("CDATA ORIGINAL",firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k][sfpath]);
                                  //Log4r.log("CDATA NAMES",namess.screendata[i].formData[0][item].data.DataSource[k][ospath]);
                                  if(firstRenderScreen.screendata[j].formData[0][item].data.DataSource[k][sfpath]!==namess.screendata[i].formData[0][item].data.DataSource[k][ospath])
                                  {
                                    temptablechk=false;
                                  }
                                  else
                                  {
                                    temptablechk=true;
                                  }
                                  //Log4r.log("TEMP TABLE CHECK",temptablechk);
                                  break;
                                }
                              }
                            }
                          tempchk=(temptablechk&&tempchk);
                          //Log4r.log("TABLE TEMP CHECK",tempchk);
                          }
                      }
                      else
                      {
                        if(namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('mode') && namess.screendata[i].formData[0][item].data.DataSource[k].mode!==undefined )
                        {
                          if(namess.screendata[i].formData[0][item].data.DataSource[k].mode==="I" || namess.screendata[i].formData[0][item].data.DataSource[k].mode==="U")
                          {
                            tempchk=false;
                          }
                        }
                      }

                    }
                    else
                    {
                      if(namess.screendata[i].formData[0][item].data.DataSource[k].hasOwnProperty('modifiedmode') && namess.screendata[i].formData[0][item].data.DataSource[k].modifiedmode!==undefined )
                      {
                        tempchk=false;
                      }
                    }
                  }
                }
              }
            }

            //Log4r.log("CHK",chk);
            //Log4r.log("TEMPCHK",tempchk);
            chk=(chk&&tempchk);
            //Log4r.log("NOW CHK MAIN",chk);
            });
            break;
          }
        }
   }

    Log4r.log("CHECK FINAL",chk);
    //if(!chk)
    //{
       var originaljson = JSON.stringify(namess.screendata);
       var updatedJson = JSON.stringify(firstRenderScreen.screendata);
       let checkNothingToSaveFlag = true;
      if(originaljson !== updatedJson )
      {
        /*for(var i=0 ; i <namess.screendata.length ; i++ ){
          Log4r.log("namess.screendata[i].uiSchema[0].children[0].children.widget",namess.screendata[i].uiSchema[0].children[0].children.widget);
          if( namess.screendata[i].uiSchema[0].children[0].children.widget === "table")
          {
            let fieldPath = namess.screendata[i].uiSchema[0].children[0].children.fieldPath;
            var data1 = JSON.stringify(namess.screendata[i].formData[0][fieldPath].data.DataSource);
            var data2 = JSON.stringify(firstRenderScreen.screendata[i].formData[0][fieldPath].data.DataSource);
            Log4r.log("DATA........",data1,data2);
            if(data1 !== data2){
            checkNothingToSaveFlag =  false;
            }
          }
        }*/
       return chk;
      }
    //}
  }
  return chk;
}
/*Sprint 17 : [Task 12] : [END] */

//Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
redirectingToPrevScreenOnClosingClipScreen(pathtoredirect){
  if(pathtoredirect === "CloseUIScreen_ClipSearch"){
    closepath = undefined;
    GlobalHelper.globlevar['WrappedTableContainerObject'].onRowClick(GlobalHelper.globlevar['expandablerecord'],GlobalHelper.globlevar['expandableindex'],GlobalHelper.globlevar['expandableevent']);

    GlobalHelper.globlevar['ClipSearchViaWorklist'] = false;
    GlobalHelper.globlevar['ClipSearchViaUIScreen'] = false;
    GlobalHelper.globlevar['ClipSearchViaPrompMode'] = false;
    GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = false;
    GlobalHelper.globlevar['promptmode'] = null;

    Log4r.log("data container.........",GlobalHelper.storeapFunction,GlobalHelper.storeapKey,GlobalHelper.storeMap);
    let values = GlobalHelper.storeapFunction.substring(GlobalHelper.storeapFunction.indexOf("$")+1);
    Log4r.log("lay fun.....",values);

  }
  else if(pathtoredirect === "ClosePromptScreen_ClipSearch"){
    closepath = undefined;
    GlobalHelper.globlevar['ClipSearchViaPrompMode'] = false;
    GlobalHelper.globlevar['MainLayoutObject'].MyFuncLeft(GlobalHelper.globlevar["LeftMenuClickedData"]);

    GlobalHelper.globlevar['ClipSearchViaWorklist'] = false;
    GlobalHelper.globlevar['ClipSearchViaUIScreen'] = false;
    GlobalHelper.globlevar['ClipSearchViaPrompMode'] = false;
    GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = false;
    GlobalHelper.globlevar['promptmode'] = null;

    Log4r.log("data container.........",GlobalHelper.storeapFunction,GlobalHelper.storeapKey,GlobalHelper.storeMap);
    let values = GlobalHelper.storeapFunction.substring(GlobalHelper.storeapFunction.indexOf("$")+1);

    Log4r.log("lay fun.....",values);
  }
}//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.

handleClick(label,sesHeadr,buttonId)
{
	Log4r.log("handleClick(label,sesHeadr)",label,sesHeadr,buttonId);
	buttonIdOnsave = buttonId;
  if(sesHeadr != undefined && sesHeadr.buttonCategory == "STANDARD" ||   GlobalHelper.globlevar.clearButtonclick === "true")
  {
  GlobalHelper.globlevar.clearButtonclick = undefined;
  var x = new Map();
	if( "CLOSE" === label || "close" === buttonId)
	{
	  ErrorHandler.clear();
	  this.callClose();
	}
	else if( "SAVE & NEXT" === label || "saveandnext" === buttonId)
	{
	   this.callSave();
	   temlabel="SAVE & NEXT";
	   //uiNextButtonHandler(label);
	   //GlobalHelper.globlevar.linkclicked = false;
	}
	else if( "SAVE" === label || "SUBMIT" === label || "submit" === buttonId || "save" === buttonId || "DONE" === label || "btnDone" === buttonId){
		let tempVar = ErrorHandler.getstatusES();
		if (tempVar == 's')
		{
			responsestatus = undefined;
			let tmpvvv = undefined;
			ErrorHandler.setstatusES(tmpvvv);
			ErrorHandler.setErrMessage(tmpvvv);
			ErrorHandler.setType(tmpvvv);
		}
		if("SUBMIT" === label || "submit" === buttonId){
			calledFromSubmit = true;
		}else{
			calledFromSubmit = false;
		}

		this.callSave();
	}
  else if ("ClickGridAddButton" === label)    //&& GlobalHelper.globlevar.detectFirstChangeOnScrn
  {
    //Click Grid Add Button In case of DetailssectionId
    Log4r.log("gsakdjasdh..........",label,sesHeadr,buttonId);
    // earlier handling starts
          preData.clear();
          if (sesHeadr !== "sesHeadr") {
            if(buttonId !== "addRowtoGrid")
            {
                ErrorHandler.clear();
            }

          }
          this.getPredefinedData(holdbasicdata.data[0].name);
          this.ClearFormsData(sesHeadr);
          if (sesHeadr)
          {
            this.handleAddCalled = true;
            if(GlobalHelper.globlevar.handleAddForCardLayout === true){
              GlobalHelper.globlevar.handleAddForCardLayout = undefined;

            }
          }else {
          this.clearTriggered = true;
          }
          this.isOnload = true;
          this.setState({clearForm:true,
                  isClearClicked:true});
           //-- earlier handling ends
          /*COMMENTED BELOW LINE to work Error Handleing for POPSEARCH.
                 Also tested popsearch clear even though below line commited.

                   //GlobalHelper.globlevar.popsearchclear = true;
                 */

    }

	else if ("CLEAR" === label || "clear" === buttonId)    //&& GlobalHelper.globlevar.detectFirstChangeOnScrn
  {

    let functionIdForRefresh = this.funcObjForRefresh.id;
    let functionNameForRefresh = this.funcObjForRefresh.desc;
    let objForFunctionDetails = this.funcObjForRefresh;
    this.myFunction(functionIdForRefresh,functionNameForRefresh,objForFunctionDetails);
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
	  else if (label==="NEXT" || label==="PREVIOUS" || "next" === buttonId || "previous" === buttonId)
	  {
		let tempVar = ErrorHandler.getstatusES();
		if (tempVar == 's')
		{
		  responsestatus = undefined;
		}
		 GlobalHelper.globlevar.linkclicked = false;
		if(TimeLineView)
		{
		  TimeLineView=false;
		  TimeLineWidth='0px';
		}

		ErrorHandler.clear();
		//nextPromtScreen();
		if(label == "NEXT" || "next" === buttonId)
		  {
				GlobalHelper.globlevar['shouldResettingMapInWrapper'] = true;
			uiNextButtonHandler(label);
		   }
		   else
		   {
         if(GlobalHelper.globlevar['lastRecordOfList'] === true){
           GlobalHelper.globlevar['lastRecordOfList'] = undefined;
         }
			   uiPreviousButtonHandler(label);
       }
		  Log4r.log("Next button trigger");
	  }

	else if ( "Add" === label)
	  {
		for (var i = 0; i < namess.screendata.length; i++)
		{
		  if(namess.screendata[i].sessionHeader == sesHeadr)
		  {
			var asd=(namess.screendata[i].sessionHeader).slice();
			asd=asd+"";
			var ss = asd.indexOf("$#@");
			if( ss== -1)
			{
			  namess.screendata[i].sessionHeader=asd.concat("$#@"+sesHeadCount);
			  sesHeadCount++;
			}
			var temppp=namess.screendata.slice(i,namess.screendata.length);
			namess.screendata[i]=JSON.parse(JSON.stringify(namess.screendata[i]));
			namess.screendata[i].sessionHeader=(namess.screendata[i].sessionHeader).slice(0,(namess.screendata[i].sessionHeader).indexOf("$#@")+3);
			namess.screendata[i].sessionHeader=namess.screendata[i].sessionHeader+sesHeadCount;
			sesHeadCount++;
			for(var j=0;j<temppp.length;j++)
			{
			  namess.screendata[i+1+j]=temppp[j];
			}
			break;
		  }
		}
		  this.setState({refresh:!this.state.refresh}) ;
	  }

	else if ( "fetch" === label || "Fetch" === label || "FETCH" === label || "fetch" === buttonId)
	  {
		for (var i = 0; i < namess.screendata.length; i++)
		{
		  if(namess.screendata[i].sessionHeader == sesHeadr)
		  {
			var ect=ErrorHandler.getErrCount();
			if(ect==0)
			{
			  var allDataArr=[];
			  for(var i=0;i<holdNamess.screendata.length;i++)
			  {
				var singleScreen={};
				for(var j=0;j<holdNamess.screendata[i].formData.length;j++)
				{
				  var kArr=Object.keys(holdNamess.screendata[i].formData[j]);
				  var jsObj={};
				  kArr.map((item,z)=>{    // NOSONAR: javascript:S2201
					if(holdNamess.screendata[i].uiSchema[j].children[z].children.widget=="table")
					{
					  var karr=Object.keys(holdNamess.screendata[i].formData[j][item].data);
					  var karr2 = karr.map(v => v.toLowerCase());
					  //Log4r.log("karrrrrrrrrr2=",karr2);
					  var locaton=karr2.indexOf("datasource");
					  if(locaton!=-1)
					  {
						var rowindex = 0;
						 for(var tabarr=0;tabarr<holdNamess.screendata[i].formData[j][item].data[karr[locaton]].length;tabarr++)
						 {
							 if(holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr].mode !== undefined)
							  {
								  for(var key in holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr])
								  {
									  if (holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr].hasOwnProperty(key))
									 {
										jsObj[holdNamess.screendata[i].uiSchema[j].children[z].children.xPath + "["+ tabarr+"]."+key ]=holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr][key];

										if(holdNamess.screendata[i].uiSchema[j].children[z].children.xPath == undefined)
										{
										  x.set("undefined_xPath["+ rowindex+"]."+key , holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr][key]);
										}
										else
										{
										  if(!key.startsWith("error"))
										  {
										  x.set(holdNamess.screendata[i].uiSchema[j].children[z].children.xPath + "["+ rowindex+"]."+key , holdNamess.screendata[i].formData[j][item].data[karr[locaton]][tabarr][key]);
										  }
										}
									 }
								  }
								  rowindex = rowindex + 1;
							  }
						 }
					  }else {
						Log4r.error("DataSource Not Found for table....");
					  }
					}else if (holdNamess.screendata[i].uiSchema[j].children[z].children.widget=="popsearch")
					{
					  jsObj[item]=holdNamess.screendata[i].formData[j][item].data.code;


					  Object.keys(holdNamess.screendata[i].formData[j][item].data).map((iter,k)=>     // NOSONAR: javascript:S2201
					  {
						jsObj[iter]=holdNamess.screendata[i].formData[j][item].data[iter];
						x.set(holdNamess.screendata[i].uiSchema[j].children[z].children.xPath, holdNamess.screendata[i].formData[j][item].data[iter]);

					  })
					}
					else {
					  if(holdNamess.screendata[i].uiSchema[j].children[z].children.xPath == undefined)
					  {
						x.set('undefined_xPath['+z+']', holdNamess.screendata[i].formData[j][item].data);
					  }
					  else
					  {
						x.set(holdNamess.screendata[i].uiSchema[j].children[z].children.xPath, holdNamess.screendata[i].formData[j][item].data);
					  }
					  jsObj[holdNamess.screendata[i].uiSchema[j].children[z].children.xPath]=holdNamess.screendata[i].formData[j][item].data;
					}

				  })
				}
				singleScreen[holdNamess.screendata[i].sessionHeader]=jsObj;
				allDataArr[i]=singleScreen;
			  }

			  var queryString = "";
			   x .forEach((value, key, map) =>{

					if(key!== undefined)
					{
					  queryString = queryString +`${key}=${value}&`;
					}
				});
			  var values =  { "domaindata":queryString.slice(0, -1)};
			  //store.dispatch({type: 'SECTIONFETCH',values});
			  store.dispatch({type: 'LAYOUTTOPICON',values});
			  //LAYOUTTOPICON
		  }else {
			  Log4r.log("Please .. Remove errors.....");
			}
			break;
		  }
		}
		  this.setState({refresh:!this.state.refresh}) ;
	  }
	else if(label==='SAVE & CLOSE' || "saveandclose" === buttonId){

		shouldCloseBeCalled = true;
		Log4r.log("Inside save and close");
		this.callSave();
    }

	else if(label==='SaveAsDraft' || "saveasdraft" === buttonId)
	  {
		Log4r.log("Inside SaveAsDraft button clicked... ");
		GlobalHelper.globlevar['SaveAsDraftClicked'] = true;
		// ---------------------------
		 let values = "";
		 GlobalHelper.globlevar['namess'] = namess;
		 if(  GlobalHelper.globlevar['summaryConfigType_save'] ==  true)
		 {
		  values = generateQueryStrFuncationbaselayout(holdNamess)
		 }
		 else
		 {
		   values = generateQueryStr(holdNamess);
		 }
		 Log4r.log(" values " , values);

		 store.dispatch({type: 'SAVEASDRAFT',values});
		//------------------------------------

	  }

	else if(label==='FetchDraft' || "fetchdraft" === buttonId)
	  {
		Log4r.log("Inside FetchDraft button clicked... ");
		let values = "";
		GlobalHelper.globlevar['namess'] = namess;
		 if(  GlobalHelper.globlevar['summaryConfigType_save'] ==  true)
		 {
		  values = generateQueryStrFuncationbaselayout(holdNamess)
		 }
		 else
		 {
		   values = generateQueryStr(holdNamess);
		 }
		Log4r.log(" values " , values);
		store.dispatch({type: 'GETDRAFTDATA',values});
		//------------------------------------

	  }
    else {
      this.changeRefreshERROR();
    }
	}else if(sesHeadr != undefined && sesHeadr.buttonCategory == "CUSTOMIZED"){
		Log4r.log("Custom Function Called");
		// var custfun = new custutils();
		// let custfunction=sesHeadr.eventName;
    //     let json = custfun["customOnChange"](custfunction);
        this.changeRefreshERROR();
	}
}

customHelpFunctions(){
	Log4r.log("Custom Function Called");
	var custfun = new custutils();
	let json = custfun["customOnHelp"]('COLLECTION.helpCustomFunctions');
}

setClassArrow(index,activeness)
{
  if(activeness=="yes" && countArrow==0 )
  {
  return stylesfu.arrowleft;
}
else if(index==Arrow)
{
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
  Log4r.error(error);
  Log4r.log(info);
  this.setState({ hasError: true });
}


alertmessage()
{
  /*Log4r.log('alertmessage' , responsestatus);
  Log4r.log('alertmessage names ' , names);

        if(this.props.outnames.data !== undefined)
        {
         if(this.props.outnames.data.length > 1)
          {
            if(responsestatus === 'S')
            {
              ErrorHandler.setstatusES("s");
              ErrorHandler.setErrMessage("SAVED Successfully...");
              var rfsh = this.state.refreshERROR;
                 this.setState({
                  refreshERROR:!rfsh,
                   })
               return(<Alert message="Success..." type="success"  closable/>);
            }
            else  if(responsestatus  === 'E')
            {
              ErrorHandler.setstatusES("e");
              ErrorHandler.setErrMessage("Error....");
              var rfsh = this.state.refreshERROR;
               this.setState({
                  refreshERROR:!rfsh,
                   })
               return( <Alert type="error" message="Error...." closable/> );
            }
          }
        }

        if(responsestatus === 'S')
            {
               return(<Alert message="Success..." type="success"  closable/>);
            }
            else  if(responsestatus  === 'E')
            {
             return( <Alert type="error" message="Error...." closable/> );
            }*/


            if(gridsavestatus)
            {
             //return( <Alert type="error" message="Error...." closable/> );
             gridsavestatus = undefined;
             responsestatus = undefined;
              return(<Alert message="Warning Please click on Grid save." type="warning" showIcon closable/>);
            }

}

rowLinkClick(namess)
{
/* Spring 7 TASK 74 Asset summery screen used with new UI Grid - Card layout  */
var detailsectionidsmap = new Map();
var detailsectionidsmapvalue = new Map();
var parentAndChildMapkey = new Map();
namess.screendata.map((item,i)=>{
  for(let key in item.formData[0]){
    if(key != null && key != "" && item.formData != null){
      if(item.formData[0].hasOwnProperty(key)){
        if(item.formData[0][key].data != null){
          let detailSectionId = item.formData[0][key].data.detailsectionid;
          //Log4r.log("gduagd....",detailSectionId);
          //Log4r.log("kjsahdkjshf........",item.sessionID);
          //Log4r.log("namessjdslkfjlkdsf......",namess.screendata);
          if(detailSectionId != null && detailSectionId != "" ){
             //section level button in case of addrowtoGrid configuration
             let addRowtoGridSectionButton = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"addRowtoGrid\",\"title\": \"AddToGrid\",\"fname\": \"updateRowToGrid\"},{\"id\": \"editRowtoGrid\",\"title\": \"UpdateRow\",\"fname\": \"updateRowToGrid\"}]}";
             var addrowbuttonjson = JSON.parse(addRowtoGridSectionButton);
             if(addrowbuttonjson != null && addrowbuttonjson.buttons != null){
                addrowbuttonjson.buttons.map((sectionButtonObj,index)=>{
                 sectionButtonObj['parentSectionId'] = item.sessionID;
                })
              }
             //Log4r.log("agdgad.......",addrowbuttonjson);
             var buttonAdd = item.formData[0][key].data.Columns.filter(colitem => (colitem.title == "add" || colitem.style == "add") )[0]
             if( buttonAdd == undefined)
             {    // removing add button from json bez Grid is not contain add button
                  //delete addrowbuttonjson.buttons[0];
                  addrowbuttonjson.buttons.splice(0, 1);
             }

             try{
              // below code set as hidden if details section id itself match with some other section ID.
              var detailsectionidmatch =  namess.screendata.filter(items => items.sessionID ===  detailSectionId)[0];
              if(detailsectionidmatch != null)
              {
                 if(item.formData[0][key].data.addThroughSummGrid === "true")
                  {
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
                  }
                  detailsectionidmatch['hidden'] = "true";
              }
             }catch(e){Log4r.error(e)}

             this.hasDetailSection = true;
             var parentnodemap  = new Model();
              if(parentnodemap.getLeaf(detailSectionId) != undefined && parentnodemap.getLeaf(detailSectionId) != null && parentnodemap.getLeaf(detailSectionId) != ""){
                var leaf = parentnodemap.getLeaf(detailSectionId);
                for (var id in leaf) {
                  for (var pkey in leaf[id]) {
                      if(item.formData[0][key].data.addThroughSummGrid === "true" && item.formData[0][key].data['addedAddrowtoGridButton'] !== true)
                      {
                        let detailsectionidadd = namess.screendata.filter(items => items.sessionID ===  pkey)[0];
                        if(detailsectionidadd['hidden'] !== true)
                        {
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

                       detailsectionidsmap.set(pkey ,item.sessionID);
                       if(detailsectionidsmapvalue.get(item.sessionID) == undefined){
                            detailsectionidsmapvalue.set(item.sessionID,pkey );
                       }
                       else{
                          let prevalue = detailsectionidsmapvalue.get(item.sessionID) + ","+    pkey;
                          detailsectionidsmapvalue.set(item.sessionID, prevalue);
                       }
                  }
                }
              }
              else{
                   detailsectionidsmap.set(detailSectionId ,item.sessionID);
                   detailsectionidsmapvalue.set(item.sessionID,detailSectionId );
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
this.changeAppearance(namess,parentAndChildMapkey);
}

changeAppearance(namessObj , parentAndChildMapkey){
Log4r.log("keys of map are ", parentAndChildMapkey);
let keys =[ ...GlobalHelper.globlevar['detailsectionidsmap'].keys() ];
Log4r.log("keys array is ",keys);
let screenData = namessObj.screendata;
namess['addtoGridJsons'] = {};
namess['parentGridXpathAndsessionID'] = new Map();
//namess['parentGridlength'] = new Map();

let cardLayoutInclusion = false;
try {
    let breakpoint = false;
    for (let p = 0; p < namessObj.screendata.length; p++) {
        if (breakpoint) {
            break;
        } else {
            for (let q = 0; q <namessObj.screendata[p].uiSchema[0].children.length; q++) {
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

keys.map((item,i)=>{    // NOSONAR: javascript:S2201
  let specificSection = {};
  var arr = [];
  var tempjson = {};
  for (let j=0 ;j<screenData.length;j++)
  {
    for(let widgetIdentify= 0 ; widgetIdentify < screenData[j].uiSchema[0].children.length; widgetIdentify++ )
    {

      if(screenData[j].uiSchema[0].children[widgetIdentify]['children'].widget === "table" )
      {
        namess['parentGridXpathAndsessionID'].set(screenData[j].uiSchema[0].children[widgetIdentify]['children'].fieldPath,screenData[j].uiSchema[0].children[widgetIdentify]['children'].xPath);
      }
    }

    if(screenData[j].sessionID == item){

      try{

         if(namess['addtoGridJsons'][parentAndChildMapkey.get(item)] !== undefined)
         {
             let isSectionAvailable = false;
             var jsonobj = {}
             for(let k = 0 ; k < namess['addtoGridJsons'][parentAndChildMapkey.get(item)].length ; k++)
             {
                  jsonobj = namess['addtoGridJsons'][parentAndChildMapkey.get(item)][k];
                  if(jsonobj['sessionID'] === item)
                  {
                    isSectionAvailable = true;
                  }
             }
             if(!isSectionAvailable)
             {
                  namess['addtoGridJsons'][parentAndChildMapkey.get(item)].push(screenData[j]);
             }
         }
         else
         {
                  arr.push(screenData[j]);
                  tempjson[parentAndChildMapkey.get(item)] = arr;
                  namess['addtoGridJsons'] = tempjson
         }
        }
        catch(e){Log4r.error(e)}

        //Log4r.log("parentAndChildMapkey.get(item) " , parentAndChildMapkey.get(item));
        var objectGrid = screenData.filter(items => items.sessionID ===  parentAndChildMapkey.get(item))[0];
        if(objectGrid != null && objectGrid.formData[0][parentAndChildMapkey.get(item)].data.addThroughSummGrid === "true")
        {
          //alert("addThroughSummGrid");
          screenData[j]['addRowtoGridSection'] = parentAndChildMapkey.get(item);
        }

      specificSection = screenData[j];
      break;
    }
  }

  if(specificSection.layoutSize !== "oneThird" && specificSection.layoutSize !== "GridTwoThird"){
        specificSection['hidden'] = "true";
        if(cardLayoutInclusion === true){
          if(specificSection.layoutSize == undefined) {
            specificSection['layoutSize'] = "half";
          } else if(specificSection.layoutSize !== "half"){
           specificSection['layoutSize'] = "GridTwoThird";
          }
        }

        /* Sprint- 12 Task - 80 Hidden all data which is dependable even though data is their as per request by Kuntal and descuss
            with Nilesh for LOS Bankdeatil demo*/
        try{
             if(specificSection.uiSchema[0].children[0].children.widget !== "table" && specificSection.uiSchema[0].children[0].children.widget !== "hidden" )
             {
                  for(let k=0;k<specificSection.formData.length;k++)
                  {
                      let KeyArray=Object.keys(specificSection.formData[k]);
                      for (let n = 0; n < KeyArray.length; n++)
                      {
                            specificSection.formData[k][KeyArray[n]].data='';
                      }
                  }
              }
          }
          catch(e){Log4r.error(" Error @@@@. " , e)}
  }
})
}


callSave(){

   if(ErrorHandler.getErrCount() == 0)
      {
       let ruleUtilityObject = new RuleExecutionUtility(namess,this.targetToRulesMapper,this.ruleToTargetsMapper,this.fieldInExpressionToRulesMapper,this.defaultValueManagerMap,this.ruleExecutionStatusMap,this.throwValidationRulesArray,this.fieldsChangedForRuleExecution,this.isOnload,);
       let onlyThrowValidationError = true;
       namess=ruleUtilityObject.executeRules(onlyThrowValidationError);
      }
  screenPostSaveTime = new Date().getTime();
  GlobalHelper.globlevar['SecondSpendOnScreen'] = ""+((screenPostSaveTime - screenLoadStartTime )/1000);
  Log4r.log("Total Worked on Screen by user in seconds " ,GlobalHelper.globlevar['SecondSpendOnScreen'] );
  this.moveBeyondSaveFunctionality = true;
  Log4r.log("calledFromSubmit " , calledFromSubmit);
  if(calledFromSubmit != true && buttonIdOnsave != "btnDone" )
  {
      GlobalHelper.globlevar['checkNothingToSave'] = true;
  }else if(calledFromSubmit != true && buttonIdOnsave == "btnDone" ){
      GlobalHelper.globlevar['checkNothingToSave'] = false;
  }
  else
 {
      GlobalHelper.globlevar['checkNothingToSave'] = false;
  }
  Log4r.log("GlobalHelper.globlevar['checkNothingToSave']", GlobalHelper.globlevar['checkNothingToSave']);


  if(TimeLineView)
  {
    TimeLineView=false;
    TimeLineWidth='0px';
  }
  if(GlobalHelper.globlevar.linkclicked === true){
    //GlobalHelper.globlevar.linkclicked = false;
  }
  savetrigger = "yes";
  this.setState({
    isSaveClicked:true,
  });

}

callClose(){
  //SPRINT 31 : Code Added for maintaining the previous screen data when clipsearched also added in the constructor and ClipSearchComponent.
  if (GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].SearchFromClipSearch == true) {
    try {
      var predata = JSON.parse(GlobalHelper.globlevar['clipsearchcloseprejson'].previousScreenJSON);
      if (predata != null && predata.data != null) {
        this.props.outnames.data[0] = predata.data[0];
      }
      var clipsearchcloseprejson = GlobalHelper.globlevar['clipsearchcloseprejson'];
      GlobalHelper.globlevar.functionID = clipsearchcloseprejson.functionID;
      GlobalHelper.holdFunGroupData = clipsearchcloseprejson['GlobalHelperholdFunGroupData'];
      GlobalHelper.listEntityId = clipsearchcloseprejson['listEntityId'];
      GlobalHelper.contextPKValues = clipsearchcloseprejson['contextPKValues'];
      GlobalHelper.contextPrimaryKey = clipsearchcloseprejson['contextPrimaryKey'];
      GlobalHelper.contextPrimaryKeyLength = clipsearchcloseprejson['contextPrimaryKeyLength'];
      try {
        var informationofPrejson = GlobalHelper.globlevar['informationofPrejson'];
        holdDataWithoutCap = informationofPrejson['holdDataWithoutCap'];
        GlobalHelper.globlevar.isHeaderConfigured = informationofPrejson['isHeaderConfigured'];
        holdDataWithCap = informationofPrejson['jsonholdDataWithCap'];
        this.state.rowheaderdatamap = informationofPrejson['holdDataWithCap'];
        headername = informationofPrejson['headername'];
        formSubTitle = informationofPrejson['formSubTitle'];
        this.formSubTitleForCloseClipsearch = formSubTitle;
        Log4r.log(" formSubTitle close ", formSubTitle);
        right = informationofPrejson['rightGroupid'];
        GlobalHelper.globlevar.removeHeaderFlag = informationofPrejson['removeHeaderFlag'];
        GlobalHelper.globlevar['menuFunctionFlag'] = informationofPrejson['menuFunctionFlag'];

      } catch (e) {
        Log4r.warn(e);
      }
      //GlobalHelper['defaultfunction'][0] =  clipsearchcloseprejson.functionID;
      a = clipsearchcloseprejson.functionID;
      GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
      GlobalHelper.globlevar['clipsearchflagforbutton'] = undefined;
      GlobalHelper.globlevar['clipsearchcloseprejson'] = undefined;
    } catch (e) {
      Log4r.warn(e);
    }
  }
  if (GlobalHelper.globlevar['tabScreen'].length > 0) {
    GlobalHelper.globlevar["closeButtonCall"] = false;
  }
  GlobalHelper.globlevar['tabScreen'] = [];
  GlobalHelper.globlevar['tabKey'] = 1;
  GlobalHelper.globlevar['activetabKey'] = 1;
  GlobalHelper.globlevar['changeTitle'] = undefined;
  GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
//------------------------------------------------------------------------------------------------------------
    onlyCloseButtonViews = null;
    showOnlyCloseButton = null;
    GlobalHelper.globlevar['UIScreenComponentRenderFlag'] = false;
    GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
    if(GlobalHelper.globlevar.linkclicked === true){
      GlobalHelper.globlevar.linkclicked = false;
    }
     // spring 13 - add button on cardlayout
    GlobalHelper['cardaddbutton'] = false;
    let initialscreenid = GlobalHelper.globlevar.InitialScreenFunctionID;
    let currentFunctId = GlobalHelper.globlevar.functionID;

    if((GlobalHelper.globlevar.promptClicked == true || GlobalHelper.globlevar.customScreenFlag == true) && (GlobalHelper.worklistData == undefined || GlobalHelper.worklistData == "" )){
      GlobalHelper.globlevar.promptClicked = false;
      GlobalHelper.globlevar.customScreenFlag = false;
      closepath = undefined;
      let url="index.html?noneedge=true&pinCategory=Transaction";
      redirectToAceMenus(url,"4");
    }
    else if (GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist.DataSource.rows.length == 1) {
      closepath = "GridWorkList";//Sprint 24 - Issue Fixed ClipSearch - redirection to Grid worklist after closing screen.
    }
    else {
      //Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
      if(GlobalHelper.globlevar['ClipSearchViaWorklist'] === true){
        closepath = "GridWorkList";
      }else if(GlobalHelper.globlevar['ClipSearchViaPrompMode'] === true){
        GlobalHelper.globlevar['ClipSearchViaWorklist'] = true;
        closepath = "ClosePromptScreen_ClipSearch";
      //  this.redirectingToPrevScreenOnClosingClipScreen(closepath);
      }
      else if(GlobalHelper.globlevar['ClipSearchViaUIScreen'] === true){
        GlobalHelper.globlevar['ClipSearchViaWorklist'] = true;
        closepath = "CloseUIScreen_ClipSearch";
      //  this.redirectingToPrevScreenOnClosingClipScreen(closepath);
      }else{
        closepath = "GridWorkList";
      }//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
    }
    this.setState({refresh :false});//Sprint 21-end


  this.props.refreshQB(); // this is a method from MainLayout.js.

}

//Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.
checkForWorkflowHistoryFunction(){
  // Log4r.log("salkjdhlkasjd.......",namess);
  // Log4r.log("salkjdhlkasjd.......",GlobalHelper.worklistData);
  // Log4r.log("salkjdhlkasjd.......",GlobalHelper.globlevar.functionID);
  // Log4r.log("salkjdhlkasjd.......",GlobalHelper.globlevar.defaultfunction);
  // Log4r.log("salkjdhlkasjd.......",GlobalHelper.selectedRowData);
  let worklistColumnObject=null;
  let historyFunctions = null;
  if(GlobalHelper.globlevar.defaultfunction == null && GlobalHelper.worklistData != null && GlobalHelper.worklistData.worklist){
    if(GlobalHelper.worklistData.worklist.Columns != null){
     worklistColumnObject = GlobalHelper.worklistData.worklist.Columns.filter((item,index)=>{
        if(item.title!= null && item.title === "Function Id" || item.dataIndex != null && item.dataIndex === "FNCTND"){
          return item;
        }
      })
    }
  }
  if(worklistColumnObject != null && worklistColumnObject[0] != null){
    // Log4r.log("shdkahsd......",worklistColumnObject,worklistColumnObject[0].dataIndex);
    // Log4r.log("sakjdlkja.......",GlobalHelper.selectedRowData[worklistColumnObject[0].dataIndex]);
    if(GlobalHelper.selectedRowData != null && GlobalHelper.selectedRowData[worklistColumnObject[0].dataIndex] != null){
      historyFunctions = GlobalHelper.selectedRowData[worklistColumnObject[0].dataIndex].split(",");
    }
  }
  if(historyFunctions != null){
    if(historyFunctions.includes(GlobalHelper.globlevar.functionID)){
      return true;
    }
  }
  //Log4r.log("anshdksad.....",worklistColumnObject,historyFunctions);
  return false;
}//END - Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.

//Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.
showHideButtonPallete(flag){
  Log4r.log("ajhdslkad....",flag);
  if(flag === "hide"){
    namess.ButtonPalette.map((item,index)=>{
      if(item.uiSchema != null){
        if(item.uiSchema[0] != null && item.uiSchema[0].children != null){
          item.uiSchema[0].children.map((buttonObj,indx)=>{
            buttonObj.children.widget="hidden";
          })
        }
      }
    })
    Log4r.log("ksjhsa......hidden",namess.ButtonPalette);
  }
  if(flag === "show"){
    Log4r.log("ajhdslkad....",flag);
    historyFunctionFlag = false;
    namess.ButtonPalette.map((item,index)=>{
      if(item.uiSchema != null){
        if(item.uiSchema[0] != null && item.uiSchema[0].children != null){
          item.uiSchema[0].children.map((buttonObj,indx)=>{
            buttonObj.children.widget="button";
          })
        }
      }
    })
    Log4r.log("ksjhsa......shown",namess.ButtonPalette);
  }
}//END - Sprint 32 - Task - To make history timeline sections and section button readonly & also to hide ButtonPallete.

makeSectionsCompletelyReadonly(){
  namess.screendata.map((item,index)=>{
    item['editable'] = false;
      if(item.uiSchema[0] != null && item.uiSchema[0].children != null){
        if(item.uiSchema[0].children[0].children.edit != null){
          item.uiSchema[0].children[0].children.edit = "false";
          if(item.uiSchema[0].children[0].children.widget === "table"){
            item.formData[0][item.uiSchema[0].children[0].children.fieldPath].data.Columns.map((colItem,colIndex)=>{
              colItem['completeEditable'] = false;
              if(colItem['id'] === "add" || colItem['id'] === "edit" || colItem['id'] === "delete"
               ||colItem['title'] === "add" || colItem['title'] === "edit" || colItem['title'] === "delete"
               ||colItem['style'] === "add" || colItem['style'] === "edit" || colItem['style'] === "delete"
               ||colItem['fieldPath'] === "add" || colItem['fieldPath'] === "edit" || colItem['fieldPath'] === "delete"){
                Log4r.log("sajdhbkjsad......",colItem,colIndex);
                colItem['removeColumnForHistoryScreen'] = "true";
                colItem['widget'] = "hidden";
              }
            })
          }
        }
      }
      if(item.sectionButton != null){
        item.sectionButton['disabled']=true;
        item.sectionButton['widgetEditFlag'] == "false";
        item.sectionButton.buttons.map((buttonobj,btnindex)=>{
          buttonobj['readOnlyButton'] = true;
        })
        //GlobalHelper.globlevar['HistoryTimelineViewSectionButton'] = true;
      }
  })
}
uiScreenCallBackFunction(props)
{
  Log4r.log("props on popup close - ",props);
  {/*
    FOR FURTHER DEVELOPMENT...
    //alert("called myfuntion")

  */}
}

f2CallBackFuncOnSectionalPopupClose(namesValues, modifiedNames, addonValues, newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked){
  this.replaceCurrentGridDataWithPopupSectionFormdata(namesValues, modifiedNames, addonValues, newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked
);
}

onForwardTab(){
  let forwardIndex = GlobalHelper.globlevar['tabScreen'].indexOf(this.addTabScreen[0]);
  let keyPosition = forwardIndex + 1;
  if(keyPosition <= GlobalHelper.globlevar.tabScreen.length){
    this.onChange(GlobalHelper.globlevar['tabScreen'][keyPosition].key);
  }
}

onReverseTab(){
  let reverseIndex = GlobalHelper.globlevar['tabScreen'].indexOf(this.addTabScreen[0]);
  if(reverseIndex >0){
    this.onChange(GlobalHelper.globlevar['tabScreen'][reverseIndex - 1].key);
  }
  
  
}

 onTabCloseClick(activeKey) {
   let removeSelectedTab = GlobalHelper.globlevar['tabScreen'].filter((a) => a.key == parseInt(activeKey));
   if (removeSelectedTab.length > 0) {
     var index = GlobalHelper.globlevar['tabScreen'].indexOf(removeSelectedTab[0]);
     let values, setKey, title;
     GlobalHelper.globlevar['tabScreen'].splice(index, 1);
     if (GlobalHelper.globlevar['tabScreen'].length > 0) {
          if(parseInt(activeKey)  == GlobalHelper.globlevar['activetabKey'] ){
          if (index > 0) {
            this.props.outnames.data = GlobalHelper.globlevar['tabScreen'][index - 1].data;
            this.props.outnames.f2FunctionId = GlobalHelper.globlevar['tabScreen'][index - 1].f2FunctionId;
            GlobalHelper.globlevar['tabScreen'][index -1].outnames.data= GlobalHelper.globlevar['tabScreen'][index - 1].data;
            GlobalHelper.globlevar['tabScreen'][index -1].outnames.f2FunctionId = GlobalHelper.globlevar['tabScreen'][index - 1].f2FunctionId;
            values = GlobalHelper.globlevar['tabScreen'][index - 1].f2FunctionId;
            setKey = GlobalHelper.globlevar['tabScreen'][index - 1].key;
            title = GlobalHelper.globlevar['tabScreen'][index - 1].title;
            GlobalHelper.globlevar['SplitScreenMainLayout'] = GlobalHelper.globlevar['tabScreen'][index - 1].SplitScreenMainLayout;
            GlobalHelper.globlevar['SplitScreenParams']  = GlobalHelper.globlevar['tabScreen'][index -1].SplitScreenParams;
            GlobalHelper.globlevar.linkclicked = GlobalHelper.globlevar['tabScreen'][index -1].linkclicked;
            if(GlobalHelper.globlevar['tabScreen'][index -1].isUtilityFunction === "N"){
              customHeaderFunctionIndex = null;
              a = values;
            } else {
              if(this.customHeaderFunctionsToRender.size !== 0){
                let contentItemIndex = 0;
                const contentItemIterator =  this.customHeaderFunctionsToRender.entries();
                while (contentItemIterator.next().value[1].id !== values ) {
                  contentItemIndex++;
                }
                customHeaderFunctionIndex = contentItemIndex;
              }
              a = null;
            }
          } else if (index <= 0 && GlobalHelper.globlevar['tabScreen'].length > 0 ) {
            this.props.outnames.data = GlobalHelper.globlevar['tabScreen'][index].data;
            this.props.outnames.f2FunctionId = GlobalHelper.globlevar['tabScreen'][index].f2FunctionId;
            GlobalHelper.globlevar['tabScreen'][index].outnames.data= GlobalHelper.globlevar['tabScreen'][index].data;
            GlobalHelper.globlevar['tabScreen'][index].outnames.f2FunctionId = GlobalHelper.globlevar['tabScreen'][index].f2FunctionId;
            values = GlobalHelper.globlevar['tabScreen'][index].f2FunctionId;
            setKey = GlobalHelper.globlevar['tabScreen'][index].key;
            title = GlobalHelper.globlevar['tabScreen'][index].title;
            GlobalHelper.globlevar['SplitScreenMainLayout'] = GlobalHelper.globlevar['tabScreen'][index].SplitScreenMainLayout;
            GlobalHelper.globlevar['SplitScreenParams']  = GlobalHelper.globlevar['tabScreen'][index].SplitScreenParams;
            GlobalHelper.globlevar.linkclicked = GlobalHelper.globlevar['tabScreen'][index].linkclicked;
            customHeaderFunctionIndex = null;
            a = values;
          }
            GlobalHelper.globlevar['changeTitle'] = title;
            GlobalHelper.globlevar.savedFunctionID = "" + values;
            GlobalHelper.globlevar.functionID = "" + values;
            GlobalHelper.globlevar['InitialScreenFunctionID'] = values;
            GlobalHelper.globlevar['FirstFuncatoinIdFromGroupFunction'] = values;
            GlobalHelper.globlevar['summaryConfigType_save'] = undefined;
            GlobalHelper.globlevar['functionID'] = values;
            GlobalHelper.globlevar['nextandpreviousfunctionid'] = values;
            GlobalHelper.globlevar['activetabKey'] = setKey;
          }
          ErrorHandler.clear();
          if (this.props.outnames.data.length > 1) {
            this.props.outnames.data.pop()
          }
          this.props.refreshQB();
    }else{
      this.callClose();
    }
   }
 }
 onChange = activeKey => {
   let currentSelectedTab = GlobalHelper.globlevar['tabScreen'].filter((a) => a.key == activeKey);
   if(currentSelectedTab.length > 0){
    GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
     GlobalHelper.globlevar['activetabKey'] = activeKey;
     GlobalHelper.globlevar['changeTitle'] = currentSelectedTab[0].title

     this.props.outnames.data = currentSelectedTab[0].data;
     namess = currentSelectedTab[0].data[0].name;
     this.props.outnames.f2FunctionId = currentSelectedTab[0].f2FunctionId;
     let index = GlobalHelper.globlevar['tabScreen'].indexOf(currentSelectedTab[0]);
     GlobalHelper.globlevar['tabScreen'][index].outnames.data= currentSelectedTab[0].data;
     GlobalHelper.globlevar['tabScreen'][index].outnames.f2FunctionId = currentSelectedTab[0].f2FunctionId;
     let values = currentSelectedTab[0].f2FunctionId;
     GlobalHelper.globlevar.savedFunctionID = "" + values;
     GlobalHelper.globlevar.functionID = "" + values;
     GlobalHelper.globlevar['InitialScreenFunctionID'] = values;
     GlobalHelper.globlevar['FirstFuncatoinIdFromGroupFunction'] = values;
     GlobalHelper.globlevar['functionID'] = values;
     GlobalHelper.globlevar['nextandpreviousfunctionid'] = values;
     GlobalHelper.globlevar.linkclicked = currentSelectedTab[0].linkclicked;
     GlobalHelper.globlevar['summaryConfigType_save'] = currentSelectedTab[0].summaryConfigType_save;
     GlobalHelper.globlevar['summaryConfigType'] = currentSelectedTab[0].summaryConfigType;
     GlobalHelper.globlevar['assortedMapOfParent'] = currentSelectedTab[0].assortedMapOfParent;
     GlobalHelper.globlevar['assortedMapOfLeaf'] = currentSelectedTab[0].assortedMapOfLeaf;
     GlobalHelper.globlevar['detailsectionidsmapvalue'] = currentSelectedTab[0].detailsectionidsmapvalue;
     GlobalHelper.globlevar['detailsectionidsmap'] = currentSelectedTab[0].detailsectionidsmap;
     GlobalHelper.globlevar['parentAndChildMapkey'] = currentSelectedTab[0].parentAndChildMapkey;
     GlobalHelper.globlevar['newFunctionNames'] = currentSelectedTab[0].newGlobalNames;
     GlobalHelper.globlevar['targetToRulesMapper'] = currentSelectedTab[0].targetToRulesMapper;
     GlobalHelper.globlevar['ruleToTargetsMapper'] = currentSelectedTab[0].ruleToTargetsMapper;
     GlobalHelper.globlevar['fieldInExpressionToRulesMapper'] = currentSelectedTab[0].fieldInExpressionToRulesMapper;
     GlobalHelper.globlevar['defaultValueManagerMap'] = currentSelectedTab[0].defaultValueManagerMap;
     GlobalHelper.globlevar['ruleExecutionStatusMap'] = currentSelectedTab[0].ruleExecutionStatusMap;
     GlobalHelper.globlevar['throwValidationRulesArray'] = currentSelectedTab[0].throwValidationRulesArray;
     GlobalHelper.globlevar['SplitScreenMainLayout'] = currentSelectedTab[0].SplitScreenMainLayout;
     GlobalHelper.globlevar['SplitScreenParams'] = currentSelectedTab[0].SplitScreenParams;
     GlobalHelper.holdFunGroupData = currentSelectedTab[0].holdFunGroupData;
     Rightsidermenu = currentSelectedTab[0].Rightsidermenu;

     let jsScripts = currentSelectedTab[0].data[0].name['scriptsToLoad'];
     try {
      loadScript("FrameworkUtility/customGenUtils.js");
      if (jsScripts != null)
        for (let jsscriptIndex = 0; jsscriptIndex < jsScripts.length; jsscriptIndex++) {

          loadScript("/" + jsScripts[jsscriptIndex].path);
        }
    } catch (e) { Log4r.warn(e); }
     if(currentSelectedTab[0].isUtilityFunction === "Y") {
        if(this.customHeaderFunctionsToRender.size !== 0){
            let contentItemIndex = 0;
            const contentItemIterator =  this.customHeaderFunctionsToRender.entries();
            while (contentItemIterator.next().value[1].id !== currentSelectedTab[0].f2FunctionId ) {
              contentItemIndex++;
            }
            customHeaderFunctionIndex = contentItemIndex;
          }
        a = null;
      } else {
       customHeaderFunctionIndex = null;
       a = currentSelectedTab[0].f2FunctionId;
     }
   }

   ErrorHandler.clear();
   if(this.props.outnames.data.length > 1){
     this.props.outnames.data.pop()
   }
   this.props.refreshQB();
 };
replaceCurrentGridDataWithPopupSectionFormdata(namesValues, modifiedNames, addonValues, newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked
){
  GlobalHelper.globlevar['linkclicked'] = linkclicked;
  GlobalHelper.globlevar['newFunctionNames'] = newGlobalNames;
  GlobalHelper.globlevar['assortedMapOfParent']= assortedMapOfParent;
  GlobalHelper.globlevar['assortedMapOfLeaf'] = assortedMapOfLeaf;
  GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonTemplateObjectOfBackScreen
  GlobalHelper.globlevar['targetToRulesMapper'] = targetToRulesMapper;
  GlobalHelper.globlevar['ruleToTargetsMapper'] = ruleToTargetsMapper;
  GlobalHelper.globlevar['fieldInExpressionToRulesMapper'] = fieldInExpressionToRulesMapper;
  GlobalHelper.globlevar['defaultValueManagerMap'] = defaultValueManagerMap;
  GlobalHelper.globlevar['ruleExecutionStatusMap'] = ruleExecutionStatusMap;
  GlobalHelper.globlevar['throwValidationRulesArray'] = throwValidationRulesArray;
  GlobalHelper.globlevar['hybridOneThirdCardsCount'] = hybridOneThirdCardsCount;
  GlobalHelper.globlevar['summaryConfigType_save'] = summaryConfigType_save;
  //GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = summaryConfigTypeFunctionid;
  GlobalHelper.globlevar['summaryConfigType'] = summaryConfigType;
  Log4r.log("VALUES FOUND !!!",namesValues,modifiedNames,addonValues);

  for (let i = 0; i < modifiedNames.data[0].name.screendata.length; i++) {
        let dependantSecionId =  namesValues.data[0].name['addToGridSectionalLinkData'];
        let allDependantSections = new Model().getLeafNodesForId(dependantSecionId);
        let arrayKeys = Object.keys(allDependantSections);
        for (let o = 0; o < arrayKeys.length; o++) {
          let requiredSection = namesValues.data[0].name.screendata.filter(item => item.sessionID === arrayKeys[o])[0];
          if(requiredSection != null){
            let sectionInCurrentNames = namesValues.data[0].name.screendata.filter(item =>  item.sessionID === modifiedNames.data[0].name.screendata[i].addRowtoGridSection)[0];
            if(sectionInCurrentNames != null){
              let parentSectionId = sectionInCurrentNames.sessionID;
              let sectionInModifiedNames = modifiedNames.data[0].name.screendata.filter(item => item.sessionID == parentSectionId)[0];
              Log4r.log("sectionInCurrentNames",sectionInCurrentNames,parentSectionId,sectionInCurrentNames.formData[0][parentSectionId].data);
              if(sectionInCurrentNames){
                sectionInCurrentNames.formData[0][parentSectionId].data.DataSource = [];
                sectionInModifiedNames.formData[0][parentSectionId].data.DataSource.map((item,index)=>{
                  sectionInCurrentNames.formData[0][parentSectionId].data.DataSource.push(item);
                });

              }
            break;
            }

          }
        }
  }
  Log4r.log("FINAL VALUES FOUND !!!",namesValues);
  this.forceUpdate();
}


replaceSectionalButtonsWithPaletteButtons(names,sectionId){
  names.ButtonPalette = [];
  for (let i = 0; i < sectionId.length; i++) {
    let requiredSection = names.screendata.filter(item=>item.sessionID === sectionId[i])[0];

    if(requiredSection.sectionButton != null){
        if(requiredSection.addRowtoGridSection != null) {
          let checkSomeSection = names.screendata.filter(item=>item.sessionID === requiredSection.addRowtoGridSection)[0];
          if(checkSomeSection.formData[0][requiredSection.addRowtoGridSection] != null){
            if(checkSomeSection.formData[0][requiredSection.addRowtoGridSection].data.detailsectionid === names.addToGridSectionalLinkData){
              //Temporary adding a clear button in to filtered section
              requiredSection.sectionButton.buttons.push({'fname':'','id':'clearPopupSection','title':'Clear Pop Section'});

              if(requiredSection.sectionButton.applicable === "true"){
                let buttonPaletteObject = {};

                buttonPaletteObject['schema'] = [{}];
                buttonPaletteObject['uiSchema'] = [{'children':[],'xType':'grid'}];
                buttonPaletteObject['formData'] = [{}]

                //Temporary button icons
                let buttonIcon = "";

                for (let i = 0; i < requiredSection.sectionButton.buttons.length; i++) {
                  if(requiredSection.sectionButton.buttons[i] != null){
                    if(requiredSection.sectionButton.buttons[i].id === "addRowtoGrid"){
                      requiredSection.sectionButton.buttons[i].hidden = true;
                    }
                    if(requiredSection.sectionButton.buttons[i].id !== "refreshButton" && requiredSection.sectionButton.buttons[i].id !== "addRowtoGrid") {
                      if(requiredSection.sectionButton.buttons[i].id == "addRowtoGrid"){
                        buttonIcon = "plus";
                      } else if (requiredSection.sectionButton.buttons[i].id == "editRowtoGrid") {
                        buttonIcon = "pencil";
                      } else if (requiredSection.sectionButton.buttons[i].id == "clearPopupSection") {
                        buttonIcon = "eraser";
                      } else {
                        buttonIcon = "start";
                      }
                      buttonPaletteObject.schema[0][requiredSection.sectionButton.buttons[i].id] = {"title" : requiredSection.sectionButton.buttons[i].title };
                      buttonPaletteObject.uiSchema[0].children.push({"xType": "col","span": 6,"children": {"xType": "field","widget": "button","fieldPath": requiredSection.sectionButton.buttons[i].id}});
                      buttonPaletteObject.formData[0][requiredSection.sectionButton.buttons[i].id] = {"style": {"type": "default","size": "large","label": requiredSection.sectionButton.buttons[i].title ,"classname": "paletteClassSave","icon": buttonIcon, "accessCat" : "W", "buttonCategory" : "STANDARD", "eventName" :"", "sesctionEventToCarryOnButton":requiredSection.sectionButton.buttons[i].fname, "parentSectionId":( requiredSection.sectionButton.buttons[i].id == "clearPopupSection" ? requiredSection.sectionButton.buttons[0].parentSectionId : requiredSection.sectionButton.buttons[i].parentSectionId)  , "requiredSectionId":requiredSection.sessionID , "sectionButtonId": requiredSection.sectionButton.buttons[i].id}};

                      requiredSection.sectionButton.buttons[i].hidden = true;

                    }
                  }
                  }

                names.ButtonPalette.push(buttonPaletteObject);
              }
            }
          }
        }
     }
  }
}


render() {
    // Will work with function modeling....
    Log4r.log("@!#@!....render of uiscreen....",JSON.stringify(ErrorHandler.getTotalErrJson()));
    try{
     if (this.props.outnames.length !== 0 && this.props.outnames !== null && GlobalHelper.globlevar['historyTimelineclicked'] !== true) {
        //let tabFunctionId = this.props.outnames.f2FunctionId == undefined? this.props.outnames.data[0].name.functionID: this.props.outnames.f2FunctionId;
        let tabFunctionId = this.props.outnames.f2FunctionId == undefined? this.props.outnames.data[0].name != null ? this.props.outnames.data[0].name.functionID : this.props.outnames.f2FunctionId : this.props.outnames.f2FunctionId;

        if(GlobalHelper.globlevar['changeTitle']  == undefined){
          this.addTabScreen = GlobalHelper.globlevar['tabScreen'].filter((a) => a.title == formSubTitle);
        }else{
          this.addTabScreen = GlobalHelper.globlevar['tabScreen'].filter((a) => a.title == GlobalHelper.globlevar['changeTitle'] );
        }

       if (this.props.outnames.orientationType != "popsearch" &&  ((this.addTabScreen.length < 1 && GlobalHelper.globlevar.functionID == tabFunctionId ) || (GlobalHelper.globlevar['customDispatchAction'] &&  GlobalHelper.globlevar.functionID == tabFunctionId ))) {
        let tabflag = false;
         if (GlobalHelper.globlevar['customDispatchAction']) {
           Rightsidermenu.forEach((value) => {
             value.content.forEach((group) => {
               try {
                 if (group.id == tabFunctionId) {
                   GlobalHelper.globlevar['changeTitle'] = group.desc;
                   formSubTitle = group.desc;
                   headername = group.groupdesc == undefined ? headername : group.groupdesc;
                   tabflag = true;
                 }
               } catch (e) { Log4r.error(e) }
             });
           });
           if (tabflag == true)
             GlobalHelper.globlevar['tabScreen'] = GlobalHelper.globlevar['tabScreen'].filter((a) => a.title != formSubTitle);
           else
             formSubTitle = formSubTitle + '_' + GlobalHelper.globlevar['tabKey'];
         }
         GlobalHelper.globlevar['customDispatchAction'] = false;
         GlobalHelper.globlevar['summaryConfigType_save'] = undefined;
         ErrorHandler.clear();
         //GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = undefined;
         GlobalHelper.globlevar['summaryConfigType'] = undefined;
         GlobalHelper.globlevar['newFunctionNames'] = undefined;
          const activeKey = `${GlobalHelper.globlevar['tabKey']++}`;
          if(GlobalHelper.globlevar['tabScreen'].length > 6){
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].title = formSubTitle;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].outnames= this.props.outnames;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].data= this.props.outnames.data;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].f2FunctionId= tabFunctionId;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].key= activeKey;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].headername= headername;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].holdFunGroupData= GlobalHelper.holdFunGroupData;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].assortedMapOfParent= GlobalHelper.globlevar['assortedMapOfParent'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].assortedMapOfLeaf= GlobalHelper.globlevar['assortedMapOfLeaf'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].jsonTemplateObjectOfBackScreen= GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].targetToRulesMapper=GlobalHelper.globlevar['targetToRulesMapper'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].ruleToTargetsMapper= GlobalHelper.globlevar['ruleToTargetsMapper'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].fieldInExpressionToRulesMapper= GlobalHelper.globlevar['fieldInExpressionToRulesMapper'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].defaultValueManagerMap= GlobalHelper.globlevar['defaultValueManagerMap'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].ruleExecutionStatusMap= GlobalHelper.globlevar['ruleExecutionStatusMap'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].throwValidationRulesArray= this.throwValidationRulesArray;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].detailsectionidsmapvalue= GlobalHelper.globlevar['detailsectionidsmapvalue'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].detailsectionidsmap= GlobalHelper.globlevar['detailsectionidsmap'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].parentAndChildMapkey= GlobalHelper.globlevar['parentAndChildMapkey'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].linkclicked = GlobalHelper.globlevar.linkclicked;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].cardHeaderInfo = [];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].HeaderFunCustomScreenCall = false;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].summaryConfigType_save = GlobalHelper.globlevar['summaryConfigType_save'];
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].summaryConfigType = GlobalHelper.globlevar['summaryConfigType'] ;
            GlobalHelper.globlevar['tabScreen'][GlobalHelper.globlevar['tabScreen'].length - 1].newGlobalNames=  GlobalHelper.globlevar['newFunctionNames'];
          } else{

            GlobalHelper.globlevar['tabScreen'].push(
              {
                title: formSubTitle,
                outnames: this.props.outnames,
                data: this.props.outnames.data,
                f2FunctionId: tabFunctionId,
                key: activeKey, headername: headername,
                holdFunGroupData: GlobalHelper.holdFunGroupData,
                assortedMapOfParent: GlobalHelper.globlevar['assortedMapOfParent'],
                assortedMapOfLeaf: GlobalHelper.globlevar['assortedMapOfLeaf'],
                jsonTemplateObjectOfBackScreen:GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'],
                targetToRulesMapper: GlobalHelper.globlevar['targetToRulesMapper'],
                ruleToTargetsMapper: GlobalHelper.globlevar['ruleToTargetsMapper'],
                fieldInExpressionToRulesMapper: GlobalHelper.globlevar['fieldInExpressionToRulesMapper'],
                defaultValueManagerMap: GlobalHelper.globlevar['defaultValueManagerMap'],
                ruleExecutionStatusMap: GlobalHelper.globlevar['ruleExecutionStatusMap'],
                throwValidationRulesArray:GlobalHelper.globlevar['throwValidationRulesArray'],
                detailsectionidsmapvalue: GlobalHelper.globlevar['detailsectionidsmapvalue'],
                detailsectionidsmap: GlobalHelper.globlevar['detailsectionidsmap'], // contains detailsectionid as key and the container section having link to open details as its value.
                parentAndChildMapkey: GlobalHelper.globlevar['parentAndChildMapkey'],
                linkclicked: GlobalHelper.globlevar.linkclicked,
                summaryConfigType_save : GlobalHelper.globlevar['summaryConfigType_save'],
                summaryConfigType : GlobalHelper.globlevar['summaryConfigType'],
                newGlobalNames :  GlobalHelper.globlevar['newFunctionNames'],
                cardHeaderInfo: [],
                Rightsidermenu: Rightsidermenu,
                HeaderFunCustomScreenCall: false,
                isUtilityFunction: customHeaderFunctionIndex != null ? "Y" : "N",
              }
            )
          }
          GlobalHelper.globlevar['activetabKey'] = activeKey;
        }
        else if (this.addTabScreen.length > 0 &&  GlobalHelper.globlevar.functionID == tabFunctionId ) {
          let currentTab = GlobalHelper.globlevar['tabScreen'].filter((a) => a.key == GlobalHelper.globlevar['activetabKey']);
          if(this.addTabScreen.length > 1){
              GlobalHelper.globlevar['activetabKey'] = currentTab[currentTab.length-1].key;
          } else {
            GlobalHelper.globlevar['activetabKey'] = currentTab[0].key;
          }
        }

        if(GlobalHelper.globlevar["closeButtonCall"] === true){
         this.callClose();
        }
       if (GlobalHelper.globlevar["ClearTabArray"] != undefined && GlobalHelper.globlevar["ClearTabArray"] == true) {
         if (GlobalHelper.globlevar['tabScreen'].length > 0) {
           GlobalHelper.globlevar["ClearTabArray"] = false;
           GlobalHelper.globlevar['tabScreen'] = new Array();
           GlobalHelper.globlevar['tabKey'] = 1;
           GlobalHelper.globlevar['changeTitle'] = undefined
           GlobalHelper.globlevar['activetabKey'] = 1;
         }
       }
    }
    }catch(e){Log4r.error(e)}
    Log4r.log("############################# tabscreen", GlobalHelper.globlevar['tabScreen'])
    //Sprint 38 - Task - Issue L60-585 - IC6/Prompt Mode/screen name displayed is wrong , if open from prompt mode
    //Log4r.log("jshdkasdkjsd................",this.props,Rightsidermenu);
    if(this.props.outnames != null && this.props.outnames["pr_mode"] === "prompt" && Rightsidermenu.length > 0){
      //headername = Rightsidermenu[0]['groupdesc'];
    }//END - Sprint 38 - Task - Issue L60-585 - IC6/Prompt Mode/screen name displayed is wrong , if open from prompt mode

    if(Rightsidermenu.length > 0)
    {
      Rightsidermenu.splice(0,Rightsidermenu.length);
      //Log4r.log("Rightsidermenu=",Rightsidermenu);
    }
    if(GlobalHelper.holdFunGroupData !==undefined && GlobalHelper.holdFunGroupData!==null && GlobalHelper.holdFunGroupData !=="" ){

	   var favoriteGrp = {
          "groupcd": "FAV",
          "groupdesc": "Favourites",
          "groupid": "FAV",
          "icon_col": "",
          "icon_exp": "fa fa-star iconCenter {#6d9eeb}",
          "iorder": "-1",
          "isactive": "Y",
          "content" : []
      }

      var favGrpObj ={
        "groupcd": "ELLIP",
        "groupdesc": "Ellipsis",
        "groupid": "ELLIP",
        "icon_col": "",
        "icon_exp": "fa-ellipsis-v iconCenter {#6d9eeb}",
        "iorder": "8",
        "isactive": "Y",
        "content": [
        ]
      };
	   var k = 0;
       try{
         GlobalHelper.holdFunGroupData.forEach((value, key, map)=>{
            value.content.forEach((group, groupkey)=>{
                try{
                    if(group.favorite == "Y"){
                      favoriteGrp.content[k] =  group;
                      k++;
                    }
                  } catch(e) {
                    console.error(e)
                  }

                  if(GlobalHelper.defaultfunction != null && GlobalHelper.defaultfunction.length > 0 && group.id ==  GlobalHelper.defaultfunction[0]){
                      GlobalHelper['DefaultFunctionformSubTitle'] = group.desc;
                      GlobalHelper['DefaultFunctionHeadername'] = value.groupdesc;
                  }
               });
        });

        if(!GlobalHelper.holdFunGroupData.has("FAV")){
          GlobalHelper.holdFunGroupData.set(favoriteGrp.groupid, favoriteGrp);
         }
        }catch(e){Log4r.error(e)}

        if(GlobalHelper.holdFunGroupData.size >7){
          this.ellipsisFlag = true;
          GlobalHelper.holdFunGroupData.set(favGrpObj.groupid, favGrpObj);
        }

    {GlobalHelper.holdFunGroupData.forEach((value, key, map)=>{
        if(GlobalHelper.globlevar['rightGroupFunctionClick'] !== true){
          Rightsidermenu[Rightsidermenu.length]=value;
        }else{
          let index = 1;
            Rightsidermenu[index]=clickedGroup;
            GlobalHelper.holdFunGroupData.forEach((value, key, map)=>{
              if(value.groupcd !== clickedGroup.groupcd && value.groupcd !== "FAV" ){
                ++index;
                Rightsidermenu[index]=value;
              }
            })
        }
        if(value.groupid === "ELLIP"){
          Rightsidermenu.pop();
          Rightsidermenu.splice(7,0,value);
        }
        if(value.groupid === "FAV"){
          Rightsidermenu.pop();
          Rightsidermenu.unshift(value);
        }
  })
  newArr = Rightsidermenu.slice(8,Rightsidermenu.length);
  if(GlobalHelper.globlevar['rightGroupFunctionClick'] !== true && GlobalHelper.holdFunGroupData.size >7){
     for (let i = 0; i < newArr.length; i++) {
           try{
           let arritem = newArr[i].content.filter(item =>  item.id === GlobalHelper.globlevar.functionID )[0];
           if(arritem !== undefined)
           {let index = 1;
	   let idx = Rightsidermenu.indexOf(newArr[i]);
             if(idx > -1){
               Rightsidermenu.splice(idx,1);
             }
            //Rightsidermenu[index]=newArr[i];
			Rightsidermenu.splice(1, 0, newArr[i]);

            GlobalHelper.holdFunGroupData.forEach((value, key, map)=>{

              if(value.groupid === "ELLIP"){
               //Rightsidermenu.pop(); This is removing the last element from array
			   Rightsidermenu.splice(8,1);//remove ellip from 8th index
              Rightsidermenu.splice(7,0,value); //Add ELLIP to th index
              }
            })
    break;
           }
         }catch(e){Log4r.error(e)}
     }// END FOR

     newArr = Rightsidermenu.slice(8,Rightsidermenu.length);

   }//ENDIF
}
}
  Rightsidermenu.map((funcgroup,index)=>{   // NOSONAR: javascript:S2201
    try {
    funcgroup.content.map((func,j)=>{
      if(func.id == GlobalHelper.globlevar.functionID){
         this.funcObjForRefresh = func;
      }
     })
}
     catch (e) {
      Log4r.log("error",e);
    }
  })
   // after worlist data 20 row from 21th row one extra call given internally
    if( GlobalHelper.globlevar['paginationcalled'] == true)
    {
       GlobalHelper.globlevar['paginationcalled'] = false;
       Log4r.log(" &&&& ");
       //uiNextButtonHandler();
       // nextPromtScreen();
    }
    GlobalHelper.globlevar['QBsearch']="false";// Sprint 16 - Task - QueryBuilder development,Integration and Testing - to add search button if QueryBuilder used in screen.
    //****************************** NOTE **********************************//
    // Please do not delete below commented code , it is working for timeline layout.
  if(GlobalHelper.globlevar['timelinedisplay'] == true)
  {
   let timeLineObject={};
        timeLineObject.groupid= "TIMEL"
        timeLineObject.groupcd="TIMEL"
        timeLineObject.groupdesc="Timeline View";
        timeLineObject.icon_exp= "fa fa-clock-o iconCenter {#6d9eeb}"
        timeLineObject.icon_col= ""
        timeLineObject.iorder= "37"
        timeLineObject.content=["timeline"];
        timeLineObject.isactive= "Y"
        Rightsidermenu.splice(Rightsidermenu.length,0,timeLineObject);

        if(this.onloadtimelinedisplay === true)
        {
          this.onloadtimelinedisplay =false;
          //this.MyFuncRight(timeLineObject);
        }
  }else {
    if(TimeLineView) {
      TimeLineView=false;
      TimeLineWidth='0px';
    }
  }
    //****************************TILL HERE**********************************//

  const info=File1.dataprofile;
  const info3=File1.Layoutdata;
  //Log4r.log("this.props.outnames=",this.props.outnames);
  var pathname = this.props.outnames.ScreenLayoutName;
  //namess = this.props.outnames;
  if(this.state.themeName == "myDefault")
  {
    styles=require('./css/MainLayout/MainLayoutDefault.css');
    stylesfu =require('./css/FollowUpDefault.css');
    stylesf =require('./css/Foll1Default.css');
  }
  else if (this.state.themeName =="myCompact")
  {
    styles=require('./css/MainLayout/MainLayoutCompact.css');
    stylesfu =require('./css/FollowUpCompact.css');
    stylesf =require('./css/Foll1Default.css');
  }
  else if (this.state.themeName =="myDark")
  {
    styles=require('./css/MainLayout/MainLayoutDark.css');
    stylesfu =require('./css/FollowUpDark.css');
    stylesf =require('./css/Foll1Dark.css');
  }
  else if (this.state.themeName =="myRed")
  {
    styles=require('./css/MainLayout/MainLayoutRedThm.css');
    stylesfu =require('./css/FollowUpRedThm.css');
    stylesf =require('./css/Foll1RedThm.css');
  }
  else
  {

  }

  //Sprint 37 - Task - MultiBrowser Compatibity and Testing - changes for IE
  var browserMap = checkBrowserType();
  var isIE = /*@cc_on!@*/false || !!document.documentMode;
  if(navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) || (browserMap.has("isIE") && browserMap.get("isIE") === true) || isIE === true){

  }else{

  }//END - Sprint 37 - Task - MultiBrowser Compatibity and Testing - changes for IE

if (this.state.hasError) {
        namess = file.name;
}
else{
  try {
    if(containerDiv.length>=0 || hybridCount >=0)
    {
      createHybridView=false;
      containerDiv=[];
      hybridCount=0;
    }
    Log4r.log("this.props.outnames.data[0].name=>",this.props.outnames.data[0].name);
    Log4r.log(this.props.outnames);
    if(this.props.outnames.data[0].name !== undefined){
      if(this.props.outnames.data[0].name.entities != null && this.props.outnames.data[0].name.entities.length != 0 && this.props.outnames.data[0].name.defaultListEntityId){
        this.props.outnames.data[0].name.entities.map((item,inedx)=>{
          if(item.worklist.id === this.props.outnames.data[0].name.defaultListEntityId){
            namess=item;
            closepath="GridWorkList";
          }
        })
      }
    }

    if(GlobalHelper.globlevar['summaryConfigType'] == "summaryConfigType_F")
        {
           Log4r.log("New Data found  " ,this.props.outnames.data[0].name );
		       namess['functionIDOfSummaryConfigType'] = this.props.outnames.data[0].name['functionIDOfSummaryConfigType'];
           namess['summaryConfigTypeParam'] = this.props.outnames.data[0].name['summaryConfigTypeParam'];
           GlobalHelper.globlevar['summaryConfigType'] = undefined;
          // GlobalHelper.globlevar['newfunctionInitiated'] = true;
           GlobalHelper.globlevar['summaryConfigType_save'] = true;
           //namess = this.props.outnames.data[0].name;
           //removing previous function sections which was added from some other function id.

           if(Object.keys(this.props.outnames.data[0].name.rules).length !== 0 ){
             GlobalHelper.globlevar['newFunctionNames'] = this.props.outnames.data[0].name;
           }
           else {
             GlobalHelper.globlevar['newFunctionNames'] = undefined;
           }
           let addTabScreen = GlobalHelper.globlevar['tabScreen'].filter((a) => a.f2FunctionId == GlobalHelper.globlevar.functionID);
           if (addTabScreen.length > 0) {
              let addTabindex = GlobalHelper.globlevar['tabScreen'].indexOf(addTabScreen[0]);
              GlobalHelper.globlevar['tabScreen'][addTabindex].summaryConfigType_save =  true;
              GlobalHelper.globlevar['tabScreen'][addTabindex].summaryConfigType =  undefined;
              GlobalHelper.globlevar['tabScreen'][addTabindex].newGlobalNames = GlobalHelper.globlevar['newFunctionNames'];
            }
           let cardLayoutInclusion = false;
           try {
             let breakpoint = false;
               for (let p = 0; p < firstRenderScreen.screendata.length; p++) {
                 if(breakpoint){
                   break;
                 } else {
                   for (let q = 0; q < firstRenderScreen.screendata[p].uiSchema[0].children.length; q++) {
                        if(firstRenderScreen.screendata[p].uiSchema[0].children[q].children.widget === "table" && firstRenderScreen.screendata[p].formData[0][firstRenderScreen.screendata[p].uiSchema[0].children[q].children.fieldPath].data.isCardDisplay === "true"){
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
           namess.screendata.map((item,i)=>{
           try{
                if(item['summaryConfigTypesection'] == "true"){
                  item['summaryConfigTypesection'] = "false";
                  //namess.screendata.pop(item);
                  namess.screendata.splice(i);
                  // delete namess.screendata[i];
                }
              }
              catch(e){Log4r.error(e)}
            }
            );
            // adding new function sections.
           this.props.outnames.data[0].name.screendata.map((item,i)=>{
           try{
                if(cardLayoutInclusion){
                  item['layoutSize'] = "GridTwoThird";
                  item['addedFunctionLayout'] = true;
                }
               item['summaryConfigTypesection'] = "true";
               /* if(namess.screendata[i].sessionID == item.sessionID)
               {
                namess.screendata.splice(i, 1);
               }*/

               namess.screendata.push(item);
              }
              catch(e){Log4r.error(e)}
            })

            for (let key in namess.rules) {
                if(namess.rules[key] != null && namess.rules[key].isHistoryTimeLineRules != null){
                  if(namess.rules[key].isHistoryTimeLineRules === true){
                    delete namess.rules[key]
                  }
                }
              }

            if(JSON.stringify(this.props.outnames.data[0].name.rules) != "{}"){
              for (let i = 0; i < Object.keys(this.props.outnames.data[0].name.rules).length; i++) {
                let tempRule = this.props.outnames.data[0].name.rules[Object.keys(this.props.outnames.data[0].name.rules)[i]];
                tempRule['isHistoryTimeLineRules'] = true;
                namess.rules[Object.keys(this.props.outnames.data[0].name.rules)[i]] = tempRule;
              }
            }
          // Changes for different button for multi level layouts - not tested
          if(namess['preButtonPalette'] == undefined)
          {
            namess['preButtonPalette'] = [];
            namess['preButtonPalette'][0] = namess.ButtonPalette;
          }
          else
          {
            //namess.preButtonPalette.rows.push({"functionId" : GlobalHelper.globlevar.functionID, "buttonPallete " :  namess.preButtonPalette});
            // ******************** This code is working code - just need to check and commit later done by - Gokul -
            namess.preButtonPalette && namess.preButtonPalette.rows && namess.preButtonPalette.rows.push({"functionId" : GlobalHelper.globlevar.functionID, "buttonPallete " :  namess.preButtonPalette});
          }

			Log4r.log('this.props.outnames.data[0].name', this.props.outnames.data[0].name);
			if(GlobalHelper.globlevar.CardCloseClicked){
				namess.ButtonPalette = namess.preButtonPalette[namess.preButtonPalette.length -1];
				namess.preButtonPalette.pop();
			}else{
				namess.ButtonPalette = this.props.outnames.data[0].name.ButtonPalette;
      }
			// ******************** This code is working code - just need to check and commit later done by - Gokul -
       namess['ACCESS_MODE'] = this.props.outnames && this.props.outnames.data[0].name['ACCESS_MODE']

      //Changes for different button for multi level layouts - not tested end
          //ErrorHandler.setstatusES("");
          //ErrorHandler.setErrMessage("");
		   Log4r.log("namess===>",namess)
           ErrorHandler.clear();
           ErrorHandler.getsequenceJson(namess.screendata);

        }
     else if(this.props.outnames.data[0].name != null ) // starts here
      {
        Log4r.log(this.props.outnames.data[0]);
        Log4r.log(this.props.outnames.data[1]);
        /*THIS IF IS FOR POSTSAVE RESPONSE[SUCH AS ERROR MESSAGES OR SUCCESSFUL MESSAGES]....*/

        if(this.props.outnames.data[1] != null && this.props.outnames.data[1].name != null){
          if(this.props.outnames.data[1].name.SuccessFlag !== undefined && this.props.outnames.data[1].name.__f2_messages__ && this.props.outnames.data[1].name.__f2_messages__.length > 0 && stopcount == 0)
          {
            this.successFlag = this.props.outnames.data[1].name.SuccessFlag;
            if(this.props.outnames.data[1].name.SuccessFlag !== undefined)
            {

            ErrorHandler.setTotalErrJson([]);
            ErrorHandler.setTotalWarningsJson([]);
            ErrorHandler.setTotalInfoMessageJson([]);
            ErrorHandler.setTotalSuccessMessageJson([]);
            let ttlErrJsn ;
            let ttlErrJsnOrig ;
            let totalWarnJsn ;
            let totalInfoJsn ;
            let totalSuccJsn;
            stopcount++;
            //Log4r.log("this.props.outnames.data[0].name.JSON_DATA  &&& ",this.props.outnames.data[0].name.ERROR);
            var errjsn = this.props.outnames.data[1].name.__f2_messages__;
            var sesID;

            try
            {
              let cflag = false;
              var ttlErrJsnOrig = ErrorHandler.getTotalErrJson();
              let totalWarnJsn = ErrorHandler.getTotalWarningsJson();
              let totalInfoJsn = ErrorHandler.getTotalInfoMessageJson();
              let totalSuccJsn = ErrorHandler.getTotalSuccessMessageJson();
              for (var i = 0; i < errjsn.length; i++)
              {
                let xpth;// = errjsn[i].ctl;
                cflag = true;
                Log4r.log("errjsn[i][2]=>",errjsn[i][2]);
                if (errjsn[i][2] != "" && errjsn[i][2] != undefined && errjsn[i][2] != null)
                {
                  xpth = errjsn[i][2];
                }
                else {
                  xpth = undefined;
                }
                //Log4r.log("xpth == >",xpth);
                //Log4r.log("namess==> ",namess);
                if (errjsn[i][0] == "I") {
                  ttlErrJsn = totalInfoJsn;
                }
                else if (errjsn[i][0] == "E") {
                  ErrorHandler.setHoldColorUIScreen('#f5222d');
                  ttlErrJsn = ttlErrJsnOrig;
                }
                else if (errjsn[i][0] == "W") {
                  ttlErrJsn = totalWarnJsn;
                }else if (errjsn[i][0] == "S") {
                  ErrorHandler.setHoldColorUIScreen('#1dd435');
                  ttlErrJsn = totalSuccJsn;
                }else if (errjsn[i][0] == "D") {
                   /*let secondsToGo = 15;
                   const modalBox = Modal.success({
                     title: 'Dialog Box',
                     content: errjsn[i][1],
                   });
                   setTimeout(() => {
                   modalBox.destroy();
                 }, secondsToGo * 1000);*/
                }

                if(errjsn[i][0] !== "S"){
                    GlobalHelper.globlevar.savespin = false;
                }

                if(refreshOnSave !== true)
                {
                  GlobalHelper.globlevar.savespin = false;
                }

                if (xpth != "" && xpth != null && xpth != undefined)
                {
                  var aX,fpath;
                  for (var k = 0; k < namess.screendata.length; k++)
                  {
                    aX = namess.screendata[k].uiSchema[0].children.filter(itm2 => itm2.children.xPath === xpth);
                    //Log4r.log("aX",aX);
                    if (aX.length > 0 )
                    {
                      fpath = aX[0].children.fieldPath;
                      sesID = namess.screendata[k].sessionID;
                      break;
                    }
                    else
                    {
                      fpath = undefined;
                      sesID = undefined;
                    }
                  }
                  //Log4r.log("sesID==",sesID," fpath>",fpath);
                  //Log4r.log("getTotalErrJson==>",ttlErrJsn);

                  for (var j = 0; j < ttlErrJsn.length; j++)
                  {
                    if (typeof ttlErrJsn[j][sesID] == typeof {})
                    {
                      let qwe = [];
                      qwe[0] = errjsn[i][1];
                      ttlErrJsn[j][sesID][fpath] = qwe;
                    }
                  }
                }
                else
                {
                  //var ttlErrJsn = ErrorHandler.getTotalErrJson();
                  if (ttlErrJsn)
                  {
                    if (Array.isArray(ttlErrJsn))
                    {
                      var res22 = ttlErrJsn.filter(itm => itm["generic"])[0];
                      if (res22)
                      {
                        if (Array.isArray(res22["generic"]))
                        {
                          var checkDuplicate = res22["generic"].filter(itm2 => itm2[0] === errjsn[i][1]);
                          if (checkDuplicate.length != 0)
                          {
                          }
                          else
                          {
                            let qwe = [];
                            qwe[0] = errjsn[i][1];
                            res22["generic"][res22["generic"].length] = qwe;
                          }
                        }
                      }
                      else
                      {
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
              Log4r.log(ttlErrJsnOrig);
              Log4r.log(totalWarnJsn);
              Log4r.log(totalInfoJsn);
              Log4r.log(totalSuccJsn);
              ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
              ErrorHandler.setTotalWarningsJson(totalWarnJsn);
              ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
              ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
              if (cflag) {
                ErrorHandler.setHoldCount(0);
              }
              //Log4r.log("AJFG..",ErrorHandler.getAllErrWarnInfoArr());
          }
          catch(e)
          {
            Log4r.log(e);
          }
        }
            GlobalHelper.globlevar['ServerSideError']=true;
            this.state.errorstatus = true;

            if (this.props.outnames.data[1].name.SuccessFlag === true) {
              //  this.props.outnames.data[1].name.SuccessFlag = false;
                GlobalHelper.globlevar['ServerSideError']=false;
                GlobalHelper.globlevar['responsestatus'] = "s";
                responsestatus = "S";
                // used for save&close call if save will success so will go for close
                  // used for save&close call if save will success so will go for close     if(shouldCloseBeCalled){
                if(shouldCloseBeCalled){
                  // ErrorHandler.setErrMessage("Saved Successfully." , shouldCloseBeCalled);
                   /*
                    time reduced for settimeout function AND "savespin = false" set for spin.
                   */
                  GlobalHelper.globlevar.savespin = false;
                  shouldCloseBeCalled = false;

                  if(GlobalHelper.globlevar['crdView']){
                    GlobalHelper.globlevar['crdView'] = undefined;
                    //this.callClose();
                    var timeout = setTimeout(()=>{Log4r.log("!@#..val delay"); this.callClose();},50);
                  } else {
                    var timeout = setTimeout(()=>{Log4r.log("!@#..val delay"); this.callClose();},100);
                  }

                  }
                 // working for refresh after save success....
                 if(GlobalHelper.globlevar.linkclicked == true )
                 {
                   var savedAndFetchData = this.props.outnames.data[0].name;
                 }
                 else if(GlobalHelper.globlevar['savedandfetch'] )
                 {
                   GlobalHelper.globlevar['savedandfetch'] = false;
                   namess = this.props.outnames.data[0].name;
                   }
                 else if(GlobalHelper.globlevar.linkclicked == false)
                 {
                   if(GlobalHelper.globlevar['modalClosedClicked'] !== true){
                     //namess = this.F2FunctionNames.data[0].name;
                     namess = this.props.outnames.data[0].name;
                   } else {
                     GlobalHelper.globlevar['modalClosedClicked'] = undefined;
                   }

                 }

                 // if submit button clicked after success screen navigation to worklist page without nothing to save message.
                 if(calledFromSubmit === true)
                 {
                     var timeoutcalledFromSubmit = setTimeout(()=>{Log4r.log("!@#..val delay"); this.callClose(); },  500);
                 }
                 else
                 {

                     let values = GlobalHelper.globlevar.functionID;
                     if(GlobalHelper.globlevar.linkclicked)
                     {/*//Sprint 41  - Code is been commited to restrict redundant get data call
                            // post success save in dependable Grid / screen. i.e. parent & Leaf node
                             if(  GlobalHelper.globlevar['summaryConfigType_save'] ==  true)
                             {
                                 if(refreshOnSave)
                                 {
                                   refreshOnSave = undefined;
                                   store.dispatch({type: 'LAYOUTTOPICON',values});
                                 }
                                 else
                                 {
                                   GlobalHelper.globlevar.savespin = false;
                                 }
                             }
                             else
                             {
                              store.dispatch({type: 'GETREFRESHDATA',values});
                             }
                             *///Sprint 41  - Code is been commited to restrict redundant get data call
                     }
                     else
                     {
                          if(refreshOnSave)
                          {   // KiranDhakate
                             // refreshOnSave = undefined;
                              if(calledFromSubmit !== true)
                              {
                                // below code already convered in F2functionScreen
                                //store.dispatch({type: 'LAYOUTTOPICON',values});
                              }
                          }
                          else
                          {
                             GlobalHelper.globlevar.savespin = false;
                          }
                     }
                     if(this.props.outnames.data[1].name.SuccessFlag !== undefined)
                     {
                        //this.props.outnames.data[1].name.SuccessFlag = undefined;
                     }
                  }
              }
              else {
                responsestatus = undefined;
                GlobalHelper.globlevar['ServerSideError']=true;
                this.state.errorstatus = true;
              }

          }
        } else if((this.props.outnames.data[0].name.success != undefined || responsestatus == "S" || GlobalHelper.globlevar['savedandfetch'] == true) )
          {
            GlobalHelper.globlevar['ServerSideError']=false;
            GlobalHelper.globlevar['responsestatus'] = "s";
            if(responsestatus == "S")
            {
            // ErrorHandler.setstatusES("s");
            // ErrorHandler.setErrMessage("Saved Successfully.");
            // ErrorHandler.setType('S');
            }

            // used for save&close call if save will success so will go for close
            if(shouldCloseBeCalled){
               ErrorHandler.setErrMessage("Saved Successfully." , shouldCloseBeCalled);
               shouldCloseBeCalled = false;
               var timeout = setTimeout(()=>{Log4r.log("!@#..val delay"); this.callClose(); },  500);
             }

             // working for refresh after save success....
             if(GlobalHelper.globlevar.linkclicked == true )
             {
              /* preData.clear();
               this.getPredefinedData(holdbasicdata.data[0].name);
               this.ClearFormData();*/
            //  namess = this.props.outnames.data[0].name;
              var savedAndFetchData = this.props.outnames.data[0].name;

             }
             else if(GlobalHelper.globlevar['savedandfetch'] )
             {
               GlobalHelper.globlevar['savedandfetch'] = false;
               namess = this.props.outnames.data[0].name;

             }
             else if(GlobalHelper.globlevar.linkclicked == false)
             {
               if(GlobalHelper.globlevar['modalClosedClicked'] !== true){
                 //namess = this.F2FunctionNames.data[0].name;
                 namess = this.props.outnames.data[0].name;
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
       else if(this.props.outnames.data[0].name.screendata != null && GlobalHelper.globlevar.worklistinfo !== undefined && GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows.length == 0)
       {
         if(this.props.outnames.data[0].name.screendata.length == 0 && GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows.length == 0 && GlobalHelper.globlevar["flagToControlPopupForEmptyworklist"] == true){
           let closefuc = this.callClose;
  		//Sprint 37 - Task - Prompt Mode - Changes made to show message modal box if no record from server.
           GlobalHelper.globlevar["flagToControlPopupForEmptyworklist"] = false;
           displayMessageBox("No Record","No Record Available/No Data from Server","E",this.callClose);

           /*Modal.success({
             title: 'No Record',
             content: "No Record Available/No Data from Server",
             onOk:this.callClose
           });
           //this.callClose()
           */
  		 //END-Sprint 37 - Task - Prompt Mode - Changes made to show message modal box if no record from server.
         }
       }
       else if(this.props.outnames.data[0].name.screendata != null)
      {
        if(this.props.outnames.data[0].name.screendata.length != 0 && this.props.outnames.data[0].name.screendata[0].schema !== undefined){
          Log4r.log("checking errrr..2",this.props.outnames.ErrorMesgJsonOnload);
            if (this.props.outnames.ErrorMesgJsonOnload != undefined)
            {
              Log4r.log("got it");
              if(this.props.outnames.ErrorMesgJsonOnload.SuccessFlag !== undefined)
              {

              // ErrorHandler.setTotalErrJson([]);
              // ErrorHandler.setTotalWarningsJson([]);
              // ErrorHandler.setTotalInfoMessageJson([]);
              // ErrorHandler.setTotalSuccessMessageJson([]);
              let ttlErrJsn ;
              let ttlErrJsnOrig ;
              let totalWarnJsn ;
              let totalInfoJsn ;
              let totalSuccJsn;
              stopcount++;
              //Log4r.log("this.props.outnames.data[0].name.JSON_DATA  &&& ",this.props.outnames.data[0].name.ERROR);
              var errjsn = this.props.outnames.ErrorMesgJsonOnload.__f2_messages__;
              var sesID;

              try
              {
                let cflag = false;
                var ttlErrJsnOrig = ErrorHandler.getTotalErrJson();
                let totalWarnJsn = ErrorHandler.getTotalWarningsJson();
                let totalInfoJsn = ErrorHandler.getTotalInfoMessageJson();
                let totalSuccJsn = ErrorHandler.getTotalSuccessMessageJson();
                for (var i = 0; i < errjsn.length; i++)
                {
                  let xpth;// = errjsn[i].ctl;
                  cflag = true;
                  Log4r.log("errjsn[i][2]=>",errjsn[i][2]);
                  if (errjsn[i][2] != "" && errjsn[i][2] != undefined && errjsn[i][2] != null)
                  {
                    xpth = errjsn[i][2];
                  }
                  else {
                    xpth = undefined;
                  }
                  //Log4r.log("xpth == >",xpth);
                  //Log4r.log("namess==> ",namess);
                  if (errjsn[i][0] == "I") {
                    ttlErrJsn = totalInfoJsn;
                  }
                  else if (errjsn[i][0] == "E") {
                    ErrorHandler.setHoldColorUIScreen('#f5222d');
                    ttlErrJsn = ttlErrJsnOrig;
                  }
                  else if (errjsn[i][0] == "W") {
                    ttlErrJsn = totalWarnJsn;
                  }else if (errjsn[i][0] == "S") {
                    ErrorHandler.setHoldColorUIScreen('#1dd435');
                    ttlErrJsn = totalSuccJsn;
                  }else if (errjsn[i][0] == "D") {
                     /*let secondsToGo = 15;
                     const modalBox = Modal.success({
                       title: 'Dialog Box',
                       content: errjsn[i][1],
                     });
                     setTimeout(() => {
                     modalBox.destroy();
                   }, secondsToGo * 1000);*/
                  }

                  if(errjsn[i][0] !== "S"){
                      GlobalHelper.globlevar.savespin = false;
                  }

                  if(refreshOnSave !== true)
                  {
                    GlobalHelper.globlevar.savespin = false;
                  }

                  if (xpth != "" && xpth != null && xpth != undefined)
                  {
                    var aX,fpath;
                    for (var k = 0; k < namess.screendata.length; k++)
                    {
                      aX = namess.screendata[k].uiSchema[0].children.filter(itm2 => itm2.children.xPath === xpth);
                      //Log4r.log("aX",aX);
                      if (aX.length > 0 )
                      {
                        fpath = aX[0].children.fieldPath;
                        sesID = namess.screendata[k].sessionID;
                        break;
                      }
                      else
                      {
                        fpath = undefined;
                        sesID = undefined;
                      }
                    }
                    //Log4r.log("sesID==",sesID," fpath>",fpath);
                    //Log4r.log("getTotalErrJson==>",ttlErrJsn);

                    for (var j = 0; j < ttlErrJsn.length; j++)
                    {
                      if (typeof ttlErrJsn[j][sesID] == typeof {})
                      {
                        let qwe = [];
                        qwe[0] = errjsn[i][1];
                        ttlErrJsn[j][sesID][fpath] = qwe;
                      }
                    }
                  }
                  else
                  {
                    //var ttlErrJsn = ErrorHandler.getTotalErrJson();
                    if (ttlErrJsn)
                    {
                      if (Array.isArray(ttlErrJsn))
                      {
                        var res22 = ttlErrJsn.filter(itm => itm["generic"])[0];
                        if (res22)
                        {
                          if (Array.isArray(res22["generic"]))
                          {
                            var checkDuplicate = res22["generic"].filter(itm2 => itm2[0] === errjsn[i][1]);
                            if (checkDuplicate.length != 0)
                            {
                            }
                            else
                            {
                              let qwe = [];
                              qwe[0] = errjsn[i][1];
                              res22["generic"][res22["generic"].length] = qwe;
                            }
                          }
                        }
                        else
                        {
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
                Log4r.log(ttlErrJsnOrig);
                Log4r.log(totalWarnJsn);
                Log4r.log(totalInfoJsn);
                Log4r.log(totalSuccJsn);
                ErrorHandler.setTotalErrJson(ttlErrJsnOrig);
                ErrorHandler.setTotalWarningsJson(totalWarnJsn);
                ErrorHandler.setTotalInfoMessageJson(totalInfoJsn);
                ErrorHandler.setTotalSuccessMessageJson(totalSuccJsn);
                if (cflag) {
                  ErrorHandler.setHoldCount(0);
                }
                //Log4r.log("AJFG..",ErrorHandler.getAllErrWarnInfoArr());
            }
            catch(e)
            {
              Log4r.log(e);
            }
          }
            }
            Log4r.log("responsestatus 2 " , responsestatus ,GlobalHelper.globlevar['savedandfetch']);
            if(this.state.errorstatus==true && this.props.outnames.data[1].name.SuccessFlag === undefined)
             {
               preData.clear();
               this.getPredefinedData(holdbasicdata.data[0].name);
               this.ClearFormData();
               this.setState({
                clearForm:true,
                errorstatus:false
              })
            }
          //localfile test...
          //namess = file.name;
          namess = this.props.outnames.data[0].name;
        }
        // if blank screen loaded from data-service in case of functin screen.
        if(this.props.outnames.data[0].name.screendata.length === 0){
           namess = this.props.outnames.data[0].name;
        }
      }

    if(!GlobalHelper.globlevar.linkclicked){
      if (GlobalHelper.globlevar['modalClosedClicked'] === true) {

      }else{
        this.rowLinkClick(namess);
      }

    }
    else{
        Log4r.log("error2");
        //  namess = file.name;
    }
  } // ends here
}
  catch (error) {
    Log4r.error('Error......', error);
     //namess = file.name;
     if(this.props.outnames.data == undefined )
     {
      namess = file.name;
     }
  }
}
// Sprint 19 - Task 15 save&NEXT - success message should show for time and clean when next screen open
if(GlobalHelper['uiNextButtonHandler'] == true){
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

if(closepath === 'GridWorkList' )
{
  closepath = undefined;
  ErrorHandler.clear();
  this.props.outnames.ScreenLayoutName = "GridWorkList";
  return( <Provider store={store}>
    <Suspense fallback={null}>
    <Switch>
    <Route path= {GlobalHelper.globlevar.contextpath + 'GridWorkList'}  component={state=><GridWorkList widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" mainpathname="GridWorkList"/>  } />
    <Route path="/*" render={() => (
      <Redirect to={"GridWorkList"} />
    )} />
    </Switch>
    </Suspense>
    </Provider> );
  }

if(this.state.refresh == true )
{
    this.setState({refresh :false});
  return( <Provider store={store}>
    <Suspense fallback={null}>
    <Switch>
    <Route path="/*" render={() => (
         <Redirect to={"UIScreen"} />
         )} />
         <Route path={GlobalHelper.globlevar.contextpath + 'UIScreen'} component={ state=><UIScreen widths={this.state.widths}  themeCode={this.state.themeName}/> } />

    </Switch>
    </Suspense>
    </Provider> );
  }
  try
  {
   if(this.props.outnames.length !==0 && this.props.outnames !==null )
    {
      if(this.props.outnames.data.length > 1)
      {
        if(responsestatus==="S")
        {

          if(topvalue !== undefined)
          {

            // responseaction value need to take from configurations..
            var responseaction = "refresh";
            //topvalue = undefined;
            this.handleClick("REFRESH","sesHeadr");

            if(refreshOnSave)
             {
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

                 if(temlabel === "" )
                 {
                   //Sprint 41  - Code is been commited to restrict redundant get data call
                    /*   if(GlobalHelper.globlevar.linkclicked)
                       {
                        // post success save in dependable Grid / screen. i.e. parent & Leaf node
                         if(  GlobalHelper.globlevar['summaryConfigType_save'] ==  true)
                         {
                            store.dispatch({type: 'LAYOUTTOPICON',values});
                         }
                         else
                         {
                          store.dispatch({type: 'GETREFRESHDATA',values});
                         }

                       }
                       else
                       {
                        store.dispatch({type: 'LAYOUTTOPICON',values});
                      }*///Sprint 41  - Code is been commited to restrict redundant get data call
                  }
                  else if(temlabel !== "next")
                    {
                      //GlobalHelper.globlevar['savedandfetch'] = true;
                       Log4r.log("uiNextButtonHandler after save...");
                       var timeout = setTimeout(()=>{Log4r.log("!@#..val delay");  uiNextButtonHandler("NEXT"); GlobalHelper['uiNextButtonHandler'] = true; },  500);
                       temlabel = "next"
                    }


                 this.setState({refetchresponsedata : false});
               // --------------------------
             }
             else
             {

              if(temlabel !== "next" && temlabel==="SAVE & NEXT")
                    {
                      //GlobalHelper.globlevar['savedandfetch'] = true;
                       Log4r.log("uiNextButtonHandler after save...");

                       var timeout = setTimeout(()=>{Log4r.log("!@#..val delay"); ErrorHandler.clear(); uiNextButtonHandler("NEXT"); GlobalHelper['uiNextButtonHandler'] = true; },  500);
                       temlabel = "next"

                       this.setState({refetchresponsedata : false});
                    }

               GlobalHelper.globlevar.savespin = false;
             }
            }

         /* preData.clear();
          //this.getPredefinedData(holdbasicdata.data[0].name);
          this.getPredefinedData(GlobalHelper.globlevar['basicjson'].data[0].name);
          this.ClearFormData();*/


          /*Log4r.log("Deleting Formdata !");
          var deleteFlag=false;

          for(var i=0;i<holdNamess.screendata.length;i++)
            {

              for(var j=0;j<holdNamess.screendata[i].formData.length;j++)
               {
               var KeyArray=Object.keys(holdNamess.screendata[i].formData[j]);

               Log4r.log("holdNamess.screendata[i].uiSchema[0].children[0].children.widget : ",holdNamess.screendata[i].uiSchema[0].children[0].children.widget);

               if(holdNamess.screendata[i].uiSchema[0].children[0].children.widget !== "table" && holdNamess.screendata[i].uiSchema[0].children[0].children.widget !== "hidden" )
               {
                 for (var k = 0; k < KeyArray.length; k++)
                   {
                    Log4r.log("KEY ARRAY : ",KeyArray[k]);
                      preData.forEach(function(value, key){
                        if(key===KeyArray[k])
                        {
                          Log4r.log("MATCHED !!",holdNamess.screendata[i].formData[j][KeyArray[k]].data,value);
                          holdNamess.screendata[i].formData[j][KeyArray[k]].data=value;
                          deleteFlag=true;
                        }
                      })
                      if(!deleteFlag)
                      {
                        holdNamess.screendata[i].formData[j][KeyArray[k]].data='';
                      }
                      else
                      {
                        deleteFlag=false;
                      }
                    }
                }
              }
              }
          }*/
        }
        else
        {
          this.state.clearFormsubmit=false;
        }
      }
   }
/*    if(this.props.outnames.data.length > 0)
    {


        if(this.props.outnames.data[0].name.screendata[0].schema == undefined)
        {

         // if(namess.LayoutHeader === this.props.outnames.data[0].name.LayoutHeader)
        //  {
                for(var i=0;i<namess.screendata.length;i++)
                {
                  if(namess.screendata[i].sessionID==this.props.outnames.data[0].name.screendata[0].sessionID)
                  {

                    if(responsestatus==="S")
                    {
                      namess.screendata[i].formData=holdbasicdata.data[0].name.screendata[0].formData;
                    }
                    else
                    {
                      namess.screendata[i].formData=this.props.outnames.data[0].name.screendata[0].formData;
                    }
                  }
                }
                Log4r.log("formData set...");
        //  }
      //    else {
      //        Log4r.log("LayoutHeader dont matched...........");
      //    }
        }

    } */
if(GlobalHelper.globlevar['onlyDataCalled'] && this.props.outnames.data[0].name.screendata.length === 0 ){
  //Log4r.log("Get Data Call ",this.props.outnames);
  //Log4r.log("Get Data Call 2 ",namess , names);
  // This code added to Handled detail section in case of server is not having data for clicked link
  let dependantSections = null;
  if(this.props.outnames.extradata != null) {
            Log4r.log("this.props.outnames.extradata",this.props.outnames.extradata);
            if(this.props.outnames.extradata.formDataVal != null) {
              if(this.props.outnames.extradata.formDataVal.data.detailsectionid != null) {
                dependantSections = new Model().getLeafNodesForId(this.props.outnames.extradata.formDataVal.data.detailsectionid);
              }
            }
  }
  if(dependantSections != null) {
            for (let i = 0; i < Object.keys(dependantSections).length; i++) {
              Log4r.log("this.F2FunctionScreenRef",this.F2FunctionScreenRef);
              this.ClearFormsData(Object.keys(dependantSections)[i]);
            }
  }
  Log4r.log("Data not found in case of detailsection summery grid ")
  //displayMessageBox("","DATA NOT FOUND","abc")
  namess =  names;
}
if(GlobalHelper.globlevar['onlyDataCalled']){
  if(this.props.outnames.data.length > 0)
    {
        if(this.props.outnames.data[0].name.screendata[0].schema == undefined)
        {
          namess['DTL_SEC_LIST'] = namess['DTL_SEC_LIST'] ? namess['DTL_SEC_LIST'] : {};
          let dtlSecList = this.props.outnames.data[0].name['DTL_SEC_LIST'] ? this.props.outnames.data[0].name['DTL_SEC_LIST'] : {};
          //Log4r.log("dtlSecList 1 " , namess , dtlSecList);
          for(let key in dtlSecList){
            //Log4r.log("dtlSecList 2 " , namess , dtlSecList[key]);
            namess['DTL_SEC_LIST'][key] = dtlSecList[key];
          }
          //Log4r.log("dtlSecList 3 " , namess);
          let dependantSections = null;
          if(this.props.outnames.extradata != null){
            Log4r.log("this.props.outnames.extradata",this.props.outnames.extradata);
            if(Array.isArray(this.props.outnames.extradata) === true){
              for (let i = 0; i < this.props.outnames.extradata.length; i++) {
                this.props.outnames.extradata[i]
                if(this.props.outnames.extradata[i] != null) {
                  dependantSections = new Model().getLeafNodesForId(this.props.outnames.extradata[i]);
                }
                if(dependantSections != null) {
                  for (let i = 0; i < Object.keys(dependantSections).length; i++) {
                    this.ClearFormsData(Object.keys(dependantSections)[i]);
                  }
                }
              }
            } else {
                if(this.props.outnames.extradata.formDataVal != null) {
                  if(this.props.outnames.extradata.formDataVal.data.detailsectionid != null) {
                    dependantSections = new Model().getLeafNodesForId(this.props.outnames.extradata.formDataVal.data.detailsectionid);
                  }
               }
              if(dependantSections != null) {
                for (let i = 0; i < Object.keys(dependantSections).length; i++) {
                  this.ClearFormsData(Object.keys(dependantSections)[i]);
                }
              }
            }
          }


          for(var i=0;i<namess.screendata.length;i++)
          {
            for(var j=0;j<this.props.outnames.data[0].name.screendata.length;j++)
            {
               if(namess.screendata[i].sessionID === this.props.outnames.data[0].name.screendata[j].sessionID)
                {
                  for (var k = 0; k < namess.screendata[i].uiSchema[0].children.length; k++)
                    {
                      /******************/
                      if(responsestatus==="S")
                      {
                        if(namess.screendata[i].uiSchema[0].children[k].children.widget !== "table")
                        {
                          if(savedAndFetchData.screendata[j].formData.length !== 0){
                            namess.screendata[i].formData = savedAndFetchData.screendata[j].formData;
                          }
                          break;
                        }
                        else
                        {
                          if(savedAndFetchData.screendata[j].formData.length !== 0){
                            namess.screendata[i].formData[0][namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = savedAndFetchData.screendata[j].formData[0].data.DataSource;
                          }
                          break;
                        }
                      }
                      else
                      {
                        if(namess.screendata[i].uiSchema !== undefined)
                        {
                          if(namess.screendata[i].uiSchema[0].children[k].children.widget !== "table")
                          {
                            Log4r.log("namess.screendata[i].formData",namess.screendata[i].formData);
                            let tempFormData = this.props.outnames.data[0].name.screendata[j].formData;
                            if (Array.isArray(tempFormData) && tempFormData.length == 0) {
                              let tempUIschema = namess.screendata[i].uiSchema[0].children;
                              for (let j = 0; j < tempUIschema.length; j++) {
                                namess.screendata[i].formData[0][tempUIschema[j].children.fieldPath].data = [""];
                              }
                            }
                            else if (Array.isArray(tempFormData) && tempFormData.length > 0)
                            {
                              if(this.props.outnames.data[0].name.screendata[j].formData.length !== 0){
                                namess.screendata[i].formData = this.props.outnames.data[0].name.screendata[j].formData;
                              }
                              break;
                            }
                          }
                          else
                          {
                            if(this.props.outnames.data[0].name.screendata[j].formData.length !== 0){
                              namess.screendata[i].formData[0][namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.DataSource = this.props.outnames.data[0].name.screendata[j].formData[0].data.DataSource;

                              if (this.props.outnames.data[0].name.screendata[j].formData[0].data['parentPK'] !== undefined)
                              {
                                namess.screendata[i].formData[0][namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data['parentPK'] = this.props.outnames.data[0].name.screendata[j].formData[0].data['parentPK'];
                              }

                              if (this.props.outnames.data[0].name.screendata[j].formData[0].data.moreRows)
                              {
                                namess.screendata[i].formData[0][namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.moreRows = this.props.outnames.data[0].name.screendata[j].formData[0].data.moreRows;
                              }

                              if (this.props.outnames.data[0].name.screendata[j].formData[0].data.tableRefreshed !== undefined)
                              {
                                namess.screendata[i].formData[0][namess.screendata[i].uiSchema[0].children[k].children.fieldPath].data.tableRefreshed = this.props.outnames.data[0].name.screendata[j].formData[0].data.tableRefreshed;
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
  }

  } // END try
  catch (error) {
    Log4r.log('Error....user at 3000 location..', error);
  }

  names = namess;
  holdNamess=namess;

  if(names != null && names.screendata != null)
  for (var i = 0; i < names.screendata.length; i++) {
    let user = names.screendata[i];
    Log4r.log("user=>>>",user);
    if (user.allowRefresh ==="true") {
      if (user.sectionButton == undefined) {
        Log4r.log("oneee");
        let addRowtoGridSectionButton2 = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"refreshButton\",\"title\": \"Refresh\",\"fname\": \"refreshFun\"}]}";
        user['sectionButton'] = JSON.parse(addRowtoGridSectionButton2);
      }
      else {
        Log4r.log("twooo");
        if (user.sectionButton.buttons != undefined && Array.isArray(user.sectionButton.buttons)) {
          Log4r.log("three");
          let resArr2 = user.sectionButton.buttons.filter(itm2=>itm2.id == "refreshButton")[0];
          if (resArr2 == undefined) {
            let refshBtn = "{\"id\": \"refreshButton\",\"title\": \"Refresh\",\"fname\": \"refreshFun\"}";
            let btn = JSON.parse(refshBtn);
            user.sectionButton.buttons.push(btn);
          }
        }
        else if (user.sectionButton.buttons == undefined) {
          Log4r.log("fourthhhh");
          let addRowtoGridSectionButton2 = "{\"applicable\": \"true\",\"buttons\": [{\"id\": \"refreshButton\",\"title\": \"Refresh\",\"fname\": \"refreshFun\"}]}";
          user['sectionButton'] = JSON.parse(addRowtoGridSectionButton2);
        }
      }
    }
  }

  try{
	  this.props.outnames.data[0].name = namess;
	  GlobalHelper.globlevar['UIScreenLayoutJson']['names']=this.props.outnames;
	  xpathFactory(namess)
    let custXpathFactory =  eval(window.xpathFactory);
    if (typeof custXpathFactory != typeof undefined) {
      custXpathFactory(namess);
    } 
  }
  catch(e){Log4r.log(e)}
  //headername = Rightsidermenu[0].groupDesc
 /* for (var r =0; r < Rightsidermenu.length ; r++) {
       Log4r.log("!!@@#@!...!!!!@#@####.Rightsidermenu[r].groupDesc.",Rightsidermenu[r].groupDesc);
    headername=      Rightsidermenu[r].groupDesc;
    }*/

    if(GlobalHelper.globlevar.headername == true)
    {

      if(GlobalHelper.defaultfunction!= null && GlobalHelper.defaultfunction!== "")
       {
         if(GlobalHelper.worklistData !== undefined && GlobalHelper.worklistData.worklist.taskHistFunId !== undefined && GlobalHelper.worklistData.worklist.taskHistFunId !== "null" && GlobalHelper.worklistData.worklist.taskId !== undefined && GlobalHelper.worklistData.worklist.taskId !== "" ){
           defaultFunctionId = GlobalHelper.defaultfunction[0];
           a = GlobalHelper.defaultfunction[0];
           GlobalHelper.globlevar['HistoryTimelineView'] = true;
           Log4r.log("GlobalHelper.defaultfunction",GlobalHelper.defaultfunction);
           Log4r.log("GlobalHelper.worklistData.worklist.taskHistFunId",GlobalHelper.worklistData.worklist.taskHistFunId);
           createHistoryTimelineView=true;
           //onlyCloseButtonViews = true;
           onlyCloseButtonViews = null;
           showOnlyCloseButton = null;
           if(namess.ButtonPalette !== null){
              TimelineHistorypalatte = JSON.parse(JSON.stringify(namess.ButtonPalette));
            }
            CloseButtonpalette = [];
            let aCombinedObject = {};

            let schemaArray = [];
            let uischemaArray = [];
            let formdataArray = [];

            formdataArray.push({'close':{"style": {"type": "default","size": "large","label": "CLOSE","classname": "paletteClassSave","icon": "times", "accessCat" : "W", "buttonCategory" : "STANDARD", "eventName" : ""}}});
            schemaArray.push({'close':{"title":""}});
            let uiChildrenObject = {};
            uiChildrenObject['xType'] = "grid";
            uiChildrenObject['children'] = [];
            uiChildrenObject['children'].push({"xType": "col","span": 6,"children": {"xType": "field","widget": "button","fieldPath": "close"}});
            uischemaArray.push(uiChildrenObject);

            aCombinedObject['formData'] = formdataArray;
            aCombinedObject['uiSchema'] = uischemaArray;
            aCombinedObject['schema'] = schemaArray;

            CloseButtonpalette.push(aCombinedObject);
            Log4r.log("TEST QWE",CloseButtonpalette);
         }
         else {
           createHistoryTimelineView=false;
           GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
           onlyCloseButtonViews = null;
        }

       }
       else {
         createHistoryTimelineView=false;
         GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
         onlyCloseButtonViews = null;
       }
       GlobalHelper.globlevar.headername =false;
     }else{
       //Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.
          if(this.checkForWorkflowHistoryFunction()){
           Log4r.log("asjdlkajsd.......",true);
           GlobalHelper.globlevar['HistoryTimelineView'] = true;
           createHistoryTimelineView=true;
           //onlyCloseButtonViews = true;
           onlyCloseButtonViews = null;
           showOnlyCloseButton = null;
           if(namess.ButtonPalette !== null){
              TimelineHistorypalatte = JSON.parse(JSON.stringify(namess.ButtonPalette));
            }
            CloseButtonpalette = [];
            let aCombinedObject = {};

            let schemaArray = [];
            let uischemaArray = [];
            let formdataArray = [];

            formdataArray.push({'close':{"style": {"type": "default","size": "large","label": "CLOSE","classname": "paletteClassSave","icon": "times", "accessCat" : "W", "buttonCategory" : "STANDARD", "eventName" : ""}}});
            schemaArray.push({'close':{"title":""}});
            let uiChildrenObject = {};
            uiChildrenObject['xType'] = "grid";
            uiChildrenObject['children'] = [];
            uiChildrenObject['children'].push({"xType": "col","span": 6,"children": {"xType": "field","widget": "button","fieldPath": "close"}});
            uischemaArray.push(uiChildrenObject);

            aCombinedObject['formData'] = formdataArray;
            aCombinedObject['uiSchema'] = uischemaArray;
            aCombinedObject['schema'] = schemaArray;

            CloseButtonpalette.push(aCombinedObject);
            Log4r.log("TEST QWE........",CloseButtonpalette,Rightsidermenu);
          } else {
           Log4r.log("asjdlkajsd.......",false);
           createHistoryTimelineView=false;
           GlobalHelper.globlevar['HistoryTimelineView'] = undefined;
           onlyCloseButtonViews = null;
         }
       //END - Sprint 31 - Task 57 - To enable History Timeline functionality for multiple functions if configured in worklist data otherwise should be enabled only for default function.
     }


  var imgpath = window.location.origin;
  /*Sprint 13 - Added to hide header in function screen*/
  var headerClassProp;
  var layoutClassProp;
  if(GlobalHelper.globlevar.removeHeaderFlag)
  {
    headerClassProp = styles.head_chk;
    layoutClassProp = styles.layout_near_rightsider_chk;
  }
  else {
    headerClassProp = styles.head;
    layoutClassProp = styles.layout_near_rightsider;
  }//end

  //var path = "/MainLayout";
  let subFuncName = ""
  if(GlobalHelper.globlevar['subFuncName'] !== undefined )
  {
    subFuncName = " | " + GlobalHelper.globlevar['subFuncName'];
  }

  //Sprint 32 - Task - To make history timeline sections readonly
  //Log4r.log("timeline flags.........",createHistoryTimelineView,GlobalHelper.globlevar['HistoryTimelineView']);
  if(createHistoryTimelineView == true && GlobalHelper.globlevar['HistoryTimelineView'] == true){
    //Log4r.log("jhdlkjad.....",namess,historyFunctionFlag);
    if(historyFunctionFlag === true){
      namess.screendata.map((item,index)=>{
        //Log4r.log("sections......",item,index);
        if(index > 0 ){
          Log4r.log("sections......",item,index);
          item['editable'] = false;
          //To make Section Grid readonly....
          if(item.uiSchema[0] != null && item.uiSchema[0].children != null){
            if(item.uiSchema[0].children[0].children.edit != null){
              item.uiSchema[0].children[0].children.edit = "false";
              if(item.uiSchema[0].children[0].children.widget === "table"){
                item.formData[0][item.uiSchema[0].children[0].children.fieldPath].data.Columns.map((colItem,colIndex)=>{
                  Log4r.log("sajdhbkjsad......",colItem,colIndex);
                  colItem['completeEditable'] = false;
                  //Sprint 32 - To remove add,edit and delete column from history functionn screen after making it readonly.
                  if(colItem['id'] === "add" || colItem['id'] === "edit" || colItem['id'] === "delete"
                   ||colItem['title'] === "add" || colItem['title'] === "edit" || colItem['title'] === "delete"
                   ||colItem['style'] === "add" || colItem['style'] === "edit" || colItem['style'] === "delete"
                   ||colItem['fieldPath'] === "add" || colItem['fieldPath'] === "edit" || colItem['fieldPath'] === "delete"){
                    Log4r.log("sajdhbkjsad......",colItem,colIndex);
                    colItem['removeColumnForHistoryScreen'] = "true";
                    colItem['widget'] = "hidden";
                  }//END - Sprint 32 - To remove add,edit and delete column from history functionn screen after making it readonly.
                })
              }
            }
          }
          //Sprint 32 - Task - To make history timeline sections and section button readonly...
          if(item.sectionButton != null){
            item.sectionButton['disabled']=true;
            item.sectionButton['widgetEditFlag'] == "false";
            item.sectionButton.buttons.map((buttonobj,btnindex)=>{
              buttonobj['readOnlyButton'] = true;
            })
            GlobalHelper.globlevar['HistoryTimelineViewSectionButton'] = true;
          }//END - Sprint 32 - Task - To make history timeline sections and section button readonly...
        }
      })
    }
  }
  Log4r.log("skjhckjsahfdkjsahd.......",namess);
  //END - Sprint 32 - Task - To make history timeline sections readonly

  /* code to execute rule execution starts */
  if(this.targetToRulesMapper !=undefined && (this.ruleToTargetsMapper !=undefined) &&(this.fieldInExpressionToRulesMapper !=undefined) && (this.defaultValueManagerMap !=undefined) && (this.ruleExecutionStatusMap!=undefined) && (this.throwValidationRulesArray!=undefined)){
    if(this.targetToRulesMapper.size==0 && (this.ruleToTargetsMapper.size==0) && (this.fieldInExpressionToRulesMapper.size==0) && (this.defaultValueManagerMap.size==0) && (this.ruleExecutionStatusMap.size==0) && (this.throwValidationRulesArray.length==0)){
    this.targetToRulesMapper = GlobalHelper.globlevar['targetToRulesMapper'];
    this.ruleToTargetsMapper = GlobalHelper.globlevar['ruleToTargetsMapper'];
    this.fieldInExpressionToRulesMapper = GlobalHelper.globlevar['fieldInExpressionToRulesMapper'];
    this.defaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
    this.ruleExecutionStatusMap = GlobalHelper.globlevar['ruleExecutionStatusMap'];
    this.throwValidationRulesArray = GlobalHelper.globlevar['throwValidationRulesArray'];
    }
  }
  let ruleUtilityObject = new RuleExecutionUtility(namess,this.targetToRulesMapper,this.ruleToTargetsMapper,this.fieldInExpressionToRulesMapper,this.defaultValueManagerMap,this.ruleExecutionStatusMap,this.throwValidationRulesArray,this.fieldsChangedForRuleExecution,this.isOnload);
  let onlyThrowValidationError=false;
  namess=ruleUtilityObject.executeRules(onlyThrowValidationError);
  this.fieldsChangedForRuleExecution=[]; // clear the array as it should get refreshed after execution of a rule cycle
  this.isOnload = false; // once rule execution occurs onLoad, this flag should turn false to differentiate re rendering of page due to other events from onLoad
  /* code to execute rule execution ends */

try{
  if(onlyCloseButtonViews == true){
    if(showOnlyCloseButton == true){
      namess.ButtonPalette.splice(0,namess.ButtonPalette.length);
      namess.ButtonPalette.splice(0,0,CloseButtonpalette[0]);
    } else {
      namess.ButtonPalette.splice(0,namess.ButtonPalette.length);
      namess.ButtonPalette.splice(0,0,TimelineHistorypalatte[0]);
    }
  }


return (
<Layout  className={styles.layout_near_main_header}>
<HotKeyComponent UIScreenFlag={true} UIScreenInitialFunctionID={GlobalHelper.globlevar['InitialScreenFunctionID']} Component={this} ComponentProps={this.props} ButtonPalette={namess.ButtonPalette} UIScreenBulkFunctionID={right} Rightsidermenu={Rightsidermenu}/>
<Header dir={GlobalHelper.contextSetting.ORG_LANGUAGE_CODE} className={headerClassProp} style={{width:this.props.widths+65,overflow:'hidden', borderRadius: '5px', paddingLeft: '0px' , background:'white', minHeight:76}}>
{this.getHeaderTemplate()}
</Header>

<Layout id={stylesfu.screen} className={layoutClassProp} style={{height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144)}}>
<Layout id={stylesfu.screen} style={{overflow:'hidden', position:'absolute', width:(TimeLineView ? (this.props.themeCode==="myCompact" ? this.state.widths-$('[class*=layout_near_timeline]').width()-3 : this.state.widths-$('[class*=layout_near_timeline]').width()-9.5) : (this.props.themeCode==="myCompact" ? (Rightsidermenu != null && Rightsidermenu.length !== 0 ? this.state.widths+6 : this.state.widths+65 ) : (Rightsidermenu != null && Rightsidermenu.length !== 0 ? this.state.widths : this.state.widths+65 ) ) ) , height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144) , left:(window.innerWidth > 760 ? 0 : 2 ) }} className={stylesfu.headerConslidercssfollowup}>



  {
    Rightsidermenu != null && Rightsidermenu.length !== 0 ?<Header className={styles.customHeader1} style={{ height:52, minHeight:'40px',maxHeight:55, overflow:"hidden", width:'100%', display: 'inline-block', paddingLeft:'10px'}}>
    <div className={styles.SubHDL}><FA name={"fas fa-angle-left"} className={styles.SubLSB}/></div>
    <div className={styles.MyHeaderDiv}>
    {

   // will work with funcation modling part
    Rightsidermenu.map((post,jj)=>{
      let col = undefined;
      let ici = undefined;

      if(post.content != null){
        post.content.map((contentItem, cintentIndex)=>{
        if(contentItem.functionType === "U") { //functionType
            this.customHeaderFunctionsToRender.set(contentItem.id,contentItem);
          }
        });
      }

      if (right == 0 && jj == 0) {
        let MyContent = [];
        if(post.content != null){
          post.content.map((contentItem, cintentIndex)=>{
            if(contentItem.functionType !== "U") {  //functionType
              MyContent.push(contentItem);
            }
          })
        }
        return (
          <div className={stylesf.iconGroup}>
          {
            MyContent.map((id,mn) =>
            {
              ici = GlobalHelper.getFontIcon(id.icon);
              col = GlobalHelper.getFontColor(id.icon);

              var funcHotKey;
              if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(id.id) != null){
                funcHotKey = GlobalHelper.HotKeyMap.get(id.id)['SZHOTKEYS'];
              } else {
                if(mn < 9)
                funcHotKey = 'ctrl+alt+'+(mn+1);
              }

              if (a == 0 && mn == 0) {
                headername = id.groupds;
                formSubTitle = id.desc;
                a=id.id;
                if (arrayOfRightSider[post.groupid] == undefined) {
                  allScrnErrObj={};
                  arrayOfRightSider[post.groupid]=allScrnErrObj;
                }else {
                  backuperrjson=allScrnErrObj[a];
                }
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons}>
                </FA>
                </div>
                </Popover>);
              } else if(id.id == a ) {
                headername = id.groupds;
                formSubTitle = id.desc;
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons}>
                </FA>
                </div>
                </Popover>);
              }
              return (
                <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons}>
                </FA>
                </div>
                </Popover>
              )
            })
        }
        </div>
      )
      } else if (post.groupid == right) {
        let MyContent = [];
        if(post.content != null){
          post.content.map((contentItem, cintentIndex)=>{
            if(contentItem.functionType !== "U") { //functionType
              MyContent.push(contentItem);
            }
          })
        }
        return (
          <div className={stylesf.iconGroup}>
          {
            MyContent.map((id,mn) =>
            {
              ici = GlobalHelper.getFontIcon(id.icon);
              col = GlobalHelper.getFontColor(id.icon);
              var funcHotKey;
              if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(id.id) != null){
                funcHotKey = GlobalHelper.HotKeyMap.get(id.id)['SZHOTKEYS'];
              } else {
                if(mn < 9)
                funcHotKey = 'ctrl+alt+'+(mn+1);
              }
              if( GlobalHelper.globlevar.UIScreen == "UIScreen" ) {
                  if(Array.isArray(GlobalHelper.defaultfunction) === true){
                    if(GlobalHelper.defaultfunction.indexOf(GlobalHelper.globlevar.functionID) == -1){
                      a = 0;
                    }
                  }
              }
              if (a == 0 && mn == 0) {
                a=id.id;
                headername = id.groupds;
                formSubTitle = id.desc;
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons}>
                </FA>
                </div>
                </Popover>);
              }else if(id.id == a )
              {
                headername = id.groupds;
                formSubTitle = id.desc;
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)} aria-label = {id.desc}> 
                <FA name={ici} className={stylesf.customIcons}>
                </FA>
                </div>
                </Popover>);
              }
              return (
                <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)} aria-label = {id.desc}>
                <FA name={ici} className={stylesf.customIcons}>
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
    <div className={styles.SubHDR}><FA name={"fas fa-angle-right"} className={styles.SubRSB}/></div>

    </Header>:null
  }
	<Spin spinning={GlobalHelper.globlevar.onScreenLoadSpin}>
      <Suspense fallback={null}>
          {
             GlobalHelper.globlevar['tabScreen'].length > 0 ?
                <Tabs hideAdd
                  onChange={this.onChange}
                  activeKey={GlobalHelper.globlevar['activetabKey']}
                  type= 'editable-card'
                  tabPosition = 'bottom'
                  tabBarGutter={2}
                  size='small'
                  tabBarStyle ={{ marginTop: '10px', borderTop:"1px solid #bfb7b7"}}>
                  {GlobalHelper.globlevar['tabScreen'].map((pane,index) => (
                    <TabPane id={'tab'+ index} tab={
                         <Tooltip title={
                           GlobalHelper.globlevar['tabScreen'].indexOf(this.addTabScreen[0]) + 1 === index? <span>{pane.title}<span style={{marginLeft:'30px'}}>ctrl+alt+f</span ></span>:
                           GlobalHelper.globlevar['tabScreen'].indexOf(this.addTabScreen[0]) - 1 === index? <span>{pane.title}<span style={{marginLeft:'30px'}}>ctrl+alt+r</span></span>
                           : <span>{pane.title}</span> 
                          }>
                          <span aria-label = {pane.title}><Icon type="cross" onClick={()=>this.onTabCloseClick(pane.key)}/> {pane.title} </span>
                      </Tooltip>
                       } 
                      key={pane.key}>
                      <F2FunctionScreen
                        customHeaderFunctionIndex={customHeaderFunctionIndex}
                        customHeaderFunctionCall={this.myFunction}
                        customHeaderFunctionsToRender={this.customHeaderFunctionsToRender}
                        storeF2VariablesForOpeningHistoryTimelineScreen={this.storeF2VariablesForOpeningHistoryTimelineScreen}
                        getF2VariablesForOpeningHistoryTimelineScreen={this.getF2VariablesForOpeningHistoryTimelineScreen}
                        ellipsisFlag={this.ellipsisFlag} assignErrorObj={this.assignErrorObj}
                        orientationType={pane.outnames.orientationType}
                        outnames={this.props.outnames}
                        formSubTitle={pane.title}
                        headername={pane.headername}
                        ref={this.F2FunctionScreenRef}
                        key={'F2FunctionScreen'+pane.key}
                        themeCode={this.state.themeName}
                        refreshQB={this.props.refreshQB}
                        refreshOnSave={refreshOnSave}
                        cardHeaderInfo ={pane.cardHeaderInfo} />
                    </TabPane>
                  ))}
                </Tabs> :
                <F2FunctionScreen customHeaderFunctionIndex={customHeaderFunctionIndex} customHeaderFunctionCall={this.myFunction} customHeaderFunctionsToRender={this.customHeaderFunctionsToRender} storeF2VariablesForOpeningHistoryTimelineScreen={this.storeF2VariablesForOpeningHistoryTimelineScreen} getF2VariablesForOpeningHistoryTimelineScreen={this.getF2VariablesForOpeningHistoryTimelineScreen} ellipsisFlag={this.ellipsisFlag} assignErrorObj={this.assignErrorObj} orientationType={this.props.outnames.orientationType} refreshQB={this.props.refreshQB} outnames={this.props.outnames} formSubTitle={formSubTitle} headername={headername} ref={this.F2FunctionScreenRef} key={'F2FunctionScreen'} themeCode={this.state.themeName} refreshOnSave={refreshOnSave} />
          }
        </Suspense>
	</Spin>
</Layout>

{
  Rightsidermenu != null && Rightsidermenu.length !== 0 ?<Sider
  trigger={null}
  collapsible
  collapsed={!this.state.rightcollapsed}
  className={styles.siderrightsetting}
  id={stylesfu.componentslayoutdemocustomtrigger}
  style={{right:(TimeLineView ? $('[class*=layout_near_timeline]').width()+9 : (window.innerWidth > 760 ? 0 : 2) ) , position:'absolute', height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144) , borderRadius: '5px'}}
  >

  <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}   className={styles.siderrightsettingMenu}  >
  {
  	Rightsidermenu.slice(0,8).map((post,ll) =>{
  		var isdefaultactive ="no";
  		let col = undefined;
  		let ici = undefined;

  		if(GlobalHelper.globlevar.UIScreen == "UIScreen" ){
  			// top 1 and right 1st menu should selected
  			GlobalHelper.globlevar.UIScreen = undefined;
  			//right = 1;
  		}
  		if(right == 1 && ll == 1)
  		{
  			isdefaultactive = "yes";
  			right=post.groupid;
  			Arrow=post.groupid;
  		}else if (right == post.groupid) {
  			isdefaultactive = "yes";
  			right=post.groupid;
  			Arrow=post.groupid;
  		} else {
  			isdefaultactive = "no";
  		}
  		if(post.icon_exp == "" || post.icon_exp==null || post.icon_exp==undefined){
  			ici ="sticky-note";
  		}else{
  			ici = GlobalHelper.getFontIcon(post.icon_exp);
  			col = GlobalHelper.getFontColor(post.icon_exp);
  		}
      var funcHotKey;
      if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(post.groupid) != null){
        funcHotKey = GlobalHelper.HotKeyMap.get(post.groupid)['SZHOTKEYS'];
      } else {
        // if(ll<9)
        // funcHotKey = 'alt+'+(ll+1);
      }
      if(post.groupid === "ELLIP"){
        if(newArr.length > 0){
          return(
                  <SubMenu key="sub1"
                  id={styles.ellipticSubmenu}
                  style={{width:'52px',height:52, display:'inline-block',position:'relative'}}
                  title={<div className={styles.ellipticSubMenus} aria-label={post.groupdesc} id={this.setIdToTimelineIcon(post.groupid)+funcHotKey}>
                          <span aria-label={post.groupdesc}><FA name={ici} stack='2' /></span>
                          </div>}>
                       {
                         newArr.map((post,ll)=>{
                               return(
                                    <Menu.Item  style={{paddingLeft:0,marginTop:-5}}>
                                    <span id={this.setSpanClass(post.groupid)}>
                                    <div onClick={()=>this.MyFuncRight(post , "ellipsisGroupMenuClicked")}>
                                    <span><FA name={GlobalHelper.getFontIcon(post.icon_exp)} style={{height:40,width:40,fontSize:(this.props.themeCode==="myCompact" ? '12pt' : '13pt') , paddingTop:'20px',textAlign:"center"}} stack='2'/></span>
                                    <span aria-label={post.groupdesc}>{post.groupdesc}</span>
                                    </div>
                                    </span>
                                    </Menu.Item>
                             )
                         })
                       }
                  </SubMenu>
          )
        }
      }
        return( //aria-label={15}
    				<span id={this.setSpanClass(post.groupid)} aria-label={post.groupdesc}> 
    				<Tooltip placement="left" title={<span>{post.groupdesc}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
    				<div className={this.setClassArrow(post.groupid,isdefaultactive)} />
    				<div className={this.setClassRightUI(post.groupid,isdefaultactive)} id={this.setIdToTimelineIcon(post.groupid)+funcHotKey} onClick={()=>this.MyFuncRight(post)} style={{marginTop:'1px',  borderRadius: '5px', marginTop:'-20px', cursor:'pointer'}}>
    		      <FA name={ici} stack='2' style={{fontSize:(this.props.themeCode==="myCompact" ? '12pt' : '13pt') , paddingTop:'20px',textAlign:"center"}} className={styles.rightsidericons} />
    				</div>
    				</Tooltip>
    				</span>
    			)


  		}

  	)
  }

  </Menu>
  </Sider>:null

}

<div className={styles.layout_near_timeline} style={{ width:(TimeLineWidth), minWidth:(TimeLineView ? '450px' : '0px'), display:(TimeLineView ? 'inline-block' : 'none'), height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144) }}>
<div style={{width:"90%"}} className={styles.timeLineWrapperTitle}>Timeline Layout
  <div style={{float:'right'}}>
    <ButtonSwitch  checkedChildren="Timeline" unCheckedChildren="Grid" defaultChecked={(GlobalHelper.globlevar.GridToTimeline ? true : false)} onChange={ function(checked){if(checked){ GlobalHelper.globlevar.GridToTimeline=true;this.forceUpdate();}else{GlobalHelper.globlevar.GridToTimeline=false;this.forceUpdate();}}.bind(this)} />
  </div>
</div>
<div className={styles.timeLineRadioButtons}>
<Button.Group>
{
  this.timelinebutton(GlobalHelper.globlevar['timelineScreen'])
}
</Button.Group>
</div>
  <div className={styles.timeLineContainer}>
    {
     this.timelineScreen(GlobalHelper.globlevar['timelineScreen'])
    }
  </div>
</div>

</Layout>
</Layout>
)
}
catch(e){Log4r.error("UIScreen Error Got !..",e);
  return(
<Layout  className={styles.layout_near_main_header}>
<HotKeyComponent UIScreenFlag={true} UIScreenInitialFunctionID={GlobalHelper.globlevar['InitialScreenFunctionID']} Component={this} ComponentProps={this.props} ButtonPalette={namess.ButtonPalette} UIScreenBulkFunctionID={right} Rightsidermenu={Rightsidermenu}/>
<Header className={headerClassProp} style={{width:this.props.widths+65,overflow:'hidden', borderRadius: '5px', paddingLeft: '0px' , background:'white', minHeight:76}}>
{this.getHeaderTemplate()} 
</Header>

<Layout  id={stylesfu.screen} className={layoutClassProp} style={{height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144)}}>
<Layout id={stylesfu.screen} style={{overflow:'hidden', position:'absolute', width:(TimeLineView ? (this.props.themeCode==="myCompact" ? this.state.widths-$('[class*=layout_near_timeline]').width()-3 : this.state.widths-$('[class*=layout_near_timeline]').width()-9.5) : (this.props.themeCode==="myCompact" ? (Rightsidermenu != null && Rightsidermenu.length !== 0 ? this.state.widths+6 : this.state.widths+65 ): (Rightsidermenu != null && Rightsidermenu.length !== 0 ? this.state.widths : this.state.widths+65 ) ) ) , height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144) , left:(window.innerWidth > 760 ? 0 : 2 ) }} className={stylesfu.headerConslidercssfollowup}>



  {
    Rightsidermenu != null && Rightsidermenu.length !== 0 ?<Header className={styles.customHeader1} style={{ height:52, minHeight:'40px',maxHeight:55, overflow:"hidden", width:'100%', display: 'inline-block', paddingLeft:'10px'}}>
    <div className={styles.SubHDL}><FA name={"fas fa-angle-left"} className={styles.SubLSB}/></div>
    <div className={styles.MyHeaderDiv}>
    {

   // will work with funcation modling part
    Rightsidermenu.map((post,jj)=>{
      let col = undefined;
      let ici = undefined;

      if(post.content != null){
        post.content.map((contentItem, cintentIndex)=>{
        if(contentItem.functionType === "U") { //functionType
            this.customHeaderFunctionsToRender.set(contentItem.id,contentItem);
          }
        });
      }

      if (right == 0 && jj == 0) {
        let MyContent = [];
        if(post.content != null){
          post.content.map((contentItem, cintentIndex)=>{
            if(contentItem.functionType !== "U") { //functionType
              MyContent.push(contentItem);
            }
          })
        }
        return (
          <div className={stylesf.iconGroup}>
          {
            MyContent.map((id,mn) =>
            {

              ici = GlobalHelper.getFontIcon(id.icon);
              col = GlobalHelper.getFontColor(id.icon);
              // if(id.icon == "" || id.icon==null || id.icon==undefined){
              //   Log4r.log("inside icon ");
              //   id.icon="sticky-note";
              // }
              var funcHotKey;
              if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(id.id) != null){
                funcHotKey = GlobalHelper.HotKeyMap.get(id.id)['SZHOTKEYS'];
              } else {
                if(mn < 9)
                funcHotKey = 'ctrl+alt+'+(mn+1);
              }
              if (a == 0 && mn == 0) {
                headername = id.groupds;
                formSubTitle = id.desc;
                a=id.id;
                if (arrayOfRightSider[post.groupid] == undefined) {
                  allScrnErrObj={};
                  arrayOfRightSider[post.groupid]=allScrnErrObj;
                }else {
                  backuperrjson=allScrnErrObj[a];
                }
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons} >
                </FA>
                </div>
                </Popover>);
              }else if(id.id == a )
              {
                headername = id.groupds;
                formSubTitle = id.desc;
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons} >
                </FA>
                </div>
                </Popover>);
              }
              return (
                <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons} >
                </FA>
                </div>
                </Popover>
              )
            })
        }
        </div>
      )
      }else if (post.groupid == right) {
        let MyContent = [];
        if(post.content != null){
          post.content.map((contentItem, cintentIndex)=>{
            if(contentItem.functionType !== "U") { //functionType
              MyContent.push(contentItem);
            }
          })
        }
        return (
          <div className={stylesf.iconGroup}>
          {
            MyContent.map((id,mn) =>
            {
              ici = GlobalHelper.getFontIcon(id.icon);
              col = GlobalHelper.getFontColor(id.icon);
              var funcHotKey;
              if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(id.id) != null){
                funcHotKey = GlobalHelper.HotKeyMap.get(id.id)['SZHOTKEYS'];
              } else {
                if(mn < 9)
                funcHotKey = 'ctrl+alt+'+(mn+1);
              }
              if(GlobalHelper.globlevar.UIScreen == "UIScreen" ){
                  // top 1 menu should selected
                  a = 0;
              }
              if (a == 0 && mn == 0) {
                a=id.id;
                headername = id.groupds;
                formSubTitle = id.desc;
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons} >
                </FA>
                </div>
                </Popover>);
              }else if(id.id == a )
              {
                headername = id.groupds;
                formSubTitle = id.desc;
                return ( <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons} >
                </FA>
                </div>
                </Popover>);
              }
              return (
                <Popover content={<span>{id.desc} <span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>} trigger="hover" >
                <div id={funcHotKey} style={{marginRight:'1px', cursor:'pointer'}}  className={this.setMyClass(id.id,a)} onClick={()=> this.myFunction(id.id,id.desc, id)}>
                <FA name={ici} className={stylesf.customIcons} >
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
    </Header>:null
  }

  <Suspense fallback={null}>
    <F2FunctionScreen customHeaderFunctionIndex={customHeaderFunctionIndex} customHeaderFunctionCall={this.myFunction} customHeaderFunctionsToRender={this.customHeaderFunctionsToRender} ellipsisFlag={this.ellipsisFlag} assignErrorObj={this.assignErrorObj} outnames ={this.props.outnames} refreshQB = {this.props.refreshQB} formSubTitle={formSubTitle} headername={headername} ref={this.F2FunctionScreenRef} key={'F2FunctionScreen'} themeCode={this.state.themeName} refreshOnSave={refreshOnSave} />
  </Suspense>

</Layout>


{
  Rightsidermenu != null && Rightsidermenu.length !== 0 ?<Sider
  trigger={null}
  collapsible
  collapsed={!this.state.rightcollapsed}
  className={styles.siderrightsetting}
  id={stylesfu.componentslayoutdemocustomtrigger}
  style={{right:(TimeLineView ? $('[class*=layout_near_timeline]').width()+9 : (window.innerWidth > 760 ? 0 : 2) ) , position:'absolute', height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144) , borderRadius: '5px'}}
  >

  <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}   className={styles.siderrightsettingMenu}  >
  {
    Rightsidermenu.map((post,ll) =>{
      var isdefaultactive ="no";
      let col = undefined;
      let ici = undefined;

      if(GlobalHelper.globlevar.UIScreen == "UIScreen" ){
        // top 1 and right 1st menu should selected
        GlobalHelper.globlevar.UIScreen = undefined;
        right = 0;
      }
      if(right == 0 && ll == 0)
      {
        isdefaultactive = "yes";
        right=post.groupid;
        Arrow=post.groupid;
      }else if (right == post.groupid) {
        isdefaultactive = "yes";
        right=post.groupid;
        Arrow=post.groupid;
      } else {
        isdefaultactive = "no";
      }
      if(post.icon_exp == "" || post.icon_exp==null || post.icon_exp==undefined){
        //Log4r.log("inside icon ");
        //post.icon_exp="sticky-note";
        ici ="sticky-note";
      }else{
        ici = GlobalHelper.getFontIcon(post.icon_exp);
        col = GlobalHelper.getFontColor(post.icon_exp);
      }
      var funcHotKey;
      if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(post.groupid) != null){
        funcHotKey = GlobalHelper.HotKeyMap.get(post.groupid)['SZHOTKEYS'];
      }else{
        // if(ll<9)
        // funcHotKey = 'alt+'+(ll+1);
      }
      return(
          <span id={this.setSpanClass(post.groupid)}>
          <Tooltip placement="left" title={<span>{post.groupdesc}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
          <div className={this.setClassArrow(post.groupid,isdefaultactive)} />
          <div className={this.setClassRightUI(post.groupid,isdefaultactive)} id={this.setIdToTimelineIcon(post.groupid)+funcHotKey} onClick={()=>this.MyFuncRight(post)} style={{marginTop:'1px',  borderRadius: '5px', marginTop:'-20px', cursor:'pointer'}}>
            <FA name={ici} stack='2' style={{fontSize:(this.props.themeCode==="myCompact" ? '12pt' : '13pt') , paddingTop:'20px',textAlign:"center"}} className={styles.rightsidericons} />
          </div>
          </Tooltip>
          </span>
        )
      }

    )
  }

  </Menu>
  </Sider>:null

}

<div className={styles.layout_near_timeline} style={{ width:(TimeLineWidth), minWidth:(TimeLineView ? '450px' : '0px'), maxWidth:(TimeLineView ? '400px' : '0px'), display:(TimeLineView ? 'inline-block' : 'none'), height: ( GlobalHelper.globlevar.removeHeaderFlag ? this.state.heighttable-54 : this.state.heighttable-144) }}>
<div style={{width:"90%"}} className={styles.timeLineWrapperTitle}>Timeline Layout
  <div style={{float:'right'}}>
    <ButtonSwitch  checkedChildren="Timeline" unCheckedChildren="Grid" defaultChecked={(GlobalHelper.globlevar.GridToTimeline ? true : false)} onChange={ function(checked){if(checked){ GlobalHelper.globlevar.GridToTimeline=true;this.forceUpdate();}else{GlobalHelper.globlevar.GridToTimeline=false;this.forceUpdate();}}.bind(this)} />
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
  timelinebutton(arr){
    try{
      if(screenLoadAndPostSaveFlag == true  || screenLoadAndPostSaveFlag == "onload"){
        screenLoadAndPostSaveFlag = false;
        screenLoadStartTime  = new Date().getTime();
      }
       return(arr.map((item,index)=>{
          Log4r.log("ARRRRRR" , arr);
          return(
            <Button onClick={this.setGrayScaleId.bind(this,item.sessionID)} className={this.setTimeLineButtonClass(item.sessionID)}>{item.sessionHeader}</Button>
          );
        }));
      }catch(e){Log4r.error(e)}
  }
  timelineScreen(arr){
    try{
        Log4r.log("ARRRRRR" , arr);
        return(arr.map((item,index)=>{
          return(
            <span id={item.sessionID}  className={this.setGrayScaleClass(item.sessionID)}>
              <Suspense fallback={null}>
                <ScreenMeta sectionXPath={item.sectionXPath} refreshSectionLevelButton={this.refreshSectionLevelButton} sectionButton={item.sectionButton} sessionID={item.sessionID} sectionId={item.sessionID} sectionhead={""} schema = {item.schema[0]} uiSchema = {item.uiSchema[0]} formData={item.formData[0]} editable={item.editable} changeRefreshERROR={this.changeRefreshERROR} themeCode={this.state.themeName}  widths={this.props.widths} onChange={this.handleChange} onClick={this.handleClick} isClearClicked={this.clearTriggered} handleAddCalled={this.handleAddCalled} isSaveClicked={this.state.isSaveClicked} fieldToActionMapper={this.fieldToActionMapper} namess = {namess}  layoutSize={item.layoutSize} onBlur={this.handleBlur} emulateOnLoad={this.emulateOnLoad} />
              </Suspense>
            </span>
          );
          }));
      }catch(e){Log4r.error(e)}
  }
  emulateOnLoad(){
    this.isOnload=true;
    this.setState({justRefresh:!this.state.justRefresh},()=>{
      if(GlobalHelper.globlevar.cardAddButtonClicked){
        GlobalHelper.globlevar.cardAddButtonClicked = undefined;
      }
    });
  }
}
UIScreen.propTypes ={
  actions:PropTypes.object.isRequired,
  outnames:PropTypes.array.isRequired
}

function hideHeaderBasedOnRules(state) {
  // HEADER RULES
  if (state && state.names && state.names.headerNames && state.names.headerNames.rules) {
    let rules = state.names.headerNames.rules;
    let screenData = state.names.headerNames.screendata[2];
    Object.keys(rules).map(ruleKey => {     // NOSONAR: javascript:S2201
      let rule = rules[ruleKey];
      let exp = rule.expression

      Object.keys(rule.ruleDetails).map(detailKey => {    // NOSONAR: javascript:S2201
        if (rule.ruleDetails[detailKey].action == "SHOWHIDE") {
          let Id = rule.ruleDetails[detailKey].targetContId && rule.ruleDetails[detailKey].targetContId.split('.')[1];
          // const value = screenData.formData && screenData.formData[0][Id].data[0] || '';
         
          const sourceId = exp.substring(exp.indexOf('.')+1, exp.indexOf('}'))
          const sourceIds = exp.split('.').map(i=>i.substr(0 , i.indexOf('}}'))).filter(i=>i!='')
          const sourceVal = exp.split("$V{'").map(i=>i.substr(0 , i.indexOf("'}"))).filter(i=>!i.includes('$F')&&i!='')
         
          if (screenData.formData && screenData.formData[0][Id] !== undefined && screenData.formData[0][sourceIds[0]] !== undefined && screenData.formData[0][sourceIds[1]] !== undefined) {
            if (screenData.formData[0][sourceIds[0]].data[0] == sourceVal[0] || screenData.formData[0][sourceIds[1]].data[0] == sourceVal[1]) {
             delete state.names.headerNames.screendata[2].schema[0][Id]
             delete state.names.headerNames.screendata[2].formData[0][Id]
            }
          }
        }
      })
    })
  }
}
function mapStateToProps(state , ownProps){
  //Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
  if(GlobalHelper.globlevar['ClipSearchViaWorklist'] !== true && GlobalHelper.globlevar['ClipSearchViaUIScreen'] !== true
    && GlobalHelper.globlevar['ClipSearchViaPrompMode'] !== true && GlobalHelper.globlevar['ClipSearchViaCustomScreen'] !== true
    && (GlobalHelper.globlevar['promptmode'] === null || GlobalHelper.globlevar['promptmode'] === undefined)){
    GlobalHelper.storeapFunction = ++GlobalHelper.storeapKey + '$' +GlobalHelper.globlevar.functionID;
    GlobalHelper.storeMap.set(GlobalHelper.storeapFunction,state);
  }//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.

  if( state.names.reassignF2FunctionTitle != undefined && state.names.reassignF2FunctionTitle == "true"){
   try{
    GlobalHelper.holdFunGroupData.forEach((value, key, map)=>{
      for (let i = 0; i < value.content.length; i++) {
        if (groupidFAVCllicked !== true) {
          if (value.groupcd !=="FAV") {
            if(value.content[i].id == state.names.f2FunctionId){
              if(customHeaderFunctionIndex == null) {
                a = value.content[i].id;
                right = value.groupid;
                Arrow = value.groupid;
                headername = value.content[i].groupds;
                formSubTitle = value.content[i].desc;
                break;
              } else {
                headername = "Utility Function";
                formSubTitle = value.content[i].desc;
                break;
              }
            }
          }
        }else{
          if(value.content[i].id == state.names.f2FunctionId){
            if(customHeaderFunctionIndex == null) {
              a = value.content[i].id;
              right = value.groupid;
              Arrow = value.groupid;
              if(GlobalHelper.globlevar["myfunleftclicked"] === true){
                  headername = value.content[i].groupds;
                  Rightsidermenu = [];
              } else {
                headername = "Favourites";
              }
              formSubTitle = value.content[i].desc;
              break;
            } else {
              headername = "Utility Function";
              formSubTitle = value.content[i].desc;
            }
          }
        }
      }
    })
   }catch(error){Log4r.log(error)}
  }

  if(		GlobalHelper.globlevar["test"]){
    		GlobalHelper.globlevar["test"] = false;
        namess = file.name;
  }
   /*Sprint 11 - Task 59 - Clip search Ajax call on click on search & show list of result or show details of screen if only one record available*/
   if(GlobalHelper.globlevar['ClipSearchViaWorklist'] != true ) {
      GlobalHelper.globlevar['UIScreenLayoutJson']=state;
      if(GlobalHelper.globlevar['gridredirect'] !== undefined && GlobalHelper.globlevar['gridredirect'] === "true")
      {
       closepath = "GridWorkList";
       GlobalHelper.globlevar['gridredirect']="false";
      }/**Sprint 11 - Task 59 end*/
  }

if(GlobalHelper.globlevar.savedFunctionID !== GlobalHelper.globlevar.functionID){
    responsestatus = undefined;
    GlobalHelper.globlevar.savedFunctionID = undefined;
  }

  var url = state.names.ScreenLayoutName;
  if (url !== undefined) {
    <Route render={({ history}) => (
      history.push(url)
    )} />
  }

  //{'LayoutName': 'MainLayout','ScreenLayoutName': 'editabledyna','LayoutHeader': '','data':[{'name': " + jsonTxt + "}]}}

  if(state.names.data !== undefined)
  {
    if(state.names.data.length !== 0)
    {
      if(state.names.data[0].name !== undefined){
      if(state.names.data[0].name.SuccessFlag !== undefined && state.names.data[0].name.SuccessFlagReRender)
      {
        let temp = state.names.data[0];
        let jsonTxt = JSON.stringify(names);
        jsonTxt= "{\"name\": " + jsonTxt + "}";
        state.names.data[0] = JSON.parse(jsonTxt) ;
        state.names.data[1] = temp ;
        state.names.data[1].name.SuccessFlagReRender = false;
        holdNamess = names;
        responsestatus =  temp.name.status;
        // to refresh data after save used this flag
         topvalue = "yes";
         if (state.names.data[1].name.SuccessFlag == true) {
           for (let i = 0; i < state.names.data[0].name.screendata.length; i++) {
             let tmpSec = state.names.data[0].name.screendata[i];
             let tableFiltr = tmpSec.uiSchema[0].children.filter(itm=>itm.children.widget == "table")[0];
             if (tableFiltr) {
               Log4r.log("tableFiltr===>",tableFiltr);
               let dsrc = tmpSec.formData[0][tableFiltr.children.fieldPath].data.DataSource;
               for (let j = 0; j < dsrc.length; j++) {
                 if (dsrc[j].newlyAddedRow != undefined) {
                   Log4r.log("removed................");
                   delete dsrc[j].newlyAddedRow;
                 }
               }
             }
           }
           Log4r.log("final==>",state.names.data[0].name);
//           this.props.outnames.data[0].name
         }
      }
      else
      {
        if(!isfetchlinkclicked)
        {
          let holdbasicdataabc = JSON.parse(JSON.stringify(state.names));
          holdbasicdata = Object.assign({}, holdbasicdataabc);
          //prejsonData.set("data",holdbasicdataabc);
          //Log4r.log('mapStateToProps',holdbasicdataabc);
          // namess = file.name;
          if(state.names.data.length > 1) {
            if(state.names.data[1].name != null) {
              if(state.names.data[1].name.SuccessFlag !== undefined ) {
                /* custome screen validation was clearing  error json so commented below line */
                //state.names.data.pop();
              }
            }
          }

          try{
            xpathFactory(state.names.data[0].name);
            let custXpathFactory =  eval(window.xpathFactory);
            if (typeof custXpathFactory != typeof undefined) {
              custXpathFactory(state.names.data[0].name);
            }
          } catch(error){Log4r.log(error)}
        }
        else
        {
           isfetchlinkclicked = false;
        }
      }
      var xpathmap = new Map();
        //Sprint 9 (Task 60):[START] Added to put data of ajax call result into object variable which are required to render header template
        try
        {
          //this is added for TextEditor section level editable......
          if (state.names) {
            if (state.names.data) {
              if (state.names.data[0]) {
                if (state.names.data[0].name) {
                  if (state.names.data[0].name.screendata) {
                    if (Array.isArray(state.names.data[0].name.screendata)) {
                      state.names.data[0].name.screendata.map((itm,idx)=>{

                          itm.uiSchema[0].children.map((itm2, ind2)=>{
                            xpathmap.set( itm2.children.fieldPath ,itm2.children.xPath );
                            if (itm2.children.widget === "texteditor") {
                              if (itm.editable == false) {
                                itm.editable = true;
                                itm2.children.edit = "false";
                              }
                            }
                          })

                      })
                      GlobalHelper.globlevar['xpathmap'] = xpathmap;
                    }
                  }
                }
              }
            }
          }
          //this is added for TextEditor section level editable......ENDED
          if(state.names.hasOwnProperty('headerNames') && (Object.keys(state.names.headerNames).length!==0))
          {
			 hideHeaderBasedOnRules(state);
            //Sprint 9 (Task 60):ScreenData jason formats are converted into template objects which are required to render different parts of header.
             state.names.headerNames.screendata.map((item,index)=>{   // NOSONAR: javascript:S2201
              if(item.sectionType==="IMGPRT")
              {
                Object.keys(item.formData[0]).map((data,key)=>{   // NOSONAR: javascript:S2201
                let schemaObject = Object.keys(item.schema[0]).filter(item => item===data)[0]
                let widgetData= item.uiSchema[0].children.filter(item=>item.children.fieldPath===data)[0]
                if(widgetData.children.widget!=="hidden")
                {
                  if(item.formData[0][data].data.length===0)
                  {
                    holdImageHeader[item.schema[0][schemaObject].title]="";
                  }
                  else
                  {
                    holdImageHeader[item.schema[0][schemaObject].title]=item.formData[0][data].data;
                  }
                }
                })
              }
              else if (item.sectionType==="VALSWITHOUTCAP")
              {
                holdDataWithoutCap={};   //Sprint 11: Task 83 No Hedaer Configuration Handling : Making object empty if it contains data of selected row (in case of no header configured and now data is coming from server).
                Object.keys(item.formData[0]).map((data,key)=>{   // NOSONAR: javascript:S2201
                let schemaObject = Object.keys(item.schema[0]).filter(item => item===data)[0]
                let widgetData= item.uiSchema[0].children.filter(item=>item.children.fieldPath===data)[0]
                if(widgetData.children.widget!=="hidden")
                {
                  if(item.formData[0][data].data.length===0)
                  {
                    holdDataWithoutCap[item.schema[0][schemaObject].title]="";
                  }
                  else
                  {
                    holdDataWithoutCap[item.schema[0][schemaObject].title]=item.formData[0][data].data[0];
                  }
                }
                })
              }
              else if (item.sectionType==="VALSWITHCAP")
              {
                holdDataWithCap={}; //Sprint 11: Task 83 No Hedaer Configuration Handling : Making object empty if it contains data of selected row (in case of no header configured and now data is coming from server).
                Object.keys(item.formData[0]).map((data,key)=>{   // NOSONAR: javascript:S2201
                let schemaObject = Object.keys(item.schema[0]).filter(item => item===data)[0]
                let widgetData= item.uiSchema[0].children.filter(item=>item.children.fieldPath===data)[0]
                if(widgetData.children.widget!=="hidden")
                {
                  if(widgetData.children.widget==="select")
                    {
                      let dataObj = widgetData.children.options.filter(filterItemObj=>filterItemObj.code===item.formData[0][data].data[0]);

                        try{

                            holdDataWithCap[item.schema[0][schemaObject].title] = dataObj && dataObj[0] && dataObj[0]['description']; //.description;
                        }
                        catch(e){
                          holdDataWithCap[item.schema[0][schemaObject].title] = item.formData[0][data].data[0];
                          Log4r.log("item.formData[0][data].data[0] ",item.formData[0][data].data[0]);
                          Log4r.error(e)
                        }
                      }
                    else if(widgetData.children.widget==="popsearch")
                    {

                      try{

                        let dataObj = item.formData[0][widgetData.children.fieldPath].desc;
                        if(Array.isArray(dataObj)){
                          dataObj = dataObj[0];
                        }
                        Log4r.log("dataObj Header PopSearch Options ", item.formData[0]);
                        Log4r.log("dataObj Header PopSearch",dataObj);

                          holdDataWithCap[item.schema[0][schemaObject].title] = dataObj; //.description;
                      }
                      catch(e){
                        holdDataWithCap[item.schema[0][schemaObject].title] = item.formData[0][data].data[0];
                        Log4r.log("item.formData[0][data].data[0] ",item.formData[0][widgetData.children.fieldPath].desc);
                        Log4r.error(e)
                      }
                      }
                    else if(widgetData.children.widget==="currency"){

                      if(item.formData[0][data].data.length===0)
                        {
                          holdDataWithCap[item.schema[0][schemaObject].title]="";
                        }
                        else
                        {
                          //let convertedData = GlobalHelper.contextSetting.ORG_CURRENCY_SYMBOL +" "+(item.formData[0][data].data[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                          holdDataWithCap[item.schema[0][schemaObject].title]= currencyFormatedValue(item.formData[0][data].data[0]); //convertedData;
                        }

                    }
                    else{
                        if(item.formData[0][data].data.length===0)
                        {
                          holdDataWithCap[item.schema[0][schemaObject].title]="";
                        }
                        else
                        {
                          holdDataWithCap[item.schema[0][schemaObject].title]=item.formData[0][data].data[0];
                        }
                      }
                }
                })
              }
              else if (item.sectionType==="AVTR")
              {
                Object.keys(item.formData[0]).map((data,key)=>{   // NOSONAR: javascript:S2201
                let schemaObject = Object.keys(item.schema[0]).filter(item => item===data)[0]
                let widgetData= item.uiSchema[0].children.filter(item=>item.children.fieldPath===data)[0]
                if(widgetData.children.widget!=="hidden")
                {
                  if(item.formData[0][data].data.length===0)
                  {
                    holdAvatarData[item.schema[0][schemaObject].title]="";
                  }
                  else
                  {
                    holdAvatarData[item.schema[0][schemaObject].title]=item.formData[0][data].data[0];
                  }
                }
                })
              }
            });
          };

          //Sptint 10 (Task 69):[START] Added code to manuaaly add a "NEXT" button when a prompt screen left icon is clicked
          if(state.names.hasOwnProperty('pr_mode') && state.names.pr_mode.length!==0)
          {
              Object.keys(state.names.data[0].name.ButtonPalette[0].formData[0]).map((item,index)=>{      // NOSONAR: javascript:S2201
              if(index===Object.keys(state.names.data[0].name.ButtonPalette[0].formData[0]).length-1)
              {
                let fomDataLength=Object.keys(state.names.data[0].name.ButtonPalette[0].formData[0]).length;
                let nextButtonFormData={};
                nextButtonFormData['type']="default";
                nextButtonFormData['size']="large";
                nextButtonFormData['label']="NEXT";
                nextButtonFormData['classname']="paletteClassSave";
                nextButtonFormData['icon']="forward";
             //   state.names.data[0].name.ButtonPalette[0].formData[0]['btn'+(fomDataLength+1)]={"style":nextButtonFormData};
              }
            });
              Object.keys(state.names.data[0].name.ButtonPalette[0].schema[0]).map((item,index)=>{      // NOSONAR: javascript:S2201
              if(index===Object.keys(state.names.data[0].name.ButtonPalette[0].schema[0]).length-1)
              {
                let schemaLength=Object.keys(state.names.data[0].name.ButtonPalette[0].schema[0]).length;
                let nextButtonSchema = {"title":""}
                state.names.data[0].name.ButtonPalette[0].schema[0]['btn'+(schemaLength+1)]=nextButtonSchema;
              }
            });
            state.names.data[0].name.ButtonPalette[0].uiSchema[0].children.map((item,index)=>{
            if(index===state.names.data[0].name.ButtonPalette[0].uiSchema[0].children.length-1 && GlobalHelper.globlevar.raiseFalg===true)
            {
              GlobalHelper.globlevar.raiseFalg=false;
              let uiSchemaLength=state.names.data[0].name.ButtonPalette[0].uiSchema[0].children.length;
              let nextButtonuiSchemaChildren={};
              nextButtonuiSchemaChildren['xType']="field";
              nextButtonuiSchemaChildren['widget']="button";
              nextButtonuiSchemaChildren['fieldPath']="btn"+(uiSchemaLength+1);
          //    (state.names.data[0].name.ButtonPalette[0].uiSchema[0].children[uiSchemaLength])={"xType":"col", "span":6,"children":nextButtonuiSchemaChildren};
            }
            });
          }
          //Sptint 10 (Task 69):[END]
        }
        catch (e)
        {
          Log4r.log("error in map state to props",e);
        }
        //Sprint 9 (Task 60):[END]
    }
    }
  }

  //hideSection("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST.ENGNN");
  // showSection("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST.ENGNN");
  // makeSectionReadOnly("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST.ENGNN");
  // makeSectionEditable("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST.ENGNN");
  return {
    outnames : state.names
  };
}
function mapDispatchToProps(dispatch){
  return{
    actions: bindActionCreators(action,dispatch)
  };
}
export default  connect(mapStateToProps,mapDispatchToProps) (UIScreen);
