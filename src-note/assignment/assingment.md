- Laravel + MySql JWT ORM RestAPI Testing
- React + API
    - Login , rester
    - jwt , access_token
    - role
    - permission
    - user_role
    - role_permission
    - apply message user role , permission (frontend, backend)
    - brand , category , product
    - ORM Eloquent , validation
    - list , filter , create , update , delete , upload,
Assignment
    + manage employee payroll
        position(id, name , description, paren_id)
        employee('card_id', 'image', 'first_name', 'last_name', 'gender', 'dob','email', 'tel', 'position_id', 'salary', 'employment_status',
        'payment_method_id', 'bank_account_number', 'bank_account_name' )
        payroll('title', 'payment_date', 'status', 'created_by', 'approved_by')
            01-jan "" , " "
        employee_payroll(payroll_id, employee_id,base_salary, OT, card,food, net_salary )
Assignment 2
    + Manage Expense
        - expense_type(id,name
 description)
        - expense (id ,name, description,expense_type_id(fk), amount,expense_status, expense_date[peding, paid, cancel]create_at, create_by)
assignment 3
    + manage customer
        -customer_type(id,name,description,discount_value)
            - (1 general ,'',0),
            - (1 silver ,'',10%),(50$-99$),
            - (1 gold ,'',20%),(100$-199$),
            - (1 platinum ,'',30),(200% - 300$),
        - customer_type(id,firs_name,last_name, gender, dob,tel,address,create_at,create_by)