function onScreenLoad() {

}

function ExecutionActivity() {

	let iagreement = getValue("DESIGNER_COLAGRMNT.OLD_LPM_AGREEMENT.GRMNTN_3E8MJMN[" + (getIndexOfChangedEditableRow() - 1) + "]");
	try {
		setClipsearchValue(iagreement, 'HF92');
	} catch (e) { }
	searchValueInClipSearch(iagreement, 'HF92');
}
