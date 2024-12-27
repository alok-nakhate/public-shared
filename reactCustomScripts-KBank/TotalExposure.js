function onScreenLoad() {

	let query = "OrgCode=001&custno=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");
	let cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchTotalExposure&_en=onLoad", query);
	let obj = eval("cst = " + cst);

	if (obj.fetchgrandtotal.rows[0] != '') {

		clearGrid("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL");

		// for (let i = 0; i < obj.fetchgrandtotal.totalRows; i++) {
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

	let iagreement = getValue("DESIGNER_COLAGRMNT.COL_TOTAL_EXP_DELQ.LGCYGRMNTN_3QOKGL0[" + (getIndexOfChangedEditableRow() - 1) + "]");
	try {
		setClipsearchValue(iagreement, 'HF92');
	} catch (e) { }
	searchValueInClipSearch(iagreement, 'HF92');
}