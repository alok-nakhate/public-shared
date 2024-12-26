function printReport(){
	var strPkValue = GlobalHelper.contextPKValues;
	console.log("PK VALUES",strPkValue);
	var portfolio    = GlobalHelper.selectedRowData.PRTFLCD;
	var legeacyAgrNo = GlobalHelper.selectedRowData.LGCYGRMNTN;
	var iAgrSeqNo = GlobalHelper.selectedRowData.COLAGRMNT_AGRMNTSQN;
	
	var cPTPHistory = getValue('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.PTPHISTORY');
	var cFOLHistory = getValue('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.FOLLOWUPHISTORY');
	
	if (cPTPHistory == "N" && cFOLHistory == "N") {
            return (
                displayMessageBox("Error", "Please Select One Checkbox For Which You Want To Generate Report. ", "E")
            )
        }
		
	if (cPTPHistory == "Y" && cFOLHistory == "Y" ) {
            return (
                displayMessageBox("Error", "Please Select Only One Checkbox To Generate The Report. ", "E")
            )
        }
	
	getValue('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.PTPHISTORY');
	if(iAgrSeqNo=='' || iAgrSeqNo == undefined || iAgrSeqNo == null ){
		iAgrSeqNo = getSplitedValue(strPkValue , 'agrmntSeqNo');
	}
	console.log("Context Path....!!!",GlobalHelper.globlevar.contextroot);
	var reportName = "";
	if(cFOLHistory == 'Y'){
		reportName = "R_TrnPreFollowUps";
	}else if(cPTPHistory == 'Y'){
		reportName = "R_TrnPTPDetails";
	}
	
	
	var strURL="/collections/reportAction.do?cd="+reportName+"&_id=print&&P_AGREEMENTNO="+iAgrSeqNo+"&cmboutputformat=PDF&openinsamewindow=false";
    childWindow	=	self.open(strURL,"Win21","resizable=yes,width=900,height=600,menubar=yes,resizable=1,scrollbars=0,title=no,left=10,top=10");
	if (childWindow.opener == null){
		childWindow.opener = self;
	}
	
}