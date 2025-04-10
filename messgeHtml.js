export const messge = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      --primary: #2563eb;
      --primary-light: #dbeafe;
      --gray-light: #f1f5f9;
      --text: #1e293b;
      --text-light: #64748b;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: var(--text);
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background-color: #f8fafc;
    }
    .email-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .header {
      margin-bottom: 24px;
      text-align: center;
    }
    .header h1 {
      color: var(--primary);
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    .header p {
      color: var(--text-light);
      margin: 0;
      font-size: 15px;
    }
    .content-section {
      margin: 24px 0;
    }
    .highlight-box {
      background: var(--primary-light);
      padding: 20px;
      border-radius: 8px;
      margin: 24px 0;
    }
    .cta-button {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      margin: 16px 0;
      text-align: center;
    }
    .footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 12px 0;
    }
    .contact-icon {
      color: var(--primary);
    }
    .signature {
      font-weight: 600;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="email-card">
    <div class="header">
      <h1>Candidature pour Stage en Développement Full Stack</h1>
      <p>Mai 2025 - 2 mois | YouCode UM6P</p>
    </div>

    <div class="content-section">
      <p>Bonjour,</p>
      
      <p>Actuellement en formation à YouCode UM6P, je vous propose ma candidature pour un stage en développement web full stack d'une durée de deux mois à partir de mai 2025.</p>
    </div>

    <div class="highlight-box">
      <p>À travers ce stage, je souhaite :</p>
      <ul>
        <li>Appliquer mes connaissances techniques à des projets concrets</li>
        <li>Contribuer activement au développement de vos solutions</li>
        <li>M'enrichir de votre expertise et méthodologies professionnelles</li>
      </ul>
    </div>

    <div class="content-section">
      <p>Vous trouverez ci-joint mon CV détaillant mon parcours, mes compétences et les projets réalisés durant ma formation.</p>
      
      <p>Je serais ravi d'échanger avec vous pour discuter plus en détail de ma candidature et de la manière dont je pourrais m'intégrer à vos équipes.</p>
    </div>

    <center>
      <a href="mailto:ayoub.labite@gmail.com" class="cta-button">Planifier un entretien</a>
    </center>

    <div class="footer">
      <div class="signature">Cordialement,<br>Ayoub Labit</div>
      
      <div class="contact-item">
        <span class="contact-icon">📱</span>
        <span>+212 622-734781</span>
      </div>
      <div class="contact-item">
        <span class="contact-icon">✉️</span>
        <span>ayoub.labite@gmail.com</span>
      </div>
      <div class="contact-item">
        <span class="contact-icon">🏫</span>
        <span>YouCode - UM6P</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Version texte brut alternative
export const plainTextMessage = `
Objet : Candidature Stage Développement Full Stack - Mai 2025

Bonjour,

Actuellement en formation à YouCode UM6P, je vous soumets ma candidature pour un stage en développement web full stack de deux mois à partir de mai 2025.

À travers cette expérience, je souhaite :
- Appliquer mes connaissances techniques à des projets concrets
- Contribuer activement au développement de vos solutions
- M'enrichir de votre expertise professionnelle

Mon CV joint présente en détail mon parcours et mes réalisations. Je serais ravi d'échanger avec vous pour discuter de ma candidature.

Disponible pour un entretien à votre convenance.

Cordialement,
Ayoub Labit
+212 622-734781 | ayoub.labite@gmail.com
YouCode - UM6P
`