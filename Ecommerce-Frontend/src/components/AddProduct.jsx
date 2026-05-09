import React, { useState } from "react";
import API from "../axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // ✅ FIXED: Must wrap product JSON in a Blob with application/json type
    // Without this Spring Boot's @RequestPart cannot deserialize the product object → causes 400 error
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    if (image) {
      formData.append("imageFile", image);
    }

    try {
      const response = await API.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("SUCCESS:", response.data);
      alert("Product added successfully");

      // Reset form
      setProduct({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
      });
      setImage(null);

    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message);
      alert("Error adding product: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Product</h2>

      <form className="row g-3" onSubmit={submitHandler}>
        <div className="col-md-6">
          <input name="name" className="form-control" placeholder="Name" value={product.name} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6">
          <input name="brand" className="form-control" placeholder="Brand" value={product.brand} onChange={handleInputChange} required />
        </div>

        <div className="col-12">
          <input name="description" className="form-control" placeholder="Description" value={product.description} onChange={handleInputChange} />
        </div>

        <div className="col-md-4">
          <input type="number" name="price" className="form-control" placeholder="Price" value={product.price} onChange={handleInputChange} required />
        </div>

        <div className="col-md-4">
          <select name="category" className="form-select" value={product.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            <option value="Laptop">Laptop</option>
            <option value="Headphone">Headphone</option>
            <option value="Mobile">Mobile</option>
            <option value="Electronics">Electronics</option>
            <option value="Toys">Toys</option>
            <option value="Fashion">Fashion</option>
          </select>
        </div>

        <div className="col-md-4">
          <input type="number" name="stockQuantity" className="form-control" placeholder="Stock" value={product.stockQuantity} onChange={handleInputChange} />
        </div>

        <div className="col-md-6">
          <input type="date" name="releaseDate" className="form-control" value={product.releaseDate} onChange={handleInputChange} />
        </div>

        <div className="col-md-6">
          <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="col-12">
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable}
            onChange={handleInputChange}
          /> <label style={{ marginLeft: "8px" }}>Available</label>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
