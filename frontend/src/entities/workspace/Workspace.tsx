import { IWorkSpace } from "./model/workspage";
import styles from "./workSpace.module.scss";

export const Workspace = ({
  workspace,
  navigate,
}: {
  workspace: IWorkSpace;
  navigate?: () => void;
}) => {
  return (
    <>
      <div className={styles.workspace} onClick={navigate}>
        {workspace.name}
      </div>
    </>
  );
};
