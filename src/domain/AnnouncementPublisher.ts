import type { IAnnouncement, IObserver, ISubject } from './interfaces';

/**
 * AnnouncementPublisher sınıfı, ISubject arayüzünü uygulayarak
 * gözlemci (Observer) örüntüsündeki "Subject" (Özne) rolünü üstlenir.
 * Kampüsteki duyuruları yönetir ve kayıtlı gözlemcilere filtreleyerek bildirir.
 */
export class AnnouncementPublisher implements ISubject {
  // Kayıtlı gözlemcileri (IObserver) saklayan özel dizi
  private observers: IObserver[] = [];

  /**
   * Yeni bir gözlemciyi yayıncıya kaydeder (abone eder).
   * @param observer Kaydedilecek olan gözlemci nesnesi
   */
  attach(observer: IObserver): void {
    // Aynı gözlemcinin mükerrer eklenmesini önlemek için kontrol yapıyoruz
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * Kayıtlı bir gözlemcinin aboneliğini iptal eder (listeden çıkarır).
   * @param observer Listeden çıkarılacak olan gözlemci nesnesi
   */
  detach(observer: IObserver): void {
    const index = this.observers.indexOf(observer);
    // Gözlemci dizide bulunuyorsa diziden çıkarıyoruz
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Yayınlanan yeni duyuruyu hedef kitlesine göre filtreleyerek gözlemcilere bildirir.
   * Hedef kitlesi uyan gözlemcilerin update metodu döngü (loop) ile tetiklenir.
   * @param announcement Yayınlanan duyuru nesnesi
   */
  notify(announcement: IAnnouncement): void {
    // Tüm kayıtlı gözlemcileri döngüyle dönüyoruz
    for (const observer of this.observers) {
      // Hedef kitle filtresi kontrolü:
      // Eğer duyurunun hedef kitlesi 'ALL' ise (veya boş/tanımsız ise) HERKESE gönder,
      // Aksi takdirde, duyurunun hedef kitlesi (targetAudience) ile gözlemcinin rolü (role) eşleşiyorsa gönder.
      const isTargetAll = !announcement.targetAudience || announcement.targetAudience === 'ALL';
      const isTargetMatch = announcement.targetAudience === observer.role;

      if (isTargetAll || isTargetMatch) {
        // Hedef kitle uyuşuyorsa gözlemcinin update metodunu tetikleyerek duyuruyu iletiyoruz
        observer.update(announcement);
      }
    }
  }
}
