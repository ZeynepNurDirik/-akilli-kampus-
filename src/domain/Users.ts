import type { IAnnouncement, IObserver } from './interfaces';

/**
 * Student sınıfı, IObserver arayüzünü uygulayarak
 * gözlemci (Observer) örüntüsündeki somut gözlemcilerden biridir.
 */
export class Student implements IObserver {
  // erasableSyntaxOnly kuralı nedeniyle property'leri açıkça tanımlıyoruz
  public name: string;
  public role: 'STUDENT' = 'STUDENT'; // Rol otomatik olarak 'STUDENT' olarak atanır
  public notificationTypes: ('EMAIL' | 'SMS' | 'PUSH')[];

  /**
   * Student constructor.
   * @param name Öğrencinin adı
   * @param notificationTypes Tercih edilen bildirim kanalları ('EMAIL' | 'SMS' | 'PUSH') dizisi
   */
  constructor(name: string, notificationTypes: ('EMAIL' | 'SMS' | 'PUSH')[]) {
    this.name = name;
    this.notificationTypes = notificationTypes;
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
  public role: 'TEACHER' = 'TEACHER'; // Rol otomatik olarak 'TEACHER' olarak atanır
  public notificationTypes: ('EMAIL' | 'SMS' | 'PUSH')[];

  /**
   * Teacher constructor.
   * @param name Öğretmenin adı
   * @param notificationTypes Tercih edilen bildirim kanalları ('EMAIL' | 'SMS' | 'PUSH') dizisi
   */
  constructor(name: string, notificationTypes: ('EMAIL' | 'SMS' | 'PUSH')[]) {
    this.name = name;
    this.notificationTypes = notificationTypes;
  }

  /**
   * Yeni bir duyuru yayınlandığında çağrılan metot.
   * @param announcement Yayınlanan duyuru nesnesi
   */
  update(announcement: IAnnouncement): void {
    console.log(`${this.name}, şu duyuruyu aldı: ${announcement.title}`);
  }
}
