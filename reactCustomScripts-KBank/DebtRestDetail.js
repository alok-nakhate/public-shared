function onScreenLoad() {

	let query = "OrgCode=001&iagreementseqno=" + getValue("DESIGNER_COLAGRMNT.COL_DEBT_DTLS_24_MONTH.GRMNTSQN_3LZ8OOC[0]");
	let cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchDebtRestDetail&_en=onLoad", query);
	let obj = eval("cst = " + cst);

	if (obj.fetchtotal.rows[0] != '') {
		clearGrid("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL");
		// obj.fetchtotal.forEach(element => {
			addEmptyRowInGrid("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL");
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.PYCNDTN_3FBELLG[0]", parseFloat(obj.fetchtotal.rows[0]['SZPAYCONDITION']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.FCTLPYMNT_3ZH0CF7[0]", parseFloat(obj.fetchtotal.rows[0]['FACTUALPAYMENT']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.FDBTPYMNT_30SG5LX[0]", parseFloat(obj.fetchtotal.rows[0]['FDEBTPAYMENT']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.FPSTPNPYMNT_34XLWPT[0]", parseFloat(obj.fetchtotal.rows[0]['FPOSTPONEPAYMENT']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.IINSTALLMENTNO[0]", 'Total');
		// });
	}

	query = null;
	cst = null;
	obj = null;
}
