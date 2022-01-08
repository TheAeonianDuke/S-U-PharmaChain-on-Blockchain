var batchNo;
window.addEventListener('load', function() 
{	
  var url = new URL(window.location.href);
  batchNo = url.searchParams.get("batchNo");
  

	if(batchNo!="" || batchNo!=null || batchNo!=undefined){
		
		getAPIManufacturerData(globMainContract,batchNo,function(result)
		{
			var parentSection = $("#APIManufacturerSection");
			var activityName =  "ManufacturedAPI";
			var built = builtAPIManufacturerBlock(result);

			populateSection(parentSection,built,activityName,batchNo)
		});

		getForumulatorData(globMainContract,batchNo,function(result){
			
			var parentSection = $("#formulatorSection"); 
			var activityName = "FormulatorVerified";  
			var built = buildFormulatorBlock(result);

			populateSection(parentSection,built,activityName,batchNo);
		});

		getWholesalerData(globMainContract,batchNo,function(result){
			
			var parentSection = $("#wholesalerSection");
			var activityName = "WholesalerVerified";
			var built = buildWholesalerBlock(result);

			populateSection(parentSection,built,activityName,batchNo);
		});

		getPharmacyData(globMainContract,batchNo,function(result){
			
			var parentSection = $("#pharmacySection");
			var activityName = "PharmacistVerified";
			var built = buildPharmacyBlock(result);   

			populateSection(parentSection,built,activityName,batchNo);             
		});

		getPatientData(globMainContract,batchNo,function(result){

			 var parentSection = $("#patientSection");
			 var activityName = "PatientVerified";
			 var built = buildPatientBlock(result); 

			 populateSection(parentSection,built,activityName,batchNo);              
		});

		// getEndData(globMainContract,batchNo,function(result){
		// 	var parentSection = $("#endSection");
		// 	var activityName = "PatientVerified";
		// 	var built = buildEndBlock(result); 

		// 	populateSection(parentSection,built,activityName,batchNo);   

    //   $('.qr-code-magnify').magnificPopup({
    //       type:'image',
    //       mainClass: 'mfp-zoom-in'
    //   });

		// });
	}

});

function populateSection(parentSection,built,activityName,batchNo)
{
  if(built.isDataAvail==true)
  {
  	getActivityTimestamp(activityName,batchNo, function(resultData)
  	{
     
      if(resultData.dataTime)
  		{
        var phoneNoSec = '';
        // if(resultData.contactNo!='-'){
        //   phoneNoSec = `<i class="fa fa-phone"></i> `+resultData.contactNo+`<br/>`;  
        // } 

        var userAddress = resultData.user;
        if($(window).width() <= 565){
          userAddress = userAddress.substring(0,15)+'...';
        }

        var refLink = window.location.href;
        var html = `<span class="text-info"><i class='fa fa-user'> </i>
                        `+resultData.name+` (`+userAddress+`) <br/>
                        `+phoneNoSec+`
                    </span>
                    <i class='fa fa-clock-o'> </i> `+resultData.dataTime.toLocaleString()+`
                    <a href='`+refLink+`' target='_blank'><i class='fa fa-external-link text-danger'></i></a>
                   `;
        $(parentSection).find(".activityDateTime").html(html);
  			$(parentSection).find(".timeline-body .activityData").append('<img src="plugins/images/verified.jpg" alt="user-img" style="width:80px;height:80px" class="img-circle pull-right">');
  		}

      if(resultData.transactionHash){
        var url = window.location.href;
        var qrCode = 'https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs=400x400&chl='+url;
        var qrCodeSec = `<a href="`+qrCode+`" title="`+resultData.transactionHash+`" class="qr-code-magnify pull-right" data-effect="mfp-zoom-in">
                          <img src="`+qrCode+`" class="img-responsive" style="width:70px; height:70px; margin-top:-75px;"/>
                        </a>`;

        $(parentSection).find(".activityQrCode").html(qrCodeSec);
      }
  	});

	  var tmpTimelineBadge = $(parentSection).prev(".timeline-badge");

	
		$(tmpTimelineBadge).removeClass("danger").addClass("success");
		$(tmpTimelineBadge).find("i").removeClass().addClass("fa fa-check");
	}


	$(parentSection).find(".activityData").html(built.html); 
}

function getActivityTimestamp(activityName, batchNo, callback)
{
  console.log("actr", globMainContract);
	globMainContract.getPastEvents(activityName,{
		fromBlock:0,
		filter:{batchNo: batchNo}
	},function(error,eventData)
	{
		try
		{
      web3.eth.getBlock(eventData[0].blockNumber,function(error,blockData)
			{
        var resultData = {};
				var date = blockData.timestamp;
				/* Convert Seconds to Miliseconds */
			 	date = new Date(date * 1000);
			 	// $("#cultivationDateTime").html("<i class='fa fa-clock-o'> </i> " + date.toLocaleString());

        resultData.dataTime = date;
        resultData.transactionHash = eventData[0].transactionHash;
        console.log(eventData[0]);
        var userAddress = eventData[0].returnValues.chainMember;
        getUserDetails(globUserContract,userAddress,function(result){
            if(userAddress == globAdminAddress){
                resultData.name      = 'Admin';
                resultData.contactNo = '-';
            }else{
                resultData.name      = result.name;
                resultData.contactNo = result.contactNo;
            }  
            
            resultData.user      = userAddress;

            callback(resultData);
        });
			})	
		}
		catch(e)
		{
      
			callback(false);
		}
	});
}

function buildAPIManufacturerBlock(result)
{
  console.log("hewre", result);
	var APIManufacturerData = {};
  var shipmentId     = result._shipmentID;
	var _AM_ID         = result._AM_ID;
	var _AM_name       = result._AM_name;
	var _apiName   = result._apiName;
	var _timestamp   = result._timestamp;
	var _location   = result._location;
  
	if(_AM_ID!='' && _AM_NAME!='' && _apiName!='' && _timestamp!='' && _location!=''){
		APIManufacturerData.html =  `<tr>
                                <td><b>Shipment ID:</b></td>
                                <td>`+shipmentId+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>API Manufacturer Address:</b></td>
                                <td>`+_AM_ID+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>API Manufacturer Name:</b></td>
                                <td>`+_AM_NAME+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>API Name:</b></td>
                                <td>`+_apiName+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>Timestamp:</b></td>
                                <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                              <td><b>Location:</b></td>
                              <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>`;

        APIManufacturerData.isDataAvail = true;                    
    }else{
    	APIManufacturerData.html = ` <tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                            </tr>`;

        APIManufacturerData.isDataAvail = false;                                        
    }

    return APIManufacturerData;
}

function buildFormulatorBlock(result){
	var formulatorData  = {};
	var shipmentID     = result._shipmentID;
	var _formulatorID    = result._formulatorID;	
	var _formulatorName  = result._formulatorName;	
	var _mfd_date        = result._mfd_date;	
	var _exp_date        = result._exp_date;	
	var _temperature     = result._temperature;	
  var _location        = result._location;	
	var _contents        = result._contents;
  var _timestamp       = result._timestamp;	
  var _quantity        = result._quantity; 

  console.log(coffeeFamily,"coff")
	if(_typeOfSeed!='' && _formulatorID!='' && _formulatorName!='' && _mfd_date!='' 
                  && _exp_date!='' && _temperature!='' && _location!='' && _contents!='' && _timestamp!='' && _quantity!=''){
		formulatorData.html =  `<tr>
                                    <td><b>Coffee Family:</b></td>
                                    <td>`+_shipmentId+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Type of Seeds:</b></td>
                                    <td>`+_formulatorID+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_formulatorName+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_mfd_date+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_exp_date+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_temperature+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                  <td><b>Type of Seeds:</b></td>
                                    <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Fertilizer Used:</b></td>
                                    <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>`;
        formulatorData.isDataAvail = true;                          
    }else{
    	formulatorData.html = `<tr>
	                                    <td colspan="2"><p>Information Not Available</p></td>
	                            </tr>`;
	    formulatorData.isDataAvail = false;                        
    } 

    return formulatorData;  
}

function buildWholesalerBlock(result){
	var wholesalerData = {};
   var  shipmentID = result._shipmentID;
   var _wholesalerID = result._wholesalerID;
   var _wholesalerName = result._wholesalerName;
   var _temperature = result._temperature;
   var _timestamp = result._timestamp;
   var _contents = result._contents;
   var _quantity = result._quantity;
   var _location = result._location;

	if(_wholesalerID!='' && _wholesalerName!='' && _temperature!='' 
          && _location!='' && _contents!='' && _timestamp!='' && _quantity!=''){
		wholesalerData.html =  `<tr>
                                <td><b>Crop Variety:</b></td>
                                <td>`+shipmentId+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                                <td><b>Temperature Used:</b></td>
                                <td>`+_wholesalerID+`&#x2109; <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <tr>
                                <td><b>Temperature Used:</b></td>
                                <td>`+_wholesalerName+`&#x2109; <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Type of Seeds:</b></td>
                                <td>`+_temperature+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Type of Seeds:</b></td>
                                <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Type of Seeds:</b></td>
                                <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Type of Seeds:</b></td>
                                <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                                <td><b>Fertilizer Used:</b></td>
                                <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>`;
        wholesalerData.isDataAvail = true;                      
    }else{
    	wholesalerData.html = `<tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                        </tr>`;
        wholesalerData.isDataAvail = false;                
    }    

    return wholesalerData;
}	

function buildPharmacyBlock(result){
	var pharmacyData = {};
	 var shipmentID = result._shipmentID;
   var _pharmacyID = result._pharmacyID;
   var _pharmacyName = result._pharmacyName;
   var _timestamp = result._timestamp;
   var _location = result._location;
   var _contents = result._contents;
   var _quantity = result._quantity;

	if(_pharmacyID!='' && _pharmacyName!='' && _location!='' 
          && _contents!='' && _timestamp!='' && _quantity!=''){
		
    // var departureDateTime = new Date(result.departureDateTime * 1000).toLocaleString();
    // var estimateDateTime = new Date(result.estimateDateTime * 1000).toLocaleString();
    pharmacyData.html =  `<tr>
                            <td><b>Quantity:</b></td>
                            <td>`+shipmentID+` (in Kg) <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Destination Address:</b></td>
                            <td>`+_pharmacyID+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                          <tr>
                            <td><b>Destination Address:</b></td>
                            <td>`+_pharmacyName+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                          <td><b>Type of Seeds:</b></td>
                            <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                          <td><b>Type of Seeds:</b></td>
                            <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                          <td><b>Type of Seeds:</b></td>
                            <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Fertilizer Used:</b></td>
                            <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>`;
        pharmacyData.isDataAvail = true;                  
	}else{
    	pharmacyData.html = ` <tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                        </tr>`;
        pharmacyData.isDataAvail = false;                
    }   

    return pharmacyData;
}

function buildPatientBlock(result){
	var patientData = {};
	var shipmentID = result._shipmentID;
  var _patientID = result._patientID;
  var _quantity = result._quantity;
  var _contents = result._contents;
  var _price = result._price;
	if(_patientID!='' && _quantity!='' && _contents!='' && _price!=''){
		
    // var arrivalDateTime = new Date(result.arrivalDateTime * 1000).toLocaleString();
    patientData.html =  `<tr>
                            <td><b>Quantity:</b></td>
                            <td>`+shipmentID+` (in Kg) <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Ship Name:</b></td>
                            <td>`+_patientID+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Ship No:</b></td>
                            <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Arrival Date Time:</b></td>
                            <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Importer Id:</b></td>
                            <td>`+_price+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>`;
        patientData.isDataAvail = true;                  
    }else{
    	patientData.html = ` <tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                        </tr>`;
        patientData.isDataAvail = false;                
    }

    return patientData;    
}

// function buildProcessorBlock(result){
// 	var processorData = {};
// 	var quantity         = result.quantity;
// 	var temperature        = result.temperature;
// 	var rostingDuration  = result.rostingDuration;
// 	var internalBatchNo  = result.internalBatchNo;
// 	var packageDateTime  = result.packageDateTime;
// 	var processorName    = result.processorName;
// 	var processorAddress = result.processorAddress;

// 	if(quantity!='' && temperature!='' && rostingDuration!='' && internalBatchNo!='' && packageDateTime!='' && processorName!='' && processorAddress!='' && quantity != undefined){
		
//     var packageDateTime = new Date(result.packageDateTime * 1000).toLocaleString();

//     processorData.html =  `<tr>
//                             <td><b>Quantity:</b></td>
//                             <td>`+result.quantity+` (in Kg) <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>
//                             <td><b>Temperature:</b></td>
//                             <td>`+result.temperature+`&#x2109; <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>
//                             <td><b>Rosting Duration:</b></td>
//                             <td>`+result.rostingDuration+` in seconds <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>
//                             <td><b>Processed Batch No:</b></td>
//                             <td>`+result.internalBatchNo+` <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>
//                             <td><b>Package Date Time:</b></td>
//                             <td>`+new Date(result.packageDateTime * 1000).toLocaleString() +` <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>
//                             <td><b>Processor Name:</b></td>
//                             <td>`+result.processorName+` <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>
//                             <td><b>Warehouse Address:</b></td>
//                             <td>`+result.processorAddress+` <i class="fa fa-check-circle verified_info"></i></td>
//                           </tr>
//                           <tr>`;
//         processorData.isDataAvail = true;                  
//     }else{
//     	processorData.html = ` <tr>
//                                     <td colspan="2"><p>Information Not Available</p></td>
//                         </tr>`;
//         processorData.isDataAvail = false;                
//     }    
    
//     return processorData; 
// }