import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc,
  getDoc
} from 'firebase/firestore';

// ----------------------------------------------------------------------
// CẤU HÌNH FIREBASE - Dán đoạn mã firebaseConfig của bạn vào đây:
// (Lấy từ Firebase Console -> Project Settings -> General -> Your apps)
// ----------------------------------------------------------------------
export const firebaseConfig = {
  apiKey: "AIzaSyAqeRWX9Wdnntw6BhI_nC1JTpvMAWezMEU",
  authDomain: "ncttx-staff.firebaseapp.com",
  projectId: "ncttx-staff",
  storageBucket: "ncttx-staff.firebasestorage.app",
  messagingSenderId: "506324308970",
  appId: "1:506324308970:web:fb438644bd0bd6b88c5893",
  measurementId: "G-0ZXSRSMVGC"
};

// Khởi tạo Firebase App & Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type CloudSyncState = 'connecting' | 'connected' | 'error';
export let globalCloudState: { status: CloudSyncState; errorDetails: string | null } = {
  status: 'connecting',
  errorDetails: null
};

const listeners: Array<(state: typeof globalCloudState) => void> = [];

export const onCloudStateChange = (callback: (state: typeof globalCloudState) => void) => {
  listeners.push(callback);
  callback(globalCloudState);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx >= 0) listeners.splice(idx, 1);
  };
};

function updateCloudState(status: CloudSyncState, errorDetails: string | null = null) {
  globalCloudState = { status, errorDetails };
  listeners.forEach(cb => cb(globalCloudState));
}

// Kiểm tra xem Firebase đã được điền API key thật chưa
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig.apiKey !== "AIzaSyYOUR_API_KEY_HERE" &&
    Boolean(firebaseConfig.projectId) &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY")
  );
};

/**
 * Lắng nghe dữ liệu thời gian thực (Realtime Sync) từ Firestore
 */
export const subscribeToCollection = (
  docName: string, 
  callback: (data: any) => void,
  initialFallback?: any
) => {
  if (!isFirebaseConfigured()) {
    updateCloudState('error', 'Chưa cấu hình API Key Firebase');
    return () => {};
  }
  
  const docRef = doc(db, 'ncttx_data', docName);
  return onSnapshot(docRef, (snapshot) => {
    updateCloudState('connected', null);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && data.payload) {
        callback(data.payload);
      }
    } else if (initialFallback) {
      // Auto seed initial data to Cloud if empty
      saveToCloud(docName, initialFallback);
      callback(initialFallback);
    }
  }, (error: any) => {
    console.error(`Lỗi kết nối Firestore Cloud (${docName}):`, error);
    const errMessage = error?.message || String(error);
    if (errMessage.includes('permission-denied') || errMessage.includes('Missing or insufficient permissions')) {
      updateCloudState('error', 'Cần bật quy tắc "allow read, write: if true;" trên Firebase Console -> Firestore Database -> Rules');
    } else {
      updateCloudState('error', errMessage);
    }
  });
};

/**
 * Tải trực tiếp dữ liệu mới nhất từ Firestore Cloud (Refresh Cloud Data)
 */
export const fetchDocFromCloud = async (docName: string) => {
  if (!isFirebaseConfigured()) return null;
  try {
    const docRef = doc(db, 'ncttx_data', docName);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && data.payload) {
        return data.payload;
      }
    }
    return null;
  } catch (error) {
    console.error(`Lỗi tải trực tiếp từ Cloud (${docName}):`, error);
    return null;
  }
};

/**
 * Gửi dữ liệu cập nhật lên Firestore
 */
export const saveToCloud = async (docName: string, data: any) => {
  if (!isFirebaseConfigured()) return;
  try {
    const docRef = doc(db, 'ncttx_data', docName);
    await setDoc(docRef, { payload: data, updatedAt: new Date().toISOString() });
    updateCloudState('connected', null);
  } catch (error: any) {
    console.error(`Lỗi ghi dữ liệu Cloud Firestore (${docName}):`, error);
    const errMessage = error?.message || String(error);
    if (errMessage.includes('permission-denied') || errMessage.includes('Missing or insufficient permissions')) {
      updateCloudState('error', 'Lỗi ghi Firestore: Thiếu quyền. Mở Firebase Console -> Firestore Database -> Rules chọn "allow read, write: if true;"');
      alert(`⚠️ Không thể lưu lên Đám mây (Firebase Permission Denied):\nFirebase của dự án đang chặn quyền ghi dữ liệu.\nVui lòng vào Firebase Console -> Firestore Database -> Rules và sửa thành:\n\nallow read, write: if true;`);
    } else {
      updateCloudState('error', errMessage);
    }
  }
};

