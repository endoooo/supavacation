import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  // Check if user is authenticated
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Retrieve the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Get user favorited homes
  if (req.method === "GET") {
    try {
      const { favoritedHomes } = await prisma.user.findUnique({
        where: { id: user.id },
        select: { favoritedHomes: true },
      });
      console.log("favoritedHomes", favoritedHomes);
      res.status(200).json(favoritedHomes);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
