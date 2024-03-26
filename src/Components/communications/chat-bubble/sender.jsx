import React from 'react';

export default function sender(props) {
  return (
    <div style={{ width: '70%' }}>
      <div className="sender_msg">
        <p className="text-white fs-sm fw-400 m-0">{props.msg.massage}</p>
      </div>
      <p className="fs-xxs fw-400 black mt-2 text-end">3 Min Ago</p>
    </div>
  );
}
