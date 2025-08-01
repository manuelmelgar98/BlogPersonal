import { loadComponentAsset } from "../../utils/domUtils.js";
import { Post } from "../../models/post.js";
import { dataService } from "../../services/dataService.js";

export class PostList extends HTMLElement {
    private _shadowRoot!: ShadowRoot;
    private _initialized = false;
    private _posts: Post[] = [];

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(): Promise<void> {
        if (this._initialized) return;
        this._initialized = true;

        await loadComponentAsset('./dist/components/post-list/post-list', 'html', this._shadowRoot, '#postListTemplate');
        await loadComponentAsset('./dist/components/post-list/post-list', 'css', this._shadowRoot);
        await this._loadPosts();

        this._setupEventListeners();
    }

    private async _loadPosts(): Promise<void> {
        this._posts = await dataService.loadAllPosts();
        this._renderPosts();
    }

    private _setupEventListeners(): void {
        document.addEventListener('posts-changed', (event: CustomEvent<{ action: 'load' | 'created' | 'updated' | 'deleted'; post?: Post; postId?: number; posts: Post[] }>) => {
            console.log('Posts changed event received:', event.detail);
            this._posts = event.detail.posts; 
            this._renderPosts();
        });
    }

    private _renderPosts(): void {
        console.log('Rendering posts...');
    }


}

customElements.define('post-list', PostList);