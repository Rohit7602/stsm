import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCustomerContext } from "../../context/Customergetters";

function CreateOffer() {
  const [offer, setOffer] = useState({
    title: "",
    description: "",
    img: null,
  });
  const { customer } = useCustomerContext();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOffer({ ...offer, img: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Offer Created:", offer);
  };

  const handleReset = () => {
    setOffer({ title: "", description: "", img: null });
  };

//   const tokens = customer
//     .flatMap((value) => value.devices_token)
//     .map((token) => token.split("::")[0]);


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create an Offer</h2>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <form
            onSubmit={handleSubmit}
            className="p-4 border rounded shadow-sm bg-light"
          >
            {/* Title Input */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-bold">
                Offer Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={offer.title}
                onChange={handleChange}
                placeholder="Enter offer title"
                required
              />
            </div>

            {/* Description Input */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label fw-bold">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={offer.description}
                onChange={handleChange}
                rows="3"
                placeholder="Enter offer description"
                required
              ></textarea>
            </div>

            {/* Image Upload Input */}
            <div className="mb-3">
              <label htmlFor="img" className="form-label fw-bold">
                Upload Image
              </label>
              <input
                type="file"
                className="form-control"
                id="img"
                name="img"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
            </div>

            {/* Image Preview */}
            {offer.img && (
              <div className="mb-3">
                <img
                  src={offer.img}
                  alt="Offer Preview"
                  className="img-thumbnail"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-primary px-4">
                Create Offer
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateOffer;
