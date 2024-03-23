import React, { useEffect, useState } from 'react';
import faqIcon from '../../Images/svgs/ques-icon.svg';
import dropdownDots from '../../Images/svgs/dots2.svg';
import deleteIcon from '../../Images/svgs/black-delete.svg';
import editIcon from '../../Images/svgs/pencil.svg';
import closeIcon from '../../Images/svgs/closeicon.svg';
import { addDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { useFaqContext } from '../../context/Faq';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Loader';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { db } from '../../firebase';
import { add } from 'date-fns';
import DOMPurify from 'dompurify';

function Faqs() {
  const [addQusPopup, setAddQusPopup] = useState(false);
  const { faq, deletefaq, updatefAqData, addfaq } = useFaqContext();
  const [quse, setQns] = useState('');
  const [ans, setAns] = useState('');
  const [loading, setloading] = useState(false);
  const [deleteQusPopup, setDeleteQusPopup] = useState(false);
  const [editQusPopup, setEditQusPopup] = useState(true);
  const [questionId, setQuestionId] = useState('');

  function handelStoreQesAns(e) {
    e.preventDefault();
    if (quse !== '' && ans !== '') {
      setloading(true);
      setAddQusPopup(false);
      try {
        let docref = addDoc(collection(db, 'FAQ'), {
          question: quse,
          answer: ans,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        addfaq(docref);
        setloading(false);
        handleReset();
        toast.success('Question Added Successfully', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log('error in add faq');
      }
    } else {
      alert('please enter question and answer ');
    }
  }

  const handleReset = (e) => {
    console.log('first');
    e.preventDefault();
    setAns(' ');
    setQns(' ');
  };
  function handelEditQus(index) {
    setQns(faq[index].question);
    setAns(faq[index].answer);
    setAddQusPopup(true);
    setEditQusPopup(true);
  }

  function handleCancelEditpopup() {
    setAddQusPopup(false);
    setEditQusPopup(false);
  }

  async function handleUpdateQuestion(id) {
    setloading(true);
    try {
      const updatedData = {
        question: quse,
        answer: ans,
        updated_at: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'FAQ', id), updatedData);

      updatefAqData({
        id,
        ...updatedData,
      });

      setloading(false);
      handleCancelEditpopup();

      toast.success('Question updated Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      setloading(false);
      console.log('error in updating FAQ ', error);
    }
  }

  async function handleDeleteQuestion(id) {
    try {
      await deleteDoc(doc(db, 'FAQ', id));
      deletefaq(id);
      setDeleteQusPopup(false);
      toast.success('Question Deleted Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log('error in delte question', error);
    }
  }

  const convertDeltaToHtml = (deltaops) => {
    const converter = new QuillDeltaToHtmlConverter(deltaops, {});
    return converter.convert();
  };

  function handleFaqChange(content, delta, source, editor) {
    const deltaOps = editor.getContents().ops;
    const deltaHtml = convertDeltaToHtml(deltaOps);
    setAns(deltaHtml);
  }

  if (loading) {
    return <Loader></Loader>;
  } else {
    return (
      <div className="main_panel_wrapper pb-4  bg_light_grey w-100 mt-3 pt-1 px-1">
        {addQusPopup || deleteQusPopup ? <div className="bg_black_overlay"></div> : null}
        {addQusPopup ? (
          <div className="addqus_popup">
            <div className="d-flex align-items-center justify-content-between pb-4">
              <p className="m-0 fs-sm fw-400 black">{editQusPopup ? 'Edit' : 'Add'} Question</p>
              <img
                onClick={() => setAddQusPopup(false)}
                className="cursor_pointer"
                src={closeIcon}
                alt="closeIcon"
              />
            </div>
            <div className="">
              <p className="fs-sm fw-400 black">Question </p>
              <textarea
                value={quse}
                onChange={(e) => setQns(e.target.value)}
                className="ques_input w-100"
                placeholder="text"
                rows="2"
                cols=""></textarea>
            </div>
            <div className="d-flex flex-column align-items-start justify-content-between mt-3 pt-1">
              <p className="fs-sm fw-400 black">Answer</p>
              {/* <textarea
                onChange={(e) => setAns(e.target.value)}
                value={ans}
                className="ques_input"
                rows="4"
                placeholder="text"
                cols=""
              ></textarea> */}
              <div className="faq-text-editor">
                <ReactQuill
                  className="rounded-lg ques_input outline-none "
                  modules={Faqs.modules}
                  onChange={handleFaqChange}
                  formats={Faqs.formats}
                  value={ans}
                  placeholder="Write something..."
                />
              </div>
            </div>
            {!editQusPopup ? (
              <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-1">
                <button onClick={handleReset} className="fs-sm fw-400 black qes_reset_btn">
                  Reset
                </button>
                <button onClick={handelStoreQesAns} className="fs-sm fw-400 black qes_save_btn">
                  Save
                </button>
              </div>
            ) : null}
            {editQusPopup ? (
              <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-1">
                <button
                  onClick={handleCancelEditpopup}
                  className="fs-sm fw-400 black qes_reset_btn">
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateQuestion(questionId)}
                  className="fs-sm fw-400 black qes_save_btn">
                  Update
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
        {deleteQusPopup ? (
          <div className="delete_popup">
            <div onClick={() => setDeleteQusPopup(false)} className="text-end">
              <img width={40} className="cursor_pointer" src={closeIcon} alt="closeIcon" />
            </div>
            <p className="fs-2sm fw-700 black mb-0 text-center">Delete FAQs </p>
            <p className="fs-sm fw-500 black text-center mt-4">
              Are you sure want to delete this question
            </p>
            <div className="d-flex align-items-center justify-content-center gap-4 mt-4 pt-2">
              <button
                onClick={() => setDeleteQusPopup(false)}
                className="cancel_btn fs-sm fw-400 color_brown">
                Cancel
              </button>
              <button onClick={() => handleDeleteQuestion(questionId)} className="delete_btn">
                Delete
              </button>
            </div>
          </div>
        ) : null}
        <div className="d-flex align-items-center justify-content-between">
          <h1 className="fw-500  mb-0 black fs-lg">FAQs</h1>
          <button
            onClick={() => {
              setAddQusPopup(true);
              setEditQusPopup(false);
              setQns('');
              setAns('');
            }}
            className="fs-sm d-flex gap-2 mb-0 align-items-center px-2 px-sm-3  py-2 save_btn"
            type="button">
            <img src={faqIcon} alt="faqIcon" />
            <p className="fs-sm fw-400 black ms-2 mb-0">add your Quection’s</p>
          </button>
        </div>
        <div>
          <div className="m-0 p-0 mt-3 pt-1">
            {faq.map((item, index) => (
              <div key={index}>
                <div className="fs-sm fw-400 black mb-3 pb-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="fs-sm fw-400 black m-0">
                      {index + 1}. {item.question}
                    </p>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton3"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <img src={dropdownDots} alt="dropdownDots" />
                      </button>
                      <ul class="dropdown-menu faqs_dropdown" aria-labelledby="dropdownMenuButton3">
                        <li>
                          <div
                            onClick={() => {
                              setQuestionId(item.id);
                              setDeleteQusPopup(true);
                            }}
                            class="dropdown-item d-flex align-items-center cursor_pointer">
                            <img src={deleteIcon} alt="deleteIcon" />
                            <p className="m-0 ms-2">Delete Quection</p>
                          </div>
                        </li>
                        <li>
                          <div
                            onClick={() => {
                              handelEditQus(index);
                              setQuestionId(item.id);
                            }}
                            class="dropdown-item d-flex align-items-center cursor_pointer">
                            <img src={editIcon} alt="editIcon" />
                            <p className="m-0 ms-2">Edit Quction</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="m-0">
                    {/* <p className="fs-sm fw-400 black m-0">
                      <span className="pe-1">- </span>   
                    </p> */}
                    <div
                      className="ms-4"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(item.answer),
                      }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ToastContainer></ToastContainer>
      </div>
    );
  }
}
Faqs.modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: true,
  },
};
Faqs.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

export default Faqs;
