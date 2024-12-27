/* Copyright (C) Indus Software Technologies Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import { Layout, Menu, Icon,Modal, Avatar, Tooltip, LocaleProvider, Select, Popover } from "antd";
import {FormattedMessage} from 'react-intl';
import {redirectToList} from '../form/xPathDataStore';
import "antd/dist/antd.css";
import React, { Suspense, lazy } from "react";
import ReactDOM from 'react-dom';
import "../index.css";
import { List , Spin } from "antd";
import { Input } from "antd";
import { Switch, BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import HotKeyComponent from '../HotKeyComponent/HotKeyComponent';
import ErrorBoundary from "../exception/ErrorBoundary";
import { Provider } from "react-redux";
import enUS from "antd/lib/locale-provider/en_US";
import store from "../services/Store";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as action from "../actions/actionTypes";
import PropTypes from "prop-types";
import sourceFile from "./individualFormTemplate/IndividualFormTemplateData.json";
import ClipSearchComponent from "../form/components/widgets/clipsearch/ClipSearchComponent";
import ErrorHandler from "../form/ErrorHandler";
import GlobalHelper from "./GlobalHelper";
import { callLogOff, redirectToAceMenus } from "../form/logoff";
import $ from "jquery";
import ReactDrawer from "react-drawer";
import request from "superagent";
import {setMainLayoutObjToUtil,checkBrowserType}  from '../form/utils';
import {addLocaleData , IntlProvider }from 'react-intl';
import locale_en from 'react-intl/locale-data/en';
import locale_de from 'react-intl/locale-data/de';
import messages_de from "../i18n/locales/zh.json";
import messages_en from "../i18n/locales/en.json";
import fromJson from './DialerLoginJson.json';
import {AutoDialerAPIs} from '../AutoDialer/autodialer'
import {loadScript} from '../services/loadJavaScript.js';
import {getSTData} from '../services/CommonSecurity.js';
import Log4r from "../util/Log4r";

const App = lazy(() => import('../App'));
const LoginForm = lazy(() => import('./LoginForm'));
const UserSelector = lazy(() => import('./UserSelector'));
const UIScreen = lazy(() => import('./UIScreen'));
const UIScreen_screen = lazy(() => import('./UIScreen_screen'));
const UIScreen_dashboard = lazy(() => import('./dashboard/UIScreen_dashboard1'));
const IndividualFormTemplate = lazy(() => import('./individualFormTemplate/IndividualFormTemplate'));
const GridWorkList = lazy(() => import('./table/GridWorkList'));
const DashboardContainer = lazy(() => import('./dashboard/DashboardContainer'));
const ScreenMeta = lazy(() => import('./screen/ScreenMeta'));
const DraggableBarComonent = lazy(() => import('./DraggableComonent/DraggableBarComonent'));

var activenessflag = "yes";
var transactionMenu = "no";
//var transactionMenuIndex = "1";
const File1 = require("./demojson.json");
//const File2 = require("./userConfigSelector.json");
const File3 = require("./userMenuSelector.json");
//const File4 = require("./Worklist_functiongroup_data.json");
//const Search = Input.Search;
const FA = require("react-fontawesome");
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Sider, Content } = Layout;
const Search = Input.Search;
const Option = Select.Option;

var right = 0;
var left = 0;
var countLeft = 0;
var countLeftIcon = 0;
var countRight = 0;
//var countSystemMenu=0;
//var countSystemMenuIcon=0;
var styles = require("./css/MainLayout/MainLayoutDefault.css");
var systemMenuIndex = 0;
var strIds = {
	functions: [
		{
			funcid: "6d67fc030d194fd1a3262ff0d8aeef61",
			access: "N"
		},
		{
			funcid: "af1691b37d154a10a1440f199557c5de",
			access: "N"
		},
		{
			funcid: "821db7e4ffba4306acd62cc28a747c32W",
			access: "N"
		}
	]
};

var isdefaultactive1 = "yes";
var widths = window.innerWidth - 142;
var pathname;
var info2 = File3.userMenuSelector;
var userScreenFlag = false;

var layoutHeight = "";
var widths = "";
var sidermenu = "";
var sessionvariable = "";
var worklistfunctiongroupdata = "";
let menuFoldUnfold = "outdent";
var redirection = ""; //Sprint 12 : for redirection on left menu click at clipsearch
var indexmap = new Map();
var itemMap = new Map();
var listEntityMap = new Map();
var workListOnOff = new Map();
var isMultipleWorkList = false;
let rowsCount=0;
var profilePictureFlag = true;
var worklistRefresh = undefined;
var doubleDialerFlag = false;
//let dialerLoginObject = {};
let optionsArrayOfDialer = [];
let actionOptionArray = [];
var checkOverviewDialerFlag = false;
class MainLayout extends React.Component {
	constructor() {
		super();
		this.state = {
			activeRight: "no",
			activeLeft: "no",
			showComponent: false,
			show: false ,
			autoDialerBar : false,
			activeSystemMenu: "no",
			searchedValue:'',
			count: "0",
			clipSearchValue : "",
			themeName: GlobalHelper.globlevar.UserSelectorTheme.length === 0 ? "myCompact" : GlobalHelper.globlevar.UserSelectorTheme,
			userselectorindex: "",
			dropdownicon: true /*Sprint 10 Task 58 - for clipsearch */,
			widths:
				window.innerWidth > 760
					? GlobalHelper.globlevar.UserSelectorTheme === "myCompact"
						? window.innerWidth - 132
						: window.innerWidth - 138
					: GlobalHelper.globlevar.UserSelectorTheme === "myCompact"
					? window.innerWidth - 72
					: window.innerWidth - 82,
			open: false,
			defaultWorkList: GlobalHelper.listEntityId,
			selectedWorkList: GlobalHelper.listEntityId
		};
		this.multipleListClicked = false;
		//this.RenderDraggableBar = this.RenderDraggableBar.bind(this);
		//this.RenderLoginForm = this.RenderLoginForm.bind(this);
		//this.destroy= this.destroy.bind(this);
		this.custOpenMenu = this.custOpenMenu.bind(this);
		this.setClassRight = this.setClassRight.bind(this);
		this.MyFuncRight = this.MyFuncRight.bind(this);
		this.setClassLeft = this.setClassLeft.bind(this);
		this.setClassLeftIcon = this.setClassLeftIcon.bind(this);
		this.setSystemMenuClass = this.setSystemMenuClass.bind(this);
		this.setSystemMenuClassIcon = this.setSystemMenuClassIcon.bind(this);
		this.setSystemMenuClassTitle = this.setSystemMenuClassTitle.bind(this);
		this.setSystemMenuClassPinIcon = this.setSystemMenuClassPinIcon.bind(this);
		this.MyFuncSystemMenu = this.MyFuncSystemMenu.bind(this);
		this.MyFuncLeft = this.MyFuncLeft.bind(this);
		this.OpFunction = this.OpFunction.bind(this);
		this.onKeyPressClipSearch=this.onKeyPressClipSearch.bind(this);
		this.expand = this.expand.bind(this);
		this.compress = this.compress.bind(this);
		this.changeWindowView = this.changeWindowView.bind(this);
		//this.rounterClickHandler = this.rounterClickHandler.bind(this);
		this.getThemeName = this.getThemeName.bind(this);
		this.otherFunction1 = this.otherFunction1.bind(this);
		this.getByFuncIds = this.getByFuncIds.bind(this);
		this.toggleDrawer = this.toggleDrawer.bind(this);
		this.closeDrawer = this.closeDrawer.bind(this);
		this.onDrawerClose = this.onDrawerClose.bind(this);
		//this.handleCancel = this.handleCancel.bind(this);
		this.refreshQB = this.refreshQB.bind(this);
		Log4r.log("COUNT C", this.state.count);
		GlobalHelper.globlevar["responsestatus"] = undefined;
		this.changeMultipleWorklist = this.changeMultipleWorklist.bind(this);
		this.setWorklistCardClass = this.setWorklistCardClass.bind(this);
		this.browserMap = checkBrowserType();
		//this.dialerClick = this.dialerClick.bind(this);
		this.checkFalg = false;
		this.dialerLoginObject = {};
		this.dialInfo = undefined;

		try {
			const onLoadDialer =  new Promise((resolve,reject) =>{
			let	jsScripts = window.loadAutoDialerJSFile();
	 		if(jsScripts != null)
	 		for (let jsscriptIndex = 0 ;  jsscriptIndex < jsScripts.length ; jsscriptIndex++) {
				try {
						loadScript("/"+ jsScripts[jsscriptIndex].path);
				} catch (e) {
					Log4r.warn(e);
				}
	 		}
	 		resolve("resolved");
			});
		 onLoadDialer.then((obj)=>window.onLoadDialerLogin(GlobalHelper.contextSetting.USERCODE));
		} catch (e){Log4r.error(e);}

		//GlobalHelper.functionGroupData= GlobalHelper.functionGroupData;

		//Log4r.log("after calling...func getByFuncIds==>",JSON.stringify(dlf));
		// Log4r.log(dlf);
		//Log4r.log("after calling...func getQuickFunc()==>",JSON.stringify(GlobalHelper.quickFunMap));
		//Log4r.log("after calling...func getBulkFunc()==>",JSON.stringify(GlobalHelper.bulkFunMap));
		//}
		this.buttonDisable = false;
		setMainLayoutObjToUtil(this);  /* This method is used in utils.js to store the mainLayout.js object along with method. */
	}

// 	handleOk = async (e) => {
// 	 let inputParamObj = {};
// 	 //GlobalHelper.contextSetting.DIALERAGENTID = fromJson.name.screendata[0].formData[0]['6ee6ca183d9646f89e5f4587f72194ad'].data;
// 	 //GlobalHelper.contextSetting.DIALERSTATIONID = fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de630'].data;
// 	 //inputParamObj['agentID'] = fromJson.name.screendata[0].formData[0]['6ee6ca183d9646f89e5f4587f72194ad'].data;
// 	 //inputParamObj['stationId'] = fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de630'].data;
// 	 //inputParamObj['serverName'] = fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de670'].data;
// 	 //inputParamObj['zoneName'] = fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de67a'].data;
// 	 //inputParamObj['timeZone'] = /\((.*)\)/.exec(new Date().toString())[1];
// 	 //inputParamObj['password'] = fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de619'].data;
// 	 inputParamObj['isForce'] = "Y";
// 	 inputParamObj['locale'] = "English";
// 	 //inputParamObj['zoneName'] = "India";
// 	 inputParamObj['orgName'] = "Ebix";
// 	 if(inputParamObj['agentID'] != "" && inputParamObj['password'] != "" && inputParamObj['stationId'] != "" && inputParamObj['serverName'] != "")
// 	 {
// 		 //document.getElementById("validationMess").innerHTML = "Dialer login...";
// 		 window.setAutoDialerMessage("Please wait dialer is login...");
// 		 //document.getElementById("myBtn").disabled = true;
// 		 document.getElementById("6ee6ca183d9646f89e5f4587f72194ad").disabled = true;
// 		 document.getElementById("e2adffe58643467c9f919af6225de619").disabled = true;
// 		 document.getElementById("e2adffe58643467c9f919af6225de630").disabled = true;
// 		 document.getElementById("e2adffe58643467c9f919af6225de670").disabled = true;
// 		 document.getElementById("e2adffe58643467c9f919af6225de67a").disabled = true;
// 		 this.buttonDisable = true;
// 		 this.forceUpdate();
// 		 try{
// 		 Log4r.log("Returned Value before mainLayout");
// 		 // auto unable Login and cancel button.
// 		 setTimeout(() => {
// 						 if(this.buttonDisable !== false){
// 				 this.buttonDisable = false;
// 				 this.forceUpdate();
// 			 }
// 					 }, 30000);

// 		 this.dialerLoginObject = await new Promise((resolve,reject) => window.dialerLogin(inputParamObj, resolve,reject));
// 		 //this.dialerLoginObject = window.jtapi_Login(inputParamObj);
// 		 this.buttonDisable = false;
// 		 this.setState({
// 			 show: false,
// 			 autoDialerBar : true
// 			});
// 		 Log4r.log("Returned Value after mainLayout");
// 		 optionsArrayOfDialer =  window.populateStatusDropDown();
// 		 actionOptionArray = window.setAction();
// 		 }catch(e){Log4r.error(e)}
// 	 }else
// 	 {
// 		 //document.getElementById("validationMess").innerHTML = "Please enter required field";
// 		 //document.getElementById("validationMess").innerHTML = "You must fill in all of the fields";
// 		 window.setAutoDialerMessage("You must fill in all of the fields");
// 		 if(inputParamObj['agentID'] == "" || inputParamObj['agentID'] == [""]){
// 				document.getElementById("6ee6ca183d9646f89e5f4587f72194ad").style.borderBottom = "1px solid red";
// 		 }
// 		 else{
// 			 document.getElementById("6ee6ca183d9646f89e5f4587f72194ad").style.border = null;
// 		 }

// 		 if(inputParamObj['password'] == "" || inputParamObj['password'] == [""]){
// 			 document.getElementById("e2adffe58643467c9f919af6225de619").style.borderBottom = "1px solid red";
// 		 }else{
// 			 document.getElementById("e2adffe58643467c9f919af6225de619").style.border = null;
// 		 }

// 		 if(inputParamObj['stationId'] == "" || inputParamObj['stationId'] == [""]){
// 			 document.getElementById("e2adffe58643467c9f919af6225de630").style.borderBottom = "1px solid red";
// 		 }else{
// 			 document.getElementById("e2adffe58643467c9f919af6225de630").style.border = null;
// 		 }
// 	 }
//  };

	// destroy(modalInstance) {
	// 	modalInstance.destroy();
	// 	window.setAutoDialerMessage("");
	// }

	// handleCancel(e) {
	// 	window.setAutoDialerMessage("");
	// 	fromJson.name.screendata[0].formData[0]['6ee6ca183d9646f89e5f4587f72194ad'].data="";
	// 	//fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de608'].data="";
	// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de619'].data="";
	// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de630'].data="";
	// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de670'].data="";
	// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de67a'].data="";
	// 	document.getElementById("6ee6ca183d9646f89e5f4587f72194ad").style.border = null;
	// 	document.getElementById("e2adffe58643467c9f919af6225de619").style.border = null;
	// 	document.getElementById("e2adffe58643467c9f919af6225de630").style.border = null;
	// 	document.getElementById("e2adffe58643467c9f919af6225de670").style.border = null;
	// 	document.getElementById("e2adffe58643467c9f919af6225de67a").style.border = null;
	// 	this.setState({
	// 		show: false,
	// 	});
	// };

	// RenderDraggableBar(e,show,flag){
	// 	new AutoDialerAPIs().custApi();
	// 	if(show !== true ){
	// 		this.setState({
	// 		showComponent: true,
	// 		show: true,
	// 		});
	// 	}
	// }

// CloseDialer = (fromModal) => {
// 	if(fromModal === true){
// 		this.closeModal();
// 	}
// 	fromJson.name.screendata[0].formData[0]['6ee6ca183d9646f89e5f4587f72194ad'].data="";
// 	//fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de608'].data="";
// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de619'].data="";
// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de630'].data="";
// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de670'].data="";
// 	fromJson.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de67a'].data="";
// 	if(this.dialerLoginObject !== undefined || this.dialerLoginObject !== "" || this.dialerLoginObject !==null) {
// 		this.dialerLoginObject = {};
// 	}
// 	this.setState({
// 		autoDialerBar : false,
// 		show : false
// 	 });
// 	 doubleDialerFlag = false;
// 	 checkOverviewDialerFlag = false;
// 	}

	// handleDialerChange(e){
	// 	Log4r.log("handleDialerChange",e);
	// 	try{
	// 	document.getElementById("e2adffe58643467c9f919af6225de619").attributes["type"] = "password";
	// 	}catch(e){Log4r.error(e)}
	// }
	
	// RenderLoginForm(formJsonInput , info){
	// 	try{
	// 		if (GlobalHelper.contextSetting.Zone == undefined && GlobalHelper.contextSetting.Zone == null) {
	// 			GlobalHelper.contextSetting.Zone = window.populateZoneDropDown();
				
	// 		}
	// 	}catch(error){

	// 	}
	// 	this.dialInfo = info;
	// 	if (GlobalHelper.contextSetting.DIALERAGENTID !== undefined && GlobalHelper.contextSetting.DIALERAGENTID !== "") {
	// 		formJsonInput.name.screendata[0].formData[0]['6ee6ca183d9646f89e5f4587f72194ad'].data = GlobalHelper.contextSetting.DIALERAGENTID;
	// 	}
	// 	if (GlobalHelper.contextSetting.DIALERSTATIONID !== undefined && GlobalHelper.contextSetting.DIALERSTATIONID !== "") {
	// 		formJsonInput.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de630'].data = GlobalHelper.contextSetting.DIALERSTATIONID;
	// 	}
	// 	if (GlobalHelper.contextSetting.Zone !== undefined && GlobalHelper.contextSetting.Zone !== "") {
	// 		//formJsonInput.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de67a'].data = GlobalHelper.contextSetting.Zone;
	// 	}
	// 	if(GlobalHelper.contextSetting.Zone !== undefined && GlobalHelper.contextSetting.Zone !== null){
	// 		//formJsonInput.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de67a'].data = GlobalHelper.contextSetting.Zone;
	// 		let newData = formJsonInput.name.screendata;
	// 		for (var i = 0; i < newData.length; i++) {
	// 			if (newData[i].uiSchema[0] != undefined) {
	// 				for (let index = 0; index < newData[i].uiSchema[0].children.length; index++) {
	// 					if (newData[i].uiSchema[0].children[index].children.fieldPath == "e2adffe58643467c9f919af6225de67a") {
	// 						if (newData[i].uiSchema[0].children[index].children.widget == "select") {
	// 							newData[i].uiSchema[0].children[index].children.options =  GlobalHelper.contextSetting.Zone;
	// 						}
	// 					}
	// 				}// uiSchema iteration
	// 			}
	// 		}//section iteration
	// 		newData = null;
	// 	}
		
	// 	let password = formJsonInput.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de619'].data;
	// 	let serverName = formJsonInput.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de670'].data;
	// 	let zoneName = formJsonInput.name.screendata[0].formData[0]['e2adffe58643467c9f919af6225de67a'].data;
	// 	if(this.state.autoDialerBar === true || (info !== undefined && info['calling'] === true))
	// 	{
	// 		let defaultMakeCall = false;
	// 		if( info !== undefined && info['calling'] === true){
	// 			defaultMakeCall = true;
	// 		}
	// 		if( info !== undefined && info['calling'] === true)
	// 		{
	// 			if (this.dialerLoginObject.status === "Success" && checkOverviewDialerFlag !== true) {
	// 				checkOverviewDialerFlag = true;
	// 				this.dialerClick(true,serverName, zoneName);
	// 			}else{
	// 				doubleDialerFlag = true;
	// 				if (checkOverviewDialerFlag === true) {
	// 					if (GlobalHelper.globlevar.callDisconnected === true) {
	// 						if (window.DraggableBarComonentObj) {
	// 							window.DraggableBarComonentObj.makeCall(info['dialNumber']);
	// 						}
	// 					}
	// 					else{
	// 						alert('On going Call...');
	// 					}
	// 				}else{
	// 					alert('Please Login to the Dialer First.');
	// 				}
	// 				//checkOverviewDialerFlag = false;
	// 			}
	// 		}
	// 		else {
	// 			if (this.dialerLoginObject !== undefined && this.dialerLoginObject.status === "Success" || doubleDialerFlag !==true) {
	// 				return(
	// 					<Suspense fallback={null}>{
	// 						<DraggableBarComonent serverName={serverName} dialInfo = {this.dialInfo} actionOptionArray={actionOptionArray} options={optionsArrayOfDialer} defaultMakeCall={defaultMakeCall} CloseDialer={this.CloseDialer}/>
	// 					}</Suspense>
	// 				);
	// 			}
	// 		}
	// 	}
	// 	setTimeout(()=>{
	// 		const inputs = document.getElementsByClassName("ant-input");
	// 		if (inputs.length > 2) {
	// 			inputs['e2adffe58643467c9f919af6225de619'].type = "password";
	// 		}// this set for dialer password field.
	// 	},500);
	// 	if (this.dialerLoginObject !== undefined && this.dialerLoginObject.status === "Success")
    //         return (null);
		
    //     else
	// 		return(

	// 			<Modal wrapClassName={styles.F2ModalWrapper} title="Dialer Login" visible={this.state.show} okText="Login" cancelButtonProps={{disabled: ((this.buttonDisable == true )? true : false )}} okButtonProps={{ disabled: ((this.buttonDisable == true )? true : false ) }} onOk={this.handleOk} onCancel={this.handleCancel}>
	// 				<Spin spinning={this.buttonDisable}>
	// 				<div className={styles.drawContent}>
	// 					<Suspense fallback={null}>
	// 						<ScreenMeta themeCode="myCompact"  onChange={this.handleDialerChange} reRender={this.reRender} sectionButton={formJsonInput.name.screendata[0].sectionButton} sessionID={formJsonInput.name.screendata[0].sessionID} sectionId={formJsonInput.name.screendata[0].sessionID} sectionhead="" schema = {formJsonInput.name.screendata[0].schema[0]} uiSchema = {formJsonInput.name.screendata[0].uiSchema[0]} formData={formJsonInput.name.screendata[0].formData[0]} editable={formJsonInput.name.screendata[0].editable}  namess = {this.props.namess}/>
	// 					</Suspense>
	// 				</div>
	// 				<div id="validationMess" style={{position:'fixed', marginTop: (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "rtl" ? "256px" : "40px"), color:'red',width: '23%',textOverflow: 'ellipsis',whiteSpace: 'nowrap',overflow: 'hidden'}}></div>
	// 				</Spin>
	// 			</Modal>


	// 			)
	// 	}


	// 	dialerClick(value,serverName, zoneName){
	// 	this.setState({
	// 		autoDialerBar : false,
	// 		show : false
	// 	 });
	// 	if(value === true){
	// 		const modal = Modal.info();
	// 		modal.update({
	// 				centered:true,
	// 				autoFocusButton:null,
	// 				className:'myCustomModalInfo',
	// 				mask:false,
	// 				footer:null,
	// 				content:( <Suspense fallback={null}><DraggableBarComonent serverName={serverName} zoneName= {zoneName} dialInfo = {this.dialInfo} actionOptionArray={actionOptionArray} options={optionsArrayOfDialer} destroyModal={this.destroy} modalInstance={modal} defaultMakeCall={true} CloseDialer={this.CloseDialer}/></Suspense> ),
	// 				});
	// 		return(
	// 						<div>{modal}</div>
	// 					);
	// 	}
	// }

	custOpenMenu(obj, returnToMenuId) /* This method is used in utils.js file in openMenu method*/
	{
		this.custOpenMenupath = obj.layouttype;
		obj.returnToMenuId = returnToMenuId;
		this.MyFuncLeft(obj, returnToMenuId);
	}
	checkUserProfilePicture(profileImgUrl){
		if(profileImgUrl != null){
			Log4r.log("picture............",profileImgUrl);
			return	profilePictureFlag = false;
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

	toggleDrawer() {
		this.setState({ open: !this.state.open });
	}

	closeDrawer() {
		this.setState({ open: false });
	}

	onDrawerClose() {
		this.setState({ open: false });
	}

	getByFuncIds(strIds123) {
		Log4r.log("strIds123==>", strIds123);
		var count23 = 0;
		if (typeof GlobalHelper.functionGroupData.formHeaderBookmarks === typeof []) {
			var x = new Map();
			for (var i = 0, l = 0; i < GlobalHelper.functionGroupData.formHeaderBookmarks.length; i++) {
				if (typeof GlobalHelper.functionGroupData.formHeaderBookmarks[i].content === typeof []) {
					var grpObj = {}; //-----------------------
					var content = [];
					for (var j = 0, k = 0; j < GlobalHelper.functionGroupData.formHeaderBookmarks[i].content.length; j++) {
						if (strIds123.functions.filter(item => GlobalHelper.functionGroupData.formHeaderBookmarks[i].content[j].id === item.funcid)[0]) {
							count23++;
							content[k] = GlobalHelper.functionGroupData.formHeaderBookmarks[i].content[j];
							k++;
						}
						if (count23 == strIds123.functions.length) {
							Log4r.log("aLL DATA GOT BREAKING INNER LOOP..");
							break;
						}
					}
					if (content.length > 0) {
						grpObj["content"] = content;
						x.set(GlobalHelper.functionGroupData.formHeaderBookmarks[i].groupid, grpObj);
					}
				}
				if (count23 == strIds123.functions.length) {
					count23 = 0;
					Log4r.log("aLL DATA GOT BREAKING OUTER LOOP..");
					break;
				}
			}
		}
		return x;
	}

	componentDidMount() {
		$($($($("[class~=myCustomModalInfo]").parent()).parent()).parent()).css('cssText','display: inline-block; position:relative; right:-525px');
	}

	componentWillUnmount() {
		window.removeEventListener('paste', function (event){});
		optionsArrayOfDialer = [];
		actionOptionArray = [];
		let MainLayoutObject = [];
		//this.setState({});
		console.log("componentWillUnmount call...........");
		
		activenessflag = null;
		transactionMenu = null;
		right = null;
		left = null;
		countLeft = null;
		countLeftIcon = null;
		countRight= null;
		systemMenuIndex = null;
		strIds = {};
		isdefaultactive1 = null;
		widths = null;
		info2 = null;
		userScreenFlag = null;
		layoutHeight = null;
		sidermenu = null;
		sessionvariable = null;
		worklistfunctiongroupdata = [];
		menuFoldUnfold = null;
		redirection = null;
		indexmap = [];
		itemMap = [];
		itemMap = [];
		listEntityMap = [];
		workListOnOff = null;
		isMultipleWorkList = null;
		rowsCount = null;
		profilePictureFlag = null;
		worklistRefresh = null; 
		doubleDialerFlag = null;
		checkOverviewDialerFlag = null;
	}

	componentDidUpdate(prevProps, prevState)
	{
		$($($($("[class~=myCustomModalInfo]").parent()).parent()).parent()).css('cssText','display: inline-block; position:relative; right:-525px');
		Log4r.log("cdcscdc",$($($($("[class~=myCustomModalInfo]").parent()).parent()).parent()));
		Log4r.log("didupdate " , prevProps , prevState);
		Log4r.log("MainLayout componentDidUpdate.... update",this.props)
		if(this.props.outnames !== undefined  && this.props.outnames.ScreenLayoutName === "GridWorkList"){
			Log4r.log("MainLayout componentDidUpdate....if : ",this.props , worklistRefresh  )
			if( worklistRefresh === "fetchWorklistRefreshData" && GlobalHelper.globlevar['worklistRefresh'] == true){
				worklistRefresh = undefined;
				//alert("refreshed Worlist")
				GlobalHelper.globlevar['worklistRefresh']  = false;
			}
		}
	}

	logoff = e => {
		Log4r.log("logoff......", e);

		if (e.key === "Log_off") {
			callLogOff(GlobalHelper.contextSetting.USERID);
			pathname = this.props.outnames.LayoutName;
		}else if (e.key == 'Profiles') {
	      //pathname = "UserSelector";
	     // GlobalHelper.globlevar['profileClickedFromMainlayout'] = e;
	      addLocaleData([...locale_en, ...locale_de]);
          const messages = {
			    'de': messages_de,
			    'en': messages_en
			};
			const language = navigator.language.split(/[-_]/)[0];  // language without region code
			this.props.outnames.LayoutName = undefined;
			//<UserSelector menuJson={GlobalHelper.aceMenuJson}/>
	       	ReactDOM.render(
	       		<IntlProvider locale={language} messages={messages[language]}>
	      		    <Provider store={store}>

			                <Router>
			                  <Route component={()=><Suspense fallback={null}><App profileRender={true} profileObj={e} /></Suspense>} />
			                </Router>

			        </Provider>
			    </IntlProvider>
			, document.getElementById('root'));

	    }

		this.getThemeName(e);
	};

	getThemeName(value) {
		if (value.key === "1") {
			this.setState({ themeName: "myCompact",  widths: window.innerWidth > 760 ? window.innerWidth - 132 : window.innerWidth - 82 }, () => this.otherFunction1());
		} else if (value.key === "2") {
			this.setState({ themeName: "myDark", widths: window.innerWidth > 760 ? window.innerWidth - 138 : window.innerWidth - 82 }, () => this.otherFunction1());
		} else if (value.key === "3") {
			this.setState({ themeName: "myRed", widths: window.innerWidth > 760 ? window.innerWidth - 138 : window.innerWidth - 82 }, () => this.otherFunction1());
		} else if (value.key === "4") {
			this.setState({ themeName: "myDefault", widths: window.innerWidth > 760 ? window.innerWidth - 138 : window.innerWidth - 82 }, () => this.otherFunction1());
		} else {
			return "";
		}
	}

	otherFunction1() {
		Log4r.log("after set state: " + this.state.themeName);
	}

	changeWindowView() {
		if (this.state.count == 0) {
			this.expand();
		} else if (this.state.count == 1) {
			this.compress();
		}
	}

	expand() {
		if(GlobalHelper.globlevar['sectionLinkclicked'] != true){
		if (window.innerWidth > 760) {
			this.setState({ count: "1", widths: this.state.themeName === "myCompact" ? window.innerWidth - 250 : window.innerWidth - 250 }, () =>
				Log4r.log("GTT WIDTH AFTER EXPAND", this.state.widths)
			);
			Log4r.log("Expand width---- ", this.state.widths);
		} else {
			this.setState({ count: "1"});
		}
		}
	}

	compress() {
		if(GlobalHelper.globlevar['sectionLinkclicked'] != true){
		if (window.innerWidth > 760) {
			this.setState({ count: "0", widths: this.state.themeName === "myCompact" ? window.innerWidth - 132 : window.innerWidth - 138 }, () =>
				Log4r.log("GTT WIDTH AFTER COMPRESS", this.state.widths)
			);
			Log4r.log("Compress width---- ", this.state.widths);
		} else {
			this.setState({ count: "0", widths: window.innerWidth - 84 }, () => Log4r.log("GTT WIDTH AFTER COMPRESS", this.state.widths));
			Log4r.log("Compress width---- ", this.state.widths);
		}
		}
		/*
   var c=this.refs.pone;
  c.style.width="30%";

*/
		/*var e=document.getElementById("sider");
 if(e.style != null)
  {

  e.style.width="87.8%";
  }*/
	}

	state = {
		collapsed: true,
		rightcollapsed: true
	};
	toggle = () => {
		GlobalHelper.globlevar["toggleClicked"] = true;
		if (this.state.count == "0") {
			this.expand();
			menuFoldUnfold = "indent";
		} else if (this.state.count == "1") {
			this.compress();
			menuFoldUnfold = "outdent";
		}
		this.setState({
			collapsed: !this.state.collapsed
		});
	};
	righttoggle = () => {
		this.setState({
			rightcollapsed: !this.state.rightcollapsed
		});
	};

	OpFunction() {
		////Log4r.log("Called!!!*************************************");
		if (this.state.collapsed == true) {
			//Log4r.log("Called is!!!##############");
			return styles.custMenu;
		} else {
			//Log4r.log("Called is!!!@@@@@@@@@@@@@");
			return styles.custMenuHide;
		}
	}

	MyFuncRight(index) {
		right = index;
		//Log4r.log("Calledd"+index);
		this.setState({ activeRight: "yes" });
		//Log4r.log(this.state.activeRight);
	}

	MyFuncSystemMenu(index,title) {
		transactionMenu = "yes";
		systemMenuIndex = index;
		isdefaultactive1 = "no";
		this.setState({ activeSystemMenu: "yes" });

		if (index == 4) {
			info2 = File3.userLosSelector;
			this.setState({ userselectorindex: index });
			userScreenFlag = true;
		} else if (index == 1) {
			//pathname="main";

			var imgpath = window.location.origin;
			Log4r.log("default path ", imgpath);
			var pathname1 = imgpath + window.getcontextpath()+ "/secure/main.do";
			Log4r.log("default path ", pathname1);

			// window.location.href=GlobalHelper.globlevar.contextpath+pathname1;
			window.location.href = pathname1;
			//this.props.history.push(pathname1);
		} else {
			info2 = File3.userMenuSelector;
		}

		if (systemMenuIndex !== undefined || systemMenuIndex.length !== 0) {

			let url= window.getcontextpath()+ "/secure/main.do?pinCategory=" + title;

			if(title === "Administrator"){
			          url= window.getcontextpath()+"/secure/main.do?pinCategory=Administrator";
			        }
			else if(title  === "Configurator"){
			          url= window.getcontextpath()+"/secure/main.do?noneedge=true&pinCategory=Configurator";
			        }
			else if(title  === "Designer"){
			          url= window.getcontextpath()+"/secure/main.do?pinCategory=Designer";
			        }
			else if(title  === "Transaction"){
			          url="index.html?noneedge=true&pinCategory=Transaction";
			}

			if(url !== undefined){
			          redirectToAceMenus(url,title);
			  }
		}

		//Log4r.log(this.state.activeRight);
	}

	setSystemMenuClass(index,title) {
		if (isdefaultactive1 == "yes") {
			if(title ==="Transaction" ){
				return styles.layoutcssPSelected;
			}
		}

		if (index == systemMenuIndex) {
			return styles.layoutcssPSelected;
		} else {
			return styles.layoutcssP;
		}
	}

	setSystemMenuClassIcon(index,title) {
		if (isdefaultactive1 == "yes") {
			if(title ==="Transaction" ){
				return styles.icondivSelected;
			}
		}

		if (index == systemMenuIndex) {
			return styles.icondivSelected;
		} else {
			return styles.icondiv;
		}
	}
	setSystemMenuClassTitle(index,title) {
		if (isdefaultactive1 == "yes") {
			if(title ==="Transaction" ){
				return styles.titledivSelected;
			}
		}

		if (index == systemMenuIndex) {
			return styles.titledivSelected;
		} else {
			return styles.titlediv;
		}
	}
	setSystemMenuClassPinIcon(index,title) {
		if (isdefaultactive1 == "yes") {
			if(title ==="Transaction" ){
				return styles.myspanSelected;
			}
		}
		if (index == systemMenuIndex) {
			return styles.myspanSelected;
		} else {
			return styles.myspan;
		}
	}

	onClickWMenu(event, key) {
		event.key = key;
		this.setState({selectedWorkList: key});
		GlobalHelper.globlevar['clipsearchflagforbutton'] = false;
		this.changeMultipleWorklist(event);
	}

	changeFavorite(event, key) {
		let postUrl = "/" + GlobalHelper.menuContext + "/secure/listAction.do?_rt=pinEntity&txtListEntityId=" + key;
		let changeFavoriteurl  = postUrl.split("?")[1];
	    let _stdata_changeFavoriteurl = getSTData("/"+GlobalHelper.menuContext+"/", changeFavoriteurl);

		request
			.post(postUrl)
			.set('Accept', 'application/json')
			.query({_SID_:(_stdata_changeFavoriteurl.SID + _stdata_changeFavoriteurl.SINT)})
			.query({_ADF_:""})
			.end((err, res) => {
				if (err) {
					Log4r.log('ERROR IN GRTTING FUNCTION IDS', err);
				} else {
					this.setState({defaultWorkList: key});
				}
			})
	}

	MyFuncLeft(post, returnToMenuId) {

		if(post != null){
			if (post.layouttype !== "GridWorkList") {
					GlobalHelper.globlevar['customFunctionRoute'] = true;
			}
		}
		GlobalHelper.globlevar['sectionScroll']  = undefined;
		GlobalHelper.globlevar["closeButtonCall"] = false;
		GlobalHelper.globlevar['worklistRowClick'] = undefined;
		GlobalHelper.globlevar['historyTimelineclicked'] = undefined;
		GlobalHelper.globlevar['modalClosedClicked'] = undefined;
		GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = undefined;
		GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] = undefined;
		GlobalHelper.globlevar['buttonSpin'] = undefined;
		GlobalHelper.globlevar['isolatedRefreshOnSave'] = undefined;
		GlobalHelper.globlevar['shouldResettingMapInWrapper'] = true;
		GlobalHelper.globlevar['postSaveScreenLoad'] = {"refreshFrom":"hangingFunction", customPost:post, customReturnToMenuId:returnToMenuId};
		GlobalHelper.globlevar['returnToMenuId'] = returnToMenuId;
		GlobalHelper.completeFilterXML = "";
		GlobalHelper.globlevar['showDefaultFuncOnly'] = undefined;
		//Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
		GlobalHelper.globlevar["LeftMenuClickedData"] = post;
		GlobalHelper.globlevar["removeHeaderFlag"] = false;
		if(post !== undefined && post.caption !== undefined){
			GlobalHelper.globlevar["worklistName"] = post.caption;
		}

		Log4r.log("post............",GlobalHelper.globlevar["LeftMenuClickedData"]);
		if(post.caption==="Prompt Mode" || post.layouttype==="PromptWorkList"){
			GlobalHelper.globlevar['promptmode'] = "prompt";
			GlobalHelper.globlevar['menuFunctionFlag'] = true; //Sprint 23 - To change layout title for menu function screen.
			GlobalHelper.globlevar['PreviousButtonFlag'] = false;
			if(GlobalHelper.globlevar.worklistinfo.DataSource && GlobalHelper.globlevar.worklistinfo.DataSource.rows.length <= 1) {
				GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
			}
		}else{
			GlobalHelper.globlevar['promptmode'] = "NO_prompt";
			GlobalHelper.globlevar['menuFunctionFlag'] = true;//Sprint 23 - To change layout title for menu function screen.
		}//End-Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.

		GlobalHelper.globlevar["flagToControlPopupForEmptyworklist"] = true;
		//Sprint 10 (TASK 69):[START] Added if condition to identify prompt screen button is pressed and to call initial screen.
		GlobalHelper.activeMenuId = post.menuid;
		GlobalHelper.globlevar["expandableRowPopsearch"] = false;
		GlobalHelper.globlevar["myfunleftclicked"] = true;
		GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
		GlobalHelper.defaultfunction = undefined;
		GlobalHelper.globlevar['summaryConfigType'] = undefined;
		GlobalHelper.globlevar['linkedFunctionId'] = undefined;
		GlobalHelper.globlevar.getDataUrls=[];
		GlobalHelper.globlevar.savespin = false;
		GlobalHelper.globlevar.taskHistFunId = undefined;
		GlobalHelper.globlevar.cardCollapseClicked = true;
		GlobalHelper.globlevar.CurrentlyClosedCard = [];
		GlobalHelper.globlevar.selectedCardIndex.clear();
		GlobalHelper.globlevar["advanceSearchFlag"] = "false";//Sprint 23 - Task 63 - Advance search custom filter should manage for client level only / it is replacing serverside fileter only for save session at client machine
		GlobalHelper.globlevar['newFunctionNames'] = undefined;
		GlobalHelper.globlevar['customScreenFlag'] = false;
		GlobalHelper.globlevar['tabScreen'] = new Array();
		GlobalHelper.globlevar['tabKey'] = 1;
		GlobalHelper.globlevar['changeTitle'] = undefined
		GlobalHelper.globlevar['activetabKey'] = 1;
		GlobalHelper.globlevar["ClearTabArray"] = false;
		GlobalHelper.queryBuilderTreeJson = null;
		GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
		GlobalHelper.worklistSortFilterXml = "";
		GlobalHelper.globlevar['historyHidden'] = false;//Sprint 32 - To hide History Timeline Function Layout.
		GlobalHelper.globlevar['multiRecordViaClipsearch'] = false;
		GlobalHelper.globlevar['tableLinkRecord'] = null;
		GlobalHelper.globlevar['linkpress'] = false;
		GlobalHelper.globlevar['linkpressTemp'] = false;
		if (GlobalHelper.globlevar.linkclicked === true) {
			GlobalHelper.globlevar.linkclicked = false;
		}
		if (GlobalHelper.globlevar.toggleClicked === true) {
			GlobalHelper.globlevar.toggleClicked = undefined;
		}
		GlobalHelper.globlevar["subFuncName"] = undefined;
		GlobalHelper.globlevar["uiNextButtonpalette"] = true;
		GlobalHelper.globlevar["isreadysaveclicked"] = true;
		GlobalHelper.globlevar.SecondCardlinkFetch = false;
		GlobalHelper['holdFunGroupData'] = undefined; // every time function group undefined on click on menu
		ErrorHandler.clear();
		ErrorHandler.clearBulkErrJson();
		GlobalHelper.globlevar['clipsearchflagforbutton'] = false;//Sprint 30 - Task - Tp remove NEXT & SAVE&NEXT buttons from screen if record searched via CLIPSEARCH

		GlobalHelper.globlevar["promptClicked"] = false;
		GlobalHelper.globlevar['promptClickedFunctionId'] = undefined;
		GlobalHelper['DefaultFunctionHeadername'] = undefined;
		GlobalHelper['DefaultFunctionformSubTitle'] = undefined;
		//Sprint 11: Task 83 No Hedaer Configuration Handling : isHeaderConfigured to check wether header is configured or not. Other two variables are needed to use in TableContainer.js, UIScreen and promptUiNextHandler.js
		GlobalHelper.globlevar["isHeaderConfigured"] = "";
		GlobalHelper["selectedRowData"] = "";
		GlobalHelper.globlevar.targetCard = "";
		GlobalHelper["preColumnData"] = "";
		if(GlobalHelper.globlevar.cardLayoutInclusion){
      		GlobalHelper.globlevar.cardLayoutInclusion = undefined;
    	}
		GlobalHelper.globlevar["promptworklistinfo"] = false;
		GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;

		left = post.menuid;
		activenessflag = "no";

		this.forceUpdate();

		if (post.caption === "Prompt Screen Duplicate") { // To be checked for validity
			GlobalHelper.globlevar.promptClicked = true;
			GlobalHelper.globlevar.raiseFalg = true;
			GlobalHelper.globlevar.currentPromptRowData = GlobalHelper.globlevar.worklistinfo.DataSource.rows[0];
			let functionId = GlobalHelper.globlevar.firstRowFunctionId;
			GlobalHelper.holdFunGroupData = GlobalHelper.getByFuncIds(functionId);
			let firstRightSelectedIcon = GlobalHelper.holdFunGroupData.values().next().value;
			let values = firstRightSelectedIcon.content[0].id;
			var headerFunctionId = undefined;
			if (functionId.hasOwnProperty("headerFucntion")) {
				headerFunctionId = functionId.headerFucntion.headerFunctionId;
			}
			let pr_mode = "prompt";
			GlobalHelper.globlevar.UIScreen = "UIScreen";

			//Sprint 11: Task 83 No Hedaer Configuration Handling :[START]  Checking wether header function is configured or not ?
			if(headerFunctionId === undefined || headerFunctionId.length === 0) {
				GlobalHelper.globlevar.isHeaderConfigured = false;
				let predata = new Map();
				GlobalHelper.globlevar.worklistinfo.Columns.map((obj, i) => {
					predata.set(obj.dataIndex, obj.title);
				});
				GlobalHelper.preColumnData = predata;
				GlobalHelper.selectedRowData = GlobalHelper.globlevar.worklistinfo.DataSource.rows[0];
				store.dispatch({ type: "INITIALSCREEN", values, pr_mode });
			} else {
				GlobalHelper.globlevar.isHeaderConfigured = true;
				store.dispatch({ type: "INITIALUISCREEN", values, headerFunctionId, pr_mode });
			}
			//Sprint 11: Task 83 No Hedaer Configuration Handling :[END]
		} else if (post.caption === "Dynamic Allocation" || post.caption === "Allocation"|| post.caption === "Recall Cases"||post.layouttype==="CustomScreen2"||post.layouttype==="CustomScreen1"||post.layouttype==="CustomScreen") {
			GlobalHelper.globlevar["removeHeaderFlag"] = true;
			GlobalHelper.globlevar["customScreenClicked"] = true;//Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
			let values = post.caption;
			GlobalHelper.globlevar.functionID  = post.menuid;
		} else {
			GlobalHelper.globlevar.promptClicked = false;
		}
		//Sprint 10 (TASK 69):[END]

		if (post.caption === "Application") {
		}

		/*Below 2 lines added to clear WorklistMap & Worklist Page number*/
		//GlobalHelper.workListDataMap.clear();
		GlobalHelper.advSearchFilterXml = "";
		GlobalHelper.inputSearchFilterXml = "";
		GlobalHelper.quickFilterXml = "";
		GlobalHelper.inputSearchDataIndex = "";
		GlobalHelper.globlevar.StepSelected = "";
		GlobalHelper.queryBuilderFormatData = "";

		/*asset summery screen. Grid link clicked false change to default position  */
		GlobalHelper.globlevar.linkclicked = false;
		GlobalHelper.globlevar["responsestatus"] = "clear";

		this.props.outnames.ScreenLayoutName = post.layouttype;

		/*Sprint 13 - Menu.json integration - store.dispatch call added for right menu call*/

		GlobalHelper["layouttypeGrid"] = post.layouttype;
		GlobalHelper["layoutCaption"] = post.caption;
		let newObjectForWorklist={};
		let contextValue = post.menuurl.split("/");
		GlobalHelper.menuContext = contextValue[3];
		newObjectForWorklist['context'] = contextValue[3];
		newObjectForWorklist['url'] = post.menuurl;
		newObjectForWorklist['layoutType'] = post.layouttype;
		newObjectForWorklist['returnToMenuId1'] = post.returnToMenuId;
		newObjectForWorklist['type'] = "MENUDATAFETCH";
		GlobalHelper.globlevar['worklistDataClicked'] = newObjectForWorklist;
		if(post.layouttype !== "FunctionScreen"){
			GlobalHelper.globlevar['worklistDataClickedFunction'] = newObjectForWorklist;
			GlobalHelper.globlevar["worklistLeftMenuClickedData"] = GlobalHelper.globlevar["LeftMenuClickedData"];

		}

		//redirectToList(GlobalHelper.globlevar.worklistDataClicked);
		store.dispatch(GlobalHelper.globlevar.worklistDataClicked);
	}

	setClassRight(index, activeness) {
		if (activeness == "yes" && countRight == 0) {
			countRight++;
			return styles.siderrightsettingMenuItemSelected;
		} else if (index == right) {
			return styles.siderrightsettingMenuItemSelected;
		} else {
			return styles.siderrightsettingMenuItem;
		}
	}

	setClassLeft(index, activeness) {
		GlobalHelper.globlevar["timelinedisplay"] = undefined;
		//Sprint 35 -Task 21 - Issue fixed-On closing isolated screen, It go back to account list but pointer highlights to isolated screen
		if(GlobalHelper.globlevar['UIScreenComponentRenderFlag'] === false){
			left = 0;
			if(GlobalHelper.worklistData != null && GlobalHelper.worklistData.worklist != null){
				left = GlobalHelper.worklistData.worklist.menuId;
			}
		}//END - Sprint 35 -Task 21 - Issue fixed-On closing isolated screen, It go back to account list but pointer highlights to isolated screen
		if (activeness == "yes" && countLeft <= 2 && activenessflag == "yes") {
			if (countLeft <= 1) {
				countLeft++;
			}
			return styles.siderleftsettingMenuItemSelected;
		} else if (index == left) {
			return styles.siderleftsettingMenuItemSelected;
		} else {
			return styles.siderleftsettingMenuItem;
		}
	}

	setClassLeftIcon(index, activeness) {

		if (activeness == "yes" && countLeftIcon <= 2 && activenessflag == "yes") {
			if (countLeftIcon <= 1) {
				countLeftIcon++;
			}
			return styles.leftsidericonsSelected;
		} else if (index == left) {
			return styles.leftsidericonsSelected;
		} else {
			return styles.leftsidericons;
		}
	}

	refreshQB() {
		this.setState({ f2: true });
		this.forceUpdate();
		if(GlobalHelper.globlevar['worklistRefresh'] === true)
		{
			ErrorHandler.clearBulkErrJson();
			worklistRefresh = "refreshClicked";
			Log4r.log("Worklist call " , GlobalHelper.globlevar['worklistDataClicked'],GlobalHelper.globlevar['worklistDataClicked']['type'] );
			Log4r.log("GlobalHelper.globlevar[LeftMenuClickedData] => ",GlobalHelper.globlevar["LeftMenuClickedData"]);
			if(GlobalHelper.globlevar['worklistDataClicked']['type'] !== "MULTIPLEWORKLIST" && GlobalHelper.globlevar['returnToMenuId'] !== undefined){
				this.MyFuncLeft( GlobalHelper.globlevar["LeftMenuClickedData"]    ,  GlobalHelper.globlevar['returnToMenuId']    );
			}else if(GlobalHelper.globlevar['worklistDataClicked']['type'] !== "MULTIPLEWORKLIST"){
				// this.clearWorklistData();
				store.dispatch(GlobalHelper.globlevar.worklistDataClicked);
    		}else{
				this.changeMultipleWorklist(GlobalHelper.globlevar["LeftMenuClickedData"] );
			}
		}
	}

	onKeyPressClipSearch(event,priority){
		Log4r.log("key press........",event,priority);
		if(priority != null){
			$('#inputClipSearch').focus();
		}
		//window.alert("kye press......"+priority);
	}

	render() {

		if(GlobalHelper.globlevar['newStateMapped'] === true) {
			GlobalHelper.globlevar['newStateMapped'] = undefined;
			this.multipleListClicked = false;
		}

		let siderMenuToRender = GlobalHelper.menuChildMap.get(GlobalHelper.menuId);
		var favGrpObj ={"groupcd": "ELLIP","caption": "Ellipsis",
		"image": "http://localhost/pdgic/$fontimage{fa-ellipsis-v iconCenter {#6d9eeb}}"};
		let ellipObjPresent = siderMenuToRender.filter((itm) => itm.caption === "Ellipsis");
		if (ellipObjPresent.length === 0 && siderMenuToRender.length >7) {
			siderMenuToRender.splice(7,0,favGrpObj);
		}
		let newArr = siderMenuToRender.slice(8,siderMenuToRender.length);
		Log4r.log("cdfddcdcdc",siderMenuToRender,newArr);
		var imgpath = GlobalHelper.globlevar.contextpath;
		Log4r.log("GlobalHelper.globlevar['contextpath']", GlobalHelper.globlevar.contextpath);
		const info = File1.dataprofile;
		const info1 = GlobalHelper.globlevar['systemMenuJson'].systemMenu; //File2.systemMenu;
		const info3 = File1.Layoutdata;
		Log4r.log("path...", pathname, this.props.outnames);
		Log4r.log("props from app.........", this.props);
		Log4r.log("redirection.........", redirection);

		if(this.custOpenMenupath !== undefined)
		{
			this.custOpenMenupath = undefined;
			return (
				<Provider store={store}>
					<Switch>
						<Route path="/*" render={() => <Redirect to={GlobalHelper.globlevar.contextpath +this.custOpenMenupath} />} />
					</Switch>
				</Provider>
			);

		}
		/*Sprint 12 - redirection code added for clipsearch at left menu click [dashboard,prompt-screen]*/
		if (redirection === "true" && pathname !== undefined) {
			Log4r.log("this.props.ScreenLayoutName.........if ", this.props.outnames.ScreenLayoutName);
			redirection = "false";
			return (
				<Provider store={store}>
					<Switch>
						<Route
							path={GlobalHelper.globlevar.contextpath + "GridWorkList"}
							component={state => (
								<GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" mainpathname="GridWorkList" returnToMenuId={this.props.outnames.returnToMenuId}/>
							)}
						/>
						<Route path="/*" render={() => <Redirect to={GlobalHelper.globlevar.contextpath + "MainLayout"} />} />
					</Switch>
				</Provider>
			);
		} //end Sprint 12 - redirection code
		else if (GlobalHelper["layouttypeGrid"] == "GridWorkList") {
			GlobalHelper["layouttypeGrid"] = undefined;
			Log4r.log("this.props.ScreenLayoutName.........else ", this.props.outnames.ScreenLayoutName);
		}

		if (this.state.themeName == "myDefault") {
			Log4r.log("inside default render of MainLayout.js");
			styles = require("./css/MainLayout/MainLayoutDefault.css");
		} else if (this.state.themeName == "myDark") {
			Log4r.log("inside dark render of MainLayout.js");
			styles = require("./css/MainLayout/MainLayoutDark.css");
		} else if (this.state.themeName == "myRed") {
			Log4r.log("inside dark render of MainLayout.js");
			styles = require("./css/MainLayout/MainLayoutRedThm.css");
		} else if (this.state.themeName == "myCompact") {
			styles = require("./css/MainLayout/MainLayoutCompact.css");
		} else {
			Log4r.log("Something went wrong!!");
		}

		Log4r.log("session variable.....", GlobalHelper.contextSetting); /*Sprint 13 - Task 63 Redirection to UserSelector on click Transaction menu */
		 if (
			userScreenFlag
		) {
			userScreenFlag = false;
			GlobalHelper.globlevar["UserSelector"] = true;
			let path = "App";
			return (
				<Provider store={store}>
					<Route component={state => <Suspense fallback={null}><App layoutname="UserSelector" /></Suspense>} />
				</Provider>
			);
		} //end
		else {
			if (window.innerWidth <= 600) {
				return (
					<Router>
						<Layout className={styles.customMainLayout}>
						<HotKeyComponent  MainLayoutFlag={true} Component={this} ComponentProps={this.props} worklistData={this.worklistData} siderMenuToRender={siderMenuToRender}/>
							<div onClick={this.toggleDrawer} disabled={this.state.open && !this.state.noOverlay} className={styles.drawerButton}>
								{!this.state.open ? (
									<span>
										<FA name={menuFoldUnfold} className={styles.drawerIcons} />
									</span>
								) : (
									<span>
										<FA name={"far fa-times-circle"} className={styles.drawerIcons} />
									</span>
								)}
							</div>

							<Layout style={{ width: "99%", overflow: "hidden" }}>
								<Content className={styles.contents}>
									<Header className={styles.customHeader}>
										{/*<div className={styles.logoindus} style={{marginLeft:'14px',  height:'100%',  display: 'inline-block' ,width:'7%' }}  >
                                      <img src='react/images/IDFC_LOGO_SCALABLE.svg'  style={{marginTop:'-38px',width:'70px', height:"40px"}} />
                                    </div>*/}
										<div className={styles.logoindus}>
											<img src={"images/client_logo.png"} />
										</div>

										<div className={styles.rightUpperMenus}>
											<Menu
												theme="dark"
												mode="horizontal"
												defaultSelectedKeys={["1"]}
												style={{ marginRight: "0px", minHeight: "5px", display: "inline-block", backgroundColor: "transparent", border: "0px solid transparent" }}
												onClick={this.searchHandle}
											>
												<SubMenu
													key="LCMS"
													title={
														<ClipSearchComponent refreshQB={this.refreshQB} names={this.props}/>
													}
												/>
											</Menu>

											{/*<Menu


                                     theme="dark"
                                     mode="horizontal"
                                     defaultSelectedKeys={['1']}
                                     style={{ minHeight:'5px', aline:'right',display: 'inline-block' , textAlign:'left' , backgroundColor:'transparent', border:'0px solid transparent'}}
                                     onClick={this.searchHandle}
                                      >
                                       <SubMenu key="LCMS" title={<span><Icon style={{ color: '#FFFF' }}>  <FA name='th' /> </Icon></span>}>
                                       <Menu.Item style={{backgroundColor:'#364558' , height:'90%', padding:0, margin:0}} key="1">
                                       <List
                                         grid={{ gutter: 0, xs: 1, sm: 4, md: 4, lg: 4, xl: 4 }}
                                         dataSource={info1}
                                         renderItem={item => (
                                           <List.Item style={{margin:'0px'}} className={styles.listitemclass}>
                                               <Layout className={styles.layoutcssP}>
                                                 <div className={styles.icondiv}><FA name={item.icontype} className={styles.iconclass}/></div>
                                                 <div style={{fontSize:'11px'}} className={styles.titlediv}>{item.title}</div>
                                               </Layout>
                                           </List.Item>
                                         )}
                                       className={styles.listclass}/>
                                      </Menu.Item>
                                      </SubMenu>
                         </Menu> */}

											<Menu style={{ marginRight: "0px", minHeight: "5px", display: "inline-block", backgroundColor: "transparent", border: "0px solid transparent" }} theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} onClick={this.searchHandle}>
												<SubMenu
													key="LCMS"
													title={
														<span>

																<FA name="th" className={styles.search}/>

														</span>
													}
													style={{ backgroundColor: "transparent",top:-10 }}
													
												>
													<Menu.Item
														className={styles.searchIconBox}
														style={{ backgroundColor: "transparent", margin: "-20px 0px -6px", borderRadius: "5px", opacity: "1.2", height: "90%", padding: 0 }}
														key="1"
													>
														<div className={styles.above}>
															<div className={styles.mid} />

															<List
																id={styles.customListUserSelector}
																grid={{ gutter: 0, xs: 1, sm: 2, md: 1, lg: 2, xl: 2 }}
																dataSource={info1}
																renderItem={item => (
																	<List.Item style={{ margin: "0px" }} aria-label = {item.title}>
																		<Layout
																			className={this.setSystemMenuClass(item.id,item.title)}
																			style={{ paddingTop: "10px" }}
																			onClick={() => this.MyFuncSystemMenu(item.id , item.title)}
																		>
																			<div className={this.setSystemMenuClassIcon(item.id,item.title)}>
																				<FA name={item.icontype} />
																			</div>
																			{/*<div><Icon type="pushpin" className={styles.myspan} /></div>*/}
																			<div>
																				<Icon type="pushpin" className={this.setSystemMenuClassPinIcon(item.id,item.title)} />
																			</div>
																			<div className={this.setSystemMenuClassTitle(item.id,item.title)}>{item.title}</div>
																		</Layout>
																	</List.Item>
																)}
																className={styles.listclass}
															/>
														</div>
													</Menu.Item>
												</SubMenu>
											</Menu>
											<Layout className={styles.customLayout}>
												{/*<Avatar className={styles.avatar_profile} size="medium" src="react/images/profile-pic.jpg" title=" Welcome Kiran Dhakate (EMP : Indus Pune)" ></Avatar>*/}
												<Popover
													id="avatarpopover"
													content={
														<span className={styles.upperRightIconPopover}>
															<FormattedMessage id="app.welcome" values={{name: GlobalHelper.contextSetting.USERNAME}}  defaultMessage={ 'Welcome'}/>  {GlobalHelper.contextSetting.USERNAME + "" + (GlobalHelper.contextSetting.PROFILEDESC ? ("("+GlobalHelper.contextSetting.PROFILEDESC+")" ): "")}  <hr /> Bussiness Date:{GlobalHelper.contextSetting.BUSSINESS_DATE} &nbsp;
														</span>
													}
													placement="bottomLeft"
													trigger="hover"
												>
												{
													this.checkUserProfilePicture(GlobalHelper.globlevar.href + (window.getcontextpath() )+ "/secure/images/UserProfilePic/" + GlobalHelper.contextSetting.USERCODE + ".jpg")
													?<Avatar
													size="medium"
													src={GlobalHelper.globlevar.href + (window.getcontextpath() )+ "/secure/images/UserProfilePic/" + GlobalHelper.contextSetting.USERCODE + ".jpg"}
													title={ GlobalHelper.contextSetting.PROFILEDESC?(" " + (GlobalHelper.contextSetting.PROFILEDESC) + " "):( " "+(GlobalHelper.contextSetting.USERNAME)+ " ")}
													className={styles.avtar_profile}
													/>
													:<Avatar
													size="medium"
													title={ GlobalHelper.contextSetting.PROFILEDESC?(" " + (GlobalHelper.contextSetting.PROFILEDESC) + " "):( " "+(GlobalHelper.contextSetting.USERNAME)+ " ")}
													className={styles.avtar_no_profile_pic}>
													 {GlobalHelper.contextSetting.USERNAME.charAt(0)}
													</Avatar>
												}
												</Popover>
												<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} className={styles.rightUpperMenuUserName} onClick={this.logoff}>
													<SubMenu
														key="LCMS"
														title={
															<span>
																<FA style={{ color: "#FFFF", fontSize: "12pt", position: "relative", top: "-11.5px" }} name="angle-down"/>
															</span>
														}
														
													>
														{info3.mainheaderinfo.profilemenu.map(function(post, i) {
															if (post.id !== "Setting") {
																if (post.submenus === "") {
																	return (
																		<Menu.Item
																			style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																			key={info3.mainheaderinfo.profilemenu[i].id}
																		>
																			{info3.mainheaderinfo.profilemenu[i].section_value}
																		</Menu.Item>
																	);
																} else if (post.submenus != "") {
																	return (
																		<SubMenu
																			style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																			key={info3.mainheaderinfo.profilemenu[i].id}
																			title={info3.mainheaderinfo.profilemenu[i].section_value}
																		>
																			{info3.mainheaderinfo.profilemenu[i].submenus.map((post1, k) => {
																				return (
																					<MenuItemGroup
																						title={
																							<span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
																								{info3.mainheaderinfo.profilemenu[i].submenus[k].menugroupname}
																								<span style={{ position: "relative", left: "30%" }}>
																									<Icon type="appstore" />
																								</span>
																							</span>
																						}
																					>
																						{info3.mainheaderinfo.profilemenu[i].submenus[k].menudata.map((post2, l) => {
																							return (
																								<Menu.Item
																									style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																									key={info3.mainheaderinfo.profilemenu[i].submenus[k].menudata[l].id}
																								>
																									{info3.mainheaderinfo.profilemenu[i].submenus[k].menudata[l].submenuName}
																								</Menu.Item>
																							);
																						})}
																					</MenuItemGroup>
																				);
																			})}
																		</SubMenu>
																	);
																}
															}
														})}
													</SubMenu>
												</Menu>
											</Layout>
										</div>
									</Header>

									<Content style={{ margin: "8px", position: "relative", top: "-5px", height:"93.5%" }}>
										{
											this.multipleListClicked === true ? <div style={{display:'inline-block', width:'100%', height:'100%', background:'white'}}><Spin style={{ position:'relative', top:'50%', left:'50%' }} spinning={this.multipleListClicked}/></div> : <LocaleProvider locale={enUS}>
												<Provider store={store}>
													<Suspense fallback={null}>
													<Switch>
														<Route
															path={GlobalHelper.globlevar.contextpath + "GridWorkList"}
															component={state => (
																<GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" returnToMenuId={this.props.outnames.returnToMenuId}/>
															)}
														/>
														<Route
															path={GlobalHelper.globlevar.contextpath + "application"}
															component={state => <IndividualFormTemplate widths={this.state.widths} themeCode={this.state.themeName} file={sourceFile} />}
														/>
														<Route
															path={GlobalHelper.globlevar.contextpath + "UIScreen"}
															component={state => (
																<ErrorBoundary>
																	<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																</ErrorBoundary>
															)}
														/>
														<Route
															path="UIScreen"
															component={state => (
																<ErrorBoundary>
																	<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																</ErrorBoundary>
															)}
														/>
														<Route
															path="MainLayout"
															component={state => (
																<ErrorBoundary>
																	<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																</ErrorBoundary>
															)}
														/>
														<Route path={GlobalHelper.globlevar.contextpath + "UIScreen_screen"} component={state => <UIScreen_screen widths={this.state.widths} />} />
														<Route path={GlobalHelper.globlevar.contextpath + "UIScreen"} component={state => <UIScreen refreshQB={this.refreshQB} widths={this.state.widths} />} />
														<Route path={GlobalHelper.globlevar.contextpath + "Dashboard"} component={state => <DashboardContainer />} />
														<Route
															path={GlobalHelper.globlevar.contextpath + "dashboard"}
															component={state => <UIScreen_dashboard widths={this.state.widths} themeCode={this.state.themeName} />}
														/>
														<Route
															path={GlobalHelper.globlevar.contextpath + "IndividualForm"}
															component={state => <IndividualFormTemplate widths={this.state.widths} themeCode={this.state.themeName} file={sourceFile} />}
														/>
														<Route
															path={GlobalHelper.globlevar.contextpath + "MainLayout"}
															component={state => <GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} returnToMenuId={this.props.outnames.returnToMenuId}/>}
														/>
														<Route
															path={GlobalHelper.globlevar.contextpath + "UserSelector"}
															component={state => <UserSelector userselectorindex={this.state.userselectorindex} />}
														/>
														<Route path="/" component={state => <GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName}/>} returnToMenuId={this.props.outnames.returnToMenuId}/>
														<Route path={GlobalHelper.globlevar.contextpath + "MainLayout/index"} component={LoginForm} />

														<Route path="/*" render={() => <Redirect to={pathname} />} />
													</Switch>
													</Suspense>
												</Provider>
												</LocaleProvider>
										}
									</Content>
								</Content>
							</Layout>

							<ReactDrawer open={this.state.open} position={"left"} onClose={this.onDrawerClose} noOverlay={false}>
								<Sider  trigger={null} collapsible collapsed={!this.state.collapsed} className={styles.sidersetting} id={styles.componentslayoutdemocustomtrigger}>
									<div className={styles.logobar} onClick={this.toggle}>
										<span>
											<FA name={menuFoldUnfold} stack="0.5x" className={styles.bar} />
										</span>
									</div>
									{
										siderMenuToRender.map((post,index) => {
												if(post.payload != undefined && post.payload != ""){
													if(post.payload.includes(",")){
														isMultipleWorkList = true;
													}
												}
										})
									}
									<Menu triggerSubMenuAction={this.browserMap.has("isIE") && this.browserMap.get("isIE") === true ? "click" : "hover"} theme="dark" mode="vertical" defaultSelectedKeys={[this.state.defaultWorkList]} className={styles.sidersettingMenu}>

										{siderMenuToRender.map((post,index) => {
											var isdefaultactive = "no";

											if (post.activated == undefined) {
												//isdefaultactive = "no";
												if(GlobalHelper.activeMenuId==post.menuid){
													isdefaultactive = "yes"
												}
												else{
												isdefaultactive = "no";
											}
											}else{
												isdefaultactive = "yes";
											}
											var funcHotKey;

											if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(post.menuid) != null){
												funcHotKey = GlobalHelper.HotKeyMap.get(post.menuid)['SZHOTKEYS'];
											}else{
												if(index<9)
												funcHotKey = 'ctrl+'+(index+1);
											}
											if(post['hotkey'] != null){
												post['hotkey'] = funcHotKey;
											}
											else{
												post['hotkey'] = funcHotKey;
											}
											Log4r.log("this.worklistData ", this.worklistData , post.payload)
												if(post.payload !== undefined && post.payload !== ""){
													Log4r.log("post.payload ", post.payload)
													if(post.payload.includes(",")){
														var arrPayload = post.payload.split(",")
														return(
															<SubMenu style={{width:'100%',display:'inline-block',position:'relative'}} aria-label={post.caption} className={this.setClassLeft(post.menuid,isdefaultactive)} title={<span><img src={post.image} style={{position:'absolute', fontSize: "11pt", left:(this.state.themeName==="myCompact" ? 17 : 19), height:((this.state.themeName ==="myCompact" ? 14 : 18)) , top:(this.state.themeName==="myCompact" ? 13 : 10), color: 'white'}} /><span className={styles.multipleworklistMenu}>{post.caption}</span></span>}>
																{
																	arrPayload.map((item,index)=>{
																		Log4r.log("Menu Over....")
																		var listEnity = item.split(":")
																		Log4r.log("listEnity", listEnity);
																		indexmap.set(listEnity[0], (index+1));
																		itemMap.set(listEnity[0], post);
																		if(listEnity[0] === GlobalHelper.listEntityId)
																		{
																			rowsCount = this.state.rowsCount;
																		}
																		else{
																			if(GlobalHelper.multiworklistMap.has(listEnity[0]))
																			{
																			rowsCount = GlobalHelper.multiworklistMap.get(listEnity[0]);
																			}
																			else{
																				rowsCount = 0;
																			}
																		}
																		return(
																			<Menu.Item className={styles.menuBackground}  aria-label={listEnity[1]} onClick={(event)=> { (this.clickmenu != "default")? this.onClickWMenu(event, listEnity[0]) : Log4r.log("Menu Item ", event , listEnity[0], this.clickmenu); this.clickmenu = undefined;}}>
																				<table>
																					<tbody>
																						<tr>
																							<td aria-label={listEnity[1]}>
																								<span className="fa fa-star" style={{color: this.state.defaultWorkList==listEnity[0] ? "#ff7342" : "#ffffff"}} onClick={(event) => {this.changeFavorite(event, listEnity[0]); this.clickmenu = "default";}} aria-label={listEnity[1]}></span>
																							</td>
																							<td>&nbsp;&nbsp;</td>
																							<td>
																								<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} onClick={(event)=>{this.clickmenu = "worklist";}}>
																									<span style={{color: this.state.selectedWorkList==listEnity[0] ? "#ff7342" : "#ffffff" , minWidth:"500px"}} aria-label = {listEnity[1]}>{listEnity[1]}</span>
																								</Link>
																							</td>
																						</tr>
																					</tbody>
																				</table>
																			</Menu.Item>
																		)
																	})
																}
															</SubMenu>
														 )

													}
												}

											let sampleStr = post.image;//"http://10.165.100.69/"+GlobalHelper.menuContext+"/$fontimage{fa fa-align-left iconCenter}";
											Log4r.log("SGSGgg////.......",sampleStr);
											if (sampleStr) {
												let cndIndx = sampleStr.indexOf("$fontimage{");
												if (cndIndx !== -1) {
													let first = sampleStr.indexOf("{",cndIndx);
													let last = sampleStr.indexOf("}",first+1);
													let icon = sampleStr.slice(first+1,last);
													 let ici = GlobalHelper.getFontIcon(icon);
													// let col = GlobalHelper.getFontColor(icon);
													Log4r.log("icon==",icon , ici);
													return (
														<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
															<Tooltip placement="right" title={<span>{post.caption}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
																<div id={funcHotKey} className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
																	<FA name={ici} style={{ marginLeft: "0px", fontSize: 11, color: "white" }}
																	className={this.setClassLeftIcon(post.menuid, isdefaultactive)} />
																	<span>
																		<span className={this.OpFunction(this)}>{post.caption}</span>
																	</span>
																</div>
															</Tooltip>
														</Link>


													);
												}
												else {
													return (
														<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
														<Tooltip placement="right" title={<span>{post.caption}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
														<div id={funcHotKey} className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
														<img
														src={post.image}
														style={{ marginLeft: "0px", fontSize: 11, color: "white" }}
														className={this.setClassLeftIcon(post.menuid, isdefaultactive)}
														/>
														<span>
														<span className={this.OpFunction(this)}>{post.caption}</span>
														</span>
														</div>
														</Tooltip>
														</Link>


													);
												}
											}
											else {
													return (
														<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
														<Tooltip placement="right" title={<span>{post.caption}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
														<div id={funcHotKey} className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
														<img
														src={post.image}
														style={{ marginLeft: "0px", fontSize: 11, color: "white" }}
														className={this.setClassLeftIcon(post.menuid, isdefaultactive)}
														/>
														<span>
														<span className={this.OpFunction(this)}>{post.caption}</span>
														</span>
														</div>
														</Tooltip>
														</Link>


													);
												}
										})}
									</Menu>
									<div className={styles.siderlogoindus}>
										<img src={"images/indus-logo.png"} />
									</div>
								</Sider>
								{/* <Tooltip placement="right" title={<span>Dialer Login</span>}>
                                  <div aria-label="Dialer Login" onClick={(e)=>this.RenderDraggableBar(e,this.state.show)} className={this.setClassLeft("5", "no")}  style={{ marginTop: "1px",height:'52px',width:'49px',position: 'absolute',bottom:"33px",borderTop:'1px solid #5d6c81'}}>
<FA name="fas fa-bars" style={{ marginLeft: "0px", fontSize: (this.state.themeName==="myCompact" ? "16px" : "21px"), color: "white" }}
className={this.setClassLeftIcon("5", "no")} />
{this.state.showComponent ?
this.RenderLoginForm(fromJson) :
null
}
</div>
</Tooltip> */}
							</ReactDrawer>
						</Layout>
					</Router>
				);
			} else if (window.innerWidth > 760) {
				//Sptint 9 (Task 47): Modified code to return layout with dreawer or without drawer
				return (
					<Router>
						<Layout className={styles.customMainLayout}>
						<HotKeyComponent MainLayoutFlag={true} Component={this} ComponentProps={this.props} worklistData={this.worklistData} siderMenuToRender={siderMenuToRender}/>
							<Sider trigger={null} collapsible collapsed={!this.state.collapsed} className={styles.sidersetting} id={styles.componentslayoutdemocustomtrigger}>
								<div className={styles.logobar} onClick={this.toggle}>
										<FA name={menuFoldUnfold} stack="1x" className={styles.bar} />{" "}
								</div>
								{
									siderMenuToRender.map((post,index) => {
											if(post.payload != undefined && post.payload != ""){
												if(post.payload.includes(",")){
													isMultipleWorkList = true;
												}
											}
									})
								}
								<Menu triggerSubMenuAction={this.browserMap.has("isIE") && this.browserMap.get("isIE") === true ? "click" : "hover"} theme="dark" mode= { window.browserType == "IE" ? "inline" : "vertical" }  defaultSelectedKeys={[this.state.defaultWorkList]} className={styles.sidersettingMenu}>

									{
										siderMenuToRender.slice(0,8).map((post,index) => {
										var isdefaultactive = "no";

										if (post.activated == undefined) {
											if(GlobalHelper.activeMenuId==post.menuid){
											isdefaultactive = "yes";
										}
											else{
											isdefaultactive = "no";
											}
										}else{
											isdefaultactive = "yes";
										}
										var funcHotKey;

										if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(post.menuid) != null){
											funcHotKey = GlobalHelper.HotKeyMap.get(post.menuid)['SZHOTKEYS'];
										}else{
											if(index<9)
											funcHotKey = 'ctrl+'+(index+1);
										}
										if(post['hotkey'] != null){
											post['hotkey'] = funcHotKey;
										}
										else{
											post['hotkey'] = funcHotKey;
										}
										Log4r.log("this.worklistData ", this.worklistData , post.payload)
											if(post.payload !== undefined && post.payload !== ""){
												Log4r.log("post.payload ", post.payload)
												if(post.payload.includes(",")){
													var arrPayload = post.payload.split(",")
													return(
														<SubMenu style={{width:'100%',display:'inline-block',position:'relative'}} className={this.setClassLeft(post.menuid,isdefaultactive)} aria-label={post.caption}
														title={
																	<span>
																	<img src={post.image} style={{position:'absolute', fontSize: "11pt", left:(this.state.themeName==="myCompact" ? 17 : 19), height:((this.state.themeName==="myCompact" ? 14 : 18)) , top:(this.state.themeName==="myCompact" ? 13 : 10), color: 'white'}} />
																	<span className={styles.multipleworklistMenu}>
																	{post.caption}
																</span>
																</span>
																}	>
															{
																arrPayload.map((item,index)=>{
																	Log4r.log("Menu Over....")
																	var listEnity = item.split(":")
																	Log4r.log("listEnity", listEnity);
																	indexmap.set(listEnity[0], (index+1));
																	itemMap.set(listEnity[0], post);
																	if(listEnity[0] === GlobalHelper.listEntityId)
																	{
																	  rowsCount = this.state.rowsCount;
																		GlobalHelper.globlevar["worklistName"] = listEnity[1];
																	}
																	else{
																	  if(GlobalHelper.multiworklistMap.has(listEnity[0]))
																	  {
																		rowsCount = GlobalHelper.multiworklistMap.get(listEnity[0]);
																	  }
																	  else{
																		  rowsCount = 0;
																	  }
																	}
																	return(
																	  <Menu.Item className={styles.menuBackground} onClick={(event)=> { (this.clickmenu != "default")? this.onClickWMenu(event, listEnity[0]) : Log4r.log("Menu Item ", event , listEnity[0], this.clickmenu); this.clickmenu = undefined;}} aria-label={listEnity[1]}>
																		<table>
																			<tbody>
																				<tr>
																					<td aria-label={listEnity[1]}>
																						<span className="fa fa-star" style={{color: this.state.defaultWorkList==listEnity[0] ? "#ff7342" : "#ffffff"}} onClick={(event) => {this.changeFavorite(event, listEnity[0]); this.clickmenu = "default";}} aria-label={listEnity[1]}></span>
																					</td>
																					<td>&nbsp;&nbsp;</td>
																					<td>
																						<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} onClick={(event)=>{this.clickmenu = "worklist";}}>
																							<span style={{color: this.state.selectedWorkList==listEnity[0] ? "#ff7342" : "#ffffff" , minWidth:"500px"}} aria-label = {listEnity[1]}>{listEnity[1]}</span>
																						</Link>
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</Menu.Item>
																	)
																})
															}
														</SubMenu>
													 )

												}
											}
										let sampleStr = post.image;//"http://10.165.100.69/"+GlobalHelper.menuContext+"/$fontimage{fa fa-align-left iconCenter}";
										Log4r.log("SGSGgg////.......",sampleStr);
										if (sampleStr) {
											let cndIndx = sampleStr.indexOf("$fontimage{");
											if (cndIndx !== -1) {
												let first = sampleStr.indexOf("{",cndIndx);
												let last = sampleStr.indexOf("}",first+1);
												let icon = sampleStr.slice(first+1,last);
												 let ici = GlobalHelper.getFontIcon(icon);
												// let col = GlobalHelper.getFontColor(icon);
												Log4r.log("icon==",icon , ici);

						if (post.groupcd === "ELLIP") {
							return(
                  <SubMenu style={{width:'52px',height:52, display:'inline-block',position:'relative'}} className={this.setClassLeft(post.menuid,isdefaultactive)}
                  
				  aria-label={post.caption}
                  title={<div style={{position:'relative',left:'-9px'}}>
                          <span><FA name={ici} stack='2' /></span>
                          </div>}>
                       {
                         newArr.map((post,ll)=>{
													 if(post.payload != undefined && post.payload != ""){
	 													if(post.payload.includes(",")){
	 														isMultipleWorkList = true;
	 													}
	 												}
													if(post.payload !== undefined && post.payload !== ""){
														Log4r.log("sdsssdspayload.....", post.payload)
														if(post.payload.includes(",")){
															var arrPayload = post.payload.split(",")
															return(
																<SubMenu style={{width:'100%',display:'inline-block',position:'relative',paddingLeft:0,marginTop:-5}} aria-label={post.caption}
																title={
																	<span>
																		<img src={post.image} style={{position:'absolute', fontSize: "11pt", left:(this.state.themeName==="myCompact" ? 17 : 19), height:((this.state.themeName==="myCompact" ? 14 : 18)) , top:(this.state.themeName==="myCompact" ? 13 : 10), color: 'white'}} />
																		<span style={{width:'auto'}} className={styles.multipleworklistMenu}>
																	  	{post.caption}
																		</span>
																	</span>
																}>
																{
																	arrPayload.map((item,index)=>{
																		Log4r.log("Menu Over....")
																		var listEnity = item.split(":")
																		Log4r.log("listEnity", listEnity);
																		indexmap.set(listEnity[0], (index+1));
																		itemMap.set(listEnity[0], post);
																		if(listEnity[0] === GlobalHelper.listEntityId)
																		{
																		  rowsCount = this.state.rowsCount;
																			GlobalHelper.globlevar["worklistName"] = listEnity[1];
																		}
																		else{
																		  if(GlobalHelper.multiworklistMap.has(listEnity[0]))
																		  {
																			rowsCount = GlobalHelper.multiworklistMap.get(listEnity[0]);
																		  }
																		  else{
																			  rowsCount = 0;
																		  }
																		}
																		return(
																		  <Menu.Item onClick={(event)=> { (this.clickmenu != "default")? this.onClickWMenu(event, listEnity[0]) : Log4r.log("Menu Item ", event , listEnity[0], this.clickmenu); this.clickmenu = undefined;}} aria-label={listEnity[1]}>
																			<table>
																				<tbody>
																					<tr>
																						<td aria-label={listEnity[1]}>
																							<span className="fa fa-star" style={{color: this.state.defaultWorkList==listEnity[0] ? "#ff7342" : "#ffffff"}} onClick={(event) => {this.changeFavorite(event, listEnity[0]); this.clickmenu = "default";}} aria-label={listEnity[1]}></span>
																						</td>
																						<td>&nbsp;&nbsp;</td>
																						<td>
																							<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} onClick={(event)=>{this.clickmenu = "worklist";}}>
																								<span style={{color: this.state.selectedWorkList==listEnity[0] ? "#ff7342" : "#ffffff" , minWidth:"500px"}} aria-label = {listEnity[1]}>{listEnity[1]}</span>
																							</Link>
																						</td>
																					</tr>
																				</tbody>
																			</table>
																		</Menu.Item>
																		)
																	})
																}
																</SubMenu>
															 )
															}
													}
													let sampleStrellip = post.image;
													let cndIndxellip = sampleStrellip.indexOf("$fontimage{");
		 											let firstellip = sampleStrellip.indexOf("{",cndIndxellip);
		 											let lastellip = sampleStrellip.indexOf("}",firstellip+1);
		 											let iconellip = sampleStrellip.slice(firstellip+1,lastellip);
		 											let iciellip = GlobalHelper.getFontIcon(iconellip);
													 //Task - Left side menus inside ellipsis not working at MainLayout.
                           return(
                            <Menu.Item onClick={() => this.MyFuncLeft(post)} style={{paddingLeft:0,marginTop:-5}}>
														<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype}>
															<div id={funcHotKey} style={{ marginTop: "1px" }}>
																<FA name={iciellip} style={{textAlign:'center',height:40,width:40, marginLeft: "0px", fontSize: (this.state.themeName==="myCompact" ? "16px" : "21px"), color: "white" }}/>
																<span>
																	{post.caption}
																</span>
															</div>
														</Link>
                            </Menu.Item>
                           )
                         })
                       }
                  </SubMenu>
		          	)
							}



													return (
														<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
															<Tooltip placement="right" title={<span>{post.caption}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
																<div id={funcHotKey} className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
																	<FA name={ici} style={{ marginLeft: "0px", fontSize: (this.state.themeName==="myCompact" ? "16px" : "21px"), color: "white" }}
																	className={this.setClassLeftIcon(post.menuid, isdefaultactive)} />
																	<span className={this.OpFunction(this)}>
																		{post.caption}
																	</span>
																</div>
															</Tooltip>
														</Link>
													);


											}
											else {
												return (
													<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
													<Tooltip placement="right" title={<span>{post.caption}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
													<div id={funcHotKey} className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
													<img
													src={post.image}
													style={{ marginLeft: "0px", fontSize: 21, color: "white" }}
													className={this.setClassLeftIcon(post.menuid, isdefaultactive)}
													/>

													<span className={this.OpFunction(this)}>{post.caption}</span>

													</div>
													</Tooltip>
													</Link>


												);
											}
										}
										else {
												return (
													<Link className={funcHotKey} style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
													<Tooltip placement="right" title={<span>{post.caption}<span style={{marginLeft:'30px'}}>{funcHotKey}</span></span>}>
													<div id={funcHotKey} className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>

													<img
													src={post.image}
													style={{ marginLeft: "0px", fontSize: 21, color: "white" }}
													className={this.setClassLeftIcon(post.menuid, isdefaultactive)}
													/>
													<span className={this.OpFunction(this)}>{post.caption}</span>

													</div>
													</Tooltip>
													</Link>


												);
											}
									})}
								</Menu>

								{/* <Tooltip placement="right" title={<span>Dialer Login</span>}>
								<div aria-label="Dialer Login" onClick={(e)=>this.RenderDraggableBar(e,this.state.show)} className={this.setClassLeft("5", "no")}  style={{ marginTop: "1px",height:'52px',width:'49px',position: 'absolute',bottom:"33px",borderTop:'1px solid #5d6c81'}}>
									<FA name="fas fa-bars" style={{ marginLeft: "0px", fontSize: (this.state.themeName==="myCompact" ? "16px" : "21px"), color: "white" }}
									className={this.setClassLeftIcon("5", "no")} />
									{this.state.showComponent ?
										 this.RenderLoginForm(fromJson) :
										 null
									}
								</div>
								</Tooltip> */}

								<div className={styles.siderlogoindus}>
									<img src={"images/indus-logo.png"} />
								</div>
							</Sider>
							<Layout style={{ width: "99%", overflow: "hidden" }}>
								<Content className={styles.contents}>
									<Header className={styles.customHeader}>
										{/*<div className={styles.logoindus} style={{marginLeft:'14px',  height:'100%',  display: 'inline-block' ,width:'7%' }}  >
                                    <img src='react/images/IDFC_LOGO_SCALABLE.svg'  style={{marginTop:'-38px',width:'70px', height:"40px"}} />
                                  </div>*/}
										<div className={styles.logoindus}>
											<img src={"images/client_logo.png"} />
										</div>

										<div className={styles.rightUpperMenus}>

											<div onClick={value => window.open("index.html?noneedge=true&pinCategory=Transaction","_blank")} className={styles.newTransactionTab}>
												<span><span className={styles.newTransactionTitle} aria-label="Copy To New Tab">{"Copy To New Tab"} </span>
												<FA className={styles.newTransactionIcon} name="far fa-window-restore"></FA></span>
											</div>

											<div className={styles.businesdatediv}>
												<span className={styles.bussinessDate} aria-label="Business Date">Business Date : {GlobalHelper.contextSetting.BUSSINESS_DATE}</span>
											</div>

											<Menu
												theme="dark"
												mode="horizontal"
												defaultSelectedKeys={["1"]}
												style={{ marginRight: "0px", minHeight: "5px", display: "inline-block", backgroundColor: "transparent", border: "0px solid transparent" }}
												onClick={this.searchHandle}
												aria-label="Global Drop-down"
											>
												<SubMenu
													key="LCMS"
													title={
													<ClipSearchComponent refreshQB={this.refreshQB} names={this.props}/>
													}
													
												/>
											</Menu>

											{/*<Menu


                                   theme="dark"
                                   mode="horizontal"
                                   defaultSelectedKeys={['1']}
                                   style={{ minHeight:'5px', aline:'right',display: 'inline-block' , textAlign:'left' , backgroundColor:'transparent', border:'0px solid transparent'}}
                                   onClick={this.searchHandle}
                                    >
                                     <SubMenu key="LCMS" title={<span><Icon style={{ color: '#FFFF' }}>  <FA name='th' /> </Icon></span>}>
                                     <Menu.Item style={{backgroundColor:'#364558' , height:'90%', padding:0, margin:0}} key="1">
                                     <List
                                       grid={{ gutter: 0, xs: 1, sm: 4, md: 4, lg: 4, xl: 4 }}
                                       dataSource={info1}
                                       renderItem={item => (
                                         <List.Item style={{margin:'0px'}} className={styles.listitemclass}>
                                             <Layout className={styles.layoutcssP}>
                                               <div className={styles.icondiv}><FA name={item.icontype} className={styles.iconclass}/></div>
                                               <div style={{fontSize:'11px'}} className={styles.titlediv}>{item.title}</div>
                                             </Layout>
                                         </List.Item>
                                       )}
                                     className={styles.listclass}/>
                                    </Menu.Item>
                                    </SubMenu>
                       </Menu> */}

											<Menu theme="dark"
														mode="horizontal"
														defaultSelectedKeys={["1"]}
														onClick={this.searchHandle}
														style={{display:"inline-block",textAlign:"left",backgroundColor:"transparent",border:"0px solid transparent"}} >
												<SubMenu
													key="LCMS"
													title={
														<span>
																<FA name="th" style={{color : "white"}} className={styles.search} aria-label="Menu Tile"/>
														</span>
													}
													style={{ backgroundColor: "transparent",top:-10 }}
													
												>
													<Menu.Item
														className={styles.searchIconBox}
														style={{ backgroundColor: "transparent", margin: "-20px 0px -6px", borderRadius: "5px", opacity: "1.2", height: "90%", padding: 0 }}
														key="1"
													>
														<div className={styles.above}>
															<div className={styles.mid} />

															<List
																id={styles.customListUserSelector}
																grid={{ gutter: 0, xs: 1, sm: 2, md: 1, lg: 2, xl: 2 }}
																dataSource={info1}
																renderItem={item => (
																	<List.Item style={{ margin: "0px" }} aria-label = {item.title}>
																		<Layout
																			className={this.setSystemMenuClass(item.id,item.title)}
																			style={{ paddingTop: "10px" }}
																			onClick={() => this.MyFuncSystemMenu(item.id , item.title)}
																		>
																			<div className={this.setSystemMenuClassIcon(item.id,item.title)}>
																				<FA name={item.icontype} />
																			</div>
																			{/*<div><Icon type="pushpin" className={styles.myspan} /></div>*/}
																			<div>
																				<Icon type="pushpin"  className={this.setSystemMenuClassPinIcon(item.id,item.title)} />
																			</div>
																			<div className={this.setSystemMenuClassTitle(item.id,item.title)}>{item.title}</div>
																		</Layout>
																	</List.Item>
																)}
																className={styles.listclass}
															/>
														</div>
													</Menu.Item>
												</SubMenu>
											</Menu>
											<Layout className={styles.customLayout}>
												{/*<Avatar className={styles.avatar_profile} size="medium" src="react/images/profile-pic.jpg" title=" Welcome Kiran Dhakate (EMP : Indus Pune)" ></Avatar>*/}
												{
													this.checkUserProfilePicture(GlobalHelper.globlevar.href + (window.getcontextpath() )+ "/secure/images/UserProfilePic/" + GlobalHelper.contextSetting.USERCODE + ".jpg")
													?<Avatar
													size="medium"
													src={GlobalHelper.globlevar.href + (window.getcontextpath() ) + "/secure/images/UserProfilePic/" + GlobalHelper.contextSetting.USERCODE + ".jpg"}
													title={ GlobalHelper.contextSetting.PROFILEDESC?(" " + (GlobalHelper.contextSetting.PROFILEDESC) + " "):( " "+(GlobalHelper.contextSetting.USERNAME)+ " ")}
													className={styles.avtar_profile}
													/>
													:<Avatar
													size="medium"
													title={ GlobalHelper.contextSetting.PROFILEDESC?(" " + (GlobalHelper.contextSetting.PROFILEDESC) + " "):( " "+(GlobalHelper.contextSetting.USERNAME)+ " ")}
													className={styles.avtar_no_profile_pic}>
													 {GlobalHelper.contextSetting.USERNAME.charAt(0)}
													</Avatar>
												}
												<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} className={styles.rightUpperMenuUserName} onClick={this.logoff}>
													<SubMenu
														key="LCMS"
														title={
															<span>
																<span className={styles.rightUpperMenuUserTitle} aria-label="Welcome User Button"> <FormattedMessage id="app.welcome" values={{name: GlobalHelper.contextSetting.USERNAME}}  defaultMessage={ 'Welcome'}/> {GlobalHelper.contextSetting.USERNAME} &nbsp;</span>
																{/*<Icon  type="down" />*/}
																<FA name="angle-down" style={{ color: "#FFFF", fontSize: "9pt", position: "relative", top: "-11px" }} stack="0.2x"/>
															</span>
														}
														
													>
														{info3.mainheaderinfo.profilemenu.map(function(post, i) {
															if (post.id !== "Setting") {
																if (post.submenus === "") {
																	return (
																		<Menu.Item
																			style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																			key={info3.mainheaderinfo.profilemenu[i].id}
																			aria-label = {post.id}
																		>
																			{info3.mainheaderinfo.profilemenu[i].section_value}
																		</Menu.Item>
																	);
																} else if (post.submenus != "") {
																	return (
																		<SubMenu
																			style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																			key={info3.mainheaderinfo.profilemenu[i].id}
																			title={info3.mainheaderinfo.profilemenu[i].section_value}
																		>
																			{info3.mainheaderinfo.profilemenu[i].submenus.map((post1, k) => {
																				return (
																					<MenuItemGroup
																						title={
																							<span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
																								{info3.mainheaderinfo.profilemenu[i].submenus[k].menugroupname}
																								<span style={{ position: "relative", left: "30%" }}>
																									<Icon type="appstore" />
																								</span>
																							</span>
																						}
																					>
																						{info3.mainheaderinfo.profilemenu[i].submenus[k].menudata.map((post2, l) => {
																							return (
																								<Menu.Item
																									style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																									key={info3.mainheaderinfo.profilemenu[i].submenus[k].menudata[l].id}
																									aria-label = {post.id}
																								>
																									{info3.mainheaderinfo.profilemenu[i].submenus[k].menudata[l].submenuName}
																								</Menu.Item>
																							);
																						})}
																					</MenuItemGroup>
																				);
																			})}
																		</SubMenu>
																	);
																}
															}

														})}
													</SubMenu>
												</Menu>
											</Layout>
										</div>
									</Header>

									<Content style={{ margin: "8px", position: "relative", top: "-5px", height:"93.5%" }}>
										{
											this.multipleListClicked === true ? <div style={{display:'inline-block', width:'100%', height:'100%', background:'white'}}><Spin style={{ position:'relative', top:'50%', left:'50%' }} spinning={this.multipleListClicked}/></div> : <LocaleProvider locale={enUS}>
													<Provider store={store}>
														<Suspense fallback={null}>
														<Switch>
															<Route
																path={GlobalHelper.globlevar.contextpath + "GridWorkList"}
																component={state => (
																	<GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" returnToMenuId={this.props.outnames.returnToMenuId}/>
																)}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "UIScreen"}
																component={state => (
																	<ErrorBoundary>
																		<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																	</ErrorBoundary>
																)}
															/>
															<Route
																path="UIScreen"
																component={state => (
																	<ErrorBoundary>
																		<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																	</ErrorBoundary>
																)}
															/>
															<Route
																path="MainLayout"
																component={state => (
																	<ErrorBoundary>
																		<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																	</ErrorBoundary>
																)}
															/>
															<Route path={GlobalHelper.globlevar.contextpath + "UIScreen_screen"} component={state => <UIScreen_screen widths={this.state.widths} />} />
															<Route path={GlobalHelper.globlevar.contextpath + "UIScreen"} component={state => <UIScreen refreshQB={this.refreshQB} widths={this.state.widths} />} />
															<Route path={GlobalHelper.globlevar.contextpath + "Dashboard"} component={state => <DashboardContainer />} />
															<Route
																path={GlobalHelper.globlevar.contextpath + "dashboard"}
																component={state => <UIScreen_dashboard widths={this.state.widths} themeCode={this.state.themeName} />}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "application"}
																component={state => <IndividualFormTemplate widths={this.state.widths} themeCode={this.state.themeName} file={sourceFile} />}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "MainLayout"}
																component={state => <GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} returnToMenuId={this.props.outnames.returnToMenuId}/>}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "UserSelector"}
																component={state => <UserSelector userselectorindex={this.state.userselectorindex} />}
															/>
															<Route path="/" component={state => <GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName}/>} returnToMenuId={this.props.outnames.returnToMenuId}/>
															<Route path={GlobalHelper.globlevar.contextpath + "MainLayout/index"} component={LoginForm} />
															<Route path="/*" render={() => <Redirect to={pathname} />} />
														</Switch>
														</Suspense>
													</Provider>
												</LocaleProvider>
										}
									</Content>
								</Content>
							</Layout>
						</Layout>
					</Router>
				);
			} else {
				return (
					<Router>
						<Layout className={styles.customMainLayout}>
						<HotKeyComponent MainLayoutFlag={true} Component={this} ComponentProps={this.props} worklistData={this.worklistData} siderMenuToRender={siderMenuToRender}/>
							<div onClick={this.toggleDrawer} disabled={this.state.open && !this.state.noOverlay} className={styles.drawerButton}>
								{!this.state.open ? (
									<span>
										<FA name={menuFoldUnfold} className={styles.drawerIcons} />
									</span>
								) : (
									<span>
										<FA name={"far fa-times-circle"} className={styles.drawerIcons} />
									</span>
								)}
							</div>

							<Layout style={{ width: "99%", overflow: "hidden" }}>
								<Content className={styles.contents}>
									<Header className={styles.customHeader}>
										{/*<div className={styles.logoindus} style={{marginLeft:'14px',  height:'100%',  display: 'inline-block' ,width:'7%' }}  >
                                      <img src='react/images/IDFC_LOGO_SCALABLE.svg'  style={{marginTop:'-38px',width:'70px', height:"40px"}} />
                                    </div>*/}
										<div className={styles.logoindus}>
											<img src={"images/client_logo.png"} />
										</div>

										<div className={styles.rightUpperMenus}>
											<div onClick={value => window.open("index.html?noneedge=true&pinCategory=Transaction","_blank")} className={styles.newTransactionTab}>
												<span><span className={styles.newTransactionTitle} aria-label="Copy To New Tab">{"Copy To New Tab"}</span>
												<FA className={styles.newTransactionIcon} name="far fa-window-restore"></FA></span>
											</div>

											<div className={styles.businesdatediv}>
												<span className={styles.bussinessDate}>Bussiness Date:{GlobalHelper.contextSetting.BUSSINESS_DATE}</span>
											</div>

											<Menu
												theme="dark"
												mode="horizontal"
												defaultSelectedKeys={["1"]}
												style={{ marginRight: "0px", minHeight: "5px", display: "inline-block", backgroundColor: "transparent", border: "0px solid transparent" }}
												onClick={this.searchHandle}
											>
												<SubMenu
													key="LCMS"
													title={
														<ClipSearchComponent refreshQB={this.refreshQB} names={this.props}/>
													}
													
												/>
											</Menu>

											{/*<Menu


                                     theme="dark"
                                     mode="horizontal"
                                     defaultSelectedKeys={['1']}
                                     style={{ minHeight:'5px', aline:'right',display: 'inline-block' , textAlign:'left' , backgroundColor:'transparent', border:'0px solid transparent'}}
                                     onClick={this.searchHandle}
                                      >
                                       <SubMenu key="LCMS" title={<span><Icon style={{ color: '#FFFF' }}>  <FA name='th' /> </Icon></span>}>
                                       <Menu.Item style={{backgroundColor:'#364558' , height:'90%', padding:0, margin:0}} key="1">
                                       <List
                                         grid={{ gutter: 0, xs: 1, sm: 4, md: 4, lg: 4, xl: 4 }}
                                         dataSource={info1}
                                         renderItem={item => (
                                           <List.Item style={{margin:'0px'}} className={styles.listitemclass}>
                                               <Layout className={styles.layoutcssP}>
                                                 <div className={styles.icondiv}><FA name={item.icontype} className={styles.iconclass}/></div>
                                                 <div style={{fontSize:'11px'}} className={styles.titlediv}>{item.title}</div>
                                               </Layout>
                                           </List.Item>
                                         )}
                                       className={styles.listclass}/>
                                      </Menu.Item>
                                      </SubMenu>
                         </Menu> */}

											<Menu
											style={{display:"inline-block",textAlign:"left",backgroundColor:"transparent",border:"0px solid transparent"}}
											theme="dark"
											mode="horizontal"
											defaultSelectedKeys={["1"]}
											onClick={this.searchHandle}>
												<SubMenu
													key="LCMS"
													title={
														<span>

																<FA name="th" className={styles.search}/>

														</span>
													}
													style={{ backgroundColor: "transparent",top:-10 }}
													
												>
													<Menu.Item
														className={styles.searchIconBox}
														style={{ backgroundColor: "transparent", margin: "-20px 0px -6px", borderRadius: "5px", opacity: "1.2", height: "90%", padding: 0 }}
														key="1"
													>
														<div className={styles.above}>
															<div className={styles.mid} />

															<List
																id={styles.customListUserSelector}
																grid={{ gutter: 0, xs: 1, sm: 2, md: 1, lg: 2, xl: 2 }}
																dataSource={info1}
																renderItem={item => (
																	<List.Item style={{ margin: "0px" }}>
																		<Layout
																			className={this.setSystemMenuClass(item.id,item.title)}
																			style={{ paddingTop: "10px" }}
																			onClick={() => this.MyFuncSystemMenu(item.id , item.title)}
																		>
																			<div className={this.setSystemMenuClassIcon(item.id,item.title)}>
																				<FA name={item.icontype} />
																			</div>
																			{/*<div><Icon type="pushpin" className={styles.myspan} /></div>*/}
																			<div>
																				<Icon type="pushpin" className={this.setSystemMenuClassPinIcon(item.id,item.title)} />
																			</div>
																			<div className={this.setSystemMenuClassTitle(item.id,item.title)}>{item.title}</div>
																		</Layout>
																	</List.Item>
																)}
																className={styles.listclass}
															/>
														</div>
													</Menu.Item>
												</SubMenu>
											</Menu>
											<Layout className={styles.customLayout}>
												{/*<Avatar className={styles.avatar_profile} size="medium" src="react/images/profile-pic.jpg" title=" Welcome Kiran Dhakate (EMP : Indus Pune)" ></Avatar>*/}
												<Popover
													content={<span className={styles.upperRightIconPopover}><FormattedMessage id="app.welcome" values={{name: GlobalHelper.contextSetting.USERNAME}}  defaultMessage={ 'Welcome'}/>  {GlobalHelper.contextSetting.USERNAME + "" + (GlobalHelper.contextSetting.PROFILEDESC ? ("("+GlobalHelper.contextSetting.PROFILEDESC+")" ): "")}! &nbsp;</span>}
													placement="bottomLeft"
													trigger="hover"
												>
												{
													this.checkUserProfilePicture(GlobalHelper.globlevar.href + (window.getcontextpath() )+ "/secure/images/UserProfilePic/" + GlobalHelper.contextSetting.USERCODE + ".jpg")
													?<Avatar
													size="medium"
													src={GlobalHelper.globlevar.href + (window.getcontextpath() )+ "/secure/images/UserProfilePic/" + GlobalHelper.contextSetting.USERCODE + ".jpg"}
													title={"Welcome "  + GlobalHelper.contextSetting.USERNAME + " "}
													className={styles.avtar_profile}
													/>
													:<Avatar
													size="medium"
													title={"Welcome "  + GlobalHelper.contextSetting.USERNAME + " "}
													className={styles.avtar_no_profile_pic}>
													 {GlobalHelper.contextSetting.USERNAME.charAt(0)}
													</Avatar>
												}
												</Popover>
												<Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]} className={styles.rightUpperMenuUserName} onClick={this.logoff}>
													<SubMenu
														key="LCMS"
														title={
															<span>
																<FA name="angle-down" style={{ color: "#FFFF", fontSize: "14pt", position: "relative", top: "-11px" }} stack="0.2x"/>
															</span>
														}
														
													>
														{info3.mainheaderinfo.profilemenu.map(function(post, i) {
															if (post.id !== "Setting") {
																if (post.submenus === "") {
																	return (
																		<Menu.Item
																			style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																			key={info3.mainheaderinfo.profilemenu[i].id}
																		>
																			{info3.mainheaderinfo.profilemenu[i].section_value}
																		</Menu.Item>
																	);
																} else if (post.submenus != "") {
																	return (
																		<SubMenu
																			style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																			key={info3.mainheaderinfo.profilemenu[i].id}
																			title={info3.mainheaderinfo.profilemenu[i].section_value}
																		>
																			{info3.mainheaderinfo.profilemenu[i].submenus.map((post1, k) => {
																				return (
																					<MenuItemGroup
																						title={
																							<span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
																								{info3.mainheaderinfo.profilemenu[i].submenus[k].menugroupname}
																								<span style={{ position: "relative", left: "30%" }}>
																									<Icon type="appstore" />
																								</span>
																							</span>
																						}
																					>
																						{info3.mainheaderinfo.profilemenu[i].submenus[k].menudata.map((post2, l) => {
																							return (
																								<Menu.Item
																									style={{ backgroundColor: "#001529", width: "99.3%", fontFamily: "'Montserrat', sans-serif" }}
																									key={info3.mainheaderinfo.profilemenu[i].submenus[k].menudata[l].id}
																								>
																									{info3.mainheaderinfo.profilemenu[i].submenus[k].menudata[l].submenuName}
																								</Menu.Item>
																							);
																						})}
																					</MenuItemGroup>
																				);
																			})}
																		</SubMenu>
																	);
																}
															}

														})}
													</SubMenu>
												</Menu>
											</Layout>
										</div>
									</Header>

									<Content style={{ margin: "8px", position: "relative", top: "-5px", height:"93.5%" }}>
										{
											this.multipleListClicked === true ? <div style={{display:'inline-block', width:'100%', height:'100%', background:'white'}}><Spin style={{ position:'relative', top:'50%', left:'50%' }} spinning={this.multipleListClicked}/></div> : <LocaleProvider locale={enUS}>
													<Provider store={store}>
														<Suspense fallback={null}>
														<Switch>
															<Route
																path={GlobalHelper.globlevar.contextpath + "GridWorkList"}
																component={state => (
																	<GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" returnToMenuId={this.returnToMenuId}/>
																)}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "application"}
																component={state => <IndividualFormTemplate widths={this.state.widths} themeCode={this.state.themeName} file={sourceFile} />}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "UIScreen"}
																component={state => (
																	<ErrorBoundary>
																		<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																	</ErrorBoundary>
																)}
															/>
															<Route
																path="UIScreen"
																component={state => (
																	<ErrorBoundary>
																		<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																	</ErrorBoundary>
																)}
															/>
															<Route
																path="MainLayout"
																component={state => (
																	<ErrorBoundary>
																		<UIScreen refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} />
																	</ErrorBoundary>
																)}
															/>
															<Route path={GlobalHelper.globlevar.contextpath + "UIScreen_screen"} component={state => <UIScreen_screen widths={this.state.widths} />} />
															<Route path={GlobalHelper.globlevar.contextpath + "UIScreen"} component={state => <UIScreen refreshQB={this.refreshQB} widths={this.state.widths} />} />
															<Route path={GlobalHelper.globlevar.contextpath + "Dashboard"} component={state => <DashboardContainer />} />
															<Route
																path={GlobalHelper.globlevar.contextpath + "dashboard"}
																component={state => <UIScreen_dashboard widths={this.state.widths} themeCode={this.state.themeName} />}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "IndividualForm"}
																component={state => <IndividualFormTemplate widths={this.state.widths} themeCode={this.state.themeName} file={sourceFile} />}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "MainLayout"}
																component={state => <GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName} returnToMenuId={this.props.outnames.returnToMenuId}/>}
															/>
															<Route
																path={GlobalHelper.globlevar.contextpath + "UserSelector"}
																component={state => <UserSelector userselectorindex={this.state.userselectorindex} />}
															/>
															<Route path="/" component={state => <GridWorkList refreshQB={this.refreshQB} widths={this.state.widths} themeCode={this.state.themeName}/>} returnToMenuId={this.props.outnames.returnToMenuId}/>
															<Route path={GlobalHelper.globlevar.contextpath + "MainLayout/index"} component={LoginForm} />

															<Route path="/*" render={() => <Redirect to={pathname} />} />
														</Switch>
														</Suspense>
													</Provider>
											</LocaleProvider>
										}
									</Content>
								</Content>
							</Layout>

							<ReactDrawer open={this.state.open} position={"left"} onClose={this.onDrawerClose} noOverlay={false}>
								<Sider trigger={null} collapsible collapsed={!this.state.collapsed} className={styles.sidersetting} id={styles.componentslayoutdemocustomtrigger}>
									<div className={styles.logobar} onClick={this.toggle}>
										<span>
											<FA name={menuFoldUnfold} stack="0.5x" className={styles.bar} />
										</span>
									</div>
									<Menu triggerSubMenuAction={this.browserMap.has("isIE") && this.browserMap.get("isIE") === true ? "click" : "hover"} onClick= {this.changeMultipleWorklist} theme="dark" mode="vertical" defaultSelectedKeys={["1"]} className={styles.sidersettingMenu}>
										{siderMenuToRender.map((post,index) => {
											var isdefaultactive = "no";

											if (post.activated == undefined) {
												if(GlobalHelper.activeMenuId==post.menuid){
												isdefaultactive = "yes";
											}
												else{
												isdefaultactive = "no";
												}
											} else {
												isdefaultactive = "yes";
											}
											var funcHotKey;

											if(GlobalHelper.HotKeyMap != null && GlobalHelper.HotKeyMap.get(post.menuid) != null){
												funcHotKey = GlobalHelper.HotKeyMap.get(post.menuid)['SZHOTKEYS'];
											}else{
												if(index<9)
												funcHotKey = 'ctrl+'+(index+1);
											}
											if(post['hotkey'] != null){
												post['hotkey'] = funcHotKey;
											}
											else{
												post['hotkey'] = funcHotKey;
											}
											Log4r.log("this.worklistData ", this.worklistData , post.payload)
												if(post.payload !== undefined && post.payload !== ""){
													Log4r.log("post.payload ", post.payload)
													if(post.payload.includes(",")){
														var arrPayload = post.payload.split(",")
														return(
															<SubMenu style={{width:'100%',display:'inline-block',position:'relative'}} aria-label={post.caption} className={this.setClassLeft(post.menuid,isdefaultactive)} title={<span><img src={post.image} style={{position:'absolute', fontSize: "11pt", left:(this.state.themeName==="myCompact" ? 17 : 19), height:((this.state.themeName==="myCompact" ? 14 : 18)) , top:(this.state.themeName==="myCompact" ? 13 : 10), color: 'white'}} /><span className={styles.multipleworklistMenu}>{post.caption}</span></span>}>
																{
																	arrPayload.map((item,index)=>{
																		Log4r.log("Menu Over....")
																		var listEnity = item.split(":")
																		Log4r.log("listEnity", listEnity);
																		indexmap.set(listEnity[0], (index+1));
																		itemMap.set(listEnity[0], post);
																		if(listEnity[0] === GlobalHelper.listEntityId)
																		{
																			rowsCount = this.state.rowsCount;
																		}
																		else{
																			if(GlobalHelper.multiworklistMap.has(listEnity[0]))
																			{
																			rowsCount = GlobalHelper.multiworklistMap.get(listEnity[0]);
																			}
																			else{
																				rowsCount = 0;
																			}
																		}
																		return(
																			<Menu.Item key={listEnity[0]}   >
																				<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={listEnity[1]}>
																				{listEnity[1]}
																			</Link>
																			</Menu.Item>
																		)
																	})
																}
															</SubMenu>
														 )

													}
												}

											let sampleStr = post.image;//"http://10.165.100.69/"+GlobalHelper.menuContext+"/$fontimage{fa fa-align-left iconCenter}";
											Log4r.log("SGSGgg////.......",sampleStr);
											if (sampleStr) {
												let cndIndx = sampleStr.indexOf("$fontimage{");
												if (cndIndx !== -1) {
													let first = sampleStr.indexOf("{",cndIndx);
													let last = sampleStr.indexOf("}",first+1);
													let icon = sampleStr.slice(first+1,last);
													 let ici = GlobalHelper.getFontIcon(icon);
													// let col = GlobalHelper.getFontColor(icon);
													Log4r.log("icon==",icon , ici);
													return (
														<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
															<Tooltip placement="right" title={<span>{post.caption}</span>}>
																<div className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
																	<FA name={ici} style={{ marginLeft: "0px", fontSize: 21, color: "white" }}
																	className={this.setClassLeftIcon(post.menuid, isdefaultactive)} />
																	<span className={this.OpFunction(this)}>
																		{post.caption}
																	</span>
																</div>
															</Tooltip>
														</Link>


													);
												}
												else {
													return (
														<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
														<Tooltip placement="right" title={<span>{post.caption}</span>}>
														<div className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>
														<img
														src={post.image}
														style={{ marginLeft: "0px", fontSize: 21, color: "white" }}
														className={this.setClassLeftIcon(post.menuid, isdefaultactive)}
														/>

														<span className={this.OpFunction(this)}>{post.caption}</span>

														</div>
														</Tooltip>
														</Link>


													);
												}
											}
											else {
													return (
														<Link style={{ color: "#c9d1d9" }} to={GlobalHelper.globlevar.contextpath + post.layouttype} aria-label={post.caption}>
														<Tooltip placement="right" title={<span>{post.caption}</span>}>
														<div className={this.setClassLeft(post.menuid, isdefaultactive)} onClick={() => this.MyFuncLeft(post)} style={{ marginTop: "1px" }}>

														<img
														src={post.image}
														style={{ marginLeft: "0px", fontSize: 21, color: "white" }}
														className={this.setClassLeftIcon(post.menuid, isdefaultactive)}
														/>
														<span className={this.OpFunction(this)}>{post.caption}</span>

														</div>
														</Tooltip>
														</Link>


													);
												}
										})}
									</Menu>
									<div className={styles.siderlogoindus}>
										<img src={"images/indus-logo.png"} />
									</div>
								</Sider>
												{/* <Tooltip placement="right" title={<span>Dialer Login</span>}>
<div aria-label="Dialer Login" onClick={(e)=>this.RenderDraggableBar(e,this.state.show)} className={this.setClassLeft("5", "no")}  style={{ marginTop: "1px",height:'52px',width:'49px',position: 'absolute',bottom:"33px",borderTop:'1px solid #5d6c81'}}>
<FA name="fas fa-bars" style={{ marginLeft: "0px", fontSize: (this.state.themeName==="myCompact" ? "16px" : "21px"), color: "white" }}
className={this.setClassLeftIcon("5", "no")} />
{this.state.showComponent ?
this.RenderLoginForm(fromJson) :
null
}
</div>
</Tooltip> */}
							</ReactDrawer>
						</Layout>
					</Router>
				);
			}
		}
	}

	clearWorklistData(){
		this.multipleListClicked = true;
		// this.forceUpdate();
		GlobalHelper.globlevar['sectionScroll']  = undefined;
		GlobalHelper.globlevar["closeButtonCall"] = false;
		GlobalHelper.globlevar['tabScreen'] = new Array();
		GlobalHelper.globlevar['tabKey'] = 1;
		GlobalHelper.globlevar['historyTimelineclicked'] = undefined;
		GlobalHelper.globlevar['label'] = undefined;
		GlobalHelper.globlevar['activetabKey'] = 1;
		GlobalHelper.globlevar['changeTitle'] = undefined;
		//GlobalHelper.globlevar["closeButtonCall"] = true;
		GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
		GlobalHelper.globlevar['callCustomEvent'] = undefined;
		GlobalHelper.globlevar.imagePreviewUrl = undefined;
		GlobalHelper.globlevar.splitProps = undefined;
		GlobalHelper.globlevar.zoomKey = 200;
		GlobalHelper.globlevar.slideIndex = 1;
		GlobalHelper.globlevar["SplitScreenMainLayout"] = false;
		GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
		GlobalHelper.globlevar["promptClicked"] = false;
		GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = undefined;
		GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] = undefined;
		GlobalHelper.globlevar['calculatedPkValuesForSave'] = undefined;
		GlobalHelper.globlevar['modalClosedClicked'] = undefined;
		GlobalHelper.globlevar['showDefaultFuncOnly'] = undefined;
		GlobalHelper.globlevar['promptClickedFunctionId'] = undefined;
		GlobalHelper['DefaultFunctionHeadername'] = undefined;
		GlobalHelper['DefaultFunctionformSubTitle'] = undefined;
		GlobalHelper.completeFilterXML = "";
		GlobalHelper.globlevar["myfunleftclicked"] = true;
		GlobalHelper.globlevar['historyHidden'] = false;	//Sprint 32 - To hide History Timeline Function Layout.
		// Log4r.log("the key is ",post);
		GlobalHelper.globlevar['ClipSearchRoot'] = "TableContainer";//Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
		GlobalHelper.globlevar['multiRecordViaClipsearch'] = false;

		GlobalHelper.globlevar["removeHeaderFlag"] = false;
		GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
		GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
		GlobalHelper.globlevar['summaryConfigType'] = undefined;
		GlobalHelper.globlevar['linkedFunctionId'] = undefined;
		GlobalHelper.globlevar['tableLinkRecord'] = null;
		GlobalHelper.globlevar['linkpress'] = false;
		GlobalHelper.globlevar['linkpressTemp'] = false;

		ErrorHandler.clearBulkErrJson();
	}

changeMultipleWorklist(post){

	this.clearWorklistData();

	// this.multipleListClicked = true;
	// this.forceUpdate();
	// GlobalHelper.globlevar['sectionScroll']  = undefined;
	// GlobalHelper.globlevar["closeButtonCall"] = false;
	// GlobalHelper.globlevar['tabScreen'] = new Array();
	// GlobalHelper.globlevar['tabKey'] = 1;
	// GlobalHelper.globlevar['historyTimelineclicked'] = undefined;
	// GlobalHelper.globlevar['label'] = undefined;
	// GlobalHelper.globlevar['activetabKey'] = 1;
	// GlobalHelper.globlevar['changeTitle'] = undefined;
	// //GlobalHelper.globlevar["closeButtonCall"] = true;
	// GlobalHelper.globlevar['setRefreshPropsOfTab'] = false;
	// GlobalHelper.globlevar['callCustomEvent'] = undefined;
	// GlobalHelper.globlevar.imagePreviewUrl = undefined;
 	// GlobalHelper.globlevar.splitProps = undefined;
  	// GlobalHelper.globlevar.zoomKey = 200;
	// GlobalHelper.globlevar.slideIndex = 1;
	// GlobalHelper.globlevar["SplitScreenMainLayout"] = false;
	// GlobalHelper.globlevar['promptworklistNextButtonDisable'] = false;
	// GlobalHelper.globlevar["promptClicked"] = false;
	// GlobalHelper.globlevar['summaryConfigTypeFunctionid'] = undefined;
	// GlobalHelper.globlevar['calculatedPkValuesForGridFetchData'] = undefined;
	// GlobalHelper.globlevar['calculatedPkValuesForSave'] = undefined;
	// GlobalHelper.globlevar['modalClosedClicked'] = undefined;
	// GlobalHelper.globlevar['showDefaultFuncOnly'] = undefined;
	// GlobalHelper.globlevar['promptClickedFunctionId'] = undefined;
	// GlobalHelper['DefaultFunctionHeadername'] = undefined;
	// GlobalHelper['DefaultFunctionformSubTitle'] = undefined;
	// GlobalHelper.completeFilterXML = "";
	// GlobalHelper.globlevar["myfunleftclicked"] = true;
	// GlobalHelper.globlevar['historyHidden'] = false;//Sprint 32 - To hide History Timeline Function Layout.
	// Log4r.log("the key is ",post);
	// GlobalHelper.globlevar['ClipSearchRoot'] = "TableContainer";//Sprint 30 - Task 43&45 - Navigation to previous screen instead of GridWorklist if Screen is closed which is opened using ClipSearch.
	// GlobalHelper.globlevar['multiRecordViaClipsearch'] = false;
	// ErrorHandler.clearBulkErrJson();
	if(post.key !== undefined){
		GlobalHelper.globlevar["LeftMenuClickedData"] = post;
	}
	// GlobalHelper.globlevar["removeHeaderFlag"] = false;
	GlobalHelper.defaultfunction = undefined;
	// GlobalHelper.globlevar['worklistSortLayoutDataSource'] = [];
	GlobalHelper.worklistSortFilterXml = "";
	// GlobalHelper.globlevar.hybridOneThirdCardsCount = [];
  	// GlobalHelper.globlevar['summaryConfigType'] = undefined;
	// GlobalHelper.globlevar['linkedFunctionId'] = undefined;
	// GlobalHelper.globlevar['tableLinkRecord'] = null;
	// GlobalHelper.globlevar['linkpress'] = false;
	// GlobalHelper.globlevar['linkpressTemp'] = false;
	let newObjectForWorklist={};
	newObjectForWorklist['listEntityId'] = post.key;
	Log4r.log("the itemMap is ",itemMap);
	 	ErrorHandler.clear();
		post = itemMap.get(post.key);
		Log4r.log("post from map is ",post);
		if(post == undefined){
			return;
		}

		left = post.menuid;
		activenessflag = "no";
		this.forceUpdate();

		Log4r.log("listEntityId is ",newObjectForWorklist['listEntityId']);
		newObjectForWorklist['url'] = post.menuurl;
		if (post.layouttype == "GridWorkList") {
				GlobalHelper.globlevar['menuFunctionFlag']=false;
			this.props.outnames.ScreenLayoutName = post.layouttype;
		}
		else {
				GlobalHelper.globlevar['menuFunctionFlag']=true;
		}
		/*Sprint 13 - Menu.json integration - store.dispatch call added for right menu call*/
		GlobalHelper["layouttypeGrid"] = post.layouttype;
		newObjectForWorklist['menuId'] = post.menuid;
		newObjectForWorklist['type'] = "MULTIPLEWORKLIST";
		GlobalHelper.globlevar['worklistDataClicked'] = newObjectForWorklist;
		redirectToList(GlobalHelper.globlevar.worklistDataClicked);
		if(post.layouttype !== "FunctionScreen"){
			GlobalHelper.globlevar['worklistDataClickedFunction'] = newObjectForWorklist;
			GlobalHelper.globlevar["worklistLeftMenuClickedData"] = GlobalHelper.globlevar["LeftMenuClickedData"];
		}

		//store.dispatch(GlobalHelper.globlevar.worklistDataClicked);

		//store.dispatch({type:'MULTIPLEWORKLIST',listEntityId,url,menuId});
	}

setWorklistCardClass(worklistindex)
      {
        if(workListOnOff.get("worklistDefault") === worklistindex)
        {
          return styles.customcard_chk;
        }
        else if(workListOnOff.get("worklistClick") === worklistindex)
        {
          return styles.customcard_chk;
        }
        else{
          return styles.customcard;
        }
      }
}

//export default MainLayout;

MainLayout.propTypes = {
	actions: PropTypes.object.isRequired,
	outnames: PropTypes.array.isRequired
};

function mapStateToProps(state, ownProps) {
	Log4r.log("mapStateToProps.state.names.MainLayout....", state.names , worklistRefresh);
	if(worklistRefresh === "refreshClicked"){
	   worklistRefresh = "fetchWorklistRefreshData";
	}

	//state.urlpath = state.names.LayoutName;
	//Log4r.log("this.state.urlpath..",state.urlpath);
	var url = "/" + state.names.ScreenLayoutName;
	Log4r.log("this.state.urlpath.URL...MainLayout...", url);

	let txt = "";
	txt += "<p>Total width/height: " + document.getElementById("root").width + "*" + document.getElementById("root").height + "</p>";
	txt += "<p>Available width/height: " + document.getElementById("root").availWidth + "*" + document.getElementById("root").availHeight + "</p>";
	txt += "<p>Color depth: " + document.getElementById("root").colorDepth + "</p>";
	txt += "<p>Color resolution: " + document.getElementById("root").pixelDepth + "</p>";

	Log4r.log("txt", document.getElementById("root").height);

	if (url !== "/undefined") {
		Log4r.log("after login success / error may redirect to url....MainLayout..", url);
		<Route render={({ history }) => history.push(url)} />;
	}

	GlobalHelper.globlevar['newStateMapped'] = true;
	return {
		outnames: state.names
	};
}



function mapDispatchToProps(dispatch) {
	Log4r.log("mapDispatchToProps..action...MainLayout....", action);
	return {
		actions: bindActionCreators(action, dispatch)
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainLayout);
