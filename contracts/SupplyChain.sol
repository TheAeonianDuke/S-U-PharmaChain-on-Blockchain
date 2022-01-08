pragma solidity ^0.4.23;

import "./Database.sol";
import "./Checker.sol";

contract SupplyChain is Checker 
{
    Database pharmaDatabase;

    constructor(address DatabaseAddress) public {
        pharmaDatabase = Database(DatabaseAddress);
    }

    
    event ManufacturedAPI(address indexed chainMember, address indexed shipmentID);
    event FormulatorVerified(address indexed chainMember, address indexed shipmentID);
    event WholesalerVerified(address indexed chainMember, address indexed shipmentID);
    event PharmacistVerified(address indexed chainMember, address indexed shipmentID);
    event PatientVerified(address indexed chainMember, address indexed shipmentID);
    
    modifier ValidateAccess(address shipmentID, string memberRole) {
        require(keccak256(pharmaDatabase.getUserDesignation(msg.sender)) == keccak256(memberRole));
        require(keccak256(pharmaDatabase.getNextStep(shipmentID)) == keccak256(memberRole));
        _;
    }

    function getNextLink(address shipmentID) public view returns(string nextLink)
    {
        return (pharmaDatabase.getNextStep(shipmentID));
    }

 //    API Manufacturer Getters and Setters 
    function setAPIManufacturerDeets(   string _AM_name,
                                        string _apiName,
                                        uint _timestamp,
                                        string _location)

        public view returns (address)
    {
        address shipmentID = pharmaDatabase.setAPIManufacturerDeets(msg.sender, _AM_name, _apiName, _timestamp, _location);
        emit ManufacturedAPI(msg.sender, shipmentID);
        return (shipmentID);
    }

    function getAPIManufacturerDeets(address shipmentID) 
        public view returns (   address _shipmentID,
                            address _AM_ID,
                            string _AM_name,
                            string _apiName,
                            uint _timestamp,
                            string _location)
    {
        (_shipmentID, _AM_ID, _AM_name, _apiName, _timestamp, _location) = pharmaDatabase.getAPIManufacturerDeets(shipmentID);
        return (_shipmentID, _AM_ID, _AM_name, _apiName, _timestamp, _location);
    }



    //  Formulator Getters and Setters 

    function setFormulatorDeets(address shipmentID,
                                string fm_name, 
                                uint mfd_date,
                                uint exp_date,
                                uint temperature,
                                uint timestamp,
                                string contents,
                                uint quantity,
                                string location)

        public returns (bool)
    {
        bool statusReturn = pharmaDatabase.setFormulatorDeets(shipmentID, msg.sender, fm_name, mfd_date, exp_date, temperature, timestamp, contents, quantity, location);
        
        emit FormulatorVerified(msg.sender, shipmentID);
        return (statusReturn);
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
        return pharmaDatabase.getFormulatorDeets(shipmentID);
        // return (_fm_id, _fm_name, _mfd_date, _exp_date, _temperature, _timestamp, _contents, _quantity, _location);
    }
    

    //  Wholesaler Getters and Setters 

    function setWholesalerDeets(address _shipmentID,
                                string _wholesalerName,
                                uint _temperature,
                                uint _timestamp,
                                string _contents,
                                uint _quantity,
                                string _location)

        public returns (bool)
    {
        bool statusReturn = pharmaDatabase.setWholesalerDeets(_shipmentID, msg.sender, _wholesalerName, _temperature, _timestamp, _contents, _quantity, _location);
        emit WholesalerVerified(msg.sender, _shipmentID);
        return (statusReturn);
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
        (_wholesalerID, _wholesalerName, _temperature, _timestamp, _contents, _quantity, _location) = pharmaDatabase.getWholesalerDeets(shipmentID);
        return (_wholesalerID, _wholesalerName, _temperature, _timestamp, _contents, _quantity, _location);
    }

    //  Pharmacist Getters and Setters 

    function setPharmacistDeets(address _shipmentID,
                                string _pharmacyName,
                                uint _timestamp,
                                string _location,
                                string _contents,
                                uint _quantity) 
        public  returns (bool)
    {
        bool statusReturn = pharmaDatabase.setPharmacistDeets(_shipmentID, msg.sender, _pharmacyName, _timestamp, _location, _contents, _quantity);
        emit PharmacistVerified(msg.sender, _shipmentID);
        return (statusReturn);
    }

    function getPharmacistDeets(address shipmentID) 
        public view returns (   address _pharmacyID,
                                string _pharmacyName,
                                uint _timestamp,
                                string _location,
                                string _contents,
                                uint _quantity)
    {
        (_pharmacyID, _pharmacyName, _timestamp, _location, _contents, _quantity) = pharmaDatabase.getPharmacistDeets(shipmentID);
        return (_pharmacyID, _pharmacyName, _timestamp, _location, _contents, _quantity);

    }
    //  Patient Getters and Setters 

    function setCustomerDeets(   address _shipmentID,
                                uint _quantity,
                                string _contents,
                                uint _price ) 
        public returns (bool)
    {
        bool statusReturn = pharmaDatabase.setCustomerDeets(_shipmentID,  msg.sender, _quantity, _contents, _price);
        emit PatientVerified(msg.sender, _shipmentID);
        return (statusReturn);
    }

    function getCustomerDeets(address shipmentID) 
        public view returns (   address _patientID,
                                uint _quantity,
                                string _contents,
                                uint _price)
    {
        (_patientID, _quantity, _contents, _price) = pharmaDatabase.getCustomerDeets(shipmentID);
        return (_patientID, _quantity, _contents, _price);
    }


}