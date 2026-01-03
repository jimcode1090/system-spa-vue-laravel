import { createRouter, createWebHistory } from "vue-router";
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
    history: createWebHistory('/'),
    linkActiveClass: 'active',
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
            component: () => import('../views/users/UserLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'users',
                    component: () => import('../views/users/ListUserView.vue'),
                },
                {
                    path: 'create',
                    name: 'users-create',
                    component: () => import('../views/users/CreateUserView.vue'),
                },
                {
                    path: 'edit/:id',
                    name: 'users-edit',
                    component: () => import('../views/users/EditUserView.vue'),
                },
            ]
        },



    ]
})

export default router;
