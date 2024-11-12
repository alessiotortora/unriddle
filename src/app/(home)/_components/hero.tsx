function Hero() {
  return (
    <div className="rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-4 text-3xl font-bold">
        The better way to schedule your meetings
      </h1>
      <p className="text-gray-600">
        A seamless, fully customizable scheduling experience...
      </p>
      <div className="mt-6 flex gap-4">
        <button className="rounded-md bg-black px-4 py-2 text-white">
          Sign up with Google
        </button>
        <button className="rounded-md bg-gray-200 px-4 py-2 text-black">
          Sign up with email
        </button>
      </div>
    </div>
  );
}

export default Hero;
