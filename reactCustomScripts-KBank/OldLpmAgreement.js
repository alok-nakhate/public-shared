function onScreenLoad(){
	
}
function ExecutionActivity(){
	debugger;
	var indexOfGridRow = getIndexOfChangedEditableRow();
	var indexOfGridRow = indexOfGridRow - 1;
	
	var iagreement = getValue("DESIGNER_COLAGRMNT.OLD_LPM_AGREEMENT.GRMNTN_3E8MJMN[" +  indexOfGridRow + "]");
	try {
		setClipsearchValue(iagreement, 'HF92');
	} catch (e) {}
	searchValueInClipSearch(iagreement, 'HF92');
}
