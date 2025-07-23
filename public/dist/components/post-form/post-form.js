import { loadComponentAsset } from '../../utils/domUtils.js';
class PostForm extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this._shadowRoot = this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        if (this._initialized)
            return;
        this._initialized = true;
        console.log('PostForm connectedCallback called');
        await loadComponentAsset('../src/components/post-form/post-form', 'html', this._shadowRoot, '#postFormTemplate');
        await loadComponentAsset('../src/components/post-form/post-form', 'css', this._shadowRoot);
    }
}
customElements.define('post-form', PostForm);
