import React from "react";
import {
  ActionFunction,
  redirect,
  useParams,
  Form,
  Link,
} from "react-router-dom";
import invariant from "tiny-invariant";
import { findComponentFromKey, findKey, invariantReturn } from "../util";
import { ActionCreatorArgs } from "../router";
import styles from "../styles";
import t from "../translations";
import { useFormBuilderContext } from ".";

export function action({ storage }: ActionCreatorArgs): ActionFunction {
  return async (args) => {
    const form = await storage.loadForm(args);
    const data = await args.request.formData();
    const keyToDelete = invariantReturn(data.get("delete")).toString();
    const [sourceList, sourceIndex] = findKey(form.components, keyToDelete);
    if (sourceList) {
      sourceList.splice(sourceIndex, 1);
    }
    await storage.saveForm(form, args);
    return redirect("../..");
  };
}

export default function DeleteComponent() {
  const { form } = useFormBuilderContext();
  const params = useParams<{ component: string }>();
  invariant(params.component);
  const component = findComponentFromKey(form.components, params.component);
  return (
    <Form method="post">
      <p className="mb-2 dark:text-slate-200">
        {t("confirmRemoveComponent", {
          component: invariantReturn(component.label ?? component.name),
        })}
      </p>
      <div className="flex">
        <button
          className={styles.dangerBtn}
          name="delete"
          value={params.component}
        >
          {t("delete")}
        </button>
        <Link className={"ml-4 my-auto text-blue-600"} to="../..">
          {t("cancel")}
        </Link>
      </div>
    </Form>
  );
}
