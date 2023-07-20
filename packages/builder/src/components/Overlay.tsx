import React from "react";
import { Link, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";

export default function Overlay() {
  const context = useOutletContext();
  const navigate = useNavigate();
  return (
    <Dialog.Root
      open={true}
      onOpenChange={() => {
        navigate("..");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed h-screen w-screen top-0 left-0 bg-slate-100/75 bg-blend-lighten dark:bg-slate-800/75" />
        <Dialog.Content className="container fixed top-20 left-1/4 max-w-screen-md max-h-screen md:h-auto h-screen drop-shadow-xl border overflow-auto  mx-auto bg-white p-4 rounded dark:bg-slate-800 dark:border-slate-600">
          <Link className="dark:text-white" to="..">
            Back
          </Link>
          <Outlet context={context} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
