export async function loadComponentAsset(componentPath: string, type: 'html' | 'css', container: ShadowRoot, selector: string | null = null): Promise<HTMLElement | void> {
    try {
        const url = `${componentPath}.${type}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${type.toUpperCase()} no cargado: ${res.statusText} en ${url}`);
        const content = await res.text();

        if (type === 'html') {
            const tmp = document.createElement('template');
            tmp.innerHTML = content;
            const element = selector ? tmp.content.querySelector(selector) : tmp.content.cloneNode(true);
            if (!element) throw new Error(`Elemento con selector '${selector}' no encontrado en el template de ${url}.`);
            container.appendChild(element as Node);
            return element as HTMLElement;
        } else if (type === 'css') {
            const style = document.createElement('style');
            style.textContent = content;
            container.appendChild(style);
        }
    } catch (error) {
        console.error(`Error al cargar ${type} para ${componentPath}:`, error);
        throw error;
    }
}