import type { IAnnouncement } from '../domain/interfaces';

/**
 * Sınav duyurularını temsil eden somut duyuru sınıfı.
 * IAnnouncement arayüzünü uygular.
 */
export class ExamAnnouncement implements IAnnouncement {
  // Duyuru tipini 'EXAM' olarak sabitliyoruz
  public readonly type: string = 'EXAM';
  
  // erasableSyntaxOnly kuralı nedeniyle property'leri açıkça tanımlıyoruz
  public title: string;
  public message: string;

  /**
   * ExamAnnouncement constructor.
   * @param title Sınav duyurusunun başlığı
   * @param message Sınav duyurusunun içeriği
   */
  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}

/**
 * Etkinlik duyurularını temsil eden somut duyuru sınıfı.
 * IAnnouncement arayüzünü uygular.
 */
export class EventAnnouncement implements IAnnouncement {
  // Duyuru tipini 'EVENT' olarak sabitliyoruz
  public readonly type: string = 'EVENT';
  
  // erasableSyntaxOnly kuralı nedeniyle property'leri açıkça tanımlıyoruz
  public title: string;
  public message: string;

  /**
   * EventAnnouncement constructor.
   * @param title Etkinlik duyurusunun başlığı
   * @param message Etkinlik duyurusunun içeriği
   */
  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}
