import * as React from "react"
import type { GetServerDataProps, GetServerDataReturn } from "gatsby"

type ServerDataProps = {
    hello: string
}

const Page = () => <div>Hello World</div>
export default Page

export async function getServerData(
    props: GetServerDataProps
): GetServerDataReturn<ServerDataProps> {
    return {
        status: 200,
        headers: {},
        props: {
            hello: "world",
        },
    }
}
