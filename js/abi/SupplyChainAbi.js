var SupplyChainAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "getCustomerDeets",
		"outputs": [
			{
				"name": "_patientID",
				"type": "address"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
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
				"name": "_AM_name",
				"type": "string"
			},
			{
				"name": "_apiName",
				"type": "string"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			}
		],
		"name": "setAPIManufacturerDeets",
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
		"constant": false,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			},
			{
				"name": "fm_name",
				"type": "string"
			},
			{
				"name": "mfd_date",
				"type": "uint256"
			},
			{
				"name": "exp_date",
				"type": "uint256"
			},
			{
				"name": "temperature",
				"type": "uint256"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"name": "contents",
				"type": "string"
			},
			{
				"name": "quantity",
				"type": "uint256"
			},
			{
				"name": "location",
				"type": "string"
			}
		],
		"name": "setFormulatorDeets",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "getFormulatorDeets",
		"outputs": [
			{
				"name": "_fm_id",
				"type": "address"
			},
			{
				"name": "_fm_name",
				"type": "string"
			},
			{
				"name": "_mfd_date",
				"type": "uint256"
			},
			{
				"name": "_exp_date",
				"type": "uint256"
			},
			{
				"name": "_temperature",
				"type": "uint256"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_shipmentID",
				"type": "address"
			},
			{
				"name": "_wholesalerName",
				"type": "string"
			},
			{
				"name": "_temperature",
				"type": "uint256"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			}
		],
		"name": "setWholesalerDeets",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "getAPIManufacturerDeets",
		"outputs": [
			{
				"name": "_shipmentID",
				"type": "address"
			},
			{
				"name": "_AM_ID",
				"type": "address"
			},
			{
				"name": "_AM_name",
				"type": "string"
			},
			{
				"name": "_apiName",
				"type": "string"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_shipmentID",
				"type": "address"
			},
			{
				"name": "_pharmacyName",
				"type": "string"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "setPharmacistDeets",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "getNextLink",
		"outputs": [
			{
				"name": "nextLink",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newUser",
				"type": "address"
			}
		],
		"name": "authoriseUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_shipmentID",
				"type": "address"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "setCustomerDeets",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "getPharmacistDeets",
		"outputs": [
			{
				"name": "_pharmacyID",
				"type": "address"
			},
			{
				"name": "_pharmacyName",
				"type": "string"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "oldUser",
				"type": "address"
			}
		],
		"name": "deAuthoriseUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "getWholesalerDeets",
		"outputs": [
			{
				"name": "_wholesalerID",
				"type": "address"
			},
			{
				"name": "_wholesalerName",
				"type": "string"
			},
			{
				"name": "_temperature",
				"type": "uint256"
			},
			{
				"name": "_timestamp",
				"type": "uint256"
			},
			{
				"name": "_contents",
				"type": "string"
			},
			{
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"name": "_location",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
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
		"inputs": [
			{
				"name": "DatabaseAddress",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "chainMember",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "ManufacturedAPI",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "chainMember",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "FormulatorVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "chainMember",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "WholesalerVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "chainMember",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "PharmacistVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "chainMember",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "shipmentID",
				"type": "address"
			}
		],
		"name": "PatientVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			}
		],
		"name": "userAuthorised",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "user",
				"type": "address"
			}
		],
		"name": "userDeAuthorised",
		"type": "event"
	}
]