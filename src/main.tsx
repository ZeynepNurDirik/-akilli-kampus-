import { StrictMode, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Hata Yakalayıcı (ErrorBoundary) Sınıfı.
 * React render veya mount sırasında oluşabilecek tüm JavaScript hatalarını
 * yakalar ve beyaz ekran yerine hata detaylarını ekranda görüntüler.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uygulama hatası yakalandı:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          fontFamily: 'monospace', 
          background: '#fef2f2', 
          color: '#991b1b', 
          border: '1px solid #fee2e2', 
          borderRadius: '8px', 
          margin: '20px', 
          textAlign: 'left' 
        }}>
          <h2>🚨 Uygulama Çalışma Zamanı Hatası (Runtime Error)</h2>
          <p><strong>Hata Mesajı:</strong> {this.state.error?.toString()}</p>
          <pre style={{ 
            background: '#fecaca', 
            padding: '20px', 
            borderRadius: '4px', 
            overflowX: 'auto', 
            whiteSpace: 'pre-wrap' 
          }}>
            {this.state.error?.stack}
          </pre>
          <p>Lütfen yukarıdaki hata çıktısını kopyalayıp asistana gönderin.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
