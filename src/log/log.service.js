const { PrismaClient } = require('../../generated/prisma');
class LogService {
  constructor() {
    this.prisma = new PrismaClient();
  }
  async createLog(employeeId, action, details) {
    return this.prisma.log.create({
      data: {
        employeeId,
        action,
        details: JSON.stringify(details),
      },
    });
  }
}
module.exports = { LogService };
