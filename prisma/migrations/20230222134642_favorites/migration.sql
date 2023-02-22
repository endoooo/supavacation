-- CreateTable
CREATE TABLE "_FavoritedHome" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoritedHome_AB_unique" ON "_FavoritedHome"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoritedHome_B_index" ON "_FavoritedHome"("B");

-- AddForeignKey
ALTER TABLE "_FavoritedHome" ADD CONSTRAINT "_FavoritedHome_A_fkey" FOREIGN KEY ("A") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoritedHome" ADD CONSTRAINT "_FavoritedHome_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
