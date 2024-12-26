function onScreenLoad()
{
	debugger;
	
	var SZ_ORG_ID='001';
	var iagreementseqno=getValue("DESIGNER_COLAGRMNT.COL_DEBT_DTLS_24_MONTH.GRMNTSQN_3LZ8OOC[0]");

	var query= "OrgCode="+SZ_ORG_ID+"&iagreementseqno="+iagreementseqno;
	var cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchDebtRestDetail&_en=onLoad", query);
	
            console.log("cst =", cst);
            obj = eval("cst = " + cst);
	
	if(obj.fetchtotal.rows[0] != ''){
		var trows_tmp = obj.fetchtotal.totalRows;
             clearGrid("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL"); 
			 let instAmt = obj.fetchtotal.rows[0]['SZPAYCONDITION'];
			 let PAYCONDITION=parseFloat(instAmt).toFixed(2);
			 
			 let adjPayment = obj.fetchtotal.rows[0]['FACTUALPAYMENT'];
			 let ACTUALPAYMENT=parseFloat(adjPayment).toFixed(2);
			 
			 let debtPayAmt = obj.fetchtotal.rows[0]['FDEBTPAYMENT'];
			 let DEBTPAYMENT=parseFloat(debtPayAmt).toFixed(2);
			  
			 
			 let postponPayment = obj.fetchtotal.rows[0]['FPOSTPONEPAYMENT'];
			 let POSTPONEPAYMENT=parseFloat(postponPayment).toFixed(2);
			  

        for(var i =0; i < trows_tmp; i++) {     
         		
            addEmptyRowInGrid("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL");
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.PYCNDTN_3FBELLG[0]", PAYCONDITION);
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.FCTLPYMNT_3ZH0CF7[0]", ACTUALPAYMENT);
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.FDBTPYMNT_30SG5LX[0]", DEBTPAYMENT);
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.FPSTPNPYMNT_34XLWPT[0]", POSTPONEPAYMENT);
			
			setValue("DESIGNER_COLAGRMNT.COL_DEBT_TOTAL.IINSTALLMENTNO[0]", 'Total');
			
			
		}
	}
}
