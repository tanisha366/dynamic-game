import Hero from "../components/hero";
import Particles from "../components/gridscan.jsx";
import Navbar from "../Navbar.jsx";
import Gridsection from "../components/gridsection.jsx";
import LightRays from "../components/ray.jsx";
import Beams from "../components/beam.jsx";
import { useEffect } from "react";



function Main() {

  useEffect(()=>{
    document.body.style.overflow='hidden'
    return ()=>{
document.body.style.overflow='unset'
    }
  },[])
  return (
    <div className=" min-h-screen bg-black  ">
      <div className=" w-screen   flex justify-center items-center" style={{  position: "relative" }}>
        {/* <Particles
          particleColors={["#ffffff"]}
          particleCount={700}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        /> */}
    
          <LightRays
    raysOrigin="top-center"
    raysColor="#ffffff"
    raysSpeed={3}
    lightSpread={1}
    rayLength={1}
    followMouse={true}
    mouseInfluence={0.5}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
/>
 {/* <Beams
    beamWidth={1.2}
    beamHeight={30}
    beamNumber={20}
    lightColor="#ffffff"
    speed={4.1}
    noiseIntensity={1.75}
    scale={0.2}
    rotation={30}
  /> */}
      </div>
    
<div className="  flex justify-end items-center">
  <Gridsection ></Gridsection>  
</div>

    </div>
  );
}

export default Main;
