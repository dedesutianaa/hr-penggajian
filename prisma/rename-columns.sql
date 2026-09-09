-- Rename all columns to camelCase (quoted) to match Prisma schema field names

-- User table
ALTER TABLE "User" RENAME COLUMN "emailverified" TO "emailVerified";
ALTER TABLE "User" RENAME COLUMN "mfaenabled" TO "mfaEnabled";
ALTER TABLE "User" RENAME COLUMN "mfasecret" TO "mfaSecret";
ALTER TABLE "User" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "User" RENAME COLUMN "updatedat" TO "updatedAt";

-- Account table
ALTER TABLE "Account" RENAME COLUMN "userid" TO "userId";
ALTER TABLE "Account" RENAME COLUMN "provideraccountid" TO "providerAccountId";
ALTER TABLE "Account" RENAME COLUMN "refreshtoken" TO "refresh_token";
ALTER TABLE "Account" RENAME COLUMN "accesstoken" TO "access_token";
ALTER TABLE "Account" RENAME COLUMN "expiresat" TO "expires_at";
ALTER TABLE "Account" RENAME COLUMN "tokentype" TO "token_type";
ALTER TABLE "Account" RENAME COLUMN "idtoken" TO "id_token";
ALTER TABLE "Account" RENAME COLUMN "sessionstate" TO "session_state";
ALTER TABLE "Account" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Account" RENAME COLUMN "updatedat" TO "updatedAt";

-- Session table
ALTER TABLE "Session" RENAME COLUMN "sessiontoken" TO "sessionToken";
ALTER TABLE "Session" RENAME COLUMN "userid" TO "userId";
ALTER TABLE "Session" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Session" RENAME COLUMN "updatedat" TO "updatedAt";

-- VerificationToken table
ALTER TABLE "VerificationToken" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "VerificationToken" RENAME COLUMN "updatedat" TO "updatedAt";

-- Entity table
ALTER TABLE "Entity" RENAME COLUMN "payrollmode" TO "payrollMode";
ALTER TABLE "Entity" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Entity" RENAME COLUMN "updatedat" TO "updatedAt";

-- Department table
ALTER TABLE "Department" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "Department" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Department" RENAME COLUMN "updatedat" TO "updatedAt";

-- CostCenter table
ALTER TABLE "CostCenter" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "CostCenter" RENAME COLUMN "departmentid" TO "departmentId";
ALTER TABLE "CostCenter" RENAME COLUMN "budgetpct" TO "budgetPct";
ALTER TABLE "CostCenter" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "CostCenter" RENAME COLUMN "updatedat" TO "updatedAt";

-- Position table
ALTER TABLE "Position" RENAME COLUMN "departmentid" TO "departmentId";
ALTER TABLE "Position" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "Position" RENAME COLUMN "isactive" TO "isActive";
ALTER TABLE "Position" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Position" RENAME COLUMN "updatedat" TO "updatedAt";

-- Employee table
ALTER TABLE "Employee" RENAME COLUMN "joindate" TO "joinDate";
ALTER TABLE "Employee" RENAME COLUMN "lastday" TO "lastDay";
ALTER TABLE "Employee" RENAME COLUMN "accountverified" TO "accountVerified";
ALTER TABLE "Employee" RENAME COLUMN "taxstatus" TO "taxStatus";
ALTER TABLE "Employee" RENAME COLUMN "photourl" TO "photoUrl";
ALTER TABLE "Employee" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Employee" RENAME COLUMN "updatedat" TO "updatedAt";

-- EmploymentHistory table
ALTER TABLE "EmploymentHistory" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "EmploymentHistory" RENAME COLUMN "inputdate" TO "inputDate";
ALTER TABLE "EmploymentHistory" RENAME COLUMN "createdat" TO "createdAt";

-- PayrollCycle table
ALTER TABLE "PayrollCycle" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "PayrollCycle" RENAME COLUMN "cutoff" TO "cutoff";
ALTER TABLE "PayrollCycle" RENAME COLUMN "paydate" TO "payDate";
ALTER TABLE "PayrollCycle" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "PayrollCycle" RENAME COLUMN "updatedat" TO "updatedAt";

-- PayrollComponent table
ALTER TABLE "PayrollComponent" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "PayrollComponent" RENAME COLUMN "createdat" TO "createdAt";

-- PayrollResult table
ALTER TABLE "PayrollResult" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "PayrollResult" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "PayrollResult" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "PayrollResult" RENAME COLUMN "updatedat" TO "updatedAt";

-- Payslip table
ALTER TABLE "Payslip" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "Payslip" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "Payslip" RENAME COLUMN "downloadedat" TO "downloadedAt";
ALTER TABLE "Payslip" RENAME COLUMN "downloadedby" TO "downloadedBy";
ALTER TABLE "Payslip" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Payslip" RENAME COLUMN "updatedat" TO "updatedAt";

-- PayrollVariance table
ALTER TABLE "PayrollVariance" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "PayrollVariance" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "PayrollVariance" RENAME COLUMN "createdat" TO "createdAt";

-- PayrollAnomaly table
ALTER TABLE "PayrollAnomaly" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "PayrollAnomaly" RENAME COLUMN "createdat" TO "createdAt";

-- GLJournalEntry table
ALTER TABLE "GLJournalEntry" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "GLJournalEntry" RENAME COLUMN "costcenter" TO "costCenter";
ALTER TABLE "GLJournalEntry" RENAME COLUMN "createdat" TO "createdAt";

-- PayrollApprovalStep table
ALTER TABLE "PayrollApprovalStep" RENAME COLUMN "cycleid" TO "cycleId";
ALTER TABLE "PayrollApprovalStep" RENAME COLUMN "createdat" TO "createdAt";

-- LeaveType table
ALTER TABLE "LeaveType" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "LeaveType" RENAME COLUMN "annualdays" TO "annualDays";
ALTER TABLE "LeaveType" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "LeaveType" RENAME COLUMN "updatedat" TO "updatedAt";

-- LeaveRequest table
ALTER TABLE "LeaveRequest" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "LeaveRequest" RENAME COLUMN "typeid" TO "typeId";
ALTER TABLE "LeaveRequest" RENAME COLUMN "startdate" TO "startDate";
ALTER TABLE "LeaveRequest" RENAME COLUMN "enddate" TO "endDate";
ALTER TABLE "LeaveRequest" RENAME COLUMN "approverid" TO "approverId";
ALTER TABLE "LeaveRequest" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "LeaveRequest" RENAME COLUMN "updatedat" TO "updatedAt";

-- LeaveBalance table
ALTER TABLE "LeaveBalance" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "LeaveBalance" RENAME COLUMN "typeid" TO "typeId";
ALTER TABLE "LeaveBalance" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "LeaveBalance" RENAME COLUMN "updatedat" TO "updatedAt";

-- AttendanceRecord table
ALTER TABLE "AttendanceRecord" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "AttendanceRecord" RENAME COLUMN "clockin" TO "clockIn";
ALTER TABLE "AttendanceRecord" RENAME COLUMN "clockout" TO "clockOut";
ALTER TABLE "AttendanceRecord" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "AttendanceRecord" RENAME COLUMN "updatedat" TO "updatedAt";

-- Shift table
ALTER TABLE "Shift" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "Shift" RENAME COLUMN "starttime" TO "startTime";
ALTER TABLE "Shift" RENAME COLUMN "endtime" TO "endTime";
ALTER TABLE "Shift" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Shift" RENAME COLUMN "updatedat" TO "updatedAt";

-- OvertimeRequest table
ALTER TABLE "OvertimeRequest" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "OvertimeRequest" RENAME COLUMN "createdat" TO "createdAt";

-- OnboardingTask table
ALTER TABLE "OnboardingTask" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "OnboardingTask" RENAME COLUMN "duedate" TO "dueDate";
ALTER TABLE "OnboardingTask" RENAME COLUMN "createdat" TO "createdAt";

-- OffboardingTask table
ALTER TABLE "OffboardingTask" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "OffboardingTask" RENAME COLUMN "duedate" TO "dueDate";
ALTER TABLE "OffboardingTask" RENAME COLUMN "createdat" TO "createdAt";

-- Requisition table
ALTER TABLE "Requisition" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Requisition" RENAME COLUMN "updatedat" TO "updatedAt";

-- Candidate table
ALTER TABLE "Candidate" RENAME COLUMN "stageid" TO "stageId";
ALTER TABLE "Candidate" RENAME COLUMN "createdat" TO "createdAt";

-- Interview table
ALTER TABLE "Interview" RENAME COLUMN "createdat" TO "createdAt";

-- PerformanceReview table
ALTER TABLE "PerformanceReview" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "PerformanceReview" RENAME COLUMN "reviewerid" TO "reviewerId";
ALTER TABLE "PerformanceReview" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "PerformanceReview" RENAME COLUMN "updatedat" TO "updatedAt";

-- OKR table
ALTER TABLE "OKR" RENAME COLUMN "keyresults" TO "keyResults";
ALTER TABLE "OKR" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "OKR" RENAME COLUMN "updatedat" TO "updatedAt";

-- SalaryBand table
ALTER TABLE "SalaryBand" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "SalaryBand" RENAME COLUMN "updatedat" TO "updatedAt";

-- Benefit table
ALTER TABLE "Benefit" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Benefit" RENAME COLUMN "updatedat" TO "updatedAt";

-- Expense table
ALTER TABLE "Expense" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "Expense" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Expense" RENAME COLUMN "updatedat" TO "updatedAt";

-- Ticket table
ALTER TABLE "Ticket" RENAME COLUMN "employeeid" TO "employeeId";
ALTER TABLE "Ticket" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Ticket" RENAME COLUMN "updatedat" TO "updatedAt";

-- AuditLog table
ALTER TABLE "AuditLog" RENAME COLUMN "actorid" TO "actorId";
ALTER TABLE "AuditLog" RENAME COLUMN "ipaddress" TO "ipAddress";
ALTER TABLE "AuditLog" RENAME COLUMN "useragent" TO "userAgent";
ALTER TABLE "AuditLog" RENAME COLUMN "createdat" TO "createdAt";

-- Integration table
ALTER TABLE "Integration" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "Integration" RENAME COLUMN "updatedat" TO "updatedAt";

-- WorkflowConfig table
ALTER TABLE "WorkflowConfig" RENAME COLUMN "entityid" TO "entityId";
ALTER TABLE "WorkflowConfig" RENAME COLUMN "createdat" TO "createdAt";
ALTER TABLE "WorkflowConfig" RENAME COLUMN "updatedat" TO "updatedAt";
