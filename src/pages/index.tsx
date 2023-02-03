import * as React from 'react'
import './index.css'

const isBrowser = typeof window !== 'undefined'

// styles
const pageStyles = {
  height: '100vh',
  boxSizing: 'border-box' as const,
  color: '#232129',
  padding: 96,
  fontFamily: 'Biotif-Regular, Helvetica Neue, Helvetica, Arial, sans-serif, -apple-system, Roboto, sans-serif, serif',
}
const headerStyles = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  height: 60,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'rgb(38, 57, 77) 0px 20px 30px -10px',
  background: 'linear-gradient(to right, #5f2c82, #49a09d)',
  zIndex: 1,
}
const navStyles = {
  padding: 32,
  maxWidth: 1125,
  cursor: 'pointer',
}
const sectionStyles = {
  // marginTop: 60,
  width: '100%',
  height: '100%',
}

// data
const links = [
  {
    text: 'Tutorial',
    url: 'https://www.gatsbyjs.com/docs/tutorial/',
    description:
      "A great place to get started if you're new to web development. Designed to guide you through setting up your first Gatsby site.",
    color: '#E95800',
  },
  {
    text: 'How to Guides',
    url: 'https://www.gatsbyjs.com/docs/how-to/',
    description:
      "Practical step-by-step guides to help you achieve a specific goal. Most useful when you're trying to get something done.",
    color: '#1099A8',
  },
  {
    text: 'Reference Guides',
    url: 'https://www.gatsbyjs.com/docs/reference/',
    description:
      "Nitty-gritty technical descriptions of how Gatsby works. Most useful when you need detailed information about Gatsby's APIs.",
    color: '#BC027F',
  },
  {
    text: 'Conceptual Guides',
    url: 'https://www.gatsbyjs.com/docs/conceptual/',
    description:
      'Big-picture explanations of higher-level Gatsby concepts. Most useful for building understanding of a particular topic.',
    color: '#0D96F2',
  },
  {
    text: 'Plugin Library',
    url: 'https://www.gatsbyjs.com/plugins',
    description:
      'Add functionality and customize your Gatsby site or app with thousands of plugins built by our amazing developer community.',
    color: '#8EB814',
  },
  {
    text: 'Build and Host',
    url: 'https://www.gatsbyjs.com/cloud',
    badge: true,
    description:
      'Now you’re ready to show the world! Give your Gatsby site superpowers: Build and host on Gatsby Cloud. Get started for free!',
    color: '#663399',
  },
]

// markup
const IndexPage = () => {
  const dancerRef = React.createRef<HTMLDivElement>()

  React.useEffect(() => {
    if (!isBrowser) return
    if (!dancerRef.current) return
    import('../addons/Dancer/controller').then((Dancer) => {
      new Dancer.default()
    })
  }, [dancerRef])

  return (
    <main style={pageStyles}>
      <title>Home Page</title>
      <header style={headerStyles}>
        <nav style={navStyles}>
          <span className="nav__item">Home</span>
        </nav>
      </header>
      <section style={sectionStyles}>
        <div className="title-page__container">
          <div className="title-page__intro">
            <div>{`Hi. I'm Angry-Sparrow.`}</div>
            <div>A front-end developer.</div>
          </div>
          <div ref={dancerRef} id="dancer" className="title-page__showtime"></div>
        </div>
      </section>
    </main>
  )
}

export default IndexPage
