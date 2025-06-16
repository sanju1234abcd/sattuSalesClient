import React, { useState } from 'react';
import './SattuDataEntry.css';

const SattuDataEntry = () => {
  const baseURL = "https://sattusalesserver.onrender.com"
  const [formData, setFormData] = useState({
    district: '',
    subDivision: '',
    area: '',
    storeName: '',
    address: '',
    contactNumber: '',
    totalSattuSales: 0,
    satyendraSattuSales: 0,
    ganeshSattuSales: 0,
    otherSattuSales: 0,
    location: '',
    storeImage: null,
    dataSheetImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sample options for select inputs
  const districts = ['kolkata'];
  const subDivisions = ['north kolkata', 'south kolkata', 'central kolkata'];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    var mapsLink;

    try {
      //access location 
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
          },
          (err) => {
            alert("Unable to retrieve location.please try again");
            window.location.reload()
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
        window.location.reload()
      }

      // Validate required fields
      const requiredFields = [
        'district',
        'subDivision',
        'area',
        'storeName',
        'address',
        'contactNumber',
        'totalSattuSales',
        'storeImage',
        'dataSheetImage',
      ];
      for (const field of requiredFields) {
        if (!formData[field]) {
          throw new Error(`${field} is required`);
        }
      }

      // Upload images to Cloudinary
      const uploadImage = async (file, uploadPreset) => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', uploadPreset);
  data.append('cloud_name', 'dxm27kskt'); // replace with your cloud name

  const res = await fetch('https://api.cloudinary.com/v1_1/dxm27kskt/image/upload', {
    method: 'POST',
    body: data
  });
  const json = await res.json();
  return json.url;
};
      // Upload both images
      try{
      const storeImageUrl = await uploadImage(formData.storeImage, 'first_time_using_cloudinary');
      const dataSheetImageUrl = await uploadImage(formData.dataSheetImage, 'first_time_using_cloudinary');
      // Prepare JSON payload
      const payload = {
        ...formData,
        location : mapsLink,
        storeImage: storeImageUrl,
        dataSheetImage: dataSheetImageUrl,
      };
      console.log(payload)
      // Submit to backend
      const response = await fetch(`${baseURL}/sattu/new`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body : JSON.stringify(payload)
      })
      await response.json().then((e)=>{
        console.log(e)
        setSuccess("form submitted successfully")
        alert("form submitted successfully")
        window.location.reload()
      })
      .catch((err)=>{
        setError(err.message || 'please fill all data accordingly');
      })
      setFormData({
        district: '',
        subDivision: '',
        area: '',
        storeName: '',
        address: '',
        contactNumber: '',
        totalSattuSales: 0,
        satyendraSattuSales: 0,
        ganeshSattuSales: 0,
        otherSattuSales: 0,
        location: '',
        storeImage: null,
        dataSheetImage: null,
      });
      }
      catch{
        alert("there have been some error.please try again")
        window.location.reload()
      }
    } catch (err) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <h2>Sattu Sales Form</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="district">District</label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subDivision">SubDivision</label>
            <select
              id="subDivision"
              name="subDivision"
              value={formData.subDivision}
              onChange={handleChange}
              required
            >
              <option value="">Select SubDivision</option>
              {subDivisions.map((subDivision) => (
                <option key={subDivision} value={subDivision}>
                  {subDivision}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="area">Area</label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactNumber">Contact Number(10 numbers)</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalSattuSales">Total Sattu Sales</label>
            <input
              type="number"
              id="totalSattuSales"
              name="totalSattuSales"
              value={formData.totalSattuSales}
              onChange={(e)=>{
                setFormData((prev) => ({
                ...prev,
                totalSattuSales : e.target.value,
                otherSattuSales : e.target.value - (Number(formData.ganeshSattuSales) + Number(formData.satyendraSattuSales))
              }));
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="satyendraSattuSales">Satyendra Sattu Sales</label>
            <input
              type="number"
              id="satyendraSattuSales"
              name="satyendraSattuSales"
              value={formData.satyendraSattuSales}
              onChange={(e)=>{
                setFormData((prev) => ({
                ...prev,
                satyendraSattuSales : e.target.value,
                otherSattuSales : formData.totalSattuSales - (Number(formData.ganeshSattuSales) + Number(e.target.value))
              }));
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ganeshSattuSales">Ganesh Sattu Sales</label>
            <input
              type="number"
              id="ganeshSattuSales"
              name="ganeshSattuSales"
              value={formData.ganeshSattuSales}
              onChange={(e)=>{
                setFormData((prev) => ({
                ...prev,
                ganeshSattuSales : e.target.value,
                otherSattuSales : formData.totalSattuSales - (Number(formData.satyendraSattuSales) + Number(e.target.value))
              }));
              }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="otherSattuSales">Other Sattu Sales</label>
            <input
              type="number"
              id="otherSattuSales"
              name="otherSattuSales"
              value={formData.otherSattuSales}
              readOnly = {true}
            />
          </div>

          <div className="form-group">
            <label htmlFor="storeImage">Store Image</label>
            <input
              type="file"
              id="storeImage"
              name="storeImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dataSheetImage">Data Sheet Image</label>
            <input
              type="file"
              id="dataSheetImage"
              name="dataSheetImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SattuDataEntry;