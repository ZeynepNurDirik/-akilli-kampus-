import type { INotification } from '../domain/interfaces';
import { Logger } from '../infrastructure/Logger';
import { EmailNotification, SMSNotification, PushNotification } from './Notifications';

/**
 * NotificationFactory sınıfı, Fabrika (Factory Method) tasarım örüntüsünü uygulayarak
 * istenen bildirim tipine göre dinamik olarak ilgili bildirim sınıfının örneğini oluşturur.
 */
export class NotificationFactory {
  /**
   * Belirtilen bildirim tipine uygun INotification somut nesnesini üretir.
   * Üretim öncesinde Singleton Logger ile log kaydı alır.
   * @param type Üretilecek bildirim tipi ('EMAIL' | 'SMS' | 'PUSH')
   * @returns Üretilen INotification somut sınıf örneği
   */
  public static createNotification(type: 'EMAIL' | 'SMS' | 'PUSH'): INotification {
    // Üretim yapmadan hemen önce infrastructure katmanındaki Singleton Logger çağrılarak loglanıyor
    Logger.getInstance().log(`${type} tipinde bildirim nesnesi üretildi`);

    switch (type) {
      case 'EMAIL':
        return new EmailNotification();
      case 'SMS':
        return new SMSNotification();
      case 'PUSH':
        return new PushNotification();
      default:
        throw new Error(`Desteklenmeyen bildirim tipi: ${type}`);
    }
  }
}
