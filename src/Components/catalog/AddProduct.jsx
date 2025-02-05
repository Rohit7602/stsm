import React, { useState, useEffect, useContext } from "react";
import saveicon from "../../Images/svgs/saveicon.svg";
import savegreenicon from "../../Images/svgs/save_green_icon.svg";
import SearchIcon from "../../Images/svgs/search.svg";
import whiteSaveicon from "../../Images/svgs/white_saveicon.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import deleteiconWithBg from "../../Images/svgs/delete-icon-with-bg.svg";
import closeicon from "../../Images/svgs/closeicon.svg";
import addIcon from "../../Images/svgs/addicon.svg";
import editIcon from "../../Images/svgs/pencil.svg";
import checkGreen from "../../Images/svgs/check-green-btn.svg";
import closeRed from "../../Images/svgs/close-red-icon.svg";
import dropdownImg from "../../Images/svgs/dropdown_icon.svg";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { Col, DropdownButton, Row } from "react-bootstrap";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Dropdown from "react-bootstrap/Dropdown";
import { storage } from "../../firebase";
import { useRef } from "react";
import { useProductsContext } from "../../context/productgetter";
import { useSubCategories } from "../../context/categoriesGetter";
import { useBrandcontext } from "../../context/BrandsContext";
import { UseServiceContext } from "../../context/ServiceAreasGetter";
import { useParams, useNavigate } from "react-router-dom";
import { increment } from "firebase/firestore";
import Loader from "../Loader";
import { Units } from "../../Common/Helper";
import { Editor } from "@tinymce/tinymce-react";
const AddProduct = () => {
  const navigate = useNavigate();

  const { productData, updateProductData } = useProductsContext();
  const { allBrands } = useBrandcontext();
  const { ServiceData } = UseServiceContext();

  const skuList = productData.map((product) => product.sku);
  // console.log("sku list is ", skuList)

  const productId = useParams();

  let ProductsID = productId.id;
  const [name, setName] = useState("");
  const [shortDes, setShortDes] = useState("");
  const [longDes, setLongDes] = useState("");
  const [isvarient, setisVarient] = useState(false);
  const [colorVar, setColorVar] = useState(false);
  const [color, setColor] = useState("");
  const [storeColors, setStoreColors] = useState([]);
  const [colorInput, setColorInput] = useState(false);
  // context
  const { addData } = useProductsContext();
  const { data } = useSubCategories();
  // console.log(color);
  const [status, setStatus] = useState("published");
  const [sku, setSku] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [StockCount, setStockCount] = useState("");
  const [stockPrice, setStockPrice] = useState("");
  const [categories, setCategories] = useState("");
  const [imageUpload22, setImageUpload22] = useState([]);
  // const [categoriesdata, setSubcategoriesData] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [stockpopup, setStockpopup] = useState(false);
  const [stockeditpopup, setStockEditpopup] = useState(false);
  const [DeliveryCharge, setDeliveryCharges] = useState();
  const [salesprice, setSalesPrice] = useState();
  const [ServiceCharge, setServiceCharge] = useState();

  //  search functionaltiy in categories and selected categories
  const [searchvalue, setSearchvalue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [previousCategoryId, setPreviousCategoryId] = useState(null);
  const [previousCategoryname, setpreviousCategoryname] = useState(null);
  const [previousCategoryParentId, setpreviousCategoryParentId] =
    useState(null);
  const [brandid, setbrandid] = useState(null);
  const [selectBrand, setSelectBrand] = useState(null);
  const [previousbrandId, setPreviousbrandId] = useState(null);
  const [previousbrandName, setPreviousbrandName] = useState(null);
  const [previousbrandImage, setPreviousbrandImage] = useState(null);
  const [stockUnitType, setStockUnitType] = useState("KG");
  const [perUnitPrice, setPerUnitPrice] = useState("");
  const [totalStockQun, setTotalStockQun] = useState("");
  const [showchecked, setShowchecked] = useState(false);
  const [showweightfield, setShowweightfield] = useState(false);

  const handleSelectCategory = (category) => {
    setSearchvalue("");
    setSelectedCategory(category);
    setSelectedCategoryId(category.id);
  };

  const handleSelectBrand = (brand) => {
    setSelectBrand(brand);
    setbrandid(brand.id);
  };
  const [areaPinCode, setAreaPinCode] = useState("");
  const [addMoreArea, setAddMoreArea] = useState([
    {
      pincode: "",
      area_name: "",
      terretory: [],
    },
  ]);
  const [variants, setVariants] = useState([]);
  const [discountvalue, setDiscountvalue] = useState(null);
  const [unitPrice, setUnitPrice] = useState("");
  const [totalunit, setTotalunit] = useState("");
  const [totalweight, setTotalweight] = useState(null);
  const [SalesmanCommission, setSalesmanComssion] = useState("");
  const [VarintName, setVariantsNAME] = useState("");
  const [Tax, setTax] = useState(null);
  const [discountType, setDiscountType] = useState(null);
  function HandleAddVarients() {
    setVariants((prevVariants) => [
      ...prevVariants,
      {
        totalunit: totalunit,
        totalweight: totalweight,
        SalesmanCommission: SalesmanCommission,
        VarientName: VarintName,
        unitPrice: unitPrice,
        discountType: discountType,
        discountvalue: discountvalue,
      },
    ]);
    // Reset individual variant properties
    setUnitPrice(0);
    setTotalunit("");
    setTotalweight(null);
    setDiscountType(null);
    setDiscountvalue(null);
    setVariantsNAME("");
  }

  function handleDeleteVariant(index) {
    setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
  }

  const [selectarea, setSelectArea] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(
    Array(addMoreArea.length).fill(false)
  );
  const dropdownRef = useRef(null);
  // const [areas, setAreas] = useState([]);

  // const handleCheckboxChange = (e) => {
  //   let isChecked = e.target.checked;
  //   let value = e.target.value;
  //   if (isChecked) {
  //     setSelectArea([...selectarea, value]);
  //   } else {
  //     setSelectArea((prevState) => prevState.filter((area) => area !== value));
  //   }
  // };

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => {
      if (Array.isArray(prevState)) {
        const newState = [...prevState];
        newState[index] = !newState[index];
        return newState;
      } else {
        return !prevState;
      }
    });
  };

  const onhandelunittype = (itmes) => {
    setStockUnitType(itmes);
    if (itmes === "BAG") {
      setShowweightfield(true);
    } else {
      setShowweightfield(false);
    }
  };

  useEffect(() => {
    if (stockUnitType === "BAG") {
      setShowweightfield(true);
    } else {
      setTotalweight(null);
    }
  }, [stockUnitType, showweightfield]);

  const closeDropdown = (index) => {
    setDropdownOpen((prevState) => {
      if (Array.isArray(prevState)) {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      } else {
        return false;
      }
    });
  };

  const handleProductInputClick = (index) => {
    if (dropdownOpen[index]) {
      closeDropdown(index);
    } else {
      // Close other dropdowns before opening the clicked one
      setDropdownOpen(Array(addMoreArea.length).fill(false));
      toggleDropdown(index);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handlAddMoreAreas() {
    setAddMoreArea((prevareas) => [
      ...prevareas,
      {
        pincode: "",
        area_name: "",
        terretory: [],
      },
    ]);
  }

  function handleDeleteArea(index) {
    // setVariants((prevVariants) => prevVariants.filter((_, i) => i !== index));
    setAddMoreArea((Prevarareas) => Prevarareas.filter((_, i) => i !== index));
  }

  function handlePincodeChange(index) {
    const filterData = ServiceData.filter(
      (datas) => datas.PostalCode === areaPinCode
    );
    const areaName = filterData[0]?.AreaName || "";
    // console.log(areaName);
    setAddMoreArea((prevVariants) =>
      prevVariants.map((v, i) =>
        i === index
          ? {
              ...v,
              pincode: v.pincode,
              area_name: areaName,
              terretory: v.terretory,
            }
          : v
      )
    );
  }

  function handleSelectedAreasChange(index, newSelectedAreas) {
    setAddMoreArea((prevVariants) =>
      prevVariants.map((v, i) =>
        i === index ? { ...v, terretory: newSelectedAreas } : v
      )
    );
  }

  // const allPincodes = addMoreArea.map(area => area.pincode);

  // const filteredServices = allPincodes.reduce((acc, pincode) => {
  //   const servicesForPincode = ServiceData.filter(service => service.PostalCode === pincode);
  //   return [...acc, ...servicesForPincode];
  // }, []);

  // console.log("filtered service is ", filteredServices);

  // useEffect(() => {
  //   const latestPincode = addMoreArea[addMoreArea.length - 1]?.pincode;
  //   if (latestPincode) {
  //     // Update areas based on the latest added pincode
  //     const filteredServices = ServiceData.filter(service => service.PostalCode === latestPincode);
  //     const newAreas = filteredServices.map(service => service.AreaList);
  //     setAreas(newAreas);
  //   } else {
  //     setAreas([]); // Reset areas if no pincode is available
  //   }
  // }, [addMoreArea, ServiceData]);

  // stock popup save functionality

  // useEffect(() => {
  //   console.log("add more areas is", addMoreArea)
  // }, [addMoreArea])

  // get total amount functionality
  // function handleTotalQunatity(e) {
  //   let value = e.target.value;
  //   setTotalStockQun(value);
  //   return setTotalStock(totalStock + totalStockQun);
  // }

  // function handleSetTotalPrice(e) {
  //   let value = e.target.value;
  //   return setStockPrice(value);
  // }

  function HandleStockPopUpSave() {
    setStockPrice(totalStock * perUnitPrice);
    setTotalStock(Number(totalStock) + Number(totalStockQun));
    setTotalStockQun("");
    setStockpopup(false);
  }
  // const convertDeltaToHtml = (deltaops) => {
  //   const converter = new QuillDeltaToHtmlConverter(deltaops, {});
  //   return converter.convert();
  // };

  function handleDescriptionChange(editor) {
    const content = editor.getContent();
    setLongDes(content);
  }

  // const pubref = useRef();
  // const hidref = useRef();

  function handleReset() {
    setName("");
    setShortDes("");
    setLongDes("");
    setUnitPrice("");
    setTotalunit("");
    setTotalweight(null);
    setDiscountType(null);
    setDiscountvalue(null);
    setVariants([]);
    setCategories();
    setStatus("published");
    setSku("");
    setTotalStock("");
    setImageUpload22([]);
    setSelectedCategory(null);
    setStockPrice("");
    setDeliveryCharges("");
    setSalesPrice("");
    setSalesmanComssion("");
    setServiceCharge("");
    setPerUnitPrice("");
    setAreaPinCode("");
    setStoreColors([]);
    setStockCount("");
    setTax("");
  }

  async function handlesave(e) {
    e.preventDefault();

    if (imageUpload22.length === 0 && status === undefined) {
      toast.error("set status");
    } else if (imageUpload22.length === 0) {
      toast.error("set image ");
    } else if (!name || !shortDes || !totalStock) {
      toast.error("Please enter TotalStock");
    } else if (!selectedCategory) {
      toast.error("please select category ");
    } else if (perUnitPrice === "") {
      toast.error("please select Per Unit Price ");
    } else {
      try {
        setLoaderstatus(true);
        const imagelinks = [];
        for await (const file of imageUpload22) {
          const filename = Math.floor(Date.now() / 1000) + "-" + file.name;
          const storageRef = ref(storage, `/products/${filename}`);
          const upload = await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          imagelinks.push(imageUrl);
        }

        const docRef = await addDoc(collection(db, "products"), {
          name: name,
          shortDescription: shortDes,
          longDescription: longDes,
          status: status,
          sku: sku,
          totalStock: totalStock,
          stockAlert: StockCount,
          stockUnitType: stockUnitType,
          perUnitPrice: perUnitPrice,
          categories: {
            parent_id: selectedCategory.cat_ID,
            id: selectedCategory.id,
            name: selectedCategory.title,
          },
          brand: {
            id: selectBrand ? selectBrand.id : " ",
            name: selectBrand ? selectBrand.name : " ",
            image: selectBrand ? selectBrand.image : " ",
          },
          productImages: imagelinks,
          created_at: Date.now(),
          updated_at: Date.now(),
          // SalesmanCommission: SalesmanCommission || '0',
          ServiceCharge: ServiceCharge || "0",
          DeliveryCharge: DeliveryCharge || "0",
          salesprice: salesprice || "0",
          colors: storeColors,
          Tax: Tax || 0,
          isMultipleVariant: isvarient === true,
          ...(isvarient === false
            ? {
                varients: [
                  {
                    totalunit: totalunit,
                    totalweight: totalweight,
                    SalesmanCommission: SalesmanCommission,
                    VarientName: VarintName,
                    unitPrice: unitPrice,
                    discountType: discountType,
                    discountvalue: discountvalue,
                  },
                ],
              }
            : {
                varients: variants,
              }), // Include the actual list of variants if varient is true
          serviceable_areas: addMoreArea,
        });
        setSearchdata([]);
        setLoaderstatus(false);

        await updateDoc(doc(db, "sub_categories", selectedCategoryId), {
          noOfProducts: increment(1),
        });

        if (brandid) {
          await updateDoc(doc(db, "Brands", brandid), {
            totalProducts: increment(1),
          });
        }

        toast.success("Product added Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        handleReset();
        addData(docRef);
      } catch (e) {
        setLoaderstatus(false);
        toast.error(e, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Error adding document: ", e);
      }
    }
  }

  // image upload section

  function handelUploadImages(event) {
    const selectedImages = Array.from(event.target.files);

    selectedImages.forEach((selectedFile) => {
      const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        toast.error("Please select a valid image file within 1.5 MB.");
      } else {
        setImageUpload22((prevImages) => [...prevImages, selectedFile]);
      }
    });
  }

  function handleDeleteImages(index) {
    const updatedImages = [...imageUpload22];
    updatedImages.splice(index, 1);
    setImageUpload22(updatedImages);
  }

  // Edit Product
  let filterdata = [];
  if (productId.id) {
    filterdata = productData.filter((items) => items.id === productId.id);
  }
  useEffect(() => {
    if (filterdata) {
      filterdata.map((items) => {
        if (items.name) setName(items.name);
        if (items.shortDescription) setShortDes(items.shortDescription);
        if (items.longDescription) setLongDes(items.longDescription);
        if (items.status) setStatus(items.status);
        if (items.totalStock) setTotalStock(items.totalStock);
        if (items.sku) setSku(items.sku);
        if (items.isMultipleVariant) setisVarient(items.isMultipleVariant);
        if (items.varients && items.varients.VarientName)
          setVariantsNAME(items.varients.VarientName);
        if (items.categories && items.categories.name)
          setSelectedCategory(items.categories.name);
        if (items.productImages) setImageUpload22(items.productImages);
        if (items.DeliveryCharge) setDeliveryCharges(items.DeliveryCharge);
        if (items.salesprice) setSalesPrice(items.salesprice);
        if (items.perUnitPrice) setPerUnitPrice(items.perUnitPrice);
        if (items.stockUnitType) setStockUnitType(items.stockUnitType);
        if (items.ServiceCharge) setServiceCharge(items.ServiceCharge);
        if (items.SalesmanCommission)
          setSalesmanComssion(items.varients.SalesmanCommission);
        if (items.totalunit) setTotalunit(items.varients.totalunit);
        if (items.totalweight) setTotalweight(items.varients.totalweight);
        if (items.showchecked) setShowchecked(items.varients.showchecked);
        if (items.stockAlert) setStockCount(items.stockAlert);
        if (items.colors) setStoreColors(items.colors);
        if (items.categories && items.categories.id)
          setPreviousCategoryId(items.categories.id);
        if (items.categories && items.categories.parent_id)
          setpreviousCategoryParentId(items.categories.parent_id);
        if (items.categories && items.categories.name)
          setpreviousCategoryname(items.categories.name);
        if (items.brand && items.brand.id) setPreviousbrandId(items.brand.id);
        if (items.brand && items.brand.name)
          setPreviousbrandName(items.brand.name);
        if (items.brand && items.brand.image)
          setPreviousbrandImage(items.brand.image);
        if (items.brand && items.brand.name) setSelectBrand(items.brand.name);
        if (items.Tax) setTax(items.Tax);

        const allVariants = [];
        if (items.varients) {
          items.varients.map((itm) => {
            if (itm.discountType !== null && itm.discountvalue !== null)
              setShowchecked(true);
            allVariants.push({
              totalunit: itm.totalunit,
              totalweight: itm.totalweight,
              SalesmanCommission: itm.SalesmanCommission,
              VarientName: itm.VarientName,
              unitPrice: itm.unitPrice,
              discountType: itm.discountType,
              discountvalue: itm.discountvalue,
            });
          });
        }
        const allAreas = [];
        if (items.serviceable_areas) {
          items.serviceable_areas.map((item) => {
            allAreas.push({
              area_name: item.area_name,
              pincode: item.pincode,
              terretory: item.terretory,
            });
            setAreaPinCode(item.pincode);
          });
          setAddMoreArea(allAreas);
        }
        // Set the state with all the variants
        setVariants(allVariants);
      });
    }
  }, [productId.id, filterdata.length > 0]);

  useEffect(() => {
    if (storeColors && storeColors.length > 0) {
      // console.log('if working ');
      setColorVar(true);
    } else {
      setColorVar(false); // Uncheck the "Yes" checkbox if there are no colors
    }
  }, [storeColors]);

  function handelStoreColor() {
    if (color !== "") {
      setStoreColors([...storeColors, color]);
      setColorInput(false);
      setColor("");
    }
  }

  function handelColorDelete(index) {
    let updaedColor = [...storeColors];
    updaedColor.splice(index, 1);
    setStoreColors(updaedColor);
  }

  //  update Product Functionality start from here

  function CancelUpdate(e) {
    e.preventDefault();
    navigate("/catalog/productlist");
  }

  async function UpdateProductDatas(e) {
    e.preventDefault();
    setLoaderstatus(true);
    try {
      const imagelinksupdate = [];
      for await (const file of imageUpload22) {
        let imageUrl = null;
        if (file instanceof File) {
          const filename = Math.floor(Date.now() / 1000) + "-" + file.name;
          const storageRef = ref(storage, `/products/${filename}`);
          await uploadBytes(storageRef, file);
          imageUrl = await getDownloadURL(storageRef);
        } else if (typeof file === "string" && file.startsWith("http")) {
          imageUrl = file;
        }
        if (imageUrl) {
          imagelinksupdate.push(imageUrl);
        }
      }

      // console.log('previoisdCategoryId', variants);

      const updatedVariants = variants.map((variant) => ({
        ...variant,
        totalweight: showweightfield ? variant.totalweight : null,
      }));

      const updateDatas = {
        name: name,
        shortDescription: shortDes,
        longDescription: longDes,
        status: status,
        sku: sku,
        totalStock: totalStock,
        stockAlert: StockCount,
        stockUnitType: stockUnitType,
        perUnitPrice: perUnitPrice,
        categories: {
          parent_id: previousCategoryParentId,
          id: previousCategoryId,
          name: previousCategoryname,
        },
        productImages: imagelinksupdate,
        updated_at: Date.now(),
        // SalesmanCommission: SalesmanCommission || "0",
        ServiceCharge: ServiceCharge || "0",
        DeliveryCharge: DeliveryCharge || "0",
        salesprice: salesprice || "0",
        colors: storeColors,
        isMultipleVariant: isvarient === true,
        brand: {
          id: previousbrandId || "",
          name: previousbrandName || "",
          image: previousbrandImage || "",
        },
        Tax: Tax || 0,
        ...(isvarient === false
          ? {
              varients: [
                {
                  totalunit: variants[0].totalunit,
                  totalweight: showweightfield ? variants[0].totalweight : null,
                  SalesmanCommission: variants[0].SalesmanCommission,
                  VarientName: variants[0].VarientName,
                  unitPrice: variants[0].unitPrice,
                  discountType: variants[0].discountType,
                  discountvalue: variants[0].discountvalue,
                },
              ],
            }
          : {
              varients: updatedVariants,
            }),

        serviceable_areas: addMoreArea,
      };
      // console.log("message---------------------", showweightfield);

      // Check if the selected category is different from the existing category
      if (selectedCategoryId === null) {
      } else {
        // console.log('update if working here ', selectedCategoryId);
        updateDatas.categories = {
          parent_id: selectedCategory.cat_ID,
          id: selectedCategory.id,
          name: selectedCategory.title,
        };
        let existingCategoryId = updateDatas.categories.id; // Update existingCategoryId
        // console.log('existing id ', existingCategoryId);

        await updateDoc(doc(db, "sub_categories", previousCategoryId), {
          noOfProducts: increment(-1),
        });

        await updateDoc(doc(db, "sub_categories", existingCategoryId), {
          noOfProducts: increment(1),
        });
      }

      if (brandid === null) {
      } else {
        updateDatas.brand = {
          name: selectBrand.name,
          image: selectBrand.image,
          id: selectBrand.id,
        };

        let existingBrandid = updateDatas.brand.id;
        await updateDoc(doc(db, "Brands", previousbrandId), {
          totalProducts: increment(-1),
        });
        await updateDoc(doc(db, "Brands", existingBrandid), {
          totalProducts: increment(1),
        });
      }

      if (variants.every((item) => item.VarientName != "")) {
        await updateDoc(doc(db, "products", ProductsID), updateDatas);
        updateProductData({
          ProductsID,
          ...updateDatas,
        });
        const today = new Date();
        const formattedDate = today.toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        });
        try {
          const historyRef = collection(db, `Productslogs`);
          const q = query(
            historyRef,
            where("formattedDate", "==", formattedDate)
          );
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            await addDoc(historyRef, {
              formattedDate,
              logs: [updateDatas],
            });
          } else {
            let historyDocId = null;
            let LogsData = [];
            querySnapshot.forEach((doc) => {
              historyDocId = doc.id;
              LogsData = [...doc.data().logs, updateDatas];
            });
            const vanDocRef = doc(db, `Productslogs/${historyDocId}`);
            await updateDoc(vanDocRef, {
              logs: LogsData,
            });
          }
        } catch (error) {
          console.log(error);
        }

        toast.success("Product updated Successfully !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        navigate("/catalog/productlist");
      } else {
        toast.info("Varient name is required !", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      setLoaderstatus(false);
    } catch (error) {
      setLoaderstatus(false);
      console.log("Error in update Product", error);
    }
  }

  function handleSkuChange(e) {
    const newSku = e.target.value;
    if (skuList.includes(newSku)) {
      // SKU already exists, show an error or handle the duplicate SKU
      toast.error("SKU already exists please enter different sku");
    } else {
      // SKU is unique, set the new SKU value
      setSku(newSku);
    }
  }

  if (loaderstatus) {
    return (
      <>
        <Loader></Loader>
      </>
    );
  } else {
    return (
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100">
        <div className="w-100 px-sm-3 pb-4 bg_body pt-3">
          <form onSubmit={handlesave}>
            <div className="d-flex  align-items-center flex-column flex-sm-row gap-2 gap-sm-0  justify-content-between">
              <div className="d-flex">
                <h1 className="fw-500  mb-0 black fs-lg">New Product</h1>
              </div>
              {!productId.id ? (
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button
                      onClick={handleReset}
                      className="fs-sm reset_btn  border-0 fw-400 "
                    >
                      Reset
                    </button>
                  </button>
                  <button
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                    type="submit"
                  >
                    <img src={saveicon} alt="saveicon" />
                    Save
                  </button>
                </div>
              ) : (
                <div className="d-flex align-itmes-center gap-3">
                  <button className="reset_border">
                    <button
                      onClick={(e) => CancelUpdate(e)}
                      className="fs-sm reset_btn  border-0 fw-400 "
                    >
                      Cancel
                    </button>
                  </button>
                  <button
                    onClick={(e) => UpdateProductDatas(e)}
                    className="fs-sm d-flex gap-2 mb-0 align-items-center px-sm-3 px-2 py-2 save_btn fw-400 black  "
                    type="submit"
                  >
                    <img src={saveicon} alt="saveicon" />
                    Update
                  </button>
                </div>
              )}
            </div>
            <Row className="mt-3">
              <Col xxl={8}>
                {/* Basic Information */}
                <div className="  ">
                  <div>
                    {/* Ist-box  */}
                    <div class="product_shadow bg_white p-3  ">
                      <h2 className="fw-400 fs-2sm black mb-0">
                        Basic Information
                      </h2>
                      {/* ist input */}
                      <label htmlFor="Name" className="fs-xs fw-400 mt-3 black">
                        Name <span className="red ms-1 fs-sm">*</span>
                      </label>
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="Enter product name"
                        id="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />{" "}
                      <br />
                      {/* 2nd input */}
                      <label
                        htmlFor="short"
                        className="fs-xs fw-400 mt-3 black"
                      >
                        Short Description{" "}
                        <span className="red ms-1 fs-sm">*</span>
                      </label>{" "}
                      <br />
                      <input
                        type="text"
                        required
                        className="mt-2 product_input fade_grey fw-400"
                        placeholder="Enter short description"
                        id="short"
                        value={shortDes}
                        onChange={(e) => setShortDes(e.target.value)}
                      />{" "}
                      <br />
                      {/* 3rd input */}
                      <label htmlFor="des" className="fs-xs fw-400 mt-3 black">
                        Description
                      </label>{" "}
                      <br />
                      <div className="add_product-text-editor mt-2">
                        {/* <ReactQuill
                          className="rounded-lg  product_input outline-none "
                          modules={AddProduct.modules}
                          onChange={handleDescriptionChange}
                          formats={AddProduct.formats}
                          value={longDes}
                          placeholder="Write something..."
                        /> */}
                        <Editor
                          className="rounded-lg  product_input outline-none "
                          apiKey="y0dtf4480oa45ebxji2fnpvejkapyz2na98m86zwrshcbt7h"
                          value={longDes}
                          onEditorChange={(content, editor) => {
                            handleDescriptionChange(editor); // Pass the editor object to your custom handler
                          }}
                          init={{
                            placeholder: "Write something...",
                            plugins:
                              "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                            toolbar:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | spellcheckdialog | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                            tinycomments_mode: "embedded",
                            tinycomments_author: "Author name",
                            ai_request: (request, respondWith) =>
                              respondWith.string(() =>
                                Promise.reject(
                                  "See docs to implement AI Assistant"
                                )
                              ),
                          }}
                        />
                      </div>
                    </div>
                    <br />
                    <div className="product_shadow bg_white p-3">
                      <div className="pb-3 mb-1">
                        <h2 className="fw-400 fs-2sm black mb-0">
                          Availability <span className="red ms-1 fs-sm">*</span>
                        </h2>
                        <p className="fs-xxs fw-400 black mt-1 mb-0">
                          Choose the areas where the product will be shown
                        </p>
                      </div>
                      <div className="text-end">
                        <button
                          onClick={handlAddMoreAreas}
                          type="button"
                          className="fs-2sm fw-400 color_green add_varient_btn"
                        >
                          + Add More
                        </button>
                      </div>
                      <div className="row align-items-end">
                        {addMoreArea.map((area, index) => {
                          const pincode = area.pincode;
                          // console.log(pincode);
                          const areasForPincode = ServiceData.filter(
                            (service) => service.PostalCode === pincode
                          ).map((service) => service.AreaList);
                          return (
                            <>
                              <div className=" col-4">
                                <label
                                  className="fs-xs fw-400 mt-3 black"
                                  htmlFor="pinCode"
                                >
                                  Enter Pin Code
                                </label>
                                <div
                                  style={{ height: "46px" }}
                                  className="d-flex align-items-center me-2 product_input mt-2 pe-2"
                                >
                                  <input
                                    required
                                    type="number"
                                    onWheel={(e) => {
                                      e.target.blur();
                                    }}
                                    className="  fade_grey fw-400 border-0 w-100 outline_none"
                                    placeholder="Enter Pincode "
                                    id="pinCode"
                                    value={area.pincode}
                                    onChange={(e) => {
                                      setAddMoreArea((prevsArareas) =>
                                        prevsArareas.map((v, i) =>
                                          i === index
                                            ? {
                                                ...v,
                                                pincode: e.target.value,
                                              }
                                            : v
                                        )
                                      );
                                      setAreaPinCode(e.target.value);
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="pincode_confirm_btn"
                                  >
                                    <img
                                      height={28}
                                      src={checkGreen}
                                      alt="checkGreen"
                                    />
                                  </button>
                                </div>
                              </div>
                              <div className="col-7 position-relative p-0">
                                <label
                                  className="fs-xs fw-400 mt-2 black"
                                  htmlFor=""
                                >
                                  Select Area
                                </label>
                                <div
                                  className="product_input   d-flex align-items-center justify-content-between mt-2"
                                  onClick={() => {
                                    handleProductInputClick(index);
                                    handlePincodeChange(index);
                                  }}
                                >
                                  <p
                                    className="fade_grey fw-400 w-100 mb-0 text-start white_space_nowrap area_slider overflow-x-scroll"
                                    required
                                  >
                                    {area.terretory.length !== 0
                                      ? area.terretory.join(" , ")
                                      : "Select area"}
                                  </p>
                                  <img src={dropdownImg} alt="" />
                                </div>
                                {dropdownOpen[index] && (
                                  <div
                                    ref={dropdownRef}
                                    className="position-absolute z-3 area_dropdown delivery_man_dropdown"
                                  >
                                    {areasForPincode.map((cities, i) => (
                                      <div key={i}>
                                        {cities.map((city) => (
                                          <div
                                            className="d-flex align-items-center gap-3 py-1"
                                            key={city}
                                          >
                                            <input
                                              id={city}
                                              type="checkbox"
                                              value={city}
                                              onChange={(e) => {
                                                const isChecked =
                                                  e.target.checked;
                                                const value = e.target.value;
                                                const newSelectedAreas =
                                                  isChecked
                                                    ? [
                                                        ...(area.terretory ??
                                                          []),
                                                        value,
                                                      ]
                                                    : (
                                                        area.terretory ?? []
                                                      ).filter(
                                                        (selectedCity) =>
                                                          selectedCity !== value
                                                      );
                                                handleSelectedAreasChange(
                                                  index,
                                                  newSelectedAreas
                                                );
                                                // Log the selected areas
                                                // console.log('Selected Areas:', newSelectedAreas);
                                              }}
                                              checked={(
                                                area.terretory ?? []
                                              ).includes(city)}
                                            />
                                            <label
                                              className="fs-xs fw-400 black w-100"
                                              htmlFor={city}
                                            >
                                              {city}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="col-1">
                                <img
                                  onClick={() => handleDeleteArea(index)}
                                  className="w-100 cursor_pointer"
                                  height={47}
                                  src={deleteiconWithBg}
                                  alt="deleteiconWithBg"
                                  // onClick={() => handleDeleteArea(index) }
                                />
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <br />
                    {/* [Pricing] */}
                    <div className="product_shadow bg_white p-3">
                      <div className=" d-flex align-items-center w-75 justify-content-between pb-3 mb-1">
                        <h2 className="fw-400 fs-2sm black mb-0">
                          Have More Varients?{" "}
                          <span className="red ms-1 fs-sm">*</span>
                        </h2>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="varient_yes">
                            Yes
                          </label>
                          <input
                            onChange={() => setisVarient(true)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="varient_yes"
                            checked={isvarient === true}
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="varient_no">
                            No
                          </label>
                          <input
                            onChange={() => setisVarient(false)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="varient_no"
                            checked={isvarient === false}
                          />
                        </div>
                      </div>
                      {isvarient === true ? (
                        <div className="text-end">
                          <button
                            onClick={HandleAddVarients}
                            type="button"
                            className="fs-2sm fw-400 color_green add_varient_btn"
                          >
                            +Add Varient
                          </button>
                        </div>
                      ) : null}
                      {isvarient === true ? (
                        variants.map((variant, index) => (
                          <div key={index} className="varient_form_border">
                            <div className="d-flex align-items-center justify-content-between">
                              <input
                                required
                                className="varient_value fs-2sm fw-400 color_red"
                                placeholder="Enter Varient Name"
                                type="text"
                                value={variant.VarientName}
                                onChange={(e) =>
                                  setVariants((prevVariants) =>
                                    prevVariants.map((v, i) =>
                                      i === index
                                        ? { ...v, VarientName: e.target.value }
                                        : v
                                    )
                                  )
                                }
                              />
                              <img
                                className="cursor_pointer"
                                onClick={() => handleDeleteVariant(index)}
                                src={deleteicon}
                                alt="deleteicon"
                              />
                            </div>
                            <div className="d-flex flex-column flex-sm-row gap-3 flex-wrap">
                              <div className=" d-flex align-items-center gap-3">
                                {/* <div className="w-100">
                                  <label
                                    htmlFor="salesMan"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Unit type
                                  </label>
                                  <br />
                                  <div className="d-flex align-items-center justify-content-between">
                                    <Dropdown className="category_dropdown z-1 w-100">
                                      <Dropdown.Toggle
                                        id="dropdown-basic"
                                        className="mt-2 unit_type_input border-0"
                                      >
                                        <div className="product_input d-flex align-items-center justify-content-between">
                                          <p className="fade_grey fw-400 w-100 mb-0 text-start">
                                            {variant.unitType}
                                          </p>
                                          <img src={dropdownImg} alt="" />
                                        </div>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="w-100 p-0">
                                        <div>
                                          <Dropdown.Item>
                                            {Units.map((item) => {
                                              return (
                                                <div className="d-flex justify-content-between">
                                                  <p
                                                    onClick={(e) => {
                                                      // console.log(e.target.innerHTML);
                                                      setVariants(
                                                        (prevVariants) =>
                                                          prevVariants.map(
                                                            (v, i) =>
                                                              i === index
                                                                ? {
                                                                    ...v,
                                                                    unitType:
                                                                      e.target
                                                                        .innerHTML,
                                                                  }
                                                                : v
                                                          )
                                                      );
                                                    }}
                                                    className="fs-xs fw-400 black mb-0 py-6px"
                                                  >
                                                    {item}
                                                  </p>
                                                  {unitType == item ? (
                                                    <img
                                                      src={savegreenicon}
                                                      alt="savegreenicon"
                                                    />
                                                  ) : null}
                                                </div>
                                              );
                                            })}
                                          </Dropdown.Item>
                                        </div>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </div>
                                </div> */}

                                <div className="w-100">
                                  <label
                                    htmlFor="origi"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Total Unit{" "}
                                    <span>{`(${stockUnitType})`}</span>
                                  </label>
                                  <input
                                    required
                                    type="number"
                                    onWheel={(e) => {
                                      e.target.blur();
                                    }}
                                    className="mt-2 product_input fade_grey fw-400"
                                    placeholder="0"
                                    id="origi"
                                    value={variant.totalunit}
                                    onChange={(e) =>
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v, i) =>
                                          i === index
                                            ? {
                                                ...v,
                                                totalunit: e.target.value,
                                              }
                                            : v
                                        )
                                      )
                                    }
                                  />
                                </div>

                                <div className="w-100">
                                  <label
                                    htmlFor="origi"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Unit Price
                                  </label>
                                  <input
                                    required
                                    type="number"
                                    onWheel={(e) => {
                                      e.target.blur();
                                    }}
                                    className="mt-2 product_input fade_grey fw-400"
                                    placeholder="₹ 0.00"
                                    id="origi"
                                    value={variant.unitPrice}
                                    onChange={(e) =>
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v, i) =>
                                          i === index
                                            ? {
                                                ...v,
                                                unitPrice: e.target.value,
                                              }
                                            : v
                                        )
                                      )
                                    }
                                  />
                                </div>

                                <div className=" w-100">
                                  <label
                                    htmlFor="salesMan"
                                    className="fs-xs fw-400 mt-3 black"
                                  >
                                    Sales man Commission
                                  </label>
                                  <br />
                                  <div className="d-flex align-items-center justify-content-between product_input mt-2">
                                    <input
                                      required
                                      type="number"
                                      onWheel={(e) => {
                                        e.target.blur();
                                      }}
                                      className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                                      placeholder="₹ 0.00"
                                      id="salesMan"
                                      value={variant.SalesmanCommission}
                                      onChange={(e) =>
                                        setVariants((prevVariants) =>
                                          prevVariants.map((v, i) =>
                                            i === index
                                              ? {
                                                  ...v,
                                                  SalesmanCommission:
                                                    e.target.value,
                                                }
                                              : v
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div>
                                {showweightfield && (
                                  <div className="w-50">
                                    <label
                                      htmlFor="Weight"
                                      className="fs-xs fw-400 mt-3 black"
                                    >
                                      Weight
                                    </label>
                                    <input
                                      required
                                      type="number"
                                      onWheel={(e) => {
                                        e.target.blur();
                                      }}
                                      className="mt-2 product_input fade_grey fw-400"
                                      placeholder="0"
                                      id="Weight"
                                      value={variant.totalweight ?? ""}
                                      onChange={(e) =>
                                        setVariants((prevVariants) =>
                                          prevVariants.map((v, i) =>
                                            i === index
                                              ? {
                                                  ...v,
                                                  totalweight:
                                                    e.target.value || null,
                                                }
                                              : v
                                          )
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                <div className="d-flex align-items-center gap-3">
                                  <div className="w-100 mt-4">
                                    <input
                                      type="checkbox"
                                      checked={variant.discountType !== null}
                                      onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        setVariants((prevVariants) =>
                                          prevVariants.map((v, i) =>
                                            i === index
                                              ? {
                                                  ...v,
                                                  showchecked: isChecked,
                                                  discountType: isChecked
                                                    ? "Amount"
                                                    : null,
                                                  discountvalue: isChecked
                                                    ? v.discountvalue ?? 0
                                                    : null,
                                                }
                                              : v
                                          )
                                        );
                                      }}
                                    />
                                    <label className="ms-3">ADD DISCOUNT</label>
                                  </div>

                                  {variant.discountType !== null &&
                                    variant.discountvalue !== null && (
                                      <>
                                        <div className="w-100">
                                          <label
                                            htmlFor="Discount"
                                            className="fs-xs fw-400 mt-3 black"
                                          >
                                            Discount Type
                                          </label>
                                          <select
                                            className="mt-2 product_input fade_grey fw-400"
                                            id="Discount"
                                            value={variant.discountType || ""}
                                            onChange={(e) => {
                                              const selectedDiscountType =
                                                e.target.value;
                                              setVariants((prevVariants) =>
                                                prevVariants.map((v, i) =>
                                                  i === index
                                                    ? {
                                                        ...v,
                                                        discountType:
                                                          selectedDiscountType,
                                                        discountvalue:
                                                          selectedDiscountType ===
                                                          "Amount"
                                                            ? "0"
                                                            : v.discountvalue ||
                                                              "",
                                                      }
                                                    : v
                                                )
                                              );
                                            }}
                                          >
                                            <option value="Amount">
                                              Amount
                                            </option>
                                            <option value="Percentage">
                                              Percentage
                                            </option>
                                          </select>
                                        </div>

                                        <div className="w-100">
                                          <label
                                            htmlFor="ddisc"
                                            className="fs-xs fw-400 mt-3 black"
                                          >
                                            Discount value
                                          </label>
                                          <input
                                            required
                                            type="number"
                                            onWheel={(e) => {
                                              e.target.blur();
                                            }}
                                            className="mt-2 product_input fade_grey fw-400"
                                            placeholder={
                                              variant.discountType !==
                                              "Percentage"
                                                ? "₹ 0.00"
                                                : "%"
                                            }
                                            id="ddisc"
                                            value={variant.discountvalue || ""} // Handle case when discountvalue is null
                                            onChange={(e) => {
                                              const newValue = e.target.value;
                                              setVariants((prevVariants) =>
                                                prevVariants.map((v, i) =>
                                                  i === index
                                                    ? {
                                                        ...v,
                                                        discountvalue:
                                                          v.discountType ===
                                                          "Percentage"
                                                            ? Math.min(
                                                                newValue,
                                                                100
                                                              )
                                                            : newValue,
                                                      }
                                                    : v
                                                )
                                              );
                                            }}
                                          />
                                        </div>
                                      </>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>
                          <div>
                            <input
                              value={
                                variants.length == 0
                                  ? VarintName
                                  : variants[0].VarientName
                              }
                              required
                              className="varient_value fs-2sm fw-400 color_red"
                              placeholder="Enter Varient Name"
                              type="text"
                              onChange={(e) => {
                                if (variants.length === 0) {
                                  // Set unitPrice directly if variants array is empty
                                  setVariantsNAME(e.target.value);
                                } else {
                                  // Update unitPrice for the specific variant
                                  setVariants((prevVariants) =>
                                    prevVariants.map((v, i) =>
                                      i === 0
                                        ? {
                                            ...v,
                                            VarientName: e.target.value,
                                          }
                                        : v
                                    )
                                  );
                                }
                              }}
                            />
                          </div>
                          <div className="d-flex flex-column ">
                            <div className=" d-flex flex-column  flex-sm-row gap-3">
                              {/* <div className="w-100">
                                <label
                                  htmlFor="salesMan"
                                  className="fs-xs fw-400 mt-3 black"
                                >
                                  Unit Type
                                </label>
                                <br />
                                <div className="d-flex align-items-center justify-content-between">
                                  <Dropdown className="category_dropdown z-1 w-100">
                                    <Dropdown.Toggle
                                      id="dropdown-basic"
                                      className="mt-2 unit_type_input border-0"
                                    >
                                      <div className="product_input d-flex align-items-center justify-content-between">
                                        <p className="fade_grey fw-400 w-100 mb-0 text-start">
                                          {unitType}
                                        </p>
                                        <img src={dropdownImg} alt="" />
                                      </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="w-100 p-0">
                                      <div>
                                        <Dropdown.Item>
                                          {Units.map((item) => {
                                            return (
                                              <div
                                                onClick={() =>
                                                  setUnitType(item)
                                                }
                                                className="d-flex justify-content-between"
                                              >
                                                <p className="fs-xs fw-400 black mb-0">
                                                  {item}
                                                </p>
                                                {unitType == item ? (
                                                  <img
                                                    src={savegreenicon}
                                                    alt="savegreenicon"
                                                  />
                                                ) : null}
                                              </div>
                                            );
                                          })}
                                        </Dropdown.Item>
                                      </div>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </div>
                              </div> */}

                              {/* ist input */}
                              <div className="w-100">
                                <label
                                  htmlFor="origi"
                                  className="fs-xs fw-400 mt-3 black"
                                >
                                  Total Unit <span>{`(${stockUnitType})`}</span>
                                </label>
                                <input
                                  required
                                  type="number"
                                  onWheel={(e) => {
                                    e.target.blur();
                                  }}
                                  className="mt-2 product_input fade_grey fw-400"
                                  placeholder="0"
                                  id="origi"
                                  value={
                                    variants.length === 0
                                      ? totalunit
                                      : variants[0].totalunit
                                  }
                                  onChange={(e) => {
                                    if (variants.length === 0) {
                                      setTotalunit(e.target.value);
                                    } else {
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v, i) =>
                                          i === 0
                                            ? {
                                                ...v,
                                                totalunit: e.target.value,
                                              }
                                            : v
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                              {/* 2nd input */}
                              <div className="w-100">
                                <label
                                  htmlFor="origi"
                                  className="fs-xs fw-400 mt-3 black"
                                >
                                  Unit Price
                                </label>
                                <input
                                  required
                                  type="number"
                                  onWheel={(e) => {
                                    e.target.blur();
                                  }}
                                  className="mt-2 product_input fade_grey fw-400"
                                  placeholder="₹ 0.00"
                                  id="origi"
                                  value={
                                    variants.length == 0
                                      ? unitPrice
                                      : variants[0].unitPrice
                                  }
                                  onChange={(e) => {
                                    if (variants.length === 0) {
                                      setUnitPrice(e.target.value);
                                    } else {
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v, i) =>
                                          i === 0
                                            ? {
                                                ...v,
                                                unitPrice: e.target.value,
                                              }
                                            : v
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                              {/* 3rd input */}

                              <div className=" w-100">
                                <label
                                  htmlFor="salesMan"
                                  className="fs-xs fw-400 mt-3 black"
                                >
                                  Sales man Commission
                                </label>
                                <br />
                                <div className="d-flex align-items-center justify-content-between product_input mt-2">
                                  <input
                                    required
                                    type="number"
                                    onWheel={(e) => {
                                      e.target.blur();
                                    }}
                                    className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                                    placeholder="₹ 0.00"
                                    id="salesMan"
                                    value={
                                      variants.length === 0
                                        ? SalesmanCommission
                                        : variants[0].SalesmanCommission
                                    }
                                    onChange={(e) => {
                                      if (variants.length === 0) {
                                        setSalesmanComssion(e.target.value);
                                      } else {
                                        setVariants((prevVariants) =>
                                          prevVariants.map((v, i) =>
                                            i === 0
                                              ? {
                                                  ...v,
                                                  SalesmanCommission:
                                                    e.target.value,
                                                }
                                              : v
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* 4rd input */}
                            {showweightfield && (
                              <div className="w-50">
                                <label
                                  htmlFor="origi"
                                  className="fs-xs fw-400 mt-3 black"
                                >
                                  Weight
                                </label>
                                <input
                                  required
                                  type="number"
                                  onWheel={(e) => {
                                    e.target.blur();
                                  }}
                                  className="mt-2 product_input fade_grey fw-400"
                                  placeholder="0"
                                  id="origi"
                                  value={
                                    variants.length === 0
                                      ? totalweight
                                      : variants[0].totalweight
                                  }
                                  onChange={(e) => {
                                    const newValue = showweightfield
                                      ? e.target.value
                                      : null;

                                    if (variants.length === 0) {
                                      setTotalweight(newValue);
                                    } else {
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v, i) =>
                                          i === 0
                                            ? {
                                                ...v,
                                                totalweight: newValue,
                                              }
                                            : v
                                        )
                                      );
                                    }
                                  }}
                                />
                              </div>
                            )}
                            <div className="d-flex gap-3 align-items-center">
                              <div className="w-75 mt-4">
                                <input
                                  type="checkbox"
                                  checked={showchecked}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;

                                    setShowchecked(isChecked);
                                    if (isChecked) {
                                      setDiscountType("Amount");
                                      setDiscountvalue("0");
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v) => ({
                                          ...v,
                                          discountType: "Amount",
                                          discountvalue: "0",
                                        }))
                                      );
                                    } else {
                                      setDiscountType(null);
                                      setDiscountvalue(null);
                                      setVariants((prevVariants) =>
                                        prevVariants.map((v) => ({
                                          ...v,
                                          discountType: null,
                                          discountvalue: null,
                                        }))
                                      );
                                    }
                                  }}
                                />
                                <label className="ms-3">ADD DISCOUNT</label>
                              </div>

                              {showchecked && (
                                <>
                                  <div className="w-100">
                                    <label
                                      htmlFor="Discount"
                                      className="fs-xs fw-400 mt-3 black"
                                    >
                                      Discount Type
                                    </label>
                                    <select
                                      className="mt-2 product_input fade_grey fw-400"
                                      id="Discount"
                                      value={
                                        variants.length === 0
                                          ? discountType || "Amount"
                                          : variants[0].discountType || "Amount"
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        // console.log(
                                        //   "Discount Type changed to:",
                                        //   value
                                        // );
                                        if (variants.length === 0) {
                                          setDiscountType(value);
                                          setDiscountvalue(
                                            value === "Amount"
                                              ? "0"
                                              : discountvalue || "0"
                                          );
                                        } else {
                                          setVariants((prevVariants) =>
                                            prevVariants.map((v, i) =>
                                              i === 0
                                                ? {
                                                    ...v,
                                                    discountType: value,
                                                    discountvalue:
                                                      value === "Amount"
                                                        ? "0"
                                                        : v.discountvalue ||
                                                          "0",
                                                  }
                                                : v
                                            )
                                          );
                                        }
                                      }}
                                    >
                                      <option value="Amount">Amount</option>
                                      <option value="Percentage">
                                        Percentage
                                      </option>
                                    </select>
                                  </div>

                                  <div className="w-100">
                                    <label
                                      htmlFor="ddisc"
                                      className="fs-xs fw-400 mt-3 black"
                                    >
                                      Discount Value
                                    </label>
                                    <input
                                      required
                                      type="number"
                                      onWheel={(e) => {
                                        e.target.blur();
                                      }}
                                      className="mt-2 product_input fade_grey fw-400"
                                      placeholder={
                                        discountType !== "Percentage"
                                          ? "₹ 0.00"
                                          : "%"
                                      }
                                      id="ddisc"
                                      value={
                                        variants.length === 0
                                          ? discountType === "Amount"
                                            ? discountvalue || "0"
                                            : discountvalue || "0"
                                          : variants[0].discountType ===
                                            "Amount"
                                          ? variants[0].discountvalue || "0"
                                          : variants[0].discountvalue || "0"
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;

                                        if (variants.length === 0) {
                                          setDiscountvalue(
                                            discountType === "Percentage"
                                              ? Math.min(value, 100)
                                              : value
                                          );
                                        } else {
                                          setVariants((prevVariants) =>
                                            prevVariants.map((v, i) =>
                                              i === 0
                                                ? {
                                                    ...v,
                                                    discountvalue:
                                                      v.discountType ===
                                                      "Percentage"
                                                        ? Math.min(value, 100)
                                                        : value,
                                                  }
                                                : {
                                                    ...v,
                                                    discountvalue: "",
                                                  }
                                            )
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="product_shadow bg_white p-3 mt-4">
                      <div className=" d-flex align-items-center w-75 justify-content-between pb-3 mb-1">
                        <h2 className="fw-400 fs-2sm black mb-0">
                          Have More Colours ?{" "}
                          <span className="red ms-1 fs-sm">*</span>
                        </h2>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="color_yes">
                            Yes
                          </label>
                          <input
                            onChange={() => setColorVar(true)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="color_yes"
                            checked={colorVar === true}
                          />
                        </div>
                        <div className="d-flex align-items-center">
                          <label className="pe-3 me-1" for="color_no">
                            No
                          </label>
                          <input
                            onChange={() => setColorVar(false)}
                            className="fs-xs fw-400 black varient_btn"
                            type="radio"
                            id="color_no"
                            checked={colorVar === false}
                          />
                        </div>
                      </div>
                      {colorVar === true ? (
                        <div>
                          <h2 className="fw-400 fs-2sm black mb-0">
                            Colours Varient
                          </h2>
                          <div className=" d-flex align-items-center mt-3 pt-1 me-5 gap-3 flex-wrap">
                            {storeColors && storeColors.length !== 0
                              ? storeColors.map((items, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="d-flex align-items-center gap-3 color_add_input"
                                    >
                                      <p className="m-0">{items}</p>
                                      <img
                                        onClick={() => handelColorDelete(index)}
                                        className="cursor_pointer"
                                        src={closeRed}
                                        alt="closeRed"
                                      />
                                    </div>
                                  );
                                })
                              : null}

                            {colorInput ? (
                              <div className="color_add_input d-flex align-items-center">
                                <input
                                  onChange={(e) => setColor(e.target.value)}
                                  className="fs-xs fw-400 black me-2"
                                  type="text"
                                  value={color}
                                />
                                <img
                                  onClick={handelStoreColor}
                                  className="cursor_pointer"
                                  src={checkGreen}
                                  alt="checkGreen"
                                />
                              </div>
                            ) : null}
                            <button
                              onClick={() => setColorInput(true)}
                              type="button"
                              className="add_color_btn fs-xs fw-400 fade_grey"
                            >
                              + Add Color
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    {/* images  */}
                    <div className="product_shadow bg_white p-3 mt-4">
                      <h2 className="fw-400 fs-2sm black mb-0">
                        Images <span className="red ms-1 fs-sm">*</span>
                      </h2>
                      <div className="d-flex flex-wrap gap-4 mt-3 align-items-center">
                        <input
                          required
                          type="file"
                          id="file22"
                          hidden
                          accept="/*"
                          multiple
                          onChange={handelUploadImages}
                        />
                        {imageUpload22.map((img, index) => (
                          <div className=" d-flex flex-wrap">
                            <div className="position-relative " key={index}>
                              <img
                                className="mobile_image object-fit-cover"
                                src={
                                  img &&
                                  typeof img === "string" &&
                                  img.startsWith("http")
                                    ? img
                                    : URL.createObjectURL(img)
                                }
                                alt=""
                              />
                              <img
                                className="position-absolute top-0 end-0 cursor_pointer p-1"
                                src={deleteicon}
                                alt="deleteicon"
                                onClick={() => handleDeleteImages(index)}
                              />
                            </div>
                          </div>
                        ))}
                        <label
                          htmlFor="file22"
                          className="color_green cursor_pointer fs-sm addmedia_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Media
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xxl={4}>
                {/* Status */}
                <div className="product_shadow bg_white p-3 mt-3 mt-xxl-0">
                  <div className="product_borderbottom">
                    <h2 className="fw-400 fs-2sm black mb-0">
                      Status <span className="red ms-1 fs-sm">*</span>
                    </h2>
                    <div className="d-flex align-items-center pb-3">
                      <div className="mt-3 ms-3 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          Published
                          <input
                            onChange={() => setStatus("published")}
                            type="radio"
                            checked={status === "published"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="mt-3 ms-5 py-1 d-flex align-items-center gap-3">
                        <label className="check fw-400 fs-sm black mb-0">
                          Hidden
                          <input
                            onChange={() => setStatus("hidden")}
                            type="radio"
                            checked={status === "hidden"}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="deliveryCharge"
                      className="fs-xs fw-400 mt-3 black pt-1"
                    >
                      Delivery Charge
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        onWheel={(e) => {
                          e.target.blur();
                        }}
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="₹ 0.00"
                        id="deliveryCharge"
                        value={DeliveryCharge}
                        onChange={(e) => setDeliveryCharges(e.target.value)}
                      />
                    </div>
                    <label
                      htmlFor="deliveryCharge"
                      className="fs-xs fw-400 mt-3 black pt-1"
                    >
                      Tax
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        onWheel={(e) => {
                          e.target.blur();
                        }}
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="%"
                        id="deliveryCharge"
                        value={Tax}
                        onChange={(e) => setTax(Math.min(e.target.value, 100))}
                      />
                    </div>
                    <label
                      htmlFor="serviceCharge"
                      className="fs-xs fw-400 mt-3 black"
                    >
                      Service charge
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                        onWheel={(e) => {
                          e.target.blur();
                        }}
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="Amount"
                        id="serviceCharge"
                        value={ServiceCharge}
                        onChange={(e) => setServiceCharge(e.target.value)}
                      />
                    </div>
                    {/* <label
                      htmlFor="salesMan"
                      className="fs-xs fw-400 mt-3 black"
                    >
                      Sales man Commission
                    </label>
                    <br />
                    <div className="d-flex align-items-center justify-content-between product_input mt-2">
                      <input
                        required
                        type="number"
                         onWheel={(e) => {
    e.target.blur(); 
  }}
                        className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                        placeholder="₹ 0.00"
                        id="salesMan"
                        value={SalesmanCommission}
                        onChange={(e) => setSalesmanComssion(e.target.value)}
                      />
                    </div> */}
                  </div>
                </div>

                {/* invertory */}
                <div className="mt-4 product_shadow bg_white p-3">
                  <h2 className="fw-400 fs-2sm black mb-0">
                    Inventory <span className="red ms-1 fs-sm">*</span>
                  </h2>
                  {/* ist input */}
                  <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                    SKU
                  </label>
                  <br />
                  <div className="d-flex align-items-center justify-content-between product_input mt-2">
                    <input
                      required
                      type="text"
                      className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                      placeholder="Enter SKU"
                      value={sku}
                      id="sku"
                      onChange={handleSkuChange}
                    />
                  </div>
                  {/* 2nd input */}
                  <div className="d-flex flex-column mt-2 w-100">
                    <label className="fs-xs fw-400 black">Unit Type</label>
                    <Dropdown className="category_dropdown  w-100">
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        className="mt-2 unit_type_input border-0"
                      >
                        <div className="product_input d-flex align-items-center justify-content-between">
                          <p className="fade_grey fw-400 w-100 mb-0 text-start">
                            {stockUnitType}
                          </p>
                          <img src={dropdownImg} alt="" />
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="w-100 p-0">
                        <div>
                          <Dropdown.Item>
                            {Units.map((itmes) => {
                              return (
                                <div className="d-flex justify-content-between">
                                  <p
                                    className="fs-xs fw-400 black mb-0 py-1 w-100"
                                    onClick={() => onhandelunittype(itmes)}
                                  >
                                    {itmes}
                                  </p>
                                  {stockUnitType === itmes && (
                                    <img
                                      src={savegreenicon}
                                      alt="savegreenicon"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </Dropdown.Item>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  {/* 3nd input */}
                  <label htmlFor="total" className="fs-xs fw-400 mt-3 black">
                    Total Stock{" "}
                    {/* <span className="fade_grey ms-2">{`Purchase Value : ₹${stockPrice}`}</span> */}
                  </label>{" "}
                  <br />
                  <div className="position-relative">
                    <div className="product_input d-flex align-items-center justify-content-between mt-2">
                      <input
                        required
                        type="text"
                        className="black fw-400 border-0 outline_none bg-white"
                        placeholder="Add stock to view count"
                        disabled
                        id="total"
                        value={totalStock}
                      />
                      <div className=" d-flex gap-3">
                        {ProductsID && (
                          <img
                            onClick={() => setStockEditpopup(true)}
                            src={editIcon}
                            alt="addIcon"
                          />
                        )}
                        <img
                          onClick={() => setStockpopup(true)}
                          src={addIcon}
                          alt="addIcon"
                        />
                      </div>
                    </div>
                    {stockeditpopup === true ? (
                      <div className="stock_popup">
                        <div
                          onClick={() => setStockEditpopup(false)}
                          className="text-end"
                        >
                          <img src={closeicon} alt="closeicon" />
                        </div>
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">
                            Total Stock
                          </label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="number"
                            onWheel={(e) => {
                              e.target.blur();
                            }}
                            placeholder="0.00"
                            value={totalStock}
                            onChange={(e) => setTotalStock(e.target.value)}
                          />
                        </div>
                        <button
                          className="stock_save_btn d-flex align-items-center"
                          onClick={() => setStockEditpopup(false)}
                        >
                          <img src={whiteSaveicon} alt="whiteSaveicon" />
                          <p className="fs-sm fw-400 white ms-2 mb-0">Save</p>
                        </button>
                      </div>
                    ) : null}
                    {stockpopup === true ? (
                      <div className="stock_popup">
                        <div
                          onClick={() => setStockpopup(false)}
                          className="text-end"
                        >
                          <img src={closeicon} alt="closeicon" />
                        </div>
                        {/* <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">
                            Date of Purchase
                          </label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="date"
                          />
                        </div> */}
                        <div className="d-flex flex-column mt-2">
                          <label className="fs-xs fw-400 black">
                            Total Quantity
                          </label>
                          <input
                            className="product_input fade_grey fw-400 mt-2"
                            type="number"
                            onWheel={(e) => {
                              e.target.blur();
                            }}
                            placeholder="0.00"
                            value={totalStockQun}
                            onChange={(e) => setTotalStockQun(e.target.value)}
                          />
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          {/* <div className="d-flex flex-column mt-2 w-50">
                            <label className="fs-xs fw-400 black">
                              Unit Type
                            </label>
                            <Dropdown className="category_dropdown z-1 w-100">
                              <Dropdown.Toggle
                                id="dropdown-basic"
                                className="mt-2 unit_type_input border-0"
                              >
                                <div className="product_input d-flex align-items-center justify-content-between">
                                  <p className="fade_grey fw-400 w-100 mb-0 text-start">
                                    {stockUnitType}
                                  </p>
                                  <img src={dropdownImg} alt="" />
                                </div>
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="w-100 p-0">
                                <div>
                                  <Dropdown.Item>
                                    {Units.map((itmes) => {
                                      return (
                                        <div className="d-flex justify-content-between">
                                          <p
                                            className="fs-xs fw-400 black mb-0 py-1 w-100"
                                            onClick={() =>
                                              setStockUnitType(itmes)
                                            }
                                          >
                                            {itmes}
                                          </p>
                                          {stockUnitType === itmes && (
                                            <img
                                              src={savegreenicon}
                                              alt="savegreenicon"
                                            />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </Dropdown.Item>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div> */}
                          <div className="d-flex flex-column mt-2 w-100">
                            <label className="fs-xs fw-400 black">
                              Price per unit
                            </label>
                            <input
                              className="product_input fade_grey fw-400 mt-2"
                              type="number"
                              onWheel={(e) => {
                                e.target.blur();
                              }}
                              placeholder="₹ 0.00"
                              value={perUnitPrice}
                              onChange={(e) => setPerUnitPrice(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          className="stock_save_btn d-flex align-items-center"
                          onClick={HandleStockPopUpSave}
                        >
                          <img src={whiteSaveicon} alt="whiteSaveicon" />
                          <p className="fs-sm fw-400 white ms-2 mb-0">Save</p>
                        </button>
                      </div>
                    ) : null}
                    <label htmlFor="sku" className="fs-xs fw-400 mt-3 black">
                      Stock Alert Count
                    </label>
                    <br />
                    <input
                      required
                      type="number"
                      onWheel={(e) => {
                        e.target.blur();
                      }}
                      className="mt-2 product_input fade_grey fw-400"
                      placeholder="Enter alert count "
                      value={StockCount}
                      onChange={(e) => setStockCount(e.target.value)}
                    />{" "}
                  </div>
                  <br />
                </div>
                {/* Categories */}
                <div className="mt-4 product_shadow bg_white p-3 pt-0">
                  <label
                    htmlFor="salesprice"
                    className="fs-xs fw-400 mt-3 black pt-1"
                  >
                    Sales Price
                  </label>
                  <br />
                  <div className="d-flex align-items-center justify-content-between product_input mt-2">
                    <input
                      required
                      type="number"
                      onWheel={(e) => {
                        e.target.blur();
                      }}
                      className="fade_grey fw-400 w-100 border-0 bg-white outline_none"
                      placeholder="₹ 0.00"
                      id="salesprice"
                      value={salesprice}
                      onChange={(e) => setSalesPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-4 product_shadow bg_white p-3">
                  <lable className="fw-400 fs-2sm black mb-0">
                    Select Brand (optional)
                  </lable>
                  <Dropdown className="category_dropdown">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="dropdown_input_btn"
                    >
                      <div className="product_input">
                        <div className="d-flex align-items-center justify-content-between">
                          <p className="fade_grey fw-400 w-100 mb-0 text-start">
                            {selectBrand
                              ? selectBrand.name || selectBrand
                              : "Select Brand"}
                          </p>
                          <img src={dropdownImg} alt="dropdownImg" />
                        </div>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100">
                      <div className="d-flex flex-column">
                        <div>
                          <button
                            type="button"
                            className="addnew_category_btn fs-xs green"
                          >
                            +Add <span className="black"> New Brand</span>
                          </button>
                          {allBrands.map((brand) => (
                            <Dropdown.Item>
                              <div
                                className={`d-flex justify-content-between ${
                                  selectBrand && selectBrand.id === brand.id
                                    ? "selected"
                                    : ""
                                }`}
                                onClick={() => handleSelectBrand(brand)}
                              >
                                <p className="fs-xs fw-400 black mb-0">
                                  {brand.name}
                                </p>
                                {selectBrand && selectBrand.id === brand.id && (
                                  <img
                                    src={savegreenicon}
                                    alt="savegreenicon"
                                  />
                                )}
                              </div>
                            </Dropdown.Item>
                          ))}
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="mt-4 product_shadow bg_white p-3">
                  <lable className="fw-400 fs-2sm black mb-0">
                    Categories <span className="red ms-1 fs-sm">*</span>
                  </lable>
                  <Dropdown className="category_dropdown">
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="dropdown_input_btn"
                    >
                      <div className="product_input">
                        <p
                          className="fade_grey fw-400 w-100 mb-0 text-start"
                          required
                        >
                          {selectedCategory
                            ? selectedCategory.title || selectedCategory
                            : "Select Category"}
                        </p>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <div className="d-flex flex-column">
                        <div className="d-flex align-items-center product_input position-sticky top-0">
                          <img src={SearchIcon} alt="SearchIcon" />
                          <input
                            onChange={(e) => setSearchvalue(e.target.value)}
                            placeholder="search for category"
                            className="fade_grey fw-400 border-0 outline_none ms-2 w-100"
                            type="text"
                          />
                        </div>
                        <div>
                          {data
                            .filter((items) => {
                              return searchvalue.toLowerCase() === ""
                                ? items
                                : items.title
                                    .toLowerCase()
                                    .includes(searchvalue);
                            })
                            .map((category) => (
                              <Dropdown.Item>
                                <div
                                  className={`d-flex justify-content-between ${
                                    selectedCategory &&
                                    selectedCategory.id === category.id
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => handleSelectCategory(category)}
                                >
                                  <p className="fs-xs fw-400 black mb-0">
                                    {category.title}
                                  </p>
                                  {selectedCategory &&
                                    selectedCategory.id === category.id && (
                                      <img
                                        src={savegreenicon}
                                        alt="savegreenicon"
                                      />
                                    )}
                                </div>
                              </Dropdown.Item>
                            ))}
                        </div>
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  }
};
AddProduct.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: true,
  },
};
AddProduct.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
export default AddProduct;
