import { useState, useEffect, useMemo, useRef } from 'react';
import { AnnouncementPublisher } from './domain/AnnouncementPublisher';
import { Student, Teacher } from './domain/Users';
import { AnnouncementFactory } from './application/AnnouncementFactory';
import { NotificationFactory } from './application/NotificationFactory';
import { Logger } from './infrastructure/Logger';
import type { IObserver } from './domain/interfaces';
import './App.css';

interface LogEntry {
  id: string;
  text: string;
  type: 'system' | 'user' | 'info';
  time: string;
}

function App() {
  // 1. Persistent Subject (AnnouncementPublisher) oluşturma
  const publisher = useMemo(() => new AnnouncementPublisher(), []);

  // 2. React State Tanımlamaları
  const [subscribers, setSubscribers] = useState<IObserver[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Kullanıcı Kaydı Formu State'leri
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [notificationType, setNotificationType] = useState<'EMAIL' | 'SMS' | 'PUSH'>('EMAIL');

  // Duyuru Yönetimi Formu State'leri
  const [announcementType, setAnnouncementType] = useState<'EXAM' | 'EVENT'>('EXAM');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Terminal scroll kontrolü için ref
  const logEndRef = useRef<HTMLDivElement>(null);

  // 3. Konsol Loglarını Yakalama (Console Interceptor)
  useEffect(() => {
    const originalLog = console.log;
    
    console.log = (...args: any[]) => {
      // Orijinal logu tarayıcı konsoluna yazdır
      originalLog(...args);

      const messageText = args.join(' ');
      
      // Sadece bu uygulamaya ait olan logları filtrele
      const isRelevant = 
        messageText.includes('[Sistem Log') || 
        messageText.includes('şu duyuruyu aldı:') || 
        messageText.includes('kanalından') || 
        messageText.includes('nesnesi üretildi') ||
        messageText.includes('Abonelik sonlandırıldı') ||
        messageText.includes('sisteme kayıt oldu');

      if (isRelevant) {
        let type: 'system' | 'user' | 'info' = 'info';
        
        if (messageText.includes('[Sistem Log')) {
          type = 'system'; // Singleton Logger Çıktısı
        } else if (messageText.includes('şu duyuruyu aldı:')) {
          type = 'user'; // Observer Update Çıktısı
        } else if (messageText.includes('kanalından')) {
          type = 'info'; // Factory / Notification Çıktısı
        }

        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            text: messageText,
            type,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  // 4. Otomatik Başlangıç Verileri (Mock Veri) ve İlk Sistem Logu
  useEffect(() => {
    // Singleton Logger'ın ilk çağrımı
    Logger.getInstance().log("Akıllı Kampüs Bildirim Sistemi başarıyla başlatıldı.");

    // Hazır aboneleri kaydetme
    const initStudent1 = new Student("Ahmet Yılmaz", "SMS");
    const initTeacher1 = new Teacher("Prof. Dr. Zeynep Kaya", "EMAIL");
    const initStudent2 = new Student("Elif Demir", "PUSH");

    publisher.attach(initStudent1);
    publisher.attach(initTeacher1);
    publisher.attach(initStudent2);

    Logger.getInstance().log("Başlangıç kullanıcıları yüklendi ve yayıncıya abone edildi.");
    setSubscribers([initStudent1, initTeacher1, initStudent2]);
  }, [publisher]);

  // Terminalin en alta otomatik kayması
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // 5. Yeni Kullanıcı Kaydetme (Observer Ekleme)
  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let newObserver: IObserver;
    
    if (userType === 'STUDENT') {
      newObserver = new Student(name, notificationType);
    } else {
      newObserver = new Teacher(name, notificationType);
    }

    // Yayıncıya abone et (Observer Pattern - Attach)
    publisher.attach(newObserver);

    // Singleton Logger ile loglama
    Logger.getInstance().log(
      `Yeni ${userType === 'STUDENT' ? 'Öğrenci' : 'Öğretmen'} sisteme eklendi: "${name}" (${notificationType})`
    );

    // Listeyi güncelle
    setSubscribers([...subscribers, newObserver]);
    setName('');
  };

  // 6. Kullanıcı Aboneliğini İptal Etme (Observer Çıkarma)
  const handleUnsubscribeUser = (observer: IObserver) => {
    // Yayıncıdan aboneliği sil (Observer Pattern - Detach)
    publisher.detach(observer);

    // Singleton Logger ile loglama
    Logger.getInstance().log(`Abonelik sonlandırıldı: "${observer.name}"`);

    // Listeyi güncelle
    setSubscribers(subscribers.filter(sub => sub !== observer));
  };

  // 7. Duyuru Yayınlama Akışı (Publish Announcement)
  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    // A. Duyuruyu Fabrika (Factory Method) ile üret
    const announcement = AnnouncementFactory.createAnnouncement(announcementType, title, message);

    // B. Duyuruyu Yayıncı (Subject) üzerinden tüm gözlemcilere bildir (Observer Pattern - Notify)
    publisher.notify(announcement);

    // C. Her gözlemci için NotificationFactory ile somut bildirim sınıfları üreterek gönderim gerçekleştir
    subscribers.forEach((observer) => {
      const notificationService = NotificationFactory.createNotification(observer.notificationType);
      notificationService.send(announcement.message, observer.name);
    });

    // Formu temizle
    setTitle('');
    setMessage('');
  };

  return (
    <div className="app-container">
      {/* Üst Bilgi ve Tasarım Deseni Göstergeleri */}
      <header className="header">
        <div className="header-info">
          <h1>Akıllı Kampüs Duyuru Portalı</h1>
          <p>Observer, Factory Method ve Singleton Tasarım Desenlerinin Canlı Entegrasyonu</p>
        </div>
        <div className="pattern-badges">
          <div className="pattern-badge observer">
            <span>🟣</span> Observer Pattern
          </div>
          <div className="pattern-badge factory">
            <span>🟢</span> Factory Method
          </div>
          <div className="pattern-badge singleton">
            <span>🔵</span> Singleton Pattern
          </div>
        </div>
      </header>

      {/* Ana Grid Yapısı */}
      <div className="dashboard-grid">
        
        {/* SOL KOLON: Kullanıcı Kayıt & Aktif Aboneler */}
        <div className="card">
          <h2><span>👥</span> Kullanıcı Kaydı & Abonelik</h2>
          
          <form onSubmit={handleRegisterUser}>
            <div className="form-group">
              <label>Ad Soyad</label>
              <input 
                type="text" 
                placeholder="Örn: Mehmet Can"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Kullanıcı Tipi</label>
              <select 
                value={userType} 
                onChange={(e) => setUserType(e.target.value as 'STUDENT' | 'TEACHER')}
              >
                <option value="STUDENT">🎓 Öğrenci</option>
                <option value="TEACHER">👨‍🏫 Öğretmen</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tercih Edilen Bildirim Kanalı</label>
              <select 
                value={notificationType} 
                onChange={(e) => setNotificationType(e.target.value as 'EMAIL' | 'SMS' | 'PUSH')}
              >
                <option value="EMAIL">📧 E-Posta</option>
                <option value="SMS">💬 SMS</option>
                <option value="PUSH">🔔 Push Bildirim</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Kullanıcıyı Kaydet ve Abone Et
            </button>
          </form>

          {/* Aktif Aboneler Listesi */}
          <h3 style={{ marginTop: '30px', marginBottom: '15px', color: 'var(--text-h)' }}>
            Aktif Aboneler ({subscribers.length})
          </h3>
          {subscribers.length === 0 ? (
            <p className="empty-state">Sisteme kayıtlı aktif abone bulunmuyor.</p>
          ) : (
            <div className="subscriber-list">
              {subscribers.map((sub, index) => {
                const isStudent = sub instanceof Student;
                return (
                  <div key={index} className="subscriber-item">
                    <div className="subscriber-info">
                      <span>{isStudent ? '🎓' : '👨‍🏫'}</span>
                      <div>
                        <strong style={{ color: 'var(--text-h)', display: 'block' }}>{sub.name}</strong>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <span className={`badge ${isStudent ? 'student' : 'teacher'}`}>
                            {isStudent ? 'Öğrenci' : 'Öğretmen'}
                          </span>
                          <span className="badge channel">{sub.notificationType}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleUnsubscribeUser(sub)}
                      className="btn btn-danger"
                    >
                      İptal Et
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SAĞ KOLON: Duyuru Yönetimi */}
        <div className="card">
          <h2><span>📢</span> Duyuru Yönetim Paneli</h2>
          
          <form onSubmit={handlePublishAnnouncement}>
            <div className="form-group">
              <label>Duyuru Tipi</label>
              <select 
                value={announcementType} 
                onChange={(e) => setAnnouncementType(e.target.value as 'EXAM' | 'EVENT')}
              >
                <option value="EXAM">📝 Sınav Duyurusu</option>
                <option value="EVENT">🎉 Etkinlik Duyurusu</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duyuru Başlığı</label>
              <input 
                type="text" 
                placeholder="Örn: Matematik Ara Sınav Tarihleri"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Duyuru Mesajı</label>
              <textarea 
                rows={3} 
                placeholder="Duyuru detaylarını buraya yazın..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={subscribers.length === 0}>
              {subscribers.length === 0 ? 'Duyuru Yayınlamak için Abone Gerekli' : 'Duyuruyu Yayınla (Publish)'}
            </button>
          </form>
        </div>
      </div>

      {/* ALT ALAN: Canlı Sistem Logları & Terminal Görünümü */}
      <div className="card" style={{ gridColumn: 'span 2' }}>
        <div className="console-header">
          <div className="console-title">
            <span style={{ fontSize: '16px' }}>💻</span> Canlı Sistem Logları & Bildirim Paneli
          </div>
          <button 
            onClick={() => setLogs([])}
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Terminali Temizle
          </button>
        </div>
        
        <div className="console-panel">
          {logs.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>
              Sistem dinleniyor... Herhangi bir kullanıcı kaydettiğinizde veya duyuru yayınladığınızda Singleton Logger, Factory ve Observer tetiklenmelerini burada canlı olarak göreceksiniz.
            </p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="console-row">
                <span className="console-time">[{log.time}]</span>
                <span className={`console-text ${log.type}`}>
                  {log.text}
                </span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
