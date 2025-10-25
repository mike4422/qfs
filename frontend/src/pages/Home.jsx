import { motion } from "framer-motion";
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import PartnersCarousel from '../components/PartnersCarousel'
import Services from "../components/Services.jsx";
import AboutQFS from "../components/AboutQFS.jsx";
import ISO20022 from "../components/ISO20022.jsx";
import WhatWeDo from "../components/WhatWeDo.jsx";
import LatestNews from "../components/LatestNews.jsx";
import ContactSection from "../components/ContactSection";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // 1s initial delay before the whole page reveals
      delay: 0.2,
      // stagger each child by 0.2s
      staggerChildren: 0.2,
      // ease on the parent opacity
      ease: "easeOut",
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home(){

  return (
    <>
      <motion.main
      variants={container}
      initial="hidden"
      animate="visible"
      // reduce motion preference (nice touch for accessibility)
      style={{ willChange: "opacity, transform" }}
    >
      <motion.div variants={item}><Hero /></motion.div>

      <motion.div variants={item}><Services /></motion.div>

     <motion.div variants={item}><AboutQFS /></motion.div>

      <motion.div variants={item}><PartnersCarousel /></motion.div>

      <motion.div variants={item}><ISO20022 /> </motion.div>

      <motion.div variants={item}><WhatWeDo /></motion.div>

       <motion.div variants={item}><LatestNews /></motion.div>

        <motion.div variants={item}><ContactSection /></motion.div>

        </motion.main>

    </>
  )
}