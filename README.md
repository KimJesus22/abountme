# JC21 Labs - Portafolio y Servicios Tecnológicos

**JC21 Labs** es el portafolio profesional y plataforma de servicios de **José de Jesús Cerón López**, enfocado en brindar soluciones tecnológicas claras y accesibles para personas y pequeños negocios en Jaral del Progreso, Guanajuato y sus alrededores.

El objetivo principal de este proyecto es demostrar que *"La tecnología no debería sentirse complicada"*, ofreciendo servicios desde soporte técnico y mejora de PCs, hasta digitalización básica para comercios locales, siempre operando bajo un marco de **honestidad, transparencia y diagnósticos reales.**

---

## 🚀 Características Principales

- **Diseño Moderno, Claro y Amable (Light Mode)**: Construido con **Astro** y **Tailwind CSS**, utilizando una paleta de colores claros y bordes suaves para inspirar confianza y profesionalismo en un público no técnico.
- **Optimizado para SEO Local**: Cuenta con Schema de Negocio Local (JSON-LD), archivo `robots.txt` protegido, `sitemap` dinámico y meta tags Open Graph para un excelente posicionamiento en búsquedas locales.
- **Secciones Especializadas**:
  - 📱 *Asesoría para celulares*: Orientación guiada para compras sin engaños.
  - 🖥️ *Hardware y PCs*: Servicio de armado de equipos y mejora de laptops.
  - 🏪 *Soluciones para Negocios*: Menús digitales, WhatsApp Business y páginas web sencillas.
  - 💼 *Proyectos y Experiencia*: Secciones que validan experiencia práctica real (OXXO, Kioscos GTO, etc.).
- **Formulario de Cotización Inteligente**: Permite solicitar presupuestos con feedback dinámico en tiempo real (precios estimados y avisos de viáticos) según el servicio y el tipo de atención solicitada.
- **Preparado para IA (Futuro)**: Cuenta con arquitectura modular y tipos de TypeScript definidos en `src/lib/quotes/quoteService.ts` listos para inyectar modelos de lenguaje que ayuden a "pre-cotizar" automáticamente leyendo el problema del cliente.
- **Panel de Administración Privado (`/admin`)**: 
  - Conectado a **InsForge** (BaaS) mediante sesión segura.
  - Gestión integral de cotizaciones (leer, responder, cambiar estatus, añadir notas).
  - Incluye **Checklists de Cotización** nativos en el panel para ayudar al administrador a no olvidar preguntas críticas por WhatsApp según el tipo de servicio.

---

## 🛠️ Tecnologías Utilizadas

- [**Astro 6.x**](https://astro.build/) - Framework web estático ultra rápido.
- [**Tailwind CSS 3.4**](https://tailwindcss.com/) - Framework CSS para diseño responsivo.
- [**TypeScript**](https://www.typescriptlang.org/) - Tipado estricto (`types.ts` en todo el proyecto).
- [**InsForge SDK**](https://insforge.com/) - Backend-as-a-Service para PostgreSQL, Auth y Storage.
- **@astrojs/sitemap** - Generación automática de mapas de sitio para SEO.

---

## 📁 Estructura del Proyecto

```text
/
├── public/                 # Assets estáticos y robots.txt
├── src/
│   ├── components/         
│   │   ├── layout/         # Navbar, Footer
│   │   ├── sections/       # Secciones (Hero, About, Testimonials, QuoteForm)
│   │   └── ui/             # Pequeños elementos
│   ├── data/               # Archivos estáticos como los Checklists para el panel admin
│   ├── i18n/               # Configuración multi-idioma (es, en, ko, ja)
│   ├── layouts/            # Estructuras base con inyección de SEO (MainLayout.astro)
│   ├── lib/                # Configuración de InsForge, links a WA y lógica de Cotizaciones (IA)
│   └── pages/              # Rutas de Astro (index de idiomas y panel privado /admin)
├── astro.config.mjs        # Configuración de Astro (integraciones)
├── tailwind.config.mjs     # Paleta de colores "Light Mode" (Índigo y grises suaves)
└── package.json            # Dependencias
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
Recomendamos usar `pnpm`:
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en el `.env.example`. Asegúrate de usar el prefijo `VITE_` para que Astro pueda leerlas desde el cliente:
```env
VITE_INSFORGE_URL=tu_url_de_insforge
VITE_INSFORGE_ANON_KEY=tu_anon_key_de_insforge
```

### 4. Iniciar el servidor de desarrollo
```bash
pnpm run dev
```
El sitio estará disponible localmente en `http://localhost:4321`.

---

## 🔒 Panel de Administración y Despliegue

### Panel de Administración (`/admin`)
- Es completamente privado y está desautorizado para los robots de búsqueda de Google.
- Requiere autenticación configurada mediante `insforge.auth.signInWithPassword()`.
- Necesitas crear un usuario administrador desde tu dashboard en InsForge y tener la tabla `quotes` creada en tu base de datos de PostgreSQL.

### Despliegue en Vercel
1. Importa el repositorio desde tu cuenta de Vercel.
2. Vercel detectará la configuración de Astro automáticamente.
3. Asegúrate de inyectar las variables de entorno (`VITE_INSFORGE_URL` y `VITE_INSFORGE_ANON_KEY`) en la configuración del proyecto en Vercel antes del despliegue.

---

## 🤝 Autor y Filosofía

Desarrollado y mantenido por **José de Jesús Cerón López**.

- **GitHub**: [@KimJesus22](https://github.com/KimJesus22)
- **Localización**: Jaral del Progreso, Guanajuato.
- **Filosofía**: *Tecnología clara para personas y negocios reales. Sin promesas mágicas, con diagnósticos honestos.*
