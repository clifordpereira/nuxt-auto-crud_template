// Trigger rebuild to ensure secrets are loaded
export default eventHandler(async (event) => {
  const body = await readBody(event)
  const password = body.password || 'Test1234'
  
  // 1. Hash the password
  const hashedPassword = await hashPassword(password)
  
  // 2. Immediate verification
  const isMatch = await verifyPassword(hashedPassword, password)
  
  return {
    test: {
      inputPassword: password,
      generatedHash: hashedPassword,
      isMatch,
      hashLength: hashedPassword.length
    }
  }
})
