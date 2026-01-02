<script setup>
import {computed, onMounted, reactive, ref} from "vue"
import {userService} from "../../services/userService"
import {useAsync} from "../../composables/utilities/useAsync"
import {usePagination} from "../../composables/utilities/usePagination"
import FormFilter from "../../components/users/FormFilter.vue"
import {USER_STATES} from "@/src/constants/data-static.js"

const listStatus = USER_STATES
const formFilterData = reactive({
    name: "",
    username: "",
    email: "",
    state: "",
})

const {execute} = useAsync();

const listUsers = ref([])

// Configurar paginación
const {
    paginatedItems: listUsersPaginated,
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

const clearSearch = () => {
    formFilterData.name = ""
    formFilterData.username = ""
    formFilterData.email = ""
    formFilterData.state = ""
    resetPagination()
}

onMounted(async () => {
    await fetchListUsers()
})
const fetchListUsers = async () => {
    try {
        listUsers.value = await execute(() => {
            return userService.getListUsers(formFilterData);
        })
        resetPagination()
        console.log(listUsers.value)
    } catch (err) {
        console.error(err)
    }
}

const clearListUsers = () => {
    listUsers.value = []
    resetPagination()
}

</script>

<template>
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0 text-dark">Usuarios</h1>
                </div>
            </div>
        </div>
        <div class="content container-fluid">
            <div class="card">
                <div class="card-header">
                    <div class="card-tools">
                        <RouterLink to="#" class="btn btn-info btn-sm">
                            <i class="fas fa-plus-square"></i> Nuevo Usuario
                        </RouterLink>
                    </div>
                </div>
                <div class="card-body">
                    <div class="container-fluid">
                        <div class="card card-info">
                            <div class="card-header">
                                <h3 class="card-title">
                                    Criterios de Búsqueda
                                </h3>
                            </div>
                            <div class="card-body">
                                <FormFilter :formFilterData="formFilterData" :listStatus="listStatus"/>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-md-4 offset-4">
                                        <button
                                            class="btn btn-flat btn-info btn-width"
                                            @click.prevent="fetchListUsers"
                                        >
                                            Buscar
                                        </button>
                                        <button
                                            class="btn btn-flat btn-default btn-width"
                                            @click.prevent="clearSearch"
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card card-info">
                            <div class="card-header">
                                <h3 class="card-title">
                                    Bandeja de Resultados
                                </h3>
                            </div>
                            <div class="card-body table-responsive">
                                <template v-if="listUsersPaginated.length ">
                                    <table
                                        class="table table-hover table-head-fixed text-nowrap projects"
                                    >
                                        <thead>
                                        <tr>
                                            <th>Fotografía</th>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Usuario</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(user, index) in listUsersPaginated" :key="user.id">
                                            <td>
                                                <li class="user-block">
                                                    <img src="/img/avatar.png" :alt="user.username" class="profile-avatar-img img-fluid img-circle"/>
                                                </li>
                                            </td>
                                            <td>{{ user.fullname }}</td>
                                            <td>{{ user.email }}</td>
                                            <td>{{ user.username }}</td>
                                            <td>
                                                <span
                                                    class="badge"
                                                    :class="user.state === 'A' ? 'badge-success' : 'badge-danger'"
                                                >{{ user.state_alias }}</span
                                                >
                                            </td>
                                            <td>
                                                <RouterLink
                                                    to="#"
                                                    class="btn btn-primary btn-sm"
                                                    title="Ver"
                                                >
                                                    <i
                                                        class="fas fa-eye"
                                                    ></i>
                                                </RouterLink>
                                                <RouterLink
                                                    to="#"
                                                    class="btn btn-info btn-sm"
                                                    title="Editar"
                                                >
                                                    <i
                                                        class="fas fa-pencil-alt"
                                                    ></i>
                                                </RouterLink>
                                                <RouterLink
                                                    to="#"
                                                    class="btn btn-success btn-sm"
                                                    title="Permisos"
                                                >
                                                    <i class="fas fa-key"></i>
                                                </RouterLink>
                                                <RouterLink
                                                    to="#"
                                                    class="btn btn-danger btn-sm"
                                                    title="Desactivar"
                                                >
                                                    <i class="fas fa-trash"></i>
                                                </RouterLink>
                                                <RouterLink
                                                    to="#"
                                                    class="btn btn-success btn-sm"
                                                    title="Activar"
                                                >
                                                    <i class="fas fa-check"></i>
                                                </RouterLink>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div class="card-footer clearfix">
                                        <div class="float-left">
                                            <p class="text-sm text-muted mb-0">
                                                Mostrando
                                                <strong>{{ (currentPage * itemsPerPage) + 1 }}</strong> -
                                                <strong>{{ Math.min((currentPage + 1) * itemsPerPage, listUsers.length) }}</strong>
                                                de
                                                <strong>{{ listUsers.length }}</strong> resultados
                                            </p>
                                            <p class="text-sm text-muted mb-0">
                                                Página <strong>{{ currentPage + 1 }}</strong> de <strong>{{ totalPages }}</strong>
                                            </p>
                                        </div>
                                        <ul
                                            class="pagination pagination-sm m-0 float-right"
                                        >
                                            <li class="page-item" v-if="hasPreviousPage">
                                                <a href="#" class="page-link"
                                                   @click.prevent="goToPreviousPage"
                                                >Anterior</a
                                                >
                                            </li>
                                            <li class="page-item" v-for="(page, index) in pageNumbers" :key="index"
                                                :class="[isPageActive(page) ? 'active' : '']"
                                            >
                                                <a href="#" class="page-link" @click.prevent="goToPage(page)">{{ page + 1 }}</a>
                                            </li>
                                            <li class="page-item" v-if="hasNextPage">
                                                <a href="#" class="page-link"
                                                   @click.prevent="goToNextPage"
                                                >Siguiente</a
                                                >
                                            </li>
                                        </ul>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="callout callout-info">
                                        <h5>No se encontraron resultados...</h5>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
