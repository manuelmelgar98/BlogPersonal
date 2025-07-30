import { loadComponentAsset } from "../../utils/domUtils";
import { Post } from "../../models/post";

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
        console.log('Loading posts...');
    }

    private _setupEventListeners(): void {
        document.addEventListener('posts-changed', async (event: CustomEvent<{ action: 'created' | 'updated' | 'deleted'; post?: Post; postId?: number }>) => {
            console.log('Posts changed event received:', event.detail);
            await this._loadPosts();
        });
    }

    private _renderPosts(): void {
        console.log('Rendering posts...');
    }


}

customElements.define('post-list', PostList);