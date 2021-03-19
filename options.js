function add_header_row(token,spreadsheetID)	{
	$.ajax("https://sheets.googleapis.com/v4/spreadsheets/"+spreadsheetID+"/values/A1?valueInputOption=USER_ENTERED",
	{
		type: 'PUT',
		contentType: "application/json",
		headers: {"Authorization":"Bearer "+ token},
		data: JSON.stringify(
		{
  			"range": "A1",
  			"majorDimension": "ROWS",
  			"values": [
    					["SNo.", "FPS ID", "FPS Name", "Amount Deposited","Bank Name","Bank Branch","Payment Date","Payment Mode","Godown","AAY Quantity","PH Quantity","Total Quantity"],
    				  ]
		})
	});
}

$(function()	{
	chrome.storage.sync.get(["email","distribution_cycle"],function(synced_data)	{
		$("#email_field").val(synced_data.email);
		$("#distribution_cycle").val(synced_data.distribution_cycle);
	});
	
	$("#authorize").click(function()	{
		var email = $("#email_field").val();
		var distribution_cycle = $("#distribution_cycle").val();
		
		if(email && distribution_cycle)	{
			chrome.identity.getAuthToken({'interactive': true}, function(token) {
				
  				$.ajax("https://sheets.googleapis.com/v4/spreadsheets/",
  					{	type:'POST',
  						dataType: 'json',
  		  	  		        contentType: "application/json",
  						headers:{"Authorization":"Bearer "+token,
  							 },
  						data:JSON.stringify(
							{"properties":
								{"title":distribution_cycle + "_DO Details"},
							"sheets":[
									{"properties":
										{"title":"Delivery Order Information"}
									}
								]
							}
						),
  						error: function(xhr, status, error) {
							 console.log(xhr.responseText);
						},
  						success: function(data)	{
  							add_header_row(token,data.spreadsheetId);
  							
  							chrome.storage.sync.set({
  								"email":email,
  								"distribution_cycle":distribution_cycle,
  								"sheet_id":data.spreadsheetId,
  								"sheet_url":data.spreadsheetUrl,
  								"token":token
  							},function()	{
  								var notifOptions = {
									type:'basic',
									iconUrl:'icon.png',
									title:'Save to Sheet',
									message:'Authorised. Link of Google Sheets is available in Popup'
								};
						      		chrome.notifications.create('configNotif',notifOptions);
						      	
  							});
  						}
  					});
			});
		}
	});
	
	$("#clear").click(function()	{
		
		chrome.storage.sync.remove(["email","distribution_cycle","sheet_id","sheet_url"],function()	{
			$("#email_field").val('');
			$("#distribution_cycle_field").val('');
			
			var notifOptions = {
					type:'basic',
					iconUrl:'icon.png',
					title:'Save to Sheet',
					message:'Settings of Save to Sheet Extension cleared.'
				};
				chrome.notifications.create('configNotif',notifOptions,function()	{
					//close();
				});
		});
	});
});
