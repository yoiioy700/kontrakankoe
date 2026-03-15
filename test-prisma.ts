import { prisma } from './lib/prisma.js'

async function run() {
  try {
    const users = await prisma.user.findMany()
    console.log("Users:", users.length)
  } catch (err) {
    console.error("Prisma error:", err)
  }
}

run()
