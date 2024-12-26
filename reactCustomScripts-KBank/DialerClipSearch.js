//receiveDialerInfo();
setInterval(receiveDialerInfo, 3000);
function receiveDialerInfo() {
    var isNewAcc = getCookie("isNewAcc");
    var agreementNo = getCookie("accountNum");
	var isNewCust = getCookie("isNewCust");
    var customerNo = getCookie("customerNum");
    if (agreementNo && isNewAcc && isNewAcc == "Y" && agreementNo !=  getCookie("dialerAgrConn") && getCookie("isAgrClipSearchDone") != 'Y') {
        setCookie("isAgrClipSearchDone", "Y");
        setCookie("dialerAgrConn", agreementNo);
		setCookie("isCustClipSearchDone", "N");
        setCookie("dialerCustConn", "");

        try{
            setClipsearchValue(agreementNo,'HF92');} catch(e){}
            searchValueInClipSearch(agreementNo,'HF92');
    }
	
	if (customerNo && isNewCust && isNewCust == "Y" && customerNo !=  getCookie("dialerCustConn") && getCookie("isCustClipSearchDone") != 'Y') {
        setCookie("isCustClipSearchDone", "Y");
        setCookie("dialerCustConn", customerNo);
		setCookie("isAgrClipSearchDone", "N");
        setCookie("dialerAgrConn", "");
        try{
            setClipsearchValue(customerNo,'HF104');} catch(e){}
            searchValueInClipSearch(customerNo,'HF104');
    }
    //setTimeout(receiveDialerInfo, 1500);
	return null;
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}