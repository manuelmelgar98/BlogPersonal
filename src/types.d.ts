import { Post } from './models/post'; // Asegúrate de importar Post si es necesario para el tipo de detalle

declare global {
    // Para tus Custom Elements (si los seleccionas con document.querySelector<HTMLTuElement>):
    interface HTMLElementTagNameMap {
        'post-form': PostForm; // Asegúrate de que PostForm esté exportado en su archivo .ts
        'post-list': PostList; // Asegúrate de que PostList esté exportado en su archivo .ts
        'create-post-button': CreatePostButton; // Asegúrate de que CreatePostButton esté exportado
        // ... agrega aquí tus otras clases de Custom Elements
    }

    // Para tus Custom Events despachados en `document` (o `window`)
    interface DocumentEventMap {
        'open-post-form': CustomEvent<void>; // No tiene detalle, o podrías usar CustomEvent<undefined>
        'posts-changed': CustomEvent<{ action: 'load' | 'created' | 'updated' | 'deleted'; post?: Post; postId?: number, posts: Post[] }>;
        // ... agrega aquí cualquier otro Custom Event que escuches en `document` o `window`
    }

    // Si necesitas tipar elementos específicos cuando los seleccionas por ID con document.getElementById
    // interface HTMLPostFormElement extends HTMLElement { /* ... */ }
    // interface HTMLCreatePostButtonElement extends HTMLElement { /* ... */ }
    // etc.
}