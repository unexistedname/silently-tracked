import kuroma from "./../assets/media/pg-1.png";
import "./Home.css";
export default function Home() {
  return (
    <div className="text-5xl font-bold text-kinda-white overflow-hidden">
      <section
        className="relative min-w-screen min-h-screen bg-no-repeat bg-contain overflow-hidden"
        style={{ backgroundImage: `url(${kuroma})` }}
      > {/* Image */}
        <div className="text-right min-h-screen flex flex-col justify-center pr-24 title"> {/* Text Content */}
          <div className="text-[18rem] z-10"> {/* Main Title */}
            <span className="title-bg">Kuroma</span>
            <div>
              <span className="title-bg">Web </span>
              <span className="hover:underline cursor-pointer select-none">
                V1
              </span>
            </div>
          </div>
          <div className="font-monospace text-4xl font-medium mt-12 cursor-pointer select-none"> {/* Subtitle */}
            &gt; Those who seeks the&nbsp;
            <span className="text-kinda-black bg-kinda-white hover:underline ">
              update
            </span>
          </div>
        </div>
      </section>

      <div>Jelo</div>
    </div>
  );
}
