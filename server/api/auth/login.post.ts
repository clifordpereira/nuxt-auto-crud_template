import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from 'hub:db'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)

  let result = await db.select({
    user: schema.users,
    role: sql<string>`${schema.roles.name}`.as('role_name'),
  })
    .from(schema.users)
    .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
    .where(eq(schema.users.email, body.email))
    .get()

  if (!result && body.email === 'admin@example.com') {
    const userCount = await db.select({ count: sql`count(*)` }).from(schema.users).get()
    if (userCount && userCount.count === 0) {
      await seedDatabase()
      // Fetch again
      result = await db.select({
        user: schema.users,
        role: sql<string>`${schema.roles.name}`.as('role_name'),
      })
        .from(schema.users)
        .leftJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
        .where(eq(schema.users.email, body.email))
        .get()
    }
  }

  if (!result || !result.user) {
    console.log('Login failed: User not found', body.email)
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  let isPasswordValid = await verifyPassword(result.user.password, body.password)

  // Auto-fix admin password hash if it fails verification but matches the configured admin password
  if (!isPasswordValid) {
    const config = useRuntimeConfig()
    if (result.user.email === config.adminEmail && body.password === config.adminPassword) {
      console.log('Admin password hash mismatch detected. Re-hashing and updating...')
      const newHash = await hashPassword(body.password)
      await db.update(schema.users)
        .set({ password: newHash, updatedAt: new Date() })
        .where(eq(schema.users.id, result.user.id))

      isPasswordValid = true
    }
  }

  if (!isPasswordValid) {
    console.log('Login failed: Invalid password')
    console.log('Stored hash:', result.user.password)
    console.log('Provided password length:', body.password.length)
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  }

  const user = result.user
  const role = result.role || 'user'

  // Fetch permissions
  const permissions: Record<string, string[]> = {}

  if (user.roleId) {
    const permissionsData = await db.select({
      resource: schema.resources.name,
      action: schema.permissions.code,
    })
      .from(schema.roleResourcePermissions)
      .innerJoin(schema.resources, eq(schema.roleResourcePermissions.resourceId, schema.resources.id))
      .innerJoin(schema.permissions, eq(schema.roleResourcePermissions.permissionId, schema.permissions.id))
      .where(eq(schema.roleResourcePermissions.roleId, user.roleId))
      .all()

    for (const p of permissionsData) {
      if (!permissions[p.resource]) {
        permissions[p.resource] = []
      }
      permissions[p.resource]!.push(p.action)
    }
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: role,
      permissions: permissions,
    },
  })

  return { user }
})
