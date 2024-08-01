-- CreateTable
CREATE TABLE "Sala" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "urlAudio" TEXT NOT NULL,
    "urlFoto" TEXT NOT NULL,
    "urlVideo" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sala_pkey" PRIMARY KEY ("id")
);
