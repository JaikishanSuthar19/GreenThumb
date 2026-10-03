const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let bucket = null;
let firebaseInitialized = false;

try {
  // Check for service account path or inline environment variables
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  let credential = null;

  if (serviceAccountPath && fs.existsSync(path.resolve(serviceAccountPath))) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    credential = admin.credential.cert(serviceAccount);
  } else if (projectId && clientEmail && privateKey) {
    credential = admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  if (credential) {
    admin.initializeApp({
      credential,
      storageBucket: storageBucket || `${projectId}.appspot.com`,
    });
    bucket = admin.storage().bucket();
    firebaseInitialized = true;
    console.log('🔥 Firebase Admin & Storage initialized successfully');
  } else {
    console.log('ℹ️ Firebase credentials not provided in .env - file uploads will use local media storage fallback (/uploads)');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization warning:', error.message);
  console.log('ℹ️ Operating in local storage mode for media uploads');
}

/**
 * Upload a file buffer to Firebase Storage or local fallback
 * @param {Object} file - Multer file object
 * @param {string} folder - Destination folder
 * @returns {Promise<string>} Public URL of the uploaded image
 */
const uploadToFirebaseStorage = async (file, folder = 'plants') => {
  if (firebaseInitialized && bucket) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const destination = `${folder}/${uniqueSuffix}${extension}`;
    const fileUpload = bucket.file(destination);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        console.error('Firebase Storage upload error:', err);
        reject(err);
      });

      stream.on('finish', async () => {
        try {
          // Make public or generate signed url / get public URL
          await fileUpload.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
          resolve(publicUrl);
        } catch (pubErr) {
          // Fallback to getSignedUrl if bucket has Uniform Bucket-Level Access
          try {
            const [signedUrl] = await fileUpload.getSignedUrl({
              action: 'read',
              expires: '03-17-2035',
            });
            resolve(signedUrl);
          } catch (signErr) {
            reject(pubErr);
          }
        }
      });

      stream.end(file.buffer);
    });
  }

  // Fallback: If not configured, save buffer to /uploads folder and return server URL
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${folder}-${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
  const localFilePath = path.join(uploadDir, filename);

  if (file.buffer) {
    fs.writeFileSync(localFilePath, file.buffer);
  }

  // URL returned is relative or absolute backend URL
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${filename}`;
};

module.exports = {
  admin,
  bucket,
  firebaseInitialized,
  uploadToFirebaseStorage,
};
