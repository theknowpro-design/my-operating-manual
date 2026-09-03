/**
 * CSS <style> block for jsPDF + html2canvas-safe PDF HTML.
 * Pure CSS string assembly — no rendering libraries.
 */

import {
  accentColor,
  titleColor,
  headerColor,
  footerColor,
} from './branding.css.js';
import brandingConfig from '../brandingConfig.js';

/**
 * Build a <style> block using layout + branding constants.
 * Only uses CSS features that jsPDF/html2canvas handle reliably.
 * @returns {string}
 */
export function getCss() {
  const logoWidth = Number(brandingConfig.logoWidth || brandingConfig.coverLogoWidth) || 120;
  return `<style>
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #222222;
  margin: 0;
  padding: 0;
  background: #ffffff;
  box-sizing: border-box;
}
.pdf-container {
  width: 700px;
  margin: 0 auto;
  padding: 40px;
  box-sizing: border-box;
}
.pdf-header {
  text-align: center;
  margin-bottom: 40px;
}
.pdf-logo,
.pdf-logo--top-center {
  width: ${logoWidth}px;
  height: auto;
  display: block;
  margin: 0 auto 20px auto;
}
.title-page {
  text-align: center;
  margin: 0 0 20px 0;
  padding: 0;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 28px;
  font-weight: bold;
  line-height: 1.3;
  color: ${titleColor};
  margin: 0 0 20px 0;
  padding: 0;
  text-align: center;
}
h2 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 22px;
  font-weight: bold;
  line-height: 1.35;
  color: ${headerColor};
  margin: 30px 0 15px 0;
  padding: 0;
  text-align: left;
}
h3 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.4;
  color: ${accentColor};
  margin: 25px 0 10px 0;
  padding: 0;
  text-align: left;
}
h4 {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.4;
  color: ${headerColor};
  margin: 20px 0 8px 0;
  padding: 0;
  text-align: left;
}
p {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
  padding: 0;
  text-align: left;
}
.subtitle {
  font-size: 16px;
  line-height: 1.5;
  color: ${footerColor};
  text-align: center;
  margin: 0 0 20px 0;
}
.generated {
  font-size: 14px;
  line-height: 1.5;
  color: ${footerColor};
  text-align: center;
  margin: 0 0 20px 0;
}
.section,
.cta,
.faq,
.metadata,
.faq-item {
  margin: 0 0 16px 0;
  padding: 0;
}
ul {
  margin: 0 0 12px 0;
  padding: 0 0 0 20px;
}
li {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 6px 0;
  padding: 0;
}
strong {
  font-weight: bold;
}
em {
  font-style: italic;
}
span {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}
.h2 {
  page-break-before: always;
  break-before: page;
}
.page-break {
  page-break-before: always;
  break-before: page;
  display: block;
  height: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
@page {
  margin: 1in 0.75in;
}
</style>`;
}

export default getCss;
