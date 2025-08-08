import './components/create-post-button/create-post-button.js';
import './components/post-form/post-form.js';
import './components/post-list/post-list.js';
import './components/post-card/post-card.js';
import { dataService } from './services/dataService.js';
import { showAlert, showConfirm } from './utils/messages.js';

document.addEventListener('DOMContentLoaded', async () => {

    document.addEventListener('delete-post-requested', async (event: CustomEvent<{ postId: number }>) => {
        const postId = event.detail.postId;
        showConfirm(`¿Estás seguro de que deseas eliminar el post con ID ${postId}?`, async () => {
            try {
                await dataService.deletePost(postId);
            } catch (error) {
                console.error(`Error al eliminar el post con ID ${postId}:`, error);
                showAlert(`Error al eliminar el post: ${(error as Error).message || 'Error desconocido'}`, 'Error al Eliminar Post');
            }
         }, 'Confirmar Eliminación');
    });

    document.addEventListener('view-post-requested', async (event: CustomEvent<{ postId: number }>) => {
        const postId = event.detail.postId;
        try {
            const postData = await dataService.getPost(postId);
            document.querySelector('post-form')?.setAttribute('post-data', JSON.stringify(postData));
        } catch (error) {
            console.error(`Error al cargar el post con ID ${postId}:`, error);
            showAlert(`Error al cargar el post: ${(error as Error).message || 'Error desconocido'}`, 'Error al Cargar Post');
        }
    });

});
