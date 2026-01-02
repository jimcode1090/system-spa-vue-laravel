<script setup>
import { inject } from "vue";
import { RouterLink } from "vue-router";
const baseUrl = inject("baseUrl");
const appName = inject("appName");
</script>
<template>
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="#" class="brand-link">
            <img
                :src="`${baseUrl}/img/adminLTELogo.png`"
                alt="AdminLTE Logo"
                class="brand-image img-circle elevation-3"
                style="opacity: 0.8"
            />
            <span class="brand-text font-weight-light"
                >{{ appName }}</span
            >
        </a>

        <!-- Sidebar -->
        <div class="sidebar">
            <!-- Sidebar user (optional) -->
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                <div class="image">
                    <img
                        :src="`${baseUrl}/img/avatar.png`"
                        class="img-circle elevation-2"
                        alt="User Image"
                    />
                </div>
                <div class="info">
                    <a href="#" class="d-block">Alexander Pierce</a>
                </div>
            </div>

            <!-- Sidebar Menu -->
            <nav class="mt-2">
                <ul
                    class="nav nav-pills nav-sidebar flex-column"
                    data-widget="treeview"
                    role="menu"
                    data-accordion="false"
                >
                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'dashboard' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fas fa-tachometer-alt"></i>
                            <p>Dashboard</p>
                        </RouterLink>
                    </li>

                    <li class="nav-header">OPERACIONES</li>
                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'orders' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-cash-register"></i>
                            <p>Pedidos</p>
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'customers' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-user-group"></i>
                            <p>Clientes</p>
                        </RouterLink>
                    </li>

                    <li class="nav-header">CONFIGURACIÓN</li>
                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'categories' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-sitemap"></i>
                            <p>Categorías</p>
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'products' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-apple-alt"></i>
                            <p>Productos</p>
                        </RouterLink>
                    </li>

                    <li class="nav-header">ADMINISTRACIÓN</li>

                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'users' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-user-plus"></i>
                            <p>Usuarios</p>
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'roles' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-unlock-alt"></i>
                            <p>Roles</p>
                        </RouterLink>
                    </li>

                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'permissions' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-key"></i>
                            <p>Permisos</p>
                        </RouterLink>
                    </li>

                    <li class="nav-header">REPORTES</li>

                    <li class="nav-item">
                        <RouterLink
                            :to="{ name: 'reports' }"
                            class="nav-link"
                        >
                            <i class="nav-icon fa-solid fa-file-export"></i>
                            <p>Perdidos</p>
                        </RouterLink>
                    </li>
                </ul>
            </nav>
            <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
    </aside>
</template>
