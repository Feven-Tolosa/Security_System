import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

// GET all messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('GET /messages/all error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// PATCH - mark as read
export async function PATCH(req: Request) {
  try {
    const { id } = await req.json()

    const updated = await prisma.message.update({
      where: { id },
      data: { seen: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PATCH /messages/all error:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

// DELETE - remove message
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()

    await prisma.message.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /messages/all error:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}

// POST - reply via email
export async function POST(req: Request) {
  try {
    const { to, subject, reply } = await req.json()

    // Configure mail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or "smtp.yourprovider.com"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: reply,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /messages/all error:', error)
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 })
  }
}
