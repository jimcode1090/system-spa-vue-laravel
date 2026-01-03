CREATE PROCEDURE `sp_User_getListUsers`(
	IN `in_name` VARCHAR(50),
	IN `in_username` VARCHAR(50),
	IN `in_email` VARCHAR(50),
	IN `in_state` CHAR(1)
)
BEGIN
SELECT 	u.id,
          CONCAT_WS('', u.firstname, u.secondname, u.lastname) AS fullname,
          u.firstname,
          u.secondname,
          u.lastname,
          u.username,
          IFNULL(u.email, '') AS email,
          CASE IFNULL(u.state, '') WHEN 'A' 	THEN 'ACTIVO'
                                   ELSE 'INACTIVO'
              END state_alias,
          IFNULL(u.state, '') AS state

FROM users u
WHERE	CONCAT_WS('', u.firstname, u.secondname, u.lastname) LIKE CONCAT('%', in_name COLLATE utf8mb4_unicode_ci, '%')
  AND	CONCAT_WS('', u.username) LIKE	CONCAT('%', in_username COLLATE utf8mb4_unicode_ci, '%')
  AND	CONCAT_WS('', u.email) LIKE	CONCAT('%', in_email COLLATE utf8mb4_unicode_ci, '%')
  AND	(u.state = in_state COLLATE utf8mb4_unicode_ci OR in_state = '')
ORDER	BY	u.id DESC;
END
