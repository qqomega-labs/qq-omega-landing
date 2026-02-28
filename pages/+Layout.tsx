/**
 * @dev Root layout for Vike app.
 * Loads global styles and renders children without wrapper.
 */
import '../src/styles/app.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
