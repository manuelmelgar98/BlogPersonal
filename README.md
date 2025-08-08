# BlogPersonal
Blog Personal - Proyecto de Desarrollo Web
Este proyecto es una aplicación web de blog personal simple, construida desde cero para gestionar entradas de blog (posts). Permite a los usuarios crear, visualizar, editar y eliminar posts de forma dinámica, demostrando el uso de tecnologías web modernas y una arquitectura modular.

Tecnologías Utilizadas
HTML5: Estructura de la aplicación y de los Web Components.

CSS: Estilos y diseño responsivo, incluyendo el uso de variables CSS para consistencia.

TypeScript: Lenguaje principal de programación, que proporciona tipado estático para un código más robusto y mantenible.

Web Components: Uso de Custom Elements, Shadow DOM y HTML Templates para crear componentes de interfaz de usuario reutilizables y encapsulados.

API Simulada: Para simular la persistencia de datos (operaciones CRUD), se utiliza localStorage con funciones asíncronas que imitan peticiones a un backend.

Herramientas de Desarrollo:

npm: Gestor de paquetes.

TypeScript Compiler (tsc): Para compilar el código TypeScript a JavaScript.

http-server: Servidor web local para servir archivos estáticos.

cpx y concurrently: Utilidades para automatizar la copia de archivos y la ejecución de tareas de desarrollo en paralelo.

Arquitectura del Proyecto
El proyecto sigue una arquitectura modular y desacoplada, organizada en la siguiente estructura de directorios:

blog-personal/
├── public/                 # Archivos estáticos servidos por el servidor
│   └── assets/             # Imágenes y recursos estáticos
│   └── dist/               # Archivos JavaScript y CSS compilados
│
└── src/                    # Código fuente de TypeScript
    ├── api/                # Lógica de la API simulada (interacción con localStorage)
    ├── components/         # Web Components de la aplicación
    ├── models/             # Interfaces de TypeScript para el modelo de datos
    ├── services/           # Lógica central de datos (DataService)
    └── utils/              # Funciones de utilidad reutilizables
Esta arquitectura fue diseñada para separar las responsabilidades, permitiendo que la lógica de la interfaz de usuario, la lógica de negocio y la capa de datos sean independientes entre sí.

Buenas Prácticas Implementadas
Gestión del Estado Desacoplada: El estado central de la aplicación (la lista de posts) se gestiona en un servicio (dataService.ts) en lugar de en los componentes de la interfaz de usuario.

Principio: Separación de responsabilidades y el patrón de la "Fuente de Verdad Única" (Single Source of Truth), similar al patrón de "Presentational/Container Components".

Fuente: medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9f7c7d0

Comunicación entre Componentes: Se utiliza la API nativa de CustomEvent para la comunicación entre componentes.

Principio: Esto asegura un acoplamiento débil, ya que los componentes solo "emiten" o "escuchan" señales sin conocer directamente a otros componentes.

Fuente: developer.mozilla.org/es/docs/Web/API/EventTarget/dispatchEvent

Desarrollo con TypeScript: Se aprovechan las ventajas de TypeScript para mejorar el tipado y la robustez del código.

Buena Práctica: Exportar las clases de los Web Components permite un tipado seguro en la aplicación.

Fuente: www.typescriptlang.org/docs/handbook/intro.html

Control de Versiones (Git): Se siguieron las convenciones de Conventional Commits para mantener un historial de commits limpio y descriptivo.

feat: Nueva funcionalidad.

fix: Corrección de un error.

refactor: Cambios en la estructura del código sin cambiar la funcionalidad.

style: Cambios de formato o estilo.

chore: Tareas de mantenimiento y configuración.

Encapsulamiento del Código: El Shadow DOM aísla el HTML, CSS y JavaScript de cada Web Component, previniendo conflictos globales y facilitando la reutilización.

Fuente: developer.mozilla.org/es/docs/Web/API/Web_Components/Using_shadow_DOM

Instalación y Uso
Para ejecutar este proyecto, sigue estos sencillos pasos:

Clona el repositorio:

Bash

git clone https://github.com/tu-usuario/nombre-del-repositorio.git
cd nombre-del-repositorio
Instala las dependencias de desarrollo:

Bash

npm install
Inicia la aplicación en modo de desarrollo:

Bash

npm start
Esto compilará el código de TypeScript, copiará los assets a la carpeta de public, e iniciará un servidor web local.

