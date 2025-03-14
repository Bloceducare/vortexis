export default function Input({
  type = "text",
  placeholder = "",
  id,
  icon = "one",
}: any) {
  return (
    <input
      className={`${
        icon !== "one" ? "pr-10" : ""
      } input-border focus:input-border mt-1 min-w-[99%] rounded-2xl border-2 py-1 pl-10 outline-none`}
      type={type}
      placeholder={placeholder}
      id={id}
    />
  );
}
