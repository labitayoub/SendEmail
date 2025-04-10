import "dotenv/config";
import nodemailer from "nodemailer";
import { messge } from "./messgeHtml.js";
import fs from 'fs';

// Définir ici votre liste d'emails destinataires
// Vous pouvez les lire depuis un fichier CSV ou les définir directement
const customerEmails = [
  "contact.legende@gmail.com",
  "ayoub.labite@gmail.com",
  // Ajoutez plus d'emails selon vos besoins
];

// Vous pouvez également lire les emails depuis un fichier CSV
// Décommentez et modifiez le code ci-dessous pour l'utiliser
/*
function loadEmailsFromCSV() {
  try {
    const data = fs.readFileSync('emails.csv', 'utf8');
    return data.split('\n')
      .map(line => line.trim())
      .filter(line => line && line.includes('@'));
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier CSV:', error);
    return [];
  }
}

// Utiliser cette fonction pour charger les emails
// const customerEmails = loadEmailsFromCSV();
*/

// Limites précises pour Gmail (100 emails par heure)
const GMAIL_LIMITS = {
  HOURLY_LIMIT: 100,
  EMAILS_PER_BATCH: 10,  // 10 emails par lot
  MIN_DELAY: 2000,        // 2 secondes entre chaque email
  BATCH_DELAY: 5000,      // 5 secondes entre chaque lot
  HOURLY_RESET_TIME: 3600000, // 1 heure en millisecondes
  SAFETY_BUFFER: 5,       // Marge de sécurité
};

// Fonction pour formater le temps en HH:MM:SS
function formatTime(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Fonction de compte à rebours visuel
async function countdown(milliseconds, message) {
  const startTime = Date.now();
  const endTime = startTime + milliseconds;

  while (Date.now() < endTime) {
    const remaining = endTime - Date.now();
    const percent = ((milliseconds - remaining) / milliseconds) * 100;
    const barLength = 30;
    const filledLength = Math.round((barLength * percent) / 100);
    const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);

    process.stdout.write(`\r${message} [${bar}] ${formatTime(remaining)} remaining`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mise à jour chaque seconde
  }
  console.log('\n'); // Nouvelle ligne après la fin du compte à rebours
}

// Fonction de barre de progression
function updateProgressBar(current, total, emailsSent) {
  const timePercent = Math.round((current / total) * 100);
  const timeFilledLength = Math.round(50 * current / total);
  const timeBar = '█'.repeat(timeFilledLength) + '░'.repeat(50 - timeFilledLength);

  const emailPercent = Math.round((emailsSent / total) * 100);
  const emailFilledLength = Math.round(50 * emailsSent / total);
  const emailBar = '█'.repeat(emailFilledLength) + '░'.repeat(50 - emailFilledLength);

  process.stdout.write(`\r[Time: ${timeBar}] ${timePercent}% | Progress: ${current}/${total}\n`);
  process.stdout.write(`[Emails: ${emailBar}] ${emailPercent}% | Sent: ${emailsSent}/${total}`);
}

// Vérification des variables d'environnement nécessaires
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error("⚠️ Les variables d'environnement EMAIL_USER et EMAIL_PASSWORD doivent être définies dans le fichier .env");
  process.exit(1);
}

// Vérification de l'existence du fichier CV
// Modifiez le nom du fichier CV selon le nom réel de votre fichier
const cvPath = "cv/CV_Ayoub_Labit.pdf";
if (!fs.existsSync(cvPath)) {
  console.error(`⚠️ Le fichier CV "${cvPath}" n'existe pas. Vérifiez le nom du fichier et son emplacement.`);
  console.error("💡 Conseil: Placez votre fichier CV à la racine du projet et mettez à jour la variable 'cvPath' si nécessaire.");
  process.exit(1);
}

// Configuration du transporteur nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  pool: true,
  maxConnections: 1,
  rateDelta: 1000,
  rateLimit: 1,
  maxMessages: GMAIL_LIMITS.HOURLY_LIMIT - GMAIL_LIMITS.SAFETY_BUFFER,
});

// Classe pour suivre l'envoi des emails
class EmailTracker {
  constructor() {
    this.sentEmails = [];
    this.currentHourStart = Date.now();
    this.lastSendTime = null;
  }

  recordSend() {
    const now = Date.now();
    this.sentEmails.push(now);
    this.lastSendTime = now;
    this.cleanup();
  }

  cleanup() {
    const hourAgo = Date.now() - GMAIL_LIMITS.HOURLY_RESET_TIME;
    this.sentEmails = this.sentEmails.filter(time => time > hourAgo);
  }

  getCurrentHourCount() {
    this.cleanup();
    return this.sentEmails.length;
  }

  canSendMore() {
    const currentCount = this.getCurrentHourCount();
    return currentCount < (GMAIL_LIMITS.HOURLY_LIMIT - GMAIL_LIMITS.SAFETY_BUFFER);
  }

  getTimeUntilNextSlot() {
    if (this.sentEmails.length === 0) return 0;
    const oldestTimestamp = this.sentEmails[0];
    return (oldestTimestamp + GMAIL_LIMITS.HOURLY_RESET_TIME) - Date.now();
  }

  getMinimumWaitTime() {
    if (!this.lastSendTime) return 0;
    const timeSinceLastSend = Date.now() - this.lastSendTime;
    return Math.max(0, GMAIL_LIMITS.MIN_DELAY - timeSinceLastSend);
  }
}

const emailTracker = new EmailTracker();

// Fonction d'envoi d'un email
async function sendEmail(email) {
  try {
    await transporter.verify();

    // Création d'un ID unique pour chaque email
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const info = await transporter.sendMail({
      from: {
        name: "Ayoub Labit",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Candidature pour un stage en développement web full stack",
      html: messge,
      headers: {
        'Precedence': 'bulk',
        'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
        'X-Entity-Ref-ID': uniqueId,
      },


attachments: [
  {
    filename: "CV_Ayoub_Labit.pdf", // Nom affiché au destinataire
    path: cvPath, // Chemin vers le fichier réel sur votre système
    contentType: "application/pdf"
  }
]
    });

    emailTracker.recordSend();
    return { success: true, info };
  } catch (error) {
    if (error.responseCode === 421 || error.responseCode === 450 || 
        error.message.includes('rate') || error.message.includes('limit')) {
      throw new Error(`Rate limit reached: ${error.message}`);
    }
    throw error;
  }
}

// Fonction principale d'envoi de tous les emails
async function sendEmails() {
  // Vérifier que la liste d'emails n'est pas vide
  if (customerEmails.length === 0) {
    console.error("⚠️ La liste d'emails est vide. Veuillez ajouter des destinataires.");
    process.exit(1);
  }

  console.log("\n🚀 Démarrage de l'envoi des candidatures...\n");
  console.log(`📊 Informations sur la campagne :`);
  console.log(`📧 Nombre total d'emails à envoyer: ${customerEmails.length}`);
  console.log(`👤 Expéditeur: Ayoub Labit (${process.env.EMAIL_USER})`);
  console.log(`📄 Pièce jointe: ${cvPath}`);
  console.log(`\n⏳ Démarrage dans 3 secondes...`);
  
  await new Promise(resolve => setTimeout(resolve, 3000));

  const stats = {
    total: customerEmails.length,
    sent: 0,
    failed: 0,
    rateLimit: 0,
    startTime: Date.now()
  };

  // Traitement par lots
  for (let i = 0; i < customerEmails.length; i += GMAIL_LIMITS.EMAILS_PER_BATCH) {
    const batch = customerEmails.slice(i, i + GMAIL_LIMITS.EMAILS_PER_BATCH);
    console.log(`\n📦 Traitement du lot ${Math.floor(i/GMAIL_LIMITS.EMAILS_PER_BATCH) + 1}/${Math.ceil(customerEmails.length/GMAIL_LIMITS.EMAILS_PER_BATCH)}`);
    
    // Traitement des emails dans le lot actuel
    for (const email of batch) {
      try {
        console.log(`📤 Envoi à ${email}...`);
        await sendEmail(email);
        stats.sent++;
        console.log(`✅ Email envoyé avec succès à ${email}`);
        updateProgressBar(i + batch.indexOf(email) + 1, stats.total, stats.sent);
      } catch (error) {
        if (error.message.includes('Rate limit')) {
          stats.rateLimit++;
          const waitTimeMs = 65 * 60 * 1000; // 65 minutes
          console.log('\n🚫 Limite de taux atteinte. Attente avec compte à rebours...');
          await countdown(waitTimeMs, '⏳ Attente de la fin de la limite');
          
          // Réessayer l'envoi après l'attente
          try {
            await sendEmail(email);
            stats.sent++;
            updateProgressBar(i + batch.indexOf(email) + 1, stats.total, stats.sent);
            console.log('✨ Reprise réussie après l\'attente de la limite de taux!');
          } catch (retryError) {
            stats.failed++;
            console.error(`❌ Erreur lors de l'envoi à ${email} après l'attente: ${retryError.message}`);
          }
        } else {
          stats.failed++;
          console.error(`\n❌ Erreur lors de l'envoi à ${email}: ${error.message}`);
        }
        updateProgressBar(i + batch.indexOf(email) + 1, stats.total, stats.sent);
      }

      // Petit délai entre chaque email
      await countdown(GMAIL_LIMITS.MIN_DELAY, '⏱️ Prochain email dans');
    }

    // Si ce n'est pas le dernier lot, ajouter un délai entre les lots
    if (i + GMAIL_LIMITS.EMAILS_PER_BATCH < customerEmails.length) {
      console.log('\n⏳ Début du temps d\'attente entre les lots...');
      await countdown(GMAIL_LIMITS.BATCH_DELAY, '⏳ Attente entre les lots');
    }
  }

  // Résumé final
  const duration = (Date.now() - stats.startTime) / 60000;
  console.log("\n📊 Résumé de la campagne:");
  console.log(`⏱️  Durée: ${Math.round(duration)} minutes`);
  console.log(`📧 Envoyés avec succès: ${stats.sent}/${stats.total}`);
  console.log(`❌ Échecs: ${stats.failed}`);
  console.log(`🚫 Limites de taux atteintes: ${stats.rateLimit}`);
  console.log(`✨ Taux de réussite: ${((stats.sent / stats.total) * 100).toFixed(1)}%\n`);
}

// Gestion des erreurs
sendEmails().catch(error => {
  console.error("\n💥 La campagne a échoué:", error);
  process.exit(1);
});