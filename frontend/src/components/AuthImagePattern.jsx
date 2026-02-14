import { Sparkles } from "lucide-react";

const AuthImagePattern = ({ title, subtitle }) => {
  const images = [
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100249/5_yafato.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100250/8_jhexoz.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100250/9_znqfnz.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100250/4_hofssn.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100250/6_ftkxnb.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100250/2_n5v4ft.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100250/1_jlfzgq.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100251/7_oywwqc.jpg",
    "https://res.cloudinary.com/dtlg9jtme/image/upload/v1771100252/3_tvagkf.jpg",
  ];

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative group aspect-square rounded-2xl overflow-hidden transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              <img
                src={img}
                alt="Pattern"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              {/* Hover inciting overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5 opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <div className="bg-base-100/80 backdrop-blur-sm p-2 rounded-full shadow-sm border border-primary/10">
                  <Sparkles className="size-4 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">{title}</h2>
        <p className="text-base-content/60 text-lg leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
