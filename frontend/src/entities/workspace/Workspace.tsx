import { IWorkSPace } from "./model/workspage";
import styles from "./workSpace.module.scss";

export const Workspace = ({ workspace }: { workspace: IWorkSPace }) => {
  return (
    <>
      <div className={styles.workspace}>{workspace.name}</div>
    </>
  );
};
