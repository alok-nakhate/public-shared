function printReportOvw(){
    debugger;
	var strPkValue = GlobalHelper.contextPKValues;
	console.log("PK VALUES",strPkValue);
	var portfolio    = GlobalHelper.selectedRowData.PRTFLCD;
	var legeacyAgrNo = GlobalHelper.selectedRowData.LGCYGRMNTN;
	var iAgrSeqNo = GlobalHelper.selectedRowData.COLAGRMNT_AGRMNTSQN;

	if(iAgrSeqNo=='' || iAgrSeqNo == undefined || iAgrSeqNo == null ){
		iAgrSeqNo = getSplitedValue(strPkValue , 'agrmntSeqNo');
	}
	console.log("Context Path....!!!",GlobalHelper.globlevar.contextroot);
	/*var reportName = "R_BulkStatCard";
	if(portfolio == 'A'){
		reportName = "R_AssetBulkStatCard";
	}else if(portfolio == 'H'){
		reportName = "R_HomeBulkStatCard";
	}*/

	var iCustSeqNo=getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");

	var strURL="/collections/reportAction.do?cd=R_StatCard&_id=print&&P_AGREEMENTNO="+iAgrSeqNo+"&P_CUSTOMERNO="+iCustSeqNo+"&cmboutputformat=PDF&openinsamewindow=false";
	childWindow	=	self.open(strURL,"Win21","resizable=yes,width=900,height=600,menubar=yes,resizable=1,scrollbars=0,title=no,left=10,top=10");
	if (childWindow.opener == null){
		childWindow.opener = self;
	}
	
}