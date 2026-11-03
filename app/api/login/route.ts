import bcrypt from "bcryptjs";
import { getPrismaClient } from "../../../lib/prisma";

type KlienLoginRow = {
  id_user: number | string | bigint;
  nama: string;
  username: string;
  password: string;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Data masuk tidak valid." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return Response.json(
      { message: "Nama pengguna dan kata sandi wajib diisi." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const username = typeof data.username === "string" ? data.username.trim() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!username || !password.trim()) {
    return Response.json(
      { message: "Nama pengguna dan kata sandi wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const [klien] = await getPrismaClient().$queryRaw<KlienLoginRow[]>`
      SELECT "id_user", "nama", "username", "password"
      FROM "klien"
      WHERE "username" = ${username}
      LIMIT 1
    `;

    if (!klien) {
      return Response.json(
        { message: "Username atau password salah" },
        { status: 401 },
      );
    }

    const passwordIsBcrypt = /^\$2[aby]\$\d{2}\$/.test(klien.password);
    const passwordMatches = passwordIsBcrypt
      ? await bcrypt.compare(password, klien.password)
      : password === klien.password;

    if (!passwordMatches) {
      return Response.json(
        { message: "Username atau password salah" },
        { status: 401 },
      );
    }

    return Response.json({
      id_user:
        typeof klien.id_user === "bigint"
          ? klien.id_user.toString()
          : klien.id_user,
      nama: klien.nama,
      username: klien.username,
    });
  } catch (error) {
    console.error("Gagal memproses login:", error);
    return Response.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}