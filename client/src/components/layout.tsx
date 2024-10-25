import { Outlet } from "react-router-dom";

function LayoutPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Outlet />
      <div id="photo-picker-element"></div>
    </div>
  );
};

export default LayoutPage;
