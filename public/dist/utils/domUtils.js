export async function loadComponentAsset(componentPath, type, container, selector = null) {
    try {
        const url = `${componentPath}.${type}`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`${type.toUpperCase()} no cargado: ${res.statusText} en ${url}`);
        const content = await res.text();
        if (type === 'html') {
            const tmp = document.createElement('template');
            tmp.innerHTML = content;
            const templateToClone = selector
                ? tmp.content.querySelector(selector)
                : tmp.content.querySelector('template') || tmp;
            if (templateToClone && 'content' in templateToClone) {
                container.appendChild(templateToClone.content.cloneNode(true));
            }
            else if (tmp) {
                container.appendChild(tmp.content.cloneNode(true));
            }
            else {
                throw new Error(`Template o contenido no encontrado para el selector '${selector}' en ${url}.`);
            }
        }
        else if (type === 'css') {
            const style = document.createElement('style');
            style.textContent = content;
            container.appendChild(style);
        }
    }
    catch (error) {
        console.error(`Error al cargar ${type} para ${componentPath}:`, error);
        throw error;
    }
}
