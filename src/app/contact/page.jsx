"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./contact.module.css";
/*
export const ContactPage = {
  title: "Contact Page",
  description: "Contact description",
};
*/

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;
    const whatsappNumber = "62895342022385";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    )}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src="/contact.png" alt="" fill className={styles.img} />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Masukan Nama Anda........."
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Masukan Email Address......"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number (Optional)"
            value={formData.phone}
            onChange={handleChange}
          />
          <textarea
            name="message"
            cols="30"
            rows="10"
            placeholder="Masukan pesan Anda"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send To WhatsApps</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
