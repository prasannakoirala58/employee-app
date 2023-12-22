'use client';
import React, { useState, useEffect } from 'react';
import { createEmployee, fetchEmployees } from '../../services/prismaService';

const EmployeeManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [addressSearchQuery, setAddressSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // State to hold employee details
  const [employeeDetails, setEmployeeDetails] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    salary: '',
    departmentId: 0,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setSelectedDepartment(value);
    } else if (name === 'nameSearch' || name === 'addressSearch') {
      if (name === 'nameSearch') {
        setNameSearchQuery(value);
      } else {
        setAddressSearchQuery(value);
      }
    } else {
      setEmployeeDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Function to fetch employees and update the state
  const fetchAndSetEmployees = async () => {
    try {
      const fetchedEmployees = await fetchEmployees();
      // console.log('From Client', fetchedEmployees);
      setEmployees(fetchedEmployees);
      console.log('Employees', employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Use useEffect to fetch employees when the component mounts
  useEffect(() => {
    fetchAndSetEmployees();
    console.log('Updated Employees:', employees[0]);
  }, []);

  const handleSave = async () => {
    try {
      // Save the employee details to the database
      const savedEmployee = await createEmployee({
        name: employeeDetails.name,
        address: employeeDetails.address, // For simplicity, you can add other fields similarly
        phoneNumber: employeeDetails.phoneNumber,
        salary: parseFloat(employeeDetails.salary), // Convert string to float
        departmentId: parseInt(employeeDetails.departmentId), // Assuming a static department ID for now
      });

      console.log('Saved Employee:', savedEmployee);

      // Close the modal
      setIsModalOpen(false);
      fetchAndSetEmployees();

      // Update the state or fetch the latest data to update your table
      // This step is essential to see the dynamic data being updated as per the schema.
      // You might want to fetch the latest list of employees after saving a new one.
    } catch (error) {
      console.error('Error saving employee:', error);
    }
    // Add validation logic here if needed
    console.log('Employee Details:', employeeDetails);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-8 text-black">
      <h1 className="text-4xl mb-8">Employee Management</h1>

      {/* Display number of employees */}
      <p className="mb-4">Number of Employees: {employees.length}</p>

      {/* Display maximum salary */}
      <p className="mb-4">
        Max Salary: $
        {employees.length > 0
          ? Math.max(...employees.map((employee) => parseFloat(employee.salary)))
          : 0}
      </p>

      {/* Display minimum salary */}
      <p className="mb-4">
        Min Salary: $
        {employees.length > 0
          ? Math.min(...employees.map((employee) => parseFloat(employee.salary)))
          : 0}
      </p>

      {/* Department Selection Form */}
      <form className="mb-8">
        <div className="mb-4">
          <label htmlFor="department" className="block text-sm font-bold mb-2">
            Select Department:
          </label>
          <select
            id="department"
            name="department"
            value={selectedDepartment}
            onChange={handleInputChange}
            className="w-full bg-inherit text-black p-2 border rounded-md hover:border-blue-500 focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>
              ---Select Department---
            </option>
            <option value="hr">HR</option>
            <option value="finance">Finance</option>
            <option value="tech">Tech</option>
            {/* Add more departments as needed */}
          </select>
        </div>

        {/* Search Employees Input */}
        <div className="mb-4 ">
          <label htmlFor="search" className="block text-sm font-bold mb-2">
            Search Employees:
          </label>
          <input
            type="text"
            id="search"
            name="nameSearch"
            value={nameSearchQuery}
            onChange={handleInputChange}
            placeholder="Search employees..."
            className="w-full bg-inherit p-2 border rounded-md hover:border-blue-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Search Employees Input for Address */}
        <div className="mb-4">
          <label htmlFor="addressSearch" className="block text-sm font-bold mb-2">
            Search by Address:
          </label>
          <input
            type="text"
            id="addressSearch"
            name="addressSearch"
            value={addressSearchQuery}
            onChange={handleInputChange}
            placeholder="Search by address..."
            className="w-full bg-inherit p-2 border rounded-md hover:border-blue-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </form>

      {/* Employee Table */}
      <p className="text-2xl mb-8">Employee Management</p>
      <table className="min-w-full bg-white border rounded-md">
        <thead>
          <tr>
            <th className="border px-4 py-2">Employee Name</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Address</th>
            <th className="border px-4 py-2">Salary</th>
            <th className="border px-4 py-2">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample Employee Data - Replace with dynamic data */}
          {employees &&
            employees
              .filter(
                (employee) =>
                  employee.name.toLowerCase().startsWith(nameSearchQuery.toLowerCase()) &&
                  employee.address.toLowerCase().includes(addressSearchQuery.toLowerCase()) &&
                  (!selectedDepartment ||
                    employee.department.departmentName.toLowerCase() ===
                      selectedDepartment.toLowerCase())
              )
              .map((employee, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{employee.name}</td>
                  <td className="border px-4 py-2">
                    {employee.department.departmentName}
                  </td>{' '}
                  {/* Assuming departmentId corresponds to the department name */}
                  <td className="border px-4 py-2">{employee.address}</td>
                  <td className="border px-4 py-2">${employee.salary}</td>
                  <td className="border px-4 py-2">{employee.phoneNumber}</td>
                </tr>
              ))}
          {/* <tr>
            <td className="border px-4 py-2">{employees.name}</td>
            <td className="border px-4 py-2">HR</td>
            <td className="border px-4 py-2">$60,000</td>
          </tr> */}
          {/* Add more rows as needed */}
        </tbody>
      </table>

      <button
        type="button"
        onClick={toggleModal}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Add Employee
      </button>

      {/* Background Blur Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40 bg-black opacity-50 blur">
          {/* Empty div to prevent click events on the background */}
          <div className="absolute inset-0"></div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Add Employee</h2>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={employeeDetails.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={employeeDetails.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Phone Number:
              </label>
              <input
                type="text"
                id="phone"
                name="phoneNumber"
                value={employeeDetails.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="department" className="block text-sm font-bold mb-2">
                Department:
              </label>

              <select
                id="department"
                name="departmentId"
                value={employeeDetails.department}
                onChange={handleInputChange}
                className="w-full bg-inherit text-black p-2 border rounded-md hover:border-blue-500 focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  ---Select Department---
                </option>
                <option value={1}>HR</option>
                <option value={2}>Finance</option>
                <option value={3}>Tech</option>
                {/* Add more departments as needed */}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="salary" className="block text-sm font-bold mb-2">
                Salary:
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={employeeDetails.salary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
