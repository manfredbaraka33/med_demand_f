
import "./App.css";
import { useState, useEffect } from "react";

const regionToDistricts = {
  Singida: ["Ikungi", "Itigi", "Iramba", "Manyoni", "Singida MC"],
  Dodoma: ["Dodoma CC", "Chemba", "Mpwapwa"],
};

const periods = [
  "Jan-Feb",
  "Feb-Mar",
  "March-April",
  "Apr-May",
  "May-June",
  "Jun-Jul",
  "July-Aug",
  "Aug-Sep",
  "Sept-Oct",
  "Oct-Nov",
];

const facilityTypes = [
  "District Hospital",
  "Regional Referral Hospital(RRH",
  "Zonal Referral Hospitals",
];

const regions = Object.keys(regionToDistricts);

const products = [
  "amoxicillin 250mg capsules",
  "ampiclox neonatal 90mg",
  "artemether/lumefantrine 20/120 mg tablets",
  "artesunate 60mg powder for injection",
  "captopril 25mg tablets",
  "chlorpheniramine 4mg tablets",
  "ciprofloxacin 500mg tablets",
  "co-trimoxazole 480mg tablets",
  "diclofenac 25mg injection",
  "erythromycin 250mg tablets",
  "frusemide 10mg injection",
  "ibuprofen 400mg tablets",
  "metronidazole 200mg tablets",
  "nifedipine 10mg tablets",
  "paracetamol 500mg tablets",
];

export default function MedicineDemandForm() {
  const [region, setRegion] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-white");
  setDarkMode(!darkMode);
};


  const [form, setForm] = useState({
    processingPeriod: "Jan-Feb",
    facilityType: "District Hospital",
    product: products[0],
    physicalcount: "1000",
    amc: "1000",
    year: "2024",
    price: "5000",
    rainfall: "30",
    temperature: "22",
  });

  useEffect(() => {
    if (region) {
      setDistricts(regionToDistricts[region]);
      setDistrict("");
    } else {
      setDistricts([]);
      setDistrict("");
    }
  }, [region]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = {
      features: [
        periods.indexOf(form.processingPeriod),
        facilityTypes.indexOf(form.facilityType),
        regionToDistricts[region]?.indexOf(district),
        regions.indexOf(region),
        products.indexOf(form.product),
        Number(form.physicalcount),
        Number(form.amc),
        Number(form.year),
        Number(form.price),
        Number(form.rainfall),
        Number(form.temperature),
      ],
    };

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setResult(data.prediction.toFixed(2));
    } catch (error) {
      console.error("Fetch failed:", error);
      setResult("Prediction failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <nav className={`navbar navbar-expand-lg shadow-sm fixed-top ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
       }`}>
        <div className="container-fluid">
          <span className="navbar-brand fw-bold text-primary">
            💊 MedPred
          </span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
      <span className="navbar-toggler-icon"></span>
    </button>
          <div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <button className="btn btn-outline-secondary m-3"
                      // onClick={() => {
                      //   document.body.classList.toggle("bg-dark");
                      //   document.body.classList.toggle("text-white");
                      // }}
                      onClick={toggleDarkMode}
                    >
                      🌗 Theme
                    </button>
                  </li>
                  <li class="nav-item m-3">
                    <button
                      className="btn btn-outline-info"
                      data-bs-toggle="modal"
                      data-bs-target="#aboutModal"
                    >
                      ℹ️ About
                    </button>
                  </li>
                  
                </ul>
          </div>
        </div>
      </nav>
       <br />
      <div className="container my-5">

      <div className="container shadow p-4">
        <h4 className="text-center text-primary mb-4">
          Medicine Demand Predictor
        </h4>

        <form onSubmit={handleSubmit}>
          <h6>Categorical Entries</h6>
          <hr />
          <div className="row">
            <div className="mb-3">
            <label className="form-label">Medicine</label>
            <select
              className="form-select"
              value={form.product}
              onChange={(e) => setForm({ ...form, product: e.target.value })}
            >
              {products.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="row">
          {/* Region Dropdown */}
          <div className="mb-3 col fm">
            <label className="form-label">Region</label>
            <select
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            >
              <option value="">-- Select Region --</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

           {/* District Dropdown */}
          {region && (
            <div className="mb-3 col fm">
              <label className="form-label">District</label>
              <select
                className="form-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              >
                <option value="">-- Select District --</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          </div>

        <div className="row">
          <div className="mb-3 col fm">
            <label className="form-label">Facility Type</label>
            <select
              className="form-select"
              value={form.facilityType}
              onChange={(e) =>
                setForm({ ...form, facilityType: e.target.value })
              }
            >
              {facilityTypes.map((ft) => (
                <option key={ft} value={ft}>
                  {ft}
                </option>
              ))}
            </select>
          </div>
           {/* Select Inputs */}
          <div className="mb-3 col fm">
            <label className="form-label">Processing Period</label>
            <select
              className="form-select"
              value={form.processingPeriod}
              onChange={(e) =>
                setForm({ ...form, processingPeriod: e.target.value })
              }
            >
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
          <br />
          <h6>Numerical Entries</h6>
         <hr />
          <div className="row my-3">
            {/* Number Inputs */}
          {[
            ["Physical Count", "physicalcount"],
            ["Average Monthly Consumption", "amc"],
            ["Year", "year", 2015, 2030],
            ["Price", "price"],
            ["Rainfall", "rainfall"],
            ["Temperature", "temperature"],
          ].map(([label, key, min, max]) => (
            <div className="mb-3 col fm" key={key}>
              <label className="form-label">{label}</label>
              <input
                type="number"
                className="form-control"
                placeholder={label}
                value={form[key]}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                min={min || 0}
                max={max}
              />
            </div>
          ))}
          </div>

          {loading ? (
            <button className="btn btn-primary w-100" disabled>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Predicting...
            </button>
          ) : (
            <button type="submit" className="btn btn-primary w-100">
              📈 Predict
            </button>
          )}

        </form>

        {result && (
          <div className="alert alert-success text-center mt-4">
            📦 Predicted Medicine Demand: <strong>{result}</strong> units
          </div>
        )}
      </div>
      <div
        className="modal fade"
        id="aboutModal"
        tabIndex="-1"
        aria-labelledby="aboutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="aboutModalLabel">About This Tool</h5>
              <button
                type="button"
                className="btn-close bg-danger"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                This prototype is part of a Master’s research project to predict medicine demand in Tanzania using machine learning.
              </p>
              <p>
                Inputs include facility type, weather, and consumption data. The goal is to improve forecasting and supply planning in public health systems.
              </p>
              <p className="mb-0">
                <strong>Researcher:</strong> ANTHONY KAALI<br />
                <strong>Program:</strong> MSc Health Information Systems<br />
                <strong>University:</strong> UDOM<br />
                <strong>Supervisors:</strong> DR. GODIEL MOSHI & <br /> DR.CHRISTINA MURO
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center mt-5  text-secondary small">
        <hr />
        <p>
          Developed by ANTHONY KAALI | MSc Health Informatin System | University of Dodoma
        </p>
        <p>
          Supervisors: DR. GODIEL MOSHI & DR.CHRISTINA MURO | &copy; {new Date().getFullYear()}
        </p>
      </footer>

    </div>
    </div>
  );
}
