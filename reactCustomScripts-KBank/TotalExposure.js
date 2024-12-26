function onScreenLoad(){
	var SZ_ORG_ID='001';
	debugger;
	var custno=getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");
	var query= "OrgCode="+SZ_ORG_ID+"&custno="+custno;
	cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchTotalExposure&_en=onLoad", query);
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
	var iagreement = getValue("DESIGNER_COLAGRMNT.COL_TOTAL_EXP_DELQ.LGCYGRMNTN_3QOKGL0[" +  indexOfGridRow + "]");
	try {
		setClipsearchValue(iagreement, 'HF92');
	} catch (e) {}
	searchValueInClipSearch(iagreement, 'HF92');
}