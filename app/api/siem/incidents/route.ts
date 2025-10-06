import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all incidents
export async function GET() {
  const incidents = await prisma.sIEMIncident.findMany()
  return NextResponse.json(incidents)
}

// PUT update incident count
export async function PUT(req: Request) {
  const { id, count } = await req.json()
  const updated = await prisma.sIEMIncident.update({
    where: { id },
    data: { count },
  })
  return NextResponse.json(updated)
}
