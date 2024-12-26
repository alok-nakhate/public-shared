function printReport() {

	let cPTPHistory = getValue('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.PTPHISTORY');
	let cFOLHistory = getValue('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.FOLLOWUPHISTORY');

	if (cPTPHistory == "N" && cFOLHistory == "N") {
		return (
			displayMessageBox("Error", "Please Select One Checkbox For Which You Want To Generate Report. ", "E")
		)
	}

	if (cPTPHistory == "Y" && cFOLHistory == "Y") {
		return (
			displayMessageBox("Error", "Please Select Only One Checkbox To Generate The Report. ", "E")
		)
	}

	let iAgrSeqNo = GlobalHelper.selectedRowData.COLAGRMNT_AGRMNTSQN;
	if (iAgrSeqNo == '' || iAgrSeqNo == undefined || iAgrSeqNo == null) {
		iAgrSeqNo = getSplitedValue(GlobalHelper.contextPKValues, 'agrmntSeqNo');
	}

	let reportName = "";
	if (cFOLHistory == 'Y') {
		reportName = "R_TrnPreFollowUps";
	} else if (cPTPHistory == 'Y') {
		reportName = "R_TrnPTPDetails";
	}

	let strURL = "/collections/reportAction.do?cd=" + reportName + "&_id=print&&P_AGREEMENTNO=" + iAgrSeqNo + "&cmboutputformat=PDF&openinsamewindow=false";
	let childWindow = self.open(strURL, "Win21", "resizable=yes,width=900,height=600,menubar=yes,resizable=1,scrollbars=0,title=no,left=10,top=10");
	if (childWindow.opener == null) {
		childWindow.opener = self;
	}

}