import { loadComponentAsset } from '../../utils/domUtils.js';

export class CreatePostButton extends HTMLElement {
    private _shadowRoot!: ShadowRoot;
    private _initialized = false;

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback(): Promise<void> {
        if (this._initialized) return;
        this._initialized = true;

        await loadComponentAsset('./dist/components/create-post-button/create-post-button', 'html', this._shadowRoot, '#create-post-button-template');
        await loadComponentAsset('./dist/components/create-post-button/create-post-button', 'css', this._shadowRoot);

        this._setupEventListeners();
    }

    private _setupEventListeners(): void {
        const createPostBtn = this._shadowRoot.getElementById('createPostBtn');
        createPostBtn?.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('open-post-form'));
        });
    }
}

customElements.define('create-post-button', CreatePostButton);