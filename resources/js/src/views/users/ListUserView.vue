<script setup>
import { useListUserViewModel } from "@/src/viewmodels/useListUserViewModel.js"

const {
    name,
    nameAttrs,
    username,
    usernameAttrs,
    email,
    emailAttrs,
    state,
    stateAttrs,
    errors,

    listUsers,
    listStatusUser,
    paginatedItems,
    currentPage,
    itemsPerPage,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    pageNumbers,
    goToPreviousPage,
    goToNextPage,
    isPageActive,
    goToPage,

    isSubmitting,
    onSubmit,
    clearForm

} = useListUserViewModel()


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
                        <RouterLink :to="{ name: 'users-create' }" class="btn btn-info btn-sm">
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
                                <form role="form">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="name" class="col-md-3 col-form-label">
                                                    Nombre
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid' : errors.name}"
                                                        v-model="name"
                                                        v-bind="nameAttrs"
                                                        placeholder="Ingrese el nombre"
                                                    />
                                                </div>
                                                <span v-if="errors.name" class="invalid-feedback">
                                                        {{ errors.name }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="username" class="col-md-3 col-form-label">
                                                    Usuario
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="username"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid' : errors.username}"
                                                        v-model="username"
                                                        v-bind="usernameAttrs"
                                                        placeholder="Ingrese el nombre de usuario"
                                                    />
                                                </div>
                                                <span v-if="errors.username" class="invalid-feedback">
                                                        {{ errors.username }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="email" class="col-md-3 col-form-label">
                                                    Correo Electrónico
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="email"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid' : errors.email}"
                                                        v-model="email"
                                                        v-bind="emailAttrs"
                                                    />
                                                </div>
                                                <span v-if="errors.email" class="invalid-feedback">
                                                        {{ errors.email }}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="state" class="col-md-3 col-form-label">
                                                    Estado
                                                </label>
                                                <div class="col-md-9">
                                                    <el-select
                                                        :class="{ 'is-invalid' : errors.state}"
                                                        v-model="state"
                                                        v-bind="stateAttrs"
                                                        placeholder="Seleccione un estado"
                                                        clearable
                                                        class="w-100 h-25"
                                                    >
                                                        <el-option
                                                            v-for="item in listStatusUser"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value"
                                                        />
                                                    </el-select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-md-4 offset-4">
                                        <button
                                            class="btn btn-flat btn-info btn-width"
                                            :disabled="isSubmitting"
                                            @click.prevent="onSubmit"
                                            v-loading.fullscreen.lock="isSubmitting"
                                        >
                                            <span v-if="isSubmitting">
                                                <i class="fas fa-spinner fa-spin"></i> Buscando...
                                            </span>
                                            <span v-else>
                                                <i class="fas fa-search"></i> Buscar
                                            </span>
                                        </button>
                                        <button
                                            class="btn btn-flat btn-default btn-width"
                                            @click.prevent="clearForm"
                                            :disabled="isSubmitting"
                                        >
                                            <i class="fas fa-eraser"></i>
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
                                <template v-if="paginatedItems.length ">
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
                                        <tr v-for="(user, index) in paginatedItems" :key="user.id">
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
