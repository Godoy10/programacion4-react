# Trabajo Práctico: Frontend con React y TypeScript

**Materia:** Programación IV (2026)  
**Institución:** Tecnicatura Universitaria en Programación — Universidad Tecnológica Nacional (UTN)  
**Estudiante:** Agustín Godoy ([@Godoy10](https://github.com/Godoy10))  
**Repositorio:** [https://github.com/Godoy10/programacion4-react](https://github.com/Godoy10/programacion4-react)

---

## Estructura del Repositorio

El repositorio respeta estrictamente la estructura y nomenclatura requerida por la cátedra:

```text
programacion4-react/
├── ejercicios-basicos/      # Proyecto Vite en TypeScript con los 7 ejercicios de "React desde cero"
│   ├── src/
│   │   ├── Ej1.tsx          # Tarjetas de producto (Props)
│   │   ├── Ej2.tsx          # Contador con límites (useState)
│   │   ├── Ej3.tsx          # Mostrar y ocultar (Condicionales)
│   │   ├── Ej4.tsx          # Conversor de temperatura (Inputs controlados)
│   │   ├── Ej5.tsx          # Lista de compras (Listas y estado)
│   │   ├── Ej6.tsx          # Buscador de lenguajes (Filtrado)
│   │   ├── Ej7.tsx          # Tipar con TypeScript (Interface y prop opcional oferta)
│   │   ├── App.tsx          # Muestra los 7 ejercicios con título identificatorio
│   │   └── ...
│   └── .env.example
├── frontend-endpoints/      # Las 8 prácticas de integración con la API Backend
│   ├── practica1/           # Práctica 1: Ver el detalle de un usuario al hacer clic (GET /user/{id})
│   ├── practica2/           # Práctica 2: "Cargando..." y manejo de error con detail
│   ├── practica3/           # Práctica 3: Buscar por nombre con encodeURIComponent y botón Limpiar
│   ├── practica4/           # Práctica 4: Mostrar mis roles ("Hola, Martina (ADMIN)")
│   ├── practica5/           # Práctica 5: Formulario de Alta de usuario (POST /user con body JSON)
│   ├── practica6/           # Práctica 6: Alternar entre Todos y Solo mayores (GET /user_mayores)
│   ├── practica7/           # Práctica 7: Botón Borrar en cada fila con DELETE /user/{id} y filter
│   └── practica8/           # Práctica 8: Sesión vencida (401 -> onUnauthorized -> "Tu sesión venció")
├── RESPUESTAS_PARA_PENSAR.md # Respuestas técnicas completas a las preguntas "para pensar"
└── README.md
```

---

## Respuestas a las Consignas "Para Pensar"

Las respuestas completas, detalladas y fundamentadas se encuentran en el archivo [`RESPUESTAS_PARA_PENSAR.md`](./RESPUESTAS_PARA_PENSAR.md). Incluyen:
1. **Práctica 1:** Por qué la API separa la lista del detalle (`GET /user` vs `GET /user/{id}`) y qué sucedería con 10.000 usuarios (over-fetching, impacto en ancho de banda, memoria y DB).
2. **Práctica 7:** Análisis del error 403 con usuario regular `sfer`, por qué no corresponde mostrar botones de acciones no autorizadas (UX) y por qué la seguridad real debe residir en el backend.
3. **Práctica 9:** Conteo de repeticiones en el código previo al paso 8 (`VITE_API_URL`, `Bearer token`, `!response.ok`), impacto ante cambios en la API y resolución arquitectónica mediante `apiFetch` centralizado.

---

## Cómo Ejecutar los Proyectos

### Requisitos previos:
- **Node.js** (v18 o superior)
- **Backend FastAPI** corriendo en `http://localhost:8000`

### 1. Ejercicios Básicos:
```bash
cd ejercicios-basicos
npm install
npm run dev
```

### 2. Prácticas de Endpoints (ejemplo con `practica8`):
```bash
cd frontend-endpoints/practica8
npm install
# Crear el archivo .env a partir del ejemplo si es necesario
cp .env.example .env
npm run dev
```

---

## Verificación de Compilación (TypeScript / Vite)
Todos los proyectos fueron testeados y compilan exitosamente con `tsc -b && vite build` sin advertencias ni errores de tipos.
