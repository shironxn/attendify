import { IdCardIcon } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto py-32">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1>About</h1>
          <p>
            Attendify adalah solusi modern untuk pelacakan kehadiran berbasis teknologi yang dirancang untuk memenuhi kebutuhan institusi pendidikan dan perusahaan.
            Dengan fitur yang mudah digunakan, platform ini memungkinkan manajemen kehadiran secara real-time, meminimalkan kesalahan manual, dan meningkatkan efisiensi operasional.
            Selain itu, Attendify juga mendukung integrasi dengan berbagai perangkat IoT untuk memberikan pengalaman yang lebih canggih dan fleksibel.
          </p>
        </div>
        <div className="flex justify-center items-center bg-muted rounded-2xl p-8">
          <IdCardIcon className="w-16 h-16" />
        </div>
      </div>
    </div>
  );
};

