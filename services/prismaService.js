// prismaService.js
'use server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createEmployee = async (employeeData) => {
  try {
    // const newDepartment = await prisma.department.create({
    //   data: {
    //     departmentName: 'Tech', // Replace with the actual department name
    //   },
    // });
    console.log(employeeData);
    const newEmployee = await prisma.employee.create({
      data: employeeData,
    });
    return newEmployee;
  } catch (error) {
    throw new Error(`Failed to create employee: ${error.message}`);
  }
};

export const fetchEmployees = async () => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true, // This will include the department details for each employee
      },
    });
    console.log('I am the fetched employees', employees);
    return employees;
  } catch (error) {
    throw new Error(`Failed to fetch employees: ${error.message}`);
  }
};
