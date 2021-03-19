chrome.runtime.onMessage.addListener(function(request,sender,sendResponse)	{
	if(request.todo == "showPageAction")	{
		chrome.tabs.query({active:true,currentWindow:true},function(tabs)	{
			chrome.pageAction.show(tabs[0].id);
		});
	}
	if(request.todo == "refreshToken")	{
		chrome.identity.getAuthToken({'interactive': true}, function(token)	{
			chrome.storage.sync.set({"token":token});
		});
	}
});

