import axios from 'axios';

export async function addUser(userId, userData, authToken) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/internship-2025-465209/databases/dawood/documents/user/${userId}`;
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const data = {
      fields: {
        createdAt: { timestampValue: userData.createdAt.toISOString() },
        Name: { stringValue: `${userData.firstName} ${userData.lastName}` },
        Role: { stringValue: 'user' },
        uID: { stringValue: userId },
      },
    };
    await axios.patch(url, data, { headers });
  } catch (error) {
    console.error('Error adding userdata:', error);
    throw error;
  }
}

export async function addMail(mailData, authToken) {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/internship-2025-465209/databases/dawood/documents/mail`;
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const data = {
      fields: {
        to: { stringValue: mailData.to },
        subject: { stringValue: mailData.subject },
        message: {
          mapValue: {
            fields: {
              text: { stringValue: mailData.message.text },
              html: { stringValue: mailData.message.html },
            },
          },
        },
        createdAt: { timestampValue: mailData.createdAt.toISOString() },
      },
    };
    await axios.post(url, data, { headers });
  } catch (error) {
    console.error('Error adding mail data:', error);
    throw error;
  }
}
