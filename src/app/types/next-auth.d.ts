import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Definindo que 'id' será uma string
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}
