-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userHandle" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userHandle_key" ON "User"("userHandle");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
