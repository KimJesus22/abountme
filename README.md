# JC21 Labs - Portafolio y Servicios Tecnológicos

**JC21 Labs** es el portafolio profesional y plataforma de servicios de **José de Jesús Cerón López**, enfocado en brindar soluciones tecnológicas claras y accesibles para personas y pequeños negocios en Jaral del Progreso, Guanajuato y sus alrededores.

El objetivo principal de este proyecto es demostrar que *"La tecnología no debería sentirse complicada"*, ofreciendo servicios desde soporte técnico y mejora de PCs, hasta digitalización básica para comercios locales, siempre operando bajo un marco de **honestidad, transparencia y diagnósticos reales.**

---

## 🚀 Características Principales

- **Diseño Moderno, Claro y Elegante (Dark Mode)**: Construido con **Astro** y **Tailwind CSS**, utilizando una paleta de colores oscuros profundos y tarjetas translúcidas para inspirar confianza y profesionalismo sin fatigar la vista.
- **Optimizado para SEO Local**: Cuenta con Schema de Negocio Local (JSON-LD), archivo `robots.txt` protegido, `sitemap` dinámico y meta tags Open Graph para un excelente posicionamiento en búsquedas locales.
- **Secciones Especializadas**:
  - 📱 *Asesoría para celulares*: Orientación guiada para compras sin engaños.
  - 📋 *Checklist para elegir celular*: Guía visual y gratuita para evaluar opciones de equipos antes de comprar.
  - 🖥️ *Hardware y PCs*: Servicio de armado de equipos y mejora de laptops.
  - 🏪 *Soluciones para Negocios*: Menús digitales, WhatsApp Business y páginas web sencillas.
  - 💼 *Proyectos y Casos Reales*: Secciones que validan experiencia práctica real (OXXO, Kioscos GTO, Ciber La Red, etc.) con ejemplos de equipos arreglados.
- **Formulario de Cotización Inteligente**: Permite solicitar presupuestos con feedback dinámico en tiempo real (precios estimados y avisos de viáticos) según el servicio y el tipo de atención solicitada.
- **Preparado para IA (Futuro)**: Cuenta con arquitectura modular y tipos de TypeScript definidos en `src/lib/quotes/quoteService.ts` listos para inyectar modelos de lenguaje que ayuden a "pre-cotizar" automáticamente leyendo el problema del cliente.
- **Panel de Administración Privado (`/admin`)**: 
  - Conectado a **InsForge** (BaaS) mediante sesión segura.
  - Gestión integral de cotizaciones (leer, responder, cambiar entre múltiples estatus visuales, ordenar por fecha, aplicar filtros, y añadir notas internas privadas).
  - Integración nativa para leer y responder mensajes del bot de Telegram.
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
├── tailwind.config.mjs     # Paleta de colores "Dark Mode" (Negros profundos y acentos púrpura)
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

> Nota actual: este proyecto usa variables `PUBLIC_*` para Astro/InsForge. Mantén sincronizado tu `.env` y las variables de Vercel con `.env.example`.

Variables necesarias para InsForge y Telegram:

```env
PUBLIC_INSFORGE_URL=https://tu-proyecto.region.insforge.app
PUBLIC_INSFORGE_ANON_KEY=tu-anon-key
PUBLIC_TELEGRAM_BOT_USERNAME=KimJesusCeronTechBot

TELEGRAM_BOT_TOKEN=token-de-botfather
TELEGRAM_OWNER_CHAT_ID=tu-chat-id-personal
TELEGRAM_WEBHOOK_SECRET=secreto-del-webhook
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

### InsForge: tablas para cotizaciones y Telegram
Este proyecto trabaja directamente con InsForge. Los archivos SQL dentro de `database/` son guías operativas para ejecutar manualmente en InsForge cuando prepares o actualices la base de datos; no dependen de GitHub para funcionar.

Ejecuta estos SQL en InsForge:

1. `database/quotes_telegram_fields.sql`
   - Agrega a `quotes` los campos usados por el bot de Telegram.
   - Define defaults seguros como `status = 'nueva'` y `telegram_status = 'new'`.
   - Corrige el error de PostgREST cuando falta `telegram_chat_id`.

2. `database/telegram_messages.sql`
   - Crea la tabla `telegram_messages`.
   - Guarda historial inbound/outbound asociado a una cotización.
   - Permite responder desde `/admin` y ver el historial del chat.

Campos esperados en `quotes` para el flujo de Telegram:

```text
full_name, phone, email, city, attention_type, service_type, description,
budget, urgency, source, status, telegram_chat_id, telegram_username,
telegram_first_name, telegram_last_name, telegram_status, created_at
```

### Bot de Telegram
El bot configurado para contacto es `@KimJesusCeronTechBot`.

Endpoint del webhook:

```text
/api/telegram/webhook
```

Para probar después de ejecutar los SQL en InsForge:

1. Abre `@KimJesusCeronTechBot` en Telegram.
2. Envía `/start`.
3. Completa el flujo hasta elegir el origen.
4. Debes recibir el mensaje de confirmación.
5. Revisa `/admin` y confirma que la cotización aparece.
6. Si falla, revisa los logs de Vercel buscando:
   - `[telegram:webhook] Update received`
   - `[telegram] Saving quote to InsForge`
   - `[insforge] Error inserting Telegram quote`

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
