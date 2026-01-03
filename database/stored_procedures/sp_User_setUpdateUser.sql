DROP PROCEDURE IF EXISTS sp_User_setUpdateUser$$
CREATE
DEFINER PROCEDURE `sp_User_setUpdateUser`(
	IN `in_id` INT,
	IN `in_firstname` VARCHAR(50),
    IN `in_secondname` VARCHAR(50),
    IN `in_lastname` VARCHAR(50),
    IN `in_username` VARCHAR(50),
    IN `in_email` VARCHAR(50),
    IN `in_password` VARCHAR(255),
    IN `in_file_id` INT
)
BEGIN
	DECLARE
v_affected_rows INT DEFAULT 0;

	-- Actualizar usuario
    -- Si password es NULL, no actualizar el campo password
    -- Si file_id es NULL, no actualizar el campo file_id
	IF
in_password IS NOT NULL AND in_file_id IS NOT NULL THEN
        -- Actualizar todo incluyendo password y file_id
UPDATE users
SET firstname  = in_firstname,
    secondname = in_secondname,
    lastname   = in_lastname,
    username   = in_username,
    email      = in_email,
    password   = in_password,
    file_id    = in_file_id,
    updated_at = NOW()
WHERE id = in_id;

ELSEIF
in_password IS NOT NULL AND in_file_id IS NULL THEN
        -- Actualizar todo incluyendo password pero NO file_id
UPDATE users
SET firstname  = in_firstname,
    secondname = in_secondname,
    lastname   = in_lastname,
    username   = in_username,
    email      = in_email,
    password   = in_password,
    updated_at = NOW()
WHERE id = in_id;

ELSEIF
in_password IS NULL AND in_file_id IS NOT NULL THEN
        -- Actualizar todo incluyendo file_id pero NO password
UPDATE users
SET firstname  = in_firstname,
    secondname = in_secondname,
    lastname   = in_lastname,
    username   = in_username,
    email      = in_email,
    file_id    = in_file_id,
    updated_at = NOW()
WHERE id = in_id;
ELSE
        -- No actualizar ni password ni file_id
UPDATE users
SET firstname  = in_firstname,
    secondname = in_secondname,
    lastname   = in_lastname,
    username   = in_username,
    email      = in_email,
    updated_at = NOW()
WHERE id = in_id;
END IF;

	-- Obtener número de filas afectadas
    SET
v_affected_rows = ROW_COUNT();

END
