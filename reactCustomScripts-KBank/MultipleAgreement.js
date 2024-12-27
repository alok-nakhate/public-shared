function onScreenLoad() {

	let query = "OrgCode=001&custno=" + getValue("DESIGNER_COLAGRMNT.COL_MULTIPLE_DLQ_DTLS.CSTMRSQN_38OOI9Y[0]")
		+ "&collgrpcode=" + getValue("DESIGNER_COLAGRMNT.COL_MULTIPLE_DLQ_DTLS.CLLCTRGRPCD_3P2N5Z3[0]");
	let cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMultipleAgreement&_en=onLoad", query);
	let obj = eval("cst = " + cst);

	if (obj.fetchgrandtotal.rows[0] != '') {
		clearGrid("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL");

		// obj.fetchgrandtotal.forEach(element => {
			addEmptyRowInGrid("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL");
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.FSMT_3NHG5TY[0]", parseFloat(obj.fetchgrandtotal.rows[0]['FOSAMT']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.FFLD3_3XBFR53[0]", parseFloat(obj.fetchgrandtotal.rows[0]['FFIELD3']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.FVRLMTMT_31O6P1D[0]", parseFloat(obj.fetchgrandtotal.rows[0]['FOVERLIMITAMT']).toFixed(2));
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.DDYS_3JWR848[0]", 'Grand Total');
		// });

	}

	cst = null;
	obj = null;
}

function ExecutionActivity() {

	let iagreement = getValue("DESIGNER_COLAGRMNT.COL_MULTIPLE_DLQ_DTLS.LGCYGRMNTN_3W2AX0V[" + (getIndexOfChangedEditableRow() - 1) + "]");
	try {
		setClipsearchValue(iagreement, 'HF92');
	} catch (e) { }
	searchValueInClipSearch(iagreement, 'HF92');
}
