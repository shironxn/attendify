**Attendify** adalah proyek *P5* dengan tema **Rekayasa Teknologi** yang bertujuan untuk mempermudah proses presensi dan pencatatan data kehadiran siswa di sekolah. Nama *Attendify* diambil dari kata *attendance*, yang berarti kehadiran. Proyek ini menggunakan **sensor RFID PN532**, yang memanfaatkan teknologi **radio frequency** untuk membaca data dari kartu RFID sebagai media presensi.

### **Getting Started**

1. **Clone repository**  
   Jalankan perintah berikut untuk mengunduh repositori:  
   ```bash
   git clone https://github.com/shironxn/attendify
   cd attendify
   ```

2. **Setup environment variable**  
   Salin file contoh konfigurasi dan sesuaikan dengan kebutuhan:  
   ```bash
   cp .env.example .env
   ```

3. **Run the application**  
   Jalankan aplikasi menggunakan Docker Compose:  
   ```bash
   docker compose up -d
   ```
