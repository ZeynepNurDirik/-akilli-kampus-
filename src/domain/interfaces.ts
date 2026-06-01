export interface IAnnouncement {
  title: string;
  message: string;
  type: string;
  targetDate?: string; // Bitiş tarihi (deadline) simülasyonu için opsiyonel alan
  targetAudience?: 'ALL' | 'STUDENT' | 'TEACHER'; // Hedef kitleye göre filtreleme için eklendi
}

export interface IObserver {
  name: string;
  role: 'STUDENT' | 'TEACHER'; // Gözlemcinin kimliğini / rolünü belirtmek için eklendi
  notificationTypes: ('EMAIL' | 'SMS' | 'PUSH')[]; // Kullanıcının çoklu kanal seçebilmesi için dizi
  update(announcement: IAnnouncement): void;
}

export interface ISubject {
  attach(observer: IObserver): void;
  detach(observer: IObserver): void;
  notify(announcement: IAnnouncement): void;
}

export interface INotification {
  send(message: string, to: string): void;
}
