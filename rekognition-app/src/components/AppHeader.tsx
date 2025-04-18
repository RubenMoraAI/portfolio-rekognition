import Image from "next/image";
import React from "react";

function AppHeader() {
  return (
    <header className="mb-8 text-center">
      <Image
        className="mx-auto mb-4"
        src="/favicon.png"
        alt="Face Recognition Logo"
        width={100}
        height={100}
      />
      <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] mb-4">
        Face Recognition
      </h1>
      <p className="text-xl text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
        Upload images, detect faces, and filter by people
      </p>
    </header>
  );
}

export default React.memo(AppHeader);
