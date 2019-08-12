
function pptSelectionDetails() {
	var urlstr = myApp.views.main.history,
	leng = urlstr.length;
	var url = urlstr[leng - 1].split("#")[1];
    
	if(PowerPointHtml[parseInt(url)].arry.length>0)
	$(".pptSelectionDetailsContainer").html(PowerPointHtml[parseInt(url)].html);
	else if(PowerPointHtml[parseInt(url)].arry.length == 0)
	{
		$(".pptSelectionDetailsContainer").html(""); 
		noData.open();
	}   


  	
}
