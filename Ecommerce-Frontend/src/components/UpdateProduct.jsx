import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        const data = res.data;

        // ✅ FIXED: Format releaseDate to YYYY-MM-DD for HTML date input
        // Without this the date field shows blank on the update form
        if (data.releaseDate) {
          data.releaseDate = new Date(data.releaseDate).toISOString().split("T")[0];
        }

        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // ✅ FIXED: Must wrap product JSON in a Blob with application/json type
    // Without this Spring Boot's @RequestPart cannot deserialize the product → causes 400 error
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // ✅ Image is optional — only append if user selected a new one
    if (image) {
      formData.append("imageFile", image);
    }

    try {
      await API.put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product updated successfully");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      alert("Update failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <h2>Update Product</h2>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input className="form-control" name="name" value={product.name || ""} onChange={handleChange} placeholder="Name" />
        </div>

        <div className="col-md-6">
          <input className="form-control" name="brand" value={product.brand || ""} onChange={handleChange} placeholder="Brand" />
        </div>

        <div className="col-12">
          <input className="form-control" name="description" value={product.description || ""} onChange={handleChange} placeholder="Description" />
        </div>

        <div className="col-md-4">
          <input className="form-control" type="number" name="price" value={product.price || ""} onChange={handleChange} placeholder="Price" />
        </div>

        <div className="col-md-4">
          <select className="form-select" name="category" value={product.category || ""} onChange={handleChange}>
            <option value="">Select category</option>
            <option value="Laptop">Laptop</option>
            <option value="Headphone">Headphone</option>
            <option value="Mobile">Mobile</option>
            <option value="Electronics">Electronics</option>
            <option value="Toys">Toys</option>
            <option value="Fashion">Fashion</option>
          </select>
        </div>

        <div className="col-md-4">
          <input className="form-control" type="number" name="stockQuantity" value={product.stockQuantity || ""} onChange={handleChange} placeholder="Stock" />
        </div>

        <div className="col-md-6">
          <input className="form-control" type="date" name="releaseDate" value={product.releaseDate || ""} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Image (leave empty to keep existing)</label>
          <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="col-12">
          <input
            type="checkbox"
            name="productAvailable"
            checked={product.productAvailable || false}
            onChange={(e) =>
              setProduct({ ...product, productAvailable: e.target.checked })
            }
          />
          <label style={{ marginLeft: "10px" }}>Available</label>
        </div>

        <div className="col-12">
          <button className="btn btn-primary" type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
