CREATE PROCEDURE `sp_File_setStoreFile`(
    IN `in_path` VARCHAR (250),
    IN `in_filename` VARCHAR (50)
)
BEGIN
INSERT INTO files (path, filename, created_by, updated_by, created_at, updated_at)
VALUES (in_path, in_filename, 1, 1, NOW(), NOW());

/*OBTENER EL ULTIMO ID REGISTRADO*/
SET
@idFile := (SELECT ((IFNULL(MAX(image.id), 1))) FROM files image);
	/*RETORNAMOS*/
SELECT @idFile as idFile;
END
