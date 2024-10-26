import { CircleArrowRight, Files, Settings } from 'lucide-react';
import Image from 'next/image';

export default function About() {
  return (
    <section className="py-32">
      <div className="container flex flex-col gap-28">
        <div className="flex flex-col gap-7">
          <h1 className="text-4xl font-semibold lg:text-7xl">
            Bringing the future of attendance to everyone</h1>
          <p className="max-w-xl text-lg">
            Attendify makes it easy to automate attendance management in educational institutions. With RFID-based technology, you can track attendance seamlessly and securely in seconds, saving time and reducing manual errors.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Image
            src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder"
            width={500}
            height={500}
            className="size-full max-h-96 rounded-2xl object-cover"
          />
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10">
            <p className="text-sm text-muted-foreground">OUR MISSION</p>
            <p className="text-lg font-medium">
              We believe that attendance tracking should be effortless and reliable. Our mission is to empower institutions with smart tools that eliminate paperwork, promote accountability, and enhance the overall experience for both students and educators.</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 md:gap-20">
          <div className="max-w-xl">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              We make tracking attendance incredibly simple</h2>
            <p className="text-muted-foreground">
              Our goal is to help schools and institutions transform their attendance process into a fully automated system. Here’s how we plan to achieve it.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Files className="size-5" />
              </div>
              <h3 className="mb-3 mt-2 text-lg font-semibold">
                Efficient automation
              </h3>
              <p className="text-muted-foreground">
                No more manual sign-ins. Students scan their RFID cards, and the system logs their attendance instantly.</p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                <CircleArrowRight className="size-5" />
              </div>
              <h3 className="mb-3 mt-2 text-lg font-semibold">
                Scalable solutions</h3>
              <p className="text-muted-foreground">
                Whether for small classes or large institutions, Attendify scales to meet the needs of your organization without hassle.              </p>
            </div>
            <div className="flex flex-col">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                <Settings className="size-5" />
              </div>
              <h3 className="mb-3 mt-2 text-lg font-semibold">
                Empowering educators
              </h3>
              <p className="text-muted-foreground">
                With real-time insights, teachers can focus on teaching while the system takes care of tracking and reporting.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


