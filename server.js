const connection = require("./db/database");
const cTable = require("console.table");

const { mainMenu } = require("./lib/app");

//create the connection
connection.connect((err) => {
  if (err) throw err;
  console.log(
    `====================================================================================`
  );
  console.log("\n WELCOME TO YOUR EMPLOYEE MANAGEMENT SYSTEM \n");
  console.log("connected as id " + connection.threadId + "\n");
  console.log(
    `====================================================================================`
  );
  mainMenu();
});
