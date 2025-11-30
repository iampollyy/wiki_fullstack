import { IWorkSpace } from "./model/workspage";
import styles from "./workSpace.module.scss";

export const Workspace = ({ workspace }: { workspace: IWorkSpace }) => {
  return (
    <>
      <div className={styles.workspace}>{workspace.name}</div>
    </>
  );
};
