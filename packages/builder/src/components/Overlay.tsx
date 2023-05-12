import React from "react";
import { Link, Outlet, useOutletContext } from "react-router-dom";

export default function Overlay() {
  const context = useOutletContext();
  return (
    <div className="fixed h-screen w-screen top-0 left-0 bg-slate-100/75 bg-blend-lighten dark:bg-slate-800/75">
      <div className="container max-w-3xl max-h-screen md:h-auto h-screen drop-shadow-xl border overflow-auto md:mt-10 mx-auto bg-white  p-4 rounded dark:bg-slate-800 dark:border-slate-600">
        <Link className="dark:text-white" to="..">
          Back
        </Link>
        <Outlet context={context} />
      </div>
    </div>
  );
}
