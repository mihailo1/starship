import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
const Particles = dynamic(
  () => import("./Particles"),
  { ssr: false }
);

const ParticlesBackground = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return <>
      {isMounted && createPortal(
        <Particles />, 
        document.body
      )}
      </>
}

export default ParticlesBackground;