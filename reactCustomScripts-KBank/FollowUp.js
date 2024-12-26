/* function onScreenLoad() {
    var temp = GlobalHelper.globlevar['FETCH_VIEW_PROMISE'];
    console.log(GlobalHelper.globlevar);
    console.log("temp", temp);
    let result = JSON.parse(temp);
    console.log("Result In On Load Util", result);
    if (typeof result === typeof {}) {
        let res33 = Object.keys(result);
        if (res33.length == 0) {
            str.screendata[1].sectionButton.applicable = "false";
        }
    }
} */

function onScreenPreSave(str) {
	debugger;
	try{
		
		
		
		//Notes Validation
		var notes1 = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.RMRK2");	
		var notes2 = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.SZREMARK2");
		
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
		 
		var AccountNumber = getValue('DESIGNER_COLAGRMNT.LGCYGRMNTN')[0];
		setClipsearchValue(AccountNumber,'HF92');
		
		window.presavecustomdata[0] = false;
		window.presavecustomdata[1] = str;
		return presavecustomdata;
		 
	} catch (e) {
	    console.error(e);
	} finally {}
	 
}
function onScreenPostSave(str){
	//alert('1');
	var AccountNumber = getValue('DESIGNER_COLAGRMNT.LGCYGRMNTN')[0];
	searchValueInClipSearch(AccountNumber,'HF92');
}
function clearSchedule(xpath,value,props) {
	    let mainJson = GlobalHelper.globlevar['UIScreenLayoutJson'];
		for(let j = 0 ; j <  mainJson.names.data[0].name.screendata.length  ; j++){
			 if( mainJson.names.data[0].name.screendata[j].sessionID == '467e48dccf6448f6ba77f1cf32d71645') {
				 mainJson.names.data[0].name.screendata[j].formData[0]['467e48dccf6448f6ba77f1cf32d71645'].data.DataSource = [];
			 } 
		}
	}

function GenrateShedule(buttonId,props){
	debugger;
	clearSchedule();
	var strPromiseStart = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.PROMISESTRTDT");
	var strFrequency = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.PTPFREQUENCY");
	var strPromiseAmt = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.PROMISEAMT");
	if(strPromiseAmt<=0)
	{
	 addCustomeErrormessages(undefined, ['Please Enter Promise Amount greater than 0']);
     return;	 
	}
	
	var strNoOfPromise = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.NOOFPROMISE");
	var gridModeLength ;
	let mainJson =  props.namess;
	
	if(strPromiseStart === null  || strPromiseStart == '' || strPromiseStart == undefined ){
				removeCustomeErrormessages(undefined, ['Please Enter No Of Promise']);
				removeCustomeErrormessages(undefined, ['Please Enter Frequency']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Amount']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Start Date']);
				addCustomeErrormessages(undefined, ['Please Enter Promise Start Date']);
				return;
	}else if(strFrequency === null  || strFrequency == '' || strFrequency == undefined ){
				removeCustomeErrormessages(undefined, ['Please Enter No Of Promise']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Start Date']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Amount']);
				removeCustomeErrormessages(undefined, ['Please Select Frequency']);
				addCustomeErrormessages(undefined, ['Please Enter Frequency']);
				return;
	}else if(strPromiseAmt === null  || strPromiseAmt == '' || strPromiseAmt == undefined ){
				removeCustomeErrormessages(undefined, ['Please Enter No Of Promise']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Start Date']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Amount']);
				removeCustomeErrormessages(undefined, ['Please Select Frequency']);
				addCustomeErrormessages(undefined, ['Please Enter Promise Amount']);
				return;
	}else if(strNoOfPromise === null  || strNoOfPromise == '' || strNoOfPromise == undefined ){
				removeCustomeErrormessages(undefined, ['Please Enter No Of Promise']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Start Date']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Amount']);
				removeCustomeErrormessages(undefined, ['Please Select Frequency']);
				addCustomeErrormessages(undefined, ['Please Enter No Of Promise']);
				return;
	}else {
				removeCustomeErrormessages(undefined, ['Please Enter No Of Promise']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Start Date']);
				removeCustomeErrormessages(undefined, ['Please Enter Promise Amount']);
				removeCustomeErrormessages(undefined, ['Please Select Frequency']);
				
	}
	
	   if(strPromiseStart.length >= 10) {
		var m_arrDate1 = strPromiseStart.split("/");
		var m_DAY1 = m_arrDate1[0];
		var m_MONTH1 = m_arrDate1[1];
		var m_YEAR1 = m_arrDate1[2];
		var promiseDT = '';
		var promiseMth = '';
		var freq = 0;
		var dtCh= null;
		
		if(strFrequency == 'M')
			freq = 1;
		else if(strFrequency == 'Q')
			freq = 3;
		else if(strFrequency == 'Y')
			freq = 12;
		else if(strFrequency == 'H')
			freq = 6;
		else if(strFrequency == 'D')
			freq = 1;
		else if(strFrequency == 'W')
			freq = 7;
		var curDate = new Date(m_YEAR1,m_MONTH1-1,m_DAY1);
		var num = strNoOfPromise
		//Extract the separator from strDateFormat
		if(strPromiseStart.indexOf('/') > 0)
			dtCh ="/";
		else if(strPromiseStart.indexOf('.') > 0)
			dtCh =".";
		else if(strPromiseStart.indexOf('-') > 0)
			dtCh ="-";
		
		for(i=0;i< num;i++) {
			if(curDate.getDate() < 10 )
				promiseDT = "0"+curDate.getDate();
			else
				promiseDT = curDate.getDate();
			if(curDate.getMonth() < 9 )
				promiseMth = "0"+(curDate.getMonth()+1);
			else
				promiseMth = curDate.getMonth()+1;
			
				addEmptyRowInGrid("DESIGNER_COLAGRMNT.DESIGNER_PROMISE_GRID");
				strPromiseStart = promiseDT+dtCh+promiseMth+dtCh+curDate.getFullYear();
				setValue("DESIGNER_COLAGRMNT.DESIGNER_PROMISE_GRID.DTPRMS[" + i + "]", strPromiseStart + "");
				setValue("DESIGNER_COLAGRMNT.DESIGNER_PROMISE_GRID.FPYMNTMT[" + i + "]", strPromiseAmt + "");
				
				if(strFrequency == 'D' || strFrequency == 'W'){
				curDate.setDate(curDate.getDate() + freq);
			    }else{
				curDate.setMonth(curDate.getMonth() + freq);
				}
			}
	}
	return false;
							
}
function AddressChange() {
    var Iagreementseqno = getValue("DESIGNER_COLAGRMNT.COLAGRMNT_AGRMNTSQN");
    var Szaddresstype = getValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.HVSTRQST_ADDRSSTYP");
    var query = "iagreementseqno=" + Iagreementseqno + "&Szaddresstype=" + Szaddresstype;
    var cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=populatePickupAddressDetails&_en=onLoad", query);
    var obj = eval("cst = " + cst);
	if (obj.fetch_screendata.rows[0] != undefined) {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.PHN", obj.fetch_screendata.rows[0].SZPHONE1);
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.MBL", obj.fetch_screendata.rows[0].SZMOBILENO);
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.CONTACTPERSON", obj.fetch_screendata.rows[0].SZCONTACTPERSON);
        let address = obj.fetch_screendata.rows[0].SZADDRESS1;
        if (obj.fetch_screendata.rows[0].SZADDRESS2 !== undefined) {
            address = address + " " + obj.fetch_screendata.rows[0].SZADDRESS2;
        }
        if (obj.fetch_screendata.rows[0].SZAREA !== undefined) {
            address = address + " " + obj.fetch_screendata.rows[0].SZAREA;
        }
        if (obj.fetch_screendata.rows[0].SZCITY !== undefined) {
            address = address + " " + obj.fetch_screendata.rows[0].SZCITY;
        }
        if (obj.fetch_screendata.rows[0].SZZIP !== undefined) {
            address = address + " " + obj.fetch_screendata.rows[0].SZZIP;
        }
        if (obj.fetch_screendata.rows[0].SZSTATE !== undefined) {
            address = address + " " + obj.fetch_screendata.rows[0].SZSTATE;
        }
        if (obj.fetch_screendata.rows[0].SZCOUNTRY !== undefined) {
            address = address + " " + obj.fetch_screendata.rows[0].SZCOUNTRY;
        }
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.DDRSS", address);
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.ADDRSSSQN", obj.fetch_screendata.rows[0].IADDRESSSEQ);
        //  setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.VSTFRMT",obj.fetch_screendata.rows[0].SZADDRESS3);
        //  setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.PCKPCLLCTR",obj.fetch_screendata.rows[0].SZZIP);
        //  setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.PCKPCLLCTRGRP",obj.fetch_screendata.rows[0].SZCOUNTRY);
        //  setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.DDRSS",obj.fetch_screendata.rows[0].SZPHONE1);
    } else {
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.PHN", "");
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.MBL", "");
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.DDRSS", "");
        setValue("DESIGNER_COLAGRMNT.DESIGNER_HVSTRQST_PND_FETCH.CONTACTPERSON", "");
    }
}
function PopulateLinkDetails() {
	     console.log("saurabh " + GlobalHelper.globlevar['jsonObjgetData']);
        console.log("VIEW Link Details");
        //console.log(JSON.parse(GlobalHelper.globlevar['jsonObjgetData']));
        var linkdetails = JSON.parse(GlobalHelper.globlevar['jsonObjgetData'])["'FETCH_VIEW_PROMISE'"].result[0];
        var temp = JSON.stringify(linkdetails); //.FETCH_VIEW_PROMISE.result[0];

        console.log("VIEW Link Details", temp);

        let result = linkdetails;
        var sData, sInfo1, sInfo2, sInfo3, sInfo4, sInfo5, sInfo6, sInfo7, sInfo8, sInfo9, sInfo10, sInfo11, sInfo12,sInfo13,sInfo14;
        var iCnt = 1;
        console.log("result=", result, "typeof result==>", typeof result);
        if (typeof result === typeof {}) {
            let res33 = Object.keys(result);
            if (res33.length == 0) {
                console.log("else", result);
				displayHTMLContents('Policy Details',"No policy Configured");   

            } else {
                console.log("if", result);
                eval('sData=' + temp);
                for (var key in sData) {
                    eval("sInfo" + iCnt + " = '" + key + " : " + sData[key] + "'");
                    iCnt++;
                }
			var content = "<div> <p>"+sInfo1+"</p> <p>"+sInfo2+"</p> <p>"+sInfo3+"</p> <p>"+sInfo4+"</p> <p>"+sInfo5+"</p> <p>"+sInfo6+"</p> <p>"+sInfo7+"</p> <p>"+sInfo8+"</p> <p>"+sInfo9+"</p> <p>"+sInfo10+"</p> <p>"+sInfo11+"</p> <p>"+sInfo12+"</p> <p>"+sInfo13+"</p><p>"+sInfo14+"</p></div>";
					displayHTMLContents('Policy Details',content);
				  }
		}
		else
		{

		}
}
function notes()
{
	debugger;
	
	 var notes = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.RMRK2");	
	
	if(notes.includes("/")||notes.includes("\\")){
		addCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.RMRK2', ['"/ and \\ "characters are not allowed in Notes']);
        window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;		
	}else{
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.RMRK2',['"/ and \\ "characters are not allowed in Notes']);
	} 
	
}
function deliquencydate()
{
	debugger;
	
	 var delreason = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.DLNQNCYRSN1");
	 var deldate = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.DTDELQDATE");
	 if(deldate=='' || deldate == null){
		 if(delreason != '' || delreason != null)
		{
		 cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=populatePickupAddressDetails&_en=onLoad");
			console.log("cst =", cst);
            obj = eval("cst = " + cst);
				if(obj.fetch_businessdate.rows[0] != ''){
					//alert(obj.fetch_businessdate.rows[0].BUSSDATE);
				setValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.DTDELQDATE", obj.fetch_businessdate.rows[0].BUSSDATE);
				}
		}
	 }
}
function incomingReasnDate()
{
	debugger;
	
	 var incCallReason = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.SZINCOMEREASON");
	 var reanDate = getValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.DTREASONDATE");
	 if(reanDate=='' || reanDate == null){
		 if(incCallReason != '' || incCallReason != null)
		{
		 cst = fetchData("/" + GlobalHelper.menuContext + "/secure/BRMS.do?_pn=populatePickupAddressDetails&_en=onLoad");
			console.log("cst =", cst);
            obj = eval("cst = " + cst);
				if(obj.fetch_businessdate.rows[0] != ''){
					//alert(obj.fetch_businessdate.rows[0].BUSSDATE);
				setValue("DESIGNER_COLAGRMNT.DESIGNER_FOLLOWUP.DTREASONDATE", obj.fetch_businessdate.rows[0].BUSSDATE);
				}
		}
	 }
}

function PasteClipSrchValue()
{ debugger;
	try{
				var AccountNumber = getValue('DESIGNER_COLAGRMNT.LGCYGRMNTN')[0];
				setClipsearchValue(AccountNumber,'HF92');
	} catch(e){}
}

function notesvalidation()
{
	debugger;
	
	
}