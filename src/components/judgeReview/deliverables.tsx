function Deliverables() {
  return (
    <form className="space-y-4">
      <input
        type="text"
        className="w-full p-1.25 text-[#8F9098] rounded-lg border border-[#C5C6CC]"
        placeholder="GitHub repository URL"
      />
      <input
        type="text"
        className="w-full p-1.25 text-[#8F9098] rounded-lg border border-[#C5C6CC]"
        placeholder="Demo video URL"
      />
      <input
        type="text"
        className="w-full p-1.25 text-[#8F9098] rounded-lg border border-[#C5C6CC]"
        placeholder="Presentation slides URL"
      />
    </form>
  );
}

export default Deliverables;
