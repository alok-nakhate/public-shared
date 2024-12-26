function printReportOvw() {

	let iAgrSeqNo = GlobalHelper.selectedRowData.COLAGRMNT_AGRMNTSQN;
	if (iAgrSeqNo == '' || iAgrSeqNo == undefined || iAgrSeqNo == null) {
		iAgrSeqNo = getSplitedValue(GlobalHelper.contextPKValues, 'agrmntSeqNo');
	}

	let strURL = "/collections/reportAction.do?cd=R_StatCard&_id=print&&P_AGREEMENTNO=" + iAgrSeqNo
		+ "&P_CUSTOMERNO=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN")
		+ "&cmboutputformat=PDF&openinsamewindow=false";
	let childWindow = self.open(strURL, "Win21", "resizable=yes,width=900,height=600,menubar=yes,resizable=1,scrollbars=0,title=no,left=10,top=10");
	if (childWindow.opener == null) {
		childWindow.opener = self;
	}

}