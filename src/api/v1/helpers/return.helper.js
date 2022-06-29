export const return_wrapper = (props) => {
    const [status, msg, data, links = []] = [props?.status, props?.msg, props?.data, props?.links]
    return {status, msg, data, links}
}