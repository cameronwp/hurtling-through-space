import React from 'react'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'
import { rhythm, scale } from '../utils/typography'
import SiteTitle from '../components/site-title'

import "prismjs/themes/prism.css"

class Template extends React.Component {
  render() {
    const { location, children } = this.props

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }

    let isRoot = location.pathname === rootPath

    return (
      <Container style={{ maxWidth: rhythm(24), padding: `${rhythm(1.5)} ${rhythm(3 / 4)}` }}>
        <SiteTitle size={isRoot ? 'large' : 'small'} />
        {children()}
      </Container>
    )
  }
}

export default Template
