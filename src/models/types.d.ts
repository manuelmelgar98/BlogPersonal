// src/types.d.ts

import { Post } from './models/post'; // Asegúrate de que la ruta sea correcta

declare global {
    // Extiende HTMLElementTagNameMap para tus elementos personalizados (como hicimos previamente)
    interface HTMLElementTagNameMap {
        'post-form': PostForm; // Asumiendo que PostForm es el nombre de la clase para <post-form>
        'post-list': PostList; // Asumiendo que PostList es el nombre de la clase para <post-list>
        // ... agrega otros elementos personalizados aquí
    }

    // Aumenta la interfaz DocumentEventMap para eventos personalizados disparados en `document`
    interface DocumentEventMap {
        'post-created': CustomEvent<Post>;
        'post-updated': CustomEvent<Post>;
        'posts-changed': CustomEvent<{ action: 'created' | 'updated' | 'deleted'; post?: Post; postId?: number }>;
        'open-post-form-create': CustomEvent<void>; // O CustomEvent<undefined> si no tiene detalle
        'edit-post-requested': CustomEvent<{ id: number }>;
        'delete-post-requested': CustomEvent<{ id: number }>;
        // Agrega cualquier otro evento personalizado que dispares y escuches en `document`
    }

    // Si tienes interfaces específicas para tus instancias de elementos personalizados cuando se seleccionan del DOM
    interface HTMLPostFormElement extends HTMLElement {
        // Agrega cualquier método/propiedad público si los tienes, por ejemplo:
        // open(post?: Post): void;
    }
    // ... de manera similar para otros elementos personalizados
}