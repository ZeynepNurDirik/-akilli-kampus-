export interface IAnnouncement {
  title: string;
  message: string;
  type: string;
}

export interface IObserver {
  name: string;
  notificationType: 'EMAIL' | 'SMS' | 'PUSH';
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
