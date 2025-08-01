import { loadComponentAsset } from '../../utils/domUtils.js';
import { showAlert, showConfirm } from '../../utils/messages.js';
// import { createPost, updatePost } from '../../api/postApi.js';
import { dataService } from '../../services/dataService.js';
export class PostForm extends HTMLElement {
    static get observedAttributes() {
        return ['post-data'];
    }
    constructor() {
        super();
        this._initialized = false;
        this._currentPost = null;
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        if (this._initialized)
            return;
        this._initialized = true;
        await loadComponentAsset('./dist/components/post-form/post-form', 'html', this._shadowRoot, '#postFormTemplate');
        await loadComponentAsset('./dist/components/post-form/post-form', 'css', this._shadowRoot);
        this._setupEventListeners();
    }
    _setupEventListeners() {
        const dialog = this._shadowRoot.querySelector('dialog');
        const closeModalButton = this._shadowRoot.getElementById('closeModalButton');
        const cancelButton = this._shadowRoot.getElementById('cancelButton');
        const saveButton = this._shadowRoot.getElementById('saveButton');
        const postForm = this._shadowRoot.getElementById('postForm');
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
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'post-data') {
            if (newValue !== null) {
                try {
                    this._currentPost = JSON.parse(newValue);
                    console.log(name, oldValue, newValue);
                    console.log('Post data received:', this._currentPost);
                    this._populateForm(this._currentPost);
                    this._openModal();
                    const modalTitle = this._shadowRoot.getElementById('modalTitle');
                    if (modalTitle)
                        modalTitle.textContent = 'Editar Post';
                }
                catch (error) {
                    console.error('Error parsing post data:', error);
                    this._currentPost = null;
                    this._resetForm();
                }
            }
            else {
                this._currentPost = null;
                this._resetForm();
                const modalTitle = this._shadowRoot.getElementById('modalTitle');
                if (modalTitle)
                    modalTitle.textContent = 'Crear Nuevo Post';
            }
        }
    }
    _populateForm(post) {
        const id = this._shadowRoot.getElementById('postId');
        const title = this._shadowRoot.getElementById('postTitle');
        const content = this._shadowRoot.getElementById('postContent');
        const categories = this._shadowRoot.getElementById('postCategories');
        const tags = this._shadowRoot.getElementById('postTags');
        const date = this._shadowRoot.getElementById('postDate');
        if (id)
            id.value = post.id.toString();
        if (title)
            title.value = post.title;
        if (content)
            content.value = post.content;
        if (categories)
            categories.value = post.categories.join(', ');
        if (tags)
            tags.value = post.tags.join(', ');
        if (date && post.date) {
            const d = new Date(post.date);
            date.value = d.toISOString().split('T')[0];
        }
        else if (date) {
            date.value = '';
        }
    }
    _openModal() {
        const dialog = this._shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.showModal();
        }
        else {
            console.error('Dialog element not found in shadow DOM');
        }
    }
    _closeModal() {
        const dialog = this._shadowRoot.querySelector('dialog');
        if (dialog) {
            dialog.close();
        }
        else {
            console.error('Dialog element not found in shadow DOM');
        }
    }
    _resetForm() {
        const form = this._shadowRoot.querySelector('form');
        if (form) {
            form.reset();
        }
    }
    _handleSave() {
        showConfirm('¿Estás seguro de que deseas guardar los cambios?', async () => {
            const titleInput = this._shadowRoot.getElementById('postTitle');
            const contentInput = this._shadowRoot.getElementById('postContent');
            const categoriesInput = this._shadowRoot.getElementById('postCategories');
            const tagsInput = this._shadowRoot.getElementById('postTags');
            const dateInput = this._shadowRoot.getElementById('postDate');
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            const categories = categoriesInput.value.split(',').map(cat => cat.trim()).filter(cat => cat);
            const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
            const date = dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString();
            if (!title || !content) {
                showAlert('Por favor, completa los campos de título y contenido, son obligatorios.', 'Campos Incompletos');
                return;
            }
            const newOrUpdatedPost = {
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
                this._currentPost.date === newOrUpdatedPost.date) {
                showAlert('No se detectaron cambios para guardar.', 'Sin Cambios');
                this._closeModal();
                return;
            }
            try {
                let successMessage = '';
                let successTitle = '';
                const isEditing = this._currentPost !== null;
                if (isEditing) {
                    await dataService.updatePost(newOrUpdatedPost);
                    successMessage = `Post "${newOrUpdatedPost.title}" actualizado exitosamente.`;
                    successTitle = 'Post Actualizado';
                }
                else {
                    await dataService.addPost(newOrUpdatedPost);
                    successMessage = `Post "${newOrUpdatedPost.title}" creado exitosamente.`;
                    successTitle = 'Post Creado';
                }
                showAlert(successMessage, successTitle);
                this._closeModal();
            }
            catch (error) {
                console.error('Error al guardar/actualizar el post:', error);
                showAlert(`¡Hubo un error inesperado al guardar el post: ${error.message || 'Error desconocido'}!`, 'Error al Guardar');
            }
        }, 'Confirmar Guardado');
    }
}
customElements.define('post-form', PostForm);
