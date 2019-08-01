// required packages 
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');
// global variables that are calculated within functions
var currentDepartment;
var salesUpdate;
var moneySpent;
// connectng to the mysql database 
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
});
// populating items from the sql database
function showItems() {
    connection.query("SELECT * From products", function(err, result){
        if (err) throw err;
        var table = new Table({ head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"] });
        for (i = 0; i < result.length; i++){
            table.push(
                [result[i].id, result[i].product_name, result[i].department_name, "$" + result[i].price , result[i].stock_quantity]
            );
        }
        console.log(table.toString());
        startQuestion();
    })
};
showItems();

function startQuestion() {
  inquirer
    .prompt([
        {
         name: "buyID",
         type: "input",
          message: "Which Item Id would you like to buy?"
        },
        {
        name: "howMany",
        type: "input",
        message: "How many would you like to buy ?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
    ])
    .then(function(answer) {

        connection.query("SELECT * FROM products WHERE id = ?", [answer.buyID], function(err,result){ 
            if (!result.length) {
                console.log("That is not a valid ID, Please enter a valid ID");
                startQuestion();
            } 
            else if (answer.howMany > result[0].stock_quantity) {
                console.log("insufficient quantity available try again");
                showItems();
            } else {
                moneySpent = answer.howMany * result[0].price;
                currentDepartment = result[0].department_name;
                console.log("youve ordered " + answer.howMany + " " + result[0].product_name + " for the amount of $" + moneySpent);
                connection.query("Update products SET ? Where ?",
                    [
                        {
                            stock_quantity: result[0].stock_quantity - answer.howMany,   
                        },
                        {
                            id: answer.buyID
                        }
                    ], 
                    function(err,result) {});
                    newOrder();
                    departmentSales();                   
            }
        });
    })
}


function newOrder() {
    inquirer
    .prompt([
        {
         name: "newChoice",
         type: "confirm",
          message: "would you like to place another order"
        }
    ])
    .then(function(answer) {
        if(answer.newChoice){
            showItems();
        } else {
            console.log("Thanks for shopping with Bamazon")
            connection.end();
        }
    });    
}

function departmentSales() {
    connection.query("SELECT * FROM products WHERE department_name = ?", [currentDepartment], function(err, result){
      salesUpdate = result[0].product_sales + moneySpent;
     departmentTable();
    })
};

function departmentTable() {
    connection.query("UPDATE products SET ? WHERE ?", [{
        product_sales: salesUpdate
    },{
        department_name: currentDepartment
    }], 
    function(err, result){});
};


