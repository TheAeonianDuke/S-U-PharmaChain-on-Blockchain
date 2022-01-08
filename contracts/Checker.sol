pragma solidity ^0.4.23;

contract Checker {
  address public adminAddress;

    struct userDetails {
        address user_id;
        string name;
        string designation;
        bool isActive;
        string profileImg;
    }

    event userAuthorised(address user);
    event userDeAuthorised(address user);

    mapping(address => userDetails) Users;
    mapping(address => uint8) authUsers;

    constructor() public {
        adminAddress = msg.sender;
        authUsers[msg.sender] = 1;
        emit userAuthorised(msg.sender);        
    }

    modifier isAdmin() {
        require(msg.sender == adminAddress);
        _;
    }

    modifier isAuthorised() {
        require(authUsers[msg.sender] == 1);
        _;
    }

    function authoriseUser(address newUser) public isAdmin {
        authUsers[newUser] = 1;
        emit userAuthorised(newUser);
    }
    
    function deAuthoriseUser(address oldUser) public isAdmin {
        authUsers[oldUser] = 0;
        emit userDeAuthorised(oldUser);
    }
}
