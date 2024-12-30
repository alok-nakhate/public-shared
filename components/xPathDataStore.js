/* Copyright (C) Indus Software Technologies Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import React from "react";
import $ from 'jquery';
import request from 'superagent';
import GlobalHelper from '../components/GlobalHelper';
import moment from 'moment';
import { IntlProvider } from 'react-intl';
import QBP from './components/widgets/querybuilder/QBP';
import store from '../services/Store';
import WSObject from '../customcollection/crf4jwsclient.js';
import {Modal,message} from 'antd';
import {displayMessageBox,displayForm,showComponent} from '../ModalComponent/ModalBox';
import Model from './Model';
import { getSTData } from '../services/CommonSecurity';
import ErrorHandler from'./ErrorHandler';
import {isempty} from '../jsonconverter/jsonBuilder';
import DocumentViewWidgetEdit from './components/widgets/documentView/DocumentViewWidgetEdit';
import ClipSearchComponent from "./components/widgets/clipsearch/ClipSearchComponent";
import {onLoadUtil} from '../util/onLoadUtil';
import Log4r from '../util/Log4r'; 

var xpathMap ;
var xpathMapForGrid ;
var xpathMapDir;
var holdNamessjson;
var queryParameters = "";
var advanceAttrFilterXml = "";
var gridFieldsXPath = new Map();
var documentUploadParam = new Map();
var contextKeyAndDataIndexMap = new Map();
contextKeyAndDataIndexMap.set("_ut","ALLOCATED_USER");
contextKeyAndDataIndexMap.set("transactionrequest","Y");
var serverMode = 'PROD';
var defualutLayoutId = undefined;
var currencyGroupingSymbol = GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL;

const documentViewer = (rowId ,fileextention) =>
{
  showComponent(<DocumentViewWidgetEdit key={1} rowId={rowId} fileExt={fileextention}/>);
}
const setContextKeys = (key , value) =>
{
  Log4r.log("setting.. contxt ky val",key , value);
  contextKeyAndDataIndexMap.set(key,value);
}
const getContextKeys = (key) =>
{
  return contextKeyAndDataIndexMap.get(key);
}
const getServerMode = () =>{
  return serverMode;
}

const setDefaultLayoutId = (id)=>{
  defualutLayoutId = id;
}
const getDefaultLayoutId = ()=>{
    return defualutLayoutId;
}

const setServerMode = (mode) =>{
  serverMode = mode ;
}

const redirectToList = (actionObj)=>
{
  Log4r.log("actionObj",actionObj);
  if(actionObj.type=="MULTIPLEWORKLIST" )
  {
    store.dispatch(actionObj);
  }
  else if (actionObj.type=="MENUDATAFETCH") {
    store.dispatch(actionObj);
  }
}

const getJsonDataForChart = (props) =>{
  Log4r.log("props.schema",props.schema);
  var jsonData= {'CHART_ID_KEY':'','SUPPROTED_CHART_TYPE':[],'CURRENT_CHART_TYPE':'','CURRENT_CHART_SUBTYPE':'','X_AXIS_TITLE':'','Y_AXIS_TITLES':[],'__REPORT_DATA__':{'rows':[]},'fetch_object':{'totalRows':1,'moreRows':false,'rows':[]},'fetch_xaxis':{'totalRows':1,'moreRows':false,'rows':[]},'fetch_yaxis':{'totalRows':1,'moreRows':false,'rows':[]},'fetch_caxis':{'totalRows':0,'moreRows':false,'rows':[]}};
  let anArray = [];
  let chartType = ["TABLEVIEW","PIE","BAR","LINE","SCATTER","WEBCHART"];
  var Column = props.formData[props.uiSchema.fieldPath].data.Columns;
  var DataSource = JSON.parse(JSON.stringify(props.formData[props.uiSchema.fieldPath].data.DataSource));
  jsonData.fetch_object.rows = [];
  let obj ={};
  obj['ODS'] = props.schema[props.uiSchema.fieldPath].title;
  obj['OTY'] = "PIE";
  jsonData.fetch_object.rows.push(obj);

  jsonData.fetch_yaxis.rows = [];
  for (let i = 0; i < Column.length; i++) {
    let yAxis ={};
    if( i !== 0){
      anArray.push(Column[i].title);
      jsonData.Y_AXIS_TITLES = anArray;
        yAxis["YCOL"] = Column[0].title,
        yAxis["YFUN"] = 2,
        yAxis["ISEQUENCENO"]=i,
        yAxis["ISORT"]=-1,
        yAxis["ISORTSEQ"]=i+1,
        yAxis["YTLE"]="",
        yAxis["YWID"]="",
        yAxis["APPLIED"]="Y"
        jsonData.fetch_yaxis.rows.push(yAxis);
    }

  }

    jsonData.fetch_xaxis.rows = [];
        let xAxis = {};
        xAxis["XCOL"] = Column[1].title,
        xAxis["XFUN"] = 2,
        xAxis["ISEQUENCENO"]=0,
        xAxis["ISORT"]=-1,
        xAxis["ISORTSEQ"]=1,
        xAxis["XTLE"]="",
        xAxis["XWID"]="",
        xAxis["APPLIED"]="Y"
    jsonData.fetch_xaxis.rows.push(xAxis);

  jsonData.__REPORT_DATA__.rows = [];
  let anObject = {};
  for (let p = 0; p < DataSource.length; p++) {
   anObject = {};
    for (let q = 0; q < Object.keys(DataSource[p]).length; q++) {
      anObject['XAX1']  = DataSource[p][Object.keys(DataSource[p])[0]];
      if(q !== 0 && Object.keys(DataSource[p])[q].length >= 32)
      {
        anObject['YAX'+(q)]  = parseInt(DataSource[p][Object.keys(DataSource[p])[q]]);
      }
    }
    jsonData.__REPORT_DATA__.rows.push(anObject);
  }
  jsonData['SUPPROTED_CHART_TYPE'] = chartType;
  jsonData['CHART_ID_KEY'] = props.namess.screendata[0].sessionID;
  jsonData['CURRENT_CHART_TYPE'] = props.formData[props.uiSchema.fieldPath].data.chartType;
  return jsonData;
}

const validatesection = (sessIdArr) =>{
  ErrorHandler.addSectionIds(sessIdArr);
}
const getModeOfRowInGrid = (xpathofGrid,rowIndx)=>
{
  var gotObj;
  let retMode;
  for (let i = 0; i < holdNamessjson.screendata.length; i++) /* iterating for all sections..*/
  {
    gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(function (item) {
      return item.children.xPath === xpathofGrid;
    })[0];
    Log4r.log('dfADQ',gotObj);
    if (gotObj) {
      retMode = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[rowIndx].mode;
    }
  }
  return retMode;
}
const setXpathValues = (xpathvalue,xpathvalueDir) =>
{
  xpathMap = xpathvalue;              /*xpathMap is used for getting section wise field xpath and fieldPath..*/
  xpathMapDir = xpathvalueDir;        /*xpathMapDir is used for direct getting field xpath and fieldPath..*/
  //Log4r.log("xpathMapDir===>",xpathMapDir);
  //Log4r.log("xpathMap==",xpathMap);
}
const filterXMLCreation = (props) => /*to create filterXML, just you need to pass JSON*/
{
  if(	props != "" && props != null && props != undefined){
    let layoutData =  props;
    var gridSearchAtrrFilterXml = "";
    var filterReturn = "";
    var xpath = undefined;
    var data = undefined;
    var conditionXmll = "";
    var widget;
    var operator="equals";
    Log4r.log("jhsdkjhskljkl.....",layoutData);
    for(var i=0 ; i<props.uiSchema[0].children.length ; i++){
      let fieldPath = props.uiSchema[0].children[i].children.fieldPath;
       xpath = props.uiSchema[0].children[i].children.xpath;
       var columnXpath = xpath.substring(xpath.lastIndexOf(".")+1, xpath.length);
       widget = props.uiSchema[0].children[i].children.widget;
       /*Task- to add operator coming from server for respective widget in grid search filter*/
       operator = props.uiSchema[0].children[i].children.operator ? props.uiSchema[0].children[i].children.operator : operator;
       data  = props.formData[0][fieldPath].data;
       if(data != ""){
         var dateArr;
         var dateAttrOperator=[];
         if(widget === "date" && operator === "inrange"){
           try{
             dateAttrOperator[0] = "greater-than-or-equals-date";
             dateAttrOperator[1] = "less-than-or-equals-date";
             if (data instanceof Array){
               dateArr = data[0].split('-');
             }else{
               dateArr = data.split('-');
             }
             for (let i = 0; i < dateArr.length; i++) {
               conditionXmll =
                 conditionXmll +
                 '<condition attribute="' +
                      columnXpath	+
                 '" extdata="" funccode="" operator="' +
                      dateAttrOperator[i] +
                 '" datatype="string" value="' +
                      dateArr[i]	+
                 '" description="" default="" defaultdesc="" cmpfld="N" caption="" fid="" conditionid="" pfid="" code="" sclfunc=""/>';
                 gridSearchAtrrFilterXml = conditionXmll;
             }
           }catch(e){
             Log4r.error(e);
           }

         }else{
           conditionXmll =
             conditionXmll +
             '<condition attribute="' +
                  columnXpath	+
             '" extdata="" funccode="" operator="' +
                  operator +
             '" datatype="string" value="' +
                  data	+
             '" description="" default="" defaultdesc="" cmpfld="N" caption="" fid="" conditionid="" pfid="" code="" sclfunc=""/>';
             gridSearchAtrrFilterXml = conditionXmll;
         }
       }
    }
    if(gridSearchAtrrFilterXml)
   {
     filterReturn =
     `<filter type="AND">${gridSearchAtrrFilterXml}</filter>`;
   }
   Log4r.log("gridSearchAtrrFilterXml..............",filterReturn);
  }
  return filterReturn;
}

const removeButton = (buttonId) =>
{
  if(holdNamessjson)
  {
    if(holdNamessjson.ButtonPalette !== undefined){
      var key =  holdNamessjson.ButtonPalette[0] && holdNamessjson.ButtonPalette[0].uiSchema[0].children;
      var removedButton =  key && key.filter(itm2 => itm2.children.fieldPath == buttonId)[0];
      if(removedButton !== undefined)
      {
        holdNamessjson.ButtonPalette[0].schema[0][removedButton.children.fieldPath]['hidden'] = true;
        let reButtonId = 'removed' + buttonId;
        holdNamessjson[reButtonId] = true;
      }
    }
  }

}

const removeSectionButton = (xpath,buttonId) =>
{
  if(holdNamessjson)
  {
    if(holdNamessjson.screendata !== undefined){
        let section = holdNamessjson.screendata.filter(itm2 => itm2.sectionXPath === xpath)[0];
        if(section)
        {
          if(section.sectionButton !== undefined)
          {
            try{
              let sectionButtonitem = section.sectionButton.buttons.filter(butn => butn.id == buttonId)[0];
                  if(sectionButtonitem){
                    Log4r.log("removeSectionButton API " , sectionButtonitem);
                    sectionButtonitem['hidden'] = true;
                  }
            }catch(e){Log4r.error(e)}
        }
      }// Identify Section
    }
  }
}

const showSectionButton = (xpath,buttonId) =>
{
  if(holdNamessjson)
  {
    if(holdNamessjson.screendata !== undefined){
        let section = holdNamessjson.screendata.filter(itm2 => itm2.sectionXPath === xpath)[0];
        if(section)
        {
          if(section.sectionButton !== undefined)
          {
            try{
              let sectionButtonitem = section.sectionButton.buttons.filter(butn => butn.id == buttonId)[0];
                  if(sectionButtonitem){
                    Log4r.log("showSectionButton API " , sectionButtonitem);
                    sectionButtonitem['hidden'] = false;
                  }
            }catch(e){Log4r.error(e)}
        }
      }// Identify Section
    }
  }
}

const showButton = (buttonId) =>
{
  if(holdNamessjson.ButtonPalette !== undefined){
    var key =  holdNamessjson.ButtonPalette[0].uiSchema[0].children;
    var removedButton =  key.filter(itm2 => itm2.children.fieldPath == buttonId)[0];
    if(removedButton !== undefined)
    {
      holdNamessjson.ButtonPalette[0].schema[0][removedButton.children.fieldPath]['hidden'] = false;
    }
      if(holdNamessjson['removed' + buttonId] != null) {
        if(holdNamessjson['removed' + buttonId] === true){
          delete holdNamessjson['removed' + buttonId];
        }
      }
  }
}

const removeCustomeErrormessagesInGrid = (xPathGrid,xpathC,indexOfRow,errorArr) =>
{
  if (holdNamessjson) {
    for (let i = 0; i < holdNamessjson.screendata.length; i++)
    {
      let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xPathGrid)[0];
      if (gotObj) {
        let fPath = gotObj.children.fieldPath;
        let colObj = holdNamessjson.screendata[i].formData[0][fPath].data.Columns.filter(itm=>itm.xPath == xpathC)[0];
        if (colObj)
        {
          ErrorHandler.removeCustomeErrormessagesInGrid(holdNamessjson.screendata[i].sessionID,fPath,colObj.dataIndex,indexOfRow,errorArr);
          return true;
        }
        else
        {
          return false;
        }
      }
    }
  }
  else {
    return false;
  }
}

const addCustomeErrormessagesInGrid = (xPathGrid,xpathC,indexOfRow,errorArr) =>
{
  if (holdNamessjson) {
    for (let i = 0; i < holdNamessjson.screendata.length; i++)
    {
      let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xPathGrid)[0];
      if (gotObj) {
        let fPath = gotObj.children.fieldPath;
        let colObj = holdNamessjson.screendata[i].formData[0][fPath].data.Columns.filter(itm=>itm.xPath == xpathC)[0];
        if (colObj)
        {
          ErrorHandler.addCustomeErrormessagesInGrid(holdNamessjson.screendata[i].sessionID,fPath,colObj.dataIndex,indexOfRow,errorArr);
          return true;
        }
        else
        {
          return false;
        }
      }
    }
  }
  else {
    return false;
  }
}

const removeCustomeErrormessages = (xPath,errorArr) =>
{
  if (holdNamessjson) {
    if (xPath == undefined || xPath == null || xPath == "")
    {
      ErrorHandler.removeCustomeErrormessages(undefined,undefined,errorArr);
    }
    else
    {
      for (let i = 0; i < holdNamessjson.screendata.length; i++)
      {
        let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xPath)[0];
        if (gotObj) {
          let fPath = gotObj.children.fieldPath;
          ErrorHandler.removeCustomeErrormessages(holdNamessjson.screendata[i].sessionID,fPath,errorArr);
          return true;
        }
      }
    }
  }
  else {
    return false;
  }
}

const addCustomeErrormessages = (xPath,errorArr) =>
{
  if (holdNamessjson) {
    if (xPath == undefined || xPath == null || xPath == "")
    {
      ErrorHandler.addCustomeErrormessages(undefined,undefined,errorArr);
    }
    else
    {
      for (let i = 0; i < holdNamessjson.screendata.length; i++)
      {
        let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xPath)[0];
        if (gotObj) {
          let fPath = gotObj.children.fieldPath;
          ErrorHandler.addCustomeErrormessages(holdNamessjson.screendata[i].sessionID,fPath,errorArr);
          return true;
        }
      }
    }
  }
  else {
    return false;
  }
}

const addGenricWorningmessages = (errorArr) =>
{
  ErrorHandler.addGenricWorningmessages(errorArr);
}

const getErrorMessagesList = () =>
{
  return ErrorHandler.getErrorMessagesList();
}

const removeGenricWorningmessages = (errorArr) =>
{
  ErrorHandler.removeGenricWorningmessages(errorArr);
}

const getxPathMapForGrid = (holdNamess) =>
{
    holdNamessjson = holdNamess;
	  var xpthSections = new Map();
      if(holdNamess.screendata !== undefined)
      {
      for(var i=0; i<holdNamess.screendata.length; i++)
      {
        for(var j=0;j<holdNamess.screendata[i].formData.length;j++)
        {
          var keysFielPath=Object.keys(holdNamess.screendata[i].formData[j]);
          keysFielPath.map((item,z)=>   // NOSONAR: javascript:S2201
          {
            var getObjFiltr=holdNamess.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")
              {
               holdNamess.screendata[i].formData[j][item].data.Columns.map((colItmmm,indxColItmmm)=>{   // NOSONAR: javascript:S2201

                  if (colItmmm.children) {
                    for (let s = 0; s < colItmmm.children.length; s++) {
                      let tempVariable = colItmmm.children[s];
                      xpthSections.set(tempVariable.xPath,tempVariable.dataIndex);
                    }
                  }else {
                      xpthSections.set(colItmmm.xPath,colItmmm.dataIndex);
                  }
                })
            /*    for (var r = 0; r < holdNamess.screendata[i].formData[j][item].data.Columns.length; r++) {
				  if (holdNamess.screendata[i].formData[j][item].data.Columns[r].children) {     // code added for grouped columns.
					for (let s = 0; s < holdNamess.screendata[i].formData[j][item].data.Columns[r].children.length; s++) {
					  let tempVariable = holdNamess.screendata[i].formData[j][item].data.Columns[r].children[s];
            xpthSections.set(tempVariable.xPath,tempVariable.dataIndex);
					}
				   }else {
    					let tempVariable = holdNamess.screendata[i].formData[j][item].data.Columns[r];
              xpthSections.set(tempVariable.xPath,tempVariable.dataIndex);
				   }
         } */
                }
            }
          });
        }
        gridFieldsXPath.set(holdNamess.screendata[i].sessionID,xpthSections);
      }
    }
}
const getXpath = (fieldPath) =>{

  for (var i = 0; i < holdNamessjson.screendata.length; i++)    /* iterating for all sections..*/
  {
  let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.fieldPath === fieldPath)[0];/*checking for grid xpath*/
    if (gotObj !== undefined) {
      return gotObj.children.xPath;
    }
  }
}
const getXpathValues = (fieldpath) => //This method accepts the fieldpath parameter in format "SectionId.FieldId"
{
    var fieldInvolvedinExp = [];
    let arr =[];
    let section = "";
    let control = "";
    var fieldMap = new Map();
    if(!Array.isArray(fieldpath)){
        arr = fieldpath.split(".");
        section = arr[0];
        control = arr[1];
        fieldMap = xpathMap.get(section);
        if(fieldMap.size == 0 ){
          fieldMap = gridFieldsXPath.get(section);
        }
        for (let iterIndex of fieldMap){
          if(iterIndex[1]== control){
            let targetIdXPath = iterIndex[0];
            return targetIdXPath;
		  }
        }
    }else {
      for(let i=0;i<fieldpath.length;i++){
        arr = fieldpath[i].split(".");
        section = arr[0];
        control = arr[1];
        fieldMap = xpathMap.get(section);
        if(fieldMap.size == 0 ){
          fieldMap = gridFieldsXPath.get(section);
        }
        for (let iterIndex of fieldMap){
          if(iterIndex[1]== control){
            fieldInvolvedinExp.push(iterIndex[0]);
          }
        }
      }
      return fieldInvolvedinExp;
    }

  }

const highlightField = (xpath,colorCode)=>
{
  if (holdNamessjson && colorCode !==undefined && colorCode!=="" && colorCode!==null)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      let setFlag = false;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpath )[0];
        if (obj)
        {
          obj.children.highlight = colorCode;
          Log4r.log("alfkj....holdNamessjson",holdNamessjson);
          setFlag = true;
          break;
        }
      }
      return setFlag;
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}

const setCircleColorInHeader = (colorCode)=>
{
  GlobalHelper.globlevar['colorCodeForCircleInHeader'] = colorCode;
}
const setFontColorForField = (xpath,colorCode)=>
{
  if (holdNamessjson && colorCode !==undefined && colorCode!=="" && colorCode!==null)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      let setFlag = false;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpath )[0];
        if (obj)
        {
          obj.children.fontColor = colorCode;
          Log4r.log("alfkj....holdNamessjson",holdNamessjson);
          setFlag = true;
          break;
        }
      }
      return setFlag;
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}
const setXpathValue = (xpathvalue) =>
{
  xpathMap = xpathvalue;    /*xpathMap is used for getting section wise field xpath and fieldPath.. */
}

const clearSection = (sectionid) =>       /*used to clear the section..*/
{
  if (holdNamessjson)
  {
    var secObj = xpathMap.get(sectionid);
    for (var i = 0; i < holdNamessjson.screendata.length; i++)
    {
      if (holdNamessjson.screendata[i].sessionID === sectionid)
      {
        for (var [key, value] of secObj)
        {
          holdNamessjson.screendata[i].formData[0][value].data="";
        }
        return true;
        break;
      }
    }
    return false;
  }
  else
  {
    return false;
  }
}

const clearFieldValue = (xpath) =>       /*used to clear the field..*/
{
  var ct=0;
  for (var key of xpathMap.keys())
  {
    var obj = xpathMap.get(key);
    var fpath = obj.get(xpath);
    if (fpath != undefined)
    {
      holdNamessjson.screendata[ct].formData[0][fpath].data="";
      return true;
    }
    //Log4r.log(key);
    ct++;
  }
  return false;
}


const getValue = (xpath) =>   /*getValue is used to get value AGAINST xpath*/
{
   try{

          if(holdNamessjson.screendata[0].uiSchema !== undefined)
          {
            xpathFactory(holdNamessjson);
          }
      }
   catch(error){Log4r.log(error)}

  var flagBool=false;         /* this flag get set when value is found..*/
  var retVal;                 /*this is to store value which is retuend..*/
  if (xpathMapDir)
  {
    let isDesc = xpath.substring(xpath.lastIndexOf(".") + 1, xpath.length);

    let fpath = "";
    if (isDesc == "desc") {
      fpath = xpathMapDir.get(xpath.substring(0, xpath.lastIndexOf(".")));
    } else {
      fpath = xpathMapDir.get(xpath);
    }

    if (fpath)
    {
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        var loc1= xpath.indexOf("[");
        var loc2= xpath.indexOf("]");
        var val= xpath.substring(loc1+1,loc2);
        var valNum = parseInt(val);                             /*got the row index..*/
        var gridXpth=xpath.substring(0,xpath.lastIndexOf("."));       /*got the grid xpath..*/
        var gotObj;
        for (var i = 0; i < holdNamessjson.screendata.length; i++)    /* iterating for all sections..*/
        {
          gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpth)[0];/*checking for grid xpath*/
          if (gotObj)
          {
            if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
            {  /*checked data is available for fieldPath in formData..*/
              let columnObject = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.filter(item => item.dataIndex === fpath)[0];
              let returnValue = makeChangesBeforeReturningValue(columnObject.widget, columnObject.datatype, holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum][fpath]);

              retVal = returnValue;
              flagBool = true;
              break;
            }
          }
        }
      }
      else
      {               /*ITS FIELD */
				try{
            for (var i = 0; i < holdNamessjson.screendata.length; i++)    /* iterating for all sections..*/
            {
              if (holdNamessjson.screendata[i].formData[0][fpath] != null && holdNamessjson.screendata[i].formData[0][fpath] != undefined )//&& holdNamessjson.screendata[i].formData[0][fpath] != ""
              {
                let uiSchemaObject = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.fieldPath === fpath)[0];
                var returnValue = "";

                if (isDesc == "desc") {
                  returnValue = makeChangesBeforeReturningValue(uiSchemaObject.children.widget, uiSchemaObject.children.datatype, holdNamessjson.screendata[i].formData[0][fpath].desc[0]);
                } else {
                  returnValue = makeChangesBeforeReturningValue(uiSchemaObject.children.widget, uiSchemaObject.children.datatype, holdNamessjson.screendata[i].formData[0][fpath].data);
                }

                retVal = returnValue;
                flagBool = true;
                break;
              }
            }
        }
        catch(e){Log4r.error(e);}
      }
    }
    else {
      return null;
    }
    if (flagBool == true) {                     /*if found return value..*/
      return retVal;
    }
    else {                                    /*if not found return null..*/
      return null;
    }
  }else {
    return null;
  }
}



const getValuesInGrid = (xpathGrid,xpathCol) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];  /*searching for fieldPath against xpath..*/
        if (obj)
        {
          fpath = obj.children.fieldPath;     /* setting fieldPath..*/
          secIndex=i;                         /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return null;
      }
      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj)
      {
        if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource)   /* checkng dataSource is available..*/
        {
          var res = [];
          for ( var i = 0; i < holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource.length; i++)
          {
            res[i] = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource[i][colObj.dataIndex];
          }
          //Log4r.log("retuend res:=",res);
          return res;
        }
        else
        {
          Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
          return null;
        }
      }
      else
      {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  }
  else
  {
    return null;
  }
}

const makeChangesBeforeReturningValue = (widget, datatype, value) => /*this method will format the value before returning the value*/ {
    let currencyGroupingSymbol = GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL;
    if (widget !== undefined && datatype !== undefined && value !== undefined) {
        /* We can modify the the value accoring to widget, datatype and value. For now it is done for only currency widget*/
        if (widget === "currency" || datatype === "number") {
            let toConvertValue = "";
            if (Array.isArray(value)) {
                if (value[0] !== undefined) {
                    toConvertValue = value[0];
                } else {
                    toConvertValue = "";
                }
            } else {
                toConvertValue = value;
            }

            let formatted_value = toConvertValue.toString().replace(new RegExp(currencyGroupingSymbol, 'g'), "");
            return formatted_value;
        } else {
            return value;
        }
    } else {
        Log4r.error("Something went wrong !", widget, datatype, value);
        if (value) {
            return value;
        }
    }
}

const getValueInGridCell = (xpathGrid,xpathCol) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath, secIndex, widget, datatype ;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];  /*searching for fieldPath against xpath..*/
        if (obj)
        {
          fpath = obj.children.fieldPath;     /* setting fieldPath..*/
          secIndex=i;                         /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return null;
      }
      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj)
      {
        widget = colObj.widget;
        datatype = colObj.datatype;

        if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource)   /* checkng dataSource is available..*/
        {
          let gotRecordForKey = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource.filter(item =>  item.key === GlobalHelper.globlevar.keyOfCurruntchangedField)[0];
          if (gotRecordForKey)
          {
            Log4r.log("gotRecordForKey[colObj.dataIndex]==?>",gotRecordForKey[colObj.dataIndex]);

            let returnValue =  makeChangesBeforeReturningValue(widget, datatype, gotRecordForKey[colObj.dataIndex]);
            return returnValue;
          }
          else {
            Log4r.error("record for key not found:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
            return null;
          }
        }
        else
        {
          Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
          return null;
        }
      }
      else
      {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  }
  else
  {
    return null;
  }
}

/* this method will return dataSource and column object; by finding it using xpath of grid and xpath of column respectively in holdnamess  */
/* this method is called only in methods for calculating Addition, Min ,Max and Avarage values of a column. */
const getGridColumnValues = (xpathGrid,xpathCol) =>
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      let fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];  /*searching for fieldPath against xpath..*/
        if (obj)
        {
          fpath = obj.children.fieldPath;     /* setting fieldPath..*/
          secIndex=i;                         /* keeping index of section..*/
          break;
        }
      }
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return null;
      }
      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj)
      {
        if(colObj.datatype == "number")
        {
          if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource)   /* checkng dataSource is available..*/
          {
            let anObject = {}
            anObject["dataSource"] = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource;
            anObject["columnObject"] = colObj;
            return anObject;
          }
          else
          {
            Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
            return null;
          }
        }
        else
        {
          Log4r.error("Column data type should be number only",colObj.datatype);
          return null;
        }
      }
      else
      {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    }
    else
    {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  }
  else
  {
    return null;
  }
}


/* This will return sum of a specific column when we provide xpath of grid and xpath of column */
const getSumOfGridColumn = (xpathGrid,xpathCol) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  let sourceAndColObject = getGridColumnValues(xpathGrid,xpathCol); /* this method will return dataSource and column object; by finding it using xpath of grid and xpath of column respectively in holdnamess  */
  let dataSource = sourceAndColObject.dataSource;
  let colObj = sourceAndColObject.columnObject;

  if (dataSource && colObj)   /* checkng dataSource and column object is available..*/
  {
    let sumOfColumn = 0;
    for (let i = 0; i < dataSource.length; i++)
    {
      let preFormattedValue = makeChangesBeforeReturningValue(colObj.dataIndex, colObj.datatype, dataSource[i][colObj.dataIndex]);
      let dataValue =  Number(preFormattedValue);
      sumOfColumn = ((sumOfColumn*100 + dataValue*100)/100);
    }
    return sumOfColumn;
  }
  else
  {
    Log4r.error("DataSource not found for calculating sum of a column",dataSource);
    return null;
  }
}


const getAvarageOfGridColumn = (xpathGrid,xpathCol) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  let sourceAndColObject = getGridColumnValues(xpathGrid,xpathCol); /* this method will return dataSource and column object; by finding it using xpath of grid and xpath of column respectively in holdnamess  */
  let dataSource = sourceAndColObject.dataSource;
  let colObj = sourceAndColObject.columnObject;

  if (dataSource && colObj)   /* checkng dataSource and column object is available..*/
  {
    let sumOfColumn = 0;
    let numberOfValues = 0;
    for (let i = 0; i < dataSource.length; i++)
    {
      numberOfValues++;
      let preFormattedValue = makeChangesBeforeReturningValue(colObj.dataIndex, colObj.datatype, dataSource[i][colObj.dataIndex]);
      let dataValue =  Number(preFormattedValue);
      sumOfColumn = ((sumOfColumn*100 + dataValue*100)/100);
    }

    return sumOfColumn/numberOfValues;

  }
  else
  {
    Log4r.error("DataSource not found for calculating sum of a column",dataSource);
    return null;
  }
}

const getMinValueOfGridColumn = (xpathGrid,xpathCol) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  let sourceAndColObject = getGridColumnValues(xpathGrid,xpathCol); /* this method will return dataSource and column object; by finding it using xpath of grid and xpath of column respectively in holdnamess  */
  let dataSource = sourceAndColObject.dataSource;
  let colObj = sourceAndColObject.columnObject;

  if (dataSource && colObj)   /* checkng dataSource and column object is available..*/
  {
    let arrayOfValues = [];
    let minValue = undefined;
    for (let i = 0; i < dataSource.length; i++)
    {
      let preFormattedValue = makeChangesBeforeReturningValue(colObj.dataIndex, colObj.datatype, dataSource[i][colObj.dataIndex]);
      let dataValue =  Number(preFormattedValue);
      arrayOfValues.push(dataValue);
    }
    if(arrayOfValues.length > 1)
    {
       minValue = Math.min(...arrayOfValues);
    }
    else
    {
      Log4r.error("This table have only single record !",arrayOfValues);
      minValue = arrayOfValues[0];
    }
    return minValue;
  }
  else
  {
    Log4r.error("DataSource not found for calcultaing min value",dataSource);
    return null;
  }
}

const getMaxValueOfGridColumn = (xpathGrid,xpathCol) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  let sourceAndColObject = getGridColumnValues(xpathGrid,xpathCol); /* this method will return dataSource and column object; by finding it using xpath of grid and xpath of column respectively in holdnamess  */
  let dataSource = sourceAndColObject.dataSource;
  let colObj = sourceAndColObject.columnObject;

  if (dataSource && colObj)   /* checkng dataSource and column object is available..*/
  {
    let arrayOfValues = [];
    let maxValue = undefined;
    for (let i = 0; i < dataSource.length; i++)
    {
      let preFormattedValue = makeChangesBeforeReturningValue(colObj.dataIndex, colObj.datatype, dataSource[i][colObj.dataIndex]);
      let dataValue =  Number(preFormattedValue);
      arrayOfValues.push(dataValue);
    }
    if(arrayOfValues.length > 1)
    {
       maxValue = Math.max(...arrayOfValues);
    }
    else
    {
      Log4r.error("This table have only single record !",arrayOfValues);
      maxValue = arrayOfValues[0];
    }
    return maxValue;
  }
  else
  {
    Log4r.error("DataSource not found for calcultaing max value",dataSource);
    return null;
  }
}

const setValueInGridCell = (xpathGrid,xpathCol,colVal,rowKey,isPopSearchInsertAllow) =>       /*xpathGrid is xpath of grid and xpathCol is xpath of column,colVal is value to be set..*/
{
  Log4r.log("xpathGrid,xpathCol,colVal",xpathGrid,xpathCol,colVal,rowKey,isPopSearchInsertAllow);
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)            /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];
        if (obj)
        {
          fpath = obj.children.fieldPath;         /* setting fieldPath..*/
          secIndex=i;                           /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return false;
      }
      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter((colItm)=>{
        if (colItm.children !=undefined) {
          return colItm.children.xPath == xpathCol;
        }
        else {
          return colItm.xPath == xpathCol;
        }
      })[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj)
      {
        (colObj.children!=undefined) ? colObj=colObj.children : null ;
        if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != null && holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != undefined)/* checkng dataSource is available..*/
        {
          if (typeof holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource == typeof [])
          {
            let filterKey="";
            if(isempty(rowKey)){
              filterKey=GlobalHelper.globlevar.keyOfCurruntchangedField;
            }
            else{
              filterKey=rowKey;
            }
            let dSrc = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource;
            for (let j = 0; j < dSrc.length; j++)
            {
              Log4r.log("safs...");
              if (dSrc[j].key == filterKey) {
                if (colObj.widget == "hidden") {
                  dSrc[j][colObj.dataIndex] = colVal;
                  return true;
                }
                else{
                  let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
                Log4r.log("tmpDefaultValueManagerMap==>",tmpDefaultValueManagerMap);
                if (tmpDefaultValueManagerMap == undefined)
                {
                  tmpDefaultValueManagerMap = new Map();
                  GlobalHelper.globlevar['defaultValueManagerMap'] =tmpDefaultValueManagerMap;
                }
                Log4r.log("sessionID=>",holdNamessjson.screendata[secIndex].sessionID);
                let gId = holdNamessjson.screendata[secIndex].sessionID;
                let arrCol = tmpDefaultValueManagerMap.get(gId+"."+colObj.dataIndex);
                Log4r.log(gId+"."+colObj.dataIndex,"....gId+colObj.dataIndex.....",arrCol);
                let newObjrule = {};
                newObjrule['onChangeTrigger'] = true;
                newObjrule['defaultVal'] = colVal;
                if (isPopSearchInsertAllow) {
                  newObjrule['popsearchInsertAllow'] = true;
                }
                if (arrCol!=undefined && Array.isArray(arrCol)) {
                  if (arrCol.length<j) {
                    for (let i = arrCol.length; i < j; i++)
                    {
                      arrCol[i]={};
                    }
                  }
                  arrCol[j] = newObjrule;
                  Log4r.log("arrCol===",arrCol);
                }
                else {
                  arrCol = [];
                  for (let i = arrCol.length; i < j; i++)
                  {
                    arrCol[i]={};
                  }
                  arrCol[j] = newObjrule;
                }
                tmpDefaultValueManagerMap.set(gId+"."+colObj.dataIndex,arrCol);
                return true;
                }
              }
            }
          }else {
            Log4r.error("DataSource is not an array..");
            return false;
          }
        }
        else {
          Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
          return null;
        }
      }
      else {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
}
const setDatasrcOfPopSearchWithoutIndex = (xpathGrid,xpathCol,dataSrc) =>       /*xpathGrid is xpath of grid and xpathCol is xpath of column,dataSrc is datasourse to be set without index provided..*/
{
  Log4r.log("setDatasrcOfPopSearchWithoutIndex....=>",xpathGrid,xpathCol,dataSrc);
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)            /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];
        Log4r.log("wkrhg....",obj);
        if (obj)
        {
          fpath = obj.children.fieldPath;         /* setting fieldPath..*/
          GlobalHelper.globlevar['setValInGridRender'].push(obj.children.fieldPath);
          secIndex=i;                           /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return false;
      }
      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj)
      {
        if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != null && holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != undefined)/* checkng dataSource is available..*/
        {
          Log4r.log("typeof holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource, typeof []",typeof holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource ,typeof []);
          Log4r.log(typeof holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource == typeof []);
          if (typeof holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource == typeof [])
          {
            let resRecForKey = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource.filter(eachRecord => eachRecord.key === GlobalHelper.globlevar.keyOfCurruntchangedField)[0];
            Log4r.log(resRecForKey);
            if (resRecForKey)
            {
              resRecForKey[colObj.dataIndex+"customeDataSource"] =dataSrc;
              resRecForKey['valueSetByCustom'] = true;
              return true;
            }
            else
            {
              return false;
            }
          }
          else {
            Log4r.error("DataSource is not an array..");
            return false;
          }
        }
        else {
          Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
          return null;
        }
      }
      else {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
}
const updateRowKeys = (dataSource) =>
{
  for (let i = 0; i < dataSource.length; i++) {
    dataSource[i].key = (i+1);
  }
}
const clearGrid = (xpathGrid) =>
{
  Log4r.log("xpath,commValue=>",xpathGrid)
  var flagBool=false;
  for (let i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
  {
    let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid)[0];
    if (gotObj)
    {
      if (Array.isArray(GlobalHelper.globlevar['setValInGridRender'])) {
        if (!GlobalHelper.globlevar['setValInGridRender'].includes(gotObj.children.fieldPath)) {
          GlobalHelper.globlevar['setValInGridRender'].push(gotObj.children.fieldPath);
        }
      }
      else
      {
        GlobalHelper.globlevar['setValInGridRender'] = [gotObj.children.fieldPath];
      }
      //GlobalHelper.globlevar['setValInGridRender'] = gotObj.children.fieldPath;
      if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
      {                       /*checked data is available for fieldPath in formData..*/
        let colObjTmp = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource = [];
      }
    }
  }
}

const addEmptyRowInGrid = (xpathGrid,mode,isAddToGrid) =>
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];
        if (obj)
        {
          fpath = obj.children.fieldPath;                 /* setting fieldPath..*/
          secIndex=i;                                   /* keeping index of section..*/
          break;
        }
      }
     if (fpath !== undefined && secIndex !== undefined) {
        let rowObj = {};
        let ds = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource;
        let len = ds.length;
        Log4r.log("len==>",len);
        if(mode === undefined)
        {
          rowObj["mode"] = "I";
        }
        else
        {
          // mode need to handled at java utility level. if user pass mode.
           rowObj["mode"] = mode;
        }

        holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.map((colItm, colInx)=>{   // NOSONAR: javascript:S2201
          if (colItm.children) {
            colItm.children.map((childItm, childInx)=>{ // NOSONAR: javascript:S2201
              rowObj[childItm.dataIndex] = "";
              xpathMapDir.set(childItm.xPath+"["+len+"]",childItm.dataIndex);/*assigning dataIndex against xPath in Map*/
            })
          }
          else {
            xpathMapDir.set(colItm.xPath+"["+len+"]",colItm.dataIndex);/*assigning dataIndex against xPath in Map*/
            rowObj[colItm.dataIndex] = "";
          }
        })
        rowObj['key'] = len+1;

        updateRowKeys(ds);

        if (isAddToGrid) {
          rowObj['newlyAddedRow'] = true;
        }

        holdNamessjson[fpath +"_lenght"] = len+1;
        holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource[len] = rowObj;
        Log4r.log("holdNamessjson====>",holdNamessjson);
        return true;
      }
      else {
        Log4r.error("fpath && secIndex not found to add empty row in grid..");
        return false;
      }
    }
    else {
      Log4r.error("screendata not found to add empty row in grid..");
      return false;
    }
  }
  else {
    return false;
  }
}

const hideRowInGrid = (xpathGrid,key) =>
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {

      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];

        if (obj)
        {

          let rowHasToMove = holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource.filter(item => item.key === key )[0];
          Log4r.log("moving row to hiddenRow" , rowHasToMove)
          Log4r.log("data DataSource " , JSON.stringify(holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource));
          let newDatasource = holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource.filter((el) => {
            return el.key !== key;
          });
          holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource = newDatasource;
          //delete holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource[ key - 1];
          //holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource.shift();
          Log4r.log("data DataSource after " , JSON.stringify(holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource));
          if(holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data['hiddenRow'] === undefined)
          {
            holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data['hiddenRow'] = [];
            holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data['hiddenRow'].push(rowHasToMove);
          }
          else
          {
            holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data['hiddenRow'].push(rowHasToMove);
          }
          break;
        }


      }
    }
  }
}

const setValuesInGrid = (xpathGrid,xpathCol,colValArr) =>       /*used to set value against xpath*/
{
  var cnt;
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];
        if (obj)
        {
          fpath = obj.children.fieldPath;                 /* setting fieldPath..*/
          secIndex=i;                                   /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return false;
      }
      var columnJson = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns;
      var colObj = columnJson.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj === undefined) {
        for (var i = 0; i < columnJson.length; i++) {
          if (columnJson[i].children) {
            let retObj = columnJson[i].children.filter(itm => itm.xPath === xpathCol)[0];
            if (retObj) {
              colObj = retObj;
            }
          }
        }
      }
      if (colObj)
      {
        if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != null && holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != undefined)/* checkng dataSource is available..*/
        {
          if (typeof holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource == typeof [])
          {
            for (var i = 0; i < colValArr.length; i++)
            {
              if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource[i])
              {
                holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource[i][colObj.dataIndex] = colValArr[i];
                cnt=i;
              }
            }
            if (i == colValArr.length)
            {
              return true;
            }
            else
            {
              return false;
            }
          }
          else
          {
            Log4r.error("DataSource is not an array..");
            return false;
          }
        }
        else
        {
          Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
          return null;
        }
      }
      else {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}

const showField = (xpath) =>       /*used to hide Field against xpath*/
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpath )[0];
        if (obj)
        {
          fpath = obj.children.fieldPath;                 /* setting fieldPath..*/
          secIndex=i;                                   /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpath);
        return false;
      }
      holdNamessjson.screendata[secIndex].schema[0][fpath]["hidden"]= false;
      return true;
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}

const hideField = (xpath) =>       /*used to hide Field against xpath*/
{
  if (holdNamessjson)
  {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof [])
    {
      var fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpath )[0];
        if (obj)
        {
          fpath = obj.children.fieldPath;                 /* setting fieldPath..*/
          secIndex=i;                                   /* keeping index of section..*/
          break;
        }
      }
      //Log4r.log(fpath,secIndex);
      if (fpath == undefined)
      {
        Log4r.error("grid not found for gridXpath:",xpath);
        return false;
      }
      holdNamessjson.screendata[secIndex].schema[0][fpath]["hidden"]= true;
      return true;
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}

const makeFieldReadOnly = (xpath) =>       /*makes Field ReadOnly */
{
  for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpath )[0];
    if (obj)
    {
      //Log4r.log("obj==",obj);
      obj.children["edit"] = "false";
      return true;
      //break;
    }
    //Log4r.log("end of for..");
  }
  //Log4r.log("out of for..");
  return false;
}

const setGridColumnHardReadonly = (gridXpath , colXpath) => {
  Log4r.log("jhasdkjashd...........",gridXpath , colXpath,holdNamessjson,this.props);
  if(gridXpath != null && colXpath != null){
    if(holdNamessjson != null){
      holdNamessjson.screendata.map((screenObj,index)=>{    // NOSONAR: javascript:S2201
        if(screenObj.sectionXPath === gridXpath){
          screenObj.uiSchema[0].children.map((item,indx)=>{   // NOSONAR: javascript:S2201
            if(item.children.widget === "table" && item.children.xPath === gridXpath){
              screenObj.formData[0][screenObj.sessionID].data.Columns.map((colitem,colindex)=>{   // NOSONAR: javascript:S2201
                if(colitem.xPath === colXpath || colXpath.includes(colitem.xPath)){
                  Log4r.log("hkjshdkjsahdkj......",colitem);
                  colitem['hardReadonly'] = true;
                }
              })
            }
          })
        }
      })
    }
  }
}

const makeFieldEditable = (xpath) =>       /*makes Field Editable */
{
  for (var i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpath )[0];
    if (obj)
    {
      //Log4r.log("obj==",obj);
      obj.children["edit"] = "true";
      return true;
      //break;
    }
    //Log4r.log("end of for..");
  }
  //Log4r.log("out of for..");
  return false;
}

const setValue = (xpath,commValue,isPopSearchInsertAllow) =>       /*used to set value against xpath*/
{
	Log4r.log("xpath,commValue=>",xpath,commValue)
  var flagBool=false;
  if (xpathMapDir)
  {
	Log4r.log("fpath ",xpathMapDir);
    let fpath=xpathMapDir.get(xpath);
	Log4r.log("fpath=",fpath)
    if (fpath)
    {
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        var loc1= xpath.indexOf("[");
        var loc2= xpath.indexOf("]");
        var val= xpath.substring(loc1+1,loc2);
        var valNum = parseInt(val);                           /*got the row index..*/
        var gridXpth=xpath.substring(0,xpath.lastIndexOf("."));
        var gotObj;
        for (var i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
        {
          gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpth)[0];
          if (gotObj)
          {
            if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
            {                       /*checked data is available for fieldPath in formData..*/
              let tempWidget;
              let colObjTmp = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.filter((colItm)=>{
                if (colItm.children !=undefined) {
                  return colItm.children.dataIndex==fpath;
                }
                else {
                  return colItm.dataIndex==fpath;
                }
              })[0];

              if (colObjTmp) {
                (colObjTmp.children!=undefined) ? tempWidget=colObjTmp.children.widget : tempWidget=colObjTmp.widget;
              }

              if (tempWidget == "hidden") {
                holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum][fpath] = commValue;
              }
              else{
                let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
              Log4r.log("tmpDefaultValueManagerMap==>",tmpDefaultValueManagerMap);
              if (tmpDefaultValueManagerMap == undefined)
              {
                tmpDefaultValueManagerMap = new Map();
                GlobalHelper.globlevar['defaultValueManagerMap'] = tmpDefaultValueManagerMap;
              }
              Log4r.log("sessionID=>",holdNamessjson.screendata[i].sessionID);
              let gId = holdNamessjson.screendata[i].sessionID;
              let arrCol = tmpDefaultValueManagerMap.get(gId+"."+fpath);
              Log4r.log(gId+"."+fpath,"....gId+fpath.....",arrCol);
              let newObjrule = {};
              newObjrule['onChangeTrigger'] = true;
              newObjrule['defaultVal'] = commValue;
              if (isPopSearchInsertAllow) {
                newObjrule['popsearchInsertAllow'] = true;
              }
              if (arrCol!=undefined && Array.isArray(arrCol)) {
                if (arrCol.length<valNum) {
                  for (let i = arrCol.length; i < valNum; i++)
                  {
                    arrCol[i]={};
                  }
                }
                arrCol[valNum] = newObjrule;
                Log4r.log("arrCol===",arrCol);
              }
              else {
                arrCol = [];
                for (let i = arrCol.length; i < valNum; i++)
                {
                  arrCol[i]={};
                }
                arrCol[valNum] = newObjrule;
              }
              tmpDefaultValueManagerMap.set(gId+"."+fpath,arrCol);
              holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]['valueSetByCustom'] = true;
              if(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.addThroughSummGrid === "true"){
                if(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource.length > 0){
                  if(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridjson != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridjson !== ""){
                    let screenDataToModify = JSON.parse(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridjson)
                    let changesDone = false;
                    if(screenDataToModify != null){
                      for (let i = 0; i < screenDataToModify.length; i++) {
                          let widgetToModifyData = null;
                          let fieldPathOfWidgetToModifyData = null;
                          if(screenDataToModify[i].uiSchema[0] != null) {
                            let requiredField = screenDataToModify[i].uiSchema[0].children.filter( item => item.children.xPath === colObjTmp.xPath)[0];
                              if(requiredField != null) {
                                widgetToModifyData = requiredField.children.widget;
                                fieldPathOfWidgetToModifyData = requiredField.children.fieldPath;
                                if(widgetToModifyData !== "table") { // In future need to implement code for setting values for tables inside a add to grid dependant grid.
                                  if(screenDataToModify[i].formData[0] != null) {
                                    if(screenDataToModify[i].formData[0][fieldPathOfWidgetToModifyData] != null) {
                                      if(widgetToModifyData === "text") { // In future need to implement code for setting values of widget other than text in else part.
                                        if(screenDataToModify[i].formData[0][fieldPathOfWidgetToModifyData].data != null) {
                                          screenDataToModify[i].formData[0][fieldPathOfWidgetToModifyData].data = commValue;
                                          changesDone = true;
                                          break;
                                        }
                                      }
                                    }
                                  }
                                }
                            }
                        }
                      }
                      if(changesDone === true){
                        holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridjson = JSON.stringify(screenDataToModify);
                      }
                    }
                  }
                  if(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridmap != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridmap !== ""){
                      let allXpathToModify = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridmap;
                      let splitValues = allXpathToModify.split("&");
                      if(splitValues != null){
                        if(splitValues.length != 0){
                          let residualColumnString = colObjTmp.xPath.substr(gridXpth.length, colObjTmp.xPath.length);
                          let concatedString = gridXpth + "[" + valNum + "]" + residualColumnString;
                          let newStringToAdd = "";
                          let indexAtWhichNewValueToAdd = null;
                          splitValues.map((splitItem,splitIndex)=>{   // NOSONAR: javascript:S2201
                            let stringToMatch = splitItem.split("=")[0];
                            if(stringToMatch != null){
                              if(stringToMatch === concatedString){
                                newStringToAdd =  stringToMatch + "=" + commValue;
                                indexAtWhichNewValueToAdd = splitIndex;
                                return;
                              }
                            }
                          });
                          if(newStringToAdd !== "" && indexAtWhichNewValueToAdd != null){
                            splitValues[indexAtWhichNewValueToAdd] = newStringToAdd;
                          }
                          holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum].addThroughSummGridmap = splitValues.join("&");
                        }
                      }
                  }
                }
              }
              flagBool = true;
              break;
              }
            }
          }
        }
      }
      else
      {                        /*ITS FIELD */
			try{
				for (var i = 0; i < holdNamessjson.screendata.length; i++)
				{
				  if (holdNamessjson.screendata[i].formData[0][fpath] != null && holdNamessjson.screendata[i].formData[0][fpath] != undefined )//&& holdNamessjson.screendata[i].formData[0][fpath] != ""
				  {
            let res = holdNamessjson.screendata[i].uiSchema[0].children.filter(itm=>itm.children.fieldPath == fpath)[0];
            if (res) {
              if (res.children.widget === "querybuilder" || (res.children.onChange === null || res.children.onChange === undefined || res.children.onChange.length === 0 )&&(res.children.edit === "false" || holdNamessjson.screendata[i].schema[0][fpath]['fieldConditionallyEditableFlag'] == false )) {
                holdNamessjson.screendata[i].formData[0][fpath].data = commValue;
              }
              else {
              /*  if (res.children.widget === "hidden") {
                  holdNamessjson.screendata[i].formData[0][fpath].data = commValue;
                }*/
                let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
                if (tmpDefaultValueManagerMap == undefined)
                {
                  tmpDefaultValueManagerMap = new Map();
                  GlobalHelper.globlevar['defaultValueManagerMap'] = tmpDefaultValueManagerMap;
                }
                let gId = holdNamessjson.screendata[i].sessionID;
                Log4r.log(gId+"."+fpath,"....gId+fpath.....");
                let newObjrule = {};
                if (isPopSearchInsertAllow) {
                  newObjrule['popsearchInsertAllow'] = true;
                }
                newObjrule['onChangeTrigger'] = true;
                newObjrule['defaultVal'] = commValue;
                tmpDefaultValueManagerMap.set(gId+"."+fpath,newObjrule);
                Log4r.log("asdcsss..",tmpDefaultValueManagerMap);
                flagBool = true;
                break;
              }
            }
				  }
				}
			}
			catch(e){Log4r.error(e);}
      }
      return flagBool;
    }
    else {
      Log4r.log("fpath not available.....//");
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        let loc1= xpath.indexOf("[");
        let loc2= xpath.indexOf("]");
        let val= xpath.substring(loc1+1,loc2);
        let valNum = parseInt(val);                           /*got the row index..*/
        let gridXpth=xpath.substring(0,xpath.lastIndexOf("."));
        let gotObj;
        for (let i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
        {
          gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpth)[0];
          if (gotObj)
          {
            Log4r.log(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]);
            if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]) {
              holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.map((colItm, colInx)=>{    // NOSONAR: javascript:S2201
                if(colItm !== undefined){
                  if (colItm.children) {
                    colItm.children.map((childItm, childInx)=>{   // NOSONAR: javascript:S2201
                      //rowObj[childItm.dataIndex] = "";
                      xpathMapDir.set(childItm.xPath+"["+val+"]",childItm.dataIndex);/*assigning dataIndex against xPath in Map*/
                    })
                  }
                  else {
                    xpathMapDir.set(colItm.xPath+"["+val+"]",colItm.dataIndex);/*assigning dataIndex against xPath in Map*/
                    //rowObj[colItm.dataIndex] = "";
                  }
                }
              })
              fpath =xpathMapDir.get(xpath);
              if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
              {/*checked data is available for fieldPath in formData..*/
                let colObjTmp = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.filter((colItm)=>{
                  if (colItm.children !=undefined) {
                    return colItm.children.dataIndex==fpath;
                  }
                  else {
                    return colItm.dataIndex==fpath;
                  }
                })[0];
                let tempWidget;
                if (colObjTmp) {
                  (colObjTmp.children!=undefined) ? tempWidget=colObjTmp.children.widget : tempWidget=colObjTmp.widget;
                }
                if(fpath !== undefined){
                  if (tempWidget == "hidden"){
                      holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum][fpath] = commValue;
                    }
                  else {
                      let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
                      Log4r.log("tmpDefaultValueManagerMap==>",tmpDefaultValueManagerMap);
                      if (tmpDefaultValueManagerMap == undefined)
                      {
                        tmpDefaultValueManagerMap = new Map();
                        GlobalHelper.globlevar['defaultValueManagerMap'] = tmpDefaultValueManagerMap;
                      }
                      Log4r.log("sessionID=>",holdNamessjson.screendata[i].sessionID);
                      let gId = holdNamessjson.screendata[i].sessionID;
                      let arrCol = tmpDefaultValueManagerMap.get(gId+"."+fpath);
                      Log4r.log(gId+"."+fpath,"....gId+fpath.....",arrCol);
                      let newObjrule = {};
                      newObjrule['onChangeTrigger'] = true;
                      newObjrule['defaultVal'] = commValue;
                      if (isPopSearchInsertAllow) {
                        newObjrule['popsearchInsertAllow'] = true;
                      }
                      if (arrCol!=undefined && Array.isArray(arrCol)) {
                        if (arrCol.length<valNum) {
                          for (let i = arrCol.length; i < valNum; i++)
                          {
                            arrCol[i]={};
                          }
                        }
                        arrCol[valNum] = newObjrule;
                        Log4r.log("arrCol===",arrCol);
                      }
                      else {
                        arrCol = [];
                        for (let i = arrCol.length; i < valNum; i++)
                        {
                          arrCol[i]={};
                        }
                        arrCol[valNum] = newObjrule;
                      }
                      tmpDefaultValueManagerMap.set(gId+"."+fpath,arrCol);
                    }
                }

                holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]['valueSetByCustom'] = true;
                flagBool = true;
                break;
              }
              return true;
            }
            else {
              Log4r.error("***fpath not Found in Map..");
              return false;
            }
          }
        }
      }
      else {
        Log4r.error("***fpath not Found in Map..");
        return false;
      }
    }
  }else
  {
    Log4r.error("Map not Found");
    return false;
  }
}

const setCellEditable = (xPathGrid, xPathColumn, rowIndex) => {      /*used to make a cell editable against xpath*/

  let returnFlag = null;                                   /*return flag */
  let fpathcolumn = xpathMapDir.get(xPathColumn);
  let dataSourceRuleMap = new Map();
  let pathToDataSource; 

  if (xPathGrid != undefined && xPathColumn !== undefined && holdNamessjson !== undefined) {

    let gridData = holdNamessjson.screendata.filter((item) => item.sectionXPath == xPathGrid);
    if (gridData != undefined && gridData.length > 0) {
      pathToDataSource = gridData[0].formData[0][gridData[0].sessionID].data.DataSource;
    }
    
    if (pathToDataSource.length > 0) {
      if (pathToDataSource[rowIndex].dataSourceRuleMap != undefined && pathToDataSource[rowIndex].dataSourceRuleMap != null) {
        dataSourceRuleMap = pathToDataSource[rowIndex].dataSourceRuleMap;
      }
    }

    let rowColumnResultObj = {};
    if (dataSourceRuleMap.get(fpathcolumn) != undefined && dataSourceRuleMap.get(fpathcolumn) != null) {
      rowColumnResultObj = dataSourceRuleMap.get(fpathcolumn);
    }

    rowColumnResultObj['colConditionallyEditableFlag'] = true;
    dataSourceRuleMap.set(fpathcolumn, rowColumnResultObj);

    if (pathToDataSource.length > 0) {
      pathToDataSource[rowIndex]['dataSourceRuleMap'] = dataSourceRuleMap;
    }

    returnFlag = true;
  } 
  else {
    returnFlag = false;
  }
  return returnFlag;
}

/*
Sprint 6-Task 59 - Make section editable
input parameter[xPath] output parameter [true/false]
*/
const makeSectionEditable = (xPath) =>{
  let returnFlag=null;                                   /*return flag */
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)      /*iteration for screendata*/
      {
        if(  holdNamessjson.screendata[i].formData[0][fpath] !== undefined )
            {
              if(holdNamessjson.screendata[i].editable != undefined)
                {
                  holdNamessjson.screendata[i].editable = true;
                }
                else
                {
                  holdNamessjson.screendata[i]["editable"] = true;
                }
              returnFlag=true;
            }
      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}


/*
Sprint 6-Task 59 - Make section ReadOnly
input parameter[xPath] output parameter [true/false]
*/
const makeSectionReadOnly = (xPath) =>{
  let returnFlag=null;                                           /*return flag*/
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)         /*iterating screendata*/
      {
        if(  holdNamessjson.screendata[i].formData[0][fpath] !== undefined )
            {
              if(holdNamessjson.screendata[i].editable != undefined)
                {
                  holdNamessjson.screendata[i].editable = false;
                }
                else
                {
                  holdNamessjson.screendata[i]["editable"] = false;
                }
              returnFlag=true;
            }
      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}

//to make section editable on bassis of sectionId
/*const makeSectionEditable = (sectionid) =>{
  if(sectionid !== undefined && holdNamessjson !== undefined)
  {
    for(var i=0;i<holdNamessjson.screendata.length;i++)
    {
        if(holdNamessjson.screendata[i].sessionID === sectionid)
        {
        if(holdNamessjson.screendata[i].editable != undefined)
          {
            holdNamessjson.screendata[i].editable = true;
          }
          else
          {
            holdNamessjson.screendata[i]["editable"] = true;
          }
          return true;
        }
    }
  }
  else
  {
    return false;
  }
}*/

//to make section non-editable on bassis of sectionId
/*const makeSectionReadOnly = (sectionid) =>{
  if(sectionid !== undefined && holdNamessjson !== undefined)
  {
      for(var i=0;i<holdNamessjson.screendata.length;i++)
      {
          if(holdNamessjson.screendata[i].sessionID === sectionid)
          {
          if(holdNamessjson.screendata[i].editable != undefined)
            {
              holdNamessjson.screendata[i].editable = false;
            }
            else
            {
              holdNamessjson.screendata[i]["editable"] = false;
            }
            Log4r.log("after,,,,",holdNamessjson.screendata[i]);
            return true;
          }
       }
     }
    else
    {
      return false;
    }
  }*/

/*
  Sprint 6-Task 59 - Hide Section
  input parameter[xPath] output parameter [true/false]
*/
const hideSection = (xPath,callfromcustomcode) => {
  let returnFlag=null;                              /*return flag*/
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
  //  let fpath = xpathMapDir.get(xPath);              /*field path against input xPath*/
    for(var i=0;i<holdNamessjson.screendata.length;i++)  /*iterating screendata*/
      {
        // if(  holdNamessjson.screendata[i].formData[0][xPath] !== undefined )
        //     {
        //     if(holdNamessjson.screendata[i].hidden != undefined)
        //         {
        //           holdNamessjson.screendata[i].hidden = true;
        //         }
        //         else
        //         {
        //           holdNamessjson.screendata[i]["hidden"] = true;
        //         }
        //       returnFlag=true;
        //     }

        /*
          below code hidding section on basis of sectionId which develped initial when we were not gettin xpath on section level
         */
          if(  holdNamessjson.screendata[i]['sessionID'] === xPath )
                 {
                   if(callfromcustomcode === "callfromcustomcode"){
                     holdNamessjson.screendata[i]["hidden"] ="true";
                   }
                   else if(GlobalHelper.globlevar.linkpress == false){
                     holdNamessjson.screendata[i]["hidden"] = "cardSectionHiddentrue";
                   }
                   else {
                     holdNamessjson.screendata[i]["hidden"] ="true";
                   }
                 }
          // added Hidden section on basis of xPath of section. previous we were handle through sectionId
          if(  holdNamessjson.screendata[i]['sectionXPath'] === xPath )
                 {
                     holdNamessjson.screendata[i]["hidden"] ="true";

                 }

      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}

/*
Sprint 6-Task 59 - Show Section
input parameter[xPath] output parameter [true/false]
*/
const showSection = (sessionID) => {
 var showSection = holdNamessjson.screendata.filter((item,index)=> item.sessionID === sessionID)[0]
 let returnFlag=null;                     /*return flag*/
 if(showSection !== undefined)
 {
   showSection['hidden'] = false;
   returnFlag=true;
 }
 //here sectionID might be xpath
 var showSectionOnXpath = holdNamessjson.screendata.filter((item,index)=> item.sectionXPath === sessionID)[0]
 if(showSectionOnXpath !== undefined)
 {
   showSectionOnXpath['hidden'] = false;
   returnFlag=true;
 }

 returnFlag=false;

  /*if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);       //fieldpath  against input xPath
    for(var i=0;i<holdNamessjson.screendata.length;i++)   //iterating screeendata
      {
        if(  holdNamessjson.screendata[i].formData[0][fpath] !== undefined )
            {
              if(holdNamessjson.screendata[i].hidden != undefined)
                {
                  holdNamessjson.screendata[i].hidden = false;
                }
                else
                {
                  holdNamessjson.screendata[i]["hidden"] = false;
                }
              returnFlag=true;
            }
      }
  }
  else
  {
    returnFlag=false;
  }


  return returnFlag;*/
}

/*TASK NO - 58 To  make field readonly
input parameter xPath output parameter true/false*/
/*const makeFieldReadOnly = (xPath) =>{
  let returnFlag=null;
  if(xPath !== undefined && holdNamessjson !== undefined )
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)
    {
      if( holdNamessjson.screendata[i].formData[0][fpath] !== undefined )
      {
        for(var j=0;j<holdNamessjson.screendata[i].uiSchema[0].children.length;j++)
        {
          if( holdNamessjson.screendata[i].uiSchema[0].children[j].children.fieldPath == fpath )
          {
            if( holdNamessjson.screendata[i].uiSchema[0].children[j].children.isWidgetEditable !== undefined )
            {
              holdNamessjson.screendata[i].uiSchema[0].children[j].children.isWidgetEditable = false;
            }
            else{
              holdNamessjson.screendata[i].uiSchema[0].children[j].children["isWidgetEditable"] = false;
            }
            returnFlag=true;
          }
          else
          {
            Log4r.log("fieldpath is not in uischema...");
            returnFlag=false;
          }
        }
      }
      else {
        Log4r.log("fieldpath is not in formdata...");
        returnFlag=false;
      }
    }
  }
  else{
    returnFlag=false;
  }
  return returnFlag;
}

/*TASK NO - 58 To make field editable
input parameter xPath output parameter true/false*/
/*const makeFieldEditable = (xPath) =>{
  let returnFlag=null;
  if(xPath !== undefined && holdNamessjson !== undefined )
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)
    {
      if( holdNamessjson.screendata[i].formData[0][fpath] !== undefined )
      {
        for(var j=0;j<holdNamessjson.screendata[i].uiSchema[0].children.length;j++)
        {
          if( holdNamessjson.screendata[i].uiSchema[0].children[j].children.fieldPath == fpath )
          {
            if( holdNamessjson.screendata[i].uiSchema[0].children[j].children.isWidgetEditable !== undefined )
            {
              holdNamessjson.screendata[i].uiSchema[0].children[j].children.isWidgetEditable = true;
            }
            else{
              holdNamessjson.screendata[i].uiSchema[0].children[j].children["isWidgetEditable"] = true;
            }
            returnFlag=true;
          }
          else
          {
            Log4r.log("fieldpath is not in uischema...");
            returnFlag=false;
          }
        }
      }
      else {
        Log4r.log("fieldpath is not in formdata...");
        returnFlag=false;
      }
    }
  }
  else{
    returnFlag=false;
  }
  return returnFlag;
}*/

/*Sprint 6 - Task no -60*/
const fetchData = (url,querystring) =>{
  if(querystring !== undefined && querystring !== null)
    {
      url += (url.indexOf('?') === -1 ? '?' : '&') + querystring;
    }

    let postUrlData  = url.split("?")[1];
    let _stdata = getSTData("/"+GlobalHelper.menuContext+"/", postUrlData);


  return $.ajax({
          type: "POST",
          url: url,
          data:{
            _SID_:(_stdata.SID + _stdata.SINT),
            _ADF_:""
          },
          async: false
      }).responseText;
}

const fetchDataPost = (url,querystring) =>{
  if(querystring !== undefined && querystring !== null)
    {
      //url += (url.indexOf('?') === -1 ? '?' : '&') + querystring;
    }

    let postUrlData  = url.split("?")[1];
    let _stdata = getSTData("/"+GlobalHelper.menuContext+"/", postUrlData);

  return $.ajax({
          type: "POST",
          url: url,
          data:{
                  querystring,
                  _SID_:(_stdata.SID + _stdata.SINT),
                  _ADF_:""
              },
          async: false
      }).responseText;
}

/*Sprint 6 - Task No. - 60 */
const populateDropdown = (xPath,dropdownjson) =>{
  if( xPath !== undefined && dropdownjson !== undefined && holdNamessjson !== undefined )
  {
    for(const element of holdNamessjson.screendata)     /*for iterating screendata*/
    {
      let obj = element.uiSchema[0].children.filter(item => item.children.xPath === xPath )[0];
      if(obj)
      {
        obj.children["options"] = dropdownjson;
      }
    }
  }
}

const clearDropdown = (xPath) =>{
  if( xPath !== undefined && holdNamessjson !== undefined )
  {
    for(const element of holdNamessjson.screendata)     /*for iterating screendata*/
    {
      let obj = element.uiSchema[0].children.filter(item => item.children.xPath === xPath )[0];
      if(obj)
      {
        obj.children["options"] = [];
      }
    }
  }
}

const populateDropdownInGrid = (gridxPath,colxPath,dropdownjson) =>{
     if(gridxPath !== undefined && colxPath !== undefined && dropdownjson !== undefined && holdNamessjson !== undefined )
     {
       for(let i=0;i<holdNamessjson.screendata.length;i++)
       {
         var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => (item.children.widget == "table" && item.children.xPath === gridxPath))[0];
         if(obj != null)
         {
           if(holdNamessjson.screendata[i].formData != null && holdNamessjson.screendata[i].formData[0] != null){
             if(holdNamessjson.screendata[i].formData[0][holdNamessjson.screendata[i].sessionID] != null && holdNamessjson.screendata[i].formData[0][holdNamessjson.screendata[i].sessionID].data != null){
               let colArr =holdNamessjson.screendata[i].formData[0][holdNamessjson.screendata[i].sessionID].data.Columns;
                if( colArr != null && Array.isArray(colArr))
                {
                 for(let j = 0;j<colArr.length;j++)
                 {
                    if(colArr[j].xPath != null && colArr[j].xPath == colxPath)
                    {
                         colArr[j]["options"] = dropdownjson;
                     }
                 }
               }
                Log4r.log("qwwqe...colArr",colArr);
             }
           }
         }
       }
     }
 }
const clearDropdownInGrid = (gridxPath,colxPath) =>{
     if(gridxPath !== undefined && colxPath !== undefined &&  holdNamessjson !== undefined )
     {
       for(let i=0;i<holdNamessjson.screendata.length;i++)
       {
         var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => (item.children.widget == "table" && item.children.xPath === gridxPath))[0];
         if(obj != null)
         {
           if(holdNamessjson.screendata[i].formData != null && holdNamessjson.screendata[i].formData[0] != null){
             if(holdNamessjson.screendata[i].formData[0][holdNamessjson.screendata[i].sessionID] != null && holdNamessjson.screendata[i].formData[0][holdNamessjson.screendata[i].sessionID].data != null){
               let colArr =holdNamessjson.screendata[i].formData[0][holdNamessjson.screendata[i].sessionID].data.Columns;
                if( colArr != null && Array.isArray(colArr))
                {
                 for(let j = 0;j<colArr.length;j++)
                 {
                    if(colArr[j].xPath != null && colArr[j].xPath == colxPath)
                    {
                         colArr[j]["options"] = [];
                     }
                 }
               }
                Log4r.log("qwwqe...colArr",colArr);
             }
           }
         }
       }
     }
 }

const getFieldPath = (xpath) =>
{
  return xpathMapDir.get(xpath);
}

const xpathFactory = (holdNamess) =>
{
  if(holdNamess && holdNamess.screendata && holdNamess.screendata[0] && holdNamess.screendata[0].uiSchema && holdNamess.screendata[0].uiSchema !== undefined)
  {
    holdNamessjson = holdNamess;
    getxPathMapForGrid(holdNamess);
  }

  //GET DATA AGAINST XPATH
      var xpthDir = new Map();
      var xpth = new Map();
      var sesMapObj;
      if(holdNamess.screendata !== undefined) // checked worked only for holdnamess.screendata should not be undefined
      {
      for(var i=0; i<holdNamess.screendata.length; i++)         /* iterating for sections..*/
      {
        sesMapObj = new Map();
        for(var j=0;j<holdNamess.screendata[i].formData.length;j++)
        {
          var kkrr=Object.keys(holdNamess.screendata[i].formData[j]);/*getting all the fieldPath in formdata..*/
          kkrr.map((item,z)=>   // NOSONAR: javascript:S2201
          {
            var getObjFiltr=holdNamess.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];/*searching for fieldPath..*/
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")    /* checking for table..*/
              {
                //TABLE.....
                holdNamess.screendata[i].formData[j][item].data.Columns.map((colItmmm,indxColItmmm)=>{    // NOSONAR: javascript:S2201
                  if (colItmmm.children) {
                    for (var s = 0; s < colItmmm.children.length; s++) {
                      let tempVariable = colItmmm.children[s];
                      xpthDir.set(tempVariable.xPath,tempVariable.dataIndex);/*assigning dataIndex against xPath in Map*/
                    }
                  }else {
                    xpthDir.set(colItmmm.xPath,colItmmm.dataIndex);
                  }
                })
                for(var p=0 ; p<holdNamess.screendata[i].formData[j][item].data.DataSource.length ; p++)/*iterating through dataSource..*/
                {
                  var dataSrcKrr=Object.keys(holdNamess.screendata[i].formData[j][item].data.DataSource[p]);
                  dataSrcKrr.map((dtaVal,dtSrId)=>    // NOSONAR: javascript:S2201
                  {
                    for (var r = 0; r < holdNamess.screendata[i].formData[j][item].data.Columns.length; r++) {
                      if (holdNamess.screendata[i].formData[j][item].data.Columns[r].children) {     /// code added for grouped columns.
                        for (var s = 0; s < holdNamess.screendata[i].formData[j][item].data.Columns[r].children.length; s++) {
                          let tempVariable = holdNamess.screendata[i].formData[j][item].data.Columns[r].children[s];
                          if (tempVariable.dataIndex === dtaVal) {
                            xpthDir.set(tempVariable.xPath+"["+p+"]",tempVariable.dataIndex);/*assigning dataIndex against xPath in Map*/
                            sesMapObj.set(tempVariable.xPath+"["+p+"]",xpthDir.get(tempVariable.xPath+"["+p+"]"));/*assigning dataIndex against xPath in Map*/
                          }
                        }
                      }else {
                        let tempVariable = holdNamess.screendata[i].formData[j][item].data.Columns[r];
                        if (tempVariable.dataIndex === dtaVal) {
                          xpthDir.set(tempVariable.xPath+"["+p+"]",tempVariable.dataIndex);/*assigning dataIndex against xPath in Map*/
                          sesMapObj.set(tempVariable.xPath+"["+p+"]",xpthDir.get(tempVariable.xPath+"["+p+"]"));/*assigning dataIndex against xPath in Map*/
                        }
                      }
                    }
                  });
                }
              }
              else
              {
                xpthDir.set(getObjFiltr.children.xPath,getObjFiltr.children.fieldPath);               /*assigning fieldPath against xPath in Map*/
                sesMapObj.set(getObjFiltr.children.xPath,xpthDir.get(getObjFiltr.children.xPath));        /*assigning fieldPath against xPath in Map*/
              }
            }
          });
        }
        xpth.set(holdNamess.screendata[i].sessionID,sesMapObj);
      }
      //Log4r.log("SAF...",xpth);
      //Log4r.log(xpthDir);
      setXpathValues(xpth,xpthDir);
    }
}
const clearHighlightedRowInGrid = (gridXpath,rowIndex)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    Log4r.log("sddd",obj);
    if (obj) {
      if (obj.children.rows) {
        obj.children.rows[rowIndex] = false;
        Log4r.log("set...",obj);
      }
    }
  }
  Log4r.log("kaaa",holdNamessjson.screendata);
}
const highlightRowInGrid = (gridXpath,rowIndex)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    if (obj) {
      if (obj.children.rows) {
        obj.children.rows[rowIndex] = true;
      }
      else {
        obj.children.rows = {};
        obj.children.rows[rowIndex] = true;
      }
    }
  }
}
const removeStrikeThroughRowInGrid = (gridXpath,rowIndex)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    Log4r.log("sddd",obj);
    if (obj) {
      if (obj.children.strikeThroughRow) {
        obj.children.strikeThroughRow[rowIndex] = false;
        Log4r.log("set...",obj);
      }
    }
  }
  Log4r.log("kaaa",holdNamessjson.screendata);
}
const strikeThroughRowInGrid = (gridXpath,rowIndex)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    Log4r.log("sddd",obj);
    if (obj) {
      if (obj.children.strikeThroughRow) {
        obj.children.strikeThroughRow[rowIndex] = true;
        Log4r.log("set...",obj);
      }
      else {
        obj.children.strikeThroughRow = {};
        obj.children.strikeThroughRow[rowIndex] = true;
        Log4r.log("set...",obj);
      }
    }
  }
  Log4r.log("kaaa",holdNamessjson.screendata);
}
const highlightColumnInGrid=(gridXpath,columnIndex)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    if (obj) {
      if (obj.children.cols) {
        obj.children.cols[columnIndex] = true;
      }
      else {
        obj.children.cols = {};
        obj.children.cols[columnIndex] = true;
      }
    }
  }
  Log4r.log("jga.....",holdNamessjson);
}
const clearHighlightedColumnInGrid=(gridXpath,columnIndex)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    if (obj) {
      if (obj.children.cols) {
        obj.children.cols[columnIndex] = false;
      }
    }
  }
  Log4r.log("jga.....",holdNamessjson);
}
const highlightCellInGrid=(gridXpath,rowId,colId)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    if (obj) {
      if (obj.children.cells) {
        let tObj = {};
        tObj['apply'] = true;
        tObj['row'] = rowId;
        tObj['col'] = colId;
        obj.children.cells[rowId+"_"+colId] = tObj;
      }
      else {
        obj.children.cells = {};
        let tObj = {};
        tObj['apply'] = true;
        tObj['row'] = rowId;
        tObj['col'] = colId;
        obj.children.cells[rowId+"_"+colId] = tObj;
      }
    }
  }
  Log4r.log("jga.....",holdNamessjson);
}
const clearHighlightedCellInGrid=(gridXpath,rowId,colId)=>{
  for(var i=0;i<holdNamessjson.screendata.length;i++)     /*for iterating screendata*/
  {
    var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpath )[0];
    if (obj) {
      if(obj.children.cells && obj.children.cells[rowId+"_"+colId]) {
        let tObj = obj.children.cells[rowId+"_"+colId];
        tObj['apply'] = false;
      }
    }
  }
  Log4r.log("jga.....",holdNamessjson);
}
/*const xpathFactory = (holdNamess) =>
{
  holdNamessjson = holdNamess;
  //GET DATA AGAINST XPATH
      var xpthDir = new Map();
      var xpth = new Map();
      var sesMapObj;
      if(holdNamess !== undefined)
      {
      for(var i=0; i<holdNamess.screendata.length; i++)
      {
        sesMapObj = new Map();
        for(var j=0;j<holdNamess.screendata[i].formData.length;j++)
        {
          var kkrr=Object.keys(holdNamess.screendata[i].formData[j]);
          kkrr.map((item,z)=>
          {
            var getObjFiltr=holdNamess.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")
              {
                //TABLE.....
                Log4r.log("table......");
                for(var p=0 ; p<holdNamess.screendata[i].formData[j][item].data.DataSource.length ; p++)
                {
                  Log4r.log("holdNamess.screendata[i].formData[j][item].data:",holdNamess.screendata[i].formData[j][item].data);
                  Log4r.log(holdNamess.screendata[i].formData[j][item].data.DataSource[p]);
                  var dataSrcKrr=Object.keys(holdNamess.screendata[i].formData[j][item].data.DataSource[p]);
                  Log4r.log(dataSrcKrr);
                  Log4r.log("p=",p);
                  dataSrcKrr.map((dtaVal,dtSrId)=>
                  {
                    Log4r.log("dtaVal",dtaVal);
                    Log4r.log();
                    var colObj=holdNamess.screendata[i].formData[j][item].data.Columns.filter(cObj => cObj.dataIndex === dtaVal)[0];
                    Log4r.log("colObj",colObj);
                    //Log4r.log("colObj.dataIndex===",colObj.dataIndex);
                    if (colObj)
                    {
                      Log4r.log("SETTING////");
                      //sesMapObj.set(colObj.xPath+"["+p+"]",holdNamess.screendata[i].formData[j][item].data.DataSource[p][dtaVal]);
                      sesMapObj.set(colObj.xPath+"["+p+"]",xpthDir.get(colObj.xPath+"["+p+"]"));
                      xpthDir.set(colObj.xPath+"["+p+"]",holdNamess.screendata[i].formData[j][item].data.DataSource[p][dtaVal])
                    }
                    //holdNamess.screendata[i].formData[j][item].data.DataSource[p][dtaVal]
                  });
                }
              }
              else
              {
                Log4r.log("holdNamess.screendata[i].formData[j][item]:",holdNamess.screendata[i].formData[j][item]);
                sesMapObj.set(getObjFiltr.children.xPath,xpthDir.get(getObjFiltr.children.xPath));
                xpthDir.set(getObjFiltr.children.xPath,holdNamess.screendata[i].formData[j][item].data)

              }
            }
            //holdNamess.screendata[i].formData[j][item]
          });
        }
        xpth.set(holdNamess.screendata[i].sessionID,sesMapObj);
      }
      //setXpathValue(xpth);
      setXpathValues(xpth,xpthDir);
    }
}*/

//Sprint 23 - Function to hide column in Grid -[ note:- May not work for popsearch or dropdown.]
const hideGridColumn = (xPath) =>{
  let returnFlag=null;                                           /*return flag*/
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)         /*iterating screendata*/
      {
        for(var j=0;j<holdNamessjson.screendata[i].formData.length;j++)
        {
          var kkrr=Object.keys(holdNamessjson.screendata[i].formData[j]);/*getting all the fieldPath in formdata..*/
          kkrr.map((item,z)=>   // NOSONAR: javascript:S2201
          {
            var getObjFiltr=holdNamessjson.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];/*searching for fieldPath..*/
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")    /* checking for table..*/
              {
                holdNamessjson.screendata[i].formData[j][item].data.Columns.map((colItmmm,indxColItmmm)=>{    // NOSONAR: javascript:S2201
                   if(colItmmm.children != undefined){
						colItmmm.children.map((col,indxCol)=>{    // NOSONAR: javascript:S2201
							Log4r.log("col.xPath",col.xPath);
							Log4r.log("xPath",xPath)
							if(col.xPath === xPath ) {
                col['orignalwidget']=col['widget'];
							col['widget']="hidden";
							returnFlag=true;
							}
						})
					}
                 else if(colItmmm.xPath === xPath ) {
                    colItmmm['widget']="hidden";
                    returnFlag=true;
                  }
                })
              }
            }
          })
        }
      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}
const showGridColumn = (xPath) =>{
  let returnFlag=null;                                           /*return flag*/
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)         /*iterating screendata*/
      {
        for(var j=0;j<holdNamessjson.screendata[i].formData.length;j++)
        {
          var kkrr=Object.keys(holdNamessjson.screendata[i].formData[j]);/*getting all the fieldPath in formdata..*/
          kkrr.map((item,z)=>   // NOSONAR: javascript:S2201
          {
            var getObjFiltr=holdNamessjson.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];/*searching for fieldPath..*/
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")    /* checking for table..*/
              {
                holdNamessjson.screendata[i].formData[j][item].data.Columns.map((colItmmm,indxColItmmm)=>{    // NOSONAR: javascript:S2201
                  if(colItmmm.children != undefined){
						colItmmm.children.map((col,indxCol)=>{    // NOSONAR: javascript:S2201
							Log4r.log("col.xPath",col.xPath);
							Log4r.log("xPath",xPath)
							if(col.xPath === xPath ) {
							col['widget']="text";
							returnFlag=true;
							}
						})
					}
                 else if(colItmmm.xPath === xPath ) {

                   if(colItmmm['orignalwidget'] != undefined)
                  {
                      colItmmm['widget']= colItmmm['orignalWidget'];
                  }
                  else
                  {
                      colItmmm['widget']="text";
                  }

                    returnFlag=true;
                  }
                })
              }
            }
          })
        }
      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}
const hideGridGroupColumn = (xPath) =>{
  let returnFlag=null;                                           /*return flag*/
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)         /*iterating screendata*/
      {
        for(var j=0;j<holdNamessjson.screendata[i].formData.length;j++)
        {
          var kkrr=Object.keys(holdNamessjson.screendata[i].formData[j]);/*getting all the fieldPath in formdata..*/
          kkrr.map((item,z)=> // NOSONAR: javascript:S2201
          {
            var getObjFiltr=holdNamessjson.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];/*searching for fieldPath..*/
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")    /* checking for table..*/
              {
                holdNamessjson.screendata[i].formData[j][item].data.Columns.map((colItmmm,indxColItmmm)=>{// NOSONAR: javascript:S2201
					if(colItmmm.children != undefined){
						colItmmm.children.map((col,indxCol)=>{// NOSONAR: javascript:S2201
							Log4r.log("col.xPath",col.xPath);
							Log4r.log("xPath",xPath)
							if(col.xPath === xPath ) {
							colItmmm['hideGroup']=true;
							returnFlag=true;
							}
						})
					}
                })
              }
            }
          })
        }
      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}
const showGridGroupColumn = (xPath) =>{
  let returnFlag=null;                                           /*return flag*/
  if(xPath !== undefined && holdNamessjson !== undefined)
  {
    let fpath = xpathMapDir.get(xPath);
    for(var i=0;i<holdNamessjson.screendata.length;i++)         /*iterating screendata*/
      {
        for(var j=0;j<holdNamessjson.screendata[i].formData.length;j++)
        {
          var kkrr=Object.keys(holdNamessjson.screendata[i].formData[j]);/*getting all the fieldPath in formdata..*/
          kkrr.map((item,z)=>// NOSONAR: javascript:S2201
          {
            var getObjFiltr=holdNamessjson.screendata[i].uiSchema[0].children.filter(val => val.children.fieldPath === item)[0];/*searching for fieldPath..*/
            if (getObjFiltr)
            {
              if (getObjFiltr.children.widget === "table")    /* checking for table..*/
              {
                holdNamessjson.screendata[i].formData[j][item].data.Columns.map((colItmmm,indxColItmmm)=>{// NOSONAR: javascript:S2201
					if(colItmmm.children != undefined){
						colItmmm.children.map((col,indxCol)=>{    // NOSONAR: javascript:S2201
							Log4r.log("col.xPath",col.xPath);
							Log4r.log("xPath",xPath)
							if(col.xPath === xPath ) {
							colItmmm['hideGroup']=false;
							returnFlag=true;
							}
						})
					}
                })
              }
            }
          })
        }
      }
  }
  else
  {
    returnFlag=false;
  }
  return returnFlag;
}

const getSelectedRowsCountAgainstXpath=(xpathGrid) =>{
  if (holdNamessjson){
		if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof []){
		 let fpath,secIndex;
		 for (let i = 0; i < holdNamessjson.screendata.length; i++){
		   let obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];  /*searching for fieldPath against xpath..*/
		   if (obj){
			 fpath = obj.children.fieldPath;
			 secIndex=i;
			 break;
		   }
		 }
		 if (fpath == undefined){
		   return null;
		 }
		 let countOfSelectedRows = null;
		 let selectedRowKeys = null;
		 if(holdNamessjson.screendata[secIndex].formData[0][fpath].data.hasOwnProperty('selectedRowKeys')){
		   countOfSelectedRows = holdNamessjson.screendata[secIndex].formData[0][fpath].data.selectedRowKeys.length;
		   selectedRowKeys = holdNamessjson.screendata[secIndex].formData[0][fpath].data.selectedRowKeys;
		 }else {
		   countOfSelectedRows = 0;
		 }

		 let selectedRows = [];
		 let selectedRowsObject = {};
		 selectedRowsObject['count'] = countOfSelectedRows;
		 if(selectedRowKeys !== null){
		   for (let i = 0; i < selectedRowKeys.length; i++) {
			 for (let j = 0; j < holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource.length; j++) {
			   if(holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource[j].key === selectedRowKeys[i]){
				 selectedRows.push(holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource[j])
				 break;
			   }
			 }
		   }
		 }

		 selectedRowsObject['selectedRows'] = selectedRows;
		 return selectedRowsObject;
	   }
    else{
      return null;
    }
  }
  else{
    return null;
  }
}

const setValueOfPopSearch = (xpath,commValue,description,isPopSearchInsertAllow) =>       /*used to set value against xpath for popsearch*/
{
  var arr = [ description];
  Log4r.log("Arr " , arr);
  var flagBool=false;
  if (xpathMapDir)
  {
    var fpath=xpathMapDir.get(xpath);
    Log4r.log('adss',fpath);
    if (fpath)
    {
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        var loc1= xpath.indexOf("[");
        var loc2= xpath.indexOf("]");
        var val= xpath.substring(loc1+1,loc2);
        var valNum = parseInt(val);                           /*got the row index..*/
        var xpathGrid=xpath.substring(0,xpath.lastIndexOf("."));
        var gotObj;
        let secIndex;
        if (holdNamessjson.screendata && Array.isArray(holdNamessjson.screendata))
        {
          var fPathGrid,secIndex;
          for (var i = 0; i < holdNamessjson.screendata.length; i++)            /* iterating for all sections..*/
          {
            var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];
            Log4r.log("obj",obj);
            if (obj)
            {
              fPathGrid = obj.children.fieldPath;         /* setting fieldPath..*/
              secIndex=i;                           /* keeping index of section..*/
              break;
            }
          }
          //Log4r.log(fpath,secIndex);
          if (fPathGrid == undefined)
          {
            Log4r.error("grid not found for gridXpath:",xpathGrid);
            return false;
          }
          Log4r.log(fPathGrid,"..sd",holdNamessjson.screendata[secIndex].formData[0][fPathGrid].data.Columns);
          Log4r.log("fpath",fpath);
          var colObj = holdNamessjson.screendata[secIndex].formData[0][fPathGrid].data.Columns.filter((colItm)=>{
            if (colItm.children !=undefined) {
              Log4r.log("child.....",colItm.children.dataIndex);
              return colItm.children.dataIndex==fpath;
            }
            else {
              Log4r.log("inssdd..",colItm.dataIndex);
              return colItm.dataIndex==fpath;
            }
          })[0];/* getting dataIndex of column for provided column xpath..*/
          if (colObj)
          {
            (colObj.children!=undefined) ? colObj=colObj.children : null ;
            if (holdNamessjson.screendata[secIndex].formData[0][fPathGrid].data.DataSource != null && holdNamessjson.screendata[secIndex].formData[0][fPathGrid].data.DataSource != undefined)/* checkng dataSource is available..*/
            {
              if (Array.isArray(holdNamessjson.screendata[secIndex].formData[0][fPathGrid].data.DataSource))
              {
                let filterKey=(valNum+1)+"";

                let dSrc = holdNamessjson.screendata[secIndex].formData[0][fPathGrid].data.DataSource;
                for (let j = 0; j < dSrc.length; j++)
                {
                  Log4r.log("safs...");
                  if (dSrc[j].key == filterKey) {
                    if (colObj.widget == "hidden") {
                      dSrc[j][colObj.dataIndex] = commValue;
                      return true;
                    }
                    else{
                      let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
                    Log4r.log("tmpDefaultValueManagerMap==>",tmpDefaultValueManagerMap);
                    if (tmpDefaultValueManagerMap == undefined)
                    {
                      tmpDefaultValueManagerMap = new Map();
                      GlobalHelper.globlevar['defaultValueManagerMap'] =tmpDefaultValueManagerMap;
                    }
                    Log4r.log("sessionID=>",holdNamessjson.screendata[secIndex].sessionID);
                    let gId = holdNamessjson.screendata[secIndex].sessionID;
                    let arrCol = tmpDefaultValueManagerMap.get(gId+"."+colObj.dataIndex);
                    Log4r.log(gId+"."+colObj.dataIndex,"....gId+colObj.dataIndex.....",arrCol);
                    let newObjrule = {};
                    newObjrule['onChangeTrigger'] = true;
                    newObjrule['defaultVal'] = commValue;
                    if (isPopSearchInsertAllow) {
                      newObjrule['popsearchInsertAllow'] = true;
                    }
                    if (arrCol!=undefined && Array.isArray(arrCol)) {
                      if (arrCol.length<j) {
                        for (let i = arrCol.length; i < j; i++)
                        {
                          arrCol[i]={};
                        }
                      }
                      arrCol[j] = newObjrule;
                      Log4r.log("arrCol===",arrCol);
                    }
                    else {
                      arrCol = [];
                      for (let i = arrCol.length; i < j; i++)
                      {
                        arrCol[i]={};
                      }
                      arrCol[j] = newObjrule;
                    }
                    tmpDefaultValueManagerMap.set(gId+"."+colObj.dataIndex,arrCol);
                    return true;
                    }
                  }
                }
              }else {
                Log4r.error("DataSource is not an array..");
                return false;
              }
            }
            else {
              Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
              return null;
            }
          }
          else {
            Log4r.error("Column not found for ColumnXpath:");
            return null;
          }
        }
        else {
          Log4r.error("screendata not found or not an array..");
          return false;
        }
      }
      else
      {                        /*ITS FIELD */
        try{
  				for (var i = 0; i < holdNamessjson.screendata.length; i++)
  				{
  				  if (holdNamessjson.screendata[i].formData[0][fpath] != null && holdNamessjson.screendata[i].formData[0][fpath] != undefined )//&& holdNamessjson.screendata[i].formData[0][fpath] != ""
  				  {
              let res = holdNamessjson.screendata[i].uiSchema[0].children.filter(itm=>itm.children.fieldPath == fpath)[0];
              if (res) {
                if (res.children.edit === "false" || holdNamessjson.screendata[i].schema[0][fpath]['fieldConditionallyEditableFlag'] == false || holdNamessjson.screendata[i].schema[0][fpath]['fieldConditionallyEditableFlag'] == undefined){
                  holdNamessjson.screendata[i].formData[0][fpath].data = commValue;
                  holdNamessjson.screendata[i].formData[0][fpath]["desc"] = arr;
                }
                else {
                  let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
                  if (tmpDefaultValueManagerMap == undefined)
                  {
                    tmpDefaultValueManagerMap = new Map();
                    GlobalHelper.globlevar['defaultValueManagerMap'] = tmpDefaultValueManagerMap;
                  }
                  let gId = holdNamessjson.screendata[i].sessionID;
                  Log4r.log(gId+"."+fpath,"....gId+fpath.....");
                  let newObjrule = {};
                  if (isPopSearchInsertAllow) {
                    newObjrule['popsearchInsertAllow'] = true;
                  }
                  newObjrule['onChangeTrigger'] = true;
                  newObjrule['defaultVal'] = commValue;
                  tmpDefaultValueManagerMap.set(gId+"."+fpath,newObjrule);
                  Log4r.log("asdcsss..",tmpDefaultValueManagerMap);
                  flagBool = true;
                  break;
                }
              }
  				  }
  				}
  			}
  			catch(e){Log4r.error(e);}
      }
      return flagBool;
    }
    else {
      Log4r.log("fpath not available.....//");
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        let loc1= xpath.indexOf("[");
        let loc2= xpath.indexOf("]");
        let val= xpath.substring(loc1+1,loc2);
        let valNum = parseInt(val);                           /*got the row index..*/
        let gridXpth=xpath.substring(0,xpath.lastIndexOf("."));
        let gotObj;
        for (let i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
        {
          gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpth)[0];
          if (gotObj)
          {
            Log4r.log(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]);
            if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]) {
              holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.map((colItm, colInx)=>{    // NOSONAR: javascript:S2201
                if(colItm !== undefined){
                  if (colItm.children) {
                    colItm.children.map((childItm, childInx)=>{    // NOSONAR: javascript:S2201
                      //rowObj[childItm.dataIndex] = "";
                      xpathMapDir.set(childItm.xPath+"["+val+"]",childItm.dataIndex);/*assigning dataIndex against xPath in Map*/
                    })
                  }
                  else {
                    xpathMapDir.set(colItm.xPath+"["+val+"]",colItm.dataIndex);/*assigning dataIndex against xPath in Map*/
                    //rowObj[colItm.dataIndex] = "";
                  }
                }
              })
              fpath =xpathMapDir.get(xpath);
              if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
              {/*checked data is available for fieldPath in formData..*/
                let colObjTmp = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.filter((colItm)=>{
                  if (colItm.children !=undefined) {
                    return colItm.children.dataIndex==fpath;
                  }
                  else {
                    return colItm.dataIndex==fpath;
                  }
                })[0];
                let tempWidget;
                if (colObjTmp) {
                  (colObjTmp.children!=undefined) ? tempWidget=colObjTmp.children.widget : tempWidget=colObjTmp.widget;
                }
                if(fpath !== undefined){
                  if (tempWidget == "hidden"){
                      holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum][fpath] = commValue;
                    }
                  else {
                      let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'];
                      Log4r.log("tmpDefaultValueManagerMap==>",tmpDefaultValueManagerMap);
                      if (tmpDefaultValueManagerMap == undefined)
                      {
                        tmpDefaultValueManagerMap = new Map();
                        GlobalHelper.globlevar['defaultValueManagerMap'] = tmpDefaultValueManagerMap;
                      }
                      Log4r.log("sessionID=>",holdNamessjson.screendata[i].sessionID);
                      let gId = holdNamessjson.screendata[i].sessionID;
                      let arrCol = tmpDefaultValueManagerMap.get(gId+"."+fpath);
                      Log4r.log(gId+"."+fpath,"....gId+fpath.....",arrCol);
                      let newObjrule = {};
                      newObjrule['onChangeTrigger'] = true;
                      newObjrule['defaultVal'] = commValue;
                      if (isPopSearchInsertAllow) {
                        newObjrule['popsearchInsertAllow'] = true;
                      }
                      if (arrCol!=undefined && Array.isArray(arrCol)) {
                        if (arrCol.length<valNum) {
                          for (let i = arrCol.length; i < valNum; i++)
                          {
                            arrCol[i]={};
                          }
                        }
                        arrCol[valNum] = newObjrule;
                        Log4r.log("arrCol===",arrCol);
                      }
                      else {
                        arrCol = [];
                        for (let i = arrCol.length; i < valNum; i++)
                        {
                          arrCol[i]={};
                        }
                        arrCol[valNum] = newObjrule;
                      }
                      tmpDefaultValueManagerMap.set(gId+"."+fpath,arrCol);
                    }
                }

                holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]['valueSetByCustom'] = true;
                flagBool = true;
                break;
              }
              return true;
            }
            else {
              Log4r.error("***fpath not Found in Map..");
              return false;
            }
          }
        }
      }
      else {
        Log4r.error("***fpath not Found in Map..");
        return false;
      }
    }
  }else
  {
    Log4r.error("Map not Found");
    return false;
  }
}

const setDatasourceOfPopSearch = (xpath,dataSrc) =>
{
  var flagBool=false;
  if (xpathMapDir)
  {
    let fpath=xpathMapDir.get(xpath);
    if (fpath)
    {
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        var loc1= xpath.indexOf("[");
        var loc2= xpath.indexOf("]");
        var val= xpath.substring(loc1+1,loc2);
        var valNum = parseInt(val);                           /*got the row index..*/
        var gridXpth=xpath.substring(0,xpath.lastIndexOf("."));
        var gotObj;
        for (var i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
        {
          gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpth)[0];
          if (gotObj)
          {
            GlobalHelper.globlevar['setValInGridRender'].push(gotObj.children.fieldPath);
            if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
            {                       /*checked data is available for fieldPath in formData..*/
              holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum][fpath+"customeDataSource"] = dataSrc;
              holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]['valueSetByCustom'] = true;
              // if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]['valueSetByCustom'] !== true)
              // {
              // }
              flagBool = true;
              break;
            }
          }
        }
      }
      else {
        try{
  				for (var i = 0; i < holdNamessjson.screendata.length; i++)
  				{
  				  if (holdNamessjson.screendata[i].formData[0][fpath] != null && holdNamessjson.screendata[i].formData[0][fpath] != undefined )//&& holdNamessjson.screendata[i].formData[0][fpath] != ""
  				  {
  					holdNamessjson.screendata[i].formData[0][fpath]['customeDataSource']=dataSrc;     /*assigning value..*/
  					flagBool = true;
  					break;
  				  }
  				}
  			}
  			catch(e){Log4r.error(e);}
      }
    }
    else {
      Log4r.log("fpath not available.....//");
      if (xpath.indexOf("[") != -1 && xpath.indexOf("]") != -1 )      /*checking the pattern for tables xpath....*/
      {
        //ITS TABLE..
        let loc1= xpath.indexOf("[");
        let loc2= xpath.indexOf("]");
        let val= xpath.substring(loc1+1,loc2);
        let valNum = parseInt(val);                           /*got the row index..*/
        let gridXpth=xpath.substring(0,xpath.lastIndexOf("."));
        let gotObj;
        for (let i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
        {
          gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === gridXpth)[0];
          if (gotObj)
          {
            Log4r.log(holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]);
            if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]) {
              holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.map((colItm, colInx)=>{    // NOSONAR: javascript:S2201
                if (colItm.children) {
                  colItm.children.map((childItm, childInx)=>{    // NOSONAR: javascript:S2201
                    //rowObj[childItm.dataIndex] = "";
                    xpathMapDir.set(childItm.xPath+"["+val+"]",childItm.dataIndex);/*assigning dataIndex against xPath in Map*/
                  })
                }
                else {
                  xpathMapDir.set(colItm.xPath+"["+val+"]",colItm.dataIndex);/*assigning dataIndex against xPath in Map*/
                  //rowObj[colItm.dataIndex] = "";
                }
              })
              fpath =xpathMapDir.get(xpath);
              GlobalHelper.globlevar['setValInGridRender'].push(gotObj.children.fieldPath);
              if (holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != null && holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != undefined )//&& holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath] != ""
              {                       /*checked data is available for fieldPath in formData..*/
                holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum][fpath+"customeDataSource"] = dataSrc;
                holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource[valNum]['valueSetByCustom'] = true;
                flagBool = true;
                break;
              }
              return true;
            }
            else {
              Log4r.error("***fpath not Found in Map..");
              return false;
            }
          }
        }
      }
      else {
        Log4r.error("***fpath not Found in Map..");
        return false;
      }
    }
  }
}
const getHtmlStringForTextEditor = (url ,id ) =>
{
  Log4r.log("getHtmlStringForTextEditor in xPathDataStore");
  var portfolio    = GlobalHelper.selectedRowData.PRTFLCD;
  var legeacyAgrNo = GlobalHelper.selectedRowData.LGCYGRMNTN;
  var reportName = "R_BulkStatCard";
  if(portfolio == 'A'){
    reportName = "R_AssetBulkStatCard";
  }
  Log4r.log("reportName:=",reportName);
  var wsobject = new WSObject();
  wsobject.setParameter(reportName, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC','ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'N', 'flt1', '', 'Approved List', 'N', '', 'N', 'N', 'N','R','L');
  wsobject.setFltXml('<filter type="AND"></filter>');
  Log4r.log("ajhgaj.....",);
  return wsobject.getHtmlStringForTextEditor();
}
const applyCssClassToGridCell = (xpathGrid,xpathCol,cssClass,index) =>
{
  if (holdNamessjson && cssClass !==undefined && cssClass!=="" && cssClass!==null)
  {
    if (holdNamessjson.screendata != undefined && Array.isArray(holdNamessjson.screendata))
    {
      let setFlag = false;
      for (let i = 0; i < holdNamessjson.screendata.length; i++)          /* iterating for all sections..*/
      {
        let obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];
        if (obj != undefined && holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource[index] != undefined)
        {
          let resCol = holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.Columns.filter(item => item.xPath === xpathCol)[0];
          if (resCol)
          {
            if (holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource[index][resCol.dataIndex+"customeCssClass"] != undefined) {
              holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource[index][resCol.dataIndex+"customeCssClass"] = holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource[index][resCol.dataIndex+"customeCssClass"]+ " " + cssClass;
              setFlag = true;
              break;
            }
            else {
              holdNamessjson.screendata[i].formData[0][obj.children.fieldPath].data.DataSource[index][resCol.dataIndex+"customeCssClass"] = cssClass;
              setFlag = true;
              break;
            }
            Log4r.log("alfkj....holdNamessjson",holdNamessjson);
          }
        }
      }
      return setFlag;
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}
const addGenericSuccessMessage = (msg) =>
{
  ErrorHandler.addGenericSuccessMessage(msg);
}
const applyCssClassToField = (xpathField,cssClass) =>
{
  Log4r.log("qsfkju....",xpathField,cssClass);
  if (holdNamessjson && cssClass !==undefined && cssClass!=="" && cssClass!==null)
  {
    if (holdNamessjson.screendata != undefined && Array.isArray(holdNamessjson.screendata))
    {
      let setFlag = false;
      for (const element of holdNamessjson.screendata)          /* iterating for all sections..*/
      {
        let obj = element.uiSchema[0].children.filter(item => item.children.xPath === xpathField )[0];
        if (obj != undefined)
        {
          if (obj.children['customeCssClass'] != undefined) {
            obj.children['customeCssClass'] = obj.children['customeCssClass'] +" "+cssClass;
            setFlag = true;
          }
          else {
            obj.children['customeCssClass'] = cssClass;
            setFlag = true;
          }
        }
      }
      return setFlag;
    }
    else {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  }
  else
  {
    return false;
  }
  //Log4r.log("holdNamessjson",holdNamessjson);
}

const getIndexOfChangedEditableRow = () =>
{
  return GlobalHelper.globlevar.keyOfCurruntchangedField;
}


/*const addRowtoGrid_Ritesh = (propsValue) =>
{
  Log4r.log("holdNamessjson " , propsValue['sessionID'], holdNamessjson , propsValue  );
  Log4r.log("GlobalHelper.globlevar.keyOfCurruntchangedField " , GlobalHelper.globlevar.keyOfCurruntchangedField);
  Log4r.log("gridFieldsXPath ", gridFieldsXPath);

  Log4r.log("Details section Ids map => ",GlobalHelper.globlevar['parentAndChildMapkey']);
  Log4r.log("Details section Ids map => ",(GlobalHelper.globlevar['parentAndChildMapkey']).keys());
  var parentIdOFdetailsSection = undefined;

  parentIdOFdetailsSection = (GlobalHelper.globlevar['parentAndChildMapkey']).get(propsValue['sessionID']);

  //addEmptyRowInGrid("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST");
  //setValue("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST.ASSTSQN[0]","500");
  //setValue("DESIGNER_COLAGRMNT.DESIGNER_CASE.DESIGNER_COLAST.DSC[2]","ABC");
  //setValue('abc[ "+1+"]',"ABC");
  Log4r.log("parentIdOFdetailsSection Ids => ",parentIdOFdetailsSection);
  Log4r.log("holdNamessjson['addtoGridJsons'] => ",holdNamessjson['addtoGridJsons']);
  Log4r.log("section to be add to Grid  => ",(holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection]);

  addEmptyRowInGrid(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection));
  Log4r.log("Length " ,  holdNamessjson[parentIdOFdetailsSection +"_lenght"]);

  //var querystringdepend = getQuerystring(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection));

  let myQueryString = "";
 for (let x = 0; x < (holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection].length; x++) {

   for (let y = 0; y < requiredSection.formData.length; y++) {

     let keyArray = Object.keys(requiredSection.formData[y]);

       keyArray.map((item,index)=>{

         let widget = (requiredSection.uiSchema[0].children.filter(val => val.children.fieldPath === item)[0]).children.widget;

         let data = requiredSection.formData[y][item].data;

         if(widget !== "table"){
            let xPath = (requiredSection.uiSchema[0].children.filter(val => val.children.fieldPath === item)[0]).children.xPath;
            setValue(xPath + "["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , data);
            myQueryString = myQueryString + xPath + "=" + data +"&";
           //myQueryString = myQueryString + xPath + "["+m+"]=" + data +"&";
          }
           // if(widget == "table"){
           //
           //     if(data.DataSource.length !== 0){
           //       for (let m = 0; m < data.DataSource.length; m++) {
           //         let keyTableArray = Object.keys(data.DataSource[m]);
           //
           //             keyTableArray.map((titem,iindex)=>{
           //
           //                 let columnObject = data.Columns.filter(item => item.dataIndex == titem)[0];
           //                 let columnXpath = "";
           //                 if(columnObject){
           //                   columnXpath = columnObject.xPath;
           //                 }
           //                 Log4r.log("COLUMN XPATH",columnXpath);
           //                 let rowData =  data.DataSource[m][titem];
           //                 Log4r.log("COLUMN DATA",rowData,m);
           //                 if(columnXpath !== undefined && columnXpath.length !== 0){
           //                   myQueryString = myQueryString + columnXpath + "["+m+"]=" + rowData +"&";
           //                 }
           //             });
           //         }
           //     }
           // }
       });

   }

 }

 Log4r.log("MYQUERYSTRING",myQueryString);


  var querystringdepend = "abc=xyz&pqr=xyz123";
  setValue("DESIGNER_COLAGRMNT.DESIGNER_ADDRESS_DTLS.NM["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , "xyz" );
  setValue("DESIGNER_COLAGRMNT.DESIGNER_ADDRESS_DTLS.SZDESC["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , "xyzDESC" );

  setValue(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection)+".addThroughSummGridjson["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]", JSON.stringify((holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection]));
  setValue(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection)+".addThroughSummGridmap["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 ) +"]",myQueryString);
  alert("System define section level button" );
  return null;
}*/
const addRowtoGrid = (propsValue,buttonId,parentSectionId) =>
{
  try {
  let currencyGroupingSymbol = GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL;
  let xpathArrayWithSectionIds = [];
  let gridXpathTobeReplace = null;
  let matchingGridXpath = null;
  Log4r.log("hgsadjhgsg..........",propsValue,buttonId,parentSectionId);
    //var genericCount = ErrorHandler.getGenericErrCount();
    let modelObj = new Model();
    Log4r.log("parentSectionId",parentSectionId);
    let ressecs = propsValue.namess.screendata.filter(itmjsn => itmjsn.sessionID == parentSectionId)[0];
    let detailSecId;
    if (ressecs != undefined) {
      Log4r.log("table data==",ressecs.formData[0][parentSectionId].data);
      detailSecId = ressecs.formData[0][parentSectionId].data.detailsectionid;
    }
    let allchildId = modelObj.getLeafNodesForId(detailSecId);
    Log4r.log("allchildId==",allchildId);
    let errCount = 0;
    if (allchildId == undefined)
    {
      errCount = ErrorHandler.getErrCountBySecId(propsValue.sectionId);
    }
    else {
      let arrkeys = Object.keys(allchildId);
      Log4r.log("arrkeys===>",arrkeys);
      for (let i = 0; i < arrkeys.length; i++) {
        errCount = errCount + ErrorHandler.getErrCountBySecId(arrkeys[i]);
      }
    }
    if(errCount==0)
    {
      holdNamessjson = propsValue.namess;
      Log4r.log("holdNamessjson " , propsValue['sessionID'], holdNamessjson , propsValue  );
      Log4r.log("GlobalHelper.globlevar.keyOfCurruntchangedField " , GlobalHelper.globlevar.keyOfCurruntchangedField);
      Log4r.log("gridFieldsXPath ", gridFieldsXPath);

      Log4r.log("Details section Ids map => ",GlobalHelper.globlevar['parentAndChildMapkey']);
      Log4r.log("Details section Ids map => ",(GlobalHelper.globlevar['parentAndChildMapkey']).keys());

      var parentIdOFdetailsSection = undefined;
      //parentIdOFdetailsSection = (GlobalHelper.globlevar['parentAndChildMapkey']).get(propsValue['sessionID']);
      parentIdOFdetailsSection = propsValue.sectionButton.buttons.filter((item,index)=>{
        if(item.id === buttonId){
          return true;
        }
      })[0].parentSectionId;

      Log4r.log("parentIdOFdetailsSection Ids => ",parentIdOFdetailsSection);
      Log4r.log("holdNamessjson['addtoGridJsons'] => ",holdNamessjson['addtoGridJsons']);
      Log4r.log("section to be add to Grid  => ",(holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection]);

      try{

          if(GlobalHelper.globlevar['multiLevelAddtoGridLinks'].get(parentIdOFdetailsSection) != null){
            GlobalHelper.globlevar['tableLinkRecord'] = GlobalHelper.globlevar['multiLevelAddtoGridLinks'].get(parentIdOFdetailsSection) ;
            GlobalHelper.globlevar['multiLevelAddtoGridLinks'].delete(parentIdOFdetailsSection) ;
          }

          if(holdNamessjson['addtoGridJsons'] != null) {
              for (let i = 0; i < Object.keys(holdNamessjson['addtoGridJsons']).length; i++) {
                Log4r.log("Key of object ? ",Object.keys(holdNamessjson['addtoGridJsons'])[i]);
                let sectionId = Object.keys(holdNamessjson['addtoGridJsons'])[i];
                if(sectionId != null) {
                  let parentSection = holdNamessjson.screendata.filter(item => item.sessionID === sectionId)[0];
                  let uischemaObject = parentSection.uiSchema[0].children.filter(item => item.children.fieldPath === sectionId)[0];
                  let xPath = null
                  if(uischemaObject != null) {
                    xPath = uischemaObject.children.xPath;
                    let arrayExistance = null;
                    arrayExistance = xpathArrayWithSectionIds.filter(item => item.sessionId === sectionId)[0];
                    if(arrayExistance === undefined){
                      let anObject = {};
                      anObject['sectionId'] = sectionId;
                      anObject['xPath'] = xPath;
                      xpathArrayWithSectionIds.push(anObject);
                    }
                  }
                }
              }
              Log4r.log("xpathArrayWithSectionIds",xpathArrayWithSectionIds);
              Log4r.log("GlobalHelper.globlevar['multiLevelAddtoGridLinks']",GlobalHelper.globlevar['multiLevelAddtoGridLinks']);

          }

          if(buttonId === "addRowtoGrid" )
          {
              GlobalHelper.globlevar['tableLinkRecord'] = undefined;
              GlobalHelper.globlevar.addrow = "true";
              addEmptyRowInGrid(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection),undefined,true);
          } else {
              GlobalHelper.globlevar['tableLinkRecord']["mode"] = "U";
              let parentSectionObject = holdNamessjson.screendata.filter(item => item.sessionID === parentIdOFdetailsSection)[0];
              let dataSourceObject = parentSectionObject.formData[0][parentIdOFdetailsSection].data.DataSource.filter(item => item.key === GlobalHelper.globlevar['tableLinkRecord'].key)[0];
              dataSourceObject['mode'] = "U"
              holdNamessjson[parentIdOFdetailsSection +"_lenght"] = GlobalHelper.globlevar['tableLinkRecord'].key;
            }

          }
      catch(e) {
        Log4r.error("Error")
      }

      Log4r.log("Length " ,  holdNamessjson[parentIdOFdetailsSection +"_lenght"]);
	    GlobalHelper.globlevar.setValInGridRender.push(parentIdOFdetailsSection);

      let myQueryString = "";
      var leafSectionIdsOfParent;
      let sectionForOperation= new Array();

      //Log4r.log("ksjdclksjldjsalkd.......",parentIdOFdetailsSection);
      //Log4r.log("hsgfgsjhfhgks.........",holdNamessjson);
      //Log4r.log("gajhajhdgasd...........",(holdNamessjson['screendata']));
      //Log4r.log("kjahgsdkjsahdkahd......",(holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection]);
      //Log4r.log("gdsjhgsajdhskjhd.......",(holdNamessjson['addtoGridJsons'])[propsValue.sessionID]);
      if((holdNamessjson['addtoGridJsons']) != null && (holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection] != null){
        //Log4r.log("kjhskjdhakhs.......1hereif");
        for (let x = 0; x < (holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection].length; x++) {
            let requiredSection = holdNamessjson.screendata.filter(item => item.sessionID === (holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection][x]['sessionID'])[0];
            if(requiredSection != null && requiredSection['sectionConditionallyHiddenFlag'] != true) {
              for (let y = 0; y < requiredSection.formData.length; y++) {
                 //Log4r.log("kjhskjdhakhs.......3rd here");
                 let keyArray = Object.keys(requiredSection.formData[y]);

                   keyArray.map((item,index)=>{    // NOSONAR: javascript:S2201
                     let widget = null;
                     let datatype = null;
                     if((holdNamessjson['addtoGridJsons']) != null && (holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection] != null){
                       //Log4r.log("gdsuhsagdhgsd..........",requiredSection);
                       //Log4r.log("akjshdikjahd........",item);
                       if(requiredSection.uiSchema != null){
                         widget = (requiredSection.uiSchema[0].children.filter(val => val.children.fieldPath === item)[0]);
                         if(widget != null && widget.children != null){
                           Log4r.log("jlkjdlksajd......",widget);
                           if(widget.children.datatype){
                             datatype=widget.children.datatype;
                           }
                           widget=widget.children.widget;
                         }
                       }
                     }
                     let data = requiredSection.formData[y][item].data;
                     let popDesc = undefined;
                     Log4r.log("jlkjdlksajd......",widget,datatype);
                     if(widget == "currency" || datatype == "number")
                     {
                       data = data.toString().replace(new RegExp(currencyGroupingSymbol, 'g'), "");
                     }
                     if (widget == "popsearch") {
                       popDesc = requiredSection.formData[y][item].desc;
                     }
                     if(widget !== "table" && widget != "popsearch"){
                     //Log4r.log("table,..........",requiredSection);
                      let xPath = (requiredSection.uiSchema[0].children.filter(val => val.children.fieldPath === item)[0]);
                      if(xPath != null && xPath.children != null){
                        xPath=xPath.children.xPath;
                      }
                      if(requiredSection.schema[0][item]['fieldConditionallyHiddenFlag'] !== true){
                        if (widget === "select") {
                          //to set the value of select widget if it is in the form of array
                           setValue(xPath + "["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , data.toString());
                        } 
                        else if (widget === "text" ) {
                          //to set the value of select widget if it is in the form of array
                           setValue(xPath +"["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , data.toString());
                        }
                        else{
                          setValue(xPath + "["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , data);
                        }
                        myQueryString = myQueryString + xPath + "=" + encodeURIComponent(data) +"&";
                       //myQueryString = myQueryString + xPath + "["+m+"]=" + data +"&";
                      }
                      // if(requiredSection.schema[0][item]['fieldConditionallyHiddenFlag'] !== true){
                      //   if (widget === "text" ) {
                      //     //to set the value of select widget if it is in the form of array
                      //      setValue(xPath +"["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , data.toString());
                      //   }
                      //   myQueryString = myQueryString + xPath + "=" + data +"&";
                      //  //myQueryString = myQueryString + xPath + "["+m+"]=" + data +"&";
                      // }
                    }
                     else if (widget !== "table" && widget == "popsearch") {
                     let xPath = (requiredSection.uiSchema[0].children.filter(val => val.children.fieldPath === item)[0]);
                     if(xPath != null && xPath.children != null){
                       xPath=xPath.children.xPath;
                     }
                     let xpathGrid = xPath.substring(0,xPath.lastIndexOf("."));
                     let xpathCol = xPath;
                     let code = data;
                     let description = popDesc;
                     let rowKey = parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"]);
                     if(requiredSection.schema[0][item]['fieldConditionallyHiddenFlag'] !== true){
                       setPopsearchValueInGridCell(xpathGrid,xpathCol,code , description, rowKey);
                       myQueryString = myQueryString + xPath + "=" + data +"&";
                     }
                   }
                     if(widget == "table"){
                     let xPath = (requiredSection.uiSchema[0].children.filter(val => val.children.fieldPath === item)[0]);
                     if(xPath != null && xPath.children != null){
                        xPath=xPath.children.xPath;
                      }
                      let currentTableXpath = xPath;
                      Log4r.log("FIRST TIME GRID XPATH FOUND !",currentTableXpath);
                       if(data.DataSource.length !== 0){
                         let modifiedDataSourceRows = [];
                         for (let m = 0; m < data.DataSource.length; m++) {
                               if(data.DataSource[m]["mode"] != null) {
                                 modifiedDataSourceRows.push(data.DataSource[m]);
                               }
                           }

                           if(modifiedDataSourceRows.length !== 0 ) {
                               for (var w = 0; w < modifiedDataSourceRows.length; w++) {
                                 let keyTableArray = Object.keys(modifiedDataSourceRows[w]);
                                 keyTableArray.map((itemj,iindex)=>{    // NOSONAR: javascript:S2201

                                     let columnObject = data.Columns.filter(item => item.dataIndex == itemj)[0];
                                     let columnXpath = "";
                                     if(columnObject) {
                                       columnXpath = columnObject.xPath;
                                     }
                                     Log4r.log("COLUMN XPATH",columnXpath);
                                     let rowData =  modifiedDataSourceRows[w][itemj];
                                     Log4r.log("COLUMN DATA",rowData,w);
                                     if(columnXpath !== undefined && columnXpath.length !== 0 && columnObject.dataIndex !== "addThroughSummGridjson"){

                                     if(columnObject.dataIndex === "addThroughSummGridmap"){
                                         myQueryString = myQueryString + "&" + rowData +"&";
                                       } else {
                                         let lastindOfDot = columnXpath.lastIndexOf(".");
                                         let first = columnXpath.substring(0, lastindOfDot);
                                         let second = columnXpath.substring(1, lastindOfDot);
                                         let newXpath = first + "[" + w + "]" + columnXpath.substring(lastindOfDot, columnXpath.length);
                                         Log4r.log("newXpath bosss == > ",newXpath);
                                         let modifiedData = makeChangesBeforeReturningValue(columnObject.widget, columnObject.datatype, rowData);
                                         myQueryString = myQueryString + newXpath + "=" + modifiedData +"&";
                                       }

                                     }

                                     if(itemj === "mode") {
                                       if(modifiedDataSourceRows[w]["addedRowGridXpath"] != null){
                                         currentTableXpath = modifiedDataSourceRows[w]["addedRowGridXpath"];
                                       }
                                      let xpathToBeUse = currentTableXpath;

                                      if (data.nomode == "false") {
                                           myQueryString = myQueryString + xpathToBeUse + "[" + w + "]._" + itemj + "=" + (modifiedDataSourceRows[w][itemj] === undefined ? "" : modifiedDataSourceRows[w][itemj])  +"&";
                                         } else {
                                           if (modifiedDataSourceRows[w][itemj] === "D") {
                                              myQueryString = myQueryString + xpathToBeUse + "[" + w + "]._" + itemj + "=" + (modifiedDataSourceRows[w][itemj] === undefined ? "" : modifiedDataSourceRows[w][itemj]) +"&";
                                           }
                                         }
                                       }
                                   });
                               }
                             }
                       }
                   }
                   });
               }
             }
        }
      }else{
          //Log4r.log("kjhskjdhakhs.......1hereelsepart");
          let parentIDArr = Object.keys((holdNamessjson['addtoGridJsons']));
          let parentsDetailSectionID = (holdNamessjson['screendata'].filter((scrobj,lt)=>{
              if(scrobj.sessionID === parentIdOFdetailsSection){
                return true;
              }}))[0].formData[0][parentIdOFdetailsSection].data.detailsectionid;
          //Log4r.log("hfikshdf.....",parentsDetailSectionID,parentIdOFdetailsSection,new Model().getLeaf(parentIdOFdetailsSection));
          //Log4r.log("shgdjhshjsh......",GlobalHelper.globlevar['assortedMapOfParent']);
          //Log4r.log("sahgdiahskjd.......",GlobalHelper.globlevar['assortedMapOfLeaf']);
          leafSectionIdsOfParent = new Model().getLeaf(parentsDetailSectionID);
          //Log4r.log("jahsiuahkjdhsad......",leafSectionIdsOfParent);
          if(leafSectionIdsOfParent != null && leafSectionIdsOfParent.length != 0){
            //Log4r.log("sections to be clear.....",leafSectionIdsOfParent);
            for(let i=0;i<leafSectionIdsOfParent.length;i++){
              sectionForOperation.push(Object.keys(leafSectionIdsOfParent[i])[0]);
            }
            //Log4r.log("sectionsForOperation.......",sectionForOperation);
          }
          for (let x = 0; x < (holdNamessjson['screendata']).length; x++) {
            	//Log4r.log("kjhskjdhakhs.......2nd here",(holdNamessjson['screendata'])[x]);
              //Log4r.log("jhdkjaskjdsnhkjd...",sectionForOperation);
            for (let y = 0; y < (holdNamessjson['screendata'])[x].formData.length; y++) {
              //Log4r.log("kjhskjdhakhs.......3rd here");
              let keyArray = Object.keys((holdNamessjson['screendata'])[x].formData[y]);

                keyArray.map((item,index)=>{    // NOSONAR: javascript:S2201

                  let widget=null;
                  let datatype=null;
                  let xpathdPathChk=null;
                  let popSearchDataChk=null;
                  widget = ((holdNamessjson['screendata'])[x].uiSchema[0].children.filter((val,index)=>{
                    if(val.children.fieldPath === item){
                      if(val.children.widget === "popsearch"){
                        xpathdPathChk=val.children.xPath;
                      }
                      return true;
                    }
                  })[0]);
                  Log4r.log("jlkjdlksajd......",widget);
                  if(widget != null){
                    if(widget.children.datatype){
                      datatype=widget.children.datatype;
                    }
                    widget=widget.children.widget;
                  }
                  //Log4r.log("bgsdjhbgsad.....",widget);
                  Log4r.log("jlkjdlksajd......",widget,datatype);
                  let data = (holdNamessjson['screendata'])[x].formData[y][item].data;
                  if(widget == "currency" || datatype == "number")
                  {
                    data = data.toString().replace(new RegExp(currencyGroupingSymbol, 'g'), "");
                  }
                  //Log4r.log("sahkjdahsd....",data);
                  if(widget != null && xpathdPathChk != null){
                    if(widget === "popsearch"){
                      //Log4r.log("jshgdcishgdks........",widget,xpathdPathChk,data,holdNamessjson);
                      holdNamessjson.screendata.map((nmobj,litl)=>{    // NOSONAR: javascript:S2201
                        //Log4r.log("kjdhhd.......",nmobj,litl);
                        if(nmobj.sessionID === propsValue['sessionID']){
                          //Log4r.log("lkjhdjhs.......",nmobj,litl);
                          nmobj.uiSchema[0].children.map((wdgobj,tygh)=>{    // NOSONAR: javascript:S2201
                            //Log4r.log("kjdlkjskj......",wdgobj,tygh);
                            if(wdgobj.children.xPath === xpathdPathChk){
                              //Log4r.log("jhaudihsd.......",wdgobj,tygh);
                              let fpathstr = wdgobj.children.fieldPath+"desc";
                              popSearchDataChk = nmobj.formData[0][fpathstr];
                            }
                          })
                        }
                      })
                      //popSearchDataChk = data;
                      //Log4r.log("kdjhfksdhf......",parentsDetailSectionID,parentIdOFdetailsSection);
                      holdNamessjson['screendata'].map((item,index)=>{    // NOSONAR: javascript:S2201
                        //Log4r.log("hishfjhsfkj........");
                        if(item.sessionID === parentIdOFdetailsSection){
                          //Log4r.log("kjshidshd.......",item);
                          item.formData[0][parentIdOFdetailsSection].data.Columns.map((colsrcitem,indx)=>{    // NOSONAR: javascript:S2201
                            //Log4r.log("jhdkjhskdjh........",colsrcitem);
                            if(colsrcitem.xPath != null && colsrcitem.xPath === xpathdPathChk){
                              //Log4r.log("here is ..........",colsrcitem.dataIndex);
                              let popSearchXpathChk = colsrcitem.dataIndex+'desc';
                              item.formData[0][parentIdOFdetailsSection].data.DataSource.map((datasrcitem,index)=>{    // NOSONAR: javascript:S2201
                                  if(datasrcitem.mode != null && datasrcitem.mode==="I"){
                                    //Log4r.log("ajhdikjshkdhs.....",item);
                                    datasrcitem[popSearchXpathChk] = popSearchDataChk;
                                  }
                              })
                            }
                          })
                        }
                      })
                    }
                  }
                  //Log4r.log("jhdsdjslkjh.......",holdNamessjson);
                  if(widget !== "table" && (sectionForOperation.includes((holdNamessjson['screendata'])[x].sessionID) || (holdNamessjson['screendata'])[x].sessionID === propsValue['sessionID'])){
                    //Log4r.log("table,..........",(holdNamessjson['screendata'])[x]);
                     let xPath = null;
                     xPath = ((holdNamessjson['screendata'])[x].uiSchema[0].children.filter((val,index)=>{
                       if(val.children.fieldPath === item){
                         return true;
                       }
                     })[0])
                     //Log4r.log("sahgdhagsd.........",xPath);
                     if(xPath != null){
                       xPath=xPath.children.xPath;
                       setValue(xPath + "["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]" , data);
                       myQueryString = myQueryString + xPath + "=" + data +"&";
                     }
                    //myQueryString = myQueryString + xPath + "["+m+"]=" + data +"&";
                  }
              });
           }
          }
      }

      if(buttonId === "addRowtoGrid" ){
        try{
                //Log4r.log("",holdNamessjson, holdNamessjson['parentGridXpathAndsessionID'] , holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection) , parentIdOFdetailsSection);
                let parentSectionObject = holdNamessjson.screendata.filter(item=>item.sessionID === parentIdOFdetailsSection)[0];
                let parentFormData = undefined ;
                if(parentSectionObject !== undefined)
                {
                 // parentFormData = parentSectionObject.formData[0][parentSectionObject.sessionID].data.DataSource;
                 parentFormData = parentSectionObject.formData[0];
                }
                let index = (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 );
                let xPath = holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection);
                let utilObject = new onLoadUtil();
                let method = "addToGridEvent";
                utilObject[method](index, parentIdOFdetailsSection,xPath,parentFormData);
        }catch(e){Log4r.error(e)}
      } // END buttonId check

      Log4r.log("MYQUERYSTRING",myQueryString);

      propsValue.reRender();

      try {
        setValue(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection)+".addThroughSummGridjson["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 )+"]", JSON.stringify((holdNamessjson['addtoGridJsons'])[parentIdOFdetailsSection]));
        setValue(holdNamessjson['parentGridXpathAndsessionID'].get(parentIdOFdetailsSection)+".addThroughSummGridmap["+ (parseInt(holdNamessjson[parentIdOFdetailsSection +"_lenght"])-1 ) +"]",myQueryString);
      }
      catch(e) {
        Log4r.error("Error while setting values - ", e);
      } // ENDIF if(errCount==0)

      if(xpathArrayWithSectionIds.filter(item => item.sectionId === parentIdOFdetailsSection)[0] != null ) {
          let xpathOfGridForRecordClicked = xpathArrayWithSectionIds.filter(item => item.sectionId === parentIdOFdetailsSection)[0].xPath;
          Log4r.log("xpathOfGridForRecordClicked : ",xpathOfGridForRecordClicked);
          matchingGridXpath = xpathOfGridForRecordClicked;
          let currentTableSection = holdNamessjson.screendata.filter(item => item.sessionID === parentIdOFdetailsSection)[0];
          if(currentTableSection != null){
            let currentTableUiSchemaObject = currentTableSection.uiSchema[0].children.filter(item => item.children.xPath === xpathOfGridForRecordClicked )[0];
            if(currentTableUiSchemaObject != null) {
              if(currentTableSection.formData[0][parentIdOFdetailsSection].data != null){
                let currentTableDatasource = currentTableSection.formData[0][parentIdOFdetailsSection].data.DataSource;
                let modifiedModeDataSource = [];
                //Log4r.log("SO OPTIMUS DATASOURCE",currentTableDatasource);
                if(currentTableDatasource != null){
                  for (let x = 0; x < currentTableDatasource.length; x++) {
                    if(currentTableDatasource[x].mode != null) {
                      modifiedModeDataSource.push(currentTableDatasource[x]);
                    }
                  }
                }
                if(modifiedModeDataSource.length !==0) {
                  for (let t = 0; t < modifiedModeDataSource.length; t++) {
                    let queryStringValues = modifiedModeDataSource[t]['addThroughSummGridmap'].split("&");
                    for (let k = 0; k < queryStringValues.length; k++) {
                      if(queryStringValues[k].indexOf(matchingGridXpath) !== -1 ){
                         if(queryStringValues[k].substring(queryStringValues[k].length, matchingGridXpath.length)[0] !== "["){
                           queryStringValues[k] = matchingGridXpath + "[" + t + "]" + queryStringValues[k].substring(queryStringValues[k].length, matchingGridXpath.length);
                           //Log4r.log("OPTIMUS NEW QUERY STRING", queryStringValues[k]);
                         }
                      }
                    }
                    currentTableSection.formData[0][parentIdOFdetailsSection].data.DataSource[(modifiedModeDataSource[t].key-1)]['addThroughSummGridmap'] = queryStringValues.join("&");
                  }
                }
              }
            }
          }


          Log4r.log("So Final String == ", xpathOfGridForRecordClicked);
      }

    }

    // if(buttonId === "addRowtoGrid"){
    //      //Log4r.log("gsajhdgjsadg.........",buttonId,parentsectionjson);
    //      //Log4r.log("gdsasjdh........",propsValue.addRowtoGridSectionID);
    //       var parentsectionjson = propsValue.namess.screendata.filter(sesctionitem => sesctionitem.sessionID == propsValue.addRowtoGridSectionID )[0];
    //       //Log4r.log("parentsectionjson" , parentsectionjson.formData[0][propsValue.addRowtoGridSectionID].data.detailsectionid)
    //       let gridDetailsectionid = null;
    //       if(parentsectionjson != null && parentsectionjson.formData != null && propsValue.addRowtoGridSectionID != null && !parentsectionjson.hasOwnProperty('SectionalPopup')){
    //         if(parentsectionjson.formData[0] != null && parentsectionjson.formData[0][propsValue.addRowtoGridSectionID] != null)
    //         {
    //           gridDetailsectionid = parentsectionjson.formData[0][propsValue.addRowtoGridSectionID].data.detailsectionid;
    //           let resLeafNode = new Model().getLeafNodesForId(gridDetailsectionid);
    //           Log4r.log("weuirywq....resLeafNode=",resLeafNode);
    //           GlobalHelper.globlevar.clearButtonclick = "true";
    //           propsValue.onClick("ClickGridAddButton",resLeafNode , "addRowtoGrid")
    //         }
    //       }
    //     }

    else{
          //GlobalHelper.globlevar.clearButtonclick = "false";
          propsValue.reRender();
        }


  return null;
} catch(e) {
  Log4r.error("Error", e);
}
}

const setPopsearchValueInGridCell = (xpathGrid,xpathCol,code , description, rowKey) =>
{
  let arr = [ description];
  for (let i = 0; i < holdNamessjson.screendata.length; i++)        /* iterating for all sections..*/
  {
    let gotObj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath == xpathGrid)[0];
    if (gotObj)
    {
      let filterKey = "";
      if(isempty(rowKey)){
        filterKey = GlobalHelper.globlevar.keyOfCurruntchangedField;
      }
      else{
        filterKey = rowKey;
      }
      let gotRow = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.DataSource.filter(itmDsrc =>itmDsrc.key == filterKey)[0];
      if (gotRow) {
        let gotCol = holdNamessjson.screendata[i].formData[0][gotObj.children.fieldPath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
        if (gotCol) {
          gotRow[gotCol.dataIndex] = code;
          gotRow[gotCol.dataIndex+"desc"] = arr;
          gotRow['valueSetByCustom'] = true;
          break;
        }
      }
    }
  }
}

const getUploadParam = () =>
{
  documentUploadParam.clear();
  return documentUploadParam;
}

const setUploadParam = (documentUpload) =>
{
  documentUploadParam = documentUpload;
}


const setQueryParams = (queryParams) =>  {   //Set Query PArameters for Bulk File Upload Query String
    queryParameters = queryParams;
}

const getQueryParams = () =>   {
    return queryParameters;
}

const getParentPKComponentDataMap = () =>   {
    return GlobalHelper.globlevar['ParentPKComponentDataMap'];
}

const getBusinessDate = () =>{

	let dateToday = GlobalHelper.contextSetting.BUSSINESS_DATE;
	let newdate = new Date(dateToday);
	let momentDate = moment(newdate,GlobalHelper.contextSetting.DATE_FORMAT);
	let returnValue = momentDate.format((GlobalHelper.contextSetting.DATE_FORMAT).toUpperCase());
	return returnValue;
}

//Sprint 38 - Task 53-Custom API to set Layout SubFunction Name/ Sub Title.
const setFunctionTitle = (title) =>{
  if(title != null){
    //Log4r.log("bsakjaskjsa.........",title,holdNamessjson);
    if(title != null){
      holdNamessjson['formSubTitle'] = title;
    }
  }
}

const showQueryBuilderPopUp = (props,worklistId) =>{
    Log4r.log("props inside custom function.........",props);
    if(props != null && GlobalHelper.globlevar['queryBuilderInPopUp'] != true){
      GlobalHelper.globlevar['queryBuilderInPopUp'] = true;
      Modal.info({
        centered:true,
        width:'fit-content',
        style:{maxHeight:'500px',overflow:'unset',paddingBottom:'0px',top:'-136px',border:'1px outset #8cbcf1'},
        className:'QBPModal#1',
        content:(<IntlProvider locale="en">
          <QBP QBEntityId={worklistId} {...props}/>
        </IntlProvider>),
        okText:'CLOSE',
        onCancel(){
          Log4r.log("oncancle..........",props);
          GlobalHelper.globlevar['tableLinkRecord'] = null;
      		GlobalHelper.globlevar['linkpress'] = false;
      		GlobalHelper.globlevar['linkpressTemp'] = false;
          GlobalHelper.globlevar['queryBuilderInPopUp'] = false;
        }
       })
    }
     //to get filterXML and fetched data after searching query in popup Query Builder
     //GlobalHelper.globlevar['QBP_filterXML']
     //GlobalHelper.globlevar['QBP_fetchedData']
}

const getSectionData = (secXpath)=>{
  if (Array.isArray(holdNamessjson.screendata)) {
    let resSection = holdNamessjson.screendata.filter(itm => itm.sectionXPath == secXpath)[0];
    if (resSection) {
      return resSection;
    }
    else {
      return null;
    }
  }
}
const getGridDataSource = (gridXpath)=>{
  if (Array.isArray(holdNamessjson.screendata)) {
    let resSection = holdNamessjson.screendata.filter(itm => itm.sectionXPath == gridXpath)[0];
    if (resSection) {
      let foundTab = resSection.uiSchema[0].children.filter(widget => widget.children.widget == "table")[0];
      if (foundTab) {
        return [...resSection.formData[0][foundTab.children.fieldPath].data.DataSource];
      }
      else {
        Log4r.error("table not found for getGridColumnJson Custom api..");
        return null;
      }
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
}

const getGridColumnJson = (gridXpath)=>{
  if (Array.isArray(holdNamessjson.screendata)) {
    let resSection = holdNamessjson.screendata.filter(itm => itm.sectionXPath == gridXpath)[0];
    if (resSection) {
      let foundTab = resSection.uiSchema[0].children.filter(widget => widget.children.widget == "table")[0];
      if (foundTab) {
        return [...resSection.formData[0][foundTab.children.fieldPath].data.Columns];
      }
      else {
        Log4r.error("table not found for getGridColumnJson Custom api..");
        return null;
      }
    }
    else {
      return null;
    }
  }
  else {
    return null;
  }
}

  const makeGridColumnNonEditable = (gridXpath , colXpath) => {
    Log4r.log("jhasdkjashd...........",gridXpath , colXpath,holdNamessjson,this.props);
    if(gridXpath != null && colXpath != null){
      if(holdNamessjson != null){
        holdNamessjson.screendata.map((screenObj,index)=>{    // NOSONAR: javascript:S2201
          if(screenObj.sectionXPath === gridXpath){
            screenObj.uiSchema[0].children.map((item,indx)=>{    // NOSONAR: javascript:S2201
              if(item.children.widget === "table" && item.children.xPath === gridXpath){
                screenObj.formData[0][screenObj.sessionID].data.Columns.map((colitem,colindex)=>{    // NOSONAR: javascript:S2201
                  if(colitem.xPath === colXpath || colXpath.includes(colitem.xPath)){
                    Log4r.log("hkjshdkjsahdkj......",colitem);
                    colitem['widgetEditFlag'] = "false";
                  }
                })
              }
            })
          }
        })
      }
    }
  }

  const makeGridColumnEditable = (gridXpath , colXpath) => {
    Log4r.log("jhasdkjashd...........",gridXpath , colXpath,holdNamessjson,this.props);
    if(gridXpath != null && colXpath != null){
      if(holdNamessjson != null){
        holdNamessjson.screendata.map((screenObj,index)=>{    // NOSONAR: javascript:S2201
          if(screenObj.sectionXPath === gridXpath){
            screenObj.uiSchema[0].children.map((item,indx)=>{    // NOSONAR: javascript:S2201
              if(item.children.widget === "table" && item.children.xPath === gridXpath){
                screenObj.formData[0][screenObj.sessionID].data.Columns.map((colitem,colindex)=>{    // NOSONAR: javascript:S2201
                  if(colitem.xPath === colXpath || colXpath.includes(colitem.xPath)){
                    colitem['widgetEditFlag'] = "true";
                  }
                })
              }
            })
          }
        })
      }
    }
  }

  const refreshMainLayout = () =>{
    GlobalHelper.globlevar['MainLayoutObject'].refreshQB();
  }

  const redirectToFunction = (functionParameters, screenData, assignErrorObj, namesObject) =>       /*used to set value against xpath*/
  {
    Log4r.log("Record of Link CLicked On Row : ", GlobalHelper.globlevar['tableLinkRecord']);
    Log4r.log("Base Function Old contxt Keys", GlobalHelper.contextPKValues);
    let baseContextKeyArray = GlobalHelper.contextPKValues.split("&");
    let clickedRowData = GlobalHelper.globlevar['tableLinkRecord'];
    let functionIdAttribute = functionParameters.functionIdColumn;
    let configFuncKeysArray = functionParameters.functionKeys.split("|");
    let orientationType = functionParameters.orientation;
    let mapBaseContextKeys = new Map();
    let f2FunctionId = "";
    let new_b_pk_value = false;
    if (orientationType === "self") {
      GlobalHelper.globlevar['hideSubmitButtonflag'] = true;
    }
    Log4r.log("This screen Data is : " , screenData);
    for(let i=0 ; i < baseContextKeyArray.length ; i++){
       var oldKeyValue = baseContextKeyArray[i].split("=");
       let oldKey = oldKeyValue[0];
       let oldValue = oldKeyValue[1];
       mapBaseContextKeys.set(oldKey, oldValue);
    }
    for(let j=0 ; j < configFuncKeysArray.length ; j++){
      if(configFuncKeysArray[j].split("=")[1] !== "")
      {
        new_b_pk_value = true;
      }
    }

    for(let j=0 ; j < configFuncKeysArray.length ; j++){
      let newKey = configFuncKeysArray[j].split("=")[0];
      let newValue = configFuncKeysArray[j].split("=")[1];
      if(clickedRowData != undefined){
        if(newValue in clickedRowData){ // replace value by value of configured controlId
          newValue = clickedRowData[newValue];
        }
        if(functionIdAttribute in clickedRowData){ //getting funcid from configured attribute Id
          f2FunctionId = clickedRowData[functionIdAttribute];
        }
      }
      if(screenData != undefined && screenData.length > 0){
        for(let k =0 ; k<screenData.length ; k++){
          let allControlsIdObj  = screenData[k].schema[0];
          if(newValue in allControlsIdObj){
            newValue = screenData[k].formData[0][newValue].data[0];
          }
          if(functionIdAttribute in allControlsIdObj){
            if(Array.isArray(screenData[k].formData[0][functionIdAttribute].data) === true) {
              f2FunctionId = screenData[k].formData[0][functionIdAttribute].data[0];
            } else {
              f2FunctionId = screenData[k].formData[0][functionIdAttribute].data;
            }
          }
        }
      }
      if(newValue=="$P!{BASE_FUNCTION_PK1}" || newValue=="$P!{BASE_FUNCTION_PK2}" || newValue=="$P!{BASE_FUNCTION_PK3}" || newValue=="$P!{BASE_FUNCTION_PK4}" || newValue=="$P!{BASE_FUNCTION_PK5}"){
          continue;
      }else{
          if(new_b_pk_value)
          {
            let basedOn = GlobalHelper.functionListMap.get(f2FunctionId) && GlobalHelper.functionListMap.get(f2FunctionId).basedOn;
            if(basedOn != null && basedOn != "BASE") {//Here basedOn value must be "WL".
               newKey = newKey.replace('b','l');;
            }
              mapBaseContextKeys.set(newKey,newValue);
          }
      }
    } // END FOR
    let contextKeysString = convertMapToContextString(mapBaseContextKeys);

      if(orientationType == "self" || orientationType == undefined){
        window.dispatchAction(f2FunctionId, undefined, contextKeysString, orientationType);
      }
      if(orientationType == "popup"){
        holdNamessjson['errorObjectForScreen'] = ErrorHandler.backupErrorJson();
        window.showF2Component(f2FunctionId, contextKeysString, assignErrorObj, namesObject, f2CallBackFuncOnSectionalPopupClose);
      }
  }

  const f2CallBackFuncOnSectionalPopupClose = (newGlobalNames, assortedMapOfParent, assortedMapOfLeaf, jsonTemplateObjectOfBackScreen, targetToRulesMapper, ruleToTargetsMapper, fieldInExpressionToRulesMapper, defaultValueManagerMap, ruleExecutionStatusMap, throwValidationRulesArray, hybridOneThirdCardsCount, summaryConfigType_save, summaryConfigTypeFunctionid, summaryConfigType, linkclicked) => {
    GlobalHelper.globlevar['linkclicked'] = linkclicked;
    GlobalHelper.globlevar['newFunctionNames'] = newGlobalNames;
    GlobalHelper.globlevar['assortedMapOfParent']= assortedMapOfParent;
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
  }

  const convertMapToContextString = (completeMergedMap) =>{
    const obj = [];
    let returnObj = {};
    let cpkValues = "";
    for (let [key,value] of completeMergedMap){
      if(cpkValues == ""){
        cpkValues = key;
      }else{
            cpkValues = cpkValues + "|" + key;
      }
      if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined && cpkValues.includes("_ut") !== true) {
        cpkValues = cpkValues  + "_ut";
      }
    	obj.push(key + "=" + encodeURIComponent(value));
    }
     return obj.join("&").concat("&__cpk=").concat(encodeURIComponent(cpkValues));
   }

	const invokeWebService = (webServiceCode, primaryKey1, primaryKey2, primaryKey3, primaryKey4, primaryKey5, callBackFunction) =>{
		if(callBackFunction == null){
			throw 'callBackFunction to invokeWebService should not be null';
		}
		let url = "/"+GlobalHelper.menuContext+"/secure/pages/invokeWebService.jsp";
		request.post(url, "")
			.query({webServiceCode:webServiceCode})
			.query({primaryKey1:primaryKey1})
			.query({primaryKey2:primaryKey2})
			.query({primaryKey3:primaryKey3})
			.query({primaryKey4:primaryKey4})
			.query({primaryKey5:primaryKey5})
			.end(callBackFunction);
	}

  const currencyFormatedValue = (num)=> {

    if(num != null) {
      if(num == "") {
    		return num;
    	}

      if(GlobalHelper.contextSetting.ORG_CURRENCY_DECIMAL_SYMBOL === undefined) {
        GlobalHelper.contextSetting.ORG_CURRENCY_DECIMAL_SYMBOL = ".";
      }
      if(GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL === "") {
        GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL = ',';
      }

      //return GlobalHelper.contextSetting.ORG_CURRENCY_SYMBOL +" "+(num.toString().replace(/\B(?=(\d{qumaSeparatorCount})+(?!\d))/g, ORG_CURRENCY_DIGIT_GROUP_SYMBOL))

      let num_parts = num.toString().split(GlobalHelper.contextSetting.ORG_CURRENCY_DECIMAL_SYMBOL);
      num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, GlobalHelper.contextSetting.ORG_CURRENCY_DIGIT_GROUP_SYMBOL );
      return  GlobalHelper.contextSetting.ORG_CURRENCY_SYMBOL + " " +num_parts.join(GlobalHelper.contextSetting.ORG_CURRENCY_DECIMAL_SYMBOL);

    } else {
      return "";
    }

  }

  const fetchDetailSectionOnScreenLoad = (parentGridsectionID,data) => {

    let fieldPath="", sessionID="", formDataVal="", recordObj="",clickedData,detailsectionid,smryclickablecol,xpathcol,extraData = {},values={};
    if(data != null && parentGridsectionID != null && parentGridsectionID !== ""){
      if(data.screendata != null && data.screendata.length > 0){
        data.screendata.map((item,index)=>{    // NOSONAR: javascript:S2201
          if(!item.hasOwnProperty("addRowtoGridSection")){
            item.hidden = "false";
          }
          if(item.sessionID === parentGridsectionID){
            fieldPath = item.sessionID;
            sessionID = item.sessionID;
            formDataVal = item.formData[0][fieldPath];
            detailsectionid = formDataVal.data.detailsectionid;
            smryclickablecol = formDataVal.data.smryclickablecol
            GlobalHelper.globlevar['tableLinkRecord'] = formDataVal.data.DataSource[0];
            recordObj = formDataVal.data.DataSource[0];
            clickedData = recordObj[formDataVal.data.smryclickablecol];
            xpathcol = formDataVal.data.Columns;
            try
            {
              var datafetchreq = {};
              xpathcol.map((item,i)=>     // NOSONAR: javascript:S2201
                {
                  try
                  {
                    datafetchreq[item.xPath] = GlobalHelper.globlevar['tableLinkRecord'][item.dataIndex];
                  }catch(e){Log4r.error(e)}
                }
              )
              GlobalHelper.globlevar['dependablerecordrequest'] = datafetchreq;
              GlobalHelper.globlevar['dependablelayoutid'] = sessionID ;
            }catch(e){Log4r.error(e)}
          }
        })

        extraData = {
          "fieldPath":fieldPath,
          "sessionId":sessionID,
          "formDataVal":formDataVal,
          "recordObj":recordObj
        }

        values = {
          "clickedData":clickedData,
          "detailsectionid":detailsectionid,
          "smryclickablecol":smryclickablecol
        }

        let orientationType = "self";
        let type = "GRIDFETCHDATA";
        GlobalHelper.globlevar['linkclicked'] = true;
        //Log4r.log("skjxhakjsh........",values,type,extraData,orientationType);
        window.dispatchAction(values,type,extraData,orientationType);
      }
    }
  }

const makeFunctionReadOnly = (screenJson) =>{

  try{
      /*for(var i=0;i<screenJson.screendata.length;i++)        // iterating screendata
      {
        screenJson.screendata[i].editable = false;
      }*/

      screenJson.screendata.map((item,index)=>{    // NOSONAR: javascript:S2201
        item['editable'] = false;
        if(item.uiSchema[0] != null && item.uiSchema[0].children != null){
          if(item.uiSchema[0].children[0].children.edit != null){
            item.uiSchema[0].children[0].children.edit = "false";
            if(item.uiSchema[0].children[0].children.widget === "table"){
              item.formData[0][item.uiSchema[0].children[0].children.fieldPath].data.Columns.map((colItem,colIndex)=>{    // NOSONAR: javascript:S2201
                colItem['completeEditable'] = false;
                if(colItem['id'] === "add" || colItem['id'] === "edit" || colItem['id'] === "delete"
                 ||colItem['title'] === "add" || colItem['title'] === "edit" || colItem['title'] === "delete"
                 ||colItem['style'] === "add" || colItem['style'] === "edit" || colItem['style'] === "delete"
                 ||colItem['fieldPath'] === "add" || colItem['fieldPath'] === "edit" || colItem['fieldPath'] === "delete"){
                  Log4r.log("sajdhbkjsad......",colItem,colIndex);
                  colItem['title'] = "removed"+colItem['title'];
                  colItem['widget'] = "hidden";
                }else{
                  if(colItem['edit']==="true"){
                    colItem['edit']="false";
                  }
                }
              })
            }
          }
        }

      })

  }catch(e){Log4r.error(e)}

    return screenJson;
}

const setOnScreenLoadData = () =>{
  if(GlobalHelper.globlevar['worklistRowClick'] === true){
    if(GlobalHelper.globlevar['postSaveScreenLoad'] !== null){
      if(GlobalHelper.globlevar['postSaveScreenLoad']['refreshFrom'] === "normalFunction"){
        if(GlobalHelper.globlevar['UISCreenObject'] !== null){
          GlobalHelper.globlevar['UISCreenObject'].myFunction(GlobalHelper.globlevar['postSaveScreenLoad']['customIndex'],GlobalHelper.globlevar['postSaveScreenLoad']['customName'], GlobalHelper.globlevar['postSaveScreenLoad']['customFunctionObj']);
          }
        }
      }
    } else {
      if(GlobalHelper.globlevar['postSaveScreenLoad'] !== null){
        if(GlobalHelper.globlevar['postSaveScreenLoad']['refreshFrom'] === "hangingFunction"){
          if(GlobalHelper.globlevar['MainLayoutObject'] !== null){
            GlobalHelper.globlevar['MainLayoutObject'].MyFuncLeft(GlobalHelper.globlevar['postSaveScreenLoad']['customPost'], GlobalHelper.globlevar['postSaveScreenLoad']['customReturnToMenuId']);
        }
      }
    }
  }
  // if (GlobalHelper.globlevar.basicjson)
  // {
  //   Log4r.log("kjwqwww",GlobalHelper.globlevar.basicjson.data[0].name.screendata);
  //   if( GlobalHelper.globlevar.basicjson.data[0].name.screendata.length>0)
  //   {
  //     holdNamessjson.screendata =   JSON.parse(JSON.stringify(GlobalHelper.globlevar.basicjson.data[0].name.screendata) )
  //   }
  // }
}
const searchValueInClipSearch = (value,attributeId) =>{
  let clipsearchobject;
  GlobalHelper.globlevar.CLIPCOLUMNSJSON.map((item, index) => {    // NOSONAR: javascript:S2201
    if (item.attrId === attributeId) {
      clipsearchobject = item;
    }
  });
  new ClipSearchComponent().inputClipSearch(value,clipsearchobject);
}
const addCustomButton = (buttonId,label,iconToBeDispalyed) =>{
  GlobalHelper.globlevar.showButtonOnReadonlyScreen = buttonId;
  if(holdNamessjson.ButtonPalette !== undefined){
    let uiSchemaObj ={};
    let formDataObject ={};
    formDataObject['style']= {accessCat: "R",buttonCategory: "STANDARD",buttonType: "",classname: "paletteClassSave",
                              eventName: "",icon: iconToBeDispalyed,label: label,size: "large",type: "default"};
    uiSchemaObj['children']={fieldPath: buttonId,widget: "button",xType: "field"};
    uiSchemaObj['span'] = 6;
    uiSchemaObj['xType'] ="col";
    var key =  holdNamessjson.ButtonPalette[0].uiSchema[0].children;
    var existButton =  key.filter(itm2 => itm2.children.fieldPath == buttonId)[0];
    if(existButton !== undefined)
    {
      holdNamessjson.ButtonPalette[0].schema[0][existButton.children.fieldPath]['hidden'] = false;
    }
    else{
      holdNamessjson.ButtonPalette[0].schema[0][buttonId]={title:""};
      holdNamessjson.ButtonPalette[0].uiSchema[0].children.push(uiSchemaObj);
      holdNamessjson.ButtonPalette[0].formData[0][buttonId] = formDataObject;

    }
  }
}

const setTotalInGridColumn = (gridColumnXpath,sumValue) =>{
  if(gridColumnXpath != null && sumValue != null){
    let lastIndex = gridColumnXpath.lastIndexOf('.');
    let gridXpath = gridColumnXpath.substring(0,lastIndex);

    if(gridXpath){
      if(holdNamessjson != null){
        holdNamessjson.screendata.map((screenObj,index)=>{    // NOSONAR: javascript:S2201
          if(screenObj.sectionXPath === gridXpath){
            screenObj.uiSchema[0].children.map((item,indx)=>{    // NOSONAR: javascript:S2201
              if(item.children.widget === "table" && (item.children.xPath === gridXpath)){
                screenObj.formData[0][screenObj.sessionID].data.Columns.map((colitem,colindex)=>{    // NOSONAR: javascript:S2201
                  if(colitem.xPath == gridColumnXpath){
                    colitem['footerrowsetbyuser'] = sumValue;
                  }
                })
              }
            })
          }
        })
      }
    }

    let col_ID = "totalSum_Grid_Col_"+gridColumnXpath;
    document.getElementById(col_ID).innerHTML = sumValue;
    //GlobalHelper.globlevar.MainLayoutObject.refreshQB();
  }
}

const setGridRowCellEditable = (xpathGrid, xpathCol, isGridRowCellEditable, indexOfRow) =>     /*xpathGrid is xpath of grid and xpathCol is xpath of column..*/
{
  if (holdNamessjson != null && isGridRowCellEditable != null) {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof []) {
      var fpath, secIndex, widget, datatype ;
      for (var i = 0; i < holdNamessjson.screendata.length; i++) {
          var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];  /*searching for fieldPath against xpath..*/
          if (obj) {
            fpath = obj.children.fieldPath;     /* setting fieldPath..*/
            secIndex=i;                         /* keeping index of section..*/
            break;
          }
      }

      if (fpath == undefined) {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return null;
      }

      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj) {
        widget = colObj.widget; /* Kept widget and datatype variables if required in future*/
        datatype = colObj.datatype;
        if (holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource != null) { /* checkng dataSource is available..*/
           let gotRecordForKey = null;
           if(indexOfRow != null) {
             gotRecordForKey = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource.filter(item =>  item.key === indexOfRow)[0];
           } else if (GlobalHelper.globlevar.keyOfCurruntchangedField != null) {
             gotRecordForKey = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource.filter(item =>  item.key === GlobalHelper.globlevar.keyOfCurruntchangedField)[0];
           } else {
             Log4r.error("No matched index !");
             return null;
           }
           if (gotRecordForKey != null) {
            Log4r.log("gotRecordForKey[colObj.dataIndex]==?>",gotRecordForKey[colObj.dataIndex]);
            let dataSourceRuleMap = new Map();
            if(gotRecordForKey.dataSourceRuleMap != null){
              dataSourceRuleMap = gotRecordForKey.dataSourceRuleMap;
            }

            if (isGridRowCellEditable === false) {
              let statusObject = {};
              if(!isempty(colObj.id)) {
                if(dataSourceRuleMap.get(colObj.id) != null) {
                  statusObject=dataSourceRuleMap.get(colObj.id);
                }
                statusObject["colConditionallyEditableFlag"]=false;
                dataSourceRuleMap.set(colObj.id,statusObject);
              }
              gotRecordForKey.dataSourceRuleMap=dataSourceRuleMap;
            } else if (isGridRowCellEditable === true) {
              let statusObject = {};
              if(!isempty(colObj.id)) {
                if(dataSourceRuleMap.get(colObj.id) != null) {
                  statusObject=dataSourceRuleMap.get(colObj.id);
                }
                statusObject["colConditionallyEditableFlag"]=true;
                dataSourceRuleMap.set(colObj.id,statusObject);
              }
              gotRecordForKey.dataSourceRuleMap=dataSourceRuleMap;
            }  else {
              Log4r.error("Oeration does not exist !");
              return null;
            }
          }
          else {
            Log4r.error("record for key not found:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
            return null;
          }
        } else {
          Log4r.error("DataSource not found..dataSource:=",holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource);
          return null;
        }
      } else {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    } else {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  } else {
    return null;
  }
}

const addSectionCustomButton = (xpath,label,customFunctionName) =>
{
  if(holdNamessjson)
  {
    if(holdNamessjson.screendata != null && xpath != null){
      let section = holdNamessjson.screendata.filter(item => item.sectionXPath === xpath)[0];
      if(section)
      {
        if(section.sectionButton != null && section.sectionButton.buttons != null){
          let buttonObj = {id:section.sectionButton.buttons.length+1,title:label,fname:customFunctionName};
          section.sectionButton.buttons.push(buttonObj);
        }else{
          let buttonObj = {id:1,title:label,fname:customFunctionName};
          section['sectionButton'] = {};
          section['sectionButton']['buttons'] = [];
          section['sectionButton']['applicable'] = "true";
          section['sectionButton']['buttons'].push(buttonObj);
        }
      }
    }
  }
}

const changeColumnNameOfAGrid = (xpathGrid,xpathCol,nameToBeReplace) => {
  if (holdNamessjson) {
    if (holdNamessjson.screendata && typeof holdNamessjson.screendata == typeof []) {
      let fpath,secIndex;
      for (var i = 0; i < holdNamessjson.screendata.length; i++) {         /* iterating for all sections..*/
        var obj = holdNamessjson.screendata[i].uiSchema[0].children.filter(item => item.children.xPath === xpathGrid )[0];  /*searching for fieldPath against xpath..*/
        if (obj) {
          fpath = obj.children.fieldPath;     /* setting fieldPath..*/
          secIndex=i;                         /* keeping index of section..*/
          break;
        }
      }
      if (fpath == undefined) {
        Log4r.error("grid not found for gridXpath:",xpathGrid);
        return null;
      }
      var colObj = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.filter(item =>  item.xPath === xpathCol)[0];/* getting dataIndex of column for provided column xpath..*/
      if (colObj) {
        colObj['title'] = nameToBeReplace;
      } else {
        Log4r.error("Column not found for ColumnXpath:",xpathCol);
        return null;
      }
    } else {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  } else {
    return null;
  }
}

const removeSection = (sectionXPath) =>{
  if(sectionXPath != null && sectionXPath!= ""){
      if(holdNamessjson && holdNamessjson.screendata != null){
        if(holdNamessjson.screendata instanceof Array && holdNamessjson.screendata.length > 0){
          let removedSection = holdNamessjson.screendata.filter(item => item.sectionXPath === sectionXPath);
          if(removedSection != null && removedSection instanceof Array && removedSection.length > 0 ){
            if(holdNamessjson['removedSection'] != null){
              holdNamessjson['removedSection'].push(removedSection);
            }else{
              holdNamessjson['removedSection'] = new Array();
              holdNamessjson['removedSection'].push(removedSection);
            }
            holdNamessjson.screendata = holdNamessjson.screendata.filter(item => item.sectionXPath != sectionXPath);
          }
        }
      }
  }
}

const downloadImage = (name, content, type) => {
  var link = document.createElement('a');
  link.href = `data:application/octet-stream;base64,${encodeURIComponent(content)}`;
  link.download = /\.\w+/.test(name) ? name : `${name}.${type}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export {
  downloadImage as downloadImage,
  addCustomButton as addCustomButton,
  getGridColumnJson as getGridColumnJson,
  getGridDataSource as getGridDataSource,
  getSectionData as getSectionData,
  getUploadParam as getUploadParam,
  setUploadParam as setUploadParam,
  getValue as getValue,
  setValue as setValue,
  setCellEditable as setCellEditable,
  setXpathValue as setXpathValue,
  makeSectionEditable as makeSectionEditable,
  makeSectionReadOnly as makeSectionReadOnly,
  hideSection as hideSection,
  showSection as showSection,
  setXpathValues as setXpathValues,
  highlightField as highlightField,
  setFontColorForField as setFontColorForField,
  fetchData as fetchData,
  fetchDataPost as fetchDataPost,
  populateDropdown as populateDropdown,
  clearDropdown as clearDropdown,
  xpathFactory as xpathFactory,
  getValuesInGrid as getValuesInGrid,
  getValueInGridCell as getValueInGridCell,
  setValueInGridCell as setValueInGridCell,
  setPopsearchValueInGridCell as setPopsearchValueInGridCell,
  setValuesInGrid as setValuesInGrid,
  clearSection as clearSection,
  clearFieldValue as clearFieldValue,
  makeFieldReadOnly as makeFieldReadOnly,
  makeFieldEditable as makeFieldEditable,
  showField as showField,
  hideField as hideField,
  getFieldPath as getFieldPath,
  addEmptyRowInGrid as addEmptyRowInGrid,
  hideGridColumn as hideGridColumn,
  hideGridGroupColumn as hideGridGroupColumn,
  showGridGroupColumn as showGridGroupColumn,
  highlightRowInGrid as highlightRowInGrid,
  highlightColumnInGrid as highlightColumnInGrid,
  highlightCellInGrid as highlightCellInGrid,
  showGridColumn as showGridColumn,
  getSelectedRowsCountAgainstXpath as getSelectedRowsCountAgainstXpath,
  setValueOfPopSearch as setValueOfPopSearch,
  setCircleColorInHeader as setCircleColorInHeader,
  setDatasourceOfPopSearch as setDatasourceOfPopSearch,
  setDatasrcOfPopSearchWithoutIndex as setDatasrcOfPopSearchWithoutIndex,
  getXpathValues as getXpathValues,
  getxPathMapForGrid as getxPathMapForGrid,
  getHtmlStringForTextEditor as getHtmlStringForTextEditor,
  applyCssClassToGridCell as applyCssClassToGridCell,
  getIndexOfChangedEditableRow as getIndexOfChangedEditableRow,
  getSumOfGridColumn as getSumOfGridColumn,
  getAvarageOfGridColumn as getAvarageOfGridColumn,
  getMinValueOfGridColumn as getMinValueOfGridColumn,
  getMaxValueOfGridColumn as getMaxValueOfGridColumn,
  addRowtoGrid as addRowtoGrid,
  addCustomeErrormessagesInGrid as addCustomeErrormessagesInGrid,
  removeCustomeErrormessagesInGrid as removeCustomeErrormessagesInGrid,
  applyCssClassToField as applyCssClassToField,
  removeCustomeErrormessages as removeCustomeErrormessages,
  addCustomeErrormessages as addCustomeErrormessages,
  filterXMLCreation as filterXMLCreation,
  removeButton as removeButton,
  redirectToList as redirectToList,
  showButton as showButton,
  getJsonDataForChart as getJsonDataForChart,
  validatesection as validatesection,
  addGenericSuccessMessage as addGenericSuccessMessage,
  setQueryParams as setQueryParams,
  getQueryParams as getQueryParams,
  getParentPKComponentDataMap as getParentPKComponentDataMap,
  getBusinessDate as getBusinessDate,
  getModeOfRowInGrid as getModeOfRowInGrid,
  setFunctionTitle as setFunctionTitle,
  showQueryBuilderPopUp as showQueryBuilderPopUp,
  setServerMode as setServerMode,
  getServerMode as getServerMode,
  setContextKeys as setContextKeys,
  getContextKeys as getContextKeys,
  setDefaultLayoutId as setDefaultLayoutId,
  getDefaultLayoutId as getDefaultLayoutId,
  getGridColumnValues as getGridColumnValues,
  documentViewer as documentViewer,
  addGenricWorningmessages as addGenricWorningmessages,
  removeGenricWorningmessages as removeGenricWorningmessages,
  hideRowInGrid as hideRowInGrid,
  makeGridColumnNonEditable as makeGridColumnNonEditable,
  makeGridColumnEditable as makeGridColumnEditable,
  refreshMainLayout as refreshMainLayout,
  redirectToFunction as redirectToFunction,
  populateDropdownInGrid as populateDropdownInGrid,
  clearDropdownInGrid as clearDropdownInGrid,
  invokeWebService as invokeWebService,
  strikeThroughRowInGrid as strikeThroughRowInGrid,
  removeStrikeThroughRowInGrid as removeStrikeThroughRowInGrid,
  clearGrid as clearGrid,
  removeSectionButton as removeSectionButton,
  showSectionButton as showSectionButton,
  clearHighlightedCellInGrid as clearHighlightedCellInGrid,
  clearHighlightedColumnInGrid as clearHighlightedColumnInGrid,
  clearHighlightedRowInGrid as clearHighlightedRowInGrid,
  getErrorMessagesList as getErrorMessagesList,
  currencyFormatedValue as currencyFormatedValue,
  fetchDetailSectionOnScreenLoad as fetchDetailSectionOnScreenLoad,
  makeFunctionReadOnly as makeFunctionReadOnly,
  setOnScreenLoadData as setOnScreenLoadData,
  setGridColumnHardReadonly as setGridColumnHardReadonly,
  searchValueInClipSearch as searchValueInClipSearch,
  getXpath as getXpath,
  setTotalInGridColumn as setTotalInGridColumn,
  setGridRowCellEditable as setGridRowCellEditable,
  addSectionCustomButton as addSectionCustomButton,
  changeColumnNameOfAGrid as changeColumnNameOfAGrid,
  removeSection as removeSection
}
