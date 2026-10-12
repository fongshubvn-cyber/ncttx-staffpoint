import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  setDoc,
  getDoc,
  runTransaction
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

/**
 * Lưu 1 phiếu ghi nhận / đánh giá mới lên Firestore sử dụng Transaction để đảm bảo
 * khi nhiều người cùng đánh giá cùng lúc không bao giờ bị ghi đè hay mất dữ liệu.
 */
export const saveIncidentAtomic = async (incident: any): Promise<boolean> => {
  if (!isFirebaseConfigured() || !incident || !incident.id) return false;
  try {
    const docRef = doc(db, 'ncttx_data', 'incidents');
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(docRef);
      let currentList: any[] = [];
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.payload)) {
          currentList = data.payload;
        }
      }

      // Kiểm tra xem incident đã tồn tại hay chưa
      const existingIdx = currentList.findIndex(item => item && item.id === incident.id);
      let updatedList: any[];
      if (existingIdx >= 0) {
        updatedList = [...currentList];
        updatedList[existingIdx] = incident;
      } else {
        updatedList = [incident, ...currentList];
      }

      transaction.set(docRef, {
        payload: updatedList,
        updatedAt: new Date().toISOString()
      });
    });
    updateCloudState('connected', null);
    return true;
  } catch (error: any) {
    console.error('Lỗi ghi incident atomic transaction:', error);
    updateCloudState('error', error?.message || String(error));
    return false;
  }
};

/**
 * Đồng bộ danh sách incidents lên Firestore với cơ chế Merge an toàn:
 * Không ghi đè mù quáng, mà lấy dữ liệu mới nhất trên Cloud rồi gộp với local.
 */
export const syncIncidentsToCloudAtomic = async (incidentsToSync: any[]): Promise<any[]> => {
  if (!isFirebaseConfigured() || !Array.isArray(incidentsToSync)) return incidentsToSync;
  try {
    const docRef = doc(db, 'ncttx_data', 'incidents');
    let finalMerged: any[] = incidentsToSync;
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(docRef);
      let cloudList: any[] = [];
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.payload)) {
          cloudList = data.payload;
        }
      }

      const map = new Map<string, any>();
      // 1. Đưa tất cả phiếu trên Cloud vào Map
      cloudList.forEach(item => {
        if (item && item.id) map.set(item.id, item);
      });

      // 2. Gộp phiếu từ máy local: ưu tiên trạng thái mới nhất
      incidentsToSync.forEach(localItem => {
        if (!localItem || !localItem.id) return;
        const cloudItem = map.get(localItem.id);
        if (!cloudItem) {
          // Cloud chưa có -> bổ sung thêm
          map.set(localItem.id, localItem);
        } else {
          // Cả 2 đều có -> giữ bản ghi có xóa/khôi phục mới hơn
          if (localItem.isDeleted && !cloudItem.isDeleted) {
            map.set(localItem.id, localItem);
          } else if (!localItem.isDeleted && cloudItem.isDeleted) {
            if (!localItem.deletedAt && cloudItem.deletedAt) {
              map.set(localItem.id, localItem);
            }
          } else {
            map.set(localItem.id, { ...cloudItem, ...localItem });
          }
        }
      });

      finalMerged = Array.from(map.values()).sort((a, b) => {
        const dateA = a.createdAt || a.date || a.id || '';
        const dateB = b.createdAt || b.date || b.id || '';
        return dateB.localeCompare(dateA);
      });

      transaction.set(docRef, {
        payload: finalMerged,
        updatedAt: new Date().toISOString()
      });
    });

    updateCloudState('connected', null);
    return finalMerged;
  } catch (error: any) {
    console.error('Lỗi syncIncidentsToCloudAtomic:', error);
    return incidentsToSync;
  }
};

