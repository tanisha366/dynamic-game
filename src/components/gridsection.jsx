import { useContext } from "react";
import Hero from "./hero";
import TextPressure from "./textpressure.jsx";
import { Appcontext } from "../appcontext.jsx";

function Gridsection() {
  let{active,setactive}=useContext(Appcontext)
  return (
    <div className="mt-20 p-2  text-white   absolute inset-0  grid grid-cols-6">
      <div className="flex justify-between flex-col gap-35 ">
        <div className=" underline-animate w-fit"  onMouseEnter={() => setactive("one")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative"}}>
        ARTWORK CATEGORIES
        </div>

        <div className=" underline-animate w-fit " onMouseEnter={() => setactive("two")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative" }}>
         OUR NEW ARTISTS 
        </div>
        <div className=" underline-animate w-fit " onMouseEnter={() => setactive("three")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative"}}>
          TODAY'S FEATURED ART
        </div>
      </div>
      <div className="col-span-4 flex flex-col  justify-center items-center gap-5">
        <div className=" underline-animate w-fit " onMouseEnter={() => setactive("four")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative" }}>
         MOST VISITED ARTISTS 
        </div>
        <div className="flex-1 flex  justify-center items-center w-full ">
          <Hero></Hero>
        </div>
        
        <div className="underline-animate w-fit" onMouseEnter={() => setactive("five")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative"}}>
          WHAT CUSTOMERS SAY
        </div>
      </div>

      <div className="flex justify-between text-end flex-col gap-35 ">
        <div className=" underline-animate-i  " onMouseEnter={() => setactive("six")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative" }}>
         ARTWORK COLLECTIONS 
        </div>
        <div className=" underline-animate-i  " onMouseEnter={() => setactive("seven")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative" }}>
          ARTWORK AS PER STYLE
        </div>
        <div className=" underline-animate-i  " onMouseEnter={() => setactive("eight")}
      onMouseLeave={() => setactive("none")} style={{ position: "relative" }}>
          CONTEST WINNER
        </div>
      </div>
    </div>
  );
}

export default Gridsection;