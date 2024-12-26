function checkMailCodeEvent() {
    var htmlData = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA");
    if (htmlData.length != 0) {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA", "");
    } else {
    }
}
function openTemplateEditor() {
    try {
		
        var editYN = 'N';
		var userName = GlobalHelper.contextSetting.USERCODE;
        var strMailCode = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.COLML_MLCD");
		var strMailCodeType = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CMLTYP");
		var commType = 'L';
        console.log("STRMAILCODE", strMailCode);
        if (strMailCode == "" || strMailCode == null || strMailCode.length == 0) {
            return (
                displayMessageBox("Error", "Please Select Mail Code", "E")
            )
        }
		 if (strMailCodeType == "" || strMailCodeType == null || strMailCodeType.length == 0) {
            return (
                displayMessageBox("Error", "Please Select Mail Type", "E")
            )
        }else{
			commType = strMailCodeType[0];
		}
		if(commType =='M'){
			commType = 'E';
		}else if(commType =='T'){
			commType = 'L';
		}
		if(strMailCode.length >0){
			console.log("Checking Letter Content Eixist for a mailcode");
			var condiion = "templateid="+strMailCode;
			var LetterExistYN = "Y";
			if(commType=='E'){
				var letterData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=checkhasemailcontent", condiion);
				var letterExistFlagData = eval("letterData="+letterData); 
				if(letterExistFlagData.fetch_emailexistyn.rows[0] != undefined){
					LetterExistYN = letterExistFlagData.fetch_emailexistyn.rows[0]['CEMAILTEMPEXISTYN'];
					if(LetterExistYN != null && LetterExistYN =='N'){
					return (
							displayMessageBox("Error", "Email Content Not Defined For This Mail Code", "E")
						)		
					}
				}
			}else if(commType=='S'){
				var letterData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=checkhassmscontent", condiion);
				var letterExistFlagData = eval("letterData="+letterData); 
				if(letterExistFlagData.fetch_smsexistyn.rows[0] != undefined){
					LetterExistYN = letterExistFlagData.fetch_smsexistyn.rows[0]['CSMSTEMPEXISTYN'];
					if(LetterExistYN != null && LetterExistYN =='N'){
					return (
							displayMessageBox("Error", "SMS Content Not Defined For This Mail Code", "E")
						)		
					}
				}
			}else if(commType=='L'){
				var letterData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=checkhaslettercontent", condiion);
				var letterExistFlagData = eval("letterData="+letterData); 
				if(letterExistFlagData.fetch_letterexistyn.rows[0] != undefined){
					LetterExistYN = letterExistFlagData.fetch_letterexistyn.rows[0]['CLETTERTEMPEXISTYN'];
					if(LetterExistYN != null && LetterExistYN =='N'){
					return (
							displayMessageBox("Error", "Letter Content Not Defined For This Mail Code", "E")
						)		
					}
				}
			}
		}
        var iAgrSeqNo = getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
        console.log("Mail Code ....!!!", strMailCode);
		//var json = GlobalHelper.globlevar['UIScreenLayoutJson'];
		//console.log("JSON for Grid fecth", json);
        var templateCode = "_MAIL_" + strMailCode;
        var groupcode = GlobalHelper.selectedRowData['SZCOLLECTORGRPCODE'];
        var szConditiontype = "templateid=" + templateCode + "&userid=" + userName;
        var accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchaccess", szConditiontype);
        console.log("Template Access Data", accessData);
        var objaccData = eval("accessData = " + accessData);
        console.log("Template Edit Permission", objaccData.fetch_accessbyprofile.rows[0]);
        if (objaccData.fetch_accessbyprofile.rows[0] != undefined) {
            editYN = objaccData.fetch_accessbyprofile.rows[0]['EDITFLAG'];
        }
		/*if(commType!='L'){
			editYN = 'Y';
		}*/
		
        if (editYN != null && editYN == 'Y') {
           /* var htmlData = "";
            //var wsobject = new WSObject();
            setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
            setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
            //wsobject.callGenerate();
            htmlData = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA");
            if (htmlData.length == 0) {
                htmlData = getHtmlStringForTextEditor();
            }
            console.log("HTML DATA", htmlData);
            showTextEditorPopup(htmlData, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA') */
			
			
			
			if(commType =='L'){
				var mailType ='T';
				var strURL="/collections/generateMailPreviewAction.do?iAgreementSeqNo="+iAgrSeqNo+"&strMailCode="+strMailCode+"&strMailType="+mailType;
				var OBJxml =fetchData(strURL, "");

               /* var html = session.getAttribute("OUTPUT_FORMAT_0");
                console.log("NEW HTML = "+html);
				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'PDF', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', 'L');
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/> </filter>');
				callGenerate(); 
				*/
				
				var szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				var accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				console.log("Template Access Data", accessData);
				var objaccData = eval("accessData = " + accessData);
				var htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}
				
				
				console.log("HTML DATA", htmlDataVal);
				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA',true)
				
			}else{
				var mailType = '';
				if(commType =='E'){
					mailType ='M';
				}else{
					mailType = commType;
				}
				var strURL="/collections/generateMailPreviewAction.do?iAgreementSeqNo="+iAgrSeqNo+"&strMailCode="+strMailCode+"&strMailType="+mailType;
                var OBJxml =fetchData(strURL, "");
				
				var szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				var accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				console.log("Template Access Data", accessData);
				var objaccData = eval("accessData = " + accessData);
				var htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}
				
				
				console.log("HTML DATA", htmlDataVal);
				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA',true)
			}

       
			
			
        } else {
			if(commType =='L'){
				var mailType ='T';
				var strURL="/collections/generateMailPreviewAction.do?iAgreementSeqNo="+iAgrSeqNo+"&strMailCode="+strMailCode+"&strMailType="+mailType;
				var OBJxml =fetchData(strURL, "");

               /* var html = session.getAttribute("OUTPUT_FORMAT_0");
                console.log("NEW HTML = "+html);
				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'PDF', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', 'L');
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/> </filter>');
				callGenerate(); 
				*/
				
				var szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				var accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				console.log("Template Access Data", accessData);
				var objaccData = eval("accessData = " + accessData);
				var htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}
				
				
				console.log("HTML DATA", htmlDataVal);
				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA',true)
				
			}else{
				var mailType = '';
				if(commType =='E'){
					mailType ='M';
				}else{
					mailType = commType;
				}
				var strURL="/collections/generateMailPreviewAction.do?iAgreementSeqNo="+iAgrSeqNo+"&strMailCode="+strMailCode+"&strMailType="+mailType;
                var OBJxml =fetchData(strURL, "");
				
				var szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				var accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				console.log("Template Access Data", accessData);
				var objaccData = eval("accessData = " + accessData);
				var htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}
				
				
				console.log("HTML DATA", htmlDataVal);
				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA',true)
			}

       }
    } catch (e) {
        console.log(e);
    }

}
function onScreenLoad() {	
	var icustomerseq = getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");
	var query= "&icustomerseq="+icustomerseq;	
	var cst = fetchData("/"+GlobalHelper.menuContext+"/secure/BRMS.do?_pn=fetch_mailcode_access&_en=onLoad",query);
    var obj = eval("cst = " + cst);	
	if(obj.fetchMailPrefLang.rows[0] != undefined)
	{
    setValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CUSTPREFLANG",obj.fetchMailPrefLang.rows[0].SZDESC);		
	}
	
	try{
		var bufferemails = new Array();
		let arremails = new Array();
		if(obj.fetchemails.rows[0] != undefined)
		{
			var length = obj.fetchemails.rows.length
			for (var i = 0; i < length; i++) {
			if(obj.fetchemails.rows[i].SZMAILID != undefined)
			{
				arremails = '{code: \"'+obj.fetchemails.rows[i].SZMAILID+'\" ,description: \"'+obj.fetchemails.rows[i].SZMAILID+'\"}';
				var arrobj =  eval('arremails = '+arremails);
				console.log("test json:-",arremails,arrobj);
				bufferemails.push(arremails);
			}
		}	
		populateDropdown("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CUSTEMAIL",bufferemails);
		}
	}catch(e){}
	
	
	try{
		var buffer = new Array();
		let arr = new Array();
		if(obj.fetchMailMobNo.rows[0] != undefined)
		{
		var length = obj.fetchMailMobNo.rows.length
		for (var i = 0; i < length; i++) {
			if(obj.fetchMailMobNo.rows[i].MOBILENO != undefined)
			{
				arr = '{code: \"'+obj.fetchMailMobNo.rows[i].MOBILENO+'\" ,description: \"'+obj.fetchMailMobNo.rows[i].MOBILENO+'\"}';
				var arrobj =  eval('arr = '+arr);
				console.log("test json:-",arr,arrobj);
				buffer.push(arr);	
			}
		}	
			populateDropdown("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CUSTMOBILES",buffer);
		}
	}catch(e){}
}
function notes()
{
	debugger;
	
	 var notes = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.NTS1");	
	
	if(notes.includes("/")||notes.includes("\\")){
		addCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLML1.NTS1', ['"/ and \\ "characters are not allowed in Notes']);
        window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;		
	}else{
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLML1.NTS1',['"/ and \\ "characters are not allowed in Notes']);
	} 
	
}

