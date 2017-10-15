var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/homigoChallenge';
var mongot = require('./mongotest.js');

exports.attributeArray = ["Customers", "Bills", "Invoice"];
exports.sendObj = {};

function myCustomers (qbo, attribute, db, callback) {
    qbo.findCustomers(function (_, customers) {
        customers.QueryResponse.Customer.forEach((element) => { 
            mongot.insertDocument(db, attribute, element);
        });
    });
    callback();    
}

function myInvoices (qbo, attribute, db, callback) {
    qbo.findInvoices(function (_, invoices) {
        invoices.QueryResponse.Invoice.forEach((element) => { 
            mongot.insertDocument(db, attribute, element);
        });
    });
    callback();    
}

function myBills (qbo, attribute, db, callback) {
    qbo.findBills(function (_, bills) {
        customers.QueryResponse.Bill.forEach((element) => { 
            mongot.insertDocument(db, attribute, element);
        });
    });
    callback();    
}

function updateObject(attribute, qbo, db) {
    if (attribute === "Customers") {
        myCustomers(qbo, attribute, db, function() {
            mongot.findDocuments(db, attribute, (result) => {
                sendObj[attribute] = mongot.createSpecialArray(attribute, result);
            });  
        });                
    } else if (attribute === "Bills") {
        myBills(qbo, attribute, db, function() {
            mongot.findDocuments(db, attribute, (result) => {
                sendObj[attribute] = mongot.createSpecialArray(attribute, result);
            });  
        });
    } else {
        myInvoices(qbo, attribute, db, function() {
            mongot.findDocuments(db, attribute, (result) => {
                sendObj[attribute] = mongot.createSpecialArray(attribute, result);
            });  
        });
    }
}

//  Update databases async and return a JSON object
exports.sendStuff = function(db, qbo, callback) {
    var myArr = ["Customers", "Bills", "Invoice"];
    myArr.forEach(function(attribute) { 
        // Clear database collection
        mongot.removeDocuments(db, attribute, function() {
            updateObject (attribute, qbo, db);
        });        
    });
    callback();    
}