function onScreenPreSave()
{
	debugger;
	try{		
		
		//Notes Validation
		var notes1 = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS");	
		var notes2 = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NOTES2");
		
		if((notes1.length > 0) && (notes1.length > 1000)){
			addCustomeErrormessages(undefined, ['You have inserted '+notes1.length+' characters in Notes1 but max allowed characters are 1000 only']);
	       window.presavecustomdata[0] = true;
			window.presavecustomdata[1] = null;	
			return presavecustomdata;
			
		}else{
			removeCustomeErrormessages(undefined,['You have inserted '+notes1.length+' characters in Notes1 but max allowed characters are 1000 only']);
		} 
		
		if((notes2.length > 0) && (notes2.length > 1000)){
			addCustomeErrormessages(undefined, ['You have inserted '+notes2.length+' characters in Notes2 but max allowed characters are 1000 only']);
	       window.presavecustomdata[0] = true;
			window.presavecustomdata[1] = null;	
			return presavecustomdata;
		}else{
			removeCustomeErrormessages(undefined,['You have inserted '+notes2.length+' characters in Notes2 but max allowed characters are 1000 only']);
		}
		
	} catch (e) {
	    console.error(e);
	} finally {}
	
}
function FetchNotes() {
    let Checkbox = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CSTCKYNT");
    var radiovalue = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CCCNTCSTLVL");
    if (Checkbox == 'Y' && radiovalue.length > 0) {
        var iAgreementSeqNo = getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
        var query = "iAgreementSeqNo=" + iAgreementSeqNo;
        var cst;
        var obj;
        if (radiovalue == 'C') {
			cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadCust", query);
            console.log("cst =", cst);
            obj = eval("cst = " + cst);
            let Notes = obj.fetch_CustomerStickyNotes.rows[0]['SZSTICKYNOTE'];
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", Notes);
        }
        if (radiovalue == 'A') {
            cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadAcc", query);
            var obj = eval("cst = " + cst);
            let Notes = obj.fetch_AccountStickyNotes.rows[0]['SZSTICKYNOTE'];
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", Notes);
        }
    }
    if (Checkbox != 'Y' && radiovalue.length > 0) {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", "");
    }
}
function FetchCurrentNotes() {
    let Checkbox = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CSTCKYNT");
    var radiovalue = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CCCNTCSTLVL");
    var NotesValue = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS");
     if (Checkbox == 'Y' && radiovalue.length > 0) {
        var iAgreementSeqNo = getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
        var query = "iAgreementSeqNo=" + iAgreementSeqNo;
        var cst;
        var obj;
        if (radiovalue == 'C') {
			cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadCust", query);
            console.log("cst =", cst);
            obj = eval("cst = " + cst);
            let Notes = obj.fetch_CustomerStickyNotes.rows[0]['SZSTICKYNOTE'];
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", Notes);
            if (NotesValue != undefined || NotesValue != null || NotesValue != "") {
                var finalNotes = Notes + " " + NotesValue;
                setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", finalNotes);
            }
        }
        if (radiovalue == 'A') {
            cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadAcc", query);
            var obj = eval("cst = " + cst);
            let Notes = obj.fetch_AccountStickyNotes.rows[0]['SZSTICKYNOTE'];
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", Notes);
            if (NotesValue != undefined || NotesValue != null || NotesValue != "") {
                var finalNotes = Notes + " " + NotesValue;
                setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", finalNotes);
            }
        }
    }
    if (Checkbox != 'Y' && radiovalue.length > 0) {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", "");
    }
}
function notes()
{
	debugger;
	
	 var notes = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS");	
	
	if(notes.includes("/")||notes.includes("\\")){
		addCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS', ['"/ and \\ "characters are not allowed in Notes']);
        window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;		
	}else{
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS',['"/ and \\ "characters are not allowed in Notes']);
	} 
	
}
