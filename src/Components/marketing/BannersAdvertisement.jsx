import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import saveicon from "../../Images/svgs/saveicon.svg";
import deleteicon from "../../Images/svgs/deleteicon.svg";
import searchIcon from "../../Images/svgs/search.svg";
import editIcon from "../../Images/svgs/pencil.svg";
import AddBanner from "./AddBanner";
import AddSmallPattiBanner from "./AddSmallPattiBanner";

import { ref, uploadBytesResumable, getDownloadURL, getStorage, deleteObject, getStream } from "firebase/storage";
import { where, query, getDoc } from "firebase/firestore";
import { storage, db } from "../../firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { ToastContainer, toast, useToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useImageValidation } from "../../context/validators";
import { useImageHandleContext } from "../../context/ImageHandler";
import { useMainCategories, useSubCategories, } from "../../context/categoriesGetter";


import { UseBannerData } from "../../context/BannerGetters";
import { uploadBytes } from "firebase/storage";
import Loader from "../Loader";

//  banner advertisement up start from here
// check accordian and save button

const BannersAdvertisement = () => {
  const [loaderstatus, setLoaderstatus] = useState(false);
  const [uploadBannerPopup, setUploadBannerPopup] = useState(false)
  const [uploadSmallPattiPopup, setuploadSmallPattiPopup] = useState(false)
  const [uploadLargeBannerIndex, setUploadLargeBannerIndex] = useState(null);
  const [uploadSmallPattiIndex, setuploadSmallPattiIndex] = useState(null)
  const [SelectedBanner, setSelectedBanner] = useState("")
  const [categoryimagesindex, setcategoryimageindex] = useState(null)
  // context
  const { BannerData, deleteObjectByImageUrl, SetBannerData } = UseBannerData();

  console.log("Banner Data is ", BannerData);
  const { ImageisValidOrNot } = useImageHandleContext();
  const { validateImage } = useImageValidation();
  const { categoreis } = useMainCategories();
  // let categoriessss = useMainCategories().categoreis
  // console.log("sdfsegsdfgsdfgsdfgsdfgfdgdsfg",categoriessss)
  // let subcategoroues = useSubCategories().data;
  // console.log("asdfadsfas", subcategoroues);

  let categoreisTitle = [];
  categoreis.map((data, index) => {
    categoreisTitle.push(data.title);
  });

  console.log(categoreisTitle);
  console.log("Banner data is ", BannerData);

  // get intially all the uploded banners
  const updateSelectedImages = (data) => {
    if (data) {
      const selectedImages = {};
      let categoryimages = Array.from({ length: categoreis.length }, () => []);
      data.forEach((item) => {
        // console.log(item)
        const title = item.title.toLowerCase();
        const imagelinks = item.data;
        if (imagelinks) {
          console.log("image", imagelinks);
          if (title === "categorybanners") {
            imagelinks.forEach((banner) => {
              const index = categoreis.findIndex((cat) => cat.id === banner.categoryId);
              if (index !== -1) {
                categoryimages[index].push(...banner.imgUrls.map((url) => ({
                  categoryId: banner.categoryId,
                  categoryTitle: banner.categoryTitle,
                  img: url.img + '$$$$' + item.id,
                  priority: url.priority,
                })));
              }
            });
            setCategoryImage(categoryimages);
          } else {
            console.log("iamge ilinks else ", imagelinks)
            // If title is not "categorybanner", use the original imagelinks
            selectedImages[title] = imagelinks.map((items) => ({
              categoryId: items.imgUrl.categoryId,
              categoryTitle: items.imgUrl.categoryTitle,
              img: items.imgUrl.img + "$$$$" + item.id,
              priority: items.imgUrl.priority
            }));
          }
        }
      });

      // Now you have an object with selected images for each title
      // console.log('asdfasfasdfsasdfasdf', selectedImages);
      // Example: Accessing images for largebanner
      if (selectedImages["largebanner"]) {

        setSelectedImagesLargeBanner(selectedImages["largebanner"]);
      }

      // // Example: Accessing images for smallpatti
      if (selectedImages["smallpattbanner"]) {
        setselectedImagesSmallPatii(selectedImages["smallpattbanner"]);
      }

      if (selectedImages["salesoffers"]) {

        setBannerSaleImg(selectedImages["salesoffers"]);
      }
      if (selectedImages["animalsupliments"]) {
        console.log("animal suplliments banner ", selectedImages['animalsupliments'])
        setAnimalSuplimentsImages(selectedImages["animalsupliments"]);
      }

      // Add more cases as needed
    }
  };

  // Use the function in useEffect
  useEffect(() => {
    updateSelectedImages(BannerData);
  }, [BannerData]);

  const [activeAccordion, setActiveAccordion] = useState(null);

  // const { LargeBannerContext } = useLargeBannerContext()

  const handleAccordionSelect = (key) => {
    setActiveAccordion(key);
  };














  /*
 *********************************************************
 Large Banner   functionaltiy start from here 
 
 */

  const [selectedImagesLargeBanner, setSelectedImagesLargeBanner] = useState([
    null,
    null,
  ]);

  const handleUploadLargeBanner = async (index, e) => {
    const file = e.image;
    try {
      // Validate the image using the context function
      const validatedImage = await validateImage(file, 1, 720, 720);
      // console.log(validateImage)

      // If validation succeeds, update the state
      const newImages = [...selectedImagesLargeBanner];
      newImages[index] = { validatedImage, categoryId: e.category.id, categoryTitle: e.category.title, priority: e.priority };
      console.log(newImages[index])
      setSelectedImagesLargeBanner(newImages);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  useEffect(() => {
    // selectedImagesLargeBanner('')
    console.log("selected images is ", selectedImagesLargeBanner)
  }, [selectedImagesLargeBanner])

  const handleDeleteLargeBanner = async (index) => {
    setLoaderstatus(true);
    const image = selectedImagesLargeBanner[index];
    console.log("images is ", image);
    if (
      image &&
      typeof image.img === "string" &&
      image.img.startsWith("http")
    ) {
      const imageURL = image.img.split("$$$$")[0];
      const id = image.img.split("$$$$")[1];
      console.log("id large", id);

      // Delete the image from Firebase Storage
      const storageRef = getStorage();
      const reference = ref(storageRef, imageURL);
      await deleteObject(reference);

      // Delete the image data from Firestore
      const docRef = doc(db, "Banner", id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'data' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Modify the 'data' array by removing the item at the specified index
          existingData.data.splice(index, 1);

          // Update the document in Firestore with the modified 'data' array
          await updateDoc(docRef, { data: existingData.data });
        }
      }
    }
    const newImages = selectedImagesLargeBanner.filter((_, idx) => idx !== index);
    setSelectedImagesLargeBanner(newImages);
    setLoaderstatus(false);
  };




  async function handleSaveLargeBanner() {
    setLoaderstatus(true);
    try {
      if (selectedImagesLargeBanner.some(Boolean)) {
        const newImageData = [];
        const existingImageUrls = [];

        // Fetch existing data
        const querySnapshot = await getDocs(
          query(collection(db, "Banner"), where("title", "==", "LargeBanner"))
        );

        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrl || {};
            existingImageUrls.push(existingUrls.img);
          });
        }

        for (const { validatedImage, categoryId, categoryTitle, priority } of selectedImagesLargeBanner) {
          if (validatedImage && validatedImage instanceof File) {
            const filename = Math.floor(Date.now() / 1000) + "-" + validatedImage.name;
            const storageRef = ref(storage, `banner/${filename}`);
            await uploadBytes(storageRef, validatedImage);
            const imageUrl = await getDownloadURL(storageRef);
            if (!existingImageUrls.includes(imageUrl)) {
              newImageData.push({
                categoryTitle: "",
                categoryId: "",
                imgUrl: {
                  categoryId: categoryId || "",
                  categoryTitle: categoryTitle || "",
                  priority: priority || "",
                  img: imageUrl,
                }
              });
            }
          }
        }

        if (newImageData.length > 0) {
          const docRef = querySnapshot.size > 0 ? querySnapshot.docs[0].ref : await addDoc(collection(db, "Banner"), { title: "LargeBanner", data: [] });
          let docSnapshot = await getDoc(docRef)
          const existingData = docSnapshot.exists() ? docSnapshot.data().data || [] : [];
          console.log(existingData)
          const updatedData = [...existingData, ...newImageData];
          console.log("updated data is ", updatedData)
          await setDoc(docRef, { title: "LargeBanner", data: updatedData });

          SetBannerData([
            ...BannerData,
            { id: docRef.id, title: "LargeBanner", data: updatedData },
          ]);

          toast.success("Large Banner Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          console.log("No new images uploaded");
        }
      } else {
        console.log("Select at least one file before uploading");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoaderstatus(false);
    }
  }





  /*
 *********************************************************
 Large  Banner functionaltiy end  
 
 */

  /*  
  *******************************
  Small Patti Banner Added functionlaity  start from here 
  ************************************
  */
  const [selectedImagesSmallPatii, setselectedImagesSmallPatii] = useState([
    null,
    null,
    null,
  ]);

  const handleUploadSmallPatti = async (index, e) => {
    let file = e.image
    try {
      // Define desired aspect ratio and dimensions for large banner
      const desiredAspectRatio = 16 / 2.5;
      const desiredWidth = 1280;
      const desiredHeight = 200;

      // Validate the image using the context function
      const validatedImage = await validateImage(
        file,
        desiredAspectRatio,
        desiredWidth,
        desiredHeight
      );
      const newImages = [...selectedImagesSmallPatii];
      newImages[index] = { validatedImage, categoryId: e.category.id, categoryTitle: e.category.title, priority: e.priority };
      setselectedImagesSmallPatii(newImages);



    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDeleteSmallPatti = async (index) => {
    setLoaderstatus(true);
    const image = selectedImagesSmallPatii[index];

    // const imageURL = selectedImagesSmallPatii[index].split('$$$$')[0];
    if (
      image &&
      typeof image.img === "string" &&
      image.img.startsWith("http")
    ) {
      const imageURL = image.img.split("$$$$")[0];
      const id = image.img.split("$$$$")[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, imageURL);
      await deleteObject(reference);

      const docRef = doc(db, "Banner", id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'data' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Filter out the item at the specified index
          existingData.data.splice(index, 1);
          // Update the document in Firestore with the modified 'data' array
          await updateDoc(docRef, { data: existingData.data });
        }
      }
    }

    const newImages = selectedImagesSmallPatii.filter((_, idx) => idx !== index);
    setselectedImagesSmallPatii(newImages);
    setLoaderstatus(false);
    setLoaderstatus(false);
  };

  async function handleSaveSmallPattiBanner() {
    setLoaderstatus(true);
    try {
      if (selectedImagesSmallPatii.some(Boolean)) {
        const newImageData = [];
        const existingImageUrls = [];
        // Fetch existing data
        const querySnapshot = await getDocs(
          query(
            collection(db, "Banner"),
            where("title", "==", "SmallPattBanner")
          )
        );


        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrl || {};
            existingImageUrls.push(existingUrls.img);
          });
        }

        for (const { validatedImage, categoryId, categoryTitle, priority } of selectedImagesSmallPatii) {


          if (validatedImage instanceof File) {
            // Handle file upload
            const filename = Math.floor(Date.now() / 1000) + "-" + validatedImage.name;
            const storageRef = ref(storage, `banner/${filename}`);
            await uploadBytes(storageRef, validatedImage);
            let imageUrl = await getDownloadURL(storageRef);
            // Only add new image URL (not in existingImageUrls)
            if (!existingImageUrls.includes(imageUrl)) {
              newImageData.push({
                categoryTitle: "",
                categoryId: "",
                imgUrl: {
                  categoryId: categoryId || "",
                  categoryTitle: categoryTitle || "",
                  priority: priority || "", 
                  img: imageUrl,
                }
              });
            }
          }
        }

        if (newImageData.length > 0) {
          const docRef = querySnapshot.size > 0 ? querySnapshot.docs[0].ref : await addDoc(collection(db, "Banner"), { title: "SmallPattBanner", data: [] });
          let docSnapshot = await getDoc(docRef)
          const existingData = docSnapshot.exists() ? docSnapshot.data().data || [] : [];
          const updatedData = [...existingData, ...newImageData];


          await setDoc(docRef, { title: "SmallPattBanner", data: updatedData });

          SetBannerData([
            ...BannerData,
            { id: docRef.id, title: "SmallPattBanner", data: updatedData },
          ]);

          toast.success("SmallPattBanner Banner Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          console.log("No new images upload")
        }

      } else {
        console.log("Select at least one image to upload")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoaderstatus(false)
    }
  }



  /*
  *******************************
  Small Patti Banner Added functionlaity  end here 
  ************************************
  */

  /*
 *********************************************************
 Sales and offer   Banner functionaltiy start from here 
 */

  const [BannerSaleImg, setBannerSaleImg] = useState([]);
  const [SelectedBannerImg, setSelectedBannerImg] = useState(null);

  const handelSaleBannerImg = async (e) => {
    console.log(e)
    const selectedFile = e.image;

    try {
      const desiredAspectRatio = 16 / 9;
      const desiredWidth = 1280;
      const desiredHeight = 720;
      const validatedImage = await validateImage(
        selectedFile,
        desiredAspectRatio,
        desiredWidth,
        desiredHeight
      );
      const newImage = { validatedImage, categoryId: e.category.id, categoryTitle: e.category.title, priority: e.priority };
      // Update the BannerSaleImg state with the new object
      setBannerSaleImg([...BannerSaleImg, newImage]);
      // Reset the selected image state after successful addition
      setSelectedBannerImg(null);
    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleAddMediaSaleOffer = () => {
    if (SelectedBannerImg) {
      setBannerSaleImg([...BannerSaleImg, SelectedBannerImg]);
      setSelectedBannerImg(null);
      // document.getElementById('Sales_Offers').value = '';
    }
  };

  async function handeldeleteSaleBannerImg(index) {
    setLoaderstatus(true);
    const imageUrlToDelete = BannerSaleImg[index];
    if (
      imageUrlToDelete &&
      typeof imageUrlToDelete.img === "string" &&
      imageUrlToDelete.img.startsWith("http")
    ) {
      const imageURL = imageUrlToDelete.img.split("$$$$")[0];
      const id = imageUrlToDelete.img.split("$$$$")[1];

      console.log("id si ", id);
      const storageRef = getStorage();
      const reference = ref(storageRef, imageURL);

      // Delete the image from storage
      await deleteObject(reference);


      // Get the document reference
      const docRef = doc(db, "Banner", id);

      // Get the document snapshot
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'imagelinks' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Filter out the item at the specified index
          existingData.data.splice(index, 1)

          // Update the document in Firestore with the modified 'imagelinks' array
          await updateDoc(docRef, { data: existingData.data });
        }
      }
      setLoaderstatus(false);
    }

    // Update the state to remove the deleted image
    const newImages = BannerSaleImg.filter((_, i) => i !== index); // [...BannerSaleImg];
    setBannerSaleImg(newImages);
    setLoaderstatus(false);
  }

  async function handleSaveBannerSliderSale() {
    setLoaderstatus(true);
    try {
      if (BannerSaleImg.every(Boolean)) {
        let newImageData = [];
        const existingImageUrls = [];
        const querySnapshot = await getDocs(
          query(collection(db, "Banner"), where("title", "==", "SalesOffers"))
        );
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrl || {};
            existingImageUrls.push(existingUrls.img);
          });
        }
        for await (let { validatedImage, categoryId, categoryTitle, priority } of BannerSaleImg) {
          // const name = Math.floor(Date.now() / 1000) + '-' + files.name;
          // const storageRef = ref(storage, `banner/${name}`);
          if (validatedImage instanceof File) {
            const name = Math.floor(Date.now() / 1000) + "-" + validatedImage.name;
            console.log("name is", name);
            const storageRef = ref(storage, `banner/${name}`);
            await uploadBytes(storageRef, validatedImage);
            let url = await getDownloadURL(storageRef);

            if (!existingImageUrls.includes(url)) {
              newImageData.push({
                categoryTitle: "",
                categoryId: "",
                imgUrl: {
                  categoryId: categoryId || "",
                  categoryTitle: categoryTitle || "",
                  priority: priority || "", 
                  img: url,
                }
              });
            }
          }
        }

        if (newImageData.length > 0) {
          const docRef = querySnapshot.size > 0 ? querySnapshot.docs[0].ref : await addDoc(collection(db, "Banner"), { title: "SalesOffers", data: [] });
          let docSnapshot = await getDoc(docRef)
          const existingData = docSnapshot.exists() ? docSnapshot.data().data || [] : [];
          console.log(existingData)
          const updatedData = [...existingData, ...newImageData];
          await setDoc(docRef, { title: "SalesOffers", data: updatedData });

          SetBannerData([
            ...BannerData,
            { id: docRef.id, title: "SalesOffers", data: updatedData },
          ]);
          toast.success("Sales Banner Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });

        } else {
          console.log("No new images uploaded")
        }
      } else {
        console.log("Select at least one file before uploding ")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoaderstatus(false)
    }

  }

  /*
 *********************************************************
    Sales and offer   Banner functionaltiy end   here 
 */

  /*  
  *********************************************************
  Animal And it's suplliments Banner functionaltiy start from here 
  
  */

  const [AnimalSuplimentsImages, setAnimalSuplimentsImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  async function handelAnimalSuplimentImg(e) {
    const selectedFile = e.image;
    // console.log(selectedFile)F
    try {
      const desiredAspectRatio = 16 / 9;
      const desiredWidth = 1280;
      const desiredHeight = 720;

      const validatedImage = await validateImage(
        selectedFile,
        desiredAspectRatio,
        desiredWidth,
        desiredHeight
      );
      const newImage = { validatedImage, categoryId: e.category.id, categoryTitle: e.category.title, priority: e.priority };
      setAnimalSuplimentsImages([...AnimalSuplimentsImages, newImage]);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handeldeleteAnimalSupliment(index) {
    setLoaderstatus(true);
    const imageUrlToDelete = AnimalSuplimentsImages[index];
    if (
      imageUrlToDelete &&
      typeof imageUrlToDelete.img === "string" &&
      imageUrlToDelete.img.startsWith("http")
    ) {
      const imageURL = imageUrlToDelete.img.split("$$$$")[0];
      const id = imageUrlToDelete.img.split("$$$$")[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, imageURL);

      // Delete the image from storage
      await deleteObject(reference);

      // Get the document reference
      const docRef = doc(db, "Banner", id);

      // Get the document snapshot
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'data' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Filter out the item at the specified index
          existingData.data.splice(index, 1)

          // Update the document in Firestore with the modified 'data' array
          await updateDoc(docRef, { data: existingData.data });
        }
      }

      setLoaderstatus(false);
    }

    // Update the state to remove the deleted image
    const newImages = AnimalSuplimentsImages.filter((_, i) => i !== index);
    setAnimalSuplimentsImages(newImages);
    setLoaderstatus(false);
  }

  async function handleSaveAnimalSuppliments() {
    setLoaderstatus(true);
    try {
      if (AnimalSuplimentsImages.every(Boolean)) {
        const newImageData = [];
        const existingImageUrls = [];
        // Fetch existing data
        const querySnapshot = await getDocs(
          query(collection(db, "Banner"), where("title", "==", "AnimalSupliments"))
        );

        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrl || {};
            existingImageUrls.push(existingUrls.img);
          });
        }

        for await (let { validatedImage, categoryId, categoryTitle, priority } of AnimalSuplimentsImages) {


          if (validatedImage instanceof File) {
            // Handle file upload
            const filename = Math.floor(Date.now() / 1000) + "-" + validatedImage.name;
            const storageRef = ref(storage, `banner/${filename}`);
            await uploadBytes(storageRef, validatedImage);
            let imageUrl = await getDownloadURL(storageRef);


            // Only add new image URL (not in existingImageUrls and not in newImageData)
            if (!existingImageUrls.includes(imageUrl)) {
              newImageData.push({
                categoryTitle: "",
                categoryId: "",
                imgUrl: {
                  categoryId: categoryId || "",
                  categoryTitle: categoryTitle || "",
                  priority: priority || "",
                  img: imageUrl,
                }
              });
            }
          }
        }

        if (newImageData.length > 0) {
          const docRef = querySnapshot.size > 0 ? querySnapshot.docs[0].ref : await addDoc(collection(db, "Banner"), { title: "AnimalSupliments", data: [] });
          let docSnapshot = await getDoc(docRef)
          const existingData = docSnapshot.exists() ? docSnapshot.data().data || [] : [];
          console.log(existingData)
          const updatedData = [...existingData, ...newImageData];
          await setDoc(docRef, { title: "AnimalSupliments", data: updatedData });
          SetBannerData([
            ...BannerData,
            { id: docRef.id, title: "AnimalSupliments", data: updatedData },
          ]);
          toast.success("Animal Supliments  Banner Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          console.log("No New Image upload");
        }
      } else {
        console.log("Select at least one file before uploading ")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoaderstatus(false)
    }
  }

  const handleAddMedia = () => {
    if (selectedImage) {
      setAnimalSuplimentsImages([...AnimalSuplimentsImages, selectedImage]);
      setSelectedImage(null);
      // document.getElementById('animal_suppliments').value = '';
    }
  };

  /*
  *********************************************************
  Animal And it's suplliments Banner functionaltiy end from here 
  */

  /*
  *********************************************************
  Categoroies  Banner functionaltiy start 
  */

  const [CategoryImage, setCategoryImage] = useState(categoreis.map(() => []));

  async function handleCategoryImages(e, index) {
    console.log("index is ", index);
    let files = e.image
    console.log("files are ", files);
    try {
      // Define desired aspect ratio and dimensions for large banner
      const desiredAspectRatio = 16 / 9;
      const desiredWidth = 1280;
      const desiredHeight = 720;
      const validatedImage = await validateImage(
        files,
        desiredAspectRatio,
        desiredWidth,
        desiredHeight
      );

      // Update the state at the specified index
      setCategoryImage((prevCategoryImages) => {
        const newCategoryImages = [...prevCategoryImages];
        // Ensure that newCategoryImages[index] is always an array
        if (!Array.isArray(newCategoryImages[index])) {
          newCategoryImages[index] = [];
        }
        newCategoryImages[index].push({ validatedImage, categoryId: e.category.id, categoryTitle: e.category.title, priority: e.priority });
        return newCategoryImages;
      });
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }


  useEffect(() => {
    console.log("Categru images is ", CategoryImage)
  }, [CategoryImage]);

  async function handleCategoryImagesDelete(index, innerIndex, data) {
    setLoaderstatus(true);
    try {
      const imageURLToDelete = CategoryImage[index][innerIndex].img;
      console.log("Deleting image URL:", imageURLToDelete);

      if (
        typeof imageURLToDelete === "string" &&
        imageURLToDelete.startsWith("http")
      ) {
        const imgurl = imageURLToDelete.split("$$$$")[0];
        const docId = imageURLToDelete.split("$$$$")[1];
        const docRef = doc(db, "Banner", docId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const existingData = docSnapshot.data();
          const newData = existingData.data.map(item => {
            if (item.imgUrls) {
              item.imgUrls = item.imgUrls.filter(obj => obj.img !== imgurl);
            }
            return item;
          });

          await updateDoc(docRef, { data: newData });
          console.log('Document updated successfully');
        }
      }
      setLoaderstatus(false);



      setCategoryImage((prevCategoryImages) => {
        const newCategoryImages = [...prevCategoryImages];
        newCategoryImages[index] = newCategoryImages[index].filter((_, idx) => idx !== innerIndex);
        return newCategoryImages;
      });
    }
    catch (error) {
      setLoaderstatus(false);
      console.error("Error deleting image:", error);
    }


  }






  async function handleUpdateCategoryBanner(e) {
    setLoaderstatus(true);
    e.preventDefault();
    try {
      if (CategoryImage.some((files) => Array.isArray(files) && files.length > 0) && categoreis.some(Boolean)) {
        const newImageData = [];
        let existingData = [];

        // Fetch existing data from Firestore
        const querySnapshot = await getDocs(
          query(
            collection(db, "Banner"),
            where("title", "==", "CategoryBanners")
          )
        );

        if (querySnapshot.size > 0) {
          existingData = querySnapshot.docs[0].data().data;
        }

        // Iterate over each category
        for (let index = 0; index < CategoryImage.length; index++) {
          const files = CategoryImage[index];
          const categoryId_main = categoreis[index].id;
          const categoryTitle_main = categoreis[index].title;

          const imgUrls = [];

          // Handle file uploads for each category
          for (let { validatedImage, categoryId, categoryTitle, priority } of files) {
            if (validatedImage instanceof File) {
              const name = Math.floor(Date.now() / 1000) + "-" + validatedImage.name;
              const storageRef = ref(storage, `banner/${name}`);
              await uploadBytes(storageRef, validatedImage);
              const imageUrl = await getDownloadURL(storageRef);

              // Add new image URL to imgUrls array
              imgUrls.push({
                categoryId: categoryId  || "",
                categoryTitle: categoryTitle || "" ,
                priority: categoryTitle || "",
                img: imageUrl,
              });
            }
          }
          // Find existing category index in existingData
          const existingCategoryIndex = existingData.findIndex((item) => item.categoryId === categoryId_main);

          if (existingCategoryIndex !== -1) {
            // Category exists, update imgUrls
            existingData[existingCategoryIndex].imgUrls.push(...imgUrls);
          } else {
            // Category does not exist, add new category
            existingData.push({
              categoryId: categoryId_main,
              categoryTitle: categoryTitle_main,
              imgUrls,
            });
          }
        }

        // Remove duplicates from existingData
        existingData = existingData.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.categoryId === value.categoryId
          ))
        );
        const filteredData = BannerData.filter((item) => item.title !== 'CategoryBanners');

        if (existingData.length > 0) {
          const docRef = querySnapshot.size > 0 ? querySnapshot.docs[0].ref : await addDoc(collection(db, "Banner"), { title: "CategoryBanners", data: [] });
          await setDoc(docRef, { title: "CategoryBanners", data: existingData });
          SetBannerData([...filteredData, { id: docRef.id, title: 'CategoryBanners', data: existingData }]);
          toast.success("Categories Banner Added Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          console.log("No New Image upload");
        }

      } else {
        console.log("Select at least one file before uploading ")
      }

    }
    catch (error) {
      console.log(error)
    } finally {
      setLoaderstatus(false)
    }
  }


  useEffect(() => {
    console.log("CAgteryu images data is ", CategoryImage)
  }, [CategoryImage])



  /*
  *********************************************************
  Categoroies  Banner functionaltiy end   */

  const findImageSourceByTitle = (title, index) => {
    console.log(CategoryImage[index]);
    const matchingImages = CategoryImage[index].filter((image) => {
      if (typeof image === "string") {
        const parts = image.split("$$$$");
        if (parts.length >= 3) {
          const categoryTitle = parts[2];
          const imageUrl = parts[0];
          return (
            categoryTitle === title &&
            typeof imageUrl === "string" &&
            imageUrl.startsWith("http")
          );
        }
      }
      return false;
    });

    if (matchingImages.length > 0) {
      return matchingImages;
    }

    // If no image found, return null to display file input for adding a new image
    return null;
  };

  if (loaderstatus) {
    return <Loader></Loader>;
  } else {
    return (
      <div className="main_panel_wrapper pb-2  bg_light_grey w-100">
        <form>
          <div className="banner_advertisement">
            <div className=" d-flex align-items-center justify-content-between  mt-4">
              <h1 className="fw-500 mb-0 black fs-lg">
                Banners / Advertisement
              </h1>
            </div>
            <Accordion
              className="border-0 w-100 rounded-none"
              activeKey={activeAccordion}
              onSelect={handleAccordionSelect}
            >
              <Accordion.Item className="py-1 bg-white" eventKey="0">
                <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                  <div className="d-flex justify-content-between w-100">
                    <h3 className="fs-sm fw-400 black mb-0">Large Banner</h3>
                    {activeAccordion === "0" ? (
                      <button
                        onClick={handleSaveLargeBanner}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit"
                      >
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 720 x
                    720 pixels carring image ratio of 1:1.
                  </p>
                  <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                    {/*Single Medium Banner */}
                    <div className="bg_white pe-1">
                      <input
                        type="file"
                        id="largeBanner1"
                        onChange={(e) => handleUploadLargeBanner(0, e)}
                        hidden
                      />

                      {!selectedImagesLargeBanner[0] ? (
                        <label
                          // htmlFor="largeBanner1"
                          onClick={() => {
                            setUploadLargeBannerIndex(0)
                            setUploadBannerPopup(true)
                            setSelectedBanner("largebanner")
                          }}
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Banner
                        </label>
                      ) : (
                        selectedImagesLargeBanner[0] && (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesLargeBanner[0].img &&
                                  typeof selectedImagesLargeBanner[0].img ===
                                  "string" &&
                                  selectedImagesLargeBanner[0].img.startsWith("http")
                                  ? selectedImagesLargeBanner[0].img.split(
                                    "$$$$"
                                  )[0]
                                  : URL.createObjectURL(
                                    selectedImagesLargeBanner[0].validatedImage
                                  )
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteLargeBanner(0)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                            <img
                              onClick={() => setUploadBannerPopup(true)}
                              className="bg-white brs_50 p-1 position-absolute top-0 end-0 mt-2 me-5 cursor_pointer"
                              src={editIcon}
                              alt="editIcon"
                            />
                          </div>
                        )
                      )}
                    </div>
                    <div className="mt-3 mt-lg-0">
                      <div className="bg_white ps-2">
                        <input
                          type="file"
                          id="largeBanner2"
                          onChange={(e) => handleUploadLargeBanner(1, e)}
                          hidden
                        />

                        {!selectedImagesLargeBanner[1] ? (
                          <label
                            // htmlFor="largeBanner2"

                            onClick={() => {
                              setUploadLargeBannerIndex(1)
                              setUploadBannerPopup(true)
                              setSelectedBanner("largebanner")
                            }}
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                          >
                            + Add Banner
                          </label>
                        ) : (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesLargeBanner[1] &&
                                  typeof selectedImagesLargeBanner[1].img ===
                                  "string" &&
                                  selectedImagesLargeBanner[1].img.startsWith("http")
                                  ? selectedImagesLargeBanner[1].img.split(
                                    "$$$$"
                                  )[0]
                                  :
                                  URL.createObjectURL(
                                    selectedImagesLargeBanner[1].validatedImage
                                  )
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteLargeBanner(1)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* Banner Slider for sales / offers  */}
              <Accordion.Item className="py-1 bg-white rounded" eventKey="1">
                <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                  <div className="d-flex justify-content-between w-100">
                    <h3 className="fs-sm fw-400  black mb-0">
                      Banner Slider for Sales / Offers
                    </h3>
                    {activeAccordion === "1" ? (
                      <button
                        onClick={handleSaveBannerSliderSale}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit"
                      >
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 1280 x
                    720 pixels carring image ratio of 16:9.
                  </p>
                  <div className="d-flex align-items-center mt-2 pt-1 bg-white">
                    {/*Single Medium Banner */}
                    <div className="bg_white pe-1">
                      <input
                        type="file"
                        id="Sales_Offers"
                        // accept="image/*"
                        multiple
                        onChange={handelSaleBannerImg}
                        hidden
                      />
                      <div className="d-flex gap-3 flex-wrap">
                        {SelectedBannerImg && (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={SelectedBannerImg}
                              alt=""
                            />
                            <button
                              onClick={handleAddMediaSaleOffer}
                              className="position-absolute bottom-0 start-50 translate-middle cursor_pointer bg-green px-2 py-1 rounded"
                              type="button"
                            >
                              + Add Banner
                            </button>
                          </div>
                        )}
                        {BannerSaleImg.map((offerbanner, index) => (

                          <div
                            key={index}
                            className="position-relative imagemedia_btn"
                          >
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                offerbanner.img &&
                                  typeof offerbanner.img == "string" &&
                                  offerbanner.img.startsWith("http")
                                  ? offerbanner.img
                                  : URL.createObjectURL(offerbanner.validatedImage)
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handeldeleteSaleBannerImg(index)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                          </div>
                        ))}
                        {!SelectedBannerImg && (
                          <label
                            // htmlFor="Sales_Offers"
                            onClick={() => {

                              setSelectedBanner("salesoffers")

                              setUploadBannerPopup(true)
                            }}
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                          >
                            + Add Banner
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              {/* small patti banners  */}
              <Accordion.Item className="py-1 bg-white rounded" eventKey="2">
                <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                  <div className="d-flex justify-content-between w-100">
                    <h3 className="fs-sm fw-400  black mb-0">
                      Small Patti Banner
                    </h3>
                    {activeAccordion === "2" ? (
                      <button
                        onClick={handleSaveSmallPattiBanner}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit"
                      >
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 1280 x
                    200 pixels carring image ratio of 16:2.5.
                  </p>
                  <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2 justify-content-between">
                    <div className="bg_white w-100">
                      <input
                        type="file"
                        id="smallPatti1"
                        onChange={(e) => handleUploadSmallPatti(0, e)}
                        hidden
                      />

                      {!selectedImagesSmallPatii[0] ? (
                        <label
                          // htmlFor="smallPatti1"
                          onClick={() => {
                            setuploadSmallPattiIndex(0)
                            setuploadSmallPattiPopup(true)
                          }}
                          className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Banner
                        </label>
                      ) : (
                        selectedImagesSmallPatii[0] && (
                          <div className="position-relative imagesmallmedia_btn w-100">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesSmallPatii[0].img &&
                                  typeof selectedImagesSmallPatii[0].img ===
                                  "string" &&
                                  selectedImagesSmallPatii[0].img.startsWith("http")
                                  ? selectedImagesSmallPatii[0].img.split("$$$$")[0]
                                  : URL.createObjectURL(
                                    selectedImagesSmallPatii[0].validatedImage
                                  )
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteSmallPatti(0)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />

                          </div>
                        )
                      )}
                    </div>
                    <div className="bg_white w-100">
                      <input
                        type="file"
                        id="smallPatti2"
                        onChange={(e) => handleUploadSmallPatti(1, e)}
                        hidden
                      />

                      {!selectedImagesSmallPatii[1] ? (
                        <label
                          // htmlFor="smallPatti2"
                          onClick={() => {
                            setuploadSmallPattiIndex(1)
                            setuploadSmallPattiPopup(true)
                          }}
                          className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Banner
                        </label>
                      ) : (
                        selectedImagesSmallPatii[1] && (
                          <div className="position-relative imagesmallmedia_btn w-100">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesSmallPatii[1].img &&
                                  typeof selectedImagesSmallPatii[1].img ===
                                  "string" &&
                                  selectedImagesSmallPatii[1].img.startsWith("http")
                                  ? selectedImagesSmallPatii[1].img.split("$$$$")[0]
                                  : URL.createObjectURL(
                                    selectedImagesSmallPatii[1].validatedImage
                                  )
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteSmallPatti(1)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                          </div>
                        )
                      )}
                    </div>
                    <div className="bg_white w-100">
                      <input
                        type="file"
                        id="smallPatti3"
                        onChange={(e) => handleUploadSmallPatti(2, e)}
                        hidden
                      />

                      {!selectedImagesSmallPatii[2] ? (
                        <label
                          // htmlFor="smallPatti3"
                          onClick={() => {
                            setuploadSmallPattiIndex(2)
                            setuploadSmallPattiPopup(true)
                          }}
                          className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center"
                        >
                          + Add Banner
                        </label>
                      ) : (
                        selectedImagesSmallPatii[2] && (
                          <div className="position-relative imagesmallmedia_btn w-100">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesSmallPatii[2].img &&
                                  typeof selectedImagesSmallPatii[2].img ===
                                  "string" &&
                                  selectedImagesSmallPatii[2].img.startsWith("http")
                                  ? selectedImagesSmallPatii[2].img.split("$$$$")[0]
                                  : URL.createObjectURL(
                                    selectedImagesSmallPatii[2].validatedImage
                                  )
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteSmallPatti(2)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />

                          </div>
                        )
                      )}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              {/* banner slider for animal suppliments */}

              <Accordion.Item className="py-1 bg-white rounded" eventKey="3">
                <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                  <div className="d-flex justify-content-between w-100">
                    <h3 className="fs-sm fw-400  black mb-0">
                      Banner Slider for Animal Suppliments
                    </h3>
                    {activeAccordion === "3" ? (
                      <button
                        onClick={handleSaveAnimalSuppliments}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit"
                      >
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 1280 x
                    720 pixels carring image ratio of 16:9.
                  </p>
                  <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                    <div className="bg_white">
                      <input
                        type="file"
                        onChange={handelAnimalSuplimentImg}
                        id="animal_suppliments"
                        hidden
                      />
                      <div className="d-flex gap-3 flex-wrap">
                        {selectedImage && (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={selectedImage}
                              alt=""
                            />
                            <button
                              onClick={handleAddMedia}
                              className="position-absolute bottom-0 start-50 translate-middle cursor_pointer bg-green px-2 py-1 rounded"
                              type="button"
                            >
                              + Add Banner
                            </button>
                          </div>
                        )}
                        {AnimalSuplimentsImages.map(
                          (animalSupbanner, index) => (
                            <div
                              key={index}
                              className="position-relative imagemedia_btn"
                            >
                              {/* {console.log(animalSupbanner)} */}
                              <img
                                className="w-100 h-100 object-fit-cover"
                                src={
                                  animalSupbanner.img &&
                                    typeof animalSupbanner.img === "string" &&
                                    animalSupbanner.img.startsWith("http")
                                    ? animalSupbanner.img
                                    : URL.createObjectURL(animalSupbanner.validatedImage)
                                }
                                alt=""
                              />
                              <img
                                onClick={() =>
                                  handeldeleteAnimalSupliment(index)
                                }
                                className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                                src={deleteicon}
                                alt="deleteicon"
                              />

                            </div>
                          )
                        )}
                        {!selectedImage && (
                          <label
                            // htmlFor="animal_suppliments"
                            onClick={() => {
                              setSelectedBanner("animalbanner")
                              setUploadBannerPopup(true)
                            }}
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                          >
                            + Add Banner
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <div className="d-flex align-items-center justify-content-between mt-3">
                <p className="fs-sm fw-700 black pt-1 mt-3">
                  Categorized Banners
                </p>
                <button
                  className="d-flex align-items-center update_banners_btn"
                  onClick={(e) => handleUpdateCategoryBanner(e)}
                >
                  <img src={saveicon} alt="saveicon" />
                  <p className="fs-sm fw-600 black mb-0 ms-2">Update Banner</p>
                </button>
              </div>
              {categoreisTitle.map((data, index) => (
                <Accordion.Item
                  className="py-1 bg-white rounded"
                  eventKey={index}
                  key={index}
                >
                  <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                    <div className="d-flex justify-content-between w-100">
                      <h3 className="fs-sm fw-400 black mb-0">{data}</h3>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="py-2 px-3">
                    <p className="fs-sm fw-400 black">
                      The image must be sized 1.5Mb having at least 1280 x 720
                      pixels carrying an image ratio of 16:9.
                    </p>
                    <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                      <div className="bg_white">
                        <input
                          type="file"
                          id={`category_images_${index}`}
                          onChange={(e) => handleCategoryImages(e, index)}
                          multiple // Allow multiple file selection
                          hidden
                        />
                        <div className="d-flex gap-3 flex-wrap">
                          {Array.isArray(CategoryImage[index]) &&
                            CategoryImage[index].map((image, innerIndex) => (

                              <div
                                key={innerIndex}
                                className="position-relative imagemedia_btn"
                              >
                                <img
                                  className="w-100 h-100 object-fit-cover"
                                  src={
                                    image.img &&
                                      typeof image.img === "string" &&
                                      image.img.startsWith("http")
                                      ? image.img.split("$$$$")[0]
                                      : URL.createObjectURL(image.validatedImage)
                                  }
                                  alt=""
                                />
                                <img
                                  onClick={() =>
                                    handleCategoryImagesDelete(
                                      index,
                                      innerIndex,
                                      data
                                    )
                                  }
                                  className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                                  src={deleteicon}
                                  alt="deleteicon"
                                />

                              </div>
                            ))
                          }
                          {/* Display "+ Add Banner" label */}
                          <label
                            // htmlFor={`category_images_${index}`}
                            onClick={() => {
                              setcategoryimageindex(index)
                              setUploadBannerPopup(true)
                            }
                            }
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                          >
                            + Add Banner
                          </label>
                        </div>
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </form>
        <ToastContainer />
        {uploadBannerPopup ? (
          <AddBanner
            onSave={(args) => {
              if (SelectedBanner === "largebanner") {
                handleUploadLargeBanner(uploadLargeBannerIndex, args);
                setUploadBannerPopup(false)
              } else if (SelectedBanner === "salesoffers") {
                handelSaleBannerImg(args)
                setUploadBannerPopup(false)
              } else if (SelectedBanner === "animalbanner") {
                setUploadBannerPopup(false)
                handelAnimalSuplimentImg(args)
              }
              else {
                handleCategoryImages(args, categoryimagesindex)
              }
            }}
            onExit={setUploadBannerPopup}
          // showPopup={setDeletePopup}
          // handleDelete={() => handleDeleteProduct(ProductId, ProductImage)}
          // itemName="Product"
          />
        ) : null}

        {
          uploadSmallPattiPopup ? (
            <AddSmallPattiBanner
              onSave={(args) => {
                handleUploadSmallPatti(uploadSmallPattiIndex, args)
              }
              }
              onExit={setuploadSmallPattiPopup}
            />

          ) : null
        }

      </div>
    );
  }
};

export default BannersAdvertisement;
