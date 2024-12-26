function notes() {

	if (getValue("DESIGNER_COLAGRMNT.DESIGNER_ESCLTNDTLS_EDIT.NTS4").includes("/") || getValue("DESIGNER_COLAGRMNT.DESIGNER_ESCLTNDTLS_EDIT.NTS4").includes("\\")) {

		addCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_ESCLTNDTLS_EDIT.NTS4', ['"/ and \\ "characters are not allowed in Notes']);

		window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;
	} else {
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.DESIGNER_ESCLTNDTLS_EDIT.NTS4', ['"/ and \\ "characters are not allowed in Notes']);
	}

}