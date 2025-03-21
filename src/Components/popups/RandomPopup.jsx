import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export  const RandomPopup = ({ showModal, handleClose,data }) => {

    console.log(data)
  // Saple data for the table
 const orders = [
   {
     id: 1,
     customer: "John Doe",
     items: [
       { itemName: "Item 1", quantity: 2 },
       { itemName: "Item 2", quantity: 1 },
       { itemName: "Item 3", quantity: 3 },
       { itemName: "Item 4", quantity: 1 },
       { itemName: "Item 5", quantity: 2 },
       { itemName: "Item 6", quantity: 1 },
       { itemName: "Item 7", quantity: 4 },
     ],
     totalAmount: 30,
   },
   {
     id: 2,
     customer: "Jane Smith",
     items: [
       { itemName: "Item 3", quantity: 5 },
       { itemName: "Item 4", quantity: 3 },
       { itemName: "Item 5", quantity: 2 },
     ],
     totalAmount: 50,
   },
   {
     id: 3,
     customer: "Sam Green",
     items: [
       { itemName: "Item 6", quantity: 1 },
       { itemName: "Item 7", quantity: 4 },
       { itemName: "Item 8", quantity: 2 },
       { itemName: "Item 9", quantity: 1 },
       { itemName: "Item 10", quantity: 3 },
     ],
     totalAmount: 40,
   },
 ];



  const handleConfirm = () => {
    if(data.length!==0){
            alert("Work is under progress will be complete by tonight, Thank you!")
    }
    handleClose(); // Close modal after confirm
  };

  const handleCancel = () => {
    console.log("Cancelled");
    handleClose(); // Close modal after cancel
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Total Orders = {data.length}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
        <div
          className="table-responsive"
          style={{ maxHeight: "300px", overflowY: "auto" }}
        >
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Customer Phone</th>
                <th>Items</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.customer.name}</td>
                  <td>{order.customer.phone}</td>
                  <td style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {/* Apply scroll here */}
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.title} ({item.varient_price} x{item.quantity})
                    
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹ {order.order_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
