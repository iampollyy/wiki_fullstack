import { Button } from "@shared/ui/button/Button";
import styles from "./home.module.scss";
import { useNavigate } from "react-router-dom";
import { WorkSpaceList } from "@shared/ui/workSpaceList/WorkSpaceList";
import { IWorkSpace } from "@entities/workspace/model/workspage";
import { useEffect, useState } from "react";
import { apiFetch } from "@shared/utils/fetch";

export const Home = () => {
  const [workspaces, setWorkspaces] = useState<IWorkSpace[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const response = await apiFetch("workspaces");
        const data = await response.json();
        const workspacesArray = Array.isArray(data) ? data : [];
        setWorkspaces(workspacesArray);
      } catch (error) {
        console.error("Failed to load workspaces:", error);
      }
    };

    loadWorkspaces();
  }, []);

  const onGoToArticlesClick = () => {
    navigate("/articles");
  };

  return (
    <section className={styles.home}>
      <h1 className="sr-only">Home Page</h1>

      <section className={styles.home__page}>
        <h2 className="sr-only" id="searchRes">
          Search Results
        </h2>

        <div className={styles.home__images}>
          <img src="/src/assets/icons/logo.svg" alt="" />
          <img src="src/assets/images/subtract.svg" alt="" />
        </div>

        <Button onClick={onGoToArticlesClick}>
          Go to articles{" "}
          <span className="material-symbols-outlined">trending_flat</span>
        </Button>
      </section>

      <section className={styles.home__workspaces}>
        <WorkSpaceList workspaces={workspaces} />
      </section>
    </section>
  );
};
