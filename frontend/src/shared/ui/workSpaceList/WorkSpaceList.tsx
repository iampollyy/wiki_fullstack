import { Workspace } from "@entities/workspace/Workspace";
import { IWorkSpace } from "@entities/workspace/model/workspage";
import styles from "./workSpaceList.module.scss";
import { useState } from "react";

export const WorkSpaceList = ({ workspaces }: { workspaces: IWorkSpace[] }) => {
  return (
    <ul className={styles.workSpaceList}>
      {workspaces.map((workspace) => (
        <li key={workspace.id}>
          <Workspace workspace={workspace} />
        </li>
      ))}
    </ul>
  );
}