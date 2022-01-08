var batchNo;
window.addEventListener('load', function() 
{	
  var url = new URL(window.location.href);
  batchNo = url.searchParams.get("batchNo");
  

	if(batchNo!="" || batchNo!=null || batchNo!=undefined){
		
		getCultivationData(globMainContract,batchNo,function(result)
		{
			var parentSection = $("#cultivationSection");
			var activityName =  "ManufacturedAPI";
			var built = buildCultivationBlock(result);

			populateSection(parentSection,built,activityName,batchNo)
		});

		getFarmInspectorData(globMainContract,batchNo,function(result){
			
			var parentSection = $("#farmInspectionSection"); 
			var activityName = "FormulatorVerified";  
			var built = buildFarmInspectionBlock(result);

			populateSection(parentSection,built,activityName,batchNo);
		});

		getHarvesterData(globMainContract,batchNo,function(result){
			
			var parentSection = $("#harvesterSection");
			var activityName = "WholesalerVerified";
			var built = buildHarvesterBlock(result);

			populateSection(parentSection,built,activityName,batchNo);
		});

		getExporterData(globMainContract,batchNo,function(result){
			
			var parentSection = $("#exporterSection");
			var activityName = "PharmacistVerified";
			var built = buildExporterBlock(result);   

			populateSection(parentSection,built,activityName,batchNo);             
		});

		getImporterData(globMainContract,batchNo,function(result){

			 var parentSection = $("#importerSection");
			 var activityName = "PatientVerified";
			 var built = buildImporterBlock(result); 

			 populateSection(parentSection,built,activityName,batchNo);        
       $('.qr-code-magnify').magnificPopup({
        type:'image',
        mainClass: 'mfp-zoom-in'
    });      
		});

		// getProcessorData(globMainContract,batchNo,function(result){
		// 	var parentSection = $("#processorSection");
		// 	var activityName = "PatientVerified";
		// 	var built = buildProcessorBlock(result); 

		// 	populateSection(parentSection,built,activityName,batchNo);   

      

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

function buildCultivationBlock(result)
{
  console.log("hewre", result);
	var cultivationData = {};
  var shipmentId = result._shipmentID;
	var registrationNo = result._AM_ID;
	var farmerName     = result._AM_name;
	var farmAddress    = result._apiName;
	var exporterName   = result._timestamp;
	var importerName   = result._location;
  
	if(registrationNo!='' && farmerName!='' && farmAddress!='' && exporterName!='' && importerName!=''){
		cultivationData.html =  `<tr>
                                <td><b>Shipment ID:</b></td>
                                <td>`+shipmentId+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>API Manufacturer Address:</b></td>
                                <td>`+registrationNo+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>API Manufacturer Name:</b></td>
                                <td>`+farmerName+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>API Name:</b></td>
                                <td>`+farmAddress+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                                <td><b>Timestamp:</b></td>
                                <td>`+exporterName+` <i class="fa fa-check-circle verified_info"></i></td>
                            </tr>
                            <tr>
                              <td><b>Location:</b></td>
                              <td>`+importerName+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>`;

        cultivationData.isDataAvail = true;                    
    }else{
    	cultivationData.html = ` <tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                            </tr>`;

        cultivationData.isDataAvail = false;                                        
    }

    return cultivationData;
}

function buildFarmInspectionBlock(result){
	var farmInspactorData = {};
	var coffeeFamily      = result._fm_id;
	var typeOfSeed        = result._fm_name;
  var _mfd_date        = result._mfd_date;	
	var _exp_date        = result._exp_date;	
	var _temperature     = result._temperature;	
  var _location        = result._location;	
	var _contents        = result._contents;
  var _timestamp       = result._timestamp;	
  var _quantity        = result._quantity; 
  console.log(coffeeFamily,"coff")
	if(coffeeFamily!='' && typeOfSeed!='' && _mfd_date!='' && coffeeFamily!=undefined){
		farmInspactorData.html =  `<tr>
                                    <td><b>Formulator ID:</b></td>
                                    <td>`+coffeeFamily+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Formulator Name:</b></td>
                                    <td>`+typeOfSeed+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Manufacture Date:</b></td>
                                    <td>`+_mfd_date+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Expiry Date:</b></td>
                                    <td>`+_exp_date+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Temperature:</b></td>
                                    <td>`+_temperature+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Location:</b></td>
                                    <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Contents:</b></td>
                                    <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Timestamp:</b></td>
                                    <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>
                                  <tr>
                                    <td><b>Quantity:</b></td>
                                    <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                                  </tr>`;
        farmInspactorData.isDataAvail = true;                          
    }else{
    	farmInspactorData.html = `<tr>
	                                    <td colspan="2"><p>Information Not Available</p></td>
	                            </tr>`;
	    farmInspactorData.isDataAvail = false;                        
    } 

    return farmInspactorData;  
}

function buildHarvesterBlock(result){
	var harvesterData = {};
  var _wholesalerID = result._wholesalerID;
  var _wholesalerName = result._wholesalerName;
  var _temperature = result._temperature;
  var _timestamp = result._timestamp;
  var _contents = result._contents;
  var _quantity = result._quantity;
  var _location = result._location;

	if(_wholesalerID!='' && _wholesalerName!='' && _temperature!='' 
          && _location!='' && _contents!='' && _timestamp!='' && _quantity!='' && _wholesalerID!=undefined){
            harvesterData.html =  `
                              <tr>
                                <td><b>Wholesaler ID:</b></td>
                                <td>`+_wholesalerID+`&#x2109; <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <tr>
                                <td><b>Wholesaler Name:</b></td>
                                <td>`+_wholesalerName+`&#x2109; <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Temperature:</b></td>
                                <td>`+_temperature+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Location:</b></td>
                                <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Contents:</b></td>
                                <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                              <td><b>Timestamp:</b></td>
                                <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>
                              <tr>
                                <td><b>Quantity:</b></td>
                                <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                              </tr>`;
        harvesterData.isDataAvail = true;                      
    }else{
    	harvesterData.html = `<tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                        </tr>`;
        harvesterData.isDataAvail = false;                
    }    

    return harvesterData;
}	

function buildExporterBlock(result){
	var exporterData = {};
	var _pharmacyID = result._pharmacyID;
   var _pharmacyName = result._pharmacyName;
   var _timestamp = result._timestamp;
   var _location = result._location;
   var _contents = result._contents;
   var _quantity = result._quantity;

   if(_pharmacyID!='' && _pharmacyName!='' && _location!='' 
   && _contents!='' && _timestamp!='' && _quantity!=''){

    exporterData.html =  `
                   <tr>
                     <td><b>Pharmacy ID:</b></td>
                     <td>`+_pharmacyID+` <i class="fa fa-check-circle verified_info"></i></td>
                   </tr>
                   <tr>
                   <tr>
                     <td><b>Pharmacy Name:</b></td>
                     <td>`+_pharmacyName+` <i class="fa fa-check-circle verified_info"></i></td>
                   </tr>
                   <tr>
                   <td><b>Location:</b></td>
                     <td>`+_location+` <i class="fa fa-check-circle verified_info"></i></td>
                   </tr>
                   <tr>
                   <td><b>Contents:</b></td>
                     <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                   </tr>
                   <tr>
                   <td><b>Timestamp:</b></td>
                     <td>`+_timestamp+` <i class="fa fa-check-circle verified_info"></i></td>
                   </tr>
                   <tr>
                     <td><b>Quantity:</b></td>
                     <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                   </tr>`;
        exporterData.isDataAvail = true;                  
	}else{
    	exporterData.html = ` <tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                        </tr>`;
        exporterData.isDataAvail = false;                
    }   

    return exporterData;
}

function buildImporterBlock(result){
	var importerData = {};
  var _patientID = result._patientID;
  var _quantity = result._quantity;
  var _contents = result._contents;
  var _price = result._price;

	if(_patientID!='' && _quantity!='' && _contents!='' && _price!=''){
		
    patientData.html =  `
                          <tr>
                            <td><b>Patient ID:</b></td>
                            <td>`+_patientID+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Quantity:</b></td>
                            <td>`+_quantity+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Contents:</b></td>
                            <td>`+_contents+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>
                          <tr>
                            <td><b>Price:</b></td>
                            <td>`+_price+` <i class="fa fa-check-circle verified_info"></i></td>
                          </tr>`;
        importerData.isDataAvail = true;                  
    }else{
    	importerData.html = ` <tr>
                                    <td colspan="2"><p>Information Not Available</p></td>
                        </tr>`;
        importerData.isDataAvail = false;                
    }

    return importerData;    
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