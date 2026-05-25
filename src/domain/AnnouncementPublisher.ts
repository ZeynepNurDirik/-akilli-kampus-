import type { IAnnouncement, IObserver, ISubject } from './interfaces';

/**
 * AnnouncementPublisher sınıfı, ISubject arayüzünü uygulayarak
 * gözlemci (Observer) örüntüsündeki "Subject" (Özne) rolünü üstlenir.
 * Kampüsteki duyuruları yönetir ve kayıtlı gözlemcilere bildirir.
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
   * Yayınlanan yeni duyuruyu kayıtlı olan tüm gözlemcilere bildirir.
   * Her bir gözlemcinin update metodu döngü (loop) ile tetiklenir.
   * @param announcement Yayınlanan duyuru nesnesi
   */
  notify(announcement: IAnnouncement): void {
    // Tüm kayıtlı gözlemcileri döngüyle dönüyoruz
    for (const observer of this.observers) {
      // Her gözlemcinin update metodunu tetikleyerek duyuruyu iletiyoruz
      observer.update(announcement);
    }
  }
}
