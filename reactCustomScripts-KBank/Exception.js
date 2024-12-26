function onScreenPreSave(str) {
	var EXCPTN = getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.EXCPTN");
	var SPCLCD = getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.SPCLCD");
	if( EXCPTN == "Y" && (SPCLCD == null || SPCLCD ==""	) ){
		addCustomeErrormessages(undefined, ['Please select Special Code.']);	
		window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;
	}	
	return presavecustomdata;
} 
function notes()
{
	debugger;
	
	 var notes = getValue("DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE");	
	
	if(notes.includes("/")||notes.includes("\\")){
		addCustomeErrormessages('DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE', ['"/ and \\ "characters are not allowed in Notes']);
        window.presavecustomdata[0] = true;
		window.presavecustomdata[1] = null;		
	}else{
		removeCustomeErrormessages('DESIGNER_COLAGRMNT.EXCLUSION_CASE.SZREMARKCASE',['"/ and \\ "characters are not allowed in Notes']);
	} 
	
}