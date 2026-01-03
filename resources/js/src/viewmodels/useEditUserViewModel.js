import {ref, computed, onMounted} from 'vue'
import {useForm} from 'vee-validate'
import {useRoute, useRouter} from 'vue-router'
import {useEditUserValidationSchema} from '../composables/users/useEditUserValidationSchema.js'
import {userService} from "@/src/services/userService.js";
import {useAsync} from "@/src/composables/utilities/useAsync.js";
import {useBackendValidation} from "@/src/composables/utilities/useBackendValidation.js";
import {useNotification} from "@/src/composables/utilities/useNotification.js";

/**
 * ViewModel para editar usuario
 *
 * Responsabilidades:
 * - Obtener ID del usuario desde route params
 * - Cargar datos existentes del usuario
 * - Validar formulario de edición (password opcional)
 * - Manejar subida de archivo opcional
 * - Actualizar usuario
 */
export function useEditUserViewModel() {

    const router = useRouter()
    const route = useRoute()
    const {schema} = useEditUserValidationSchema() // Schema específico para edición
    const {execute, loading: isSubmitting} = useAsync()
    const {handleError, mapBackendErrors} = useBackendValidation()
    const {error: notifyError, success: notifySuccess} = useNotification()

    // VeeValidate form setup
    const {errors, defineField, handleSubmit, resetForm, setFieldValue, setErrors} = useForm({
        validationSchema: schema,
        initialValues: {
            firstname: '',
            secondname: '',
            lastname: '',
            username: '',
            email: '',
            password: '',
            file: null
        }
    })



    // ID del usuario (se obtiene de route.params, NO del formulario)
    const userId = ref(route.params.id)

    // Imagen actual del usuario (cargada desde el servidor)
    const currentImageUrl = ref(null)

    // Define reactive fields with validation
    const [firstname, firstnameAttrs] = defineField('firstname')
    const [secondname, secondnameAttrs] = defineField('secondname')
    const [lastname, lastnameAttrs] = defineField('lastname')
    const [username, usernameAttrs] = defineField('username')
    const [email, emailAttrs] = defineField('email')
    const [password, passwordAttrs] = defineField('password')
    const [file, fileAttrs] = defineField('file')

    // Image preview URL (para nueva imagen seleccionada)
    const imagePreviewUrl = ref(null)

    /**
     * Computed: Check if file is selected
     */
    const hasFile = computed(() => file.value !== null && file.value !== undefined)

    /**
     * Computed: Get file name
     */
    const fileName = computed(() => {
        return file.value?.name || ''
    })

    /**
     * Handle file selection with preview
     * @param {Event} event - File input change event
     */
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            setFieldValue('file', selectedFile)
            if (imagePreviewUrl.value) {
                URL.revokeObjectURL(imagePreviewUrl.value)
            }
            imagePreviewUrl.value = URL.createObjectURL(selectedFile)
        } else {
            clearFilePreview()
        }
    }

    /**
     * Clear file preview
     */
    const clearFilePreview = () => {
        if (imagePreviewUrl.value) {
            URL.revokeObjectURL(imagePreviewUrl.value)
            imagePreviewUrl.value = null
        }
        setFieldValue('file', null)
    }

    /**
     * Remove selected file
     */
    const removeFile = () => {
        clearFilePreview()
        const fileInput = document.getElementById('file')
        if (fileInput) {
            fileInput.value = ''
        }
    }

    /**
     * Submit form - actualiza el usuario
     */
    const onSubmit = handleSubmit(async (values) => {
        try {
            const formData = new FormData()

            // ID del usuario (viene de route.params)
            formData.append('id', userId.value)

            // Datos básicos (siempre se envían)
            formData.append('firstname', values.firstname)
            formData.append('secondname', values.secondname || '')
            formData.append('lastname', values.lastname)
            formData.append('username', values.username)
            formData.append('email', values.email)

            // Password - SOLO si se proporcionó (opcional en edición)
            if (values.password && values.password.trim() !== '') {
                formData.append('password', values.password)
            }

            // Archivo - SOLO si se seleccionó uno nuevo
            if (values.file) {
                formData.append('file', values.file)
            }

            await execute(() => userService.editUser(formData))

            notifySuccess('Usuario actualizado exitosamente')
            await router.push({name: 'users'})

        } catch (error) {
            // Manejo de todos los tipos de errores
            const errorResponse = handleError(error)

            // Si es error de validación (422), mapear a campos del formulario
            if (errorResponse.isValidationError && errorResponse.validationErrors) {
                setErrors(mapBackendErrors(errorResponse.validationErrors))
                notifyError('Por favor corrija los errores de validación')
            } else {
                // Para otros errores, mostrar notificación
                notifyError(errorResponse.message)
            }
        }
    })

    /**
     * Clear form
     */
    const clearForm = () => {
        resetForm()
        removeFile()
    }

    /**
     * Navigate back to user list
     */
    const goBack = () => {
        router.push({name: 'users'})
    }

    /**
     * Cargar datos del usuario a editar
     */
    const getUserById = async () => {
        try {
            if (!userId.value) {
                notifyError('ID de usuario no válido')
                router.push({name: 'users'})
                return
            }

            const users = await execute(() => userService.getListUsers({ id: userId.value }))

            if (!users || users.length === 0) {
                notifyError('Usuario no encontrado')
                router.push({name: 'users'})
                return
            }

            const user = users[0]

            // Llenar formulario con datos existentes
            firstname.value = user.firstname || ''
            secondname.value = user.secondname || ''
            lastname.value = user.lastname || ''
            username.value = user.username || ''
            email.value = user.email || ''
            // password se deja vacío - solo se llena si se quiere cambiar

            // Si el usuario tiene imagen, guardar URL actual
            if (user.file_path) {
                currentImageUrl.value = user.file_path
            }

        } catch (err) {
            const errorResponse = handleError(err)
            notifyError(errorResponse.message)
            router.push({name: 'users'})
        }
    }

    /**
     * Inicialización al montar el componente
     */
    onMounted(async () => {
        await getUserById()
    })

    return {
        // Form fields
        firstname,
        firstnameAttrs,
        secondname,
        secondnameAttrs,
        lastname,
        lastnameAttrs,
        username,
        usernameAttrs,
        email,
        emailAttrs,
        password,
        passwordAttrs,
        file,
        fileAttrs,

        // Validation errors
        errors,

        // State
        isSubmitting,
        userId,

        // File handling
        imagePreviewUrl,
        currentImageUrl, // Imagen actual del usuario
        hasFile,
        fileName,

        // Methods
        handleFileChange,
        removeFile,
        onSubmit,
        clearForm,
        goBack
    }
}
