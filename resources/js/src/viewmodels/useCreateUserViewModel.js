import {ref, computed} from 'vue'
import {useForm} from 'vee-validate'
import {useRouter} from 'vue-router'
import {useUserValidationSchema} from '../composables/users/useUserValidationSchema.js'
import {userService} from "@/src/services/userService.js";
import {useAsync} from "@/src/composables/utilities/useAsync.js";
import {useBackendValidation} from "@/src/composables/utilities/useBackendValidation.js";
import {useNotification} from "@/src/composables/utilities/useNotification.js";

/**
 * Create User ViewModel
 *
 * Handles all business logic for user creation:
 * - Form state management
 * - Validation
 * - API communication
 * - Navigation
 * - File preview
 *
 * Following MVVM pattern - View binds to this ViewModel
 */
export function useCreateUserViewModel() {

    const router = useRouter()
    const {schema} = useUserValidationSchema()
    const {execute, loading: isSubmitting, error: asyncError} = useAsync()
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

    // Define reactive fields with validation
    const [firstname, firstnameAttrs] = defineField('firstname')
    const [secondname, secondnameAttrs] = defineField('secondname')
    const [lastname, lastnameAttrs] = defineField('lastname')
    const [username, usernameAttrs] = defineField('username')
    const [email, emailAttrs] = defineField('email')
    const [password, passwordAttrs] = defineField('password')
    const [file, fileAttrs] = defineField('file')

    // Image preview URL
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
     * Submit form - creates new user
     */
    const onSubmit = handleSubmit(async (values) => {
        try {
            const formData = new FormData()
            formData.append('firstname', values.firstname)
            formData.append('secondname', values.secondname || '')
            formData.append('lastname', values.lastname)
            formData.append('username', values.username)
            formData.append('email', values.email)
            formData.append('password', values.password)

            if (values.file) {
                formData.append('file', values.file)
            }

            await execute(() => {
                return userService.createUser(formData)
            })

            notifySuccess('Usuario registrado exitosamente')
            await router.push({name: 'users'})

        } catch (error) {
            console.error('Error al crear usuario:', error)

            // Handle all types of errors
            const errorResponse = handleError(error)
            console.log('Error details:', errorResponse)

            // If validation error (422), map to form fields
            if (errorResponse.isValidationError && errorResponse.validationErrors) {
                setErrors(mapBackendErrors(errorResponse.validationErrors))
                notifyError('Por favor corrija los errores de validación')
            } else {
                // For other errors, show notification
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

        // File handling
        imagePreviewUrl,
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
