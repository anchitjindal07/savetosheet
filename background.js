$(function()	{
	chrome.storage.sync.get(["email","distribution_cycle","sheet_url"],function(synced_data)	{
		if(typeof synced_data.email === 'undefined')	{
			$("#notsynced").css("display","block");
		}
		else	{
			$("#synced").css("display","block");
			$("#email_span").text(synced_data.email);
			$("#distribution_cycle_span").text(synced_data.distribution_cycle);
			$("a").prop("href",synced_data.sheet_url);
			
			$("a").click(function()	{
				 chrome.tabs.create({url: synced_data.sheet_url});
			});
		}
	});
	
});
