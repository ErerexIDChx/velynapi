import Link from "next/link"

const NotFound = () => {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Sorry, Halaman ini masih dalam pengembangan</p>
      <Link href="/">Kembali ke Halaman</Link>
    </div>
  )
}

export default NotFound