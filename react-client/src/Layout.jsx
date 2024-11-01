import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>Header</header>
            {/* all the other elements */}
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}