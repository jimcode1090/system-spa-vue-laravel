DROP PROCEDURE IF EXISTS sp_User_getUserById$$

CREATE PROCEDURE sp_User_getUserById(
    IN p_id INT
)
BEGIN
    SELECT
        u.id,
        u.firstname,
        u.secondname,
        u.lastname,
        u.username,
        u.email,
        u.file_id,
        CONCAT(u.firstname, ' ', IFNULL(u.secondname, ''), ' ', u.lastname) AS fullname,
        u.state,
        CASE
            WHEN u.state = 'A' THEN 'Activo'
            WHEN u.state = 'I' THEN 'Inactivo'
            ELSE 'Desconocido'
        END AS state_alias,
        f.path AS file_path,
        f.filename AS file_name,
        CONCAT('/storage/', f.path) AS profile_image,
        u.created_at,
        u.updated_at
    FROM users u
    LEFT JOIN files f ON u.file_id = f.id
    WHERE u.id = p_id
    LIMIT 1;
END
