import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2'; // Import Doughnut and Bar charts
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'; // Import Chart.js elements
import './EmployeeTable.css'; // Add necessary styling

// Register the required components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend); // Registering BarElement along with others

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]); // To store employee data
  const [loading, setLoading] = useState(true); // To show loading state while data is being fetched
  const [error, setError] = useState(null); // To handle errors
  const [searchTerm, setSearchTerm] = useState(''); // To store the search term

  // Sample data for charts (You can modify these according to your actual data)
  const employeeRolesData = {
    labels: ['Developer', 'Designer', 'Manager', 'Sales'], // Sample roles
    datasets: [
      {
        data: [30, 20, 25, 25], // Sample distribution data
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const salaryRangeData = {
    labels: ['30k', '30k-50k', '50k-70k', '70k-100k'], // Salary ranges
    datasets: [
      {
        label: 'Number of Employees',
        data: [10, 25, 15, 5], // Sample salary range data
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Fetching data from API
  useEffect(() => {
    fetch('https://hub.dummyapis.com/employee') // API to fetch 10 employee records starting from id 1001
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data); // Set the fetched employees in state
        setLoading(false); // Stop the loading state
      })
      .catch((error) => {
        setError(error.message); // Handle errors
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once when component mounts

  // Display loading state
  if (loading) {
    return <p>Loading employee data...</p>;
  }

  // Display error state if there is an issue fetching data
  if (error) {
    return <p>Error fetching employee data: {error}</p>;
  }

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = e.target.result;
        // Parse the file data here (assume it's JSON for this example)
        const parsedData = JSON.parse(fileData);
        setEmployees(parsedData);
      };
      reader.readAsText(file); // Read file as text
    }
  };

  // Function to download the employee data as a CSV file
  const handleDownload = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + employees.map(emp => 
      `${emp.firstName},${emp.lastName},${emp.email},${emp.contactNumber},${emp.salary},${emp.address},${emp.age},${emp.dob}`
    ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'employee_data.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link); // Cleanup
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // If data is fetched, render the employee table
  return (
    <div className="container">
      <h2>Employee Payroll</h2>
      {/* Upload File Button */}
      <input type="file" accept=".json" onChange={handleFileUpload} />
      {/* Download File Button */}
      <button onClick={handleDownload}>Download Employee Data</button>
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      {/* Employee Table */}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Image</th> {/* New column for images */}
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Salary</th>
            <th>Address</th>
            <th>Age</th>
            <th>DOB</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <img 
                  src={employee.imageUrl} 
                  alt={`${employee.firstName} ${employee.lastName}`} 
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }} // Style for image
                />
              </td>
              <td>{employee.firstName}</td> 
              <td>{employee.lastName}</td> 
              <td>{employee.email}</td>
              <td>{employee.contactNumber}</td>
              <td>{employee.salary}</td>
              <td>{employee.address}</td>
              <td>{employee.age}</td>
              <td>{employee.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Adding the charts above the table */}
      <div className="chart-container">
        <div className="chart">
          <h3>Employee Roles Distribution</h3>
          <Doughnut data={employeeRolesData} /> {/* Doughnut chart for employee roles */}
        </div>
        <div className="chart">
          <h3>Salary Range of Employees</h3>
          <Bar data={salaryRangeData} options={{ maintainAspectRatio: false }} /> {/* Bar chart for salary range */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
