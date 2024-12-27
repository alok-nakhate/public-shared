import React, { Component } from 'react';
import GlobalHelper from "../../../../components/GlobalHelper";
import { Tabs, Radio } from 'antd';
import GridWorkList from "../../../../components/table/GridWorkList";
import { BrowserRouter, Switch, BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon, Avatar, Button,List,Tooltip,Dropdown ,Input} from 'antd';
import { displayMessageBox } from "../../../../ModalComponent/ModalBox";
import $ from "jquery";
import store from "../../../../services/Store";
import Log4r from '../../.././../util/Log4r';

const FA = require('react-fontawesome');
var styles = require("../../../../components/css/MainLayout/MainLayoutDefault.css");
var redirection = "";
var menuitem = "";
var search_key = ""; //Sprint 12 : fo placeholder in clipsearch
const Search = Input.Search;
class ClipSearchComponent extends Component {

constructor(props){
    super(props)
    Log4r.log("props",props);
    this.state = {
      clipSearchValue : "",
    }
    this.searchOnClick =this.searchOnClick.bind(this);
    this.inputClipSearch = this.inputClipSearch.bind(this);
    if (GlobalHelper.globlevar.CLIPCOLUMNSJSON !== undefined && GlobalHelper.globlevar.CLIPCOLUMNSJSON[0] != undefined) {
			search_key = GlobalHelper.globlevar.CLIPCOLUMNSJSON[0].caption;
		}
    window.setClipsearchValue = function(id,attrIdClipsearch){
      window.ClipsearchValue = id;
      window.attrId = attrIdClipsearch
      GlobalHelper.globlevar.MainLayoutObject.refreshQB();
    }
	}

  async	searchOnClick() {
  				try{

  			  const CopyData = await navigator.clipboard.readText();
              var text = CopyData.trim();
  			  this.setState({clipSearchValue: text});
  			  this.setState({ open: this.state.open });
              this.inputClipSearch(this.state.clipSearchValue,undefined)
  	        } catch (err) {
  	            Log4r.error('Async: Could not copy text: ', err);
  	        }

  	     if(window.clipboardData) { // Internet Explore
  				 document.addEventListener('paste', function (event) {
                 var  WindowCopyData = window.clipboardData.getData('text');
  	             var text= WindowCopyData.trim();
  				 this.setState({clipSearchValue: text});
  				 this.setState({ open: this.state.open });
  				 this.inputClipSearch(this.state.clipSearchValue,undefined)
  	      });
  		    }
  	 };

    OnchangecloseIcon = (e) => {
  			Log4r.log('typedValue', e.target.value);
  			this.setState({
  				clipSearchValue:e.target.value
  			})
  		}

    /*Sprint 10 - Task No - 58  Clip search configur menu with Setting.jsp call*/
    handleMenuClick = flag => {
      if(window.menuitem == undefined){
      console.log("menuclicked....", flag, flag.item.props.children);
      menuitem = flag.item.props.children;
      search_key = menuitem;
      }else{
        menuitem = window.menuitem;
        search_key = menuitem;
      }
      this.setState({dropdownicon:true})
    };

    /*Sprint 10 - Task No - 58  Clip search configur menu with Setting.jsp call*/
    filterXMlCreation(searchvalue, clipsearchobject) {
      var filterXML;
      if (searchvalue !== undefined && clipsearchobject !== undefined && searchvalue.length !== 0) {
        filterXML =
          "<filter type='AND'>" +
          "<condition attribute='" +
          clipsearchobject.attrId +
          "' extdata='' funccode='' operator='" +
          clipsearchobject.operator +
          "' datatype='string' value='" +
          searchvalue +
          "' _clipValue='"+
          searchvalue +
          "' description='N' default='' defaultdesc='' cmpfld='N' caption='' fid='' conditionid='' pfid='' code='' sclfunc=''/>" +
          "</filter>";
        return filterXML;
      }
      //Sprint 11 : Isssue: Clip search call when input search string is null or empty.
      else {
        filterXML =
          "<filter type='AND'>" +
          "<condition attribute='' extdata='' funccode='' operator='' datatype='string' value='' _clipValue='' description='N' default='' defaultdesc='' cmpfld='N' caption='' fid='' conditionid='' pfid='' code='' sclfunc=''/>" +
          "</filter>";
        return filterXML;
      }
    }

    /*Sprint 10 - Task No - 58  Clip search configur menu with Setting.jsp call*/
    inputClipSearch(value,cplippedAttribute) {
      try{
       GlobalHelper.worklistData.worklist.cliptaskid=GlobalHelper.worklistData.worklist.taskId;
       GlobalHelper.worklistData.worklist.taskId=null;
      }catch(e){
        Log4r.log("e : ",e);
      }
      value =value.trim();
      GlobalHelper.globlevar['menuFunctionFlag']=false;
      GlobalHelper.globlevar.removeHeaderFlag = false;
      GlobalHelper.functionAccessMap = new Map();
      GlobalHelper.functionListMap = new Map();
     // Log4r.log("GlobalHelper.globlevar.SearchFromClipSearch",GlobalHelper.globlevar.SearchFromClipSearch);
      //Log4r.log("GlobalHelper.globlevar.CLIPCOLUMNSJSON",this.props);
      var clipsearchobject = undefined;
      GlobalHelper.globlevar['clipsearchflagforbutton'] = true;//Sprint 30 - Task - Tp remove NEXT & SAVE&NEXT buttons from screen if record searched via CLIPSEARCH
      if (GlobalHelper.globlevar.CLIPCOLUMNSJSON !== undefined && GlobalHelper.globlevar.CLIPCOLUMNSJSON.length !== 0) {
        if (value !== "") {
          //search_key = value; //Sprint 12 - added to keep clip search value as placeholder
          redirection = "true"; //Sprint 12 - added for redirection during clipsearch
          if (cplippedAttribute !== undefined) {
            clipsearchobject = cplippedAttribute;
          }else{
            GlobalHelper.globlevar.CLIPCOLUMNSJSON.map((item, index) => {
              if (item.caption === menuitem) {
                clipsearchobject = item;
              }
            });
            if (clipsearchobject == undefined) {
              clipsearchobject = GlobalHelper.globlevar.CLIPCOLUMNSJSON[0];
            }
          }

          if (clipsearchobject !== undefined || clipsearchobject !== null) {
            var filterXML = this.filterXMlCreation(value, clipsearchobject);
            Log4r.log("filter xml..........", filterXML, clipsearchobject);
            var listEntityId = clipsearchobject.listEntityId;
            //var url = clipsearchobject.URL.replaceAll("ac.do","listAction.do");
            var url = clipsearchobject.URL;
            url = url +"&_rt=fetchListEntityForReact"
            let clipSearchCloseActions = {};
            try {
               if(GlobalHelper.globlevar['clipsearchcloseprejson'] == undefined )
               {
                 let SearchFromClipSearch = true;
                 let previousScreenJSON= JSON.stringify(this.props.names.outnames);
                 clipSearchCloseActions['SearchFromClipSearch'] = SearchFromClipSearch;
                 clipSearchCloseActions['previousScreenJSON'] = previousScreenJSON;
                 clipSearchCloseActions['functionID'] = GlobalHelper.globlevar.functionID;
                 clipSearchCloseActions['GlobalHelperholdFunGroupData'] = GlobalHelper.holdFunGroupData;
                 clipSearchCloseActions['listEntityId'] = GlobalHelper.listEntityId;
                 clipSearchCloseActions['contextPKValues'] =   GlobalHelper.contextPKValues;
                 clipSearchCloseActions['contextPrimaryKey'] = GlobalHelper.contextPrimaryKey;
                 clipSearchCloseActions['contextPrimaryKeyLength'] = GlobalHelper.contextPrimaryKeyLength;
                 clipSearchCloseActions['clipsearchFilterXml'] = filterXML;
                 GlobalHelper.globlevar['clipsearchcloseprejson'] = clipSearchCloseActions ;


               }
           } catch (e) {

               Log4r.error(e);
           }
           GlobalHelper.globlevar['IsolatedfunctionCONTEXTurlParams'] = undefined;
            GlobalHelper.globlevar['clickCLIPSEARCH'] = true;
            if (this.props) {
              this.props.refreshQB();
            }
            this.state.clipSearchValue = value;
            //GlobalHelper.globlevar.onScreenLoadSpin = true;
            this.globlevarCleanUp();
            setTimeout(() => {
              store.dispatch({ type: "CLIPSEARCH", url, filterXML, listEntityId });
            }, 2000);
          } else {
            displayMessageBox("ERROR", "No Clipsearch Configuration....", "E");
          }
        } else if (value === "") {
          search_key = menuitem; //Sprint 12 - added to keep clip search placeholder as menuitem when value is empty
          redirection = "false"; //Sprint 12 - added for redirection during clipsearch
          GlobalHelper.globlevar["gridredirect"] = "true"; //Sprint 11 Task 59 used in UIScreen in mapstatetoprops()

          //displayMessageBox("WARNING","No input value.....","W");
        }
      } else {
        displayMessageBox("ERROR", " No Clipsearch Configuration. ", "E");
      }
    };

    globlevarCleanUp () {
      GlobalHelper.globlevar['names'] = undefined;
      GlobalHelper.globlevar['UISCreenObject'] = undefined;
      GlobalHelper.globlevar['UIScreenLayoutJson'] = {};
      GlobalHelper.globlevar['assortedMapOfLeaf'] = new Map();
      GlobalHelper.globlevar['assortedMapOfParent'] = new Map();
      GlobalHelper.globlevar['fetchParentPKComponentDataMap'] = new Map();
      GlobalHelper.globlevar['fetchPrimaryKeySectionIdAndKeyMap'] = new Map();
      GlobalHelper.globlevar['jsonObjgetData'] = undefined;
      GlobalHelper.globlevar['jsonTemplateObjectOfBackScreen'] = undefined;
      GlobalHelper.globlevar['parentnode'] = new Map();
      GlobalHelper.globlevar['section_formIDMap'] = new Map();
      GlobalHelper.globlevar['templetObject'] = undefined;   
      GlobalHelper.globlevar['xpathmap'] = new Map();  
      GlobalHelper.globlevar['newscreendata'] = undefined;
      GlobalHelper.globlevar['originalPopsearchData'] = undefined;
      GlobalHelper.globlevar['basicjson'] = {};
      GlobalHelper.globlevar['initialscreentemplate'] = undefined;
    }

    emitEmpty(e){
        //search_key="";
        if(document.getElementById('inputClipSearch').value != null){
          Log4r.log("document.getElementById('inputClipSearch').value",document.getElementById('inputClipSearch').value);
          Log4r.log("event....",e);
          Log4r.log("div value.....",$('#inputClipSearch'));
          document.getElementById('inputClipSearch').value='';
          //$('#inputClipSearch').setValue('');
        }
        //this.setState({searchValue : null});
      }

  render(){
    if(window.ClipsearchValue != undefined){
      let clipsearchObj = GlobalHelper.globlevar.CLIPCOLUMNSJSON.filter(item=> item.attrId == window.attrId)[0];
      if(clipsearchObj){
        window.menuitem = clipsearchObj.caption;
        this.handleMenuClick();
      }
      this.setState({clipSearchValue :window.ClipsearchValue})
      window.ClipsearchValue = undefined;
      window.menuitem = undefined;
      window.attrId = undefined;
    }
    /*Sprint 10 - Task 57  Clip search UI development in Mainlayout  */
		let ClipSearchDropdownMenu;
		if (GlobalHelper.globlevar.CLIPCOLUMNSJSON !== undefined && GlobalHelper.globlevar.CLIPCOLUMNSJSON !== null && GlobalHelper.globlevar.CLIPCOLUMNSJSON.length !== 0) {
			ClipSearchDropdownMenu = (
				<Menu className={styles.clipsearchdropdown} onClick={this.handleMenuClick} aria-label="Clip Search Menu">
					{GlobalHelper.globlevar.CLIPCOLUMNSJSON.map((object, index) => {
						return <Menu.Item key={index + 1} aria-label={object.caption}>{object.caption}</Menu.Item>;
					})}
				</Menu>
			);
		} else {
			ClipSearchDropdownMenu = (
				<Menu className={styles.clipsearchdropdown} onClick={this.handleMenuClick} aria-label="Clip Search Menu">
					<Menu.Item key={-1} />
				</Menu>
			);
		}

    const suffix = <FA style={{marginRight:'2px',position:'absolute',left:94,top:-10}}className ={styles.closeIcon} name="fas fa-times-circle"  onClick={this.emitEmpty.bind(this)} />;

		if (GlobalHelper.globlevar.CLIPCOLUMNSJSON !== undefined && GlobalHelper.globlevar.CLIPCOLUMNSJSON !== null && GlobalHelper.globlevar.CLIPCOLUMNSJSON.length !== 0) {
			ClipSearchDropdownMenu = (
				<Menu className={styles.clipsearchdropdown} onClick={this.handleMenuClick} aria-label="Clip Search Menu">
					{GlobalHelper.globlevar.CLIPCOLUMNSJSON.map((object, index) => {
						return <Menu.Item key={index + 1} aria-label={object.caption}>{object.caption}</Menu.Item>;
					})}
				</Menu>
			);
		} else {
			ClipSearchDropdownMenu = (
				<Menu className={styles.clipsearchdropdown} onClick={this.handleMenuClick} aria-label="Clip Search Menu">
					<Menu.Item key={-1} />
				</Menu>
			);
		}
    return (
      <span id="clipsearch1" className={styles.clipsearch}>
        {
          <Search id='inputClipSearch' onChange={this.OnchangecloseIcon} value={this.state.clipSearchValue} className={styles.searchBox} style={{ backgroundColor: "transparent" }} placeholder={search_key} onSearch={value => this.inputClipSearch(value,undefined)} allowClear={true} enterButton aria-label="Clip Search" />
        }
        <Dropdown overlay={ClipSearchDropdownMenu} trigger={["hover"]} aria-label="Clip Search Dropdown">
          <FA
            style={{ marginRight: "0px", fontSize: "16pt", position: "relative", top: "-11.5px", fontWeight: 800, margin: 7 }}
            onClick={() => {
              Log4r.log("drop down menu clipsearch..........");
            }}
            name={"angle-right"}
            aria-label="Clip Search Angle Right"
          />
        </Dropdown>
        <span>
        {" "}
        <FA name="fas fa-paste" onClick={value => this.searchOnClick(value)} style={{color : "white",position : 'relative',top :-11.5}} className={styles.search}/>{" "}
        </span>
      </span>
    );
  }
}
export default ClipSearchComponent;
