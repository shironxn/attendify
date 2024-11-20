import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BotIcon, CircleCheckIcon, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const faqs = [
  {
    question: 'Apa itu Attendify dan apa fungsinya?',
    answer:
      'Attendify adalah platform yang dirancang untuk mempermudah pencatatan kehadiran di sekolah, tempat kerja, atau acara. Platform ini menyediakan cara yang efisien untuk merekam, mengelola, dan meninjau data kehadiran secara real-time.',
  },
  {
    question: 'Bagaimana Attendify meningkatkan pengelolaan kehadiran?',
    answer:
      'Attendify menyederhanakan proses pencatatan kehadiran dengan mengotomatiskan pengumpulan data menggunakan teknologi RFID. Hal ini menghilangkan kesalahan manual dan memastikan laporan yang akurat bagi administrator dan pengguna.',
  },
  {
    question: 'Apakah Attendify bisa terintegrasi dengan sistem yang sudah ada?',
    answer:
      'Ya, Attendify dirancang untuk dapat terintegrasi dengan sistem manajemen sekolah atau perusahaan yang sudah ada, sehingga mudah diadopsi tanpa mengganggu alur kerja yang ada.',
  },
  {
    question: 'Apakah Attendify aman untuk mengelola data sensitif?',
    answer:
      'Tentu saja. Attendify menggunakan enkripsi yang kuat dan penyimpanan data yang aman untuk memastikan informasi sensitif terlindungi dan hanya dapat diakses oleh pihak yang berwenang.',
  },
];

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 items-center min-h-screen justify-center container" data-aos="zoom-out">
        <div className="hidden md:block">
          <Image
            src={"/card.svg"}
            alt="Attendify Illustration"
            width={400}
            height={400}
          />
        </div>

        <div className="text-center md:text-left">
          <h1 >Welcome To Attendify</h1>
          <p>Lacak kehadiran menjadi lebih mudah! Cukup satu ketukan dengan teknologi RFID, kehadiran langsung tercatat dengan cepat dan akurat.</p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <Link href={"/demo"}>
              <Button size={"lg"}>Demo</Button>
            </Link>
            <Link href={"/about"}>
              <Button variant={"outline"} size={"lg"}>About</Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="py-32">
        <div className="container flex flex-col gap-28">
          <div className="flex flex-col gap-7">
            <h1 className="text-4xl font-semibold lg:text-7xl" data-aos="fade-up">
              Mencatat Kehadiran Menjadi Lebih Mudah
            </h1>
            <p className="max-w-xl text-lg" data-aos="fade-up">
              Attendify mempermudah pengelolaan presensi secara cepat dan otomatis. Dengan teknologi berbasis RFID, Anda dapat melacak kehadiran secara cepat, aman, dan efisien hanya dalam hitungan detik, menghemat waktu sekaligus mengurangi kesalahan manual.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Image
              src="/cards.svg"
              alt="placeholder"
              width={500}
              height={500}
              className="size-full max-h-96 rounded-2xl object-cover"
              data-aos="fade-right"
            />
            <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10" data-aos="fade-up">
              <p className="text-sm text-muted-foreground">VISI KAMI</p>
              <p className="text-lg font-medium">
                Kami percaya bahwa pencatatan kehadiran harus mudah dan dapat diandalkan. Misi kami adalah memberdayakan organisasi dengan alat cerdas yang menghilangkan pekerjaan administratif, meningkatkan akuntabilitas, dan menciptakan pengalaman yang lebih baik bagi semua pihak yang terlibat.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:gap-20">
            <div className="max-w-xl">
              <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl" data-aos="fade-up">
                Presensi Menjadi Sangat Mudah
              </h2>
              <p className="text-muted-foreground" data-aos="fade-up">
                Kami membantu membuat proses presensi sepenuhnya otomatis dan efisien. Berikut langkah-langkah yang kami lakukan untuk mencapainya.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3" data-aos="fade-up">
              <div className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <BotIcon className="size-5" />
                </div>
                <h3 className="mb-3 mt-2 text-lg font-semibold">
                  Otomatisasi Yang Efisien
                </h3>
                <p className="text-muted-foreground">
                  Tidak perlu lagi mencatat secara manual. Cukup pindai kartu RFID, dan kehadiran tercatat secara real-time.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <CircleCheckIcon className="size-5" />
                </div>
                <h3 className="mb-3 mt-2 text-lg font-semibold">
                  Solusi Yang Fleksibel
                </h3>
                <p className="text-muted-foreground">
                  Cocok untuk berbagai kebutuhan, sistem kami mudah disesuaikan tanpa kesulitan.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                  <Settings className="size-5" />
                </div>
                <h3 className="mb-3 mt-2 text-lg font-semibold">
                  Kemudahan Dalam Pengelolaan
                </h3>
                <p className="text-muted-foreground">
                  Dapatkan wawasan kehadiran secara real-time, sehingga Anda bisa lebih fokus pada hal yang penting.
                </p>
              </div>
            </div>
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="mb-10 text-sm font-medium text-muted-foreground">
                  ATTENDIFY
                </p>
                <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl" data-aos="fade-up">
                  Lacak Kehadiran Secara Efisien
                </h2>
                <p className="text-muted-foreground" data-aos="fade-up">
                  Menyederhanakan sistem absensi Anda hanya dalam satu klik. Kami hadir untuk mendukung inovasi dan memberikan solusi pelacakan kehadiran yang cepat, akurat, dan andal. Bergabunglah untuk menciptakan perubahan yang berarti!
                </p>
              </div>
              <div>
                <Image
                  src="/search.svg"
                  width={500}
                  height={500}
                  alt="placeholder"
                  className="mb-6 w-full rounded-xl object-cover"
                  data-aos="fade-left"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="container">
          <div className="text-center" data-aos="fade-up">
            <Badge className="text-xs font-medium">FAQ</Badge>
            <h1 className="mt-4 text-4xl font-semibold" >
              Frequently Asked Questions
            </h1>
            <p className="mt-6 font-medium text-muted-foreground max-w-xl mx-auto">
              Temukan semua detail penting tentang platform kami dan bagaimana platform tersebut dapat memenuhi kebutuhan Anda.
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-screen-sm">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-8 flex gap-4" data-aos="fade-up">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
                  {index + 1}
                </span>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{faq.question}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

