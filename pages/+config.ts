/**
 * @dev Vike configuration for QQ Omega Labs website.
 * Enables React integration, SSG prerendering, and global metadata.
 */
import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

export default {
  extends: [vikeReact],
  prerender: true,
  title: 'QQ Omega Labs',
  lang: 'en',
} satisfies Config
