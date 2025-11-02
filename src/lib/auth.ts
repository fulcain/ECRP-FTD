import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

export function createServerToken() {
  return jwt.sign({ access: true }, SECRET)
}

export function verifyToken(token?: string) {
  try {
    const decoded = jwt.verify(token ?? '', SECRET)
    return Boolean(decoded)
  } catch {
    return false
  }
}
