import React from "react";
import { ImagesSlider } from "../../../components/ui/images-slider";
import { motion } from "motion/react";
import img01 from "../../../assets/imgBG/img1.jpg";
import img02 from "../../../assets/imgBG/img2.jpg";
import img03 from "../../../assets/imgBG/img3.jpg";
import img04 from "../../../assets/imgBG/img4.jpg";
import img05 from "../../../assets/imgBG/img5.jpg";
import img06 from "../../../assets/imgBG/img6.jpg";

const images = [img01, img02, img03, img04, img05, img06];

const ImageHeader = ({}) => {
  return (
    <ImagesSlider className="h-[45rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-3xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-primery py-4">
          Your journey starts with <br />
          <span
            className={`bg-clip-text text-transparent bg-gradient-to-b from-primery to-primary`}
          >
            GlobePeek.
          </span>
        </motion.p>
        <button
          className="
          appearance-none border border-text-white border-opacity-100 rounded-[0.9375em] mt-10
          box-border text-white cursor-pointer inline-block bg-transparent
          font-[Roobert,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol']
          text-base font-semibold leading-normal m-0 min-h-[3.75em] min-w-0
          outline-none py-4 px-[2.3em] text-center no-underline
          transition-all duration-300 ease-[cubic-bezier(.23,1,0.32,1)] select-none
          touch-manipulation will-change-transform
          hover:text-white hover:bg-[#1A1A1A] hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)] hover:-translate-y-0.5
          active:shadow-none active:translate-y-0
          disabled:pointer-events-none
        "
        >
          Discover
        </button>
      </motion.div>
    </ImagesSlider>
  );
};

export default ImageHeader;
