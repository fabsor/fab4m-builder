import { tailwind } from "@fab4m/fab4m";

export default {
  h2: "text-3xl font-bold mb-4 dark:text-gray-200",
  item: "text-xl font-bold mb-2 border px-4 py-2 bg-slate-100 rounded border-slate-300 dark:border-slate-500 hover:bg-slate-200 flex dark:bg-slate-700 dark:border-slate-500 dark:text-gray-200 dark:hover:bg-slate-600",
  insetBtn:
    "border text-l h-fill bg-slate-300 dark:bg-slate-700 dark:text-gray-200 dark:border-slate-400 p-1 px-2 rounded hover:bg-slate-900",
  shadowItem: "bg-slate-300 h-10 rounded mb-2",
  primaryBtn: `${tailwind.classes.submitButton} dark:border-emerald-600 border`,
};
