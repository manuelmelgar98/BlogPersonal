import { Post } from '../../models/post.js';
import { loadComponentAsset } from '../../utils/domUtils.js';
import { showAlert, showConfirm } from '../../utils/messages.js';
import { createPost, updatePost } from '../../api/postApi.js';

export class PostForm extends HTMLElement {
    private _shadowRoot!: ShadowRoot;
    private _initialized = false;
    private _currentPost: Post | null = null;

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {        
        if (name === 'post-data') {
            if (newValue !== null) {
                try {
                this._currentPost = JSON.parse(newValue) as Post;
                console.log(name, oldValue, newValue);
                
                console.log('Post data received:', this._currentPost);
                
                this._populateForm(this._currentPost);
                this._openModal();
                const modalTitle = this._shadowRoot.getElementById('modalTitle') as HTMLHeadingElement;
                if (modalTitle) modalTitle.textContent = 'Editar Post';
                } catch (error) {
                    console.error('Error parsing post data:', error);
                    this._currentPost = null;
                    this._resetForm();
                }
            } else {
                this._currentPost = null;
                this._resetForm();                
                const modalTitle = this._shadowRoot.getElementById('modalTitle') as HTMLHeadingElement;
                if (modalTitle) modalTitle.textContent = 'Crear Nuevo Post';                
            }
        } 
    }

    private _populateForm(post: Post): void {
        const id = this._shadowRoot.getElementById('postId') as HTMLInputElement;
        const title = this._shadowRoot.getElementById('postTitle') as HTMLInputElement;
        const content = this._shadowRoot.getElementById('postContent') as HTMLTextAreaElement;
        const categories = this._shadowRoot.getElementById('postCategories') as HTMLInputElement;
        const tags = this._shadowRoot.getElementById('postTags') as HTMLInputElement;
        const date = this._shadowRoot.getElementById('postDate') as HTMLInputElement;
        
        if (id) id.value = post.id.toString();
        if (title) title.value = post.title;
        if (content) content.value = post.content;
        if (categories) categories.value = post.categories.join(', ');
        if (tags) tags.value = post.tags.join(', ');
        if (date && post.date) {
            const d = new Date(post.date);
            date.value = d.toISOString().split('T')[0];
        } else if (date) {
            date.value = '';
        }
    }

    private _openModal(): void {
        const dialog = this._shadowRoot.querySelector<HTMLDialogElement>('dialog');
        if (dialog) {
            dialog.showModal();
        } else {
            console.error('Dialog element not found in shadow DOM');
        }
    }

    private _closeModal(): void {
        const dialog = this._shadowRoot.querySelector<HTMLDialogElement>('dialog');
        if (dialog) {
            dialog.close();
        } else {
            console.error('Dialog element not found in shadow DOM');
        }
    }

    private _resetForm(): void {
        const form = this._shadowRoot.querySelector<HTMLFormElement>('form');
        if (form) {
            form.reset();
        }
    }

    private _handleSave(): void {
        showConfirm('¿Estás seguro de que deseas guardar los cambios?', async () => {
            const titleInput = this._shadowRoot.getElementById('postTitle') as HTMLInputElement;
            const contentInput = this._shadowRoot.getElementById('postContent') as HTMLTextAreaElement;
            const categoriesInput = this._shadowRoot.getElementById('postCategories') as HTMLInputElement;
            const tagsInput = this._shadowRoot.getElementById('postTags') as HTMLInputElement;
            const dateInput = this._shadowRoot.getElementById('postDate') as HTMLInputElement;

            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            const categories = categoriesInput.value.split(',').map(cat => cat.trim()).filter(cat => cat);
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const date = dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString();

            if (!title || !content) {
                showAlert('Por favor, completa los campos de título y contenido, son obligatorios.', 'Campos Incompletos');
                return;
            }

            const newOrUpdatedPost: Post = {
                id: this._currentPost?.id || Date.now(),
                title,
                content,
                date,
                categories,
                tags
            };

            if (this._currentPost &&
                this._currentPost.title === newOrUpdatedPost.title &&
                this._currentPost.content === newOrUpdatedPost.content &&
                JSON.stringify(this._currentPost.categories.sort()) === JSON.stringify(newOrUpdatedPost.categories.sort()) &&
                JSON.stringify(this._currentPost.tags.sort()) === JSON.stringify(newOrUpdatedPost.tags.sort()) &&
                this._currentPost.date === newOrUpdatedPost.date
            ) {
                showAlert('No se detectaron cambios para guardar.', 'Sin Cambios');
                this._closeModal();
                return;
            }

            try {
                let successMessage = '';
                let successTitle = '';
                const isEditing = this._currentPost !== null;

                if (isEditing) {
                    await updatePost(newOrUpdatedPost);
                    successMessage = `Post "${newOrUpdatedPost.title}" actualizado exitosamente.`;
                    successTitle = 'Post Actualizado';
                } else {
                    await createPost(newOrUpdatedPost);
                    successMessage = `Post "${newOrUpdatedPost.title}" creado exitosamente.`;
                    successTitle = 'Post Creado';
                }
                showAlert(successMessage, successTitle);
                this._closeModal();

                document.dispatchEvent(new CustomEvent('posts-changed', {
                    bubbles: true,
                    composed: true,
                    detail: { action: isEditing ? 'update' : 'create', post: newOrUpdatedPost }
                }));
            } catch (error) {   
                console.error('Error al guardar/actualizar el post:', error);
                showAlert(`¡Hubo un error inesperado al guardar el post: ${error || 'Error desconocido'}!`, 'Error al Guardar');
            }
        }, 'Confirmar Guardado');
        
    }

    static get observedAttributes() {
        return ['post-data'];
    }

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(): Promise<void> {
        if (this._initialized) return;
        this._initialized = true;
        
        await loadComponentAsset('./dist/components/post-form/post-form', 'html', this._shadowRoot, '#postFormTemplate');
        await loadComponentAsset('./dist/components/post-form/post-form', 'css', this._shadowRoot);

        this._setupEventListeners();
    }

    private _setupEventListeners(): void {
        const dialog = this._shadowRoot.querySelector<HTMLDialogElement>('dialog');
        const closeModalButton = this._shadowRoot.getElementById('closeModalButton');
        const cancelButton = this._shadowRoot.getElementById('cancelButton');
        const saveButton = this._shadowRoot.getElementById('saveButton');
        const postForm = this._shadowRoot.getElementById('postForm') as HTMLFormElement;

        document.addEventListener('open-post-form', () => {
            this._resetForm();
            this._openModal();
        });

        closeModalButton?.addEventListener('click', () => this._closeModal());

        cancelButton?.addEventListener('click', () => this._closeModal());

        postForm?.addEventListener('submit', (event) => {
            event.preventDefault();
            this._handleSave();            
        });

        dialog?.addEventListener('close', () => {
            this._resetForm();
            this.removeAttribute('post-data');
        });
    }
}

customElements.define('post-form', PostForm);