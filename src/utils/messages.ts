// src/utils/messages.ts (o core/utils/messages.ts, según tu estructura)

// La inyección de estilos se mantiene similar,
// pero si tienes un bundler, esto podría manejarse de otra forma.
(function injectStyles(): void {
    if (document.getElementById('messages-styles')) return;
    const style = document.createElement('style');
    style.id = 'messages-styles';
    style.textContent = `
        dialog.message-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: none;
            border-radius: 8px;
            padding: 20px;
            max-width: 360px;
            width: 90%;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            background: #333;
            color: white;
            z-index: 1000; /* Asegura que esté por encima de otros elementos */
        }

        dialog.message-dialog .header .close-btn {
            color: white;
        }

        dialog.message-dialog::backdrop {
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px);
        }

        dialog.message-dialog .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        dialog.message-dialog .header h3 {
            margin: 0;
        }
        dialog.message-dialog .close-btn {
            background: none;
            border: none;
            font-size: 1.4rem;
            cursor: pointer;
        }

        dialog.message-dialog .message-body {
            margin: 15px 0;
        }

        dialog.message-dialog button.confirm {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            background: #4CAF50;
            color: white;
        }

        dialog.message-dialog button.cancel {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            background: #f44336;
            color: white;
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
})();

export function showAlert(message: string, title: string = 'Alerta'): void {
    const dlg = document.createElement('dialog');
    dlg.className = 'message-dialog';
    dlg.innerHTML = `
        <div class="header">
            <h3>${title}</h3>
            <button class="close-btn" aria-label="Cerrar">&times;</button>
        </div>
        <div class="message-body">${message}</div>
        <div style="text-align: right;">
            <button class="confirm">OK</button>
        </div>
    `;

    // Añadir verificaciones de null/undefined para los elementos seleccionados
    const closeBtn = dlg.querySelector('.close-btn') as HTMLButtonElement;
    const confirmBtn = dlg.querySelector('.confirm') as HTMLButtonElement;

    closeBtn?.addEventListener('click', () => dlg.close());
    confirmBtn?.addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => dlg.remove());

    document.body.appendChild(dlg);
    dlg.showModal();
}

export function showConfirm(message: string, onConfirm: () => void, title: string = 'Confirmación'): void {
    const dlg = document.createElement('dialog');
    dlg.className = 'message-dialog';
    dlg.innerHTML = `
        <div class="header">
            <h3>${title}</h3>
            <button class="close-btn" aria-label="Cerrar">&times;</button>
        </div>
        <div class="message-body">${message}</div>
        <div style="text-align: right;">
            <button class="cancel">Cancelar</button>
            <button class="confirm">Aceptar</button>
        </div>
    `;

    const closeBtn = dlg.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dlg.querySelector('.cancel') as HTMLButtonElement;
    const confirmBtn = dlg.querySelector('.confirm') as HTMLButtonElement;

    closeBtn?.addEventListener('click', () => dlg.close());
    cancelBtn?.addEventListener('click', () => dlg.close());
    confirmBtn?.addEventListener('click', () => {
        onConfirm(); // Ejecuta el callback
        dlg.close();
    });
    dlg.addEventListener('close', () => dlg.remove());

    document.body.appendChild(dlg);
    dlg.showModal();
}