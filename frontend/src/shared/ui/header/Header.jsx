import { Button } from "../button/Button"
import styles from './header.module.scss'
import { Link } from "react-router"

export const Header = () => { 
    return (
      <header className={styles.header}>
        <Link to="/" aria-label="'Navigate to home page'" className={styles.logoLink}>
              <img className={styles.Logo} src="./public/logo.svg" alt="" />
        </Link>
        <Button size="sm">
           +
        </Button>
        </header>
    )
}