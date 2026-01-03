CREATE PROCEDURE `sp_User_setCreateUser`(
	IN `in_firstname` VARCHAR(50),
    IN `in_secondname` VARCHAR(50),
    IN `in_lastname` VARCHAR(50),
    IN `in_username` VARCHAR(50),
    IN `in_email` VARCHAR(50),
    IN `in_password` VARCHAR(250),
    IN `in_file_id` INT
)
BEGIN
INSERT INTO
    users 	    (firstname, secondname, lastname, username, email, password, file_id, state, created_by, updated_by, created_at)
VALUES 			(in_firstname, in_secondname, in_lastname, in_username, in_email, in_password, in_file_id, 'A', 1, 1, NOW());
END
