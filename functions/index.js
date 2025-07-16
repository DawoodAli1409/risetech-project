const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore(admin.firestore().app, {
  databaseId: "dawood"
});

// Configure your SMTP transporter using environment variables
const transporter = nodemailer.createTransport({
  host: functions.config().smtp.host,
  port: functions.config().smtp.port,
  secure: functions.config().smtp.secure === "true", // true for 465, false for other ports
  auth: {
    user: functions.config().smtp.user,
    pass: functions.config().smtp.pass,
  },
});

// Scheduled Cloud Function to send unsent emails from "dawood" database mail collection
exports.scheduledSendEmails = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    const mailCollection = db.collection('mail');
    const unsentQuery = mailCollection.where('sent', '==', false).limit(10);

    try {
      const snapshot = await unsentQuery.get();

      if (snapshot.empty) {
        console.log('No unsent emails found.');
        return null;
      }

      const batch = db.batch();

      for (const doc of snapshot.docs) {
        const mailData = doc.data();

        const mailOptions = {
          from: `"Your App Name" <${functions.config().smtp.user}>`,
          to: mailData.to,
          subject: mailData.subject,
          text: mailData.message.text,
          html: mailData.message.html,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('Email sent to:', mailData.to);

          // Mark email as sent
          batch.update(doc.ref, { sent: true, sentAt: admin.firestore.FieldValue.serverTimestamp() });
        } catch (error) {
          console.error('Error sending email to', mailData.to, error);
        }
      }

      await batch.commit();
    } catch (error) {
      console.error('Error querying unsent emails:', error);
    }

    return null;
  });
