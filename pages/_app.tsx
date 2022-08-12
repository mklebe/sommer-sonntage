import { UserStore } from '../context/userContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <UserStore>
      <Component {...pageProps} />
    </UserStore>
  )
}

export default MyApp
