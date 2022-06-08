import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

interface LayoutWithMDXPropTypes {
    children: React.ReactNode;
}

const LayoutWithMDX: React.FC<LayoutWithMDXPropTypes> = (props) => {
    return (
        <div>{props.children}</div>
    )
}

export default LayoutWithMDX
