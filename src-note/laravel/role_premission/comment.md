+ user
Role (id , name , email)

php artisan make:migration create_user_roles_table

permission (id , name , group , is_menu_web , web_route_key)
Example : Data
    1 'product.get_list' , 'product' , 1 , '/product'
    1 'product.get_one' , 'product' , null , null,
    1 'product.create' , 'product' , null , null,
    1 'product.update' , 'product' , null , null,
    1 'product.delete' , 'product' , null , null,

    1 'category.get_list' , 'category' , 1 , '/category'
    1 'category.get_one' , 'category' , null , null,
    1 'category.create' , 'category' , null , null,
    1 'category.update' , 'category' , null , null,
    1 'category.delete' , 'category' , null , null,

+ insert data in sql statement
INSERT INTO Permissions (`name`, `group`, `is_menu_web`, `web_route_key`) VALUES

-- DASHBOARD (ផ្ទាំងគ្រប់គ្រង)

('Dashboard.View', 'Dashboard', 1, ''),

-- SALES (ការលក់)
('POS.View', 'Sales', 1, '/pos'),
('Order.View', 'Sales', 1, '/orders'),

-- 3. REPORT (របាយការណ៍)
('Report.TopSale', 'Report', 1, '/report/to_sales'),
('Report.Order', 'Report', 1, '/order'),
('Report.Purchase', 'Report', 1, '/report/purchase'),
('Report.Expense', 'Report', 1, '/report/expense'),


-- 4. CUSTOMER (អតិថិជន)
('Customer.View', 'Customer', 1, '/customer'),
('Customer.ViewOne', 'Customer', NULL, NULL),
('Customer.Create', 'Customer', NULL, NULL),
('Customer.Update', 'Customer', NULL, NULL),
('Customer.Delete', 'Customer', NULL, NULL),
('Customer.ChangeMembership', 'Customer', NULL, NULL),

-- 5. CUSTOMER TYPE
('CustomerType.View', 'CustomerType', 1, '/customer_type'),
('CustomerType.ViewOne', 'CustomerType', NULL, NULL),
('CustomerType.Create', 'CustomerType', NULL, NULL),
('CustomerType.Update', 'CustomerType', NULL, NULL),
('CustomerType.Delete', 'CustomerType', NULL, NULL),

-- 6. INVENTORY (សារពើភ័ណ្ឌ)

-- PRODUCT
('Product.View', 'Product', 1, '/product'),
('Product.Card', 'Product', 1, '/product-card'),
('Product.ViewOne', 'Product', NULL, NULL),
('Product.Create', 'Product', NULL, NULL),
('Product.Update', 'Product', NULL, NULL),
('Product.Delete', 'Product', NULL, NULL),
('Product.AdjustStock', 'Product', NULL, NULL),

-- CATEGORY
('Category.View', 'Category', 1, '/category'),
('Category.ViewOne', 'Category', NULL, NULL),
('Category.Create', 'Category', NULL, NULL),
('Category.Update', 'Category', NULL, NULL),
('Category.Delete', 'Category', NULL, NULL),

-- BRAND
('Brand.View', 'Brand', 1, '/brand'),
('Brand.ViewOne', 'Brand', NULL, NULL),
('Brand.Create', 'Brand', NULL, NULL),
('Brand.Update', 'Brand', NULL, NULL),
('Brand.Delete', 'Brand', NULL, NULL),


-- 7. PURCHASE (ការទិញចូល)

('Purchase.View', 'Purchase', 1, '/purchase'),
('Purchase.ViewOne', 'Purchase', NULL, NULL),
('Purchase.Create', 'Purchase', NULL, NULL),
('Purchase.Update', 'Purchase', NULL, NULL),
('Purchase.Delete', 'Purchase', NULL, NULL),

-- SUPPLIER
('Supplier.View', 'Supplier', 1, '/supplier'),
('Supplier.ViewOne', 'Supplier', NULL, NULL),
('Supplier.Create', 'Supplier', NULL, NULL),
('Supplier.Update', 'Supplier', NULL, NULL),
('Supplier.Delete', 'Supplier', NULL, NULL),

-- 8. EXPENSE (ចំណាយផ្សេងៗ)

('Expense.View', 'Expense', 1, '/expense'),
('Expense.ViewOne', 'Expense', NULL, NULL),
('Expense.Create', 'Expense', NULL, NULL),
('Expense.Update', 'Expense', NULL, NULL),
('Expense.Delete', 'Expense', NULL, NULL),

-- EXPENSE TYPE
('ExpenseType.View', 'ExpenseType', 1, '/expense-type'),
('ExpenseType.ViewOne', 'ExpenseType', NULL, NULL),
('ExpenseType.Create', 'ExpenseType', NULL, NULL),
('ExpenseType.Update', 'ExpenseType', NULL, NULL),
('ExpenseType.Delete', 'ExpenseType', NULL, NULL),

-- EMPLOYEE (បុគ្គលិក)
('Employee.View', 'Employee', 1, '/employee'),
('Employee.ViewOne', 'Employee', NULL, NULL),
('Employee.Create', 'Employee', NULL, NULL),
('Employee.Update', 'Employee', NULL, NULL),
('Employee.Delete', 'Employee', NULL, NULL),

-- PAYROLL
('Payroll.View', 'Payroll', 1, '/payroll'),
('Payroll.ViewOne', 'Payroll', NULL, NULL),
('Payroll.Create', 'Payroll', NULL, NULL),
('Payroll.Update', 'Payroll', NULL, NULL),
('Payroll.Delete', 'Payroll', NULL, NULL),


-- USER MANAGEMENT (អ្នកប្រើប្រាស់)

('User.View', 'User', 1, '/list'),
('User.ViewOne', 'User', NULL, NULL),
('User.Create', 'User', NULL, NULL),
('User.Update', 'User', NULL, NULL),
('User.Delete', 'User', NULL, NULL),

-- ROLE
('Role.View', 'Role', 1, '/role'),
('Role.ViewOne', 'Role', NULL, NULL),
('Role.Create', 'Role', NULL, NULL),
('Role.Update', 'Role', NULL, NULL),
('Role.Delete', 'Role', NULL, NULL),

-- PERMISSION
('Permission.View', 'Permission', 1, '/permission'),
('Permission.Update', 'Permission', NULL, NULL),


-- SETTINGS (ការកំណត់)

('Language.View', 'Settings', 1, '/lang'),
('Province.View', 'Settings', 1, '/province'),
('Currency.View', 'Settings', 1, '/currency'),

-- PAYMENT METHOD
('PaymentMethod.View', 'PaymentMethod', 1, '/payment_method'),
('PaymentMethod.ViewOne', 'PaymentMethod', NULL, NULL),
('PaymentMethod.Create', 'PaymentMethod', NULL, NULL),
('PaymentMethod.Update', 'PaymentMethod', NULL, NULL),
('PaymentMethod.Delete', 'PaymentMethod', NULL, NULL);


> php artisan make:model Permission -m
> php artisan make:controller PermissionController --api

> php artisan make:migration create_permission_role_table

