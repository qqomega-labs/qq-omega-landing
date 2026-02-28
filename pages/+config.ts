/**
 * @dev Vike configuration for QQ Omega Labs website.
 * Enables React integration, SSG prerendering, and global metadata.
 */
import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

export default {
  extends: [vikeReact],
  prerender: true,
  title: 'QQ Omega Labs - AI-Powered Crypto Scoring Platform',
  description: 'QQ Omega combines AI-powered agents to score and rank cryptocurrency projects across fundamentals, tokenomics, on-chain metrics, technicals, and macro trends.',
  lang: 'en',
} satisfies Config
