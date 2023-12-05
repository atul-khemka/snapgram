import BottonBar from "@/components/shared/BottonBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import TopBar from "@/components/shared/TopBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <TopBar />
      <LeftSidebar />
      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>
      <BottonBar />
    </div>
  );
};

export default RootLayout;
