# JC21 Labs - Portafolio y Servicios Tecnológicos

**JC21 Labs** es el portafolio profesional y plataforma de servicios de **José de Jesús Cerón López**, enfocado en brindar soluciones tecnológicas claras y accesibles para personas y pequeños negocios en Jaral del Progreso, Guanajuato y sus alrededores.

El objetivo principal de este proyecto es demostrar que *"La tecnología no debería sentirse complicada"*, ofreciendo servicios desde soporte técnico y mejora de PCs, hasta digitalización básica para comercios locales.

---

## 🚀 Características Principales

- **Diseño Moderno y Responsivo**: Construido con **Astro** y **Tailwind CSS** para un rendimiento ultrarrápido y una experiencia visual atractiva.
- **Soporte Multi-idioma (i18n)**: Contenido estructurado para estar disponible en Español, Inglés, Coreano y Japonés.
- **Secciones Especializadas**:
  - 📱 *Asesoría para celulares*: Orientación guiada para compras sin engaños.
  - 🖥️ *Hardware y PCs*: Servicio de armado de equipos y mejora de laptops.
  - 🏪 *Soluciones para Negocios*: Menús digitales, WhatsApp Business, códigos QR y páginas web sencillas.
  - 💼 *Portafolio de Proyectos*: Exhibición interactiva de proyectos destacados como StanStore, StageFront Tickets, entre otros.
- **Formulario de Cotización Inteligente**: Permite a los clientes solicitar presupuestos con feedback dinámico en tiempo real según el servicio y el tipo de atención (presencial vs. remoto).
- **Panel de Administración Privado**: Conectado a **InsForge** (Backend-as-a-Service), permite gestionar las cotizaciones recibidas de manera segura mediante autenticación, actualizar su estado y añadir notas internas.

---

## 🛠️ Tecnologías Utilizadas

- [**Astro**](https://astro.build/) - Framework web para sitios estáticos ultra rápidos.
- [**Tailwind CSS**](https://tailwindcss.com/) - Framework de CSS utilitario para diseño a medida.
- [**TypeScript**](https://www.typescriptlang.org/) - Tipado estricto para un JavaScript más robusto.
- [**InsForge**](https://insforge.com/) - Backend-as-a-Service (Autenticación y Base de Datos PostgreSQL).

---

## 📁 Estructura del Proyecto

```text
/
├── public/                 # Assets estáticos (imágenes, fuentes, favicons)
├── src/
│   ├── components/         # Componentes UI reutilizables
│   │   ├── sections/       # Secciones completas (Hero, About, Hardware, PhoneAdvice, etc.)
│   │   └── ui/             # Pequeños elementos (Botones, Tarjetas, Encabezados)
│   ├── i18n/               # Configuración y diccionarios de traducciones
│   ├── layouts/            # Estructuras base de la página HTML
│   ├── lib/                # Utilidades compartidas y configuración del cliente InsForge
│   └── pages/              # Sistema de rutas de Astro (incluyendo el panel /admin)
├── astro.config.mjs        # Configuración general de Astro
├── tailwind.config.mjs     # Configuración de temas y colores de Tailwind CSS
└── package.json            # Dependencias y scripts del entorno
```

---

## ⚙️ Configuración y Desarrollo Local

Sigue estos pasos para correr el proyecto en tu máquina local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/KimJesus22/jc21-labs.git
cd jc21-labs
```

### 2. Instalar dependencias
Recomendamos usar `pnpm`, pero `npm` o `yarn` también funcionan:
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales públicas de InsForge para que el formulario y el panel de administración puedan comunicarse con la base de datos:
```env
PUBLIC_INSFORGE_URL=tu_url_de_insforge
PUBLIC_INSFORGE_ANON_KEY=tu_anon_key_de_insforge
```

### 4. Iniciar el servidor de desarrollo
```bash
pnpm run dev
```
El sitio estará disponible localmente en `http://localhost:4321`.

---

## 🔒 Panel de Administración

El proyecto cuenta con un panel privado integrado en la ruta `/admin` para gestionar cotizaciones y clientes. 

**Para acceder:**
1. Es necesario tener la tabla `quotes` configurada en tu base de datos de InsForge (con la columna `notes` habilitada).
2. Deberás crear un usuario administrador desde el apartado de **Auth** en tu panel de InsForge.
3. Ingresa a `tusitio.com/admin` (o `localhost:4321/admin`), inicia sesión con ese correo y contraseña, y administra las solicitudes de forma segura.

---

## 🤝 Autor y Contacto

Desarrollado y mantenido por **José de Jesús Cerón López**.

- **GitHub**: [@KimJesus22](https://github.com/KimJesus22)
- **Localización**: Jaral del Progreso, Guanajuato.
- **Filosofía**: *Tecnología clara para personas y negocios reales.*
