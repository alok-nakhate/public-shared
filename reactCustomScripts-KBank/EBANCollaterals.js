function onScreenLoad()
{
	debugger;
	var agseqno=getValue("DESIGNER_COLAGRMNT.COLL_COLLATERALDTLS.GRMNTSQN_3MVXCQD[0]"); //agreement seq no

	var query= "agseqno="+agseqno;
	var agrseq = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchEBANCollaterals&_en=onLoad", query);
            console.log("agrseq =", agrseq);
            obj = eval("agrseq = " + agrseq);
	
	if(obj.fetchcoldtl.rows[0] != ''){
		
		var trows_tmp = obj.fetchcoldtl.totalRows;
		 
        for(var i =0; i < trows_tmp; i++) {  

		
			let colNumber = obj.fetchcoldtl.rows[i]['COLLNO'];
			let colDescription = obj.fetchcoldtl.rows[i]['COLDESC'];
			
			setValue("DESIGNER_COLAGRMNT.COLL_COLLATERALDTLS.CLLN_3K9XN4K["+i+"]", colNumber);
			setValue("DESIGNER_COLAGRMNT.COLL_COLLATERALDTLS.CLDSC_3SWV7JD["+i+"]", colDescription);		
				
		}
	}
}
