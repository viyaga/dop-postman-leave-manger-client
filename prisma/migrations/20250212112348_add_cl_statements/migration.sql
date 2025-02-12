-- CreateTable
CREATE TABLE "Official" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "pay" INTEGER NOT NULL DEFAULT 0,
    "official_status" INTEGER NOT NULL DEFAULT 1,
    "leave_balance" JSONB,
    "officeId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Official_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "Office" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Office" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Substitute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "branch_office" TEXT,
    "sub_office" TEXT,
    "head_office" TEXT,
    "date_of_birth" DATETIME,
    "date_of_appointment" DATETIME,
    "employee_id" TEXT NOT NULL,
    "substitute_status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ElStatement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "designation" TEXT,
    "pay" INTEGER NOT NULL DEFAULT 0,
    "kind_of_leave" TEXT NOT NULL,
    "substitute_name" TEXT NOT NULL,
    "substitute_designation" TEXT,
    "employee_id" TEXT NOT NULL,
    "substitute_emp_id" TEXT,
    "substitute_office" TEXT,
    "dob" DATETIME,
    "doa" DATETIME,
    "no_of_days_claim" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ClStatement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "designation" TEXT NOT NULL,
    "kind_of_leave" TEXT,
    "substitute_name" TEXT NOT NULL,
    "substitute_designation" TEXT NOT NULL,
    "substitute_office" TEXT,
    "dob" DATETIME,
    "community" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Substitute_employee_id_key" ON "Substitute"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "ElStatement_employee_id_key" ON "ElStatement"("employee_id");
