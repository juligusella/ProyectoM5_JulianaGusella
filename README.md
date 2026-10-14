# SAVIA · Espacios vivos 🌿

E-commerce de plantas y objetos botánicos para el hogar, desarrollado como Proyecto Integrador del módulo 5 de la especialización Frontend de Soy Henry.

SAVIA ofrece una experiencia de compra online con catálogo de productos, categorías, favoritos, carrito, checkout y funcionalidades de administración.

## Demo

**Producción:** https://ecommerce-ft74.vercel.app

## Funcionalidades

### Clientes

- Registro e inicio de sesión con Firebase Authentication.
- Inicio de sesión con Google.
- Exploración del catálogo y filtrado por categoría.
- Búsqueda y consulta de productos.
- Gestión de favoritos.
- Carrito de compras.
- Checkout y creación de órdenes.
- Consulta del historial de pedidos.

### Administración

- Acceso al panel según el rol del usuario.
- Alta, edición y eliminación de productos.
- Carga de imágenes de productos.
- Gestión de órdenes de compra.

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API y `useReducer`
- Firebase Authentication
- Cloud Firestore
- AWS S3
- Vercel y funciones serverless
- Vitest y React Testing Library

## Arquitectura y decisiones técnicas

El proyecto utiliza una arquitectura por capas que separa las responsabilidades para facilitar el mantenimiento, la comprensión del código y las pruebas.

- **Components:** elementos reutilizables de interfaz.
- **Pages / Routes:** páginas y navegación de la aplicación.
- **Contexts:** administración del estado global compartido.
- **Hooks:** acceso reutilizable a contextos y lógica.
- **Services:** comunicación con servicios externos y acceso a datos.
- **Types:** modelos e interfaces de TypeScript.
- **API / Functions:** operaciones de backend necesarias para servicios como la carga de imágenes.

### Estado global

Context API permite compartir información entre componentes sin pasar props por múltiples niveles. Para el carrito, `useReducer` centraliza las acciones y mantiene la lógica de actualización en una función separada y predecible.

Los contextos de autenticación, carrito y favoritos tienen responsabilidades diferenciadas.

### Firebase

Firebase Authentication gestiona la identidad de los usuarios. Cloud Firestore almacena los datos de la aplicación, incluidos los productos y las órdenes.

El acceso a las funcionalidades administrativas depende del rol del usuario. Las reglas de Firestore deben proteger los datos independientemente de las validaciones realizadas en la interfaz.

### AWS S3 y URLs prefirmadas

SAVIA utiliza AWS S3 para almacenar las imágenes de los productos. La carga se autoriza mediante una función serverless de Vercel ubicada en `api/presign.ts`.

#### Flujo de carga

1. El administrador selecciona una imagen en el panel de administración.
2. El frontend envía una solicitud `POST` a `/api/presign`, indicando el nombre del archivo y su tipo MIME.
3. La función valida que ambos datos estén presentes y que el tipo de imagen sea JPEG, PNG o WebP.
4. AWS SDK genera una URL prefirmada para subir el objeto al bucket configurado. La URL tiene una vigencia de 600 segundos (10 minutos).
5. El frontend utiliza esa URL temporal para cargar la imagen directamente a S3.
6. La función devuelve la URL firmada, la clave del objeto (`key`) y una URL de referencia (`publicUrl`) para el archivo.

#### Consideraciones de seguridad

Las URLs prefirmadas permiten autorizar una operación temporal sin exponer las credenciales de AWS al navegador. La función admite solicitudes `POST` y valida los tipos MIME permitidos.

Para producción, también es importante verificar la autenticación y autorización del administrador en el servidor, limitar el tamaño de los archivos y configurar correctamente los permisos y CORS del bucket.

### Deploy

La aplicación se publica en Vercel. Las variables de entorno se configuran por separado para el desarrollo local y la producción.

## Instalación local

### Requisitos

- Node.js y npm.
- Una cuenta de Firebase y un proyecto configurado.
- Un bucket de AWS S3 y permisos para cargar imágenes.
- Una cuenta de Vercel si se desea desplegar la aplicación.

### 1. Clonar el repositorio

```bash
git clone https://github.com/juligusella/ProyectoM5_JulianaGusella.git
cd ProyectoM5_JulianaGusella
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

Completar las variables de Firebase con los datos de configuración del proyecto. Las variables privadas de AWS deben configurarse exclusivamente en el entorno de las funciones serverless.

Consultar la sección [Variables de entorno](#variables-de-entorno) para conocer el propósito de cada variable.

**Importante:** no subir el archivo `.env` ni credenciales privadas al repositorio.

### 4. Iniciar el entorno de desarrollo

```bash
npm run dev
```

### 5. Verificar el build de producción

```bash
npm run build
```

### 6. Ejecutar las pruebas

```bash
npm run test -- --run
```

## Variables de entorno

El proyecto utiliza variables de entorno para configurar Firebase y los servicios de AWS sin incluir credenciales privadas directamente en el código.

### Configuración local

1. Copiar `.env.example` a un nuevo archivo `.env` en la raíz del proyecto.
2. Completar los valores con la configuración de los servicios correspondientes.
3. No compartir ni subir el archivo `.env` al repositorio.

En sistemas compatibles con Bash, se puede ejecutar:

```bash
cp .env.example .env
```

### Variables de Firebase

| Variable | Descripción |
|---|---|
| `VITE_FIREBASE_API_KEY` | Clave de configuración de la aplicación web de Firebase. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación de Firebase. |
| `VITE_FIREBASE_PROJECT_ID` | Identificador del proyecto de Firebase. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Identificador del bucket configurado en Firebase. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Identificador del emisor de mensajes de Firebase. |
| `VITE_FIREBASE_APP_ID` | Identificador de la aplicación web de Firebase. |

### Variables de AWS S3

| Variable | Descripción |
|---|---|
| `AWS_ACCESS_KEY_ID` | Identificador de la credencial de AWS. |
| `AWS_SECRET_ACCESS_KEY` | Clave secreta de AWS. |
| `AWS_REGION` | Región donde se encuentra el bucket S3. |
| `S3_BUCKET` | Nombre del bucket utilizado para las imágenes de productos. |

Las variables de AWS son privadas y deben configurarse únicamente en el entorno de las funciones serverless que las necesitan. Nunca deben exponerse al frontend ni llevar el prefijo `VITE_`.

### Configuración en Vercel

En el panel del proyecto de Vercel, agregar las variables necesarias para el frontend y las funciones serverless.

- Las variables `VITE_*` se utilizan en la aplicación frontend.
- Las variables de AWS deben estar disponibles para las funciones serverless.
- No configurar credenciales privadas con el prefijo `VITE_`.
- Después de modificar las variables, generar un nuevo deploy para aplicar los cambios.

## Configuración de servicios

### Firebase

1. Crear un proyecto en Firebase Console.
2. Habilitar los métodos de autenticación utilizados por la aplicación.
3. Crear la base de datos de Cloud Firestore.
4. Configurar las colecciones y las reglas de seguridad correspondientes.
5. Registrar la aplicación web y copiar los valores de configuración a las variables de entorno.
6. Autorizar el dominio de producción en Authentication para permitir el inicio de sesión desde Vercel.

### AWS S3

1. Crear un bucket S3.
2. Configurar los permisos necesarios para la carga y el acceso a los objetos.
3. Crear credenciales de IAM con los permisos mínimos necesarios.
4. Configurar las variables privadas en el entorno serverless.
5. Revisar CORS para permitir las solicitudes necesarias desde la aplicación.
6. Verificar el flujo de URLs prefirmadas sin exponer credenciales en el frontend.

### Vercel

1. Importar el repositorio desde GitHub.
2. Configurar las variables de entorno necesarias para el frontend y las funciones serverless.
3. Mantener las variables privadas de AWS fuera del bundle del navegador.
4. Ejecutar el deploy.
5. Probar autenticación, catálogo, carrito, checkout y administración en producción.

## Testing

Las pruebas automatizadas verifican la lógica de reducers, componentes y flujos seleccionados de la aplicación.

Para ejecutarlas:

```bash
npm run test -- --run
```

## Bitácora de uso de IA

Durante el desarrollo de SAVIA se utilizó ChatGPT como herramienta de apoyo para comprender conceptos, comparar alternativas de implementación, revisar decisiones técnicas y resolver problemas. Las propuestas se evaluaron según la arquitectura del proyecto, los requisitos del integrador y el comportamiento de la aplicación.

### 1. Diseño de componentes reutilizables

**Prompt utilizado:** Ayudame a diseñar y mejorar los componentes reutilizables teniendo en cuenta buenas prácticas de React y TypeScript, especialmente en el componente `Button`.

**Aprendizaje:** La reutilización no consiste solamente en evitar código repetido, sino en diseñar componentes con props claras, tipadas y fáciles de utilizar correctamente.

**Decisión:** Se trabajó con variantes y tamaños tipados, contenido flexible mediante `children` y estados como `loading` y `disabled`.

### 2. Arquitectura y flujo de datos del catálogo

**Prompt utilizado:** Analizá la arquitectura del e-commerce y el flujo de datos entre Firebase, los servicios y los componentes.

**Aprendizaje:** Separar las responsabilidades facilita el mantenimiento, las pruebas y la comprensión del código.

**Decisión:** Se mantuvo una arquitectura por capas, utilizando `ProductsService`, `ProductsProvider` y `ProductsContext` para organizar la obtención y distribución de los productos.

### 3. Recuperación de las reglas de Firebase

**Prompt utilizado:** Ayudame a recuperar las reglas de Firestore que vencieron y dejaron de permitir el acceso al catálogo de SAVIA.

**Aprendizaje:** Las reglas de Firebase en modo de prueba tienen una fecha de vencimiento. Es importante revisar su configuración y definir reglas adecuadas para proteger los datos.

**Decisión:** Se restauraron las reglas guardadas como respaldo para recuperar el catálogo y se verificó nuevamente su funcionamiento.

### 4. Carga de imágenes con AWS S3

**Prompt utilizado:** Ayudame a implementar la carga de imágenes de productos a AWS S3 mediante URLs prefirmadas.

**Aprendizaje:** Las URLs prefirmadas permiten subir archivos sin exponer las credenciales privadas de AWS en el frontend. La generación de la URL y la subida del archivo deben tener responsabilidades separadas.

**Decisión:** Se implementó una función de servidor en `api/presign.ts` para generar la URL prefirmada y un servicio `uploadImage` en el frontend para realizar la subida.

### 5. Diagnóstico de problemas en producción

**Prompt utilizado:** Ayudame a diagnosticar por qué el inicio de sesión con Google funciona localmente, pero falla en Vercel.

**Aprendizaje:** Los problemas en producción también pueden deberse a diferencias de configuración entre entornos y no necesariamente a errores en el código.

**Decisión:** Se autorizó el dominio de producción en Firebase Authentication y se verificó que el inicio de sesión con Google funcionara correctamente.

## Autora

**Juliana Gusella**

Proyecto desarrollado como parte de la formación Full Stack de Soy Henry.