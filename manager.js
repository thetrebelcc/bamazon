var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    managerOptions();
});

function managerOptions() {
    inquirer.prompt([{
        name: "options",
        message: "What would you like to do?",
        type: "list",
        choices: [{
            name: "View Products"
        }, {
            name: "View Low Inventory"
        }, {
            name: "Add to Inventory"
        }, {
            name: "Add New Product"
        }]
    }]).then(function(answer) {
        if (answer.options === "View Products") {
            saleItems();
        };
        if (answer.options === "View Low Inventory") {
            lowStock();
        };
        if (answer.options === "Add to Inventory") {
            addInventory();
        };
        if (answer.options === "Add New Product") {
        	addProduct();
        }
    });
};


function saleItems() {
    //This function should list every available item: the item IDs, names, prices, and quantities.
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------\n");
        managerOptions();
    });
};

function lowStock() {
    //This function should list all items with an inventory count lower than five.
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        };
        console.log("-----------------------------------\n");
        managerOptions();

    });
};


function addInventory() {
    //This function should display a prompt that will let the manager "add more" of any item currently in the store
    connection.query("SELECT * FROM products", function(err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
                }
                inquirer.prompt([{
                            name: "item",
                            type: "input",
                            message: "What is the id of the item you would like to restock?"
                        },
                        {
                            name: "quantity",
                            type: "input",
                            message: "How many units of the item are you restocking?",
                            validate: function(value) {
                                if (isNaN(value) === false) {
                                    return true;
                                }
                                return false;
                            }
                        }
                    ])
                    .then(function(answer) {
                        connection.query("SELECT * FROM products", function(err, res) {
                            var units = parseInt(answer.quantity);
                            var itemID = parseInt(answer.item) - 1;

                            var newQuantity = res[itemID].stock_quantity + units;
                            //console.log(newQuantity);
                            var query = "UPDATE products SET ? WHERE ?";
                            connection.query(query, [{ stock_quantity: newQuantity }, { item_id: answer.item }], function(err, res) {
                                console.log("Items successfully restocked!");
                                managerOptions();
                            });
                        });
                    });
            });
};
		
function addProduct() {
    //This function should allow the manager to add a completely new product to the store.
    inquirer.prompt([
    {
        name: "item",
        type: "input",
        message: "What is the name of the new product you'd like to add?"
    }, 
    {
        name: "department",
        type: "input",
        message: "Which department should this item be added to?",
        },
        {
        	name: "price",
        	type: "input",
        	message: "What is the price of an individual item?",
        	validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } 
                return false;
            }
        }, {
        	name: "quantity",
        	type: "input",
        	message: "How many items would you like to stock?",
        	validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } 
                return false;
            }
        }
    ]).then(function(answer) {
            connection.query(
                    "INSERT INTO products SET ?",
                    {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function(err) {
                    if (err) throw err;
                    console.log("Your item was added successfully!");
                    managerOptions();
                }
        );
    });
};