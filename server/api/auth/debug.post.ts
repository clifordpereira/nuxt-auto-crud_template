// Trigger rebuild to ensure secrets are loaded
import { hashUserPassword, verifyUserPassword } from '../../utils/hashing'
export default eventHandler(async (event) => {
  const body = await readBody(event)
  const password = body.password || 'Test1234'
  
  // 1. Hash the password
  const hashedPassword = await hashUserPassword(password)
  
  // 2. Immediate verification
  const isMatch = await verifyUserPassword(hashedPassword, password)
  
  return {
    test: {
      inputPassword: password,
      generatedHash: hashedPassword,
      isMatch,
      hashLength: hashedPassword.length
    }
  }
})
