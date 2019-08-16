var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');
// connects to the mysql database 
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
// populates items from the sql database
function viewProducts() {
    connection.query("SELECT * From products", function(err, results){
        if (err) throw err;
        var table = new Table({ head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"] });
        for (i = 0; i < results.length; i++){
            table.push(
                [results[i].id, results[i].product_name, results[i].department_name, "$" + results[i].price , results[i].stock_quantity]
            );
        }
        console.log(table.toString());
    })
};

function startQuestion() {
    inquirer
      .prompt([
          {
           name: "whatOption",
           type: "list",
            message: "What would you like to do",
            choices: ["1) View products for sale","2) View low inventory", "3) Add to inventory", "4) Add new product"]
          }
      ])
      .then(function(answer) {
            if (answer.whatOption === "1) View products for sale") {
                viewProducts();
                setTimeout(followUp, 1000);
            } else if (answer.whatOption === "2) View low inventory") {
                lowInventory();
            } else if (answer.whatOption === "3) Add to inventory") {
                viewProducts();
                setTimeout(inventoryAdd, 1000);
            } else if (answer.whatOption === "4) Add new product") {
                productAdd();
            }
                
      });
};

    startQuestion();

    function lowInventory() {
        connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err,results){
            if (err) throw err;
            if(!results.length) {
                console.log("there is no low inventory at this time")
                followUp();
            } else {
                var table = new Table({ head: ["Item ID", "Product Name", "Department", "Price", "Stock Quantity"] });
                for ( i = 0; i < results.length; i++) {
                    table.push(
                        [results[i].id, results[i].product_name, results[i].department_name, "$" + results[i].price , results[i].stock_quantity]
                    );
                }
                console.log(table.toString());
            };
            
        })
    
    
    };

    function inventoryAdd (){
        inquirer
      .prompt([
          {
           name: "item",
           type: "input",
            message: "Which product ID would you like to add inventory for?"
          },
          {
            name: "add",
            type: "input",
             message: "How many would you like to add?"
          }
          
      ])
      .then(function(answer) {
        connection.query("Select * FROM products WHERE id = ?", [answer.item], function (err,results){
            if (err) throw err;
            connection.query("UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: results[0].stock_quantity + parseInt(answer.add)
            },{
                id: answer.item
            }],
            function(err){
                if (err) throw err;
                console.log("quantity updated successfully");
                setTimeout(viewProducts, 1000);
                setTimeout(followUp, 2000);
            }
            )

        })

      });
    };

    function productAdd() {
       inquirer
       .prompt([
            {
             name: "product",
             type: "input",
              message: "What is the product name you would like to add"
            },
            {
                name: "category",
                type: "input",
                message: "What is the department name for the product?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the product?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            },
            {
                name: "amount",
                type: "input",
                message: "How many of the product are we adding?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
              }
        ])
        .then(function(answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                   product_name: answer.product,
                   department_name: answer.category,
                   price: answer.price || 0,
                   stock_quantity: answer.amount || 0
                },
                function(err) {
                    if (err) throw err;
                    console.log("You have successfully added your item");
                    setTimeout(viewProducts, 1000);
                    setTimeout(followUp, 2000);
                }
            )

        });
    };

    function followUp() {
       inquirer
       .prompt([
            {
             name: "next",
             type: "confirm",
              message: "What would you like to do anything else",
            }
        ])
        .then(function(answer) {
            if (answer.next) {
               startQuestion();
            } else {
                console.log("Thanks for using Bamazon Manager View, Good Bye");
                connection.end();
            }})}
