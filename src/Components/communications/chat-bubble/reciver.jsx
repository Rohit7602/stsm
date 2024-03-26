import React from 'react';

export default function reciver(props) {
  console.log(props);
  return (
    <div style={{ width: '70%' }}>
      <div className="reciver_msg">
        <p className=" black fs-sm fw-400 m-0">{props.msg.massage}</p>
      </div>
      <p className="fs-xxs fw-400 black mt-2">3 Min Ago</p>
    </div>
  );
}
