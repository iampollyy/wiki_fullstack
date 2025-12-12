import { Workspace } from "@entities/workspace/Workspace";
import { IWorkSpace } from "@entities/workspace/model/workspage";
import styles from "./workSpaceList.module.scss";
import { useNavigate } from "react-router-dom";

export const WorkSpaceList = ({ workspaces }: { workspaces: IWorkSpace[] }) => {
  const navigate = useNavigate();

  return (
    <ul className={styles.workSpaceList}>
      {workspaces.map((workspace) => (
        <li key={workspace.id}>
          <Workspace
            navigate={() => navigate(`/workspace/${workspace.slug}`)}
            workspace={workspace}
          />
        </li>
      ))}
    </ul>
  );
};
