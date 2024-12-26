function onScreenLoad() {

	let agrseq = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchEBANCollaterals&_en=onLoad&agseqno=", getValue("DESIGNER_COLAGRMNT.COLL_COLLATERALDTLS.GRMNTSQN_3MVXCQD[0]"));
	let obj = eval("agrseq = " + agrseq);

	if (obj.fetchcoldtl.rows[0] != '') {

		obj.fetchcoldtl.forEach((elemen, index) => {
			setValue("DESIGNER_COLAGRMNT.COLL_COLLATERALDTLS.CLLN_3K9XN4K[" + index + "]", elemen['COLLNO']);
			setValue("DESIGNER_COLAGRMNT.COLL_COLLATERALDTLS.CLDSC_3SWV7JD[" + index + "]", elemen['COLDESC']);
		});
	}

	agrseq = null;
	obj = null;
}
