pragma solidity ^0.4.23;

import "./Checker.sol";
contract Database is Checker {
    struct APIManufacturer {
        address shipmentID;
        address AM_ID; //AM -> API Manufacturer
        string AM_name;
        string apiName;
        uint timestamp;
        string location;
    }

    struct Formulator {
        address shipmentID;
        address formulatorID;
        string formulatorName;
        uint mfd_date;
        uint exp_date;
        uint temperature;
        uint timestamp;
        string contents;
        uint quantity;
        string location;
    }

    struct Wholesaler {
        address shipmentID;
        address wholesalerID;
        string wholesalerName;
        uint temperature;
        uint timestamp;
        string contents;
        uint quantity;
        string location;
    }

    struct Pharmacy {
        address shipmentID;
        address pharmacyID;
        string pharmacyName;
        uint timestamp;
        string location;
        string contents;
        uint quantity;
    }

    struct Customer {
        address shipmentID;
        address patientID;
        uint quantity;
        string contents;
        uint price;
    }
    mapping (address => APIManufacturer) AMDetails;
    mapping (address => Formulator) formulatorDetails;
    mapping (address => Wholesaler) wholesalerDetails;
    mapping (address => Pharmacy) pharmacyDetails;
    mapping (address => Customer) customerDetails;
    mapping (address => string) nextStep;

    userDetails userTemp;
    APIManufacturer APMTemp;
    Formulator formulatorTemp;
    Wholesaler wholesalerTemp;
    Pharmacy pharmacyTemp;
    Customer customerTemp;

    function getUserDesignation(address _user) public  view returns(string) {
        return Users[_user].designation;
    }
    
    function getNextStep(address _shipmentID) public view returns(string) {
        return nextStep[_shipmentID];
    }

    function getUserDetails(address userAddress) public view returns(string name, string designation, string profileImg) {
        userDetails memory temp = Users[userAddress];
        return (temp.name, temp.designation, temp.profileImg);
    }

    function setUserDetails(address newAddress, string name, string designation, bool _isActive,string _profileImg) public  {
        
        userTemp.user_id = newAddress;
        userTemp.name = name;
        userTemp.designation = designation;
        userTemp.isActive = _isActive;
        userTemp.profileImg = _profileImg;

        Users[newAddress] = userTemp;
    } 

//  API Manufacturer Getters and Setters 
    function setAPIManufacturerDeets(address _AM_ID,
                                    string _AM_name,
                                    string _apiName,
                                    uint _timestamp,
                                    string _location)

        public view returns (address)
    {   
        uint addressTemp = uint(keccak256(msg.sender, now));
        address shipmentID = address(addressTemp);
        APMTemp.shipmentID = shipmentID;

        APMTemp.AM_ID = _AM_ID; 
        APMTemp.AM_name = _AM_name;
        APMTemp.apiName = _apiName;
        APMTemp.timestamp = _timestamp;
        APMTemp.location = _location;

        AMDetails[shipmentID] = APMTemp;

        nextStep[shipmentID] = "FORMULATION";
        
        return (shipmentID);
    }
                  
    function getAPIManufacturerDeets(address shipmentID) 
        public view returns (address _shipmentID,
                            address _AM_ID, 
                            string _AM_name,
                            string _apiName,
                            uint _timestamp,
                            string _location)
    {
        APIManufacturer tmp = AMDetails[shipmentID];
        return (tmp.shipmentID, tmp.AM_ID, tmp.AM_name, tmp.apiName, tmp.timestamp, tmp.location);
    }


    //  Formulator Getters and Setters 

    function setFormulatorDeets(address _shipmentID,
                                address _fm_id, 
                                string _fm_name, 
                                uint _mfd_date,
                                uint _exp_date,
                                uint _temperature,
                                uint _timestamp,
                                string _contents,
                                uint _quantity,
                                string _location)

        public  returns (bool)
    {
        formulatorTemp.shipmentID = _shipmentID;
        formulatorTemp.formulatorID = _fm_id;
        formulatorTemp.formulatorName = _fm_name;
        formulatorTemp.mfd_date = _mfd_date;
        formulatorTemp.exp_date = _exp_date;
        formulatorTemp.temperature = _temperature;
        formulatorTemp.timestamp = _timestamp;
        formulatorTemp.contents = _contents;
        formulatorTemp.quantity = _quantity;
        formulatorTemp.location = _location;

        formulatorDetails[_shipmentID] = formulatorTemp;

        nextStep[_shipmentID] = "WHOLESALER";

        return (true);
    }

    function getFormulatorDeets(address shipmentID) 
        public view returns (   address _fm_id, 
                                string _fm_name, 
                                uint _mfd_date,
                                uint _exp_date,
                                uint _temperature,
                                uint _timestamp,
                                string _contents,
                                uint _quantity,
                                string _location)
    {
        Formulator tmp = formulatorDetails[shipmentID];
        return (tmp.formulatorID,
                tmp.formulatorName,
                tmp.mfd_date,
                tmp.exp_date,
                tmp.temperature,
                tmp.timestamp,
                tmp.contents,
                tmp.quantity,
                tmp.location);
    }
   

    //  Wholesaler Getters and Setters 

    function setWholesalerDeets(address _shipmentID,
                                address _wholesalerID,
                                string _wholesalerName,
                                uint _temperature,
                                uint _timestamp,
                                string _contents,
                                uint _quantity,
                                string _location)

        public returns (bool)
    {
        wholesalerTemp.shipmentID = _shipmentID;
        wholesalerTemp.wholesalerID = _wholesalerID;
        wholesalerTemp.wholesalerName = _wholesalerName;        
        wholesalerTemp.temperature = _temperature;
        wholesalerTemp.timestamp = _timestamp;
        wholesalerTemp.contents = _contents;
        wholesalerTemp.quantity = _quantity;
        wholesalerTemp.location = _location;

        wholesalerDetails[_shipmentID] = wholesalerTemp;

        nextStep[_shipmentID] = "PHARMACY"; 
    
        return (true);
    }

    function getWholesalerDeets(address shipmentID) 
        public view returns (   address _wholesalerID,
                                string _wholesalerName,
                                uint _temperature,
                                uint _timestamp,
                                string _contents,
                                uint _quantity,
                                string _location)
    {
        Wholesaler tmp = wholesalerDetails[shipmentID];
        return (tmp.wholesalerID, tmp.wholesalerName, tmp.temperature, tmp.timestamp, tmp.contents, tmp.quantity, tmp.location);
    }

    //  Pharmacist Getters and Setters 

    function setPharmacistDeets(address _shipmentID,
                                address _pharmacyID,
                                string _pharmacyName,
                                uint _timestamp,
                                string _location,
                                string _contents,
                                uint _quantity)

        public  returns (bool)
    {
        pharmacyTemp.shipmentID = _shipmentID;
        pharmacyTemp.pharmacyID = _pharmacyID;
        pharmacyTemp.pharmacyName = _pharmacyName;
        pharmacyTemp.timestamp = _timestamp;
        pharmacyTemp.contents = _contents;
        pharmacyTemp.quantity = _quantity;
        pharmacyTemp.location = _location;

        pharmacyDetails[_shipmentID] = pharmacyTemp;

        nextStep[_shipmentID] = "CUSTOMER";

        return (true);
    }

    function getPharmacistDeets(address shipmentID) 
        public view returns (   address _pharmacyID,
                                string _pharmacyName,
                                uint _timestamp,
                                string _location,
                                string _contents,
                                uint _quantity  )
    {
        Pharmacy tmp = pharmacyDetails[shipmentID];
        return (    tmp.pharmacyID,
                    tmp.pharmacyName,
                    tmp.timestamp,
                    tmp.location,
                    tmp.contents,
                    tmp.quantity
                );
    }
    //  Patient Getters and Setters 

    function setCustomerDeets(  address _shipmentID,
                                address _patientID,
                                uint _quantity,
                                string _contents,
                                uint _price)

        public  returns (bool)
    {
        customerTemp.shipmentID = _shipmentID;
        customerTemp.patientID = _patientID;
        customerTemp.quantity = _quantity;
        customerTemp.price = _price;

        customerDetails[_shipmentID] = customerTemp;

        nextStep[_shipmentID] = "END"; 

        return (true);
    }


    function getCustomerDeets(address shipmentID) 
        public view returns (   address _patientID,
                                uint _quantity,
                                string _contents,
                                uint _price)
    {
        Customer tmp = customerDetails[shipmentID];
        return (tmp.patientID, tmp.quantity, tmp.contents, tmp.price);
    }

}

