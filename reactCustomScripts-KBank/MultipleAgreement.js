function onScreenLoad()
{
	debugger;
	
	var SZ_ORG_ID='001';
	var custno=getValue("DESIGNER_COLAGRMNT.COL_MULTIPLE_DLQ_DTLS.CSTMRSQN_38OOI9Y[0]");
	var collgrpcode=getValue("DESIGNER_COLAGRMNT.COL_MULTIPLE_DLQ_DTLS.CLLCTRGRPCD_3P2N5Z3[0]");
	var query= "OrgCode="+SZ_ORG_ID+"&custno="+custno+"&collgrpcode="+collgrpcode;
	cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMultipleAgreement&_en=onLoad", query);
            console.log("cst =", cst);
            obj = eval("cst = " + cst);
	
	if(obj.fetchgrandtotal.rows[0] != ''){
		var trows_tmp = obj.fetchgrandtotal.totalRows;
             clearGrid("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL");
			 let szfOSAmt = obj.fetchgrandtotal.rows[0]['FOSAMT'];
			 let fOSAmt=parseFloat(szfOSAmt).toFixed(2);
			 
			 let szOVDAmt = obj.fetchgrandtotal.rows[0]['FFIELD3'];
			 let OVDAmt=parseFloat(szOVDAmt).toFixed(2);
			 
			 let szOVLAmt = obj.fetchgrandtotal.rows[0]['FOVERLIMITAMT'];
			 let OVLAmt=parseFloat(szOVLAmt).toFixed(2);

        for(var i =0; i < trows_tmp; i++) {     
         		
            addEmptyRowInGrid("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL");
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.FSMT_3NHG5TY[0]", fOSAmt);
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.FFLD3_3XBFR53[0]", OVDAmt);
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.FVRLMTMT_31O6P1D[0]", OVLAmt);
			setValue("DESIGNER_COLAGRMNT.COL_GRAND_TOTAL.DDYS_3JWR848[0]", 'Grand Total');
			
			
		}
	}
}
function ExecutionActivity(){
	var indexOfGridRow = getIndexOfChangedEditableRow();
	var indexOfGridRow = indexOfGridRow - 1;
	var iagreement = getValue("DESIGNER_COLAGRMNT.COL_MULTIPLE_DLQ_DTLS.LGCYGRMNTN_3W2AX0V[" +  indexOfGridRow + "]");
	try {
		setClipsearchValue(iagreement, 'HF92');
	} catch (e) {}
	searchValueInClipSearch(iagreement, 'HF92');
}
