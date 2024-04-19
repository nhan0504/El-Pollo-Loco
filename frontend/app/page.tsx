//import Image from "next/image";
//import styles from "./page.module.css";




export default function Home() {
  return (
    <main/*  className={styles.main} */>
      <a href="/auth/login">login</a><br/>
      <a href="/auth/login/forgot_password">i forgor</a><br/>
      <a href="/auth/signup">signup</a>
    </main>
  );
}



