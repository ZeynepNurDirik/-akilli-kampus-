# 🏫 Akıllı Kampüs Duyuru & Bildirim Portalı

Bu proje, modern yazılım mimarisi prensipleri ve tasarım desenleri (Design Patterns) kullanılarak geliştirilmiş, esnek ve modüler bir **Kampüs Duyuru & Çok Kanallı Bildirim Portalı** uygulamasıdır. Proje; **Clean Architecture** prensiplerine sadık kalınarak katmanlandırılmış, **Vite**, **TypeScript** ve **React Router** teknolojileriyle zenginleştirilmiştir.

---

## 🛠️ Mimari ve Tasarım Desenleri (Design Patterns)

Proje, yazılım dünyasında sıkça kullanılan 3 temel tasarım desenini birbirine entegre şekilde uygulayarak **Loosely Coupled (gevşek bağlı)** ve genişletilebilir bir yapı sunar:

### 1. 🟣 Gözlemci Deseni (Observer Pattern)
*   **Subject (Özne):** `AnnouncementPublisher` sınıfı, `ISubject` arayüzünü uygulayarak gözlemcileri yönetir.
*   **Observer (Gözlemci):** `IObserver` arayüzünü uygulayan `Student` ve `Teacher` sınıflarıdır.
*   **Hedef Kitle Filtreleme (Filtered Delivery):** Duyurular yayınlanırken tüm gözlemciler körü körüne uyarılmaz; duyurunun `targetAudience` değeri (`ALL`, `STUDENT`, `TEACHER`) ile gözlemcinin `role` değeri filtreye tabi tutulur. Böylece öğretmen uyarısı sadece öğretmenlere, ödev teslim uyarısı sadece öğrencilere iletilir.

### 2. 🟢 Fabrika Metodu Deseni (Factory Method)
*   **Bildirim Fabrikası (`NotificationFactory`):** Abonenin seçtiği çoklu kanallara (`EMAIL`, `SMS`, `PUSH`) göre somut bildirim sınıflarını (`EmailNotification`, `SMSNotification`, `PushNotification`) dinamik olarak üretir.
*   **Duyuru Fabrikası (`AnnouncementFactory`):** Duyuru tiplerine (`EXAM`, `EVENT`, `HOMEWORK`, `GRADE_ENTRY`) göre somut duyuru nesnelerini oluşturur.

### 3. 🔵 Tekil Nesne Deseni (Singleton Pattern)
*   **Sistem Günlüğü (`Logger`):** Altyapı katmanında (Infrastructure) yer alan ve projenin her yerinde tek bir nesne örneği üzerinden çalışan `Logger` sınıfıdır. Sistemdeki tüm üretim, abonelik iptali ve uyarı işlemlerini merkezi olarak terminal paneline kaydeder.

---

## 📁 Klasör Yapısı (Clean Architecture)

Proje, Clean Architecture katmanlı mimarisine uygun şekilde organize edilmiştir:

```text
src/
├── domain/                  # 1. DOMAIN KATMANI (Temel İş Kuralları & Arayüzler)
│   ├── interfaces.ts        # IAnnouncement, IObserver, ISubject, INotification tanımları
│   ├── Users.ts             # Student ve Teacher somut sınıfları (Observers)
│   └── AnnouncementPublisher.ts # Duyuru dağıtıcı/yayıncı çekirdeği (Subject)
│
├── application/             # 2. APPLICATION KATMANI (Uygulama Mantığı & Servisler)
│   ├── Announcements.ts     # Somut Duyuru Sınıfları (Exam, Event, Homework, GradeEntry)
│   ├── AnnouncementFactory.ts # Duyuru üretim fabrikası
│   ├── Notifications.ts     # Somut Bildirim Sınıfları (Email, SMS, Push)
│   ├── NotificationFactory.ts # Çoklu kanal bildirim üretim fabrikası
│   └── DeadlineNotifier.ts  # Tarih bazlı son 2 gün simülasyon/uyarı servisi
│
├── infrastructure/          # 3. INFRASTRUCTURE KATMANI (Altyapı & Ortak Araçlar)
│   └── Logger.ts            # Singleton Logger (Sistem Günlüğü)
│
└── presentation/            # 4. PRESENTATION KATMANI (React / UI)
    ├── App.tsx              # Router, Çok Sayfalı Formlar ve Simülasyon Arayüzü
    ├── App.css              # Premium Glassmorphic HSL Tema CSS kuralları
    └── index.css            # Temel CSS Değişkenleri ve Sıfırlama
```

---

## ✨ Öne Çıkan Benzersiz Özellikler

1.  **Çok Kanallı Bildirim Tercihi:** Bir kullanıcı artık tek bir kanal yerine aynı anda birden fazla bildirim kanalı seçebilir (Örneğin: Ayşe Yılmaz hem 📧 E-Posta hem de 💬 SMS alabilir).
2.  **Hedef Kitleye Göre Filtreleme:** Sistem, kimin öğrenci kimin öğretmen olduğunu bilmeden sadece roller (`role`) üzerinden akıllıca eşleşme yapar.
3.  **Tarih Kontrolü (Deadline Simülasyonu):** Tarih içeren duyurularda **"Tarihleri Kontrol Et"** butonuna basıldığında; bitiş sürelerine 2 gün kalan tüm duyurular taranır ve doğru hedef kitleye özel bildirimler tetiklenir.
4.  **Canlı Sistem Logları (Singleton Terminal):** Uygulama arayüzünün en altında, tüm tasarım desenlerinin çalışma sırasındaki tetiklenmelerini, fabrika üretim süreçlerini ve Singleton hareketlerini anlık olarak izleyebileceğiniz görsel bir terminal bulunur.

---

## 🚀 Kurulum ve Çalıştırma

### 1. Yerelde Çalıştırma (Development)
Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

```bash
# Proje dizinine gidin
cd akilli-kampus

# Bağımlılıkları kurun
npm install

# Yerel sunucuyu başlatın
npm run dev
```

> [!IMPORTANT]
> Proje yönlendirme yapısı (React Router `basename`) nedeniyle, tarayıcınızda yerel sunucuyu açtıktan sonra şu adrese gitmeniz gerekmektedir:
> **[http://localhost:5173/akilli-kampus/](http://localhost:5173/akilli-kampus/)**

### 2. Üretim Modunda Derleme (Build)
Uygulamayı üretime hazırlamak ve derlemek için:

```bash
npm run build
```

---

## 🌐 Canlıya Alma (GitHub Pages Deployment)

Proje, GitHub Pages dağıtımına tamamen uyumlu hale getirilmiştir. Değişikliklerinizi kendi GitHub Pages sayfanızda yayınlamak için aşağıdaki komutu çalıştırmanız yeterlidir:

```bash
npm run deploy
```

Bu komut otomatik olarak:
1.  Projeyi `predeploy` betiğiyle hatasız bir şekilde derler.
2.  Oluşan `dist` klasörünü GitHub deponuzun `gh-pages` dalına yükler ve canlıya alır.

---

## 👤 Geliştirici
*   **Zeynep Nur Dirik** - *Yazılım Geliştirici & Mimar*
*   GitHub: [@ZeynepNurDirik](https://github.com/ZeynepNurDirik)

Bu proje yazılım mimarisi eğitimleri ve tasarım desenlerinin modern web teknolojilerindeki pratik uygulamaları için bir referans olarak hazırlanmıştır. Keyifli kodlamalar! 🎓
