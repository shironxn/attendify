import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 items-center min-h-screen justify-center">
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
        <p >
          Easily track attendance with just one tap using our RFID technology.
          Get a fast and accurate attendance experience for an efficient school environment!
        </p>

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
  );
}

