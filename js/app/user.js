var globCurrentEditingBatchNo = false;
var globCurrentUser = false;

var userForm,
apiManufacturerForm,
formulatorForm,
wholesalerForm,
pharmacistForm,
patientForm;

$(document).ready(function(){
  
  userForm =  $("#updateUserForm").parsley();
  apiManufacturerForm =  $("#apiManufacturerForm").parsley();
  formulatorForm =  $("#formulatorForm").parsley(); wholesalerForm =  $("#wholesalerForm").parsley(); pharmacistForm =  $("#pharmacistForm").parsley();
  patientForm =  $("#patientForm").parsley();
  console.log(userForm);
  $('.datepicker-autoclose').datepicker({
        autoclose: true,
        todayHighlight: true,
        format:"dd-mm-yyyy"
    });
});

$(window).on("coinbaseReady", function ()
{
    getUser(globUserContract, function(data){     
      
      globCurrentUser = data ;
      console.log(data,"heresme");
      // if(data.isActive == true){
      if(data != undefined){
        if(data.name.trim().length <=0 && 
          //  data.contactNo.trim().length <=0 && 
           data.designation.trim().length <=0 )
        {
          swal("Oops","Your Account was not found , Please contact Admin ","error");
          setTimeout(function()
          {
            window.location = "index.html";
          },1000);
          return ;
        }
      }
      // else{
      //     swal({
      //         title: "Insufficient Access",
      //         text: "Your Account is blocked by Admin , Please contact to Admin",
      //         type: "error",
      //         showCancelButton: false,
      //         confirmButtonColor: "#DD6B55",
      //         confirmButtonText: "Ok",
      //         closeOnConfirm: false
      //       },
      //       function(isConfirm)
      //       {
      //         if(isConfirm==true)
      //         {
      //          window.location = "index.html";
      //         }
      //       });
      //     return ;
      // }  

      $("#userImage").attr('src','https://ipfs.io/ipfs/'+data._profileImg);
      $("#userName").html(data.name);
      // $("#userContact").html(data.contactNo);
      $("#userRole").html(data.designation);

      
      if (data.designation == 'API_MANUFACTURER')
      {
          document.getElementById("apiManufacturerCreateShipment").style.display = 'block';
      }
      
    });

    getCultivationEvents(globMainContract);
});

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

/* --------------- User Section -----------------------*/
$("#editUser").on('click',function(){
  startLoader();
  getUser(globUserContract, function(data){
       
       $("#fullname").val(data.name);
       $("#contactNumber").val(data.contactNo);
       $("#role").val(data.role);

       var profileImageLink = 'https://ipfs.io/ipfs/'+data.profileHash;
       var btnViewImage = '<a href="'+profileImageLink+'" target="_blank" class=" text-danger"><i class="fa fa-eye"></i> View Image</a>';
       $("#imageHash").html(btnViewImage);

       changeSwitchery($("#isActive"),data.isActive);
      //  switchery.disable();
       stopLoader();
       $("#userFormModel").modal();
    });
});

$("#userFormBtn").on('click',function(){

    if(userForm.validate())
    {
      var fullname      = $("#fullname").val();
      var contactNumber = $("#contactNumber").val();
      var role          = globCurrentUser.designation;
      var userStatus    = $("#isActive").is(":checked");
      var profileHash   = $("#userProfileHash").val();

      var userDetails = {
          fullname : fullname,
          contact : contactNumber,
          role : role,
          status : userStatus,
          profile : profileHash
      };    

      updateUser(globUserContract, userDetails); 
    }
});

function getUser(contractRef,callback)
{
  console.log("nowcame here");
    console.log(contractRef.methods);
    contractRef.methods.getUser(globCoinbase).call(function (error, result) {
        if(error){
            console.log('Error' + " " + error);
        }
        newUser = result;
        if (callback)
        {
            callback(newUser);
        }        
    });
}

function updateUser(contractRef,data)
{
  contractRef.methods.updateUser(data.fullname,data.contact,data.role,data.status,data.profile)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
          $("#userFormModel").modal('hide');
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "User Profile Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage);
            $("#userFormModel").modal('hide');
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Activity Section -----------------------*/

function editActivity(batchNo)
{
  startLoader();
  globCurrentEditingBatchNo = batchNo;
}

/* --------------- API Manufacturer Section -----------------------*/


// $("#updateApiManufacturer").on('click',function(){

//     if(apiManufacturerForm.validate())
//     {
//       var data = {
//         batchNo : globCurrentEditingBatchNo,
//         genericName : $("#genericName").val().trim(),
//         timestamp_am : Date(),
//         apiLocation : $("#apiLocation").val().trim(),
//       };    

//       updateFarmInspection(globMainContract, data); 
//     }
// });

// function updateFarmInspection(contractRef,data)
// {
  
//   contractRef.methods.updateFarmInspectorData(data.batchNo, data.coffeeFamily,data.typeOfSeed, data.fertilizerUsed)
//   .send({from:globCoinbase,to:contractRef.address})
//   .on('transactionHash',function(hash)
//         {
//           $.magnificPopup.instance.close()
//           handleTransactionResponse(hash);
//         })
//         .on('receipt',function(receipt)
//         {
//             receiptMessage = "Farm Inspection Updated Succussfully";
//             handleTransactionReceipt(receipt,receiptMessage)
//         })
//         .on('error',function(error)
//         {
//             handleGenericError(error.message);
//             return;     
//         });    
// }

/* --------------- Formulator Section -----------------------*/


$("#updateFormulator").on('click',function(){

    if(formulatorForm.validate())
    {
      var data = {
        batchNo : globCurrentEditingBatchNo,
        fm_name : $("#fm_name").val().trim(),
        fm_mfd_date : $("#fm_mfd_date").val().trim(),
        fm_exp_date : $("#fm_exp_date").val().trim(),
        fm_temperature : $("#fm_temperature").val().trim(),
        timestamp_form : new Date().getTime(),
        fm_contents : $("#fm_contents").val().trim(),
        fm_quantity : $("#fm_quantity").val().trim(),
        fm_location : $("#fm_location").val().trim(),
      };    

      updateFormulator(globMainContract, data); 
    }
});

function updateFormulator(contractRef,data)
{
  console.log(data, "data");
  contractRef.methods.setFormulatorDeets(data.batchNo, data.fm_name, data.fm_mfd_date, data.fm_exp_date, data.fm_temperature,data.timestamp_form, data.fm_contents, data.fm_quantity, data.fm_location)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Formulator Information Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}


/* --------------- Wholesaler Section -----------------------*/


$("#updateWholesaler").on('click',function(){

    if(wholesalerForm.validate())
    {
      var data = {
        batchNo : globCurrentEditingBatchNo,
        ws_name : ($("#ws_name").val().trim()),
        ws_temperature : $("#ws_temperature").val().trim(),
        ws_timestamp: new Date().getTime(),
        ws_contents : $("#ws_contents").val().trim(),
        ws_quantity : $("#ws_quantity").val().trim(),
        ws_location : $("#ws_location").val().trim(),
        // exporterId : parseInt($("#exporterId").val().trim()),
      };    

      updateWholesaler(globMainContract, data); 
    }
});

function updateWholesaler(contractRef,data)
{
  //contractRef.methods.updateUser("Swapnali","9578774787","HARVESTER",true,"0x74657374")
  contractRef.methods.setWholesalerDeets(data.batchNo, data.ws_name,data.ws_temperature, data.ws_timestamp, data.ws_contents, data.ws_quantity, data.ws_location)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Wholesaler Information Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Pharmacist Section -----------------------*/


$("#updatePharmacist").on('click',function(){

    if(pharmacistForm.validate())
    {
      var data = {
        batchNo : globCurrentEditingBatchNo,
        ps_name : $("#ps_name").val().trim(),
        ps_timestamp : new Date().getTime(),
        ps_location : $("#ps_location").val().trim(),
        ps_contents : $("#ps_contents").val().trim(),
        ps_quantity : ($("#ps_quantity").val().trim()),
      };    

      updatePharmacist(globMainContract, data); 
    }
});

function updatePharmacist(contractRef,data)
{
  //contractRef.methods.updateUser("Swapnali","9578774787","HARVESTER",true,"0x74657374")
  contractRef.methods.setPharmacistDeets(data.batchNo, data.ps_name, data.ps_timestamp, data.ps_location, data.ps_contents, data.ps_quantity)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Pharmacy Information Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

/* --------------- Patient Section -----------------------*/

$("#updatePatient").on('click',function(){

    if(patientForm.validate())
    {
      
      var data = {
        batchNo : globCurrentEditingBatchNo,
        pat_quantity : parseInt($("#pat_quantity").val().trim()),
        pat_contents : $("#pat_contents").val().trim(),
        pat_price : parseInt($("#pat_price").val().trim()),
      };    

      updatePatient(globMainContract, data); 
    }
});

function updatePatient(contractRef,data)
{
  //contractRef.methods.updateUser("Swapnali","9578774787","HARVESTER",true,"0x74657374")
  contractRef.methods.setCustomerDeets(data.batchNo, data.pat_quantity, data.pat_contents, data.pat_price)
  .send({from:globCoinbase,to:contractRef.address})
  .on('transactionHash',function(hash)
        {
          $.magnificPopup.instance.close()
          handleTransactionResponse(hash);
        })
        .on('receipt',function(receipt)
        {
            receiptMessage = "Patient Information Updated Succussfully";
            handleTransactionReceipt(receipt,receiptMessage)
        })
        .on('error',function(error)
        {
            handleGenericError(error.message);
            return;     
        });    
}

function getCultivationEvents(contractRef) {
    contractRef.getPastEvents('ManufacturedAPI', {
        fromBlock: 0
    }).then(function (events) 
    {
      $("#totalBatch").html(events.length);
      counterInit();

        var finalEvents = [];
        $.each(events,function(index,elem)
        {
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
              $("#userCultivationTable").find("tbody").html(table);

              reInitPopupForm();
          }    
        },1000); 

        

        // $("#transactions tbody").html(buildTransactionData(events));
    }).catch(error => {
        console.log(error)
    });
}

function buildCultivationTable(finalEvents)
{
    $.magnificPopup.instance.popupsCache = {};

    var table = "";
    
    for (var tmpDataIndex in finalEvents)
    {   
        console.log(finalEvents,"fin", globCurrentUser, elem);
        var elem = finalEvents[tmpDataIndex];
        var batchNo = elem.batchNo;
        var transactionHash = elem.transactionHash;
        var tr = "";
        console.log(elem.status, globCurrentUser.designation);
        if (elem.status == "API_MANUFACTURER") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                  `;
                  
              if(globCurrentUser.designation == "API_MANUFACTURER")
              {
                tr+=`<td>
                          <span class="label label-inverse font-weight-100">
                          <a class="popup-with-form" href="#apiManufacturerForm" onclick="editActivity('`+batchNo+`')">
                            <span class="label label-inverse font-weight-100">Update</span>
                          </a>
                      </td>`;
              }
              else
              {
                 tr+=`<td><span class="label label-warning font-weight-100">Processing</span> </td>`;
              }

                
          tr+=`<td><span class="label label-danger font-weight-100">Not Available</span> </td>
              <td><span class="label label-danger font-weight-100">Not Available</span> </td>
              <td><span class="label label-danger font-weight-100">Not Available</span> </td>
              <td><span class="label label-danger font-weight-100">Not Available</span> </td>
              <td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>
          </tr>`;

        } else if (elem.status == "FORMULATION") {
          tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    `;
 
                  if(globCurrentUser.designation == "FORMULATOR")
                  {
                    tr+=`<td>
                              <span class="label label-inverse font-weight-100">
                              <a class="popup-with-form" href="#formulatorForm" onclick="editActivity('`+batchNo+`')">
                                <span class="label label-inverse font-weight-100">Update</span>
                              </a>
                          </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100">Processing</span> </td>`;
                  }        

            tr+=`
                <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                <td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>
            </tr>`;

        } else if (elem.status == "WHOLESALER") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                  `;
                  
                  if(globCurrentUser.designation == "WHOLESALER")
                  {
                    tr+=`<td>
                              <span class="label label-inverse font-weight-100">
                              <a class="popup-with-form" href="#exporterForm" onclick="editActivity('`+batchNo+`')">
                                <span class="label label-inverse font-weight-100">Update</span>
                              </a>
                          </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100">Processing</span> </td>`;
                  } 

              tr+=`  
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>
                </tr>`;
        } else if (elem.status == "IMPORTER") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                  `;  

                  if(globCurrentUser.designation == "IMPORTER")
                  {
                    tr+=`<td>
                              <span class="label label-inverse font-weight-100">
                              <a class="popup-with-form" href="#importerForm" onclick="editActivity('`+batchNo+`')">
                                <span class="label label-inverse font-weight-100">Update</span>
                              </a>
                          </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100">Processing</span> </td>`;
                  } 

              tr+=` <td><span class="label label-danger font-weight-100">Not Available</span> </td>
                    <td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>
                </tr>`;
        } else if (elem.status == "PROCESSOR") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                  `;
                  
                  if(globCurrentUser.designation == "PROCESSOR")
                  {
                    tr+=`<td>
                              <span class="label label-inverse font-weight-100">
                              <a class="popup-with-form" href="#processingForm" onclick="editActivity('`+batchNo+`')">
                                <span class="label label-inverse font-weight-150">Update</span>
                              </a>
                          </td>`;
                  }
                  else
                  {
                     tr+=`<td><span class="label label-warning font-weight-100">Processing</span> </td>`;
                  }  
                tr+=`    
                    <td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>
                </tr>`;
        } else if (elem.status == "DONE") {
            tr = `<tr>
                    <td>`+batchNo+`</td>
                    <td><span class="label label-success font-weight-100">Completed</span></td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                    <td><span class="label label-success font-weight-100">Completed</span> </td>
                  `;  
                tr+=`    
                    <td><a href="view-batch.html?batchNo=`+batchNo+`&txn=`+transactionHash+`" target="_blank" class="text-inverse p-r-10" data-toggle="tooltip" title="View"><i class="ti-eye"></i></a> </td>
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

function reInitPopupForm()
{
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: true,
    key: 'popup-with-form',
    // When elemened is focused, some mobile browsers in some cases zoom in
    // It looks not nice, so we disable it:
    callbacks: {
      open: function() {
        stopLoader();
      }
    }
  });
}