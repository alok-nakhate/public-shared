import 'babel-polyfill';
import React, { Component, Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { Layout, Modal, Table } from 'antd';
import { downloadFile } from './form/utils';
import { setServerMode } from './form/xPathDataStore';
import { displayMessageBox, showTextEditorPopup, displayForm, showComponent } from './ModalComponent/ModalBox';
import DocumentViewWidgetEdit from './form/components/widgets/documentView/DocumentViewWidgetEdit';
import QBP from './form/components/widgets/querybuilder/QBP';
import * as action from './actions/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GlobalHelper from './components/GlobalHelper';
import request from 'superagent';
import styles from './App.css';
import { Spin } from 'antd';
import { callLogOff } from "./form/logoff";
// import ErrorBoundary from './exception/ErrorBoundary';
import store from './services/Store';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CustomAPIs } from './customcomponentsapi/CustomAPIs';
import Log4r from './util/Log4r';

const UIScreen = lazy(() => import('./components/UIScreen'));
const GridWorkList = lazy(() => import('./components/table/GridWorkList'));
const UserSelector = lazy(() => import('./components/UserSelector'));
const LoginError = lazy(() => import('./components/LoginError'));
const LoginForm = lazy(() => import('./components/LoginForm_media'));
const MainLayout = lazy(() => import('./components/MainLayout'));

let menuJsonObj = "";
var parseString = require("xml2js").parseString;

class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            names: [],
            redirect: false,
            urlpath: '',
            loading: true,
            redirectToReferrer: true,
        };
        // below code for custom API called.
        new CustomAPIs().custApi();
        var path = window.location.pathname;
        //var path = "/MainLayout";

        var contextroot = "/" + path.split('/')[1];
        GlobalHelper.globlevar.contextroot = contextroot;

        var objects = {};
        var antdLibraries = {};
        var modalLibraries = {};

        antdLibraries['Layout'] = Layout;
        antdLibraries['Modal'] = Modal;
        antdLibraries['Table'] = Table;

        modalLibraries['displayMessageBox'] = displayMessageBox;
        modalLibraries['showTextEditorPopup'] = showTextEditorPopup;
        modalLibraries['displayForm'] = displayForm;
        modalLibraries['showComponent'] = showComponent;

        objects['DocumentViewWidgetEdit'] = DocumentViewWidgetEdit;
        objects['QBP'] = QBP;
        objects['IntlProvider'] = IntlProvider;
        objects['store'] = store;
        objects['downloadFile'] = downloadFile;
        objects['React'] = React;
        objects['Component'] = Component;
        objects['ReactDOM'] = ReactDOM;

        let contextpath = contextroot + "/react/";
        let contextpathajax = contextroot + "/";

        if (process.env.NODE_ENV == 'development') {
            contextpath = "/react/";
            contextpathajax = "/react/api/";
        } else if (process.env.NODE_ENV == 'test') {
            contextpath = "/react/";
            contextpathajax = "/react/api/";
        } else if (process.env.NODE_ENV === 'production') {
            contextpath = contextroot + "/react/";
            contextpathajax = contextroot + "/";
        }

        GlobalHelper.globlevar['contextpath'] = contextpath;
        GlobalHelper.globlevar['targetCard'] = "";
        GlobalHelper.globlevar['onlyCardClicked'] = false;
        GlobalHelper.globlevar['refreshDependantData'] = false;
        GlobalHelper.globlevar['CardCloseClicked'] = false;
        GlobalHelper.globlevar['GridToTimeline'] = true;
        GlobalHelper.globlevar['UserSelectorTheme'] = "myCompact";
        GlobalHelper.globlevar['contextpathajax'] = contextpathajax;
        GlobalHelper.globlevar['href'] = window.location.origin;
        GlobalHelper.globlevar['savespin'] = false;
        GlobalHelper.globlevar['multiLevelAddtoGridLinks'] = new Map();
        GlobalHelper.globlevar['showF2ModalClosed'] = new Map();
        GlobalHelper.globlevar['cardCollapseClicked'] = true;
        GlobalHelper.globlevar['hybridOneThirdCardsCount'] = [];
        GlobalHelper.globlevar['originalPopsearchData'] = [];
        GlobalHelper.globlevar['getDataUrls'] = [];
        GlobalHelper.globlevar['popSearchWindowSearch'] = false;
        GlobalHelper.globlevar['deleteButtonForDMSUpload'] = false;
        GlobalHelper.globlevar['CurrentlyClosedCard'] = [];
        GlobalHelper.globlevar['selectedCardIndex'] = new Map();
        GlobalHelper.globlevar['selectedTabCardIndex'] = new Map();
        this.onclickhandle = this.onclickhandle.bind(this);
        GlobalHelper.globlevar['applicationContext'] = JSON.parse(window.fetchData("FrameworkUtility/applicationContext.json"));
        /* GlobalHelper.globlevar['applicationContext'] = {
            "isConsoleEnable" : false,
            "sessionTimeout" : 120000
        }; */
		Log4r.log("val123",GlobalHelper.globlevar['applicationContext']);
        try {
            let localLandingMenuId = null;
            eval("localLandingMenuId = landingMenuId;");
            GlobalHelper.globlevar['landingMenuId'] = (localLandingMenuId != "" ? localLandingMenuId : null);

        }
        catch (e) { Log4r.error(e) }
        /* Create an alert to show if the browser is IE or not */
        if (GlobalHelper.globlevar['applicationContext']['isConsoleEnable'] === false) {
            console.log = () => { };
            console.error = () => { };
            console.warn = () => { };
            Log4r.log = () => { };
            Log4r.error = () => { };
            Log4r.warn = () => { };
        }
        this.extendSession();
    }

    extendSession() {
        setTimeout(() => {
            let sessionTimeout = window.fetchData(window.getcontextpath() + '/secure/timeout.do?extend=0&_source=react');
            if (sessionTimeout !== null) {
                var sessionTimeoutResp = sessionTimeout.replaceAll("'", "\"");
                if (sessionTimeoutResp != "{}") {
                    var sessionTimeoutRespObj = null;
                    try {
                        sessionTimeoutRespObj = JSON.parse(sessionTimeoutResp);
                    } catch (e) { }
                    console.log("sessionTimeoutRespObj", sessionTimeoutRespObj);
                    if (sessionTimeoutRespObj != null && "true" === sessionTimeoutRespObj.sessionStatus) {
                        try {
                            this.extendSession();
                        } catch (e) { Log4r.error(e) }
                    } else {
                        if (GlobalHelper.contextSetting.USERID != null) {
                            callLogOff(GlobalHelper.contextSetting.USERID);
                        }
                    }
                }
            }
        }, GlobalHelper.globlevar['applicationContext']['sessionTimeout'] == undefined ? 15000 : GlobalHelper.globlevar['applicationContext']['sessionTimeout']);
    }

    onclickhandle() {
        this.props.actions.createAction('GET_NAMES');
    }

    namesRow(names, index) {
        return <div key={index}> <li>{names} </li></div>;
    }

    componentWillMount() {
        if (this.props.profileRender === true) {
            this.setState({ loading: false })
        }
        if (this.state.loading && this.props.profileRender !== true) {
            /*Sprint 12 - ajax call to fetch context data from setting.jsp*/
            request
                .get(window.getcontextpath() + '/secure/pages/settings.jsp?type=json')
                //.get("/clipSearchjson.json")
                .set('Accept', 'application/json')
                .end((err, res) => {
                    if (err) {
                        Log4r.log('data-service err: call', err);
                    }
                    //let result = (res.text).trim();
                    let testStr = (res.text).trim();
                    var result = testStr;
                    try {
                        GlobalHelper.contextSetting = JSON.parse(result);
                        if (GlobalHelper.contextSetting.ORG_CURRENCY_SYMBOL === "Rs" || GlobalHelper.contextSetting.ORG_CURRENCY_SYMBOL === "Rs.") {
                            GlobalHelper.contextSetting.ORG_CURRENCY_SYMBOL = "₹";
                        }

                        if (GlobalHelper.contextSetting.ORG_LANGUAGE_CODE === "ar") {
                            GlobalHelper.contextSetting.ORG_LANGUAGE_CODE = "rtl";
                        }
                        //GlobalHelper.contextSetting.ORG_LANGUAGE_CODE = "rtl" ;
                    } catch (e) {
                        Log4r.error(e);
                    }
                    setServerMode("TEST");
                    if (GlobalHelper.contextSetting !== undefined && GlobalHelper.contextSetting !== null) {
                        GlobalHelper.globlevar.CLIPCOLUMNSJSON = GlobalHelper.contextSetting.CLIPCOLUMNSJSON;
                    }

                    /*Sprint 12 - Ajax call for Menu.json*/
                    let url = window.getcontextpath() + "/secure/pages/menuJSON.jsp";
                    //let url = "/MenuJson.json";

                    request
                        .get(url)
                        .end((err, res) => {
                            if (err) {
                                Log4r.log('Error ', err);
                            } else {
                                let strjson = res.text;
                                let jsonObj = null;
                                eval("jsonObj = " + strjson);

                                menuJsonObj = jsonObj;
                                GlobalHelper.aceMenuJson = menuJsonObj;

                                let childsArray = menuJsonObj.childs;
                                let systemMenuJson = {
                                    "systemMenu": [
                                    ]
                                }

                                let categoryMap = new Map();

                                childsArray.map((childObj, i) => {
                                    if (childObj.category !== null && childObj.category !== "" && childObj.category !== undefined) {
                                        categoryMap.set(childObj.category, childObj.category)
                                    }
                                })
                                var get_entries = categoryMap.entries();
                                let idcount = 0;
                                for (var ele of get_entries) {
                                    idcount = idcount + 1;
                                    let icontype = "key";

                                    if (ele[0] === "Administrator") {
                                        icontype = "key"
                                    }
                                    else if (ele[0] === "Configurator") {
                                        icontype = "safari"
                                    }
                                    else if (ele[0] === "Designer") {
                                        icontype = "cog"
                                    }
                                    else if (ele[0] === "Transaction") {
                                        icontype = "exchange"
                                    }
                                    else if (ele[0] === "Reports") {
                                        icontype = "files-o"
                                    }

                                    let menuObj = {
                                        "id": idcount,
                                        "title": ele[0],
                                        "icontype": icontype
                                    }
                                    systemMenuJson.systemMenu.push(menuObj);
                                }

                                GlobalHelper.globlevar['systemMenuJson'] = systemMenuJson;
                                this.setState({
                                    loading: false
                                })
                            }

                            //Ajax call for HotKeys - Key board shortcuts.....
                            let urlHotKeys = '/PDGCPFWeb/secure/HotKeysConfiguration.do?_rt=fetch';
                            var cpfContext = window.location.pathname.split("/");
                            if (cpfContext[1] != null && cpfContext[1] != "") {
                                urlHotKeys = urlHotKeys.replace("PDGCPFWeb", cpfContext[1]);
                            }
                            request
                                .get(urlHotKeys)
                                .set('Accept', 'application/json/xml')
                                .end((err, res) => {
                                    if (err) {
                                        Log4r.log("Erron in Hot Keys data fecth cal.......", err);
                                    } else {
                                        try {
                                            let HotKeyJSON = null;
                                            if (res.text != null) {
                                                let jsonText = res.text.replace(/\s/g, '');
                                                try {
                                                    eval("jsonText = " + jsonText);
                                                } catch (e) {
                                                    Log4r.log(e);
                                                }
                                                if (jsonText != null) {
                                                    if (jsonText.rows != null && jsonText.rows.length != 0) {
                                                        HotKeyJSON = jsonText.rows;
                                                        let hotkeyUserMap = new Map();
                                                        let hotkeySystemMap = new Map();
                                                        if (HotKeyJSON != null && HotKeyJSON.length != 0) {
                                                            HotKeyJSON.map((item, index) => {
                                                                if (item.SZUSER != null && item.SZUSER === "__SYSTEM__") {
                                                                    if (item.SZPRIMARYKEY1 != null && item.SZPRIMARYKEY2 != null && item.SZPRIMARYKEY3 != null
                                                                        && item.SZPRIMARYKEY4 != null && item.SZPRIMARYKEY5 != null) {
                                                                        let key = item.SZPRIMARYKEY1 + item.SZPRIMARYKEY2 + item.SZPRIMARYKEY3 + item.SZPRIMARYKEY4 + item.SZPRIMARYKEY5;
                                                                        hotkeySystemMap.set(key, item);
                                                                    }
                                                                } else {
                                                                    if (item.SZPRIMARYKEY1 != null && item.SZPRIMARYKEY2 != null && item.SZPRIMARYKEY3 != null
                                                                        && item.SZPRIMARYKEY4 != null && item.SZPRIMARYKEY5 != null) {
                                                                        let key = item.SZPRIMARYKEY1 + item.SZPRIMARYKEY2 + item.SZPRIMARYKEY3 + item.SZPRIMARYKEY4 + item.SZPRIMARYKEY5;
                                                                        hotkeyUserMap.set(key, item);
                                                                    }
                                                                }
                                                            })
                                                            var get_keys = hotkeySystemMap.keys();
                                                            for (var key of get_keys) {
                                                                if (key != null && hotkeyUserMap.has(key)) {
                                                                    Log4r.log("common key--demo.........", key);
                                                                } else {
                                                                    Log4r.log("system key.....", key);
                                                                    hotkeyUserMap.set(key, hotkeySystemMap.get(key));
                                                                }
                                                            }
                                                        }
                                                        let _keys = hotkeyUserMap.keys();
                                                        var combinedKeyArr = [];
                                                        for (var key of _keys) {
                                                            combinedKeyArr.push(hotkeyUserMap.get(key));
                                                        }
                                                        HotKeyJSON = combinedKeyArr;
                                                        GlobalHelper.HotKeyMap = hotkeyUserMap;
                                                    }
                                                }
                                                else {
                                                    //displayMessageBox("HotKeyComponent","No HotKeys data from server.....","I");
                                                    Log4r.log("No hot key data.......");
                                                }
                                            }
                                            else {
                                                //displayMessageBox("HotKeyComponent","No HotKeys Response from Server .....","I");
                                                Log4r.log("No hot key configuration on server.......");
                                            }
                                        } catch (e) { Log4r.log(e); }
                                    }
                                }) // END HotKeysConfiguration
                        }) // END menuJSON.jsp

                }) /*end*/

        }
    }

    render() {
        let imgpath = window.location.origin;
        var pathname = this.props.outnames.LayoutName;

        /*Sprint 13 Task - 59 Menu json Integration*/
        if (!this.state.loading) {
            if (this.props.outnames.LayoutName === undefined || this.props.layoutname == "UserSelector") {
                if (this.props.outnames.LayoutName === undefined) {
                    return (
                        <Provider store={store}>
                            <Suspense fallback={<div className={styles.loadingDiv}><Spin /></div>}>
                                <UserSelector menuJson={GlobalHelper.aceMenuJson} profileObj={this.props.profileObj ? this.props.profileObj : undefined} />
                            </Suspense>
                        </Provider>
                    );
                }
                else if (this.props.layoutname === "UserSelector" && GlobalHelper.globlevar['UserSelector']) {
                    GlobalHelper.globlevar['UserSelector'] = false;
                    pathname = GlobalHelper.globlevar.contextpath + "UserSelector";

                    return (
                        <Provider store={store}>
                            <Suspense fallback={<div className={styles.loadingDiv}><Spin /></div>}>
                                <Switch>
                                    <UserSelector menuJson={GlobalHelper.aceMenuJson} profileObj={this.props.profileObj ? this.props.profileObj : undefined} />
                                    <Route path="/*" render={() => (
                                        <Redirect to={pathname} />
                                    )} />
                                </Switch>
                            </Suspense>
                        </Provider>


                    );
                }
                else {
                    pathname = GlobalHelper.globlevar.contextpath + "MainLayout";
                }
            }
        }
        else {
            return (
                <div className={styles.loadingDiv}>
                    <Spin />
                </div>
            );
        }

        return (
            <Provider store={store}>
                <Suspense fallback={<div className={styles.loadingDiv}><Spin /></div>}>
                    <Switch>
                        {/* <Route path={GlobalHelper.globlevar.contextpath + "UIScreen"} component={state => <ErrorBoundary><UIScreen widths={this.state.widths} themeCode={this.state.themeName} /></ErrorBoundary>} />
                        <Route path={GlobalHelper.globlevar.contextpath + "GridWorkList"} component={state => <GridWorkList widths={this.state.widths} themeCode={this.state.themeName} layoutname="undefined" />} />
                        <Route path={GlobalHelper.globlevar.contextpath + "UserSelector"} component={() => <UserSelector profileObj={this.props.profileObj ? this.props.profileObj : undefined} />} />
                        <Route path={GlobalHelper.globlevar.contextpath + "LoginError"} component={LoginError} />
                        <Route path={GlobalHelper.globlevar.contextpath + "index"} component={LoginForm} /> */}
                        <Route path={GlobalHelper.globlevar.contextpath + "MainLayout/index"} component={LoginForm} />
                        <Route path={GlobalHelper.globlevar.contextpath + "MainLayout"} component={MainLayout} />
                        <Route path="/MainLayout" component={MainLayout} />
                        <Route path="/" render={() => (
                            <Redirect to={GlobalHelper.globlevar.contextpath + pathname} />
                        )} />
                    </Switch>
                </Suspense>
            </Provider>
        );
    }
}//end

const Public = () => <h3>Public</h3>
const Protected = () => <h3>Protected</h3>


App.propTypes = {

    actions: PropTypes.object.isRequired,
    outnames: PropTypes.array.isRequired
}


function mapStateToProps(state, ownProps) {
    var url = state.names.LayoutName;

    if (url !== "/undefined") {
        // Log4r.log("after login success / error may redirect to url......", url);
    }

    return {
        outnames: state.names

    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(action, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
