import { createRouter, createWebHistory } from "vue-router";
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: DashboardView
        },
        {
            path: '/categories',
            name: 'categories',
            component: () => import('../views/CategoryView.vue')
        },
        {
            path: '/customers',
            name: 'customers',
            component: () => import('../views/CustomerView.vue')
        },
        {
            path: '/orders',
            name: 'orders',
            component: () => import('../views/OrderView.vue')
        },
        {
            path: '/permissions',
            name: 'permissions',
            component: () => import('../views/PermissionView.vue')
        },
        {
            path: '/products',
            name: 'products',
            component: () => import('../views/ProductView.vue')
        },
        {
            path: '/reports',
            name: 'reports',
            component: () => import('../views/ReportView.vue')
        },
        {
            path: '/roles',
            name: 'roles',
            component: () => import('../views/RoleView.vue')
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('../views/users/UserListView.vue')
        },


    ]
})

export default router;
