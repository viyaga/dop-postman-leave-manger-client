/*
  Warnings:

  - You are about to drop the `Office` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `office` to the `Official` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Office";
PRAGMA foreign_keys=on;

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
    "leave_balance" JSONB,
    "officeId" INTEGER,
    "office" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Official" ("createdAt", "designation", "employee_id", "id", "leave_balance", "name", "officeId", "official_status", "pay", "updatedAt") SELECT "createdAt", "designation", "employee_id", "id", "leave_balance", "name", "officeId", "official_status", "pay", "updatedAt" FROM "Official";
DROP TABLE "Official";
ALTER TABLE "new_Official" RENAME TO "Official";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
