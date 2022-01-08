var UserAbi =[
	{
		"inputs": [
			{
				"name": "_address",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_userAddress",
				"type": "address"
			},
			{
				"name": "_name",
				"type": "string"
			},
			{
				"name": "_designation",
				"type": "string"
			},
			{
				"name": "_isActive",
				"type": "bool"
			},
			{
				"name": "_profileImg",
				"type": "string"
			}
		],
		"name": "updateUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "designation",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_isActive",
				"type": "bool"
			},
			{
				"indexed": false,
				"name": "_profileImg",
				"type": "string"
			}
		],
		"name": "UserUpdate",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "adminAddress",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUser",
		"outputs": [
			{
				"name": "name",
				"type": "string"
			},
			{
				"name": "designation",
				"type": "string"
			},
			{
				"name": "_profileImg",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]