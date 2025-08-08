import { loadComponentAsset } from '../../utils/domUtils.js';
import { Post } from '../../models/post.js';

export class PostCard extends HTMLElement {
    private _shadowRoot!: ShadowRoot;
    private _initialized = false;
    private _postData: Post | null = null;
    
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

        await loadComponentAsset('./dist/components/post-card/post-card', 'html', this._shadowRoot, '#postCardTemplate');
        await loadComponentAsset('./dist/components/post-card/post-card', 'css', this._shadowRoot);

        if (this._postData) {
            this._renderCard();
        }

        this._setupEventListeners();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'post-data' && newValue) {
            try {
                this._postData = JSON.parse(newValue);
                if (this._initialized) this._renderCard();
            } catch (error) {
                console.error('Failed to parse post data:', error);
                this._postData = null;                
            }
        }
    }
    
    private _setupEventListeners() {
        const viewButton = this._shadowRoot.querySelector('.view-post-button');
        const deleteButton = this._shadowRoot.querySelector('.delete-post-button');
        
        viewButton?.addEventListener('click', () => {
            console.log(`PostCard: Ver post con ID ${this._postData?.id}`);
            document.dispatchEvent(new CustomEvent('view-post-requested', {
                bubbles: true,
                composed: true,
                detail: { postId: this._postData?.id } 
            }));
        });

        deleteButton?.addEventListener('click', () => {
            console.log(`PostCard: Eliminar post con ID ${this._postData?.id}`);
            document.dispatchEvent(new CustomEvent('delete-post-requested', {
                bubbles: true,
                composed: true,
                detail: { postId: this._postData?.id }
            }));
        });
    }

    private _renderCard() {
        if (!this._postData) return;
        const postImage = this._shadowRoot.querySelector('.post-user-image');
        const postTitle = this._shadowRoot.querySelector('.post-title');
        const postContent = this._shadowRoot.querySelector('.post-content-excerpt');
        const postDate = this._shadowRoot.querySelector('.post-date');
        const postCategories = this._shadowRoot.querySelector('.post-categories');
        const postTags = this._shadowRoot.querySelector('.post-tags');
          
        if (postImage) postImage.setAttribute('src', './assets/images/default-user.png');
        if (postTitle) postTitle.textContent = this._postData.title;
        if (postContent) postContent.textContent = this._postData.content.substring(0, 100) + '...';
        if (postDate) postDate.textContent = new Date(this._postData.date).toLocaleDateString();
        if (postCategories) {
            postCategories.innerHTML = '';
            this._postData.categories.forEach(category => {
                const categoryElement = document.createElement('span');
                categoryElement.textContent = category;
                categoryElement.className = 'post-category-badge';
                postCategories.appendChild(categoryElement);
            });
        }
        if (postTags) {
            postTags.innerHTML = '';
            this._postData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.textContent = tag;
                tagElement.className = 'post-tag-badge';
                postTags.appendChild(tagElement);
            });
        }

    }
}

customElements.define('post-card', PostCard);