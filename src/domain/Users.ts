import type { IAnnouncement, IObserver } from './interfaces';

/**
 * Student sınıfı, IObserver arayüzünü uygulayarak
 * gözlemci (Observer) örüntüsündeki somut gözlemcilerden biridir.
 */
export class Student implements IObserver {
  // erasableSyntaxOnly kuralı nedeniyle property'leri açıkça tanımlıyoruz
  public name: string;
  public notificationType: 'EMAIL' | 'SMS' | 'PUSH';

  /**
   * Student constructor.
   * @param name Öğrencinin adı
   * @param notificationType Tercih edilen bildirim kanalı ('EMAIL' | 'SMS' | 'PUSH')
   */
  constructor(name: string, notificationType: 'EMAIL' | 'SMS' | 'PUSH') {
    this.name = name;
    this.notificationType = notificationType;
  }

  /**
   * Yeni bir duyuru yayınlandığında çağrılan metot.
   * @param announcement Yayınlanan duyuru nesnesi
   */
  update(announcement: IAnnouncement): void {
    console.log(`${this.name}, şu duyuruyu aldı: ${announcement.title}`);
  }
}

/**
 * Teacher sınıfı, IObserver arayüzünü uygulayarak
 * gözlemci (Observer) örüntüsündeki somut gözlemcilerden bir diğeridir.
 */
export class Teacher implements IObserver {
  // erasableSyntaxOnly kuralı nedeniyle property'leri açıkça tanımlıyoruz
  public name: string;
  public notificationType: 'EMAIL' | 'SMS' | 'PUSH';

  /**
   * Teacher constructor.
   * @param name Öğretmenin adı
   * @param notificationType Tercih edilen bildirim kanalı ('EMAIL' | 'SMS' | 'PUSH')
   */
  constructor(name: string, notificationType: 'EMAIL' | 'SMS' | 'PUSH') {
    this.name = name;
    this.notificationType = notificationType;
  }

  /**
   * Yeni bir duyuru yayınlandığında çağrılan metot.
   * @param announcement Yayınlanan duyuru nesnesi
   */
  update(announcement: IAnnouncement): void {
    console.log(`${this.name}, şu duyuruyu aldı: ${announcement.title}`);
  }
}
