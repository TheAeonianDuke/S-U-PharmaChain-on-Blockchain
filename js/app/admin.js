
$(window).on('coinbaseReady',function(){
    console.log("here now");
	getUserEvents(globUserContract);
	getCultivationEvents(globMainContract);
});

function userFormSubmit(){

	if($("form#userForm").parsley().isValid()){

		var userWalletAddress = $("#userWalletAddress").val();
		var userName          = $("#userName").val();
		var userRoles         = $("#userRoles").val();
		var isActive          = $("#isActive").is(":checked");
		var userImageAddress  = $("#userProfileHash").val();
        console.log(globCoinbase, globUserContract._address);
        console.log(globUserContract.methods.adminAddress);
		globUserContract.methods.updateUser(userWalletAddress,userName,userRoles, isActive, userImageAddress)
		.send({from:globCoinbase, to:globUserContract._address})
		.on('transactionHash',function(hash){
			 handleTransactionResponse(hash);
			 $("#userFormModel").modal('hide');
		})
		.on('receipt', function(receipt){
			receiptMessage = "User Created Successfully";
      		handleTransactionReceipt(receipt,receiptMessage);
      		$("#userFormModel").modal('hide');
      		getUserEvents(globUserContract);
		})
		.on('error',function(error)
		{
		    handleGenericError(error.message);
		    return;   
		});
	}
}

function addCultivationBatch()
{

    
        var farmerRegistrationNo = $("#farmerRegistrationNo").val().trim();
        var farmerName = $("#farmerName").val().trim();
        var timestamp_add = new Date().getTime();
        globMainContract.methods.setAPIManufacturerDeets(globCoinbase, farmerRegistrationNo, timestamp_add, farmerName)
        .send({
            from: globCoinbase,
            to: globMainContract._address
        })
        .on('transactionHash', function (hash) {
            handleTransactionResponse(hash);
            $("#batchFormModel").modal('hide');
        })
        .on('receipt', function (receipt) {
            receiptMessage = "Token Transferred Successfully";
            handleTransactionReceipt(receipt, receiptMessage);
            $("#batchFormModel").modal('hide');
            getCultivationEvents(globMainContract);
        })
        .on('error', function (error) {
            handleGenericError(error.message);
            return;
        });
    
}


function getCultivationEvents(contractRef) {
    console.log("hereere",contractRef);
    contractRef.getPastEvents('ManufacturedAPI', {
        fromBlock: 0
    }).then(function (events) 
    {
    	$("#totalBatch").html(events.length);
        
        var finalEvents = [];
        $.each(events,function(index,elem)
        {   
            console.log(elem);
            var tmpData = {};
            tmpData.batchNo = elem.returnValues.shipmentID;
            tmpData.transactionHash = elem.transactionHash;
            getBatchStatus(contractRef, tmpData.batchNo).then(result => {
                tmpData.status = result;

                finalEvents.push(tmpData);
            });
        });

        setTimeout(function()
        {
        	if(finalEvents.length > 0){
	            var table = buildCultivationTable(finalEvents);
	            $("#adminCultivationTable").find("tbody").html(table);
	            $('.qr-code-magnify').magnificPopup({
				    type:'image',
				    mainClass: 'mfp-zoom-in'
				});
	        }    

            counterInit();
        },1000); 

    }).catch(error => {
        console.log(error)
    });
}

function buildCultivationTable(finalEvents)
{
    
    var table = "";
    
    for (var tmpDataIndex in finalEvents)
    {   
        var elem = finalEvents[tmpDataIndex];
        console.log("here", elem, finalEvents);
        var batchNo = elem.batchNo;
        var transactionHash = elem.transactionHash;
        var tr = "";
        var url = ((window.location.href).split("/"))[0] + "//" + ((window.location.href).split("/"))[2] + "/" + ((window.location.href).split("/"))[3]  + '/view-batch.html?batchNo='+batchNo+'&txn='+transactionHash;
        var qrCode = 'https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs=400x400&chl='+url;
			
        var commBatchTd = `<td>`+batchNo+` <a href="`+url+`" class="text-danger" target="_blank"><i class="fa fa-external-link"></i></a></td>`;
        var commQrTd = `<td><a href="`+qrCode+`" title="`+transactionHash+`" class="qr-code-magnify" data-effect="mfp-zoom-in">
				        	<img src="`+qrCode+`" class="img-responsive" style="width:30px; height:30px;">
				        </a>
				    </td>`;
		var commActionTd = `<td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>`;		    
		
		if (elem.status == "API_MANUFACTURING") {
            tr = `<tr>
            		`+commBatchTd+commQrTd+`
                    <td><span class="label label-warning font-weight-100">Processing</span></td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    `+commActionTd+`
                </tr>`;
        } else if (elem.status == "FORMULATION") {
            tr = `<tr>
                    `+commBatchTd+commQrTd+`
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-warning font-weight-100">Processing</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    `+commActionTd+`
                </tr>`;
        } else if (elem.status == "WHOLESALER") {
            tr = `<tr>
                    `+commBatchTd+commQrTd+`
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-warning font-weight-100">Processing</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    `+commActionTd+`
                </tr>`;
        } else if (elem.status == "PHARMACY") {
            tr = `<tr>
                    `+commBatchTd+commQrTd+`
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-warning font-weight-100">Processing</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    `+commActionTd+`
                </tr>`;
        } else if (elem.status == "PATIENT") {
            tr = `<tr>
                    `+commBatchTd+commQrTd+`
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-warning font-weight-100">Processing</span> </td>
                    `+commActionTd+`
                </tr>`;
        } else if (elem.status == "DONE") {
            tr = `<tr>
                    `+commBatchTd+commQrTd+`
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    `+commActionTd+`
                </tr>`;
        }

        table+=tr;
    }

    return table;
    
}

function getBatchStatus(contractRef, batchNo)
{
    return contractRef.methods.getNextLink(batchNo)
        .call();
       
}


