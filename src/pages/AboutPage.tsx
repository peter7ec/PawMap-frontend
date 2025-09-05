import aboutPageImage from "../assets/aboutPageIMG.webp";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row items-center bg-indigo-50/80 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative w-full md:w-auto flex-shrink-0 flex justify-center md:justify-end">
          <img
            src={aboutPageImage}
            alt="Team at the project kickoff"
            className="w-48 sm:w-60 md:w-72 lg:w-80 rounded-2xl shadow-lg border-4 border-indigo-100  md:mt-5 md:ml-[-32px] bg-white"
          />

          <span className="hidden md:block absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            Teamwork ❤️
          </span>
        </div>

        <div className="flex-1 text-center md:text-left p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-indigo-700 flex items-center justify-center md:justify-start gap-1">
            Meet Our Team
            <span role="img" aria-label="Alien">
              👾
            </span>
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-700">
            Here’s our team! We work together like a well-oiled machine—
            <span className="text-indigo-500 font-semibold italic">
              if that machine was powered by coffee, memes, and last-minute bug
              fixes
            </span>
            .<br />
            <br />
            Teamwork brings out our best ideas—or at least, our funniest
            arguments. We believe every website can bring people together, and
            nothing unites a team more than a looming deadline. <br />
            <br />
            <span className="text-red-400 font-bold">
              Web development’s dark side?
            </span>
            Mysterious bugs, cryptic error messages, and those one-letter-off
            Tailwind classes you never notice.
            <span className="text-green-600 font-semibold">
              <br />
              But we face every challenge with a smile!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
