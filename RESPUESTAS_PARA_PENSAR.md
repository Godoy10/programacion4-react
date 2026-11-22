# Respuestas a las Preguntas "Para Pensar"

Documento de análisis técnico para el cuestionario de **Programación IV (UTN - TUP)**.

---

## 1. Práctica 1 — Para pensar (Summary vs. Detail / Lazy Loading)

### Consigna:
> *En Network, comparen la respuesta de `GET /user` con la de `GET /user/{id}`. La lista trae de cada usuario solo `id` y `name`, y el detalle trae todos los datos de uno solo. ¿Por qué la API no manda todos los datos de todos los usuarios en la lista y se ahorra el segundo pedido? Piensen qué pasaría con 10.000 usuarios.*

### Respuesta Técnica:
Se trata de un patrón de diseño fundamental en arquitecturas cliente-servidor y APIs REST conocido como **Summary / Detail** (o lista superficial vs. detalle profundo):

1. **Sobrecarga de Red y Consumo de Ancho de Banda (Payload Size):**
   - En una lista general (`GET /user`), cada elemento solo necesita identificar mínimamente al recurso para que el usuario pueda localizarlo (apenas `id` y `name`, ~35 a 50 bytes por registro).
   - El detalle completo (`GET /user/{id}`) incluye relaciones y colecciones complejas: `email`, `age`, objeto anidado de `country` y un arreglo completo de objetos `roles` con sus respectivos permisos. Esto eleva el tamaño del JSON a ~1 KB o más por usuario.
   - **Con 10.000 usuarios:**
     - Si la lista enviara el detalle completo: el payload pesaría más de **10 MB a 15 MB de JSON en texto plano**. Esto generaría latencias notables de transferencia, saturaría conexiones móviles y consumiría cuotas de datos innecesariamente.
     - Enviando solo resumen: el payload pesa apenas ~400 KB (y comprimido con Gzip/Brotli, menos de 50 KB).

2. **Carga en la Base de Datos y Memoria del Servidor:**
   - Para armar el detalle de 10.000 usuarios, el backend tendría que ejecutar costosas uniones (`JOIN`) entre tablas (`users`, `user_roles`, `roles`, `countries`), serializar 10.000 grafos de objetos completos a memoria RAM y sobrecargar la CPU del servidor.

3. **Experiencia de Usuario (UX) y Rendimiento en el Navegador:**
   - El navegador tendría que parsear un JSON gigante y alojar en la memoria del motor V8 objetos con miles de propiedades que el usuario probablemente **nunca llegará a inspeccionar** (over-fetching).
   - Al diferir la carga con `GET /user/{id}` (Lazy Loading / Carga a demanda), se hace un pedido liviano y veloz para el listado, y solo se solicita el recurso exhaustivo cuando el usuario realiza una acción deliberada (clic en un usuario puntual).

---

## 2. Práctica 7 — Para pensar (Seguridad vs. Usabilidad en UI)

### Consigna:
> *Con `sfer`: la API responde `403 Missing permission: delete_users`. Muestren el mensaje. ¿Les parece bien que el botón aparezca igual? Lo resolvemos en el paso 12.*

### Respuesta Técnica:
La cuestión debe analizarse desde dos dimensiones complementarias: **Experiencia de Usuario (UX)** y **Seguridad en Profundidad**:

1. **Desde la Experiencia de Usuario (UX / Frontend):**
   - **No está bien** que el botón aparezca habilitado como si nada si sabemos de antemano que el usuario no tiene los privilegios necesarios.
   - Presentar un botón clickeable para una acción restringida induce al usuario a cometer un error, genera una falsa expectativa y resulta en frustración al ver aparecer un cartel de error `403 Forbidden` tras confirmar el diálogo.
   - **Solución correcta de UI:** La interfaz debe inspeccionar los permisos del usuario actual (ej. `can("delete_users")`) y:
     - Ocultar directamente el botón de borrado; o
     - Renderizarlo en estado `disabled` con un tooltip informativo aclarando que su rol actual carece de privilegios suficientes para realizar bajas.

2. **Desde la Seguridad (Backend):**
   - Ocultar o deshabilitar el botón en el cliente es una medida **estrictamente de usabilidad y ergonomía visual, jamás de seguridad**.
   - En una aplicación web, el cliente (navegador) corre en un entorno que está bajo el control total del usuario. Cualquier persona puede inspeccionar el DOM, reactivar el botón, ejecutar un `fetch()` desde la consola de desarrollador o enviar un `curl -X DELETE` directamente al endpoint.
   - Por ende, la **seguridad real e inviolable reside exclusivamente en el backend**, mediante middleware o decoradores de autorización (`permission_check`) que validan la firma criptográfica del JWT y verifican que el claim o rol posea el permiso `delete_users` antes de ejecutar la mutación en la base de datos.

---

## 3. Práctica 9 — Para pensar antes del paso 8 (Arquitectura y Centralización HTTP)

### Consigna:
> *Con los ejercicios hechos, cuenten en su código cuántas veces escribieron:*
> - `import.meta.env.VITE_API_URL`
> - `Authorization: Bearer ${token}`
> - `if (!response.ok)`
> - `useState` para `loading` y `error`
> *Ahora imaginen que el backend cambia y el token hay que mandarlo en otro header. ¿Cuántos archivos tendrían que tocar? ¿Y si se olvidan de uno?*

### Respuesta Técnica:
1. **Conteo en el código previo a la refactorización:**
   - `import.meta.env.VITE_API_URL`: Escrito en **más de 8 lugares distintos** (`App.tsx`, `UserList.tsx` en `fetchUsers`, `fetchMeId`, `fetchMeDetail`, `fetchDetail`, `handleSearch`, `handleCreateUser`, `toggleMayores`, `handleDeleteUser`).
   - `Authorization: Bearer ${token}`: Escrito en **al menos 8 llamadas `fetch`** en `UserList.tsx`.
   - `if (!response.ok)`: Escrito en **cada una de las respuestas de red** (mínimo 9 veces sumando login y operaciones CRUD).
   - `useState` para `loading` y `error`: Declarado repetitivamente en `App.tsx` y disperso en `UserList.tsx` para cada flujo de interacción.

2. **Consecuencias de un cambio en la API (Violación del principio DRY y Alto Acoplamiento):**
   - Si mañana el equipo de backend decide cambiar la autenticación (por ejemplo, enviar el token en `X-Auth-Token`, adoptar cookies `HttpOnly`, o renombrar la ruta `/user`), tendríamos que rastrear y modificar **todos y cada uno de los componentes y llamadas `fetch` repartidas en el proyecto**.
   - Si un desarrollador se olvida de actualizar un solo `fetch`, se genera un **bug silencioso o una falla en tiempo de ejecución** que solo se detectará cuando un usuario interactúe con esa funcionalidad específica en producción.
   - Mezclar en un mismo componente la lógica de presentación visual (JSX), el manejo de protocolos de red, la construcción de cabeceras HTTP y el control de errores rompe el **Principio de Responsabilidad Única (SRP)**.

3. **Solución Arquitectónica (Paso 8 en adelante):**
   - Centralizar todas las llamadas en un **Cliente HTTP único** (`src/api/client.ts` con una función `apiFetch<T>`) y un conjunto de **servicios tipados por entidad** (`src/api/users.ts`, `src/api/roles.ts`).
   - Con este desacoplamiento:
     - Si cambia el encabezado de autenticación o la URL base, **se modifica una única línea en `client.ts`**.
     - Todos los componentes y hooks (`useFetch`) consumen servicios de alto nivel (`getUsers()`, `deleteUser(id)`) sin conocer ni preocuparse por encabezados, URLs ni serialización JSON.
