function onScreenLoad() {

	let query = "p_szOrgCode=001&p_szAgreementNo=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN") + "&p_szCustomerCode=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");
	let agrseq = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchCollateralSummary&_en=onLoad", query);
	let obj = eval("agrseq = " + agrseq);

	if (obj.fetchcollSummarydtl.rows[0] != '') {
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.PKDDYS_367HV9D", obj.fetchcollSummarydtl.rows[0]['IPEAKODDAYS']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.FPKVRDMNT_3AOFJO4", obj.fetchcollSummarydtl.rows[0]['FPEAKOVERDUEAMOUNT']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.TMSNCLLCTN_37KZ49Y", obj.fetchcollSummarydtl.rows[0]['ITIMESINCOLLECTION']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.TMSSLFCRD_3XJFANJ", obj.fetchcollSummarydtl.rows[0]['ITIMESSELFCURED']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.CNTD_3GZZKQ1", obj.fetchcollSummarydtl.rows[0]['SZCNTOD']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.DMT_39CKQVT", obj.fetchcollSummarydtl.rows[0]['SZODAMT']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.GRPCNTD_3RP2CI6", obj.fetchcollSummarydtl.rows[0]['SZGRPCNTOD']);
		setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.GRPDMT_3IWKR3W", obj.fetchcollSummarydtl.rows[0]['SZGRPODAMT']);
		setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DTDLQND_3XEEDDQ", obj.fetchcollSummarydtl.rows[0]['DTDELQEND']);
		setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDGRP_3V8SN70", obj.fetchcollSummarydtl.rows[0]['SZDELQENDGROUP']);
		setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDCLLCTR_3X7NCIC", obj.fetchcollSummarydtl.rows[0]['SZDELQENDCOLLECTOR']);
		setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDCTN_37MZ2PN", obj.fetchcollSummarydtl.rows[0]['SZDELQENDACTION']);
		setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDRSLT_3Z275KG", obj.fetchcollSummarydtl.rows[0]['SZDELQENDRESULT']);
		setValue("DESIGNER_COLAGRMNT.Coll_NextBucketMovement.DTNXTFLWDT_3TDVDRG", obj.fetchcollSummarydtl.rows[0]['DTNEXTFLOWDATE']);
		setValue("DESIGNER_COLAGRMNT.Coll_NextBucketMovement.FLWDYS_3RIS5BD", obj.fetchcollSummarydtl.rows[0]['FLOWDAYS']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.TTLTTMPTS_3TBMODF", obj.fetchcollSummarydtl.rows[0]['ITOTALATTEMPTS']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.SCCSSTTMPTS_3GD7GOJ", obj.fetchcollSummarydtl.rows[0]['ISUCCESSATTEMPTS']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSTKN_3G1X5US", obj.fetchcollSummarydtl.rows[0]['IPROMISETAKEN']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSFLFLLD_35FMD74", obj.fetchcollSummarydtl.rows[0]['IPROMISEFULFILLED']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSPRTFLFLLD_36FWTUZ", obj.fetchcollSummarydtl.rows[0]['IPROMISEPARTFULFILLED']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSBRKN_36POKX8", obj.fetchcollSummarydtl.rows[0]['IPROMISEBROKEN']);
		setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.CNSBRKNPRMS_3XCOX27", obj.fetchcollSummarydtl.rows[0]['ICONSBROKENPROMISE']);
	}

	query = null;
	agrseq = null;
	obj = null;
}
