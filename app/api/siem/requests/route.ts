import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET all requests
export async function GET() {
  const requests = await prisma.sIEMRequest.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(requests)
}

// PUT update request (approve or upload license)
export async function PUT(req: Request) {
  const { id, status, downloadLink } = await req.json()
  const updated = await prisma.sIEMRequest.update({
    where: { id },
    data: { status, downloadLink },
  })
  return NextResponse.json(updated)
}

// POST new request (when a user applies for SIEM)
export async function POST(req: Request) {
  const { fullName, email } = await req.json()
  const created = await prisma.sIEMRequest.create({
    data: { fullName, email, status: 'Pending' },
  })
  return NextResponse.json(created)
}
