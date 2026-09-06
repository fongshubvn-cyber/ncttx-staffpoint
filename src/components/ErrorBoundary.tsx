import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EDEAE3] flex items-center justify-center p-4 text-[#2D3748] font-sans">
          <div className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full text-center space-y-4 border border-rose-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center text-3xl font-black">
              ⚠️
            </div>
            <h2 className="text-lg font-black font-heading text-[#1B4332]">
              Đã xảy ra sự cố hiển thị!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Hệ thống vừa gặp gián đoạn nhỏ khi xử lý dữ liệu. Vui lòng bấm nút bên dưới để tải lại trang.
            </p>
            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-left text-[11px] font-mono text-rose-800 break-all">
              {this.state.error?.message || 'Lỗi không xác định'}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 rounded-2xl bg-[#2D6A4F] text-white font-extrabold text-xs shadow-md hover:bg-[#1B4332] transition-all"
            >
              🔄 Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
