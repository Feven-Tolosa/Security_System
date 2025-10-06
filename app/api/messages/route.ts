import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, message } = await req.json()

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Message must be at least 5 characters long' },
        { status: 400 }
      )
    }

    const newMessage = await prisma.message.create({
      data: {
        email,
        content: message,
      },
    })

    return NextResponse.json(
      { success: true, data: newMessage },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
