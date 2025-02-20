import Image from "next/image";
import styles from "./home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Velyn Rest API</h1>
        <p className={styles.desc}>
          Welcome everyone, welcome to VelynAPI document home page. You can retrieve api data only in VelynAPI and certainly without incurring any costs in data retrieval, 
          and the results obtained are very simple and very clear to understand
        </p>
        <div className={styles.buttons}>
          <a href="/docs" className={styles.button}>Docs Endpoint</a>
          <a href="/contact" className={styles.button}>Contact</a>
        </div>
      </div>
      <div className={styles.imgContainer}>
        <Image src="/rex.png" alt="" fill className={styles.rex}/>
      </div>
    </div>
  );
};

export default Home;
