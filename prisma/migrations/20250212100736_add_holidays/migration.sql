-- CreateTable
CREATE TABLE "Holiday" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "holiday" TEXT NOT NULL,
    "date" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Holiday_holiday_key" ON "Holiday"("holiday");
