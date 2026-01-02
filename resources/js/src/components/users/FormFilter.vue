<script setup>
    const props = defineProps({
        formFilterData: {
            type: Object,
            required: true
        },
        listStatus: {
            type: Array,
            required: true
        }
    })
</script>
<template>
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
                            v-model="formFilterData.name"
                        />
                    </div>
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
                            v-model="formFilterData.username"
                        />
                    </div>
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
                            v-model="formFilterData.email"
                        />
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group row">
                    <label for="state" class="col-md-3 col-form-label">
                        Estado
                    </label>
                    <div class="col-md-9">
                        <el-select
                            v-model="formFilterData.state"
                            placeholder="Seleccione un estado"
                            clearable
                            class="w-100 h-25"
                        >
                            <el-option
                                v-for="item in listStatus"
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
</template>
<style lang="scss" scoped></style>
