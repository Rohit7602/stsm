import React from "react";
import { Modal, Button } from "react-bootstrap";

export const RandomPopup = ({ showModal, handleClose, data, updateAllOrdersStatus,handleCancelOrder, matchedOrdersArray }) => {

  const handleConfirm = () => {
    updateAllOrdersStatus()
    handleClose(); // Close modal after confirm
  };

  const handleCancel = () => {
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
                <th>Action</th>
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
                  <td><span onClick={()=>handleCancelOrder(order.id)} style={{  fontWeight: "bold", color: "red",cursor:"pointer" }}>Cencel</span></td>
                </tr>
              ))}
              {matchedOrdersArray.length > 0 && (
                
                <tr>
                  <td colSpan="5" style={{  fontWeight: "bold", color: "green" }}>
                    Matched Orders
                  </td>
                </tr>
               
              )}
              {matchedOrdersArray.map((order) => (
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
