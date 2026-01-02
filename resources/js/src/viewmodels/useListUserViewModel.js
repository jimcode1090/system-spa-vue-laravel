import {useUserFilterSchema} from "@/src/composables/users/useUserFilterSchema.js";
import {useForm} from "vee-validate";
import {onMounted, ref} from "vue";
import {USER_STATES} from "@/src/constants/data-static.js";
import {useAsync} from "@/src/composables/utilities/useAsync.js";
import {usePagination} from "@/src/composables/utilities/usePagination.js";
import {userService} from "@/src/services/userService.js";
import {useBackendValidation} from "@/src/composables/utilities/useBackendValidation.js";
import {useNotification} from "@/src/composables/utilities/useNotification.js";


export function useListUserViewModel() {

    const listStatusUser = USER_STATES
    const listUsers = ref([])

    const {schema} = useUserFilterSchema()
    const {execute, loading: isSubmitting, error: asyncError} = useAsync()
    const {handleError, mapBackendErrors} = useBackendValidation()
    const {error: notifyError, success: notifySuccess} = useNotification()
    const {
        paginatedItems,
        currentPage,
        itemsPerPage,
        totalPages,
        pageNumbers,
        hasPreviousPage,
        hasNextPage,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        isPageActive,
        resetPagination
    } = usePagination(listUsers, 5)

    const {errors, defineField, handleSubmit, resetForm, setFieldValue, setErrors} = useForm({
        validationSchema: schema,
        initialValues: {
            name: null,
            username: null,
            email: null,
            state: null
        }
    })

    const [name, nameAttrs] = defineField('name')
    const [username, usernameAttrs] = defineField('username')
    const [email, emailAttrs] = defineField('email')
    const [state, stateAttrs] = defineField('state')

    onMounted(async () => {
        await fetchListUsers()
    })

    const onSubmit = handleSubmit(async (values) => {
        // Build filter object with only non-null/non-empty values
        const filters = {}
        if (values.name) filters.name = values.name
        if (values.username) filters.username = values.username
        if (values.email) filters.email = values.email
        if (values.state) filters.state = values.state

        console.log("Enviando los valores del formulario", filters)
        await fetchListUsers(filters)
    })

    const fetchListUsers = async (filters = {}) => {
        try {
            listUsers.value = await execute(() => {
                return userService.getListUsers(filters);
            })
            resetPagination()
        } catch (err) {
            console.error('Error fetching users:', err)

            // Handle all types of errors
            const errorResponse = handleError(err)
            console.log('Error details:', errorResponse)

            // If validation error (422), map to form fields
            if (errorResponse.isValidationError && errorResponse.validationErrors) {
                setErrors(mapBackendErrors(errorResponse.validationErrors))
                notifyError('Por favor corrija los errores de validación')
            } else {
                // For other errors, show notification with user-friendly message
                notifyError(errorResponse.message)
            }

            throw err
        }
    }

    const clearForm = () => {
        resetPagination()
        resetForm()
    }

    return {
        name,
        nameAttrs,
        username,
        usernameAttrs,
        email,
        emailAttrs,
        state,
        stateAttrs,

        listUsers,
        listStatusUser,

        errors,
        isSubmitting,

        paginatedItems,
        currentPage,
        itemsPerPage,
        totalPages,
        pageNumbers,
        hasPreviousPage,
        hasNextPage,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        isPageActive,

        onSubmit,
        clearForm

    }
}
