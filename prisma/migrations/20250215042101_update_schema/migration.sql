/*
  Warnings:

  - You are about to drop the column `leave_balance` on the `Official` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Official" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "pay" INTEGER NOT NULL DEFAULT 0,
    "official_status" INTEGER NOT NULL DEFAULT 1,
    "cl" INTEGER NOT NULL DEFAULT 0,
    "el" INTEGER NOT NULL DEFAULT 0,
    "rh" INTEGER NOT NULL DEFAULT 0,
    "officeId" INTEGER,
    "office" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Official" ("createdAt", "designation", "employee_id", "id", "name", "office", "officeId", "official_status", "pay", "updatedAt") SELECT "createdAt", "designation", "employee_id", "id", "name", "office", "officeId", "official_status", "pay", "updatedAt" FROM "Official";
DROP TABLE "Official";
ALTER TABLE "new_Official" RENAME TO "Official";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
