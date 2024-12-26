function ExecutionActivity(){
	
	debugger;
	var szagrno=getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.LGCYGRMNTN_3KWQ3MH[0]");
	//alert(szagrno);
	var szcustno=getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.LGCYCSTMRN_305AK14[0]");
	var szbussdt=getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.SZBUSINESSDATE[0]");
	//alert(szcustno);
	//alert(szbussdt);
	function getContextPath() {
   return window.location.pathname.substring(0, window.location.pathname.indexOf("/",4));
}
	//alert("substring "+window.location.pathname.substring);
	//alert(window.location.pathname);
	var contextPath = getContextPath();
	console.log("Context Path: " + contextPath);
	//alert("Context Path: " + contextPath);
	
	var url = contextPath+'/react/pages/profile/checkProfileDIH.jsp?accountID='+szagrno+'&businessdt='+szbussdt+'&customerNO='+szcustno;
	//var url = 'D:/IndusJDE/jboss-eap-7.1/server/8181/deployments/pdgcpf.ear/PDGCPFWeb.war/react/pages/profile/pages/profile/checkProfileDIH.jsp?accountID='+szagrno+'&businessdt='+szbussdt+'&customerNO='+szcustno;
	
	//var url = contextPath+'/react/pages/profile/checkProfileDIH.jsp?';
    //var LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
    //var TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
    //var settings ='height='+h+',width='+w+',top='+TopPosition+',left='+LeftPosition+',scrollbars=yes,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,resizable=yes'
    // window.open(url,winName,settings)
	//alert(url);
	winName='myWindow';
	//var url = 'http://google.com';
	window.open(url,winName,'length=300,width=300,top=400,left=400');
	
	
	
	
}
function ExecutionActivity1(){
	
	debugger;
	var szagrno=getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.LGCYGRMNTN_3KWQ3MH[0]");
	
	var szcustno=getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.LGCYCSTMRN_305AK14[0]");
	var szbussdt=getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.SZBUSINESSDATE[0]");
	
	function getContextPath() {
   return window.location.pathname.substring(0, window.location.pathname.indexOf("/",3));
}
	//alert(window.location.pathname);
	var contextPath = getContextPath();
	console.log("Context Path: " + contextPath);
	
	
	var url = contextPath+'/react/pages/blacklist/index.jsp?';
    
	winName='myWindow';
	
	window.open(url,winName,'length=300,width=300,top=400,left=400');
	
	
}