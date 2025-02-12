"use client";
import Head from 'next/head';
import Script from 'next/script';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import swaggerConfig from './swagger-config.json';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const swaggerUIConfig = {
    defaultModelRendering: 'model',
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      body,
    .swagger-ui .info .title,
    .swagger-ui .scheme-container,
    .swagger-ui select,
    .swagger-ui textarea,
    .swagger-ui input[type="text"],
    .swagger-ui input[type="email"],
    .swagger-ui input[type="file"],
    .swagger-ui input[type="password"],
    .swagger-ui input[type="search"],
    .swagger-ui textarea,
    .swagger-ui .topbar,
    .swagger-ui .dialog-ux .modal-ux {
      background-color: #ffffff !important;
    }

    .swagger-ui .opblock .opblock-section-header,
    .swagger-ui input[type="email"].invalid,
    .swagger-ui input[type="file"].invalid,
    .swagger-ui input[type="password"].invalid,
    .swagger-ui input[type="search"].invalid,
    .swagger-ui input[type="text"].invalid,
    .swagger-ui textarea.invalid {
      background-color: transparent;
    }

    .swagger-ui .topbar,
    .swagger-ui .opblock .opblock-section-header,
    .swagger-ui table thead tr td,
    .swagger-ui table thead tr th,
    .swagger-ui .opblock-tag,
    .swagger-ui .dialog-ux .modal-ux,
    .swagger-ui section.models .model-container,
    .swagger-ui section.models.is-open h4,
    .swagger-ui section.models,
    .swagger-ui .dialog-ux .modal-ux-header,
    .swagger-ui .auth-container {
      border-color: #d1d1d1;
    }

    .swagger-ui .opblock:hover {
      border-color: #e0e0e0;
    }

    /* Mengubah warna teks agar tetap kontras */
    .swagger-ui,
    .swagger-ui .info .title,
    .swagger-ui .scheme-container,
    .swagger-ui .model-title,
    .swagger-ui .opblock-summary-method,
    .swagger-ui .opblock-summary-path,
    .swagger-ui .response-col_status,
    .swagger-ui label,
    .swagger-ui .opblock-tag {
      color: #000000 !important;
    }  
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Head>
        <title>VelynAPI</title>
        <meta name="title" content="VelynAPI - Documentation" />
        <meta name="description" content="VelynApi is a free, simple REST API created by ErerexIDChx for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta name="keywords" content="REST API, KyuuRzy, Siputzx, Qanypaw, Nawdev, Itzpire API, free API, API documentation, bot wa, free REST API" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English, Indonesian" />

        <meta property="og:title" content="VelynAPI - Documentation" />
        <meta property="og:description" content="VelynApi is a free, simple REST API created by ErerexIDChx for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta property="og:url" content="https://kyuubeyours.us.kg" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://files.catbox.moe/962uqd.jpg" />

        <meta name="twitter:title" content="VelynAPI - Documentation" />
        <meta name="twitter:description" content="VelynApi is a free, simple REST API created by ErerexIDChx for the common good. Feel free to use it, but please avoid DDoS attacks." />
        <meta name="twitter:image" content="https://files.catbox.moe/962uqd.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebSite",
            "name": "velyn",
            "url": "https://ererexidchx.vercel.app",
            "description": "velyn is a free, simple REST API created by ErerexID Chx for the common good. Feel free to use it, but please avoid DDoS attacks.",
            "sameAs": [
              "https://www.facebook.com/yourprofile",
              "https://www.twitter.com/yourprofile",
              "https://www.linkedin.com/in/yourprofile"
            ]
          })
        }}
      />
      <main className={inter.className}>
        <Analytics />
        <SpeedInsights />
        <SwaggerUI
          spec={swaggerConfig}
          {...swaggerUIConfig}
        />
      </main>
    </>
  );
}
