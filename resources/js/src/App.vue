<script setup>
import { provide } from "vue";
import { RouterView } from "vue-router";
import Footer from "./components/template/Footer.vue";
import Navbar from "./components/template/Navbar.vue";
import Sidebar from "./components/template/Sidebar.vue";

const props = defineProps({
    baseUrl: {
        type: String,
        required: true,
    },
});

// Provide baseUrl para todos los componentes hijos
provide("baseUrl", props.baseUrl);
</script>

<template>
    <!-- Navbar -->
    <Navbar />
    <!-- /.navbar -->

    <!-- Main Sidebar Container -->
    <Sidebar />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <RouterView v-slot="{ Component }">
            <Transition name="slide-fade" mode="out-in">
                <component :is="Component" />
            </Transition>
        </RouterView>
    </div>
    <!-- /.content-wrapper -->

    <!-- Footer -->
    <Footer />

    <!-- Control Sidebar -->
    <aside class="control-sidebar control-sidebar-dark">
        <!-- Control sidebar content goes here -->
    </aside>
    <!-- /.control-sidebar -->
</template>

<style scoped>
/* Transición slide-fade para cambio de rutas */

</style>
