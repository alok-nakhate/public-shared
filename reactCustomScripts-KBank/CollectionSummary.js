function onScreenLoad()
{
	debugger;
	var p_szAgreementNo=getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN"); //agreement seq no
	//alert("p_szAgreementNo is" + p_szAgreementNo);
	var p_szOrgCode='001';
	var p_szCustomerCode=getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");
	//alert("p_szCustomerCode is" + p_szCustomerCode);
	var query= "p_szOrgCode="+p_szOrgCode+"&p_szAgreementNo="+p_szAgreementNo+"&p_szCustomerCode="+p_szCustomerCode;
	var agrseq = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchCollateralSummary&_en=onLoad", query);
            console.log("agrseq =", agrseq);
            obj = eval("agrseq = " + agrseq);
	
	if(obj.fetchcollSummarydtl.rows[0] != ''){
		
		var trows_tmp = obj.fetchcollSummarydtl.totalRows;
		 		
			let iPeakOD = obj.fetchcollSummarydtl.rows[0]['IPEAKODDAYS'];
			let fPeakOvrdueAMT = obj.fetchcollSummarydtl.rows[0]['FPEAKOVERDUEAMOUNT'];
			let iTimesinColl = obj.fetchcollSummarydtl.rows[0]['ITIMESINCOLLECTION'];
			let iTimesSelfC = obj.fetchcollSummarydtl.rows[0]['ITIMESSELFCURED'];
			let countOD = obj.fetchcollSummarydtl.rows[0]['SZCNTOD'];
			let odAmt = obj.fetchcollSummarydtl.rows[0]['SZODAMT'];
			let grpCountOd = obj.fetchcollSummarydtl.rows[0]['SZGRPCNTOD'];
			let grpODAmt = obj.fetchcollSummarydtl.rows[0]['SZGRPODAMT'];
			let dtDelqEnd = obj.fetchcollSummarydtl.rows[0]['DTDELQEND'];
			let dlqEndGrp = obj.fetchcollSummarydtl.rows[0]['SZDELQENDGROUP'];
			let delqEndColl = obj.fetchcollSummarydtl.rows[0]['SZDELQENDCOLLECTOR'];
			let delqEndAct = obj.fetchcollSummarydtl.rows[0]['SZDELQENDACTION'];
			let delqEndRes = obj.fetchcollSummarydtl.rows[0]['SZDELQENDRESULT'];
			let dtNxtFlqDt = obj.fetchcollSummarydtl.rows[0]['DTNEXTFLOWDATE'];
			let flwdays = obj.fetchcollSummarydtl.rows[0]['FLOWDAYS'];
			let iTotAttmpt = obj.fetchcollSummarydtl.rows[0]['ITOTALATTEMPTS'];
			let iSucAttmpt = obj.fetchcollSummarydtl.rows[0]['ISUCCESSATTEMPTS'];
			let iPromsTaken = obj.fetchcollSummarydtl.rows[0]['IPROMISETAKEN'];
			let iPromsFulflld = obj.fetchcollSummarydtl.rows[0]['IPROMISEFULFILLED'];
			let iPromsPartflld = obj.fetchcollSummarydtl.rows[0]['IPROMISEPARTFULFILLED'];
			let iPromsBroken = obj.fetchcollSummarydtl.rows[0]['IPROMISEBROKEN'];
			let iConsPromsBroken = obj.fetchcollSummarydtl.rows[0]['ICONSBROKENPROMISE'];
			
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.PKDDYS_367HV9D", iPeakOD);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.FPKVRDMNT_3AOFJO4", fPeakOvrdueAMT);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.TMSNCLLCTN_37KZ49Y", iTimesinColl);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.TMSSLFCRD_3XJFANJ", iTimesSelfC);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.CNTD_3GZZKQ1", countOD);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.DMT_39CKQVT", odAmt);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.GRPCNTD_3RP2CI6", grpCountOd);
			setValue("DESIGNER_COLAGRMNT.Coll_DelinquencyDetails.GRPDMT_3IWKR3W", grpODAmt);
			setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DTDLQND_3XEEDDQ", dtDelqEnd);
			setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDGRP_3V8SN70", dlqEndGrp);
			setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDCLLCTR_3X7NCIC", delqEndColl);
			setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDCTN_37MZ2PN", delqEndAct);
			setValue("DESIGNER_COLAGRMNT.Coll_Summ_LastResolution.DLQNDRSLT_3Z275KG", delqEndRes);
			setValue("DESIGNER_COLAGRMNT.Coll_NextBucketMovement.DTNXTFLWDT_3TDVDRG", dtNxtFlqDt);
			setValue("DESIGNER_COLAGRMNT.Coll_NextBucketMovement.FLWDYS_3RIS5BD", flwdays);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.TTLTTMPTS_3TBMODF", iTotAttmpt);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.SCCSSTTMPTS_3GD7GOJ", iSucAttmpt);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSTKN_3G1X5US", iPromsTaken);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSFLFLLD_35FMD74", iPromsFulflld);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSPRTFLFLLD_36FWTUZ", iPromsPartflld);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.PRMSBRKN_36POKX8", iPromsBroken);
			setValue("DESIGNER_COLAGRMNT.Coll_ActionSummary.CNSBRKNPRMS_3XCOX27", iConsPromsBroken);
				
		
	}
}
