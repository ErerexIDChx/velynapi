import Image from "next/image";
import styles from "./about.module.css";

export const metadata = {
  title: "About Page",
  description: "About description",
};


const AboutPage = () => {

  // console.log("lets check where it works")
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.subtitle}>About VelynApi</h2>
        <p className={styles.desc}>
         Rest Api Velyn adalah solusi terbaik untuk anda yang mencari api versi gratisan,
         dan gunakan lah api velyn karena endpoint api yang disediakan itu sangatlah cepat dalam proses pengambilan data sesuai requestan anda yang dibutuhkan
         dan juga tentunya tidak memakai limit ataupun key.
         disini menyediakan khusus pengguna gratisan
        </p>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <h1>1 K+</h1>
            <p>Client</p>
          </div>
          <div className={styles.box}>
            <h1>10 K+</h1>
            <p>Request</p>
          </div>
          <div className={styles.box}>
            <h1>20</h1>
            <p>Endpoint</p>
          </div>
        </div>
      </div>
      <div className={styles.imgContainer}>
        <Image
          src="/about.png"
          alt="About Image"
          fill
          className={styles.img}
        />
      </div>
    </div>
  );
};

export default AboutPage;