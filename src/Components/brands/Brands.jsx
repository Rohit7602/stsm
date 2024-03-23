import React, { useState } from 'react';
import addicon from '../../Images/svgs/addicon.svg';
import search from '../../Images/svgs/search.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import eye_icon from '../../Images/svgs/eye.svg';
import pencil_icon from '../../Images/svgs/pencil.svg';
import deleteicon from '../../Images/svgs/delte.svg';
import addImage from '../../Images/svgs/image-add.svg';
import closeIcon from '../../Images/svgs/closeicon.svg';
import deleteicon2 from '../../Images/svgs/deleteicon.svg';
import Loader from '../Loader';
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from 'firebase/storage';
import { storage, db } from '../../firebase';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useImageHandleContext } from '../../context/ImageHandler';
import { useBrandcontext } from '../../context/BrandsContext';
import Deletepopup from '../popups/Deletepopup';

const Brands = () => {
  const [selectAll, setSelectAll] = useState([]);
  const [addBrand, setAddBrand] = useState(false);
  const [editBrand, setEditBrand] = useState(false)
  const [brandName, setBrandName] = useState('')
  const [brandImg, setaBrandImg] = useState(null);
  const [loading, setLoading] = useState(false)
  const [deletepopup, setdeletepopup] = useState(false)
  const [brandId, setBrandId] = useState('')
  const [searchvalue, setSearchvalue] = useState('')

  const { ImageisValidOrNot } = useImageHandleContext();
  const { allBrands, addBrandData, updateBrandData, deleteBrandData } = useBrandcontext()



  function handleMainCheckboxChange() {
    if (allBrands.length === selectAll.length) {
      setSelectAll([]);
    } else {
      let allCheck = allBrands.map((items) => {
        return items.id;
      });
      setSelectAll(allCheck);
    }
  }
  function handleCheckboxChange(e) {
    let isChecked = e.target.checked;
    let value = e.target.value;
    if (isChecked) {
      setSelectAll([...selectAll, value]);
    } else {
      setSelectAll((prev) =>
        prev.filter((id) => {
          return id != value;
        })
      );
    }
  }
  function handleUploadImage(e) {
    const selectedFile = e.target.files[0];
    if (!ImageisValidOrNot(selectedFile)) {
      toast.error('Please select a valid image file within 1.5 MB.');
      setaBrandImg(null);
    } else {
      setaBrandImg(selectedFile);
    }
  }


  function handleResetBrandData() {
    setAddBrand('')
    setaBrandImg(null)
    setBrandName('')
  }


  const handleAddBrandData = async (e) => {
    e.preventDefault()
    try {
      if (addBrand === "" && brandImg === "") {
        alert("please enter the name and image ")
      } else {
        setLoading(true);
        const filename = Math.floor(Date.now() / 1000) + '-' + brandImg.name;
        const storageRef = ref(storage, `/Brand/${filename}`);
        const upload = await uploadBytes(storageRef, brandImg);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, 'Brands'), {
          name: brandName,
          image: imageUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          totalProducts: 0
        });
        setLoading(false);
        toast.success('Brand added Successfully !', {
          position: toast.POSITION.TOP_RIGHT,
        });
        addBrandData(docRef)
        handleResetBrandData()
      }
    } catch (error) {
      setLoading(false)
      console.log("Error in Brand Data", error)
    }
  }



  async function handleDeleteBrand(id, image) {
    try {
      setLoading(true)
      var st = getStorage();
      await deleteDoc(doc(db, 'Brands', id)).then(() => {
        if (image !== "") {
          var reference = ref(st, image);
          deleteObject(reference);
        }
        deleteBrandData(id);
      });
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  }


  async function handleUpdateBrand(e) {
    e.preventDefault();
    setEditBrand(false);
    setLoading(true);
    try {
      let imageUrl = null;
      if (brandImg instanceof File) {
        const filename = Math.floor(Date.now() / 1000) + '-' + brandImg.name;
        const storageRef = ref(storage, `/Brand/${filename}`);
        await uploadBytes(storageRef, brandImg);
        imageUrl = await getDownloadURL(storageRef);
      } else if (typeof brandImg === 'string' && brandImg.startsWith('http')) {
        imageUrl = brandImg;
      }
      const updateData = {
        name: brandName,
        image: imageUrl,
        updated_at: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'Brands', brandId), updateData);
      updateBrandData({
        brandId,
        ...updateData,
      });
      setLoading(false);
      toast.success('Brands updated Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  }





  function handleDeleteEditImge() {
    setLoading(true);
    setaBrandImg('');
    if (typeof brandImg === 'string' && brandImg.startsWith('http')) {
      setLoading(true);
      try {
        if (brandImg !== "") {
          var st = getStorage();
          var reference = ref(st, brandImg);
          deleteObject(reference);
        }
        setLoading(false);
      } catch (Error) {
        console.log(Error);
      }
      setLoading(false);
    }
    setLoading(false);
  }















  if (loading) {
    return (<Loader />)
  }



  return (
    <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
      {addBrand || editBrand ? <div className="bg_black_overlay"></div> : null}
      {deletepopup === true ? (
        <div className="bg_black_overlay"></div>
      ) : null}
      {addBrand || editBrand ? (
        <div className="add_brand">
          <form action="">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <p className="fs-2sm fw-400 black m-0">Add New Brand</p>
              <img
                onClick={() => {
                  setEditBrand(false)
                  setAddBrand(false)
                }}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <div className="d-flex align-items-center">
              <label className="fs-sm fw-400 black white_space_nowrap me-2" htmlFor="brandName">
                Brand Name
              </label>
              <input
                className="brand_name outline_none"
                type="text"
                id="brandName"
                placeholder="name of Brand"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
              />
            </div>
            <div className="d-flex align-items-star mt-3 pt-1">
              <p className="fs-sm fw-400 black white_space_nowrap me-5 pe-1">Image</p>
              <input type="file" id="image" hidden onChange={handleUploadImage} />
              {!brandImg ? (
                <label
                  htmlFor="image"
                  className="brand_image_upload d-flex align-items-center justify-content-center text-center flex-column">
                  <img src={addImage} alt="addImage" />
                  <p className="fs-sm fw-500 black my-2">
                    drop your image here or <span className="fw-400 color_blue">browse</span>
                  </p>
                  <p className="fs-xxs fw-400 black opacity-75 m-0">Support JPG JP779890, PNG</p>
                </label>
              ) : (
                <div className="position-relative w-100">
                  {brandImg && (
                    <img
                      height={157}
                      className="w-100 object-fit-cover"
                      src={
                        brandImg &&
                          typeof brandImg === 'string' &&
                          brandImg.startsWith('http')
                          ? brandImg
                          : URL.createObjectURL(brandImg)
                      }
                      alt="brandImg"
                    />
                  )}
                  <img
                    onClick={() => handleDeleteEditImge()}
                    className="position-absolute end-0 top-0 cursor_pointer"
                    src={deleteicon2}
                    alt="deleteicon2"
                  />
                </div>
              )}
            </div>
            {editBrand ? <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-1">
              <button className="fs-sm fw-400 black brand_upload_btn" onClick={handleUpdateBrand} >Update</button>
            </div> :
              <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-1">
                <button className="fs-sm fw-400 black brand_rest_btn" onClick={() => handleResetBrandData()}>Reset</button>
                <button className="fs-sm fw-400 black brand_upload_btn" onClick={handleAddBrandData} >Upload</button>
              </div>}
          </form>
        </div>
      ) : null}

      <div className="w-100 px-sm-3 mt-4 bg_body">
        <div className="d-flex flex-column flex-md-row align-items-center gap-2 gap-sm-0 justify-content-between">
          <div className="d-flex">
            <h1 className="fw-500   black fs-lg mb-0">Brands</h1>
          </div>
          <div className="d-flex align-itmes-center justify-content-center justify-content-md-between  gap-3">
            <div className="d-flex px-2 gap-2 align-items-center w_xsm_35 w_sm_50 input_wrapper">
              <img src={search} alt="searchicon" />
              <input
                type="text"
                className="fw-400 categorie_input  "
                placeholder="Search for Brands..."
                value={searchvalue}
                onChange={(e) => setSearchvalue(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => setAddBrand(true)}
                className="addnewproduct_btn black d-flex align-items-center fs-sm px-sm-3 px-2 py-2 fw-400 ">
                <img className="me-1" width={20} src={addicon} alt="add-icon" />
                Add New Brand
              </button>
            </div>
          </div>
        </div>
        {/* categories details  */}
        <div className="p-3 mt-3 bg-white product_shadow ">
          <div className="overflow_xl_scroll line_scroll">
            <div className="categories_xl_overflow_X">
              <table className="w-100">
                <thead className="table_head w-100">
                  <tr className="product_borderbottom w-100">
                    <th className="py-3 ps-3">
                      <div className="d-flex align-items-center gap-3 min_width_300">
                        <label class="check1 fw-400 fs-sm black mb-0">
                          <input
                            type="checkbox"
                            checked={allBrands.length === selectAll.length}
                            onChange={handleMainCheckboxChange}
                          />
                          <span class="checkmark"></span>
                        </label>
                        <p className="fw-400 fs-sm black mb-0">Brand Name / Title</p>
                      </div>
                    </th>
                    <th className="mx_160 text-center pe-4">
                      <h3 className="fs-sm fw-400 black mb-0">Total Products</h3>
                    </th>
                    <th className="mw-90 p-3 me-1">
                      <h3 className="fs-sm fw-400 black mb-0">Action</h3>
                    </th>
                  </tr>
                </thead>
                <tbody className="table_body">

                  {allBrands.filter((item) => {
                    return (searchvalue.toLowerCase() === '' ? item : item.name.toLowerCase().includes(searchvalue))
                  }).map((value, index) => {
                    return (
                      <tr key={index} className="product_borderbottom">
                        <td className="py-3 ps-3 w-100">
                          <div className="d-flex align-items-center gap-3 min_width_300">
                            <label className="check1 fw-400 fs-sm black mb-0">
                              <input
                                type="checkbox"
                                value={value.id}
                                checked={selectAll.includes(value.id)}
                                onChange={handleCheckboxChange}
                              />
                              <span className="checkmark me-5"></span>
                            </label>
                            <div>
                              <p className="fw-400 fs-sm black mb-0">{value.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="mx_160 text-center pe-4">
                          <h3 className="fs-sm fw-400 black mb-0 color_green text-center">
                            {value.totalProducts}
                          </h3>
                        </td>
                        <td className="text-center mw-90">
                          <div class="dropdown">
                            <button
                              class="btn dropdown-toggle"
                              type="button"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false">
                              <img src={dropdownDots} alt="dropdownDots" />
                            </button>
                            <ul
                              class="dropdown-menu categories_dropdown"
                              aria-labelledby="dropdownMenuButton1">
                              <li>
                                <div class="dropdown-item" href="#">
                                  <div onClick={() => {
                                    setBrandName(value.name)
                                    setaBrandImg(value.image)
                                    setEditBrand(true)
                                    setBrandId(value.id)
                                  }} className="d-flex align-items-center categorie_dropdown_options">
                                    <img src={pencil_icon} alt="" />
                                    <p className="fs-sm fw-400 black mb-0 ms-2">Edit</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div class="dropdown-item" href="#">
                                  <div className="d-flex align-items-center categorie_dropdown_options">
                                    <img src={eye_icon} alt="" />
                                    <p className="fs-sm fw-400 black mb-0 ms-2">View Details</p>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div class="dropdown-item" href="#">
                                  <div onClick={() => {
                                    setBrandId(value.id);
                                    setaBrandImg(value.image);
                                    setdeletepopup(true);
                                  }} className="d-flex align-items-center categorie_dropdown_options">
                                    <img src={deleteicon} alt="" />
                                    <p className="fs-sm fw-400 red mb-0 ms-2">Delete</p>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
          {deletepopup ? (
            <Deletepopup
              showPopup={setdeletepopup}
              handleDelete={() => handleDeleteBrand(brandId, brandImg)}
              itemName="Brand"
            />
          ) : null}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Brands;
