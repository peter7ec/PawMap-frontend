import CountDown from "../components/CountDown";
import offlinePageImg from "../assets/offlinePageImg.png";

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 px-4 py-12 md:flex-row md:gap-20">
      <div className="p-4 rounded-2xl shadow-lg flex justify-center">
        <img
          src={offlinePageImg}
          alt="Offline illustration"
          className=" max-w-xs h-auto rounded-xl "
        />
      </div>
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-black  text-center">
          🐾 PawMap is launching soon!
        </h1>
        <CountDown />
        <p className="mt-6 text-lg font-semibold text-gray-800 text-center px-2 leading-snug">
          We are not just building a website, but a pet-friendly community. 🐶🐱
        </p>
      </div>
    </div>
  );
}
