export const parseBody = (body) => {

    if (typeof body === "string") return JSON.parse(body)

    return body
}