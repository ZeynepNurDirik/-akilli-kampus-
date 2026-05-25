import type { INotification } from '../domain/interfaces';

/**
 * E-posta kanalı üzerinden bildirim gönderimini sağlayan uygulama servis sınıfı.
 */
export class EmailNotification implements INotification {
  /**
   * Belirtilen alıcıya e-posta gönderir.
   * @param message Gönderilecek mesaj içeriği
   * @param to Alıcının e-posta adresi
   */
  send(message: string, to: string): void {
    console.log(`Email kanalından ${to} kişisine bildirim gönderildi: ${message}`);
  }
}

/**
 * SMS kanalı üzerinden bildirim gönderimini sağlayan uygulama servis sınıfı.
 */
export class SMSNotification implements INotification {
  /**
   * Belirtilen alıcıya SMS gönderir.
   * @param message Gönderilecek mesaj içeriği
   * @param to Alıcının telefon numarası
   */
  send(message: string, to: string): void {
    console.log(`SMS kanalından ${to} kişisine bildirim gönderildi: ${message}`);
  }
}

/**
 * Push (Anlık) bildirim kanalı üzerinden bildirim gönderimini sağlayan uygulama servis sınıfı.
 */
export class PushNotification implements INotification {
  /**
   * Belirtilen alıcıya push bildirimi gönderir.
   * @param message Gönderilecek mesaj içeriği
   * @param to Alıcının cihaz/kullanıcı kimliği
   */
  send(message: string, to: string): void {
    console.log(`Push kanalından ${to} kişisine bildirim gönderildi: ${message}`);
  }
}
