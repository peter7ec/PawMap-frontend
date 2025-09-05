import { Facebook, Instagram, X } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="flex flex-col md:flex-row mt-30 gap-4 justify-center">
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg py-2 px-4 shadow-sm transition cursor-pointer"
        aria-label="Facebook"
      >
        <Facebook size={32} />
        <span>PawMapCommunity</span>
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-pink-500 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-lg py-2 px-4 shadow-sm transition cursor-pointer"
        aria-label="Instagram"
      >
        <Instagram size={32} />
        <span>@PawMap</span>
      </a>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-white hover:text-white bg-black hover:bg-blue-400 rounded-lg py-2 px-4 shadow-sm transition cursor-pointer"
        aria-label="X (Twitter)"
      >
        <X size={32} />
        <span>@PawMap</span>
      </a>
    </div>
  );
}
