import './bootstrap';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './src/router/index'
// Import Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// Import main App component
import App from './src/App.vue';

// Get the app element and extract props from data attributes
const appElement = document.getElementById('app');
const baseUrl = appElement.dataset.baseUrl;
const appName = appElement.dataset.appName;

// Create Vue app instance with App as root component and pass props
const app = createApp(App, {
    baseUrl: baseUrl,
    appName: appName
});

// Use Pinia for state management
const pinia = createPinia();
app.use(pinia)
app.use(ElementPlus)
app.use(router)

// Wait for router to be ready before mounting
router.isReady().then(() => {
    app.mount('#app');
});
