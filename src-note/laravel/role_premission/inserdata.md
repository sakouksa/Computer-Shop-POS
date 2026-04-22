users
roles
user_roles(user_id,role_id) ?
INSERT INTO user_roles (user_id, role_id) VALUES
(1,1),
(2,6)

permissions
permission_roles

insert into role_permission (role_id,permission_id) values
(1,1),
(1,2),
(1,3),
...
(1,85),

INSERT INTO role_permission (role_id, permission_id)
SELECT 48 AS role_id, id FROM permissions;

user_id = 1 | permission[12,33,4,5,5,2]

SELECT
	p.*
    FROM permissions p
    INNER JOIN permission_role rp ON p.id = rp.permission_id
    INNER JOIN roles r ON rp.role_id = r.id
    INNER JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = 48;