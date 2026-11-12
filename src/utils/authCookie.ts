import { AuthUser } from '../types';

export const USER_AUTH_KEY = 'ncttx_current_user';
export const REMEMBERED_ID_KEY = 'ncttx_remembered_id';
export const REMEMBER_ME_FLAG = 'ncttx_remember_me_flag';

// 100 years in seconds (3,153,600,000s) = Trọn đời
const LIFETIME_SECONDS = 3153600000;

/**
 * Lưu cookie vĩnh viễn (100 năm)
 */
export function setLifetimeCookie(name: string, value: string): void {
  try {
    const encodedValue = encodeURIComponent(value);
    const expiresDate = new Date();
    expiresDate.setFullYear(expiresDate.getFullYear() + 100);
    document.cookie = `${name}=${encodedValue}; max-age=${LIFETIME_SECONDS}; expires=${expiresDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (e) {
    console.error('Lỗi khi ghi cookie trọn đời:', e);
  }
}

/**
 * Đọc cookie theo tên
 */
export function getCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Xóa cookie
 */
export function deleteCookie(name: string): void {
  try {
    document.cookie = `${name}=; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  } catch (e) {
    console.error('Lỗi khi xóa cookie:', e);
  }
}

/**
 * Đọc thông tin phiên đăng nhập từ LocalStorage hoặc Cookie trọn đời
 * Tự động đối soát và phục hồi chéo nếu một trong hai bên bị xoá cache
 */
export function getPersistedAuthUser(): AuthUser | null {
  try {
    // 1. Kiểm tra LocalStorage trước
    const localData = localStorage.getItem(USER_AUTH_KEY);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed && parsed.id) {
        // Đồng bộ ngược lại sang Cookie nếu cookie bị thiếu
        if (!getCookie(USER_AUTH_KEY)) {
          setLifetimeCookie(USER_AUTH_KEY, localData);
        }
        return parsed;
      }
    }

    // 2. Nếu LocalStorage bị xóa (hoặc Safari xóa sau 7 ngày), phục hồi từ Cookie trọn đời
    const cookieData = getCookie(USER_AUTH_KEY);
    if (cookieData) {
      const parsed = JSON.parse(cookieData);
      if (parsed && parsed.id) {
        // Phục hồi lại vào LocalStorage
        localStorage.setItem(USER_AUTH_KEY, cookieData);
        return parsed;
      }
    }
  } catch (e) {
    console.error('Lỗi khi khôi phục thông tin đăng nhập trọn đời:', e);
  }
  return null;
}

/**
 * Lưu thông tin đăng nhập vào cả 2 tầng: LocalStorage VÀ Cookie trọn đời (100 năm)
 */
export function savePersistedAuthUser(user: AuthUser | null, rememberMe: boolean = true): void {
  try {
    if (user && user.id) {
      const userStr = JSON.stringify(user);
      localStorage.setItem(USER_AUTH_KEY, userStr);
      localStorage.setItem(REMEMBER_ME_FLAG, rememberMe ? 'true' : 'false');

      // Luôn ghi nhớ ID đã đăng nhập để lần sau tự điền
      localStorage.setItem(REMEMBERED_ID_KEY, user.id);
      setLifetimeCookie(REMEMBERED_ID_KEY, user.id);

      if (rememberMe) {
        // Lưu Cookie trọn đời
        setLifetimeCookie(USER_AUTH_KEY, userStr);
      } else {
        deleteCookie(USER_AUTH_KEY);
      }
    } else {
      // Khi bấm Đăng xuất rõ ràng: xóa phiên
      localStorage.removeItem(USER_AUTH_KEY);
      deleteCookie(USER_AUTH_KEY);
      // Vẫn giữ lại REMEMBERED_ID_KEY để lần sau mở form không cần gõ lại mã nhân viên
    }
  } catch (e) {
    console.error('Lỗi khi lưu thông tin đăng nhập trọn đời:', e);
  }
}

/**
 * Lấy mã nhân viên đã được ghi nhớ gần nhất để điền sẵn vào ô đăng nhập
 */
export function getRememberedUserId(): string {
  try {
    const fromLocal = localStorage.getItem(REMEMBERED_ID_KEY);
    if (fromLocal) return fromLocal;
    const fromCookie = getCookie(REMEMBERED_ID_KEY);
    if (fromCookie) return fromCookie;
  } catch (e) {}
  return '';
}

