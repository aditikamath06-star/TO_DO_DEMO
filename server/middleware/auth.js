const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

if (!getApps().length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    // Check if the key is base64 encoded
    if (!privateKey.includes('BEGIN PRIVATE KEY')) {
      privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
    } else {
      // Fallback for standard string formatting
      privateKey = privateKey.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n');
    }
  }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
  });
}

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;