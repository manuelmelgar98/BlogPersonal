import { loadComponentAsset } from '../../utils/domUtils.js';

export class PostCard extends HTMLElement {
    private _shadowRoot!: ShadowRoot;
    private _initialized = false;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(): Promise<void> {
        if (this._initialized) return;
        this._initialized = true;

        await loadComponentAsset('./dist/components/post-card/post-card', 'html', this._shadowRoot, '#postCardTemplate');
        await loadComponentAsset('./dist/components/post-card/post-card', 'css', this._shadowRoot);

        this._setupEventListeners();
    }
    
    private _setupEventListeners() {
        console.log('Setting up event listeners for PostCard');
        
    }
}

customElements.define('post-card', PostCard);