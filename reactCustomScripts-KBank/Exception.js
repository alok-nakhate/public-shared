function onScreenPreSave(str) {

	if (getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.EXCPTN") == "Y" && (getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.SPCLCD") == null || getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.SPCLCD") == "")) {

		addCustomeErrormessages(undefined, ['Please select Special Code.']);
		window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;
	}
	return presavecustomdata;
}

function notes() {

	if (getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE").includes("/") || getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE").includes("\\")) {
		addCustomeErrormessages('DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE', ['"/ and \\ "characters are not allowed in Notes']);
		window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;
	} else {
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE', ['"/ and \\ "characters are not allowed in Notes']);
	}

}