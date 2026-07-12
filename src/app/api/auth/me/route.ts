import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/cookies";
import { verifySessionToken, type FtdJwtPayload } from "@/lib/jwt";
import { discordAvatarUrl } from "@/lib/discord";

export const dynamic = "force-dynamic";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const payload = await verifySessionToken(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    user: toPublicUser(payload),
  });
}

function toPublicUser(p: FtdJwtPayload) {
  return {
    discordId: p.discordId,
    username: p.username,
    globalName: p.globalName ?? null,
    nick: p.nick ?? null,
    avatar: p.avatar,
    avatarUrl: discordAvatarUrl(p.discordId, p.avatar),
    roles: p.roles,
  };
}
