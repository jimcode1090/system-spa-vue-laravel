<script setup>
import { useEditUserViewModel } from "@/src/viewmodels/useEditUserViewModel.js";

// ViewModel - All business logic is handled here
const {
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
    currentImageUrl,
    hasFile,
    fileName,

    // Methods
    handleFileChange,
    removeFile,
    onSubmit,
    clearForm,
    goBack
} = useEditUserViewModel()
</script>

<template>
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0 text-dark">Editar Usuario</h1>
                </div>
            </div>
        </div>
        <div class="content container-fluid">
            <div class="card">
                <div class="card-header">
                    <div class="card-tools">
                        <RouterLink :to="{ name: 'users' }" class="btn btn-info btn-sm">
                            <i class="fas fa-arrow-left"></i> Regresar
                        </RouterLink>
                    </div>
                </div>
                <div class="card-body">
                    <div class="container-fluid">
                        <div class="card card-info">
                            <div class="card-header">
                                <h3 class="card-title">
                                    Formulario de Edición de Usuario
                                </h3>
                            </div>
                            <div class="card-body">
                                <form role="form" enctype="multipart/form-data">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="firstname" class="col-md-3 col-form-label">
                                                    Primer Nombre <span class="text-danger">*</span>
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="firstname"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.firstname }"
                                                        v-model="firstname"
                                                        v-bind="firstnameAttrs"
                                                        placeholder="Ingrese su primer nombre"
                                                    />
                                                    <span v-if="errors.firstname" class="invalid-feedback">
                                                        {{ errors.firstname }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="secondname" class="col-md-3 col-form-label">
                                                    Segundo Nombre
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="secondname"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.secondname }"
                                                        v-model="secondname"
                                                        v-bind="secondnameAttrs"
                                                        placeholder="Ingrese su segundo nombre"
                                                    />
                                                    <span v-if="errors.secondname" class="invalid-feedback">
                                                        {{ errors.secondname }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="lastname" class="col-md-3 col-form-label">
                                                    Apellidos <span class="text-danger">*</span>
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="lastname"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.lastname }"
                                                        v-model="lastname"
                                                        v-bind="lastnameAttrs"
                                                        placeholder="Ingrese sus apellidos"
                                                    />
                                                    <span v-if="errors.lastname" class="invalid-feedback">
                                                        {{ errors.lastname }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="username" class="col-md-3 col-form-label">
                                                    Usuario <span class="text-danger">*</span>
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="username"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.username }"
                                                        v-model="username"
                                                        v-bind="usernameAttrs"
                                                        placeholder="Ingrese su usuario"
                                                    />
                                                    <span v-if="errors.username" class="invalid-feedback">
                                                        {{ errors.username }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="email" class="col-md-3 col-form-label">
                                                    Correo Electrónico <span class="text-danger">*</span>
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="email"
                                                        type="email"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.email }"
                                                        v-model="email"
                                                        v-bind="emailAttrs"
                                                        placeholder="Ingrese su correo electrónico"
                                                    />
                                                    <span v-if="errors.email" class="invalid-feedback">
                                                        {{ errors.email }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="password" class="col-md-3 col-form-label">
                                                    Contraseña
                                                </label>
                                                <div class="col-md-9">
                                                    <input
                                                        id="password"
                                                        type="password"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.password }"
                                                        v-model="password"
                                                        v-bind="passwordAttrs"
                                                        placeholder="Dejar en blanco para no cambiar"
                                                        autocomplete="new-password"
                                                    />
                                                    <span v-if="errors.password" class="invalid-feedback">
                                                        {{ errors.password }}
                                                    </span>
                                                    <small class="form-text text-muted">
                                                        Opcional. Solo si desea cambiar la contraseña. Mínimo 8 caracteres con mayúsculas, minúsculas y números
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group row">
                                                <label for="file" class="col-md-3 col-form-label">
                                                    Fotografía
                                                </label>
                                                <div class="col-md-9">
                                                    <div class="custom-file">
                                                        <input
                                                            id="file"
                                                            type="file"
                                                            class="custom-file-input"
                                                            :class="{ 'is-invalid': errors.file }"
                                                            v-bind="fileAttrs"
                                                            @change="handleFileChange"
                                                            accept="image/jpeg,image/jpg,image/png,image/gif"
                                                        />
                                                        <label class="custom-file-label" for="file">
                                                            {{ fileName || 'Seleccionar archivo...' }}
                                                        </label>
                                                        <span v-if="errors.file" class="invalid-feedback d-block">
                                                            {{ errors.file }}
                                                        </span>
                                                    </div>
                                                    <small class="form-text text-muted">
                                                        Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 2MB
                                                    </small>

                                                    <!-- Current Image (if exists) -->
                                                    <div v-if="!hasFile && currentImageUrl" class="mt-3">
                                                        <p class="text-sm text-muted mb-2">Imagen actual:</p>
                                                        <img
                                                            :src="currentImageUrl"
                                                            alt="Imagen actual"
                                                            class="img-thumbnail"
                                                            style="max-width: 200px; max-height: 200px;"
                                                        />
                                                    </div>

                                                    <!-- New Image Preview -->
                                                    <div v-if="hasFile && imagePreviewUrl" class="mt-3">
                                                        <p class="text-sm text-muted mb-2">Nueva imagen:</p>
                                                        <div class="position-relative d-inline-block">
                                                            <img
                                                                :src="imagePreviewUrl"
                                                                alt="Vista previa"
                                                                class="img-thumbnail"
                                                                style="max-width: 200px; max-height: 200px;"
                                                            />
                                                            <button
                                                                type="button"
                                                                class="btn btn-danger btn-sm position-absolute"
                                                                style="top: 5px; right: 5px;"
                                                                @click="removeFile"
                                                                title="Eliminar imagen"
                                                            >
                                                                <i class="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                        <p class="text-muted small mt-1">
                                                            {{ fileName }}
                                                        </p>
                                                    </div>
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
                                            type="submit"
                                            class="btn btn-flat btn-info btn-width"
                                            @click.prevent="onSubmit"
                                            :disabled="isSubmitting"
                                            v-loading.fullscreen.lock="isSubmitting"
                                        >
                                            <span v-if="isSubmitting">
                                                <i class="fas fa-spinner fa-spin"></i> Actualizando...
                                            </span>
                                            <span v-else>
                                                <i class="fas fa-save"></i> Actualizar
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            class="btn btn-flat btn-default btn-width"
                                            @click.prevent="goBack"
                                            :disabled="isSubmitting"
                                        >
                                            <i class="fas fa-times"></i> Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
