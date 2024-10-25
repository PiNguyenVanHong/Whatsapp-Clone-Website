import logo from "@/assets/whatsapp-logo.gif";

function EmptyPage() {
  return (
    <div className="basis-2/3 border flex flex-col items-center justify-center border-b-4 border-b-emerald-600">
      <div className="w-44 rounded-md shadow-emerald-500 drop-shadow-lg">
        <img src={logo} alt="Whatsapp Logo" />
      </div>
    </div>
  );
}

export default EmptyPage;
