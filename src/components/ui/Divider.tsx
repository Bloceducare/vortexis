export default function Divider({ children }: any) {
  return (
    <div className="xs:mb-12 flex items-center md:mb-4">
      <div className="flex-grow border-b border-gray-300"></div>
      <span className="mx-4 text-gray-500">{children}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
}
