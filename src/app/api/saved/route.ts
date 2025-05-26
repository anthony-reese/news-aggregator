// \src\app\api\saved\route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const saved = await prisma.savedArticle.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { savedAt: 'desc' },
  });

  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { articleUrl, title, imageUrl } = body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const saved = await prisma.savedArticle.create({
    data: {
      userId: user.id,
      articleUrl,
      title,
      imageUrl,
    },
  });

  return NextResponse.json(saved, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) return NextResponse.json({ error: 'Missing URL' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await prisma.savedArticle.deleteMany({
    where: {
      userId: user.id,
      articleUrl: url,
    },
  });

  return NextResponse.json({ success: true });
}
