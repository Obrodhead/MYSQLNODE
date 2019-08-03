var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table2');
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
  supervisorOptions();
  
});
function supervisorOptions() {
inquirer
    .prompt([
        {
         name: "intro",
         type: "list",
          message: "What would you like to do?",
          choices: ["1) View sales by department", "2) Create new Department", "3) EXIT"]
        }
    ])
    .then(function(answer) {
        if (answer.intro === "1) View sales by department") {
            showDepartments();
        } else if (answer.intro === "2) Create new Department") {
            newDepartment();
        } else {
            console.log("Thank you for using Bamazon Supervisor view, Good Bye");
            connection.end();
        }

    });
};

function showDepartments() {
    connection.query("SELECT " +
    "d.department_id," +
    "d.department_name," +
    "d.over_head_costs," +
    "SUM(IFNULL(p.product_sales ,0)) as product_sales," +
   "SUM(IFNULL(p.product_sales ,0)) - d.over_head_costs as total_profit" +
    "FROM products p" +
    "RIGHT join departments d on p.department_name = d.department_name" +
    "GROUP BY" +
    "d.department_id," +
    "d.department_name," +
    "d.over_head_costs", function(err, result){
        if (err) throw err;
        var table = new Table({ head: ["Department ID", "Department Name", "Product Sales", "Total Profit",] });
        for (i = 0; i < result.length; i++){
            table.push(
                [result[i].department_id, result[i].department_name, result[i].overhead_costs]
            );
        }
        console.log(table.toString());
    
      if (err) throw err;
        newOrder();
    })
};

function newDepartment() {
    inquirer
    .prompt([
        {
        name: "departmentName",
        type: "input",
        message: "What's the name of the department you would like to add?"
        },{
        name: "overhead",
        type: "input",
        message: "What's the overhead cost?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
    ])
    .then(function(answer) {
        connection.query("Insert into departments SET ?",{
            department_name: answer.departmentName,
            overhead_costs: answer.overhead
        }, function(err,result){});
        newOrder();
    });
};

function newOrder() {
    inquirer
    .prompt([
        {
         name: "newChoice",
         type: "confirm",
          message: "would you like to anything else"
        }
    ])
    .then(function(answer) {

        if(answer.newChoice){
            supervisorOptions();
        } else {
            console.log("Thanks for using Bamazon! :)")
            connection.end();
        }
    });    
}