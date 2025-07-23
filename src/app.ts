import './components/post-form/post-form.js';

document.addEventListener('DOMContentLoaded', () => {
    const createPostBtn = document.getElementById('createPostBtn');
    createPostBtn?.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('open-post-form'));
    });
});