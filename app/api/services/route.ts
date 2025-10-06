import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all services
export async function GET() {
  try {
    const services = await prisma.Service.findMany()
    return NextResponse.json(services)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// Update a service status
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json()
    const updated = await prisma.service.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}
