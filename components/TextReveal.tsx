"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TextReveal from "text-reveal";

export default function Reveal() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window) setLoaded(true);
  }, []);

  return (
    <div className="text-5xl font-bold flex flex-col justify-center max-lg:px-12 items-center gap-16 max-xl:text-3xl max-lg:text-2xl max-md:text-3xl max-md:px-3 leading-16 pb-">
      {loaded && (
        <div className="w-full font-extrabold space-y-16 max-lg:w-full">
          <div className="max-md:hidden space-y-6">
            <TextReveal
              text={[
                "It's a symptom-to-resolution system",
                "that delivers diagnosis and",
                "prescription medicines and lab",
                "tests in one flow.",
              ]}
              fillDelay={50}
              fillSpeed={200}
              fillDirection="left-right"
              fillType="scroll"
              textColor="#00000030"
              fillColor="#000"
            />
            <TextReveal
              text={[
                "Just share your symptoms",
                "A real doctor will",
                "send a prescription on",
                "WhatsApp within ten minutes",
              ]}
              fillDelay={50}
              fillSpeed={200}
              fillDirection="left-right"
              fillType="scroll"
              textColor="#00000030"
              fillColor="#000"
            />
            <div className="text-4xl font-thin">
              <TextReveal
                text={[
                  "No booking appointment",
                  "No waiting",
                  "No new app download",
                ]}
                fillDelay={60}
                fillSpeed={200}
                fillDirection="left-right"
                fillType="scroll"
                textColor="#00000030"
                fillColor="#6a38d7"
              />
            </div>
          </div>
          <div className="hidden max-md:block">
            <TextReveal
              text={[
                "At Gacsym, ",
                "we seek strong ideas",
                "backed by dedicated",
                "founding teams",
                "with robust",
                "Go-To-Market (GTM) ",
                "strategies",
                "who need technical ",
                "and development.",
                " expertise",
              ]}
              fillDelay={0}
              fillSpeed={100}
              fillDirection="left-right"
              fillType="scroll"
              textColor="#00000030"
              fillColor="black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
