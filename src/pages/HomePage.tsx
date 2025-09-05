import { Search } from "lucide-react";
import { Link } from "react-router";
import SocialLinks from "../components/socialLinks";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white flex flex-col items-center p-6 ">
      <header className="mb-8 text-center max-w-xl">
        <h1 className="font-extrabold text-green-700 text-4xl md:text-5xl mb-2">
          Welcome on PawMap
        </h1>
        <h2 className="text-gray-700 text-lg md:text-xl font-semibold">
          Not the first but the newest
          <span className="text-green-600 font-extrabold ml-2 mr-2">
            PET-friendly
          </span>
          community in Hungary!
        </h2>
      </header>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8">
        <div className="bg-white shadow-lg rounded-xl border border-green-200 p-6 flex-1">
          <h3 className="text-green-700 text-2xl font-bold mb-3">
            New here? Paws and relax!
          </h3>
          <p className="text-gray-600 mb-5">
            Take a break, sniff around, and join our furry family!
          </p>
          <nav className="flex flex-col space-y-3">
            <Link
              to="/search"
              className="text-center bg-green-400 text-white rounded-lg py-3 font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4 mr-2" />
              Sniff Around!
            </Link>
            <Link
              to="/registration"
              className="text-center border border-green-400 text-green-600 rounded-lg py-3 font-semibold hover:bg-green-50 transition"
            >
              Join the Pack as a Creator!
            </Link>
          </nav>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-green-200 p-6 flex-1 text-center">
          <h4 className="text-green-700 text-xl font-bold mb-2">
            Back for more tail wags?
          </h4>
          <p className="text-gray-600 mb-10">
            Welcome back! Time for some belly rubs and new adventures!
          </p>
          <Link
            to="/login"
            className="text-green-600 font-bold hover:underline text-xl"
          >
            Hop In the Kennel 🐾
          </Link>
        </div>
      </div>
      <SocialLinks />
    </div>
  );
}
