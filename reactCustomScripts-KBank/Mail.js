function checkMailCodeEvent() {
	if (getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA").length != 0) {
		setValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA", "");
	}
}

function openTemplateEditor() {

	try {
		let editYN = 'N';
		// var userName = GlobalHelper.contextSetting.USERCODE;
		let strMailCode = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.COLML_MLCD");
		let strMailCodeType = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CMLTYP");
		let commType = 'L';

		if (strMailCode == "" || strMailCode == null || strMailCode.length == 0) {
			return (
				displayMessageBox("Error", "Please Select Mail Code", "E")
			)
		}
		if (strMailCodeType == "" || strMailCodeType == null || strMailCodeType.length == 0) {
			return (
				displayMessageBox("Error", "Please Select Mail Type", "E")
			)
		} else {
			commType = strMailCodeType[0];
		}
		if (commType == 'M') {
			commType = 'E';
		} else if (commType == 'T') {
			commType = 'L';
		}

		if (strMailCode.length > 0) {

			let condiion = "templateid=" + strMailCode;
			let LetterExistYN = "Y"; let letterData; let letterExistFlagData;
			if (commType == 'E') {
				letterData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=checkhasemailcontent", condiion);
				letterExistFlagData = eval("letterData=" + letterData);
				if (letterExistFlagData.fetch_emailexistyn.rows[0] != undefined) {
					LetterExistYN = letterExistFlagData.fetch_emailexistyn.rows[0]['CEMAILTEMPEXISTYN'];
					if (LetterExistYN != null && LetterExistYN == 'N') {
						return (
							displayMessageBox("Error", "Email Content Not Defined For This Mail Code", "E")
						)
					}
				}
			} else if (commType == 'S') {
				letterData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=checkhassmscontent", condiion);
				letterExistFlagData = eval("letterData=" + letterData);
				if (letterExistFlagData.fetch_smsexistyn.rows[0] != undefined) {
					LetterExistYN = letterExistFlagData.fetch_smsexistyn.rows[0]['CSMSTEMPEXISTYN'];
					if (LetterExistYN != null && LetterExistYN == 'N') {
						return (
							displayMessageBox("Error", "SMS Content Not Defined For This Mail Code", "E")
						)
					}
				}
			} else if (commType == 'L') {
				letterData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=checkhaslettercontent", condiion);
				letterExistFlagData = eval("letterData=" + letterData);
				if (letterExistFlagData.fetch_letterexistyn.rows[0] != undefined) {
					LetterExistYN = letterExistFlagData.fetch_letterexistyn.rows[0]['CLETTERTEMPEXISTYN'];
					if (LetterExistYN != null && LetterExistYN == 'N') {
						return (
							displayMessageBox("Error", "Letter Content Not Defined For This Mail Code", "E")
						)
					}
				}
			}
			letterData = null;
			letterExistFlagData = null;
		}

		let iAgrSeqNo = getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
		let szConditiontype = "templateid=_MAIL_" + strMailCode + "&userid=" + GlobalHelper.contextSetting.USERCODE;
		let accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchaccess", szConditiontype);
		let objaccData = eval("accessData = " + accessData);
		let htmlDataVal;

		if (objaccData.fetch_accessbyprofile.rows[0] != undefined) {
			editYN = objaccData.fetch_accessbyprofile.rows[0]['EDITFLAG'];
		}

		if (editYN != null && editYN == 'Y') {

			if (commType == 'L') {

				szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				objaccData = eval("accessData = " + accessData);
				htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}
				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA', true)

			} else {

				szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				objaccData = eval("accessData = " + accessData);
				htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}

				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA', true)
			}
		} else {
			if (commType == 'L') {

				szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				objaccData = eval("accessData = " + accessData);
				htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}

				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA', true)

			} else {

				szConditiontype = "IAGREEMENTSEQNO=" + iAgrSeqNo;
				accessData = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=fetchClob", szConditiontype);
				objaccData = eval("accessData = " + accessData);
				htmlDataVal = objaccData.fetch_getClob.rows[0]['SZMAILPREVIEWHTML'];

				setParameter(strMailCode, 'S', 'OT', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'ACEF8FF436AF4DD09C83596B5F5E70AC', 'HTML', 'L', 'A4', 'A', 'ONLINE', 'Y', 'flt1', '', 'Template', 'N', '', 'N', 'N', 'N', 'T', commType);
				setFltXml('<filter type="AND"><condition attribute="SZAGREEMENTNO" operator="equals" value=' + '"' + iAgrSeqNo + '"' + ' hidden="N" /> <condition attribute="IMAILSEQNO" operator="equals" value="0" hidden="N"/></filter>');
				if (htmlDataVal.length == 0) {
					htmlDataVal = getHtmlStringForTextEditor();
				}

				showTextEditorPopup(htmlDataVal, 'DESIGNER_COLAGRMNT.DESIGNER_COLML1.TEMPLATEDATA', true)
			}
		}
		accessData = null;
		objaccData = null;
		htmlDataVal = null;
	} catch (e) {
		console.log(e);
	}
}

function onScreenLoad() {

	let query = "&icustomerseq=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_CSTMRSQN");
	let cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=fetch_mailcode_access&_en=onLoad", query);
	let obj = eval("cst = " + cst);

	if (obj.fetchMailPrefLang.rows[0] != undefined) {
		setValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CUSTPREFLANG", obj.fetchMailPrefLang.rows[0].SZDESC);
	}

	let buffer = new Array();
	let listArray = new Array();

	try {
		if (obj.fetchemails.rows[0] != undefined) {
			for (let i = 0; i < obj.fetchemails.rows.length; i++) {
				if (obj.fetchemails.rows[i].SZMAILID != undefined) {
					let listMails = '{code: \"' + obj.fetchemails.rows[i].SZMAILID + '\" ,description: \"' + obj.fetchemails.rows[i].SZMAILID + '\"}';
					let objMails = eval('listMails = ' + listMails);
					buffer.push(listMails);
					listMails = null;
					objMails = null;
				}
			}
			populateDropdown("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CUSTEMAIL", buffer);
		}
	} catch (e) { }

	buffer = [];
	listArray = [];

	try {
		if (obj.fetchMailMobNo.rows[0] != undefined) {
			for (let i = 0; i < obj.fetchMailMobNo.rows.length; i++) {
				if (obj.fetchMailMobNo.rows[i].MOBILENO != undefined) {
					let listMobs = '{code: \"' + obj.fetchMailMobNo.rows[i].MOBILENO + '\" ,description: \"' + obj.fetchMailMobNo.rows[i].MOBILENO + '\"}';
					let objMobs = eval('listMobs = ' + listMobs);
					buffer.push(listMobs);
					listMobs = null;
					objMobs = null;
				}
			}
			populateDropdown("DESIGNER_COLAGRMNT.DESIGNER_COLML1.CUSTMOBILES", buffer);
		}
	} catch (e) { }

	buffer = null;
	listArray = null;
}

function notes() {

	let notes = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLML1.NTS1");

	if (notes.includes("/") || notes.includes("\\")) {
		addCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLML1.NTS1', ['"/ and \\ "characters are not allowed in Notes']);
		window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;
	} else {
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLML1.NTS1', ['"/ and \\ "characters are not allowed in Notes']);
	}

}

