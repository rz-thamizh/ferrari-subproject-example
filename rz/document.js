import Head from 'next/head';
import React from 'react';

export const RZHead = () => (
  <Head>
    <link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      key="gs-font-pc"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;500;700;900&display=swap"
      rel="stylesheet"
      key="gs-font"
    />
    <link rel="shortcut icon" href="/tl-logo.png" type="image/x-icon" key="shortcut" />
    <link rel="icon" href="/tl-logo.png" type="image/x-icon" key="icon" />

    {/* Zendesk chat script */}
    <script type="text/javascript" src="https://v2.zopim.com/?48H9zbk6dhkIOe3RenuXle22kgCRkZSt" />
  </Head>
);
