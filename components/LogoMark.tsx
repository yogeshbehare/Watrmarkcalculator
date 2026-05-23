import Image from "next/image";

export function LogoMark() {
  return (
    <div className="flex items-center">
      <Image
        src="/watrmark-logo.png"
        alt="Watrmark - Print Your Mark"
        width={320}
        height={107}
        priority
        className="h-auto w-44 sm:w-56"
      />
    </div>
  );
}
