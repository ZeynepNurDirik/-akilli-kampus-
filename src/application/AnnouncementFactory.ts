import type { IAnnouncement } from '../domain/interfaces';
import { Logger } from '../infrastructure/Logger';
import { 
  ExamAnnouncement, 
  EventAnnouncement, 
  HomeworkAnnouncement, 
  GradeEntryAnnouncement 
} from './Announcements';

/**
 * AnnouncementFactory sınıfı, Fabrika (Factory Method) tasarım örüntüsünü uygulayarak
 * istenen duyuru tipine göre somut duyuru nesnesi (IAnnouncement) üretir.
 */
export class AnnouncementFactory {
  /**
   * Belirtilen tipte, başlıkta ve mesajda somut bir duyuru (IAnnouncement) nesnesi üretir.
   * Üretim öncesinde Singleton Logger ile log kaydı alır.
   * @param type Duyuru tipi ('EXAM' | 'EVENT' | 'HOMEWORK' | 'GRADE_ENTRY')
   * @param title Duyuru başlığı
   * @param message Duyuru mesajı
   * @param targetAudience Duyurunun hedef kitlesi ('ALL' | 'STUDENT' | 'TEACHER')
   * @returns Üretilen IAnnouncement somut sınıf örneği
   */
  public static createAnnouncement(
    type: 'EXAM' | 'EVENT' | 'HOMEWORK' | 'GRADE_ENTRY',
    title: string,
    message: string,
    targetAudience: 'ALL' | 'STUDENT' | 'TEACHER' = 'ALL'
  ): IAnnouncement {
    // Üretim öncesinde Singleton Logger ile log kaydı alınıyor
    Logger.getInstance().log(
      `${type} tipinde, "${targetAudience}" hedef kitleli duyuru nesnesi üretildi: "${title}"`
    );

    let announcement: IAnnouncement;

    switch (type) {
      case 'EXAM':
        announcement = new ExamAnnouncement(title, message);
        break;
      case 'EVENT':
        announcement = new EventAnnouncement(title, message);
        break;
      case 'HOMEWORK':
        announcement = new HomeworkAnnouncement(title, message);
        break;
      case 'GRADE_ENTRY':
        announcement = new GradeEntryAnnouncement(title, message);
        break;
      default:
        throw new Error(`Desteklenmeyen duyuru tipi: ${type}`);
    }

    // Hedef kitle özelliğini atıyoruz
    announcement.targetAudience = targetAudience;

    return announcement;
  }
}
