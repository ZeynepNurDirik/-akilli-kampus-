import type { IAnnouncement } from '../domain/interfaces';

/**
 * Sınav duyurularını temsil eden somut duyuru sınıfı.
 * IAnnouncement arayüzünü uygular.
 */
export class ExamAnnouncement implements IAnnouncement {
  public readonly type: string = 'EXAM';
  public title: string;
  public message: string;
  public targetDate?: string;

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
  public readonly type: string = 'EVENT';
  public title: string;
  public message: string;
  public targetDate?: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}

/**
 * Ödev teslim uyarısı duyurularını temsil eden somut duyuru sınıfı.
 * IAnnouncement arayüzünü uygular.
 */
export class HomeworkAnnouncement implements IAnnouncement {
  public readonly type: string = 'HOMEWORK';
  public title: string;
  public message: string;
  public targetDate?: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}

/**
 * Not giriş hatırlatma duyurularını temsil eden somut duyuru sınıfı.
 * IAnnouncement arayüzünü uygular.
 */
export class GradeEntryAnnouncement implements IAnnouncement {
  public readonly type: string = 'GRADE_ENTRY';
  public title: string;
  public message: string;
  public targetDate?: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }
}
