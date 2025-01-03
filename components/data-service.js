/* Copyright (C) Indus Software Technologies Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import 'babel-polyfill';
import request from 'superagent';
import {PropTypes} from 'react';
import {push} from 'react-router-redux'
import {onPreSaveUtil} from '../util/onPreSaveUtil';
import {onPostSaveUtil} from '../util/onPostSaveUtil';
import $ from 'jquery';
import {ReactJsonBuilder} from '../jsonconverter/jsonBuilder.js';
import {ReactUpdateData,isempty} from '../jsonconverter/jsonBuilder.js';
import GlobalHelper from '../components/GlobalHelper';
import { getSTData } from './CommonSecurity';
import {preFetch,postFetch} from '../form/fetchutils';
import {preSave,postSave} from '../form/saveutils';
import Model from '../form/Model';
import Log4r from '../util/Log4r';
import ErrorHandler from '../form/ErrorHandler';
import {displayMessageBox , refreshWorklistModel} from '../ModalComponent/ModalBox';
import { removeButton,fetchData, setOnScreenLoadData} from '../form/xPathDataStore';
import ParentPKComponentData from "../form/ParentPKComponentData";
import {loadScript,isRequestStatus,removeBacksLashCharacter} from './loadJavaScript.js';
//import file from "../components/defaultScreenJson";

// var pkvalue = undefined;
// var layoutID = undefined;
// var datajson = undefined;
// var ParentPK = undefined;
// var ACCESS_MODE = undefined;
// let functionScreenDataUrl = undefined;

const dataService = store => next => action => {
	// var API_ROOT = GlobalHelper.globlevar.contextpathajax;
	// var file_name = 'data.json';
	let jsonObjtemplet = undefined;	//let the variables depends upon switch-case
	let jsonObjdata = undefined;
	var url = GlobalHelper.globlevar.contextpathajax;
	// var payload;

	let pkvalue = undefined;
	let layoutID = undefined;
	// let datajson = undefined;
	let ParentPK = undefined;
	let ACCESS_MODE = undefined;
	let functionScreenDataUrl = undefined;

	let requestData = {};
	let contextprimarykeyvalue = "";
	let contextencodevalue = "";

	Log4r.log("Alok RnD ", jsonObjtemplet, jsonObjdata);
	next(action);


	//loadScript('http://localhost/pdgic/secure/js/customcollectionutilsAll.js');
	//loadScript("FrameworkUtility/customGenUtils.js");
	loadScript("FrameworkUtility/customCSS.css");
	switch (action.type) {

		case 'LISTINFO':
			pkvalue = action.values.caseno;
			requestData = {
				'listinfo': action.values,
				'pk': pkvalue,
				'token': 'indus'
			};
			GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
			request
				.post(url + "listinfo")
				.send(JSON.stringify(requestData)) // sends a JSON post body
				.send({
					'listinfo': action.values,
					'pk': pkvalue,
					'token': 'indus'
				})
				.set('X-API-Key', 'foobar')
				.set('Accept', 'application/json')
				.end((err, res) => {
					if (err) {
						// here is the auto-logout on rest call failed with 401 http status
						// Return the error action
						return next({
							type: 'GET_NAMES_FAIL',
							names
						});
					}

					Log4r.log('res.text ', res.text);
					Log4r.log('res.text... ', JSON.parse(res.text));
					Log4r.log('res.text....... ', JSON.parse(res.text).name);
					const names = JSON.parse(res.text).name;
					Log4r.log('LOGIN_AUTH data-service : call ', names);
					next({
						type: 'LISTINFO_OK',
						names
					});
				});
			break;

		case 'LAYOUTTOPICON':
			GlobalHelper.globlevar['isreadysaveclicked'] = true;
			GlobalHelper.globlevar['deleteButtonForDMSUpload'] = false;
			var functionid = "";
			contextprimarykeyvalue =  GlobalHelper.contextPrimaryKey.split('=');
      		contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
			Log4r.log("calculatedPkValues" ,action );
			url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
			if(action.hasOwnProperty("calculatedPkValues")){
				let contextPrimaryKyesSplit = action.calculatedPkValues[0].contextPrimaryKyes.split("=");
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues   + "&" + contextPrimaryKyesSplit[0] + "=" + encodeURIComponent(contextPrimaryKyesSplit[1])  + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
				/*url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?";
				let param = "_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues   + "&" + action.calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&";
				url = url + param; */

			}
			else{
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
			}
			if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
				functionid = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
			} else {
				functionid = action.values;
				GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
			}
			requestData = {
				'__functionId': functionid,
				'token': 'indus'
			};
			layoutID = action.values;
			if (preFetch()) {

				let LAYOUTTOPICON_GetTemplateUrl  = url.split("?")[1];
	      let _stdata_LAYOUTTOPICON_GetTemplateUrl = getSTData("/"+GlobalHelper.menuContext+"/", LAYOUTTOPICON_GetTemplateUrl);

				request
					.post(url + "layouttopicon")
					.query({_SID_:(_stdata_LAYOUTTOPICON_GetTemplateUrl.SID + _stdata_LAYOUTTOPICON_GetTemplateUrl.SINT)})
					.query({_ADF_:""})
					.send(JSON.stringify(requestData)) // sends a JSON post body
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
						access: GlobalHelper.functionAccessMap.get(action.values)
					})
					.end((err, res) => {
						if (err) {
							// here is the auto-logout on rest call failed with 401 http status
							// Return the error action
							const names = JSON.parse('["/reactapp/app/index"]');
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						}

						//{"status":"failure","errorcode":"NO_ACCESS","errordesc":"Access Denied"}
						//{"status":"failure","errorcode":"INVALID_SESSION","errordesc":"Your session has been forcefully logged off by the administrator."}

						var jsonText = res.text;
						let jsonObj = null
						jsonObj=removeBacksLashCharacter(jsonText);
					
						//jsonObj = {"status":"failure","errorcode":"NO_ACCESS","errordesc":"Access Denied"}
    					//jsonObj = {"status":"failure","errorcode":"INVALID_SESSION","errordesc":"Your session has been forcefully logged off by the administrator."}
    					isRequestStatus(next,jsonObj); // Check request status.
						GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
						let parentnode = new Model().handleDataChange(jsonObj,action.calculatedPkValues);
						GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonObj;
						GlobalHelper.globlevar['parentnode'] = parentnode;
						jsonObjtemplet = jsonObj.JSON_DATA;
						let buttonpalettes = jsonObj.BUTTON_JSON;
						let quickbuttons = jsonObj.QUICK_BUTTON_JSON;
						ACCESS_MODE = jsonObj.ACCESS_MODE;
						if(GlobalHelper.globlevar.hybridOneThirdCardsCount.length === 0){
							GlobalHelper.globlevar.templetObject = jsonObjtemplet; /*Sprint 8 : Added to  get template object in teable widget gor filter purpose */
						}
						if (res.text !== undefined) {
							//load dynamic .js file which will come funtion base.
							let jsurl = '/'+GlobalHelper.menuContext+'/secure/js/customcollectionutils1.js';

							let jsScripts = jsonObj.JSSCRIPTS;

							try{
								loadScript("FrameworkUtility/customGenUtils.js");
								if(jsScripts != null)
								for (let jsscriptIndex = 0 ;  jsscriptIndex < jsScripts.length ; jsscriptIndex++) {

									loadScript("/"+ jsScripts[jsscriptIndex].path);
								}
							}catch(e){Log4r.warn(e);}

							var functioniddata = "";
							url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
							if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
								GlobalHelper.globlevar['summaryConfigType_save'] = false;
								functioniddata = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
							} else {
								functioniddata = action.values;
							}
							if(action.hasOwnProperty("calculatedPkValues")){
								Log4r.log("actionCalculatedVlues",action.calculatedPkValues);
								let contextPrimaryKyesSplit = action.calculatedPkValues[0].contextPrimaryKyes.split('=');
      							let contextPrimaryKyesSplitvalue = contextPrimaryKyesSplit[0]+"="+ encodeURIComponent(contextPrimaryKyesSplit[1]);
								url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues+ "&" + contextPrimaryKyesSplitvalue+ "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
							//	url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues+ "&" + action.calculatedPkValues[0].contextPrimaryKyes + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
							}
							else{
								url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&" + "functionMode=F&"
							}

							let LAYOUTTOPICON_GetDataUrl  = url.split("?")[1];
				      let _stdata_LAYOUTTOPICON_GetDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", LAYOUTTOPICON_GetDataUrl);
							if (jsonObj.screenBasedOn !== "null" && jsonObj.screenBasedOn === "CUSTOM_JSON") {
								url = "/"+jsonObj.scrJSONPath;
								request
									.get(url)
									.query({_SID_:(_stdata_LAYOUTTOPICON_GetDataUrl.SID + _stdata_LAYOUTTOPICON_GetDataUrl.SINT)})
									.query({_ADF_:""})
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
											return next({
												type: 'GET_NAMES_FAIL',
												names
											});
										}
										Log4r.log('res.text data ', res.text);
										let jsonTxt22;
										var jsonText = res.text;
										let succFlag = true;
										Log4r.log('res.text ', res.text);
										if (res.text !== "" && res.text !== undefined && res.text !== null)
										{
											let tempJson  =removeBacksLashCharacter(res.text);
											let newErrJson ={};
											if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
											{
											  let errjsn = tempJson.__f2_messages__;
											  for (var i = 0; i < errjsn.length; i++)
											  {
											    if (errjsn[i][0] == "E") {
											      succFlag = false;
														let dialogTitle = "Dialog Box";
														if(!isempty(errjsn[i][4])){
															dialogTitle = errjsn[i][4];
														}
													displayMessageBox(dialogTitle,errjsn[i][1],"E",null)
											      break;
											    }
											    //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
											    if (errjsn[i][0] == "D") {
											       Log4r.log("gfsadjhgsadj.........",errjsn);
														 let dialogTitle = "Dialog Box";
														 if(!isempty(errjsn[i][4])){
															 dialogTitle = errjsn[i][4];
														 }
											       displayMessageBox(dialogTitle,errjsn[i][1],"I",null)
											       break;
											    }//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
											  }
												newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
											}
											newErrJson['SuccessFlag'] = succFlag;
											newErrJson['SuccessFlagReRender'] = true;
										
											  jsonTxt22 = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
											
											Log4r.log(newErrJson,"asfkuhg...",jsonTxt22);
										}
										let jsonObj = null
										jsonObj=removeBacksLashCharacter(res.text);
									
										isRequestStatus(next,jsonObj); // Check request status.
										try {
											Log4r.log('JSON retrived Object data ', jsonObj);
											GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
											Log4r.log('JSON retrived Object data result ', GlobalHelper.globlevar['jsonObjgetData']);
											jsonObjdata = jsonObj.JSON_DATA;
										} catch (e) {
											Log4r.log(e)
										}
										// to storequerystring in all request from getdatacall and temp basis
										//ParentPK= new ParentPKComponentData();
										//ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);
										//let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
										let names = jsonObj.name;
										if(functioniddata === "ffcbad2a01cf4e308b11971164f8d185")
										{
											//alert("here you are using custom json for toggle button demo")
											//names= formtestdata_screen.name;
										}
										Log4r.log(JSON.stringify(names.name));
										var jsonTxt = JSON.stringify(names);
										jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": "+jsonTxt22+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										names = JSON.parse(jsonTxt).name;
										Log4r.log("response data..", names);
										if (GlobalHelper.globlevar['summaryConfigType'] == "F") {
											GlobalHelper.globlevar['summaryConfigType'] = "summaryConfigType_F";
										}

										// below code added for local test only
										try{
										names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
									  	names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
										}catch(e){
											Log4r.log(e);
										}
										let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
										GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);
										GlobalHelper.globlevar['savedandfetch'] = true;

										//Sprint 11:Added to give an identification/notification that we need a "NEXT" button in UIScreen
										if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
											names['pr_mode'] = action.pr_mode;
											GlobalHelper.globlevar.raiseFalg = true;
										}
										if (action.orientationType !== undefined && action.orientationType.length !== 0) {
											names['orientationType'] = action.orientationType;
										} else {
											names['orientationType'] = "self";
											names['reassignF2FunctionTitle'] = "true";
											names['f2FunctionId'] = action.values;
										}
										GlobalHelper.globlevar.onScreenLoadSpin = false;
										GlobalHelper.globlevar.savespin = false;
										GlobalHelper.globlevar["onload"] = true;
										names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
										GlobalHelper.globlevar['ACCESS_MODE'] = ACCESS_MODE;
										//if(ACCESS_MODE === 1).savespin
										//{
											//names.data[0].name = makeFunctionReadOnly(names.data[0].name);
										//}
										GlobalHelper.globlevar['buttonSpin'] = false;
										if (GlobalHelper.globlevar['summaryConfigTypeFunctionid'] != null && GlobalHelper.globlevar['summaryConfigTypeFunctionid'] == functioniddata ) {
											names.data[0].name['functionIDOfSummaryConfigType'] = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
										} else {
											names.data[0].name['functionID'] = functioniddata;
											names.data[0].name['functionIDOfSummaryConfigType'] = undefined;
										}
										if(jsScripts != null){
												names.data[0].name['scriptsToLoad'] = jsScripts;
										}
										if (postFetch()) {
											next({
												type: 'LAYOUTRIGHTICON_OK',
												names
											});
										} else {
											next({
												type: 'LAYOUTRIGHTICON_OK',
											});
										}
									})
							}
							else{
								request
									.post(url + "layouttopicondata")
									.query({_SID_:(_stdata_LAYOUTTOPICON_GetDataUrl.SID + _stdata_LAYOUTTOPICON_GetDataUrl.SINT)})
									.query({_ADF_:""})
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
											return next({
												type: 'GET_NAMES_FAIL',
												names
											});
										}
										Log4r.log('res.text data ', res.text);
										let jsonTxt22;
										var jsonText = res.text;
										let succFlag = true;
										Log4r.log('res.text ', res.text);
										if (res.text !== "" && res.text !== undefined && res.text !== null)
										{
											let tempJson  = removeBacksLashCharacter(res.text);
											let newErrJson ={};
											if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
											{
											  let errjsn = tempJson.__f2_messages__;
											  for (var i = 0; i < errjsn.length; i++)
											  {
											    if (errjsn[i][0] == "E") {
											      succFlag = false;
														let dialogTitle = "Dialog Box";
														if(!isempty(errjsn[i][4])){
															dialogTitle = errjsn[i][4];
														}
													displayMessageBox(dialogTitle,errjsn[i][1],"E",null)
											      break;
											    }
											    //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
											    if (errjsn[i][0] == "D") {
											       Log4r.log("gfsadjhgsadj.........",errjsn);
														 let dialogTitle = "Dialog Box";
														 if(!isempty(errjsn[i][4])){
															 dialogTitle = errjsn[i][4];
														 }
											       displayMessageBox(dialogTitle,errjsn[i][1],"I",null)
											       break;
											    }//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
											  }
												newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
											}
											newErrJson['SuccessFlag'] = succFlag;
											newErrJson['SuccessFlagReRender'] = true;
											if (succFlag)
											{
											  jsonTxt22 = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
											}
											else {
											  jsonTxt22 = JSON.stringify(newErrJson);
											}
											Log4r.log(newErrJson,"asfkuhg...",jsonTxt22);
										}
										let jsonObj = null
										jsonObj=removeBacksLashCharacter(jsonText);
									
										isRequestStatus(next,jsonObj); // Check request status.
										try {
											Log4r.log('JSON retrived Object data ', jsonObj);
											GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
											Log4r.log('JSON retrived Object data result ', GlobalHelper.globlevar['jsonObjgetData']);
											jsonObjdata = jsonObj.JSON_DATA;
										} catch (e) {
											Log4r.log(e)
										}
										// to storequerystring in all request from getdatacall and temp basis
										ParentPK= new ParentPKComponentData();
										ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);
										let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();

										if(functioniddata === "ffcbad2a01cf4e308b11971164f8d185")
										{
											//alert("here you are using custom json for toggle button demo")
											//names= formtestdata_screen.name;
										}
										Log4r.log(JSON.stringify(names));
										var jsonTxt = JSON.stringify(names);
										jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": "+jsonTxt22+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										names = JSON.parse(jsonTxt).name;
										Log4r.log("response data..", names);
										if (GlobalHelper.globlevar['summaryConfigType'] == "F") {
											GlobalHelper.globlevar['summaryConfigType'] = "summaryConfigType_F";
										}

										// below code added for local test only
										try{
										names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
									  names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
										}catch(e){
											Log4r.log(e);
										}
										let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
										GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);
										GlobalHelper.globlevar['savedandfetch'] = true;

										//Sprint 11:Added to give an identification/notification that we need a "NEXT" button in UIScreen
										if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
											names['pr_mode'] = action.pr_mode;
											GlobalHelper.globlevar.raiseFalg = true;
										}
										if (action.orientationType !== undefined && action.orientationType.length !== 0) {
											names['orientationType'] = action.orientationType;
										} else {
											names['orientationType'] = "self";
											names['reassignF2FunctionTitle'] = "true";
											try{
												if (GlobalHelper.globlevar['summaryConfigType'] != "summaryConfigType_F" ) {
													names['f2FunctionId'] = action.values;
												}else{
													names['f2FunctionId'] = GlobalHelper.globlevar.functionID;
												}
											}catch(e){
												Log4r.error(e);
											}
										}
										GlobalHelper.globlevar.onScreenLoadSpin = false;
										GlobalHelper.globlevar.savespin = false;
										GlobalHelper.globlevar["onload"] = true;
										names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
										GlobalHelper.globlevar['ACCESS_MODE'] = ACCESS_MODE;
										//if(ACCESS_MODE === 1).savespin
										//{
											//names.data[0].name = makeFunctionReadOnly(names.data[0].name);
										//}
										GlobalHelper.globlevar['buttonSpin'] = false;

										if (GlobalHelper.globlevar['summaryConfigTypeFunctionid'] != null && GlobalHelper.globlevar['summaryConfigTypeFunctionid'] == functioniddata ) {
											names.data[0].name['functionIDOfSummaryConfigType'] = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
											let summaryConfigType = {};
											summaryConfigType['functionIDOfSummaryConfigType'] = GlobalHelper.globlevar['summaryConfigTypeFunctionid'];
											summaryConfigType['getDataOfSummaryConfigType'] = url;
											names.data[0].name['summaryConfigTypeParam'] = summaryConfigType;
										} else {
											names.data[0].name['functionID'] = functioniddata;
											names.data[0].name['functionIDOfSummaryConfigType'] = undefined;
										}
										if(jsScripts != null){
												names.data[0].name['scriptsToLoad'] = jsScripts;
										}
										if (postFetch()) {
											next({
												type: 'LAYOUTRIGHTICON_OK',
												names
											});
										} else {
											next({
												type: 'LAYOUTRIGHTICON_OK',
											});
										}
									})
							}
						}
					});
			}
			break;

		case 'GETREFRESHDATA':
			contextprimarykeyvalue =  GlobalHelper.contextPrimaryKey.split('=');
      		contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
			url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
			requestData = {
				'__functionId': action.values,
				'token': 'indus'
			};
			GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
			layoutID = action.values;
			Log4r.log('url--', url);
			Log4r.log('values of Playload : call & state = ', requestData);
			url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
			if(functionScreenDataUrl && functionScreenDataUrl.length > 0){
				url = functionScreenDataUrl;
			}

			let GETREFRESHDATA_PostUrl  = url.split("?")[1];
			let _stdata_GETREFRESHDATA_PostUrl = getSTData("/"+GlobalHelper.menuContext+"/", GETREFRESHDATA_PostUrl);

			request
				.post(url + "layouttopicondata")
				.query({_SID_:(_stdata_GETREFRESHDATA_PostUrl.SID + _stdata_GETREFRESHDATA_PostUrl.SINT)})
				.query({_ADF_:""})
				.send(JSON.stringify(requestData)) // sends a JSON post body
				.send({
					'linkoption': action.values,
					'token': 'indus'
				})
				.set('X-API-Key', action.values)
				.query({
					__functionId: action.values
				})
				.query({
					access: GlobalHelper.functionAccessMap.get(action.values)
				})
				.set('Accept', 'application/xml')
				.end((err, res) => {
					if (err) {
						Log4r.log('data-service err: call', err);
						return next({
							type: 'GET_NAMES_FAIL',
							names
						});
					}
					Log4r.log('res.text data ', res.text);
					var jsonText = res.text;
					let jsonObj = null
					jsonObj=removeBacksLashCharacter(res.text);
				
					isRequestStatus(next,jsonObj); // Check request status.
					Log4r.log('JSON retrived Object data ', jsonObj);
					try {
						GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
						Log4r.log('JSON retrived Object data result ', GlobalHelper.globlevar['jsonObjgetData']);
					} catch (e) {
						Log4r.log(e)
					}
					jsonObjdata = jsonObj.JSON_DATA;
					var objDetailSectionList = jsonObj.DTL_SEC_LIST;

					var layoutObject = undefined;
					try{
					ParentPK.getParentQueryStringFetchData(jsonObjdata);
					layoutObject = new Model().getLeafNodesForId(new Model().getParent(GlobalHelper.globlevar['parentfieldpath'])['LeafNodeParents'][0]);
					}
					catch(e){
						GlobalHelper.globlevar.savespin = false;
						Log4r.error(e)
					}
					Log4r.log('LayoutObj', layoutObject);
					let  type="REFRESHDATA";
					let names = new ReactUpdateData(layoutObject, jsonObjdata, objDetailSectionList).buildFinalUpdateJson(type);
					Log4r.log("names ", names);
					if (names != undefined) {
						jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + JSON.stringify(names) + "}]}}";
					} else {
						jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"data\":[{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"screendata\": [],\"ButtonPalette\": []}}]}}";
					}
					Log4r.log("jsonTxt ", jsonTxt);
					let jsonScreenObj = JSON.parse(jsonTxt);
					names = JSON.parse(jsonTxt).name;
					//names['DTL_SEC_LIST'] = jsonObj.DTL_SEC_LIST;
					Log4r.log("response data..", names);
					GlobalHelper.globlevar['savedandfetch'] = true;

					//Sprint 11:Added to give an identification/notification that we need a "NEXT" button in UIScreen
					if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
						names['pr_mode'] = action.pr_mode;
						GlobalHelper.globlevar.raiseFalg = true;
					}
					Log4r.log("GlobalHelper.globlevar.getDataUrls",GlobalHelper.globlevar.getDataUrls);
					if (GlobalHelper.globlevar.getDataUrls.length !== 0) {
							let urlArray = Array.from(new Set(GlobalHelper.globlevar.getDataUrls))
							let looplength = urlArray.length;
							let newfoundnames = undefined;

							var urlExtraData = GlobalHelper.getDataUrlsMap.get(urlArray[0]);
							var urlDiv = urlArray[0].split("&");

							var strMap = new Map();
							var screenObject;

							try{
									if(names.data != null && names.data[0] != null){
											if(names.data[0].name != null){
												if(names.data[0].name.screendata != null){
													screenObject = names.data[0].name.screendata.filter(item => item.sessionID == urlExtraData.fieldPath)[0];
												}
											}
									}
							}catch(e){Log4r.log(e)}

							let extraDataToSend = [];
							for(var n = 0; n <= looplength; n++) {
								if(urlArray.length !== 0){
								let stringdata = "";

								try{

									for(var i=0;i<=urlDiv.length;i++){
									if(urlDiv[i] != null && urlDiv[i] != "" && urlDiv[i].includes("=")){
										var arrghy = urlDiv[i].split("=");
										strMap.set(arrghy[0],arrghy[1]);
										arrghy.map((item,indx)=>{    // NOSONAR: javascript:S2201
											if(urlExtraData != null && urlExtraData.formDataVal != null){
												if(urlExtraData.formDataVal.data != null){
													if(urlExtraData.formDataVal.data.Columns != null){
														urlExtraData.formDataVal.data.Columns.map((colitm,indx)=>{    // NOSONAR: javascript:S2201
															if(colitm.xPath === item){
																strMap.set(arrghy[0],screenObject.formData[0].data.DataSource[i][colitm.dataIndex]);
															}
														})
													}
												}
											}
										})
									}
									}
								//Log4r.log("strMap.......",strMap);

									if(strMap != null && strMap.length !=0){
									strMap.forEach((value, key) => {
										    stringdata += key +'='+value+'&';
									});




								//Log4r.log("hdsfkjhslkfh........",stringdata);
									if(stringdata){
										//GlobalHelper.globlevar.getDataUrls.push(stringdata);
									}
									}
								}catch(e){
									stringdata = GlobalHelper.globlevar.getDataUrls[n];
								}
								let postUrlData  = url.split("?")[1];
								let _stdata = getSTData("/"+GlobalHelper.menuContext+"/", postUrlData);
								let resultData = $.ajax({
								            type: "POST",
								            url: url,
								            data:{
								                   ...GlobalHelper.globlevar['dependablerecordrequestArr'][n],
								                   _SID_:(_stdata.SID + _stdata.SINT),
								                   _ADF_:"",
								                   LAYOUT_MODE:'SUMMARY_DETAILS',
								                   token:'indus'
								                },
								            async: false
										}).responseText;
										
								
								/*		let data =	[...GlobalHelper.globlevar['dependablerecordrequestArr'][n]];
										let resultData = "";

									request
									.post(url)
									.query({
										_SID_: (_stdata.SID + _stdata.SINT)
									})
									.query({"LAYOUT_MODE":"SUMMARY_DETAILS"})
									.send({
										'token': 'indus',
									})
									.send('data', data)
									.end((err, res) => {
										resultData = res;
									})*/

								//let resultData = fetchDataPost(stringdata,...GlobalHelper.globlevar['dependablerecordrequest']);
								//let resultData = fetchData(stringdata,"");
								if(stringdata != null){
										let splitArray = stringdata.split("&");
										if(splitArray.length !== 0){
												let detailSectionIdParam = splitArray.filter(item => item.indexOf("detailsectionid=") !== -1)[0];
												if(detailSectionIdParam != null){
													let actualDetailSectionId = detailSectionIdParam.split("=")[1];
													if(actualDetailSectionId != null){
														extraDataToSend.push(actualDetailSectionId);
													}
												}
										}
									}
									Log4r.log("Extra Data To Send",extraDataToSend);

									if(resultData !== null || resultData !== undefined){
										resultData = JSON.parse(resultData);
										jsonObjdata = resultData.JSON_DATA;
										objDetailSectionList = resultData.DTL_SEC_LIST;

										try{
										ParentPK.getParentQueryStringFetchData(jsonObjdata);
										layoutObject = new Model().getLeafNodesForId(new Model().getParent(GlobalHelper.globlevar['parentfieldpath'])['LeafNodeParents'][0]);
										newfoundnames = new ReactUpdateData(layoutObject, jsonObjdata, objDetailSectionList).buildFinalUpdateJson();
										}
										catch(e){
											GlobalHelper.globlevar.savespin = false;
											Log4r.error(e)
										}
										//newfoundnames['DTL_SEC_LIST'] = resultData.DTL_SEC_LIST;
									}
								}
								if(looplength == n){
									GlobalHelper.globlevar['onlyDataCalled'] = true;
									GlobalHelper.globlevar.savespin = false;
									GlobalHelper.globlevar['buttonSpin'] = false;
									if (action.orientationType !== undefined && action.orientationType.length !== 0) {
										names['orientationType'] = action.orientationType;
									} else {
										names['orientationType'] = "self";
									}
									if(extraDataToSend.length !== 0){
										names['extradata'] = extraDataToSend;
									}
									next({
										type: 'LAYOUTRIGHTICON_OK',
										 names
									 });
								 } else {
										if(newfoundnames !== undefined){
										 	for (let i = 0; i < newfoundnames.screendata.length; i++) {
												names.data[0].name.screendata.push(newfoundnames.screendata[i]);
											}
										newfoundnames = undefined;
										urlArray.shift();
									 }
								 }
							}
					} else {
						GlobalHelper.globlevar['onlyDataCalled'] = true;
						GlobalHelper.globlevar.savespin = false;
						GlobalHelper.globlevar['buttonSpin'] = false;
						if (action.orientationType !== undefined && action.orientationType.length !== 0) {
							names['orientationType'] = action.orientationType;
						} else {
							names['orientationType'] = "self";
						}
						next({
							type: 'LAYOUTRIGHTICON_OK',
							 names
						 });
					}
				});

			break;
		case 'CUSTOMSCREEN':
			GlobalHelper.globlevar.linkclicked = false;
			GlobalHelper.globlevar['isreadysaveclicked'] = true;
			Log4r.log('INITIALSCREEN values Containers : call & state = ', action.values);
			GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
			layoutID = action.values;
			requestData = {
				'linkoption': action.values,
				'token': 'indus'
			};
			let url;
					url = action.url;
			Log4r.log('values of Playload : call & state = ', requestData);

			let CUSTOMSCREEN_PostUrl  = url.split("?")[1];
			let _stdata_CUSTOMSCREEN_PostUrl = getSTData("/"+GlobalHelper.menuContext+"/", CUSTOMSCREEN_PostUrl);

			//url = "SAMPLE.json";
			request
				.get(url)
				.query({_SID_:(_stdata_CUSTOMSCREEN_PostUrl.SID + _stdata_CUSTOMSCREEN_PostUrl.SINT)})
				.query({_ADF_:""})
				.set('Accept', 'application/json')
				.end((err, res) => {
					if (err) {
						// here is the auto-logout on rest call failed with 401 http status
						Log4r.log('data-service err: call', err);
						GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
						displayMessageBox("Error","No data from server...  "+err,"E");
						// Return the error action
						return next({
							type: 'GET_NAMES_FAIL',
							names
						});
					}
					Log4r.log("!@@3...res.text ", res.text);
					let jsonObj = null
					jsonObj=removeBacksLashCharacter(res.text);
					isRequestStatus(next,jsonObj); // Check request status.
					let jsonTxt = JSON.parse(res.text).name;

					Log4r.log("!@@3...jsonTxt ", jsonTxt);

					let jsScripts = jsonTxt.JsScripts;
						  	try{
								loadScript("FrameworkUtility/customGenUtils.js");
								if(jsScripts != null)
								for (let jsscriptIndex = 0 ;  jsscriptIndex < jsScripts.length ; jsscriptIndex++) {

									loadScript("/"+ jsScripts[jsscriptIndex].path);
								}
							}catch(e){Log4r.warn(e);}


					jsonTxt = JSON.stringify(jsonTxt);
					jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
					Log4r.log("@!#!...jsonTxt", jsonTxt);

					const names = JSON.parse(jsonTxt).name;
					//const names = JSON.parse(res.text);
					GlobalHelper.globlevar['basicjson'] = JSON.parse(JSON.stringify(names));
					Log4r.log('LOGIN_AUTH data-service : call ', names);
					if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
						names['pr_mode'] = action.pr_mode; //Sprint 10 Task(69):Prompt mode will be added into names
						GlobalHelper.globlevar.raiseFalg = true;
					}
					GlobalHelper.globlevar.onScreenLoadSpin = false;
					GlobalHelper.globlevar["onload"] = true;
					if (action.orientationType !== undefined && action.orientationType.length !== 0) {
						names['orientationType'] = action.orientationType;

					} else {
						names['orientationType'] = "self";
					}
					names.data[0].name['layoutType'] = "CustomScreen";
					if(jsScripts != null){
							names.data[0].name['scriptsToLoad'] = jsScripts;
					}
					next({
						type: 'LAYOUTRIGHTICON_OK',
						names
					});
				});
			break;
			//Sprint 10 Issue :[START] Differentiating right side icon ajax call from worklist row click ajax call
		case 'INITIALSCREEN_old':
			GlobalHelper.globlevar.linkclicked = false;
			GlobalHelper.globlevar['isreadysaveclicked'] = true;
			contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
			contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

			url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"

			if(action.contextParam !== undefined && action.contextParam !== null && action.contextParam !== "null" )
			{ // changing url in case of custom code redirecting to function screen
				Log4r.log("action.contextParam value : " , action.contextParam);
				//let contextParamKeys = action.contextParam.split("=");
				//url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" +contextParamKeys[0] + "="  + encodeURIComponent(contextParamKeys[1]) + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
				GlobalHelper.globlevar.functionID = action.values; //updation of funtionID in case of custom code redirecting to Function Screen
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + action.contextParam + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
			}
			requestData = {
				'__functionId': action.values,
				'token': 'indus'
			};
			GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
			layoutID = action.values;
			if (preFetch()) {

				let INITIALSCREEN_GetTemplate  = url.split("?")[1];
				let _stdata_INITIALSCREEN_GetTemplate = getSTData("/"+GlobalHelper.menuContext+"/", INITIALSCREEN_GetTemplate);


				request
					.post(url + "layouttopicon")
					.query({_SID_:(_stdata_INITIALSCREEN_GetTemplate.SID + _stdata_INITIALSCREEN_GetTemplate.SINT)})
					.query({_ADF_:""})
					.send(JSON.stringify(requestData)) // sends a JSON post body
					.send({
						'__functionId': action.values,
						'token': 'indus'
					})
					.set('X-API-Key', action.values)
					.set('Accept', 'application/xml')
					.query({
						__functionId: action.values
					})
					.query({
						access: GlobalHelper.functionAccessMap.get(action.values)
					})
					.end((err, res) => {
						if (err) {
							// here is the auto-logout on rest call failed with 401 http status
							Log4r.log('data-service err: call', err);
							// Return the error action
							const names = JSON.parse('["/reactapp/app/index"]');
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						}
						Log4r.log('res.text ', res.text);
						var jsonText = res.text;
						let jsonObj = null
						jsonObj=removeBacksLashCharacter(res.text);
					
						isRequestStatus(next,jsonObj); // Check request status.
						Log4r.log('JSON retrived Object ', jsonObj);
						// GlobalHelper.globlevar['initialscreentemplate'] = jsonObj;
						GlobalHelper.globlevar['templetObject'] = jsonObj;
						try {
							GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
							let parentnode = new Model().handleDataChange(jsonObj);
							GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonObj;
							GlobalHelper.globlevar['parentnode'] = parentnode;
						} catch (e) {
							Log4r.error(e)
						}
						jsonObjtemplet = jsonObj.JSON_DATA;
						let buttonpalettes = jsonObj.BUTTON_JSON;
						let quickbuttons = jsonObj.QUICK_BUTTON_JSON;
						GlobalHelper.globlevar['templetObject'] = jsonObjtemplet; /*Sprint 8 : Added to  get template object in teable widget gor filter purpose */
						ACCESS_MODE =jsonObj.ACCESS_MODE;
						if (res.text !== undefined) {

							//loadScript('http://localhost/pdgic/secure/js/customcollectionutilsAll.js');
							let jsScripts = jsonObj.JSSCRIPTS;
							/*
							"JSSCRIPTS": [
								{
							      "path": "secure/scripts/ajax.js",
							      "ident": "ajax",
							      "order": "0"
							    }
						    ]

							*/
							//'http://localhost/pdgic/secure/js/customcollectionutilsAll.js'
							/*let jsScripts = [
												{
											      "path": "/secure/js/customcollectionutilsAll.js",
											      "ident": "ajax",
											      "order": "0"
											    }
										    ]*/
							try{
								loadScript("FrameworkUtility/customGenUtils.js");
								if(jsScripts != null)
								for (let jsscriptIndex = 0 ;  jsscriptIndex < jsScripts.length ; jsscriptIndex++) {

									loadScript("/"+ jsScripts[jsscriptIndex].path);
								}
							}catch(e){Log4r.warn(e);}
							var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
							var contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

							url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"

							let INITIALSCREEN_GetData  = url.split("?")[1];
							let _stdata_INITIALSCREEN_GetData = getSTData("/"+GlobalHelper.menuContext+"/", INITIALSCREEN_GetData);

							if (jsonObj.screenBasedOn !== "null" && jsonObj.screenBasedOn === "CUSTOM_JSON") {
								url = "/"+jsonObj.scrJSONPath;
								request
									.get(url)
									.query({_SID_:(_stdata_INITIALSCREEN_GetData.SID + _stdata_INITIALSCREEN_GetData.SINT)})
									.query({_ADF_:""})
									.send(JSON.stringify(requestData)) // sends a JSON post body
									.send({
										'linkoption': action.values,
										'token': 'indus'
									})
									.set('X-API-Key', action.values)
									.query({
										__functionId: action.values
									})
									.query({
										access: GlobalHelper.functionAccessMap.get(action.values)
									})
									.set('Accept', 'application/xml')
									.end((err, res) => {
										if (err) {
											Log4r.log('data-service err: call', err);
											return next({
												type: 'GET_NAMES_FAIL',
												names
											});
										}
										Log4r.log('res.text data ', res.text);
										var jsonText = res.text;
										let holdErrMesgOnLoad ;
										let succFlag = true;
										if (res.text !== "" && res.text !== undefined && res.text !== null)
									  {
									    let tempJson  = removeBacksLashCharacter(res.text);
									    let newErrJson ={};
									    if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
									    {
									      let errjsn = tempJson.__f2_messages__;
									      for (let i = 0; i < errjsn.length; i++)
									      {
									        if (errjsn[i][0] == "E") {
									          succFlag = false;
									          break;
									        }
									        //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
									        if (errjsn[i][0] == "D") {
									           Log4r.log("gfsadjhgsadj.........",errjsn);
														 let dialogTitle = "Dialog Box";
															if(!isempty(errjsn[i][4])){
																dialogTitle = errjsn[i][4];
															}
									           displayMessageBox(dialogTitle,errjsn[i][1],"I",null)
									           break;
									        }//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
									      }
									      newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
									    }
									    newErrJson['SuccessFlag'] = succFlag;
									    newErrJson['SuccessFlagReRender'] = true;
											holdErrMesgOnLoad = JSON.stringify(newErrJson);
									    // if (succFlag)
									    // {
									    //   holdErrMesgOnLoad = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
									    // }
									    // else {
									    // }
									    Log4r.log(newErrJson,"asfkuhg...",holdErrMesgOnLoad);
									  }
										let jsonObj = null
										jsonObj=removeBacksLashCharacter(res.text);
										
										isRequestStatus(next,jsonObj); // Check request status.
										try {
											Log4r.log('JSON retrived Object data ', jsonObj);
											GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
										} catch (e) {
											Log4r.log(e)
										}
										jsonObjdata = jsonObj.JSON_DATA;
										//ParentPK = new ParentPKComponentData();
										//ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);

										//let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
										let names = jsonObj.name;
										Log4r.log(JSON.stringify(names.name));
										var jsonTxt = JSON.stringify(names);
										//Depending upon if directly selected from user selector should redirect to UIScreen
										if (action.UserSelectorPrompt !== undefined && action.UserSelectorPrompt === true) {
											jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"ErrorMesgJsonOnload\": "+holdErrMesgOnLoad+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										} else {
											jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": "+holdErrMesgOnLoad+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										}
										names = JSON.parse(jsonTxt).name;
										Log4r.log("response data..", names);
										try{
										names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
										names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
										}catch(e){
											Log4r.log(e);
										}
										let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
										GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);

										//Sprint 11:Added to give an identification/notification that we need a "NEXT" button in UIScreen
										if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
											names['pr_mode'] = action.pr_mode;
											GlobalHelper.globlevar.raiseFalg = true;
										}

										if (action.orientationType !== undefined && action.orientationType.length !== 0) {
											names['orientationType'] = action.orientationType;
										} else {
											names['orientationType'] = "self";
											names['reassignF2FunctionTitle'] = "true";
											names['f2FunctionId'] = action.values;
										}
										names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
										GlobalHelper.globlevar.onScreenLoadSpin = false;
										GlobalHelper.globlevar["onload"] = true;
										names.data[0].name['functionID'] = action.values;
										if(jsScripts != null){
												names.data[0].name['scriptsToLoad'] = jsScripts;
										}
										if (postFetch()) {
											next({
												type: 'LAYOUTRIGHTICON_OK',
												names
											});
										} else {
											next({
												type: 'LAYOUTRIGHTICON_OK',
											});
										}
									})
							}
							else{
								request
									.post(url + "layouttopicondata")
									.query({_SID_:(_stdata_INITIALSCREEN_GetData.SID + _stdata_INITIALSCREEN_GetData.SINT)})
									.query({_ADF_:""})
									.send(JSON.stringify(requestData)) // sends a JSON post body
									.send({
										'linkoption': action.values,
										'token': 'indus'
									})
									.set('X-API-Key', action.values)
									.query({
										__functionId: action.values
									})
									.query({
										access: GlobalHelper.functionAccessMap.get(action.values)
									})
									.set('Accept', 'application/xml')
									.end((err, res) => {
										if (err) {
											Log4r.log('data-service err: call', err);
											return next({
												type: 'GET_NAMES_FAIL',
												names
											});
										}
										Log4r.log('res.text data ', res.text);
										var jsonText = res.text;
										let holdErrMesgOnLoad ;
										let succFlag = true;
										if (res.text !== "" && res.text !== undefined && res.text !== null)
									  {
									    let tempJson  = removeBacksLashCharacter(res.text);
									    let newErrJson ={};
									    if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
									    {
									      let errjsn = tempJson.__f2_messages__;
									      for (let i = 0; i < errjsn.length; i++)
									      {
									        if (errjsn[i][0] == "E") {
									          succFlag = false;
									          break;
									        }
									        //Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
									        if (errjsn[i][0] == "D") {
									           Log4r.log("gfsadjhgsadj.........",errjsn);
														 let dialogTitle = "Dialog Box";
															if(!isempty(errjsn[i][4])){
																dialogTitle = errjsn[i][4];
															}
									           displayMessageBox(dialogTitle,errjsn[i][1],"I",null)
									           break;
									        }//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
									      }
									      newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
									    }
									    newErrJson['SuccessFlag'] = succFlag;
									    newErrJson['SuccessFlagReRender'] = true;
											holdErrMesgOnLoad = JSON.stringify(newErrJson);
									    // if (succFlag)
									    // {
									    //   holdErrMesgOnLoad = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
									    // }
									    // else {
									    // }
									    Log4r.log(newErrJson,"asfkuhg...",holdErrMesgOnLoad);
									  }
										let jsonObj = null
										jsonObj=removeBacksLashCharacter(res.text);
										
										isRequestStatus(next,jsonObj); // Check request status.
										try {
											Log4r.log('JSON retrived Object data ', jsonObj);
											GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
										} catch (e) {
											Log4r.log(e)
										}
										jsonObjdata = jsonObj.JSON_DATA;
										ParentPK = new ParentPKComponentData();
										ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);

										let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
										Log4r.log(JSON.stringify(names));
										var jsonTxt = JSON.stringify(names);
										//Depending upon if directly selected from user selector should redirect to UIScreen
										if (action.UserSelectorPrompt !== undefined && action.UserSelectorPrompt === true) {
											jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"ErrorMesgJsonOnload\": "+holdErrMesgOnLoad+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										} else {
											jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": "+holdErrMesgOnLoad+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										}
										names = JSON.parse(jsonTxt).name;
										Log4r.log("response data..", names);
										try{
										names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
										names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
										}catch(e){
											Log4r.log(e);
										}
										let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
										GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);

										//Sprint 11:Added to give an identification/notification that we need a "NEXT" button in UIScreen
										if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
											names['pr_mode'] = action.pr_mode;
											GlobalHelper.globlevar.raiseFalg = true;
										}

										if (action.orientationType !== undefined && action.orientationType.length !== 0) {
											names['orientationType'] = action.orientationType;
										} else {
											names['orientationType'] = "self";
											names['reassignF2FunctionTitle'] = "true";
											names['f2FunctionId'] = action.values;
										}
										names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
										GlobalHelper.globlevar.onScreenLoadSpin = false;
										GlobalHelper.globlevar["onload"] = true;
										names.data[0].name['functionID'] = action.values;
										if(jsScripts != null){
												names.data[0].name['scriptsToLoad'] = jsScripts;
										}
										if (postFetch()) {
											next({
												type: 'LAYOUTRIGHTICON_OK',
												names
											});
										} else {
											next({
												type: 'LAYOUTRIGHTICON_OK',
											});
										}
									})
							}
						}
					});
			}
			break;
			//Sprint 10 Issue :[END]
			case 'INITIALSCREEN':
				GlobalHelper.globlevar.linkclicked = false;
				GlobalHelper.globlevar['isreadysaveclicked'] = true;
				
				contextprimarykeyvalue =  GlobalHelper.contextPrimaryKey.split('=');
				contextencodevalue = `${contextprimarykeyvalue[0]}=${encodeURIComponent(contextprimarykeyvalue[1])}`;
				
				url = `/${GlobalHelper.menuContext}/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=${GlobalHelper.listEntityId}&listEntityId=${GlobalHelper.listEntityId}&${GlobalHelper.contextPKValues}&${contextencodevalue}&${GlobalHelper.contextPrimaryKeyLength}&functionMode=F&`;
			  
				if (action.contextParam) { // action.contextParam is truthy
				  Log4r.log("action.contextParam value:", action.contextParam);
				  GlobalHelper.globlevar.functionID = action.values;
				  url = `/${GlobalHelper.menuContext}/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=${GlobalHelper.listEntityId}&listEntityId=${GlobalHelper.listEntityId}&${action.contextParam}&${GlobalHelper.contextPrimaryKeyLength}&functionMode=F&`;
				}
			  
				let requestData = {
				  '__functionId': action.values,
				  'token': 'indus'
				};
			  
				GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
				layoutID = action.values;
			  
				if (preFetch()) {
				  const INITIALSCREEN_GetTemplate = url.split("?")[1];
				  const _stdata_INITIALSCREEN_GetTemplate = getSTData(`/${GlobalHelper.menuContext}/`, INITIALSCREEN_GetTemplate);
			  
				  request.post(url + "layouttopicon")
					.query({ _SID_: (_stdata_INITIALSCREEN_GetTemplate.SID + _stdata_INITIALSCREEN_GetTemplate.SINT) })
					.query({ _ADF_: "" })
					.send(JSON.stringify(requestData))
					.set('X-API-Key', action.values)
					.set('Accept', 'application/xml')
					.query({ __functionId: action.values })
					.query({ access: GlobalHelper.functionAccessMap.get(action.values) })
					.end((err, res) => {
					  if (err) {
						Log4r.log('data-service err: call', err);
						return next({ type: 'GET_NAMES_FAIL', names: JSON.parse('["/reactapp/app/index"]') });
					  }
			  
					  Log4r.log('res.text', res.text);
					  let jsonObj = removeBacksLashCharacter(res.text);
					  
					  isRequestStatus(next, jsonObj); // Check request status.
					  Log4r.log('JSON retrieved Object', jsonObj);
			  
					  // Store the template object globally
					  GlobalHelper.globlevar['templetObject'] = jsonObj;
					  try {
						GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
						const parentnode = new Model().handleDataChange(jsonObj);
						GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonObj;
						GlobalHelper.globlevar['parentnode'] = parentnode;
					  } catch (e) {
						Log4r.error(e);
					  }
			  
					  const jsonObjtemplet = jsonObj.JSON_DATA;
					  const buttonpalettes = jsonObj.BUTTON_JSON;
					  const quickbuttons = jsonObj.QUICK_BUTTON_JSON;
			  
					  // Update global template object for filtering purpose
					  GlobalHelper.globlevar['templetObject'] = jsonObjtemplet;
			  
					  // Loading any necessary scripts
					  if (jsonObj.JSSCRIPTS) {
						try {
						  loadScript("FrameworkUtility/customGenUtils.js");
						  jsonObj.JSSCRIPTS.forEach(script => {
							loadScript(`/${script.path}`);
						  });
						} catch (e) {
						  Log4r.warn(e);
						}
					  }
			  
					  url = `/${GlobalHelper.menuContext}/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=${GlobalHelper.listEntityId}&${GlobalHelper.contextPKValues}&${contextencodevalue}&listEntityId=${GlobalHelper.listEntityId}&${GlobalHelper.contextPrimaryKeyLength}&functionMode=F&`;
			  
					  const INITIALSCREEN_GetData = url.split("?")[1];
					  const _stdata_INITIALSCREEN_GetData = getSTData(`/${GlobalHelper.menuContext}/`, INITIALSCREEN_GetData);
			  
					  if (jsonObj.screenBasedOn !== "null" && jsonObj.screenaBsedOn === "CUSTOM_JSON") {
						url = `/${jsonObj.scrJSONPath}`;
						request.get(url)
						  .query({ _SID_: (_stdata_INITIALSCREEN_GetData.SID + _stdata_INITIALSCREEN_GetData.SINT) })
						  .query({ _ADF_: "" })
						  .send(JSON.stringify(requestData))
						  .send({ 'linkoption': action.values, 'token': 'indus' })
						  .set('X-API-Key', action.values)
						  .query({ __functionId: action.values })
						  .query({ access: GlobalHelper.functionAccessMap.get(action.values) })
						  .set('Accept', 'application/xml')
						  .end((err, res) => {
							if (err) {
							  Log4r.log('data-service err: call', err);
							  return next({ type: 'GET_NAMES_FAIL', names: JSON.parse('["/reactapp/app/index"]') });
							}
			  
							Log4r.log('res.text data', res.text);
							let holdErrMesgOnLoad;
							let succFlag = true;
							if (res.text) {
							  const tempJson = removeBacksLashCharacter(res.text);
							  let newErrJson = {};
							  if (tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0) {
								const errjsn = tempJson.__f2_messages__;
								for (let i = 0; i < errjsn.length; i++) {
								  if (errjsn[i][0] === "E") {
									succFlag = false;
									break;
								  }
								  if (errjsn[i][0] === "D") {
									Log4r.log("gfsadjhgsadj.........", errjsn);
									const dialogTitle = errjsn[i][4] || "Dialog Box";
									displayMessageBox(dialogTitle, errjsn[i][1], "I", null);
									break;
								  }
								}
								newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
							  }
							  newErrJson['SuccessFlag'] = succFlag;
							  newErrJson['SuccessFlagReRender'] = true;
							  holdErrMesgOnLoad = JSON.stringify(newErrJson);
							}
			  
							let jsonObj = removeBacksLashCharacter(res.text);
							isRequestStatus(next, jsonObj);
			  
							try {
							  Log4r.log('JSON retrieved Object data', jsonObj);
							  GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
							} catch (e) {
							  Log4r.log(e);
							}
			  
							//const jsonObjdata = jsonObj.JSON_DATA;
							let names = jsonObj.name;
							Log4r.log(JSON.stringify(names.name));
			  
							let jsonTxt = JSON.stringify(names);
							if (action.UserSelectorPrompt) {
							  jsonTxt = `{"name": {"LayoutName": "MainLayout","ScreenLayoutName": "UIScreen","ErrorMesgJsonOnload": ${holdErrMesgOnLoad},"LayoutHeader": "","data":[{"name": ${jsonTxt}}]}}`;
							} else {
							  jsonTxt = `{"name": {"LayoutName": "MainLayout","ScreenLayoutName": "#","ErrorMesgJsonOnload": ${holdErrMesgOnLoad},"LayoutHeader": "","data":[{"name": ${jsonTxt}}]}}`;
							}
			  
							names = JSON.parse(jsonTxt).name;
			  
							try {
							  names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
							  names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
							} catch (e) {
							  Log4r.log(e);
							}
			  
							//const holdbasicdataabc = { ...names };
							GlobalHelper.globlevar['basicjson'] = { ...names };
			  
							if (action.pr_mode) {
							  names['pr_mode'] = action.pr_mode;
							  GlobalHelper.globlevar.raiseFalg = true;
							}
			  
							names['orientationType'] = action.orientationType || "self";
							names['reassignF2FunctionTitle'] = names['orientationType'] === "self" ? "true" : undefined;
							names['f2FunctionId'] = action.values;
							names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
							GlobalHelper.globlevar.onScreenLoadSpin = false;
							GlobalHelper.globlevar["onload"] = true;
							names.data[0].name['functionID'] = action.values;
			  
							if (jsonObj.JSSCRIPTS) {
							  names.data[0].name['scriptsToLoad'] = jsonObj.JSSCRIPTS;
							}
			  
							if (postFetch()) {
							  next({ type: 'LAYOUTRIGHTICON_OK', names });
							} else {
							  next({ type: 'LAYOUTRIGHTICON_OK' });
							}
						  });
					   }
					   else{
						request
							.post(url + "layouttopicondata")
							.query({_SID_:(_stdata_INITIALSCREEN_GetData.SID + _stdata_INITIALSCREEN_GetData.SINT)})
							.query({_ADF_:""})
							.send(JSON.stringify(requestData)) // sends a JSON post body
							.send({
								'linkoption': action.values,
								'token': 'indus'
							})
							.set('X-API-Key', action.values)
							.query({
								__functionId: action.values
							})
							.query({
								access: GlobalHelper.functionAccessMap.get(action.values)
							})
							.set('Accept', 'application/xml')
							.end((err, res) => {
								if (err) {
									Log4r.log('data-service err: call', err);
									return next({
										type: 'GET_NAMES_FAIL',
										names
									});
								}
								Log4r.log('res.text data ', res.text);
								// var jsonText = res.text;
								let holdErrMesgOnLoad ;
								let succFlag = true;
								if (res.text !== "" && res.text !== undefined && res.text !== null)
							  {
								let tempJson  = removeBacksLashCharacter(res.text);
								let newErrJson ={};
								if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
								{
								  let errjsn = tempJson.__f2_messages__;
								  for (let i = 0; i < errjsn.length; i++)
								  {
									if (errjsn[i][0] == "E") {
									  succFlag = false;
									  break;
									}
									//Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
									if (errjsn[i][0] == "D") {
									   Log4r.log("gfsadjhgsadj.........",errjsn);
												 let dialogTitle = "Dialog Box";
													if(!isempty(errjsn[i][4])){
														dialogTitle = errjsn[i][4];
													}
									   displayMessageBox(dialogTitle,errjsn[i][1],"I",null)
									   break;
									}//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
								  }
								  newErrJson['__f2_messages__'] = JSON.parse(JSON.stringify(errjsn));
								}
								newErrJson['SuccessFlag'] = succFlag;
								newErrJson['SuccessFlagReRender'] = true;
									holdErrMesgOnLoad = JSON.stringify(newErrJson);
								// if (succFlag)
								// {
								//   holdErrMesgOnLoad = JSON.stringify(newErrJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
								// }
								// else {
								// }
								Log4r.log(newErrJson,"asfkuhg...",holdErrMesgOnLoad);
							  }
								let jsonObj = null
								jsonObj=removeBacksLashCharacter(res.text);
								
								isRequestStatus(next,jsonObj); // Check request status.
								try {
									Log4r.log('JSON retrived Object data ', jsonObj);
									GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
								} catch (e) {
									Log4r.log(e)
								}
								jsonObjdata = jsonObj.JSON_DATA;
								ParentPK = new ParentPKComponentData();
								ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);

								let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
								Log4r.log(JSON.stringify(names));
								var jsonTxt = JSON.stringify(names);
								//Depending upon if directly selected from user selector should redirect to UIScreen
								if (action.UserSelectorPrompt !== undefined && action.UserSelectorPrompt === true) {
									jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"ErrorMesgJsonOnload\": "+holdErrMesgOnLoad+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
								} else {
									jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"ErrorMesgJsonOnload\": "+holdErrMesgOnLoad+",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
								}
								names = JSON.parse(jsonTxt).name;
								Log4r.log("response data..", names);
								try{
								names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
								names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
								}catch(e){
									Log4r.log(e);
								}
								let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
								GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);

								//Sprint 11:Added to give an identification/notification that we need a "NEXT" button in UIScreen
								if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
									names['pr_mode'] = action.pr_mode;
									GlobalHelper.globlevar.raiseFalg = true;
								}

								if (action.orientationType !== undefined && action.orientationType.length !== 0) {
									names['orientationType'] = action.orientationType;
								} else {
									names['orientationType'] = "self";
									names['reassignF2FunctionTitle'] = "true";
									names['f2FunctionId'] = action.values;
								}
								names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
								GlobalHelper.globlevar.onScreenLoadSpin = false;
								GlobalHelper.globlevar["onload"] = true;
								names.data[0].name['functionID'] = action.values;
								if(jsonObj.JSSCRIPTS != null){
										names.data[0].name['scriptsToLoad'] = jsonObj.JSSCRIPTS;
								}
								if (postFetch()) {
									next({
										type: 'LAYOUTRIGHTICON_OK',
										names
									});
								} else {
									next({
										type: 'LAYOUTRIGHTICON_OK',
									});
								}
							})
						}
					});
				}
				break;
			  
		case 'INITIALUISCREEN':
			//Sprint 9 (Task 60):[START] Added variable and two extra ajax call to get hedaer template and data.
			GlobalHelper.globlevar.linkclicked = false;
			let headerNames = {};
			contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
			contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
			url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" +contextencodevalue+ "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&";

			/*if(action.contextParam !== undefined && action.contextParam !== null && action.contextParam !== "null" )
			{ // changing url in case of custom code redirecting to function screen
				let contextParamKeys = action.contextParam.split("=");
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + contextParamKeys[0] + "="  + encodeURIComponent(contextParamKeys[1])  + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
			}*/
			if(action.contextParam !== undefined && action.contextParam !== null && action.contextParam !== "null" )
			{ // changing url in case of custom code redirecting to function screen
				Log4r.log("action.contextParam value : " , action.contextParam);
				//let contextParamKeys = action.contextParam.split("=");
				//url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" +contextParamKeys[0] + "="  + encodeURIComponent(contextParamKeys[1]) + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
				GlobalHelper.globlevar.functionID = action.values;//updation of funtionID in case of custom code redirecting to Function Screen
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + action.contextParam + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
			}
			requestData = {
				'__functionId': action.headerFunctionId,
				'token': 'indus'
			};

			let INITIALUISCREEN_Header_GetTemplate  = url.split("?")[1];
			let _stdata_INITIALUISCREEN_Header_GetTemplate = getSTData("/"+GlobalHelper.menuContext+"/", INITIALUISCREEN_Header_GetTemplate);

			request
				.post(url)
				.query({_SID_:(_stdata_INITIALUISCREEN_Header_GetTemplate.SID + _stdata_INITIALUISCREEN_Header_GetTemplate.SINT)})
				.query({_ADF_:""})
				.send(JSON.stringify(requestData))
				.send({
					'__functionId': action.headerFunctionId,
					'token': 'indus'
				})
				.set('X-API-Key', action.headerFunctionId)
				.set('Accept', 'application/xml')
				.query({
					__functionId: action.headerFunctionId
				})
				.query({
					access: GlobalHelper.functionAccessMap.get(action.headerFunctionId)
				})
				.end((err, res) => {
					GlobalHelper.globlevar.savespin=false;
					if (err) {
						Log4r.log("Error In  Fetching Header Data");
					} else {
						// var jsonTxt = res.text;
						let jsonObj = null;
						jsonObj=removeBacksLashCharacter(res.text);
					
						isRequestStatus(next,jsonObj); // Check request status.
						var jsonObjtemplet = jsonObj.JSON_DATA;
						contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
						contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
						var dataUrl = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&";

						let INITIALUISCREEN_Header_GetData  = dataUrl.split("?")[1];
						let _stdata_INITIALUISCREEN_Header_GetData = getSTData("/"+GlobalHelper.menuContext+"/", INITIALUISCREEN_Header_GetData);


						request
							.post(dataUrl)
							.query({_SID_:(_stdata_INITIALUISCREEN_Header_GetData.SID + _stdata_INITIALUISCREEN_Header_GetData.SINT)})
							.query({_ADF_:""})
							.send(JSON.stringify({
								'__functionId': action.headerFunctionId,
								'token': 'indus'
							}))
							.send({
								'linkoption': action.headerFunctionId,
								'token': 'indus'
							})
							.set('X-API-Key', action.headerFunctionId)
							.query({
								__functionId: action.headerFunctionId
							})
							.query({
								access: GlobalHelper.functionAccessMap.get(action.headerFunctionId)
							})
							.set('Accept', 'application/xml')
							.end((err, res) => {
								if (err) {
									Log4r.log("ERROR IN GET DATA OF HEADER");
								} else {
									var jsonTxt = res.text;
									let jsonObj1 = null;
									jsonObj1=removeBacksLashCharacter(jsonTxt);
								
									isRequestStatus(next,jsonObj1); // Check request status.
									let jsonObjdata = jsonObj1.JSON_DATA;
									let names = new ReactJsonBuilder(jsonObjtemplet, action.headerFunctionId, jsonObjdata).buildReactJson();
									Log4r.log("React Header Builder Ouptput", names);
									headerNames = names;
									Log4r.log('INITIALSCREEN values Containers : call & state = ', action.values);
									var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
									var contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

									url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getTemplate&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"
									var requestData = {
										'__functionId': action.values,
										'token': 'indus'
									};
									GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
									layoutID = action.values;
									Log4r.log('url--', url);
									Log4r.log('values of Playload : call & state = ', requestData);
									if (preFetch()) {

										let INITIALUISCREEN_GetTemplate  = url.split("?")[1];
										let _stdata_INITIALUISCREEN_GetTemplate = getSTData("/"+GlobalHelper.menuContext+"/", INITIALUISCREEN_GetTemplate);

										request
											.post(url + "layouttopicon")
											.query({_SID_:(_stdata_INITIALUISCREEN_GetTemplate.SID + _stdata_INITIALUISCREEN_GetTemplate.SINT)})
											.query({_ADF_:""})
											.send(JSON.stringify(requestData)) // sends a JSON post body
											.send({
												'__functionId': action.values,
												'token': 'indus'
											})
											.set('X-API-Key', action.values)
											.set('Accept', 'application/xml')
											.query({
												__functionId: action.values
											})
											.query({
												access: GlobalHelper.functionAccessMap.get(action.values)
											})
											.end((err, res) => {
												if (err) {
													// here is the auto-logout on rest call failed with 401 http status
													// Return the error action
													const names = JSON.parse('["/reactapp/app/index"]');
													return next({
														type: 'GET_NAMES_FAIL',
														names
													});
												}
												Log4r.log('res.text ', res.text);
												// var jsonText = res.text;
												let jsonObj = null
												jsonObj=removeBacksLashCharacter(res.text);
											
												isRequestStatus(next,jsonObj); // Check request status.
												GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
												let parentnode = new Model().handleDataChange(jsonObj);
												GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonObj;
												GlobalHelper.globlevar['parentnode'] = parentnode;
												jsonObjtemplet = jsonObj.JSON_DATA;
												let buttonpalettes = jsonObj.BUTTON_JSON;
												let quickbuttons = jsonObj.QUICK_BUTTON_JSON;
												ACCESS_MODE =jsonObj.ACCESS_MODE;
												GlobalHelper.globlevar['templetObject'] = jsonObjtemplet; /*Sprint 8 : Added to  get template object in teable widget gor filter purpose */
												if (res.text !== undefined) {
													//loadScript('http://localhost/pdgic/secure/js/customcollectionutilsAll.js');
													let jsScripts = jsonObj.JSSCRIPTS;
													/*
													"JSSCRIPTS": [
														{
													      "path": "secure/scripts/ajax.js",
													      "ident": "ajax",
													      "order": "0"
													    }
												    ]

													*/
													//'http://localhost/pdgic/secure/js/customcollectionutilsAll.js'
													/*let jsScripts = [
																		{
																	      "path": "/secure/js/customcollectionutilsAll.js",
																	      "ident": "ajax",
																	      "order": "0"
																	    }
																    ]*/
													try{
														loadScript("FrameworkUtility/customGenUtils.js");
														if(jsScripts != null)
														for (let jsscriptIndex = 0 ;  jsscriptIndex < jsScripts.length ; jsscriptIndex++) {

															loadScript("/"+ jsScripts[jsscriptIndex].path);
														}
												  }catch(e){Log4r.warn(e);}
													var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
													var contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

													url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&"

													let INITIALUISCREEN_GetData  = url.split("?")[1];
													let _stdata_INITIALUISCREEN_GetData = getSTData("/"+GlobalHelper.menuContext+"/", INITIALUISCREEN_GetData);

													if (jsonObj.screenBasedOn !== "null" && jsonObj.screenBasedOn === "CUSTOM_JSON") {
														url = "/"+jsonObj.scrJSONPath;
														request
															.get(url + "layouttopicondata")
															.query({_SID_:(_stdata_INITIALUISCREEN_GetData.SID + _stdata_INITIALUISCREEN_GetData.SINT)})
															.query({_ADF_:""})
															.send(JSON.stringify(requestData)) // sends a JSON post body
															.send({
																'linkoption': action.values,
																'token': 'indus'
															})
															.set('X-API-Key', action.values)
															.query({
																__functionId: action.values
															})
															.query({
																access: GlobalHelper.functionAccessMap.get(action.values)
															})
															.set('Accept', 'application/xml')
															.end((err, res) => {
																if (err) {
																	Log4r.log('data-service err: call', err);
																	return next({
																		type: 'GET_NAMES_FAIL',
																		names
																	});
																}

																Log4r.log('res.text data ', res.text);
																var jsonText = res.text;
																let jsonObj = null
																jsonObj=removeBacksLashCharacter(jsonText);
															
																isRequestStatus(next,jsonObj); // Check request status.
																try {
																	Log4r.log('JSON retrived Object data ', jsonObj);
																	GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
																	Log4r.log('JSON retrived Object data result ', GlobalHelper.globlevar['jsonObjgetData']);
																} catch (e) {
																	Log4r.log(e)
																}

																jsonObjdata = jsonObj.JSON_DATA;
																//ParentPK= new ParentPKComponentData().getParentQueryString(jsonObjtemplet,jsonObjdata);
																//ParentPK = new ParentPKComponentData();
																//ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);

																//let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
																let names = jsonObj.name;
																Log4r.log(JSON.stringify(names.name));
																var jsonTxt = JSON.stringify(names);
																//Depending upon if directly selected from user selector should redirect to UIScreen
																if (action.UserSelectorPrompt !== undefined && action.UserSelectorPrompt === true) {
																	jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
																} else {
																	jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
																}
																names = JSON.parse(jsonTxt).name;
																Log4r.log("response data..", names);
																try{
																	names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
																	names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
																}catch(e){
																	Log4r.log(e);
																}
																let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
																GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);

																//Sprint 9 (Task 60):Added ajax call data into names variable to access thos into uiScreen through mapStateToProps
																names['headerNames'] = headerNames;
																if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
																	names['pr_mode'] = action.pr_mode; //Sprint 10 Task(69):Prompt mode will be added into names
																	GlobalHelper.globlevar.raiseFalg = true;
																}else{
																	GlobalHelper.globlevar['menuFunctionFlag'] = false;
																}

																if (action.orientationType !== undefined && action.orientationType.length !== 0) {
																	names['orientationType'] = action.orientationType;
																} else {
																	names['orientationType'] = "self";
																	names['reassignF2FunctionTitle'] = "true";
																	names['f2FunctionId'] = action.values;
																}
																GlobalHelper.globlevar.onScreenLoadSpin = false;
																GlobalHelper.globlevar["onload"] = true;
																names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
																names.data[0].name['functionID'] = action.values;
																if(jsScripts != null){
																		names.data[0].name['scriptsToLoad'] = jsScripts;
																}
																if (postFetch()) {
																	next({
																		type: 'LAYOUTRIGHTICON_OK',
																		names
																	});
																} else {
																	next({
																		type: 'LAYOUTRIGHTICON_OK',
																	});
																}
															})
													}
													else{
														request
															.post(url + "layouttopicondata")
															.query({_SID_:(_stdata_INITIALUISCREEN_GetData.SID + _stdata_INITIALUISCREEN_GetData.SINT)})
															.query({_ADF_:""})
															.send(JSON.stringify(requestData)) // sends a JSON post body
															.send({
																'linkoption': action.values,
																'token': 'indus'
															})
															.set('X-API-Key', action.values)
															.query({
																__functionId: action.values
															})
															.query({
																access: GlobalHelper.functionAccessMap.get(action.values)
															})
															.set('Accept', 'application/xml')
															.end((err, res) => {
																if (err) {
																	Log4r.log('data-service err: call', err);
																	return next({
																		type: 'GET_NAMES_FAIL',
																		names
																	});
																}

																Log4r.log('res.text data ', res.text);
																var jsonText = res.text;
																let jsonObj = null
																jsonObj=removeBacksLashCharacter(jsonText);
																
																isRequestStatus(next,jsonObj); // Check request status.
																try {
																	Log4r.log('JSON retrived Object data ', jsonObj);
																	GlobalHelper.globlevar['jsonObjgetData'] = JSON.stringify(jsonObj);
																	Log4r.log('JSON retrived Object data result ', GlobalHelper.globlevar['jsonObjgetData']);
																} catch (e) {
																	Log4r.log(e)
																}

																jsonObjdata = jsonObj.JSON_DATA;
																//ParentPK= new ParentPKComponentData().getParentQueryString(jsonObjtemplet,jsonObjdata);
																ParentPK = new ParentPKComponentData();
																ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);

																let names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
																Log4r.log(JSON.stringify(names));
																var jsonTxt = JSON.stringify(names);
																//Depending upon if directly selected from user selector should redirect to UIScreen
																if (action.UserSelectorPrompt !== undefined && action.UserSelectorPrompt === true) {
																	jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
																} else {
																	jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
																}
																names = JSON.parse(jsonTxt).name;
																Log4r.log("response data..", names);
																try{
																	names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
																	names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
																}catch(e){
																	Log4r.log(e);
																}
																let holdbasicdataabc = Object.assign({}, JSON.parse(JSON.stringify(names)));
																GlobalHelper.globlevar['basicjson'] = Object.assign({}, holdbasicdataabc);

																//Sprint 9 (Task 60):Added ajax call data into names variable to access thos into uiScreen through mapStateToProps
																names['headerNames'] = headerNames;
																if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
																	names['pr_mode'] = action.pr_mode; //Sprint 10 Task(69):Prompt mode will be added into names
																	GlobalHelper.globlevar.raiseFalg = true;
																}else{
																	GlobalHelper.globlevar['menuFunctionFlag'] = false;
																}

																if (action.orientationType !== undefined && action.orientationType.length !== 0) {
																	names['orientationType'] = action.orientationType;
																} else {
																	names['orientationType'] = "self";
																	names['reassignF2FunctionTitle'] = "true";
																	names['f2FunctionId'] = action.values;
																}
																GlobalHelper.globlevar.onScreenLoadSpin = false;
																GlobalHelper.globlevar["onload"] = true;
																names.data[0].name['ACCESS_MODE'] = ACCESS_MODE;
																names.data[0].name['functionID'] = action.values;
																if(jsScripts != null){
																		names.data[0].name['scriptsToLoad'] = jsScripts;
																}
																if (postFetch()) {
																	next({
																		type: 'LAYOUTRIGHTICON_OK',
																		names
																	});
																} else {
																	next({
																		type: 'LAYOUTRIGHTICON_OK',
																	});
																}
															})
													}

												}
											});
									}
								} // Else part of response of header data.
							}); // END REQUEST DATA OF HEADER.
					} // Else part of respnse of hedaer template.
				}); // END REQUEST TEMPLATE OF HEADER.
			//Sprint 9 (Task 60):[END]
			break;

			//Sprint 11: Task 83 No Hedaer Configuration Handling :[START] Restored INITIALSCREEN_BKP to previous code(Removed dependancy of header template file in public to render header.)
		/*case 'INITIALSCREEN_BKP':
			var url22;
			var scrn = undefined;
			GlobalHelper.holdFunGroupData.forEach((value, key, map) => {
				Log4r.log("value, key, map", value, key, map);
				Log4r.log(`m[${key}] = ${value}`);
				for (var i = 0; i < value.content.length; i++) {
					if (scrn == undefined) {
						scrn = value.content[i];
					}
				}
			})
			var requestData = {
				'linkoption': action.values,
				'token': 'indus'
			};
			//url22 = "/timelinejson.json";
			url22="/summaryDetails.json";
			Log4r.log('values of Playload : call & state = ', requestData);
			request
				.get(url22)
				.set('Accept', 'application/json')
				.end((err, res) => {
					if (err) {
						// here is the auto-logout on rest call failed with 401 http status
						// Return the error action
						//const names = JSON.parse('["/reactapp/app/index"]');
						return next({
							type: 'GET_NAMES_FAIL',
							names
						});
					}
					let jsonTxt = JSON.parse(res.text).name;
					jsonTxt = JSON.stringify(jsonTxt);
					Log4r.log("!@@3...jsonTxt ", jsonTxt);
					jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
					Log4r.log('LOGIN_AUTH data-service : call ', jsonTxt);
					Log4r.log("@!#!...jsonTxt", jsonTxt);
					const names = JSON.parse(jsonTxt).name;
					Log4r.log('LOGIN_AUTH data-service : call ', names);
					if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
						names['pr_mode'] = action.pr_mode; //Sprint 10 Task(69):Prompt mode will be added into names
						GlobalHelper.globlevar.raiseFalg = true;
					}
					next({
						type: 'LAYOUTRIGHTICON_OK',
						names
					});
				});
			break;
			//Sprint 11: Task 83 No Hedaer Configuration Handling :[END].
		*/
		case 'LAYOUTRIGHTICON':
			Log4r.log('LAYOUTRIGHTICON values Containers : call & state = ', action.values);
			requestData = {
				'linkoption': action.values,
				'token': 'indus'
			};
			GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.values;
			Log4r.log('values of Playload : call & state = ', requestData);
			if (action.values.groupid === "FG_PENTITY") {
				Log4r.log("FG_PENTITY....Mail.json");
				url = "http://localhost/Mail.json";
			} else if (false) {
				url = "http://localhost/radio.json";
			} else {
				url = "http://localhost/radio.json";
				Log4r.log("default.....radio.json");
			}

			let LAYOUTRIGHTICON_PostDataUrl  = url.split("?")[1];
			let _stdata_LAYOUTRIGHTICON_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", LAYOUTRIGHTICON_PostDataUrl);

			request
				.get(url)
				.query({_SID_:(_stdata_LAYOUTRIGHTICON_PostDataUrl.SID + _stdata_LAYOUTRIGHTICON_PostDataUrl.SINT)})
				.query({_ADF_:""})
				.set('Accept', 'application/json')
				.end((err, res) => {
					if (err) {
						// here is the auto-logout on rest call failed with 401 http status
						// Return the error action
						//const names = JSON.parse('["/reactapp/app/index"]');
						return next({
							type: 'GET_NAMES_FAIL',
							names
						});
					}
					let jsonObj = undefined;
					jsonObj=removeBacksLashCharacter(res.text);
					isRequestStatus(next,jsonObj); // Check request status.
					let jsonTxt = JSON.parse(res.text).name;
					jsonTxt = JSON.stringify(jsonTxt);
					Log4r.log("!@@3...jsonTxt ", jsonTxt);
					jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
					Log4r.log('LOGIN_AUTH data-service : call ', jsonTxt);
					const names = JSON.parse(jsonTxt).name;
					Log4r.log('LOGIN_AUTH data-service : call ', names);
					next({
						type: 'LAYOUTRIGHTICON_OK',
						names
					});
				});
			break;

			case 'SAVEDATABULKOPERATION':
			Log4r.log("action.values=>",action, action.values);
			let holdNamess = action.values.screenJsn;
				let utilObject = new onPreSaveUtil(action.values.domaindata , action.buttonIdOnsave );
				let method = "onSavecollectionutil";
				GlobalHelper.globlevar['toControlUpdateErrCheck'] = true;
				let tmpArrVar = utilObject[method](action.values.name);
				contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
				contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
				GlobalHelper.globlevar['buttonSpin'] = false;
				if (tmpArrVar !== undefined && tmpArrVar !== null && tmpArrVar[0] !== undefined && tmpArrVar[0] != false) {
					GlobalHelper.globlevar['toControlUpdateErrCheck'] = false;
					Log4r.warn("error found....");
					Log4r.log('data-service err: call', );
					// Return the error action
					var txml = "<root><ERROR></ERROR></root>"
					var xmlDoc = $.parseXML(txml);
					var $xml = $(xmlDoc);
					var $title = $xml.find("success");
					var jsonText = $title.text();
					var jsonTxt;
					var errjson;
					var parseString = require('xml2js').parseString;
					var xml = txml;
					parseString(xml, function (err, result) {
						errjson = result;
						Log4r.log("result else ", result);
						Log4r.dir(result);
					});
					jsonTxt = JSON.stringify(errjson.root);
					Log4r.log("jsonTxt==>", jsonTxt);
					jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
					let names = JSON.parse(jsonTxt).name;
					names['orientationType'] = "self";
					Log4r.log('JSON retrived ', jsonTxt);
					Log4r.log('LOGIN_AUTH data-service : call ', names);
					next({
						type: 'SAVEDATA_OK',
						names
					});
				} else {
					requestData = {
						'domaindata': action.values.domaindata,
						'pk': pkvalue
					};
					var functionMode = "F";
					if (GlobalHelper.globlevar['functionMode'] == "B") {
						GlobalHelper.globlevar['functionMode'] = undefined;
						functionMode = "B";
					}
					else if(GlobalHelper.globlevar['functionMode'] == "Q") {
						GlobalHelper.globlevar['functionMode'] = undefined;
						functionMode = "Q";
					}
					if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
						url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['summaryConfigTypeFunctionid'] + "&functionMode=" + functionMode + "&"
					} else {
						Log4r.log("in else")
						url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['savedFunctionID'] + "&functionMode=" + functionMode + "&"
					}
					if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
						url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&" + GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + "&"
					}
					if (GlobalHelper.globlevar['bulkoperations'] == true) {
						GlobalHelper.globlevar['bulkoperations'] = false;
						GlobalHelper.globlevar['savedFunctionID'] = undefined;
					}
					var xpath = action.values.domaindata;

					if(tmpArrVar != null){
						if(tmpArrVar[1] != null && tmpArrVar[1] !== "")
						{
							xpath = tmpArrVar[1];
						}
					}

					if (GlobalHelper.globlevar['savedFunctionID'] == "cb6b6e9465c04df9809fe6aea2b1df17") { // xpath changed for given function id to remove _mode value
						xpath = xpath.replace(/_mode=U/g, '_mode='); // all row need to replace mode by null;
					}
					// SET AT CALLSAVE METHOD IN UISCREEN. FOR CALCULATE USER SPEND TIME ON SCREEN.
					xpath = xpath + "&lsecondSpend=" + GlobalHelper.globlevar['SecondSpendOnScreen'] +"&";
					if (preSave()) {

						let SAVEDATABULKOPERATION_PostDataUrl  = url.split("?")[1];
						let _stdata_SAVEDATABULKOPERATION_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", SAVEDATABULKOPERATION_PostDataUrl);


						request
							.post(url)
							.query({_SID_:(_stdata_SAVEDATABULKOPERATION_PostDataUrl.SID + _stdata_SAVEDATABULKOPERATION_PostDataUrl.SINT)})
							.query({_ADF_:""})
							.send(xpath)
							.send(GlobalHelper.contextPKValues)
							.set('Accept', 'application/xml')
							.set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8;')
							.end((err, res) => {
								if (err) {
									Log4r.log('data-service err: call', err);
									// Return the error action
									const names = JSON.parse('["/reactapp/app/index"]');
									return next({
										type: 'GET_NAMES_FAIL',
										names
									});
								}
					            else
					            {
					                var txml;
					                let succFlag = true;
					                Log4r.log('res.text ', res.text);
													let jsonTxt22 = res.text;
					                if (jsonTxt22 !== "" && jsonTxt22 !== undefined && jsonTxt22 !== null)
					                {			let jsonObj = undefined;
										jsonObj=removeBacksLashCharacter(jsonTxt22);
										let tempJson=jsonObj;		
										isRequestStatus(next,jsonObj);
									
										var gridWorklistErrJsn = {};
										if (tempJson !== "" && tempJson !== undefined && tempJson !== null && Array.isArray(tempJson))
										{
											tempJson.map((eachObj,indx)=>{    // NOSONAR: javascript:S2201
												if(eachObj.__f2_messages__ && eachObj.__f2_messages__.length > 0)
												{
													let rowObj = ErrorHandler.getSampleJsn();
													let temvar = eachObj.__f2_messages__;
													let errMsg = [];
													temvar.forEach(element => {
														if (element[0] == "E") {
															errMsg.push(element);
														}
													});
													if (errMsg && errMsg.length != 0) {
														succFlag = false;
														rowObj['color'] = '#f5222d';
														eachObj.__f2_messages__ = errMsg;
													}
													temvar = eachObj.__f2_messages__;

													for (let i = 0; i < temvar.length; i++)
													{
														if (temvar[i][2] !== "")
														{
															holdNamess.screendata.map((scrn,scrnIndx)=>{    // NOSONAR: javascript:S2201
																let resWdgt = scrn.uiSchema[0].children.filter(widgt => widgt.children.xPath === temvar[i][2])[0]
																if (resWdgt)
																{
																	if (scrn.schema[0][resWdgt.children.fieldPath].title !== "") {
																		temvar[i][1] = scrn.schema[0][resWdgt.children.fieldPath].title +" : "+temvar[i][1];
																	}
																}
															})
														}
														rowObj[temvar[i][0]][rowObj[temvar[i][0]].length] = temvar[i][1];
													}
													if (rowObj['color'] === "") {
														rowObj['color'] = '#29f743';
													}
													gridWorklistErrJsn[indx] = rowObj;
												}
											})

										}
										else{
											if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
											{
												let rowObj = ErrorHandler.getSampleJsn();
												Log4r.log("rowObj=",rowObj);
												let temvar = tempJson.__f2_messages__;
												for (let i = 0; i < temvar.length; i++)
												{
													if (temvar[i][2] !== "")
													{
														holdNamess.screendata.map((scrn,scrnIndx)=>{    // NOSONAR: javascript:S2201
															let resWdgt = scrn.uiSchema[0].children.filter(widgt => widgt.children.xPath === temvar[i][2])[0]
															if (resWdgt)
															{
																if (scrn.schema[0][resWdgt.children.fieldPath].title !== "") {
																	Log4r.log("temvar[i][1]",temvar[i][1]);
																	temvar[i][1] = scrn.schema[0][resWdgt.children.fieldPath].title +" : "+temvar[i][1];
																	Log4r.log("temvar[i][1]..2..",temvar[i][1]);
																}
															}
														})
													}
													if (temvar[i][0] === 'E') {
														succFlag = false;
														rowObj['color'] = '#f5222d';
													}
													rowObj[temvar[i][0]][rowObj[temvar[i][0]].length] = temvar[i][1];
												}
												if (rowObj['color'] === "") {
													rowObj['color'] = '#29f743';
												}
												gridWorklistErrJsn['0'] = rowObj;
											}
										}
										Log4r.log("gridWorklistErrJsn",gridWorklistErrJsn);
										ErrorHandler.setBulkErrJson(gridWorklistErrJsn);
										jsonTxt = JSON.stringify(gridWorklistErrJsn);
										jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
										let names = JSON.parse(jsonTxt).name;
										names['orientationType'] = "self";
										Log4r.log(JSON.stringify(names));
										GlobalHelper.globlevar['buttonSpin'] = false;
										if (postSave()) {
											if(succFlag === true){
												let utilObject = new onPostSaveUtil(names);
												utilObject["onPostSaveUtilcall"]();
											}

											refreshWorklistModel('Do you want to refresh','','I' , action.refreshQB);

											next({
												type: 'SAVEDATA_OK',
												names
											});
										} else {
											next({
												type: 'GET_NAMES_FAIL',
											});
										}
	                }
	              }
							});
					}
				}
				break;

		case 'SAVEDATA':
			utilObject = new onPreSaveUtil(action.values.domaindata , action.buttonIdOnsave);

			Log4r.log("action.values=>", action.values);
			 method = "onSavecollectionutil";
			GlobalHelper.globlevar['toControlUpdateErrCheck'] = true;
			window.presavecustomdata = [];
			tmpArrVar = utilObject[method](action.values.name);
			Log4r.log("kjfvhssd 1 ",tmpArrVar);
			// !== false mean no need to send save call to metamodel
			if(tmpArrVar != null && tmpArrVar[0] != null && tmpArrVar[0] != false){
					Log4r.log("kjfvhssd 2 ",tmpArrVar);
					let txml;
					let succFlag = true;
					GlobalHelper.globlevar['toControlUpdateErrCheck'] = false;
					GlobalHelper.globlevar['buttonSpin'] = false;
					if(tmpArrVar[1] != null && tmpArrVar[1] !== "")
					{
						let tempJson  = JSON.parse(tmpArrVar[1]);
						Log4r.log("djfh..",tempJson);
						Log4r.log(tempJson.__f2_messages__);
						if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
						{
							let errjsn = tempJson.__f2_messages__;
							for (var i = 0; i < errjsn.length; i++)
							{
								if (errjsn[i][0] == "E") {
									succFlag = false;
									break;
								}
							}
						}
						tempJson['SuccessFlag'] = succFlag;
						tempJson['SuccessFlagReRender'] = true;
						var jsonTxt;
						if (succFlag)
						{
							jsonTxt = JSON.stringify(tempJson);//"{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
						}
						else {
							jsonTxt = JSON.stringify(tempJson);
						}
							jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
							let names = JSON.parse(jsonTxt).name;
							if (action.orientationType !== undefined && action.orientationType.length !== 0) {
								names['orientationType'] = action.orientationType;
							} else {
								names['orientationType'] = "self";
							}
							Log4r.log('JSON retrived ', jsonTxt);
							Log4r.log('LOGIN_AUTH data-service : call ', names);
							Log4r.log(JSON.stringify(names));
							GlobalHelper.globlevar['buttonSpin'] = false;//Sprint 44 - To show spin on click of button palette - used in palette.js & F2FunctionScreen.js
							if (postSave()) {
								next({
									type: 'SAVEDATA_OK',
									names
								});
							} else {
								next({
									type: 'GET_NAMES_FAIL',
								});
							}
					}

			}
			else {
				contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      			contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
				var functionMode = "F";
				if (GlobalHelper.globlevar['functionMode'] == "B") {
					GlobalHelper.globlevar['functionMode'] = undefined;
					functionMode = "B";
				}
				else if(GlobalHelper.globlevar['functionMode'] == "Q"){
					GlobalHelper.globlevar['functionMode'] = undefined;
					functionMode = "Q";
				}
				if (GlobalHelper.globlevar['summaryConfigType_save'] == true) {
					if(action.hasOwnProperty("calculatedPkValues")){
						Log4r.log("action.calculatedPkValues[0].contextPrimaryKyeValues " ,action.calculatedPkValues[0].contextPrimaryKyeValues);
						if(action.calculatedPkValues[0].contextPrimaryKyes.includes("|")){
							// Encoding URL __CPK values
							let contextCustorConfigValue = action.calculatedPkValues[0].contextPrimaryKyes.split('=');
      						let contextCustorConfigEncodevalue = contextCustorConfigValue[0]+"="+ encodeURIComponent(contextCustorConfigValue[1]);

							url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues + "&" + contextCustorConfigEncodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['summaryConfigTypeFunctionid'] + "&functionMode=" + functionMode + "&calledFromSubmit=" + action.calledFromSubmit + "&_btnid=" + action.buttonIdOnsave +"&"
						}else
						{
							url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues + "&" + action.calculatedPkValues[0].contextPrimaryKyes + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['summaryConfigTypeFunctionid'] + "&functionMode=" + functionMode + "&calledFromSubmit=" + action.calledFromSubmit + "&_btnid=" + action.buttonIdOnsave +"&"
						}
					}
					else{
						url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['summaryConfigTypeFunctionid'] + "&functionMode=" + functionMode + "&calledFromSubmit=" + action.calledFromSubmit + "&_btnid=" + action.buttonIdOnsave +"&"
					}
				} else {
					url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&1525328457450=1525328457450&SYSUSERID=SYSADMIN&lstEntityId=" + GlobalHelper.listEntityId + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&__functionId=" + GlobalHelper.globlevar['savedFunctionID'] + "&functionMode=" + functionMode + "&calledFromSubmit=" + action.calledFromSubmit + "&_btnid=" + action.buttonIdOnsave +"&"
				}
				try{
					if(GlobalHelper.globlevar.jsonTemplateObjectOfBackScreen.JSON_DATA.cap === "LAYOUT_PETTY_CASH_FINES"){
						GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] = undefined;
				}
			}catch(e){
				Log4r.log("e : ", e);
			}
				if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
					url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=save&" + GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + "&"
				}
				var xpath = action.values.domaindata;

				if(tmpArrVar != null){
					if(tmpArrVar[1] != null && tmpArrVar[1] !== "")
					{
						xpath = tmpArrVar[1];
					}
				}

				if (GlobalHelper.globlevar['savedFunctionID'] == "cb6b6e9465c04df9809fe6aea2b1df17") { // xpath changed for given function id to remove _mode value
					xpath = xpath.replace(/_mode=U/g, '_mode='); // all row need to replace mode by null;
				}
				requestData = {
					// SET AT CALLSAVE METHOD IN UISCREEN. FOR CALCULATE USER SPEND TIME ON SCREEN.
					'lsecondSpend':GlobalHelper.globlevar['SecondSpendOnScreen']
				};
				// SET AT CALLSAVE METHOD IN UISCREEN. FOR CALCULATE USER SPEND TIME ON SCREEN.
				xpath = xpath + "&lsecondSpend=" + GlobalHelper.globlevar['SecondSpendOnScreen'] +"&";
				if (preSave()) {

					let SAVEDATA_PostDataUrl  = url.split("?")[1];
					let _stdata_SAVEDATA_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", SAVEDATA_PostDataUrl);

					request
						.post(url )
						.query({_SID_:(_stdata_SAVEDATA_PostDataUrl.SID + _stdata_SAVEDATA_PostDataUrl.SINT)})
						.query({_ADF_:""})
						.send(xpath)
						.set('Accept', 'application/xml')
						.set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8;')
						.end((err, res) => {
							if (err) {
								Log4r.log('data-service err: call', err);
								// Return the error action
								const names = JSON.parse('["/reactapp/app/index"]');
								return next({
									type: 'GET_NAMES_FAIL',
									names
								});
							}
              				else
				            {
				            	GlobalHelper.globlevar.savespin = true;
				                var txml;
				                let succFlag = true;
				                if (res.text !== "" && res.text !== undefined && res.text !== null)
				                {let jsonObj = undefined;
									jsonObj=removeBacksLashCharacter(res.text);
				                  isRequestStatus(next,jsonObj);
				                  let tempJson =jsonObj;
				                  if(tempJson.__f2_messages__ && tempJson.__f2_messages__.length > 0)
				                  {
				                    let errjsn = tempJson.__f2_messages__;
									let errMsg = [];
									errjsn.forEach(element => {
										if (element[0] == "E") {
											errMsg.push(element);
										}
									});
									if (errMsg && errMsg.length != 0) {
										succFlag = false;
										tempJson.__f2_messages__ = errMsg;
									}
									errjsn = tempJson.__f2_messages__;
									for (var i = 0; i < errjsn.length; i++)
									{
										//Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
										try{
										if(GlobalHelper.globlevar.jsonTemplateObjectOfBackScreen.JSON_DATA.cap === "LAYOUT_PETTY_CASH_FINES"){

										}else{ 
										if (errjsn[i][0] == "D") {
											let dialogTitle = "Dialog Box";
											if(!isempty(errjsn[i][4])){
												dialogTitle = errjsn[i][4];
											}
											displayMessageBox(dialogTitle,errjsn[i][1],"I",null)
											break;
										   }
									      }
										}catch(e){
											Log4r.log("Error....", e);
										}//END-Sprint 38 - Task - Issue-L60-554-DialogMessage coming twice on QDE screen
									}//END FOR
				                  }//ENDIF
											    tempJson['SuccessFlag'] = succFlag;
												tempJson['SuccessFlagReRender'] = true;
				                				var jsonTxt;
												jsonTxt = JSON.stringify(tempJson);

				                    			jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
				      							// {'status' : 'E', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}
				      							if(GlobalHelper.layoutCaption == "Audit Scheduler" && GlobalHelper.globlevar.btnLabel === "SAVE & SUBMIT"){
                                                    jsonTxt = jsonTxt.replace("Saved", 'Submitted'); 
                                                }
												try{
													if(GlobalHelper.globlevar.tabScreen[0].title === "Audit Activity Details"){
														GlobalHelper.globlevar.savespin = false;
														GlobalHelper.globlevar['buttonSpin'] = false;
														}
												}catch(e){
													Log4r.log('e: ', e);
												}
												  let names = JSON.parse(jsonTxt).name;
														if (action.orientationType !== undefined && action.orientationType.length !== 0) {
															names['orientationType'] = action.orientationType;
														} else {
															names['orientationType'] = "self";
														}
						      							Log4r.log('JSON retrived ', jsonTxt);
						      							Log4r.log('LOGIN_AUTH data-service : call ', names);
						      							Log4r.log(JSON.stringify(names));
														 if(GlobalHelper.globlevar['isolatedRefreshOnSave'] === true && succFlag === true){
																	setOnScreenLoadData();
														 }
														 if(action.refreshOnSave !== true || succFlag !== true){
 															GlobalHelper.globlevar['buttonSpin'] = false;//Sprint 44 - To show spin on click of button palette - used in palette.js & F2FunctionScreen.js
 														}
				      							if (postSave()) {
															if(succFlag === true && GlobalHelper.globlevar['isolatedRefreshOnSave'] === undefined ){
																let utilObject = new onPostSaveUtil(names);
																utilObject["onPostSaveUtilcall"]();
															}
				      								next({
				      									type: 'SAVEDATA_OK',
				      									names
				      								});
				      							} else {
				      								next({
				      									type: 'GET_NAMES_FAIL',
				      								});
				      							}
				                }
				            }
						});
				}
			}
			break;

	        case 'SAVEASDRAFT':
			contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
	      	contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
	        Log4r.log("action.values=>",action.values);
	        GlobalHelper.globlevar['toControlUpdateErrCheck']=true;
	        var functioniddata=GlobalHelper.globlevar['savedFunctionID'];
	        var functionMode = "F";
	        if (GlobalHelper.globlevar['functionMode'] == "B") {
	              GlobalHelper.globlevar['functionMode'] = undefined;
	              functionMode = "B";
	           }
	        url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=saveAsDraft&lstEntityId="+GlobalHelper.listEntityId+"&"+GlobalHelper.contextPKValues+"&"+contextencodevalue+"&listEntityId="+GlobalHelper.listEntityId+"&"+GlobalHelper.contextPrimaryKeyLength+"&LAYOUT_MODE=SUMMARY_DETAILS&__functionId="+GlobalHelper.globlevar.functionID  +"&functionMode=F&";
	        if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
	             url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=saveAsDraft&"+ GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + "&"
	        }
	        var screenJson =  JSON.stringify(GlobalHelper.globlevar['namess']);
	        if (GlobalHelper.globlevar['bulkoperations'] == true) {
	          GlobalHelper.globlevar['bulkoperations'] = false;
	          GlobalHelper.globlevar['savedFunctionID'] = undefined;
	          }
	        requestData = {
	        '__functionId': functioniddata ,
	        'token': 'indus'
	        };

					let SAVEASDRAFT_PostDataUrl  = url.split("?")[1];
					let _stdata_SAVEASDRAFT_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", SAVEASDRAFT_PostDataUrl);

	        request
	          .post(url)
						.query({_SID_:(_stdata_SAVEASDRAFT_PostDataUrl.SID + _stdata_SAVEASDRAFT_PostDataUrl.SINT)})
						.query({_ADF_:""})
	          .send( JSON.stringify(requestData)) // sends a JSON post body
	          .send({
	                  'linkoption': functioniddata,
	                  'token': 'indus',
	                  'layoutJSON' : screenJson
	                })
	          .set('X-API-Key', functioniddata)
	          .query({
	                  __functionId: functioniddata
	                })
	          .query({
	                  access: GlobalHelper.functionAccessMap.get(functioniddata)
	                })
	          .set('Accept', 'application/xml')
	          .set('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8;')
	          .end((err, res) => {
	                        if (err ) {
	                            Log4r.log('data-service err: call', err);
	                             // Return the error action
	                            const names = JSON.parse('["/reactapp/app/index"]');
	                            return next({
	                                type: 'GET_NAMES_FAIL',
	                                names
	                            });
	                            }
	                            else
	                            {
	                              Log4r.log('res.text ', res.text);
	                              if (res.text !== "" && res.text !== undefined && res.text !== null)
	                              {
	                              	isRequestStatus(next,JSON.parse(res.text));
	                                var flag = true;
	                                if (flag)
	                                {
	                                  jsonTxt = "{'status' : 'S', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
	                                }
	                                else {
	                                  jsonTxt = "{'status' : 'E', 'appno' : '', 'appid' : '', 'layouid' : '', 'error' : '','stackLog':null}";
	                                }
	                                  next({
	                                      type: 'GET_NAMES_FAIL',
	                                    });
	                              }
	                            }
	                    });
	        break;

      case 'GETDRAFTDATA':
        Log4r.log("action.values=>",action.values);
        GlobalHelper.globlevar['toControlUpdateErrCheck']=true;
        var functioniddata=GlobalHelper.globlevar['savedFunctionID'];
        var functionMode = "F";
        if (GlobalHelper.globlevar['functionMode'] == "B") {
              GlobalHelper.globlevar['functionMode'] = undefined;
              functionMode = "B";
           }
 				Log4r.log("GlobalHelper.globlevar['namess']" , GlobalHelper.globlevar['namess']);
		contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      	contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
        url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getDraftData&lstEntityId="+GlobalHelper.listEntityId+"&"+GlobalHelper.contextPKValues+"&"+contextencodevalue+"&listEntityId="+GlobalHelper.listEntityId+"&"+GlobalHelper.contextPrimaryKeyLength+"&LAYOUT_MODE=SUMMARY_DETAILS&__functionId="+GlobalHelper.globlevar.functionID  +"&functionMode=F&";
        if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
             url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getDraftData&"+ GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] +"&functionMode="+functionMode+"&"
        }
        var screenJson =  JSON.stringify(GlobalHelper.globlevar['namess']);
        if (GlobalHelper.globlevar['bulkoperations'] == true) {
          GlobalHelper.globlevar['bulkoperations'] = false;
          GlobalHelper.globlevar['savedFunctionID'] = undefined;
          }
        requestData = {
        '__functionId': functioniddata ,
        'token': 'indus'
        };

				let GETDRAFTDATA_PostDataUrl  = url.split("?")[1];
				let _stdata_GETDRAFTDATA_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", GETDRAFTDATA_PostDataUrl);



          request
          .post(url)
					.query({_SID_:(_stdata_GETDRAFTDATA_PostDataUrl.SID + _stdata_GETDRAFTDATA_PostDataUrl.SINT)})
					.query({_ADF_:""})
					.send( JSON.stringify(requestData)) // sends a JSON post body
          .send({
                  'linkoption': functioniddata,
                  'token': 'indus',
                  'layoutJSON' : screenJson
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
                        if (err ) {
                            Log4r.log('data-service err: call', err);
                             // Return the error action
                            const names = JSON.parse('["/reactapp/app/index"]');
                            return next({
                                type: 'GET_NAMES_FAIL',
                                names
                            });
                            }
                            else{
                              Log4r.log('res.text ', res.text);
                              if (res.text !== "" && res.text !== undefined && res.text !== null)
                              {let jsonObj = undefined;
								jsonObj=removeBacksLashCharacter(res.text);
                              	isRequestStatus(next,jsonObj);
                              let names = jsonObj.layoutDataJSON;
                               Log4r.log('newnames1',names);
                               var jsonTxt = JSON.stringify(names);
                               jsonTxt= "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": null,\"data\":[{\"name\" : " + jsonTxt + "}]}}";
                               Log4r.log('newnames2',jsonTxt );
                               Log4r.log('newnames3', JSON.parse(jsonTxt) );
                               names=JSON.parse(jsonTxt).name;
							   names['orientationType'] = "self";
                               next({
                                       type: 'ONLOADFULLDATA_OK',
                                       names
                                 });
                              }
                            }
                    });
          break;

		case 'GRIDFETCHDATA':
			Log4r.log('values Containers : call & state GRIDFETCHDATA = ', action.values);
			requestData = {
				'linkoption': action.values,
				'token': 'indus'
			};
			var dynamicFunctionId = GlobalHelper.globlevar.functionID;
			contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      		contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);
			var url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&LAYOUT_MODE=SUMMARY_DETAILS&__functionId=" + GlobalHelper.globlevar.functionID + "&functionMode=F&";
			if(GlobalHelper.globlevar['summaryConfigTypeFunctionid'] != null){
				if(action.hasOwnProperty("calculatedPkValues")){
					let contextPrimaryKyesSplit = action.calculatedPkValues[0].contextPrimaryKyes.split("=");
					url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues   + "&" + contextPrimaryKyesSplit[0] + "=" + encodeURIComponent(contextPrimaryKyesSplit[1]) + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&LAYOUT_MODE=SUMMARY_DETAILS&__functionId=" + ( action.functionID != null ? action.functionID : GlobalHelper.globlevar['summaryConfigTypeFunctionid'] ) + "&functionMode=F&";
					dynamicFunctionId =   ( action.functionID != null ? action.functionID : GlobalHelper.globlevar['summaryConfigTypeFunctionid'] ) ;
				}
				else{
					url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&LAYOUT_MODE=SUMMARY_DETAILS&__functionId=" + ( action.functionID != null ? action.functionID : GlobalHelper.globlevar['summaryConfigTypeFunctionid'] )+ "&functionMode=F&";
					dynamicFunctionId =   ( action.functionID != null ? action.functionID : GlobalHelper.globlevar['summaryConfigTypeFunctionid'] );
				}

			} else {
				if(action.hasOwnProperty("calculatedPkValues")){
					let contextPrimaryKyesSplit = action.calculatedPkValues[0].contextPrimaryKyes.split("=");
					url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + action.calculatedPkValues[0].contextPrimaryKyeValues   + "&" + contextPrimaryKyesSplit[0] + "=" + encodeURIComponent(contextPrimaryKyesSplit[1]) + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&LAYOUT_MODE=SUMMARY_DETAILS&__functionId=" + GlobalHelper.globlevar.functionID + "&functionMode=F&";
					dynamicFunctionId = GlobalHelper.globlevar.functionID;
				}
				else{
					url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&listEntityId=" + GlobalHelper.listEntityId + "&" + GlobalHelper.contextPrimaryKeyLength + "&LAYOUT_MODE=SUMMARY_DETAILS&__functionId=" + GlobalHelper.globlevar.functionID + "&functionMode=F&";
					dynamicFunctionId = GlobalHelper.globlevar.functionID;
				}
			}

			if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined) {
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId=undefined&LAYOUT_MODE=SUMMARY_DETAILS&" + GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + "&";
				dynamicFunctionId = ""
			}

			if(GlobalHelper.globlevar['tableLinkRecord'].addThroughSummGridjson !== undefined && GlobalHelper.globlevar['tableLinkRecord'].addThroughSummGridjson !== "")
			{
				Log4r.log("AddRowToGrid rowlink click ");
				var jsonTxt = JSON.parse(GlobalHelper.globlevar['tableLinkRecord'].addThroughSummGridjson);
        		jsonTxt.forEach(function(value, key) {
	          		Log4r.log("key ", key, "value ", value);
	          		let gridFieldPath = undefined;
	          		gridFieldPath = value.uiSchema[0].children.filter(item => item.children.widget === "table")[0];
	          		Log4r.log("gridFieldPath",gridFieldPath);
	          		if(gridFieldPath != null){
			            gridFieldPath = gridFieldPath.children.fieldPath;
			            let dataAndStyleObjectCopy = JSON.parse(JSON.stringify(value.formData[0][gridFieldPath]));
			            Log4r.log("dataAndStyleObjectCopy",dataAndStyleObjectCopy);
			            delete value.formData[0][gridFieldPath];
			            value.formData[0] = dataAndStyleObjectCopy;
			            Log4r.log("value.formData[0]",value.formData[0]);
			        }

		         	delete value.schema
		          	delete value.uiSchema
		        });

				jsonTxt = JSON.stringify(jsonTxt);
				jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": null,\"data\":[{\"name\" : {\"screendata\" :" + jsonTxt + "}}]}}";
				let	names = JSON.parse(jsonTxt).name;
				if (action.orientationType !== undefined && action.orientationType.length !== 0) {
					names['orientationType'] = action.orientationType;
				} else {
					names['orientationType'] = "self";
				}
				GlobalHelper.globlevar['onlyDataCalled']= true;
				GlobalHelper.globlevar["onDetailSectionLoad"] = true;
				next({
							type: 'ONLOADFULLDATA_OK',
							names
				});
			}
			else
			{
				let GRIDFETCHDATA_PostDataUrl  = url.split("?")[1];
				let _stdata_GRIDFETCHDATA_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", GRIDFETCHDATA_PostDataUrl);
				let xpathQ = GlobalHelper.globlevar['dependablerecordrequest'] &&  Object.keys(GlobalHelper.globlevar['dependablerecordrequest']).map(function(k) {    // NOSONAR: javascript:S2201
    				return encodeURIComponent(k) + '=' + encodeURIComponent(GlobalHelper.globlevar['dependablerecordrequest'][k])
					}).join('&');
				if (GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] !== undefined){
					GlobalHelper.globlevar['dependablerecordrequest'] ={
					linkClicked: action.values.clickedData,
					detailsectionid: action.values.detailsectionid,
					layoutId: GlobalHelper.globlevar['dependablelayoutid'],
					...GlobalHelper.globlevar['dependablerecordrequest']
					}
				}
				else
				{
					GlobalHelper.globlevar['dependablerecordrequest'] ={
					linkClicked: action.values.clickedData,
					detailsectionid: action.values.detailsectionid,
					layoutId: GlobalHelper.globlevar['dependablelayoutid'],
					__functionId : dynamicFunctionId,
					...GlobalHelper.globlevar['dependablerecordrequest']
					}
				}
				if(GlobalHelper.globlevar.UIScreenLayoutJson.names.data[0].name['dependablerecordrequestArr'] == undefined){
					GlobalHelper.globlevar['dependablerecordrequestArr'] = new Array();
				}
				GlobalHelper.globlevar['dependablerecordrequestArr'].push(GlobalHelper.globlevar['dependablerecordrequest']);
				GlobalHelper.globlevar.UIScreenLayoutJson.names.data[0].name['dependablerecordrequestArr'] = GlobalHelper.globlevar['dependablerecordrequestArr'];
				Log4r.log("action.values.clickedData : ",action.values.clickedData);
				Log4r.log("action.values.detailsectionid : ",action.values.detailsectionid);
				Log4r.log("action.values.smrykeyconfig : ",action.values.smrykeyconfig);
				Log4r.log("xpathQ : ",xpathQ);
				Log4r.log("GlobalHelper.globlevar['dependablelayoutid'] : ",GlobalHelper.globlevar['dependablelayoutid']);
				request
				.post(url)
				.query({_SID_:(_stdata_GRIDFETCHDATA_PostDataUrl.SID + _stdata_GRIDFETCHDATA_PostDataUrl.SINT)})
				.query({_ADF_:""})
				.query({
					linkClicked: action.values.clickedData
				})
				.query({
					detailsectionid: action.values.detailsectionid
				})
				.query(action.values.smrykeyconfig)
				.send(xpathQ)
				.query({
					layoutId: GlobalHelper.globlevar['dependablelayoutid']
				})
				.end((err, res) => {
					if (err) {
						Log4r.log('data-service err: call', err);
						return next({
							type: 'GRIDFETCHDATA_FAIL',
							names
						});
					}
					let remarktoadd = undefined;
					let spliceindex = undefined;
					let replacingurl = undefined;
					if(GlobalHelper.globlevar.getDataUrls.length !== 0){
						for (let i = 0; i < GlobalHelper.globlevar.getDataUrls.length; i++) {
							let index = GlobalHelper.globlevar.getDataUrls[i].indexOf(action.values.detailsectionid);
							if(index == -1){
								remarktoadd = true;
								} else {
									remarktoadd = false;
									spliceindex = i;
									replacingurl = res.req.url;
									break;
								}
						  }
					 }
					 if(remarktoadd == true || remarktoadd == undefined){
						 let addtoGridCheck = false;
						 if(action.extraData !== undefined){
							 if(action.extraData.formDataVal.data !== undefined){
								 	if(action.extraData.formDataVal.data.addThroughSummGrid !== undefined && action.extraData.formDataVal.data.addThroughSummGrid === "true"){
										addtoGridCheck = true;
									}
							 }
						 }
						 if(addtoGridCheck === false){
							 GlobalHelper.globlevar.getDataUrls.push(res.req.url);
							 GlobalHelper.getDataUrlsMap.set(res.req.url,action.extraData);
						 }
					}
					 else {
					 	if(spliceindex !== undefined){
							GlobalHelper.globlevar.getDataUrls.splice(spliceindex,1);
							GlobalHelper.globlevar.getDataUrls.splice(spliceindex,0,replacingurl);
							spliceindex = undefined;
							replacingurl = undefined;
						}
					 }

					Log4r.log('res.text data ', res.text);
					var jsonText = res.text;
					var objDetailSectionList;
					Log4r.log("GlobalHelper.listEntityId ", GlobalHelper.listEntityId);
					Log4r.log("stringify(JSON.parse(jsonText)) ", jsonText);
					GlobalHelper['dependablegriddata'] = true;
					Log4r.log('res.text data ', res.text);
					let jsonObj = null
					jsonObj=removeBacksLashCharacter(res.text);
					
					isRequestStatus(next,jsonObj);
					Log4r.log('JSON retrived Object data ', jsonObj);
					if(jsonObj != null && jsonObj.JSON_DATA != null){
						jsonObjdata = jsonObj.JSON_DATA;
						objDetailSectionList = jsonObj.DTL_SEC_LIST;
					}else{
						GlobalHelper.globlevar['NoRowDataForDetailSection'] = "true";
						//displayMessageBox("Error","No Data From Server...need to Save record data...","E");
					}

					let updatedata = undefined;
					if(GlobalHelper.globlevar['summaryConfigType'] === "D" && GlobalHelper.globlevar['newfunctionInitiated'] === true){
						GlobalHelper.globlevar['newfunctionInitiated'] = undefined;
						 new Model().handleDataChange(GlobalHelper.globlevar.templetObject);
					}
					var layoutObject = undefined;
					try {
					layoutObject = new Model().getLeafNodesForId(action.values.detailsectionid);
					} catch (e) {
						Log4r.log(e);
					}


					Log4r.log('LayoutObj', layoutObject);
					try{
					ParentPK.getParentQueryStringFetchData(jsonObjdata);
					}catch(e){Log4r.error(e)}
					let names = [];
					try {
						let type="GETGRIDDATA";
							names = new ReactUpdateData(layoutObject, jsonObjdata, objDetailSectionList).buildFinalUpdateJson(type);
					} catch (e) {
						Log4r.log(e);
					}
					Log4r.log('newnames', names);
					var jsonTxt = JSON.stringify(names);
					jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": null,\"data\":[{\"name\" : " + jsonTxt + "}]}}";
					names = JSON.parse(jsonTxt).name;
					names['DTL_SEC_LIST'] = jsonObj.DTL_SEC_LIST;
					let templist ={};
					templist[GlobalHelper.globlevar.dependablelayoutid] = jsonObj.DTL_SEC_LIST;
					names.data[0].name['DTL_SEC_LIST']=templist;

					if (action.orientationType !== undefined && action.orientationType.length !== 0) {
						names['orientationType'] = action.orientationType;
					} else {
						names['orientationType'] = "self";
					}

					if(action.extraData != null) {
						names['extradata'] = action.extraData;
					}
					GlobalHelper.globlevar["onDetailSectionLoad"] = true;
					GlobalHelper.globlevar['onlyDataCalled']= true;
					next({
						type: 'ONLOADFULLDATA_OK',
						names
					});
				});
			}
		break;


			case 'SECTIONREFRESHCALL':	//THIS IS FOR SECTION LEVEL REFRESH BUTTON TO REFRESH ONLY THAT SECTION..
			Log4r.log('values Containers : call & state GRIDFETCHDATA = ', action.values);
			let fieldPath = action.values.sessID;
			let xPath = action.values.xPath;
			let parentPkRefresh = action.values.parentPkRefresh;
			contextprimarykeyvalue =  GlobalHelper.contextPrimaryKey.split('=');
			contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

			var fetchPK =  GlobalHelper.globlevar['fetchParentPKComponentDataMap'][Symbol.iterator]();
            let fetchparentpk = "&";
            for (let itemxpath of fetchPK) {
                  if(itemxpath[0].includes(action.values.sectionXPath))
                  {
                  	 	let ipath = itemxpath[0].split(".");
                   		fetchparentpk = fetchparentpk + ipath[ipath.length-1] +"="+ itemxpath[1] + "&";
                  }

            }
            Log4r.log("fetchparentpk " , fetchparentpk);

            url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&lstEntityId="+GlobalHelper.listEntityId+"&"+GlobalHelper.contextPKValues+"&"+contextencodevalue+"&listEntityId="+GlobalHelper.listEntityId+"&"+GlobalHelper.contextPrimaryKeyLength+ fetchparentpk;
			requestData = { '__functionId':GlobalHelper.globlevar.functionID,'token':'indus'};
			// table pagination in case of isolated function

			if(GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams']  !== undefined)
			{
				url = "/"+GlobalHelper.menuContext+"/secure/genericFuncLayoutAction.do?_rt=getData&" +GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] + fetchparentpk;
			}

			let SECTIONREFRESHCALL_PostDataUrl  = url.split("?")[1];
			let _stdata_SECTIONREFRESHCALL_PostDataUrl = getSTData("/"+GlobalHelper.menuContext+"/", SECTIONREFRESHCALL_PostDataUrl);


				request
						 .get(url)
						 .query({_SID_:(_stdata_SECTIONREFRESHCALL_PostDataUrl.SID + _stdata_SECTIONREFRESHCALL_PostDataUrl.SINT)})
						 .query({_ADF_:""})
						 .send( JSON.stringify(requestData))
						 .send({ __functionId: GlobalHelper.globlevar.functionID,'token':'indus'})
						 .set('X-API-Key', GlobalHelper.globlevar.functionID)
						 .set('Accept', 'application/xml')
						 .query({ __functionId: GlobalHelper.globlevar.functionID})
						 .query({access: GlobalHelper.functionAccessMap.get(GlobalHelper.globlevar.functionID)})
						 .query({"PAGED_LAYOUTID":fieldPath})
			 		 		.query({"layoutId":fieldPath})
						 .query({"PAGED_LAYOUTXPATH": xPath})
						 .query(parentPkRefresh) // added for pagination in case of memos screen of collection
						 .query({"LAYOUT_MODE":"PAGEINITATION"})
						 .end((err, res) => {
										 if (err)
										 {
											 Log4r.log("Error from ajax call-- ",err);
										 }
										 else
										 {
											 //let xmlDoc = $.parseXML(res.text);
											 //let $xml = $( xmlDoc );
											 //let $title = $xml.find( "success" );
											 //let jsonText = $title.text();
					 					 	let jsonText = res.text;
											var objDetailSectionList;
											 let jsonObj = null
											 jsonObj=removeBacksLashCharacter(jsonText);
										 isRequestStatus(next,jsonObj);
										 //let jsonObjdata = jsonObj.JSON_DATA;
										 if(jsonObj != null && jsonObj.JSON_DATA != null){
					 						jsonObjdata = jsonObj.JSON_DATA;
					 						objDetailSectionList = jsonObj.DTL_SEC_LIST;
					 					}else{
					 						GlobalHelper.globlevar['NoRowDataForDetailSection'] = "true";
					 						//displayMessageBox("Error","No Data From Server...need to Save record data...","E");
					 					}

										let updatedata = undefined;
										if(GlobalHelper.globlevar['summaryConfigType'] === "D" && GlobalHelper.globlevar['newfunctionInitiated'] === true){
											GlobalHelper.globlevar['newfunctionInitiated'] = undefined;
											 new Model().handleDataChange(GlobalHelper.globlevar.templetObject);
										}
										var layoutObject = undefined;
										try {
										layoutObject = new Model().getLeafNodesForId(fieldPath);
										} catch (e) {
											Log4r.log(e);
										}

										 Log4r.log('LayoutObj...', layoutObject);
										 try{
										 ParentPK.getParentQueryStringFetchData(jsonObjdata);
										 }catch(e){Log4r.error(e)}
										 let names = [];
										 try {
												 Log4r.log("ksdufyui",objDetailSectionList);
												 names = new ReactUpdateData(layoutObject, jsonObjdata, objDetailSectionList).buildFinalUpdateJson();
										 } catch (e) {
											 Log4r.log(e);
										 }
										 //names['DTL_SEC_LIST'] = jsonObj.DTL_SEC_LIST;
										 Log4r.log('newnames', names);

										 /* code added to identify it is a table and then if it has pagination property 'moreRows' as true then we must redirect that table to its own first page*/
										 for (let i = 0; i < names.screendata.length; i++) {
											 if(names.screendata[i].formData[0].data !== undefined){
												 if(names.screendata[i].formData[0].data.moreRows === "true"){
													 names.screendata[i].formData[0].data['tableRefreshed'] = true;
												 }
											 }
									   }

										 var jsonTxt = JSON.stringify(names);
										 jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"#\",\"LayoutHeader\": null,\"data\":[{\"name\" : " + jsonTxt + "}]}}";
										 names = JSON.parse(jsonTxt).name;
										 if (action.orientationType !== undefined && action.orientationType.length !== 0) {
											 names['orientationType'] = action.orientationType;
										 } else {
											 names['orientationType'] = "self";
										 }
										 GlobalHelper.globlevar['onlyDataCalled']= true;
										 GlobalHelper.globlevar['linkclicked'] = true;
										 GlobalHelper.globlevar['sectionlevelrefresh']= true;
											 next({
												 type: 'ONLOADFULLDATA_OK',
												 names
											 });


								 } //END ELSE
							 });

			break;
			/*new changes Added---*/
		case 'MENUDATAFETCH':

			Log4r.log('MENUDATAFETCH values Containers : call & state = ', action);
			GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] = undefined;
			functionScreenDataUrl = undefined;
			requestData = {
				'linkoption': action.values,
				'token': 'indus'
			};
			layoutID = action.values;
			let names = "";
			let finalOj = {};
			let jsonObjtemplet = undefined;
			let jsonObjdata = undefined;
			var jsonTxt;
			Log4r.log('values of Playload : call & state = ', requestData);
			if (action.layoutType === "GridWorkList") {

				let MENUDATAFETCH_GridWorkList  = action.url.split("?")[1];
				let _stdata_MENUDATAFETCH_GridWorkList = getSTData("/"+GlobalHelper.menuContext+"/", MENUDATAFETCH_GridWorkList);
				request
					.get(action.url)
					.query({_SID_:(_stdata_MENUDATAFETCH_GridWorkList.SID + _stdata_MENUDATAFETCH_GridWorkList.SINT)})
					.query({_ADF_:""})
					.send(JSON.stringify(requestData))
					.send({
						'linkoption': action.values,
						'token': 'indus'
					})
					.set('X-API-Key', action.values)
					.set('Accept', 'application/json')
					.end((err, res) => {
						if (err) {
							Log4r.log('MENUDATAFETCH data-service err: call', err);
							GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
							displayMessageBox("Error","No data from server...  "+err,"E");
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						}
						let xmlDoc = $.parseXML(res.text);
						let $xml = $(xmlDoc);
						let $title = $xml.find("success");
						let jsonText = $title.text();
						let jsonObj = null
						
						try {
							eval("jsonObj = " + jsonText);
						} catch (e) {}
						//Adding code to create map having global function Id
						try{
					

							if(jsonObj !== null && jsonObj.functiongroups != undefined){
								if(jsonObj.functiongroups.formHeaderBookmarks.length !== 0  && jsonObj.functiongroups.formHeaderBookmarks !== undefined){
									GlobalHelper.globlevar['globalFunctionsMap'] = new Map();
									jsonObj.functiongroups.formHeaderBookmarks.map((funcGroup, i) => {    // NOSONAR: javascript:S2201
								        funcGroup.content.map((functionObj, j) => {    // NOSONAR: javascript:S2201
					                          if(functionObj.isGlobalFunction != undefined && functionObj.isGlobalFunction == "Y"){
					                             GlobalHelper.globlevar.globalFunctionsMap.set(functionObj.id,functionObj.cap);
					                          }
					                    });
	    							});
	              				}
							}
						}catch(e){Log4r.error("Functiongroups error " ,e)}
						GlobalHelper.globlevar['multiworklist'] = true;
						GlobalHelper.functionGroupDataMapForSiderMenuItems.set(action.menu, jsonObj && jsonObj.functiongroups || {});
						GlobalHelper.functionGroupData = jsonObj.functiongroups;
						GlobalHelper.listEntityId = jsonObj.defaultListEntityId;
						if(jsonObj != null) {
							if(jsonObj.entities != null){
								if(jsonObj.entities[0].worklist != null){
									if(jsonObj.entities[0].worklist.caption != null){
										  GlobalHelper.globlevar["worklistName"] = jsonObj.entities[0].worklist.caption;
									}
								}
							}
						}
						GlobalHelper.globlevar['menuFunctionFlag']=false;//Sprint 23 - To change layout title for menu function screen.
						GlobalHelper.functionObjectMap(jsonObj.functiongroups);
						//Sprint 23 - Task 63 - Advance search custom filter should manage for client level only / it is replacing serverside fileter only for save session at client machin
						GlobalHelper.globlevar['advsearchdataflag'] = false;//Sprint 31 - Refresh & Clear functionality in AdvanceSearchLayout
						GlobalHelper.savedAdvanceSearchData.clear();//Sprint 31 - Refresh & Clear functionality in AdvanceSearchLayout
						jsonObj.entities.filter((item, index) => {
							Log4r.log("sdkjjsd.....", item, jsonObj.defaultListEntityId);
							if (jsonObj.defaultListEntityId === item.worklist.id) {
								GlobalHelper.worklistStructureMap.set(item.worklist.id, item);
								let defaultworklist = item;
								GlobalHelper.globlevar['defaultworklistindex'] = index + 1;
								GlobalHelper.globlevar['worklistinfo'] = item;
								GlobalHelper.worklistData = item;
								GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
								GlobalHelper.worklistSortFilterXml = "";
								GlobalHelper.workListDataMap.clear();
								GlobalHelper.currentPageWithCurretRecords.clear();
								for (let i = 0; i < item.worklist.DataSource.rows.length; i++) {
					        item.worklist.DataSource.rows[i]['key'] = i;
					      }
								GlobalHelper.workListDataMap.set(1, item.worklist.DataSource.rows);
								GlobalHelper.currentPageWithCurretRecords.set(1, item.worklist.DataSource.rows);
								GlobalHelper.worklistPageNo.set("current",1);

								Log4r.log("default worlist ------", defaultworklist, index);
							}
						})
						
						if(GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].clipsearchFilterXml !== undefined) {
							GlobalHelper.globlevar['clipsearchcloseprejson'].clipsearchFilterXml = undefined;
						} 
						Log4r.log("JSON TEXT IN MENUDATA FETCH : ",JSON.parse(jsonText));
						jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"" + action.layoutType + "\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonText + "}]}}";
						Log4r.log("worklist...", jsonTxt);
						Log4r.log("worklist.2..", jsonTxt);
						names = JSON.parse(jsonTxt).name;
						names.returnToMenuId = action.returnToMenuId;
						GlobalHelper.globlevar.defAdvFilter =""
						if(jsonObj.entities[0].worklist.UserAdvFilterMap != null || jsonObj.entities[0].worklist.UserAdvFilterMap != undefined){
							GlobalHelper.globlevar.UserAdvFilterMap = jsonObj.entities[0].worklist.UserAdvFilterMap;
							GlobalHelper.globlevar.objectLength = Object.entries( GlobalHelper.globlevar.UserAdvFilterMap);
							if(jsonObj.entities[0].worklist.defAdvFilter != null || jsonObj.entities[0].worklist.defAdvFilter != undefined){
								 var defAdvFilter = jsonObj.entities[0].worklist.defAdvFilter;
								try{
									let defval =defAdvFilter;
								GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {
									let ak =Kitm[0].split("::");
									let advfilterid = ak[0];
									let advfilternameupdate = ak[1].split(":~:");
									let advfiltername = advfilternameupdate[0];
									let advfilterflag = advfilternameupdate[1];
								   if(defval === advfilterid){
									GlobalHelper.globlevar.defAdvFilter =advfiltername;
								   }
							})
						}
						catch(e){
							Log4r.log("e",e);
						}
							}
							else{
								GlobalHelper.globlevar.defAdvFilter =""
							}
						}
						
				   else{
					GlobalHelper.globlevar.UserAdvFilterMap = false;
						  }

						
						try{
							if(names.data[0].name.entities !== undefined && names.data[0].name.entities[0].worklist.showDefaultFuncOnly !== undefined ){
								GlobalHelper.globlevar['showDefaultFuncOnly'] = names.data[0].name.entities[0].worklist.showDefaultFuncOnly;
								Log4r.log("GlobalHelper.globlevar['showDefaultFuncOnly'] => " , GlobalHelper.globlevar['showDefaultFuncOnly']);
							}

							loadScript('/'+GlobalHelper.menuContext+'/secure/script/react/customworklistload.js');
							window.onWorklistLoad(names);
						}catch(e){Log4r.error(e)}

							next({
								type: 'MENUDATAFETCH_OK',
								names
							});

					});
			}
			//Added a case if we get a prompt mode screen
			else if (action.layoutType === "PromptWorkList") {

				let firstRowFunctionId = "";
				GlobalHelper.globlevar['PreviousButtonFlag'] = false;
				if (action.url !== undefined || action.url.length !== 0) {

					let MENUDATAFETCH_PromptWorkList  = action.url.split("?")[1];
					let _stdata_MENUDATAFETCH_PromptWorkList = getSTData("/"+GlobalHelper.menuContext+"/", MENUDATAFETCH_PromptWorkList);

					request
						.get(action.url)
						.query({_SID_:(_stdata_MENUDATAFETCH_PromptWorkList.SID + _stdata_MENUDATAFETCH_PromptWorkList.SINT)})
						.query({_ADF_:""})
						.send(JSON.stringify(requestData))
						.send({
							'linkoption': action.values,
							'token': 'indus'
						})
						.set('X-API-Key', action.values)
						.set('Accept', 'application/json')
						.end((err, res) => {
							if (err) {
								Log4r.log('worklistfunctionGroupData data-service err: call', err);
								GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
								displayMessageBox("Error","No data from server...  "+err,"E");
								return next({
									type: 'GET_NAMES_FAIL',
									names
								});
							}
							Log4r.log('res.text data ', res.text);
							var xmlDoc = $.parseXML(res.text);
							var $xml = $(xmlDoc);
							var $title = $xml.find("success");
							var jsonText = $title.text();
							var jsonTxt = jsonText;
							Log4r.log('JSON retrived data', jsonTxt);
							const jsonObj = JSON.parse(jsonTxt);
							Log4r.log('JSON retrived Object data ', jsonObj);
							
							if(jsonObj.entities[0].worklist.UserAdvFilterMap != null || jsonObj.entities[0].worklist.UserAdvFilterMap != undefined){
								GlobalHelper.globlevar.UserAdvFilterMap  = jsonObj.entities[0].worklist.UserAdvFilterMap;
								GlobalHelper.globlevar.objectLength = Object.entries(GlobalHelper.globlevar.UserAdvFilterMap );
								if(jsonObj.entities[0].worklist.defAdvFilter != null || jsonObj.entities[0].worklist.defAdvFilter != undefined){
									GlobalHelper.globlevar.UserAdvFilterMap  = jsonObj.entities[0].worklist.userAdvFilter;
									var defAdvFilter = jsonObj.entities[0].worklist.defAdvFilter;
								   try{
									   let defval =defAdvFilter;
								   GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {
									   let ak =Kitm[0].split("::");
									   let advfilterid = ak[0];
									   let advfilternameupdate = ak[1].split(":~:");
									   let advfiltername = advfilternameupdate[0];
									   let advfilterflag = advfilternameupdate[1];
									  if(defval === advfilterid){
									   GlobalHelper.globlevar.defAdvFilter =advfiltername;
									  }
							   })
						   }
						   catch(e){
							   Log4r.log("e",e);
						   }
							   }
							   else{
								   GlobalHelper.globlevar.defAdvFilter =""
							   }
							}
								 else{
							GlobalHelper.globlevar.UserAdvFilterMap  = false;
							}
							
						  
							jsonObjdata = jsonObj;
							

							if(firstRowFunctionId !== undefined && jsonObjdata.entities[0].worklist.DataSource.rows[0] != null){
								try {

									GlobalHelper.globlevar['worklistinfo'] = jsonObjdata.entities[0];
									GlobalHelper.globlevar["promptClicked"] = true;

									GlobalHelper.functionGroupDataMapForSiderMenuItems.set(action.menu, jsonObj.functiongroups);
									GlobalHelper.functionGroupData = jsonObjdata.functiongroups;

									GlobalHelper.listEntityId = GlobalHelper.globlevar.worklistinfo.worklist.serviceEntityId;
									var _listEntityId = GlobalHelper.globlevar.worklistinfo.worklist.serviceEntityId;
									var cpkvalue = "";
									var cplvalue = "";
									var contextvalue = "";
									var cpkValueArray = new Array();
									var contextKeyValuePair = new Array();
									var contextKeyMap = new Map();
									let is_utavailable = false;
									GlobalHelper.globlevar['promptmodemorerows'] = jsonObjdata.entities[0].worklist.DataSource.moreRows;
									if (GlobalHelper.globlevar['promptmodemorerows'] == false) {
										GlobalHelper.globlevar['promptworklistNextButtonDisable'] = true;
									}
									
									GlobalHelper.globlevar['currentPromptRowData'] = GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows[0];
									GlobalHelper.globlevar.worklistinfo.worklist.Columns.map((user, i) => {    // NOSONAR: javascript:S2201
										if (user.contexKeys !== undefined && user.contexKeys !== "" && user.contexKeys !== null && user.contexKeys !== "null") {
											contextKeyMap.set(user.dataIndex, user.contexKeys);
										}
									});
									contextKeyMap.forEach(function (value, key) {
										var tempdata = value.split(",");
										tempdata.map((tempnew, tempi) => {    // NOSONAR: javascript:S2201
											if(tempnew == "_ut")
									    {
									      is_utavailable = true;
									    }
											cpkValueArray.push(tempnew);
											contextKeyValuePair.push(tempnew + "=" + GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows[0][key])
										});
									});
									if(!is_utavailable)
								  {
								    contextKeyValuePair.push("_ut=ALLOCATED_USER");
								  }

									cpkvalue = "__cpk=" + cpkValueArray.join("|") + "|_ut";
									cplvalue = "__cpl=" + cpkValueArray.length;
									contextvalue = contextKeyValuePair.join("&");
									GlobalHelper.contextPrimaryKey = cpkvalue;
									GlobalHelper.contextPKValues = contextvalue;
									GlobalHelper.contextPrimaryKeyLength = "__cpl=1";
								} catch (e) {
									Log4r.error(e);
								}
								var strIds;
								var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      					        var contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

								let postUrl = "/"+GlobalHelper.menuContext+"/secure/listAction.do?_rt=isFunctionAccessible&listEntityId=" + _listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&";

								let MENUDATAFETCH_PromptWorkList_Function  = postUrl.split("?")[1];
								let _stdata_MENUDATAFETCH_PromptWorkList_Function = getSTData("/"+GlobalHelper.menuContext+"/", MENUDATAFETCH_PromptWorkList_Function);


								request
									.get("/"+GlobalHelper.menuContext+"/secure/listAction.do?_rt=isFunctionAccessible&listEntityId=" + _listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&")
									.query({_SID_:(_stdata_MENUDATAFETCH_PromptWorkList_Function.SID + _stdata_MENUDATAFETCH_PromptWorkList_Function.SINT)})
									.query({_ADF_:""})
									.set('Accept', 'application/json')
									.end((err, res) => {
										if (err) {
											Log4r.log('ERROR IN GRTTING FUNCTION IDS', err);
										} else {
											try {
												var xmlDoc = $.parseXML(res.text);
												var $xml = $(xmlDoc);
												var $title = $xml.find("success");
												var jsonText = $title.text();
												var jsonTxt = jsonText;
												const jsonObj =removeBacksLashCharacter(jsonTxt);
												strIds = jsonObj[0].LIST_ROW_0;
												Log4r.log("GOT FUNCTION IDS AS", strIds);
												GlobalHelper.globlevar['firstRowFunctionId'] = strIds;
												GlobalHelper.globlevar['raiseFalg'] = true;
												strIds.functions.map((func, i) => {    // NOSONAR: javascript:S2201
													GlobalHelper.functionAccessMap.set(func.funcid, func.access);
												});
											} catch (e) {
												Log4r.error(e);
											}
											GlobalHelper.globlevar.promptClicked = true;
											GlobalHelper.globlevar.removeHeaderFlag = false;
											GlobalHelper.globlevar.raiseFalg = true;
											GlobalHelper.globlevar.currentPromptRowData = GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows[0];
											let functionId = GlobalHelper.globlevar.firstRowFunctionId;
											let firstRightSelectedIcon = undefined;
											let values = undefined;
											try
											{
											GlobalHelper.holdFunGroupData = GlobalHelper.getByFuncIds(functionId);
											firstRightSelectedIcon = GlobalHelper.holdFunGroupData.values().next().value;
											values = firstRightSelectedIcon.content[0].id;
											GlobalHelper.globlevar['promptClickedFunctionId'] = firstRightSelectedIcon.content[0].id;
											}
											catch(e){Log4r.log(e)}
											var headerFunctionId = undefined;
											if (functionId != null && functionId.length != 0 && functionId.hasOwnProperty('headerFucntion')) {
												headerFunctionId = functionId.headerFucntion.headerFunctionId;
											}
											let pr_mode = "prompt";
											let UserSelectorPrompt = true;
											GlobalHelper.globlevar.UIScreen = "UIScreen";
											GlobalHelper.globlevar['promptworklistinfo'] = true;

											if (headerFunctionId === undefined || headerFunctionId.length === 0) {
												GlobalHelper.globlevar.isHeaderConfigured = false;
												let predata = new Map();
												GlobalHelper.globlevar.worklistinfo.worklist.Columns.map((obj, i) => {    // NOSONAR: javascript:S2201
													predata.set(obj.dataIndex, obj.title);
												})
												GlobalHelper.preColumnData = predata;
												GlobalHelper.selectedRowData = GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows[0];
												store.dispatch({
													type: 'INITIALSCREEN',
													values,
													pr_mode,
													UserSelectorPrompt
												});
											} else {
												GlobalHelper.globlevar.isHeaderConfigured = true;
												store.dispatch({
													type: 'INITIALUISCREEN',
													values,
													headerFunctionId,
													pr_mode,
													UserSelectorPrompt
												});
											}
										}
									});
							}else{
								GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
								GlobalHelper.globlevar['showDefaultFuncOnly'] = undefined;
								GlobalHelper.functionGroupDataMapForSiderMenuItems.clear();
								GlobalHelper.globlevar["promptClicked"] = false;
								// displayMessageBox("Error","No records/data in PromptWorkList from server...  "+err,"E");
								console.log("Error: No records/data in PromptWorkList from server...  " + err);
								GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
								displayMessageBox("Message","No account  prompted ","Message");
								return next({
									type: 'GET_NAMES_FAIL',
									names
								});
							}
						});
				}
			} else if (action.layoutType === "FunctionScreen") {
				//Sprint 13 - To remove Header from Function Screen at MainLayout css
				GlobalHelper.globlevar['removeHeaderFlag'] = true;

				let MENUDATAFETCH_FunctionScreen  = action.url.split("?")[1];
				let _stdata_MENUDATAFETCH_FunctionScreen = getSTData("/"+GlobalHelper.menuContext+"/", MENUDATAFETCH_FunctionScreen);


				request
					.get(action.url)
					.query({_SID_:(_stdata_MENUDATAFETCH_FunctionScreen.SID + _stdata_MENUDATAFETCH_FunctionScreen.SINT)})
					.query({_ADF_:""})
					.send(JSON.stringify(requestData))
					.send({
						'linkoption': action.values,
						'token': 'indus'
					})
					.set('X-API-Key', action.values)
					.set('Accept', 'application/json')
					.end((err, res) => {
						if (err) {
							Log4r.log('MENUDATAFETCH data-service err: call', err);
							GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
							displayMessageBox("Error","No data from server...  "+err,"E");
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						}
						let jsonText = res.text;
						let jsonObj = null
						let parentnode = null;
						try {
							jsonObj=removeBacksLashCharacter(jsonText);
							GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
							parentnode = new Model().handleDataChange(jsonObj);
							GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = jsonObj;
						} catch (e) {
						}
						isRequestStatus(next,jsonObj);
						GlobalHelper.globlevar['parentnode'] = parentnode;
						Log4r.log("jsonObj 456 -- ", jsonObj);
						jsonObjtemplet = jsonObj.JSON_DATA;
						let buttonpalettes = jsonObj.BUTTON_JSON;
					  let quickbuttons = jsonObj.QUICK_BUTTON_JSON;
						Log4r.log("jsonObjtemplet 123 -- ", JSON.stringify(jsonObjtemplet));
						try {
							GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] = jsonObj.CONTEXT.urlParams;
						} catch (e) {
							Log4r.error(e)
						}
						GlobalHelper.globlevar['firstRenderScreen'] = true;
						if (jsonObj.CONTEXT !== undefined) {
							//loadScript('http://localhost/pdgic/secure/js/customcollectionutilsAll.js');
							let jsScripts = jsonObj.JSSCRIPTS;
							if (jsonObj.F2DEF !== undefined) {
								if(jsonObj.F2DEF.refreshOnSave.toLowerCase() == "y" )
								GlobalHelper.globlevar['isolatedRefreshOnSave'] = true;
							}
							/*
							"JSSCRIPTS": [
								{
							      "path": "secure/scripts/ajax.js",
							      "ident": "ajax",
							      "order": "0"
							    }
						    ]

							*/
							//'http://localhost/pdgic/secure/js/customcollectionutilsAll.js'
							/*let jsScripts = [
												{
											      "path": "/secure/js/customcollectionutilsAll.js",
											      "ident": "ajax",
											      "order": "0"
											    }
										    ]*/

												try{
													loadScript("FrameworkUtility/customGenUtils.js");
													if(jsScripts != null)
													for (let jsscriptIndex = 0 ;  jsscriptIndex < jsScripts.length ; jsscriptIndex++) {

														loadScript("/"+ jsScripts[jsscriptIndex].path);
													}
												}catch(e){Log4r.warn(e);}
							// below code may use if we need to encode pipe symbole of context param
							var splitdata = jsonObj.CONTEXT.urlParams.split('&');
						    var CONTEXTurlparam = "" ;
						    for(let i=1; i<splitdata.length;i++){
						    	var cpkvalue = splitdata[i].split('=');
						    	CONTEXTurlparam = CONTEXTurlparam + "&"+(i==1 ? cpkvalue[0]+"="+encodeURIComponent(cpkvalue[1]) : splitdata[i]);
						    }

							GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] = CONTEXTurlparam;

						    let url = "/" + action.context + jsonObj.CONTEXT.url + "?" + CONTEXTurlparam;

							//let url = "/" + action.context + jsonObj.CONTEXT.url + "?" + jsonObj.CONTEXT.urlParams;
							functionScreenDataUrl = url;

							let MENUDATAFETCH_FunctionScreen_nextCall = url.split("?")[1];
							let _stdata_MENUDATAFETCH_FunctionScreen_nextCall = getSTData("/"+GlobalHelper.menuContext+"/", MENUDATAFETCH_FunctionScreen_nextCall);

							request
								.post(url)
								.query({_SID_:(_stdata_MENUDATAFETCH_FunctionScreen_nextCall.SID + _stdata_MENUDATAFETCH_FunctionScreen_nextCall.SINT)})
								.query({_ADF_:""})
								.send(JSON.stringify(requestData))
								.send({
									'linkoption': action.values,
									'token': 'indus'
								})
								.set('X-API-Key', action.values)
								.set('Accept', 'application/xml')
								.end((err, res) => {
									if (err) {
										Log4r.log('data-service err: call', err);
										GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
										displayMessageBox("Error","No data from server...  "+err,"E");
										return next({
											type: 'GET_NAMES_FAIL',
											names
										});
									}
									Log4r.log('res.text data ', res.text);
									let jsonText = res.text;
									let jsonObj = null
									jsonObj=removeBacksLashCharacter(jsonText);
								
									isRequestStatus(next,jsonObj);
									Log4r.log('JSON retrived Object data ', jsonObj);
									GlobalHelper.globlevar['functionMenuClicked'] = "true";//Sprint 21 - COLLECTION/LOS issue fixed to saving data for function screen.
									jsonObjdata = jsonObj.JSON_DATA;
									ParentPK= new ParentPKComponentData();
									ParentPK.getParentQueryString(jsonObjtemplet,jsonObjdata);

									names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
									Log4r.log(JSON.stringify(names));
									let jsonTxt = JSON.stringify(names);
									jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
									names = JSON.parse(jsonTxt).name;
									try{
										names.data[0].name['ScreenLayoutType'] = action.layoutType;//Sprint 40 -  for FunctionScreens - To avoid repeated execution of RuleExecutionUtility at F2FunctionScreen component
										names.data[0].name.ButtonPalette[0] = JSON.parse(JSON.stringify(buttonpalettes));
											names.data[0].name.QuickButtonPalette[0] = JSON.parse(JSON.stringify(quickbuttons));
									}catch(e){
										Log4r.log(e);
									}
									GlobalHelper.globlevar["onload"] = true;
									GlobalHelper.globlevar.onScreenLoadSpin = false;
									if (action.orientationType !== undefined && action.orientationType.length !== 0) {
										names['orientationType'] = action.orientationType;

									} else {
										names['orientationType'] = "self";
									}
									GlobalHelper.globlevar['basicjson'] =JSON.parse(JSON.stringify(names));
									Log4r.log("MENUDATAFETCH call result 123 -- ", JSON.stringify(names));
									names.data[0].name["layoutType"] =  "FunctionScreen";
									GlobalHelper.globlevar.worklistinfo = undefined;
									if(jsScripts != null){
										names.data[0].name['scriptsToLoad'] = jsScripts;
									}
									next({
										type: 'MENUDATAFETCH_OK',
										names
									});
								});
						} else {
							try{
								names = new ReactJsonBuilder(jsonObjtemplet, action.values, jsonObjdata).buildReactJson();
							}catch(e){Log4r.log(e);}
							Log4r.log(JSON.stringify(names));
							let jsonTxt = JSON.stringify(names);
							GlobalHelper.globlevar.onScreenLoadSpin = false;
							jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
							names = JSON.parse(jsonTxt).name;
							GlobalHelper.globlevar['basicjson'] = JSON.parse(JSON.stringify(names));
							// if function screen unable to open. so sending blank screen JSON;
							if(names.data[0].name.screendata.length === 0){
					           names.data[0].name.ButtonPalette = [];
					        }
					        Log4r.log("MENUDATAFETCH call result 123 -- ", JSON.stringify(names));
							GlobalHelper.globlevar.onScreenLoadSpin = true;
							next({
								type: 'MENUDATAFETCH_OK',
								names
							});
						}
					});
			} else if (action.layoutType === "CustomScreen1" || action.layoutType === "CustomScreen" || action.layoutType === "CustomScreen2") {
				GlobalHelper.globlevar['removeHeaderFlag'] = true;
				GlobalHelper.globlevar['customScreenFlag'] = true;//To change button in QueryBuilder popup
				let values = action.layoutType;
				let url = action.url;
				Log4r.log("!@1222.....Custom Screen");
				store.dispatch({
					type: 'CUSTOMSCREEN',
					values,
					url
				});
			} else if (action.layoutType === "Dashboard") {

				GlobalHelper.globlevar['removeHeaderFlag'] = true;
				GlobalHelper.globlevar['customScreenFlag'] = true;
				GlobalHelper.globlevar['linkclicked'] = false;
				GlobalHelper.globlevar['isreadysaveclicked'] = true;

				requestData = {
					'__functionId': action.url,
					'DBACTION': 'GENERATE',
					'token': 'indus'
				};
				GlobalHelper.globlevar['nextandpreviousfunctionid'] = action.url;
				layoutID = action.url;

				let MENUDATAFETCH_FunctionScreen_Dashboard = action.url.split("?")[1];
				let _stdata_MENUDATAFETCH_FunctionScreen_Dashboard = getSTData("/" + GlobalHelper.menuContext + "/", MENUDATAFETCH_FunctionScreen_Dashboard);

				request
					.get(action.url)
					.query({ _SID_: (_stdata_MENUDATAFETCH_FunctionScreen_Dashboard.SID + _stdata_MENUDATAFETCH_FunctionScreen_Dashboard.SINT) })
					.query({ _ADF_: "" })
					.query({ 'DBACTION': 'GENERATE' })
					.send(JSON.stringify(requestData))
					.send({
						'linkoption': action.values,
						'token': 'indus'
					})
					.set('X-API-Key', action.values)
					.set('Accept', 'application/json')
					.end((err, res) => {
						if (err) {
							// here is the auto-logout on rest call failed with 401 http status
							//if(err.status === 401) return store.dispatch(authDiscardToken());
							GlobalHelper.globlevar['UserSelectorSpinFlag'] = false;
							displayMessageBox("Error", "No data from server...  " + err, "E");
							// Return the error action
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						}

						let jsonTxt = res.text;
						jsonTxt = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"Dashboard\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonTxt + "}]}}";
						let names = JSON.parse(jsonTxt).name;

						if (action.pr_mode !== undefined && action.pr_mode.length !== 0) {
							names['pr_mode'] = action.pr_mode; //Sprint 10 Task(69):Prompt mode will be added into names
							GlobalHelper.globlevar.raiseFalg = true;
						}

						next({
							type: 'LAYOUTRIGHTICON_OK',
							names
						});
					});
			}
			break;
			/*Sprint 11 - Task 58 , Task 59
			 Clip search Ajax call on click on search &
			 show list of result or show details of screen if only one record available*/
		case 'CLIPSEARCH':
			Log4r.log("clipsearch container......", action);
            ErrorHandler.clear();
			//Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
			if(GlobalHelper.globlevar['ClipSearchRoot'] === "TableContainer"){
					GlobalHelper.globlevar['ClipSearchViaWorklist'] = true;
					GlobalHelper.globlevar['ClipSearchViaUIScreen'] = undefined;
					GlobalHelper.globlevar['ClipSearchViaPrompMode'] = undefined;
					GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = undefined;
					GlobalHelper.globlevar['promptmode'] = null;
			}else if(GlobalHelper.globlevar['ClipSearchRoot'] === "prompt"){
				GlobalHelper.globlevar['ClipSearchViaPrompMode'] = true;
				GlobalHelper.globlevar['ClipSearchViaWorklist'] = undefined;
				GlobalHelper.globlevar['ClipSearchViaUIScreen'] = undefined;
				GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = undefined;
			}else if(GlobalHelper.globlevar['ClipSearchRoot'] === "UIScreen"){
					GlobalHelper.globlevar['ClipSearchViaUIScreen'] = true;
					GlobalHelper.globlevar['ClipSearchViaWorklist'] = undefined;
					GlobalHelper.globlevar['ClipSearchViaPrompMode'] = undefined;
					GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = undefined;
			}else if(GlobalHelper.globlevar["customScreenClicked"] === true){
				GlobalHelper.globlevar['ClipSearchViaCustomScreen'] = true;
				GlobalHelper.globlevar['ClipSearchViaWorklist'] = undefined;
				GlobalHelper.globlevar['ClipSearchViaUIScreen'] = undefined;
				GlobalHelper.globlevar['ClipSearchViaPrompMode'] = undefined;
			}
			//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
			var names = "";
			var finalObj = {};
			var result1 = "";
			GlobalHelper.activeMenuId = "";

			let CLIPSEARCH_PostDataurl = action.url.split("?")[1];
			let _stdata_CLIPSEARCH_PostDataurl = getSTData("/"+GlobalHelper.menuContext+"/", CLIPSEARCH_PostDataurl);


			request
				.get(action.url)
				.query({_SID_:(_stdata_CLIPSEARCH_PostDataurl.SID + _stdata_CLIPSEARCH_PostDataurl.SINT)})
				.query({_ADF_:""})
				.query({
					txtListEntityId: action.listEntityId
				})
				.query({
					filterXML: action.filterXML
				})
				.set('Accept', 'application/json')
				.end((err, res) => {
					if (err) {
						Log4r.log('worklist data error call....', err);
						return next({
								type: 'GET_NAMES_FAIL',
								names
							});
					}
					Log4r.log('res.text data ', res.text);
					var xmlDoc = $.parseXML(res.text);
					var $xml = $(xmlDoc);
					var $title = $xml.find("success");
					var jsonText = $title.text();
					var jsonTxt = jsonText;
					const jsonObj = removeBacksLashCharacter(jsonTxt);;
					Log4r.log('JSON retrived Object data... ', jsonObj);
					finalObj.worklistfunctiongroupdata = jsonObj;
					let length;
					let record;
					let worklist;
					//commented below code because if search via clipearch and redirect to worklist,and click on worklist account,submit button disable.
					// if(GlobalHelper.worklistData && GlobalHelper.worklistData.worklist)
					// {
					// 	GlobalHelper.worklistData.worklist['taskId'] = "";
					// }
					if((GlobalHelper.globlevar['ClipSearchRoot'] == "TableContainer"|| GlobalHelper.globlevar['ClipSearchRoot'] == "UIScreen")||GlobalHelper.globlevar.UIScreen==true)
					{
						removeButton("submit");
						GlobalHelper.globlevar['hideSubmitButtonflag'] = true;
					}
					// CAN BE CONVERTED TO THE ARROW FUNCTION
					jsonObj.entities.forEach(function(item, index) {
						Log4r.log("sdkjjsd.....", item, jsonObj.defaultListEntityId);
						if (jsonObj.defaultListEntityId === item.worklist.id) {
							length = item.worklist.DataSource.rows.length;
							record = item.worklist.DataSource.rows;
							worklist = item.worklist;
							GlobalHelper.globlevar['worklistinfo'] = item;
						if(length !== 1){
								GlobalHelper.worklistData = item;
								GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
								GlobalHelper.worklistSortFilterXml = "";
								GlobalHelper.workListDataMap.clear();
								GlobalHelper.currentPageWithCurretRecords.clear();
								for (let i = 0; i < item.worklist.DataSource.rows.length; i++) {
					        item.worklist.DataSource.rows[i]['key'] = i;
					      }
								GlobalHelper.workListDataMap.set(1, item.worklist.DataSource.rows);
								GlobalHelper.currentPageWithCurretRecords.set(1, item.worklist.DataSource.rows);
								GlobalHelper.worklistPageNo.set("current",1);
							}
							GlobalHelper.functionGroupDataMapForSiderMenuItems.set(action.menu, jsonObj.functiongroups);
							GlobalHelper.functionGroupData = jsonObj.functiongroups;
							GlobalHelper.listEntityId = jsonObj.defaultListEntityId;
						}
					})
					if (length == 1) {
						GlobalHelper.globlevar['multiRecordViaClipsearch'] = false;
						GlobalHelper.globlevar['promptworklistNextButtonDisable']  = true;
						record = JSON.stringify(record);
						var _listEntityId = action.listEntityId;
						var cpkvalue = "";
						var cplvalue = "";
						var contextvalue = "";
						var cpkValueArray = new Array();
						var contextKeyValuePair = new Array();
						var contextKeyMap = new Map();
						let is_utavailable = false;
						worklist.Columns.map((user, i) => {    // NOSONAR: javascript:S2201
							if (user.contexKeys !== undefined && user.contexKeys !== "" && user.contexKeys !== null && user.contexKeys !== "null") {
								contextKeyMap.set(user.dataIndex, user.contexKeys);
							}
						});
						contextKeyMap.forEach(function (value, key) {
							var tempdata = value.split(",");
							tempdata.map((tempnew, tempi) => {    // NOSONAR: javascript:S2201
								if(tempnew == "_ut")
						        {
						          Log4r.log("checkedd....");
						          is_utavailable = true;
						        }

								cpkValueArray.push(tempnew);
								Log4r.log("GlobalHelper.globlevar.worklistinfo.DataSource",GlobalHelper.globlevar.worklistinfo);
								contextKeyValuePair.push(tempnew + "=" + GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows[0][key])
							});
						});

						if(!is_utavailable)
					    {
					      contextKeyValuePair.push("_ut=ALLOCATED_USER");
					    }
					    contextKeyValuePair.push("transactionrequest=Y");
					    cpkvalue = "__cpk=" + cpkValueArray.join("|") + "|_ut";
						cplvalue = "__cpl=" + cpkValueArray.length;
						contextvalue = contextKeyValuePair.join("&");
						GlobalHelper.contextPrimaryKey = cpkvalue;
						GlobalHelper.contextPKValues = contextvalue;
						GlobalHelper.contextPrimaryKeyLength = "__cpl=1";
						if(GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined) {
							GlobalHelper.globlevar['clipsearchcloseprejson'].listEntityId = GlobalHelper.listEntityId;
							GlobalHelper.globlevar['clipsearchcloseprejson'].contextPKValues = GlobalHelper.contextPKValues;
							GlobalHelper.globlevar['clipsearchcloseprejson'].contextPrimaryKey = GlobalHelper.contextPrimaryKey;
							GlobalHelper.globlevar['clipsearchcloseprejson'].contextPrimaryKeyLength = GlobalHelper.contextPrimaryKeyLength;
						}else{
							let clipSearchCloseActions = {};
							try {
							   if(GlobalHelper.globlevar['clipsearchcloseprejson'] == undefined )
							   {
								 clipSearchCloseActions['listEntityId'] = GlobalHelper.listEntityId;
								 clipSearchCloseActions['contextPKValues'] =   GlobalHelper.contextPKValues;
								 clipSearchCloseActions['contextPrimaryKey'] = GlobalHelper.contextPrimaryKey;
								 clipSearchCloseActions['contextPrimaryKeyLength'] = GlobalHelper.contextPrimaryKeyLength;
								 GlobalHelper.globlevar['clipsearchcloseprejson'] = clipSearchCloseActions ;
							   }
						   } catch (e) {
							   Log4r.error(e);
						   }
						}

						var contextprimarykeyvalue = GlobalHelper.contextPrimaryKey.split('=');
      		var contextencodevalue = contextprimarykeyvalue[0]+"="+ encodeURIComponent(contextprimarykeyvalue[1]);

			let postUrlClipsearch = "/"+GlobalHelper.menuContext+"/secure/listAction.do?_rt=isFunctionAccessible&listEntityId=" + _listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&";

			let CLIPSEARCH_Functions_PostDataurl = postUrlClipsearch.split("?")[1];
			let _stdata_CLIPSEARCH_Functions_PostDataurl = getSTData("/"+GlobalHelper.menuContext+"/", CLIPSEARCH_Functions_PostDataurl);


						request
							.get("/"+GlobalHelper.menuContext+"/secure/listAction.do?_rt=isFunctionAccessible&listEntityId=" + _listEntityId + "&" + GlobalHelper.contextPKValues + "&" + contextencodevalue + "&" + GlobalHelper.contextPrimaryKeyLength + "&functionMode=F&")
							.query({_SID_:(_stdata_CLIPSEARCH_Functions_PostDataurl.SID + _stdata_CLIPSEARCH_Functions_PostDataurl.SINT)})
							.query({_ADF_:""})
							.set('Accept', 'application/json')
							.end((err, res) => {
								if (err) {
									Log4r.log('ERROR IN GETTING FUNCTION IDS', err);
									return next({
										type: 'GET_NAMES_FAIL',
										names
									});
								} else {
									var xmlDoc = $.parseXML(res.text);
									var $xml = $(xmlDoc);
									var $title = $xml.find("success");
									var jsonText = $title.text();
									var jsonTxt = jsonText;
									const jsonObj = JSON.parse(jsonTxt);
									var strIds = jsonObj[0].LIST_ROW_0;
									strIds.functions.map((func, i) => {    // NOSONAR: javascript:S2201
										GlobalHelper.functionAccessMap.set(func.funcid, func.access);
										GlobalHelper.functionListMap.set(func.funcid, func);
									});
									Log4r.log("FUNCTION ID CLIP DATA", strIds);
									if (strIds !== undefined) {
										let functionId = strIds;
										GlobalHelper.holdFunGroupData = GlobalHelper.getByFuncIds(functionId);
										let firstRightSelectedIcon = GlobalHelper.holdFunGroupData.values().next().value;
										let values = firstRightSelectedIcon.content[0].id;

										if(worklist !== undefined){

											if(worklist.userDefFunctionId !== undefined) {
												if(worklist.userDefFunctionId.length !== 0) {
													values = worklist.DataSource.rows[0][worklist.userDefFunctionId];
													GlobalHelper.defaultfunction = [values];
												} else {
														if(worklist.defFunction !== undefined) {
															if(worklist.defFunction.length !== 0) {
																values = worklist.DataSource.rows[0][worklist.defFunction];
																GlobalHelper.defaultfunction = [values];
														}
													}
												}
											} else {
												GlobalHelper.globlevar.UIScreen = "UIScreen";
											}
										}

										Log4r.log("Optimus Prime : ",values);

										let headerFunctionId;
										//GlobalHelper.globlevar['headername']=true;
										if (functionId.headerFucntion !== undefined) {
											headerFunctionId = functionId.headerFucntion.headerFunctionId;
										}
										GlobalHelper.globlevar.functionID = values;
										
										GlobalHelper.globlevar.savespin = false;
            							if (headerFunctionId === undefined || headerFunctionId.length === 0) {
											GlobalHelper.globlevar.isHeaderConfigured = false;
											let predata = new Map();
											GlobalHelper.globlevar.worklistinfo.worklist.Columns.map((obj, i) => {    // NOSONAR: javascript:S2201
												predata.set(obj.dataIndex, obj.title);
											})
											GlobalHelper.preColumnData = predata;
											GlobalHelper.selectedRowData = GlobalHelper.globlevar.worklistinfo.worklist.DataSource.rows[0];
											store.dispatch({
												type: 'INITIALSCREEN',
												values
											});
										} else {
											GlobalHelper.globlevar.isHeaderConfigured = true;
											store.dispatch({
												type: 'INITIALUISCREEN',
												values,
												headerFunctionId
											});
										}
									}
								}
							})
						let ScreenData = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"UIScreen\",\"LayoutHeader\": \"\",\"data\": [] }}"
						names = JSON.parse(ScreenData);
						names = names.name;
						names.data.push(finalObj);
						GlobalHelper.globlevar.csr = "true";
						GlobalHelper.globlevar["ClearTabArray"] = (GlobalHelper.globlevar['tabScreen'] != undefined && GlobalHelper.globlevar['tabScreen'].length == 0) ? false: true;
						GlobalHelper.globlevar['tabScreen'] = new Array();
						GlobalHelper.globlevar['tabKey'] = 1;
						GlobalHelper.globlevar['changeTitle'] = undefined
						GlobalHelper.globlevar['activetabKey'] = 1;
						GlobalHelper.globlevar["closeButtonCall"] = false;
						next({
							type: 'LAYOUTRIGHTICON_OK',
							names
						})
					} else {
						if(length == 0){
							GlobalHelper.globlevar['gridredirect'] = "true"; //Sprint 16 - to redirect into Gridworklist from UIScreen if no records found after search.
							GlobalHelper.globlevar['multiRecordViaClipsearch'] = true;
						}else if(length>1){
							GlobalHelper.globlevar['gridredirect'] = "true";
							GlobalHelper.globlevar['multiRecordViaClipsearch'] = true;
						}
						var jsondata = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\": [] }}";
						var combinedJson = JSON.parse(jsondata);
						names = combinedJson.name;
						names.data.push(finalObj);
						next({
							type: 'LAYOUTRIGHTICON_OK',
							names
						})
					}
				});
			break;

case 'ADVANCESEARCH':
	Log4r.log("clipsearch container......", action);
	// url = "/"+GlobalHelper.menuContext+"/secure/attributeNavigator.do?";
   url = "/"+GlobalHelper.menuContext+"/secure/listAction.do?";
//let  urla = "pdgic/secure/listAction.do?_rt=getUserAdvanceFilterById&strFilterId=7767f55b3e2348be8bad1bb6bcf0bfb2";
	//let url = "/QueryBuilderTest.xml";
	let postUrlData  = url.split("?")[1];
	let _stdata = getSTData("/"+GlobalHelper.menuContext+"/", postUrlData);
	request
	 .get(url)
	 .query({txtListEntityId:GlobalHelper.listEntityId})
	 .query({_rt:'saveDefaultFilter'})
	 .query({"strFilterId": action.deletefilterid})
	 .query({"strFiltername": action.deletefiltername})
	 .query({txtListEntityId:GlobalHelper.listEntityId})
	 .query({sortXML:GlobalHelper.worklistSortFilterXml})
	 .query({strFilterId:action.checkboxfilterid})
	 .query({advFilterName:action.checkboxfiltername})
	 .query({
		_SID_: (_stdata.SID + _stdata.SINT)
	  })
//	 .query({"skipChildEntity":"Y"})
//	 .query({"includeAttributeJSON":"Y"})
	 .set('Accept', 'application/xml')
	 .end((err, res) => {
	   let queryBuilderObj = null;
		if (err) {
		   Log4r.log("Error from ajax call in QueryBuilderWidget.....",err);
		}
		else {
		   Log4r.log("Result from ajax call in QueryBuilderWidget.....",res);
		   let xmlDoc = $.parseXML(res.text);
		   displayMessageBox("INFO",action.checkboxfiltername+" set as default successfully","I");
		   let $xml = $( xmlDoc );
		   let $title = $xml.find( "root" );
		   let jsonText = $title.text();
		   let jsonTxt = jsonText;
		   //Log4r.log('JSON retrived data.....', jsonTxt);
		   let jsonObj = null
		  
		   GlobalHelper.globlevar.deletefilter =true;
		   try{
			eval("jsonObj = " + jsonText);
			 
		   }catch(e){ Log4r.log("Error in parsing json............");}
		}
		
	})
break;



			/*case for Multiple Worklist Layout - to fetch data for selected worklist*/
		case 'MULTIPLEWORKLIST':
			Log4r.log("MULTI worklist - container data: ", action);
			GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] = undefined;
			GlobalHelper.globlevar['advsearchdataflag'] = false;//Sprint 31 - Refresh & Clear functionality in AdvanceSearchLayout
			GlobalHelper.savedAdvanceSearchData.clear();//Sprint 31 - Refresh & Clear functionality in AdvanceSearchLayout
			GlobalHelper.globlevar['customScreenFlag'] = false;//Sprint 31 - Refresh & Clear functionality in AdvanceSearchLayout.
			var names = "";
			var finalObj = {};
			if(GlobalHelper.activeMenuId==action.menuId && GlobalHelper.worklistStructureMap.has(action.listEntityId)){
			GlobalHelper.functionGroupData=GlobalHelper.functionGroupDataMapForSiderMenuItems.get(action.menuId);
			let dataOnlyFlag='N';
			let structuralDataForWorkList={};
			let url = "/"+GlobalHelper.menuContext+"/secure/listAction.do?";
			if (GlobalHelper.worklistStructureMap.has(action.listEntityId)) {
				dataOnlyFlag='Y';
				structuralDataForWorkList = GlobalHelper.worklistStructureMap.get(action.listEntityId)
			}

			let MULTIPLEWORKLIST_PostDautaUrl = url.split("?")[1];
			let _stdata_MULTIPLEWORKLIST_PostDautaUrl = getSTData("/"+GlobalHelper.menuContext+"/", MULTIPLEWORKLIST_PostDautaUrl);

			request
					.get(url)
					.query({_SID_:(_stdata_MULTIPLEWORKLIST_PostDautaUrl.SID + _stdata_MULTIPLEWORKLIST_PostDautaUrl.SINT)})
					.query({_ADF_:""})
					.query({
						_rt: 'fetchListEntityForReact'
					})
					.query({
						txtListEntityId: action.listEntityId
					})
					.query({
						filterXML: GlobalHelper.completeFilterXML
					})
					.query({
						sortXML: GlobalHelper.worklistSortFilterXml
					})
					.query({
						dataOnly: dataOnlyFlag
					})
					.query({
						includeFunctionRepo: "N"
					})
					.end((err, res) => {
						if (err) {
							Log4r.log("Error from ajax call-- ", err);
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						} else {
							Log4r.log("Result from ajax call-- ", res);
							let xmlDoc = $.parseXML(res.text);
							let $xml = $(xmlDoc);
							let $title = $xml.find("success");
							let jsonText = $title.text();
							let jsonTxt = jsonText;
							let jsonObj = removeBacksLashCharacter(jsonTxt);;
							Log4r.log('GridWorkList JSON retrived Object data.....', jsonObj);

	            //Adding code to create map having global function Id
								if(jsonObj !== null && jsonObj.functiongroups != undefined){
									if(jsonObj !== null && jsonObj.functiongroups.formHeaderBookmarks.length !== 0  && jsonObj.functiongroups.formHeaderBookmarks !== undefined){
										 GlobalHelper.globlevar['globalFunctionsMap'] = new Map();
										 jsonObj.functiongroups.formHeaderBookmarks.map((funcGroup, i) => {    // NOSONAR: javascript:S2201
									       funcGroup.content.map((functionObj, j) => {    // NOSONAR: javascript:S2201
		                          if(functionObj.isGlobalFunction != undefined && functionObj.isGlobalFunction == "Y"){
		                             GlobalHelper.globlevar.globalFunctionsMap.set(functionObj.id,functionObj.cap);
		                          }
		                     });
		    						});
		              }
								}

							if(Object.keys(structuralDataForWorkList).length==0){
								if(jsonObj.entities != null && jsonObj.entities.length > 0){
									GlobalHelper.worklistData = jsonObj.entities[0];
									GlobalHelper.worklistStructureMap.set(GlobalHelper.worklistData.worklist.id, jsonObj.entities[0]);
								}
							}
							else{
								GlobalHelper.worklistData = structuralDataForWorkList;
							}
							GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
							GlobalHelper.worklistSortFilterXml = "";
							GlobalHelper.workListDataMap.clear();
							GlobalHelper.currentPageWithCurretRecords.clear();
							GlobalHelper.worklistPageNo.set("current",1);
							GlobalHelper.globlevar.defAdvFilter =""


 
							try{
								if(jsonObj.entities != null && jsonObj.entities.length > 0)
								{	
									
									 if(jsonObj.entities[0].worklist.UserAdvFilterMap != null || jsonObj.entities[0].worklist.UserAdvFilterMap != undefined){
										GlobalHelper.globlevar.UserAdvFilterMap = jsonObj.entities[0].worklist.UserAdvFilterMap;
										GlobalHelper.globlevar.objectLength = Object.entries(GlobalHelper.globlevar.UserAdvFilterMap );
										if(jsonObj.entities[0].worklist.defAdvFilter != null || jsonObj.entities[0].worklist.defAdvFilter != undefined){
											GlobalHelper.globlevar.UserAdvFilterMap  = jsonObj.entities[0].worklist.userAdvFilter;
											var defAdvFilter = jsonObj.entities[0].worklist.defAdvFilter;
										   try{
											   let defval =defAdvFilter;
										   GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {
											   let ak =Kitm[0].split("::");
											   let advfilterid = ak[0];
											   let advfilternameupdate = ak[1].split(":~:");
											   let advfiltername = advfilternameupdate[0];
											   let advfilterflag = advfilternameupdate[1];
											  if(defval === advfilterid){
											   GlobalHelper.globlevar.defAdvFilter =advfiltername;
											  }
									   })
								   }
								   catch(e){
									   Log4r.log("e",e);
								   }
									   }
									   else{
										   GlobalHelper.globlevar.defAdvFilter =""
									   }
									}
                                         else{
									GlobalHelper.globlevar.UserAdvFilterMap  = false;
                                    }										

									Log4r.log("Alok 1 Advance Filter: ", jsonObj.entities[0].worklist.userAdvFilter);
									Log4r.log("Alok 2 Advance Filter: ", jsonObj.entities[0].worklist.UserAdvFilterMap);
									GlobalHelper.worklistData.worklist.DataSource = jsonObj.entities[0].worklist.DataSource;
									//Sprint49 - Advance Search layout filterXML - Replacing with latest advance filterXML.
									GlobalHelper.worklistData.worklist['userSortXML'] = jsonObj.entities[0].worklist['userSortXML'];//Sprint49 - Worklist Sort layout sortXML - Replacing with latest sortXML.
								
									for (let i = 0; i < jsonObj.entities[0].worklist.DataSource.rows.length; i++) {
										jsonObj.entities[0].worklist.DataSource.rows[i]['key'] = i;
									}
									GlobalHelper.workListDataMap.set(1, jsonObj.entities[0].worklist.DataSource.rows);
									GlobalHelper.currentPageWithCurretRecords.set(1, jsonObj.entities[0].worklist.DataSource.rows);
									GlobalHelper.globlevar['worklistinfo'] = GlobalHelper.worklistData;
									GlobalHelper.listEntityId = GlobalHelper.worklistData.worklist.id;
									GlobalHelper.multiworklistMap.set(GlobalHelper.worklistData.worklist.id, GlobalHelper.worklistData.worklist.DataSource.rows.length);
									finalObj.worklistfunctiongroupdata = GlobalHelper.functionGroupData;
									GlobalHelper.functionObjectMap(GlobalHelper.functionGroupData);
								}
							}catch(e){Log4r.error(e)}

								if(GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].clipsearchFilterXml !== undefined) {
									GlobalHelper.globlevar['clipsearchcloseprejson'].clipsearchFilterXml = undefined;
								}
								var jsondata = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonText + "}] }}";
								var combinedJson = JSON.parse(jsondata);
								names = combinedJson.name;
								names.data.push(finalObj);
								try{
										if(names.data[0].name.entities !== undefined && names.data[0].name.entities[0].worklist.showDefaultFuncOnly !== undefined) {
											GlobalHelper.globlevar['showDefaultFuncOnly'] = names.data[0].name.entities[0].worklist.showDefaultFuncOnly;
											Log4r.log("GlobalHelper.globlevar['showDefaultFuncOnly'] => " , GlobalHelper.globlevar['showDefaultFuncOnly']);
										}else if(GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist.showDefaultFuncOnly !== undefined) {
											GlobalHelper.globlevar['showDefaultFuncOnly'] = GlobalHelper.worklistData.worklist.showDefaultFuncOnly;
											Log4r.log("GlobalHelper.globlevar['showDefaultFuncOnly'] => " , GlobalHelper.globlevar['showDefaultFuncOnly']);
										}

									}catch(e){Log4r.error(e)}
								next({
									type: 'LAYOUTRIGHTICON_OK',
									names
								})
						}
					});
			}
			else{
				GlobalHelper.activeMenuId=action.menuId
				if(GlobalHelper.functionGroupDataMapForSiderMenuItems.has(action.menuId)){
				GlobalHelper.functionGroupData=GlobalHelper.functionGroupDataMapForSiderMenuItems.get(action.menuId);
			}
			else{
			GlobalHelper.functionGroupData=undefined;
			}
			let structuralDataForWorkList={};
			if (GlobalHelper.worklistStructureMap.has(action.listEntityId)) {
				structuralDataForWorkList = GlobalHelper.worklistStructureMap.get(action.listEntityId)
			}
			else
			{
				structuralDataForWorkList=undefined;
			}
			let dataOnlyFlag='Y';
			let includeFunctionRepoFlag='N';
			if(GlobalHelper.functionGroupData==undefined)
			{
				includeFunctionRepoFlag='Y';
			}

			if(structuralDataForWorkList==undefined)
			{
				dataOnlyFlag='N';
			}
				let url = action.url;

				let MULTIPLEWORKLIST_PostDautaUrl_inactiveMenuId = url.split("?")[1];
				let _stdata_MULTIPLEWORKLIST_PostDautaUrl_inactiveMenuId = getSTData("/"+GlobalHelper.menuContext+"/", MULTIPLEWORKLIST_PostDautaUrl_inactiveMenuId);



				request
					.get(url)
					.query({_SID_:(_stdata_MULTIPLEWORKLIST_PostDautaUrl_inactiveMenuId.SID + _stdata_MULTIPLEWORKLIST_PostDautaUrl_inactiveMenuId.SINT)})
					.query({_ADF_:""})
					.query({
						_rt: 'fetchListEntityForReact'
					})
					.query({
						txtListEntityId: action.listEntityId
					})
					.query({
						filterXML: ""
					})
					.query({
						sortXML: GlobalHelper.worklistSortFilterXml
					})
					.query({
						dataOnly: dataOnlyFlag
					})
					.query({
						includeFunctionRepo: includeFunctionRepoFlag
					})
					.end((err, res) => {
						if (err) {
							Log4r.log("Error from ajax call-- ", err);
							return next({
								type: 'GET_NAMES_FAIL',
								names
							});
						} else {
							Log4r.log("Result from ajax call-- ", res);
							let xmlDoc = $.parseXML(res.text);
							let $xml = $(xmlDoc);
							let $title = $xml.find("success");
							let jsonText = $title.text();
							let jsonTxt = jsonText;
							let jsonObj = removeBacksLashCharacter(jsonTxt);;
							Log4r.log('GridWorkList JSON retrived Object data.....', jsonObj);

							//Adding code to create map having global function Id
							if(jsonObj !== null && jsonObj.functiongroups != undefined){
								if(jsonObj.functiongroups.formHeaderBookmarks.length !== 0  && jsonObj.functiongroups.formHeaderBookmarks !== undefined){
									 GlobalHelper.globlevar['globalFunctionsMap'] = new Map();
									 jsonObj.functiongroups.formHeaderBookmarks.map((funcGroup, i) => {    // NOSONAR: javascript:S2201
								       funcGroup.content.map((functionObj, j) => {    // NOSONAR: javascript:S2201
	                          if(functionObj.isGlobalFunction != undefined && functionObj.isGlobalFunction == "Y"){
	                             GlobalHelper.globlevar.globalFunctionsMap.set(functionObj.id,functionObj.cap);
	                          }
	                     });
	    						});
	              }
							}

							if(structuralDataForWorkList==undefined)
							{
								GlobalHelper.worklistData = jsonObj.entities[0];
							}
							else{
								GlobalHelper.worklistData = structuralDataForWorkList;
							}
							GlobalHelper.globlevar.defAdvFilter =""
							if(jsonObj.entities[0].worklist.UserAdvFilterMap != null || jsonObj.entities[0].worklist.UserAdvFilterMap != undefined){
								GlobalHelper.globlevar.UserAdvFilterMap  = jsonObj.entities[0].worklist.UserAdvFilterMap;
								GlobalHelper.globlevar.objectLength = Object.entries(GlobalHelper.globlevar.UserAdvFilterMap );
								if(jsonObj.entities[0].worklist.defAdvFilter != null || jsonObj.entities[0].worklist.defAdvFilter != undefined){
										GlobalHelper.globlevar.UserAdvFilterMap  = jsonObj.entities[0].worklist.userAdvFilter;
									var defAdvFilter = jsonObj.entities[0].worklist.defAdvFilter;
								   try{
									   let defval =defAdvFilter;
								   GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {
									   let ak =Kitm[0].split("::");
									   let advfilterid = ak[0];
									   let advfilternameupdate = ak[1].split(":~:");
									   let advfiltername = advfilternameupdate[0];
									   let advfilterflag = advfilternameupdate[1];
									  if(defval === advfilterid){
									   GlobalHelper.globlevar.defAdvFilter =advfiltername;
									  }
							   })
						   }
						   catch(e){
							   Log4r.log("e",e);
						   }
							   }
							   else{
								   GlobalHelper.globlevar.defAdvFilter =""
							   }
							 }
                         else{
							GlobalHelper.globlevar.UserAdvFilterMap  = false;
                            }
							Log4r.log("Alok 3 Advance Filter: ", jsonObj.entities[0].worklist.userAdvFilter);
							Log4r.log("Alok 4 Advance Filter: ", jsonObj.entities[0].worklist.UserAdvFilterMap);
							GlobalHelper.worklistData.worklist.DataSource = jsonObj.entities[0].worklist.DataSource;
							//GlobalHelper.worklistData.worklist.userAdvFilter = jsonObj.entities[0].worklist.userAdvFilter;//Sprint49 - Advance Search layout filterXML - Replacing with latest advance filterXML.
							//GlobalHelper.worklistData.worklist.userAdvFilter="";
							GlobalHelper.worklistData.worklist['userSortXML'] = jsonObj.entities[0].worklist['userSortXML'];//Sprint49 - Worklist Sort layout sortXML - Replacing with latest sortXML.
							GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
							GlobalHelper.worklistSortFilterXml = "";
							GlobalHelper.workListDataMap.clear();
							GlobalHelper.currentPageWithCurretRecords.clear();
							for (let i = 0; i < jsonObj.entities[0].worklist.DataSource.rows.length; i++) {
								jsonObj.entities[0].worklist.DataSource.rows[i]['key'] = i;
							}
							GlobalHelper.workListDataMap.set(1, jsonObj.entities[0].worklist.DataSource.rows);
							GlobalHelper.currentPageWithCurretRecords.set(1, jsonObj.entities[0].worklist.DataSource.rows);
							GlobalHelper.worklistPageNo.set("current",1);

							GlobalHelper.globlevar['worklistinfo'] = GlobalHelper.worklistData;
							GlobalHelper.listEntityId = GlobalHelper.worklistData.worklist.id;
							GlobalHelper.multiworklistMap.set(GlobalHelper.worklistData.worklist.id, GlobalHelper.worklistData.worklist.DataSource.rows.length);
							if(GlobalHelper.functionGroupData == undefined){
							GlobalHelper.functionGroupDataMapForSiderMenuItems.set(action.menuId, jsonObj.functiongroups);
							GlobalHelper.functionGroupData = jsonObj.functiongroups;
						}
						finalObj.worklistfunctiongroupdata = GlobalHelper.functionGroupData;
						GlobalHelper.functionObjectMap(GlobalHelper.functionGroupData);
						if(!GlobalHelper.worklistStructureMap.has(GlobalHelper.worklistData.worklist.id)){
						GlobalHelper.worklistStructureMap.set(GlobalHelper.worklistData.worklist.id, jsonObj.entities[0]);
					}
					if(GlobalHelper.globlevar['clipsearchcloseprejson'] !== undefined && GlobalHelper.globlevar['clipsearchcloseprejson'].clipsearchFilterXml !== undefined) {
						GlobalHelper.globlevar['clipsearchcloseprejson'].clipsearchFilterXml = undefined;
					}
							var jsondata = "{\"name\": {\"LayoutName\": \"MainLayout\",\"ScreenLayoutName\": \"GridWorkList\",\"LayoutHeader\": \"\",\"data\":[{\"name\": " + jsonText + "}]}}";
							var combinedJson = JSON.parse(jsondata);
							names = combinedJson.name;
							names.data.push(finalObj);
							try{
										if(names.data[0].name.entities !== undefined && names.data[0].name.entities[0].worklist.showDefaultFuncOnly !== undefined) {
											GlobalHelper.globlevar['showDefaultFuncOnly'] = names.data[0].name.entities[0].worklist.showDefaultFuncOnly;
											Log4r.log("GlobalHelper.globlevar['showDefaultFuncOnly'] => " , GlobalHelper.globlevar['showDefaultFuncOnly']);
										}else if(GlobalHelper.worklistData.worklist !== undefined && GlobalHelper.worklistData.worklist.showDefaultFuncOnly !== undefined) {
											GlobalHelper.globlevar['showDefaultFuncOnly'] = GlobalHelper.worklistData.worklist.showDefaultFuncOnly;
											Log4r.log("GlobalHelper.globlevar['showDefaultFuncOnly'] => " , GlobalHelper.globlevar['showDefaultFuncOnly']);
										}

										loadScript('/'+GlobalHelper.menuContext+'/secure/script/react/customworklistload.js');
										window.onWorklistLoad(names);
							}catch(e){Log4r.error(e)}
							next({
								type: 'LAYOUTRIGHTICON_OK',
								names
							})
						}
					});
			}
			break;

      case 'RESTORENAMES':
						Log4r.log("Action Values in Restore Names ??",action.values);
						names = null;
						names = action.values;
						names['orientationType'] = "self";
						names['reassignF2FunctionTitle'] = "false";
						names['firstRenderScreenData'] = action.firstRenderScreenData;
						GlobalHelper.globlevar.onScreenLoadSpin = false;
						GlobalHelper.globlevar["onload"] = true;
           				GlobalHelper.globlevar['restoringNames'] = false;
						if(GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] != null){
							new Model().handleDataChange(GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'])
						}
						try {
							loadScript("FrameworkUtility/customGenUtils.js");
							if(action.scriptsToLoad  != null){
								for (let scriptIndex = 0 ;  scriptIndex < action.scriptsToLoad.length ; scriptIndex++) {
									loadScript("/"+ action.scriptsToLoad[scriptIndex].path);
								}
							}
							else if (action.values.data[0].name.scriptsToLoad != undefined && action.values.data[0].name.scriptsToLoad != null){
								action.scriptsToLoad = action.values.data[0].name.scriptsToLoad;
								for (let scriptIndex = 0 ;  scriptIndex < action.scriptsToLoad.length ; scriptIndex++) {
									loadScript("/"+ action.scriptsToLoad[scriptIndex].path);
								}
							}
						} catch(e) {
							Log4r.error("Error in loding scripts in restoring names",e);
						}
						next({
									type: 'LAYOUTRIGHTICON_OK',
									names,
							});
            break;
			case 'USERLIST':

			url = "/"+GlobalHelper.menuContext+"/secure/listAction.do?";
			   request
			   .get(url)
			   .query({
				   _rt: 'fetchUserList'
			   })
			   .end((err, res) => {
				   if (err) {
					   Log4r.log("Error from ajax call-- ", err);
					   return next({
						   type: 'GET_NAMES_FAIL',
						   names
					   });
				   } else {
					   	Log4r.log("Alok RnD Result from ajax call-- ", res);
						let xmlDoc = $.parseXML(res.text);
						let $xml = $(xmlDoc);
						Log4r.log("Alok RnD $xml: ", $xml);
						let jsonText = $xml.find("root\n").text();
						Log4r.log("Alok RnD jsonText: ", jsonText == "");
						if ( jsonText != "" ) {
							let jsonObj = JSON.parse(jsonText);
							Log4r.log("Alok RnD jsonObj: ", jsonObj);
							let userList = jsonObj.UserList;
							if(jsonObj.UserList && jsonObj.UserList !== null && jsonObj.UserList != undefined){
								var UserList = "";
								UserList = jsonObj.UserList;
								GlobalHelper.globlevar.UserList  = Object.entries(UserList);  
								}		 				   
							}	
						}
					})
					break;

		default:
			break;
	}
};


export default dataService;
