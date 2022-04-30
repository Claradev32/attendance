export const sessionCookie = () => {
  return ({
      cookieName: "auth",
      password: process.env.SESSION_PASSWORD,
      // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
  })
}