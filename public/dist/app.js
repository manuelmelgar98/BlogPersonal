import './components/create-post-button/create-post-button.js';
import './components/post-form/post-form.js';
import './components/post-list/post-list.js';
import { seedInitialPosts } from './api/postApi.js';
import { dataService } from './services/dataService.js';
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Aplicación de Blog inicializando...');
    await seedInitialPosts();
    await dataService.init();
});
