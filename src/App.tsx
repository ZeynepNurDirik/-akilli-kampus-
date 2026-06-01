import { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { AnnouncementPublisher } from './domain/AnnouncementPublisher';
import { Student, Teacher } from './domain/Users';
import { AnnouncementFactory } from './application/AnnouncementFactory';
import { NotificationFactory } from './application/NotificationFactory';
import { DeadlineNotifier } from './application/DeadlineNotifier';
import { Logger } from './infrastructure/Logger';
import type { IObserver, IAnnouncement } from './domain/interfaces';
import './App.css';

interface LogEntry {
  id: string;
  text: string;
  type: 'system' | 'user' | 'info';
  time: string;
}

// ----------------------------------------------------
// 1. DASHBOARD BİLEŞENİ (/)
// ----------------------------------------------------
interface DashboardProps {
  subscribers: IObserver[];
  announcements: IAnnouncement[];
}

function Dashboard({ subscribers, announcements }: DashboardProps) {
  const studentCount = subscribers.filter(s => s instanceof Student).length;
  const teacherCount = subscribers.filter(s => s instanceof Teacher).length;
  const deadlineCount = announcements.filter(a => a.targetDate).length;

  return (
    <div>
      <div className="page-header">
        <h1>📊 Kampüs Genel Durum Özeti</h1>
        <p>Sistem genelindeki istatistikler ve aktif kullanılan tasarım desenleri</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-label">Toplam Abone</span>
            <span className="stat-value">{subscribers.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-info">
            <span className="stat-label">Aktif Öğrenci</span>
            <span className="stat-value">{studentCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-info">
            <span className="stat-label">Aktif Öğretmen</span>
            <span className="stat-value">{teacherCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-info">
            <span className="stat-label">Toplam Duyuru</span>
            <span className="stat-value">{announcements.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <span className="stat-label">Son Tarihli</span>
            <span className="stat-value">{deadlineCount}</span>
          </div>
        </div>
      </div>

      {/* Tasarım Desenleri Anlatım Paneli */}
      <div className="card">
        <h2>🛠️ Aktif Mimari Tasarım Desenleri (Design Patterns)</h2>
        <div className="patterns-overview-card">
          <div className="pattern-desc-item observer">
            <div>
              <div className="pattern-desc-title">🟣 Gözlemci Deseni (Observer Pattern)</div>
              <div className="pattern-desc-text">
                Duyurular yayınlandığında tüm kayıtlı gözlemciler (Student ve Teacher) tek bir <code>notify()</code> çağrısı ile otomatik olarak bilgilendirilir. Gözlemciler yayından dinamik olarak çıkarılabilir (<code>detach</code>).
              </div>
            </div>
          </div>

          <div className="pattern-desc-item factory">
            <div>
              <div className="pattern-desc-title">🟢 Fabrika Metodu Deseni (Factory Method)</div>
              <div className="pattern-desc-text">
                Kullanıcıların çoklu tercih bildirim kanalları (Email, SMS, Push) ve farklı duyuru türleri (Sınav, Etkinlik, Ödev Teslimi) doğrudan somut sınıflara bağımlı olmadan <code>NotificationFactory</code> ve <code>AnnouncementFactory</code> üzerinden üretilir.
              </div>
            </div>
          </div>

          <div className="pattern-desc-item singleton">
            <div>
              <div className="pattern-desc-title">🔵 Tekil Nesne Deseni (Singleton Pattern)</div>
              <div className="pattern-desc-text">
                Sistemdeki tüm üretim, kayıt ve gönderim hareketleri tek bir global örneğe (instance) sahip olan <code>Logger</code> sınıfı üzerinden izlenir ve loglanır.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. KULLANICILAR BİLEŞENİ (/kullanicilar)
// ----------------------------------------------------
interface UsersPageProps {
  subscribers: IObserver[];
  onAddSubscriber: (name: string, type: 'STUDENT' | 'TEACHER', channels: ('EMAIL' | 'SMS' | 'PUSH')[]) => void;
  onRemoveSubscriber: (sub: IObserver) => void;
}

function UsersPage({ subscribers, onAddSubscriber, onRemoveSubscriber }: UsersPageProps) {
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  
  // Çoklu Seçim Kanalları State
  const [channels, setChannels] = useState<{ EMAIL: boolean; SMS: boolean; PUSH: boolean }>({
    EMAIL: true,
    SMS: false,
    PUSH: false
  });

  const handleCheckboxChange = (key: 'EMAIL' | 'SMS' | 'PUSH') => {
    setChannels(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Seçilen kanalları filtreleyip diziye aktarma
    const selectedChannels: ('EMAIL' | 'SMS' | 'PUSH')[] = [];
    if (channels.EMAIL) selectedChannels.push('EMAIL');
    if (channels.SMS) selectedChannels.push('SMS');
    if (channels.PUSH) selectedChannels.push('PUSH');

    onAddSubscriber(name, userType, selectedChannels);
    
    // Formu temizle
    setName('');
    setChannels({ EMAIL: true, SMS: false, PUSH: false });
  };

  return (
    <div className="dashboard-grid">
      {/* Kullanıcı Ekleme Formu */}
      <div className="card">
        <h2><span>👥</span> Yeni Kullanıcı Kaydı (Çoklu Bildirim)</h2>
        <form onSubmit={handleSubmit}>
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
            <label>Kullanıcı Rolü</label>
            <select 
              value={userType} 
              onChange={(e) => setUserType(e.target.value as 'STUDENT' | 'TEACHER')}
            >
              <option value="STUDENT">🎓 Öğrenci</option>
              <option value="TEACHER">👨‍🏫 Öğretmen</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bildirim Kanalları (Birden Fazla Seçilebilir)</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={channels.EMAIL}
                  onChange={() => handleCheckboxChange('EMAIL')}
                />
                📧 E-Posta
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={channels.SMS}
                  onChange={() => handleCheckboxChange('SMS')}
                />
                💬 SMS
              </label>
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={channels.PUSH}
                  onChange={() => handleCheckboxChange('PUSH')}
                />
                🔔 Push
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            Kullanıcıyı Kaydet ve Abone Et
          </button>
        </form>
      </div>

      {/* Aktif Abone Listesi */}
      <div className="card">
        <h2><span>📋</span> Aktif Aboneler Listesi</h2>
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
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span className={`badge ${isStudent ? 'student' : 'teacher'}`}>
                          {isStudent ? 'Öğrenci' : 'Öğretmen'}
                        </span>
                        {sub.notificationTypes.map((channel, i) => (
                          <span key={i} className="badge channel">{channel}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemoveSubscriber(sub)}
                    className="btn btn-danger"
                  >
                    Kaldır
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. DUYURULAR BİLEŞENİ (/duyurular)
// ----------------------------------------------------
interface AnnouncementsPageProps {
  announcements: IAnnouncement[];
  subscribers: IObserver[];
  onPublishAnnouncement: (
    type: 'EXAM' | 'EVENT' | 'HOMEWORK' | 'GRADE_ENTRY',
    title: string,
    message: string,
    targetAudience: 'ALL' | 'STUDENT' | 'TEACHER',
    targetDate?: string
  ) => void;
  onTriggerSimulation: () => void;
}

function AnnouncementsPage({ announcements, subscribers, onPublishAnnouncement, onTriggerSimulation }: AnnouncementsPageProps) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'EXAM' | 'EVENT' | 'HOMEWORK' | 'GRADE_ENTRY'>('EXAM');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'STUDENT' | 'TEACHER'>('ALL');
  const [targetDate, setTargetDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onPublishAnnouncement(type, title, message, targetAudience, targetDate || undefined);

    // Formu temizle
    setTitle('');
    setMessage('');
    setTargetAudience('ALL');
    setTargetDate('');
  };

  return (
    <div className="dashboard-grid">
      {/* Duyuru Ekleme Formu */}
      <div className="card">
        <h2><span>📢</span> Yeni Duyuru Yayınlama (Subject.notify)</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hedef Kitle</label>
            <select 
              value={targetAudience} 
              onChange={(e) => setTargetAudience(e.target.value as 'ALL' | 'STUDENT' | 'TEACHER')}
            >
              <option value="ALL">👥 Herkes (All)</option>
              <option value="STUDENT">🎓 Sadece Öğrenciler (Students)</option>
              <option value="TEACHER">👨‍🏫 Sadece Öğretmenler (Teachers)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duyuru Tipi</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as 'EXAM' | 'EVENT' | 'HOMEWORK' | 'GRADE_ENTRY')}
            >
              <option value="EXAM">📝 Sınav Duyurusu</option>
              <option value="EVENT">🎉 Etkinlik Duyurusu</option>
              <option value="HOMEWORK">📚 Ödev Teslim Hatırlatması</option>
              <option value="GRADE_ENTRY">💯 Sınav Not Girişi</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duyuru Başlığı</label>
            <input 
              type="text" 
              placeholder="Başlık girin..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Duyuru Mesajı</label>
            <textarea 
              rows={3} 
              placeholder="Duyuru detaylı mesajı..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Hedef Son Tarih (Simülasyon/Kontrol İçin)</label>
            <input 
              type="date" 
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '10px' }}
            disabled={subscribers.length === 0}
          >
            {subscribers.length === 0 ? 'Duyuru İçin Önce Abone Ekleyin' : 'Duyuruyu Yayınla (Notify)'}
          </button>
        </form>
      </div>

      {/* Geçmiş Duyurular & Simülasyon Butonu */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0 }}><span>📅</span> Geçmiş Duyurular & Simülasyon</h2>
            <button 
              onClick={onTriggerSimulation}
              className="btn btn-primary"
              style={{ background: '#3b82f6', fontSize: '13px', padding: '8px 16px' }}
              disabled={announcements.filter(a => a.targetDate).length === 0}
            >
              ⏰ Tarihleri Kontrol Et (Deadline Simülasyonu)
            </button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text)', margin: '0 0 15px 0', lineHeight: 1.4 }}>
          "Zamanı İleri Sar" butonu, son teslim tarihi bulunan ödev ve not giriş duyurularını bulur. Hedef tarihe tam 2 gün kalmış gibi simülasyon yaparak ilgili öğrenci ve öğretmenlere otomatik uyarıları tetikler.
        </p>

        {announcements.length === 0 ? (
          <p className="empty-state">Henüz hiç duyuru yayınlanmadı.</p>
        ) : (
          <div className="announcement-list">
            {announcements.map((ann, index) => (
              <div key={index} className="announcement-item">
                <div className="announcement-info">
                  <span>
                    {ann.type === 'EXAM' && '📝'}
                    {ann.type === 'EVENT' && '🎉'}
                    {ann.type === 'HOMEWORK' && '📚'}
                    {ann.type === 'GRADE_ENTRY' && '💯'}
                  </span>
                  <div className="announcement-details">
                    <div className="announcement-title-row">
                      <strong style={{ color: 'var(--text-h)' }}>{ann.title}</strong>
                      <span className={`badge ${ann.type.toLowerCase()}`}>
                        {ann.type === 'EXAM' && 'Sınav'}
                        {ann.type === 'EVENT' && 'Etkinlik'}
                        {ann.type === 'HOMEWORK' && 'Ödev'}
                        {ann.type === 'GRADE_ENTRY' && 'Not Girişi'}
                      </span>
                      {ann.targetDate && (
                        <span className="badge deadline">Son Tarih: {ann.targetDate}</span>
                      )}
                    </div>
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>{ann.message}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN APPLICATION (ROUTING & SYSTEM CORES)
// ----------------------------------------------------
function App() {
  // Gözlemci yayıncısını (Subject) persistent nesne olarak koruyoruz
  const publisher = useMemo(() => new AnnouncementPublisher(), []);

  // Sistem genel state'leri
  const [subscribers, setSubscribers] = useState<IObserver[]>([]);
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // 1. Console Interceptor: Tüm alt sayfalardan basılan logları terminale aktarır
  useEffect(() => {
    const originalLog = console.log;

    console.log = (...args: any[]) => {
      originalLog(...args);

      const messageText = args.join(' ');

      const isRelevant = 
        messageText.includes('[Sistem Log') || 
        messageText.includes('şu duyuruyu aldı:') || 
        messageText.includes('kanalından') || 
        messageText.includes('nesnesi üretildi') ||
        messageText.includes('Abonelik sonlandırıldı') ||
        messageText.includes('sisteme eklendi') ||
        messageText.includes('[Deadline Simülasyonu]') ||
        messageText.includes('[Deadline Notifier]') ||
        messageText.includes('[Uyarı]');

      if (isRelevant) {
        let type: 'system' | 'user' | 'info' = 'info';

        if (messageText.includes('[Sistem Log') || messageText.includes('[Deadline Simülasyonu]')) {
          type = 'system';
        } else if (messageText.includes('şu duyuruyu aldı:')) {
          type = 'user';
        } else if (messageText.includes('kanalından') || messageText.includes('[Deadline Notifier]')) {
          type = 'info';
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

  // 2. Başlangıç Değerleri Yükleme
  useEffect(() => {
    Logger.getInstance().log("Akıllı Kampüs Çok Kanallı Portalı başarıyla başlatıldı.");

    // Çok kanallı mock aboneler
    const initStudent1 = new Student("Ahmet Yılmaz", ["SMS", "EMAIL"]);
    const initTeacher1 = new Teacher("Prof. Dr. Zeynep Kaya", ["EMAIL"]);
    const initStudent2 = new Student("Elif Demir", ["PUSH", "SMS"]);

    publisher.attach(initStudent1);
    publisher.attach(initTeacher1);
    publisher.attach(initStudent2);

    setSubscribers([initStudent1, initTeacher1, initStudent2]);

    // Örnek başlangıç duyuruları
    const initAnnouncements: IAnnouncement[] = [
      { title: "Bahar Şenliği Etkinliği", message: "29 Mayıs Cuma günü çim alanda geleneksel kampüs bahar şenliği yapılacaktır.", type: "EVENT" },
      { title: "Algoritma Final Sınavı", message: "Final sınavı 8 Haziran günü saat 13:00'te yapılacaktır.", type: "EXAM" },
      { title: "Yazılım Tasarımı Ödev Teslimi", message: "Yazılım Tasarım Desenleri projesi son teslim tarihi.", type: "HOMEWORK", targetDate: "2026-05-27" } // Bugün 25'i olduğundan tam 2 gün kalmış durumda!
    ];

    setAnnouncements(initAnnouncements);

    Logger.getInstance().log("Çok kanallı başlangıç aboneleri ve son tarihli örnek duyurular yüklendi.");
  }, [publisher]);

  // Terminal scroll kontrolü
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // 3. Eylemler (Actions)

  // Yeni Abone Ekleme
  const handleAddSubscriber = (name: string, type: 'STUDENT' | 'TEACHER', channels: ('EMAIL' | 'SMS' | 'PUSH')[]) => {
    let newObserver: IObserver;
    if (type === 'STUDENT') {
      newObserver = new Student(name, channels);
    } else {
      newObserver = new Teacher(name, channels);
    }

    publisher.attach(newObserver);
    
    Logger.getInstance().log(
      `Yeni ${type === 'STUDENT' ? 'Öğrenci' : 'Öğretmen'} sisteme eklendi: "${name}" [Seçilen Kanallar: ${channels.join(', ')}]`
    );

    setSubscribers([...subscribers, newObserver]);
  };

  // Abone Silme
  const handleRemoveSubscriber = (observer: IObserver) => {
    publisher.detach(observer);
    Logger.getInstance().log(`Abonelik sonlandırıldı: "${observer.name}"`);
    setSubscribers(subscribers.filter(sub => sub !== observer));
  };

  // Duyuru Yayınlama
  const handlePublishAnnouncement = (
    type: 'EXAM' | 'EVENT' | 'HOMEWORK' | 'GRADE_ENTRY',
    title: string,
    message: string,
    targetAudience: 'ALL' | 'STUDENT' | 'TEACHER',
    targetDate?: string
  ) => {
    // A. Duyuru nesnesini fabrikada üret (hedef kitle ile birlikte)
    const announcement = AnnouncementFactory.createAnnouncement(type, title, message, targetAudience);
    if (targetDate) {
      announcement.targetDate = targetDate;
    }

    // B. Duyuruyu listeye ekle
    setAnnouncements(prev => [announcement, ...prev]);

    // C. Observer Pattern tetikle (Gözlemcilerin update metodları filtreli çalışır)
    publisher.notify(announcement);

    // D. Her gözlemci için hedef kitle uyuşuyorsa NotificationFactory kullanarak bildirim gönder
    subscribers.forEach((observer) => {
      const isTargetAll = !announcement.targetAudience || announcement.targetAudience === 'ALL';
      const isTargetMatch = announcement.targetAudience === observer.role;

      if (isTargetAll || isTargetMatch) {
        NotificationFactory.sendMultipleNotifications(
          observer.notificationTypes,
          announcement.message,
          observer.name
        );
      }
    });
  };

  // Son Tarih Simülasyonu Tetikleme
  const handleTriggerSimulation = () => {
    Logger.getInstance().log("--- TARİH KONTROLÜ (DEADLINE SİMÜLASYON BAŞLADI) ---");
    
    // Tarih içeren tüm duyuruları bulup simüle et
    announcements.forEach((ann) => {
      if (ann.targetDate) {
        DeadlineNotifier.simulateDeadlineWarning(ann, subscribers);
      }
    });

    Logger.getInstance().log("--- SİMÜLASYON TAMAMLANDI (Tüm bildirimler gönderildi) ---");
  };

  return (
    <Router basename="/-akilli-kampus-">
      <div className="app-wrapper">
        {/* Modern Navbar */}
        <nav className="navbar">
          <NavLink to="/" className="nav-brand">
            <span>🏫</span> Akıllı Kampüs Portalı
          </NavLink>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              📊 Özet Panel
            </NavLink>
            <NavLink to="/kullanicilar" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              👥 Kullanıcılar
            </NavLink>
            <NavLink to="/duyurular" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              📢 Duyurular
            </NavLink>
          </div>
        </nav>

        {/* Ana İçerik Alanı */}
        <main className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard subscribers={subscribers} announcements={announcements} />} />
            <Route path="/kullanicilar" element={
              <UsersPage 
                subscribers={subscribers} 
                onAddSubscriber={handleAddSubscriber} 
                onRemoveSubscriber={handleRemoveSubscriber} 
              />
            } />
            <Route path="/duyurular" element={
              <AnnouncementsPage 
                announcements={announcements} 
                subscribers={subscribers} 
                onPublishAnnouncement={handlePublishAnnouncement}
                onTriggerSimulation={handleTriggerSimulation}
              />
            } />
          </Routes>
        </main>

        {/* Global Alt Terminal Alanı */}
        <footer className="global-terminal-container">
          <div className="console-header">
            <div className="console-title">
              <span>💻</span> Global Sistem Logları (Singleton Terminal)
            </div>
            <button 
              onClick={() => setLogs([])}
              className="btn btn-secondary" 
              style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(255,255,255,0.08)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Terminali Temizle
            </button>
          </div>
          
          <div className="console-panel">
            {logs.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic', margin: 0 }}>
                Sistem dinleniyor... Kullanıcı eklediğinizde, duyuru yayınladığınızda veya zamanı ileri sardığınızda tüm çoklu kanal üretim ve tetiklenme hareketleri burada canlı akacaktır.
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
        </footer>
      </div>
    </Router>
  );
}

export default App;
