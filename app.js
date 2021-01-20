const connection = require("../db/database");
// import inquirer
const inquirer = require("inquirer");

// Main menu function
function mainMenu() {
  // Prompt user to choose an option
  inquirer
    .prompt({
      name: "main",
      type: "list",
      message: "MAIN MENU",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "View all employees by department",
        "View all employees by manager",
        "View department budget",
        "Add employee",
        "Add role",
        "Add department",
        "Update employee role",
        "Update employee manager",
        "Delete employee",
        "Delete employee role",
        "Delete department",
        "Exit",
      ],
    })
    .then((answer) => {
      // Switch case depending on user option
      switch (answer.main) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllEmpRoles();
          break;
        case "View all employees by department":
          viewAllEmpByDept();
          break;
        case "View all employees by manager":
          viewAllEmpByManager();
          break;
        case "View department budget":
          viewDeptartmentBudget();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add role":
          addEmpRole();
          break;
        case "Add department":
          addDeptartment();
          break;
        case "Update employee role":
          updateEmpRole();
          break;
        case "Update employee manager":
          updateEmpManager();
          break;
        case "Delete employee":
          deleteEmployee();
          break;
        case "Delete employee role":
          deleteRole();
          break;
        case "Delete department":
          deleteDeptartment();
          break;

        case "Exit":
          connection.end();
          break;
        default:
          mainMenu();
      }
    });
}
// ----- VIEW OPTIONS -----
const viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name AS 'First Name', 
               employee.last_name AS 'Last Name', role.title AS 'Job Title', 
               department.department_name AS 'Department', role.salary AS 'Salary', 
               CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
               FROM employee
               LEFT JOIN employee manager on manager.id = employee.manager_id
               INNER JOIN role ON (role.id = employee.role_id)
               INNER JOIN department ON (department.id = role.department_id);`;
  const params = [];
  connection.query(sql, params, (err, res) => {
    if (err) throw err;
    console.table("\n All Employees \n", res, "\n");

    mainMenu();
  });
};
const viewAllDepartments = () => {
  const sql = `SELECT department.id, department.department_name AS Department FROM department`;
  const params = [];
  connection.query(sql, params, (err, res) => {
    if (err) throw err;
    console.table("\n All Departments \n", res, "\n");

    mainMenu();
  });
};

const viewAllEmpRoles = () => {
  const sql = `SELECT role.id, role.title AS 'Job Title', role.salary AS 'Salary', 
                department.department_name AS 'Department' 
               FROM role INNER JOIN department ON 
                role.department_id = department.id`;
  const params = [];
  connection.query(sql, params, (err, res) => {
    if (err) throw err;
    console.table("\n All Employee Roles \n", res, "\n");

    mainMenu();
  });
};

const viewAllEmpByDept = () => {
  const sql = `SELECT department.department_name AS Department, role.title AS 'Job Title', 
               employee.id, employee.first_name AS 'First Name', 
               employee.last_name AS 'Last Name'
               FROM employee
               LEFT JOIN role ON (role.id = employee.role_id)
               LEFT JOIN department ON (department.id = role.department_id);`;
  const params = [];
  connection.query(sql, params, (err, res) => {
    if (err) throw err;
    console.table("\n All Employee Roles by Department\n", res, "\n");

    mainMenu();
  });
};

const viewAllEmpByManager = () => {
  const sql = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager', 
               department.department_name AS 'Department', employee.id, employee.first_name AS 'First Name', 
               employee.last_name AS 'Last Name', role.title AS 'Job Title'
               FROM employee
               LEFT JOIN employee manager on manager.id = employee.manager_id
               INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
               INNER JOIN department ON (department.id = role.department_id);`;
  const params = [];
  connection.query(sql, params, (err, res) => {
    if (err) throw err;
    console.table("\n All Employee by Manager \n", res, "\n");
    mainMenu();
  });
};

const viewDeptartmentBudget = () => {
  const sql = `SELECT department_id AS id, 
               department_name AS Department,
               SUM(salary) AS Budget
               FROM role 
               JOIN department ON role.department_id = department.id 
               GROUP BY department_id;`;
  const params = [];
  connection.query(sql, params, (err, res) => {
    if (err) throw err;
    console.table("\n View all Department's Budgets \n", res, "\n");

    mainMenu();
  });
};

// ----- ADD OPTIONS -----
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstname",
        message: "Please enter an employee's First Name",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter an employee's First Name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastname",
        message: "Please enter an employee's Last Name",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            console.log("Please enter an employee's Last Name");
            return false;
          }
        },
      },
      {
        name: "role",
        type: "list",
        message: "What is their role? ",
        choices: rolesList(),
      },
      {
        name: "manager",
        type: "list",
        message: "Who is their manager?",
        choices: managerList(),
      },
    ])
    .then((res) => {
      const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
        (SELECT id FROM role WHERE title = ? ), 
        (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ? ) AS newtable))`;
      connection.query(
        sql,
        [res.firstname, res.lastname, res.role, res.manager],
        function (err) {
          if (err) throw err;
          console.table(
            `${(res.firstname, res.lastname)} was succesfully added. \n`
          );
          mainMenu();
        }
      );
    });
};

const addEmpRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the new role title:",
        validate: (roleInput) => {
          if (roleInput) {
            return true;
          } else {
            console.log("Please enter the new role title:");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the salary for the new role:",
        validate: (salaryInput) => {
          if (salaryInput) {
            return true;
          } else {
            console.log("Please enter the salary for the new role:");
            return false;
          }
        },
      },
      {
        name: "department",
        type: "list",
        message: "Which department should this role belong to?",
        choices: departmentList(),
      },
    ])
    .then((res) => {
      const sql = `INSERT INTO role(title, salary, department_id) VALUES(?, ?, 
      (SELECT id FROM department WHERE department_name = ?));`;
      connection.query(sql, [res.title, res.salary, res.department], function (
        err
      ) {
        if (err) throw err;
        console.log(`${res.title} role was succesfully added. \n`);
        mainMenu();
      });
    });
};

const addDeptartment = () => {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What department would you like to add?",
      validate: (deptInput) => {
        if (deptInput) {
          return true;
        } else {
          console.log("Please enter a department name.");
          return false;
        }
      },
    })
    .then(function (res) {
      const sql = "INSERT INTO department SET ?";
      connection.query(sql, { department_name: res.department }, function (
        err
      ) {
        if (err) throw err;
        console.log(`${res.department} department was succesfully added. \n`);
        mainMenu();
      });
    });
};

// ----- UPDATE OPTIONS -----
const updateEmpRole = () => {
  const sql = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employee`;
  let employeeArr = [];
  connection.query(sql, function (err, res) {
    if (err) throw err;
    res.forEach((employee) => {
      // employeeArr.push([employee.first_name, employee.last_name]);
      employeeArr.push(employee.full_name);
    });

    let roleArr = [];
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      res.forEach((role) => {
        roleArr.push(role.title);
      });
    });

    inquirer
      .prompt([
        {
          name: "selectedEmployee",
          type: "list",
          message: "Please select the employee:",
          choices: employeeArr,
        },
        {
          name: "selectedRole",
          type: "list",
          message: "Please select their new role:",
          choices: roleArr,
        },
      ])
      .then((answer) => {
        const sql = `UPDATE employee 
        SET role_id = (SELECT id FROM role WHERE title = ? ) 
        WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS newtable)`;
        connection.query(
          sql,
          [answer.selectedRole, answer.selectedEmployee],
          (err) => {
            if (err) throw err;
            console.log(
              `${answer.selectedEmployee}has had their role updated to ${answer.selectedRole}`
            );
            mainMenu();
          }
        );
      });
  });
};

const updateEmpManager = () => {
  let employeeArr = [];
  const sql = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employee`;
  connection.query(sql, function (err, res) {
    if (err) throw err;
    res.forEach((employee) => {
      // employeeArr.push([employee.first_name, employee.last_name]);
      employeeArr.push(employee.full_name);
    });
    inquirer
      .prompt([
        {
          name: "chosenEmployee",
          type: "list",
          message: "Which employee has a new manager?",
          choices: employeeArr,
        },
        {
          name: "newManager",
          type: "list",
          message: "Who is their manager?",
          choices: employeeArr,
        },
      ])
      .then((answer) => {
        //converting chosen names into a number by grabbing the index and setting it to the employee.id
        let employeeId, managerId;

        res.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;

        connection.query(sql, [managerId, employeeId], (err) => {
          if (err) throw err;
          console.log(
            `${employeeId} has been succesfully updated to ${managerId}. \n`
          );
          mainMenu();
        });
      });
  });
};

// ----- DELETE OPTIONS -----
const deleteEmployee = () => {
  const sql = `SELECT * FROM employee`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const employees = res.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to delete?",
          choices: employees,
        },
      ])
      .then((answer) => {
        const employee = answer.name;

        const sql = `DELETE FROM employee WHERE id = ?`;

        connection.query(sql, employee, (err) => {
          if (err) throw err;
          console.log(`Successfully Deleted!`);

          mainMenu();
        });
      });
  });
};

const deleteRole = () => {
  const sql = `SELECT * FROM role`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const role = res.map(({ title, id }) => ({ name: title, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "What role do you want to delete?",
          choices: role,
        },
      ])
      .then((answer) => {
        const role = answer.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err) => {
          if (err) throw err;
          console.log("Successfully deleted!");
          mainMenu();
        });
      });
  });
};

const deleteDeptartment = () => {
  const sql = `SELECT * FROM department`;

  connection.query(sql, (err, res) => {
    if (err) throw err;

    const dept = res.map(({ name, id }) => ({ name: name, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "What department do you want to delete?",
          choices: dept,
        },
      ])
      .then((answer) => {
        const dept = answer.department;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err) => {
          if (err) throw err;
          console.log("Successfully deleted!");

          mainMenu();
        });
      });
  });
};

// ----- ARRAY functions -----

//loops through the job titles
function rolesList() {
  let roleArr = [];
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    res.forEach((role) => {
      roleArr.push(role.title);
    });
  });
  return roleArr;
}

//loops through all the managers
function managerList() {
  let managerArr = [];
  const sql = `SELECT CONCAT (first_name, " ",  last_name) AS full_name FROM employee WHERE manager_id IS NULL`;
  connection.query(sql, function (err, res) {
    if (err) throw err;
    res.forEach((manager) => {
      managerArr.push(manager.full_name);
    });
  });
  return managerArr;
}

//loops through the departments
function departmentList() {
  let departmentArr = [];
  connection.query("SELECT department_name FROM department", function (
    err,
    res
  ) {
    if (err) throw err;
    res.forEach((department) => {
      departmentArr.push(department.department_name);
    });
  });
  return departmentArr;
}

module.exports = {
  mainMenu,
  viewAllEmployees,
  viewAllDepartments,
  viewAllEmpRoles,
  viewAllEmpByDept,
  viewAllEmpByManager,
  viewDeptartmentBudget,
  addEmployee,
  addEmpRole,
  addDeptartment,
  updateEmpRole,
  updateEmpManager,
  deleteEmployee,
  deleteRole,
  deleteDeptartment,
};
