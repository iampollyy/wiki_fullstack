import { Button } from "@shared/ui/button/Button";
import styles from "./home.module.scss";
import { useNavigate } from "react-router-dom";
import { WorkSpaceList } from "@shared/ui/workSpaceList/WorkSpaceList";
import { IWorkSpace } from "@entities/workspace/model/workspage";
import { useEffect, useState } from "react";

export const Home = () => {
    const [workspace, setWorkspace] = useState<IWorkSpace[]>([]);
    useEffect(() => {
      fetch("http://localhost:5000/workspaces")
        .then((response) => response.json())
        .then((data) => {
          setWorkspace(data);
        })
        .catch((error) => console.error("Failed to load workspaces:", error));
    }, []);
  const navigate = useNavigate();
  function onGoToArticlesClick() {
    navigate("/articles");
  }

  return (
    <>
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
        <WorkSpaceList workspaces={workspace} />
      </section>
    </>
  );
};
