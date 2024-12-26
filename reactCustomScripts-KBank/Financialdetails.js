function ExecutionActivity() {

	let url = GlobalHelper.globlevar.contextpath + '/pages/profile/checkProfileDIH.jsp?accountID=' + getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.LGCYGRMNTN_3KWQ3MH[0]")
		+ '&businessdt=' + getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.SZBUSINESSDATE[0]")
		+ '&customerNO=' + getValue("DESIGNER_COLAGRMNT.COL_FINANCIAL_PROFILE_DTLS.LGCYCSTMRN_305AK14[0]");

	let openWindow = self.open(url, 'myWindow', 'length=300,width=300,top=400,left=400');

}

function ExecutionActivity1() {

	let url = GlobalHelper.globlevar.contextpath + '/pages/blacklist/index.jsp?';

	let openWindow = self.open(url, 'myWindow', 'length=300,width=300,top=400,left=400');

}