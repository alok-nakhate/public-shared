
/* Copyright (C) Indus Software Technologies Pvt. Ltd. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import React, { Component } from "react";
import {
	Modal,
	Button,
	Input,
	Popover,
	Layout,
	Divider,
	Avatar,
	Icon,
	Row,
	Card,
	Spin,
	Col,
	Select,
	Menu,
	Checkbox,
	Dropdown,
	Tooltip,
	message,Badge
} from "antd";
import TableContainer from "./TableContainer";
import {downloadFile} from '../../form/utils';
import ReactTemplateBuilder from "../../util/GetTemplateStructure.js";
import AddFilterComponent from "./AddFilterComponent";
import TableFilterComponent from "./TableFilterComponent.js";
import IndividualFormTemplate from "./IndividualFormTemplate";
//import tableColumns from './TableContainerColumns.json';
//import tableData from './TableContainerDataSource.json';
//import griddata from "./Worklist.json";
import Values from "./FilterMetaData";
import $ from "jquery";
import Validation from "../validation";
import ErrorHandler from "../../form/ErrorHandler";
import { Form } from "antd";
import { BrowserRouter,Switch, BrowserRouter as Router,Route,Link,Redirect,withRouter} from 'react-router-dom';
import GlobalHelper from "../GlobalHelper";
//import SecondLevelScreen from "../SecondLevelScreen";
import WorklistSortTable from './WorklistSortComponent'
//import advanceSearchSourceFile from'./IndividualFormTemplateData_Search.json';
//import filterSourceFile from'./IndividualFormTemplateData_Search.json';
import HotKeyComponent from '../../HotKeyComponent/HotKeyComponent';
//import GlobalHelper from '../../components/GlobalHelper';
//import griddata from './TestWorklist.json';
import {displayMessageBox} from '../../ModalComponent/ModalBox';
//import filterSourceFile from "./IndividualFormTemplateData_Filter.json";
import { ReactJsonBuilder } from "../../jsonconverter/jsonBuilder.js";
import store from "../../services/Store";
import * as action from '../../actions/action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import request from "superagent";
import { getSTData } from "../../services/CommonSecurity.js";
import Log4r from "../../util/Log4r";
import PopSearch from "../../form/components/widgets/popsearch/PopSearch.js";
import { parseNumbers } from "xml2js/lib/processors.js";

var parseString = require("xml2js").parseString;
var styles = require("./GridWorkListDefault.css");
var stylesf = require("../css/Foll1Default.css");
var advshare = require("./GridWorkListShare.css");
const FormItem = Form.Item;
//import styles from './GridWorkList.css';
//import SearchInput from 'react-search-input'
const FA = require("react-fontawesome");
const SubMenu = Menu.SubMenu;
const Search = Input.Search;
const Option = Select.Option;
const ButtonGroup = Button.Group;
const { Header, Sider, Footer, Content } = Layout;
const visible = true;
const visiblepop1 = true;
const visiblepop2 = true;

var originalDataSource = [];
var vardialogFile12 = false;
var vardialogFileState = "";
var headerTitle = "";
var openAdvanceSearchFlag = false;
var openWorklistSortFlag=false;
var openBulkFuncTrigger = false;
var tempwidthstate1="";
var tempwidthstate2="";
var worklistJsonMap = new Map();
var bulkFunId="";
var inputSearchColumn = [];
var advanceSearchColumn =[];
var inputSearchColumnMap = new Map();
var quickFilterColumnSelect = [];
var quickFilterColumn = [];

var advacneFilterColumn = [];
var sortedattributeId = [];
var advacneFilterColumnMap = new Map();
var advanceSearchSourceFile = "";
var contextKeyArray = [];
var contextKeyMap = new Map();
var searchPlacheHolder = "";



var tableDataMap = new Map();
var advanceAttrFilterXml = "";
var currentPage = "";
var currentPageMap = new Map();
var inputSearchFilterXmlInner = "";
var searchInputValue = "";
var searchFieldDataIndex = "";
var quickFilterValue = "";
var quickFilterXmlInner = "";
var quickFilterDataIndexValue = "";

var workListOnOff = new Map();

var selectedRowKeysArray = [];
let bulkFunFullJson = undefined;

let classNameMap = new Map();
let activeBulkFn = "";
let rowsCount = 0;
let unchangedData = [];
let flagnext = false;

function destroyAll() {
  Modal.destroyAll();
}

const { confirm } = Modal;

class GridWorkList extends Component {
	constructor(props) {
		super(props);
		//Log4r.log("Constructor of GridWorklist", JSON.parse(JSON.stringify(GlobalHelper.worklistData)));
		//Log4r.log("GlobalHelper.savedAdvanceSearchData..........",GlobalHelper.savedAdvanceSearchData);

		selectedRowKeysArray = [];
		this.quickFilterColumnMap = new Map();
		this.quickFilterRender = [];
		this.filterXML = "";
		this.onChangeFormData = "";
		this.quickFilterOnOff = new Map();
		this.refreshGridWorklist = this.refreshGridWorklist.bind(this);
		this.emitEmpty = this.emitEmpty.bind(this);
		this.worklistDataRetrive = this.worklistDataRetrive.bind(this);
		this.worklistDataRetrive(GlobalHelper.worklistData);
		this.advanceSearchLayoutKeyPress=this.advanceSearchLayoutKeyPress.bind(this);

		this.processWorklistColumn = this.processWorklistColumn.bind(this);
		this.inputFilterKeyPress = this.inputFilterKeyPress.bind(this);
		this.addLOVOptionsInInternalTableStructure = this.addLOVOptionsInInternalTableStructure.bind(this);
		this.travelDownInUISchema = this.travelDownInUISchema.bind(this);
		this.findAttributeJSONInWorklistColumnsJSON = this.findAttributeJSONInWorklistColumnsJSON.bind(this);
		this.closeAllGridWorklistLayouts = this.closeAllGridWorklistLayouts.bind(this);
		this.sendCheckValue = this.sendCheckValue.bind(this);
		GlobalHelper.globlevar['ScreenLayoutNameChk'] = false;
		this.showLoader=this.showLoader.bind(this);
		GlobalHelper.globlevar.onScreenLoadSpin=false;
		this.valuerefresh = React.createRef();
		this.processWorklistColumn(
			worklistJsonMap.get("tableColumns"),
			worklistJsonMap.get("tableData"),
			worklistJsonMap.get("userAdvFilter"),
			worklistJsonMap.get("userSortXML")
		);

		let scrollPagination = false;
		if(worklistJsonMap.get("paginationType") === "continuous"){
			scrollPagination = true;
		}

		this.state = {
			value: Values,
			searchedValue : "",
			data: "",
			themeName: this.props.themeCode,
			searchTerm: "",
			visible: false,
			visiblepop1: false,
			visiblepop2: false,
			widths: "89.5%",			
			//tableData:tableData,
			//tableColumns:tableColumns,

			tableData: worklistJsonMap.get("tableData"),
			tableColumns: worklistJsonMap.get("tableColumns"),
			internalTableStructure: worklistJsonMap.get(
				"internalTableStructure"
			),
			moreRows: worklistJsonMap.get("moreRows"),
			pageSize: worklistJsonMap.get("pageSize"),
			//isScrollPagination:worklistJsonMap.get("isScrollPagination"),
			isScrollPagination: scrollPagination,
			totalRows: worklistJsonMap.get("totalRows"),
			defaultWorkListId: worklistJsonMap.get("defaultWorkListId"),
			listEntityId: worklistJsonMap.get("listEntityId"),
			defISAtt: worklistJsonMap.get("defISAtt"),
			defQFAtt: worklistJsonMap.get("defQFAtt"),

			// tableData:griddata.entities[0].worklist.DataSource.rows,
			// tableColumns:griddata.entities[0].worklist.Columns,
			// internalTableStructure:griddata.entities[0].worklist.internalTableStructure,
			// moreRows:griddata.entities[0].worklist.DataSource.moreRows,
			// totalRows:griddata.entities[0].worklist.DataSource.totalRows,

			update: false,
			//keys_to_filter : "",
			keys_to_filter: worklistJsonMap.get("defISAtt"),
			quick_filter_keys: "",
			loadingPage: false,
			//searchFilterFlag: false,
			widthstate1: "0%",
			widthstate2: "100%",
			headerFlag: false,
			worklistSortFlag:false,
			newworklist: false,
			selectedValue: '', 
            isChecked: false,
			checkboxvalue:"",
			allcheck:false,	
			rowsCount: worklistJsonMap.get("totalRows"),
			defaultfilter:GlobalHelper.globlevar.defAdvFilter,
			//GlobalHelper.globlevar.worklistinfo.worklist[isQuickFilter]:"Y"
		};

		
		if (this.state.tableData !== undefined) {
			originalDataSource = JSON.parse(JSON.stringify(this.state.tableData));
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.advanceSearch = this.advanceSearch.bind(this);
		this.sortWorklist = this.sortWorklist.bind(this);
		this.tempobj = this.tempobj.bind(this);
		this.hide = this.hide.bind(this);
		this.openAdvanceSearch = this.openAdvanceSearch.bind(this);
		this.openWorklistSort = this.openWorklistSort.bind(this);
		this.closeLayout = this.closeLayout.bind(this);
		this.renderSearchFilterLayout = this.renderSearchFilterLayout.bind(this);
		this.renderGridWorkList = this.renderGridWorkList.bind(this);
		this.setTableData = this.setTableData.bind(this);
		this.handleSelectValueChange = this.handleSelectValueChange.bind(this);
		this.quickFilterSelectValueChange = this.quickFilterSelectValueChange.bind(this);
		this.handleMenuClick = this.handleMenuClick.bind(this);
		this.classChanger = this.classChanger.bind(this);
		this.inputSearch = this.inputSearch.bind(this);
		this.customData = this.customData.bind(this);
		this.renderQuickFilterLayout = this.renderQuickFilterLayout.bind(this);
		this.setButtonClass = this.setButtonClass.bind(this);
		searchPlacheHolder = inputSearchColumnMap.get(
			this.state.keys_to_filter
		);
		this.selectedRowKeyValues = this.selectedRowKeyValues.bind(this);
		this.closeAllGridLayouts = this.closeAllGridLayouts.bind(this);//Sprint 24 - To close Multiple Worklist Layout/Advance Search layout if Bulk Operation layout is opened.
		this.updateUnchangedData = this.updateUnchangedData.bind(this);

		this.showConfirm = this.showConfirm.bind(this);


		if (GlobalHelper.globlevar.multiworklist) {
			workListOnOff.clear();
			workListOnOff.set(
				"worklistDefault",
				GlobalHelper.globlevar.defaultworklistindex
			);
			GlobalHelper.globlevar.multiworklist = false;
		}
		this.closeLayout();
	}

	showConfirm(){

		let sortXml = ""
		let url = "/"+GlobalHelper.menuContext+"/secure/listAction.do?&_rt=fetchListEntityForReact&txtListEntityId=" + this.state.listEntityId + "&filterXML=" + encodeURIComponent( GlobalHelper.completeFilterXML ) + "&sortXML=" + sortXml + "&pageNo=1&recPerPage=" + this.state.pageSize + "&dataOnly=Y&ncludeFunctionRepo=N&downloadAsFile=Y";

		Log4r.log("Download Url : ",url);

		confirm({
		    	content: <div onClick={destroyAll} style={{display:'inline-block', position:'relative', bottom:'10px', fontWeight:'600', fontSize:'15px', width:'80%', fontFamily:'"Montserrat", sans-serif '}}>{"Want To Download The Worklist In Excel Sheet Format ? Max 5000 record can be downloaded"}</div>,
		    	onOk() {
						Log4r.log('OK');
						downloadFile(url,undefined);
					},
		    	onCancel() {
		      	Log4r.log('Cancel');
		    	},
		 	});
	}
	sendCheckValue(){
		Log4r.log("c12");
 /* if(checkboxvalue === false){
	return true
  }*/
		if(this.state.allcheck)
		{
			Log4r.log("checkboxclicked");
		  return true;
		}
		else
		{
			Log4r.log("checkboxnotclicked");
	
		  return false;
		}
		//return false
	}

	updateUnchangedData(data){
		unchangedData = data;
		this.setState({tableData:data});
	}

	worklistDataRetrive(fullworklistData) {
		try {
			if (fullworklistData.worklist !== undefined && (fullworklistData.worklist.isrowSequence !== undefined || fullworklistData.worklist.isrowSequence !== null )) {
				if(fullworklistData.worklist.title !== undefined) {
					if (fullworklistData.worklist.isrowSequence == "Y") {
						var jsonObj = {
							title: "Sr. No.",
							dataIndex: "seq",
							display: "true",
							datatype: "",
							edit: "",
							width: 20,
							align: "center"
						};

						if (fullworklistData.worklist.title != null) {
							jsonObj['title'] = fullworklistData.worklist.title;
						}
						if (fullworklistData.worklist.Columns[0].dataIndex !== "seq") {
							fullworklistData.worklist.Columns.unshift(jsonObj);
						}
					} else {
						fullworklistData.worklist.Columns;
					}
				}
			}
		} catch (e) {
			Log4r.error(e);
		}



		try {
			this.addLOVOptionsInInternalTableStructure(fullworklistData.worklist.internalTableStructure, fullworklistData.worklist.Columns);
			worklistJsonMap.set(
				"tableData",
				fullworklistData.worklist.DataSource.rows
			);
			worklistJsonMap.set(
				"tableColumns",
				fullworklistData.worklist.Columns
			);
			worklistJsonMap.set(
				"internalTableStructure",
				fullworklistData.worklist.internalTableStructure
			);
			worklistJsonMap.set(
				"moreRows",
				fullworklistData.worklist.DataSource.moreRows
			);
			worklistJsonMap.set(
				"pageSize",
				fullworklistData.worklist.pagesize
			);
			worklistJsonMap.set(
				"paginationType",
				fullworklistData.worklist.isPagination
			);
			worklistJsonMap.set(
				"totalRows",
				fullworklistData.worklist.DataSource.totalRows
			);
			worklistJsonMap.set(
				"defaultWorkListId",
				GlobalHelper.deffaultworkListId
			);
			worklistJsonMap.set(
				"listEntityId",
				fullworklistData.worklist.serviceEntityId
			);
			worklistJsonMap.set("defISAtt", fullworklistData.worklist.defISAtt);
			
			worklistJsonMap.set("defQFAtt", fullworklistData.worklist.defQFAtt);
			worklistJsonMap.set(
				"userAdvFilter",
				fullworklistData.worklist.userAdvFilter
			);
			worklistJsonMap.set("userSortXML",fullworklistData.worklist.userSortXML);
		} catch (error) {
			worklistJsonMap.set("tableData", undefined);
			worklistJsonMap.set("tableColumns", undefined);
			worklistJsonMap.set("internalTableStructure", undefined);
			worklistJsonMap.set("moreRows", undefined);
			worklistJsonMap.set("totalRows", undefined);
			worklistJsonMap.set(
				"defaultWorkListId",
				GlobalHelper.deffaultworkListId
			);
			worklistJsonMap.set("listEntityId", undefined);
			worklistJsonMap.set("defISAtt", undefined);
			worklistJsonMap.set("defQFAtt", undefined);
			worklistJsonMap.set("userAdvFilter", undefined);
			worklistJsonMap.set("userSortXML", undefined);
			Log4r.log("Workilist data not present...", error);
		}
	}

	refreshGridWorklist(){
	
		this.setState({ tableData : this.state.tableData});
	
	}

	emitEmpty(){

	    this.setState({ searchedValue: "" },()=> {
				Log4r.log('searchedValueemitEmtpy',this.state.searchedValue);
			});


	  }

	addLOVOptionsInInternalTableStructure(internalTableStructure, columnsJSON){
		if(internalTableStructure != null && columnsJSON != null && internalTableStructure.uiSchema != null && !internalTableStructure.uiSchema.LOVOptionsAdded){
			this.travelDownInUISchema(internalTableStructure.uiSchema, columnsJSON);
			internalTableStructure.uiSchema.LOVOptionsAdded = true;
		}
	}

	travelDownInUISchema(uiSchema, columnsJSON){
		if(uiSchema != null){
			if(uiSchema.xType == "field" && uiSchema.widget == "select" && uiSchema.fieldPath != null){
				uiSchema.options = this.findAttributeJSONInWorklistColumnsJSON(uiSchema.fieldPath, columnsJSON);
			}else if(Array.isArray(uiSchema)){
				for(var i = 0; i < uiSchema.length; i++){
					this.travelDownInUISchema(uiSchema[i], columnsJSON);
				}
			}else if(uiSchema.children != null){
				this.travelDownInUISchema(uiSchema.children, columnsJSON);
			}
		}
	}

	findAttributeJSONInWorklistColumnsJSON(attributeId, columnsJSON){
		if(columnsJSON != null){
			if(columnsJSON.attributeJson != null && columnsJSON.attributeJson.id == attributeId){
				var options = [];
				if(columnsJSON.attributeJson.queryid != null){
					for(var i = 0; i < columnsJSON.attributeJson.queryid.length; i++){
						var optionField = {};
						optionField.code = columnsJSON.attributeJson.queryid[i].id;
						optionField.description = columnsJSON.attributeJson.queryid[i].cap;
						optionField.icon = columnsJSON.attributeJson.queryid[i].icon;
						options.push(optionField);
					}
				}
				return options;
			}else if(Array.isArray(columnsJSON)){
				for(var i = 0; i < columnsJSON.length; i++){
					var options = this.findAttributeJSONInWorklistColumnsJSON(attributeId, columnsJSON[i]);
					if(options != null) return options;
				}
			}else if(columnsJSON.children != null){
				var options = this.findAttributeJSONInWorklistColumnsJSON(attributeId, columnsJSON.children);
				if(options != null) return options;
			}
		}
		return null;
	}

	processWorklistColumn(
		fullWorkListColumnJson,
		fullWorkListDataJson,
		userAdvFilterValue,
		userSortXML
	) {

		if(userAdvFilterValue !== undefined){
			GlobalHelper.fullWorkListColumnJson = fullWorkListColumnJson;
			GlobalHelper.fullWorkListDataJson = fullWorkListDataJson;
			GlobalHelper.userAdvFilterValue = userAdvFilterValue;	
		}
		else{
			
			fullWorkListColumnJson = GlobalHelper.fullWorkListColumnJson;
			fullWorkListDataJson = GlobalHelper.fullWorkListDataJson;
			userAdvFilterValue=[];
			//userAdvFilterValue = GlobalHelper.worklistData.worklist.UserAdvFilterMap;
			if (GlobalHelper.globlevar.UserAdvFilterMap !== undefined) {
				GlobalHelper.globlevar.objectLength = Object.entries(GlobalHelper.globlevar.UserAdvFilterMap);
				
				GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {
					let ak = Kitm[0].split("::");
					if(ak[1] != undefined) {
						let advfilterxml = Kitm[1];
						let advfilternameupdate = ak[1].split(":~:");
						let advfiltername = advfilternameupdate[0];
						let advfilterflag = advfilternameupdate[1];
						userAdvFilterValue.push(advfilterxml);
					}
				})
				userAdvFilterValue = userAdvFilterValue[0];
			}
	}

			
		Log4r.log("checkvalq",userAdvFilterValue);
		GlobalHelper.worklistSortFilterXml = userSortXML;
		contextKeyMap.clear(); //MULTIPLE WORKLIST Layout - clear 'contextKeyMap' to fetch data for only clicked row
		inputSearchColumn = [];
		advanceSearchColumn = [];
		//MULTIPLE WORKLIST Layout - clear to show only current worklist dropdown in filter search

		if (userAdvFilterValue) {
			let savedFilterData = "";
			if(GlobalHelper.globlevar['advsearchdataflag'] == false){
				parseString(userAdvFilterValue, function(err,result) {
					GlobalHelper.userAdvFilter = result;
					Log4r.log("xmlval123",GlobalHelper.userAdvFilter);
					if(result.filter.condition){
						Log4r.log("single condition filter......");
						GlobalHelper.savedAdvanceSearchData.clear();
						savedFilterData = result.filter.condition;
						savedFilterData.map((saveFilterColumn, i) => {

							if(saveFilterColumn.$.description != null && saveFilterColumn.$.description !== ""){
								let tempDataMap = new Map();
								tempDataMap.set('value',saveFilterColumn.$.value);
								tempDataMap.set('desc',saveFilterColumn.$.description)
								GlobalHelper.savedAdvanceSearchData.set(
									saveFilterColumn.$.attribute,
									tempDataMap
								);
								}else{
								GlobalHelper.savedAdvanceSearchData.set(
									saveFilterColumn.$.attribute,
									saveFilterColumn.$.value
								);
							}
						// GlobalHelper.savedAdvanceSearchData.set(
							// 	saveFilterColumn.$.attribute,
							// 	saveFilterColumn.$.value
							// );
						});
					}else{
						GlobalHelper.savedAdvanceSearchData.clear();
						Log4r.log("filter with multiple conditions........",result.filter);
						let advFilter = result.filter;
						let dateRangeMap = new Map();
						if(advFilter.filter){
							if(advFilter.filter.length != 0){
								if(advFilter.filter[0].condition){
									savedFilterData = advFilter.filter[0].condition;
									Log4r.log("savedFilterData.......",savedFilterData);
									savedFilterData.map((saveFilterColumn, i) => {
										if(saveFilterColumn.$.description != null && saveFilterColumn.$.description !== ""){
											let tempDataMap = new Map();
											tempDataMap.set('value',saveFilterColumn.$.value);
											tempDataMap.set('desc',saveFilterColumn.$.description)
											GlobalHelper.savedAdvanceSearchData.set(
												saveFilterColumn.$.attribute,
												tempDataMap
											);
											}
											else if(saveFilterColumn.$.operator === "greater-than-or-equals-date"){
												dateRangeMap.set(saveFilterColumn.$.operator,saveFilterColumn.$.value);
												GlobalHelper.savedAdvanceSearchData.set(
													saveFilterColumn.$.attribute,
													dateRangeMap
												);
											}
											else if(saveFilterColumn.$.operator === "less-than-or-equals-date"){
												dateRangeMap.set(saveFilterColumn.$.operator,saveFilterColumn.$.value);
												GlobalHelper.savedAdvanceSearchData.set(
													saveFilterColumn.$.attribute,
													dateRangeMap
												);
											}
											else{
											GlobalHelper.savedAdvanceSearchData.set(
												saveFilterColumn.$.attribute,
												saveFilterColumn.$.value
											);
										}
										// GlobalHelper.savedAdvanceSearchData.set(
										// 	saveFilterColumn.$.attribute,
										// 	saveFilterColumn.$.value
										// );
									});
								}
							}
						}
					}
				});
			}
		}

		if(userSortXML != null && userSortXML != ""){
			let tempDataRows = [];
			//Log4r.log("agdjhsadlksahd.........",userSortXML,GlobalHelper.globlevar['worklistSortLayoutDataSource']);
			parseString(userSortXML, function(err,result) {
				//Log4r.log("hskjdsakjdh........",result);
				if(result != null && result.sort != null){
					if(result.sort.condition != null && result.sort.condition.length > 0){
						result.sort.condition.map((sortXMLConditionObj,index)=>{
							if(sortXMLConditionObj != null && sortXMLConditionObj.$ != null){
								let tempObj = {};
								tempObj["key"] = index+1;
								tempObj["columnname"] = sortXMLConditionObj.$.attribute;
								tempObj["sortorder"] = sortXMLConditionObj.$.operator;
								tempDataRows.push(tempObj);
							}
						})
					}
				}
			});
			//Log4r.log("jkhdkjsahdkjsa......",tempDataRows);
			if(tempDataRows != null && tempDataRows.length>0){
				GlobalHelper.globlevar['worklistSortLayoutDataSource'] = tempDataRows;
			}
		}

		var col = [],
			counter = 0;
		var cpkvalue = "";
		var cpkValueArray = new Array();

		try {
			quickFilterColumnSelect = [];
			this.quickFilterColumnMap = new Map();
			quickFilterColumn = [];
			fullWorkListColumnJson.map((user, i) => {
				var inputSearchObj = {};


				if(user['children'] !== undefined){
					for(var arr=0;arr<user['children'].length;arr++){
							if(user['children'][arr].inputSrch == "true"){
								inputSearchObj=[];
								inputSearchObj["dataIndex"] = user['children'][arr].dataIndex;
								inputSearchObj["title"] = user['children'][arr].title;
								inputSearchObj["ipFltrOptr"] = user['children'][arr].ipFltrOptr;
								inputSearchColumn.push(inputSearchObj);
							}
					}
				}
				if (user.inputSrch === "true" || user.inputSrch === "TRUE") {
					inputSearchObj["dataIndex"] = user.dataIndex;
					inputSearchObj["title"] = user.title;
					inputSearchObj["ipFltrOptr"] = user.ipFltrOptr;
					inputSearchColumnMap.set(user.dataIndex, user.title);
					if (inputSearchColumn.length < inputSearchColumnMap.size) {
						inputSearchColumn.push(inputSearchObj);
					}
				}
				Log4r.log("sjjshhhhhssh",user);
				Log4r.log(!user.children,"fsdsdd",user.children);
				if (!user.children) {
					if (user.quickFltr === "true" || user.quickFltr === "TRUE") {
						var quickFilterObj = {};
						quickFilterObj["dataIndex"] = user.dataIndex;
						quickFilterObj["title"] = user.title;

						this.quickFilterColumnMap.set(
							user.dataIndex,
							user.attributeJson
						);
						if (quickFilterColumn.length < this.quickFilterColumnMap.size) {
							Log4r.log("quick filter model-- ",user.attributeJson.queryid);
							quickFilterColumn.push(user.attributeJson.queryid);
							quickFilterColumnSelect.push(quickFilterObj);
							if(user.attributeJson.queryid != null){
								user.attributeJson.queryid.map((item,index)=>{
								this.quickFilterRender.push(item);
								});
							}
						}
					}
				}
				else {
					for (var w = 0; w < user.children.length; w++) {
						Log4r.log(user.children[w].title,"lijdddd",user.children[w].quickFltr);
						if (user.children[w].quickFltr === "true" || user.children[w].quickFltr === "TRUE") {
							var quickFilterObj = {};
							quickFilterObj["dataIndex"] = user.children[w].dataIndex;
							quickFilterObj["title"] = user.children[w].title;

							this.quickFilterColumnMap.set(
								user.children[w].dataIndex,
								user.children[w].attributeJson
							);
							if (quickFilterColumn.length < this.quickFilterColumnMap.size) {
								Log4r.log("quick filter model-- ",user.children[w].attributeJson.queryid);
								quickFilterColumn.push(user.children[w].attributeJson.queryid);
								quickFilterColumnSelect.push(quickFilterObj);
								if(user.children[w].attributeJson.queryid != null){
									user.children[w].attributeJson.queryid.map((item,index)=>{
										this.quickFilterRender.push(item);
									});
								}
							}
						}
					}
				}
				if(user['children'] !== undefined){
					for(var arr=0;arr<user['children'].length;arr++){
							if(user['children'][arr].advFltr == "true"){
									advanceSearchColumn.push(user['children'][arr]);
							}
					}
				}
				if (user.advFltr === "true" || user.advFltr === "TRUE") {
					var tempIndex = user.dataIndex;
					advacneFilterColumnMap.set(user.dataIndex, user.title);
					if (advacneFilterColumn.includes(tempIndex) === false) {
						//Log4r.log("order, dataIndex-- ",user.advFltrOrder,user.dataIndex);
						advacneFilterColumn[user.advFltrOrder] =
							user.dataIndex + "," + user.title;

					}

					advanceSearchColumn.push(user);
			}
				if (
					user.contexKeys !== undefined &&
					user.contexKeys !== "" &&
					user.contexKeys !== null &&
					user.contexKeys !== "null"
				) {
					contextKeyMap.set(user.dataIndex, user.contexKeys);
				}
				if (user.display != "false") {
					col[counter] = user;
					counter++;
				}
			});
		} catch (e) {
			Log4r.log("error.. ",e);
		}
		advanceSearchColumn.map((columnValue,columnIndex) => {		// NOSONAR: javascript:S2201
			sortedattributeId[columnValue.advFltrOrder]=
				columnValue.dataIndex + "," + columnValue.title;
		});

		worklistJsonMap.set("tableColumns", col);
		GlobalHelper.contextKeyHashMap = contextKeyMap;
		advacneFilterColumn.splice(0, 1);
		// Log4r.log("inputSearchColumn Value -- ",inputSearchColumn);
		// Log4r.log("quickFilterColumnMap Value -- ",quickFilterColumnMap);
		// Log4r.log("quickFilterColumn -- ",quickFilterColumn);
		// Log4r.log("advacneFilterColumn Value -- ",advacneFilterColumn);
		// Log4r.log("contextKeyHashMap Value -- ",GlobalHelper.contextKeyHashMap);

		/*Below code added for Advance Search Layout*/
		var schemaObjFinal = {};

		var formDataObjOuter = {};
		advacneFilterColumn.map((columnValue, i) => {		// NOSONAR: javascript:S2201
			var key = columnValue.substring(0, columnValue.indexOf(","));
			var value = columnValue.substring(
				columnValue.indexOf(",") + 1,
				columnValue.length
			);

			var schemaObj = {};

			var uiSchemaObj = {};
			var uiSchemaObjInner = {};

			var formDataObj = {};
			var formDataObjInner = {};

			schemaObj["placeholder"] = value;
			schemaObj["title"] = "";
			schemaObj["validation"] = "";
			schemaObjFinal[key] = schemaObj;

			uiSchemaObj["xType"] = "col";
			uiSchemaObj["span"] = 6;
			uiSchemaObjInner["xType"] = "field";
			uiSchemaObjInner["widget"] = "text";
			uiSchemaObjInner["fieldPath"] = key;
			uiSchemaObj["children"] = uiSchemaObjInner;

			formDataObj["data"] = GlobalHelper.savedAdvanceSearchData.get(key);
			formDataObjInner["classname"] = "inputBox";
			formDataObjInner["onError"] = "onError";
			formDataObj["style"] = formDataObjInner;
			formDataObjOuter[key] = formDataObj;

		});

	}

	classChanger(page, pageSize) {
		Log4r.log("Parametres in Worklist Pagination : ", page, pageSize, GlobalHelper.worklistPageNo );
		Log4r.log("Filter XML in Worklist Pagination : ", this.filterXML);

		if(page !== undefined){
			GlobalHelper.worklistPageNo.set("current", page);
		}

		this.nextPageData({
			pageSize: pageSize,
			page: page,
			dataOnly: "Y",
			filterXML: this.filterXML,
			sortXML: GlobalHelper.worklistSortFilterXml
		});

	}

	nextPageData = (params = {}) => {
		let resultJson = "";
		let allownextPage = "";
		Log4r.log("params value-- ", params);

		if (GlobalHelper.workListDataMap.get(params.page) !== "" && GlobalHelper.workListDataMap.get(params.page) !== undefined ) {
			this.forceUpdate();
		} else {
			this.setState({ loadingPage: true });
			let url = "/"+GlobalHelper.menuContext+"/secure/listAction.do?";
			let postUrlData  = url.split("?")[1];
			let _stdata = getSTData("/"+GlobalHelper.menuContext+"/", postUrlData);
			request
				.get(url)
				.query({
					_SID_: (_stdata.SID + _stdata.SINT)
				})
				.query({ _rt: "fetchListEntityForReact" })
				.query({ txtListEntityId: this.state.listEntityId })
				.query({ filterXML: GlobalHelper.completeFilterXML })
				.query({ sortXML: GlobalHelper.worklistSortFilterXml })
				.query({ pageNo: params.page })
				.query({ recPerPage: params.pageSize })
				.query({ dataOnly: params.dataOnly })
				.query({ includeFunctionRepo:"N"})
				.end((err, res) => {
					if (err) {
						Log4r.log("Error from ajax call-- ", err);
					} else {
						Log4r.log("Result from ajax call-- ", res);
						var xmlDoc = $.parseXML(res.text);
						var $xml = $(xmlDoc);
						var $title = $xml.find("success");
						var jsonText = $title.text();
						var jsonTxt = jsonText;
						Log4r.log("GridWorkList JSON retrived data", jsonTxt);
						GlobalHelper.globlevar['sortworklistbutnspin']=false;
						const jsonObj = JSON.parse(jsonTxt);
						Log4r.log(
							"GridWorkList JSON retrived Object data ",
							jsonObj
						);

						//Sprint 14 -entities[0] to entities[1] chnages - due to multiple worklist configuration on 190 server
						//the fefault worklist data is coming in entities[1]
						if(jsonObj !== null && jsonObj.entities !== undefined && jsonObj.entities[0] !== null){
							if(jsonObj.entities[0].worklist != null && jsonObj.entities[0].worklist.DataSource != null){
								if(jsonObj.entities[0].worklist.DataSource.rows != null){
									resultJson = jsonObj.entities[0].worklist.DataSource.rows;
									if(resultJson !== undefined){
										GlobalHelper.globlevar['workListData'] = GlobalHelper.worklistData;
										GlobalHelper.worklistData.worklist.DataSource.rows = resultJson;
										allownextPage = jsonObj.entities[0].worklist.DataSource.moreRows;
										flagnext = allownextPage;
									}
								}
							}
						}
						if (params.page == undefined) {
								unchangedData = [];
								GlobalHelper.workListDataMap.clear();
								if(resultJson !== null && resultJson !== undefined && resultJson !== ""){
									Log4r.log("result json,,,,,,",resultJson);
									resultJson.map((userData, i) => {
										unchangedData.push(userData);
									});
								}else{
									Log4r.log("No data from server..........");
									displayMessageBox("No Data","No data from server. Search again....","W")
								}
						 }

							GlobalHelper.workListDataMap.clear();
							GlobalHelper.worklistPageNo.set("current",1);
							GlobalHelper.currentPageWithCurretRecords.set(1, unchangedData);
							GlobalHelper.workListDataMap.set(1,unchangedData);
							GlobalHelper.globlevar.onScreenLoadSpin=false;
							this.setState({
								loadingPage: false,
								tableData: unchangedData,
								moreRows: allownextPage
							},()=>{
									Log4r.log("grid worklist table data.......",this.state.tableData);
							})
							
					}
					
				});
		}
		resultJson = "";
		allownextPage = "";

	};

	handleSelectValueChange(value) {
		Log4r.log("Selected Value in InputSearch -- ", value);
		searchInputValue = value;
		searchPlacheHolder = inputSearchColumnMap.get(value);
		this.setState({
			keys_to_filter: value
		}),
			() => {
				Log4r.log("Select Value has been set ");
			};
	}


	quickFilterSelectValueChange(value) {
		Log4r.log("Quick filter selected value -- ", value);
		//quickFilterOnOff.clear();
		quickFilterDataIndexValue = value.key;
		if (value !== undefined) {
			var testMap = this.quickFilterColumnMap.get(value.key);
			this.quickFilterRender = testMap.queryid;
		} else {
			this.quickFilterRender = [];
		}
		this.setState({
			quick_filter_keys: value.key,
			defQFAtt:""
			},()=>{Log4r.log("Value Set",this.state.quick_filter_keys, this.state.defQFAtt);});
		this.renderQuickFilterLayout();
	}

	setTableData() {
		this.setState(
			{					
				tableData: this.state.tableData,
				
			},
			() => {
				Log4r.log(
					"Data Has been changed...from setTableData-----",
					JSON.stringify(this.state.tableData)
				);
			}
		);
	}

	advanceSearch(label, searchFieldArr) {
		Log4r.log("COMMING FIELD JSON ......", label, searchFieldArr);
		this.onChangeFormData = searchFieldArr;
		this.filterXML = this.filterXMlCreation(
			null,
			null,
			this.onChangeFormData,
			null,
			null,
			null
		);
		Log4r.log("filterXML during advance search-- ", this.filterXML);
		this.nextPageData({
			dataOnly: "Y",
			//pageSize: 20,
			//page: 1,
			filterXML: this.filterXML,
			sortXML: GlobalHelper.worklistSortFilterXml
		});
	}

	sortWorklist(label,sortDataArr){
		//Log4r.log("hkdhaskdks.....",label,sortDataArr);
		//Log4r.log("hbsakjdhsakjd........",GlobalHelper.worklistSortFilterXml);
		this.nextPageData({
			dataOnly: "Y",
			//pageSize: 20,
			//page: 1,
			filterXML:this.filterXML,
			sortXML:GlobalHelper.worklistSortFilterXml
		});
	}

	customData(formDataValue) {
		Log4r.log("customData method-- ", formDataValue);
		this.onChangeFormData = formDataValue;
	}

	OnchangecloseIcon = (e) => {
		Log4r.log('typedValue', e.target.value);
		this.setState({ searchedValue: e.target.value });

	}

	inputSearch(inputValue, searchFieldKey) {
		Log4r.log(
			"field & dataIndex during Input Search ......",
			inputValue,
			searchFieldKey
		);
	
		this.showLoader();
		GlobalHelper['reSetTotalRecords'] = true;
		GlobalHelper.worklistPageNo.set("current", 1);
		GlobalHelper.inputSearchDataIndex = inputValue;
		searchInputValue = GlobalHelper.inputSearchDataIndex;
		searchFieldDataIndex = searchFieldKey;
		var inputsearchoperator = "";
		inputSearchColumn.map((item, index) => {		// NOSONAR: javascript:S2201
			if (item.ipFltrOptr != "" && item.dataIndex == searchFieldKey) {
				inputsearchoperator = item.ipFltrOptr;
			} else {
				inputsearchoperator = "like";
			}
		});
		Log4r.log("jhdslksjflkjdslf........",this.onChangeFormData,"sdssfsf.....",quickFilterDataIndexValue,quickFilterValue);
		//Sprint 38 - Task 40 - Issue- L60-586 - Legal and legal wait list - Filters are not working.
		if(quickFilterDataIndexValue != null && quickFilterDataIndexValue != "" && quickFilterValue != null && quickFilterValue == "" && quickFilterValue != ""){
			this.filterXML = this.filterXMlCreation(
				searchInputValue,
				searchFieldDataIndex,
				this.onChangeFormData,
				quickFilterDataIndexValue,
				quickFilterValue,
				inputsearchoperator
			);
		}else{
			this.filterXML = this.filterXMlCreation(
				searchInputValue,
				searchFieldDataIndex,
				this.onChangeFormData,
				null,
				null,
				inputsearchoperator
			);
		}//END - Sprint 38 - Task 40 - Issue- L60-586 - Legal and legal wait list - Filters are not working.
		Log4r.log("filterXML during input search-- ", this.filterXML);
		this.nextPageData({
			dataOnly: "Y",
			filterXML: this.filterXML,
			sortXML: GlobalHelper.worklistSortFilterXml
		});
	}

	advancefilterXMlCreation(advanceSearchLayoutData){
		if(	advanceSearchLayoutData != "" &&
				advanceSearchLayoutData != null &&
				advanceSearchLayoutData != undefined){
					let layoutData =  advanceSearchLayoutData;
					var advSearchAtrrFilterXmll = "";

					for(var i in layoutData){
						if(isNaN(parseInt(i))) {
							continue;
						}
						layoutData = layoutData[i];
						if(layoutData !== undefined && layoutData !== null && layoutData !== ""){

							for(var Key in layoutData){

								layoutData = layoutData[Key];
								var conditionXmll = "";

									for(var k=0;k<layoutData.length;k++){
											for (var attr in layoutData[k]) {
														var attrID = attr;
														Log4r.log("obj......",layoutData[k][attr]);
														var  attrValue = layoutData[k][attr].value;
													  var	attrOperator = layoutData[k][attr].operator;
														var attrDescription = "";
														if(layoutData[k][attr].desc != null){
															attrDescription = layoutData[k][attr].desc;
														}
														var dateArr;
														var dateAttrOperator=[];
													if (layoutData[k][attr].ctype === "date" && layoutData[k][attr].operator === "inrange") {
														try {
															dateAttrOperator[0] = "greater-than-or-equals-date";
															dateAttrOperator[1] = "less-than-or-equals-date";
															if (attrValue instanceof Array){
																dateArr = attrValue[0].split('-');
															}else{
																dateArr = attrValue.split('-');
															}

																for (let i = 0; i < dateArr.length; i++) {
																	conditionXmll =
																		conditionXmll +
																		'<condition attribute="' +
																				attrID			+
																		'" extdata="" funccode="" operator="' +
																						dateAttrOperator[i]	+
																		'"  datatype="string" value="' +
																							dateArr[i]			+
																		'" description="' +
																							attrDescription			+
																		'" default="" defaultdesc="" cmpfld="N" caption="" fid="" conditionid="" pfid="" code="" sclfunc=""/>';
																			advSearchAtrrFilterXmll = conditionXmll;
																}
														} catch (e) {Log4r.error(e);}
													}else{
														conditionXmll =
															conditionXmll +
															'<condition attribute="' +
															 		attrID			+
															'" extdata="" funccode="" operator="' +
															 				attrOperator	+
															'"  datatype="string" value="' +
															 					attrValue			+
															'" description="' +
															 					attrDescription			+
															'" default="" defaultdesc="" cmpfld="N" caption="" fid="" conditionid="" pfid="" code="" sclfunc=""/>';
																advSearchAtrrFilterXmll = conditionXmll;
													}


											}
										}
							}
						}
					}
			}
			if(advSearchAtrrFilterXmll)
			{
				advanceAttrFilterXml =
					'<filter type="AND">'
					+	advSearchAtrrFilterXmll +
					'</filter>';
		
			}else{
				advanceAttrFilterXml =
					'<filter type="AND">'
					+	'' +
					'</filter>';
					GlobalHelper.advanceAttrFilterXml=false;
			}

			Log4r.log("<advanceAttrFilterXml in creation method-- >", advanceAttrFilterXml);

			return advanceAttrFilterXml;

	}

		filterXMlCreation(
			searchInputValue,
			searchFieldDataIndex,
			onChangeFormData,
			quickFilterDataIndexValue,
			quickFilterValue,
			inputsearchoperator
		) {
			Log4r.log(
				"filterXML Creation Method---- ",
				searchInputValue,
				searchFieldDataIndex,
				onChangeFormData,
				quickFilterDataIndexValue,
				quickFilterValue,
				inputsearchoperator
			);
			if (
				searchFieldDataIndex != "" &&
				searchFieldDataIndex != null &&
				searchFieldDataIndex != undefined
			) {
				if (
					searchInputValue != "" &&
					searchInputValue != null &&
					searchInputValue != undefined
				) {
					var inconditionXml = "";
					inconditionXml =
						inconditionXml +
						"<condition attribute='" +
						searchFieldDataIndex +
						"' extdata='' funccode='' operator='" +
						inputsearchoperator +
						"' datatype='string' value='" +
						searchInputValue +
						"' description='' default='' defaultdesc='' cmpfld='N' caption='' fid='' conditionid='' pfid='' code='' sclfunc=''/>";
					inputSearchFilterXmlInner =  "<filter type='AND'>" + inconditionXml + "</filter>";
				} else {
					inputSearchFilterXmlInner = "";
				}
			} else {
				inputSearchFilterXmlInner = "";
			}

			if (
				quickFilterDataIndexValue != "" &&
				quickFilterDataIndexValue != null &&
				quickFilterDataIndexValue != undefined
			) {
				if (
					quickFilterValue != "" &&
					quickFilterValue != null &&
					quickFilterValue != undefined
				) {
					var quconditionXml = "";
					quconditionXml =
						quconditionXml +
						"<condition attribute='" +
						quickFilterDataIndexValue +
						"' extdata='' funccode='' operator='" +
						inputsearchoperator +
						"' datatype='string' value='" +
						quickFilterValue +
						"' description='' default='' defaultdesc='' cmpfld='N' caption='' fid='' conditionid='' pfid='' code='' sclfunc=''/>";
					quickFilterXmlInner =  "<filter type='AND'>" + quconditionXml + "</filter>";
				} else {
					quickFilterXmlInner = "";
				}
			} else {
				quickFilterXmlInner = "";
			}

		GlobalHelper.advSearchFilterXml = this.advancefilterXMlCreation(this.onChangeFormData)+GlobalHelper.queryBuilderXML;//Sprint 22 - common Filter Xml creation for Query Builder Component and Advance search layout.
		GlobalHelper.inputSearchFilterXml = inputSearchFilterXmlInner;
		GlobalHelper.quickFilterXml = quickFilterXmlInner;

		if (
			(GlobalHelper.advSearchFilterXml == "" ||
				GlobalHelper.advSearchFilterXml == null ||
				GlobalHelper.advSearchFilterXml == undefined) &&
			(GlobalHelper.inputSearchFilterXml == "" ||
				GlobalHelper.inputSearchFilterXml == null ||
				GlobalHelper.inputSearchFilterXml == undefined) &&
			(GlobalHelper.quickFilterXml == "" ||
				GlobalHelper.quickFilterXml == null ||
				GlobalHelper.quickFilterXml == undefined)
		) {
			this.filterXML = "";
		} else if (
			(GlobalHelper.advSearchFilterXml != "" &&
				GlobalHelper.advSearchFilterXml != null &&
				GlobalHelper.advSearchFilterXml != undefined) ||
			(GlobalHelper.inputSearchFilterXml != "" &&
				GlobalHelper.inputSearchFilterXml != null &&
				GlobalHelper.inputSearchFilterXml != undefined) ||
			(GlobalHelper.quickFilterXml != "" &&
				GlobalHelper.quickFilterXml != null &&
				GlobalHelper.quickFilterXml != undefined)
		) {
			this.filterXML =
				"<filter type='AND'>" +
				GlobalHelper.advSearchFilterXml +
				"" +
				GlobalHelper.inputSearchFilterXml +
				"" +
				GlobalHelper.quickFilterXml +
				"</filter>";
		}

		Log4r.log("FilterXML in creation method-- ", this.filterXML);
		//GlobalHelper.completeFilterXML = this.filterXML;
		// GlobalHelper.completeFilterXML = quickFilterValue;

		if(this.filterXML !== null || this.filterXML !== undefined || this.filterXML !==""){
			GlobalHelper.completeFilterXML = this.filterXML;
		  }
	   else if(quickFilterValue !== null || quickFilterValue !== undefined || quickFilterValue !== ""){
		    GlobalHelper.completeFilterXML = quickFilterValue;
	      }

		return GlobalHelper.completeFilterXML;
	}

	closeLayout() {
		openAdvanceSearchFlag = false;
		openWorklistSortFlag=false;
		Log4r.log("filterXML during closed layout-- ", this.filterXML);
		classNameMap.clear();
		GlobalHelper.globlevar['advanceSearchFlag'] = "false";
		GlobalHelper.globlevar['worklistSortFlag'] = "false";
		GlobalHelper.queryBuilderObjJson = "";
		GlobalHelper.queryBuilderFormatData = "";

		this.setState(
			{
				widths: window.innerWidth - 232,
				//searchFilterFlag:false,
				widthstate1: "0%",
				widthstate2: "100%",
			},
			() => Log4r.log("GTT WIDTH AFTER closeLayout", this.state.widths)
		);
		Log4r.log("closeLayout width---- ", this.state.widths);
	}

//Sprint 24 - To close Multiple Worklist Layout/Advance Search layout if Bulk Operation layout is opened.
	closeAllGridLayouts(){
		if(openAdvanceSearchFlag == true || openWorklistSortFlag == true){
			openAdvanceSearchFlag=false;
			openWorklistSortFlag=false;
			classNameMap.clear();
			GlobalHelper.globlevar['advanceSearchFlag'] = "false";
			GlobalHelper.globlevar['worklistSortFlag'] = "false";
			GlobalHelper.queryBuilderObjJson = "";
			GlobalHelper.queryBuilderFormatData = "";
			this.setState({f2:true},()=>{Log4r.log("callback......")});
		}
	}

	closeAllGridWorklistLayouts(){
		Log4r.log("here...",$('#closeAdvanceSearchLayout'));
		$('#closeAdvanceSearchLayout').click();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			(navigator.userAgent.match(/Chrome/i) ||
				navigator.userAgent.match(/Mobile/i)) &&
			!navigator.userAgent.match(/Edge/i)
		) {
			Log4r.log("ONLY CHROME !");
			if(this.props.themeCode === "myCompact"){
				//$("[class*=thirdDivbutton1]").css("top", "-24px");
				//$("[class*=thirdDivbutton2]").css("top", "-24px");
			} else {
				$("[class*=thirdDivbutton1]").css("top", "-27px");
				$("[class*=thirdDivbutton2]").css("top", "-27px");
			}
			$("[class*=addFilterDiv]").css("cssText", "top:-1px !important");
		}
		if (navigator.userAgent.match(/Firefox/i)) {
			$("[class*=addFilterDiv]").css("cssText", "top:-15px !important");
		}
		Log4r.log(
			"BUTTON LENGTH",
			$("[class*=thirdDivTab] > div > div > button").length
		);

		var lastButton =
			$("[class*=thirdDivTab] > div > div > button").length - 1;
		var lastButtonPosition;
		$("[class*=thirdDivTab]").width(
			$("[class*=myLayout]").width() -
				$("[class*=firstDivTab]").width() -
				$("[class*=secondDivTab]").width() -
				72
		);
		$("[class*=displayButtons]").width(
			$("[class*=thirdDivTab]").width() - $("[class*=downloadButtonWrapper]").width() - 52
		);
		for (var i = 0; i < $("[class*=thirdDivTab] > div > div").length; i++) {
			if (i === $("[class*=thirdDivTab] > div > div").length - 1) {
				var tempvar = $(
					$("[class*=thirdDivTab] > div > div > button")[lastButton]
				).offset();
				if (tempvar != undefined) {
					lastButtonPosition = $(
						$("[class*=thirdDivTab] > div > div > button")[
							lastButton
						]
					).offset().top;
				}
				Log4r.log("LAST BUTTON POSITION", lastButtonPosition);
			}
		}
		if (lastButtonPosition > 100) {
			var rightPosition;
			var leftPosition;
			rightPosition =
				$("[class*=displayButtons]").width() -
				($(
					$("[class*=thirdDivTab] > div > div > button")[lastButton]
				).position().left +
					$(
						$("[class*=thirdDivTab] > div > div > button")[
							lastButton
						]
					).outerWidth());
			Log4r.log(
				"BUTTON RIGHT POSITION",
				$(
					$("[class*=thirdDivTab] > div > div > button")[lastButton]
				).position().left
			);
			leftPosition = $(
				$("[class*=thirdDivTab] > div > div > button")[0]
			).position().left;
			Log4r.log("BUTTON LEFT POSITION", leftPosition);
			if (leftPosition <= 0) {
				$("[class*=HiddenDivRight]").css("display", "block");
				$("[class*=rightScrollButton]").css("display", "block");
			}if (leftPosition == 0) {
				$("[class*=leftScrollButton]").css("display", "none");
			}
			$("[class*=displayButtons]").scroll(function() {
				var tempRight = $("[class*=thirdDivTab] > div > div > button")[
					lastButton
				];
				if (tempRight != undefined) {
					rightPosition =
						$("[class*=displayButtons]").width() -
						($(
							$("[class*=thirdDivTab] > div > div > button")[
								lastButton
							]
						).position().left +
							$(
								$("[class*=thirdDivTab] > div > div > button")[
									lastButton
								]
							).outerWidth());
				}
				if (
					$(
						$("[class*=thirdDivTab] > div > div > button")[0]
					).position() != undefined
				) {
					leftPosition = $(
						$("[class*=thirdDivTab] > div > div > button")[0]
					).position().left;
				}
				if (
					rightPosition >= -0.45299999999997453 ||
					rightPosition == 0
				) {
					$("[class*=HiddenDivRight]").css("display", "none");
					$("[class*=rightScrollButton]").css("display", "none");
					$("[class*=HiddenDivLeft]").css("display", "block");
					$("[class*=leftScrollButton]").css("display", "block");
				} else if (leftPosition >= 18) {
					$("[class*=HiddenDivRight]").css("display", "block");
					$("[class*=rightScrollButton]").css("display", "block");
					$("[class*=HiddenDivLeft]").css("display", "none");
					$("[class*=leftScrollButton]").css("display", "none");
				} else if (rightPosition < -0 && leftPosition < -0) {
					$("[class*=HiddenDivRight]").css("display", "block");
					$("[class*=rightScrollButton]").css("display", "block");
					$("[class*=HiddenDivLeft]").css("display", "block");
					$("[class*=leftScrollButton]").css("display", "block");
				}
			});

			$("[class*=displayButtons]").width(
				$("[class*=thirdDivTab]").width() - $("[class*=downloadButtonWrapper]").width() - 52
			);
			$("[class*=displayButtons]").css({
				overflowX: "scroll",
				overflowY: "hidden",
				whiteSpace: "nowrap",
				marginLeft: "20px"
			});
		}

		if ($("[class*=thirdDivTab] > div > div > button").length == 0) {
			$("[class*=HiddenDivRight]").css("display", "none");
			$("[class*=rightScrollButton]").css("display", "none");
			$("[class*=HiddenDivLeft]").css("display", "none");
			$("[class*=leftScrollButton]").css("display", "none");
		}

		$("[class*=leftScrollButton]").click(function(e) {
			Log4r.log("LEFT CLICKED");
			$("[class*=displayButtons]").animate({ scrollLeft: "-=50px" });
			e.stopImmediatePropagation();
      		e.preventDefault();
		});

		$("[class*=rightScrollButton]").click(function(e) {
			Log4r.log("RIGHT CLICKED");
			$("[class*=displayButtons]").animate({ scrollLeft: "+=50px" });
			e.stopImmediatePropagation();
      		e.preventDefault();
		});

		if (window.event) {
			$("[class*=displayButtons]").on("mousewheel", function(event) {
				Log4r.log("CALLING ON WHEEL");
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
			Log4r.log("MOZZILA");
			$("[class*=displayButtons]").on("DOMMouseScroll", function(event) {
				if (event.originalEvent.detail < 0) {
					$(this).scrollLeft($(this).scrollLeft() + 10);
				}
				if (event.originalEvent.detail > 0) {
					$(this).scrollLeft($(this).scrollLeft() - 10);
				}
				event.preventDefault();
			});
		}


		//  if(openAdvanceSearchFlag == true){
		// 	$("#firstDivbuttonGroup").css('marginLeft','2px');//Sprint 24 - To change left margin of firstDivbuttonGroup
		// }

	}

	componentWillReceiveProps(nextProps) {
	if (nextProps.themeCode !== this.props.themeCode) {
			Log4r.log(
				"Props changed in GridWorkList.js from " +
					this.props.themeCode +
					" to " +
					nextProps.themeCode
			);

			if (this.props.themeCode == "myDefault") {
				this.setState({ themeName: nextProps.themeCode });
			} else if (this.props.themeCode == "myDark") {
				this.setState({ themeName: nextProps.themeCode });
			} else if (this.props.themeCode == "myRed") {
				this.setState({ themeName: nextProps.themeCode });
			}
		} else {
			Log4r.log("inside else of GridWorkList");
		}
	}
	
	componentDidMount() {
		this.valuerefresh.current = this.childComponent;
		this.setState(
			{
				widths: this.props.widths
			},
			() => {
				Log4r.log("the temp has been set as true inside callback ");
			}
		);
	}

	handleSubmit(data, value) {
		Log4r.log("first:-- ", data);
		Log4r.log("second:-- ", this.state.value);
		if (data != "") {
			this.state.value.push({ imagesrc: data });
			this.setState({ value: value });
		}
		this.setState({
			visible: false,
			visiblepop1: false,
			visiblepop2: false
		});
	}

	hide = () => {
		this.setState({
			visible: false,
			visiblepop1: false,
			visiblepop2: false
			//searchButton:false,
			//filterButton:false,
		});
	};

	handleVisibleChange = visible => {
		this.setState({ visible });
	};

	handleVisibleChangepop1 = visiblepop1 => {
		this.setState({ visiblepop1 });
	};

	handleVisibleChangepop2 = visiblepop2 => {
		this.setState({ visiblepop2 });
	};

	tempobj(datavalue) {
		//this.title = datavalue;
		this.imagesrc = datavalue;
	}

	openAdvanceSearch = () => {
		//vardialogFileState=require('./IndividualFormTemplateData_Search.json');
		headerTitle = "ADVANCE SEARCH";
		openAdvanceSearchFlag = true;
		openWorklistSortFlag = false;
		classNameMap.clear();
		GlobalHelper.globlevar['advanceSearchFlag'] = "true";
		GlobalHelper.globlevar['worklistSortFlag'] = "false";
		GlobalHelper.globlevar['multiWorklistLayoutFlag'] = "false";//Sprint 24 - To close Advance Search Layout / Multi Worklist layout if bulk operation layout is opened.
		GlobalHelper.globlevar['openLayoutinGridWorklist'] = false;//Sprint 24 - To close Advance Search Layout / Multi Worklist layout if bulk operation layout is opened.

		this.setState({
			widthstate1: "25%",
			widthstate2: "74%",
			widths: window.innerWidth - 142
		}),
			() => {
				Log4r.log("the temp has been set as true inside callback ");
			};
	};

	openWorklistSort = () =>{
		headerTitle = "WORKLIST SORT";
		openWorklistSortFlag = true;
		openAdvanceSearchFlag = false;
		classNameMap.clear();
		GlobalHelper.globlevar['sortworklistbutnspin'] = false;
		GlobalHelper.globlevar['worklistSortFlag'] = "true";
		GlobalHelper.globlevar['advanceSearchFlag'] = "false";
		GlobalHelper.globlevar['multiWorklistLayoutFlag'] = "false";
		GlobalHelper.globlevar['openLayoutinGridWorklist'] = false;
		

		this.setState({
			worklistSortFlag:true,
			widthstate1: "25%",
			widthstate2: "74%",
			widths: window.innerWidth - 142
		}),
			() => {
				Log4r.log("the temp has been set as true inside callback...");
			};
	};

	handleClick(quickFilter) {
		let filterxml =quickFilter;
		((GlobalHelper.globlevar.UserAdvFilterMap !== false && GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === "N") || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === null || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === undefined || GlobalHelper.globlevar.UserAdvFilterMap === "" || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === "")
		{
		console.log("drop",filterxml);
		this.setState({
			checkboxvalue:filterxml,
		    inputValue: filterxml, 
			defaultfilter:filterxml
		})
		var userAdvFilterValue=[];
		GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {
		let ak = Kitm[0].split("::");
		if(ak[1] != undefined) {
			let useradvfilterid = ak[0];
			let newadvfiltername = ak[1];
			let advfilternameupdate = newadvfiltername.split(":~:");
			let advfiltername = advfilternameupdate[0];
			let advfilterflag = advfilternameupdate[1];
	 
			if(advfiltername === filterxml ){
			  userAdvFilterValue = Kitm[1]; 
				 this.setState({
				 checkboxfilterid : useradvfilterid,
				 checkboxfiltername:advfiltername
				 })
			}
		}
	   })
	}


		Log4r.log("what is quickFilterValue---- ", quickFilter);

		if (this.quickFilterOnOff.has(quickFilter)) {
			if (this.quickFilterOnOff.get(quickFilter) === 1) {
				this.quickFilterOnOff.set(quickFilter, 0);
				quickFilterValue = "";
				
			} else {
				this.quickFilterOnOff.clear();
				this.quickFilterOnOff.set(quickFilter, 1);
				quickFilterValue = quickFilter;
			
			}
		} else {
			this.quickFilterOnOff.clear();
			this.quickFilterOnOff.set(quickFilter, 1);
			quickFilterValue = quickFilter;
		}
		quickFilterValue = userAdvFilterValue;
		Log4r.log("loadval",quickFilterValue);

		this.filterXML = this.filterXMlCreation(
			null,
			null,
			this.onChangeFormData,
			quickFilterDataIndexValue,
			quickFilter,
			"like"
		);
		this.nextPageData({
			dataOnly: "Y",
			filterXML: quickFilterValue,
			sortXML: GlobalHelper.worklistSortFilterXml
		});
	}

	setButtonClass(buttonClickId) {
		if (this.quickFilterOnOff.get(buttonClickId) === 1) {
			return styles.thirdDivbutton2;
		} else {
			return styles.thirdDivbutton1;
		}
	}

	handleChange(event) {
		this.setState({ data: event.target.value });
	}
	handleCheckbox(event){
		this.setState({
			inputValue:''
		})
 var checkvalue = this.state.checkboxvalue;
if(checkvalue !== ""){
	this.setState({
		allcheck:true
	})
 var checkboxfilterid = this.state.checkboxfilterid;
  var checkboxfiltername = this.state.checkboxfiltername

 store.dispatch({
	 type: 'ADVANCESEARCH',
	  checkvalue:checkvalue,
	  checkboxfilterid: checkboxfilterid,
	  checkboxfiltername: checkboxfiltername
	 });
	}
	else{
		this.setState({
			allcheck:false
		})
}
	}

	createComponent(val, i) {
		if(val.cap !== null && val.id !== null && val.icon !== null ){
			let col = undefined;
			let ici = undefined;
			ici = GlobalHelper.getFontIcon(val.icon);
			col = GlobalHelper.getFontColor(val.icon);
			var imgpath = window.location.origin;
			
		
			return (			
								
				<TableFilterComponent
					id={val.id}
					title={val.cap}
					count={val.count}
					fontName={ici}
					fontColor={col}
					countColor={val.countColor}
					handleClick={this.handleClick}
					setButtonClass={this.setButtonClass}				
					themeCode={this.props.themeCode}
					advanceSearchOnLoadFilterXML={worklistJsonMap.get("userAdvFilter")}
					closeAllGridWorklistLayouts={this.closeAllGridWorklistLayouts}
					closeAllGridLayouts = {this.closeAllGridLayouts}//Sprint 24 - To close Multiple Worklist Layout/Advance Search layout if Bulk Operation layout is opened.
				
					/>				
					
					);
			
					}
	}



	handleMenuClick(e) {
		this.setState({
			keys_to_filter: e.key
		}),
			() => {
				Log4r.log("Select Value has been set ");
			};
	}

	onChangeUserName = e => {
		this.setState({ searchTerm: e.target.value });
	};

	getQuickFn2(FuncJsn, i) {
		return (
			<Avatar shape="square" className={styles.avatarColor}>
				<FA
					style={{ fontSize: "12pt", position: "relative", left: 1 }}
					name={FuncJsn.icon}
				/>
			</Avatar>
		);
	}
	getQuickFn(FuncJsn, i) {
		return FuncJsn.content.map(this.getQuickFn2.bind(this));
	}

	/*function to change rows count in Avtar for selected worklist on page scroll*/
	handleToUpdateRowCount = newData => {
		Log4r.log(
			"inside gridworklist updating row count for multiworklist layout....",
			newData.length
		);
		this.setState({tableData:newData});//Sprint 24 - Issue fixed - to set data after on scroll ajax  call in Table Container (worklist).
	};

	showLoader()
	{	
		GlobalHelper.globlevar.onScreenLoadSpin = true;
		this.forceUpdate();
	}

	 renderSearchFilterLayout() {

		var FuncJsn = GlobalHelper.bulkFunMap;
		Log4r.log(FuncJsn.formHeaderBookmarks);
		if(openWorklistSortFlag){

			return(
				<Layout
					className={styles.innerMainLayoutFull}
					style={{
						float: "left",
						height: window.innerHeight - 56,
						background: "white"
					}}
				>
				<Header className={styles.innerHeader}>
					<a className={styles.headerName}>{headerTitle}</a>
					<Button
						className={styles.anchorTag}
						id='closeWorklistSortLayout'
						onClick={this.closeLayout}
						aria-label="Close Worklist Sort Layout"
					>
						<FA name={"times"}> </FA>
					</Button>
				</Header>
				<Content style={{overflow:"hidden",height:"auto",padding:"8px"}}>
					{this.state.worklistSortFlag ? (
						<WorklistSortTable
							themeCode={this.state.themeName}
							customData={this.customData}
							sortWorklist={this.sortWorklist}
							setTableData={this.setTableData}
							headerTitle={headerTitle}
							refreshGridWorklist={this.refreshGridWorklist}
							onLoadSortXMl={worklistJsonMap.get("userSortXML")}
							{...this.props}
						/>
					) : null}
				</Content>
			</Layout>)
		}else if(openAdvanceSearchFlag){
				Log4r.log(
					"what is the value coming-- ",
					JSON.stringify(advanceSearchSourceFile)
				);
				store.dispatch({
					type: 'USERLIST',

					});
				var orderedAdvanceSearchColumn = [];
				Log4r.log('AdvanceResponse',advanceSearchColumn);
				sortedattributeId.map((columnValue,i) =>{		// NOSONAR: javascript:S2201
				var attrId = columnValue.substring(0, columnValue.indexOf(","));
				for(var index =0;index<advanceSearchColumn.length;index++){
					if(attrId ==advanceSearchColumn[index].attributeJson.id ){
							orderedAdvanceSearchColumn.push(advanceSearchColumn[index]);
					}
				}
			})
			var controlsTemplate=undefined;
			var sectionArray;
			if (orderedAdvanceSearchColumn.length !== 0) {
			var controlsTemplate = new ReactTemplateBuilder("Advance Search Fields");
			orderedAdvanceSearchColumn.map((post,ll) =>{			// NOSONAR: javascript:S2201
					controlsTemplate.addControls(post,"");
				})
			}

			var queryBuilderTemplate = new ReactTemplateBuilder("");
			queryBuilderTemplate.addQueryBuilder("","querymst","Define More Filters");

			if (controlsTemplate !== undefined) {
				controlsTemplate.screendata.push(queryBuilderTemplate.screendata[0]);
			  sectionArray  = JSON.stringify(controlsTemplate.screendata);
			}else {
				 sectionArray = JSON.stringify(queryBuilderTemplate.screendata);
			}
			let completeSection ="{\"name\":{\"LayoutName\":\"#\",\"LayoutHeader\":\"\",\"screendata\":"+ sectionArray +",\"ButtonPalette\":[{\"schema\":[{\"btn1\":{\"title\":\"\"},\"btn2\":{\"title\":\"\"},\"btn3\":{\"title\":\"\"},\"btn4\":{\"title\":\"\"}}],\"uiSchema\":[{\"xType\":\"grid\",\"children\":[{\"xType\":\"col\",\"span\":6,\"children\":{\"xType\":\"field\",\"widget\":\"button\",\"fieldPath\":\"btn1\"}},{\"xType\":\"col\",\"span\":6,\"children\":{\"xType\":\"field\",\"widget\":\"button\",\"fieldPath\":\"btn2\"}},{\"xType\":\"col\",\"span\":6,\"children\":{\"xType\":\"field\",\"widget\":\"button\",\"fieldPath\":\"btn3\"}},{\"xType\":\"col\",\"span\":6,\"children\":{\"xType\":\"field\",\"widget\":\"button\",\"fieldPath\":\"btn4\"}}]}],\"formData\":[{\"btn1\":{\"style\":{\"type\":\"default\",\"size\":\"large\",\"label\":\"SAVE\",\"classname\":\"paletteClassSave\",\"icon\":\"floppy-o\"}},\"btn2\":{\"style\":{\"type\":\"default\",\"size\":\"large\",\"label\":\"REFRESH\",\"classname\":\"paletteClassRefresh\",\"icon\":\"refresh\"}},\"btn3\":{\"style\":{\"type\":\"primary\",\"size\":\"large\",\"label\":\"SEARCH\",\"classname\":\"paletteClassSearch\",\"classname2\":\"paletteClassSave2\",\"icon\":\"search\"}},\"btn4\":{\"style\":{\"type\":\"primary\",\"size\":\"large\",\"label\":\"CLEAR\",\"classname\":\"paletteClassSearch\",\"icon\":\"clear\"}}}]}]}}";
			let advanceSearchSource =  JSON.parse(completeSection);
			Log4r.log('FullConvertesJson',advanceSearchSource);
			Log4r.log("GlobalHelper.savedAdvanceSearchData.....",GlobalHelper.savedAdvanceSearchData);
			if(advanceSearchSource != null && GlobalHelper.savedAdvanceSearchData != null){
				advanceSearchSource.name.screendata.map((item,index)=>{		// NOSONAR: javascript:S2201
					if(item != null && item.formData[0] != null){
						Object.keys(item.formData[0]).map((key,length)=>{			// NOSONAR: javascript:S2201
							if(key != null && item.formData[0][key] != null && item.formData[0][key].data != null && GlobalHelper.savedAdvanceSearchData.has(key)){
								Log4r.log("key ....",key,typeof(GlobalHelper.savedAdvanceSearchData.get(key)));
								if(GlobalHelper.savedAdvanceSearchData.get(key) instanceof Map){
									Log4r.log("data.....",GlobalHelper.savedAdvanceSearchData.get(key));
									let dateRangeVar = undefined;
									try {
										let fromDate = GlobalHelper.savedAdvanceSearchData.get(key).get('greater-than-or-equals-date');
										let toDate = GlobalHelper.savedAdvanceSearchData.get(key).get('less-than-or-equals-date');
										if (fromDate !== undefined && toDate !== undefined) {
											dateRangeVar = `${fromDate}-${toDate}`;
											item.formData[0][key].data[0] = dateRangeVar;
										}else{
											item.formData[0][key].data[0] = GlobalHelper.savedAdvanceSearchData.get(key).get('value');
											item.formData[0][key]['desc'] = new Array(GlobalHelper.savedAdvanceSearchData.get(key).get('desc'));
										}
									} catch (e) {Log4r.error(e);}
								}else{
									Log4r.log("data1234",GlobalHelper.savedAdvanceSearchData.get(key));
									item.formData[0][key].data[0] = GlobalHelper.savedAdvanceSearchData.get(key);
								}
							}
						})
					}
				})
			}
				return (
					<Layout
						id="innerMainLayoutFullAdvanseSearch"
						className={styles.innerMainLayoutFull}
						style={{
							float: "left",
							height: window.innerHeight - 56,
							background: "white"
						}}
					>
						<Header className={styles.innerHeader}>
							<a className={styles.headerName}>{headerTitle}</a>
							<Button
							    className={styles.anchorTag}
								id='closeAdvanceSearchLayout'
								onClick={this.closeLayout}
								aria-label="Close Advance Search Layout"
							>
								<FA name={"times"}> </FA>
							</Button>
						</Header>
						<IndividualFormTemplate refreshQB={this.props.refreshQB}
							themeCode={this.state.themeName}
							customData={this.customData}
							advanceSearch={this.advanceSearch}
							advancefilterXMlCreation={this.advancefilterXMlCreation}
							setTableData={this.setTableData}
							headerTitle={headerTitle}
							file={advanceSearchSource}
							renderSearchFilterLayout={this.renderSearchFilterLayout}
							renderGridWorkList={this.renderGridWorkList}
							refreshGridWorklist={this.refreshGridWorklist}
							processWorklistColumn={this.processWorklistColumn}
							advanceSearchOnLoadFilterXML={GlobalHelper.userAdvFilter}
							style={{
								overflow: "auto",
								height: window.innerHeight - 57
							}}
							
/>
					</Layout>
				);
			}
			/*else if(this.state.searchFilterFlag){
              Log4r.log("what is searchFilterFlag the value coming-- ",this.state.searchFilterFlag);
              tempwidthstate1="25%";
              tempwidthstate2="74%";
              return(  <Layout className={styles.innerMainLayout} style={{width:tempwidthstate1,float:'left', height:window.innerHeight-57,background:'white'}}>
                    <Header className={styles.innerHeader}>
                    <a className={styles.headerName}>{headerTitle}</a>
                    <a className={styles.anchorTag} id='closeAdvanceSearchLayout' onClick={this.closeLayout} ><FA  name={"times"} > </FA></a>
                    </Header>
                    <IndividualFormTemplate advanceSearchOnLoadFilterXML={GlobalHelper.userAdvFilter} refreshQB={this.props.refreshQB} themeCode={this.state.themeName} customData={this.customData} advanceSearch={this.advanceSearch}
                    file = {vardialogFileState} style={{overflow:'auto'}}>
                    </IndividualFormTemplate>
                </Layout>
              )
            }*/
	}

	rerender() {
		this.setState({});
	}

	renderQuickFilterLayout() {
				
		Log4r.log("this.quickFilterRender value-- ",this.quickFilterRender);
		if ( this.quickFilterRender !== "" && this.quickFilterRender !== null && this.quickFilterRender !== undefined && ( this.state.defQFAtt === "" || this.state.defQFAtt === null || this.state.defQFAtt === undefined ) ) {
			try{
			//quickFilterDataIndexValue = this.state.defQFAtt;
			
			return this.quickFilterRender.map(
				(this.createComponent = this.createComponent.bind(this)),
								
			);
			}
			catch(e){Log4r.error(e); return null;}
			
		} else if ( this.state.defQFAtt !== "" && this.state.defQFAtt !== null && this.state.defQFAtt !== undefined ) {
			
			quickFilterDataIndexValue = this.state.defQFAtt;
			var testMap = this.quickFilterColumnMap.get(this.state.defQFAtt);
			if (testMap !== undefined && testMap !== "" && testMap !== null) {

			try
				{
					return testMap.queryid.map(
						(this.createComponent = this.createComponent.bind(this)),
						
					);
				}
				catch(e){ Log4r.log(e);					
					return null;
				}
			} else {
				return null;
			}
		} else {
			return null;
		}
		
	}
	

	selectedRowKeyValues(selectedRowKeys,gridData) {
		selectedRowKeysArray = selectedRowKeys;
		Log4r.log("selectedRowKeysArray in Grid-- ", selectedRowKeysArray);
		if (
			selectedRowKeysArray !== undefined &&
			selectedRowKeysArray.length > 0
		) {
			var cpkvalue = "";
			var cplvalue = "";
			var contextvalue = "";
			var allocationuser = "";
			//var cpkValueArray = "";
			var contextKeyValuePair = new Array();
			GlobalHelper.globlevar['selectedList'] = new Array();
			selectedRowKeysArray.map((selectedKey, tempi) => {
				Log4r.log(
					"selected record data---- ",
					gridData[selectedKey]
				);
				GlobalHelper.globlevar['selectedList'].push(gridData[selectedKey]);
				var recordTemp = gridData[selectedKey];
				let is_utavailable = false;
				var _listEntityId = this.state.listEntityId;
				GlobalHelper.listEntityId = _listEntityId;

				var cpkValueArray = new Array();
				GlobalHelper.contextKeyHashMap.forEach(function(value, key) {
					var tempdata = value.split(",");
					tempdata.map((tempnew, tempi) => {
						cpkValueArray.push(tempnew);
						if(recordTemp != null){
							if(recordTemp[key] !== null && recordTemp[key] !== undefined ) {
				          if(tempnew == "_ut") {
							          Log4r.log("checkedd....");
							          is_utavailable = true;
							     }
									 contextKeyValuePair.push(tempnew+"="+recordTemp[key])
				         } else {
		                // if _cpk configur from secondlevelscreen.
										if(key != null && recordTemp.internalTableData[0].formData[0][key] != null){
											if(recordTemp.internalTableData[0].formData[0][key].data != null){
												contextKeyValuePair.push(tempnew+"="+ recordTemp.internalTableData[0].formData[0][key].data)//Sprint 24 - Issue fixed for row selection on worklist.
				              				}
										}
										else
										{
											contextKeyValuePair.push(tempnew+"=")
											Log4r.log("tempnew id not configur" , tempnew)
										}
									}
						 }

						/*contextKeyValuePair.push(
							tempnew + "=" + recordTemp[key]
						);*/
					});
				});

				if(!is_utavailable)
				{
				      contextKeyValuePair.push("_ut=ALLOCATED_USER");
				}
				contextKeyValuePair.push("transactionrequest=Y");
				cpkvalue = "__cpk=" + cpkValueArray.join("|") + "|_ut";
				cplvalue = "__cpl=" + cpkValueArray.length;
				allocationuser = allocationuser;

				//contextvalue = contextKeyValuePair.join("&");
			});

			contextvalue = contextKeyValuePair.join("&");
			GlobalHelper.contextPrimaryKey = cpkvalue;
			GlobalHelper.contextPKValues = contextvalue;
			GlobalHelper.contextPrimaryKeyLength =
			allocationuser + "&__cpl=" + selectedRowKeysArray.length;

		} else {

		}
	}
	

	renderGridWorkList() {
               //   var inputvaluedemo = this.state.inputValue;
				//  Log4r.log("inputvalue1",inputvaluedemo);
				//	var defaultvalue = this.state.defaultfilter;
	
		if(this.state.tableData !== undefined){
			try {
				unchangedData = JSON.parse(JSON.stringify(this.state.tableData));

				unchangedData.map((item,index)=>{
					item['seq']=index+1;
				})
			} catch (e) {
				Log4r.error("error",e)
			}
		}
		if (GlobalHelper.globlevar.UserAdvFilterMap !== undefined) {
			GlobalHelper.globlevar.objectLength = Object.entries(GlobalHelper.globlevar.UserAdvFilterMap);
		}

		const {searchedValue,defaultfilter} = this.state;
		
		const suffix = searchedValue?<FA className ={styles.closeIcon} style={{paddingBottom:'10px'}} name="fas fa-times-circle" onClick={this.emitEmpty} /> : <FA name="" />;
		const selectAfter = (
			<Select
				className={styles.dropdownnew}
				defaultValue={this.state.defISAtt}
				onChange={this.handleSelectValueChange}
				aria-label = "Account No/Customer No/Name dropdown"
			>
				{inputSearchColumn.map((item, index) => {
					return (
						<Option aria-label={item.title} value={item.dataIndex} key={index}>
							{item.title}
							
						</Option>
					);
				})}
			</Select>
			 
		);

		var buttonClassProp1;
		var buttonClassProp2;
		var firstDivbutton1Prop;
		var clsaaProp;

		if (openWorklistSortFlag) {
			clsaaProp = styles.myLayoutSF;
			buttonClassProp1 = styles.firstDivTab;
			buttonClassProp2 = styles.secondDivTab;
			firstDivbutton1Prop = styles.firstDivbutton1;
		}  else if (openAdvanceSearchFlag) {
			clsaaProp = styles.myLayoutSF;
			buttonClassProp1 = styles.firstDivTab;
			buttonClassProp2 = styles.secondDivTab;
			firstDivbutton1Prop = styles.firstDivbutton1;
		} else {
			clsaaProp = styles.myLayoutFull;
			buttonClassProp1 = styles.firstDivTab_chk;
			buttonClassProp2 = styles.secondDivTab_chk;
			firstDivbutton1Prop = styles.firstDivbutton1_chk;
		}
		var imgpath = window.location.origin;
		try {
			if(typeof(isWorklistFilterBarRequired)==='function'){
			var obj = window && window.isWorklistFilterBarRequired();
			}
		} catch (e) {Log4r.error(e);}
		let listOfArray=undefined;
		if (obj && obj.listId.length !== 0) {
			listOfArray = obj.listId.filter(itm=> itm === GlobalHelper.globlevar["worklistName"]);
		}
		//GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"]= null;
		Log4r.log("imgpathcontextroot path ", imgpath);
		Log4r.log("GlobalHelper.globlevar[LeftMenuClickedData] :",GlobalHelper.globlevar["LeftMenuClickedData"]);
		return (
				((GlobalHelper.globlevar["LeftMenuClickedData"].layouttype !== "CustomScreen" &&  GlobalHelper.globlevar["LeftMenuClickedData"].layouttype !== "FunctionScreen") && (GlobalHelper.globlevar["LeftMenuClickedData"].layoutType !== "CustomScreen" &&  GlobalHelper.globlevar["LeftMenuClickedData"].layoutType !== "FunctionScreen") ) ?

			(<Layout
				className={clsaaProp}
				style={{
					borderBottom: "1px solid #B4C6D4 !important",
					height:
						this.props.themeCode === "myCompact"
							? window.innerHeight - 50
							: window.innerHeight - 53,
					float: "right"
				}}
			>
			{(obj && obj.isBarHidden === true && listOfArray.length > 0) ? "": <Header className={styles.fullTableLayout}>
					<div className={buttonClassProp1}>
						<ButtonGroup
							id="firstDivbuttonGroup"
							className={styles.firstDivbuttonGroup}
							style={{ position: "fixed" }}
						>
							<Popover
								content={"Advance Search"}
								placement="bottom"
								trigger="hover"
							>
								{" "}
								<Badge count={ JSON.stringify(GlobalHelper.userAdvFilter) && JSON.stringify(GlobalHelper.userAdvFilter).includes("condition") ? <FA name="filter" style={{color:'#FFFFFF',borderRadius: '50%', backgroundColor :'red',border: '1px solid white', padding: '3px'}} /> : null}
								>
								<Button
									id='AdvanceSearchLayoutButton_Open'
									type=""
									className={firstDivbutton1Prop}
									onClick={this.openAdvanceSearch}
									aria-label = "Advance Search"
									//aria-label = {styles.firstDivbuttonGroup}
								>
									<FA
										className={styles.firstDivIcons}
										name="search-plus"
									/>
								</Button>{" "}
								 </Badge>
							</Popover>

							<Popover
								content={"Worklist Sort"}
								placement="bottom"
								trigger="hover"
							>
								{" "}
								<Button
									id='WorklistSortingLayoutButton_Open'
									type=""
									className={firstDivbutton1Prop}
									onClick={this.openWorklistSort}
									//aria-label = {firstDivbutton1Prop}
									aria-label = "Worklist Sort"
								>
									<FA
										className={styles.firstDivIcons}
										name="sort"
									/>
								</Button>{" "}
							</Popover>
						</ButtonGroup>
					</div>
					<div className={buttonClassProp2} aria-label="Quick Search Button">
						<Popover
							content={"Input Filter"}
							placement="bottom"
							trigger="hover"
						>
							<Search
								id='inputfiltersearch'
								placeholder={searchPlacheHolder}
								onSearch={value =>
									this.inputSearch(
										value,
										this.state.keys_to_filter
									)
								}
								 value={this.state.searchedValue}
								addonBefore={selectAfter}
								onChange={this.OnchangecloseIcon}
								suffix={suffix}
								enterButton
								className={styles.searchBox}
								aria-label="Quick Search"
							/>
						</Popover>
					</div>
					{(  (GlobalHelper.globlevar.UserAdvFilterMap !== false && (GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === "N" || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === null || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === undefined))) ? (
<div className={styles.thirdDivTabFilters}>

    <label htmlFor="dropdown">Filters:</label>

    <Select
	    value={defaultfilter}
        placeholder={'Filter'}
        showSearch={true}
        ref={(input) => { this.selectFocuse = input; }}
        dropdownStyle = {{zIndex:10011}}
        aria-label = "Filters"
        //onChange={(e)=>{this.handledelete(e)}}
        // onSearch={(value)=>{
        // this.handleSearchChange(value)
	    onChange={
		    this.handleClick
	    }
        style={{width:'230px', fontFamily:" 'Montserrat', sans-serif" ,'background-color': 'white'}}>
        {
	        GlobalHelper.globlevar.objectLength.map((Kitm, Kindx) => {debugger;
                let ak = Kitm[0].split("::");
				if(ak[1] != undefined) {
					let advfilterid = ak[0];
					let advfilternameupdate = ak[1].split(":~:");
					let advfiltername = advfilternameupdate[0];
					let advfilterflag = advfilternameupdate[1];
					return <Option value={advfiltername} aria-label={advfiltername} >{advfiltername}</Option>
				}
    	})}
    </Select>

	<Checkbox
	checked={this.sendCheckValue()} 
        style={{marginRight:'5px'}}
        ref="checkbox"
        //defaultChecked={this.props.value || null}
        onChange={this.handleCheckbox}
        Tooltip="Set as Default"
        aria-label="Set as Default"
    />

    <label htmlFor="dropdown">Set as Default</label>

</div>

	 ) : ""}

     
		{(  (GlobalHelper.globlevar.UserAdvFilterMap == false && (GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === "Y" || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === null || GlobalHelper.globlevar.worklistinfo.worklist["isQuickFilter"] === undefined))) ? (
					<div className={styles.thirdDivTabCont}>
						<Row type="flex" justify="start">
						<Col span={24}>
								<div className={styles.thirdDivTab}>
									<div className={styles.HiddenDivLeft}
									aria-label = "Left Hidden Div">
										<FA
											name={"fas fa-angle-left"}
											className={styles.leftScrollButton}
											aria-label = "Left Scroll Button"
										/>
									</div>
									
									<Col span={24}>
										<div className={styles.displayButtons}
										onClick={()=>{
											this.showLoader()}}
											aria-label = "Display Buttons">
											{this.renderQuickFilterLayout()}
										</div>
									</Col>
									<div className={styles.HiddenDivRight}
									aria-label = "Right Hidden Div">
										<FA
											name={"fas fa-angle-right"}
											className={styles.rightScrollButton}
											aria-label = "Right Scroll Button"
										/>
									</div>
								</div>
							</Col>
						</Row>
					</div>
		): "" 
		}
				
					<div className={styles.fourthDivTab}>
						<Menu
							theme="dark"
							mode="horizontal"
							style={{ fontFamily: "'Montserrat', sans-serif" }}
							onClick={this.quickFilterSelectValueChange}
							defaultSelectedKeys={this.state.defQFAtt != null ? this.state.defQFAtt : ["1"]}
							className={styles.quickMenu}
							aria-label = "Quick Menu"
						>
							<SubMenu
								title={
									<Icon
										className={styles.quickSubMenu}
										type="filter"
										
									/>
								}
							>
								{quickFilterColumnSelect.map(function(post, i) {
									Log4r.log("quickFilterColumnSelect........",quickFilterColumnSelect,post,i);
									return (
										<Menu.Item
											style={{
												backgroundColor: "#001529",
												width: "99.3%",
												fontFamily:
													"'Montserrat', sans-serif"
											}}
											
											key={
												quickFilterColumnSelect[i]
													.dataIndex
											}
										>
											{quickFilterColumnSelect[i].title}
											
										</Menu.Item>
									);
								})}
							</SubMenu>
						</Menu>
					</div>
					<div className={styles.downloadButtonWrapper}>
					{
				    //(download == 'Y') ? 
					(GlobalHelper.worklistData && GlobalHelper.worklistData.worklist && (GlobalHelper.worklistData.worklist.download == null || GlobalHelper.worklistData.worklist.download == "null" || GlobalHelper.worklistData.worklist.download == "Y" )) ?

					<ButtonGroup
							style={{ position: "fixed" , margin: '-5px 0px 0px 4px' }}
					>
							<Tooltip placement="bottomRight" title={<div style={{fontFamily:"Montserrat",fontSize:"12px",fontWeight:"500", position:"relative", top:'1px'}}>{"Download Worklist"}</div>}>
								<Button onClick={this.showConfirm} style={{maxWidth:'3px' ,paddingTop: '3px', height:'39px', background: 'linear-gradient(#FFFFFF, #EAEFF1)' ,paddingLeft: '10px'  }} aria-label="Download Worklist">
									<Icon type="download" className={styles.downloadIcon} style={{marginLeft: '-4px'}}/>
								</Button>
							 </Tooltip>
							 <Tooltip placement="bottomRight" title={<div style={{fontFamily:"Montserrat",fontSize:"12px",fontWeight:"500", position:"relative", top:'1px'}}>{"Refresh Worklist"}</div>}>
								<Button onClick={(e)=>{
									GlobalHelper.globlevar['worklistRefresh'] = true;
									this.props.refreshQB();
								}} style={{maxWidth:'3px' , paddingTop: '3px', height:'39px',background: 'linear-gradient(#FFFFFF, #EAEFF1)' ,paddingLeft: '10px' }} aria-label="Refresh Worklist">
									<Icon type="reload" className={styles.downloadIcon} style={{marginLeft: '-4px'}}/>
								</Button>
							 </Tooltip>
					</ButtonGroup>
					: 
					<div style={{ position: "fixed" , margin: '-5px 0px 0px 4px' }}>
					<Tooltip placement="bottomRight" title={<div style={{fontFamily:"Montserrat",fontSize:"12px",fontWeight:"500", position:"relative", top:'1px'}}>{"Refresh Worklist"}</div>}>
								<Button onClick={(e)=>{
									GlobalHelper.globlevar['worklistRefresh'] = true;
									this.props.refreshQB();
								}} style={{height:'39px', background: 'linear-gradient(#FFFFFF, #EAEFF1)' ,paddingLeft: '18px',marginLeft :'3px'  }}>
									<Icon type="reload" className={styles.downloadIcon} style={{marginLeft: '-4px'}}/>
								</Button>
							 </Tooltip>
					</div>
					}
					</div>
				</Header>}
				{/*this.state.headerFlag ? this.renderExpandHeaderLayout() : null*/}
				{/* Sprint 10 (Task 54):If width is less pagination list is removed and ajax scroll is added manually*/}
				<Content className={styles.tablebackcolor}>
					<TableContainer
						tableData={unchangedData}
						updateUnchangedData={this.updateUnchangedData}
						tableColumns={this.state.tableColumns}
						moreRows={this.state.moreRows}
						pageSize={this.state.pageSize}
						totalRows={this.state.totalRows}
						internalTableStructure={
							this.state.internalTableStructure
						}
						keys_to_filter={this.state.keys_to_filter}
						searchTerm={this.state.searchTerm}
						themeCode={this.props.themeCode}
						//openExpandHeader={this.openExpandHeader}
						defaultWorkListId={this.state.defaultWorkListId}
						listEntityId={this.state.listEntityId}
						classChanger={this.classChanger}
						loadingPage={this.state.loadingPage}
						isScrollPagination={
							window.innerWidth > 460
								? this.state.isScrollPagination
								: true
						}
						currentPage={GlobalHelper.worklistPageNo.get("current")}
						handleToUpdateRowCount={this.handleToUpdateRowCount}
						selectedRowKeyValues={this.selectedRowKeyValues}
						advanceSearchOnLoadFilterXML={worklistJsonMap.get("userAdvFilter")}
						closeAllGridLayouts = {this.closeAllGridLayouts}//Sprint 24 - To close Multiple Worklist Layout/Advance Search layout if Bulk Operation layout is opened.
						GridWorklistFlag={true}
						inputFilterKeyPress={this.inputFilterKeyPress}
						advanceSearchLayoutKeyPress={this.advanceSearchLayoutKeyPress}
						closeAllGridWorklistLayouts={this.closeAllGridWorklistLayouts}
						returnToMenuId={this.props.returnToMenuId}
						refreshQB = {this.props.refreshQB}
						columnCount = {(GlobalHelper.worklistData.worklist != null && GlobalHelper.worklistData.worklist.columnCount) ? GlobalHelper.worklistData.worklist.columnCount : null}
						cFixedColumnCount = {(GlobalHelper.worklistData.worklist != null && GlobalHelper.worklistData.worklist.cFixedColumnCount != null) ? GlobalHelper.worklistData.worklist.cFixedColumnCount : null}
					/>
				</Content>
			</Layout>) :
				<div className={styles.spinContent} style={{ height:window.innerHeight - 55 }}>
					<Spin style={{color:'black',fontSize:18, position:'relative', top:window.innerHeight/3, fontFamily:'Montserrat, sans-serif',fontWeight:'700'}} size="large" spinning={true} tip=" Loading Data ...">
					</Spin>
				</div>
		);
	}
	//      }

	inputFilterKeyPress(event,priority){
		Log4r.log("inputFilterKeyPress.........",event,priority);
		if(priority != null){
			$('#inputfiltersearch').focus();
		}
		//window.alert("key press........"+priority);
	}

	//to open AdvanceSearchLayout on keyboard shortcut
	advanceSearchLayoutKeyPress(event,priority){
		Log4r.log("advanceSearchLayoutKeyPress.........",event,priority);
		if(priority != null){
			Log4r.log("advanceSearchLayoutKeyPress.........",event,priority);
			$('#AdvanceSearchLayoutButton_Open').click();
		}
		//window.alert("key press........"+priority);
	}

	render() {
		const { inputValue} = this.state;
		
		// const {GlobalHelper.globlevar.worklistinfo.worklist[isQuickFilter]} = this.state;
		// GlobalHelper.globlevar.GlobalHelper.globlevar.worklistinfo.worklist[isQuickFilter]=GlobalHelper.globlevar.worklistinfo.worklist[isQuickFilter];
 
		if (GlobalHelper.globlevar.UserAdvFilterMap !== undefined) {
			GlobalHelper.globlevar.objectLength = Object.entries( GlobalHelper.globlevar.UserAdvFilterMap);
			// var inputValuea = GlobalHelper.globlevar.defAdvFilter;
		}

		GlobalHelper.globlevar["QBsearch"] = "true"; // Sprint 16 - Task - Query Builder development,Integration and Testing - to remove search button if Query Builder used in form at Advance search Layout.
		if(GlobalHelper.globlevar['RefreshQueryBuilder'] === true){
			GlobalHelper.globlevar['RefreshQueryBuilder'] = undefined;
		}

		if (this.state.themeName == "myDefault") {
			styles = require("./GridWorkListDefault.css");
		} else if (this.state.themeName == "myDark") {
			styles = require("./GridWorkListDark.css");
		} else if (this.state.themeName == "myRed") {
			styles = require("./GridWorkListRedThm.css");
		} else if (this.state.themeName == "myCompact") {
			styles = require("./GridWorkListCompact.css");
		} else {
			Log4r.log("Something went wrong!!");
		}
		Log4r.log("pathname" , this.props.pathname);
		var pathname = undefined;
		if(this.props.outnames){
			pathname = this.props.outnames.ScreenLayoutName;
		}
		if(pathname == undefined || pathname == "#"){
				pathname = "UIScreen";
		}

		return (
			<div style={{ width: this.props.widths + 65 }}>
						{this.renderSearchFilterLayout() }
			          	{ this.renderGridWorkList() }
	
				{
					<Switch>
							 {/*<Route path='/reactapp/app/UIScreen' render={ state=><UIScreen widths={this.state.widths} /> } />*/}
							<Route path="/*" render={() => (
									<Redirect to={pathname} />
									)} />
				 </Switch>
				}
			</div>
		);
	}
}

function mapStateToProps(state , ownProps){
	return {
    outnames : state.names
  };
}

function mapDispatchToProps(dispatch){
  return{
      actions: bindActionCreators(action,dispatch)
  };
}

const GridWorkListWrap = connect(mapStateToProps,mapDispatchToProps) (GridWorkList);
export default (Form.create()(GridWorkListWrap));
