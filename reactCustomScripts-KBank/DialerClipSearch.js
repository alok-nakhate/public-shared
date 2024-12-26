
setInterval(receiveDialerInfo, 3000);

function receiveDialerInfo() {
    let isNewAcc = getCookie("isNewAcc");
    let agreementNo = getCookie("accountNum");
    let isNewCust = getCookie("isNewCust");
    let customerNo = getCookie("customerNum");

    if (agreementNo && isNewAcc && isNewAcc == "Y" && agreementNo != getCookie("dialerAgrConn") && getCookie("isAgrClipSearchDone") != 'Y') {
        setCookie("isAgrClipSearchDone", "Y");
        setCookie("dialerAgrConn", agreementNo);
        setCookie("isCustClipSearchDone", "N");
        setCookie("dialerCustConn", "");

        try {
            setClipsearchValue(agreementNo, 'HF92');
        } catch (e) { }
        searchValueInClipSearch(agreementNo, 'HF92');
    }

    if (customerNo && isNewCust && isNewCust == "Y" && customerNo != getCookie("dialerCustConn") && getCookie("isCustClipSearchDone") != 'Y') {
        setCookie("isCustClipSearchDone", "Y");
        setCookie("dialerCustConn", customerNo);
        setCookie("isAgrClipSearchDone", "N");
        setCookie("dialerAgrConn", "");
        try {
            setClipsearchValue(customerNo, 'HF104');
        } catch (e) { }
        searchValueInClipSearch(customerNo, 'HF104');
    }
    return;
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = decodeURIComponent(document.cookie).split(';');

    for (let i = 0; i < ca.length; i++) {
        while (ca[i].charAt(0) == ' ') {
            ca[i] = ca[i].substring(1);
        }
        if (ca[i].indexOf(name) == 0) {
            return ca[i].substring(name.length, ca[i].length);
        }
    }
    return "";
}