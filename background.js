$(function()	{
	chrome.storage.sync.get("email",function(synced_data)	{
		if(typeof synced_data.email === 'undefined')	{
			$("#notsynced").css("display","block");
		}
		else	{
			$("#synced").css("display","block");
			$("#email_span").text(synced_data.email);
		}
	});
	
	$("#authorize").click(function()	{
		$("#email").val("anchitjindal07@gmail.com");
	});
});
