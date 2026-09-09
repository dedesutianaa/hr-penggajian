-- Alter columns to use ENUM types (drop defaults first)

-- Employee table
ALTER TABLE "Employee" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "type" TYPE "EmployeeType" USING "type"::"EmployeeType";
ALTER TABLE "Employee" ALTER COLUMN "type" SET DEFAULT 'TETAP';
ALTER TABLE "Employee" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "status" TYPE "EmployeeStatus" USING "status"::"EmployeeStatus";
ALTER TABLE "Employee" ALTER COLUMN "status" SET DEFAULT 'AKTIF';

-- PayrollCycle table
ALTER TABLE "PayrollCycle" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PayrollCycle" ALTER COLUMN "status" TYPE "PayrollCycleStatus" USING "status"::"PayrollCycleStatus";
ALTER TABLE "PayrollCycle" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- LeaveRequest table
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" TYPE "LeaveRequestStatus" USING "status"::"LeaveRequestStatus";
ALTER TABLE "LeaveRequest" ALTER COLUMN "status" SET DEFAULT 'MENUNJU';

-- Ticket table
ALTER TABLE "Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus" USING "status"::"TicketStatus";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'TERBUKA';
ALTER TABLE "Ticket" ALTER COLUMN "priority" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "priority" TYPE "TicketPriority" USING "priority"::"TicketPriority";
ALTER TABLE "Ticket" ALTER COLUMN "priority" SET DEFAULT 'SEDANG';

-- Integration table
ALTER TABLE "Integration" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Integration" ALTER COLUMN "status" TYPE "IntegrationStatus" USING "status"::"IntegrationStatus";
ALTER TABLE "Integration" ALTER COLUMN "status" SET DEFAULT 'TERHUBUNG';

-- PayrollApprovalStep table
ALTER TABLE "PayrollApprovalStep" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PayrollApprovalStep" ALTER COLUMN "status" TYPE "WorkflowStepStatus" USING "status"::"WorkflowStepStatus";
ALTER TABLE "PayrollApprovalStep" ALTER COLUMN "status" SET DEFAULT 'BELUM';

-- EmploymentHistory table
ALTER TABLE "EmploymentHistory" ALTER COLUMN "type" TYPE "EmployeeType" USING "type"::"EmployeeType";
ALTER TABLE "EmploymentHistory" ALTER COLUMN "status" TYPE "EmployeeStatus" USING "status"::"EmployeeStatus";
