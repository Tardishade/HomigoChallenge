var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/homigoChallenge';

exports.insertDocument = function(db, collection, document, callback) {
  var myCollection = db.collection(collection);
  myCollection.insert(document, (err, result) => {
    if(err) {
      console.log("Document insert error");
    } else {
      console.log("inserted document");
      callback();  
    }
  });
};

exports.findDocuments = function(db, attribute, callback) {
    var collection = db.collection(attribute);
    collection.find({}).toArray((err, result) => {
      callback(result);
    });
};

exports.removeDocuments = function(db, collection, callback) {
    // Get the documents collection
    var myCollection = db.collection(collection);
    // Delete all documents
    myCollection.remove();
    callback();
};

exports.createSpecialArray = function(collection, data) {
  var arr = [];
  if (collection === "Customers") {
    data.forEach((customer) => {
      var temp = customerParse(customer);
      arr.push(temp);
    });
  } else if (collection === "Bills") {
    data.forEach((bill) => {
      var temp = billParse(bill);
      arr.push(temp);
    });  
  } else if (collection === "Invoices") {
    data.forEach((invoice) => {
      var temp = invoiceParse(invoice);
      arr.push(temp);
    }); 
  }
  return arr;
}; 

// Being passed an object, returning an array of strings.
function customerParse(customer) {
  var arr = []
  (customer.Id) ? arr.push(customer.Id) : arr.push("N/A");
  (customer.City) ? arr.push(customer.City) : arr.push("N/A");
  (customer.Line1) ? arr.push(customer.Line1) : arr.push("N/A");
  (customer.PostalCode) ? arr.push(customer.PostalCode) : arr.push("N/A");
  (customer.CompanyName) ? arr.push(customer.CompanyName) : arr.push("N/A");
  (customer.PrimaryPhone.FreeFormNumber) ? arr.push(customer.PrimaryPhone.FreeFormNumber) : arr.push("N/A");
  (customer.Balance) ? arr.push(customer.Balance) : arr.push("N/A");
  return arr;
}

function billParse(customer) {
  var arr = []
  (customer.Id) ? arr.push(customer.Id) : arr.push("N/A");
  (customer.Balance) ? arr.push(customer.Balance) : arr.push("N/A");
  (customer.DueDate) ? arr.push(customer.DueDate) : arr.push("N/A");
  (customer.TxnDate) ? arr.push(customer.TxnDate) : arr.push("N/A");
  (customer.Line[0].Description) ? arr.push(customer.Line[0].Description) : arr.push("N/A");
  (customer.Line[0].ItemBasedExpenseLineDetail.CustomerRef.name) ? arr.push(customer.Line[0].ItemBasedExpenseLineDetail.CustomerRef.name) : arr.push("N/A");
  (customer.Line[0].ItemBasedExpenseLineDetail.ItemRef.name) ? arr.push(customer.Line[0].ItemBasedExpenseLineDetail.ItemRef.name) : arr.push("N/A");
  (customer.Line[0].ItemBasedExpenseLineDetail.UnitPrice) ? arr.push(customer.Line[0].ItemBasedExpenseLineDetail.UnitPrice) : arr.push("N/A");  
  (customer.Line[0].ItemBasedExpenseLineDetail.Qty) ? arr.push(customer.Line[0].ItemBasedExpenseLineDetail.Qty) : arr.push("N/A");
  
  return arr;
}

function invoiceParse(customer) {
  var arr = []
  (customer.Id) ? arr.push(customer.Id) : arr.push("N/A");
  (customer.CustomerRef.name) ? arr.push(customer.CustomerRef.name) : arr.push("N/A");
  (customer.TotalAmt) ? arr.push(customer.TotalAmt) : arr.push("N/A");
  (customer.BillAddr.Line1) ? arr.push(customer.PostalCode) : arr.push("N/A");
  (customer.CompanyName) ? arr.push(customer.CompanyName) : arr.push("N/A");
  (customer.PrimaryPhone.FreeFormNumber) ? arr.push(customer.PrimaryPhone.FreeFormNumber) : arr.push("N/A");
  (customer.Balance) ? arr.push(customer.Balance) : arr.push("N/A");
  return arr;
}