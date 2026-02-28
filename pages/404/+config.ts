/**
 * @dev Configuration for 404 page.
 * Enables prerendering for static 404 page.
 */
import type { Config } from 'vike/types'

export default {
  prerender: true,
  title: '404 - Page Not Found | QQ Omega Labs',
  description: 'The page you are looking for could not be found.',
} satisfies Config
