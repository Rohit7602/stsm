import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import saveicon from '../../Images/svgs/saveicon.svg';
import deleteicon from '../../Images/svgs/deleteicon.svg';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
  deleteObject,
  getStream,
} from 'firebase/storage';
import { where, query, getDoc } from 'firebase/firestore';
import { storage, db } from '../../firebase';
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayRemove,
  setDoc,
} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useImageValidation } from '../../context/validators';
import { useImageHandleContext } from '../../context/ImageHandler';
import { useMainCategories } from '../../context/categoriesGetter';
import { UseBannerData } from '../../context/BannerGetters';
import { uploadBytes } from 'firebase/storage';
import Loader from '../Loader';

//  banner advertisement up start from here
// check accordian and save button

const BannersAdvertisement = () => {
  const [loaderstatus, setLoaderstatus] = useState(false);
  // context
  const { BannerData, deleteObjectByImageUrl } = UseBannerData();
  const { ImageisValidOrNot } = useImageHandleContext();
  const { validateImage } = useImageValidation();
  const { categoreis } = useMainCategories();

  let categoreisTitle = []
  categoreis.map((data, index) => {
    categoreisTitle.push(data.title)
  })

  console.log(categoreisTitle)
  console.log("Banner data is ", BannerData)

  // get intially all the uploded banners
  const updateSelectedImages = (data) => {
    if (data) {
      const selectedImages = {};
      data.forEach((item) => {
        // console.log(item)
        const title = item.title.toLowerCase();
        const imagelinks = item.data;
        if (imagelinks) {
          if (title === "categorybanners") {
            // Modify imagelinks by adding item.id + item.name to each element
            selectedImages[title] = imagelinks.map((itemurl) => itemurl.imgUrl + '$$$$' + item.id + '$$$$' + itemurl.categoryTitle);
          } else {
            // If title is not "categorybanner", use the original imagelinks
            selectedImages[title] = imagelinks.map((itemurl) => itemurl.imgUrl + '$$$$' + item.id);
          }
        }
      });

      // Now you have an object with selected images for each title
      // console.log('asdfasfasdfsasdfasdf', selectedImages);
      // Example: Accessing images for largebanner
      if (selectedImages['largebanner']) {
        setSelectedImagesLargeBanner(selectedImages['largebanner']);
      }

      // Example: Accessing images for smallpatti
      if (selectedImages['smallpattbanner']) {
        setselectedImagesSmallPatii(selectedImages['smallpattbanner']);
      }

      // Example: Accessing images for categories

      if (selectedImages['categorybanners']) {
        setCategoryImage(selectedImages['categorybanners']);
        console.log("categoreis banner is ", selectedImages['categorybanners'])
      }

      if (selectedImages['salesoffers']) {
        setBannerSaleImg(selectedImages['salesoffers']);
      }
      if (selectedImages['animalsupliments']) {
        setAnimalSuplimentsImages(selectedImages['animalsupliments']);
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

  const [selectedImagesLargeBanner, setSelectedImagesLargeBanner] = useState([null, null]);

  const handleUploadLargeBanner = async (index, e) => {
    const file = e.target.files[0];

    try {
      // Validate the image using the context function
      const validatedImage = await validateImage(file, 1, 720, 720);

      // If validation succeeds, update the state
      const newImages = [...selectedImagesLargeBanner];
      newImages[index] = validatedImage;
      setSelectedImagesLargeBanner(newImages);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };



  const handleDeleteLargeBanner = async (index) => {
    setLoaderstatus(true)
    const image = selectedImagesLargeBanner[index]
    if (
      selectedImagesLargeBanner[index] &&
      typeof selectedImagesLargeBanner[index] === 'string' &&
      selectedImagesLargeBanner[index].startsWith('http')
    ) {

      const imageURL = selectedImagesLargeBanner[index].split('$$$$')[0]
      const id = selectedImagesLargeBanner[index].split('$$$$')[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, selectedImagesLargeBanner[index]);
      await deleteObject(reference);
      deleteObjectByImageUrl(imageURL)

      const docRef = doc(db, 'Banner', id);
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

      setLoaderstatus(false)


    }
    const newImages = [...selectedImagesLargeBanner];
    newImages[index] = null;
    setSelectedImagesLargeBanner(newImages);
    setLoaderstatus(false)

  };

  async function handleSaveLargeBanner() {
    setLoaderstatus(true)
    try {
      if (selectedImagesLargeBanner.every(Boolean)) {
        const newImageData = [];

        // Fetch existing data
        const querySnapshot = await getDocs(
          query(collection(db, 'Banner'), where('title', '==', 'LargeBanner'))
        );

        // Collect existing image URLs
        const existingImageUrls = [];
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrls || [];
            existingImageUrls.push(...existingUrls);
          });
        }

        for (const file of selectedImagesLargeBanner) {
          let imageUrl = null;

          if (file instanceof File) {
            // Handle file upload
            const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
            const storageRef = ref(storage, `banner/${filename}`);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
          } else if (typeof file === 'string') {
            // Handle image URL
            imageUrl = file.split('$$$$')[0];
          }

          // Only add new image URL (not in existingImageUrls)
          if (imageUrl && !existingImageUrls.includes(imageUrl)) {
            newImageData.push({
              categoryId: '',
              categoryTitle: '',
              imgUrl: imageUrl,
            });
          }
        }

        if (newImageData.length > 0) {
          try {
            // Check if the document already exists
            const querySnapshot = await getDocs(
              query(collection(db, 'Banner'), where('title', '==', 'LargeBanner'))
            );

            if (querySnapshot.size > 0) {
              // Document already exists, get existing data
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              // Filter out existing objects from newImageData
              const filteredNewImageData = newImageData.filter(
                (newObj) =>
                  !existingData.some((existingObj) => existingObj.imgUrl === newObj.imgUrl)
              );

              // Combine existing and new image URLs in the same data array
              const updatedData = existingData.concat(filteredNewImageData);

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'LargeBanner',
                data: updatedData,
              });
            } else {
              // Document doesn't exist, create a new one with new images
              const docRef = await addDoc(collection(db, 'Banner'), {
                title: 'LargeBanner',
                data: newImageData,
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          setLoaderstatus(false)
          console.log('No new images uploaded');
        }
      } else {
        setLoaderstatus(false)
        console.log('Select both images before uploading');
      }
      setLoaderstatus(false)
      toast.success('Large Banner Added Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error(error);
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
  const [selectedImagesSmallPatii, setselectedImagesSmallPatii] = useState([null, null, null]);

  const handleUploadSmallPatti = async (index, e) => {
    let file = e.target.files[0];
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
      newImages[index] = validatedImage;
      setselectedImagesSmallPatii(newImages);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleDeleteSmallPatti = async (index) => {
    setLoaderstatus(true)
    const imageURL = selectedImagesSmallPatii[index]

    // const imageURL = selectedImagesSmallPatii[index].split('$$$$')[0];
    if (
      selectedImagesSmallPatii[index] &&
      typeof selectedImagesSmallPatii[index] === 'string' &&
      selectedImagesSmallPatii[index].startsWith('http')
    ) {
      const imageURLtoDelete = selectedImagesSmallPatii[index].split('$$$$')[0];
      const id = selectedImagesSmallPatii[index].split('$$$$')[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, selectedImagesSmallPatii[index]);
      await deleteObject(reference);

      const docRef = doc(db, 'Banner', id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'data' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Filter out the item at the specified index
          const filteredData = existingData.data.filter((item, i) => i !== index);

          // Update the document in Firestore with the modified 'data' array
          await updateDoc(docRef, { data: filteredData });
        }
      }
      deleteObjectByImageUrl(imageURLtoDelete)
      setLoaderstatus(false)
    }

    const newImages = [...selectedImagesSmallPatii];
    newImages[index] = null;
    setselectedImagesSmallPatii(newImages);
    setLoaderstatus(false)
  };

  async function handleSaveSmallPattiBanner() {
    setLoaderstatus(true)
    try {
      if (selectedImagesSmallPatii.every(Boolean)) {
        const newImageData = [];

        // Fetch existing data
        const querySnapshot = await getDocs(
          query(collection(db, 'Banner'), where('title', '==', 'SmallPattBanner'))
        );

        // Collect existing image URLs
        const existingImageUrls = [];
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = (item.imagelinks || []).map((img) => img.imgUrl);
            existingImageUrls.push(...existingUrls);
          });
        }

        for (const file of selectedImagesSmallPatii) {
          let imageUrl = null;

          if (file instanceof File) {
            // Handle file upload
            const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
            const storageRef = ref(storage, `banner/${filename}`);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
          } else if (typeof file === 'string') {
            // Handle image URL
            imageUrl = file.split('$$$$')[0];
          }

          // Only add new image URL (not in existingImageUrls)
          if (imageUrl && !existingImageUrls.includes(imageUrl)) {
            newImageData.push({
              categoryId: '',
              categoryTitle: '',
              imgUrl: imageUrl,
            });
          }
        }

        if (newImageData.length > 0) {
          try {
            // Check if the document already exists
            const querySnapshot = await getDocs(
              query(collection(db, 'Banner'), where('title', '==', 'SmallPattBanner'))
            );

            if (querySnapshot.size > 0) {
              // Document already exists, get existing data
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              // Filter out existing objects from newImageData
              const filteredNewImageData = newImageData.filter(
                (newObj) =>
                  !existingData.some((existingObj) => existingObj.imgUrl === newObj.imgUrl)
              );

              // Combine existing and new image URLs in the same imagelinks array
              const updatedData = existingData.concat(filteredNewImageData);

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'SmallPattBanner',
                data: updatedData,
              });
            } else {
              // Document doesn't exist, create a new one with new images
              const docRef = await addDoc(collection(db, 'Banner'), {
                title: 'SmallPattBanner',
                data: [...newImageData],
              });
            }
          } catch (error) {
            setLoaderstatus(false)
            console.log(error);
          }
        } else {
          setLoaderstatus(false)
          console.log('No new images uploaded');
        }
      } else {
        setLoaderstatus(false)
        console.log('Select all images before uploading');
      }
      setLoaderstatus(false)
      toast.success('SmallPatti Banner Added Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoaderstatus(false)
      console.error(error);
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
    const selectedFile = e.target.files[0];
    // console.log(selectedFile)
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
      setBannerSaleImg([...BannerSaleImg, validatedImage]);
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
    setLoaderstatus(true)
    const imageUrlToDelete = BannerSaleImg[index];
    if (
      imageUrlToDelete &&
      typeof imageUrlToDelete === 'string' &&
      imageUrlToDelete.startsWith('http')
    ) {
      const imageURL = imageUrlToDelete.split("$$$$")[0]
      const id = imageUrlToDelete.split('$$$$')[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, imageUrlToDelete);

      // Delete the image from storage
      await deleteObject(reference);
      deleteObjectByImageUrl(imageURL)

      // Get the document reference
      const docRef = doc(db, 'Banner', id);

      // Get the document snapshot
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'imagelinks' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Filter out the item at the specified index
          const filteredData = existingData.data.filter((item, i) => i !== index);

          // Update the document in Firestore with the modified 'imagelinks' array
          await updateDoc(docRef, { data: filteredData });
        }
      }
      setLoaderstatus(false)
    }

    // Update the state to remove the deleted image
    const newImages = BannerSaleImg.filter((_, i) => i !== index); // [...BannerSaleImg];
    setBannerSaleImg(newImages);
    setLoaderstatus(false)

  }

  async function handleSaveBannerSliderSale() {
    setLoaderstatus(true)
    try {
      if (BannerSaleImg.every(Boolean)) {
        let newImageData = [];
        const existingImageUrls = [];
        const querySnapshot = await getDocs(
          query(collection(db, 'Banner'), where('title', '==', 'SalesOffers'))
        );
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];

          existingData.forEach((element) => {
            const existingUrls = element.imgUrls || [];
            existingImageUrls.push(...existingUrls);
          });
        }
        for await (let files of BannerSaleImg) {
          let url = null;
          // const name = Math.floor(Date.now() / 1000) + '-' + files.name;
          // const storageRef = ref(storage, `banner/${name}`);
          if (files instanceof File) {
            const name = Math.floor(Date.now() / 1000) + '-' + files.name;
            console.log('name is', name);
            const storageRef = ref(storage, `banner/${name}`);
            await uploadBytes(storageRef, files);
            url = await getDownloadURL(storageRef);
          } else if (typeof files === 'string') {
            url = files.split('$$$$')[0];
          }
          if (url && !existingImageUrls.includes(url) && !newImageData.includes(url)) {
            newImageData.push({
              categoryId: '',
              categoryTitle: '',
              imgUrl: url,
            });
          }
        }

        if (newImageData.length > 0) {
          try {
            const querySnapshot = await getDocs(
              query(collection(db, 'Banner'), where('title', '==', 'SalesOffers'))
            );
            if (querySnapshot.size > 0) {
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              const filteredNewImageData = newImageData.filter(
                (newObj) =>
                  !existingData.some((existingObj) => existingObj.imgUrl === newObj.imgUrl)
              );

              const updatedData = existingData.concat(filteredNewImageData);

              //const updatedData = [{ imagelinks: combinedImagelinks }];

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'SalesOffers',
                data: updatedData,
              });
            } else {
              const docRef = await addDoc(collection(db, 'Banner'), {
                // Sales_Offers: [{
                //   title: 'Sales/Offers',
                //   imgUrl: [url],
                // }]
                title: 'SalesOffers',
                data: [...newImageData],
              });
            }
          } catch (error) {
            setLoaderstatus(false)
            console.log('Error adding image to Banner');
          }
          setLoaderstatus(false)
          toast.success('Sale/Offer Banner Added   Successfully !', {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          setLoaderstatus(false)
          console.warn('No image selected for upload');
        }
      }
    } catch (error) {
      setLoaderstatus(false)
      console.error('Error uploading image or adding document:', error);
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
    const selectedFile = e.target.files[0];
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
      setAnimalSuplimentsImages([...AnimalSuplimentsImages, validatedImage]);
      setSelectedImage(null);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handeldeleteAnimalSupliment(index) {
    setLoaderstatus(true)
    const imageUrlToDelete = AnimalSuplimentsImages[index];
    if (
      imageUrlToDelete &&
      typeof imageUrlToDelete === 'string' &&
      imageUrlToDelete.startsWith('http')
    ) {
      const imageURL = imageUrlToDelete.split("$$$$")[0]
      const id = imageUrlToDelete.split('$$$$')[1];
      const storageRef = getStorage();
      const reference = ref(storageRef, imageUrlToDelete);

      // Delete the image from storage
      await deleteObject(reference);
      deleteObjectByImageUrl(imageURL)

      // Get the document reference
      const docRef = doc(db, 'Banner', id);

      // Get the document snapshot
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();

        // Check if 'data' is an array with at least one item
        if (Array.isArray(existingData.data) && existingData.data.length > 0) {
          // Filter out the item at the specified index
          const filteredData = existingData.data.filter((item, i) => i !== index);

          // Update the document in Firestore with the modified 'data' array
          await updateDoc(docRef, { data: filteredData });
        }
      }

      setLoaderstatus(false)
    }

    // Update the state to remove the deleted image
    const newImages = AnimalSuplimentsImages.filter((_, i) => i !== index);
    setAnimalSuplimentsImages(newImages);
    setLoaderstatus(false)
  }

  async function handleSaveAnimalSuppliments() {
    setLoaderstatus(true)
    try {
      if (AnimalSuplimentsImages.every(Boolean)) {
        const newImageData = [];

        // Fetch existing data
        const querySnapshot = await getDocs(
          query(collection(db, 'Banner'), where('title', '==', 'AnimalSupliments'))
        );

        // Collect existing image URLs
        const existingImageUrls = [];
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrls || [];
            existingImageUrls.push(...existingUrls);
          });
        }

        for await (const file of AnimalSuplimentsImages) {
          let imageUrl = null;

          if (file instanceof File) {
            // Handle file upload
            const filename = Math.floor(Date.now() / 1000) + '-' + file.name;
            const storageRef = ref(storage, `banner/${filename}`);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
          } else if (typeof file === 'string') {
            // Handle image URL
            imageUrl = file.split('$$$$')[0];
          }

          // Only add new image URL (not in existingImageUrls and not in newImageData)
          if (
            imageUrl &&
            !existingImageUrls.includes(imageUrl) &&
            !newImageData.includes(imageUrl)
          ) {
            newImageData.push({
              categoryId: '',
              categoryTitle: '',
              imgUrl: imageUrl,
            });
          }
        }

        if (newImageData.length > 0) {
          try {
            // Check if the document already exists
            const querySnapshot = await getDocs(
              query(collection(db, 'Banner'), where('title', '==', 'AnimalSupliments'))
            );

            if (querySnapshot.size > 0) {
              // Document already exists, get existing data
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              // Combine existing and new image URLs in the same data array
              const filteredNewImageData = newImageData.filter(
                (newObj) =>
                  !existingData.some((existingObj) => existingObj.imgUrl === newObj.imgUrl)
              );

              const updatedData = existingData.concat(filteredNewImageData);

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'AnimalSupliments',
                data: updatedData,
              });
            } else {
              // Document doesn't exist, create a new one with new images
              const docRef = await addDoc(collection(db, 'Banner'), {
                title: 'AnimalSupliments',
                data: [...newImageData],
              });
            }
          } catch (error) {
            setLoaderstatus(false)
            console.log(error);
          }
        } else {
          setLoaderstatus(false)
          console.log('No new images uploaded');
        }
      } else {
        setLoaderstatus(false)
        console.log('Select both images before uploading');
      }
      setLoaderstatus(false)
      toast.success('Animal Supliments Banner Added Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoaderstatus(false)
      console.error(error);
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

  const [CategoryImage, setCategoryImage] = useState(Array(categoreis.length).fill(''));

  async function handleCategoryImages(e, index) {
    console.log("index is ", index)
    let file = e.target.files[0];
    console.log("file is ", file);

    try {
      // Define desired aspect ratio and dimensions for large banner
      const desiredAspectRatio = 16 / 9;
      const desiredWidth = 1280;
      const desiredHeight = 720;

      // Validate the image using the context function
      const validatedImage = await validateImage(
        file,
        desiredAspectRatio,
        desiredWidth,
        desiredHeight
      );

      // Update the state at the specified index
      setCategoryImage(prevCategoryImages => {
        const newCategoryImages = [...prevCategoryImages];
        newCategoryImages[index] = validatedImage;
        return newCategoryImages;
      });

      console.log("Updated CategoryImage:", CategoryImage);
    } catch (error) {
      // Handle the validation error (e.g., show an error message)
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }




  async function handleCategoryImagesDelete(index, imageUrlToDelete) {
    setLoaderstatus(true)
    console.log("idex sd ", CategoryImage[index])
    console.log("urel ia ", imageUrlToDelete)
    console.log("delee function working ")

    try {
      if (
        imageUrlToDelete &&
        typeof imageUrlToDelete === 'string' &&
        imageUrlToDelete.startsWith('http')
      ) {
        console.log("if working ")
        const imageURL = imageUrlToDelete.split("$$$$")[0]
        const id = imageUrlToDelete.split('$$$$')[1];
        const storageRef = getStorage();
        const reference = ref(storageRef, imageUrlToDelete);

        // Delete the image from storage
        await deleteObject(reference);
        deleteObjectByImageUrl(imageURL);

        // After successful deletion, update Firestore data
        const docRef = doc(db, 'Banner', id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const existingData = docSnapshot.data();

          // Check if 'data' is an array with at least one item
          if (Array.isArray(existingData.data) && existingData.data.length > 0) {
            // Filter out the item at the specified index
            const filteredData = existingData.data.filter((item, i) => i !== index);

            // Update the document in Firestore with the modified 'data' array
            await updateDoc(docRef, { data: filteredData });
          }
        }
        setLoaderstatus(false)
      }

      // Update the state to remove the deleted image
      const newCategoryImages = [...CategoryImage];
      newCategoryImages[index] = ''; // Set the image for the specified index to an empty string
      setCategoryImage(newCategoryImages);
      setLoaderstatus(false)
    } catch (error) {
      console.error("Error deleting from storage or updating Firestore:", error);
      // Handle error as needed
    }
  }




  async function handleUpdateCategoryBanner() {
    setLoaderstatus(true);

    try {
      if (CategoryImage.every(Boolean) && categoreis.every(Boolean)) {
        const newImageData = [];
        // Fetch existing data
        const querySnapshot = await getDocs(
          query(collection(db, 'Banner'), where('title', '==', 'CategoryBanners'))
        );
        // Collect existing image URLs
        const existingImageUrls = [];
        if (querySnapshot.size > 0) {
          const existingData = querySnapshot.docs[0].data().data || [];
          existingData.forEach((item) => {
            const existingUrls = item.imgUrls || [];
            existingImageUrls.push(...existingUrls);
          });
        }

        for (let index = 0; index < CategoryImage.length; index++) {
          const file = CategoryImage[index];
          const categoryId = categoreis[index].id;
          const categoryTitle = categoreis[index].title;

          let imageUrl = null;

          if (file instanceof File) {
            // Handle file upload
            const name = Math.floor(Date.now() / 1000) + '-' + file.name;
            const storageRef = ref(storage, `banner/${name}`);
            await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(storageRef);
          } else if (typeof file === 'string') {
            // Handle image URL
            imageUrl = file.split('$$$$')[0];
          }

          // Only add new image URL (not in existingImageUrls and not in newImageData)
          if (
            imageUrl &&
            !existingImageUrls.includes(imageUrl) &&
            !newImageData.some((obj) => obj.imgUrl === imageUrl)
          ) {
            newImageData.push({
              categoryId,
              categoryTitle,
              imgUrl: imageUrl,
            });
          }
        }

        if (newImageData.length > 0) {
          try {
            // Check if the document already exists
            const querySnapshot = await getDocs(
              query(collection(db, 'Banner'), where('title', '==', 'CategoryBanners'))
            );

            if (querySnapshot.size > 0) {
              // Document already exists, get existing data
              const docRef = querySnapshot.docs[0];
              const existingData = docRef.data().data || [];

              // Combine existing and new image URLs in the same data array
              const filteredNewImageData = newImageData.filter(
                (newObj) =>
                  !existingData.some((existingObj) => existingObj.imgUrl === newObj.imgUrl)
              );

              const updatedData = existingData.concat(filteredNewImageData);

              // Set the document with the updated data
              await setDoc(docRef.ref, {
                title: 'CategoryBanners',
                data: updatedData,
              });
            } else {
              // Document doesn't exist, create a new one with new images
              const docRef = await addDoc(collection(db, 'Banner'), {
                title: 'CategoryBanners',
                data: [...newImageData],
              });
            }
          } catch (error) {
            setLoaderstatus(false);
            console.log(error);
          }
        } else {
          setLoaderstatus(false);
          console.log('No new images uploaded');
        }
      } else {
        setLoaderstatus(false);
        console.log('Select images and categories before uploading');
      }
      setLoaderstatus(false);
      toast.success('Category Banners Updated Successfully!', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setLoaderstatus(false);
      console.error(error);
    }
  }


  /*
  *********************************************************
  Categoroies  Banner functionaltiy end   */


  const findImageSourceByTitle = (title, index) => {
    const matchingImage = CategoryImage.find((image) => {
      if (typeof image === 'string') {
        const parts = image.split('$$$$');
        if (parts.length >= 3) {
          const categoryTitle = parts[2];
          const imageUrl = parts[0];
          return categoryTitle === title && typeof imageUrl === 'string' && imageUrl.startsWith('http');
        }
      }
      return false;
    });

    if (matchingImage) {
      return matchingImage;
    }

    // If image not found and a new image exists at the specified index, create a URL for it
    if (CategoryImage[index]) {
      return URL.createObjectURL(CategoryImage[index]);
    }

    // If no image found, return null to display file input for adding a new image
    return null;
  };




  if (loaderstatus) {
    return (
      <Loader></Loader>
    );
  } else {
    return (
      <div className="main_panel_wrapper pb-2  bg_light_grey w-100">
        <form>
          <div className="banner_advertisement">
            <div className=" d-flex align-items-center justify-content-between  mt-4">
              <h1 className="fw-500  mb-0 black fs-lg">Banners / Advertisement</h1>
            </div>
            <Accordion
              className="border-0 w-100 rounded-none"
              activeKey={activeAccordion}
              onSelect={handleAccordionSelect}>
              <Accordion.Item className="py-1 bg-white" eventKey="0">
                <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white d-flex justify-content-between">
                  <div className="d-flex justify-content-between w-100">
                    <h3 className="fs-sm fw-400 black mb-0">Large Banner</h3>
                    {activeAccordion === '0' ? (
                      <button
                        onClick={handleSaveLargeBanner}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit">
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 720 x 720 pixels carring image ratio of 1:1.
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
                          htmlFor="largeBanner1"
                          className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                          + Add Media
                        </label>
                      ) : (
                        selectedImagesLargeBanner[0] && (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesLargeBanner[0] &&
                                  typeof selectedImagesLargeBanner[0] === 'string' &&
                                  selectedImagesLargeBanner[0].startsWith('http')
                                  ? selectedImagesLargeBanner[0].split('$$$$')[0]
                                  : URL.createObjectURL(selectedImagesLargeBanner[0])
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handleDeleteLargeBanner(0)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
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
                            htmlFor="largeBanner2"
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                            + Add Media
                          </label>
                        ) : (
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesLargeBanner[1] &&
                                  typeof selectedImagesLargeBanner[1] === 'string' &&
                                  selectedImagesLargeBanner[1].startsWith('http')
                                  ? selectedImagesLargeBanner[1].split('$$$$')[0]
                                  : URL.createObjectURL(selectedImagesLargeBanner[1])
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
                    <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Sales / Offers</h3>
                    {activeAccordion === '1' ? (
                      <button
                        onClick={handleSaveBannerSliderSale}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit">
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 1280 x 720 pixels carring image ratio of 16:9.
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
                              type="button">
                              Add Media
                            </button>
                          </div>
                        )}

                        {BannerSaleImg.map((offerbanner, index) => (
                          <div key={index} className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                offerbanner &&
                                  typeof offerbanner == 'string' &&
                                  offerbanner.startsWith('http')
                                  ? offerbanner
                                  : URL.createObjectURL(offerbanner)
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
                            htmlFor="Sales_Offers"
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                            + Add Media
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
                    <h3 className="fs-sm fw-400  black mb-0">Small Patti Banner</h3>
                    {activeAccordion === '2' ? (
                      <button
                        onClick={handleSaveSmallPattiBanner}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit">
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 1280 x 200 pixels carring image ratio of
                    16:2.5.
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
                          htmlFor="smallPatti1"
                          className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                          + Add Media
                        </label>
                      ) : (
                        selectedImagesSmallPatii[0] && (
                          <div className="position-relative imagesmallmedia_btn w-100">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesSmallPatii[0] &&
                                  typeof selectedImagesSmallPatii[0] === 'string' &&
                                  selectedImagesSmallPatii[0].startsWith('http')
                                  ? selectedImagesSmallPatii[0].split('$$$$')[0]
                                  : URL.createObjectURL(selectedImagesSmallPatii[0])
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
                          htmlFor="smallPatti2"
                          className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                          + Add Media
                        </label>
                      ) : (
                        selectedImagesSmallPatii[1] && (
                          <div className="position-relative imagesmallmedia_btn w-100">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesSmallPatii[1] &&
                                  typeof selectedImagesSmallPatii[1] === 'string' &&
                                  selectedImagesSmallPatii[1].startsWith('http')
                                  ? selectedImagesSmallPatii[1].split('$$$$')[0]
                                  : URL.createObjectURL(selectedImagesSmallPatii[1])
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
                          htmlFor="smallPatti3"
                          className="color_green cursor_pointer fs-sm addsmall_btn d-flex justify-content-center align-items-center">
                          + Add Media
                        </label>
                      ) : (
                        selectedImagesSmallPatii[2] && (
                          <div className="position-relative imagesmallmedia_btn w-100">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                selectedImagesSmallPatii[2] &&
                                  typeof selectedImagesSmallPatii[2] === 'string' &&
                                  selectedImagesSmallPatii[2].startsWith('http')
                                  ? selectedImagesSmallPatii[2].split('$$$$')[0]
                                  : URL.createObjectURL(selectedImagesSmallPatii[2])
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
                    <h3 className="fs-sm fw-400  black mb-0">Banner Slider for Animal Suppliments</h3>
                    {activeAccordion === '3' ? (
                      <button
                        onClick={handleSaveAnimalSuppliments}
                        className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 py-1 save_btn fw-400 black me-3"
                        type="submit">
                        <img src={saveicon} alt="saveicon" />
                        Save
                      </button>
                    ) : null}
                  </div>
                </Accordion.Header>
                <Accordion.Body className="py-2 px-3">
                  <p className="fs-xxs fw-400 black">
                    The image must be sized below 1.5 Mb having at least 1280 x 720 pixels carring image ratio of 16:9.
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
                              type="button">
                              Add Media
                            </button>
                          </div>
                        )}
                        {AnimalSuplimentsImages.map((animalSupbanner, index) => (
                          <div key={index} className="position-relative imagemedia_btn">
                            {/* {console.log(animalSupbanner)} */}
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={
                                animalSupbanner &&
                                  typeof animalSupbanner === 'string' &&
                                  animalSupbanner.startsWith('http')
                                  ? animalSupbanner
                                  : URL.createObjectURL(animalSupbanner)
                              }
                              alt=""
                            />
                            <img
                              onClick={() => handeldeleteAnimalSupliment(index)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                          </div>
                        ))}
                        {!selectedImage && (
                          <label
                            htmlFor="animal_suppliments"
                            className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center">
                            + Add Media
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <div className="d-flex align-items-center justify-content-between mt-3">
                <p className="fs-sm fw-700 black pt-1 mt-3">Categorized Banners</p>
                <button
                  className="d-flex align-items-center update_banners_btn"
                  onClick={(e) => handleUpdateCategoryBanner(e)}>
                  <img src={saveicon} alt="saveicon" />
                  <p className="fs-sm fw-600 black mb-0 ms-2">Update Banner</p>
                </button>
              </div>
              {categoreisTitle.map((data, index) => (
                <Accordion.Item className="py-1 bg-white rounded" eventKey={index} key={index}>
                  <Accordion.Header className="bg_grey px-3 py-2 fs-xs fw-400 white mb-0 bg-white">
                    <div className="d-flex justify-content-between w-100">
                      <h3 className="fs-sm fw-400 black mb-0">{data}</h3>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body className="py-2 px-3">
                    <p className="fs-sm fw-400 black">
                      The image must be sized 1.5Mb having at least 1280 x 720 pixels carrying an image ratio of 16:9.
                    </p>
                    <div className="d-flex align-items-center mt-2 pt-1 bg-white gap-2">
                      <div className="bg_white">
                        <input
                          type="file"
                          id={`categoreis_${index}`}
                          onChange={(e) => handleCategoryImages(e, index)}
                          hidden
                        />
                        {CategoryImage[index] && CategoryImage[index] instanceof File ? (
                          // Display selected image
                          <div className="position-relative imagemedia_btn">
                            <img
                              className="w-100 h-100 object-fit-cover"
                              src={URL.createObjectURL(CategoryImage[index])}
                              alt=""
                            />
                            <img
                              onClick={() => handleCategoryImagesDelete(index)}
                              className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                              src={deleteicon}
                              alt="deleteicon"
                            />
                          </div>
                        ) : (
                          // Display existing image or "Add Media" label if no existing image
                          findImageSourceByTitle(data) ? (
                            <div className="position-relative imagemedia_btn">
                              <img
                                className="w-100 h-100 object-fit-cover"
                                src={findImageSourceByTitle(data).split('$$$$')[0]}
                                alt=""
                              />
                              <img
                                onClick={() => handleCategoryImagesDelete(index, findImageSourceByTitle(data))}
                                className="position-absolute top-0 end-0 mt-2 me-2 cursor_pointer"
                                src={deleteicon}
                                alt="deleteicon"
                              />
                            </div>
                          ) : (
                            <label
                              htmlFor={`categoreis_${index}`}
                              className="color_green cursor_pointer fs-sm addmedium_btn d-flex justify-content-center align-items-center"
                            >
                              + Add Media
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}

            </Accordion>
          </div>
        </form>
        <ToastContainer />
      </div>
    );
  };
}

export default BannersAdvertisement;
