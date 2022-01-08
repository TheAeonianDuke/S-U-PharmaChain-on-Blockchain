pragma solidity ^0.4.23;
import "./Database.sol";


contract User {
    address public adminAddress;
    Database pharmaDatabase;
    event UserUpdate(address indexed user, string name, string designation, bool _isActive,string _profileImg);
    

    constructor(address _address) public {
        adminAddress = msg.sender;
        pharmaDatabase = Database(_address);
    }

    modifier isAdmin() {
        require(msg.sender == adminAddress);
        _;
    }

    function updateUser(address _userAddress, string _name, string _designation, bool _isActive,string _profileImg) public 
    {
        require(_userAddress != address(0));
        
        /* Call Storage Contract */
        pharmaDatabase.setUserDetails(_userAddress, _name, _designation, _isActive, _profileImg);
        
         /*call event*/
        emit UserUpdate(_userAddress, _name, _designation, _isActive, _profileImg);
        
    }
    
   

    function getUser(address _userAddress) public view returns(string name, string designation, string _profileImg){
        require(_userAddress != address(0));
        
        /*Getting value from struct*/
       (name, designation, _profileImg) = pharmaDatabase.getUserDetails(_userAddress);
       
       return (name, designation, _profileImg);
    }
}
