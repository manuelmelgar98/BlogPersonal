import './components/create-post-button/create-post-button.js';
import './components/post-form/post-form.js';
import './components/post-list/post-list.js';
import { seedInitialPosts } from './api/postApi.js';
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Aplicación de Blog inicializando...');
    await seedInitialPosts();
});
