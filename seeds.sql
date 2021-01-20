INSERT INTO
  department (department_name)
VALUES
  ('Engineering'),
  ('Finance'),
  ('Sales'),
  ('Legal');
INSERT INTO
  role (title, salary, department_id)
VALUES
  ('Software Engineer', 100000, 1),
  ('Lead Engineer', 180000, 1),
  ('Accountant', 100000, 2),
  ('Finance Director', 160000, 2),
  ('Salesman', 55000, 3),
  ('Sales Lead', 90000, 3),
  ('Lawyer', 100000, 4),
  ('Legal Team Lead', 190000, 4);
INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Kevin', 'Tupik', 1, 2),
  ('Ashley', 'Rodriguez', 2, null),
  ('Malia', 'Brown', 3, 4),
  ('John', 'Jones', 4, null),
  ('John', 'Doe', 5, 6),
  ('Mike', 'Chan', 6, null),
  ('Tom', 'Allen', 7, 8),
  ('Sarah', 'Lourd', 8, null);