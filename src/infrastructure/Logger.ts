export class Logger {
  // Sınıfın tekil örneğini tutacak statik değişken
  private static instance: Logger;

  // Dışarıdan 'new Logger()' denerek yeni nesne üretilmesini engellemek için constructor private yapılır.
  private constructor() {}

  // Sistemin her yerinden bu metoda ulaşılarak hep AYNI nesne çağırılır.
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Konsola log yazdırma fonksiyonumuz
  public log(message: string): void {
    const time = new Date().toLocaleTimeString();
    console.log(`[Sistem Log - ${time}] : ${message}`);
  }
}