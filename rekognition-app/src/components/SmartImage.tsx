import React from "react";
import Image from "next/image";

type SmartImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export const SmartImage = React.memo(function SmartImage({ src, alt, width, height, className }: SmartImageProps) {
  const isSignedUrl = typeof src === "string" && src.includes("X-Amz-Signature");

  if (isSignedUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      style={{ objectFit: "cover" }}
    />
  );
});
