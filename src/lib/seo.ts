/**
 * Genera el Schema JSON-LD para SEO local.
 * Se define como ProfessionalService / LocalBusiness para indicar claramente
 * qué servicios se ofrecen y en qué área geográfica.
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "JC21 Labs",
    "image": "https://abountme-beta.vercel.app/favicon.png",
    "description": "Soporte técnico remoto y presencial, reparación de celulares y computadoras, armado de PC, y creación de páginas web y menús digitales para negocios pequeños en Jaral del Progreso y Guanajuato.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jaral del Progreso",
      "addressRegion": "Guanajuato",
      "addressCountry": "MX"
    },
    "areaServed": [
      "Jaral del Progreso, Guanajuato",
      "Valle de Santiago, Guanajuato",
      "Cortazar, Guanajuato",
      "Celaya, Guanajuato"
    ],
    "telephone": "+524111441791",
    "url": "https://abountme-beta.vercel.app",
    "founder": {
      "@type": "Person",
      "name": "José de Jesús Cerón López"
    },
    "priceRange": "$$",
    "sameAs": [
      "https://github.com/KimJesus22"
      // Aquí se pueden agregar links a Facebook, LinkedIn, etc.
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Soporte técnico para celulares y computadoras"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Asesoría para comprar celular"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Páginas web y menús digitales para negocios"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Armado de PC y mejora de laptops"
        }
      }
    ]
  };
}
