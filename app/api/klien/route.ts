import { getPrismaClient } from "../../../lib/prisma";

type KlienRow = {
  id_user: number | string | bigint;
  nama: string;
  username: string;
};

function toPublicKlien({ id_user, nama, username }: KlienRow) {
  return {
    id_user: typeof id_user === "bigint" ? id_user.toString() : id_user,
    nama,
    username,
  };
}

export async function GET() {
  try {
    const klien = await getPrismaClient().$queryRaw<KlienRow[]>`
      SELECT "id_user", "nama", "username"
      FROM "klien"
      ORDER BY "id_user" ASC
    `;

    return Response.json(klien.map(toPublicKlien));
  } catch (error) {
    console.error("Gagal mengambil daftar klien:", error);
    return Response.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}