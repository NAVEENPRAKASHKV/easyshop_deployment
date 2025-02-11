import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegImages } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_editProduct,
  update_product,
  messageClear,
} from "../../store/Reducers/productReducer";
import { get_category } from "../../store/Reducers/categoryReducer";
import { PropagateLoader } from "react-spinners";
import { toast } from "react-hot-toast";
import { overRideStyle } from "./../../utils/spinnerProperty";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { validationProduct } from "../../utils/validationProduct";
const EditProduct = () => {
  const { categories } = useSelector((store) => store.category);
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });
  const [cateShow, setCateShow] = useState(false); //toggle the category input
  const [category, setCategory] = useState(""); //to set category input from the modal
  const [allCategory, setAllCategory] = useState(categories); //all category
  const [searchValue, setSearchValue] = useState("");
  const { singleProduct, loader, successMessage, errorMessage } = useSelector(
    (store) => store.product
  );
  const [newImages, setNewImages] = useState([]); // To track new images
  const [cropper, setCropper] = useState(null); // Cropper instance
  const [cropImage, setCropImage] = useState(null); // Image to crop
  const [isCropping, setIsCropping] = useState(false); // Toggle cropping modal
  const [images, setImages] = useState([]); // Final cropped images
  const [imageShow, setImageShow] = useState([]);
  const [oldImages, setOldImages] = useState([]);

  // useEffect for geting product
  useEffect(() => {
    dispatch(get_editProduct(productId));
  }, [productId]);
  //category dispatch
  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, []);
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setCategory("");
      setNewImages([]);
      setOldImages([]);
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  // handling removing the images
  const handleRemove = (img, i) => {
    if (img?.url) {
      const filterdImages = images.filter((_, index) => index !== i);
      const filterdUrl = imageShow.filter((_, index) => index !== i);
      const filterdNewImages = images.filter((_, index) => index !== i);
      setImages(filterdImages);
      setImageShow(filterdUrl);
      setNewImages(filterdNewImages);
    }
    if (img) {
      const afterFilter = oldImages.filter((oldImg) => oldImg !== img);
      setImageShow(afterFilter);
      setOldImages([...afterFilter]);
      console.log(afterFilter);
    }
  };
  //handle input data
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  // handle new image upload
  const imageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;
    if (length > 0) {
      setCropImage(URL.createObjectURL(files[0]));
      setIsCropping(true);
    }
  };
  // category search
  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      let srcValue = allCategory.filter((c) =>
        c.categoryName.toLowerCase().includes(value.toLowerCase())
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categories);
    }
  };

  useEffect(() => {
    setState({
      name: singleProduct.name,
      description: singleProduct.description,
      discount: singleProduct.discount,
      price: singleProduct.price,
      brand: singleProduct.brand,
      stock: singleProduct.stock,
    });
    setCategory(singleProduct.category);
    setImageShow(singleProduct.images);
    setOldImages(singleProduct.images);
  }, [singleProduct]);

  // send data to server
  const update = (e) => {
    e.preventDefault();
    // Validation checks form values and images
    const errors = validationProduct(state);
    if (Object.keys(errors).length > 0) {
      for (let error of Object.values(errors)) {
        toast.error(error);
      }
      return;
    }

    const formData = new FormData();
    if (newImages.length > 0)
      newImages.forEach((img) => formData.append("images", img));

    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("discount", state.discount);
    formData.append("price", state.price);
    formData.append("brand", state.brand);
    formData.append("stock", state.stock);
    formData.append("category", category);
    formData.append("productId", productId);
    formData.append("oldImages", oldImages);
    dispatch(update_product(formData));
    setOldImages([]);
  };

  return (
    <div className="px-2 lg:pr-7 ">
      <div className="my-5">
        <h1 className="text-xl font-bold">Edit Product Details</h1>
      </div>
      <div className="w-full p-4 bg-slate-600 rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-white text-xl font-semibold">Product Details</h1>
          <Link
            to="/seller/dashboard/all-product"
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2"
          >
            All Product
          </Link>
        </div>
        <div>
          <form onSubmit={update}>
            {/* product and Brand */}
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-white">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product Name</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none  border border-slate-700 rounded-md text-black "
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product Name"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Product Brand</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none text-black border border-slate-700 rounded-md "
                  onChange={inputHandle}
                  value={state.brand}
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Brand Name"
                />
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-white">
              {/* Category */}
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className="px-4 py-2 focus:border-indigo-500 outline-none  border border-slate-700 rounded-md text-black"
                  onChange={inputHandle}
                  value={category}
                  type="text"
                  id="category"
                  placeholder="--select category--"
                />

                <div
                  className={`absolute top-[100%] bg-lime-900 w-full transition-all ${
                    cateShow ? "scale-100" : "scale-0"
                  } `}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-100 rounded-md text-[#d0d2d6] overflow-hidden"
                      type="text"
                      placeholder="search"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrool">
                    {allCategory.map((c, i) => (
                      <span
                        className={`px-4 py-2 hover:bg-indigo-400 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                          category === c.categoryName && "bg-indigo-700"
                        }`}
                        onClick={() => {
                          setCateShow(false);
                          setCategory(c.categoryName);
                          setSearchValue("");
                          setAllCategory(categories);
                        }}
                      >
                        {c.categoryName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Product Stock</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none  border border-slate-700 rounded-md text-black"
                  onChange={inputHandle}
                  value={state.stock}
                  type="text"
                  name="stock"
                  id="stock"
                  placeholder="Stock"
                />
              </div>
            </div>
            {/* price and discount  */}
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-white">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none  border border-slate-700 rounded-md text-black"
                  onChange={inputHandle}
                  value={state.price}
                  type="number"
                  name="price"
                  id="price"
                  placeholder="price"
                />
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none  border border-slate-700 rounded-md text-black"
                  onChange={inputHandle}
                  value={state.discount}
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="discount by %"
                />
              </div>
            </div>
            {/* description */}
            <div className="flex flex-col w-full gap-1 mb-5">
              <label htmlFor="description" className="text-[#d0d2d6]">
                Description
              </label>
              <textarea
                className="px-4 py-2 focus:border-indigo-500 outline-none  border border-slate-700 rounded-md text-black"
                onChange={inputHandle}
                value={state.description}
                name="description"
                id="description"
                placeholder="Description"
                cols="10"
                rows="4"
              ></textarea>
            </div>
            {/* images */}
            <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full  gap-2 mb-5">
              {/* uploaded images */}
              {imageShow &&
                imageShow.map((img, i) => (
                  <div
                    className={` h-[180px] w-[180px] relative ${
                      newImages.includes(images[i])
                        ? "border-2 border-blue-500"
                        : ""
                    } `}
                  >
                    <label htmlFor={i} className="cursor-pointer">
                      {/* display uploaded images */}
                      <img
                        className="w-full h-full rounded-sm"
                        src={img?.url || img}
                        alt=""
                      />
                    </label>
                    {/* replace images */}

                    {/* remove icon */}
                    <span
                      onClick={() => handleRemove(img, i)}
                      className="absolute right-4  top-2 z-50 w-[20px] h-[20px] rounded-full bg-white hover:bg-red-500 flex justify-center items-center cursor-pointer"
                    >
                      <IoMdCloseCircle />
                    </span>
                  </div>
                ))}
              {/* uploading new images */}
              <label
                htmlFor="image"
                className="flex flex-col justify-center items-center h-[180px] w-[180px] bg-white cursor-pointer"
              >
                <span>
                  <FaRegImages />
                </span>
                <span>Select Image</span>
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                onChange={imageHandle}
              />
            </div>
            {/* save chages  button*/}
            <div className="">
              <button
                disabled={loader}
                className="bg-red-600 py-2 px-3 rounded-lg text-white font-bold"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overRideStyle} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
            {/* modal for cropping*/}
            <div>
              {isCropping && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Crop Image</h3>
                    <Cropper
                      className="w-full h-64"
                      src={cropImage}
                      aspectRatio={1}
                      viewMode={1}
                      guides={true}
                      scalable={true}
                      cropBoxResizable={true}
                      onInitialized={(instance) => setCropper(instance)}
                    />
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        onClick={(e) => {
                          e.preventDefault();
                          if (cropper) {
                            const croppedCanvas = cropper.getCroppedCanvas();
                            croppedCanvas.toBlob((blob) => {
                              if (blob) {
                                const file = new File(
                                  [blob],
                                  "cropped-image.jpg",
                                  { type: "image/jpeg" }
                                );
                                setImages([...images, file]);
                                setNewImages([...newImages, file]);
                                const imageUrl = URL.createObjectURL(file);
                                setImageShow([...imageShow, { url: imageUrl }]); // Update displayed images with the new image URL
                                setIsCropping(false);
                              }
                            });
                          }
                        }}
                      >
                        Crop
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => setIsCropping(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
