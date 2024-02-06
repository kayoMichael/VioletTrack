import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { ticketSchema } from '../../../components/validations/ticketSchema';
export async function POST(request: NextRequest) {
    const body = await request.json();

    const validation = ticketSchema.safeParse(body)

    if (!validation.success) {
        return NextResponse.json(validation.error.errors, {status: 400})
    }

    const ticket = await prisma.ticket.create({
        data: { title: body.title, description: body.description}
    })

    return NextResponse.json(ticket, {status: 201})
}