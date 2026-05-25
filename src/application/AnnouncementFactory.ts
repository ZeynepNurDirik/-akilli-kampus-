import type { IAnnouncement } from '../domain/interfaces';
import { Logger } from '../infrastructure/Logger';
import { ExamAnnouncement, EventAnnouncement } from './Announcements';

/**
 * AnnouncementFactory sınıfı, Fabrika (Factory Method) tasarım örüntüsünü uygulayarak
 * istenen duyuru tipine göre somut duyuru nesnesi (IAnnouncement) üretir.
 */
export class AnnouncementFactory {
  /**
   * Belirtilen tipte, başlıkta ve mesajda somut bir duyuru (IAnnouncement) nesnesi üretir.
   * Üretim öncesinde Singleton Logger ile log kaydı alır.
   * @param type Duyuru tipi ('EXAM' | 'EVENT')
   * @param title Duyuru başlığı
   * @param message Duyuru mesajı
   * @returns Üretilen IAnnouncement somut sınıf örneği
   */
  public static createAnnouncement(
    type: 'EXAM' | 'EVENT',
    title: string,
    message: string
  ): IAnnouncement {
    // Üretim öncesinde Singleton Logger ile log kaydı alınıyor
    Logger.getInstance().log(`${type} tipinde duyuru nesnesi üretildi: "${title}"`);

    switch (type) {
      case 'EXAM':
        return new ExamAnnouncement(title, message);
      case 'EVENT':
        return new EventAnnouncement(title, message);
      default:
        throw new Error(`Desteklenmeyen duyuru tipi: ${type}`);
    }
  }
}
