import type { IAnnouncement, IObserver } from '../domain/interfaces';
import { NotificationFactory } from './NotificationFactory';
import { Logger } from '../infrastructure/Logger';

/**
 * DeadlineNotifier sınıfı, son tarihli (deadline) duyuruları izler ve
 * simülasyon adımlarında son 2 gün kalmış olan durumlar için ilgili
 * hedef kitleyi (Student / Teacher) doğru kanallardan uyarır.
 */
export class DeadlineNotifier {
  /**
   * Bir duyurunun son tarihine 2 gün kaldığını simüle ederek, ilgili gözlemci gruplarını uyarır.
   * Her duyuru türü (EXAM, EVENT, HOMEWORK, GRADE_ENTRY) için ayrı ve özel log açıklamaları ile uyarır.
   * @param announcement İncelenen duyuru nesnesi
   * @param observers Sistemdeki tüm gözlemciler listesi
   */
  public static simulateDeadlineWarning(
    announcement: IAnnouncement,
    observers: IObserver[]
  ): void {
    // Eğer duyuruda bir hedef son tarih belirlenmemişse işlem yapma
    if (!announcement.targetDate) return;

    // Hedef kitleyi simülasyon kurallarına ve tiplere göre uyduruyoruz
    if (announcement.type === 'HOMEWORK') {
      announcement.targetAudience = 'STUDENT';
    } else if (announcement.type === 'GRADE_ENTRY') {
      announcement.targetAudience = 'TEACHER';
    } else if (!announcement.targetAudience) {
      // Sınav veya Etkinlik için bir hedef kitle atanmamışsa varsayılan olarak 'ALL' yapıyoruz
      announcement.targetAudience = 'ALL';
    }

    // Terminalde hangi duyurunun simüle edildiğini netleştirmek için başlığı çok belirgin yapıyoruz
    const trType = 
      announcement.type === 'EXAM' ? '📝 SINAV' :
      announcement.type === 'EVENT' ? '🎉 ETKİNLİK' :
      announcement.type === 'HOMEWORK' ? '📚 ÖDEV' : '💯 NOT GİRİŞİ';

    Logger.getInstance().log(
      `--------------------------------------------------`
    );
    Logger.getInstance().log(
      `[Deadline Simülasyonu] Raporlanan Duyuru: "${announcement.title}" [Tür: ${trType} | Hedef Kitle: ${announcement.targetAudience} | Tarih: ${announcement.targetDate}]`
    );

    observers.forEach((observer) => {
      // Hedef kitle filtre kontrolü
      const isTargetAll = !announcement.targetAudience || announcement.targetAudience === 'ALL';
      const isTargetMatch = announcement.targetAudience === observer.role;

      if (isTargetAll || isTargetMatch) {
        let warningMessage = '';
        let logDescription = '';

        // Her duyuru türü için tamamen bağımsız, özel bildirim mesajı ve terminal log açıklaması
        switch (announcement.type) {
          case 'HOMEWORK':
            warningMessage = `📚 Ödev Gecikme Uyarısı: "${announcement.title}" ödev teslim tarihine (${announcement.targetDate}) son 2 gün kaldı! Lütfen teslimlerinizi tamamlayın.`;
            logDescription = `Öğrenci "${observer.name}" için ÖDEV TESLİM UYARISI tetiklendi.`;
            break;
          case 'GRADE_ENTRY':
            warningMessage = `💯 Akademik Hatırlatma: Sayın ${observer.name}, "${announcement.title}" dersi not girişi son tarihine (${announcement.targetDate}) son 2 gün kaldı!`;
            logDescription = `Öğretmen "${observer.name}" için NOT GİRİŞİ HATIRLATMASI tetiklendi.`;
            break;
          case 'EXAM':
            warningMessage = `📝 Yaklaşan Sınav Uyarısı: Sayın ${observer.name}, "${announcement.title}" sınavına (${announcement.targetDate}) son 2 gün kaldı! Hazırlıklarınızı gözden geçirin.`;
            logDescription = `${observer.role === 'STUDENT' ? 'Öğrenci' : 'Öğretmen'} "${observer.name}" için YAKLAŞAN SINAV UYARISI tetiklendi.`;
            break;
          case 'EVENT':
            warningMessage = `🎉 Yaklaşan Etkinlik Hatırlatması: "${announcement.title}" etkinliğine (${announcement.targetDate}) son 2 gün kaldı! Katılımlarınızı bekliyoruz.`;
            logDescription = `${observer.role === 'STUDENT' ? 'Öğrenci' : 'Öğretmen'} "${observer.name}" için KAMPÜS ETKİNLİK HATIRLATMASI tetiklendi.`;
            break;
          default:
            warningMessage = `⚠️ Genel Hatırlatma: "${announcement.title}" son tarihi (${announcement.targetDate}) yaklaşıyor!`;
            logDescription = `Kullanıcı "${observer.name}" için GENEL DEADLINE KONTROLÜ tetiklendi.`;
            break;
        }

        // Benzersiz ve açıklayıcı log satırını Singleton Logger'a basıyoruz
        Logger.getInstance().log(`[Deadline Notifier] ${logDescription}`);
        
        // Çoklu kanal üzerinden somut bildirim gönderimi tetiklenir
        NotificationFactory.sendMultipleNotifications(
          observer.notificationTypes,
          warningMessage,
          observer.name
        );
      }
    });
  }
}
