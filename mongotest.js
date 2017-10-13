var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/homigoChallenge';

// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected successfully to server");

//     insertDocuments(db, function() {
//         updateDocument(db, function() {});
//         findDocuments(db, function() {
//             db.close;
//         });
//     });
// });

exports.insertDocument = function(db, collection, document) {
  var myCollection = db.collection(collection);
  myCollection.insert(document);
};

exports.findDocuments = function(db, collection) {
    // Get the documents collection
    var collection = db.collection(collection);
    // Find some documents
    return collection.find({}).toArray();
};

exports.removeDocuments = function(db, callback, collection) {
    // Get the documents collection
    var myCollection = db.collection(collection);
    // Delete all documents
    myCollection.remove();
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
  } else {
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
  (customer.Line.Desc) ? arr.push(customer.CompanyName) : arr.push("N/A");
  (customer.PrimaryPhone.FreeFormNumber) ? arr.push(customer.PrimaryPhone.FreeFormNumber) : arr.push("N/A");
  (customer.Balance) ? arr.push(customer.Balance) : arr.push("N/A");
  return arr;
}

function invoiceParse(invoice) {
  var arr = []
  //parse
  return arr;
}