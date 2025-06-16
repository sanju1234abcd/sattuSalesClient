import { useState } from 'react';
import { saveAs } from "file-saver";
import './Admin.css';

function Admin() {
  const baseURL = "https://sattusalesserver.onrender.com/api/v1/sattu"
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    district: '',
    subDivision: '',
    satyendraSales: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      setIsLoading(true)
      console.log('excel file started')
    const response = await fetch(`${baseURL}/admin/createExcelFile?district=${filters.district}&subDivision=${filters.subDivision}&satyendraSattuSales=${filters.satyendraSales}`)
    if (!response.ok){
      alert("excel file not created.please try again")
      window.location.reload()
    };
    const blob = await response.blob();
    saveAs(blob)
    console.log('excel file ended')
    setIsLoading(false)
    }catch{
      setIsLoading(false)
      alert("something is not right.please try again")
      window.location.reload()
    }

  };

  return (
    <div className="container">
      <h1>Admin Filter Page</h1>
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="form-group">
          <label htmlFor="district">District</label>
          <select id="district" name="district" value={filters.district} onChange={handleChange}>
            <option value="">Select District</option>
            <option value="kolkata">Kolkata</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="subDivision">Subdivision</label>
          <select id="subDivision" name="subDivision" value={filters.subDivision} onChange={handleChange}>
            <option value="">Select Subdivision</option>
            <option value="north kolkata">north kolkata</option>
            <option value="south kolkata">south kolkata</option>
            <option value="central kolkata">central kolkata</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="satyendraSales">Satyendra Sales Status</label>
          <select id="satyendraSales" name="satyendraSales" value={filters.satyendraSales} onChange={handleChange}>
            <option value="">Select Sales Status</option>
            <option value="<30">{'<30'}</option>
            <option value="30-50">{'30-50'}</option>
            <option value=">50">{'>50'}</option>
          </select>
        </div>
        <div className="form-group">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Apply'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Admin;