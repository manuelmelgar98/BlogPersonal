// src/api/postApi.ts
import { Post } from '../models/post'; // Importa la interfaz Post que definiste

const STORAGE_KEY = 'blogPosts'; // Clave para almacenar en localStorage

/**
 * Simula la obtención de todas las entradas de blog.
 * @returns {Promise<Post[]>} Una promesa que resuelve con un array de posts.
 */
export async function fetchPosts(): Promise<Post[]> {
    return new Promise((resolve) => {
        setTimeout(() => { // Simula un retraso de red
            const storedPosts = localStorage.getItem(STORAGE_KEY);
            const posts: Post[] = storedPosts ? JSON.parse(storedPosts) : [];
            // Ordena los posts por fecha de forma descendente (los más recientes primero)
            // posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            resolve(posts);
        }, 300); // 300ms de retraso
    });
}

/**
 * Simula la obtención de una entrada de blog por su ID.
 * @param {number} id El ID del post a buscar.
 * @returns {Promise<Post | undefined>} Una promesa que resuelve con el post o undefined si no se encuentra.
 */
export async function fetchPostById(id: number): Promise<Post | undefined> {
    return new Promise(async (resolve) => {
        const posts = await fetchPosts(); // Obtiene todos los posts
        setTimeout(() => { // Simula un retraso
            const post = posts.find(p => p.id === id);
            resolve(post);
        }, 150); // 150ms de retraso
    });
}

/**
 * Simula la creación de una nueva entrada de blog.
 * @param {Omit<Post, 'id'>} newPost Los datos del nuevo post (sin ID).
 * @returns {Promise<Post>} Una promesa que resuelve con el post creado (con ID asignado).
 */
export async function createPost(newPostData: Omit<Post, 'id'>): Promise<Post> {
    return new Promise(async (resolve) => {
        const posts = await fetchPosts(); // Obtiene el estado actual
        setTimeout(() => { // Simula un retraso
            const post: Post = {
                id: Date.now(), // Asigna un ID único basado en el timestamp
                ...newPostData
            };
            posts.unshift(post); // Agrega el nuevo post al inicio
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
            resolve(post);
        }, 500); // 500ms de retraso (simula una operación más larga)
    });
}

/**
 * Simula la actualización de una entrada de blog existente.
 * @param {Post} updatedPost Los datos completos del post actualizado.
 * @returns {Promise<Post>} Una promesa que resuelve con el post actualizado.
 * @throws {Error} Si el post no se encuentra.
 */
export async function updatePost(updatedPost: Post): Promise<Post> {
    return new Promise(async (resolve, reject) => {
        let posts = await fetchPosts(); // Obtiene el estado actual
        setTimeout(() => { // Simula un retraso
            const index = posts.findIndex(p => p.id === updatedPost.id);
            if (index !== -1) {
                // Actualiza el post en el array
                posts[index] = { ...posts[index], ...updatedPost };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
                resolve(posts[index]);
            } else {
                reject(new Error('Post no encontrado para actualizar.'));
            }
        }, 500); // 500ms de retraso
    });
}

/**
 * Simula la eliminación de una entrada de blog.
 * @param {number} id El ID del post a eliminar.
 * @returns {Promise<void>} Una promesa que resuelve cuando el post es eliminado.
 * @throws {Error} Si el post no se encuentra.
 */
export async function deletePost(id: number): Promise<void> {
    return new Promise(async (resolve, reject) => {
        let posts = await fetchPosts(); // Obtiene el estado actual
        setTimeout(() => { // Simula un retraso
            const initialLength = posts.length;
            posts = posts.filter(p => p.id !== id);
            if (posts.length < initialLength) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
                resolve();
            } else {
                reject(new Error('Post no encontrado para eliminar.'));
            }
        }, 400); // 400ms de retraso
    });
}

/**
 * Función auxiliar para limpiar todos los posts (útil para pruebas).
 */
export function clearAllPosts(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Todos los posts han sido eliminados del localStorage.");
}

// Opcional: Función para inicializar algunos datos de prueba
export async function seedInitialPosts(): Promise<void> {
    const existingPosts = await fetchPosts();
    if (existingPosts.length === 0) {
        console.log("Inicializando posts de ejemplo...");
        const initialPosts: Omit<Post, 'id'>[] = [
            {
                title: "Introducción a Web Components",
                content: "Web Components permiten crear elementos HTML reutilizables con funcionalidad encapsulada.",
                date: new Date().toISOString(),
                categories: ["Web Development", "Frontend"],
                tags: ["HTML", "CSS", "JavaScript", "Web Components"]
            },
            {
                title: "Dominando TypeScript",
                content: "TypeScript añade tipado estático a JavaScript, mejorando la robustez y escalabilidad.",
                date: new Date(Date.now() - 86400000).toISOString(), // Un día antes
                categories: ["Programming", "Languages"],
                tags: ["TypeScript", "JavaScript", "Development"]
            },
            {
                title: "Construyendo una API REST con Node.js",
                content: "Exploramos cómo crear una API RESTful utilizando Node.js y Express.",
                date: new Date(Date.now() - 2 * 86400000).toISOString(), // Dos días antes
                categories: ["Backend", "Web Development"],
                tags: ["Node.js", "Express", "API", "REST"]
            }
        ];

        let currentPosts: Post[] = [];
        for (const postData of initialPosts) {
            const newPost = { id: Date.now() + Math.random() * 1000, ...postData };
            currentPosts.push(newPost);
            await new Promise(r => setTimeout(r, 10)); // Pequeño retraso para IDs únicos si Date.now() es demasiado rápido
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPosts));
        console.log("Posts de ejemplo inicializados.");
    }
}