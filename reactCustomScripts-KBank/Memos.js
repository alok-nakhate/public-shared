function onScreenPreSave() {
    try {
        //Notes Validation
        let notes1 = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS");
        let notes2 = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NOTES2");

        if ((notes1.length > 0) && (notes1.length > 1000)) {
            addCustomeErrormessages(undefined, ['You have inserted ' + notes1.length + ' characters in Notes1 but max allowed characters are 1000 only']);
            window.presavecustomdata[0] = true;
            window.presavecustomdata[1] = null;
            return presavecustomdata;

        } else {
            removeCustomeErrormessages(undefined, ['You have inserted ' + notes1.length + ' characters in Notes1 but max allowed characters are 1000 only']);
        }

        if ((notes2.length > 0) && (notes2.length > 1000)) {
            addCustomeErrormessages(undefined, ['You have inserted ' + notes2.length + ' characters in Notes2 but max allowed characters are 1000 only']);
            window.presavecustomdata[0] = true;
            window.presavecustomdata[1] = null;
            return presavecustomdata;
        } else {
            removeCustomeErrormessages(undefined, ['You have inserted ' + notes2.length + ' characters in Notes2 but max allowed characters are 1000 only']);
        }

        notes1 = null;
        notes2 = null;

    } catch (e) {
        console.error(e);
    }

}
function FetchNotes() {

    let Checkbox = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CSTCKYNT");
    let radiovalue = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CCCNTCSTLVL");

    if (Checkbox == 'Y' && radiovalue.length > 0) {
        let query = "iAgreementSeqNo=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
        let cst;
        let obj;
        if (radiovalue == 'C') {
            cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadCust", query);
            obj = eval("cst = " + cst);
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", obj.fetch_CustomerStickyNotes.rows[0]['SZSTICKYNOTE']);
        } else if (radiovalue == 'A') {
            cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadAcc", query);
            obj = eval("cst = " + cst);
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", obj.fetch_AccountStickyNotes.rows[0]['SZSTICKYNOTE']);
        }
        cst = null;
        obj = null;
    }
    if (Checkbox != 'Y' && radiovalue.length > 0) {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", "");
    }
}

function FetchCurrentNotes() {

    let Checkbox = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CSTCKYNT");
    let radiovalue = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.CCCNTCSTLVL");
    let NotesValue = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS");

    if (Checkbox == 'Y' && radiovalue.length > 0) {
        let query = "iAgreementSeqNo=" + getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
        let cst;
        let obj;
        if (radiovalue == 'C') {
            cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadCust", query);
            obj = eval("cst = " + cst);
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", obj.fetch_CustomerStickyNotes.rows[0]['SZSTICKYNOTE']);
            if (NotesValue != undefined || NotesValue != null || NotesValue != "") {
                setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", obj.fetch_CustomerStickyNotes.rows[0]['SZSTICKYNOTE'] + " " + NotesValue);
            }
        } else if (radiovalue == 'A') {
            cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=FetchMemoNotes&_en=onLoadAcc", query);
            obj = eval("cst = " + cst);
            setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", obj.fetch_AccountStickyNotes.rows[0]['SZSTICKYNOTE']);
            if (NotesValue != undefined || NotesValue != null || NotesValue != "") {
                setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", obj.fetch_AccountStickyNotes.rows[0]['SZSTICKYNOTE'] + " " + NotesValue);
            }
        }
        cst = null;
        obj = null;
    }
    if (Checkbox != 'Y' && radiovalue.length > 0) {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS", "");
    }
}
function notes() {

    let notes = getValue("DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS");

    if (notes.includes("/") || notes.includes("\\")) {
        addCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS', ['"/ and \\ "characters are not allowed in Notes']);
        window.presavecustomdata[0] = true;
        window.presavecustomdata[1] = null;
    } else {
        removeCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_COLCSTMRNTS_DTLS.NTS', ['"/ and \\ "characters are not allowed in Notes']);
    }

    notes = null;
}
