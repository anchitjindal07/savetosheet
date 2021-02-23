chrome.runtime.sendMessage({todo:"showPageAction"});

function save_data(DO_data)	{

	chrome.storage.sync.get(["token","sheet_id"],function(data)	{
		var spreadsheetID = data.sheet_id;
		var token = data.token;
		
		$.ajax({
			url: "https://sheets.googleapis.com/v4/spreadsheets/"+spreadsheetID+"/values/A1:append?valueInputOption=USER_ENTERED",
			type: 'POST',
			contentType: "application/json",
			headers: {"Authorization":"Bearer "+ token},
			data: JSON.stringify({
				"range": "A1",
				"majorDimension": "ROWS",
				"values": [
						    [DO_data.sno, DO_data.fps_id, DO_data.fps_name, DO_data.amount, 	DO_data.bank, DO_data.bank_branch, DO_data.payment_date, DO_data.payment_mode, DO_data.godown, DO_data.aay_quantity, DO_data.ph_quantity, DO_data.total_quantity]
					  ],
				}),
			error: function(XHR, textStatus, errorThrown)	{
					if(XHR.status == 401)	{
						chrome.runtime.sendMessage({todo:"refreshToken"});
						save_data(DO_data);
					}
				}
		});
	});
}

	$("body").on("click","#ContentPlaceHolder1_btnPaymentReciept",function()	{
		var timer = setInterval(getdata,1000);
		
		function getdata()	{
		
			if($("#ContentPlaceHolder1_lblPayMsg").text()=="Data Submitted Successfully.Click on Print to get Payment Reciept.")	{					
				var DO_data = {};
						
				DO_data.sno = 1;
				DO_data.fps_id = $.trim($("#ContentPlaceHolder1_ddlFPSNo").val());
				DO_data.fps_name = $.trim($("#ContentPlaceHolder1_ddlFPSNo option:selected").text());
				DO_data.amount = $("#ContentPlaceHolder1_gvTrans").find('tr:eq(1)').find('td:eq(7)').text();
				DO_data.bank = $.trim($("#ContentPlaceHolder1_gvTrans").find('tr:eq(1)').find('td:eq(5)').text());
				DO_data.bank_branch = $.trim($("#ContentPlaceHolder1_gvTrans").find('tr:eq(1)').find('td:eq(6)').text());
				DO_data.payment_date = $("#ContentPlaceHolder1_gvTrans").find('tr:eq(1)').find('td:eq(4)').text();
				DO_data.payment_mode = $.trim($("#ContentPlaceHolder1_gvTrans").find('tr:eq(1)').find('td:eq(1)').text());
				DO_data.godown = $.trim($("label[for='ContentPlaceHolder1_rptPayment_chkComm_0']").text());
				DO_data.aay_quantity = $("#ContentPlaceHolder1_rptPayment_gvPayment_0_txtQty_0").val();
				DO_data.ph_quantity = $("#ContentPlaceHolder1_rptPayment_gvPayment_0_txtQty_1").val();
				DO_data.total_quantity = DO_data.aay_quantity + DO_data.ph_quantity;
					
				save_data(DO_data);
					
				clearInterval(timer);
			}
		}
	});
